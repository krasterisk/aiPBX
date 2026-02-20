import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PlaygroundSessionSchema } from '../types/PlaygroundSessionSchema'

const initialState: PlaygroundSessionSchema = {
    
}

export const PlaygroundSessionSlice = createSlice({
    name: 'PlaygroundSession',
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

export const { actions: PlaygroundSessionActions } = PlaygroundSessionSlice
export const { reducer: PlaygroundSessionReducer } = PlaygroundSessionSlice
