import React, { createRef, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    LayoutChangeEvent,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
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
import { signOut } from '../api/AccountAPI';
import IProfile from '../api/IProfile';
import IShare from '../api/IShare';
import IUser from '../api/IUser';
import { switchShareListener } from '../api/ShareAPI';
import { setCurrentProfile } from '../redux/profilesSlice';
import { setShares } from '../redux/sharesSlice';
import { RootState } from '../redux/store';
import { ComponentId as SendShareScreenComponentId } from './SendShareScreen';
import { ComponentId as AccountSettingsScreenComponetId } from './AccountSettingsScreen';
import { ComponentId as ViewShareScreenComponentId } from './ViewShareScreen';
import { ComponentId as NewProfileSheetComponentId } from './NewProfileSheet';
import { CircleButton } from './CircleButton';
import { ProfilePicker } from './ProfilePicker';
import { InboxGallery } from './InboxGallery';
import { OutboxList } from './OutboxList';
import { SettingsDropdown } from './SettingsDropdown';
import { databaseService } from '../api/api';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
}

const HomeScreen: NavigationFunctionComponent<Props> = (props: Props) => {
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

    const settingsButtonContainer = createRef<View>();
    const blurOpacity = useRef(new Animated.Value(0)).current;
    const [shouldShowBlur, setShouldShowBlur] = useState<boolean>(false);
    const [blueVisibility, setBlurVisibility] = useState<boolean>(false);
    const [settingsDropdownVisibility, setSettingsDropdownVisibility] =
        useState<boolean>(false);
    const [settingsDropdownTop, setSettingsDropdownTop] = useState<number>(0);
    const [settingsDropdownRight, setSettingsDropdownRight] =
        useState<number>(0);

    useEffect(() => {
        if (shouldShowBlur) {
            setBlurVisibility(true);
        }
        Animated.timing(blurOpacity, {
            toValue: shouldShowBlur ? 1 : 0,
            duration: 150,
            useNativeDriver: false,
        }).start(() => setBlurVisibility(shouldShowBlur));
    }, [shouldShowBlur, blurOpacity]);

    useEffect(() => {
        if (!user) return; // TODO: We need a user for this page. Handle this error.
    }, [user]);

    useEffect(() => {
        if (!user) return; // TODO: We need a user for this page. Handle this error.

        const switchListener = async () => {
            if (!currentProfile || !currentProfile.id) return;
            console.log('Selected profile changed. Switching share listener.');
            await switchShareListener(user.uid, currentProfile.id);
        };
        switchListener();
    }, [currentProfile, user]);

    const handleSignOut = async () => {
        setShouldShowBlur(false);
        await databaseService.removeAllShareListeners();
        dispatch(setShares([]));
        await signOut();
    };

    const handleCreateProfileButton = async () => {
        setShouldShowBlur(true);

        await Navigation.showModal({
            component: {
                name: NewProfileSheetComponentId,
                options: {
                    modalPresentationStyle:
                        OptionsModalPresentationStyle.overCurrentContext,
                },
                passProps: {
                    onDismiss: () => {
                        setShouldShowBlur(false);
                    },
                },
            },
        });
    };

    const handleSwitchProfile = async (profileId: string) => {
        if (!user) {
            console.log('ERROR: Not signed in!');
            return;
        }
        dispatch(setShares([]));
        dispatch(setCurrentProfile(profileId));
    };

    const handleNewSharePress = async () => {
        await Navigation.push(props.componentId, {
            component: {
                name: SendShareScreenComponentId,
            },
        });
    };

    const handleSettingsButton = () => {
        setShouldShowBlur(true);
        setSettingsDropdownVisibility(!settingsDropdownVisibility);
    };

    const handleOpenAccountSettings = async () => {
        setShouldShowBlur(false);
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
        if (shortProfileName.length > 15) {
            shortProfileName = shortProfileName.substring(0, 15) + '...';
        }

        return `Inbox - ${shortProfileName} (${shares.length})`;
    };

    const handelCardViewPress = async (share: IShare) => {
        await Navigation.push(props.componentId, {
            component: {
                name: ViewShareScreenComponentId,
                passProps: {
                    share: share,
                },
            },
        });
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
                            {user?.displayName || 'Unknown User'}
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
                                size={settingsDropdownVisibility ? 48 : 32}
                            />
                        </CircleButton>
                    </View>
                </View>

                <View style={styles.profileSection}>
                    <ProfilePicker
                        profiles={profiles}
                        initialProfile={currentProfile?.id}
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
                                onCardViewPress={handelCardViewPress}
                            />
                        </View>
                        <Text style={styles.outboxHeader}>Outbox (0)</Text>
                        <View style={styles.outboxSection}>
                            <OutboxList
                                outbox={[]}
                                onNewShare={handleNewSharePress}
                            />
                        </View>
                    </ScrollView>
                </MaskedView>
            </LinearGradient>
            {blueVisibility ? (
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
                    onSignOut={handleSignOut}
                    onDismiss={() => {
                        setShouldShowBlur(false);
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
        fontSize: 20,
        color: '#FFF',
    },
    welcomeUserName: {
        fontSize: 28,
        color: '#FFF',
    },
    settingsButton: {
        backgroundColor: '#E9C46A19',
        borderColor: '#F4A2617F',
        borderWidth: 1,
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
        padding: '8rem',
        height: '112rem',
    },
    /* Inbox */
    inboxHeader: {
        fontSize: 20,
        color: '#FFF',
        marginHorizontal: 16,
        paddingHorizontal: 16,
        marginTop: 16,
    },
    inboxSection: {
        marginBottom: '16rem',
    },
    /* Outbox */
    outboxHeader: {
        fontSize: 20,
        color: '#FFF',
        marginHorizontal: 16,
        paddingHorizontal: 16,
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
    // Disable 'any' check for auto-complete in EStyleSheet.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as StyleSheet.NamedStyles<any>);

export default HomeScreen;
export type { Props };
export const ComponentId = 'com.simpleshare.HomeScreen';
