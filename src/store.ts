import AsyncStorage from "@react-native-community/async-storage";
import { CombinedState, combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, PersistConfig, persistReducer, } from "redux-persist";
import counterReducer from './counterSlice';

const rootReducer = combineReducers({
    counter: counterReducer
})

const persistConfig: PersistConfig<CombinedState<any>> = {
    key: 'root',
    storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;