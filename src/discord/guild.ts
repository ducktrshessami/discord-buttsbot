import { Model, Transaction } from "sequelize";
import { Guild } from "../models/index.js";

export async function initializeGuild(
    guildId: string,
    values?: Parameters<typeof Model.findOrCreate<Guild>>[0]["defaults"],
    transaction?: Transaction
): Promise<void> {
    await Guild.findOrCreate({
        transaction,
        where: { id: guildId },
        defaults: values
    });
}
