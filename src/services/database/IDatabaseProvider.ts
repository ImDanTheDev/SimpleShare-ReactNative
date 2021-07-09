import IUserData from './IUserData';

export default interface IDatabaseProvider {
    getUserData: (uid: string) => Promise<IUserData>;
    setUserData: (uid: string, userData: IUserData) => Promise<boolean>;
}
