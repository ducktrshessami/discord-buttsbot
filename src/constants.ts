import dotenv from "./dotenv.js";

await dotenv();

export const NODE_ENV = process.env.NODE_ENV || "development";
export const DB_FORCE = !!process.env.DB_FORCE && process.env.DB_FORCE.trim().toLowerCase() !== "false";
export const TOP_ENDPOINT = `https://top.gg/api/bots/${process.env.DISCORD_CLIENT_ID}/stats`;
export const PRESENCE_INTERVAL = parseInt(process.env.PRESENCE_INTERVAL!) || 1800000;
export const DISCORD_SWEEPER_INTERVAL = process.env.DISCORD_SWEEPER_INTERVAL ? parseInt(process.env.DISCORD_SWEEPER_INTERVAL) : 3600;
export const DISCORD_THREAD_LIFETIME = process.env.DISCORD_THREAD_LIFETIME ? parseInt(process.env.DISCORD_THREAD_LIFETIME) : 3600;
export const DISCORD_MESSAGE_LIFETIME = process.env.DISCORD_MESSAGE_LIFETIME ? parseInt(process.env.DISCORD_MESSAGE_LIFETIME) : 3600;
export const DISCORD_LIMITED_CACHE_MAX = process.env.DISCORD_LIMITED_CACHE_MAX ? parseInt(process.env.DISCORD_LIMITED_CACHE_MAX) : 100;
export const DISCORD_RESPONSE_COOLDOWN = envInt("DISCORD_RESPONSE_COOLDOWN", 30000);

function envInt(env: string, defaultValue: number): number {
    return process.env[env] ? parseInt(process.env[env]!) : defaultValue;
}
