import express from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middleware/auth.js";

export function createFoodListingsRouter(db) {
  const router = express.Router();

  router.get("/", async (_req, res) => {
    await db.read();
    return res.json(db.data.foodListings);
  });

  router.post("/", requireAuth, requireRole("restaurant"), async (req, res) => {
    const schema = z.object({
      name: z.string().min(1),
      type: z.string().optional().default("Other"),
      quantity: z.string().min(1),
      pickupTime: z.string().optional().default("ASAP"),
      expiryMs: z.number().optional(),
      location: z.string().min(1),
      image: z.string().optional().default("🍱"),
      lat: z.number().optional(),
      lng: z.number().optional(),
      distance: z.string().optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

    await db.read();
    const user = db.data.users.find(u => u.id === req.auth.userId);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const now = Date.now();
    const data = parsed.data;

    const listing = {
      id: Date.now(),
      name: data.name,
      type: data.type,
      quantity: data.quantity,
      pickupTime: data.pickupTime,
      expiryMs: typeof data.expiryMs === "number" ? data.expiryMs : now + 2 * 60 * 60 * 1000,
      location: data.location,
      image: data.image,
      restaurantId: user.id,
      restaurant: user.name,
      status: "Available",
      distance: data.distance || "0 km",
      lat: data.lat,
      lng: data.lng,
    };

    db.data.foodListings.unshift(listing);
    await db.write();

    return res.status(201).json(listing);
  });

  router.post("/:id/accept", requireAuth, requireRole("volunteer"), async (req, res) => {
    const id = Number(req.params.id);

    await db.read();

    const listing = db.data.foodListings.find(f => f.id === id);
    if (!listing) return res.status(404).json({ error: "Not found" });
    if (listing.status !== "Available") return res.status(409).json({ error: "Already assigned" });

    const user = db.data.users.find(u => u.id === req.auth.userId);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    listing.status = "Assigned";

    const delivery = {
      id: Date.now(),
      foodId: listing.id,
      food: listing.name,
      quantity: listing.quantity,
      restaurantId: listing.restaurantId,
      restaurant: listing.restaurant,
      volunteerId: user.id,
      volunteer: user.name,
      eta: "15 min",
      status: "In Transit",
    };

    db.data.deliveries.unshift(delivery);
    await db.write();

    return res.json({ listing, delivery });
  });

  return router;
}
