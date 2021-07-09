import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IUserData from './services/database/IUserData';

export interface UserDataState {
    userData: IUserData | undefined;
}

const initialState: UserDataState = {
    userData: undefined,
};

export const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<IUserData | undefined>) => {
            state.userData = action.payload;
        },
    },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
