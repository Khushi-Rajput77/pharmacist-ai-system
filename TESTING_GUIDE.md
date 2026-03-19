# 🧪 PATIENT DASHBOARD - TESTING GUIDE

## ✅ Pre-Testing Checklist

Before you test, make sure:
- [ ] Backend is running on `http://localhost:5000`
- [ ] Frontend is running on `http://localhost:5173`
- [ ] MongoDB is connected and working
- [ ] No console errors in browser DevTools (F12)
- [ ] API endpoints are responding

### Quick Start Commands
```bash
# Terminal 1 - Backend
cd backend
npm install  # if needed
npm start
# Should show: Server running on port 5000

# Terminal 2 - Frontend
cd frontend
npm install  # if needed
npm run dev
# Should show: Local: http://localhost:5173
```

---

## 🧪 Testing Scenarios

### TEST 1: Landing Page Loads
**Purpose:** Verify landing page displays correctly
**Steps:**
1. Go to `http://localhost:5173`
2. Should see hero section with title "Meet Your AI Pharmacist"
3. Should see "Get Started Free" button
4. Scroll down to see Features, Testimonials, FAQ, Newsletter
5. Should see footer

**Expected Result:** Landing page loads with all sections ✅

---

### TEST 2: Register New Customer
**Purpose:** Test user registration flow
**Steps:**
1. Click "Get Started Free" button
2. Modal opens with two tabs: Login and Register
3. Click "Register" tab
4. Fill form with:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john@test.com`
   - Phone: `9876543210`
   - Address: `123 Main Street`
   - Password: `password123`
5. Click "Register" button
6. Wait for loading
7. Should redirect to `/dashboard`
8. Should see user profile with "John Doe"

**Expected Result:** 
- ✅ Registration successful
- ✅ Redirected to dashboard
- ✅ User profile shows correct name
- ✅ localStorage contains customerId

---

### TEST 3: Login with Existing Account
**Purpose:** Test user login flow
**Steps:**
1. Go to `http://localhost:5173`
2. Click "Get Started Free"
3. Stay on "Login" tab
4. Enter email: `john@test.com` (from TEST 2)
5. Enter password: `password123`
6. Click "Login" button
7. Should redirect to `/dashboard`

**Expected Result:**
- ✅ Login successful
- ✅ Correct user profile loads
- ✅ Dashboard shows user's data

---

### TEST 4: Login with Demo Account
**Purpose:** Quick login without registration
**Steps:**
1. Go to `http://localhost:5173`
2. Click "Get Started Free"
3. Click "Try Demo Account" button
4. Should automatically login and redirect
5. Dashboard appears

**Expected Result:**
- ✅ Demo login works
- ✅ First customer from DB is loaded
- ✅ Dashboard displays

---

### TEST 5: Dashboard Navigation
**Purpose:** Test navigation menu
**Steps:**
1. Log in successfully
2. See navigation bar at top
3. Click each menu item:
   - 📊 Dashboard → Should stay on same page
   - 💬 Chat & Order → Should navigate to `/chat`
   - 📄 Prescriptions → Should show "coming soon"
   - 📋 Order History → Should show "coming soon"
   - ⚙️ Settings → Should show "coming soon"
4. Click logo (🏥 AI Pharmacy) → Should return to dashboard

**Expected Result:**
- ✅ All navigation links work
- ✅ Routes load correctly
- ✅ Placeholder pages show for coming soon features

---

### TEST 6: Profile Display & Edit
**Purpose:** Test profile card and editing
**Steps:**
1. On dashboard, look at profile card (left side)
2. Should see:
   - User avatar with initials
   - Name: "John Doe"
   - Email
   - Member since date
   - Phone number
   - Address
3. Click "✏️ Edit Profile" button
4. Form appears with fields
5. Change First Name to "Jane"
6. Click "💾 Save Changes"
7. Should show success message
8. Profile card should update

**Expected Result:**
- ✅ Profile displays correctly
- ✅ Edit form opens
- ✅ Changes save successfully
- ✅ UI updates with new data

---

### TEST 7: Quick Order Button
**Purpose:** Test CTA button functionality
**Steps:**
1. On dashboard, look at "New Order" card (right side)
2. See three info cards: Chat, Verify, Confirm
3. Click "🛒 New Order" button
4. Should navigate to `/chat`
5. Chat interface should load

**Expected Result:**
- ✅ Button click works
- ✅ Navigate to chat page
- ✅ Chat interface loads

