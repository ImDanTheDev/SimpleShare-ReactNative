import React, { PropsWithChildren } from 'react';
import { ComponentProvider } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import {
    Navigation,
    NavigationComponentProps,
    NavigationFunctionComponent,
} from 'react-native-navigation';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from './redux/store';

import SplashScreen from './components/SplashScreen';
import WelcomeScreen, {
    ComponentId as WelcomeScreenComponentId,
    Props as WelcomeScreenProps,
} from './components/WelcomeScreen';
import CompleteAccountScreen, {
    ComponentId as CompleteAccountScreenComponentId,
    Props as CompleteAccountScreenProps,
} from './components/CompleteAccountScreen';
import HomeScreen, {
    ComponentId as HomeScreenComponentId,
    Props as HomeScreenProps,
} from './components/HomeScreen';
import SigninScreen, {
    ComponentId as SigninScreenComponentId,
    Props as SigninScreenProps,
} from './components/SigninScreen';
import SendShareScreen, {
    ComponentId as SendShareScreenComponentId,
    Props as SendShareScreenProps,
} from './components/SendShareScreen';
import AccountSettingsScreen, {
    ComponentId as AccountSettingsScreenComponentId,
    Props as AccountSettingsScreenProps,
} from './components/AccountSettingsScreen';
import NewProfileSheet, {
    ComponentId as NewProfileSheetComponentId,
    Props as NewProfileSheetProps,
} from './components/NewProfileSheet';
import HelpInfoSheet, {
    ComponentId as HelpInfoSheetComponentId,
    Props as HelpInfoSheetProps,
} from './components/HelpInfoSheet';
import ViewShareScreen, {
    ComponentId as ViewShareScreenComponentId,
    Props as ViewShareScreenProps,
} from './components/ViewShareScreen';
import { ProtectedScreen } from './components/ProtectedScreen';
import { ToastedScreen } from './components/ToastedScreen';

// Auth levels from least restrictive to most restrictive:
// Optional, RequireUser, RequireProfilee
type AuthType = 'Optional' | 'RequireUser' | 'RequireProfile';

const entrypoint = (): void => {
    const persistor = persistStore(store);

    const BaseScreenComponentType = <T extends NavigationComponentProps>(
        Screen: React.FC<T>
    ) => {
        return gestureHandlerRootHOC((props: PropsWithChildren<T>) => {
            return (
                <Provider store={store}>
                    <PersistGate
                        loading={<SplashScreen />}
                        persistor={persistor}
                    >
                        <ToastedScreen>
                            <Screen {...props} />
                        </ToastedScreen>
                    </PersistGate>
                </Provider>
            );
        });
    };

    const createScreen = <T extends NavigationComponentProps>(
        Screen: NavigationFunctionComponent<T>
    ): ComponentProvider => {
        const componentProvider: ComponentProvider = () => {
            return BaseScreenComponentType(Screen);
        };
        return componentProvider;
    };

    const createdProtectedScreen = <T extends NavigationComponentProps>(
        Screen: NavigationFunctionComponent<T>,
        requireProfile: boolean
    ): ComponentProvider => {
        const ProtectedScreenComponentType: React.FC<PropsWithChildren<T>> = (
            props: PropsWithChildren<T>
        ) => {
            return (
                <ProtectedScreen
                    authFail={<WelcomeScreen {...props} />}
                    authing={<SplashScreen {...props} />}
                    authSuccess={<Screen {...props} />}
                    requireProfile={requireProfile}
                />
            );
        };
        const componentProvider: ComponentProvider = () => {
            return BaseScreenComponentType(ProtectedScreenComponentType);
        };
        return componentProvider;
    };

    const registerScreen = <T extends NavigationComponentProps>(
        screen: NavigationFunctionComponent<T>,
        screenId: string,
        authType: AuthType
    ): void => {
        switch (authType) {
            case 'Optional':
                Navigation.registerComponent(screenId, createScreen<T>(screen));
                break;
            case 'RequireProfile':
                Navigation.registerComponent(
                    screenId,
                    createdProtectedScreen<T>(screen, true)
                );
                break;
            case 'RequireUser':
                Navigation.registerComponent(
                    screenId,
                    createdProtectedScreen<T>(screen, false)
                );
                break;
        }
    };

    registerScreen<WelcomeScreenProps>(
        WelcomeScreen,
        WelcomeScreenComponentId,
        'Optional'
    );
    registerScreen<SigninScreenProps>(
        SigninScreen,
        SigninScreenComponentId,
        'Optional'
    );
    registerScreen<HelpInfoSheetProps>(
        HelpInfoSheet,
        HelpInfoSheetComponentId,
        'Optional'
    );

    registerScreen<CompleteAccountScreenProps>(
        CompleteAccountScreen,
        CompleteAccountScreenComponentId,
        'RequireUser'
    );

    registerScreen<HomeScreenProps>(
        HomeScreen,
        HomeScreenComponentId,
        'RequireProfile'
    );
    registerScreen<SendShareScreenProps>(
        SendShareScreen,
        SendShareScreenComponentId,
        'RequireProfile'
    );
    registerScreen<AccountSettingsScreenProps>(
        AccountSettingsScreen,
        AccountSettingsScreenComponentId,
        'RequireProfile'
    );
    registerScreen<NewProfileSheetProps>(
        NewProfileSheet,
        NewProfileSheetComponentId,
        'RequireProfile'
    );
    registerScreen<ViewShareScreenProps>(
        ViewShareScreen,
        ViewShareScreenComponentId,
        'RequireProfile'
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
};

export default entrypoint;
