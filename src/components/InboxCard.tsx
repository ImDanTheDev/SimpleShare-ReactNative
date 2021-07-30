import Clipboard from '@react-native-clipboard/clipboard';
import React, { createRef, useEffect, useRef, useState } from 'react';
import {
    Animated,
    LayoutChangeEvent,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getPublicGeneralInfo } from '../api/AccountAPI';
import IProfile from '../api/IProfile';
import IPublicGeneralInfo from '../api/IPublicGeneralInfo';
import IShare from '../api/IShare';
import { getProfile } from '../api/ProfileAPI';
import { deleteShare } from '../api/ShareAPI';
import { MAX_DISPLAY_NAME_LENGTH, MAX_PROFILE_NAME_LENGTH } from '../constants';
import { CardDropdown } from './CardDropdown';
import { CircleButton } from './CircleButton';

export interface Props {
    share: IShare;
    width: number;
    index: number;
    galleryPosition: number;
    onViewPress: (share: IShare) => void;
}

export const InboxCard: React.FC<Props> = (props: Props) => {
    const minCardScale = 0.8;
    const maxCardScale = 1.0;
    const minBorderWidth = 1;
    const maxBorderWidth = 2;
    const minElevation = 2;
    const maxElevation = 6;

    const [scale, setScale] = useState<number>(maxCardScale);
    const [borderWidth, setBorderWidth] = useState<number>(minBorderWidth);
    const [elevation, setElevation] = useState<number>(minElevation);

    const moreButtonContainer = createRef<View>();
    const [dropdownVisibility, setDropdownVisibility] =
        useState<boolean>(false);
    const [dropdownBottom, setDropdownBottom] = useState<number>(0);
    const [dropdownLeft, setDropdownLeft] = useState<number>(0);
    const blurOpacity = useRef(new Animated.Value(0)).current;
    const [shouldShowBlur, setShouldShowBlur] = useState<boolean>(false);
    const [blueVisibility, setBlurVisibility] = useState<boolean>(false);

    const [profileName, setProfileName] = useState<string>('');
    const [displayName, setDisplayName] = useState<string>('');

    const goingAway = useRef<boolean>(false);

    useEffect(() => {
        goingAway.current = false;
        return () => {
            goingAway.current = true;
        };
    }, []);

    useEffect(() => {
        const fetchDisplayName = async () => {
            try {
                const publicGeneralInfo: IPublicGeneralInfo | undefined =
                    await getPublicGeneralInfo(props.share.fromUid);
                if (goingAway.current) return;
                setDisplayName(
                    publicGeneralInfo?.displayName || 'Unknown User'
                );
            } catch {
                if (goingAway.current) return;
                setDisplayName('Unknown User');
            }
        };

        const fetchProfileName = async () => {
            try {
                const profile: IProfile | undefined = await getProfile(
                    props.share.fromUid,
                    props.share.fromProfileId
                );
                if (goingAway.current) return;
                setProfileName(profile?.name || 'Unknown Profile');
            } catch {
                if (goingAway.current) return;
                setProfileName('Unknown Profile');
            }
        };

        fetchDisplayName();
        fetchProfileName();
    }, [props.share]);

    useEffect(() => {
        if (shouldShowBlur) {
            if (goingAway.current) return;
            setBlurVisibility(true);
        }
        Animated.timing(blurOpacity, {
            toValue: shouldShowBlur ? 1 : 0,
            duration: 150,
            useNativeDriver: false,
        }).start(() => {
            if (goingAway.current) return;
            setBlurVisibility(shouldShowBlur);
        });
    }, [shouldShowBlur, blurOpacity]);

    useEffect(() => {
        // Position in gallery when card should appear the largest.
        const positionWhenLargest = props.index * props.width;

        // Distance to positionWhenLargest remapped to range of 0-1.
        const clampedDistance = Math.min(
            Math.max(
                1 -
                    Math.abs(
                        (props.galleryPosition - positionWhenLargest) /
                            props.width
                    ),
                0
            ),
            1
        );

        if (goingAway.current) return;
        setScale(lerp(minCardScale, maxCardScale, clampedDistance));
        setBorderWidth(lerp(minBorderWidth, maxBorderWidth, clampedDistance));
        setElevation(lerp(minElevation, maxElevation, clampedDistance));
    }, [props.galleryPosition, props.index, props.width]);

    const lerp = (a: number, b: number, t: number): number => {
        return a * (1 - t) + b * t;
    };

    const handleViewButton = async () => {
        props.onViewPress(props.share);
    };

    const handleMoreButtonlayout = (_e: LayoutChangeEvent) => {
        moreButtonContainer.current?.measure(
            (x, y, _width, height, _pageX, _pageY) => {
                if (goingAway.current) return;
                setDropdownLeft(x);
                setDropdownBottom(y + height + 8);
            }
        );
    };

    const handleMoreButton = () => {
        setShouldShowBlur(true);
        setDropdownVisibility(true);
    };

    const handleCopyCardText = () => {
        Clipboard.setString(props.share.content);
        setShouldShowBlur(false);
        setDropdownVisibility(false);
    };

    const handleDeleteCard = async () => {
        await deleteShare(props.share);
        setShouldShowBlur(false);
        setDropdownVisibility(false);
    };

    return (
        <Animated.View
            style={{
                ...styles.card,
                width: props.width,
                transform: [{ scale: scale }],
                borderWidth: borderWidth,
                elevation: elevation,
            }}
        >
            <View style={styles.preview}>
                {false ? (
                    <Text style={styles.previewImage}>Preview</Text>
                ) : (
                    <View style={styles.noPreview}>
                        <Text style={styles.noPreviewReasonText}>No File</Text>
                        <Text style={styles.noPreviewText}>
                            Preview Not Available
                        </Text>
                    </View>
                )}
            </View>
            <View style={styles.body}>
                <Text style={styles.sender}>
                    From: {displayName.slice(0, MAX_DISPLAY_NAME_LENGTH)} [
                    {profileName.slice(0, MAX_PROFILE_NAME_LENGTH)}]
                </Text>
                <Text style={styles.textContent} numberOfLines={6}>
                    {props.share.content}
                </Text>
                <View style={styles.flexSpacer} />
                <View style={styles.actionBar}>
                    <View
                        ref={moreButtonContainer}
                        onLayout={handleMoreButtonlayout}
                    >
                        <CircleButton
                            size={32}
                            style={styles.moreButton}
                            onPress={handleMoreButton}
                            invertAnimation={dropdownVisibility}
                        >
                            <MaterialIcons
                                name={'more-horiz'}
                                size={EStyleSheet.value('28rem')}
                                color='#FFF'
                            />
                        </CircleButton>
                    </View>
                    <TouchableOpacity
                        style={styles.viewButton}
                        onPress={handleViewButton}
                    >
                        <Text style={styles.viewButtonLabel}>View</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {blueVisibility ? (
                <Animated.View
                    style={{ ...styles.blurOverlay, opacity: blurOpacity }}
                />
            ) : (
                <></>
            )}
            {dropdownVisibility ? (
                <CardDropdown
                    left={dropdownLeft}
                    bottom={dropdownBottom}
                    onCopyText={handleCopyCardText}
                    onDelete={handleDeleteCard}
                    onDismiss={() => {
                        setShouldShowBlur(false);
                        setDropdownVisibility(false);
                    }}
                />
            ) : (
                <></>
            )}
        </Animated.View>
    );
};
const styles = EStyleSheet.create({
    card: {
        backgroundColor: '#0D161F',
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: '2rem',
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
    },
    preview: {
        backgroundColor: '#1A2633',
        height: '40%',
        borderTopLeftRadius: '16rem',
        borderTopRightRadius: '16rem',
        alignItems: 'center',
        justifyContent: 'center',
    },
    noPreview: {
        alignItems: 'center',
    },
    noPreviewText: {
        color: '#979797',
        fontWeight: 'bold',
        fontSize: '18rem',
    },
    noPreviewReasonText: {
        color: '#AD7466',
        fontSize: '14rem',
    },
    body: {
        padding: '8rem',
        flexGrow: 1,
    },
    sender: {
        fontSize: '14rem',
        color: '#BBBBBB',
    },
    textContent: {
        fontSize: '18rem',
        color: '#FFF',
    },
    fileName: {
        color: '#FFF',
    },
    flexSpacer: { flexGrow: 1 },
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    moreButton: {
        backgroundColor: '#1A2633',
        width: '32rem',
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: '1rem',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewButton: {
        backgroundColor: '#1A2633',
        width: '50%',
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: '1rem',
        justifyContent: 'center',
        alignItems: 'center',
    },
    moreButtonIcon: {},
    viewButtonLabel: {
        fontSize: '20rem',
        color: '#FFF',
        textAlignVertical: 'center',
    },
    blurOverlay: {
        backgroundColor: '#1520247F',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        borderRadius: 16,
    },
});
