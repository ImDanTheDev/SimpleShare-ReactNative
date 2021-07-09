import { authService, databaseService } from './api';
import IAccountInfo from './IAccountInfo';

export const googleSignIn = async (): Promise<void> => {
    await authService.googleSignIn();
};

export const signOut = async (): Promise<void> => {
    await authService.signOut();
};

export const updateAccountInfo = async (
    uid: string,
    accountInfo: IAccountInfo
): Promise<boolean> => {
    return await databaseService.setAccountInfo(uid, accountInfo);
};
