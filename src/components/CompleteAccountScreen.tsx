import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    Navigation,
    NavigationFunctionComponent,
    OptionsModalPresentationStyle,
} from 'react-native-navigation';
import { useSelector } from 'react-redux';
import { initializeAccount, signOut } from '../api/AccountAPI';
import IUser from '../api/IUser';
import IAccountInfo from '../api/IAccountInfo';
import { RootState } from '../redux/store';
import { ComponentId as WelcomeScreenComponentId } from './WelcomeScreen';
import { CircleButton } from './CircleButton';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EStyleSheet from 'react-native-extended-stylesheet';
import { ComponentId as HelpInfoSheetComponentId } from './HelpInfoSheet';

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
}

const CompleteAccountScreen: NavigationFunctionComponent<Props> = () => {
    const user: IUser | undefined = useSelector(
        (state: RootState) => state.auth.user
    );

    const accountInfo: IAccountInfo | undefined = useSelector(
        (state: RootState) => state.user.accountInfo
    );

    const [phoneNumber, setPhoneNumber] = useState<string>('');

    const blurOpacity = useRef(new Animated.Value(0)).current;
    const [blueVisibility, setBlurVisibility] = useState<boolean>(false);
    const [shouldShowBlur, setShouldShowBlur] = useState<boolean>(false);

    useEffect(() => {
        if (!user) {
            console.log(
                'Error: User is undefined. Cannot continue account completion without a user.'
            );
            return; // TODO: We need a user for this page. Handle this error.
        }

        const continueAuthFlow = async () => {
            if (accountInfo) {
                console.log('Does Account Doc Exist? Yes');
                if (accountInfo.isAccountComplete) {
                    console.log('Is Account Doc Complete? Yes');
                    setRootScreen(WelcomeScreenComponentId);
                } else {
                    console.log('Is Account Doc Complete? No');
                    console.log(
                        'Waiting for user to complete account. This will complete the account and create a default profile.'
                    );
                }
            } else {
                console.log('Does Account Doc Exist? No');
                console.log(
                    'Waiting for user to complete account. This will create the account, complete it, and create a default profile.'
                );
            }
        };

        continueAuthFlow();
    }, [accountInfo, user]);

    useEffect(() => {
        if (shouldShowBlur) {
            setBlurVisibility(true);
        }
        Animated.timing(blurOpacity, {
            toValue: shouldShowBlur ? 1 : 0,
            duration: 150,
            useNativeDriver: false,
        }).start(() => setBlurVisibility(shouldShowBlur));
    }, [shouldShowBlur, blurOpacity]);

    const setRootScreen = async (screenId: string) => {
        await Navigation.setRoot({
            root: {
                stack: {
                    children: [
                        {
                            component: {
                                name: screenId,
                            },
                        },
                    ],
                },
            },
        });
    };

    const handleCompleteAccountButton = async () => {
        if (!user) return; // TODO: We need a user for this page. Handle this error.

        // Creates the account if it does not exist. Completes the account info. Adds a default profile.
        console.log(
            'Completing Account [1/3] Creating an account if one does not exist.'
        );
        console.log('Completing Account [2/3] Setting account info.');
        console.log(
            'Completing Account [3/3] Creating a default profile or resetting the existing one.'
        );
        const success = await initializeAccount(user.uid, {
            phoneNumber: phoneNumber,
            isAccountComplete: true,
        });

        if (success) {
            console.log('Saved completed account to database.');
        } else {
            console.log('Failed to complete the account.');
        }
    };

    const handleBack = async () => {
        await signOut();
    };

    const showPhoneNumberHelp = async () => {
        setShouldShowBlur(true);

        await Navigation.showModal({
            component: {
                name: HelpInfoSheetComponentId,
                options: {
                    modalPresentationStyle:
                        OptionsModalPresentationStyle.overCurrentContext,
                },
                passProps: {
                    header: 'Phone Number',
                    info: 'Your phone number is needed to identify who a Share is being sent to. At no point will your phone number be provided to other users without your explicit permission.',
                    dismissable: true,
                    dismissText: 'Dismiss',
                    onDismiss: () => {
                        setShouldShowBlur(false);
                    },
                },
            },
        });
    };

    return (
        <SafeAreaView style={styles.root}>
            <LinearGradient
                colors={['#7f5a83', '#0d324d']}
                angle={50}
                useAngle={true}
                style={styles.backgroundGradient}
            >
                <View style={styles.headerSection}>
                    <CircleButton
                        size={56}
                        style={styles.settingsButton}
                        onPress={handleBack}
                    >
                        <MaterialIcons
                            name='arrow-back'
                            color='#EAEAEA'
                            size={42}
                        />
                    </CircleButton>
                    <Text style={styles.welcomeText}>
                        Complete Your Account
                    </Text>
                </View>
                <MaskedView
                    style={styles.mask}
                    maskElement={
                        <LinearGradient
                            style={styles.maskGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 0.05 }}
                            colors={['#FFFFFF00', '#FFFFFFFF']}
                        />
                    }
                >
                    <KeyboardAwareScrollView
                        contentContainerStyle={styles.body}
                    >
                        <View style={styles.inputLabelGroup}>
                            <Text style={styles.inputLabelText}>
                                Enter your phone number:
                            </Text>
                            <CircleButton
                                style={styles.moreInfoButton}
                                size={28}
                                onPress={showPhoneNumberHelp}
                                children={
                                    <Text style={styles.moreInfoButtonLabel}>
                                        ?
                                    </Text>
                                }
                            />
                        </View>
                        <TextInput
                            style={styles.phoneNumberInput}
                            keyboardType='phone-pad'
                            onChangeText={setPhoneNumber}
                            placeholder='Phone number'
                        />
                        <View style={styles.flexSpacer} />
                        <TouchableOpacity
                            style={styles.signInMethodButton}
                            onPress={handleCompleteAccountButton}
                        >
                            <Text style={styles.signInMethodLabel}>
                                Save Account
                            </Text>
                            <MaterialIcons
                                style={styles.signInLogo}
                                name='navigate-next'
                                color='#FFF'
                                size={32}
                            />
                        </TouchableOpacity>
                    </KeyboardAwareScrollView>
                </MaskedView>
            </LinearGradient>
            {blueVisibility ? (
                <Animated.View
                    style={{ ...styles.blurOverlay, opacity: blurOpacity }}
                />
            ) : (
                <></>
            )}
        </SafeAreaView>
    );
};

