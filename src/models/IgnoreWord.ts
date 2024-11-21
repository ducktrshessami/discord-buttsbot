import {
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
    Sequelize
} from "sequelize";
import config from "../config.js";
import Guild from "./Guild.js";

export default class IgnoreWord extends Model<InferAttributes<IgnoreWord>, InferCreationAttributes<IgnoreWord>> {
    declare id: string;
    declare word: string;
    declare GuildId: ForeignKey<string>;
    declare Guild?: NonAttribute<Guild>;

    static initialize(sequelize: Sequelize): void {
        this.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            word: {
                type: DataTypes.STRING(config.limit.wordLength),
                allowNull: false
            }
        }, {
            sequelize,
            modelName: "IgnoreWord"
        });
    }
}
