# Agentic AI Pharmacy System 🏥💊

An autonomous pharmacy ordering system powered by AI that predicts medicine refills, validates prescriptions, and executes orders automatically.

## Features

✨ **AI Pharmacist** - Natural language chat + voice ordering
🔔 **Proactive Refills** - Predicts when you need medicines
✅ **Safety First** - Automatic prescription & stock validation
📊 **Admin Dashboard** - Real-time inventory & refill alerts
📧 **Notifications** - Email confirmations & refill reminders

## Tech Stack

- **Frontend:** React + Pure CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **AI:** Claude API
- **Observability:** Langfuse
- **Documentation:** Swagger
- **Deployment:** Docker

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB account (MongoDB Atlas)
- Claude API key
- Git

### Installation

1. **Clone repository**
```bash
git clone https://github.com/your-repo/pharmacy-ai.git
cd pharmacy-ai-system
```

2. **Setup backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your keys
npm run dev
```

3. **Setup frontend**
```bash
cd ../frontend
npm install
npm start
```

4. **Open application**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/api-docs

## API Endpoints

### Medicines
- `GET /api/medicines` - Get all medicines
- `POST /api/medicines` - Create medicine
- `GET /api/medicines/:id` - Get single medicine

### Chat & Orders
- `POST /api/chat/process` - Process chat message
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders

### Refills
- `GET /api/refills/alerts` - Get pending refill alerts
- `PATCH /api/refills/:id/sent` - Mark alert as sent

## Features Documentation

### 1. Chat Interface
Users can ask: "I need aspirin 500mg, 10 tablets"
- Claude extracts medicine details
- System validates stock & prescription
- Suggests order or explains why not possible

### 2. Proactive Refill Alerts
- Scheduler runs every 6 hours
- Calculates refill dates based on purchase history
- Creates alerts 3 days before refill needed
- Sends email & WhatsApp notifications

### 3. Safety Enforcement
- Checks medicine stock levels
- Validates prescription requirements
- Checks for drug interactions
- Approves or rejects orders automatically

### 4. Admin Dashboard
- Real-time inventory view
- Pending refill alerts
- Stock management
- Order history

## Demo

**Chat Flow:**
1. Customer: "I need my blood pressure medicine"
2. AI: "Found Amlodipine 5mg. In stock: 50. Order now?"
3. Customer: "Yes, 10 tablets"
4. AI: Creates order → Sends email → Updates inventory

**Refill Flow:**
1. Scheduler detects customer needs refill
2. Creates alert in admin dashboard
3. Sends notification to customer
4. Customer confirms → Order auto-created

## Project Structure