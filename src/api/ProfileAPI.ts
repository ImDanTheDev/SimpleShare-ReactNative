import { databaseService } from './api';
import IProfile from './IProfile';

export const createProfile = async (
    uid: string,
    profile: IProfile
): Promise<IProfile | undefined> => {
    return await databaseService.createProfile(uid, profile);
};

export const getAllProfiles = async (uid: string): Promise<IProfile[]> => {
    const profiles = await databaseService.getAllProfiles(uid);
    return profiles || [];
};

export const getProfile = async (
    uid: string,
    profileId: string
): Promise<IProfile | undefined> => {
    const profile = await databaseService.getProfile(uid, profileId);
    return profile;
};

export const deleteProfile = async (
    uid: string,
    profileId: string
): Promise<boolean> => {
    return await databaseService.deleteProfile(uid, profileId);
};
