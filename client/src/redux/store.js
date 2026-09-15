import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice.js';
export const store = configureStore({
    reducer: {
        // Add your reducers here
       user : userReducer
    }
})