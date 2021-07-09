import React, { useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import {
    Navigation,
    NavigationFunctionComponent,
} from 'react-native-navigation';
import { useSelector } from 'react-redux';
import { authService } from '../api';
import IUser from '../services/auth/IUser';
import { RootState } from '../store';
import { ComponentId as WelcomeScreenComponentId } from './WelcomeScreen';

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
}

const HomeScreen: NavigationFunctionComponent<Props> = () => {
    const user: IUser | undefined = useSelector(
        (state: RootState) => state.auth.user
    );

    useEffect(() => {
        if (!user) {
            // We do not have a user, so go back to the WelcomeScreen to restart auth flow.
            console.log('We do not have a user, so go to WelcomeScreen.');
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
            console.log('We have a user, so stay on HomeScreen.');
        }
    }, [user]);

    const handleSignOutButton = async () => {
        await authService.signOut();
    };

    return (
        <View>
            <Text>Home Screen</Text>
            <Text>Welcome {user?.displayName}</Text>
            <Button title='Sign-Out' onPress={handleSignOutButton} />
        </View>
    );
};

export default HomeScreen;
export type { Props };
export const ComponentId = 'com.simpleshare.HomeScreen';
