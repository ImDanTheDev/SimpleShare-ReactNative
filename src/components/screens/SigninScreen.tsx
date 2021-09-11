import React, { useEffect } from 'react';
import {
    Linking,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
    Navigation,
    NavigationFunctionComponent,
} from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { ComponentId as HomeScreenComponentId } from './HomeScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { pushToast } from '../../redux/toasterSlice';
import Spinner from '../common/Spinner';
import { IUser, signInWithGoogle } from 'simpleshare-common';

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
}

const SigninScreen: NavigationFunctionComponent<Props> = () => {
    const dispatch = useDispatch();

    const signingIn = useSelector((state: RootState) => state.auth.signingIn);
    const signInError = useSelector(
        (state: RootState) => state.auth.signInError
    );

    const user: IUser | undefined = useSelector(
        (state: RootState) => state.auth.user
    );

    useEffect(() => {
        if (!signingIn && !user && signInError) {
            // Failed to sign in.
            dispatch(
                pushToast({
                    message:
                        'An error occurred while signing in. Try again later.',
                    type: 'error',
                    duration: 5,
                })
            );
        } else if (!signingIn && user && !signInError) {
            // Signed in.
            Navigation.setRoot({
                root: {
                    stack: {
                        children: [
                            {
                                component: {
                                    name: HomeScreenComponentId,
                                },
                            },
                        ],
                    },
                },
            });
        }
    }, [signingIn, user, signInError, dispatch]);

    const handleGoogleSignInButton = async () => {
        dispatch(signInWithGoogle());
    };

    const handlePrivacyPolicyPress = async () => {
        const privacyPolicy = 'https://simple-share.flycricket.io/privacy.html';
        const supported = await Linking.canOpenURL(privacyPolicy);
        if (supported) {
            try {
                Linking.openURL(privacyPolicy);
            } catch {
                dispatch(
                    pushToast({
                        duration: 30,
                        message: `Failed to open link. Find the privacy policy on the Google Play Store or visit: ${privacyPolicy}`,
                        type: 'info',
                    })
                );
            }
        } else {
            dispatch(
                pushToast({
                    duration: 30,
                    message: `Your device does not support opening external links. Find the privacy policy on the Google Play Store or visit: ${privacyPolicy}`,
                    type: 'info',
                })
            );
        }
    };

    return (
        <SafeAreaView style={styles.root}>
            <LinearGradient
                colors={['#7f5a83', '#0d324d']}
                angle={50}
                useAngle={true}
                style={styles.backgroundGradient}
            >
                <View style={styles.header}>
                    <Text style={styles.welcome}>Welcome to</Text>
                    <Text style={styles.appName}>Simple Share</Text>
                </View>
                <View style={styles.body}>
                    <Text style={styles.signInMethodSectionHeader}>
                        Choose your sign-in method:
                    </Text>
                    <TouchableOpacity
                        style={styles.signInMethodButton}
                        onPress={handleGoogleSignInButton}
                        disabled={signingIn}
                    >
                        <Ionicons
                            style={styles.signInMethodLogo}
                            name='logo-google'
                            color='#FFF'
                            size={EStyleSheet.value('32rem')}
                        />
                        <Text style={styles.signInMethodLabel}>Google</Text>
                        {signingIn ? (
                            <Spinner>
                                <MaterialCommunityIcons
                                    style={styles.signInLogo}
                                    name='loading'
                                    color='#FFF'
                                    size={EStyleSheet.value('32rem')}
                                />
                            </Spinner>
                        ) : (
                            <MaterialIcons
                                style={styles.signInLogo}
                                name='login'
                                color='#2A9D8F'
                                size={EStyleSheet.value('32rem')}
                            />
                        )}
                    </TouchableOpacity>
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.footerLink}
                        onPress={handlePrivacyPolicyPress}
                    >
                        <Text style={styles.footerLinkLabel}>
                            Privacy Policy
                        </Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.footerLink}>
                        <Text style={styles.footerLinkLabel}>
                            Terms of Service
                        </Text>
                    </TouchableOpacity> */}
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = EStyleSheet.create({
    root: {
        flex: 1,
    },
    backgroundGradient: {
        flex: 1,
        padding: '32rem',
    },
    /* Header */
    header: {
        height: '45%',
        alignItems: 'center',
        paddingTop: '32rem',
    },
    welcome: {
        color: '#FFF',
        fontSize: '38rem',
    },
    appName: {
        color: '#FFF',
        fontSize: '48rem',
        fontWeight: 'bold',
    },
    /* Body */
    body: {
        alignItems: 'center',
        flex: 1,
    },
    signInMethodSectionHeader: {
        color: '#FFF',
        fontSize: '24rem',
    },
    signInMethodButton: {
        backgroundColor: '#0D161F',
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: '1rem',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: '2rem',
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 2,

        marginTop: '16rem',
        paddingVertical: '16rem',
        paddingHorizontal: '16rem',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: '64rem',
    },
    signInMethodLogo: {
        height: '100%',
        aspectRatio: 1,
        textAlignVertical: 'center',
        textAlign: 'center',
        marginRight: '8rem',
    },
    signInMethodLabel: {
        paddingLeft: '9rem',
        borderLeftWidth: '1rem',
        borderLeftColor: '#454545',
        color: '#FFF',
        fontSize: '22rem',
        flex: 1,
    },
    signInLogo: {
        height: '100%',
        aspectRatio: 1,
        textAlignVertical: 'center',
        textAlign: 'center',
    },
    /* Footer */
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerLink: {},
    footerLinkLabel: {
        color: '#BFBFBF',
        fontSize: '12rem',
    },
});

export default SigninScreen;
export type { Props };
export const ComponentId = 'com.simpleshare.SigninScreen';