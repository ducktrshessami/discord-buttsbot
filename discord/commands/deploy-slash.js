try {
    require("dotenv").config();
}
catch {
    console.warn("Not using dotenv. Make sure environment variables are set");
}

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const slashCommands = require("./slash");

const env = process.env.DISCORD_ENV || "development";
const commands = slashCommands.map(command => command.data.toJSON());
const rest = new REST({ version: "9" })
    .setToken(process.env.DISCORD_TOKEN);

rest.put(
    env === "production" ?
        Routes.applicationCommands(process.env.DISCORD_CLIENTID) :
        Routes.applicationGuildCommands(process.env.DISCORD_CLIENTID, process.env.DISCORD_TESTGUILD),
    { body: commands }
)
    .catch(console.error);
