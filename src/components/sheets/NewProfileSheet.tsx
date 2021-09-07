import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { TextInput } from 'react-native-gesture-handler';
import {
    Navigation,
    NavigationFunctionComponent,
} from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { pushToast } from '../../redux/toasterSlice';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from '../common/Spinner';
import { constants, createProfile, IUser } from 'simpleshare-common';

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
    onDismiss: () => void;
}

export const NewProfileSheet: NavigationFunctionComponent<Props> = (
    props: Props
) => {
    const dispatch = useDispatch();
    const user: IUser | undefined = useSelector(
        (state: RootState) => state.auth.user
    );

    const creatingProfile: boolean = useSelector(
        (state: RootState) => state.profiles.creatingProfile
    );
    const createdProfile: boolean = useSelector(
        (state: RootState) => state.profiles.createdProfile
    );
    const createProfileError = useSelector(
        (state: RootState) => state.profiles.createProfileError
    );

    const [triedCreatingProfile, setTriedCreatingProfile] =
        useState<boolean>(false);
    const [profileName, setProfileName] = useState<string>();
    const goingAway = useRef<boolean>(false);

    useEffect(() => {
        goingAway.current = false;
        return () => {
            goingAway.current = true;
        };
    }, []);

    useEffect(() => {
        const checkForCreate = async () => {
            if (
                triedCreatingProfile &&
                !creatingProfile &&
                createdProfile &&
                !createProfileError
            ) {
                props.onDismiss();
                await Navigation.dismissModal(props.componentId);
            } else if (
                triedCreatingProfile &&
                !creatingProfile &&
                !createdProfile &&
                createProfileError
            ) {
                dispatch(
                    pushToast({
                        duration: 5,
                        message:
                            'An error occurred while creating the profile. Try again later.',
                        type: 'error',
                    })
                );
            }
        };
        checkForCreate();
    }, [
        createProfileError,
        createdProfile,
        creatingProfile,
        dispatch,
        props,
        triedCreatingProfile,
    ]);

    const handleDismiss = async () => {
        props.onDismiss();
        try {
            await Navigation.dismissModal(props.componentId);
        } catch {}
    };

    const handleSaveProfile = async () => {
        if (creatingProfile) return;
        if (!user) {
            dispatch(
                pushToast({
                    duration: 5,
                    message: 'You are signed out. Sign in and try again.',
                    type: 'error',
                })
            );
            return;
        }

        if (
            !profileName ||
            profileName.length < constants.MIN_PROFILE_NAME_LENGTH
        ) {
            dispatch(
                pushToast({
                    duration: 5,
                    message:
                        'Profile names must be at least two characters long.',
                    type: 'info',
                })
            );
            return;
        }

        dispatch(
            createProfile({
                name: profileName,
            })
        );
        setTriedCreatingProfile(true);
    };

    return (
        <View style={styles.overlay}>
            <TouchableOpacity
                style={styles.dismissOverlay}
                onPress={handleDismiss}
            />
            <View style={styles.modal}>
                <Text style={styles.header}>New Profile</Text>
                <View style={styles.profileInfoGroup}>
                    <View style={styles.profilePicture}>
                        <Text style={styles.profilePictureText}>PFP</Text>
                    </View>
                    <View style={styles.labeledField}>
                        <Text style={styles.profileNameLabel}>
                            Profile Name:
                        </Text>
                        <View style={styles.spacer} />
                        <TextInput
                            style={styles.profileName}
                            maxLength={constants.MAX_PROFILE_NAME_LENGTH}
                            placeholder='Phone'
                            onChangeText={setProfileName}
                        />
                    </View>
                </View>
                <View style={styles.actionGroup}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={handleDismiss}
                    >
                        <Text style={styles.cancelButtonLabel}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSaveProfile}
                    >
                        {creatingProfile ? (
                            <Spinner>
                                <MaterialCommunityIcons
                                    style={{}}
                                    name='loading'
                                    color='#FFF'
                                    size={EStyleSheet.value('32rem')}
                                />
                            </Spinner>
                        ) : (
                            <Text style={styles.saveButtonLabel}>Save</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = EStyleSheet.create({
    overlay: {
        flex: 1,
        flexDirection: 'column-reverse',
    },
    dismissOverlay: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
    },
    modal: {
        height: '200rem',
        marginHorizontal: '16rem',
        padding: '16rem',
        backgroundColor: '#0D161F',
        borderTopLeftRadius: '16rem',
        borderTopRightRadius: '16rem',
        borderColor: '#F4A2617F',
        borderTopWidth: '2rem',
        borderLeftWidth: '2rem',
        borderRightWidth: '2rem',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: '2rem',
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 6,
    },
    header: {
        fontSize: '22rem',
        color: '#FFF',
        textAlign: 'center',
        paddingBottom: '16rem',
    },
    profileInfoGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profilePicture: {
        width: '64rem',
        aspectRatio: 1,
        backgroundColor: '#1A2633',
        marginRight: '8rem',
        borderRadius: '16rem',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profilePictureText: {
        color: '#979797',
        fontWeight: 'bold',
        fontSize: '20rem',
    },
    labeledField: {
        flex: 1,
        flexDirection: 'column',
    },
    profileNameLabel: {
        fontSize: '14rem',
        color: '#FFF',
        //paddingBottom: '4rem',
    },
    profileName: {
        backgroundColor: '#1A2633',
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: '1rem',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '16rem',
    },
    actionGroup: {
        flexDirection: 'row',
        marginTop: '16rem',
    },
    cancelButton: {
        backgroundColor: '#1A2633',
        flex: 1,
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: '1rem',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '16rem',
    },
    cancelButtonLabel: {
        fontSize: '20rem',
        color: '#FFF',
        textAlignVertical: 'center',
    },
    saveButton: {
        backgroundColor: '#1A2633',
        flex: 1,
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: '1rem',
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonLabel: {
        fontSize: '20rem',
        color: '#FFF',
        textAlignVertical: 'center',
        paddingVertical: '4rem',
    },
    spacer: {
        flex: 1,
    },
});

export default NewProfileSheet;
export type { Props };
export const ComponentId = 'com.simpleshare.NewProfileSheet';
