import { Message } from "discord.js";
import { readdirSync } from "fs";
import { basename } from "path";
import { fileURLToPath } from "url";
import { ResponseCooldown } from "../../models/index.js";
import { DISCORD_RESPONSE_COOLDOWN } from "../../constants.js";
import * as ResponseEmojiManager from "../emoji.js";

class EmojiResponse {
    readonly emoji: ResponseEmoji;
    readonly pattern: RegExp;

    constructor(raw: RawEmojiResponse) {
        this.emoji = raw.emoji;
        this.pattern = new RegExp(`\\b(?:${raw.keywords.join("|")})\\b`, "i");
    }

    async send(message: Message): Promise<void> {
        const cooldownModel = await ResponseCooldown.findByPk(message.channelId);
        if (!cooldownModel?.[this.emoji] || (message.createdTimestamp - cooldownModel[this.emoji].getTime() > DISCORD_RESPONSE_COOLDOWN)) {
            await message.channel.send(ResponseEmojiManager[this.emoji](message));
            await ResponseCooldown.bulkCreate([{
                channelId: message.channelId,
                [this.emoji]: message.createdAt
            }], { updateOnDuplicate: [this.emoji] });
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
