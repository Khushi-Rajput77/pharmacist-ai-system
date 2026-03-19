# 📊 Data Storage & Architecture Strategy

## Complete Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHARMACY AI SYSTEM                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐  ┌───────────────────────────────┐   │
│  │   FRONTEND (React)   │  │   BACKEND (Node.js/Express)   │   │
│  ├──────────────────────┤  ├───────────────────────────────┤   │
│  │                      │  │                               │   │
│  │  BROWSER STORAGE     │  │  SERVER STORAGE               │   │
│  │  (LocalStorage)      │  │  (MongoDB)                    │   │
│  │                      │  │                               │   │
│  │  ✓ Prescriptions     │  │  ✓ Orders                     │   │
│  │  ✓ Search History    │  │  ✓ Customers                  │   │
│  │  ✓ Cart              │  │  ✓ Medicines                  │   │
│  │  ✓ User Preferences  │  │  ✓ Prescriptions (metadata)   │   │
│  │                      │  │  ✓ Refill Alerts             │   │
│  │ [PRIVATE]            │  │  [BUSINESS RECORDS]           │   │
│  │ [OFFLINE]            │  │  [PERSISTENT]                 │   │
│  │ [CLIENT-SIDE]        │  │  [SERVER-SIDE]                │   │
│  │                      │  │                               │   │
│  └──────────────────────┘  └───────────────────────────────┘   │
│         ▲                              ▲                         │
│         │                              │                         │
│         │         API CALLS            │                         │
│         └──────────────────────────────┘                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1️⃣ PRESCRIPTION MANAGEMENT (LocalStorage)

### Location: `Browser LocalStorage`
### Key: `prescriptions_{customerId}`

**Why LocalStorage?**
- 🔒 **Private**: Medical prescriptions are sensitive personal health documents
- 📵 **Offline**: Users can view prescriptions without internet
- 🚫 **No Tracking**: Prescriptions never sent to server (privacy-first)
- ⚡ **Fast**: Instant access without API calls
- 💾 **Persistent**: Survives browser restarts

**Data Structure:**
```javascript
{
  prescriptions_{customerId}: [
    {
      id: "unique_id",
      fileName: "prescription_2024_01.jpg",
      uploadDate: "2024-01-15T10:30:00Z",
      base64: "data:image/jpeg;base64,...",  // Full image
      extractedText: "Lorem ipsum...",         // OCR extracted text
      detectedMedicines: ["Amoxicillin", "Ibuprofen"],
      notes: "User notes about this prescription"
    },
    // ... more prescriptions
  ]
}
```

**Component:** `PrescriptionUpload.jsx`
- File upload with validation (JPG, PNG, WebP, PDF)
- OCR processing with Tesseract.js
- Medicine name detection
- View/Delete functionality
- No backend API calls

**Flow:**
```
User uploads file
    ↓
Client-side validation
    ↓
OCR processing (Tesseract.js)
    ↓
Extract text & detect medicines
    ↓
Save to localStorage
    ↓
Display in prescriptions list
```

---

## 2️⃣ ORDER MANAGEMENT (MongoDB)

### Location: `Server Database (MongoDB)`
### Collections: `Order`, `Customer`

**Why MongoDB?**
- 💼 **Business Records**: Orders are transaction records needed for business
- 🔒 **Secure**: Server-side storage with authentication
- 📊 **Queryable**: Analytics, reporting, inventory management
- 🔄 **Persistent**: Survives app/browser restart
- 🔗 **Relational**: Link with customer, medicine, payment records
- 📧 **Email Integration**: Send receipts, tracking updates
- 💰 **Payment Tracking**: Store payment status and history

**Database Schema:**
```javascript
// Order Collection
{
  _id: ObjectId,
  customerId: ObjectId (references Customer),
  orderDate: Date,
  medicines: [
    {
      medicineId: ObjectId (references Medicine),
      name: String,
      quantity: Number,
      price: Number,
      dosage: String
    }
  ],
  subtotal: Number,
  tax: Number,
  shippingCost: Number,
  totalAmount: Number,
  status: String,              // pending, confirmed, processing, shipped, delivered
  paymentStatus: String,       // paid, pending, failed
  paymentId: String,           // Reference to payment gateway
  trackingNumber: String,
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  estimatedDelivery: Date,
  actualDelivery: Date,
  notes: String
}
```

**Component:** `OrderHistory.jsx`
- Fetch orders from API: `GET /api/orders/customer/:customerId`
- Display with search, filter, sort
- View order details
- Reorder functionality
- Professional UI with status tracking

**Flow:**
```
User clicks "Order History"
    ↓
Frontend fetches from API
    ↓
Backend queries MongoDB
    ↓
Returns order list with all details
    ↓
Frontend displays with sorting/filtering
    ↓
User can view, search, reorder
```

---

## 3️⃣ CART & QUICK ORDER (SessionStorage + API)

### Location: `SessionStorage + Backend`
### Purpose: Temporary shopping session

**Data Structure:**
```javascript
// SessionStorage: cart_{customerId}
{
  cartItems: [
    {
      medicineId: String,
      name: String,
      quantity: Number,
      price: Number,
      addedAt: Date
    }
  ],
  lastUpdated: Date
}
```

**Flow:**
```
User selects medicine
    ↓
Add to cart (update sessionStorage)
    ↓
User reviews cart
    ↓
Proceed to checkout
    ↓
Send order to backend (API)
    ↓
Backend creates order in MongoDB
    ↓
Clear cart
```

---

## 4️⃣ SEARCH HISTORY (LocalStorage)

### Location: `Browser LocalStorage`
### Key: `searchHistory_{customerId}`

