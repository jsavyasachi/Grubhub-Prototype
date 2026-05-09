import {
    Users,
} from '../src/sequelize.js';
import jwtScecret from '../config/jwtConfig.js'
import jwt from 'jsonwebtoken';
import restaurantHandler from "./restaurant.js";
import {
    uploader
} from "../config/cloudinary.js"

const registerUser = (userDetails: any) => {
    return Users.findOne({
        where: {
            email: userDetails.email
        }
    }).then(user => {
        if (!user) {
            throw new Error("Email already exists in DB!");
        }

        const {
            first_name,
            last_name,
            account_type
        } = userDetails;
        return user.update({
            first_name,
            last_name,
            account_type
        }).then(() => {
            return Users.findOne({
                where: {
                    email: userDetails.email
                }
            }).then(updatedUser => {
                if (!updatedUser) throw new Error("User not found after update");
                const token = jwt.sign({
                    id: updatedUser.id
                }, jwtScecret.secret);
                const {
                    id,
                    first_name,
                    last_name,
                    email,
                    account_type
                } = updatedUser;
                return {
                    id,
                    first_name,
                    last_name,
                    email,
                    account_type,
                    token
                };
            });
        });
    });
}

const loginUser = (userCredentials: any) => {
    return Users.findOne({
        where: {
            email: userCredentials.email
        }
    }).then(user => {
        if (!user) {
            throw new Error("User not registered!");
        }
        const token = jwt.sign({
            id: user.id
        }, jwtScecret.secret);
        const {
            id,
            first_name,
            last_name,
            email,
            account_type,
            phone,
            address,
            image,
        } = user;
        return {
            id,
            first_name,
            last_name,
            email,
            account_type,
            phone,
            address,
            image,
            token
        };
    });
};

const updateUser = (userDetails: any) => {
    return Users.findOne({
        where: {
            id: userDetails.user_id
        }
    }).then(user => {
        if (!user) {
            throw new Error("User not found in DB!")
        }
        const {
            first_name,
            last_name,
            phone,
            address,
            image
        } = userDetails;
        return user.update({
            first_name,
            last_name,
            phone,
            address,
            image
        }).then(() => {
            return Users.findOne({
                where: {
                    id: userDetails.user_id
                }
            }).then(updatedUser => {
                if (!updatedUser) throw new Error("User not found after update");
                if (updatedUser.account_type === "Vendor") {
                    const restaurantDetails = {
                        id: userDetails.restaurant_id || '',
                        restaurant_name: userDetails.restaurant_name,
                        cuisine: userDetails.cuisine,
                        restaurant_image: userDetails.restaurant_image,
                        address: userDetails.restaurant_address,
                        zipcode: userDetails.restaurant_zipcode,
                        user_id: userDetails.user_id
                    }
                    if (!userDetails.restaurant_id) {
                        return restaurantHandler.createRestaurant(restaurantDetails).then((restaurant: any) => {
                            return {
                                user: updatedUser,
                                restaurant
                            }
                        })
                    } else {
                        return restaurantHandler.updateRestaurant(restaurantDetails).then((restaurant: any) => {
                            return {
                                user: updatedUser,
                                restaurant
                            }
                        })
                    }
                } else {
                    return {
                        user: updatedUser
                    }
                }
            })
        })
    })
}

const getUser = (id: any) => {
    return Users.findOne({
        where: {
            id
        }
    }).then(user => {
        if (!user) {
            throw new Error('User not found in DB!');
        }
        const {
            id,
            first_name,
            last_name,
            email,
            account_type,
            phone,
            address,
            image
        } = user;
        return {
            id,
            first_name,
            last_name,
            email,
            account_type,
            phone,
            address,
            image
        };
    })
}

const uploadUserImage = (file: any) => {
    return uploader
        .upload(file, {
            transformation: [{
                width: 175,
                height: 125,
                crop: "scale"
            }]
        })
        .then(result => {
            const image = result.url;
            return ({
                image
            });
        })
        .catch(err => ({
            messge: "Error while uploading image to repo: ",
            err
        }));
};

export default {
    registerUser,
    loginUser,
    updateUser,
    getUser,
    uploadUserImage
};
