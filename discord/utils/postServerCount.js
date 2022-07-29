const { request } = require("undici");
const { STATUS_CODES } = require("http");

// TODO: Total guild polling with sharding when guild count surpasses 1500
async function postServerCount(client) {
    if (process.env.TOP_TOKEN) {
        console.log("[discord] Posting server count to Top.gg");
        try {
            const res = await request(`https://top.gg/api/bots/${client.user.id}/stats`, {
                method: "POST",
                headers: {
                    Authorization: process.env.TOP_TOKEN,
                    "content-type": "application/json"
                },
                body: `{"server_count":${client.guilds.cache.size}}`
            });
            if (res.statusCode < 200 || res.statusCode >= 300) {
                throw new Error(`${res.statusCode} ${STATUS_CODES[res.statusCode]}`);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
}

module.exports = postServerCount;
