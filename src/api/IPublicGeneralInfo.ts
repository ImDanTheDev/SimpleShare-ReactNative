import { MAX_DISPLAY_NAME_LENGTH, MIN_DISPLAY_NAME_LENGTH } from '../constants';

export default interface IPublicGeneralInfo {
    displayName: string | undefined;
    isComplete: boolean;
}

export const isPublicGeneralInfoComplete = (
    generalInfo: IPublicGeneralInfo
): boolean => {
    return (
        generalInfo.isComplete &&
        generalInfo.displayName !== undefined &&
        generalInfo.displayName.length >= MIN_DISPLAY_NAME_LENGTH &&
        generalInfo.displayName.length <= MAX_DISPLAY_NAME_LENGTH
    );
};
