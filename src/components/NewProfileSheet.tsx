import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { TextInput } from 'react-native-gesture-handler';
import {
    Navigation,
    NavigationFunctionComponent,
} from 'react-native-navigation';
import { useSelector } from 'react-redux';
import IUser from '../api/IUser';
import { createProfile } from '../api/ProfileAPI';
import { RootState } from '../redux/store';

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
    onDismiss: () => void;
}

export const NewProfileSheet: NavigationFunctionComponent<Props> = (
    props: Props
) => {
    const user: IUser | undefined = useSelector(
        (state: RootState) => state.auth.user
    );

    const [profileName, setProfileName] = useState<string>();

    const handleDismiss = async () => {
        props.onDismiss();
        await Navigation.dismissModal(props.componentId);
    };

    const handleSaveProfile = async () => {
        if (!user) {
            console.log('ERROR: Not signed in!');
            return;
        }

        if (!profileName) return;

        await createProfile(user.uid, {
            name: profileName,
        });
        await handleDismiss();
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
                    <TextInput
                        style={styles.profileName}
                        placeholder='Profile name'
                        onChangeText={setProfileName}
                    />
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
                        <Text style={styles.saveButtonLabel}>Save</Text>
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
            height: 2,
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
        fontSize: 20,
    },
    profileName: {
        backgroundColor: '#1A2633',
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: 1,
        flex: 1,
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
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '16rem',
    },
    cancelButtonLabel: {
        fontSize: 20,
        color: '#FFF',
        textAlignVertical: 'center',
    },
    saveButton: {
        backgroundColor: '#1A2633',
        flex: 1,
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonLabel: {
        fontSize: 20,
        color: '#FFF',
        textAlignVertical: 'center',
        paddingVertical: '4rem',
    },
});

export default NewProfileSheet;
export type { Props };
export const ComponentId = 'com.simpleshare.NewProfileSheet';
