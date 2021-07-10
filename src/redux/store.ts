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

const rootReducer = combineReducers({
    counter: counterReducer,
    auth: authReducer,
    user: userReducer,
    profiles: profilesReducer,
});

const persistConfig: PersistConfig<
    CombinedState<{
        counter: CounterState;
        auth: AuthState;
        user: AccountInfoState;
        profiles: ProfilesState;
    }>
> = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['user'],
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
