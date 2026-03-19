export type AuthUser = {
  name: string;
  email: string;
};

const USER_KEY = "auth_user";
const USERS_DB_KEY = "users_db";

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setAuthUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
}

export function registerUser(name: string, email: string, password: string): { ok: boolean; message?: string } {
  if (typeof window === "undefined") return { ok: false, message: "Browser storage unavailable" };
  const raw = localStorage.getItem(USERS_DB_KEY);
  const users = raw ? (JSON.parse(raw) as Array<{ name: string; email: string; password: string }>) : [];

  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, message: "Account already exists for this email." };
  }

  users.push({ name, email, password });
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  setAuthUser({ name, email });
  return { ok: true };
}

export function loginUser(email: string, password: string): { ok: boolean; message?: string } {
  if (typeof window === "undefined") return { ok: false, message: "Browser storage unavailable" };
  const raw = localStorage.getItem(USERS_DB_KEY);
  const users = raw ? (JSON.parse(raw) as Array<{ name: string; email: string; password: string }>) : [];
  const match = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!match) {
    return { ok: false, message: "Invalid credentials." };
  }

  setAuthUser({ name: match.name, email: match.email });
  return { ok: true };
}
