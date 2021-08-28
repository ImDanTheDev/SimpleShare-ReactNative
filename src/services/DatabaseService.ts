import { store } from '../redux/store';
import { setAccountInfo, setPublicGeneralInfo } from '../redux/accountSlice';
import { setProfiles } from '../redux/profilesSlice';
import { addShare, deleteShare, updateShare } from '../redux/sharesSlice';
import {
    ErrorCode,
    FirebaseDatabaseProvider,
    IAccountInfo,
    IDatabaseProvider,
    IProfile,
    IPublicGeneralInfo,
    IShare,
    SimpleShareError,
} from 'simpleshare-common';
import { OFFirestore } from '@omnifire/rn';

export enum DatabaseProviderType {
    Firestore,
}

export default class DatabaseService {
    private readonly databaseProviderType: DatabaseProviderType;
    private databaseProvider: IDatabaseProvider | undefined;

    constructor(databaseProviderType: DatabaseProviderType) {
        this.databaseProviderType = databaseProviderType;
    }

    initialize = (): void => {
        if (this.databaseProvider) {
            console.log('The database service is already initialized.');
            return;
        }

        switch (this.databaseProviderType) {
            case DatabaseProviderType.Firestore: {
                this.databaseProvider = new FirebaseDatabaseProvider(
                    new OFFirestore(),
                    (share: IShare) => {
                        store.dispatch(addShare(share));
                    },
                    (share: IShare) => {
                        store.dispatch(deleteShare(share.id || ''));
                    },
                    (share: IShare) => {
                        store.dispatch(updateShare(share));
                    },
                    (profile: IProfile) => {
                        console.log('TODO: Handle profile events');
                    },
                    (profile: IProfile) => {
                        console.log('TODO: Handle profile events');
                    },
                    (profile: IProfile) => {
                        console.log('TODO: Handle profile events');
                    }
                );
            }
        }
    };

    getAccountInfo = async (uid: string): Promise<IAccountInfo | undefined> => {
        if (!this.databaseProvider) {
            console.error('The database service is not initialized!');
            throw new SimpleShareError(
                ErrorCode.UNEXPECTED_DATABASE_ERROR,
                'The database service is not initialized!'
            );
        }
        const accountInfo = await this.databaseProvider.getAccountInfo(uid);
        store.dispatch(setAccountInfo(accountInfo));

        return accountInfo;
    };

    doesAccountExist = async (uid: string): Promise<boolean> => {
        if (!this.databaseProvider) {
            console.error('The database service is not initialized!');
            throw new SimpleShareError(
                ErrorCode.UNEXPECTED_DATABASE_ERROR,
                'The database service is not initialized!'
            );
        }

        return await this.databaseProvider.doesAccountExist(uid);
    };

    initializeAccount = async (
        uid: string,
        accountInfo: IAccountInfo,
        publicGeneralInfo: IPublicGeneralInfo
    ): Promise<boolean> => {
        if (!this.databaseProvider) {
            console.error('The database service is not initialized!');
            throw new SimpleShareError(
                ErrorCode.UNEXPECTED_DATABASE_ERROR,
                'The database service is not initialized!'
            );
        }

        const success = await this.databaseProvider.initializeAccount(
            uid,
            accountInfo,
            publicGeneralInfo
        );
        if (success) {
            store.dispatch(setAccountInfo(accountInfo));
            store.dispatch(setPublicGeneralInfo(publicGeneralInfo));
        }
        return success;
    };

    setAccountInfo = async (
        uid: string,
        accountInfo: IAccountInfo
    ): Promise<boolean> => {
        if (!this.databaseProvider) {
            console.error('The database service is not initialized!');
            throw new SimpleShareError(
                ErrorCode.UNEXPECTED_DATABASE_ERROR,
                'The database service is not initialized!'
            );
        }

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
        if (!this.databaseProvider) {
            console.error('The database service is not initialized!');
            throw new SimpleShareError(
                ErrorCode.UNEXPECTED_DATABASE_ERROR,
                'The database service is not initialized!'
            );
        }
        const uid = await this.databaseProvider.getUidByPhoneNumber(
            phoneNumber
        );
        return uid;
    };

    getPublicGeneralInfo = async (
        uid: string
    ): Promise<IPublicGeneralInfo | undefined> => {
        if (!this.databaseProvider) {
            console.error('The database service is not initialized!');
            throw new SimpleShareError(
                ErrorCode.UNEXPECTED_DATABASE_ERROR,
                'The database service is not initialized!'
            );
        }
        const publicGeneralInfo =
            await this.databaseProvider.getPublicGeneralInfo(uid);
        return publicGeneralInfo;
    };

