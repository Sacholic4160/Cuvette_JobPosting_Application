import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    status: false,
 company: null,
 token: localStorage.getItem('token') || null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.status =true
            state.company = action.payload.company,
            state.token = action.payload.token
            localStorage.setItem('token', action.payload.token);
        },
        logout: (state) => {
            state.status = false,
            state.company = null,
            state.token = null,
            localStorage.removeItem('token');
        }
    }
})

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;

