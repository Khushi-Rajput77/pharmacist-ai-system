## 🧪 **TESTING GUIDE - Phase 1 Role-Based Access Control**

---

## **Pre-Testing Setup**

### **1. Ensure Backend is Running**
```bash
cd backend
npm install  # If not done
npm start    # Should show "Server running on port 5000"
```

### **2. Ensure Frontend is Running**
```bash
cd frontend
npm install  # If not done
npm run dev  # Should show "Local: http://localhost:5173"
```

### **3. Check Database Connection**
```bash
# Verify MongoDB is running
# You should be able to access it from MongoDB Compass or mongosh
```

---

## **Manual Testing Scenarios**

### **TEST 1: Patient Registration & Login**

**Steps:**
1. Open http://localhost:5173
2. Click "Register" tab
3. Fill form:
   ```
   First Name: John
   Last Name: Doe
   Email: john@example.com
   Phone: 9876543210
   Address: 123 Main St
   Password: TestPass123
   Confirm: TestPass123
   ```
4. Click "Create Account"

**Expected Results:**
- ✅ No validation errors
- ✅ Account created successfully
- ✅ Automatically logged in
- ✅ Redirected to `/dashboard` (Patient Dashboard)
- ✅ Can see profile information
- ✅ URL shows `/dashboard`
- ✅ localStorage contains:
  - authToken (JWT)
  - customerId
  - userRole = "patient"
  - userData (JSON)

**Debug Tips:**
```javascript
// Check in browser console (F12)
console.log(localStorage.getItem('authToken'))
console.log(localStorage.getItem('userRole'))
```

---

### **TEST 2: Patient Login**

**Steps:**
1. Logout first (button in dashboard)
2. Click "Login" tab
3. Fill form:
   ```
   Email: john@example.com
   Password: TestPass123
   ```
4. Click "Login"

**Expected Results:**
- ✅ Login successful
- ✅ Redirected to `/dashboard`
- ✅ Can see patient dashboard
- ✅ Token stored in localStorage

---

### **TEST 3: Admin Account (Manual DB Creation)**

**Steps - Create Admin in MongoDB:**

Option A - Using MongoDB Compass:
```javascript
db.customers.insertOne({
  email: "admin@pharmacy.com",
  password: "$2b$10$...", // bcrypt hash of "AdminPass123!"
  firstName: "Admin",
  lastName: "User",
  role: "admin",
  isActive: true,
  lastLogin: new Date(),
  loginHistory: [],
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Option B - Using mongosh:
```bash
mongosh
> use pharmacy
> db.customers.insertOne({
    email: "admin@pharmacy.com",
    password: "$2b$10$...",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    isActive: true,
    lastLogin: new Date(),
    loginHistory: [],
    createdAt: new Date(),
    updatedAt: new Date()
  })
