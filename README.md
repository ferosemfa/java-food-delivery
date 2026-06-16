# Azlaan Food Delivery

A full-stack, multi-vendor food delivery platform built with **Java Spring Boot**, **React**, **Cassandra**, **Kafka**, and **KeyDB**. Features three dashboards (customer, vendor, admin), real-time order tracking, payment processing, and a microservices-oriented architecture running on Docker/Kubernetes.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             Client Layer                                     │
│  ┌───────────────────┐  ┌───────────────────┐  ┌─────────────────────────┐ │
│  │  Customer Web App  │  │  Vendor Dashboard  │  │  Admin Dashboard        │ │
│  │  (React + Tailwind)│  │  (React + Tailwind)│  │  (React + Tailwind)     │ │
│  └────────┬──────────┘  └────────┬──────────┘  └──────────┬──────────────┘ │
└───────────┼───────────────────────┼─────────────────────────┼───────────────┘
            │                       │                         │
            └───────────┬───────────┴─────────────┬───────────┘
                        │        HTTP/HTTPS        │
                        ▼                          ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                         API Gateway (Nginx)                               │
│                   http://localhost:3000 → http://backend:8080              │
└────────────────────────────────┬──────────────────────────────────────────┘
                                 │
                                 ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                       Backend (Spring Boot 3.2)                           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌────┐ │
│  │ Auth │ │Vendor│ │ Menu │ │Orders│ │Payment│ │Deliv.│ │ Admin│ │ ...│ │
│  └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬──┘ │
└──────┼────────┼────────┼────────┼─────────┼────────┼────────┼────────┼────┘
       │        │        │        │         │        │        │        │
       ▼        ▼        ▼        ▼         ▼        ▼        ▼        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                            Data Layer                                     │
│  ┌────────────┐  ┌────────────────┐  ┌──────────────────────────────────┐ │
│  │   KeyDB    │  │   Cassandra    │  │         Kafka                     │ │
│  │  (Cache)   │  │  (Database)    │  │  ┌──────────┐  ┌──────────────┐ │ │
│  │           │  │               │  │  │ new-orders│  │ order-updates│ │ │
│  │ • Sessions │  │ • users       │  │  ├──────────┤  ├──────────────┤ │ │
│  │ • Tracking │  │ • vendors     │  │  │notificat.│  │ analytics    │ │ │
│  │ • Rate Lim.│  │ • orders      │  │  ├──────────┤  ├──────────────┤ │ │
│  │ • GeoCache │  │ • payments    │  │  │payment-ev│  │              │ │ │
│  └────────────┘  │ • deliveries  │  │  └──────────┘  └──────────────┘ │ │
│                  │ • menus       │  └──────────────────────────────────┘ │
│                  │ • reviews     │                                       │
│                  └────────────────┘                                       │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer          | Technology                                  | Version |
|----------------|---------------------------------------------|---------|
| Backend        | Java Spring Boot                            | 3.2.0   |
| Backend Lang   | Java                                        | 17      |
| Build Tool     | Apache Maven                                | 3.9+    |
| Frontend       | React                                       | 18      |
| UI Framework   | Tailwind CSS                                | 3.3     |
| Frontend Build | Vite                                        | 5       |
| Database       | Apache Cassandra                            | 5       |
| Cache          | KeyDB                                       | latest  |
| Message Queue  | Apache Kafka (Confluent)                    | latest  |
| Kafka UI       | Kafdrop                                     | latest  |
| Auth           | JWT + OAuth2                                | —       |
| API Docs       | Springdoc OpenAPI (Swagger UI)              | 2.3     |
| Container      | Docker + Docker Compose                     | 3.8     |
| Orchestration  | Kubernetes                                  | —       |
| Package Mgr    | Helm                                        | 3       |
| Payment        | Stripe (mock)                               | —       |

---

## Project Structure

