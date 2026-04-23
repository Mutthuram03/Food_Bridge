import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createSeedData } from "./seed.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, "..", "data");
const dbFile = path.join(dataDir, "db.json");

export async function createDb() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const adapter = new JSONFile(dbFile);
  const db = new Low(adapter, null);

  await db.read();
  if (!db.data) {
    db.data = createSeedData();
    await db.write();
  } else {
    // Ensure shape exists (for upgrades)
    db.data.users ||= [];
    db.data.foodListings ||= [];
    db.data.deliveries ||= [];
    db.data.shelters ||= [];
    db.data.stats ||= { mealsSaved: 0, restaurants: 0, volunteers: 0, wasteReduced: 0 };
    await db.write();
  }

  return db;
}
