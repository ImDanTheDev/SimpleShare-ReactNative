import AsyncStorage from '@react-native-community/async-storage';
import {
    CombinedState,
    combineReducers,
    configureStore,
    getDefaultMiddleware,
} from '@reduxjs/toolkit';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE,
    PersistConfig,
    persistReducer,
} from 'redux-persist';
import counterReducer, { CounterState } from './counterSlice';
import authReducer, { AuthState } from './authSlice';
import userReducer, {
    AccountInfoState as AccountInfoState,
} from './accountSlice';
import profilesReducer, { ProfilesState } from './profilesSlice';
import sharesReducer, { SharesState } from './sharesSlice';

const rootReducer = combineReducers({
    counter: counterReducer,
    auth: authReducer,
    user: userReducer,
    profiles: profilesReducer,
    shares: sharesReducer,
});

const persistConfig: PersistConfig<
    CombinedState<{
        counter: CounterState;
        auth: AuthState;
        user: AccountInfoState;
        profiles: ProfilesState;
        shares: SharesState;
    }>
> = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['user', 'auth', 'profiles', 'shares'], // TODO: 'profiles' includes 'currentProfile.'
    // It would be nice to persist which profile the user last selected. Right now, that
    // means splitting the profilesReducer in two. Consider moving everything into two
    // top-level reducers. A 'persistant' and 'nonpersistant' reducer. These top-level
    // reducers can contain more specific reducers with combineReducers.
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
