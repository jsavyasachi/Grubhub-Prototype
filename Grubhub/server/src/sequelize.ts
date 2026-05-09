import { Sequelize } from 'sequelize';
import UserModel from '../models/user.js';
import RestaurantModel from '../models/restaurant.js';
import {
    dishModel,
    dishRestaurantModel,
    dishOrderModel
} from "../models/dish.js";
import OrderModel from "../models/order.js"

const sequelize = new Sequelize('grubhubDB', 'root', 'root1234', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

const Users = UserModel(sequelize);
const Restaurants = RestaurantModel(sequelize);
const Dishes = dishModel(sequelize);
const Dishes_Restaurant = dishRestaurantModel(sequelize);
const Orders = OrderModel(sequelize);
const Dishes_Order = dishOrderModel(sequelize);

Dishes_Restaurant.belongsTo(Dishes);
Dishes_Restaurant.belongsTo(Restaurants);
Orders.belongsTo(Users);
Orders.belongsTo(Restaurants);
Dishes_Order.belongsTo(Orders);
Dishes_Order.belongsTo(Dishes);


sequelize.sync()
    .then(() => {
        console.log('DB Created Successfully...');
    }).catch((err: any) => {
        console.log('DB Creation Error: ', err.message);
    })

export {
    Users,
    Restaurants,
    Dishes,
    Dishes_Restaurant,
    Dishes_Order,
    Orders
};
