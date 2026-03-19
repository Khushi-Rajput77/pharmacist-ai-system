## 🏗️ **ARCHITECTURE OVERVIEW - Phase 1 (Role-Based Access Control)**

---

## **System Architecture Diagram**

```
┌────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE (React)                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────┐         ┌──────────────────────┐        │
│  │   Landing Page       │         │  Route Guards        │        │
│  │  (Login/Register)    │         │  - ProtectedRoute    │        │
│  │                      │         │  - RoleRoute         │        │
│  │  ├─ Login Form       │         │  - PublicRoute       │        │
│  │  ├─ Register Form    │         │                      │        │
│  │  └─ JWT Validation   │         │  Authorization       │        │
│  └──────────────────────┘         │  Checks              │        │
│                                   └──────────────────────┘        │
│                                                                      │
│  ┌──────────────────────┐         ┌──────────────────────┐        │
│  │ Patient Dashboard    │         │ Admin Dashboard      │        │
│  │ (/dashboard)         │         │ (/admin/dashboard)   │        │
│  │                      │         │                      │        │
│  │ ├─ Profile           │         │ ├─ KPI Cards         │        │
│  │ ├─ Orders            │         │ ├─ Inventory         │        │
│  │ ├─ Chat              │         │ ├─ User Mgmt         │        │
│  │ ├─ Prescriptions     │         │ ├─ Orders            │        │
│  │ └─ Refills (own)     │         │ ├─ Refills (all)     │        │
│  │                      │         │ ├─ Analytics         │        │
│  │ State: AuthContext   │         │ └─ Reports           │        │
│  └──────────────────────┘         └──────────────────────┘        │
│                  ↓↑                            ↓↑                  │
│         Axios Interceptors          Axios Interceptors            │
│      (Auto-attach JWT Token)       (Auto-attach JWT Token)       │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘
                                 ↓↑
                    ┌────────────────────────┐
                    │  API Service Layer     │
                    │  (services/api.js)     │
                    │                        │
                    │ ├─ authAPI             │
                    │ ├─ medicineAPI         │
                    │ ├─ customerAPI         │
                    │ ├─ orderAPI            │
                    │ ├─ chatAPI             │
                    │ └─ refillAPI           │
                    └────────────────────────┘
                                 ↓↑
                    ┌────────────────────────┐
                    │   HTTP (Bearer Token)  │
                    │                        │
                    │ Authorization:         │
                    │ Bearer <JWT_TOKEN>     │
                    └────────────────────────┘
                                 ↓↑
┌────────────────────────────────────────────────────────────────────┐
│                    NODE.JS EXPRESS BACKEND                          │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  MIDDLEWARE LAYER                                            │ │
│  │                                                              │ │
│  │  authenticate()  ────────→ Verifies JWT Token               │ │
│  │                            - Decodes token                   │ │
│  │                            - Validates expiration            │ │
│  │                            - Attaches user to request        │ │
│  │                                                              │ │
│  │  authorize()     ────────→ Checks User Role                 │ │
│  │                            - Validates role permissions     │ │
│  │                            - Allows/denies access           │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                 ↓↑                                 │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  ROUTE LAYER                                                 │ │
│  │                                                              │ │
│  │  /api/customers/login ─────→ POST                           │ │
│  │  (public)                     Returns: JWT Token + Role     │ │
│  │                                                              │ │
│  │  /api/customers/register ──→ POST                           │ │
│  │  (public)                     Returns: JWT Token            │ │
│  │                                                              │ │
│  │  /api/orders ──────────────→ GET (authenticate)             │ │
│  │  (protected)                  Returns: Orders               │ │
│  │                                                              │ │
│  │  /api/admin/... ───────────→ GET/POST (authorize)           │ │
│  │  (admin only)                 Requires: admin/pharmacist    │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                 ↓↑                                 │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  MODEL LAYER (Database Schema)                               │ │
│  │                                                              │ │
│  │  Customer {                                                 │ │
│  │    _id: ObjectId                                            │ │
│  │    email: String (unique)                                   │ │
│  │    password: String (hashed)                                │ │
│  │    firstName: String                                        │ │
│  │    lastName: String                                         │ │
│  │    role: ['patient', 'admin', 'pharmacist']                │ │
│  │    isActive: Boolean                                        │ │
│  │    lastLogin: Date                                          │ │
│  │    loginHistory: Array<{timestamp, ipAddress}>             │ │
│  │    createdAt: Date                                          │ │
│  │    updatedAt: Date                                          │ │
│  │  }                                                          │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                 ↓↑                                 │
└────────────────────────────────────────────────────────────────────┘
                                 ↓↑
                    ┌────────────────────────┐
                    │    MONGODB DATABASE    │
                    │                        │
                    │ Collection: customers  │
                    │ - Email (unique)       │
                    │ - Role (indexed)       │
                    │ - isActive (indexed)   │
                    │ - Password (hashed)    │
                    │ - Audit fields         │
                    └────────────────────────┘

```

