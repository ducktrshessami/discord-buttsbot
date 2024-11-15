import { PermissionResolvable, PermissionsBitField } from "discord.js";

export function resolvePermissionString(...permissions: PermissionResolvable[]): string {
    return PermissionsBitField
        .resolve(permissions)
        .toString();
}
