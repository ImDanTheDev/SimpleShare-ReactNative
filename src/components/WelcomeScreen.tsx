import React from 'react';
import { Button, Text, View } from 'react-native';
import { NavigationFunctionComponent } from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { increment } from '../counterSlice';
import { RootState } from '../store';
import IUser from '../services/auth/IUser';
import AuthService, { AuthProviderType } from '../services/auth/AuthService';

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
}

const authService = new AuthService(AuthProviderType.Firebase);

const WelcomeScreen: NavigationFunctionComponent<Props> = () => {
    const dispatch = useDispatch();
    const count = useSelector((state: RootState) => state.counter.value);

    const user: IUser | undefined = useSelector(
        (state: RootState) => state.auth.user
    );

    const incrementCounter = () => {
        dispatch(increment());
    };

    const handleGoogleSignInButton = async () => {
        try {
            await authService.googleSignIn();
        } catch (e) {}
    };

    const handleSignOutButton = async () => {
        await authService.signOut();
    };

    return (
        <View>
            {user ? (
                <>
                    <Text>Welcome {user?.displayName}</Text>
                    <Button title='Sign-Out' onPress={handleSignOutButton} />
                </>
            ) : (
                <>
                    <Text>Simple Share {count}</Text>
                    <Button title='Increment' onPress={incrementCounter} />
                    <Button
                        title='Google Sign-In'
                        onPress={handleGoogleSignInButton}
                    />
                </>
            )}
        </View>
    );
};

export default WelcomeScreen;
export type { Props };
export const ComponentId = 'com.simpleshare.WelcomeScreen';
