# Smart Hostel Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application built to seamlessly manage university hostels. This system features role-based access for Students, Staff, and Administrators to handle complaints, track statuses, and manage hostel operations.

## Features

- **Role-Based Authentication**: Separate dashboards and permissions for Students, Staff, and Admins.
- **Complaint Management**: Students can raise issues (Electrical, Plumbing, WiFi, etc.) and track their real-time status.
- **Staff Assignment**: Admins can assign specific complaints to specialized staff members.
- **Feedback System**: Students can leave ratings and feedback once an issue is resolved.
- **Real-Time Analytics**: Visual charts for administrators to track complaint resolution efficiency.

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB Atlas
- **Deployment**: Fully optimized for **Vercel** Serverless Functions.

---

## Local Development

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed and a running MongoDB database (local or Atlas).

### 1. Install Dependencies
```bash
# This installs dependencies for both the frontend and the backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hostel_management?appName=hostel
```

### 3. Seed Initial Dummy Data
Run the seed script to populate the database with default users, staff, and admins:
```bash
npm run seed
```

### 4. Run the Application
Start both the React Vite frontend and the Express backend simultaneously:
```bash
npm run dev
```

---

## Default Test Users (Seeded)

**Student:**
- Username: `vats` (or `rahul@university.edu`)
- Password: `vats1234` (or `password123`)

**Staff:**
- Username: `vats@staff.edu`
- Password: `vats1234`

**Admin:**
- Username: `vats@admin.edu`
- Password: `vats1234`

---

## Vercel Deployment

This project is perfectly structured to be deployed instantly on Vercel utilizing their Serverless Functions architecture.

1. Import this repository into Vercel.
2. Ensure the **Framework Preset** is set to `Vite`.
3. Add a new Environment Variable in the Vercel Settings:
   - **Key**: `MONGO_URI`
   - **Value**: *Your MongoDB connection string*
4. Click **Deploy**.

> **Note:** Because Vercel Serverless Functions use dynamic IP addresses, you **must** configure your MongoDB Atlas Network Access to allow access from anywhere (`0.0.0.0/0`) or Vercel will not be able to connect to the database.
