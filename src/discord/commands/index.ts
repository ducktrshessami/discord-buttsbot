import {
    AutocompleteInteraction,
    Awaitable,
    CacheType,
    ChatInputCommandInteraction,
    Collection,
    SlashCommandBuilder
} from "discord.js";
import { readdirSync } from "fs";
import { basename } from "path";
import { fileURLToPath } from "url";

const indexBasename = basename(import.meta.url);
const commands = new Collection<string, SlashCommand>(
    await Promise.all(
        readdirSync(fileURLToPath(new URL(".", import.meta.url)))
            .filter(file =>
                (file.indexOf(".") !== 0) &&
                (file !== indexBasename) &&
                (file.slice(-3) === ".js")
            )
            .map(async (file): Promise<[string, SlashCommand]> => {
                const url = new URL(file, import.meta.url);
                const cmd: SlashCommand = await import(url.toString());
                return [cmd.data.name, cmd];
            })
    )
);
export default commands;

type SlashCommandData = Pick<SlashCommandBuilder,
    "name" |
    "name_localizations" |
    "dm_permission" |
    "nsfw" |
    "toJSON"
>;

interface SlashCommand<InteractionCacheType extends CacheType = CacheType> {
    data: SlashCommandData;
    autocomplete?(interaction: AutocompleteInteraction<InteractionCacheType>): Awaitable<void>;
    callback(interaction: ChatInputCommandInteraction<InteractionCacheType>): Awaitable<void>;
}
