# 🚀 Quick Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running
- npm or yarn package manager

## Step 1: Install Dependencies
```bash
cd Backend
npm install
```

## Step 2: Environment Setup
1. Copy `env-template.txt` to `.env`
2. Edit `.env` file with your values:
   ```env
   MONGO_URL=mongodb://localhost:27017/raw_agro_db
   JWT_SECRET_KEY=your_super_secret_key_here
   NODE_ENV=development
   ```

## Step 3: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows (if installed as service)
# MongoDB should start automatically

# On macOS/Linux
mongod
```

## Step 4: Start Backend Server
```bash
npm start
```
Server will run on http://localhost:3001

## Step 5: Test the System
```bash
node test-auth.js
```

## Step 6: Frontend Integration
The frontend is now automatically connected to the backend!
- Signup form will create real users in MongoDB
- Login form will authenticate against the backend
- JWT tokens are stored in localStorage

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check if the connection string is correct
- Verify database name exists

### Port Already in Use
- Change PORT in .env file
- Or kill the process using port 3001

### JWT Errors
- Ensure JWT_SECRET_KEY is set in .env
- Make sure the key is long and random

## API Testing with Postman/Insomnia

### Register User
```
POST http://localhost:3001/api/user/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "firstname": "John",
  "lastname": "Doe",
  "phone": "1234567890",
  "company": "Test Farm"
}
```

### Login User
```
POST http://localhost:3001/api/user/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### Get Profile (Protected Route)
```
GET http://localhost:3001/api/user/profile
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

## Database Schema
The user collection will contain documents like:
```json
{
  "_id": "ObjectId",
  "email": "user@example.com",
  "firstname": "John",
  "lastname": "Doe",
  "password": "hashed_password",
  "phone": "1234567890",
  "company": "John's Farm",
  "role": "customer",
  "isBlocked": false,
  "img": "asfff.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Success Indicators
✅ Backend server starts without errors
✅ MongoDB connection successful
✅ Test script runs successfully
✅ Frontend forms submit to backend
✅ Users are created in database
✅ Login generates JWT tokens
