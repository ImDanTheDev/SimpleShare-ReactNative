import { store } from '../../redux/store';
import { setAccountInfo } from '../../redux/accountSlice';
import FirestoreDatabaseProvider from './FirestoreDatabaseProvider';
import IDatabaseProvider from './IDatabaseProvider';
import IAccountInfo from '../../api/IAccountInfo';
import SimpleShareDatabaseProvider from './SimpleShareDatabaseProvider';
import IProfile from '../../api/IProfile';
import { setProfiles } from '../../redux/profilesSlice';
import { addShare, deleteShare, updateShare } from '../../redux/sharesSlice';
import IShare from '../../api/IShare';

export enum DatabaseProviderType {
    Firestore,
    SimpleShare,
}

export default class DatabaseService {
    private readonly databaseProvider: IDatabaseProvider;

    constructor(databaseProviderType: DatabaseProviderType) {
        switch (databaseProviderType) {
            case DatabaseProviderType.Firestore:
                this.databaseProvider = new FirestoreDatabaseProvider(
                    (share: IShare) => {
                        // OnShareAdded - Called when a share is added to any of the profiles being listened to.
                        store.dispatch(addShare(share));
                    },
                    (share: IShare) => {
                        // OnShareDeleted - Called when a share is deleted from any of the profiles being listened to.
                        if (!share.id) return;
                        store.dispatch(deleteShare(share.id));
                    },
                    (share: IShare) => {
                        // OnShareModified - Called when a share is modified in any of the profiles being listened to.
                        store.dispatch(updateShare(share));
                    }
                );
                break;
            case DatabaseProviderType.SimpleShare:
                this.databaseProvider = new SimpleShareDatabaseProvider();
        }
    }

    getAccountInfo = async (uid: string): Promise<IAccountInfo | undefined> => {
        const accountInfo = await this.databaseProvider.getAccountInfo(uid);
        store.dispatch(setAccountInfo(accountInfo));

        return accountInfo;
    };

    initializeAccount = async (
        uid: string,
        accountInfo: IAccountInfo
    ): Promise<boolean> => {
        const success = await this.databaseProvider.initializeAccount(
            uid,
            accountInfo
        );
        if (success) {
            store.dispatch(setAccountInfo(accountInfo));
        }
        return success;
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

    getUidByPhoneNumber = async (
        phoneNumber: string
    ): Promise<string | undefined> => {
        const uid = await this.databaseProvider.getUidByPhoneNumber(
            phoneNumber
        );
        return uid;
    };

    createDefaultProfile = async (uid: string): Promise<boolean> => {
        return await this.databaseProvider.createDefaultProfile(uid);
    };

    createProfile = async (uid: string, profile: IProfile): Promise<void> => {
        try {
            await this.databaseProvider.createProfile(uid, profile);

            // TODO: Instead of refetching all profiles after creating one,
            // consider registering a collection listener for 'profiles' and
            // handling the ADD, DELETE, MODIFIED operations.
            await this.getAllProfiles(uid);
        } catch (e) {}

        //return success;
    };

    getAllProfiles = async (uid: string): Promise<IProfile[]> => {
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

    getProfileIdByName = async (
        uid: string,
        name: string
    ): Promise<string | undefined> => {
        const profileId = await this.databaseProvider.getProfileIdByName(
            uid,
            name
        );
        return profileId;
    };

    deleteProfile = async (
        uid: string,
        profileId: string
    ): Promise<boolean> => {
        const success = await this.databaseProvider.deleteProfile(
            uid,
            profileId
        );
        // TODO: Instead of refetching all profiles after creating one,
        // consider registering a collection listener for 'profiles' and
        // handling the ADD, DELETE, MODIFIED operations.
        await this.getAllProfiles(uid);
        return success;
    };

    createShare = async (share: IShare): Promise<boolean> => {
        const success = await this.databaseProvider.createShare(share);
        return success;
    };

    deleteShare = async (share: IShare): Promise<boolean> => {
        const success = await this.databaseProvider.deleteShare(share);
        return success;
    };

    addShareListener = async (
        uid: string,
        profileId: string
    ): Promise<void> => {
        await this.databaseProvider.addShareListener(uid, profileId);
    };

    removeAllShareListeners = async (): Promise<void> => {
        await this.databaseProvider.removeAllShareListeners();
    };

    removeShareListener = async (
        uid: string,
        profileId: string
    ): Promise<void> => {
        await this.databaseProvider.removeShareListener(uid, profileId);
    };
}
