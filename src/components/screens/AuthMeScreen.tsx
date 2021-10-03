import React, { ReactNode, useEffect, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllAccountInfo,
    signOut,
    startNotificationListener,
    startProfileListener,
    startPublicGeneralInfoListener,
} from 'simpleshare-common';
import { RootState } from '../../redux/store';
import { ComponentId as SigninScreenComponentId } from './SigninScreen';
import { ComponentId as CompleteAccountScreenComponentId } from './CompleteAccountScreen';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from '../common/Spinner';

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
    const fetchAccountError = useSelector(
        (state: RootState) => state.user.fetchAccountError
    );

    const [authorizing, setAuthorizing] = useState<boolean>(true);

    useEffect(() => {
        if (props.requireUser) {
            if (!user) {
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
                // The user is signed in.
                if (props.requireCompleteAccount) {
                    if (fetchedAccount) {
                        if (
                            !publicGeneralInfo ||
                            !accountInfo ||
                            !publicGeneralInfo.isComplete ||
                            !accountInfo.isAccountComplete
                        ) {
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
                            if (authorizing) {
                                dispatch(startProfileListener());
                                dispatch(startPublicGeneralInfoListener());
                                dispatch(startNotificationListener());
                                // Account is complete, show requested screen.
                                setAuthorizing(false);
                            }
                        }
                    } else {
                        // Account info has not been fetched, fetch it and wait.
                        dispatch(getAllAccountInfo());
                    }
                } else {
                    // A completed account is not required, show requested screen.
                    setAuthorizing(false);
                }
            }
        } else {
            setAuthorizing(false);
        }
    }, [
        accountInfo,
        authorizing,
        dispatch,
        fetchedAccount,
        props.requireCompleteAccount,
        props.requireUser,
        publicGeneralInfo,
        user,
    ]);

    useEffect(() => {
        if (!accountInfo && !fetchedAccount && fetchAccountError) {
            // Error while fetching account.
            dispatch(signOut());
        }
    }, [accountInfo, fetchedAccount, fetchAccountError, dispatch]);

    if (authorizing) {
        return (
            <SafeAreaView style={styles.root}>
                <LinearGradient
                    colors={['#7f5a83', '#0d324d']}
                    angle={50}
                    useAngle={true}
                    style={styles.backgroundGradient}
                >
                    <View style={styles.loadingScreen}>
                        <Text style={styles.loadingText}>Loading</Text>
                        <View style={styles.loadingSpinner}>
                            <Spinner containerStyle={styles.spinner}>
                                <MaterialCommunityIcons
                                    name='loading'
                                    color='#FFF'
                                    size={EStyleSheet.value('64rem')}
                                />
                            </Spinner>
                        </View>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        );
    } else {
        return <>{props.children}</>;
    }
};

const styles = EStyleSheet.create({
    root: {
        flex: 1,
    },
    backgroundGradient: {
        flex: 1,
    },
    loadingScreen: {
        flex: 1,
        justifyContent: 'center',
    },
    loadingText: {
        textAlign: 'center',
        color: '#FFF',
        fontSize: '48rem',
    },
    loadingSpinner: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingIcon: {
        aspectRatio: 1,
    },
});
