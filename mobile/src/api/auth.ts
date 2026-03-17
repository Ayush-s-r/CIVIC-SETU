import { apiRequest } from "./client";
import { saveSession } from "../services/session";

type AuthResponse = {
  user: { _id: string; name: string; email: string; role: "citizen" | "admin" | string };
  token: string;
};

export async function login(email: string, password: string): Promise<"citizen" | "admin"> {
  const res = await apiRequest<AuthResponse>("/users/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email, password }),
  });

  await saveSession(res.token, res.user);
  return (res.user.role === "admin" ? "admin" : "citizen") as "citizen" | "admin";
}

export async function signup(name: string, email: string, password: string): Promise<"citizen" | "admin"> {
  const res = await apiRequest<AuthResponse>("/users/register", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ name, email, password }),
  });

  await saveSession(res.token, res.user);
  return (res.user.role === "admin" ? "admin" : "citizen") as "citizen" | "admin";
}

