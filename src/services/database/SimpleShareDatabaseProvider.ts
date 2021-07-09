import IDatabaseProvider from './IDatabaseProvider';
import IUserData from './IUserData';

export default class SimpleShareDatabaseProvider implements IDatabaseProvider {
    getUserData = (): Promise<IUserData> => {
        return new Promise<IUserData>(async (resolve, reject) => {
            reject('Simple Share database is not implemented.');
        });
    };

    setUserData = async (
        uid: string,
        userData: IUserData
    ): Promise<boolean> => {
        return new Promise<boolean>(async (resolve, reject) => {
            reject('Simple Share database is not implemented.');
        });
    };
}
