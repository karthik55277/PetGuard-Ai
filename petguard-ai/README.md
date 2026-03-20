<div align="center">
  <h1>🐾 PetGuard AI</h1>
  <p><strong>Your intelligent companion for pet emergency response, hygiene, and daily care.</strong></p>

  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
  ![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
  ![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)
  ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
</div>

---

## 📖 Overview

**PetGuard AI** is a production-quality, intelligent pet care platform designed to assist pet owners in ensuring the safety, health, and well-being of their furry friends. Built with a modern, responsive tech stack, PetGuard AI provides critical tools like an AI-driven symptom checker, a real-time SOS alert system, comprehensive medical profiles, and expert grooming guides.

Whether you're facing a sudden emergency or just looking to maintain your pet's daily hygiene, PetGuard AI is your all-in-one digital pet care assistant.

## ✨ Core Features

### 🧠 Emergency AI Assistant
Input your pet's current symptoms, behaviors, or incidents into the AI Assistant. The backend securely interfaces with the **OpenAI API** to assess the situation instantly, providing you with actionable next steps and a color-coded severity index:
- 🔴 **Red**: HIGH Severity - Immediate veterinary attention required.
- 🟡 **Yellow**: MEDIUM Severity - Monitor closely and consult a vet soon.
- 🟢 **Green**: LOW Severity - Minor issue, actionable at-home care advice provided.

### 🚨 Real-time SOS Dashboard
Every second counts. Broadcast life-threatening emergencies instantly to your local community. The platform pushes real-world coordinates and distress notes to a live dashboard, powered by **Supabase Realtime subscriptions**.

### 🐕 Pet Profile Management
Keep all vital records in one secure place. Add your pets, specify their breeds, ages, weights, and maintain comprehensive medical and vaccination notes safely behind **Supabase Authentication**.

### 🧼 Hygiene & Grooming Guides
Keep your best friend clean, happy, and healthy. Access beautifully crafted, step-by-step interactive UI guides on essential care routines including tick removal, bathing, ear cleaning, and nail trimming.

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite), Tailwind CSS, React Router DOM, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js, OpenAI API Integration.
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security, Realtime Subscriptions, Email Authentication).

---

## 📂 Project Structure

```text
petguard-ai/
├── backend/                  # Node.js + Express API server
│   ├── controllers/          # Request handlers (e.g., aiController)
│   ├── routes/               # Express route definitions
│   └── server.js             # Entry point
├── frontend/                 # React frontend application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page-level components
│   │   ├── services/         # API and Supabase client configs
│   │   └── App.jsx           # Main React component & Routing
│   ├── tailwind.config.js    # Tailwind setup
│   └── vite.config.js        # Vite bundler config
└── README.md
```

---

## 🚀 Setup & Running Locally

For detailed, step-by-step instructions on setting up environment variables, database schema, and starting the local development servers, please refer to the [SETUP.md](./SETUP.md) file.

### Quick Start:

**1. Clone the repository:**
```bash
git clone https://github.com/karthik55277/PetGuard-Ai.git
cd PetGuard-Ai
```

**2. Install dependencies:**
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

**3. Configure Environment Variables:**
Set up `.env` files in both the `frontend` and `backend` directories with your Supabase and OpenAI credentials. (See `SETUP.md` for exact keys).

**4. Start Development Servers:**
```bash
# Terminal 1 (Frontend)
cd frontend
npm run dev

# Terminal 2 (Backend)
cd backend
npm run dev
```

---

*This application was built as a modern, production-ready project to showcase full-stack development, modern UI/UX design, real-time database capabilities, and AI integration.*
