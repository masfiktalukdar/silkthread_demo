# Courier Integration & Webhook Testing Guide

This guide walks you through testing both **Pathao Courier (Aladdin)** and **Steadfast Courier** integrations, including local webhook simulation with Ngrok, live portal setup, and frontend tracking verification.

---

## 1. Webhook Endpoints & URLs

Your backend exposes dedicated endpoints for both couriers:

| Courier | Webhook Endpoint | Method | Security Header / Param |
| :--- | :--- | :--- | :--- |
| **Pathao Courier** | `/api/v1/webhooks/pathao` | `POST` | `x-webhook-secret: silkthread_pathao_webhook_secret_key` |
| **Steadfast Courier** | `/api/v1/webhooks/steadfast` | `POST` | `x-webhook-secret: silkthread_steadfast_webhook_secret_key` |
| **Public Order Tracking** | `/api/v1/courier/track/:identifier` | `GET` | Open to customer storefront |

*(Note: Aliases under `/api/v1/courier/webhooks/...` are also supported).*

---

## 2. Setting Up Ngrok for Local Testing

When testing webhooks on your local development machine:

1. **Start the Express backend**:
   ```bash
   cd server
   npm run dev
   # Server runs on http://localhost:5001
   ```

2. **Expose port 5001 with Ngrok**:
   ```bash
   ngrok http 5001
   ```
   Ngrok will generate a secure public HTTPS forwarding URL, for example:
   ```
   Forwarding   https://a1b2-c3d4.ngrok-free.app -> http://localhost:5001
   ```

3. **Configure in Courier Merchant Portals**:
   - **Pathao Merchant Portal**:
     - Navigate to **Settings** → **Developer / Webhooks** → **Webhook URL**.
     - Enter: `https://a1b2-c3d4.ngrok-free.app/api/v1/webhooks/pathao`
     - Enter Secret Header: `x-webhook-secret: silkthread_pathao_webhook_secret_key`
   - **Steadfast Merchant Portal**:
     - Navigate to **Settings** → **API / Webhook Settings**.
     - Enter: `https://a1b2-c3d4.ngrok-free.app/api/v1/webhooks/steadfast`

---

## 3. Simulating Webhooks Locally (cURL & PowerShell)

You can simulate webhook calls without waiting for physical courier movements using `curl`.

### A. Simulate Pathao Webhook

#### 1. In Transit:
```bash
curl -X POST http://localhost:5001/api/v1/webhooks/pathao \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: silkthread_pathao_webhook_secret_key" \
  -d '{
    "consignment_id": "PT12345678",
    "merchant_order_id": "PRO-1001",
    "order_status": "In_Transit",
    "order_status_slug": "order-in-transit",
    "updated_at": "2026-10-04 14:00:00"
  }'
```

#### 2. Delivered (auto-completes COD payment):
```bash
curl -X POST http://localhost:5001/api/v1/webhooks/pathao \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: silkthread_pathao_webhook_secret_key" \
  -d '{
    "consignment_id": "PT12345678",
    "merchant_order_id": "PRO-1001",
    "order_status": "Delivered",
    "order_status_slug": "order-delivered",
    "updated_at": "2026-10-04 16:30:00"
  }'
```

---

### B. Simulate Steadfast Webhook

#### 1. In Review / In Transit:
```bash
curl -X POST http://localhost:5001/api/v1/webhooks/steadfast \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: silkthread_steadfast_webhook_secret_key" \
  -d '{
    "consignment_id": 9876543,
    "invoice": "PRO-1001",
    "status": "delivered_approval_pending",
    "tracking_code": "STDF9876543",
    "updated_at": "2026-10-04T14:15:00.000000Z"
  }'
```

#### 2. Delivered:
```bash
curl -X POST http://localhost:5001/api/v1/webhooks/steadfast \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: silkthread_steadfast_webhook_secret_key" \
  -d '{
    "consignment_id": 9876543,
    "invoice": "PRO-1001",
    "status": "delivered",
    "tracking_code": "STDF9876543",
    "updated_at": "2026-10-04T16:00:00.000000Z"
  }'
```

---

## 4. Verifying Frontend Order Tracking

### A. Public Tracking Page
1. Visit `http://localhost:3000/track-order` in your browser.
2. Enter the **Order ID** (e.g., `PRO-1001`), **Consignment ID**, or **Phone Number**.
3. Direct URL access also works:
   `http://localhost:3000/track-order?id=PRO-1001`
4. The page will render the **`OrderTrackingTimeline`**:
   - Displays the courier badge (**Pathao** in coral-red, or **Steadfast** in emerald-green).
   - Shows milestone progress: **Order Placed** → **Confirmed** → **Picked Up** → **In Transit** → **Delivered**.
   - Includes the **"View Live on Pathao"** or **"View Live on Steadfast"** button linking directly to the courier's official tracking portal.

### B. Customer Dashboard
- Log in and visit `http://localhost:3000/dashboard/orderHistory`.
- Each order card displays the active courier badge with its Consignment ID and a **"Track Order"** button.

### C. Admin Panel Dispatch
- Visit `http://localhost:3001/order-list`.
- For any unassigned order, choose **Steadfast** or **Pathao**.
- Dispatches immediately via the backend, assigns the Consignment ID in MongoDB, and displays live tracking status.
