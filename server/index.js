import express from "express";
import dotenv from "dotenv";
import { createDb } from "./lib/db.js";
import { createAuthRouter } from "./routes/auth.js";
import { createMeRouter } from "./routes/me.js";
import { createFoodListingsRouter } from "./routes/foodListings.js";
import { createDeliveriesRouter } from "./routes/deliveries.js";
import { createSheltersRouter } from "./routes/shelters.js";
import { createStatsRouter } from "./routes/stats.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

const db = await createDb();

app.use("/api/auth", createAuthRouter(db));
app.use("/api/me", createMeRouter(db));
app.use("/api/food-listings", createFoodListingsRouter(db));
app.use("/api/deliveries", createDeliveriesRouter(db));
app.use("/api/shelters", createSheltersRouter(db));
app.use("/api/stats", createStatsRouter(db));

// Basic error handler
app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`FoodBridge API listening on http://localhost:${port}`);
});
