import React, { useState } from 'react';
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
import { useSelector } from 'react-redux';
import { getUidByPhoneNumber } from '../api/AccountAPI';
import IProfile from '../api/IProfile';
import IShare from '../api/IShare';
import IUser from '../api/IUser';
import { getProfileIdByName } from '../api/ProfileAPI';
import { createShare } from '../api/ShareAPI';
import { RootState } from '../redux/store';
import { CircleButton } from './CircleButton';

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
}

const SendShareScreen: NavigationFunctionComponent<Props> = (props: Props) => {
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

    const handleBack = async () => {
        await Navigation.pop(props.componentId);
    };

    const handleSendShare = async () => {
        if (!user || !currentProfile || !currentProfile.id) {
            console.log(user);
            console.log(currentProfile);
            console.log(currentProfile?.id);
            return;
        }

        const toUid = await getUidByPhoneNumber(phoneNumber);
        if (!toUid) {
            console.log(toUid);
            return;
        }
        const toProfileId = await getProfileIdByName(toUid, profileName);
        if (!toProfileId) {
            console.log(toProfileId);
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
            const success = await createShare(share);
            if (success) {
                await Navigation.pop(props.componentId);
            } else {
                console.log('Failed to send share');
            }
        } catch (e) {
            console.log(`Failed to send share: ${e}`);
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
                            size={42}
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
                        <TextInput
                            style={styles.phoneNumberInput}
                            onChangeText={setPhoneNumber}
                            autoCompleteType={'off'}
                            keyboardType='phone-pad'
                            placeholder='Phone number'
                        />
                        <TextInput
                            style={styles.profileInput}
                            onChangeText={setProfileName}
                            placeholder='Profile name'
                        />
                        <TextInput
                            style={styles.shareTextInput}
                            onChangeText={setShareText}
                            placeholder='Enter text to share'
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
        borderBottomWidth: 1,
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
        fontSize: 28,
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
    profileInput: {
        backgroundColor: '#1A2633',
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '16rem',
        marginBottom: '16rem',
    },
    shareTextInput: {
        backgroundColor: '#1A2633',
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: 1,
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
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
    },
    sendButtonLabel: {
        fontSize: 20,
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
