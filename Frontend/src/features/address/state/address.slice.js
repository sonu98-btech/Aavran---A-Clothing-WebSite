import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    addresses: [],
    loading: false,
    error: null
};

const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {
        setAddresses: (state, action) => {
            state.addresses = action.payload;
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
        },

        clearError: (state) => {
            state.error = null;
        },

        clearAddresses: (state) => {
            state.addresses = [];
        }
    }
});

export const {
    setAddresses,
    setLoading,
    setError,
    clearError,
    clearAddresses
} = addressSlice.actions;

export default addressSlice.reducer;