import React, { useEffect, useState } from 'react';
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
import { RootState } from '../../redux/store';
import { CircleButton } from '../common/CircleButton';
import { pushToast } from '../../redux/toasterSlice';
import {
    constants,
    ErrorCode,
    IProfile,
    IUser,
    sendShare,
    signOut,
} from 'simpleshare-common';
import Spinner from '../common/Spinner';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';

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

    const sendingShare: boolean = useSelector(
        (state: RootState) => state.shares.sendingShare
    );
    const sentShare = useSelector((state: RootState) => state.shares.sentShare);
    const sendShareError = useSelector(
        (state: RootState) => state.shares.sendShareError
    );

    const [triedSendingShare, setTriedSendingShare] = useState<boolean>(false);
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [profileName, setProfileName] = useState<string>('');
    const [shareText, setShareText] = useState<string>('');
    const [fileUri, setFileUri] = useState<string | undefined>(undefined);
    const [fileType, setFileType] = useState<string | undefined>(undefined);
    const [fileName, setFileName] = useState<string | undefined>(undefined);

    useEffect(() => {
        const checkForSent = async () => {
            if (
                triedSendingShare &&
                !sendingShare &&
                sentShare &&
                !sendShareError
            ) {
                await Navigation.pop(props.componentId);
            } else if (!sendingShare && !sentShare && sendShareError) {
                let errorMessage = '';
                switch (sendShareError.code) {
                    case ErrorCode.NOT_SIGNED_IN:
                        errorMessage =
                            'You are not signed in. Please sign out and sign in.';
                        break;
                    case ErrorCode.NO_PROFILE_SELECTED:
                        errorMessage =
                            'No profile selected. Please switch to the profile from which to send the share from.';
                        break;
                    case ErrorCode.USER_DOES_NOT_EXIST:
                        errorMessage =
                            'The provided user does not exist. Verify that the phone number is correct.';
                        break;
                    case ErrorCode.PROFILE_DOES_NOT_EXIST:
                        errorMessage =
                            'The provided profile does not exist. Verify that the profile name is correct. Profile names are case sensitive.';
                        break;
                    default:
                        errorMessage =
                            'An unexpected error occurred while sending. Try again later.';
                        break;
                }
                dispatch(
                    pushToast({
                        duration: 5,
                        message: errorMessage,
                        type: 'error',
                    })
                );
            }
        };
        checkForSent();
    }, [
        sendingShare,
        sentShare,
        sendShareError,
        props.componentId,
        dispatch,
        triedSendingShare,
    ]);

    const handleBack = async () => {
        await Navigation.pop(props.componentId);
    };

    const handleSendShare = async () => {
        if (!user || !currentProfile || !currentProfile.id) {
            dispatch(signOut());
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

        if (profileName.length < constants.MIN_PROFILE_NAME_LENGTH) {
            dispatch(
                pushToast({
                    message: `'${profileName}' is not a valid profile name.`,
                    duration: 5,
                    type: 'error',
                })
            );
            return;
        }

        if (shareText.length > constants.MAX_SHARE_TEXT_LENGTH) {
            dispatch(
                pushToast({
                    message: `Your message length must not exceed ${constants.MAX_SHARE_TEXT_LENGTH} characters.`,
                    duration: 5,
                    type: 'error',
                })
            );
            return;
        }

        if (!fileUri && shareText.length === 0) {
            dispatch(
                pushToast({
                    message:
                        'You must send at least text or a file. Select a file or enter text.',
                    duration: 5,
                    type: 'error',
                })
            );
            return;
        }

        dispatch(
            sendShare({
                share: {
                    textContent: shareText,
                    fileSrc:
                        fileUri && fileType
                            ? {
                                  filePath: fileUri,
                                  fileType: fileType,
                              }
                            : undefined,
                },
                toPhoneNumber: phoneNumber,
                toProfileName: profileName,
            })
        );
        setTriedSendingShare(true);
    };

    const handleSelectFile = async () => {
        try {
            const pickerResponse = await DocumentPicker.pickSingle({
                allowMultiSelection: false,
                mode: 'open',
                copyTo: 'documentDirectory',
                type: DocumentPicker.types.allFiles,
            });

            const fileUri = `file://${decodeURIComponent(
                pickerResponse.fileCopyUri
            )}`;

            setFileUri(fileUri);
            setFileType(pickerResponse.type);
            setFileName(fileUri.split('/').pop());
        } catch {
            dispatch(
                pushToast({
                    duration: 5,
                    message: 'An error occurred while opening the file picker.',
                    type: 'error',
                })
            );
        }
    };

    const handleClearFile = () => {
        setFileName(undefined);
        setFileType(undefined);
        setFileUri(undefined);
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
                            maxLength={constants.MAX_PHONE_NUMBER_LENGTH}
                            onChangeText={setPhoneNumber}
                            autoCompleteType={'off'}
                            contextMenuHidden={true}
                            keyboardType='phone-pad'
                            placeholder='+11234567890'
                        />
                        <Text style={styles.fieldLabel}>Profile Name:</Text>
                        <TextInput
                            style={styles.profileInput}
                            maxLength={constants.MAX_PROFILE_NAME_LENGTH}
                            onChangeText={setProfileName}
                            placeholder='Laptop'
                        />
                        <Text style={styles.fieldLabel}>Text:</Text>
                        <TextInput
                            style={styles.shareTextInput}
                            maxLength={constants.MAX_SHARE_TEXT_LENGTH}
                            onChangeText={setShareText}
                            placeholder='Enter anything you want here!'
                            multiline={true}
                            numberOfLines={5}
                        />
                        {fileUri ? (
                            <View style={styles.selectedFileButtonGroup}>
                                <TouchableOpacity
                                    style={styles.clearFileButton}
                                    disabled={sendingShare}
                                    onPress={handleClearFile}
                                >
                                    <MaterialCommunityIcons
                                        name='close'
                                        size={30}
                                        color='#FFF'
                                    />
                                </TouchableOpacity>
                                <Text
                                    style={styles.selectedFileButtonLabel}
                                    numberOfLines={1}
                                    ellipsizeMode='middle'
                                >
                                    {fileName}
                                </Text>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.selectFileButton}
                                disabled={sendingShare}
                                onPress={handleSelectFile}
                            >
                                <Text style={styles.selectFileButtonLabel}>
                                    Select File
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={styles.sendButton}
                            disabled={sendingShare}
                            onPress={handleSendShare}
                        >
                            {sendingShare ? (
                                <Spinner>
                                    <MaterialCommunityIcons
                                        style={styles.loadingIcon}
                                        name='loading'
                                        color='#FFF'
                                        size={EStyleSheet.value('32rem')}
                                    />
                                </Spinner>
                            ) : (
                                <Text style={styles.sendButtonLabel}>Send</Text>
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
    selectedFileButtonGroup: {
        backgroundColor: '#0D161F',
        width: '100%',
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: '1rem',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        height: '50rem',
        flexDirection: 'row',
        paddingRight: '8rem',
        marginBottom: '16rem',
    },
    clearFileButton: {
        height: '100%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedFileButtonLabel: {
        flex: 1,
        fontSize: '16rem',
        color: '#FFF',
        textAlignVertical: 'center',
        paddingVertical: '8rem',
    },
    selectFileButton: {
        backgroundColor: '#0D161F',
        width: '100%',
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: '1rem',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        height: '50rem',
        marginBottom: '16rem',
    },
    selectFileButtonLabel: {
        fontSize: '20rem',
        color: '#FFF',
        textAlignVertical: 'center',
        paddingVertical: '8rem',
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

export default SendShareScreen;
export type { Props };
export const ComponentId = 'com.simpleshare.SendShareScreen';
