# 🤖 MORPHIX — AI SaaS Application (PERN Stack)

**Morphix** is a fully functional **AI SaaS platform** built using the **PERN Stack** — PostgreSQL, Express, React, and Node.js.  
It enables users to generate AI-powered content, manipulate images, and manage premium subscriptions seamlessly.

---

## 🧠 Project Overview

This project demonstrates the complete process of building and deploying a modern **AI-powered SaaS application** — including authentication, subscription billing, and real-time AI utilities.

### ⚙️ Tech Stack
- **Frontend:** React.js (with Tailwind CSS)
- **Backend:** Node.js + Express.js
- **Database:** PostgreSQL (Serverless via Neon)
- **Authentication:** Clerk
- **AI Integration:** OpenAI / Stability API (for text & image generation)
- **Deployment:** Vercel (frontend) + Render / Railway / Neon (backend & DB)

---

## 🚀 Key Features

### 🔐 User Authentication
- Secure **Sign Up / Sign In**
- User profile management via **Clerk**
- Session handling and protected routes

### 💳 Subscription Billing
- **Premium Subscription System** for AI tools access
- Stripe integration (for payments)
- Dynamic access control based on subscription status

### 🧮 PostgreSQL Database
- Hosted using **Neon Serverless PostgreSQL**
- Stores user data, billing info, and AI activity logs
- Optimized schema for scalability and performance

---

## 🧠 AI-Powered Tools

| Feature | Description |
|----------|--------------|
| 📝 **Article Generator** | Provide a title and desired length to auto-generate articles using AI. |
| 📰 **Blog Title Generator** | Input keywords and category to generate catchy blog titles instantly. |
| 🖼️ **Image Generator** | Enter a creative prompt and get unique AI-generated images. |
| 🪄 **Background Remover** | Upload any image and automatically remove its background using AI. |
| 🧽 **Object Remover** | Upload an image and describe the object you want removed. |
| 📄 **Resume Analyzer** | Upload your resume to get a detailed AI-powered analysis and improvement report. |

---

## 🧩 Folder Structure

Morphix/
│
├── backend/ # Express + Node.js + PostgreSQL (Neon)
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ ├── config/
│ └── server.js
│
├── frontend/ # React + Tailwind + Clerk
│ ├── src/
│ ├── components/
│ ├── pages/
│ └── App.jsx
│
├── .gitignore
├── README.md
└── package.json


## 🛠️ Setup & Installation

### 1️⃣ Clone the Repository
git clone https://github.com/ganeshupadhyay-63/Morphix.git
cd Morphix
2️⃣ Install Dependencies

Backend:
cd backend
npm install

Frontend:
cd ../frontend
npm install
3️⃣ Add Environment Variables
Create .env files in both frontend and backend:

Backend .env:


DATABASE_URL=your_neon_postgres_url
CLERK_SECRET_KEY=your_clerk_secret
STRIPE_SECRET_KEY=your_stripe_key
OPENAI_API_KEY=your_openai_key
PORT=5000
Frontend .env:

VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=http://localhost:5000
🧪 Running the App Locally
Start the backend:
cd backend

npm run dev
Start the frontend:
cd ../frontend
npm run dev
Then open your browser →
👉 http://localhost:5173 (Frontend)
👉 http://localhost:8081 (Backend API)
