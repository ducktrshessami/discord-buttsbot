import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Sequelize
} from "sequelize";

export default class IgnoreUser extends Model<InferAttributes<IgnoreUser>, InferCreationAttributes<IgnoreUser>> {
    declare id: string;

    static initialize(sequelize: Sequelize): void {
        this.init({
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            }
        }, {
            sequelize,
            modelName: "IgnoreUser"
        });
    }
}
