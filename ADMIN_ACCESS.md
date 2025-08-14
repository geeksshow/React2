# 🔐 Admin Panel Access Guide

## **Admin Credentials**
- **Email**: `admin@gmail.com`
- **Password**: `admin`
- **Role**: `admin`

## **How to Access Admin Panel**

### **Method 1: Direct URL**
1. Go to: `/admin-login`
2. Enter the credentials above
3. Click "Sign In to Admin Panel"
4. You'll be redirected to `/admin` (the dashboard)

### **Method 2: Through Navbar (if logged in as admin)**
1. Login with admin credentials
2. Click on your user icon in the navbar
3. Select "Admin Panel" from the dropdown menu

## **Admin Panel Features**

### **📊 Overview Dashboard**
- Total Users count
- Total Products count  
- Total Orders count
- Pending Products count

### **👥 User Management**
- View all users
- Block/Unblock users
- Promote users to admin
- See user status and roles

### **📦 Product Management**
- View all products
- See product status (approved/pending/rejected)
- Edit/Delete products
- View product details

### **⏳ Pending Approvals**
- Review submitted products
- Approve or reject products
- See who submitted each product

### **🛒 Order Management**
- View all orders
- See order status
- Track customer orders
- Order details and totals

### **⚙️ Settings**
- System configuration (coming soon)

## **Security Features**
- ✅ Route protection with `AdminRoute` component
- ✅ Role-based access control
- ✅ JWT token authentication
- ✅ Automatic redirect for non-admin users
- ✅ Session management

## **Important Notes**
- Only users with `role: 'admin'` can access the panel
- Admin routes are protected and require authentication
- Session expires when token is invalid
- All admin actions are logged and tracked

## **Troubleshooting**
- If you can't access the panel, check your user role
- Ensure you're logged in with admin credentials
- Check browser console for any errors
- Verify the backend server is running on port 3001

---
**⚠️ Keep admin credentials secure and change them in production!**
