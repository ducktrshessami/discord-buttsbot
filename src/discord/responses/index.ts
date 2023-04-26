import { Message } from "discord.js";
import { readdirSync } from "fs";
import { basename } from "path";
import { fileURLToPath } from "url";
import { ResponseCooldown } from "../../models/index.js";
import { DISCORD_RESPONSE_COOLDOWN } from "../../constants.js";
import * as ResponseEmojiManager from "../emoji.js";

class EmojiResponse implements RawEmojiResponse {
    readonly emoji: ResponseEmoji;
    readonly keywords: Array<string>;

    constructor(raw: RawEmojiResponse) {
        this.emoji = raw.emoji;
        this.keywords = raw.keywords;
    }

    get pattern(): RegExp {
        return new RegExp(`\\b(?:${this.keywords.join("|")})\\b`, "i");
    }

    async send(message: Message): Promise<void> {
        const [cooldownModel] = await ResponseCooldown.findOrCreate({
            where: { channelId: message.channelId }
        });
        if (!cooldownModel[this.emoji] || (message.createdTimestamp - cooldownModel[this.emoji].getTime() > DISCORD_RESPONSE_COOLDOWN)) {
            const newCooldown = { [this.emoji]: message.createdAt };
            await message.channel.send(ResponseEmojiManager[this.emoji](message));
            await cooldownModel.update(newCooldown);
        }
    }
}

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
            return new EmojiResponse(response);
        })
);
export default responses;

type ResponseEmoji = "smile" |
    "frown" |
    "weird" |
    "wink";

interface RawEmojiResponse {
    emoji: ResponseEmoji;
    keywords: Array<string>;
}
