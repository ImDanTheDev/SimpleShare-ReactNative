import React, { useEffect } from 'react';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { IUser } from 'simpleshare-common';
import { RootState } from '../../redux/store';

export interface Props {
    authing: ReactNode;
    authSuccess: ReactNode;
    authFail: ReactNode;
    requireProfile?: boolean;
    name?: string;
}

export const ProtectedScreen: React.FC<Props> = (props: Props) => {
    const user: IUser | undefined = useSelector(
        (state: RootState) => state.auth.user
    );

    const currentProfile: string | undefined = useSelector(
        (state: RootState) => state.profiles.currentProfileId
    );

    const render = () => {
        if (user) {
            if (props.requireProfile && currentProfile) {
                return props.authSuccess;
            } else {
                return props.authSuccess;
            }
        } else {
            return props.authFail;
        }
    };

    return <>{render()}</>;
};
