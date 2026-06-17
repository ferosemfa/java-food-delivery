#!/usr/bin/env bash
set -euo pipefail

BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

info()  { echo -e "${CYAN}[INFO]${NC}  $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*"; }
ok()    { echo -e "${GREEN}[OK]${NC}    $*"; }
header(){ echo -e "\n${BOLD}${GREEN}=== $* ===${NC}\n"; }

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

header "Azlaan Food Delivery - Setup"

# ------------------------------------------------------------------
# Prerequisites
# ------------------------------------------------------------------
header "Checking Prerequisites"

command -v docker >/dev/null 2>&1 || { error "Docker not found. Install from https://docs.docker.com/get-docker/"; exit 1; }
ok "docker $(docker --version | awk '{print $3}' | tr -d ',')"

command -v kubectl >/dev/null 2>&1 && ok "kubectl $(kubectl version --client --short 2>/dev/null || kubectl version --client 2>/dev/null)" || warn "kubectl not found (optional for K8s deploy)"

command -v java >/dev/null 2>&1 || { error "Java not found. Install JDK 17+. https://adoptium.net/"; exit 1; }
JAVA_VER=$(java -version 2>&1 | head -1 | awk -F '"' '{print $2}')
ok "java $JAVA_VER"

command -v mvn >/dev/null 2>&1 || { error "Maven not found. Install from https://maven.apache.org/"; exit 1; }
ok "mvn $(mvn --version 2>&1 | head -1 | awk '{print $3}')"

command -v node >/dev/null 2>&1 || { error "Node.js not found. Install Node 20+. https://nodejs.org/"; exit 1; }
ok "node $(node --version)"

command -v npm >/dev/null 2>&1 || { error "npm not found."; exit 1; }
ok "npm $(npm --version)"

# ------------------------------------------------------------------
# Clone repository (skip if already in the repo)
# ------------------------------------------------------------------
header "Repository Setup"

if [ -f "docker-compose.yml" ]; then
    info "Already inside the project directory."
else
    REPO_URL="${REPO_URL:-git@github.com:azlaan/food-delivery.git}"
    if [ ! -d "java-food-delivery" ]; then
        info "Cloning repository from $REPO_URL ..."
        git clone "$REPO_URL"
        cd java-food-delivery
        PROJECT_DIR="$(pwd)"
    else
        info "Repository already exists."
    fi
fi

# ------------------------------------------------------------------
# Environment file
# ------------------------------------------------------------------
header "Environment Configuration"

if [ ! -f ".env" ]; then
    if [ -f "docker/.env" ]; then
        cp docker/.env .env
        ok "Created .env from docker/.env template"
    else
        warn "No .env template found at docker/.env; creating default .env"
        cat > .env <<-ENVEOF
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
ENVEOF
        ok "Created default .env"
    fi
else
    ok ".env already exists"
fi

# ------------------------------------------------------------------
# Build Backend (Maven)
# ------------------------------------------------------------------
header "Building Backend"

if [ -f "backend/pom.xml" ]; then
    cd backend
    info "Running: mvn clean package -DskipTests ..."
    mvn clean package -DskipTests -B
    cd "$PROJECT_DIR"
    ok "Backend JAR built successfully"
else
    warn "backend/pom.xml not found; skipping Maven build"
fi

# ------------------------------------------------------------------
# Build Frontend (npm)
# ------------------------------------------------------------------
header "Building Frontend"

if [ -f "frontend/package.json" ]; then
    cd frontend
    info "Installing frontend dependencies ..."
    npm install --silent
    info "Building frontend ..."
    npm run build
    cd "$PROJECT_DIR"
    ok "Frontend built successfully"
else
    warn "frontend/package.json not found; skipping npm build"
fi

# ------------------------------------------------------------------
# Start Docker Compose
# ------------------------------------------------------------------
header "Starting Docker Compose"

info "Bringing up services (zookeeper, kafka, keydb, cassandra, backend, frontend) ..."
docker compose up -d --build
ok "Docker Compose services started"

info "Waiting for Cassandra to be healthy ..."
CASSANDRA_CONTAINER="food-delivery-cassandra"
for i in $(seq 1 60); do
    if docker exec "$CASSANDRA_CONTAINER" cqlsh -e "describe cluster" >/dev/null 2>&1; then
        ok "Cassandra is ready"
        break
    fi
    if [ "$i" -eq 60 ]; then
        error "Cassandra did not become ready in time"
        exit 1
    fi
    sleep 5
done

info "Waiting for Kafka to be ready ..."
KAFKA_CONTAINER="food-delivery-kafka"
for i in $(seq 1 30); do
    if docker exec "$KAFKA_CONTAINER" kafka-topics --bootstrap-server localhost:9092 --list >/dev/null 2>&1; then
        ok "Kafka is ready"
        break
    fi
    if [ "$i" -eq 30 ]; then
        error "Kafka did not become ready in time"
        exit 1
    fi
    sleep 5
done

# ------------------------------------------------------------------
# Run Database Migrations (Cassandra CQL)
# ------------------------------------------------------------------
header "Running Database Migrations"

CQL_DIR="$PROJECT_DIR/scripts"
for cql_file in create-keyspace.cql seed-data.cql; do
    cql_path="$CQL_DIR/$cql_file"
    if [ -f "$cql_path" ]; then
        info "Executing $cql_file ..."
        docker exec -i "$CASSANDRA_CONTAINER" cqlsh -f "/dev/stdin" < "$cql_path"
        ok "$cql_file applied"
    else
        warn "$cql_file not found at $cql_path; skipping"
    fi
done

# ------------------------------------------------------------------
# Create Kafka Topics
# ------------------------------------------------------------------
header "Creating Kafka Topics"

if [ -f "$CQL_DIR/create-topics.sh" ]; then
    bash "$CQL_DIR/create-topics.sh"
    ok "Kafka topics created"
else
    warn "create-topics.sh not found; skipping topic creation"
fi

# ------------------------------------------------------------------
# Success
# ------------------------------------------------------------------
header "Setup Complete"

echo -e "${GREEN}${BOLD}"
echo "  Azlaan Food Delivery is up and running!"
echo ""
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:8080"
echo "  Swagger:   http://localhost:8080/swagger-ui.html"
echo "  Kafdrop:   http://localhost:9000"
echo ""
echo "  Default credentials:"
echo "    Admin:    admin@fooddelivery.com / admin123"
echo "    Vendor:   vendor@fooddelivery.com / vendor123"
echo "    Customer: customer@fooddelivery.com / customer123"
echo ""
echo -e "${NC}"

docker compose ps
