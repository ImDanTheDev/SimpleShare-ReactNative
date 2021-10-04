import AsyncStorage from '@react-native-community/async-storage';
import {
    AnyAction,
    CombinedState,
    combineReducers,
    configureStore,
    Reducer,
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
    LocalPersistState,
    OutboxState,
    ProfilesState,
    reduxReducers,
    SearchState,
    SharesState,
    NotificationsState,
} from 'simpleshare-common';
import toasterReducer, { ToasterState } from './toasterSlice';

const combinedReducer = combineReducers({
    auth: reduxReducers.authReducer,
    user: reduxReducers.accountReducer,
    profiles: reduxReducers.profilesReducer,
    shares: reduxReducers.sharesReducer,
    outbox: reduxReducers.outboxReducer,
    localPersist: reduxReducers.localPersistReducer,
    search: reduxReducers.searchReducer,
    notifications: reduxReducers.notificationsReducer,
    toaster: toasterReducer,
});

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
    // Intercept sign out action and reset account state to recheck account completeness.
    if (action.type === 'auth/signOut/fulfilled') {
        state.user = {} as AccountInfoState;
        state.auth = {} as AuthState;
    }
    return combinedReducer(state, action);
};

const persistConfig: PersistConfig<
    CombinedState<{
        auth: AuthState;
        user: AccountInfoState;
        profiles: ProfilesState;
        shares: SharesState;
        toaster: ToasterState;
        localPersist: LocalPersistState;
        outbox: OutboxState;
        search: SearchState;
        notifications: NotificationsState;
    }>
> = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: [
        'user',
        'auth',
        'profiles',
        'shares',
        'toaster',
        'search',
        'notifications',
    ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
        const mw = getDefaultMiddleware({
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
        });
        if (__DEV__) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            mw.push(require('redux-flipper').default());
        }
        return mw;
    },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof combinedReducer>;
export type AppDispatch = typeof store.dispatch;
