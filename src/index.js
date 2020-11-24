const readline = require("readline");
const DiscordBot = require("discord-bot");
const config = require("../cfg/config.json");

const ios = new readline.Interface({
    input: process.stdin,
    output: process.stdout
});

let restartCmd = new DiscordBot.Command("restart", restart, { admin: true });
let client = new DiscordBot(config, [ restartCmd ]);

// Client event handling
client.on("ready", () => {
    console.info("I'm logged in");
});
client.on("shardDisconnect", restart);

// ios event handling
ios.on("line", (line) => {
    if (line.toLowerCase().trim() == "exit") {
        restart();
    }
});

function restart() {
    ios.close();
    this.client.destroy();
}