```
java-food-delivery/
├── backend/                          # Spring Boot application
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/fooddelivery/
│           │   ├── config/
│           │   ├── controller/
│           │   ├── dto/
│           │   ├── kafka/
│           │   ├── model/
│           │   ├── repository/
│           │   ├── security/
│           │   └── service/
│           └── resources/
│               ├── application.yml
│               └── application-docker.yml
├── frontend/                         # React + Vite application
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── services/
│       └── utils/
├── docker/                           # Docker configuration
│   ├── .env                          # Environment variable template
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── nginx.conf
├── k8s/                              # Kubernetes manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── cassandra-statefulset.yaml
│   ├── cassandra-service.yaml
│   ├── kafka-statefulset.yaml
│   ├── kafka-service.yaml
│   ├── keydb-deployment.yaml
│   ├── keydb-service.yaml
│   ├── zookeeper-deployment.yaml
│   ├── zookeeper-service.yaml
│   ├── hpa.yaml
│   ├── ingress.yaml
│   └── kustomization.yaml
├── helm/                            # Helm chart
│   └── food-delivery/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
├── scripts/                          # Utility scripts
│   ├── setup.sh
│   ├── setup.ps1
│   ├── create-topics.sh
│   ├── create-topics.ps1
│   ├── create-keyspace.cql
│   ├── seed-data.cql
│   └── README.md
├── docker-compose.yml                # Local development orchestration
├── README.md
└── API_DOCS.md
```

---

## Prerequisites

| Tool       | Version  | Purpose                    |
|------------|----------|----------------------------|
| Java       | 17+      | Run Spring Boot backend    |
| Node.js    | 20+      | Build React frontend       |
| npm        | 9+       | Frontend package manager   |
| Maven      | 3.9+     | Backend build tool         |
| Docker     | 24+      | Container runtime          |
| Docker Compose | 2.20+ | Local service orchestration |
| kubectl*   | 1.28+    | Kubernetes CLI (deploy)    |
| Helm*      | 3+       | Kubernetes package manager |

*\* Optional — only needed for K8s deployment.*

---

## Quick Start (Docker Compose)

```bash
# Clone the repository
git clone git@github.com:azlaan/food-delivery.git
cd java-food-delivery

# Start everything with one command
docker compose up -d --build

# Wait for all services to be healthy
# Access the application:
#   Frontend:   http://localhost:3000
#   Backend:    http://localhost:8080
#   Swagger UI: http://localhost:8080/swagger-ui.html
#   Kafdrop:    http://localhost:9000
```

> **Note:** The first build may take 5-10 minutes depending on your internet connection and machine.

---

## Step-by-Step Local Development Setup

### 1. Environment Configuration

```bash
cp docker/.env .env
# Edit .env with your own values (JWT_SECRET, API keys, etc.)
```

Key environment variables:

| Variable                  | Default               | Description                           |
|---------------------------|-----------------------|---------------------------------------|
| `SPRING_PROFILES_ACTIVE`  | docker                | Spring profile                        |
| `KEYDB_HOST`              | keydb                 | KeyDB hostname                        |
| `CASSANDRA_HOSTS`         | cassandra             | Cassandra contact points              |
| `CASSANDRA_KEYSPACE`      | food_delivery         | Cassandra keyspace name               |
| `KAFKA_BROKER_URL`        | kafka:9092            | Kafka broker address                  |
| `JWT_SECRET`              | —                     | 256-bit secret for JWT signing        |
| `JWT_EXPIRATION`          | 86400000              | JWT validity in ms (24h)              |
| `STRIPE_API_KEY`          | sk_test_...           | Stripe secret key (test mode)         |
| `GOOGLE_MAPS_API_KEY`     | placeholder           | Google Maps API key                   |
| `MAIL_HOST`               | smtp.placeholder.com  | SMTP server for email notifications   |

### 2. Build and Run Locally (without Docker)

```bash
# Terminal 1: Start infrastructure services
docker compose up -d zookeeper kafka keydb cassandra

# Terminal 2: Build and run the backend
cd backend
mvn clean package -DskipTests
java -jar target/food-delivery-1.0.0.jar

# Terminal 3: Build and run the frontend
cd frontend
npm install
npm run dev
```

### 3. Using the Setup Scripts

```bash
# Linux / macOS / WSL
bash scripts/setup.sh

# Windows (PowerShell)
.\scripts\setup.ps1
```

### 4. Run Database Migrations Manually

```bash
docker exec -i food-delivery-cassandra cqlsh -f /dev/stdin < scripts/create-keyspace.cql
docker exec -i food-delivery-cassandra cqlsh -f /dev/stdin < scripts/seed-data.cql
```

