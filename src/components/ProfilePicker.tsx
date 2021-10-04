import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Text, View, ViewabilityConfig, ViewToken } from 'react-native';
import DraggableFlatList, {
    DragEndParams,
    RenderItemParams,
} from 'react-native-draggable-flatlist';
import EStyleSheet from 'react-native-extended-stylesheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import {
    constants,
    IProfile,
    selectProfileForEditing,
    updateAccount,
} from 'simpleshare-common';
import { RootState } from '../redux/store';
import { CircleButton } from './common/CircleButton';

export interface Props {
    initialProfile?: string;
    editingProfiles: boolean;
    onSwitchProfile: (profile: IProfile) => void;
    onEditProfile: () => void;
    onCreateProfile: () => void;
}

export const ProfilePicker: React.FC<Props> = (props: Props) => {
    const dispatch = useDispatch();

    const publicGeneralInfo = useSelector(
        (state: RootState) => state.user.publicGeneralInfo
    );

    const profiles: IProfile[] = useSelector(
        (state: RootState) => state.profiles.profiles
    );

    const [selectedProfileId, setSelectedProfileId] = useState<
        string | undefined
    >(props.initialProfile);

    const [fallback, setFallback] = useState<boolean>(false);
    const [showLeftIndicator, setShowLeftIndicator] = useState<boolean>(false);
    const [showRightIndicator, setShowRightIndicator] =
        useState<boolean>(false);

    const [tmpProfiles, setTmpProfiles] = useState<IProfile[]>([]);

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    } as ViewabilityConfig);

    useEffect(() => {
        setSelectedProfileId(props.initialProfile);
    }, [props.initialProfile]);

    useEffect(() => {
        setTmpProfiles(profiles);
    }, [profiles]);

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
        if (!props.editingProfiles) return <></>;

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

    const renderProfile = ({ item, drag }: RenderItemParams<IProfile>) => {
        if (selectedProfileId === item.id) {
            return (
                <CircleButton
                    key={item.id}
                    size={64}
                    style={
                        publicGeneralInfo?.defaultProfileId === item.id
                            ? styles.defaultProfileButton
                            : styles.profileButton
                    }
                    invertAnimation={true}
                    onPress={() => handleSwitchProfileButton(item)}
                    onLongPress={drag}
                >
                    {fallback ||
                    !item.pfp ||
                    item.pfp === constants.DEFAULT_PFP_ID ? (
                        <Text style={styles.profileButtonLabel}>
                            {item.name.length > 2
                                ? item.name.slice(0, 2)
                                : item.name}
                        </Text>
                    ) : (
                        <Image
                            style={styles.pfp}
                            resizeMode='contain'
                            source={{ uri: item.pfp }}
                            onError={() => setFallback(true)}
                        />
                    )}
                    {renderEditButton(item)}
                </CircleButton>
            );
        } else {
            return (
                <CircleButton
                    key={item.id}
                    size={64}
                    style={
                        publicGeneralInfo?.defaultProfileId === item.id
                            ? styles.defaultProfileButton
                            : styles.profileButton
                    }
                    invertAnimation={selectedProfileId === item.id}
                    onPress={() => handleSwitchProfileButton(item)}
                    onLongPress={drag}
                >
                    {fallback ||
                    !item.pfp ||
                    item.pfp === constants.DEFAULT_PFP_ID ? (
                        <Text style={styles.profileButtonLabel}>
                            {item.name.length > 2
                                ? item.name.slice(0, 2)
                                : item.name}
                        </Text>
                    ) : (
                        <Image
                            style={styles.pfp}
                            resizeMode='contain'
                            source={{ uri: item.pfp }}
                            onError={() => setFallback(true)}
                        />
                    )}
                    {renderEditButton(item)}
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

    const handleDragEnd = (params: DragEndParams<IProfile>) => {
        if (!publicGeneralInfo) return;
        setTmpProfiles(params.data);
        dispatch(
            updateAccount({
                publicGeneralInfo: {
                    ...publicGeneralInfo,
                    profilePositions: params.data.map((p) => p.id || ''),
                },
            })
        );
    };

    return (
        <>
            <DraggableFlatList
                data={tmpProfiles}
                ListHeaderComponent={renderAddProfile}
                renderItem={renderProfile}
                keyExtractor={(item: IProfile) => item.id || 'UNKNOWN_PROFILE'}
                contentContainerStyle={styles.scrollContainer}
                viewabilityConfig={viewabilityConfig.current}
                onViewableItemsChanged={handleViewableItemsChanged.current}
                onDragEnd={handleDragEnd}
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
    defaultProfileButton: {
        marginHorizontal: '8rem',
        backgroundColor: '#E9C46A19',
        borderColor: '#ee7b1ca1',
        borderWidth: '2rem',
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
