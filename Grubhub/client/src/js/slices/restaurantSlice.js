import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: "",
    name: "",
    address: "",
    zipcode: "",
    image: "",
    cuisine: "",
    menu: []
};

const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {
        setRestaurant: (state, action) => ({ ...state, ...action.payload }),
        setMenu: (state, action) => ({ ...state, ...action.payload }),
        setRestaurantPic: (state, action) => ({ ...state, ...action.payload })
    }
});

export const { setRestaurant, setMenu, setRestaurantPic } = restaurantSlice.actions;
export default restaurantSlice.reducer;
