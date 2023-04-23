import { REST, Routes } from "discord.js";
import dotenv from "../dotenv.js";
import commands from "./commands/index.js";

await dotenv();

const commandData = commands.map(command => command.data.toJSON());
const rest = new REST({ version: "10" })
    .setToken(process.env.DISCORD_TOKEN!);

await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), { body: commandData });
console.log("Successfully deployed commands");
