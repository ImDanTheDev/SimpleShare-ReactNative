import React, { ReactNode, useEffect, useState } from 'react';
import { Text } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAccountInfo, startProfileListener } from 'simpleshare-common';
import { RootState } from '../../redux/store';
import { ComponentId as SigninScreenComponentId } from './SigninScreen';
import { ComponentId as CompleteAccountScreenComponentId } from './CompleteAccountScreen';

interface Props {
    children?: ReactNode;
    requireUser: boolean;
    requireCompleteAccount: boolean;
}

export const AuthMeScreen: React.FC<Props> = (props: Props) => {
    const dispatch = useDispatch();

    const user = useSelector((state: RootState) => state.auth.user);
    const publicGeneralInfo = useSelector(
        (state: RootState) => state.user.publicGeneralInfo
    );
    const fetchedAccount = useSelector(
        (state: RootState) => state.user.fetchedAccount
    );
    const accountInfo = useSelector(
        (state: RootState) => state.user.accountInfo
    );

    const [authorizing, setAuthorizing] = useState<boolean>(true);

    useEffect(() => {
        if (props.requireUser) {
            if (!user) {
                console.log(
                    `[AuthMeScreen] The requested screen requires a user, but no user is signed in.`
                );
                console.log(`[AuthMeScreen] Showing the sign in screen.`);
                // The user is not signed in, show sign in screen.
                Navigation.setRoot({
                    root: {
                        stack: {
                            children: [
                                {
                                    component: {
                                        name: SigninScreenComponentId,
                                    },
                                },
                            ],
                        },
                    },
                });
            } else {
                console.log(
                    `[AuthMeScreen] The requested screen requires a user, and a user is signed in.`
                );
                // The user is signed in.
                if (props.requireCompleteAccount) {
                    if (fetchedAccount) {
                        if (
                            !publicGeneralInfo ||
                            !accountInfo ||
                            !publicGeneralInfo.isComplete ||
                            !accountInfo.isAccountComplete
                        ) {
                            console.log(
                                `[AuthMeScreen] The requested screen requires a completed account, but the account is not completed.`
                            );
                            console.log(
                                `[AuthMeScreen] Showing the complete account screen.`
                            );
                            // Account is not complete, show complete account screen.
                            Navigation.setRoot({
                                root: {
                                    stack: {
                                        children: [
                                            {
                                                component: {
                                                    name: CompleteAccountScreenComponentId,
                                                },
                                            },
                                        ],
                                    },
                                },
                            });
                        } else {
                            console.log(
                                `[AuthMeScreen] The requested screen requires a completed account, and the account is completed.`
                            );
                            console.log(
                                `[AuthMeScreen] Starting profile listener.`
                            );
                            dispatch(startProfileListener());
                            console.log(
                                `[AuthMeScreen] Showing the requested screen.`
                            );
                            // Account is complete, show requested screen.
                            setAuthorizing(false);
                        }
                    } else {
                        console.log(
                            `[AuthMeScreen] The requested screen requires a completed account, but the account info has not been fetched yet.`
                        );
                        console.log(`[AuthMeScreen] Fetching account info.`);
                        // Account info has not been fetched, fetch it and wait.
                        dispatch(getAllAccountInfo());
                    }
                } else {
                    console.log(
                        `[AuthMeScreen] The requested screen does not require a completed account.`
                    );
                    console.log(`[AuthMeScreen] Showing the requested screen.`);
                    // A completed account is not required, show requested screen.
                    setAuthorizing(false);
                }
            }
        } else {
            console.log(
                `[AuthMeScreen] The requested screen does not require a user.`
            );
            console.log(`[AuthMeScreen] Showing the requested screen.`);
            setAuthorizing(false);
        }
    }, [
        accountInfo,
        dispatch,
        fetchedAccount,
        props.requireCompleteAccount,
        props.requireUser,
        publicGeneralInfo,
        user,
    ]);

    if (authorizing) {
        return <Text>Authorizing</Text>;
    } else {
        return <>{props.children}</>;
    }
};
