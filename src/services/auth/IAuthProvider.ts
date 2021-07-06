import IUser from './IUser';

export default interface IAuthProvider {
    googleSignIn: () => Promise<IUser>;
    signOut: () => Promise<void>;
}
