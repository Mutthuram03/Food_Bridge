import express from "express";

export function createSheltersRouter(db) {
  const router = express.Router();

  router.get("/", async (_req, res) => {
    await db.read();
    return res.json(db.data.shelters);
  });

  return router;
}
