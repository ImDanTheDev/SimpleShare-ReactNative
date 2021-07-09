import { store } from '../../store';
import { setUserData } from '../../userSlice';
import FirestoreDatabaseProvider from './FirestoreDatabaseProvider';
import IDatabaseProvider from './IDatabaseProvider';
import IUserData from './IUserData';
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

    getUserData = async (uid: string): Promise<IUserData> => {
        const userData = await this.databaseProvider.getUserData(uid);
        store.dispatch(setUserData(userData));

        return userData;
    };

    setUserData = async (
        uid: string,
        userData: IUserData
    ): Promise<boolean> => {
        const success = await this.databaseProvider.setUserData(uid, userData);
        if (success) {
            store.dispatch(setUserData(userData));
        }
        return success;
    };
}
