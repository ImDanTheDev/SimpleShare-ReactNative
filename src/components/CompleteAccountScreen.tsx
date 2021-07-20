import React, { useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import {
    Navigation,
    NavigationFunctionComponent,
} from 'react-native-navigation';
import { useSelector } from 'react-redux';
import { initializeAccount, signOut } from '../api/AccountAPI';
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
            console.log(
                'Error: User is undefined. Cannot continue account completion without a user.'
            );
            return; // TODO: We need a user for this page. Handle this error.
        }

        const continueAuthFlow = async () => {
            if (accountInfo) {
                console.log('Does Account Doc Exist? Yes');
                if (accountInfo.isAccountComplete) {
                    console.log('Is Account Doc Complete? Yes');
                    setRootScreen(WelcomeScreenComponentId);
                } else {
                    console.log('Is Account Doc Complete? No');
                    console.log(
                        'Waiting for user to complete account. This will complete the account and create a default profile.'
                    );
                }
            } else {
                console.log('Does Account Doc Exist? No');
                console.log(
                    'Waiting for user to complete account. This will create the account, complete it, and create a default profile.'
                );
            }
        };

        continueAuthFlow();
    }, [accountInfo, user]);

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

    const handleSignOutButton = async () => {
        await signOut();
    };

    const handleCompleteAccountButton = async () => {
        if (!user) return; // TODO: We need a user for this page. Handle this error.

        // Creates the account if it does not exist. Completes the account info. Adds a default profile.
        console.log(
            'Completing Account [1/3] Creating an account if one does not exist.'
        );
        console.log('Completing Account [2/3] Setting account info.');
        console.log(
            'Completing Account [3/3] Creating a default profile or resetting the existing one.'
        );
        const success = await initializeAccount(user.uid, {
            num: num,
            phoneNumber: phoneNumber,
            isAccountComplete: true,
        });

        if (success) {
            console.log('Saved completed account to database.');
        } else {
            console.log('Failed to complete the account.');
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
