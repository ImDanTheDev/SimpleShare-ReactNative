import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IAccountInfo from '../api/IAccountInfo';
import IPublicGeneralInfo from '../api/IPublicGeneralInfo';

export interface AccountInfoState {
    accountInfo: IAccountInfo | undefined;
    publicGeneralInfo: IPublicGeneralInfo | undefined;
}

const initialState: AccountInfoState = {
    accountInfo: undefined,
    publicGeneralInfo: undefined,
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
        setPublicGeneralInfo: (
            state,
            action: PayloadAction<IPublicGeneralInfo | undefined>
        ) => {
            state.publicGeneralInfo = action.payload;
        },
    },
});

export const {
    setAccountInfo: setAccountInfo,
    setPublicGeneralInfo: setPublicGeneralInfo,
} = accountSlice.actions;
export default accountSlice.reducer;
