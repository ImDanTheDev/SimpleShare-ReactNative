import { Observer } from '@reduxjs/toolkit';
import FirebaseAuthProvider from './FirebaseAuthProvider';
import IAuthProvider from './IAuthProvider';
import IUser from './IUser';
import SimpleShareAuthProvider from './SimpleShareAuthProvider';
import { store } from '../../store';
import { setUser } from '../../authSlice';

export enum AuthProviderType {
    Firebase,
    SimpleShare,
}

export default class AuthService {
    private readonly authProvider: IAuthProvider;
    private readonly authStateChangeObservers: Observer<IUser | undefined>[] =
        [];

    constructor(authProviderType: AuthProviderType) {
        switch (authProviderType) {
            case AuthProviderType.Firebase:
                this.authProvider = new FirebaseAuthProvider(
                    (user: IUser | undefined) => {
                        store.dispatch(setUser(user));

                        for (const observer of this.authStateChangeObservers) {
                            if (observer.next) {
                                observer.next(user);
                            }
                        }
                    }
                );
                break;
            case AuthProviderType.SimpleShare:
                this.authProvider = new SimpleShareAuthProvider();
                break;
        }
    }

    onAuthStateChanged(observer: Observer<IUser>): () => void {
        const exists = this.authStateChangeObservers.includes(observer);
        if (exists) {
            console.log('Observer is already attached.');
        } else {
            this.authStateChangeObservers.push(observer);
        }

        return () => {
            const observerIndex =
                this.authStateChangeObservers.indexOf(observer);
            if (observerIndex === -1) {
                return console.log('Obserer does not exist.');
            }

            this.authStateChangeObservers.splice(observerIndex, 1);
        };
    }

    googleSignIn = async (): Promise<IUser | undefined> => {
        try {
            const user = await this.authProvider.googleSignIn();
            return user;
        } catch {
            await this.signOut();
            return undefined;
        }
    };

    signOut = async (): Promise<void> => {
        await this.authProvider.signOut();
    };
}
