import {
    CreationOptional,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Sequelize
} from "sequelize";

export class Guild extends Model<InferAttributes<Guild>, InferCreationAttributes<Guild>> {
    id: string;
    word: CreationOptional<string>;
    frequency: CreationOptional<number>;
    rate: CreationOptional<number>;
}

export class IgnoreChannel extends Model<InferAttributes<IgnoreChannel>, InferCreationAttributes<IgnoreChannel>> {
    id: string;

    GuildId: ForeignKey<Guild["id"]>;
}

export const sequelize: Sequelize;
export { Sequelize } from "sequelize";
