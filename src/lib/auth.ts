export const normalizeLoginIdentifier = (input: string) => {
  const trimmed = input.trim().toLowerCase();
  if (trimmed.includes("@")) return trimmed;
  // If user entered a username, convert to uniform auth email
  return `${trimmed.replace(/[^a-z0-9_.-]/g, "") || "user"}@varasaata.app`;
};

export const normalizeEmail = normalizeLoginIdentifier;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validatePassword(p: string): string | null {
  if (p.length < 6) return "Password must be at least 6 characters.";
  return null;
}

export function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login") || m.includes("invalid credentials"))
    return "Username/email or password is incorrect.";
  if (m.includes("already registered") || m.includes("already exists"))
    return "An account with this username or email already exists. Please sign in.";
  if (m.includes("rate limit")) return "Too many attempts. Please wait a minute and try again.";
  if (m.includes("failed to fetch") || m.includes("network"))
    return "You appear to be offline. Check your connection.";
  if (m.includes("pwned") || m.includes("weak"))
    return "This password is too common. Please choose another.";
  return message;
}
