-- =============================================================================
-- Azlaan Food Delivery - Seed Data
-- Inserts sample users, vendors, menu items, orders, and payments.
-- =============================================================================

USE food_delivery;

-- ---------------------------------------------------------------------------
-- Sample Users
-- ---------------------------------------------------------------------------
INSERT INTO users (user_id, name, email, phone, password_hash, location, role, created_at)
VALUES (
    uuid(), 'John Doe', 'customer@fooddelivery.com', '+1-555-0101',
    '$2b$12$Ks7jZ0zTdLpALsHTn8FyVuct.eZesZOv.si23nz1AoIrbUNsrz1Qy', '123 Main St, New York, NY',
    'customer', toTimestamp(now())
);

INSERT INTO users (user_id, name, email, phone, password_hash, location, role, created_at)
VALUES (
    uuid(), 'Pizza Place', 'vendor@fooddelivery.com', '+1-555-0201',
    '$2b$12$b2ZTUMpQsHYCFVcQxsXf7OYME6QkM4uM.V3D/1atF/Z/sZy9bBxGq', '456 Oak Ave, New York, NY',
    'vendor', toTimestamp(now())
);

INSERT INTO users (user_id, name, email, phone, password_hash, location, role, created_at)
VALUES (
    uuid(), 'Admin User', 'admin@fooddelivery.com', '+1-555-0001',
    '$2b$12$DeFrX0si/8x9s0gUymVwd.sMNWpWznwPSyONlnEc/dfUeVVq8Uux6', '100 Admin Plaza, New York, NY',
    'admin', toTimestamp(now())
);

-- ---------------------------------------------------------------------------
-- Sample Vendors
-- ---------------------------------------------------------------------------
INSERT INTO vendors (vendor_id, name, email, phone, password_hash, address, rating, menu_items, is_approved, created_at)
VALUES (
    uuid(), 'Pizza Paradise', 'contact@pizzaparadise.com', '+1-555-1001',
    '$2b$12$b2ZTUMpQsHYCFVcQxsXf7OYME6QkM4uM.V3D/1atF/Z/sZy9bBxGq', '789 Pizza St, New York, NY', 4.5,
    ['Margherita Pizza', 'Pepperoni Pizza', 'BBQ Chicken Pizza', 'Veggie Supreme', 'Garlic Bread'],
    true, toTimestamp(now())
);

INSERT INTO vendors (vendor_id, name, email, phone, password_hash, address, rating, menu_items, is_approved, created_at)
VALUES (
    uuid(), 'Burger Barn', 'contact@burgerbarn.com', '+1-555-1002',
    '$2b$12$b2ZTUMpQsHYCFVcQxsXf7OYME6QkM4uM.V3D/1atF/Z/sZy9bBxGq', '321 Burger Ln, New York, NY', 4.2,
    ['Classic Burger', 'Cheeseburger', 'Bacon Deluxe', 'Chicken Sandwich', 'Veggie Burger'],
    true, toTimestamp(now())
);

-- ---------------------------------------------------------------------------
-- Sample Menu Items - Pizza Paradise (assume vendor UUIDs from above)
-- ---------------------------------------------------------------------------
INSERT INTO menus (menu_id, vendor_id, item_name, description, price, category, image_url, is_available)
VALUES (uuid(), uuid(), 'Margherita Pizza', 'Classic tomato sauce, mozzarella, and fresh basil', 12.99, 'Pizza', '/images/margherita.jpg', true);

INSERT INTO menus (menu_id, vendor_id, item_name, description, price, category, image_url, is_available)
VALUES (uuid(), uuid(), 'Pepperoni Pizza', 'Loaded with pepperoni and melted mozzarella', 14.99, 'Pizza', '/images/pepperoni.jpg', true);

INSERT INTO menus (menu_id, vendor_id, item_name, description, price, category, image_url, is_available)
VALUES (uuid(), uuid(), 'BBQ Chicken Pizza', 'Grilled chicken, BBQ sauce, red onions, and cilantro', 16.99, 'Pizza', '/images/bbq-chicken.jpg', true);

INSERT INTO menus (menu_id, vendor_id, item_name, description, price, category, image_url, is_available)
VALUES (uuid(), uuid(), 'Veggie Supreme', 'Bell peppers, olives, mushrooms, onions, and tomatoes', 13.99, 'Pizza', '/images/veggie-supreme.jpg', true);