---

### TEST 8: View Recent Orders
**Purpose:** Test orders table and viewing details
**Steps:**
1. Click "📦 Recent Orders" tab
2. Should see table with columns:
   - Order ID
   - Date
   - Medicines count
   - Price (₹)
   - Status (badge with color)
   - Actions (View, Reorder buttons)
3. If no orders exist, should show empty state icon
4. If orders exist, click "👁️ View" button
5. Modal opens with order details:
   - Order ID
   - Order Date
   - Status
   - Medicine list with quantities
   - Total price
6. Click "Close" or "Reorder Now"

**Expected Result:**
- ✅ Orders display in table format
- ✅ Modal opens correctly
- ✅ Details show accurate information
- ✅ Modal closes properly

---

### TEST 9: Reorder from Orders
**Purpose:** Test order duplication
**Steps:**
1. In orders table, click "🔄 Reorder" button
2. Should show loading state
3. After completion, should show success message
4. Refresh button should show new order
5. New order should have same medicines and price

**Expected Result:**
- ✅ Reorder button works
- ✅ New order created in DB
- ✅ Same items copied to new order
- ✅ Success notification shown

---

### TEST 10: View Refill Alerts
**Purpose:** Test refill alerts display
**Steps:**
1. Click "🔔 Refill Alerts" tab
2. Should see alert cards with:
   - Urgency icon (🔴🟠🟡🟢)
   - Medicine name
   - Urgency badge (URGENT, HIGH, MEDIUM, LOW)
   - Days remaining
   - Dosage information
   - Two buttons: Reorder Now, Done
3. Check colors based on urgency:
   - Red (0 days) = Urgent
   - Orange (1-2 days) = High
   - Yellow (3-5 days) = Medium
   - Green (6+ days) = Low
4. If no alerts, show empty state

**Expected Result:**
- ✅ Alerts display correctly
- ✅ Colors match urgency levels
- ✅ Information is accurate
- ✅ Empty state shows if no alerts

---

### TEST 11: Quick Reorder from Alert
**Purpose:** Test fast reordering from alerts
**Steps:**
1. In Refill Alerts tab, click "🛒 Reorder Now" on any alert
2. Should show loading state
3. Order should be created
4. Alert status should update to "ordered"
5. Show success message

**Expected Result:**
- ✅ Quick reorder works
- ✅ Order created in DB
- ✅ Alert marked as ordered
- ✅ UI reflects changes

---

### TEST 12: Mark Alert as Done
**Purpose:** Test dismissing refill alerts
**Steps:**
1. Click "✓ Done" button on any alert
2. Alert should be removed from list
3. Could also show in different status

**Expected Result:**
- ✅ Alert dismissal works
- ✅ Alert status updates
- ✅ List refreshes

---

### TEST 13: Dashboard Refresh
**Purpose:** Test auto-refresh and manual refresh
**Steps:**
1. On dashboard, click "⟳ Refresh" button
2. Should show loading state
3. Data should re-fetch from API
4. Button should return to normal
5. Wait 30 seconds (auto-refresh)
6. Data should update automatically

**Expected Result:**
- ✅ Manual refresh works
- ✅ Data updates
- ✅ Auto-refresh works every 30s
- ✅ No duplicate requests

---

### TEST 14: Overview Stats
**Purpose:** Test stats display
**Steps:**
1. Click "📊 Overview" tab
2. Should see 4 stat cards:
   - Total Orders (count)
   - Pending Refills (count)
   - Last Order (date)
   - Status (🟢 Active)
3. Click on stat cards (should be interactive)
4. Stats should update when data changes

**Expected Result:**
- ✅ All stats display
- ✅ Correct counts shown
- ✅ Update after actions

---

### TEST 15: Logout Functionality
**Purpose:** Test logout and session clearing
**Steps:**
1. Click "🚪 Logout" button
2. Should show confirmation dialog
3. Click "Yes" to confirm
4. Should clear localStorage
5. Should redirect to landing page
6. Try accessing `/dashboard` directly
7. Should redirect back to `/`

**Expected Result:**
- ✅ Logout confirmation works
- ✅ Session cleared
- ✅ Redirected to landing page
- ✅ Protected routes blocked
- ✅ Need to login again

---

