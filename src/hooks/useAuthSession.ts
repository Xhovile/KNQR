import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";

export function useAuthSession() {
  const [user, setUser] = useState<any>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async (onAfterSignOut?: () => void) => {
    try {
      await auth.signOut();
      setUser(null);
      onAfterSignOut?.();
    } catch (err: any) {
      console.error("Failed to sign out:", err?.message || String(err));
    }
  };

  return {
    user,
    setUser,
    isLoadingAuth,
    handleSignOut,
  };
}
