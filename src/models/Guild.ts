import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
    Sequelize
} from "sequelize";
import config from "../config.js";
import IgnoreChannel from "./IgnoreChannel.js";
import IgnoreWord from "./IgnoreWord.js";

export default class Guild extends Model<InferAttributes<Guild>, InferCreationAttributes<Guild>> {
    declare id: string;
    declare word: CreationOptional<string>;
    declare frequency: CreationOptional<number>;
    declare rate: CreationOptional<number>;
    declare IgnoreChannels?: NonAttribute<Array<IgnoreChannel>>;
    declare IgnoreWords?: NonAttribute<Array<IgnoreWord>>;

    static initialize(sequelize: Sequelize): void {
        this.init({
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            word: {
                type: DataTypes.STRING(config.limit.wordLength),
                defaultValue: config.default.word,
                allowNull: false
            },
            frequency: {
                type: DataTypes.INTEGER,
                defaultValue: config.default.frequency,
                allowNull: false
            },
            rate: {
                type: DataTypes.INTEGER,
                defaultValue: config.default.rate,
                allowNull: false
            }
        }, {
            sequelize,
            modelName: "Guild"
        });
    }
}
