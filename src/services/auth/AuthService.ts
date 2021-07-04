import { Observer } from "@reduxjs/toolkit";
import FirebaseAuthProvider from "./FirebaseAuthProvider";
import IAuthProvider from "./IAuthProvider";
import IUser from "./IUser";
import SimpleShareAuthProvider from "./SimpleShareAuthProvider";

export enum AuthProviderType {
    Firebase,
    SimpleShare
}

export default class AuthService {

    private readonly authProvider: IAuthProvider;
    private readonly authStateChangeObservers: Observer<IUser | null>[] = [];

    constructor(authProviderType: AuthProviderType) {
        switch (authProviderType) {
            case AuthProviderType.Firebase:
                this.authProvider = new FirebaseAuthProvider('555940005658-jv7ungr9jbepa8ttcnu0e2rmub7siteo.apps.googleusercontent.com', (user: IUser | null) => {
                    for (const observer of this.authStateChangeObservers) {
                        if (observer.next) {
                            observer.next(user);
                        }
                    }
                });
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
            const observerIndex = this.authStateChangeObservers.indexOf(observer);
            if (observerIndex === -1) {
                return console.log('Obserer does not exist.');
            }

            this.authStateChangeObservers.splice(observerIndex, 1);
        };
    }

    googleSignIn = async (): Promise<IUser> => {
        return await this.authProvider.googleSignIn();
    }

    signOut = async (): Promise<void> => {
        return await this.authProvider.signOut();
    }
}