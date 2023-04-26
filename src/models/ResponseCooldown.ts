import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Sequelize
} from "sequelize";

export default class ResponseCooldown extends Model<InferAttributes<ResponseCooldown>, InferCreationAttributes<ResponseCooldown>> {
    declare channelId: string;
    declare smile: CreationOptional<Date>;
    declare frown: CreationOptional<Date>;
    declare wink: CreationOptional<Date>;
    declare weird: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    static initialize(sequelize: Sequelize): void {
        this.init({
            channelId: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            smile: DataTypes.DATE,
            frown: DataTypes.DATE,
            wink: DataTypes.DATE,
            weird: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        }, {
            sequelize,
            modelName: "ResponseCooldown"
        });
    }
}
