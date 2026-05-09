import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    search_results: [],
    current_restaurant: {},
    cart: []
};

const buyerSlice = createSlice({
    name: 'buyer',
    initialState,
    reducers: {
        setSearchResults: (state, action) => ({ ...state, ...action.payload }),
        setBuyerSelectedRestaurant: (state, action) => ({ ...state, ...action.payload }),
        addToCart: (state, action) => ({ ...state, ...action.payload }),
        clearCart: (state) => {
            state.cart = [];
        }
    }
});

export const { setSearchResults, setBuyerSelectedRestaurant, addToCart, clearCart } = buyerSlice.actions;
export default buyerSlice.reducer;