### 5. Create Kafka Topics Manually

```bash
# Via shell script (requires kafka-topics.sh on PATH)
bash scripts/create-topics.sh

# Via docker exec (works on any platform)
docker exec food-delivery-kafka kafka-topics --bootstrap-server localhost:9092 \
    --create --topic new-orders --partitions 3 --replication-factor 1 --if-not-exists
docker exec food-delivery-kafka kafka-topics --bootstrap-server localhost:9092 \
    --create --topic order-updates --partitions 3 --replication-factor 1 --if-not-exists
docker exec food-delivery-kafka kafka-topics --bootstrap-server localhost:9092 \
    --create --topic notifications --partitions 2 --replication-factor 1 --if-not-exists
docker exec food-delivery-kafka kafka-topics --bootstrap-server localhost:9092 \
    --create --topic analytics --partitions 2 --replication-factor 1 --if-not-exists
docker exec food-delivery-kafka kafka-topics --bootstrap-server localhost:9092 \
    --create --topic payment-events --partitions 3 --replication-factor 1 --if-not-exists
```

---

## API Documentation

Interactive API documentation is available at **http://localhost:8080/swagger-ui.html** when the backend is running.

See [`API_DOCS.md`](API_DOCS.md) for the complete endpoint reference.

### Quick API Reference

| Module    | Method | Endpoint                        | Auth Required |
|-----------|--------|---------------------------------|---------------|
| Auth      | POST   | `/api/auth/register`            | No            |
| Auth      | POST   | `/api/auth/login`               | No            |
| Vendors   | GET    | `/api/vendors`                  | No            |
| Vendors   | GET    | `/api/vendors/{id}`             | No            |
| Menu      | GET    | `/api/vendors/{id}/menu`        | No            |
| Orders    | POST   | `/api/orders`                   | Customer      |
| Orders    | GET    | `/api/orders`                   | Customer/Vendor/Admin |
| Orders    | GET    | `/api/orders/{id}/track`        | Customer/Vendor |
| Payments  | POST   | `/api/payments`                 | Customer      |
| Admin     | GET    | `/api/admin/stats`              | Admin         |
| Reviews   | POST   | `/api/reviews`                  | Customer      |

---

## Database Setup

### Cassandra Schema

The database uses a single keyspace `food_delivery` with the following tables:

| Table         | Primary Key                  | Purpose                     |
|---------------|------------------------------|-----------------------------|
| `users`       | `user_id`                    | User accounts               |
| `vendors`     | `vendor_id`                  | Vendor profiles             |
| `orders`      | `(order_id, created_at)`     | Order records (time-series) |
| `order_items` | `(item_id, order_id)`        | Individual order line items |
| `payments`    | `(payment_id, timestamp)`    | Payment transactions        |
| `deliveries`  | `(delivery_id, order_id)`    | Delivery tracking           |
| `menus`       | `(menu_id, vendor_id)`       | Menu items per vendor       |
| `reviews`     | `(review_id, vendor_id)`     | Customer reviews            |

A custom type `order_item` is used to embed line items directly in the `orders` table.

### Migration Script

```bash
docker exec -i food-delivery-cassandra cqlsh -f /dev/stdin < scripts/create-keyspace.cql
docker exec -i food-delivery-cassandra cqlsh -f /dev/stdin < scripts/seed-data.cql
```

---

## Kafka Topics

| Topic             | Partitions | Replication | Producers                  | Consumers                              |
|-------------------|------------|-------------|----------------------------|----------------------------------------|
| `new-orders`      | 3          | 1           | Order Service              | Vendor Service, Notification Service   |
| `order-updates`   | 3          | 1           | Vendor Service             | Customer Dashboard, Tracking Service   |
| `notifications`   | 2          | 1           | Notification Service       | Email/SMS/Push handlers                |
| `analytics`       | 2          | 1           | Order Service, Payment Svc | Analytics Aggregator                   |
| `payment-events`  | 3          | 1           | Payment Service            | Order Service, Notification Service    |

---

## Deployment to Kubernetes

### Using kubectl (Kustomize)

```bash
kubectl apply -k k8s/
```

