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
        .map((file): Promise<EmojiResponse> => {
            const url = new URL(file, import.meta.url);
            return <Promise<EmojiResponse>>import(url.toString());
        })
);
export default responses;

interface EmojiResponse {
    emoji: string;
    keywords: Array<string>;
}
