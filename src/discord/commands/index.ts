import {
    ApplicationCommandType,
    AutocompleteInteraction,
    Awaitable,
    Collection,
    Interaction,
    InteractionType,
    RESTPostAPIApplicationCommandsJSONBody
} from "discord.js";
import { readdirSync } from "fs";
import { basename } from "path";
import { fileURLToPath } from "url";

const indexBasename = basename(import.meta.url);
const commands = new Collection<string, Command>(
    await Promise.all(
        readdirSync(fileURLToPath(new URL(".", import.meta.url)))
            .filter(file =>
                (file.indexOf(".") !== 0) &&
                (file !== indexBasename) &&
                (file.slice(-3) === ".js")
            )
            .map(async (file): Promise<[string, Command]> => {
                const url = new URL(file, import.meta.url);
                const cmd: Command = await import(url.toString());
                return [cmd.data.name, cmd];
            })
    )
);
export default commands;

type CommandInteraction = Extract<Interaction, { type: InteractionType.ApplicationCommand }>;
interface Command<Type extends ApplicationCommandType = ApplicationCommandType> {
    data: RESTPostAPIApplicationCommandsJSONBody;
    autocomplete?(interaction: AutocompleteInteraction): Awaitable<void>;
    callback(interaction: Extract<CommandInteraction, { commandType: Type }>): Awaitable<void>;
}
