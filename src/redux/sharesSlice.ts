import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IShare from '../api/IShare';

export interface SharesState {
    shares: IShare[];
}

const initialState: SharesState = {
    shares: [],
};

export const sharesSlice = createSlice({
    name: 'shares',
    initialState,
    reducers: {
        setShares: (state, action: PayloadAction<IShare[]>) => {
            state.shares = action.payload;
        },
        addShare: (state, action: PayloadAction<IShare>) => {
            state.shares.push(action.payload);
        },
        deleteShare: (state, action: PayloadAction<string>) => {
            state.shares = state.shares.filter((x) => x.id !== action.payload);
        },
        updateShare: (state, action: PayloadAction<IShare>) => {
            const target = state.shares.find((x) => x.id === action.payload.id);
            if (!target) return;
            target.content = action.payload.content;
            target.type = action.payload.type;
            target.fromProfileId = action.payload.fromProfileId;
            target.fromUid = action.payload.fromUid;
            target.toProfileId = action.payload.toProfileId;
            target.toUid = action.payload.toUid;
        },
    },
});

export const {
    setShares: setShares,
    addShare: addShare,
    deleteShare: deleteShare,
    updateShare: updateShare,
} = sharesSlice.actions;
export default sharesSlice.reducer;
