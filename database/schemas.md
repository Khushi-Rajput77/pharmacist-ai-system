# DATABASE SCHEMAS

## 1. MEDICINES COLLECTION
{
  _id: ObjectId,
  name: "Aspirin",
  genericName: "Acetylsalicylic acid",
  dosage: "500mg",
  unitType: "tablet",
  currentStock: 450,
  lowStockThreshold: 100,
  price: 15,
  prescriptionRequired: false,
  sideEffects: ["nausea", "headache"],
  interactions: ["warfarin", "ibuprofen"],
  usages: ["pain relief", "anti-inflammatory"],
  manufacturer: "Brand X",
  expiryDate: "2025-12-31",
  createdAt: 2025-01-14T10:00:00Z,
  updatedAt: 2025-01-14T10:00:00Z
}

## 2. CUSTOMERS COLLECTION
{
  _id: ObjectId,
  email: "patient@example.com",
  phoneNumber: "+91-9876543210",
  password: "hashed_password",
  firstName: "Raj",
  lastName: "Kumar",
  age: 45,
  gender: "M",
  address: "123 Main St, Mumbai",
  activeMedicines: ["ObjectId1", "ObjectId2"],
  prescriptions: [
    {
      medicineId: ObjectId,
      prescriptionDate: "2025-01-01",
      expiryDate: "2025-04-01",
      doctorName: "Dr. Sharma"
    }
  ],
  orderHistory: ["ORD001", "ORD002"],
  preferences: {
    preferredDeliveryTime: "morning",
    notificationChannel: ["whatsapp", "email"]
  },
  createdAt: 2025-01-14T10:00:00Z
}

## 3. ORDERS COLLECTION
{
  _id: ObjectId,
  orderId: "ORD001",
  customerId: ObjectId,
  medicines: [
    {
      medicineId: ObjectId,
      quantity: 10,
      dosage: "500mg",
      frequency: "as needed"
    }
  ],
  totalPrice: 450,
  status: "confirmed", // pending, confirmed, shipped, delivered, cancelled
  orderDate: 2025-01-14T10:00:00Z,
  deliveryDate: "2025-01-20",
  prescriptionVerified: true,
  createdAt: 2025-01-14T10:00:00Z
}

## 4. REFILL_ALERTS COLLECTION
{
  _id: ObjectId,
  customerId: ObjectId,
  medicineId: ObjectId,
  lastOrderDate: "2025-01-05",
  predictedRefillDate: "2025-02-05",
  frequency: 30,
  status: "pending", // pending, sent, acknowledged, ordered
  alertSentDate: 2025-01-14T10:00:00Z,
  createdAt: 2025-01-14T10:00:00Z
}

## 5. PRESCRIPTIONS COLLECTION
{
  _id: ObjectId,
  customerId: ObjectId,
  medicineId: ObjectId,
  doctorName: "Dr. Sharma",
  prescriptionDate: "2025-01-01",
  expiryDate: "2025-04-01",
  quantity: 100,
  dosageInstructions: "1 tablet twice daily",
  createdAt: 2025-01-14T10:00:00Z
}

## 6. ADMIN_USERS COLLECTION
{
  _id: ObjectId,
  email: "admin@pharmacy.com",
  password: "hashed_password",
  role: "admin", // admin, manager, staff
  permissions: ["view_inventory", "manage_orders", "edit_medicines"],
  createdAt: 2025-01-14T10:00:00Z
}