import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import {
    Navigation,
    NavigationFunctionComponent,
} from 'react-native-navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import IUser from '../api/IUser';
import { databaseService } from '../api/api';
import IAccountInfo from '../api/IAccountInfo';
import { ComponentId as SigninScreenComponentId } from './SigninScreen';
import { ComponentId as HomeScreenComponentId } from './HomeScreen';
import { ComponentId as CompleteAccountScreenComponentId } from './CompleteAccountScreen';

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
}

// Check the authentication state and either show the SigninScreen,
// CompleteAccountScreen, or HomeScreen.
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

    const accountInfo: IAccountInfo | undefined = useSelector(
        (state: RootState) => state.user.accountInfo
    );

    // This is called after the initial render and after 'user' or 'accountInfo' changes.
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
                    'We have a user, so check if we have their account info.'
                );
                if (accountInfo) {
                    // We fetched the account info on the previous render, so now we have it.
                    console.log(
                        'We have the account info, but is it complete?'
                    );
                    if (accountInfo.isAccountComplete) {
                        console.log(
                            'Account info is complete, so go to HomeScreen.'
                        );
                        await setRootScreen(HomeScreenComponentId);
                    } else {
                        console.log(
                            'Account info is not complete, so go to CompleteAccountScreen.'
                        );
                        await setRootScreen(CompleteAccountScreenComponentId);
                    }
                } else {
                    // We do not have the account info yet, so fetch it. Then handle it on the next render.
                    console.log(
                        'We do not have the account info, so fetch it.'
                    );
                    await databaseService.getAccountInfo(user.uid);
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
    }, [user, accountInfo]);

    return (
        <View>
            <Text>Determining route...</Text>
        </View>
    );
};

export default WelcomeScreen;
export type { Props };
export const ComponentId = 'com.simpleshare.WelcomeScreen';
