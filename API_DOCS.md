# Azlaan Food Delivery — API Documentation

**Base URL:** `http://localhost:8080/api`  
**Swagger UI:** `http://localhost:8080/swagger-ui.html`  
**Content-Type:** `application/json`  
**Authentication:** JWT Bearer Token (`Authorization: Bearer <token>`)

---

## Authentication

All endpoints except `/api/auth/*` require a valid JWT token obtained from the login endpoint.

### Error Response Format

```json
{
  "timestamp": "2024-01-01T12:00:00.000+00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/auth/register",
  "errors": [
    { "field": "email", "message": "must be a valid email" }
  ]
}
```

### Common Status Codes

| Code | Description                  |
|------|------------------------------|
| 200  | OK — Successful request      |
| 201  | Created — Resource created   |
| 400  | Bad Request — Validation error |
| 401  | Unauthorized — Missing/invalid token |
| 403  | Forbidden — Insufficient role |
| 404  | Not Found                    |
| 409  | Conflict — Duplicate resource |
| 500  | Internal Server Error        |

---

## 1. Auth Module

### POST /api/auth/register

Register a new user (customer or vendor).

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-1234567",
  "password": "securePassword123",
  "role": "customer",
  "location": "123 Main St, New York, NY"
}
```

**Response (201):**

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "message": "Registration successful"
}
```

### POST /api/auth/login

