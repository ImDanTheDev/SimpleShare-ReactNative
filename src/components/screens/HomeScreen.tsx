import React, { createRef, useEffect, useRef, useState } from 'react';
import {
    Animated,
    LayoutChangeEvent,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
    Navigation,
    NavigationFunctionComponent,
    OptionsModalPresentationStyle,
} from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { RootState } from '../../redux/store';
import { ComponentId as SendShareScreenComponentId } from './SendShareScreen';
import { ComponentId as AccountSettingsScreenComponetId } from './AccountSettingsScreen';
import { ComponentId as ViewShareScreenComponentId } from './ViewShareScreen';
import { ComponentId as NewProfileSheetComponentId } from '../sheets/NewProfileSheet';
import { CircleButton } from '../common/CircleButton';
import { ProfilePicker } from '../ProfilePicker';
import { InboxGallery } from '../InboxGallery';
import { OutboxList } from '../OutboxList';
import { SettingsDropdown } from '../SettingsDropdown';
import { pushToast } from '../../redux/toasterSlice';
import {
    clearOutbox,
    constants,
    IProfile,
    IPublicGeneralInfo,
    IShare,
    OutboxEntry,
    signOut,
    switchProfile,
} from 'simpleshare-common';

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
}

const HomeScreen: NavigationFunctionComponent<Props> = (props: Props) => {
    const MAX_PROFILES = 5;

    const dispatch = useDispatch();

    const publicGeneralInfo: IPublicGeneralInfo | undefined = useSelector(
        (state: RootState) => state.user.publicGeneralInfo
    );

    const profiles: IProfile[] = useSelector(
        (state: RootState) => state.profiles.profiles
    );

    const shares: IShare[] = useSelector(
        (state: RootState) => state.shares.shares
    );

    const outboxEntries: OutboxEntry[] = useSelector(
        (state: RootState) => state.outbox.shares
    );

    const currentProfile: IProfile | undefined = useSelector(
        (state: RootState) =>
            state.profiles.profiles.find(
                (profile) => profile.id === state.profiles.currentProfileId
            )
    );

    const settingsButtonContainer = createRef<View>();
    const blurOpacity = useRef(new Animated.Value(0)).current;
    const blurRequests = useRef<number>(0);
    const [shouldShowBlur, setShouldShowBlur] = useState<boolean>(false);
    const [blurVisibility, setBlurVisibility] = useState<boolean>(false);
    const [settingsDropdownVisibility, setSettingsDropdownVisibility] =
        useState<boolean>(false);
    const [settingsDropdownTop, setSettingsDropdownTop] = useState<number>(0);
    const [settingsDropdownRight, setSettingsDropdownRight] =
        useState<number>(0);
    const [editingProfiles, setEditingProfiles] = useState<boolean>(false);

    useEffect(() => {
        if (shouldShowBlur) {
            setBlurVisibility(true);
        }
        Animated.timing(blurOpacity, {
            toValue: shouldShowBlur ? 1 : 0,
            duration: 150,
            useNativeDriver: false,
        }).start(() => setBlurVisibility(shouldShowBlur));
    }, [blurOpacity, shouldShowBlur]);

    const requestBlur = () => {
        blurRequests.current = blurRequests.current + 1;
        if (blurRequests.current > 0) {
            setShouldShowBlur(true);
        }
    };

    const dismissBlur = (force?: boolean) => {
        blurRequests.current = blurRequests.current - 1;
        if (blurRequests.current <= 0 || force) {
            setShouldShowBlur(false);
            blurRequests.current = 0;
        }
    };

    const handleSignOut = async () => {
        dismissBlur(true);
        dispatch(signOut());
    };

    const handleCreateProfileButton = async () => {
        if (profiles.length >= MAX_PROFILES) {
            dispatch(
                pushToast({
                    message: 'You may only have 5 profiles.',
                    type: 'info',
                    duration: 5,
                })
            );
            return;
        }

        requestBlur();

        await Navigation.showModal({
            component: {
                name: NewProfileSheetComponentId,
                options: {
                    modalPresentationStyle:
                        OptionsModalPresentationStyle.overCurrentContext,
                },
                passProps: {
                    onDismiss: () => {
                        dismissBlur();
                    },
                },
            },
        });
    };

    const handleSwitchProfile = async (profile: IProfile) => {
        dispatch(switchProfile(profile));
    };

    const handleNewSharePress = async () => {
        await Navigation.push(props.componentId, {
            component: {
                name: SendShareScreenComponentId,
            },
        });
    };

    const handleSettingsButton = () => {
        requestBlur();
        setSettingsDropdownVisibility(!settingsDropdownVisibility);
    };

    const handleOpenAccountSettings = async () => {
        dismissBlur();
        setSettingsDropdownVisibility(false);
        await Navigation.push(props.componentId, {
            component: {
                name: AccountSettingsScreenComponetId,
            },
        });
    };

    const handleSettingsButtonLayout = (_e: LayoutChangeEvent) => {
        settingsButtonContainer.current?.measure(
            (x, _y, _width, height, _pageX, pageY) => {
                setSettingsDropdownRight(x + 32);
                setSettingsDropdownTop(pageY + height + 8);
            }
        );
    };

    const getInboxHeader = () => {
        if (!currentProfile) return '';

        let shortProfileName = currentProfile.name;
        if (shortProfileName.length > constants.MAX_PROFILE_NAME_LENGTH) {
            shortProfileName =
                shortProfileName.substring(
                    0,
                    constants.MAX_PROFILE_NAME_LENGTH
                ) + '...';
        }

        return `Inbox - ${shortProfileName} (${shares.length})`;
    };

    const handleCardViewPress = async (share: IShare) => {
        await Navigation.push(props.componentId, {
            component: {
                name: ViewShareScreenComponentId,
                passProps: {
                    share: share,
                },
            },
        });
    };

    const handleToggleEditMode = async () => {
        setSettingsDropdownVisibility(false);
        dismissBlur();
        setEditingProfiles(!editingProfiles);
    };

    const handleEditProfile = async () => {
        requestBlur();
        await Navigation.showModal({
            component: {
                name: NewProfileSheetComponentId,
                options: {
                    modalPresentationStyle:
                        OptionsModalPresentationStyle.overCurrentContext,
                },
                passProps: {
                    onDismiss: () => {
                        dismissBlur();
                    },
                },
            },
        });
    };

    const handleClearOutbox = () => {
        dispatch(clearOutbox());
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
                    <View style={styles.welcomeGroup}>
                        <Text style={styles.welcomeText}>Welcome</Text>
                        <Text style={styles.welcomeUserName}>
                            {publicGeneralInfo?.displayName || 'Unknown User'}
                        </Text>
                    </View>
                    <View
                        ref={settingsButtonContainer}
                        onLayout={handleSettingsButtonLayout}
                    >
                        <CircleButton
                            size={56}
                            style={styles.settingsButton}
                            onPress={handleSettingsButton}
                            invertAnimation={settingsDropdownVisibility}
                        >
                            <MaterialIcons
                                name={
                                    settingsDropdownVisibility
                                        ? 'keyboard-arrow-up'
                                        : 'settings'
                                }
                                color='#EAEAEA'
                                size={EStyleSheet.value(
                                    `${settingsDropdownVisibility ? 48 : 32}rem`
                                )}
                            />
                        </CircleButton>
                    </View>
                </View>

                <View style={styles.profileSection}>
                    <ProfilePicker
                        profiles={profiles}
                        initialProfile={currentProfile?.id}
                        editingProfiles={editingProfiles}
                        onEditProfile={handleEditProfile}
                        onSwitchProfile={handleSwitchProfile}
                        onCreateProfile={handleCreateProfileButton}
                    />
                </View>
                <MaskedView
                    style={styles.mask}
                    maskElement={
                        <View style={styles.maskElement}>
                            <LinearGradient
                                style={styles.maskGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 0.05 }}
                                colors={['#FFFFFF00', '#FFFFFFFF']}
                            />
                        </View>
                    }
                >
                    <ScrollView>
                        <Text style={styles.inboxHeader}>
                            {getInboxHeader()}
                        </Text>
                        <View style={styles.inboxSection}>
                            <InboxGallery
                                inbox={shares}
                                onCardViewPress={handleCardViewPress}
                            />
                        </View>
                        <View style={styles.outboxHeaderGroup}>
                            <Text style={styles.outboxHeader}>
                                Outbox ({outboxEntries.length})
                            </Text>
                            {outboxEntries.length > 0 ? (
                                <TouchableOpacity onPress={handleClearOutbox}>
                                    <Text style={styles.outboxClear}>
                                        Clear
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <></>
                            )}
                        </View>
                        <View style={styles.outboxSection}>
                            <OutboxList
                                outboxEntries={outboxEntries}
                                onNewShare={handleNewSharePress}
                            />
                        </View>
                    </ScrollView>
                </MaskedView>
            </LinearGradient>
            {blurVisibility ? (
                <Animated.View
                    style={{ ...styles.blurOverlay, opacity: blurOpacity }}
                />
            ) : (
                <></>
            )}
            {settingsDropdownVisibility ? (
                <SettingsDropdown
                    right={settingsDropdownRight}
                    top={settingsDropdownTop}
                    onOpenAccountSettings={handleOpenAccountSettings}
                    onToggleEditMode={handleToggleEditMode}
                    editingProfiles={editingProfiles}
                    onSignOut={handleSignOut}
                    onDismiss={() => {
                        dismissBlur();
                        setSettingsDropdownVisibility(false);
                    }}
                />
            ) : (
                <></>
            )}
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
        marginHorizontal: '16rem',
        marginVertical: '8rem',
        padding: '8rem',
        height: '72rem',
        flexDirection: 'row',
    },
    welcomeGroup: {
        flex: 1,
        justifyContent: 'space-between',
    },
    welcomeText: {
        fontSize: '20rem',
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
    /* Header Mask */
    mask: {
        flex: 1,
    },
    maskElement: {
        backgroundColor: 'transparent',
        flex: 1,
    },
    maskGradient: {
        flex: 1,
    },
    /* Profile */
    profileSection: {
        marginHorizontal: '16rem',
        marginVertical: '8rem',
        paddingHorizontal: '8rem',
        paddingVertical: '0rem',
        height: '82rem',
    },
    /* Inbox */
    inboxHeader: {
        fontSize: '20rem',
        color: '#FFF',
        marginHorizontal: '16rem',
        paddingHorizontal: '8rem',
        marginTop: '12rem',
    },
    inboxSection: {
        marginBottom: '16rem',
    },
    /* Outbox */
    outboxHeaderGroup: {
        marginHorizontal: '16rem',
        paddingHorizontal: '8rem',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    outboxHeader: {
        color: '#FFF',
        fontSize: '20rem',
    },
    outboxClear: {
        textDecorationLine: 'underline',
        color: '#BCBCBC',
        fontSize: '20rem',
    },
    outboxSection: {
        flex: 1,
        marginTop: '8rem',
        marginHorizontal: '16rem',
        paddingTop: '8rem',
        paddingHorizontal: '8rem',
    },
    /* Misc */
    blurOverlay: {
        backgroundColor: '#1520247F',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    flexFill: {
        flex: 1,
    },
});

export default HomeScreen;
export type { Props };
export const ComponentId = 'com.simpleshare.HomeScreen';
