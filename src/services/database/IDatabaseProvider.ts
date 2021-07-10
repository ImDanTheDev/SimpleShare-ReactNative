import IAccountInfo from '../../api/IAccountInfo';
import IProfile from '../../api/IProfile';

export default interface IDatabaseProvider {
    // Accounts
    getAccountInfo: (uid: string) => Promise<IAccountInfo>;
    setAccountInfo: (
        uid: string,
        accountInfo: IAccountInfo
    ) => Promise<boolean>;
    // Profiles
    createProfile: (
        uid: string,
        profile: IProfile
    ) => Promise<IProfile | undefined>;
    getAllProfiles: (uid: string) => Promise<IProfile[] | undefined>;
}