Authenticate and receive JWT tokens.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "tokenType": "Bearer",
  "expiresIn": 86400000,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "role": "customer"
}
```

### POST /api/auth/refresh

Refresh an expired access token.

**Request Body:**

```json
{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

**Response (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "expiresIn": 86400000
}
```

### POST /api/auth/logout

Invalidate the current refresh token.

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

---

## 2. Vendor Module

### GET /api/vendors

List all approved vendors.

**Query Parameters:**

| Param     | Type    | Description                         |
|-----------|---------|-------------------------------------|
| `page`    | int     | Page number (default: 0)            |
| `size`    | int     | Page size (default: 20)             |
| `cuisine` | string  | Filter by cuisine/category          |
| `rating`  | double  | Minimum rating filter               |
| `search`  | string  | Search by name or description       |

**Response (200):**

```json
{
  "content": [
    {
      "vendorId": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Pizza Paradise",
      "address": "789 Pizza St, New York, NY",
      "rating": 4.5,
      "menuItems": ["Margherita Pizza", "Pepperoni Pizza", "BBQ Chicken Pizza", "Veggie Supreme", "Garlic Bread"],
      "isApproved": true
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 1,
  "totalPages": 1
}
```

### GET /api/vendors/{vendorId}

Get a single vendor's profile.

**Response (200):**

```json
{
  "vendorId": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Pizza Paradise",
  "email": "contact@pizzaparadise.com",
  "phone": "+1-555-1001",
  "address": "789 Pizza St, New York, NY",
  "rating": 4.5,
  "menuItems": ["Margherita Pizza", "Pepperoni Pizza", "BBQ Chicken Pizza", "Veggie Supreme", "Garlic Bread"],
  "isApproved": true,
  "createdAt": "2024-01-01T10:00:00.000+00:00"
}
```

### PUT /api/vendors/{vendorId}

Update vendor profile. **Roles:** Vendor, Admin.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "name": "Pizza Paradise Updated",
  "phone": "+1-555-1002",
  "address": "890 Pizza St, New York, NY"
}
```

**Response (200):**

```json
{
  "vendorId": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Pizza Paradise Updated",
  "message": "Profile updated successfully"
}
```

---

## 3. Menu Module

### GET /api/vendors/{vendorId}/menu

Get all menu items for a vendor.

**Response (200):**

```json
{
  "vendorId": "550e8400-e29b-41d4-a716-446655440001",
  "items": [
    {
      "menuId": "660e8400-e29b-41d4-a716-446655440010",
      "itemName": "Margherita Pizza",
      "description": "Classic tomato sauce, mozzarella, and fresh basil",
      "price": 12.99,
      "category": "Pizza",
      "imageUrl": "/images/margherita.jpg",
      "isAvailable": true
    }
  ]
}
```

### POST /api/vendors/{vendorId}/menu

Add a menu item. **Roles:** Vendor.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "itemName": "Pepperoni Pizza",
  "description": "Loaded with pepperoni and melted mozzarella",
  "price": 14.99,
  "category": "Pizza",
  "imageUrl": "/images/pepperoni.jpg",
  "isAvailable": true
}
```

**Response (201):**

```json
{
  "menuId": "660e8400-e29b-41d4-a716-446655440011",
  "itemName": "Pepperoni Pizza",
  "message": "Menu item added successfully"
}
```

### PUT /api/vendors/{vendorId}/menu/{menuId}

Update a menu item. **Roles:** Vendor.

**Request Body:**

```json
{
  "price": 15.99,
  "isAvailable": false
}
```

**Response (200):**

```json
{
  "menuId": "660e8400-e29b-41d4-a716-446655440011",
  "message": "Menu item updated successfully"
}
```

### DELETE /api/vendors/{vendorId}/menu/{menuId}

Delete a menu item. **Roles:** Vendor, Admin.

**Response (200):**

```json
{
  "message": "Menu item deleted successfully"
}
```

---

## 4. Order Module

### POST /api/orders

Place a new order. **Roles:** Customer.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "vendorId": "550e8400-e29b-41d4-a716-446655440001",
  "items": [
    {
      "menuItemId": "660e8400-e29b-41d4-a716-446655440010",
      "quantity": 2
    },
    {
      "menuItemId": "660e8400-e29b-41d4-a716-446655440014",
      "quantity": 1
    }
  ],
  "deliveryAddress": "123 Main St, New York, NY",
  "deliveryLatitude": 40.7128,
  "deliveryLongitude": -74.0060
}
```

**Response (201):**

```json
{
  "orderId": "770e8400-e29b-41d4-a716-446655440020",
  "status": "pending",
  "totalAmount": 35.97,
  "estimatedDeliveryTime": "30-45 minutes",
  "message": "Order placed successfully"
}
```

### GET /api/orders

List orders. **Roles:** Customer (own), Vendor (vendor's), Admin (all).

**Query Parameters:**

| Param  | Type   | Description                |
|--------|--------|----------------------------|
| `page` | int    | Page number                |
| `size` | int    | Page size                  |
| `status` | string | Filter by status          |

**Response (200):**

```json
{
  "content": [
    {
      "orderId": "770e8400-e29b-41d4-a716-446655440020",
      "vendorId": "550e8400-e29b-41d4-a716-446655440001",
      "vendorName": "Pizza Paradise",
      "items": [
        { "name": "Pepperoni Pizza", "quantity": 2, "price": 14.99 },
        { "name": "Garlic Bread", "quantity": 1, "price": 5.99 }
      ],
      "totalAmount": 35.97,
      "status": "pending",
      "createdAt": "2024-01-01T12:00:00.000+00:00"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 1
}
```

### GET /api/orders/{orderId}

Get order details by ID.

**Response (200):**

```json
{
  "orderId": "770e8400-e29b-41d4-a716-446655440020",
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "vendorId": "550e8400-e29b-41d4-a716-446655440001",
  "vendorName": "Pizza Paradise",
  "items": [
    { "itemId": "880e8400-e29b-41d4-a716-446655440030", "name": "Pepperoni Pizza", "quantity": 2, "price": 14.99 },
    { "itemId": "880e8400-e29b-41d4-a716-446655440031", "name": "Garlic Bread", "quantity": 1, "price": 5.99 }
  ],
  "totalAmount": 35.97,
  "status": "preparing",
  "deliveryAddress": "123 Main St, New York, NY",
  "deliveryLatitude": 40.7128,
  "deliveryLongitude": -74.0060,
  "createdAt": "2024-01-01T12:00:00.000+00:00",
  "updatedAt": "2024-01-01T12:15:00.000+00:00"
}
```

### PUT /api/orders/{orderId}/status

Update order status. **Roles:** Vendor, Admin.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "status": "preparing"
}
```

**Response (200):**

```json
{
  "orderId": "770e8400-e29b-41d4-a716-446655440020",
  "status": "preparing",
  "updatedAt": "2024-01-01T12:15:00.000+00:00",
  "message": "Order status updated"
}
```

**Valid Status Transitions:**

```
pending → received → preparing → out_for_delivery → delivered
pending → cancelled (customer/admin)
received → cancelled (vendor/admin)
```

### GET /api/orders/{orderId}/track

Real-time order tracking. **Roles:** Customer, Vendor.

**Response (200):**

```json
{
  "orderId": "770e8400-e29b-41d4-a716-446655440020",
  "status": "out_for_delivery",
  "delivery": {
    "driverId": "990e8400-e29b-41d4-a716-446655440040",
    "driverName": "Mike Driver",
    "driverPhone": "+1-555-3001",
    "currentLocation": "40.7130, -74.0055",
    "estimatedTime": "10 minutes",
    "lastUpdated": "2024-01-01T12:30:00.000+00:00"
  },
  "timeline": [
    { "status": "pending",      "timestamp": "2024-01-01T12:00:00.000+00:00" },
    { "status": "received",     "timestamp": "2024-01-01T12:05:00.000+00:00" },
    { "status": "preparing",    "timestamp": "2024-01-01T12:15:00.000+00:00" },
    { "status": "out_for_delivery", "timestamp": "2024-01-01T12:30:00.000+00:00" }
  ]
}
```

### DELETE /api/orders/{orderId}

Cancel an order. **Roles:** Customer (own), Admin.

**Response (200):**

```json
{
  "message": "Order cancelled successfully"
}
```

---

## 5. Payment Module

### POST /api/payments

Process a payment. **Roles:** Customer.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "orderId": "770e8400-e29b-41d4-a716-446655440020",
  "method": "credit_card",
  "amount": 35.97,
  "stripeToken": "tok_visa"
}
```

**Response (201):**

```json
{
  "paymentId": "aa0e8400-e29b-41d4-a716-446655440050",
  "orderId": "770e8400-e29b-41d4-a716-446655440020",
  "method": "credit_card",
  "status": "completed",
  "transactionId": "txn_abc123def456",
  "amount": 35.97,
  "timestamp": "2024-01-01T12:01:00.000+00:00",
  "message": "Payment successful"
}
```

### GET /api/payments/{paymentId}

Get payment details. **Roles:** Customer (own), Admin.

**Response (200):**

```json
{
  "paymentId": "aa0e8400-e29b-41d4-a716-446655440050",
  "orderId": "770e8400-e29b-41d4-a716-446655440020",
  "method": "credit_card",
  "status": "completed",
  "transactionId": "txn_abc123def456",
  "amount": 35.97,
  "timestamp": "2024-01-01T12:01:00.000+00:00"
}
```

### POST /api/payments/webhook

Stripe webhook endpoint (no authentication — uses Stripe signature verification).

**Headers:** `Stripe-Signature: <signature>`  
**Request Body:** Raw Stripe event

**Response (200):**

```json
{
  "received": true
}
```

---

## 6. Delivery Module

### POST /api/deliveries

Assign a driver to an order. **Roles:** Admin.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "orderId": "770e8400-e29b-41d4-a716-446655440020",
  "driverId": "990e8400-e29b-41d4-a716-446655440040"
}
```

**Response (201):**

```json
{
  "deliveryId": "bb0e8400-e29b-41d4-a716-446655440060",
  "orderId": "770e8400-e29b-41d4-a716-446655440020",
  "status": "assigned",
  "estimatedTime": "30 minutes",
  "message": "Delivery assigned"
}
```

### PUT /api/deliveries/{deliveryId}/location

Update driver's current location. **Roles:** Driver.

**Request Body:**

```json
{
  "latitude": 40.7130,
  "longitude": -74.0055
}
```

**Response (200):**

```json
{
  "deliveryId": "bb0e8400-e29b-41d4-a716-446655440060",
  "currentLocation": "40.7130, -74.0055",
  "message": "Location updated"
}
```

### PUT /api/deliveries/{deliveryId}/status

Update delivery status. **Roles:** Driver, Admin.

**Request Body:**

```json
{
  "status": "in_transit"
}
```

**Response (200):**

```json
{
  "deliveryId": "bb0e8400-e29b-41d4-a716-446655440060",
  "status": "in_transit",
  "message": "Delivery status updated"
}
```

---

## 7. Admin Module

All endpoints in this module require **Admin** role.

**Headers:** `Authorization: Bearer <token>`

### GET /api/admin/stats

Platform-wide statistics.

**Response (200):**

```json
{
  "totalUsers": 150,
  "totalVendors": 25,
  "totalOrders": 1200,
  "totalRevenue": 45800.50,
  "activeOrders": 45,
  "newUsersToday": 12,
  "newOrdersToday": 38,
  "revenueToday": 1520.75,
  "averageOrderValue": 38.17,
  "topVendors": [
    { "vendorId": "...", "name": "Pizza Paradise", "orderCount": 320, "revenue": 12480.00 }
  ]
}
```

### GET /api/admin/users

List all users with filtering.

**Query Parameters:**

| Param  | Type   | Description                    |
|--------|--------|--------------------------------|
| `page` | int    | Page number                    |
| `size` | int    | Page size                      |
| `role` | string | Filter by role (customer, vendor, admin) |
| `status` | string | active, suspended            |

**Response (200):**

```json
{
  "content": [
    {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "isActive": true,
      "createdAt": "2024-01-01T10:00:00.000+00:00"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 150
}
```

### PUT /api/admin/users/{userId}/status

Activate or suspend a user.

**Request Body:**

```json
{
  "isActive": false
}
```

**Response (200):**

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "isActive": false,
  "message": "User status updated"
}
```

### GET /api/admin/vendors

List all vendors (approved and pending).

**Query Parameters:**

| Param      | Type    | Description                       |
|------------|---------|-----------------------------------|
| `page`     | int     | Page number                       |
| `size`     | int     | Page size                         |
| `approved` | boolean | Filter by approval status         |

**Response (200):**

```json
{
  "content": [
    {
      "vendorId": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Pizza Paradise",
      "email": "contact@pizzaparadise.com",
      "isApproved": true,
      "rating": 4.5,
      "totalOrders": 320,
      "revenue": 12480.00
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 25
}
```

### PUT /api/admin/vendors/{vendorId}/approve

Approve or reject a vendor.

**Request Body:**

```json
{
  "isApproved": true
}
```

**Response (200):**

```json
{
  "vendorId": "550e8400-e29b-41d4-a716-446655440001",
  "isApproved": true,
  "message": "Vendor approval status updated"
}
```

### GET /api/admin/orders

List all orders across the platform.

**Query Parameters:**

| Param    | Type   | Description                |
|----------|--------|----------------------------|
| `page`   | int    | Page number                |
| `size`   | int    | Page size                  |
| `status` | string | Filter by status           |
| `startDate` | string | ISO date filter (from)  |
| `endDate`   | string | ISO date filter (to)    |

**Response (200):**

```json
{
  "content": [
    {
      "orderId": "770e8400-e29b-41d4-a716-446655440020",
      "customer": { "id": "...", "name": "John Doe" },
      "vendor": { "id": "...", "name": "Pizza Paradise" },
      "totalAmount": 35.97,
      "status": "delivered",
      "createdAt": "2024-01-01T12:00:00.000+00:00"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 1200
}
```

### GET /api/admin/reports/sales

Sales report.

**Query Parameters:**

| Param       | Type   | Description                     |
|-------------|--------|---------------------------------|
| `period`    | string | daily, weekly, monthly, yearly  |
| `startDate` | string | ISO date                        |
| `endDate`   | string | ISO date                        |
| `vendorId`  | string | Filter by specific vendor       |

**Response (200):**

```json
{
  "period": "monthly",
  "data": [
    { "date": "2024-01-01", "orders": 45, "revenue": 1750.50 },
    { "date": "2024-01-02", "orders": 52, "revenue": 2010.75 }
  ],
  "totals": {
    "orders": 1200,
    "revenue": 45800.50,
    "averageOrderValue": 38.17
  }
}
```

### GET /api/admin/kafka/topics

Monitor Kafka topic status.

**Response (200):**

```json
{
  "topics": [
    { "name": "new-orders", "partitions": 3, "messages": 5400, "consumers": 2 },
    { "name": "order-updates", "partitions": 3, "messages": 4200, "consumers": 3 },
    { "name": "notifications", "partitions": 2, "messages": 3800, "consumers": 1 },
    { "name": "analytics", "partitions": 2, "messages": 9600, "consumers": 1 },
    { "name": "payment-events", "partitions": 3, "messages": 2800, "consumers": 2 }
  ]
}
```

---

## 8. Review Module

### POST /api/reviews

Submit a review for an order. **Roles:** Customer.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "vendorId": "550e8400-e29b-41d4-a716-446655440001",
  "orderId": "770e8400-e29b-41d4-a716-446655440020",
  "rating": 5,
  "comment": "Excellent pizza! Fast delivery and great taste."
}
```

**Response (201):**

```json
{
  "reviewId": "cc0e8400-e29b-41d4-a716-446655440070",
  "message": "Review submitted successfully"
}
```

### GET /api/vendors/{vendorId}/reviews

Get all reviews for a vendor.

**Query Parameters:**

| Param  | Type | Description  |
|--------|------|--------------|
| `page` | int  | Page number  |
| `size` | int  | Page size    |

**Response (200):**

```json
{
  "content": [
    {
      "reviewId": "cc0e8400-e29b-41d4-a716-446655440070",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "userName": "John Doe",
      "rating": 5,
      "comment": "Excellent pizza! Fast delivery and great taste.",
      "timestamp": "2024-01-01T12:45:00.000+00:00"
    }
  ],
  "averageRating": 4.5,
  "totalReviews": 1,
  "page": 0,
  "size": 20
}
```

### DELETE /api/reviews/{reviewId}

Delete a review. **Roles:** Admin, Customer (own).

**Response (200):**

```json
{
  "message": "Review deleted successfully"
}
```

---

## Webhook Endpoints

### Stripe Payment Webhook

Receives asynchronous payment events from Stripe. These events are published to the `payment-events` Kafka topic for downstream consumers.

| Endpoint                     | Method | Description                | Auth     |
|------------------------------|--------|----------------------------|----------|
| `/api/payments/webhook`      | POST   | Stripe webhook receiver    | Signature |

**Events handled:**

- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

---

## API Reference Summary

| Module    | Method | Endpoint                                      | Auth     | Roles              |
|-----------|--------|-----------------------------------------------|----------|--------------------|
| Auth      | POST   | `/api/auth/register`                          | No       | —                  |
| Auth      | POST   | `/api/auth/login`                             | No       | —                  |
| Auth      | POST   | `/api/auth/refresh`                           | No       | —                  |
| Auth      | POST   | `/api/auth/logout`                            | Yes      | Any                |
| Vendors   | GET    | `/api/vendors`                                | No       | —                  |
| Vendors   | GET    | `/api/vendors/{vendorId}`                     | No       | —                  |
| Vendors   | PUT    | `/api/vendors/{vendorId}`                     | Yes      | Vendor, Admin      |
| Menu      | GET    | `/api/vendors/{vendorId}/menu`                | No       | —                  |
| Menu      | POST   | `/api/vendors/{vendorId}/menu`                | Yes      | Vendor             |
| Menu      | PUT    | `/api/vendors/{vendorId}/menu/{menuId}`       | Yes      | Vendor             |
| Menu      | DELETE | `/api/vendors/{vendorId}/menu/{menuId}`       | Yes      | Vendor, Admin      |
| Orders    | POST   | `/api/orders`                                 | Yes      | Customer           |
| Orders    | GET    | `/api/orders`                                 | Yes      | Customer, Vendor, Admin |
| Orders    | GET    | `/api/orders/{orderId}`                       | Yes      | Customer, Vendor, Admin |
| Orders    | PUT    | `/api/orders/{orderId}/status`                | Yes      | Vendor, Admin      |
| Orders    | GET    | `/api/orders/{orderId}/track`                 | Yes      | Customer, Vendor   |
| Orders    | DELETE | `/api/orders/{orderId}`                       | Yes      | Customer, Admin    |
| Payments  | POST   | `/api/payments`                               | Yes      | Customer           |
| Payments  | GET    | `/api/payments/{paymentId}`                   | Yes      | Customer, Admin    |
| Payments  | POST   | `/api/payments/webhook`                       | Signature| —                  |
| Deliveries| POST   | `/api/deliveries`                             | Yes      | Admin              |
| Deliveries| PUT    | `/api/deliveries/{deliveryId}/location`       | Yes      | Driver             |
| Deliveries| PUT    | `/api/deliveries/{deliveryId}/status`         | Yes      | Driver, Admin      |
| Admin     | GET    | `/api/admin/stats`                            | Yes      | Admin              |
| Admin     | GET    | `/api/admin/users`                            | Yes      | Admin              |
| Admin     | PUT    | `/api/admin/users/{userId}/status`            | Yes      | Admin              |
| Admin     | GET    | `/api/admin/vendors`                          | Yes      | Admin              |
| Admin     | PUT    | `/api/admin/vendors/{vendorId}/approve`       | Yes      | Admin              |
| Admin     | GET    | `/api/admin/orders`                           | Yes      | Admin              |
| Admin     | GET    | `/api/admin/reports/sales`                    | Yes      | Admin              |
| Admin     | GET    | `/api/admin/kafka/topics`                     | Yes      | Admin              |
| Reviews   | POST   | `/api/reviews`                                | Yes      | Customer           |
| Reviews   | GET    | `/api/vendors/{vendorId}/reviews`             | No       | —                  |
| Reviews   | DELETE | `/api/reviews/{reviewId}`                     | Yes      | Customer, Admin    |
