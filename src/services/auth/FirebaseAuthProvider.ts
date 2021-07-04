import { GoogleSignin } from "@react-native-google-signin/google-signin";
import IAuthProvider from "./IAuthProvider";
import auth from '@react-native-firebase/auth';
import IUser from "./IUser";

export default class FirebaseAuthProvider implements IAuthProvider {

    constructor(googleWebClientId: string, onAuthStateChanged: (user: IUser | null) => void) {
        GoogleSignin.configure({
            webClientId: googleWebClientId,
        });

        auth().onAuthStateChanged(onAuthStateChanged);
    }

    googleSignIn = (): Promise<IUser> => {
        return new Promise<IUser>(async (resolve, reject) => {
            try {
                const { idToken } = await GoogleSignin.signIn();
                const googleCredential = auth.GoogleAuthProvider.credential(idToken);
                const firebaseUserCredential = await auth().signInWithCredential(googleCredential);
                const firebaseUser = firebaseUserCredential.user;

                resolve({
                    displayName: firebaseUser.displayName
                });
            } catch (e) {
                reject(e);
                throw e;
            }
        });
    }

    signOut = (): Promise<void> => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                await auth().signOut();
                resolve();
            } catch (e) {
                reject(e);
                throw e;
            }
        });
    }
}