```

**To get bcrypt hash of "AdminPass123!":**
```javascript
// In Node.js console:
const bcrypt = require('bcrypt');
bcrypt.hashSync("AdminPass123!", 10)
// Output: $2b$10$... (copy this)
```

---

### **TEST 4: Admin Login**

**Steps:**
1. Go to http://localhost:5173
2. Click "Login" tab
3. Fill form:
   ```
   Email: admin@pharmacy.com
   Password: AdminPass123!
   ```
4. Click "Login"

**Expected Results:**
- ✅ Login successful
- ✅ Redirected to `/admin/dashboard` (NOT `/dashboard`)
- ✅ Can see Admin Dashboard with:
  - KPI Cards (Revenue, Orders, Customers, etc.)
  - Tab Navigation
  - Sidebar with menu
  - Admin-specific features
- ✅ localStorage shows role = "admin"

---

### **TEST 5: Role-Based Access Control**

**With Patient Account Logged In:**

**Try to access:**
```
http://localhost:5173/admin/dashboard
http://localhost:5173/admin/inventory
http://localhost:5173/admin/users
```

**Expected:**
- ✅ Redirected back to `/dashboard`
- ✅ Cannot see admin pages
- ✅ No errors in console

---

**With Admin Account Logged In:**

**Try to access patient features:**
```
http://localhost:5173/dashboard
http://localhost:5173/chat
http://localhost:5173/orders
```

**Expected:**
- ✅ Can access (admins have full access)
- ✅ Or redirected to `/admin/dashboard`

---

### **TEST 6: Token Expiration**

**Steps:**
1. Login as patient
2. Manually modify token in localStorage:
   ```javascript
   // In browser console (F12):
   localStorage.setItem('authToken', 'invalid-token')
   ```
3. Try to load a page
4. Make an API call (e.g., refresh orders)

**Expected Results:**
- ✅ API returns 401 error
- ✅ Interceptor catches 401
- ✅ localStorage is cleared
- ✅ Redirected to `/` (Landing page)
- ✅ Must login again

---

### **TEST 7: Logout Functionality**

**Steps:**
1. Login as any user
2. Find and click "Logout" button
3. Check browser console

**Expected Results:**
- ✅ Logged out successfully
- ✅ localStorage cleared of:
  - authToken
  - customerId
  - userRole
  - userData
- ✅ Redirected to `/` (Landing page)
- ✅ All dashboard features unavailable

---

### **TEST 8: Login Form Validation**

**Test Case 1: Empty Fields**
```
Email: (empty)
Password: (empty)
```
Expected: ✅ Shows error "Email and password are required"

**Test Case 2: Invalid Email Format**
```
Email: notanemail
Password: TestPass123
```
Expected: ✅ Browser validation shows "Please include an @ in the email"

**Test Case 3: Wrong Password**
```
Email: john@example.com
Password: WrongPassword
```
Expected: ✅ Shows error "Invalid email or password"

**Test Case 4: Non-existent Email**
```
Email: nouser@example.com
Password: TestPass123
```
Expected: ✅ Shows error "Invalid email or password"

---

### **TEST 9: Registration Form Validation**

**Test Case 1: Password Mismatch**
```
Password: TestPass123
Confirm Password: TestPass456
```
Expected: ✅ Error on submit: "Passwords do not match"

**Test Case 2: Short Password**
```
Password: Test1
Confirm Password: Test1
```
Expected: ✅ Error: "Password must be at least 6 characters"

**Test Case 3: Duplicate Email**
```
Email: john@example.com (already registered)
Password: NewPass123
```
Expected: ✅ Error: "Customer with email already exists"

**Test Case 4: Missing Required Fields**
```
(Any field empty except optional ones)
```
Expected: ✅ Error shown for missing field

---

### **TEST 10: API Request Headers**

**Check that requests include JWT:**

**Steps:**
1. Login as patient
2. Open Developer Tools (F12)
3. Go to Network tab
4. Click on any API request
5. Check "Headers" section

**Expected Results:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

**All requests should have Authorization header!**

---

### **TEST 11: Admin Dashboard Features**

**KPI Cards should display:**
- [ ] Total Revenue (₹ symbol)
- [ ] Total Orders (count)
- [ ] Active Customers (count)
- [ ] Pending Refills (count)
- [ ] Low Stock Items (count)
- [ ] Today's Revenue (₹ symbol)

**Navigation tabs should work:**
- [ ] Click "Overview" tab
- [ ] Click "Refills" tab
- [ ] Click "Inventory" tab
- [ ] Click "Orders" tab

**Sidebar should have:**
- [ ] Dashboard link (with icon)
- [ ] Inventory link
- [ ] Users link
- [ ] Orders link
- [ ] Refill Alerts link
- [ ] Analytics link
- [ ] Reports link
- [ ] Collapse button
- [ ] User profile section
- [ ] Logout button

---

### **TEST 12: Professional Styling**

**Check visual appearance:**

**Colors:**
- [ ] Primary color: #667eea (purple-blue)
- [ ] Background: Light gradient
- [ ] Sidebar: Dark gradient (#1a1a2e to #16213e)

**Typography:**
- [ ] Headers bold and large
- [ ] Labels clear
- [ ] Error messages red

**Spacing:**
- [ ] Cards have proper padding
- [ ] No overlapping elements
- [ ] Responsive on mobile

**Responsive Design:**
- [ ] Resize window (desktop → tablet → mobile)
- [ ] Sidebar should collapse on mobile
- [ ] Grid should adjust columns
- [ ] Text should remain readable

---

## **Automated Testing (Curl Commands)**

### **Test Login Endpoint**
```bash
curl -X POST http://localhost:5000/api/customers/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"TestPass123"}'

