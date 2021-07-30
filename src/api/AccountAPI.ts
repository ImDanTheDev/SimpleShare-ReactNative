import { authService, databaseService } from './api';
import IAccountInfo from './IAccountInfo';
import IPublicGeneralInfo from './IPublicGeneralInfo';

export const googleSignIn = async (): Promise<void> => {
    await authService.googleSignIn();
};

export const signOut = async (): Promise<void> => {
    await authService.signOut();
};

export const doesAccountExist = async (uid: string): Promise<boolean> => {
    return await databaseService.doesAccountExist(uid);
};

export const initializeAccount = async (
    uid: string,
    accountInfo: IAccountInfo,
    publicGeneralInfo: IPublicGeneralInfo
): Promise<boolean> => {
    return await databaseService.initializeAccount(
        uid,
        accountInfo,
        publicGeneralInfo
    );
};

export const updateAccountInfo = async (
    uid: string,
    accountInfo: IAccountInfo
): Promise<boolean> => {
    return await databaseService.setAccountInfo(uid, accountInfo);
};

export const getUidByPhoneNumber = async (
    phoneNumber: string
): Promise<string | undefined> => {
    return await databaseService.getUidByPhoneNumber(phoneNumber);
};

export const getPublicGeneralInfo = async (
    uid: string
): Promise<IPublicGeneralInfo | undefined> => {
    return await databaseService.getPublicGeneralInfo(uid);
};

export const setPublicGeneralInfo = async (
    uid: string,
    info: IPublicGeneralInfo
): Promise<void> => {
    await databaseService.setPublicGeneralInfo(uid, info);
};
