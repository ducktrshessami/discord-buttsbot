import { Transaction } from "sequelize";
import { Guild } from "../models/index.js";

export async function initializeGuild(guildId: string, transaction?: Transaction): Promise<void> {
    await Guild.findOrCreate({
        transaction,
        where: { id: guildId }
    });
}

export async function deleteGuild(guildId: string): Promise<void> {
    await Guild.destroy({
        where: { id: guildId }
    });
}
