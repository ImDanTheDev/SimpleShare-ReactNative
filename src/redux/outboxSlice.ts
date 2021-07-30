import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IShare from '../api/IShare';

export interface OutboxState {
    shares: IShare[];
}

const initialState: OutboxState = {
    shares: [],
};

export const outboxSlice = createSlice({
    name: 'outbox',
    initialState,
    reducers: {
        addShareToOutbox: (state, action: PayloadAction<IShare>) => {
            state.shares.push(action.payload);
        },
        clearOutbox: (state) => {
            state.shares = [];
        },
    },
});

export const { addShareToOutbox: addShareToOutbox, clearOutbox: clearOutbox } =
    outboxSlice.actions;
export default outboxSlice.reducer;
