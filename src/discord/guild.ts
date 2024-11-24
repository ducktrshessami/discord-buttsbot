import { CreationAttributes, Transaction } from "sequelize";
import { Guild } from "../models/index.js";

const UpdatableAttributes = [
    "frequency",
    "rate",
    "word"
];

export async function initializeGuild(guildId: string, transaction?: Transaction): Promise<void> {
    await Guild.findOrCreate({
        transaction,
        where: { id: guildId }
    });
}

export async function getGuild(guildId: string): Promise<Guild | null> {
    return await Guild.findByPk(guildId);
}

export async function updateGuild(guildId: string, values: Omit<CreationAttributes<Guild>, "id">): Promise<void> {
    await Guild.bulkCreate([{
        ...values,
        id: guildId
    }], { updateOnDuplicate: <Array<keyof typeof values>>UpdatableAttributes.filter(attribute => values[<keyof typeof values>attribute] != null) });
}

export async function deleteGuild(guildId: string): Promise<void> {
    await Guild.destroy({
        where: { id: guildId }
    });
}
