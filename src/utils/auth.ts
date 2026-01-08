/**
 * Security utilities for admin authentication
 * Uses SHA-256 hashing for password verification
 */

/**
 * Computes SHA-256 hash of a string
 * @param message - The string to hash
 * @returns Hex-encoded hash string
 */
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verifies a password against a stored hash
 * @param password - The plaintext password to verify
 * @param storedHash - The SHA-256 hash to compare against
 * @returns True if password matches
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const inputHash = await sha256(password);
  // Constant-time comparison to prevent timing attacks
  if (inputHash.length !== storedHash.length) return false;
  let result = 0;
  for (let i = 0; i < inputHash.length; i++) {
    result |= inputHash.charCodeAt(i) ^ storedHash.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Gets the admin password hash from environment variables
 * @returns The stored password hash or null if not configured
 */
export function getAdminPasswordHash(): string | null {
  const hash = import.meta.env.VITE_ADMIN_PASSWORD_HASH;
  if (!hash || hash === "your-sha256-hash-here") {
    console.warn(
      "Admin password hash not configured. Set VITE_ADMIN_PASSWORD_HASH in .env"
    );
    return null;
  }
  return hash;
}
