const phin = require("phin");

function postServerCount(client) {
    if (process.env.TOP_TOKEN) {
        console.log("Posting server count to Top.gg");
        phin({
            url: `https://top.gg/api/bots/${client.user.id}/stats`,
            method: "POST",
            headers: { Authorization: process.env.TOP_TOKEN },
            data: { server_count: client.guilds.cache.size }
        })
            .then(res => {
                if (!(res.statusCode >= 200 && res.statusCode < 300)) {
                    throw new Error(`${res.statusCode} ${res.statusMessage}`);
                }
            })
            .catch(console.error);
    }
}

module.exports = postServerCount;