    setPublicGeneralInfo = async (
        uid: string,
        info: IPublicGeneralInfo
    ): Promise<void> => {
        if (!this.databaseProvider) {
            console.error('The database service is not initialized!');
            throw new SimpleShareError(
                ErrorCode.UNEXPECTED_DATABASE_ERROR,
                'The database service is not initialized!'
            );
        }
        await this.databaseProvider.setPublicGeneralInfo(uid, info);
        store.dispatch(setPublicGeneralInfo(info));
    };

    createDefaultProfile = async (uid: string): Promise<boolean> => {
        if (!this.databaseProvider) {
            console.error('The database service is not initialized!');
            throw new SimpleShareError(
                ErrorCode.UNEXPECTED_DATABASE_ERROR,
                'The database service is not initialized!'
            );
        }
        return await this.databaseProvider.createDefaultProfile(uid);
    };

    createProfile = async (uid: string, profile: IProfile): Promise<void> => {
        if (!this.databaseProvider) {
            console.error('The database service is not initialized!');
            throw new SimpleShareError(
                ErrorCode.UNEXPECTED_DATABASE_ERROR,
                'The database service is not initialized!'
            );
        }
        try {
            await this.databaseProvider.createProfile(uid, profile);

            // TODO: Instead of refetching all profiles after creating one,
            // consider registering a collection listener for 'profiles' and
            // handling the ADD, DELETE, MODIFIED operations.
            await this.getAllProfiles(uid);
        } catch (e) {}
    };

    getAllProfiles = async (uid: string): Promise<IProfile[]> => {
        if (!this.databaseProvider) {
            console.error('The database service is not initialized!');
            throw new SimpleShareError(
                ErrorCode.UNEXPECTED_DATABASE_ERROR,
                'The database service is not initialized!'
            );
        }
        const profiles = await this.databaseProvider.getAllProfiles(uid);

        store.dispatch(setProfiles(profiles || []));

        return profiles;
    };

    getProfile = async (
        uid: string,
        profileId: string
    ): Promise<IProfile | undefined> => {
        if (!this.databaseProvider) {
            console.error('The database service is not initialized!');
            throw new SimpleShareError(
                ErrorCode.UNEXPECTED_DATABASE_ERROR,
                'The database service is not initialized!'
            );
        }
        const profile = await this.databaseProvider.getProfile(uid, profileId);
        return profile;
    };

    getProfileIdByName = async (
        uid: string,
        name: string
    ): Promise<string | undefined> => {
        if (!this.databaseProvider) {
            console.error('The database service is not initialized!');
            throw new SimpleShareError(
                ErrorCode.UNEXPECTED_DATABASE_ERROR,
                'The database service is not initialized!'
            );
        }
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
        if (!this.databaseProvider) {
            console.error('The database service is not initialized!');
            throw new SimpleShareError(
                ErrorCode.UNEXPECTED_DATABASE_ERROR,
                'The database service is not initialized!'
            );
        }
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

    createShare = async (share: IShare): Promise<void> => {
        if (!this.databaseProvider) {
            console.error('The database service is not initialized!');
            throw new SimpleShareError(
                ErrorCode.UNEXPECTED_DATABASE_ERROR,
                'The database service is not initialized!'
            );
        }
        await this.databaseProvider.createShare(share);
    };

    deleteShare = async (share: IShare): Promise<boolean> => {
        if (!this.databaseProvider) {
            console.error('The database service is not initialized!');
            throw new SimpleShareError(
                ErrorCode.UNEXPECTED_DATABASE_ERROR,
                'The database service is not initialized!'
            );
        }
        const success = await this.databaseProvider.deleteShare(share);
        return success;
    };

    addShareListener = async (
        uid: string,
        profileId: string
    ): Promise<void> => {
        if (!this.databaseProvider) {
            console.error('The database service is not initialized!');
            throw new SimpleShareError(
                ErrorCode.UNEXPECTED_DATABASE_ERROR,
                'The database service is not initialized!'
            );
        }
        await this.databaseProvider.addShareListener(uid, profileId);
    };

    removeAllShareListeners = async (): Promise<void> => {
        if (!this.databaseProvider) {
            console.error('The database service is not initialized!');
            throw new SimpleShareError(
                ErrorCode.UNEXPECTED_DATABASE_ERROR,
                'The database service is not initialized!'
            );
        }
        await this.databaseProvider.removeAllShareListeners();
    };

    removeShareListener = async (
        uid: string,
        profileId: string
    ): Promise<void> => {
        if (!this.databaseProvider) {
            console.error('The database service is not initialized!');
            throw new SimpleShareError(
                ErrorCode.UNEXPECTED_DATABASE_ERROR,
                'The database service is not initialized!'
            );
        }
        await this.databaseProvider.removeShareListener(uid, profileId);
    };
}
