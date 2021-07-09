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
import userReducer, { UserDataState } from './userSlice';

const rootReducer = combineReducers({
    counter: counterReducer,
    auth: authReducer,
    user: userReducer,
});

const persistConfig: PersistConfig<
    CombinedState<{
        counter: CounterState;
        auth: AuthState;
        user: UserDataState;
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
