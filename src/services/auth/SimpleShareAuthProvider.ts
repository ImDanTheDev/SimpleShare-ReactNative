import IAuthProvider from './IAuthProvider';
import IUser from '../../api/IUser';

export default class SimpleShareAuthProvider implements IAuthProvider {
    googleSignIn = (): Promise<IUser> => {
        return new Promise<IUser>(async (resolve, reject) => {
            reject('Simple Share authentication is not implemented.');
        });
    };

    signOut = (): Promise<void> => {
        return new Promise<void>(async (resolve, reject) => {
            reject('Simple Share authentication is not implemented.');
        });
    };
}
