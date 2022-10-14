try {
    require("dotenv").config();
}
catch {
    console.warn("Not using dotenv. Make sure environment variables are set");
}

const { REST, Routes } = require("discord.js");
const commands = require("./commands");

const commandData = commands.map(command => command.data.toJSON());
const rest = new REST({ version: "10" })
    .setToken(process.env.DISCORD_TOKEN);

rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENTID), { body: commandData })
    .then(() => console.log("Successfully deployed commands."))
    .catch(console.error);
