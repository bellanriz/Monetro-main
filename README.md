# Monetro - Smart Family FinTech

A family finance management app with AI-powered insights, built with React + Express + Firebase.

## Project Structure

```
Monetro/
├── frontend/          # React + Vite frontend app
│   ├── src/
│   │   ├── components/   # UI components (shadcn/ui, layout)
│   │   ├── hooks/        # Custom React hooks (useAuth, useTransactions, useSavings)
│   │   ├── lib/          # Utilities, Firebase client, API client
│   │   └── pages/        # Page components (Landing, ParentDashboard, KidDashboard)
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── backend/           # Express API server
│   ├── src/
│   │   ├── config/       # Firebase Admin SDK setup
│   │   ├── middleware/   # Auth middleware (token verification)
│   │   └── routes/       # API routes (users, transactions, savings, ai, etc.)
│   ├── firestore.rules
│   ├── package.json
│   └── tsconfig.json
│
├── package.json       # Root scripts for running both
└── .gitignore
```

## Getting Started

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Set up environment variables

Copy the `.env.example` in the `backend/` folder:

```bash
cp backend/.env.example backend/.env
```

Fill in your `GEMINI_API_KEY` and `GOOGLE_APPLICATION_CREDENTIALS`.

### 3. Run in development

Start both frontend and backend in separate terminals:

```bash
# Terminal 1 - Backend (runs on port 3000)
npm run dev:backend

# Terminal 2 - Frontend (runs on port 5173, proxies /api to backend)
npm run dev:frontend
```

### 4. Build for production

```bash
npm run build
```

Then start the production server:

```bash
npm run start
```

## Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- shadcn/ui + Radix UI
- Firebase Client SDK (Auth, Firestore)
- Framer Motion
- Recharts

**Backend:**
- Express.js
- Firebase Admin SDK
- Google Gemini AI (@google/genai)
- TypeScript + tsx (dev) / esbuild (prod)