### TEST 16: Mobile Responsive Design
**Purpose:** Test mobile layout
**Steps:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone 12 (375px width)
4. Check elements:
   - Navigation bar should work
   - Click hamburger menu (☰)
   - Mobile menu should slide out
   - Profile & button should stack vertically
   - Orders table should scroll horizontally
   - Stats grid should be 2 columns
   - Text should be readable
5. Test all interactions on mobile

**Expected Result:**
- ✅ Responsive layout works
- ✅ Mobile menu functions
- ✅ All features accessible
- ✅ No horizontal scroll (except tables)
- ✅ Touch-friendly buttons

---

### TEST 17: Error Handling
**Purpose:** Test error scenarios
**Steps:**
1. **Register with existing email:**
   - Try registering with same email
   - Should show error message
   
2. **Wrong password:**
   - Try login with wrong password
   - Should show "Invalid password"
   
3. **Network error:**
   - Stop backend server
   - Try to load dashboard
   - Should show error message with retry
   
4. **Missing data:**
   - If order has no medicines
   - Should handle gracefully

**Expected Result:**
- ✅ Errors handled gracefully
- ✅ User-friendly error messages
- ✅ Retry options provided
- ✅ No crashes

---

### TEST 18: Form Validation
**Purpose:** Test input validation
**Steps:**
1. Try to register with:
   - Empty email → Should require
   - Invalid email → Should validate
   - Empty phone → Should require
   - Empty address → Optional (if set)
2. Try to login without email/password → Should require
3. Form should prevent submission if invalid

**Expected Result:**
- ✅ Required fields validated
- ✅ Email format validated
- ✅ Cannot submit invalid form
- ✅ Error messages shown

---

### TEST 19: Data Persistence
**Purpose:** Test localStorage persistence
**Steps:**
1. Login successfully
2. Open DevTools → Application → localStorage
3. Should see `customerId` key
4. Close browser tab
5. Open new tab, go to localhost:5173
6. Should still be logged in
7. Dashboard should load without logging in again
8. Log out
9. localStorage should be cleared

**Expected Result:**
- ✅ customerId persisted
- ✅ Auto-login works
- ✅ Logout clears storage
- ✅ Session works across tabs

---

### TEST 20: API Call Verification
**Purpose:** Verify API calls are working
**Steps:**
1. Open DevTools → Network tab
2. Log in and navigate dashboard
3. Should see API calls:
   - `GET /api/customers/:id` (profile)
   - `GET /api/orders/customer/:id` (orders)
   - `GET /api/refills/customer/:id` (alerts)
4. Click reorder
5. Should see `POST /api/orders`
6. Check response status (should be 200)
7. Check response data

**Expected Result:**
- ✅ All API calls made
- ✅ Status 200 OK
- ✅ Correct response format
- ✅ Data matches UI

---

## 📊 Test Summary Template

```
TEST RUN DATE: __________
TESTER: __________________
ENVIRONMENT: Local Dev

TESTS PASSED: ____ / 20
TESTS FAILED: ____ / 20

ISSUES FOUND:
□ Bug 1: _______________
□ Bug 2: _______________
□ Missing Feature: _____
□ Performance Issue: ____

NOTES:
_________________________
_________________________

READY FOR PRODUCTION: YES / NO
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot GET /dashboard"
**Solution:** Make sure React Router is working. Check that `<Router>` wraps all routes in App.jsx

### Issue 2: API returns 404
**Solution:** Check backend routes are correct. Make sure backend is running on :5000

### Issue 3: localStorage not working
**Solution:** Check browser allows localStorage. Might be in private mode - not allowed.

### Issue 4: Images/avatars not loading
**Solution:** Initials are generated from names. Check user has firstName/lastName

### Issue 5: Orders/Alerts not showing
**Solution:** Database might not have test data. Use reorder button to create new data.

### Issue 6: Modal not closing
**Solution:** Click outside modal or on close button (×). Also check click handlers in React DevTools.

### Issue 7: Mobile menu stuck open
**Solution:** Refresh page or click menu item to close. Then click hamburger again.

---

## ✅ Final Sign-Off

Once all tests pass:

```
✅ Patient Dashboard Implementation Complete
✅ All features working as expected
✅ No critical bugs found
✅ Mobile responsive working
✅ API integration verified
✅ Error handling working
✅ Performance acceptable

READY FOR: Next Feature Development (Voice Integration)
```

---

**Happy Testing! 🧪 Report any issues and we'll fix them. Then we move to Voice Integration! 🎤**
