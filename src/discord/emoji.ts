import {
    Interaction,
    Message,
    PermissionFlagsBits
} from "discord.js";

function checkPermissions(repliable: Repliable): boolean {
    return !repliable.inGuild() || (
        "appPermissions" in repliable && repliable.appPermissions ?
            repliable.appPermissions.has(PermissionFlagsBits.UseExternalEmojis) :
            !!repliable.channel?.permissionsFor(repliable.client.user.id)
                ?.has(PermissionFlagsBits.UseExternalEmojis)
    );
}

function createEmojiResponse(emojiEnv: string, defaultEmote: string): (repliable: Repliable) => string {
    return function (repliable: Repliable): string {
        if (process.env[emojiEnv] && checkPermissions(repliable)) {
            return process.env[emojiEnv]!;
        }
        else {
            return defaultEmote;
        }
    };
}

export const smile = createEmojiResponse("RES_SMILE", ":D");
export const frown = createEmojiResponse("RES_FROWN", ":(");
export const wink = createEmojiResponse("RES_WINK", ";)");
export const weird = createEmojiResponse("RES_WEIRD", "O_o");

type Repliable = Message | Interaction;
