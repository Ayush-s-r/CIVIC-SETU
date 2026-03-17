import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "civicsetu.token";
const USER_KEY = "civicsetu.user";

export type Session = {
  token: string | null;
  user: any | null;
};

export async function saveSession(token: string, user: any) {
  await Promise.all([
    SecureStore.setItemAsync(TOKEN_KEY, token),
    SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)),
  ]);
}

export async function loadSession(): Promise<Session> {
  const [token, userJson] = await Promise.all([
    SecureStore.getItemAsync(TOKEN_KEY),
    SecureStore.getItemAsync(USER_KEY),
  ]);

  let user: any | null = null;
  if (userJson) {
    try {
      user = JSON.parse(userJson);
    } catch {
      user = null;
    }
  }

  return { token, user };
}

export async function clearSession() {
  await Promise.all([SecureStore.deleteItemAsync(TOKEN_KEY), SecureStore.deleteItemAsync(USER_KEY)]);
}

