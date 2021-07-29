import { databaseService } from './api';
import IShare from './IShare';

export const createShare = async (share: IShare): Promise<void> => {
    await databaseService.createShare(share);
};

export const deleteShare = async (share: IShare): Promise<boolean> => {
    return await databaseService.deleteShare(share);
};

export const switchShareListener = async (
    uid: string,
    profileId: string
): Promise<void> => {
    await databaseService.removeAllShareListeners();
    await databaseService.addShareListener(uid, profileId);
};
