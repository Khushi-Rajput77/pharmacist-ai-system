# 🚀 Quick Reference - User Profile & Analytics

## How to Access the New Pages

### From Dashboard Navigation (Top Menu):

```
Navigation Menu Items:
├── 📊 Dashboard (existing)
├── 💬 Chat & Order (existing)
├── 📄 Prescriptions (existing)
├── 📋 Order History (existing)
├── 👤 Profile ← NEW
└── 📊 Analytics ← NEW
```

### Direct URLs:
- **User Profile**: `http://localhost:5173/profile`
- **Analytics & Reports**: `http://localhost:5173/analytics`

---

## 👤 **User Profile Page** - Features

### Main Sections:

#### 1. **Profile Sidebar**
- User avatar with initials
- Active status badge
- Total orders count
- Total spending amount
- Edit Profile button
- Logout button
- Settings panel with toggles

#### 2. **Profile Information Tab**
**View Mode:**
- Display all user information
- Clean, read-only format
- Edit Profile button
- Account Actions section

**Edit Mode:**
- Editable form fields
- First name, last name
- Email address
- Phone number
- Full address
- Form validation with error messages
- Save Changes button
- Cancel button

#### 3. **Prescription History Tab**
- List of all prescriptions
- Medicine name and dosage
- Prescribing doctor name
- Prescription date
- Status indicator (Active/Completed)
- View Details button
- Color-coded status

#### 4. **Settings Panel**
- Email Notifications toggle
- Email Reminders toggle
- SMS Alerts toggle
- Marketing Emails toggle
- All with on/off switches

---

## 📊 **Analytics & Reports** - Sections

### 1. **Header Section**
- Back to Dashboard button
- Page title
- Period selector (Week/Month/Year buttons)
- Auto-updating based on selected period

### 2. **Key Metrics Grid** (3 Cards)

**Total Orders Card:**
- Order count (156)
- Trend indicator (↑ +12%)
- Order status breakdown:
  - Completed: 128
  - Pending: 18
  - Cancelled: 10

**Total Revenue Card** (Featured - Gradient):
- Revenue amount (₹38,450.75)
- Trend indicator (↑ +18%)
- Average revenue per day
- Professional gradient styling

**Active Customers Card:**
- Customer count (342)
- Trend indicator (↑ +8%)
- New customers this month: 42
- Returning customers: 156

### 3. **Daily Revenue Chart**
- 7-day revenue visualization
- Color-coded bars with gradients
- Revenue values displayed on bars
- Interactive hover effects
- Professional bar chart

### 4. **Popular Medicines Section**
Shows top 5 medicines with:
- Medicine name
- Trend indicator (Up/Down/Stable)
- Order count
- Revenue generated
- Progress bar
- Professional card layout

### 5. **Order Status Distribution**
Three cards showing:
- **Completed Orders** (Green) - Count & percentage
- **Pending Orders** (Orange) - Count & percentage  
- **Cancelled Orders** (Red) - Count & percentage

### 6. **Summary Statistics Grid**
- Average order value
- Orders per customer
- Revenue per customer
- Success rate percentage

### 7. **Export Section**
Buttons for:
- Export as PDF
- Export as Excel
- Email Report

---

## 🔧 **How to Use Each Feature**

### User Profile - Editing

1. Click **"👤 Profile"** in navigation
2. Click **"✎ Edit Profile"** button
3. Modify any field:
   - First name
   - Last name
   - Email
   - Phone
   - Address
4. Fix any validation errors (shown in red)
5. Click **"✓ Save Changes"** to save
6. Success message appears (auto-dismisses after 3 seconds)

### User Profile - View Prescriptions

1. Click **"👤 Profile"** in navigation
2. Click **"💊 Prescription History"** tab
3. See all prescriptions with:
   - Medicine names & dosages
   - Doctor who prescribed
   - Prescription dates
   - Active/Completed status
4. Click **"📋 View Details"** for more info

### User Profile - Settings

1. Click **"👤 Profile"** in navigation
2. Scroll to settings panel (right sidebar)
3. Toggle any setting on/off:
   - Notifications
   - Email Reminders
   - SMS Alerts
   - Marketing Emails

