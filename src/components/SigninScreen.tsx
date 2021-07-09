import React, { useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import {
    Navigation,
    NavigationFunctionComponent,
} from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../api';
import { increment } from '../counterSlice';
import { RootState } from '../store';
import { ComponentId as WelcomeScreenComponentId } from './WelcomeScreen';

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
}

const SigninScreen: NavigationFunctionComponent<Props> = () => {
    const dispatch = useDispatch();
    const count = useSelector((state: RootState) => state.counter.value);

    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        if (user) {
            console.log(
                'We already have a user, so no need to signin. Going back to WelcomeScreen.'
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
            console.log('We do not have a user, so wait for user to signin.');
        }
    }, [user]);

    const incrementCounter = () => {
        dispatch(increment());
    };

    const handleGoogleSignInButton = async () => {
        try {
            await authService.googleSignIn();
        } catch (e) {}
    };

    return (
        <View>
            <Text>Signin Screen</Text>
            <Text>Simple Share {count}</Text>
            <Button title='Increment' onPress={incrementCounter} />
            <Button title='Google Sign-In' onPress={handleGoogleSignInButton} />
        </View>
    );
};

export default SigninScreen;
export type { Props };
export const ComponentId = 'com.simpleshare.SigninScreen';
