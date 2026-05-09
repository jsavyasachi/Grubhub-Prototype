import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    account_type: "",
    token: "",
    image: "",
    invalid: false
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            return { ...state, ...action.payload, invalid: false };
        },
        setInvalid: (state, action) => {
            return { ...state, ...action.payload, invalid: true };
        },
        setProfilePic: (state, action) => {
            return { ...state, ...action.payload };
        },
        clearUser: () => initialState
    }
});

export const { setUser, setInvalid, setProfilePic, clearUser } = userSlice.actions;
export default userSlice.reducer;
