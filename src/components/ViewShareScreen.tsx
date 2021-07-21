import Clipboard from '@react-native-clipboard/clipboard';
import MaskedView from '@react-native-masked-view/masked-view';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {
    Navigation,
    NavigationFunctionComponent,
} from 'react-native-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IProfile from '../api/IProfile';
import IShare from '../api/IShare';
import { getProfile } from '../api/ProfileAPI';
import { deleteShare } from '../api/ShareAPI';
import { CircleButton } from './CircleButton';

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
    share: IShare;
}

const ViewShareScreen: NavigationFunctionComponent<Props> = (props: Props) => {
    const [showFromUserCopied, setShowFromUserCopied] =
        useState<boolean>(false);
    const [showFromUserCopiedTimingOut, setShowFromUserCopiedTimingOut] =
        useState<boolean>(false);

    const [showFromProfileCopied, setShowFromProfileCopied] =
        useState<boolean>(false);
    const [showFromProfileCopiedTimingOut, setShowFromProfileCopiedTimingOut] =
        useState<boolean>(false);

    const [showTextContentCopied, setShowTextContentCopied] =
        useState<boolean>(false);
    const [showTextContentCopiedTimingOut, setShowTextContentCopiedTimingOut] =
        useState<boolean>(false);

    const cancelTimeout = useRef<boolean>(false);

    const [profileName, setProfileName] = useState<string>('');

    useEffect(() => {
        cancelTimeout.current = false;
        return () => {
            cancelTimeout.current = true;
        };
    }, []);

    useEffect(() => {
        const fetchProfileName = async () => {
            const profile: IProfile | undefined = await getProfile(
                props.share.fromUid,
                props.share.fromProfileId
            );
            setProfileName(profile?.name || 'Unknown Profile');
        };
        fetchProfileName();
    }, [props.share]);

    useEffect(() => {
        if (showFromUserCopied && !showFromUserCopiedTimingOut) {
            setShowFromUserCopiedTimingOut(true);
            setTimeout(() => {
                if (cancelTimeout.current) return;
                setShowFromUserCopiedTimingOut(false);
                setShowFromUserCopied(false);
            }, 3000);
        }
        if (showFromProfileCopied && !showFromProfileCopiedTimingOut) {
            setShowFromProfileCopiedTimingOut(true);
            setTimeout(() => {
                if (cancelTimeout.current) return;
                setShowFromProfileCopiedTimingOut(false);
                setShowFromProfileCopied(false);
            }, 3000);
        }
        if (showTextContentCopied && !showTextContentCopiedTimingOut) {
            setShowTextContentCopiedTimingOut(true);
            setTimeout(() => {
                if (cancelTimeout.current) return;
                setShowTextContentCopiedTimingOut(false);
                setShowTextContentCopied(false);
            }, 3000);
        }
    }, [
        showFromUserCopied,
        showFromUserCopiedTimingOut,
        showFromProfileCopied,
        showFromProfileCopiedTimingOut,
        showTextContentCopied,
        showTextContentCopiedTimingOut,
    ]);

    const handleBack = async () => {
        await Navigation.pop(props.componentId);
    };

    const copyFromUser = () => {
        setShowFromUserCopied(true);
        Clipboard.setString(props.share.fromUid);
    };
    const copyFromProfile = () => {
        setShowFromProfileCopied(true);
        Clipboard.setString(profileName);
    };

    const copyTextContent = () => {
        setShowTextContentCopied(true);
        Clipboard.setString(props.share.content);
    };

    const handleDeleteShare = async () => {
        await deleteShare(props.share);
        await Navigation.pop(props.componentId);
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
                    <Text style={styles.welcomeText}>Your Share</Text>
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
                                From User:
                            </Text>
                            {showFromUserCopied ? (
                                <Text style={styles.copiedNotification}>
                                    Copied!
                                </Text>
                            ) : (
                                <></>
                            )}
                        </View>
                        <Text
                            style={styles.phoneNumberInput}
                            onPress={copyFromUser}
                        >
                            {props.share.fromUid}
                        </Text>
                        <View style={styles.inputLabelGroup}>
                            <Text style={styles.inputLabelText}>
                                From Profile:
                            </Text>
                            {showFromProfileCopied ? (
                                <Text style={styles.copiedNotification}>
                                    Copied!
                                </Text>
                            ) : (
                                <></>
                            )}
                        </View>
                        <Text
                            style={styles.phoneNumberInput}
                            onPress={copyFromProfile}
                        >
                            {profileName}
                        </Text>
                        <View style={styles.inputLabelGroup}>
                            <Text style={styles.inputLabelText}>
                                Text Content:
                            </Text>
                            {showTextContentCopied ? (
                                <Text style={styles.copiedNotification}>
                                    Copied!
                                </Text>
                            ) : (
                                <></>
                            )}
                        </View>
                        <Text
                            style={styles.phoneNumberInput}
                            onPress={copyTextContent}
                        >
                            {props.share.content}
                        </Text>
                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={handleDeleteShare}
                        >
                            <Text style={styles.sendButtonLabel}>Delete</Text>
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
        fontSize: 22,
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
        padding: '16rem',
        marginBottom: '16rem',
        color: '#FFF',
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
    copiedNotification: {
        color: '#FFF',
        fontSize: 20,
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

export default ViewShareScreen;
export type { Props };
export const ComponentId = 'com.simpleshare.ViewShareScreen';
