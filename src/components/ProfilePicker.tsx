import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Text, View, ViewabilityConfig, ViewToken } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import {
    constants,
    IProfile,
    selectProfileForEditing,
} from 'simpleshare-common';
import { CircleButton } from './common/CircleButton';

export interface Props {
    profiles: IProfile[];
    initialProfile?: string;
    editingProfiles: boolean;
    onSwitchProfile: (profile: IProfile) => void;
    onEditProfile: () => void;
    onCreateProfile: () => void;
}

export const ProfilePicker: React.FC<Props> = (props: Props) => {
    const dispatch = useDispatch();
    const [selectedProfileId, setSelectedProfileId] = useState<
        string | undefined
    >(props.initialProfile);

    const [fallback, setFallback] = useState<boolean>(false);
    const [showLeftIndicator, setShowLeftIndicator] = useState<boolean>(false);
    const [showRightIndicator, setShowRightIndicator] =
        useState<boolean>(false);

    useEffect(() => {
        setSelectedProfileId(props.initialProfile);
    }, [props.initialProfile]);

    const handleSwitchProfileButton = (profile: IProfile) => {
        if (
            props.editingProfiles ||
            !profile.id ||
            selectedProfileId === profile.id
        ) {
            return;
        }
        setSelectedProfileId(profile.id);
        props.onSwitchProfile(profile);
        setShowRightIndicator(false);
        setShowLeftIndicator(false);
    };

    const renderAddProfile = () => {
        return (
            <CircleButton
                key='addProfile'
                size={64}
                style={styles.addProfileButton}
                onPress={props.onCreateProfile}
            >
                <MaterialIcons
                    name='add'
                    size={EStyleSheet.value('56rem')}
                    color='white'
                />
            </CircleButton>
        );
    };

    const renderSelectedProfileIndicator = () => {
        if (showRightIndicator) {
            return (
                <View style={styles.rightOffscreenIndicator}>
                    <MaterialIcons
                        name='arrow-right'
                        color='#FFF'
                        size={EStyleSheet.value('28rem')}
                    />
                </View>
            );
        } else if (showLeftIndicator) {
            return (
                <View style={styles.leftOffscreenIndicator}>
                    <MaterialIcons
                        name='arrow-left'
                        color='#FFF'
                        size={EStyleSheet.value('28rem')}
                    />
                </View>
            );
        }
    };

    const handleEditProfile = (profile: IProfile) => {
        dispatch(selectProfileForEditing(profile));
        props.onEditProfile();
    };

    const renderEditButton = (profile: IProfile) => {
        if (!props.editingProfiles || profile.id === 'default') return <></>;

        return (
            <View style={styles.deleteProfileButtonContainer}>
                <TouchableOpacity onPress={() => handleEditProfile(profile)}>
                    <View style={styles.deleteProfileButton}>
                        <MaterialIcons
                            name='edit'
                            style={styles.deleteProfileButtonIcon}
                            size={28}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    const renderProfile = (profile: IProfile) => {
        if (selectedProfileId === profile.id) {
            return (
                <CircleButton
                    key={profile.id}
                    size={64}
                    style={styles.profileButton}
                    invertAnimation={true}
                    onPress={() => handleSwitchProfileButton(profile)}
                >
                    {fallback ||
                    !profile.pfp ||
                    profile.pfp === constants.DEFAULT_PFP_ID ? (
                        <Text style={styles.profileButtonLabel}>
                            {profile.name.length > 2
                                ? profile.name.slice(0, 2)
                                : profile.name}
                        </Text>
                    ) : (
                        <Image
                            style={styles.pfp}
                            resizeMode='contain'
                            source={{ uri: profile.pfp }}
                            onError={() => setFallback(true)}
                        />
                    )}
                    {renderEditButton(profile)}
                </CircleButton>
            );
        } else {
            return (
                <CircleButton
                    key={profile.id}
                    size={64}
                    style={styles.profileButton}
                    invertAnimation={selectedProfileId === profile.id}
                    onPress={() => handleSwitchProfileButton(profile)}
                >
                    {fallback ||
                    !profile.pfp ||
                    profile.pfp === constants.DEFAULT_PFP_ID ? (
                        <Text style={styles.profileButtonLabel}>
                            {profile.name.length > 2
                                ? profile.name.slice(0, 2)
                                : profile.name}
                        </Text>
                    ) : (
                        <Image
                            style={styles.pfp}
                            resizeMode='contain'
                            source={{ uri: profile.pfp }}
                            onError={() => setFallback(true)}
                        />
                    )}
                    {renderEditButton(profile)}
                </CircleButton>
            );
        }
    };

    const handleViewableItemsChanged = useRef(
        // Wrap in useRef to prevent errors during in-dev reloads.
        useCallback(
            ({
                changed,
                viewableItems,
            }: {
                changed: ViewToken[];
                viewableItems: ViewToken[];
            }) => {
                setSelectedProfileId((newSelectedProfileId) => {
                    const selectedViewToken: ViewToken | undefined =
                        changed.find((x) => x.key === newSelectedProfileId);
                    if (!selectedViewToken) {
                        return newSelectedProfileId;
                    }
                    if (
                        !selectedViewToken.isViewable &&
                        selectedViewToken.index !== null
                    ) {
                        const otherVisibleViewTokens: ViewToken[] =
                            viewableItems.filter(
                                (x) => x.key !== newSelectedProfileId
                            );
                        const visibleTokenCount = otherVisibleViewTokens.length;
                        const smallestVisibleIndex = Math.min(
                            ...otherVisibleViewTokens.map(
                                (token) => token.index || visibleTokenCount
                            )
                        );
                        const middleTokenIndex =
                            smallestVisibleIndex +
                            Math.round(visibleTokenCount / 2);
                        const leftOfCenterIndex = middleTokenIndex - 1;
                        const rightOfCenterIndex = middleTokenIndex + 1;
                        const selectedIndex = selectedViewToken.index;
                        if (selectedIndex <= leftOfCenterIndex) {
                            setShowRightIndicator(false);
                            setShowLeftIndicator(true);
                        } else if (selectedIndex >= rightOfCenterIndex) {
                            setShowRightIndicator(true);
                            setShowLeftIndicator(false);
                        } else {
                            setShowRightIndicator(true);
                            setShowLeftIndicator(true);
                        }
                        return newSelectedProfileId;
                    } else {
                        setShowRightIndicator(false);
                        setShowLeftIndicator(false);
                    }
                    return newSelectedProfileId;
                });
            },
            []
        )
    );

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    } as ViewabilityConfig);

    return (
        <>
            <FlatList
                data={props.profiles}
                ListHeaderComponent={renderAddProfile}
                renderItem={({ item }) => renderProfile(item)}
                keyExtractor={(item: IProfile) => item.id || 'UNKNOWN_PROFILE'}
                contentContainerStyle={styles.scrollContainer}
                viewabilityConfig={viewabilityConfig.current}
                onViewableItemsChanged={handleViewableItemsChanged.current}
                horizontal={true}
            />
            {renderSelectedProfileIndicator()}
        </>
    );
};

const styles = EStyleSheet.create({
    addProfileButton: {
        marginRight: '8rem',
        backgroundColor: '#E9C46A19',
        borderColor: '#F4A2617F',
        borderWidth: '1rem',
    },
    profileButton: {
        marginHorizontal: '8rem',
        backgroundColor: '#E9C46A19',
        borderColor: '#F4A2617F',
        borderWidth: '1rem',
        overflow: 'hidden',
        position: 'relative',
    },
    pfp: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    settingsButton: {
        backgroundColor: 'gray',
    },
    profileButtonLabel: {
        fontSize: '28rem',
        color: 'white',
        fontWeight: 'bold',
    },
    scrollContainer: {
        alignItems: 'center',
    },
    leftOffscreenIndicator: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: -16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightOffscreenIndicator: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: -16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteProfileButtonContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#00000080',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteProfileButton: {
        padding: '4rem',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#c24242',
        borderRadius: '32rem',
    },
    deleteProfileButtonIcon: {
        color: '#bdbdbd',
    },
});
