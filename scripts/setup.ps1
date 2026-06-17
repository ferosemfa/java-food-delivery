#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Azlaan Food Delivery - Setup Script (PowerShell)
.DESCRIPTION
  Checks prerequisites, builds backend/frontend, starts Docker Compose,
  runs CQL migrations, and creates Kafka topics.
#>

$ErrorActionPreference = "Stop"
$InformationPreference = "Continue"

$Global:ProjectDir = Split-Path -Parent (Split-Path -Parent $PSCommandPath)

function Write-Info    { Write-Host "[INFO]   $($args -join ' ')" -ForegroundColor Cyan }
function Write-Warn    { Write-Host "[WARN]   $($args -join ' ')" -ForegroundColor Yellow }
function Write-Error   { Write-Host "[ERROR]  $($args -join ' ')" -ForegroundColor Red }
function Write-Ok      { Write-Host "[OK]     $($args -join ' ')" -ForegroundColor Green }
function Write-Header  { Write-Host "`n=== $($args -join ' ') ===`n" -ForegroundColor Green }

# ------------------------------------------------------------------
# Prerequisites
# ------------------------------------------------------------------
Write-Header "Checking Prerequisites"

$prereqs = @(
    @{ Name = "docker";    Cmd = "docker --version";                    Url = "https://docs.docker.com/get-docker/" }
    @{ Name = "kubectl";   Cmd = "kubectl version --client -o json";    Url = "https://kubernetes.io/docs/tasks/tools/" }
    @{ Name = "java";      Cmd = "java -version 2>&1";                  Url = "https://adoptium.net/" }
    @{ Name = "mvn";       Cmd = "mvn --version 2>&1";                  Url = "https://maven.apache.org/" }
    @{ Name = "node";      Cmd = "node --version";                      Url = "https://nodejs.org/" }
    @{ Name = "npm";       Cmd = "npm --version";                       Url = "https://nodejs.org/" }
)

$missing = $false
foreach ($p in $prereqs) {
    $out = & $ExecutionContext.InvokeCommand.ExpandString($p.Cmd) 2>&1
    if ($LASTEXITCODE -eq 0 -or -not $LASTEXITCODE) {
        $ver = ($out | Select-Object -First 1).ToString().Trim()
        Write-Ok "$($p.Name) $ver"
    } else {
        Write-Warn "$($p.Name) not found. Install from $($p.Url)"
        $missing = $true
    }
}

if ($missing) {
    $ans = Read-Host "Some prerequisites are missing. Continue anyway? (y/N)"
    if ($ans -ne "y") { exit 1 }
}

# ------------------------------------------------------------------
# Environment Configuration
# ------------------------------------------------------------------
Write-Header "Environment Configuration"

$envFile = Join-Path $Global:ProjectDir ".env"
if (-not (Test-Path $envFile)) {
    $envTemplate = Join-Path $Global:ProjectDir "docker" ".env"
    if (Test-Path $envTemplate) {
        Copy-Item -Path $envTemplate -Destination $envFile
        Write-Ok "Created .env from docker/.env template"
    } else {
        Write-Warn "No .env template found; creating default .env"
        @"
SPRING_PROFILES_ACTIVE=docker

KEYDB_HOST=keydb
KEYDB_PORT=6379

CASSANDRA_HOSTS=cassandra
CASSANDRA_PORT=9042
CASSANDRA_KEYSPACE=food_delivery

KAFKA_BROKER_URL=kafka:9092

JWT_SECRET=change-this-to-a-secure-random-string
JWT_EXPIRATION=86400000

STRIPE_API_KEY=sk_test_placeholder
GOOGLE_MAPS_API_KEY=placeholder

MAIL_HOST=smtp.placeholder.com
MAIL_PORT=587
MAIL_USERNAME=placeholder@example.com
MAIL_PASSWORD=placeholder
"@ | Set-Content -Path $envFile -Encoding Ascii
        Write-Ok "Created default .env"
    }
} else {
    Write-Ok ".env already exists"
}

# ------------------------------------------------------------------
# Build Backend
# ------------------------------------------------------------------
Write-Header "Building Backend"

