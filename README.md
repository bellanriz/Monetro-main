# Monetro - Smart Family FinTech

A suitable family finance management app with AI-powered insights and blockchain-based rewards, built with React + Express + Firebase + Solidity.

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
│   │   └── routes/       # API routes (users, transactions, savings, ai, rewards, etc.)
│   ├── firestore.rules
│   ├── package.json
│   └── tsconfig.json
│
├── blockchain/        # Smart contracts & Web3 layer
│   ├── contracts/        # Solidity contracts (MonetroToken ERC-20)
│   ├── scripts/          # Deployment scripts
│   ├── test/             # Contract tests
│   ├── hardhat.config.ts
│   └── package.json
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

Copy the `.env.example` files:

```bash
cp backend/.env.example backend/.env
cp blockchain/.env.example blockchain/.env
```

Fill in your `GEMINI_API_KEY`, `GOOGLE_APPLICATION_CREDENTIALS`, `SEPOLIA_RPC_URL`, and `PRIVATE_KEY`.

### 3. Run in development

Start both frontend and backend in separate terminals:

```bash
# Terminal 1 - Backend (runs on port 3000)
npm run dev:backend

# Terminal 2 - Frontend (runs on port 5173, proxies /api to backend)
npm run dev:frontend
```

### 4. Deploy smart contracts

```bash
# Compile contracts
cd blockchain && npm run compile

# Deploy to Sepolia testnet
npm run deploy:sepolia

# Or deploy to a local Hardhat node
npm run node          # start local node in one terminal
npm run deploy:local  # deploy in another terminal
```

### 5. Build for production

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
- Ethers.js (blockchain interaction)
- Google Gemini AI (@google/genai)
- TypeScript + tsx (dev) / esbuild (prod)

**Blockchain / Web3:**
- Solidity 0.8.24
- Hardhat (development & deployment framework)
- OpenZeppelin Contracts (ERC-20, Ownable)
- Ethers.js (contract interaction from backend)
- Sepolia Testnet (Ethereum L1)

**Smart Contracts:**
- **MonetroToken (MNTR)** — ERC-20 reward token. Kids earn tokens for good financial habits like saving and staying under budget. The backend mints rewards via the `mintReward` / `batchMintRewards` functions.
