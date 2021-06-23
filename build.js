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
        console.log(`Logged in as ${client.user.username}#${client.user.discriminator}`);
        fs.promises.readFile(index)
            .then(buffer => buffer.toString("utf8"))
            .then(html => html.replace("{{ client_id }}", client.user.id))
            .then(built => fs.promises.writeFile(index, built))
            .then(() => console.log("Successfully built /public/index.html"))
            .then(() => client.destroy())
            .then(() => console.log("Logged out"))
            .catch(console.error);
    });

    client.login(process.env.BOT_TOKEN || botConfig.token)
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}
