import {
    CreationOptional,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
    Sequelize
} from "sequelize";

export class Guild extends Model<InferAttributes<Guild>, InferCreationAttributes<Guild>> {
    id: string;
    word: CreationOptional<string>;
    frequency: CreationOptional<number>;
    rate: CreationOptional<number>;

    IgnoreChannels?: NonAttribute<Array<IgnoreChannel>>;
}

export class IgnoreChannel extends Model<InferAttributes<IgnoreChannel>, InferCreationAttributes<IgnoreChannel>> {
    id: string;

    GuildId: ForeignKey<Guild["id"]>;
    Guild?: NonAttribute<Guild>;
}

export class IgnoreUser extends Model<InferAttributes<IgnoreUser>, InferCreationAttributes<IgnoreUser>> {
    id: string;
}

export class ResponseCooldown extends Model<InferAttributes<ResponseCooldown>, InferCreationAttributes<ResponseCooldown>> {
    channelId: string;
    smile: CreationOptional<Date>;
    frown: CreationOptional<Date>;
    wink: CreationOptional<Date>;
    weird: CreationOptional<Date>;
}

export const sequelize: Sequelize;
export { Sequelize } from "sequelize";
