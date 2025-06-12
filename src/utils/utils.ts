import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import { fileURLToPath } from "url";

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB path
const DB_PATH = path.join(__dirname, "..", "..", "books.json");

export const readDB = async () => {
  const data = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(data);
};

export const writeDB = async (data: any) => {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
};

export const getUniqueId = () => {
    const uuidString = uuid();
    return `${Date.now()}_${uuidString}`;
}