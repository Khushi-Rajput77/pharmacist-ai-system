# 📋 DATA STORAGE STRATEGY - PRESCRIPTION vs ORDER HISTORY

## 🗂️ STORAGE BREAKDOWN

### **PRESCRIPTION STORAGE (Current)**

**Where:** Browser LocalStorage
**What:** Complete prescription documents
- Original image/PDF (Base64 encoded)
- Full OCR extracted text
- Medicine names detected
- Upload metadata

**Why LocalStorage?**
- User's private medical documents
- Sensitive data (shouldn't be sent to server)
- Can work offline
- Instant save/load
- No server load

**Pros:**
✅ Privacy (stays on user device)
✅ Fast access
✅ No server storage needed
✅ Works offline
✅ User has full control

**Cons:**
❌ Limited storage (5MB per domain)
❌ Lost if cache cleared
❌ Not synced across devices
❌ Browser-dependent

---

### **ORDER HISTORY STORAGE (New - MongoDB)**

**Where:** MongoDB Database
**What:** Order metadata and transaction records
- Order ID & timestamp
- Customer ID
- Medicines ordered (names, quantities)
- Prices & total cost
- Payment status
- Delivery status
- Pharmacy fulfillment notes

**Why MongoDB?**
- Business/financial records (tax, accounting)
- Need server-side persistence
- Track delivery & fulfillment
- Generate invoices
- Customer history across sessions
- Payment verification
- Admin/pharmacy access needed

**Pros:**
✅ Permanent storage
✅ Accessible from any device
✅ Can be searched/filtered by admin
✅ Payment tracking & receipts
✅ Sync across devices
✅ Backup & recovery

**Cons:**
❌ Privacy concerns (sensitive data)
❌ Requires backend
❌ Server load
❌ Need encryption for payment info

---

## 📊 DATA COMPARISON

| Aspect | Prescription | Order History |
|--------|--------------|----------------|
| Storage | LocalStorage | MongoDB |
| Privacy | High (user device) | Medium (server) |
| Purpose | Medical records | Business records |
| Persistence | Session-based | Permanent |
| Sync | Single device | All devices |
| Access | User only | User + Admin |
| Backup | Manual | Automatic |

---

## 🏗️ ARCHITECTURE

```
Frontend (React)
│
├─ Prescriptions
│  └─ Store in localStorage
│     └─ User's private documents
│
└─ Orders
   └─ Fetch from backend
      └─ MongoDB stores order records
         ├─ Order metadata
         ├─ Delivery status
         ├─ Payment info
         └─ Admin notes

Backend (Node.js/Express)
│
└─ Orders API
   ├─ GET /api/orders/{customerId}
   ├─ POST /api/orders (create new)
   ├─ PUT /api/orders/{orderId} (update)
   └─ GET /api/orders/{orderId}/reorder
```

---

## 💾 MONGODB SCHEMA (For Orders)

```javascript
// Order Document Structure
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  customerId: "64a1b2c3d4e5f6g7h8i9j0k1",
  orderDate: "2026-01-17T14:30:00Z",
  
  // Order Details
  medicines: [
    {
      medicineId: "med_123",
      name: "Amoxicillin 500mg",
      quantity: 1,
      price: 150.00,
      dosage: "500mg"
    },
    {
      medicineId: "med_456",
      name: "Ibuprofen 400mg",
      quantity: 2,
      price: 50.00,
      dosage: "400mg"
    }
  ],
  
  // Totals
  subtotal: 200.00,
  tax: 18.00,
  shippingCost: 50.00,
  totalAmount: 268.00,
  
  // Status
  status: "delivered", // pending, confirmed, processing, shipped, delivered
  paymentStatus: "paid", // pending, paid, failed
  paymentMethod: "credit_card",
  
  // Delivery
  shippingAddress: "123 Main St, City",
  estimatedDelivery: "2026-01-20",
  actualDelivery: "2026-01-19",
  
  // Tracking
  trackingNumber: "TRACK123456789",
  notes: "Delivered successfully"
}
```

---

## 🔄 WORKFLOW

### **Order Creation:**
```
1. User selects medicines from chat
2. Click "Order" → sends to backend
3. Backend creates Order in MongoDB
4. Returns orderId to frontend
5. Frontend shows confirmation
6. Order appears in history
```

### **Order Viewing:**
```
1. User clicks "📋 Order History"
2. Frontend fetches orders from API
3. Shows list from MongoDB
4. User can search/filter
5. Click order → see full details
```

### **Prescription vs Order:**
```
Prescription (Added):
→ Image/document stored in browser localStorage
→ User's personal medical file
→ Visible only to user

Order (Created):
→ Transaction record in MongoDB
→ Generated from medicine selection
→ Contains payment & delivery info
→ Accessible to user, pharmacy, admin
```

---

## 🛡️ DATA PRIVACY

### **Prescription (LocalStorage):**
✅ **Private** - Never sent to server
✅ **Offline** - Works without connection
✅ **User control** - Can delete anytime
❌ **Not backed up** - Lost if cache cleared

### **Order History (MongoDB):**
⚠️ **Shared with backend** - Server has copy
⚠️ **Payment data** - Needs encryption
✅ **Permanent** - Always available
✅ **Secure** - Database backups
✅ **Accountable** - Audit trail for compliance

---

## 🎯 SUMMARY

**PRESCRIPTIONS:**
- What: Medical document images
- Where: Browser localStorage (client-side)
- Why: Privacy, offline access
- Keep: User's private records

**ORDERS:**
- What: Order transactions & history
- Where: MongoDB (server-side)
- Why: Business records, tracking, payments
- Store: What user ordered, when, status, total

**The difference:** Prescriptions are private medical files. Orders are business transactions that need to be tracked, shipped, and paid for.

---

**Now let's build the professional Order History System! 📦**
