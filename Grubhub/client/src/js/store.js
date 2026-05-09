import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import restaurantReducer from './slices/restaurantSlice';
import dishReducer from './slices/dishSlice';
import buyerReducer from './slices/buyerSlice';
import orderReducer from './slices/orderSlice';
import axios from "axios";
import cookie from "js-cookie";
import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-localstorage';

// Axios Interceptors
axios.interceptors.request.use((config) => {
    const token = cookie.get('token');
    if (token) {
        config.headers.Authorization = `JWT ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

axios.interceptors.response.use(response => response, error => Promise.reject(error));

const rootReducer = combineReducers({
    user: userReducer,
    restaurant: restaurantReducer,
    dish: dishReducer,
    buyer: buyerReducer,
    order: orderReducer
});

const reducer = storage.reducer(rootReducer);
const engine = createEngine('current-session-key');
const storageMiddleware = storage.createMiddleware(engine);

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        }).concat(storageMiddleware),
});

const load = storage.createLoader(engine);
load(store)
    .then(newState => console.log("Loaded state:", newState))
    .catch(() => console.log("Failed to load previous state"));

export default store;
