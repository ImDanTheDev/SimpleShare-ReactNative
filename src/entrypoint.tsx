import { ComponentProvider } from 'react-native';
import {
    Navigation,
    NavigationComponentProps,
    NavigationFunctionComponent,
} from 'react-native-navigation';
import { store } from './redux/store';

import CompleteAccountScreen, {
    ComponentId as CompleteAccountScreenComponentId,
    Props as CompleteAccountScreenProps,
} from './components/screens/CompleteAccountScreen';
import HomeScreen, {
    ComponentId as HomeScreenComponentId,
    Props as HomeScreenProps,
} from './components/screens/HomeScreen';
import SigninScreen, {
    ComponentId as SigninScreenComponentId,
    Props as SigninScreenProps,
} from './components/screens/SigninScreen';
import SendShareScreen, {
    ComponentId as SendShareScreenComponentId,
    Props as SendShareScreenProps,
} from './components/screens/SendShareScreen';
import AccountSettingsScreen, {
    ComponentId as AccountSettingsScreenComponentId,
    Props as AccountSettingsScreenProps,
} from './components/screens/AccountSettingsScreen';
import NewProfileSheet, {
    ComponentId as NewProfileSheetComponentId,
    Props as NewProfileSheetProps,
} from './components/sheets/NewProfileSheet';
import HelpInfoSheet, {
    ComponentId as HelpInfoSheetComponentId,
    Props as HelpInfoSheetProps,
} from './components/sheets/HelpInfoSheet';
import ViewShareScreen, {
    ComponentId as ViewShareScreenComponentId,
    Props as ViewShareScreenProps,
} from './components/screens/ViewShareScreen';
import UpdateScreen, {
    ComponentId as UpdateScreenComponentId,
    Props as UpdateScreenProps,
} from './components/screens/UpdateScreen';
import { IAuth, IFirebase, IFirestore, IStorage } from '@omnifire/api';
import { OFAuth, OFFirebase, OFFirestore, OFStorage } from '@omnifire/rn';
import {
    initFirebase,
    serviceHandler,
    startAuthStateListener,
} from 'simpleshare-common';
import BaseScreenComponentType from './components/screens/BaseScreen';

const entrypoint = (): void => {
    const initApp = async () => {
        const firebase: IFirebase = new OFFirebase();
        const auth: IAuth = new OFAuth();
        auth.configureGoogle(
            '555940005658-jv7ungr9jbepa8ttcnu0e2rmub7siteo.apps.googleusercontent.com'
        );
        const firestore: IFirestore = new OFFirestore();
        const storage: IStorage = new OFStorage();
        initFirebase(firebase, firestore, auth, storage);

        store.dispatch(startAuthStateListener());
        const servicesUpToDate =
            await serviceHandler.isServiceHandlerUpToDate();
        if (!servicesUpToDate) {
            Navigation.setRoot({
                root: {
                    stack: {
                        children: [
                            {
                                component: {
                                    name: UpdateScreenComponentId,
                                },
                            },
                        ],
                    },
                },
            });
        }
    };

    const registerScreens = () => {
        registerScreen<SigninScreenProps>(
            SigninScreen,
            SigninScreenComponentId,
            false,
            false
        );
        registerScreen<HelpInfoSheetProps>(
            HelpInfoSheet,
            HelpInfoSheetComponentId,
            false,
            false
        );

        registerScreen<CompleteAccountScreenProps>(
            CompleteAccountScreen,
            CompleteAccountScreenComponentId,
            true,
            false
        );

        registerScreen<HomeScreenProps>(
            HomeScreen,
            HomeScreenComponentId,
            true,
            true
        );
        registerScreen<SendShareScreenProps>(
            SendShareScreen,
            SendShareScreenComponentId,
            true,
            true
        );
        registerScreen<AccountSettingsScreenProps>(
            AccountSettingsScreen,
            AccountSettingsScreenComponentId,
            true,
            true
        );
        registerScreen<NewProfileSheetProps>(
            NewProfileSheet,
            NewProfileSheetComponentId,
            true,
            true
        );
        registerScreen<ViewShareScreenProps>(
            ViewShareScreen,
            ViewShareScreenComponentId,
            true,
            true
        );
        registerScreen<UpdateScreenProps>(
            UpdateScreen,
            UpdateScreenComponentId,
            false,
            false
        );
    };

    const setupNavigation = () => {
        Navigation.events().registerAppLaunchedListener(() => {
            Navigation.setRoot({
                root: {
                    stack: {
                        children: [
                            {
                                component: {
                                    name: HomeScreenComponentId,
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

    const createScreen = <T extends NavigationComponentProps>(
        Screen: NavigationFunctionComponent<T>,
        requireUser: boolean,
        requireCompletedAccount: boolean
    ): ComponentProvider => {
        const componentProvider: ComponentProvider = () => {
            return BaseScreenComponentType(
                Screen,
                requireUser,
                requireCompletedAccount
            );
        };
        return componentProvider;
    };

    const registerScreen = <T extends NavigationComponentProps>(
        screen: NavigationFunctionComponent<T>,
        screenId: string,
        requireUser: boolean,
        requireCompletedAccount: boolean
    ): void => {
        Navigation.registerComponent(
            screenId,
            createScreen<T>(screen, requireUser, requireCompletedAccount)
        );
    };

    registerScreens();
    setupNavigation();
    initApp();
};

export default entrypoint;