INSERT INTO menus (menu_id, vendor_id, item_name, description, price, category, image_url, is_available)
VALUES (uuid(), uuid(), 'Garlic Bread', 'Toasted bread with garlic butter and herbs', 5.99, 'Sides', '/images/garlic-bread.jpg', true);

-- ---------------------------------------------------------------------------
-- Sample Menu Items - Burger Barn
-- ---------------------------------------------------------------------------
INSERT INTO menus (menu_id, vendor_id, item_name, description, price, category, image_url, is_available)
VALUES (uuid(), uuid(), 'Classic Burger', 'Beef patty, lettuce, tomato, and special sauce', 9.99, 'Burger', '/images/classic-burger.jpg', true);

INSERT INTO menus (menu_id, vendor_id, item_name, description, price, category, image_url, is_available)
VALUES (uuid(), uuid(), 'Cheeseburger', 'Beef patty with cheddar cheese and pickles', 11.99, 'Burger', '/images/cheeseburger.jpg', true);

INSERT INTO menus (menu_id, vendor_id, item_name, description, price, category, image_url, is_available)
VALUES (uuid(), uuid(), 'Bacon Deluxe', 'Double beef patty, bacon, cheese, and onion rings', 14.99, 'Burger', '/images/bacon-deluxe.jpg', true);

INSERT INTO menus (menu_id, vendor_id, item_name, description, price, category, image_url, is_available)
VALUES (uuid(), uuid(), 'Chicken Sandwich', 'Crispy chicken breast with mayo and lettuce', 10.99, 'Sandwich', '/images/chicken-sandwich.jpg', true);

INSERT INTO menus (menu_id, vendor_id, item_name, description, price, category, image_url, is_available)
VALUES (uuid(), uuid(), 'Veggie Burger', 'Plant-based patty with avocado and sprouts', 11.49, 'Burger', '/images/veggie-burger.jpg', true);

-- ---------------------------------------------------------------------------
-- Sample Orders with Items
-- ---------------------------------------------------------------------------
-- Order 1: Pizza Paradise order by customer John Doe
INSERT INTO orders (order_id, customer_id, vendor_id, items, total_amount, status, delivery_address, delivery_latitude, delivery_longitude, created_at, updated_at)
VALUES (
    uuid(), uuid(), uuid(),
    [
        {item_id: uuid(), food_item_id: uuid(), name: 'Pepperoni Pizza', quantity: 2, price: 14.99},
        {item_id: uuid(), food_item_id: uuid(), name: 'Garlic Bread', quantity: 1, price: 5.99}
    ],
    35.97, 'pending', '123 Main St, New York, NY', 40.7128, -74.0060,
    toTimestamp(now()), toTimestamp(now())
);

INSERT INTO order_items (item_id, order_id, food_item_id, quantity, price)
VALUES (uuid(), uuid(), uuid(), 2, 14.99);

INSERT INTO order_items (item_id, order_id, food_item_id, quantity, price)
VALUES (uuid(), uuid(), uuid(), 1, 5.99);

-- Order 2: Burger Barn order by customer John Doe
INSERT INTO orders (order_id, customer_id, vendor_id, items, total_amount, status, delivery_address, delivery_latitude, delivery_longitude, created_at, updated_at)
VALUES (
    uuid(), uuid(), uuid(),
    [
        {item_id: uuid(), food_item_id: uuid(), name: 'Bacon Deluxe', quantity: 1, price: 14.99},
        {item_id: uuid(), food_item_id: uuid(), name: 'Classic Burger', quantity: 1, price: 9.99}
    ],
    24.98, 'received', '123 Main St, New York, NY', 40.7128, -74.0060,
    toTimestamp(now()), toTimestamp(now())
);

INSERT INTO order_items (item_id, order_id, food_item_id, quantity, price)
VALUES (uuid(), uuid(), uuid(), 1, 14.99);

INSERT INTO order_items (item_id, order_id, food_item_id, quantity, price)
VALUES (uuid(), uuid(), uuid(), 1, 9.99);

-- ---------------------------------------------------------------------------
-- Sample Payment
-- ---------------------------------------------------------------------------
INSERT INTO payments (payment_id, order_id, method, status, transaction_id, amount, timestamp)
VALUES (
    uuid(), uuid(), 'credit_card', 'completed', 'txn_abc123def456',
    35.97, toTimestamp(now())
);
