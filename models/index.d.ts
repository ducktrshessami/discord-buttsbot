import {
    CreationOptional,
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

export const sequelize: Sequelize;
export { Sequelize } from "sequelize";
