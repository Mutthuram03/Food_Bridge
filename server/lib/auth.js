import jwt from "jsonwebtoken";

export function signToken(user, jwtSecret) {
  return jwt.sign(
    { sub: String(user.id), role: user.role },
    jwtSecret,
    { expiresIn: "7d" }
  );
}

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;

  // For local development / demos only.
  // eslint-disable-next-line no-console
  console.warn("JWT_SECRET is not set; using an insecure default for local development.");
  return "dev-insecure-secret";
}
