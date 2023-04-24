import {
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
    Sequelize
} from "sequelize";
import Guild from "./Guild.js";

export default class IgnoreChannel extends Model<InferAttributes<IgnoreChannel>, InferCreationAttributes<IgnoreChannel>> {
    declare id: string;
    declare GuildId: ForeignKey<Guild["id"]>;
    declare Guild?: NonAttribute<Guild>;

    static initialize(sequelize: Sequelize): void {
        this.init({
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            }
        }, {
            sequelize,
            modelName: "IgnoreChannel"
        });
    }
}
