import IAccountInfo from '../../api/IAccountInfo';

export default interface IDatabaseProvider {
    getAccountInfo: (uid: string) => Promise<IAccountInfo>;
    setAccountInfo: (
        uid: string,
        accountInfo: IAccountInfo
    ) => Promise<boolean>;
}
