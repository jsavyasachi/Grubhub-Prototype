import { Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export interface RestaurantAttributes extends Model<InferAttributes<RestaurantAttributes>, InferCreationAttributes<RestaurantAttributes>> {
    id: CreationOptional<number>;
    user_id: number | null;
    name: string | null;
    address: string | null;
    zipcode: string | null;
    cuisine: string | null;
    image: string | null;
}

const restaurantModel = (sequelize: Sequelize) => {
    return sequelize.define<RestaurantAttributes>('restaurant', {
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
        name: DataTypes.STRING,
        address: DataTypes.STRING,
        zipcode: DataTypes.STRING,
        cuisine: DataTypes.STRING,
        image: DataTypes.STRING
    }, {
        underscored: true
    });
}

export default restaurantModel;
