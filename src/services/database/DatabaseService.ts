import { store } from '../../redux/store';
import { setAccountInfo } from '../../redux/accountSlice';
import FirestoreDatabaseProvider from './FirestoreDatabaseProvider';
import IDatabaseProvider from './IDatabaseProvider';
import IAccountInfo from '../../api/IAccountInfo';
import SimpleShareDatabaseProvider from './SimpleShareDatabaseProvider';

export enum DatabaseProviderType {
    Firestore,
    SimpleShare,
}

export default class DatabaseService {
    private readonly databaseProvider: IDatabaseProvider;

    constructor(databaseProviderType: DatabaseProviderType) {
        switch (databaseProviderType) {
            case DatabaseProviderType.Firestore:
                this.databaseProvider = new FirestoreDatabaseProvider();
                break;
            case DatabaseProviderType.SimpleShare:
                this.databaseProvider = new SimpleShareDatabaseProvider();
        }
    }

    getAccountInfo = async (uid: string): Promise<IAccountInfo> => {
        const accountInfo = await this.databaseProvider.getAccountInfo(uid);
        store.dispatch(setAccountInfo(accountInfo));

        return accountInfo;
    };

    setAccountInfo = async (
        uid: string,
        accountInfo: IAccountInfo
    ): Promise<boolean> => {
        const success = await this.databaseProvider.setAccountInfo(
            uid,
            accountInfo
        );
        if (success) {
            store.dispatch(setAccountInfo(accountInfo));
        }
        return success;
    };
}
