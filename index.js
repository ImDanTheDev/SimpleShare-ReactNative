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
import SendShareScreen, {
    ComponentId as SendShareScreenComponentId,
} from './src/components/SendShareScreen';

import AccountSettingsScreen, {
    ComponentId as AccountSettingsScreenComponentId,
} from './src/components/AccountSettingsScreen';

import NewProfileSheet, {
    ComponentId as NewProfileSheetComponentId,
} from './src/components/NewProfileSheet';

import HelpInfoSheet, {
    ComponentId as HelpInfoSheetComponentId,
} from './src/components/HelpInfoSheet';

import ViewShareScreen, {
    ComponentId as ViewShareScreenComponentId,
} from './src/components/ViewShareScreen';

import { ProtectedScreen } from './src/components/ProtectedScreen';

const persistor = persistStore(store);

const NoAuthWrappedComponent = (Component) => {
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

const AuthWrappedComponent = (Component, requireProfile, name) => {
    return (props) => {
        const EnhancedComponent = () => (
            <Provider store={store}>
                <PersistGate loading={<SplashScreen />} persistor={persistor}>
                    <ProtectedScreen
                        authing={<SplashScreen {...props} />}
                        authSuccess={<Component {...props} />}
                        authFail={<WelcomeScreen {...props} />}
                        requireProfile={requireProfile}
                        name={name}
                    />
                </PersistGate>
            </Provider>
        );

        return <EnhancedComponent />;
    };
};

Navigation.registerComponent(WelcomeScreenComponentId, () =>
    NoAuthWrappedComponent(WelcomeScreen)
);
Navigation.registerComponent(CompleteAccountScreenComponentId, () =>
    AuthWrappedComponent(
        CompleteAccountScreen,
        false,
        CompleteAccountScreenComponentId
    )
);
Navigation.registerComponent(HomeScreenComponentId, () =>
    AuthWrappedComponent(HomeScreen, true, HomeScreenComponentId)
);
Navigation.registerComponent(SigninScreenComponentId, () =>
    NoAuthWrappedComponent(SigninScreen)
);
Navigation.registerComponent(SendShareScreenComponentId, () =>
    AuthWrappedComponent(SendShareScreen, true, SendShareScreenComponentId)
);
Navigation.registerComponent(AccountSettingsScreenComponentId, () =>
    AuthWrappedComponent(
        AccountSettingsScreen,
        true,
        AccountSettingsScreenComponentId
    )
);
Navigation.registerComponent(NewProfileSheetComponentId, () =>
    AuthWrappedComponent(NewProfileSheet, true, NewProfileSheetComponentId)
);
Navigation.registerComponent(HelpInfoSheetComponentId, () =>
    NoAuthWrappedComponent(HelpInfoSheet, true, HelpInfoSheetComponentId)
);

Navigation.registerComponent(ViewShareScreenComponentId, () =>
    AuthWrappedComponent(ViewShareScreen, true, ViewShareScreenComponentId)
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
Navigation.setDefaultOptions({
    topBar: {
        visible: false,
    },
});
