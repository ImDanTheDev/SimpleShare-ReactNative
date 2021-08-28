import { store } from '../redux/store';
import { setUser } from '../redux/authSlice';
import { FirebaseAuthProvider, IAuthProvider, IUser } from 'simpleshare-common';
import { OFAuth } from '@omnifire/rn';

export enum AuthProviderType {
    Firebase,
}

export default class AuthService {
    private readonly authProviderType: AuthProviderType;
    private authProvider: IAuthProvider | undefined;

    isServiceInitialized = false;

    constructor(authProviderType: AuthProviderType) {
        this.authProviderType = authProviderType;
    }

    initialize = (): void => {
        if (this.authProvider && this.isServiceInitialized) {
            console.log('Auth Service is already initialized.');
            return;
        }

        switch (this.authProviderType) {
            case AuthProviderType.Firebase: {
                const ofAuth = new OFAuth();
                ofAuth.configureGoogle(
                    '555940005658-jv7ungr9jbepa8ttcnu0e2rmub7siteo.apps.googleusercontent.com'
                );
                this.authProvider = new FirebaseAuthProvider(
                    ofAuth,
                    (user: IUser | undefined) => {
                        store.dispatch(setUser(user));
                    }
                );
                break;
            }
        }

        this.isServiceInitialized = true;
        console.log('Auth Service initialized.');
    };

    googleSignIn = async (): Promise<IUser | undefined> => {
        if (!this.authProvider) {
            console.error('Auth Service is not initialized!');
            return undefined;
        }
        const user = await this.authProvider.googleSignIn();
        return user;
    };

    signOut = async (): Promise<void> => {
        if (!this.authProvider) {
            console.error('Auth Service is not initialized!');
            return;
        }
        await this.authProvider.signOut();
    };
}
