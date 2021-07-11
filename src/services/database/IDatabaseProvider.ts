import IAccountInfo from '../../api/IAccountInfo';
import IProfile from '../../api/IProfile';
import IShare from '../../api/IShare';

export default interface IDatabaseProvider {
    // Accounts
    getAccountInfo: (uid: string) => Promise<IAccountInfo>;
    setAccountInfo: (
        uid: string,
        accountInfo: IAccountInfo
    ) => Promise<boolean>;
    getUidByPhoneNumber: (phoneNumber: string) => Promise<string | undefined>;
    // Profiles
    createProfile: (
        uid: string,
        profile: IProfile
    ) => Promise<IProfile | undefined>;
    getAllProfiles: (uid: string) => Promise<IProfile[] | undefined>;
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
    addShareListener: (uid: string, profileId: string) => Promise<void>;
    removeShareListener: (uid: string, profileId: string) => Promise<void>;
    removeAllShareListeners: () => Promise<void>;
}
