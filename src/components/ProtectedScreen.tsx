import React, { useEffect, useState } from 'react';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import IProfile from '../api/IProfile';
import IUser from '../api/IUser';
import { RootState } from '../redux/store';

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

    const currentProfile: IProfile | undefined = useSelector(
        (state: RootState) => {
            return state.profiles.profiles.find(
                (profile) => profile.id === state.profiles.currentProfileId
            );
        }
    );

    const [authing, setAuthing] = useState<boolean>(true);
    const [authed, setAuthed] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            if (!props.requireProfile) {
                setAuthed(true);
                setAuthing(false);
            } else {
                if (currentProfile) {
                    setAuthed(true);
                    setAuthing(false);
                } else {
                    setAuthed(false);
                    setAuthing(false);
                }
            }
        } else {
            setAuthed(false);
            setAuthing(false);
        }
    }, [user, props.requireProfile, currentProfile]);

    const render = (): ReactNode => {
        if (authing) {
            console.log('Showing "authorizing" screen.');
            return props.authing;
        } else {
            if (authed) {
                console.log('Showing "authorization success" screen.');
                return props.authSuccess;
            } else {
                console.log('Showing "authorization fail" screen.');
                return props.authFail;
            }
        }
    };

    return <>{render()}</>;
};
