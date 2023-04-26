import { readdirSync } from "fs";
import { basename } from "path";
import { fileURLToPath } from "url";

const indexBasename = basename(import.meta.url);
const responses = await Promise.all(
    readdirSync(fileURLToPath(new URL(".", import.meta.url)))
        .filter(file =>
            (file.indexOf(".") !== 0) &&
            (file !== indexBasename) &&
            (file.slice(-3) === ".js")
        )
        .map(async (file): Promise<EmojiResponse> => {
            const url = new URL(file, import.meta.url);
            const response: RawEmojiResponse = await import(url.toString());
            return {
                ...response,
                pattern: new RegExp(`\\b(?:${response.keywords.join("|")})\\b`, "i")
            };
        })
);
export default responses;

interface RawEmojiResponse {
    emoji: string;
    keywords: Array<string>;
}

interface EmojiResponse extends RawEmojiResponse {
    pattern: RegExp;
}
