import express from "express";

export function createStatsRouter(db) {
  const router = express.Router();

  router.get("/", async (_req, res) => {
    await db.read();
    return res.json(db.data.stats);
  });

  return router;
}
