import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { Navigation } from 'react-native-navigation';
import { store } from './src/redux/store';
import SplashScreen from './src/components/SplashScreen';
import WelcomeScreen, {
    ComponentId as WelcomeScreenComponentId,
} from './src/components/WelcomeScreen';

import CompleteAccountScreen, {
    ComponentId as CompleteAccountScreenComponentId,
} from './src/components/CompleteAccountScreen';

import HomeScreen, {
    ComponentId as HomeScreenComponentId,
} from './src/components/HomeScreen';

import SigninScreen, {
    ComponentId as SigninScreenComponentId,
} from './src/components/SigninScreen';

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
Navigation.registerComponent(CompleteAccountScreenComponentId, () =>
    WrappedComponent(CompleteAccountScreen)
);
Navigation.registerComponent(HomeScreenComponentId, () =>
    WrappedComponent(HomeScreen)
);
Navigation.registerComponent(SigninScreenComponentId, () =>
    WrappedComponent(SigninScreen)
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
