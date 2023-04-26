import dotenv from "./dotenv.js";

await dotenv();

export const NODE_ENV = process.env.NODE_ENV || "development";
export const DB_FORCE = !!process.env.DB_FORCE && process.env.DB_FORCE.trim().toLowerCase() !== "false";
export const TOP_ENDPOINT = `https://top.gg/api/bots/${process.env.DISCORD_CLIENT_ID}/stats`;
export const PRESENCE_INTERVAL = parseInt(process.env.PRESENCE_INTERVAL!) || 1800000;