**Why LocalStorage?**
- Quick access for search suggestions
- Privacy-preserving
- No server round-trip needed

**Data Structure:**
```javascript
{
  searchHistory_{customerId}: [
    {
      query: "Amoxicillin",
      timestamp: "2024-01-15T10:30:00Z",
      resultCount: 5
    }
  ]
}
```

---

## 5️⃣ USER PREFERENCES (LocalStorage + API)

### Location: `LocalStorage + MongoDB`

**What to store where:**

**LocalStorage:**
- Theme preference (light/dark)
- Layout preference
- Sidebar collapsed/expanded
- Last viewed page

**MongoDB (User Document):**
- Preferred delivery address
- Default payment method
- Notification preferences
- Emergency contacts
- Medical history

---

## Data Flow Diagrams

### Prescription Upload Flow
```
┌─────────────────────┐
│  User Selects File  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Validate File      │
│  (type, size)       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Preview Image      │
│  (in browser)       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Run OCR Processing │
│  (Tesseract.js)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Extract Medicines  │
│  (pattern match)    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Save to            │
│  localStorage       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Display in List    │
│  (view/delete)      │
└─────────────────────┘
```

### Order Creation Flow
```
┌─────────────────────┐
│  User Adds Items    │
│  to Cart            │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Save Cart to       │
│  sessionStorage     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  User Reviews Cart  │
│  Updates quantities │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  User Proceeds to   │
│  Checkout           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  API: POST /orders  │
│  Send cart to API   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Backend Validates  │
│  (inventory check)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Create Order in    │
│  MongoDB            │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Send Order Receipt │
│  via Email          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Clear Cart from    │
│  sessionStorage     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Redirect to Order  │
│  History page       │
└─────────────────────┘
```

### Order History Retrieval Flow
```
┌──────────────────────┐
│  User Clicks Order   │
│  History Button      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Frontend Loads      │
│  OrderHistory.jsx    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  useEffect Runs:     │
│  Call fetchOrders()  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  API: GET /orders/   │
│  customer/{id}       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Backend Queries     │
│  MongoDB for Orders  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Return Order List   │
│  in JSON format      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Frontend Updates    │
│  state with orders   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  User Can:           │
│  - Search           │
│  - Filter           │
│  - Sort             │
│  - View Details     │
│  - Reorder          │
└──────────────────────┘
```

---

## Storage Comparison Table

| Feature | LocalStorage | MongoDB | SessionStorage |
|---------|--------------|---------|----------------|
| **Capacity** | ~5-10MB | Unlimited | ~5-10MB |
| **Persistence** | Permanent | Permanent | Session only |
| **Speed** | Instant | API latency | Instant |
| **Secure** | Client-side | Server-side ⭐ |Session-side |
| **Queryable** | No | Yes ⭐ | No |
| **Backup** | No | Yes ⭐ | No |
| **Sync** | No | Yes ⭐ | No |
| **Privacy** | Client-only | Server access | Browser only |

---

## Data Privacy & Security

### Prescription Data (LocalStorage)
```
NEVER SENT TO SERVER
✓ Stays in user's browser
✓ Encrypted with browser's same-origin policy
✓ Lost if user clears browser storage
✓ Not synced across devices
```

### Order Data (MongoDB)
```
STORED ON SECURED SERVER
✓ Requires authentication
✓ HTTPS encrypted in transit
✓ Database encryption at rest
✓ Regular backups
✓ GDPR compliant data retention
```

### API Security
```
ALL API CALLS MUST USE:
✓ HTTPS (not HTTP)
✓ Authentication token (JWT)
✓ CORS validation
✓ Rate limiting
✓ Input validation
```

---

## Implementation Checklist

### Frontend Complete ✅
- [x] Prescription upload with localStorage
- [x] Order history with mock data
- [x] Professional UI/CSS for both features
- [x] Search and filter functionality
- [x] Responsive design

### Backend Implementation Needed
- [ ] `POST /api/orders` - Create order
- [ ] `GET /api/orders/customer/:customerId` - Get customer orders
- [ ] `GET /api/orders/:orderId` - Get specific order details
- [ ] `PUT /api/orders/:orderId` - Update order status
- [ ] Order schema in MongoDB
- [ ] Payment integration
- [ ] Email notifications

### Database Schema Needed
- [ ] Order collection
- [ ] OrderItem subdocuments
- [ ] ShippingAddress details
- [ ] Indexes for queries

---

## FAQ

**Q: Why not store prescriptions on server?**
A: Prescriptions are sensitive medical documents. Keeping them browser-only means they're never transmitted to servers, providing maximum privacy and meeting medical data privacy regulations.

**Q: Can prescriptions be synced across devices?**
A: Currently no. Users would need to upload prescriptions on each device. Future: Could add optional cloud backup with encryption.

**Q: How many orders can be stored in MongoDB?**
A: Unlimited. MongoDB scales to millions of documents. Frontend displays orders with pagination.

**Q: What if user clears browser storage?**
A: Prescriptions would be lost. Future: Could warn user before clearing or offer export as PDF.

**Q: Is reordering secure?**
A: Yes. Reorder creates a new order record validated on backend before processing.

---

## Future Enhancements

1. **Prescription Cloud Backup**: Encrypt and sync prescriptions to server (user opt-in)
2. **Order Sync**: Sync order data to user profile for cross-device access
3. **Offline Mode**: Service workers for offline prescription access
4. **AI Analysis**: Analyze prescription history for drug interactions
5. **Refill Reminders**: Based on order history and medicine dosage
6. **Data Export**: Export all orders/prescriptions as PDF/CSV
7. **Multi-Device Sync**: Login on multiple devices and see combined data

---

Generated: 2024
Pharmacy AI System Architecture Documentation

