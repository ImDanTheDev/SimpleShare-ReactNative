import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { Navigation } from 'react-native-navigation';
import { store } from './src/store';
import SplashScreen from './src/components/SplashScreen';
import WelcomeScreen, {
    ComponentId as WelcomeScreenComponentId,
} from './src/components/WelcomeScreen';

const persistor = persistStore(store);

const WrappedComponent = (Component) => {
    return (props) => {
        const EnhancedComponent = () => (
            <Provider store={store}>
                <PersistGate loading={<SplashScreen />} persistor={persistor}>
                    <Component {...props} />
                </PersistGate>
            </Provider>
        );

        return <EnhancedComponent />;
    };
};

Navigation.registerComponent(WelcomeScreenComponentId, () =>
    WrappedComponent(WelcomeScreen)
);
Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            stack: {
                children: [
                    {
                        component: {
                            name: WelcomeScreenComponentId,
                        },
                    },
                ],
            },
        },
    });
});
