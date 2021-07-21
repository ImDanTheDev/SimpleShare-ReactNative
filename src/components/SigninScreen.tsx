import React, { useEffect } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
    Navigation,
    NavigationFunctionComponent,
} from 'react-native-navigation';
import { useSelector } from 'react-redux';
import { googleSignIn } from '../api/AccountAPI';
import IUser from '../api/IUser';
import { RootState } from '../redux/store';
import { ComponentId as WelcomeScreenComponentId } from './WelcomeScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
}

const SigninScreen: NavigationFunctionComponent<Props> = () => {
    const user: IUser | undefined = useSelector(
        (state: RootState) => state.auth.user
    );

    useEffect(() => {
        if (user) {
            console.log('Already have a user.');
            Navigation.setRoot({
                root: {
                    stack: {
                        children: [
                            {
                                component: {
                                    name: WelcomeScreenComponentId,
                                },
                            },
                        ],
                    },
                },
            });
        }
    }, [user]);

    const handleGoogleSignInButton = async () => {
        try {
            await googleSignIn();
        } catch (e) {}
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
                    >
                        <Ionicons
                            style={styles.signInMethodLogo}
                            name='logo-google'
                            color='#FFF'
                            size={32}
                        />
                        <Text style={styles.signInMethodLabel}>Google</Text>
                        <MaterialIcons
                            style={styles.signInLogo}
                            name='login'
                            color='#2A9D8F'
                            size={32}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.footerLink}>
                        <Text style={styles.footerLinkLabel}>
                            Privacy Policy
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerLink}>
                        <Text style={styles.footerLinkLabel}>
                            Terms of Service
                        </Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};
//'#7f5a83', '#0d324d'
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
        fontSize: 24,
    },
    signInMethodButton: {
        backgroundColor: '#0D161F',
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: '1rem',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
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
        marginLeft: '8rem',
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
