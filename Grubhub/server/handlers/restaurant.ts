import {
    Restaurants,
    Dishes_Restaurant,
    Dishes
} from "../src/sequelize.js";
import _ from "lodash";
import Promise from "bluebird";

const createRestaurant = (restaurantDetails: any) => {
    return Restaurants.create({
        name: restaurantDetails.restaurant_name,
        cuisine: restaurantDetails.cuisine,
        user_id: restaurantDetails.user_id,
        image: restaurantDetails.restaurant_image,
        address: restaurantDetails.address,
        zipcode: restaurantDetails.zipcode
    }).then(restaurant => {
        if (!restaurant) {
            throw new Error("Restaurant creation error!");
        }
        return {
            id: restaurant.id,
            name: restaurant.name,
            cuisine: restaurant.cuisine,
            image: restaurant.image,
            address: restaurant.address,
            zipcode: restaurant.zipcode
        }
    })
}

const getRestaurant = (user_id: number) => {
    return Restaurants.findOne({
        where: {
            user_id
        }
    }).then(restaurant => {
        if (!restaurant) {
            console.log("No restaurant in DB for current user...");
            return {}
        }
        return restaurant
    })
}

const updateRestaurant = (restaurantDetails: any) => {
    return Restaurants.findOne({
        where: {
            id: restaurantDetails.id
        }
    }).then(restaurant => {
        if (!restaurant) throw new Error("Restaurant not found");
        return restaurant.update({
            name: restaurantDetails.restaurant_name,
            cuisine: restaurantDetails.cuisine,
            image: restaurantDetails.restaurant_image,
            address: restaurantDetails.address,
            zipcode: restaurantDetails.zipcode
        }).then(updatedRestaurant => {
            return Restaurants.findOne({
                where: {
                    id: updatedRestaurant.id
                }
            }).then(restaurant => {
                if (!restaurant) throw new Error("Restaurant not found after update");
                return {
                    id: restaurant.id,
                    name: restaurant.name,
                    cuisine: restaurant.cuisine,
                    address: restaurant.address,
                    zipcode: restaurant.zipcode
                }
            })
        })
    })
}

const getRestaurantMenu = (restaurant_id: number) => {
    return Restaurants.findOne({
        where: {
            id: restaurant_id
        }
    }).then(restaurant => {
        if (!restaurant) {
            throw new Error("No restaurant found in DB!");
        }
        return Dishes_Restaurant.findAll({
            where: {
                restaurant_id
            },
            include: [{
                model: Dishes
            }, {
                model: Restaurants
            }]
        }).then((allDishes: any[]) => {
            if (!allDishes || !allDishes.length) {
                return []
            }
            const groupedDishes = _.chain(allDishes).map('dish').groupBy('section').map((value: any, key: any) => ({
                section: key,
                id: value[0].id,
                dishes: value
            })).flatten().sortBy((each: any) => each.section.toLowerCase()).value();
            return groupedDishes
        })
    })
}

const getRestaurantDetails = (restaurant_id: number) => {
    return Restaurants.findOne({
        where: {
            id: restaurant_id
        }
    }).then(restaurant => {
        if (!restaurant) {
            throw new Error("Restaurant not found in DB!");
        }
        return getRestaurantMenu(restaurant_id).then(menu => {
            (restaurant as any).dataValues.menu = menu;
            return {
                current_restaurant: restaurant
            };
        });
    });
};

const updateSection = (section: any) => {
    if (!section.dishes || !section.dishes.length) {
        throw new Error('No dishes in section.')
    }
    return Promise.map(section.dishes, (dish: any) => {
        return Dishes.findOne({
            where: {
                id: dish
            }
        }).then(currentDish => {
            if (!currentDish) throw new Error("Dish not found");
            return currentDish.update({
                section: section.updated_name
            })
        })
    }).then(() => {
        return getRestaurantMenu(section.restaurant_id);
    }).catch(err => {
        return ({
            message: err
        });
    });
}

const deleteSection = (section: any) => {
    if (!section.dishes || !section.dishes.length) {
        throw new Error('No dishes in section.')
    }
    return Promise.map(section.dishes, (dish: any) => {
        return Dishes_Restaurant.destroy({
            where: {
                dish_id: dish
            }
        }).then(() => {
            return Dishes.destroy({
                where: {
                    id: dish
                }
            });
        });
    }).then(() => {
        return getRestaurantMenu(section.restaurant_id);
    }).catch(err => {
        return ({
            message: err
        });
    });
}
export default {
    createRestaurant,
    getRestaurant,
    updateRestaurant,
    getRestaurantMenu,
    getRestaurantDetails,
    updateSection,
    deleteSection
}
