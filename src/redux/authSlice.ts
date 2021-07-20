import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IUser from '../api/IUser';

export interface AuthState {
    initializing: boolean | undefined;
    user: IUser | undefined;
}

const initialState: AuthState = {
    initializing: undefined,
    user: undefined,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser | undefined>) => {
            state.user = action.payload;
            if (state.initializing === undefined) {
                state.initializing = true;
            } else if (state.initializing === true) {
                state.initializing = false;
            }
        },
    },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
