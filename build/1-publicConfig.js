const fs = require("fs");
const path = require("path");
const botConfig = require("../config/bot.json");

const index = path.resolve(__dirname, "..", "public", "index.html");

if (fs.existsSync(index)) {
    let built = fs.readFileSync(index)
        .toString("utf8")
        .replace("{{ client_id }}", process.env.DISCORD_CLIENTID)
        .replace("{{ permission_value }}", botConfig.permissionValue);
    fs.writeFileSync(index, built);
    console.log("[build] Successfully built /public/index.html");
}
