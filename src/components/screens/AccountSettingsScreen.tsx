import MaskedView from '@react-native-masked-view/masked-view';
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {
    Navigation,
    NavigationFunctionComponent,
} from 'react-native-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import {
    constants,
    IAccountInfo,
    IPublicGeneralInfo,
    IUser,
    updateAccount,
} from 'simpleshare-common';
import { RootState } from '../../redux/store';
import { pushToast } from '../../redux/toasterSlice';
import { CircleButton } from '../common/CircleButton';
import Spinner from '../common/Spinner';

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
}

const AccountSettingsScreen: NavigationFunctionComponent<Props> = (
    props: Props
) => {
    const dispatch = useDispatch();
    const user: IUser | undefined = useSelector(
        (state: RootState) => state.auth.user
    );

    const accountInfo: IAccountInfo | undefined = useSelector(
        (state: RootState) => state.user.accountInfo
    );

    const publicGeneralInfo: IPublicGeneralInfo | undefined = useSelector(
        (state: RootState) => state.user.publicGeneralInfo
    );

    const updatingAccount = useSelector(
        (state: RootState) => state.user.updatingAccount
    );
    const updatedAccount = useSelector(
        (state: RootState) => state.user.updatedAccount
    );
    const updateAccountError = useSelector(
        (state: RootState) => state.user.updateAccountError
    );

    const [triedUpdatingAccount, setTriedUpdatingAccount] =
        useState<boolean>(false);
    const [phoneNumber, setPhoneNumber] = useState<string>(
        accountInfo?.phoneNumber || ''
    );
    const [displayName, setDisplayName] = useState<string>(
        publicGeneralInfo?.displayName || ''
    );

    useEffect(() => {
        const checkForUpdate = async () => {
            if (
                triedUpdatingAccount &&
                !updatingAccount &&
                updatedAccount &&
                !updateAccountError
            ) {
                await Navigation.pop(props.componentId);
            } else if (
                !updatingAccount &&
                !updatedAccount &&
                updateAccountError
            ) {
                dispatch(
                    pushToast({
                        duration: 5,
                        message:
                            'An error occurred while updating your account. Try again later.',
                        type: 'error',
                    })
                );
            }
        };
        checkForUpdate();
    }, [
        updatingAccount,
        updatedAccount,
        updateAccountError,
        triedUpdatingAccount,
        props.componentId,
        dispatch,
    ]);

    const handleBack = async () => {
        await Navigation.pop(props.componentId);
    };

    const handleSave = async () => {
        if (!user) {
            return;
        }

        if (phoneNumber.length < constants.MIN_PHONE_NUMBER_LENGTH) {
            dispatch(
                pushToast({
                    message: `'${phoneNumber}' is not a valid phone number.`,
                    duration: 5,
                    type: 'error',
                })
            );
            return;
        }

        if (displayName.length < constants.MIN_DISPLAY_NAME_LENGTH) {
            dispatch(
                pushToast({
                    message: `'${displayName}' is not a valid display name.`,
                    duration: 5,
                    type: 'error',
                })
            );
            return;
        }

        dispatch(
            updateAccount({
                accountInfo: {
                    phoneNumber: phoneNumber,
                    isAccountComplete: true,
                },
                publicGeneralInfo: {
                    displayName: displayName,
                    isComplete: true,
                },
            })
        );

        setTriedUpdatingAccount(true);
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
                            size={EStyleSheet.value('42rem')}
                        />
                    </CircleButton>
                    <Text style={styles.welcomeText}>Account Settings</Text>
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
                        <Text style={styles.fieldLabel}>Phone Number:</Text>
                        <TextInput
                            style={styles.phoneNumberInput}
                            maxLength={constants.MAX_PHONE_NUMBER_LENGTH}
                            onChangeText={setPhoneNumber}
                            autoCompleteType={'off'}
                            keyboardType='phone-pad'
                            contextMenuHidden={true}
                            defaultValue={accountInfo?.phoneNumber || ''}
                            placeholder='+11234567890'
                        />
                        <Text style={styles.fieldLabel}>Display Name:</Text>
                        <TextInput
                            style={styles.profileInput}
                            maxLength={constants.MAX_DISPLAY_NAME_LENGTH}
                            onChangeText={setDisplayName}
                            defaultValue={publicGeneralInfo?.displayName || ''}
                            placeholder='John Smith'
                        />
                        <TouchableOpacity
                            style={styles.sendButton}
                            disabled={updatingAccount}
                            onPress={handleSave}
                        >
                            {updatingAccount ? (
                                <Spinner>
                                    <MaterialCommunityIcons
                                        style={styles.loadingIcon}
                                        name='loading'
                                        color='#FFF'
                                        size={EStyleSheet.value('32rem')}
                                    />
                                </Spinner>
                            ) : (
                                <Text style={styles.sendButtonLabel}>Save</Text>
                            )}
                        </TouchableOpacity>
                    </KeyboardAwareScrollView>
                </MaskedView>
            </LinearGradient>
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
        borderBottomWidth: '1rem',
        borderColor: '#0D161F7F',
        backgroundColor: '#0000001F',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: '28rem',
        marginLeft: '16rem',
        color: '#FFF',
    },
    welcomeUserName: {
        fontSize: '22rem',
        color: '#FFF',
    },
    settingsButton: {
        backgroundColor: '#E9C46A19',
        borderColor: '#F4A2617F',
        borderWidth: '1rem',
    },
    /* Body */
    body: {
        margin: '32rem',
        paddingBottom: '48rem',
    },
    fieldLabel: {
        color: '#FFF',
        fontSize: '16rem',
        paddingBottom: '4rem',
    },
    phoneNumberInput: {
        backgroundColor: '#1A2633',
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: '1rem',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '16rem',
        marginBottom: '16rem',
    },
    profileInput: {
        backgroundColor: '#1A2633',
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: '1rem',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '16rem',
        marginBottom: '16rem',
    },
    shareTextInput: {
        backgroundColor: '#1A2633',
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: '1rem',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '16rem',
        marginBottom: '16rem',
    },
    sendButton: {
        backgroundColor: '#0D161F',
        width: '50%',
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: '1rem',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        height: '50rem',
    },
    sendButtonLabel: {
        fontSize: '20rem',
        color: '#FFF',
        textAlignVertical: 'center',
        paddingVertical: '8rem',
    },
    wipWarning: {
        fontSize: '18rem',
        color: '#FFF',
        alignSelf: 'center',
    },
    loadingIcon: {
        flex: 1,
        aspectRatio: 1,
        textAlignVertical: 'center',
        textAlign: 'center',
    },
    /* Mask */
    mask: {
        flex: 1,
    },
    maskGradient: {
        flex: 1,
        backgroundColor: 'transparent',
    },
});

export default AccountSettingsScreen;
export type { Props };
export const ComponentId = 'com.simpleshare.AccountSettingsScreen';