---

## **Authentication Flow Diagram**

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                            │
└─────────────────────────────────────────────────────────────────┘

1. USER REGISTRATION
═══════════════════════════════════════════════════════════════════

Frontend                          Backend
   │                                │
   ├─ Fill Register Form            │
   │  (email, password, role)       │
   │                                │
   ├─ POST /api/customers/register  │
   │─────────────────────────────→  │
   │                                │ Validate input
   │                                │ Hash password (bcrypt)
   │                                │ Create user in DB
   │                                │ Generate JWT token
   │                                │
   │  ← JSON Response ───────────── │
   │  {                              │
   │    token: "eyJhbGc...",         │
   │    customerId: "507f...",       │
   │    data: { role: "patient" }    │
   │  }                              │
   │                                │
   ├─ Save token in localStorage    │
   ├─ Store in AuthContext          │
   ├─ Redirect to /dashboard        │
   │                                │


2. USER LOGIN
═══════════════════════════════════════════════════════════════════

Frontend                          Backend
   │                                │
   ├─ Fill Login Form               │
   │  (email, password)             │
   │                                │
   ├─ POST /api/customers/login     │
   │─────────────────────────────→  │
   │                                │ Find user by email
   │                                │ Compare password (bcrypt)
   │                                │ Check if active
   │                                │ Generate JWT token
   │                                │ Log login activity
   │                                │
   │  ← JSON Response ───────────── │
   │  {                              │
   │    token: "eyJhbGc...",         │
   │    customerId: "507f...",       │
   │    data: {                      │
   │      email: "user@...",         │
   │      role: "patient",           │
   │      firstName: "John"          │
   │    }                            │
   │  }                              │
   │                                │
   ├─ Save token in localStorage    │
   ├─ Store in AuthContext          │
   ├─ Redirect based on role:       │
   │  • admin → /admin/dashboard    │
   │  • patient → /dashboard        │
   │                                │


3. PROTECTED API REQUEST
═══════════════════════════════════════════════════════════════════

Frontend                          Backend
   │                                │
   ├─ Need to fetch orders          │
   ├─ GET /api/orders               │
   │  + Authorization header        │
   │  + Bearer <token>              │
   │─────────────────────────────→  │
   │                                │ Interceptor: authenticate()
   │                                │  ├─ Extract token
   │                                │  ├─ Verify JWT signature
   │                                │  ├─ Check expiration
   │                                │  └─ Extract user info
   │                                │
   │                                │ Check authorization
   │                                │ Fetch data from DB
   │                                │
   │  ← JSON Response ───────────── │
   │  {                              │
   │    success: true,               │
   │    data: [...orders]            │
   │  }                              │
   │                                │
   ├─ Update UI with data           │
   │                                │


4. ADMIN-ONLY REQUEST
═══════════════════════════════════════════════════════════════════

Frontend                          Backend
   │                                │
   ├─ Admin tries to access         │
   │  /api/admin/users              │
   │  + Authorization header        │
   │  + Bearer <admin_token>        │
   │─────────────────────────────→  │
   │                                │ Middleware: authenticate()
   │                                │ Middleware: authorize(['admin'])
   │                                │
   │                                │ Check: user.role === 'admin' ?
   │                                │
   │                    YES ──────→ │ Fetch all users
   │                    NO  ──────→ │ Return 403 Forbidden
   │                                │
   │  ← JSON Response ───────────── │
   │  {                              │
   │    success: true,               │
   │    data: [...users]             │
   │  }                              │
   │                                │


5. TOKEN EXPIRATION
═══════════════════════════════════════════════════════════════════

Frontend                          Backend
   │                                │
   ├─ Make API request              │
   │  (token expired 24h ago)       │
   │─────────────────────────────→  │
   │                                │ Verify JWT
   │                                │ Token expired! ❌
   │                                │ Return 401 Unauthorized
   │                                │
   │  ← 401 Response ────────────── │
   │  {                              │
   │    success: false,              │
   │    message: "Invalid token"     │
   │  }                              │
   │                                │
   ├─ Interceptor catches 401       │
   ├─ Clear localStorage            │
   ├─ Clear AuthContext             │
   ├─ Redirect to /                 │
   │  (Re-login required)            │
   │                                │

