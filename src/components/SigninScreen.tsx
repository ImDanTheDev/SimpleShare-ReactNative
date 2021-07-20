import React, { useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import {
    Navigation,
    NavigationFunctionComponent,
} from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { googleSignIn } from '../api/AccountAPI';
import IUser from '../api/IUser';
import { increment } from '../redux/counterSlice';
import { RootState } from '../redux/store';
import { ComponentId as WelcomeScreenComponentId } from './WelcomeScreen';

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
}

const SigninScreen: NavigationFunctionComponent<Props> = () => {
    const dispatch = useDispatch();
    const count = useSelector((state: RootState) => state.counter.value);

    const user: IUser | undefined = useSelector(
        (state: RootState) => state.auth.user
    );

    useEffect(() => {
        if (user) {
            console.log('Already have a user.');
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
        }
    }, [user]);

    const incrementCounter = () => {
        dispatch(increment());
    };

    const handleGoogleSignInButton = async () => {
        try {
            await googleSignIn();
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
