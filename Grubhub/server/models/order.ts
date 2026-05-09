import { Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export interface OrderAttributes extends Model<InferAttributes<OrderAttributes>, InferCreationAttributes<OrderAttributes>> {
    id: CreationOptional<number>;
    user_id: number | null;
    restaurant_id: number | null;
    amount: number | null;
    status: string | null;
}

const orderModel = (sequelize: Sequelize) => {
    return sequelize.define<OrderAttributes>('order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        restaurant_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'restaurants',
                key: 'id'
            }
        },
        amount: DataTypes.INTEGER,
        status: DataTypes.STRING
    }, {
        underscored: true
    });
};

export default orderModel;
