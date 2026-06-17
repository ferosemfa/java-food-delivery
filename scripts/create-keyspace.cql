-- =============================================================================
-- Azlaan Food Delivery - Cassandra Schema
-- Creates the keyspace and all tables for the food delivery platform.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Custom type for order items (embedded in orders table)
-- ---------------------------------------------------------------------------
CREATE TYPE IF NOT EXISTS order_item (
    item_id     UUID,
    food_item_id UUID,
    name        text,
    quantity    int,
    price       double
);

-- ---------------------------------------------------------------------------
-- Keyspace
-- ---------------------------------------------------------------------------
CREATE KEYSPACE IF NOT EXISTS food_delivery
WITH replication = {
    'class': 'SimpleStrategy',
    'replication_factor': 3
};

USE food_delivery;

-- ---------------------------------------------------------------------------
-- Users table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id      UUID PRIMARY KEY,
    name         text,
    email        text,
    phone        text,
    password_hash text,
    location     text,
    role         text,   -- 'customer', 'vendor', 'admin', 'driver'
    created_at   timestamp
);

-- ---------------------------------------------------------------------------
-- Vendors table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vendors (
    vendor_id    UUID PRIMARY KEY,
    name         text,
    email        text,
    phone        text,
    password_hash text,
    address      text,
    rating       double,
    menu_items   list<text>,
    is_approved  boolean,
    created_at   timestamp
);

-- ---------------------------------------------------------------------------
-- Orders table (with clustering key on created_at for time-range queries)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    order_id         UUID,
    customer_id      UUID,
    vendor_id        UUID,
    items            list<frozen<order_item>>,
    total_amount     double,
    status           text,   -- 'pending', 'received', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'
    delivery_address text,
    delivery_latitude  double,
    delivery_longitude double,
    created_at       timestamp,
    updated_at       timestamp,
    PRIMARY KEY (order_id, created_at)
) WITH CLUSTERING ORDER BY (created_at DESC);

-- ---------------------------------------------------------------------------
-- Order Items table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    item_id      UUID,
    order_id     UUID,
    food_item_id UUID,
    quantity     int,
    price        double,
    PRIMARY KEY (item_id, order_id)
);

-- ---------------------------------------------------------------------------
-- Payments table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    payment_id     UUID,
    order_id       UUID,
    method         text,   -- 'credit_card', 'upi', 'wallet', 'cash'
    status         text,   -- 'pending', 'completed', 'failed', 'refunded'
    transaction_id text,
    amount         double,
    timestamp      timestamp,
    PRIMARY KEY (payment_id, timestamp)
) WITH CLUSTERING ORDER BY (timestamp DESC);

-- ---------------------------------------------------------------------------
-- Deliveries table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS deliveries (
    delivery_id     UUID,
    order_id        UUID,
    driver_id       UUID,
    status          text,   -- 'assigned', 'picked_up', 'in_transit', 'delivered'
    current_location text,
    estimated_time  text,
    PRIMARY KEY (delivery_id, order_id)
);

-- ---------------------------------------------------------------------------
-- Menus table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS menus (
    menu_id      UUID,
    vendor_id    UUID,
    item_name    text,
    description  text,
    price        double,
    category     text,
    image_url    text,
    is_available boolean,
    PRIMARY KEY (menu_id, vendor_id)
);

-- ---------------------------------------------------------------------------
-- Reviews table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
    review_id  UUID,
    user_id    UUID,
    vendor_id  UUID,
    order_id   UUID,
    rating     int,
    comment    text,
    timestamp  timestamp,
    PRIMARY KEY (review_id, vendor_id)
);

-- ---------------------------------------------------------------------------
-- Secondary indexes (for common query patterns)
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_email       ON food_delivery.users (email);
CREATE INDEX IF NOT EXISTS idx_users_role        ON food_delivery.users (role);
CREATE INDEX IF NOT EXISTS idx_orders_status     ON food_delivery.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_customer   ON food_delivery.orders (customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_vendor     ON food_delivery.orders (vendor_id);
CREATE INDEX IF NOT EXISTS idx_payments_order    ON food_delivery.payments (order_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_order  ON food_delivery.deliveries (order_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_driver ON food_delivery.deliveries (driver_id);
CREATE INDEX IF NOT EXISTS idx_menus_vendor      ON food_delivery.menus (vendor_id);
CREATE INDEX IF NOT EXISTS idx_reviews_vendor    ON food_delivery.reviews (vendor_id);
