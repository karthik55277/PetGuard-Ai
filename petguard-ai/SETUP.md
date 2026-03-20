# PetGuard AI - Setup Instructions

Welcome to PetGuard AI! This is a production-quality intelligent pet rescue, hygiene, and emergency assistant platform built with React (Vite), Node.js (Express), Supabase, and OpenAI.

## Prerequisites
- Node.js (v18+)
- npm or yarn
- Supabase account
- OpenAI API key

---

## 1. Database Setup (Supabase)

1. Go to [Supabase](https://supabase.com/). Create a new project.
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Open `backend/database/schema.sql` from this project and paste its contents into the SQL Editor.
4. Hit **Run** to create the `pets` and `sos` tables, set up Row Level Security (RLS), and enable Realtime for the `sos` table.
5. In your Supabase Dashboard, go to **Authentication -> Providers** and make sure Email/Password auth is enabled.

---

## 2. Backend Setup

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd petguard-ai/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Rename the `.env.example` file to `.env` (or create a new `.env` file) and add your OpenAI API Key:
   ```env
   PORT=5000
   OPENAI_API_KEY=sk-your-openai-api-key
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```
   *The server should now be running on `http://localhost:5000`.*

---

## 3. Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd petguard-ai/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Rename the `.env.example` file to `.env.local` (or create a new `.env.local` file) and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_API_URL=http://localhost:5000/api
   ```
   *(You can find these in your Supabase Dashboard under Settings -> API)*
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

---

## Usage

- **Home**: Overview of the platform.
- **AI Assistant**: Describe your pet's symptoms. The Express backend will securely communicate with OpenAI to evaluate severity and provide actionable advice.
- **SOS Dashboard**: Watch life-threatening emergencies populate in real-time via Supabase Subscriptions.
- **Pet Profiles**: Authenticate using Supabase to create and manage digital medical records for your pets.
- **Hygiene Guide**: View high-quality UI cards containing best practices for pet hygiene.

Enjoy building and extending PetGuard AI!
