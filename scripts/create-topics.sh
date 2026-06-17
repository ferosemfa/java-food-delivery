#!/usr/bin/env bash
set -euo pipefail

BOLD='\033[1m'
GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

info() { echo -e "${CYAN}[INFO]${NC}  $*"; }
ok()   { echo -e "${GREEN}[OK]${NC}    $*"; }
error(){ echo -e "${RED}[ERROR]${NC} $*"; }

BOOTSTRAP_SERVER="${KAFKA_BOOTSTRAP_SERVER:-localhost:9092}"
TOPICS_DIR="$(cd "$(dirname "$0")" && pwd)"
KAFKA_CMD="kafka-topics.sh"

if ! command -v "$KAFKA_CMD" &>/dev/null; then
    if docker ps --format '{{.Names}}' | grep -q 'food-delivery-kafka'; then
        info "kafka-topics.sh not on PATH; using docker exec"
        KAFKA_CMD="docker exec food-delivery-kafka kafka-topics --bootstrap-server localhost:9092"
    else
        error "kafka-topics.sh not found and Kafka container is not running."
        error "Start Docker Compose first, then run this script."
        exit 1
    fi
else
    KAFKA_CMD="kafka-topics.sh --bootstrap-server $BOOTSTRAP_SERVER"
fi

info "Using: $KAFKA_CMD"

declare -A TOPICS
TOPICS["new-orders"]="3:1"
TOPICS["order-updates"]="3:1"
TOPICS["notifications"]="2:1"
TOPICS["analytics"]="2:1"
TOPICS["payment-events"]="3:1"

for topic in "${!TOPICS[@]}"; do
    IFS=':' read -r partitions replication <<< "${TOPICS[$topic]}"

    if $KAFKA_CMD --list 2>/dev/null | grep -q "^${topic}$"; then
        info "Topic '$topic' already exists; skipping"
        continue
    fi

    info "Creating topic '$topic' (partitions=$partitions, replication-factor=$replication) ..."

    if [[ "$KAFKA_CMD" == docker* ]]; then
        docker exec food-delivery-kafka kafka-topics --bootstrap-server localhost:9092 \
            --create \
            --topic "$topic" \
            --partitions "$partitions" \
            --replication-factor "$replication" \
            --if-not-exists
    else
        $KAFKA_CMD \
            --create \
            --topic "$topic" \
            --partitions "$partitions" \
            --replication-factor "$replication" \
            --if-not-exists
    fi

    ok "Topic '$topic' created"
done

echo ""
echo "Topics on $BOOTSTRAP_SERVER:"
if [[ "$KAFKA_CMD" == docker* ]]; then
    docker exec food-delivery-kafka kafka-topics --bootstrap-server localhost:9092 --list
else
    $KAFKA_CMD --list
fi