### Analytics - View Reports

1. Click **"📊 Analytics"** in navigation
2. (Optional) Select time period:
   - Click "Week" / "Month" / "Year"
   - Charts update accordingly
3. View all metrics and charts
4. Scroll through all sections

### Analytics - Export Reports

1. Go to Analytics & Reports page
2. Scroll to bottom "📥 Export Reports" section
3. Click desired button:
   - **📄 Export as PDF** - Download PDF report
   - **📊 Export as Excel** - Download Excel spreadsheet
   - **📧 Email Report** - Email report to email address

---

## 🎨 **Design Elements**

### Colors Used:
- **Primary Blue**: `#0369A1` - Headers, buttons
- **Secondary Blue**: `#1E40AF` - Gradients
- **Success Green**: `#059669` - Completed, positive metrics
- **Warning Orange**: `#F59E0B` - Pending, caution
- **Danger Red**: `#DC2626` - Cancelled, errors
- **Background Gray**: `#F8FAFC` - Page background
- **Text Dark**: `#1F2937` - Body text
- **Text Light**: `#6B7280` - Secondary text

### Responsive Breakpoints:
- **Desktop**: 1200px+ (full features)
- **Tablet**: 768px - 1199px (adjusted layout)
- **Mobile**: < 768px (single column, stacked)

---

## 📝 **Form Validation** (Profile Page)

All fields have validation:

| Field | Required | Valid Format |
|-------|----------|--------------|
| First Name | Yes | Non-empty text |
| Last Name | Yes | Non-empty text |
| Email | Yes | Valid email format |
| Phone | Yes | Non-empty |
| Address | Yes | Non-empty text |

Errors appear in red below field. Fix and try again.

---

## 🔐 **Logout from Profile Page**

1. Click **"🚪 Logout"** button in Profile Card
2. Confirm logout in popup
3. You'll be returned to login page
4. Your session is cleared

---

## 📊 **Mock Data Details**

### User Profile Mock Data:
- **Name**: John Doe
- **Email**: john.doe@example.com
- **Phone**: +91 98765 43210
- **Address**: 123 Medical Street, Health City, HC 12345
- **Member Since**: November 2024
- **Total Orders**: 12
- **Total Spent**: ₹2,450.50

### 4 Sample Prescriptions:
1. Lisinopril (10mg) - Active - Dr. Sarah Johnson
2. Metformin (500mg) - Active - Dr. Rajesh Kumar
3. Atorvastatin (20mg) - Active - Dr. Sarah Johnson
4. Aspirin (75mg) - Completed - Dr. Priya Patel

### Analytics Mock Data:
- **Total Orders**: 156
- **Total Revenue**: ₹38,450.75
- **Active Customers**: 342
- **Popular Medicines**: 5 top medicines with orders & revenue
- **Daily Revenue**: 7 days of data
- **Order Status**: 128 completed, 18 pending, 10 cancelled

---

## ⚡ **Performance Notes**

- ✅ Pages load instantly with mock data
- ✅ Smooth animations (300-400ms transitions)
- ✅ Responsive layouts adapt to screen size
- ✅ Mobile-optimized for touch devices
- ✅ No external dependencies (pure React + CSS)

---

## 🎯 **Next Steps for Backend Integration**

When ready to connect to your backend:

1. **User Profile API Endpoints**:
   - `GET /api/users/{customerId}` - Fetch user data
   - `PUT /api/users/{customerId}` - Update user profile
   - `GET /api/prescriptions/{customerId}` - Fetch prescriptions

2. **Analytics API Endpoints**:
   - `GET /api/analytics/orders` - Order statistics
   - `GET /api/analytics/revenue` - Revenue data
   - `GET /api/analytics/customers` - Customer stats
   - `GET /api/analytics/medicines` - Popular medicines
   - `GET /api/analytics/daily-revenue` - Daily data
   - `GET /api/analytics/export` - Export reports

---

**Status**: ✅ Fully Functional & Ready to Use
**Test the pages now by clicking the links in the navigation menu!**
