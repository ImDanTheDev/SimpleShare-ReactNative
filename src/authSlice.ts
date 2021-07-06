import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IUser from './services/auth/IUser';

export interface AuthState {
    user: IUser | undefined;
}

const initialState: AuthState = {
    user: undefined,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser | undefined>) => {
            state.user = action.payload;
        },
    },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
