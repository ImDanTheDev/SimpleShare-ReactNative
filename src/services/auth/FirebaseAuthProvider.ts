import { GoogleSignin } from '@react-native-google-signin/google-signin';
import IAuthProvider from './IAuthProvider';
import auth from '@react-native-firebase/auth';
import IUser from '../../api/IUser';

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
        let idToken;
        // Attempt to re-use an already signed-in Google user.
        try {
            idToken = (await GoogleSignin.signInSilently()).idToken;
        } catch {
            idToken = (await GoogleSignin.signIn()).idToken;
        }

        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        // Sign in to Firebase.
        const firebaseUserCredential = await auth().signInWithCredential(
            googleCredential
        );
        const firebaseUser = firebaseUserCredential.user;

        return {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || undefined,
        };
    };

    signOut = async (): Promise<void> => {
        // Sign out of the Google account to allow users to pick a new one.
        await GoogleSignin.signOut();
        // Sign out of Firebase.
        await auth().signOut();
    };
}
