import React, { useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import {
    Navigation,
    NavigationFunctionComponent,
} from 'react-native-navigation';
import { useSelector } from 'react-redux';
import { authService, databaseService } from '../api';
import IUser from '../services/auth/IUser';
import IUserData from '../services/database/IUserData';
import { RootState } from '../store';
import { ComponentId as WelcomeScreenComponentId } from './WelcomeScreen';

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
}

const CompleteProfileScreen: NavigationFunctionComponent<Props> = () => {
    const user: IUser | undefined = useSelector(
        (state: RootState) => state.auth.user
    );

    const userData: IUserData | undefined = useSelector(
        (state: RootState) => state.user.userData
    );

    const [num, setNum] = useState<number>();

    useEffect(() => {
        if (!user) {
            // We do not have a user, so go back to the WelcomeScreen to restart auth flow.
            console.log('We do not have a user, so go back to WelcomeScreen.');
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
        } else {
            console.log('We have a user, but do we have their user data?');
            if (!userData) {
                // We do not have any user data, so go back to WelcomeScreen to restart auth flow.
                console.log(
                    'We do not have their user data, so go back to WelcomeScreen.'
                );
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
            } else {
                // We have user data, but is it complete?
                console.log('We have their user data, but is it complete?');
                if (userData.isProfileComplete) {
                    // Profile is complete, so go back to WelcomeScreen to restart auth flow.
                    console.log(
                        'Their user data is complete, so go to WelcomeScreen.'
                    );
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
                } else {
                    // Profile is not complete.
                    console.log(
                        'Their user data is not complete, so wait for user to complete it.'
                    );
                }
            }
        }
    }, [user, userData]);

    const handleSignOutButton = async () => {
        await authService.signOut();
    };

    const handleCompleteProfileButton = async () => {
        if (user) {
            const success = await databaseService.setUserData(user.uid, {
                num: num,
                isProfileComplete: true,
            });
            // setUserData will cause a re-render that is used to go back to WelcomeScreen.
            if (success) {
                console.log('Saved completed profile to database.');
            } else {
                console.log('Failed to save completed profile to database.');
            }
        } else {
            console.log('Cannot complete profile when signed-out.');
        }
    };

    return (
        <View>
            <Text>Complete Profile</Text>
            <Text>Welcome {user?.displayName}</Text>
            <TextInput
                keyboardType='decimal-pad'
                onChangeText={(text) => setNum(Number.parseInt(text, 10))}
            />
            <Button title='Sign-Out' onPress={handleSignOutButton} />
            <Button
                title='Complete Profile'
                onPress={handleCompleteProfileButton}
            />
        </View>
    );
};

export default CompleteProfileScreen;
export type { Props };
export const ComponentId = 'com.simpleshare.CompleteProfileScreen';
