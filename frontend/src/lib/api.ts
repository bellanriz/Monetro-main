import { auth } from "./firebase";

const API_BASE = "/api";

/**
 * Makes an authenticated API request to the backend.
 * Automatically attaches the Firebase ID token as a Bearer token.
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const user = auth.currentUser;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (user) {
    const token = await user.getIdToken();
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// --- User APIs ---
export const userApi = {
  getProfile: () => request<{ user: any }>("/users/me"),
  updateProfile: (data: { displayName?: string; role?: string; photoURL?: string }) =>
    request<{ user: any }>("/users/profile", { method: "POST", body: JSON.stringify(data) }),
  getKids: () => request<{ kids: any[] }>("/users/kids"),
};

// --- Transaction APIs ---
export const transactionApi = {
  list: (params?: { kidId?: string; limit?: number; status?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request<{ transactions: any[] }>(`/transactions?${query}`);
  },
  create: (data: {
    amount: number;
    type: string;
    category?: string;
    description?: string;
    location?: string;
    isOverseas?: boolean;
    cardType?: string;
  }) => request<{ transaction: any }>("/transactions", { method: "POST", body: JSON.stringify(data) }),
  approve: (id: string) =>
    request<{ message: string }>(`/transactions/${id}/approve`, { method: "PATCH" }),
  reject: (id: string) =>
    request<{ message: string }>(`/transactions/${id}/reject`, { method: "PATCH" }),
};

// --- Savings APIs ---
export const savingsApi = {
  list: (kidId?: string) => {
    const query = kidId ? `?kidId=${kidId}` : "";
    return request<{ goals: any[] }>(`/savings${query}`);
  },
  create: (data: { title: string; targetAmount: number; category?: string; deadline?: string }) =>
    request<{ goal: any }>("/savings", { method: "POST", body: JSON.stringify(data) }),
  deposit: (id: string, amount: number) =>
    request<{ message: string; newAmount: number }>(`/savings/${id}/deposit`, {
      method: "PATCH",
      body: JSON.stringify({ amount }),
    }),
  delete: (id: string) =>
    request<{ message: string }>(`/savings/${id}`, { method: "DELETE" }),
};

// --- Notification APIs ---
export const notificationApi = {
  list: () => request<{ notifications: any[] }>("/notifications"),
  markRead: (id: string) =>
    request<{ message: string }>(`/notifications/${id}/read`, { method: "PATCH" }),
  delete: (id: string) =>
    request<{ message: string }>(`/notifications/${id}`, { method: "DELETE" }),
};

// --- AI APIs ---
export const aiApi = {
  getInsights: (transactions: any[], role: string) =>
    request<{ insights: string }>("/ai/insights", {
      method: "POST",
      body: JSON.stringify({ transactions, role }),
    }),
  analyzeTransaction: (transaction: any) =>
    request<{ score: number; warning: string; isSuspicious: boolean }>("/ai/analyze-transaction", {
      method: "POST",
      body: JSON.stringify({ transaction }),
    }),
  scanReceipt: (data: { fileData?: string; fileName?: string; mimeType?: string; rawText?: string }) =>
    request<{ merchantName: string; totalAmount: number; items: any[]; location: string; date: string }>(
      "/ai/scan-receipt",
      { method: "POST", body: JSON.stringify(data) }
    ),
};

// --- Invite APIs ---
export const inviteApi = {
  list: () => request<{ invites: any[] }>("/invites"),
  send: (kidEmail: string) =>
    request<{ invite: any }>("/invites", { method: "POST", body: JSON.stringify({ kidEmail }) }),
  accept: (id: string) =>
    request<{ message: string }>(`/invites/${id}/accept`, { method: "PATCH" }),
  decline: (id: string) =>
    request<{ message: string }>(`/invites/${id}/decline`, { method: "PATCH" }),
};

// --- Allowance APIs ---
export const allowanceApi = {
  send: (kidId: string, amount: number, description?: string) =>
    request<{ transaction: any; message: string }>("/allowance/send", {
      method: "POST",
      body: JSON.stringify({ kidId, amount, description }),
    }),
};

// --- Rewards / Web3 APIs ---
export const rewardsApi = {
  getBalance: (walletAddress: string) =>
    request<{ walletAddress: string; balance: string; symbol: string }>(
      `/rewards/balance/${walletAddress}`
    ),
  mint: (kidId: string, action: string, walletAddress: string) =>
    request<{ message: string; txHash: string; etherscanUrl: string; amount: number }>(
      "/rewards/mint",
      { method: "POST", body: JSON.stringify({ kidId, action, walletAddress }) }
    ),
  getHistory: (kidId?: string) => {
    const query = kidId ? `?kidId=${kidId}` : "";
    return request<{ rewards: any[] }>(`/rewards/history${query}`);
  },
};
