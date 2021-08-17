import React, { useEffect, useRef, useState } from 'react';
import {
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import EStyleSheet from 'react-native-extended-stylesheet';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {
    Navigation,
    NavigationFunctionComponent,
} from 'react-native-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { getUidByPhoneNumber } from '../api/AccountAPI';
import IProfile from '../api/IProfile';
import IShare from '../api/IShare';
import IUser from '../api/IUser';
import { getProfileIdByName } from '../api/ProfileAPI';
import { createShare } from '../api/ShareAPI';
import { RootState } from '../redux/store';
import { CircleButton } from './CircleButton';
import {
    MAX_PHONE_NUMBER_LENGTH,
    MAX_PROFILE_NAME_LENGTH,
    MAX_SHARE_TEXT_LENGTH,
    MIN_PHONE_NUMBER_LENGTH,
    MIN_PROFILE_NAME_LENGTH,
} from '../constants';
import { pushToast } from '../redux/toasterSlice';
import { addShareToOutbox } from '../redux/outboxSlice';

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
}

const SendShareScreen: NavigationFunctionComponent<Props> = (props: Props) => {
    const dispatch = useDispatch();

    const user: IUser | undefined = useSelector(
        (state: RootState) => state.auth.user
    );

    const currentProfile: IProfile | undefined = useSelector(
        (state: RootState) =>
            state.profiles.profiles.find(
                (profile) => profile.id === state.profiles.currentProfileId
            )
    );

    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [profileName, setProfileName] = useState<string>('');
    const [shareText, setShareText] = useState<string>('');

    const goingAway = useRef<boolean>(false);

    useEffect(() => {
        goingAway.current = false;
        return () => {
            goingAway.current = true;
        };
    }, []);

    const handleBack = async () => {
        await Navigation.pop(props.componentId);
    };

    const handleSendShare = async () => {
        if (!user || !currentProfile || !currentProfile.id) {
            console.log('ERROR: Not signed in!');
            return;
        }

        if (phoneNumber.length < MIN_PHONE_NUMBER_LENGTH) {
            dispatch(
                pushToast({
                    message: `'${phoneNumber}' is not a valid phone number.`,
                    duration: 5,
                    type: 'error',
                })
            );
            return;
        }

        if (profileName.length < MIN_PROFILE_NAME_LENGTH) {
            dispatch(
                pushToast({
                    message: `'${profileName}' is not a valid profile name.`,
                    duration: 5,
                    type: 'error',
                })
            );
            return;
        }

        if (shareText.length > MAX_SHARE_TEXT_LENGTH) {
            dispatch(
                pushToast({
                    message: `Your message length must not exceed ${MAX_SHARE_TEXT_LENGTH} characters.`,
                    duration: 5,
                    type: 'error',
                })
            );
            return;
        }

        const toUid = await getUidByPhoneNumber(phoneNumber);
        if (!toUid) {
            dispatch(
                pushToast({
                    message:
                        'Could not find a user with the provided phone number.',
                    duration: 5,
                    type: 'error',
                })
            );
            return;
        }
        const toProfileId = await getProfileIdByName(toUid, profileName);
        if (!toProfileId) {
            dispatch(
                pushToast({
                    message: `Profile '${profileName}' does not exist.`,
                    duration: 5,
                    type: 'error',
                })
            );
            return;
        }

        const share: IShare = {
            fromUid: user.uid,
            fromProfileId: currentProfile.id,
            toUid: toUid,
            toProfileId: toProfileId,
            content: shareText,
            type: 'text',
        };

        try {
            await createShare(share);
            dispatch(addShareToOutbox(share));
            if (!goingAway.current) {
                await Navigation.pop(props.componentId);
            }
        } catch (e) {
            console.log(`Failed to send share: ${e}`);
            dispatch(
                pushToast({
                    message: `An unexpected error occurred while sending the share.`,
                    duration: 5,
                    type: 'error',
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
                    <Text style={styles.welcomeText}>New Share</Text>
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
                            maxLength={MAX_PHONE_NUMBER_LENGTH}
                            onChangeText={setPhoneNumber}
                            autoCompleteType={'off'}
                            contextMenuHidden={true}
                            keyboardType='phone-pad'
                            placeholder='+11234567890'
                        />
                        <Text style={styles.fieldLabel}>Profile Name:</Text>
                        <TextInput
                            style={styles.profileInput}
                            maxLength={MAX_PROFILE_NAME_LENGTH}
                            onChangeText={setProfileName}
                            placeholder='Laptop'
                        />
                        <Text style={styles.fieldLabel}>Text:</Text>
                        <TextInput
                            style={styles.shareTextInput}
                            maxLength={MAX_SHARE_TEXT_LENGTH}
                            onChangeText={setShareText}
                            placeholder='Enter anything you want here!'
                            multiline={true}
                            numberOfLines={5}
                        />
                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={handleSendShare}
                        >
                            <Text style={styles.sendButtonLabel}>Send</Text>
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
        fontSize: '28rem',
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
    },
    sendButtonLabel: {
        fontSize: '20rem',
        color: '#FFF',
        textAlignVertical: 'center',
        paddingVertical: '8rem',
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

export default SendShareScreen;
export type { Props };
export const ComponentId = 'com.simpleshare.SendShareScreen';
