import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import {
    Navigation,
    NavigationFunctionComponent,
} from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../api/AccountAPI';
import IProfile from '../api/IProfile';
import IUser from '../api/IUser';
import { createProfile, getAllProfiles } from '../api/ProfileAPI';
import { setCurrentProfile } from '../redux/profilesSlice';
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

    const currentProfile: IProfile | undefined = useSelector(
        (state: RootState) =>
            state.profiles.profiles.find(
                (profile) => profile.id === state.profiles.currentProfileId
            )
    );

    const [newProfileName, setNewProfileName] = useState<string>('');

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

    const renderProfiles = (): Element[] => {
        const result: Element[] = [];

        profiles.forEach((profile) => {
            result.push(
                <View key={profile.id} style={styles.profileEntry}>
                    <Text>{profile.name}</Text>
                    <Button
                        title='Switch to'
                        onPress={() => {
                            dispatch(
                                setCurrentProfile(
                                    profile.id || 'INVALID_PROFILE'
                                )
                            );
                        }}
                    />
                </View>
            );
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
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        padding: 16,
    },
    profileEntry: {
        flexDirection: 'row',
    },
});

export default HomeScreen;
export type { Props };
export const ComponentId = 'com.simpleshare.HomeScreen';
