const { request } = require("undici");
const { STATUS_CODES } = require("http");

async function postServerCount(client) {
    if (process.env.TOP_TOKEN && client.isReady()) {
        // console.log("[discord] Polling server count");
        // const results = await client.shard.broadcastEval(client => client.isReady() ? client.guilds.cache.size : null);
        // const guildCount = results.reduce((total, count) => (total === null || count === null) ? null : (total + count), 0);
        // if (guildCount === null) {
        //     console.log("[discord] Not all shards are ready. Not posting server count to Top.gg");
        // }
        // else {
        const guildCount = client.guilds.cache.size;
        console.log("[discord] Posting server count to Top.gg");
        const res = await request(`https://top.gg/api/bots/${client.user.id}/stats`, {
            method: "POST",
            headers: {
                Authorization: process.env.TOP_TOKEN,
                "content-type": "application/json"
            },
            body: `{"server_count":${guildCount}}`
        });
        if (res.statusCode < 200 || res.statusCode >= 300) {
            throw new Error(`${res.statusCode} ${STATUS_CODES[res.statusCode]}`);
        }
        // }
    }
}

module.exports = postServerCount;
