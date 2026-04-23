import express from "express";
import { requireAuth } from "../middleware/auth.js";

export function createMeRouter(db) {
  const router = express.Router();

  router.get("/", requireAuth, async (req, res) => {
    await db.read();
    const user = db.data.users.find(u => u.id === req.auth.userId);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    return res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  });

  return router;
}
