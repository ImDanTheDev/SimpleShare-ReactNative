import React, { useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import {
    Navigation,
    NavigationFunctionComponent,
} from 'react-native-navigation';
import { useSelector } from 'react-redux';
import { signOut, updateAccountInfo } from '../api/AccountAPI';
import IUser from '../api/IUser';
import IAccountInfo from '../api/IAccountInfo';
import { RootState } from '../redux/store';
import { ComponentId as WelcomeScreenComponentId } from './WelcomeScreen';

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
}

const CompleteAccountScreen: NavigationFunctionComponent<Props> = () => {
    const user: IUser | undefined = useSelector(
        (state: RootState) => state.auth.user
    );

    const accountInfo: IAccountInfo | undefined = useSelector(
        (state: RootState) => state.user.accountInfo
    );

    const [num, setNum] = useState<number>();
    const [phoneNumber, setPhoneNumber] = useState<string>('');

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
            console.log('We have a user, but do we have their account info?');
            if (!accountInfo) {
                // We do not have any account info, so go back to WelcomeScreen to restart auth flow.
                console.log(
                    'We do not have their account info, so go back to WelcomeScreen.'
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
                // We have account info, but is it complete?
                console.log('We have their account info, but is it complete?');
                if (accountInfo.isAccountComplete) {
                    // Account is complete, so go back to WelcomeScreen to restart auth flow.
                    console.log(
                        'Their account info is complete, so go to WelcomeScreen.'
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
                    // Account is not complete.
                    console.log(
                        'Their account info is not complete, so wait for user to complete it.'
                    );
                }
            }
        }
    }, [user, accountInfo]);

    const handleSignOutButton = async () => {
        await signOut();
    };

    const handleCompleteAccountButton = async () => {
        if (user) {
            const success = await updateAccountInfo(user.uid, {
                num: num,
                phoneNumber: phoneNumber,
                isAccountComplete: true,
            });
            // setAccountInfo will cause a re-render that is used to go back to WelcomeScreen.
            if (success) {
                console.log('Saved completed account to database.');
            } else {
                console.log('Failed to save completed account to database.');
            }
        } else {
            console.log('Cannot complete account when signed-out.');
        }
    };

    return (
        <View>
            <Text>Complete Account</Text>
            <Text>Welcome {user?.displayName}</Text>
            <TextInput
                keyboardType='decimal-pad'
                onChangeText={(text) => setNum(Number.parseInt(text, 10))}
                placeholder='num'
            />
            <TextInput
                keyboardType='phone-pad'
                onChangeText={setPhoneNumber}
                placeholder='phone number'
            />
            <Button title='Sign-Out' onPress={handleSignOutButton} />
            <Button
                title='Complete Account'
                onPress={handleCompleteAccountButton}
            />
        </View>
    );
};

export default CompleteAccountScreen;
export type { Props };
export const ComponentId = 'com.simpleshare.CompleteAccountScreen';
