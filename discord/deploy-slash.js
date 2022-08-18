try {
    require("dotenv").config();
}
catch {
    console.warn("Not using dotenv. Make sure environment variables are set");
}

const { REST, Routes } = require("discord.js");
const commands = require("./commands");

const env = process.env.DISCORD_ENV || "development";
const commandData = commands.map(command => command.data.toJSON());
const rest = new REST({ version: "10" })
    .setToken(process.env.DISCORD_TOKEN);

rest.put(
    env === "production" ?
        Routes.applicationCommands(process.env.DISCORD_CLIENTID) :
        Routes.applicationGuildCommands(process.env.DISCORD_CLIENTID, process.env.DISCORD_TESTGUILD),
    { body: commandData }
)
    .catch(console.error);
