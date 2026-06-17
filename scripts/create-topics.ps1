#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Creates Kafka topics for the food delivery platform using docker exec.
.DESCRIPTION
  Uses the food-delivery-kafka container to create topics:
    new-orders, order-updates, notifications, analytics, payment-events
#>

$ErrorActionPreference = "Stop"

$BootstrapServer = "localhost:9092"
$KafkaContainer = "food-delivery-kafka"

function Write-Info  { Write-Host "[INFO]   $($args -join ' ')" -ForegroundColor Cyan }
function Write-Ok    { Write-Host "[OK]     $($args -join ' ')" -ForegroundColor Green }
function Write-Error { Write-Host "[ERROR]  $($args -join ' ')" -ForegroundColor Red }

$topics = @(
    @{ Name = "new-orders";     Partitions = 3; Replication = 1 }
    @{ Name = "order-updates";  Partitions = 3; Replication = 1 }
    @{ Name = "notifications";  Partitions = 2; Replication = 1 }
    @{ Name = "analytics";      Partitions = 2; Replication = 1 }
    @{ Name = "payment-events"; Partitions = 3; Replication = 1 }
)

# Verify container is running
$running = docker ps --filter "name=$KafkaContainer" --format "{{.Names}}" 2>$null
if (-not $running) {
    Write-Error "Kafka container '$KafkaContainer' is not running."
    Write-Error "Start Docker Compose first, then run this script."
    exit 1
}

# Get list of existing topics
$existing = docker exec $KafkaContainer kafka-topics --bootstrap-server $BootstrapServer --list 2>$null
Write-Info "Existing topics: $($existing -join ', ')"

foreach ($t in $topics) {
    if ($existing -contains $t.Name) {
        Write-Info "Topic '$($t.Name)' already exists; skipping"
        continue
    }

    Write-Info "Creating topic '$($t.Name)' (partitions=$($t.Partitions), replication-factor=$($t.Replication)) ..."
    docker exec $KafkaContainer kafka-topics --bootstrap-server $BootstrapServer `
        --create `
        --topic $t.Name `
        --partitions $t.Partitions `
        --replication-factor $t.Replication `
        --if-not-exists

    if ($LASTEXITCODE -eq 0) {
        Write-Ok "Topic '$($t.Name)' created"
    } else {
        Write-Error "Failed to create topic '$($t.Name)'"
    }
}

Write-Info "`nAll topics on $BootstrapServer`:"
docker exec $KafkaContainer kafka-topics --bootstrap-server $BootstrapServer --list
