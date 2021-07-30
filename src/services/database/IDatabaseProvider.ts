import IAccountInfo from '../../api/IAccountInfo';
import IProfile from '../../api/IProfile';
import IPublicGeneralInfo from '../../api/IPublicGeneralInfo';
import IShare from '../../api/IShare';

export default interface IDatabaseProvider {
    // Accounts
    getAccountInfo: (uid: string) => Promise<IAccountInfo | undefined>;
    doesAccountExist: (uid: string) => Promise<boolean>;
    initializeAccount: (
        uid: string,
        accountInfo: IAccountInfo,
        publicGeneralInfo: IPublicGeneralInfo
    ) => Promise<boolean>;
    setAccountInfo: (
        uid: string,
        accountInfo: IAccountInfo
    ) => Promise<boolean>;
    getUidByPhoneNumber: (phoneNumber: string) => Promise<string | undefined>;
    getPublicGeneralInfo: (
        uid: string
    ) => Promise<IPublicGeneralInfo | undefined>;
    setPublicGeneralInfo: (
        uid: string,
        info: IPublicGeneralInfo
    ) => Promise<void>;
    // Profiles
    createDefaultProfile: (uid: string) => Promise<boolean>;
    createProfile: (uid: string, profile: IProfile) => Promise<void>;
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
    createShare: (share: IShare) => Promise<void>;
    deleteShare: (share: IShare) => Promise<boolean>;
    addShareListener: (uid: string, profileId: string) => Promise<void>;
    removeShareListener: (uid: string, profileId: string) => Promise<void>;
    removeAllShareListeners: () => Promise<void>;
}
