import { Collection } from "discord.js";
import { readdirSync } from "fs";
import { basename } from "path";
import { fileURLToPath } from "url";

const indexBasename = basename(import.meta.url);
const responses = new Collection<string, EmojiResponse>(
    await Promise.all(
        readdirSync(fileURLToPath(new URL(".", import.meta.url)))
            .filter(file =>
                (file.indexOf(".") !== 0) &&
                (file !== indexBasename) &&
                (file.slice(-3) === ".js")
            )
            .map(async (file): Promise<[string, EmojiResponse]> => {
                const url = new URL(file, import.meta.url);
                const res: EmojiResponse = await import(url.toString());
                return [res.emoji, res];
            })
    )
);
export default responses;

interface EmojiResponse {
    emoji: string;
    keywords: Array<string>;
}
