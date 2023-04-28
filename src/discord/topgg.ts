import { Client } from "discord.js";
import { STATUS_CODES } from "http";
import { request } from "undici";
import { TOP_ENDPOINT } from "../constants.js";

async function pollServerCount(client: Client<true>): Promise<number | null> {
    if (client.shard) {
        console.log("[discord] Polling server count from shards");
        const results = await client.shard.broadcastEval(c => c.isReady() ? c.guilds.cache.size : null);
        return results.reduce((total, count) => (total === null || count === null) ? null : (total + count), 0);
    }
    else {
        return client.guilds.cache.size;
    }
}

export async function postServerCount(client: Client<true>): Promise<void> {
    if (process.env.TOP_TOKEN) {
        console.log("[discord] Posting server count to Top.gg");
        const guildCount = await pollServerCount(client);
        if (guildCount === null) {
            console.log("[discord] Not all shards are ready. Not posting server count to Top.gg");
            return;
        }
        const res = await request(TOP_ENDPOINT, {
            method: "POST",
            headers: {
                authorization: process.env.TOP_TOKEN,
                "content-type": "application/json"
            },
            body: `{"server_count":${guildCount}}`
        });
        if (res.statusCode !== 200) {
            throw new Error(`${res.statusCode} ${STATUS_CODES[res.statusCode]}`);
        }
    }
}
