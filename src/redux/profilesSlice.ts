import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IProfile from '../api/IProfile';

export interface ProfilesState {
    profiles: IProfile[];
    currentProfileId: string;
}

const initialState: ProfilesState = {
    profiles: [
        {
            id: 'default',
            name: 'Default',
        },
    ],
    currentProfileId: 'default',
};

export const profilesSlice = createSlice({
    name: 'profiles',
    initialState,
    reducers: {
        setProfiles: (state, action: PayloadAction<IProfile[]>) => {
            state.profiles = action.payload;
        },
        setCurrentProfile: (state, action: PayloadAction<string>) => {
            state.currentProfileId = action.payload;
        },
    },
});

export const {
    setProfiles: setProfiles,
    setCurrentProfile: setCurrentProfile,
} = profilesSlice.actions;
export default profilesSlice.reducer;