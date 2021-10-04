import 'react-native-get-random-values';
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
import SearchProfilesScreen, {
    ComponentId as SearchProfilesScreenComponentId,
    Props as SearchProfilesScreenProps,
} from './components/screens/SearchProfilesScreen';
import { IAuth, IFirebase, IFirestore, IStorage } from '@omnifire/api';
import { OFAuth, OFFirebase, OFFirestore, OFStorage } from '@omnifire/rn';
import {
    initFirebase,
    IShare,
    serviceHandler,
    startAuthStateListener,
} from 'simpleshare-common';
import BaseScreenComponentType from './components/screens/BaseScreen';

import NetInfo from '@react-native-community/netinfo';
import keys from '../keys';

import { LogBox } from 'react-native';
import PushNotification from 'react-native-push-notification';

LogBox.ignoreLogs([
    'ReactNativeFiberHostComponent: Calling getNode() on the ref of an Animated component is no longer necessary. You can now directly use the ref instead. This method will be removed in a future release.',
]);

const entrypoint = (): void => {
    const initApp = async () => {
        PushNotification.configure({
            onNotification: (noti) => {
                noti.finish('');
                Navigation.setRoot({
                    root: {
                        stack: {
                            children: [
                                {
                                    component: {
                                        name: HomeScreenComponentId,
                                    },
                                },
                                {
                                    component: {
                                        name: ViewShareScreenComponentId,
                                        passProps: {
                                            share: noti.data as IShare,
                                        },
                                    },
                                },
                            ],
                        },
                    },
                });
            },
            requestPermissions: true,
        });

        PushNotification.createChannel(
            {
                channelId: 'shares',
                channelName: 'Shares',
                channelDescription:
                    'A channel for received share notifications',
            },
            (_) => {
                // Ignore the result of attempting to create a channel.
            }
        );

        const firebase: IFirebase = new OFFirebase();
        const auth: IAuth = new OFAuth();
        auth.configureGoogle(keys.firebase.webClientId);
        const firestore: IFirestore = new OFFirestore();
        const storage: IStorage = new OFStorage();
        initFirebase(firebase, firestore, auth, storage);

        const netInfoState = await NetInfo.fetch();
        if (!netInfoState.isConnected) {
            // TODO: Show connection error screen.
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
            return;
        }

        let servicesUpToDate = false;
        try {
            servicesUpToDate = await serviceHandler.isServiceHandlerUpToDate();
        } catch {
            servicesUpToDate = false;
        }

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
            return;
        }

        store.dispatch(startAuthStateListener());
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
        registerScreen<SearchProfilesScreenProps>(
            SearchProfilesScreen,
            SearchProfilesScreenComponentId,
            true,
            true
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
