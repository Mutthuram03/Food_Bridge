import express from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signToken, getJwtSecret } from "../lib/auth.js";

export function createAuthRouter(db) {
  const router = express.Router();

  router.post("/register", async (req, res) => {
    const schema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(6),
      role: z.enum(["restaurant", "volunteer", "shelter"]),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const { name, email, password, role } = parsed.data;

    await db.read();
    const exists = db.data.users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return res.status(409).json({ error: "Email already exists" });

    const user = {
      id: Date.now(),
      name,
      email,
      role,
      passwordHash: await bcrypt.hash(password, 10),
    };

    db.data.users.push(user);
    await db.write();

    const token = signToken(user, getJwtSecret());
    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    return res.json({ token, user: safeUser });
  });

  router.post("/login", async (req, res) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(1),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const { email, password } = parsed.data;

    await db.read();
    const user = db.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash || "");
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken(user, getJwtSecret());
    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    return res.json({ token, user: safeUser });
  });

  return router;
}
