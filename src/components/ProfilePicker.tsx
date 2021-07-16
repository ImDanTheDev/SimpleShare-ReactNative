import React, { ReactNode, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IProfile from '../api/IProfile';
import { CircleButton } from './CircleButton';

export interface Props {
    profiles: IProfile[];
    initialProfile?: string;
    onSwitchProfile: (profileId: string) => void;
    onCreateProfile: () => void;
}

export const ProfilePicker: React.FC<Props> = (props: Props) => {
    const [selectedProfileId, setSelectedProfileId] = useState<
        string | undefined
    >(props.initialProfile);

    const handleSwitchProfileButton = (profile: IProfile) => {
        if (!profile.id || selectedProfileId === profile.id) return;
        setSelectedProfileId(profile.id);
        props.onSwitchProfile(profile.id);
    };

    const renderProfiles = (): ReactNode[] => {
        const profileElements: ReactNode[] = [];

        profileElements.push(
            <CircleButton
                key='addProfile'
                size={64}
                style={styles.addProfileButton}
                onPress={props.onCreateProfile}
            >
                <MaterialIcons name='add' size={56} color='white' />
            </CircleButton>
        );

        profileElements.push(
            props.profiles.map((profile) => {
                return (
                    <CircleButton
                        key={profile.id}
                        size={64}
                        style={styles.profileButton}
                        invertAnimation={selectedProfileId === profile.id}
                        onPress={() => handleSwitchProfileButton(profile)}
                    >
                        <Text style={styles.profileButtonLabel}>
                            {profile.name.length > 2
                                ? profile.name.slice(0, 2)
                                : profile.name}
                        </Text>
                    </CircleButton>
                );
            })
        );

        return profileElements;
    };

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContainer}
            horizontal={true}
        >
            {renderProfiles()}
        </ScrollView>
    );
};

const styles = EStyleSheet.create({
    addProfileButton: {
        marginRight: '8rem',
        backgroundColor: '#E9C46A19',
        borderColor: '#F4A2617F',
        borderWidth: 1,
    },
    profileButton: {
        marginHorizontal: '8rem',
        backgroundColor: '#E9C46A19',
        borderColor: '#F4A2617F',
        borderWidth: 1,
    },
    settingsButton: {
        backgroundColor: 'gray',
    },
    profileButtonLabel: {
        fontSize: 28,
        color: 'white',
        fontWeight: 'bold',
    },
    scrollContainer: {
        alignItems: 'center',
    },
    // Disable 'any' check for auto-complete in EStyleSheet.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as StyleSheet.NamedStyles<any>);
