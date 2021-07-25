import {
    GoogleSignin,
    statusCodes,
    User,
} from '@react-native-google-signin/google-signin';
import IAuthProvider from './IAuthProvider';
import auth from '@react-native-firebase/auth';
import IUser from '../../api/IUser';
import SimpleShareError, { ErrorCode } from '../../SimpleShareError';

const GoogleWebClientId =
    '555940005658-jv7ungr9jbepa8ttcnu0e2rmub7siteo.apps.googleusercontent.com';

export default class FirebaseAuthProvider implements IAuthProvider {
    constructor(onAuthStateChanged: (user: IUser | undefined) => void) {
        GoogleSignin.configure({
            webClientId: GoogleWebClientId,
        });

        auth().onAuthStateChanged((firebaseUser) => {
            if (firebaseUser) {
                onAuthStateChanged({
                    uid: firebaseUser.uid,
                    displayName: firebaseUser.displayName || '',
                });
            } else {
                onAuthStateChanged(undefined);
            }
        });
    }

    googleSignIn = async (): Promise<IUser> => {
        let googleUser: User;
        // Attempt to re-use an already signed-in Google user.
        try {
            googleUser = await GoogleSignin.signInSilently();
        } catch {
            // Could not sign in silently
            try {
                googleUser = await GoogleSignin.signIn();
            } catch (e) {
                if (e.code === statusCodes.SIGN_IN_CANCELLED) {
                    throw new SimpleShareError(ErrorCode.SIGN_IN_CANCELLED);
                } else {
                    throw new SimpleShareError(
                        ErrorCode.UNEXPECTED_SIGN_IN_ERROR
                    );
                }
            }
        }

        if (!googleUser.idToken) {
            throw new SimpleShareError(ErrorCode.UNEXPECTED_SIGN_IN_ERROR);
        }

        const googleCredential = auth.GoogleAuthProvider.credential(
            googleUser.idToken
        );
        // Sign in to Firebase.
        try {
            const firebaseUserCredential = await auth().signInWithCredential(
                googleCredential
            );
            const firebaseUser = firebaseUserCredential.user;
            return {
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName || undefined,
            };
        } catch (e) {
            switch (e.code) {
                case 'auth/account-exists-with-different-credential':
                case 'auth/invalid-credential':
                    throw new SimpleShareError(
                        ErrorCode.SIGN_IN_INVALID_CREDENTIALS
                    );
                case 'auth/user-disabled':
                    throw new SimpleShareError(ErrorCode.ACCOUNT_DISABLED);
            }
            throw new SimpleShareError(ErrorCode.UNEXPECTED_SIGN_IN_ERROR);
        }
    };

    signOut = async (): Promise<void> => {
        // Sign out of the Google account to allow users to pick a new one.
        await GoogleSignin.signOut();
        // Sign out of Firebase.
        await auth().signOut();
    };
}
