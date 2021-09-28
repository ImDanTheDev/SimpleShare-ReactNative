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
    SharesState,
} from 'simpleshare-common';
import toasterReducer, { ToasterState } from './toasterSlice';

const combinedReducer = combineReducers({
    auth: reduxReducers.authReducer,
    user: reduxReducers.accountReducer,
    profiles: reduxReducers.profilesReducer,
    shares: reduxReducers.sharesReducer,
    outbox: reduxReducers.outboxReducer,
    localPersist: reduxReducers.localPersistReducer,
    toaster: toasterReducer,
});

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
    // Intercept sign out action and reset account state to recheck account completeness.
    console.log(`Action: ${action.type}`);
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
