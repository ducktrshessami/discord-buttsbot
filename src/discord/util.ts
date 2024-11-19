import { PermissionResolvable, PermissionsBitField } from "discord.js";

export const WhitespacePattern = /\s/;

export function resolvePermissionString(...permissions: PermissionResolvable[]): string {
    return PermissionsBitField
        .resolve(permissions)
        .toString();
}
