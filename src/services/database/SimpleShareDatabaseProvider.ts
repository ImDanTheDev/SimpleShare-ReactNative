import IDatabaseProvider from './IDatabaseProvider';
import IAccountInfo from '../../api/IAccountInfo';
import IProfile from '../../api/IProfile';
import IShare from '../../api/IShare';
import IPublicGeneralInfo from '../../api/IPublicGeneralInfo';

export default class SimpleShareDatabaseProvider implements IDatabaseProvider {
    getAccountInfo = (): Promise<IAccountInfo | undefined> => {
        return new Promise<IAccountInfo>(async (resolve, reject) => {
            reject('Simple Share database is not implemented.');
        });
    };

    doesAccountExist = async (uid: string): Promise<boolean> => {
        return new Promise<boolean>(async (resolve, reject) => {
            reject('Simple Share database is not implemented.');
        });
    };

    initializeAccount = async (
        uid: string,
        accountInfo: IAccountInfo,
        publicGeneralInfo: IPublicGeneralInfo
    ): Promise<boolean> => {
        return new Promise<boolean>(async (resolve, reject) => {
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

    getUidByPhoneNumber = async (
        phoneNumber: string
    ): Promise<string | undefined> => {
        return new Promise<string | undefined>(async (resolve, reject) => {
            reject('Simple Share database is not implemented.');
        });
    };

    getPublicGeneralInfo = async (
        phoneNumber: string
    ): Promise<IPublicGeneralInfo | undefined> => {
        return new Promise<IPublicGeneralInfo | undefined>(
            async (resolve, reject) => {
                reject('Simple Share database is not implemented.');
            }
        );
    };

    setPublicGeneralInfo = async (
        uid: string,
        info: IPublicGeneralInfo
    ): Promise<void> => {
        return new Promise<void>(async (resolve, reject) => {
            reject('Simple Share database is not implemented.');
        });
    };

    createDefaultProfile = async (uid: string): Promise<boolean> => {
        return new Promise<boolean>(async (resolve, reject) => {
            reject('Simple Share database is not implemented.');
        });
    };

    createProfile = async (uid: string, profile: IProfile): Promise<void> => {
        return new Promise<void>(async (resolve, reject) => {
            reject('Simple Share database is not implemented.');
        });
    };

    getAllProfiles = async (uid: string): Promise<IProfile[]> => {
        return new Promise<IProfile[]>(async (resolve, reject) => {
            reject('Simple Share database is not implemented.');
        });
    };

    getProfile = async (
        uid: string,
        profileId: string
    ): Promise<IProfile | undefined> => {
        return new Promise<IProfile | undefined>(async (resolve, reject) => {
            reject('Simple Share database is not implemented.');
        });
    };

    getProfileIdByName = async (
        uid: string,
        name: string
    ): Promise<string | undefined> => {
        return new Promise<string | undefined>(async (resolve, reject) => {
            reject('Simple Share database is not implemented.');
        });
    };

    deleteProfile = async (
        uid: string,
        profileId: string
    ): Promise<boolean> => {
        return new Promise<boolean>(async (resolve, reject) => {
            reject('Simple Share database is not implemented.');
        });
    };

    createShare = async (share: IShare): Promise<void> => {
        return new Promise<void>(async (resolve, reject) => {
            reject('Simple Share database is not implemented.');
        });
    };

    deleteShare = async (share: IShare): Promise<boolean> => {
        return new Promise<boolean>(async (resolve, reject) => {
            reject('Simple Share database is not implemented.');
        });
    };

    addShareListener = async (
        uid: string,
        profileId: string
    ): Promise<void> => {
        return new Promise<void>(async (resolve, reject) => {
            reject('Simple Share database is not implemented.');
        });
    };

    removeShareListener = async (
        uid: string,
        profileId: string
    ): Promise<void> => {
        return new Promise<void>(async (resolve, reject) => {
            reject('Simple Share database is not implemented.');
        });
    };

    removeAllShareListeners = async (): Promise<void> => {
        return new Promise<void>(async (resolve, reject) => {
            reject('Simple Share database is not implemented.');
        });
    };
}