This applies all manifests in the correct order (namespace → config → secrets → storage → apps → networking).

### Using Helm

```bash
# Install the chart
helm install food-delivery helm/food-delivery/ --namespace food-delivery --create-namespace

# Upgrade after changes
helm upgrade food-delivery helm/food-delivery/

# Uninstall
helm uninstall food-delivery --namespace food-delivery
```

### Customize Helm Values

Edit `helm/food-delivery/values.yaml` to configure:

| Parameter          | Default               | Description                      |
|--------------------|-----------------------|----------------------------------|
| `replicaCount`     | 2                     | Backend pod replicas              |
| `ingress.host`     | food-delivery.example.com | Ingress hostname             |
| `config.*`         | —                     | Application configuration        |
| `secrets.*`        | —                     | Base64-encoded secrets           |
| `resources.*`      | —                     | CPU/memory requests and limits   |
| `persistence.*`    | —                     | Persistent volume sizes          |
| `hpa.enabled`      | true                  | Horizontal Pod Autoscaler        |

### Port Forwarding (Development)

```bash
# Access frontend
kubectl port-forward -n food-delivery service/frontend-service 3000:80

# Access backend API
kubectl port-forward -n food-delivery service/backend-service 8080:8080

# Access Kafdrop
kubectl port-forward -n food-delivery service/kafka-service 9000:9000
```

---

## CI/CD Pipeline Suggestions

### GitHub Actions (`.github/workflows/ci.yml`)

```yaml
name: CI/CD
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with: { java-version: '17', distribution: 'temurin' }
      - name: Build Backend
        run: mvn clean package -DskipTests -f backend/pom.xml
      - name: Set up Node
        uses: actions/setup-node@v4
        with: { node-version: 20 }
      - name: Build Frontend
        run: |
          npm ci --prefix frontend
          npm run build --prefix frontend
      - name: Docker Build & Push
        run: |
          docker build -t backend -f docker/Dockerfile.backend .
          docker build -t frontend -f docker/Dockerfile.frontend .
      - name: Deploy to K8s
        run: kubectl apply -k k8s/
```

### Suggested Pipeline Stages

1. **Lint** — Checkstyle, ESLint
2. **Test** — `mvn test`, `npm test`
3. **Build** — Package JAR, build static assets
4. **Docker** — Build and push images to registry (Docker Hub / ECR / GCR)
5. **Deploy** — `kubectl set image` rolling update or `helm upgrade`
6. **Smoke Test** — Health check endpoints, Kafka topic verification

---

## Troubleshooting

### Cassandra won't start

```bash
# Check logs
docker logs food-delivery-cassandra

# Verify connectivity
docker exec food-delivery-cassandra cqlsh -e "describe cluster"

# Increase startup period in docker-compose.yml healthcheck
```

### Kafka connection refused

```bash
# Ensure Zookeeper is running first
docker compose logs zookeeper

# List topics to verify
docker exec food-delivery-kafka kafka-topics --bootstrap-server localhost:9092 --list
```

### Backend fails to start

```bash
# Check if Cassandra, KeyDB, and Kafka are healthy
docker compose ps

# View backend logs
docker logs food-delivery-backend

# Common fix: rebuild and restart
docker compose stop backend
docker compose rm backend
docker compose up -d --build backend
```

### Frontend shows blank page

```bash
# Check if backend is reachable from the frontend container
docker exec food-delivery-frontend curl -s http://backend:8080/actuator/health

# Verify nginx config
docker exec food-delivery-frontend nginx -t
```

### Reset Everything

```bash
docker compose down -v             # Stops and removes volumes
docker compose up -d --build       # Fresh start
docker exec -i food-delivery-cassandra cqlsh -f /dev/stdin < scripts/create-keyspace.cql
docker exec -i food-delivery-cassandra cqlsh -f /dev/stdin < scripts/seed-data.cql
```

---

## Default Credentials (Seed Data)

| Role     | Email                      | Password    |
|----------|----------------------------|-------------|
| Admin    | admin@fooddelivery.com     | admin123    |
| Vendor   | vendor@fooddelivery.com    | vendor123   |
| Customer | customer@fooddelivery.com  | customer123 |

---

## License

MIT License — see [LICENSE](LICENSE) for details.
