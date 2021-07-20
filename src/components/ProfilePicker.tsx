import React, { useCallback, useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ViewabilityConfig,
    ViewToken,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { FlatList } from 'react-native-gesture-handler';
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

    const [showLeftIndicator, setShowLeftIndicator] = useState<boolean>(false);
    const [showRightIndicator, setShowRightIndicator] =
        useState<boolean>(false);

    const handleSwitchProfileButton = (profile: IProfile) => {
        if (!profile.id || selectedProfileId === profile.id) {
            console.log(
                'Selected profile is invalid or same as current profile.'
            );
            return;
        }
        setSelectedProfileId(profile.id);
        props.onSwitchProfile(profile.id);
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
                <MaterialIcons name='add' size={56} color='white' />
            </CircleButton>
        );
    };

    const renderSelectedProfileIndicator = () => {
        if (showRightIndicator) {
            return (
                <View style={styles.rightOffscreenIndicator}>
                    <MaterialIcons name='arrow-right' color='#FFF' size={28} />
                </View>
            );
        } else if (showLeftIndicator) {
            return (
                <View style={styles.leftOffscreenIndicator}>
                    <MaterialIcons name='arrow-left' color='#FFF' size={28} />
                </View>
            );
        }
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
                    <Text style={styles.profileButtonLabel}>
                        {profile.name.length > 2
                            ? profile.name.slice(0, 2)
                            : profile.name}
                    </Text>
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
                    <Text style={styles.profileButtonLabel}>
                        {profile.name.length > 2
                            ? profile.name.slice(0, 2)
                            : profile.name}
                    </Text>
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
    // Disable 'any' check for auto-complete in EStyleSheet.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as StyleSheet.NamedStyles<any>);
