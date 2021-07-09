import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import {
    Navigation,
    NavigationFunctionComponent,
} from 'react-native-navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import IUser from '../services/auth/IUser';
import { databaseService } from '../api';
import IUserData from '../services/database/IUserData';
import { ComponentId as SigninScreenComponentId } from './SigninScreen';
import { ComponentId as HomeScreenComponentId } from './HomeScreen';
import { ComponentId as CompleteProfileScreenComponentId } from './CompleteProfileScreen';

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
}

// Check the authentication state and either show the SigninScreen,
// CompleteProfileScreen, or HomeScreen.
const WelcomeScreen: NavigationFunctionComponent<Props> = () => {
    const user: IUser | undefined = useSelector(
        (state: RootState) => state.auth.user,
        (left: IUser | undefined, right: IUser | undefined) => {
            if (left === undefined && right === undefined) return true; // Do not cause update. User remained undefined.
            if (left !== undefined && right !== undefined) {
                if (left.uid === right.uid) return true; // Do not cause update. UID's have not changed, so same user.
                return false; // Cause update. UID's are different, so different user.
            }
            // User was undefined or not undefined, and it is now the opposite of what it was.
            return false; // Cause update.
        }
    );

    const userData: IUserData | undefined = useSelector(
        (state: RootState) => state.user.userData
    );

    // This is called after the initial render and after 'user' or 'userData' changes.
    useEffect(() => {
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

        const startAuthFlow = async () => {
            if (user) {
                // We have a user.
                console.log(
                    'We have a user, so check if we have their user data.'
                );
                if (userData) {
                    // We fetched the user data on the previous render, so now we have it.
                    console.log('We have the user data, but is it complete?');
                    if (userData.isProfileComplete) {
                        console.log(
                            'User data is complete, so go to HomeScreen.'
                        );
                        await setRootScreen(HomeScreenComponentId);
                    } else {
                        console.log(
                            'User data is not complete, so go to CompleteProfileScreen.'
                        );
                        await setRootScreen(CompleteProfileScreenComponentId);
                    }
                } else {
                    // We do not have the user data yet, so fetch it. Then handle it on the next render.
                    console.log('We do not have the user data, so fetch it.');
                    await databaseService.getUserData(user.uid);
                }
            } else {
                console.log(
                    'We do not have a user yet, so go to SigninScreen.'
                );
                // We do not have a user.
                // Go to the signin screen.
                await setRootScreen(SigninScreenComponentId);
            }
        };

        startAuthFlow();
    }, [user, userData]);

    return (
        <View>
            <Text>Determining route...</Text>
        </View>
    );
};

export default WelcomeScreen;
export type { Props };
export const ComponentId = 'com.simpleshare.WelcomeScreen';
