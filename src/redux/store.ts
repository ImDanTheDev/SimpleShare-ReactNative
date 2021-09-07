import AsyncStorage from '@react-native-community/async-storage';
import {
    CombinedState,
    combineReducers,
    configureStore,
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
    persistStore,
} from 'redux-persist';
import {
    AccountInfoState,
    AuthState,
    OutboxState,
    ProfilesState,
    reduxReducers,
    SharesState,
} from 'simpleshare-common';
import toasterReducer, { ToasterState } from './toasterSlice';

const rootReducer = combineReducers({
    auth: reduxReducers.authReducer,
    user: reduxReducers.accountReducer,
    profiles: reduxReducers.profilesReducer,
    shares: reduxReducers.sharesReducer,
    outbox: reduxReducers.outboxReducer,
    toaster: toasterReducer,
});

const persistConfig: PersistConfig<
    CombinedState<{
        auth: AuthState;
        user: AccountInfoState;
        profiles: ProfilesState;
        shares: SharesState;
        toaster: ToasterState;
        outbox: OutboxState;
    }>
> = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['user', 'auth', 'profiles', 'shares', 'toaster'], // TODO: 'profiles' includes 'currentProfile.'
    // It would be nice to persist which profile the user last selected. Right now, that
    // means splitting the profilesReducer in two. Consider moving everything into two
    // top-level reducers. A 'persistant' and 'nonpersistant' reducer. These top-level
    // reducers can contain more specific reducers with combineReducers.
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
