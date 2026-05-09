import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: "",
    name: "",
    description: "",
    section: "",
    price: "",
    image: ""
};

const dishSlice = createSlice({
    name: 'dish',
    initialState,
    reducers: {
        setDish: (state, action) => ({ ...state, ...action.payload }),
        clearDish: () => initialState,
        setDishImage: (state, action) => ({ ...state, ...action.payload })
    }
});

export const { setDish, clearDish, setDishImage } = dishSlice.actions;
export default dishSlice.reducer;
