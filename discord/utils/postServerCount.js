const phin = require("phin");

async function postServerCount(client) {
    if (process.env.TOP_TOKEN) {
        console.log("[discord] Posting server count to Top.gg");
        try {
            const res = await phin({
                url: `https://top.gg/api/bots/${client.user.id}/stats`,
                method: "POST",
                headers: { Authorization: process.env.TOP_TOKEN },
                data: { server_count: client.guilds.cache.size }
            });
            if (res.statusCode < 200 || res.statusCode >= 300) {
                throw new Error(`${res.statusCode} ${res.statusMessage}`);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
}

module.exports = postServerCount;
