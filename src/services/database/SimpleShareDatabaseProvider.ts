import IDatabaseProvider from './IDatabaseProvider';
import IAccountInfo from '../../api/IAccountInfo';

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
}
