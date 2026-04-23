import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";

export function createDeliveriesRouter(db) {
  const router = express.Router();

  router.get("/", async (_req, res) => {
    await db.read();
    return res.json(db.data.deliveries);
  });

  router.post("/:id/reached", requireAuth, requireRole("volunteer"), async (req, res) => {
    const id = Number(req.params.id);

    await db.read();
    const delivery = db.data.deliveries.find(d => d.id === id);
    if (!delivery) return res.status(404).json({ error: "Not found" });

    delivery.status = "Reached Shelter";
    await db.write();

    return res.json(delivery);
  });

  router.post("/:id/confirm", requireAuth, requireRole("shelter"), async (req, res) => {
    const id = Number(req.params.id);

    await db.read();
    const delivery = db.data.deliveries.find(d => d.id === id);
    if (!delivery) return res.status(404).json({ error: "Not found" });

    delivery.status = "Delivered";

    const listing = db.data.foodListings.find(f => f.id === delivery.foodId);
    if (listing) listing.status = "Delivered";

    // Update impact stats
    const stats = db.data.stats;
    stats.mealsSaved = (stats.mealsSaved || 0) + Math.floor(Math.random() * 20) + 10;
    stats.wasteReduced = Number(((stats.wasteReduced || 0) + 0.1).toFixed(1));

    await db.write();

    return res.json({ delivery, listing, stats });
  });

  return router;
}
