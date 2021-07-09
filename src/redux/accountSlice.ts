import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IAccountInfo from '../api/IAccountInfo';

export interface AccountInfoState {
    accountInfo: IAccountInfo | undefined;
}

const initialState: AccountInfoState = {
    accountInfo: undefined,
};

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setAccountInfo: (
            state,
            action: PayloadAction<IAccountInfo | undefined>
        ) => {
            state.accountInfo = action.payload;
        },
    },
});

export const { setAccountInfo: setAccountInfo } = accountSlice.actions;
export default accountSlice.reducer;