```

---

## **Role-Based Access Control Matrix**

```
┌─────────────────────┬───────────────┬─────────────┬────────────────┐
│ Feature/Route       │ Patient Role  │ Admin Role  │ Pharmacist     │
├─────────────────────┼───────────────┼─────────────┼────────────────┤
│ /dashboard          │ ✅ Own data   │ ❌ Blocked  │ ❌ Blocked     │
│ /admin/dashboard    │ ❌ Blocked    │ ✅ Full     │ ✅ Full        │
│ /chat               │ ✅ Access     │ ❌ Blocked  │ ❌ Blocked     │
│ /prescriptions      │ ✅ Own only   │ ❌ Blocked  │ ✅ View all    │
│ /orders             │ ✅ Own orders │ ❌ Blocked  │ ✅ All orders  │
│ /profile            │ ✅ Own data   │ ✅ Own data │ ✅ Own data    │
│ /admin/users        │ ❌ Blocked    │ ✅ Full     │ ❌ Blocked     │
│ /admin/inventory    │ ❌ Blocked    │ ✅ Full     │ ✅ Read/Write  │
│ /admin/refills      │ ❌ Blocked    │ ✅ Full     │ ✅ Manage      │
│ /admin/analytics    │ ❌ Blocked    │ ✅ Full     │ ✅ View        │
├─────────────────────┼───────────────┼─────────────┼────────────────┤
│ API: GET /orders    │ ✅ Own only   │ ✅ All      │ ✅ All         │
│ API: POST /orders   │ ✅ Create     │ ❌ No       │ ❌ No          │
│ API: DELETE /orders │ ❌ No         │ ✅ Yes      │ ❌ No          │
│ API: GET /customers │ ❌ No         │ ✅ All      │ ❌ No          │
│ API: PATCH /user    │ ✅ Own only   │ ✅ Any      │ ✅ Own only    │
└─────────────────────┴───────────────┴─────────────┴────────────────┘
```

---

## **Data Flow: User Login**

```
User fills Login Form
         │
         ▼
Clicks "Login" Button
         │
         ▼
Frontend: handleLoginSubmit()
         │
         ├─ Validate email & password
         │
         └─ POST /api/customers/login
                   │
                   ▼
           Backend: loginRoute()
                   │
                   ├─ Find user by email
                   ├─ Compare password (bcrypt)
                   ├─ Check isActive
                   ├─ Generate JWT token
                   ├─ Log login activity
                   │
                   └─ Return {token, customerId, data}
                          │
                          ▼
Frontend: Receive response
         │
         ├─ handleLogin(response.data)
         │  ├─ Store token in localStorage
         │  ├─ Store customerId in localStorage
         │  ├─ Store role in localStorage
         │  ├─ Update AuthContext
         │  │
         │  └─ Check role
         │      ├─ If admin → navigate('/admin/dashboard')
         │      └─ If patient → navigate('/dashboard')
         │
         ▼
User sees appropriate dashboard
         │
         ├─ All future API calls
         │  ├─ Axios interceptor
         │  ├─ Attaches: Authorization: Bearer <token>
         │  └─ Backend validates on each request
         │
         ▼
User can perform role-based actions

```

---

## **Security Layers**

```
┌─────────────────────────────────────────┐
│      LAYER 1: Frontend Routes            │
│  ProtectedRoute / RoleRoute Guards       │
│      (Client-side, user-friendly)        │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│   LAYER 2: JWT Token Validation          │
│  (Verify signature & expiration)         │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  LAYER 3: Authentication Middleware      │
│  (Extract user from token)               │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  LAYER 4: Authorization Middleware       │
│  (Check user.role for endpoint)          │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  LAYER 5: Database Queries               │
│  (Only return data user has access to)   │
└─────────────────────────────────────────┘

```

---

## **Component Structure**

```
App.jsx
├── AuthProvider
│   ├── AuthContext
│   │   └── { isLoggedIn, userRole, token, handleLogin, handleLogout }
│   │
│   └── Routes
│       ├── Public Routes
│       │   └── <PublicRoute>
│       │       └── LandingPage
│       │
│       ├── Patient Routes
│       │   ├── <RoleRoute allowedRoles="patient">
│       │   │   ├── PatientDashboard
│       │   │   ├── ChatInterface
│       │   │   ├── PrescriptionUpload
│       │   │   ├── OrderHistory
│       │   │   └── UserProfilePage
│       │   │
│       │   └── <RouteGuards>
│       │       └── (Redirect if not patient)
│       │
│       └── Admin Routes
│           ├── <RoleRoute allowedRoles={['admin', 'pharmacist']}>
│           │   ├── AdminDashboard
│           │   │   ├── AdminNav
│           │   │   ├── KPI Cards
│           │   │   ├── Tabs (Overview, Refills, Inventory)
│           │   │   └── Tables (Orders, Medicines, Alerts)
│           │   │
│           │   ├── InventoryManager
│           │   ├── UserManagement
│           │   ├── OrderManagement
│           │   └── AnalyticsReports
│           │
│           └── <RouteGuards>
│               └── (Redirect if not admin)
```

---

**This architecture provides enterprise-grade RBAC at 70% project completion!** 🎉
