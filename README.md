[hostel-management-git-master-alwadhivgmailcoms-projects.vercel.app](https://hostel-management-eosin.vercel.app/login)
# 🏠 Smart Hostel Management System

A full-stack **MERN** (MongoDB, Express, React, Node.js) application built to seamlessly manage university hostels. It features role-based access for Students, Staff, and Administrators to handle complaints, track statuses, and manage hostel operations — deployable as Vercel Serverless Functions.

---

## ✨ Features

### 👨‍🎓 Student
- Register and log in with registration number or email
- Raise complaints by category (Electrical, Plumbing, WiFi, Furniture, Sanitation, Other)
- Track the real-time status of active complaints
- View full complaint history
- Submit star ratings and feedback once an issue is resolved

### 🔧 Staff
- View complaints assigned by admin
- Update complaint status (Pending → In Progress → Resolved)
- Add resolution notes for each complaint

### 🛡️ Admin
- View all complaints across all blocks and rooms
- Assign complaints to specialized staff members
- Set or update complaint priority (Low / Medium / High)
- Access analytics dashboard with visual charts (powered by Chart.js) for complaint resolution efficiency
- View all student feedback

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router DOM v6 |
| HTTP Client | Axios |
| Charts | Chart.js + react-chartjs-2 |
| Icons | react-icons |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB Atlas |
| Deployment | Vercel (Serverless Functions) |

---

## 📁 Project Structure

```
hostel-management/
├── backend/
│   ├── .env                    # Environment variables (not committed)
│   └── ...                     # Express server, routes, models, seed script
├── src/
│   ├── components/
│   │   ├── common/             # Reusable UI: Button, Card, Modal, Badge, InputField, Spinner
│   │   └── layout/             # Navbar, Sidebar
│   ├── context/
│   │   └── AuthContext.jsx     # Auth state + dark mode (persisted via localStorage)
│   ├── pages/
│   │   ├── admin/              # AdminDashboard
│   │   ├── auth/               # Login, Register
│   │   ├── staff/              # StaffDashboard
│   │   └── student/            # StudentDashboard, RaiseComplaint, TrackComplaints,
│   │                           # ComplaintHistory, Feedback
│   ├── routes/
│   │   └── ProtectedRoute.jsx  # Role-based route guard
│   ├── services/
│   │   └── api.js              # API service layer
│   └── utils/
│       └── index.js            # Shared utility functions
├── index.html
├── vite.config.js
├── tailwind.config.js
└── vercel.json
```

---

## 🚀 Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) 18+
- A running MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### 1. Clone the Repository

```bash
git clone https://github.com/Vatsalwadhi/hostel-management.git
cd hostel-management
```

### 2. Install Dependencies

```bash
# Installs dependencies for both the frontend and the backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hostel_management?appName=hostel
```

### 4. Seed the Database

Populate the database with default users, staff, admins, and sample complaints:

```bash
npm run seed
```

### 5. Run the Application

Start both the React Vite frontend and the Express backend simultaneously:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔑 Demo Credentials

Use these pre-seeded accounts to explore each role:

| Role | Username / Email | Password |
|---|---|---|
| Student | `vats` or `rahul@university.edu` | `vats1234` or `password123` |
| Student | `REG2024001` | `password123` |
| Staff | `vats@staff.edu` | `vats1234` |
| Staff | `rajesh@university.edu` | `password123` |
| Admin | `vats@admin.edu` | `vats1234` |
| Admin | `admin@university.edu` | `admin123` |

---

## 🌙 Additional Features

- **Dark mode** — toggle from the Navbar; applied via Tailwind's `dark` class on `<html>`
- **Persistent sessions** — login state is saved to `localStorage` and restored on page reload
- **Protected routes** — each role can only access its own pages; unauthorized access redirects to `/login`

---

## ☁️ Vercel Deployment

This project is structured for instant deployment on [Vercel](https://vercel.com) using their Serverless Functions architecture.

1. Import this repository into Vercel.
2. Set the **Framework Preset** to `Vite`.
3. Add the following Environment Variable in Vercel project settings:

   | Key | Value |
   |---|---|
   | `MONGO_URI` | Your MongoDB Atlas connection string |

4. Click **Deploy**.

> ⚠️ **Important:** Vercel Serverless Functions use dynamic IP addresses. You **must** configure MongoDB Atlas Network Access to allow connections from anywhere (`0.0.0.0/0`), otherwise Vercel will not be able to reach the database.

You can also deploy via the Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
