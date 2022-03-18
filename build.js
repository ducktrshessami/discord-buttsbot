try {
    require("dotenv").config();
}
catch {
    console.warn("Not using dotenv. Make sure environment variables are set");
}

const fs = require("fs");
const { resolve } = require("path");
const { Client } = require("discord.js");
const botConfig = require("./config/bot.json");

const index = resolve(__dirname, "public", "index.html");
const client = new Client({ intents: [] });

if (fs.existsSync(index)) {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}`);
        let built = fs.readFileSync(index)
            .toString("utf8")
            .replace("{{ client_id }}", client.user.id)
            .replace("{{ permission_value }}", botConfig.permissionValue);
        fs.writeFileSync(index, built);
        console.log("Successfully built /public/index.html");
        client.destroy();
        console.log("Logged out");
    })
        .login(process.env.BOT_TOKEN || botConfig.token)
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}
