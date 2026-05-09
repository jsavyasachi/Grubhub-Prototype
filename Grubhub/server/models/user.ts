import { Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export interface UserAttributes extends Model<InferAttributes<UserAttributes>, InferCreationAttributes<UserAttributes>> {
    id: CreationOptional<number>;
    first_name: string | null;
    last_name: string | null;
    email: string;
    password: string;
    account_type: string | null;
    phone: string | null;
    address: string | null;
    image: string | null;
}

const userModel = (sequelize: Sequelize) => {
    return sequelize.define<UserAttributes>('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        account_type: DataTypes.STRING,
        phone: DataTypes.STRING,
        address: DataTypes.STRING,
        image: DataTypes.STRING
    });
};

export default userModel;
