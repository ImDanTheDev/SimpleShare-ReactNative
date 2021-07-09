import IUser from '../../api/IUser';

export default interface IAuthProvider {
    googleSignIn: () => Promise<IUser>;
    signOut: () => Promise<void>;
}
