import { useState, useEffect, useCallback } from "react";
import { rewardsApi } from "@/lib/api";

export interface FamilyMember {
  name: string;
  avatar: string;
  role: string;
  walletAddress?: string;
}

export interface MemberBalance {
  name: string;
  avatar: string;
  role: string;
  walletAddress?: string;
  balance: number;
  loading: boolean;
  error?: string;
}

// Family members with their wallet addresses
// Replace these with real wallet addresses from Firestore in production
const FAMILY_MEMBERS: FamilyMember[] = [
  { name: "Isac", avatar: "/images/isac.png", role: "Son", walletAddress: import.meta.env.VITE_WALLET_ISAC },
  { name: "Alisya", avatar: "/images/alisya.png", role: "Daughter", walletAddress: import.meta.env.VITE_WALLET_ALISYA },
  { name: "Nadine", avatar: "/images/nadine.png", role: "Wife", walletAddress: import.meta.env.VITE_WALLET_NADINE },
  { name: "Mom", avatar: "/images/grandma.png", role: "Grandmother", walletAddress: import.meta.env.VITE_WALLET_MOM },
  { name: "Dad", avatar: "/images/grandpa.png", role: "Grandfather", walletAddress: import.meta.env.VITE_WALLET_DAD },
];

/**
 * Hook to fetch real MNTR token balances from the blockchain via the backend API.
 * Falls back gracefully when wallet addresses aren't configured or the API is unavailable.
 */
export function useTokenBalances() {
  const [balances, setBalances] = useState<MemberBalance[]>(
    FAMILY_MEMBERS.map((m) => ({ ...m, balance: 0, loading: true }))
  );
  const [totalBalance, setTotalBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const results: MemberBalance[] = await Promise.all(
      FAMILY_MEMBERS.map(async (member) => {
        if (!member.walletAddress) {
          return { ...member, balance: 0, loading: false, error: "No wallet configured" };
        }

        try {
          const data = await rewardsApi.getBalance(member.walletAddress);
          return { ...member, balance: parseFloat(data.balance), loading: false };
        } catch (err: any) {
          return { ...member, balance: 0, loading: false, error: err.message };
        }
      })
    );

    setBalances(results);
    setTotalBalance(results.reduce((sum, m) => sum + m.balance, 0));
    setIsLoading(false);

    // Set overall error only if ALL requests failed
    const allFailed = results.every((r) => r.error);
    if (allFailed && results.length > 0) {
      setError("Unable to fetch token balances. Check backend connection.");
    }
  }, []);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return { balances, totalBalance, isLoading, error, refetch: fetchBalances };
}
