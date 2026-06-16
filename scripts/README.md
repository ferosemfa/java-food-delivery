# Scripts — Azlaan Food Delivery

Utility scripts for setting up, configuring, and managing the food delivery platform.

---

## File Overview

| Script                  | Language   | Purpose                                              |
|-------------------------|------------|------------------------------------------------------|
| `setup.sh`              | Bash       | Full environment setup (prereqs, build, deploy)      |
| `setup.ps1`             | PowerShell | Full environment setup (Windows)                     |
| `create-topics.sh`      | Bash       | Creates Kafka topics (`kafka-topics.sh` CLI)         |
| `create-topics.ps1`     | PowerShell | Creates Kafka topics (`docker exec`)                 |
| `create-keyspace.cql`   | Cassandra  | Creates keyspace, tables, indexes                    |
| `seed-data.cql`         | Cassandra  | Inserts sample users, vendors, menus, orders         |

---

## Usage

### Quick Start (Recommended)

```bash
# Linux / macOS / WSL
bash scripts/setup.sh

# Windows (PowerShell as Administrator)
.\scripts\setup.ps1
```

These scripts handle the entire workflow: check prerequisites → clone repo → set up `.env` → build backend with Maven → build frontend with npm → `docker compose up` → run CQL migrations → create Kafka topics → print access URLs.

### Individual Steps

#### 1. Database — Create Schema

```bash
docker exec -i food-delivery-cassandra cqlsh -f /dev/stdin < scripts/create-keyspace.cql
```

#### 2. Database — Seed Data

```bash
docker exec -i food-delivery-cassandra cqlsh -f /dev/stdin < scripts/seed-data.cql
```

#### 3. Create Kafka Topics

```bash
# Using kafka-topics.sh directly
bash scripts/create-topics.sh

# Using Docker (works on all platforms)
.\scripts\create-topics.ps1    # PowerShell
```

Topics created:

| Topic            | Partitions | Replication | Purpose                    |
|------------------|------------|-------------|----------------------------|
| `new-orders`     | 3          | 1           | New order events           |
| `order-updates`  | 3          | 1           | Order status changes       |
| `notifications`  | 2          | 1           | Email/SMS/push messages    |
| `analytics`      | 2          | 1           | Aggregated metrics         |
| `payment-events` | 3          | 1           | Payment lifecycle events   |

---

## Requirements

| Script              | Requires                                   |
|---------------------|--------------------------------------------|
| `setup.sh`          | Bash 4+, docker, java, maven, node, npm    |
| `setup.ps1`         | PowerShell 5.1+, docker, java, maven, node |
| `create-topics.sh`  | `kafka-topics.sh` on PATH, or running Kafka container |
| `create-topics.ps1` | Running Kafka container (`food-delivery-kafka`) |
| `*.cql`             | Running Cassandra container (`food-delivery-cassandra`) |

---

## Environment Variables

| Variable                      | Default                | Used By               |
|-------------------------------|------------------------|-----------------------|
| `KAFKA_BOOTSTRAP_SERVER`      | `localhost:9092`       | `create-topics.sh`    |
| `CQLSH_HOST`                  | `localhost`            | Cassandra CQL scripts |
| `CQLSH_PORT`                  | `9042`                 | Cassandra CQL scripts |
