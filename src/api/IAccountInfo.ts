import { MAX_PROFILE_NAME_LENGTH, MIN_PHONE_NUMBER_LENGTH } from '../constants';

export default interface IAccountInfo {
    isAccountComplete: boolean;
    phoneNumber: string | undefined;
}

export const isAccountComplete = (account: IAccountInfo): boolean => {
    return (
        account.isAccountComplete &&
        account.phoneNumber !== undefined &&
        account.phoneNumber.length >= MIN_PHONE_NUMBER_LENGTH &&
        account.phoneNumber.length <= MAX_PROFILE_NAME_LENGTH
    );
};
