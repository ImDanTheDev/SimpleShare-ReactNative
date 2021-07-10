import IDatabaseProvider from './IDatabaseProvider';
import IAccountInfo from '../../api/IAccountInfo';
import IProfile from '../../api/IProfile';

export default class SimpleShareDatabaseProvider implements IDatabaseProvider {
    getAccountInfo = (): Promise<IAccountInfo> => {
        return new Promise<IAccountInfo>(async (resolve, reject) => {
            reject('Simple Share database is not implemented.');
        });
    };

    setAccountInfo = async (
        uid: string,
        accountInfo: IAccountInfo
    ): Promise<boolean> => {
        return new Promise<boolean>(async (resolve, reject) => {
            reject('Simple Share database is not implemented.');
        });
    };

    createProfile = async (
        uid: string,
        profile: IProfile
    ): Promise<IProfile | undefined> => {
        return new Promise<IProfile>(async (resolve, reject) => {
            reject('Simple Share database is not implemented.');
        });
    };

    getAllProfiles = async (uid: string): Promise<IProfile[] | undefined> => {
        return new Promise<IProfile[] | undefined>(async (resolve, reject) => {
            reject('Simple Share database is not implemented.');
        });
    };
}