$pomFile = Join-Path $Global:ProjectDir "backend" "pom.xml"
if (Test-Path $pomFile) {
    Push-Location (Join-Path $Global:ProjectDir "backend")
    try {
        Write-Info "Running: mvn clean package -DskipTests ..."
        mvn clean package -DskipTests -B
        if ($LASTEXITCODE -eq 0) {
            Write-Ok "Backend JAR built successfully"
        } else {
            throw "Maven build failed"
        }
    } finally {
        Pop-Location
    }
} else {
    Write-Warn "backend/pom.xml not found; skipping Maven build"
}

# ------------------------------------------------------------------
# Build Frontend
# ------------------------------------------------------------------
Write-Header "Building Frontend"

$pkgFile = Join-Path $Global:ProjectDir "frontend" "package.json"
if (Test-Path $pkgFile) {
    Push-Location (Join-Path $Global:ProjectDir "frontend")
    try {
        Write-Info "Installing frontend dependencies ..."
        npm install --silent
        Write-Info "Building frontend ..."
        npm run build
        if ($LASTEXITCODE -eq 0) {
            Write-Ok "Frontend built successfully"
        } else {
            throw "Frontend build failed"
        }
    } finally {
        Pop-Location
    }
} else {
    Write-Warn "frontend/package.json not found; skipping npm build"
}

# ------------------------------------------------------------------
# Start Docker Compose
# ------------------------------------------------------------------
Write-Header "Starting Docker Compose"

Push-Location $Global:ProjectDir
try {
    Write-Info "Bringing up services ..."
    docker compose up -d --build
    Write-Ok "Docker Compose services started"
} finally {
    Pop-Location
}

Write-Info "Waiting for Cassandra to be healthy ..."
$cassandraReady = $false
for ($i = 1; $i -le 60; $i++) {
    $result = docker exec food-delivery-cassandra cqlsh -e "describe cluster" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Ok "Cassandra is ready"
        $cassandraReady = $true
        break
    }
    Start-Sleep -Seconds 5
}
if (-not $cassandraReady) { throw "Cassandra did not become ready in time" }

Write-Info "Waiting for Kafka to be ready ..."
$kafkaReady = $false
for ($i = 1; $i -le 30; $i++) {
    $result = docker exec food-delivery-kafka kafka-topics --bootstrap-server localhost:9092 --list 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Ok "Kafka is ready"
        $kafkaReady = $true
        break
    }
    Start-Sleep -Seconds 5
}
if (-not $kafkaReady) { throw "Kafka did not become ready in time" }

# ------------------------------------------------------------------
# Database Migrations
# ------------------------------------------------------------------
Write-Header "Running Database Migrations"

$cqlFiles = @("create-keyspace.cql", "seed-data.cql")
foreach ($cql in $cqlFiles) {
    $cqlPath = Join-Path $Global:ProjectDir "scripts" $cql
    if (Test-Path $cqlPath) {
        Write-Info "Executing $cql ..."
        $content = Get-Content -Path $cqlPath -Raw
        $tempFile = [System.IO.Path]::GetTempFileName() + ".cql"
        Set-Content -Path $tempFile -Value $content -Encoding Ascii
        docker exec -i food-delivery-cassandra cqlsh -f "/dev/stdin" < $tempFile 2>&1
        Remove-Item -Path $tempFile -Force
        Write-Ok "$cql applied"
    } else {
        Write-Warn "$cql not found; skipping"
    }
}

# ------------------------------------------------------------------
# Kafka Topics
# ------------------------------------------------------------------
Write-Header "Creating Kafka Topics"

$topicScript = Join-Path $Global:ProjectDir "scripts" "create-topics.ps1"
if (Test-Path $topicScript) {
    & $topicScript
    Write-Ok "Kafka topics created"
} else {
    $topicScriptSh = Join-Path $Global:ProjectDir "scripts" "create-topics.sh"
    if (Test-Path $topicScriptSh) {
        & $topicScriptSh
        Write-Ok "Kafka topics created (via bash)"
    } else {
        Write-Warn "create-topics script not found; skipping"
    }
}

# ------------------------------------------------------------------
# Success
# ------------------------------------------------------------------
Write-Header "Setup Complete"

Write-Host @"

  Azlaan Food Delivery is up and running!

  Frontend:  http://localhost:3000
  Backend:   http://localhost:8080
  Swagger:   http://localhost:8080/swagger-ui.html
  Kafdrop:   http://localhost:9000

  Default credentials:
    Admin:    admin@fooddelivery.com / admin123
    Vendor:   vendor@fooddelivery.com / vendor123
    Customer: customer@fooddelivery.com / customer123

"@ -ForegroundColor Green

docker compose ps