# Expected Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "customerId": "507f1f77bcf86cd799439011",
  "data": {
    "email": "john@example.com",
    "role": "patient",
    "firstName": "John"
  }
}
```

### **Test Protected Endpoint**
```bash
# Replace TOKEN with actual JWT from login
TOKEN="eyJhbGc..."

curl -X GET http://localhost:5000/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Expected: Success with orders array
```

### **Test Invalid Token**
```bash
curl -X GET http://localhost:5000/api/orders \
  -H "Authorization: Bearer invalid-token" \
  -H "Content-Type: application/json"

# Expected: 401 Unauthorized
```

### **Test Admin-Only Endpoint**
```bash
ADMIN_TOKEN="eyJhbGc..."

curl -X GET http://localhost:5000/api/customers \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"

# If patient: 403 Forbidden
# If admin: 200 OK with customers array
```

---

## **Browser DevTools Debugging**

### **Check Network Requests**
```
F12 → Network → (Make a request)
Click on request → Headers tab
Look for: Authorization: Bearer ...
```

### **Check LocalStorage**
```javascript
// Console (F12)
localStorage.getItem('authToken')        // Should show JWT
localStorage.getItem('userRole')         // Should show 'patient' or 'admin'
localStorage.getItem('customerId')       // Should show ObjectId
JSON.parse(localStorage.getItem('userData'))  // Should show user object
```

### **Check API Responses**
```javascript
// Console (F12)
// Make an API call, then:
// Network tab → Click request → Response tab
// Should see JSON response
```

### **Check Console Errors**
```
F12 → Console tab
Should see no red errors (only warnings acceptable)
```

---

## **Common Issues & Solutions**

### **Issue: Login fails with "Network Error"**
```
Solution: 
1. Ensure backend is running (npm start)
2. Check API_URL in frontend/src/services/api.js
3. Check CORS settings in backend
```

### **Issue: Token not being sent in requests**
```
Solution:
1. Check axios interceptor in api.js
2. Verify token is in localStorage
3. Check Network tab in DevTools
```

### **Issue: Admin dashboard not loading**
```
Solution:
1. Verify user role is 'admin' in localStorage
2. Check that admin exists in database
3. Verify JWT token is valid
```

### **Issue: Redirecting to wrong dashboard**
```
Solution:
1. Check user role in localStorage
2. Verify redirect logic in App.jsx
3. Check RoleRoute component
```

---

## **Test Results Checklist**

Print and check off each test:

**Authentication**
- [ ] Patient registration works
- [ ] Patient login works
- [ ] Admin login works
- [ ] Token is stored
- [ ] Token is sent in requests

**Authorization**
- [ ] Patient cannot access /admin routes
- [ ] Admin can access /admin routes
- [ ] Role-based redirect works
- [ ] Expired tokens redirect to login

**UI/UX**
- [ ] Patient dashboard displays
- [ ] Admin dashboard displays
- [ ] Sidebar navigation works
- [ ] Tab navigation works
- [ ] Professional styling visible
- [ ] Responsive design works

**Security**
- [ ] Invalid token returns 401
- [ ] Expired token triggers logout
- [ ] localStorage cleared on logout
- [ ] Passwords are hashed
- [ ] Role is enforced

**Edge Cases**
- [ ] Empty form validation works
- [ ] Duplicate email handling works
- [ ] Network error handling works
- [ ] Page reload maintains session

---

## **Final Verification**

Before considering Phase 1 complete, verify:

```
✅ All manual tests pass
✅ All curl tests work
✅ DevTools shows correct headers
✅ UI looks professional
✅ No console errors
✅ Responsive on mobile
✅ Login/logout works smoothly
✅ Role-based access enforced
✅ Database has audit logs
```

---

**Testing Complete? Ready for Phase 2! 🎉**

Next: Build remaining admin features (Inventory, Orders, Analytics)