const styles = EStyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#264653',
    },
    backgroundGradient: {
        flex: 1,
    },
    /* Header */
    headerSection: {
        paddingHorizontal: '24rem',
        height: '72rem',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#0D161F7F',
        backgroundColor: '#0000001F',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: '22rem',
        marginLeft: '16rem',
        color: '#FFF',
    },
    settingsButton: {
        backgroundColor: '#E9C46A19',
        borderColor: '#F4A2617F',
        borderWidth: 1,
    },
    /* Body */
    body: {
        margin: '32rem',
        paddingBottom: '48rem',
        flex: 1,
    },
    phoneNumberInput: {
        backgroundColor: '#1A2633',
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '16rem',
        marginBottom: '16rem',
    },
    moreInfoButton: {
        backgroundColor: '#E9C46A19',
        borderColor: '#F4A2617F',
        borderWidth: 1,
    },
    inputLabelGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16rem',
    },
    inputLabelText: {
        color: '#FFF',
        fontSize: 20,
    },
    moreInfoButtonLabel: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    flexSpacer: {
        flex: 1,
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
    signInMethodLabel: {
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
    /* Mask */
    mask: {
        flex: 1,
    },
    maskGradient: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    /* Misc */
    blurOverlay: {
        backgroundColor: '#1520247F',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
});

export default CompleteAccountScreen;
export type { Props };
export const ComponentId = 'com.simpleshare.CompleteAccountScreen';
