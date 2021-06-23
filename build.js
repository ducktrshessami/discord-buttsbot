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
const client = new Client();

if (fs.existsSync(index)) {
    client.on("ready", () => {
        fs.promises.readFile(index)
            .then(buffer => buffer.toString("utf8"))
            .then(html => html.replace("{{ client_id }}", client.user.id))
            .then(built => fs.promises.writeFile(index, built))
            .then(() => client.destroy())
            .catch(console.error);
    });

    client.login(process.env.BOT_TOKEN || botConfig.token)
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}
