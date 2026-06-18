USE food_delivery;

-- Default users
INSERT INTO users (userid, name, email, phone, password_hash, location, role, created_at)
VALUES (uuid(), 'John Doe', 'customer@fooddelivery.com', '+1-555-0101',
    '$2b$12$Ks7jZ0zTdLpALsHTn8FyVuct.eZesZOv.si23nz1AoIrbUNsrz1Qy',
    '123 Main St, New York, NY', 'customer', toTimestamp(now()));

INSERT INTO users (userid, name, email, phone, password_hash, location, role, created_at)
VALUES (uuid(), 'Pizza Place', 'vendor@fooddelivery.com', '+1-555-0201',
    '$2b$12$b2ZTUMpQsHYCFVcQxsXf7OYME6QkM4uM.V3D/1atF/Z/sZy9bBxGq',
    '456 Oak Ave, New York, NY', 'vendor', toTimestamp(now()));

INSERT INTO users (userid, name, email, phone, password_hash, location, role, created_at)
VALUES (uuid(), 'Admin User', 'admin@fooddelivery.com', '+1-555-0001',
    '$2b$12$DeFrX0si/8x9s0gUymVwd.sMNWpWznwPSyONlnEc/dfUeVVq8Uux6',
    '100 Admin Plaza, New York, NY', 'admin', toTimestamp(now()));
