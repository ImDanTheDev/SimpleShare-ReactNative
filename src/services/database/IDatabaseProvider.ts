import IAccountInfo from '../../api/IAccountInfo';
import IProfile from '../../api/IProfile';
import IShare from '../../api/IShare';

export default interface IDatabaseProvider {
    // Accounts
    getAccountInfo: (uid: string) => Promise<IAccountInfo | undefined>;
    initializeAccount: (
        uid: string,
        accountInfo: IAccountInfo
    ) => Promise<boolean>;
    setAccountInfo: (
        uid: string,
        accountInfo: IAccountInfo
    ) => Promise<boolean>;
    getUidByPhoneNumber: (phoneNumber: string) => Promise<string | undefined>;
    // Profiles
    createDefaultProfile: (uid: string) => Promise<boolean>;
    createProfile: (uid: string, profile: IProfile) => Promise<boolean>;
    getAllProfiles: (uid: string) => Promise<IProfile[]>;
    getProfile: (
        uid: string,
        profileId: string
    ) => Promise<IProfile | undefined>;
    getProfileIdByName: (
        uid: string,
        name: string
    ) => Promise<string | undefined>;
    deleteProfile: (uid: string, profileId: string) => Promise<boolean>;
    // Shares
    createShare: (share: IShare) => Promise<boolean>;
    deleteShare: (share: IShare) => Promise<boolean>;
    addShareListener: (uid: string, profileId: string) => Promise<void>;
    removeShareListener: (uid: string, profileId: string) => Promise<void>;
    removeAllShareListeners: () => Promise<void>;
}
