import { useEffect, useState } from "react";
import { auth, type AppUser } from "../lib/api";

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(() => auth.getUser());
  const [token, setToken] = useState<string | null>(() => auth.getToken());

  useEffect(() => {
    const sync = () => {
      setUser(auth.getUser());
      setToken(auth.getToken());
    };

    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return {
    user,
    token,
    isAuthed: !!token && !!user,
  };
}