import React, { useEffect, useState } from 'react';
import {
    Navigation,
    NavigationFunctionComponent,
} from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import IUser from '../api/IUser';
import { authService, databaseService } from '../api/api';
import IAccountInfo, { isAccountComplete } from '../api/IAccountInfo';
import { ComponentId as SigninScreenComponentId } from './SigninScreen';
import { ComponentId as HomeScreenComponentId } from './HomeScreen';
import { ComponentId as CompleteAccountScreenComponentId } from './CompleteAccountScreen';
import IProfile from '../api/IProfile';
import { setCurrentProfile } from '../redux/profilesSlice';
import { createDefaultProfile } from '../api/ProfileAPI';
import SplashScreen from './SplashScreen';

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
}

// Check the authentication state and either show the SigninScreen,
// CompleteAccountScreen, or HomeScreen.
const WelcomeScreen: NavigationFunctionComponent<Props> = () => {
    const dispatch = useDispatch();

    // Get user from local storage if it exists.
    const user: IUser | undefined = useSelector(
        (state: RootState) => state.auth.user
    );
    const initializing: boolean | undefined = useSelector(
        (state: RootState) => state.auth.initializing
    );
    const accountInfo: IAccountInfo | undefined = useSelector(
        (state: RootState) => state.user.accountInfo
    );

    const profiles: IProfile[] = useSelector(
        (state: RootState) => state.profiles.profiles
    );

    const [fetchedAccountInfo, setFetchedAccountInfo] =
        useState<boolean>(false);

    const [fetchedProfiles, setFetchedProfiles] = useState<boolean>(false);

    const currentProfile: IProfile | undefined = useSelector(
        (state: RootState) => {
            return state.profiles.profiles.find(
                (profile) => profile.id === state.profiles.currentProfileId
            );
        }
    );

    useEffect(() => {
        console.log('Initializing...');
        authService.initialize();
    }, []);

    useEffect(() => {
        const startAuthFlow = async () => {
            if (initializing === undefined || initializing === true) {
                if (initializing === true && user === undefined) {
                    // Firebase only called onAuthStateChanged once, so
                    // a user is not available. Try to sign in.
                    console.log('Going to Sign In Screen');
                    await setRootScreen(SigninScreenComponentId);
                }
            } else {
                // Firebase called onAuthStateChanged twice, so a
                // user may be available. If a user is not available,
                // then the attempted sign in failed. Try to sign in again.
                // If a user is available, then the sign in succeeded.

                if (user === undefined) {
                    console.log('Going to Sign In Screen');
                    await setRootScreen(SigninScreenComponentId);
                } else {
                    console.log('Fetching account info');
                    // Fetch account info.
                    await databaseService.getAccountInfo(user.uid);
                    setFetchedAccountInfo(true);
                }
            }
        };

        startAuthFlow();
    }, [initializing, user]);

    useEffect(() => {
        const continueAuthFlow = async () => {
            if (!user || !fetchedAccountInfo) return;

            if (accountInfo) {
                console.log('Does Account Doc Exist? Yes');

                if (isAccountComplete(accountInfo)) {
                    console.log('Is Account Doc Complete? Yes');
                    await fetchProfiles();
                } else {
                    console.log('Is Account Doc Complete? No');
                    console.log('Going to Complete Account Screen');
                    await setRootScreen(CompleteAccountScreenComponentId);
                }
            } else {
                console.log('Does Account Doc Exist? No');
                console.log('Going to Complete Account Screen');
                await setRootScreen(CompleteAccountScreenComponentId);
            }
        };

        const fetchProfiles = async () => {
            if (!user) return; // TODO: We need a user for this. Handle this error.
            console.log('Ensuring profile exist and that one is selected.');

            await databaseService.getAllProfiles(user.uid);
            setFetchedProfiles(true);
        };

        continueAuthFlow();
    }, [accountInfo, fetchedAccountInfo, user]);

    useEffect(() => {
        if (!fetchedProfiles) return;
        if (!user) return; // TODO: We need a user for this page. Handle this error.

        const ensureProfiles = async () => {
            if (profiles.length > 0) {
                if (!currentProfile) {
                    console.log('Is a profile selected? No');
                    // TODO: Check for a default profile instead of picking first profile.
                    if (profiles[0].id) {
                        console.log(
                            'Selected profile with id: ' + profiles[0].id
                        );
                        dispatch(setCurrentProfile(profiles[0].id));
                    } else {
                        // TODO: Do something here.
                        // We checked if a profile exists, and it does, but the id is blank.
                        // This should never happen as id's are assigned by firestore. This
                        // may happen if a profile is created by the user, but instead of
                        // uploading to firestore, it is saved to the store.
                        // Either way, this will no longer be as big of an issue once
                        // logic is implemented for finding the default profile in the
                        // above TODO. If a profile with the default field set to true
                        // does not exist, one will just be created.
                        console.log('Account has a profile without an id.');
                    }
                } else {
                    console.log('Is a profile selected? Yes');
                    if (
                        profiles.findIndex(
                            (p) => p.id === currentProfile.id
                        ) === -1
                    ) {
                        console.log('Does the selected profile exist? No');
                        console.log('Creating default profile.');
                        await createDefaultProfile(user.uid);
                        console.log('Fetching profiles');
                        await databaseService.getAllProfiles(user.uid);
                    } else {
                        console.log('Does the selected profile exist? Yes');
                        await setRootScreen(HomeScreenComponentId);
                    }
                }
            } else {
                console.log(
                    'Account has 0 profiles. Creating default profile.'
                );
                console.log('Creating default profile.');
                await createDefaultProfile(user.uid);
                console.log('Fetching profiles');
                await databaseService.getAllProfiles(user.uid);
            }
        };

        ensureProfiles();
    }, [profiles, fetchedProfiles, dispatch, currentProfile, user]);

    const setRootScreen = async (screenId: string) => {
        await Navigation.setRoot({
            root: {
                stack: {
                    children: [
                        {
                            component: {
                                name: screenId,
                            },
                        },
                    ],
                },
            },
        });
    };
    return <SplashScreen />;
};

export default WelcomeScreen;
export type { Props };
export const ComponentId = 'com.simpleshare.WelcomeScreen';
