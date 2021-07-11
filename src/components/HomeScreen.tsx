import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import {
    Navigation,
    NavigationFunctionComponent,
} from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getUidByPhoneNumber, signOut } from '../api/AccountAPI';
import IProfile from '../api/IProfile';
import IShare from '../api/IShare';
import IUser from '../api/IUser';
import {
    createProfile,
    getAllProfiles,
    getProfileIdByName,
} from '../api/ProfileAPI';
import { createShare, switchShareListener } from '../api/ShareAPI';
import { setCurrentProfile } from '../redux/profilesSlice';
import { setShares } from '../redux/sharesSlice';
import { RootState } from '../redux/store';
import { ComponentId as WelcomeScreenComponentId } from './WelcomeScreen';

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
}

const HomeScreen: NavigationFunctionComponent<Props> = () => {
    const dispatch = useDispatch();

    const user: IUser | undefined = useSelector(
        (state: RootState) => state.auth.user
    );

    const profiles: IProfile[] = useSelector(
        (state: RootState) => state.profiles.profiles
    );

    const shares: IShare[] = useSelector(
        (state: RootState) => state.shares.shares
    );

    const currentProfile: IProfile | undefined = useSelector(
        (state: RootState) =>
            state.profiles.profiles.find(
                (profile) => profile.id === state.profiles.currentProfileId
            )
    );

    const [newProfileName, setNewProfileName] = useState<string>('');
    const [shareDestinationPhoneNumber, setShareDestinationPhoneNumber] =
        useState<string>('');
    const [shareDestinationProfile, setShareDestinationProfile] =
        useState<string>('');
    const [shareText, setShareText] = useState<string>('');

    useEffect(() => {
        const fetchProfiles = async () => {
            if (!user) return;
            await getAllProfiles(user.uid);
        };

        if (!user) {
            // We do not have a user, so go back to the WelcomeScreen to restart auth flow.
            console.log('We do not have a user, so go to WelcomeScreen.');
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
        } else {
            console.log('We have a user, so stay on HomeScreen.');
            fetchProfiles();
        }
    }, [user]);

    const handleSignOutButton = async () => {
        await signOut();
    };

    const handleCreateProfileButton = async () => {
        if (!user) return;
        await createProfile(user.uid, {
            name: newProfileName,
        });
    };

    const handleSendShareButton = async () => {
        if (!user || !currentProfile || !currentProfile.id) return;

        const toUid = await getUidByPhoneNumber(shareDestinationPhoneNumber);
        if (!toUid) return;
        const toProfileId = await getProfileIdByName(
            toUid,
            shareDestinationProfile
        );
        if (!toProfileId) return;

        const success = await createShare({
            content: shareText,
            toUid: toUid,
            toProfileId: toProfileId,
            fromUid: user.uid,
            fromProfileId: currentProfile.id,
            type: 'text',
        });
    };

    const handleSwitchProfileButton = (profile: IProfile) => {
        if (!user) return;
        dispatch(setShares([]));
        dispatch(setCurrentProfile(profile.id || 'INVALID_PROFILE'));
        switchShareListener(user?.uid, profile.id || 'INVALID_PROFILE');
    };

    const renderProfiles = (): Element[] => {
        const result: Element[] = [];

        profiles.forEach((profile) => {
            result.push(
                <View key={profile.id} style={styles.labeledInput}>
                    <Text>{profile.name}</Text>
                    <Button
                        title='Switch to'
                        onPress={() => handleSwitchProfileButton(profile)}
                    />
                </View>
            );
        });

        return result;
    };

    const renderShares = (): Element[] => {
        const result: Element[] = [];

        shares.forEach((share) => {
            result.push(<Text key={share.id}>{share.content}</Text>);
        });

        return result;
    };

    return (
        <View style={styles.root}>
            <Text>Home Screen</Text>
            <Text>
                Welcome {user?.displayName} [
                {currentProfile?.name || 'Select A Profile'}]
            </Text>
            <Button title='Sign-Out' onPress={handleSignOutButton} />
            <TextInput onChangeText={setNewProfileName} />
            <Button
                title='Create Profile'
                onPress={handleCreateProfileButton}
            />
            {renderProfiles()}
            <TextInput
                keyboardType='phone-pad'
                onChangeText={setShareDestinationPhoneNumber}
                placeholder='phone number'
            />
            <TextInput
                onChangeText={setShareDestinationProfile}
                placeholder='profile'
            />
            <TextInput onChangeText={setShareText} placeholder='text' />
            <Button title='Send Share' onPress={handleSendShareButton} />
            {renderShares()}
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        padding: 16,
    },
    labeledInput: {
        flexDirection: 'row',
    },
});

export default HomeScreen;
export type { Props };
export const ComponentId = 'com.simpleshare.HomeScreen';
