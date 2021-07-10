import { store } from '../../redux/store';
import { setAccountInfo } from '../../redux/accountSlice';
import FirestoreDatabaseProvider from './FirestoreDatabaseProvider';
import IDatabaseProvider from './IDatabaseProvider';
import IAccountInfo from '../../api/IAccountInfo';
import SimpleShareDatabaseProvider from './SimpleShareDatabaseProvider';
import IProfile from '../../api/IProfile';
import { setProfiles } from '../../redux/profilesSlice';

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

    createProfile = async (
        uid: string,
        profile: IProfile
    ): Promise<IProfile | undefined> => {
        const newProfile = await this.databaseProvider.createProfile(
            uid,
            profile
        );
        return newProfile;
    };

    getAllProfiles = async (uid: string): Promise<IProfile[] | undefined> => {
        const profiles = await this.databaseProvider.getAllProfiles(uid);

        store.dispatch(setProfiles(profiles || []));

        return profiles;
    };

    getProfile = async (
        uid: string,
        profileId: string
    ): Promise<IProfile | undefined> => {
        const profile = await this.databaseProvider.getProfile(uid, profileId);
        return profile;
    };

    deleteProfile = async (
        uid: string,
        profileId: string
    ): Promise<boolean> => {
        const success = await this.databaseProvider.deleteProfile(
            uid,
            profileId
        );
        return success;
    };
}
