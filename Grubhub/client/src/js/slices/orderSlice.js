import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    current_orders: [],
    past_orders: [],
    active: {}
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrders: (state, action) => ({ ...state, ...action.payload }),
        setOrderDetails: (state, action) => {
            state.active = action.payload;
        }
    }
});

export const { setOrders, setOrderDetails } = orderSlice.actions;
export default orderSlice.reducer;
