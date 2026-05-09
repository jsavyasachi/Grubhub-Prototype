import { Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export interface DishAttributes extends Model<InferAttributes<DishAttributes>, InferCreationAttributes<DishAttributes>> {
    id: CreationOptional<number>;
    name: string | null;
    price: number | null;
    description: string | null;
    image: string | null;
    section: string | null;
}

const dishModel = (sequelize: Sequelize) => {
    return sequelize.define<DishAttributes>('dish', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        price: DataTypes.FLOAT,
        description: DataTypes.STRING,
        image: DataTypes.STRING,
        section: DataTypes.STRING
    }, {
        underscored: true
    })
}

export interface DishRestaurantAttributes extends Model<InferAttributes<DishRestaurantAttributes>, InferCreationAttributes<DishRestaurantAttributes>> {
    id: CreationOptional<number>;
    dish_id: number | null;
    restaurant_id: number | null;
    quantity: number | null;
}

const dishRestaurantModel = (sequelize: Sequelize) => {
    return sequelize.define<DishRestaurantAttributes>('restaurant_dish', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        dish_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'dishes',
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
        quantity: DataTypes.INTEGER
    }, {
        underscored: true
    });
}

export interface DishOrderAttributes extends Model<InferAttributes<DishOrderAttributes>, InferCreationAttributes<DishOrderAttributes>> {
    id: CreationOptional<number>;
    dish_id: number | null;
    order_id: number | null;
    quantity: number | null;
}

const dishOrderModel = (sequelize: Sequelize) => {
    return sequelize.define<DishOrderAttributes>('order_dish', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        dish_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'items',
                key: 'id'
            }
        },
        order_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'orders',
                key: 'id'
            }
        },
        quantity: DataTypes.INTEGER
    }, {
        underscored: true
    })
}

export {
    dishModel,
    dishRestaurantModel,
    dishOrderModel
};
