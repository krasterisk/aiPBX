import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PlaygroundSchema } from '../types/PlaygroundSchema'

const initialState: PlaygroundSchema = {
    
}

export const PlaygroundSlice = createSlice({
    name: 'Playground',
    initialState,
    reducers: {
        template: (state, action: PayloadAction<string>) => {
           
        },
    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(, (state) => {
    //             state.error = undefined;
    //             state.isLoading = true;
    //         })
    //         .addCase(, (state) => {
    //             state.isLoading = false;
    //         })
    //         .addCase(, (state, action) => {
    //             state.isLoading = false;
    //             state.error = action.payload;
    //         });
    // },
})

export const { actions: PlaygroundActions } = PlaygroundSlice
export const { reducer: PlaygroundReducer } = PlaygroundSlice
