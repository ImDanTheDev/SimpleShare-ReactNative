import Clipboard from '@react-native-clipboard/clipboard';
import React, { createRef, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Image,
    LayoutChangeEvent,
    PermissionsAndroid,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { constants, deleteCloudShare, IShare } from 'simpleshare-common';
import { CardDropdown } from './CardDropdown';
import { CircleButton } from './common/CircleButton';
import RNFS from 'react-native-fs';
import { pushToast } from '../redux/toasterSlice';

export interface Props {
    share: IShare;
    width: number;
    index: number;
    galleryPosition: number;
    onViewPress: (share: IShare) => void;
}

export const InboxCard: React.FC<Props> = (props: Props) => {
    const dispatch = useDispatch();

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
    const [fallback, setFallback] = useState<boolean>(false);

    const goingAway = useRef<boolean>(false);

    useEffect(() => {
        goingAway.current = false;
        return () => {
            goingAway.current = true;
        };
    }, []);

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
        Clipboard.setString(props.share.textContent || '');
        setShouldShowBlur(false);
        setDropdownVisibility(false);
    };

    const handleDeleteCard = async () => {
        dispatch(deleteCloudShare(props.share));
        setShouldShowBlur(false);
        setDropdownVisibility(false);
    };

    const handleDownloadFile = async () => {
        setShouldShowBlur(false);
        setDropdownVisibility(false);
        if (props.share.fileURL) {
            const fileName = decodeURIComponent(props.share.fileURL)
                .split('/')
                .pop()
                ?.split('#')[0]
                .split('?')[0];
            try {
                let permissionGranted = false;
                if (Platform.OS === 'android') {
                    const writeGranted = await PermissionsAndroid.request(
                        'android.permission.WRITE_EXTERNAL_STORAGE',
                        {
                            title: 'Simple Share Permission',
                            message:
                                'Simple Share needs access to save files to your device.',
                            buttonPositive: 'OK',
                            buttonNegative: 'Cancel',
                            buttonNeutral: 'Ask Me Later',
                        }
                    );
                    const readGranted = await PermissionsAndroid.request(
                        'android.permission.READ_EXTERNAL_STORAGE',
                        {
                            title: 'Simple Share Permission',
                            message:
                                'Simple Share needs access to save files to your device.',
                            buttonPositive: 'OK',
                            buttonNegative: 'Cancel',
                            buttonNeutral: 'Ask Me Later',
                        }
                    );
                    permissionGranted =
                        (writeGranted === 'granted' ||
                            writeGranted === 'never_ask_again') &&
                        (readGranted === 'granted' ||
                            readGranted === 'never_ask_again');
                }
                if (permissionGranted) {
                    const fileDestination = `${RNFS.DownloadDirectoryPath}/${fileName}`;
                    await RNFS.writeFile(fileDestination, '');
                    await RNFS.downloadFile({
                        fromUrl: props.share.fileURL,
                        toFile: fileDestination,
                    }).promise;
                    dispatch(
                        pushToast({
                            duration: 5,
                            message: `File downloaded to: ${RNFS.DownloadDirectoryPath}/${fileName}`,
                            type: 'info',
                        })
                    );
                } else {
                    dispatch(
                        pushToast({
                            duration: 5,
                            message: 'Permission to save file was denied.',
                            type: 'warn',
                        })
                    );
                }
            } catch (e) {
                dispatch(
                    pushToast({
                        duration: 5,
                        message:
                            'An error occurred while downloading the file.',
                        type: 'error',
                    })
                );
                console.error(e);
            }
        } else {
            dispatch(
                pushToast({
                    duration: 5,
                    message: 'This share does not have a file.',
                    type: 'info',
                })
            );
        }
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
            {props.share.fileURL && (
                <View
                    style={
                        fallback
                            ? styles.noPreviewContainer
                            : styles.previewContainer
                    }
                >
                    {!fallback ? (
                        <Image
                            style={styles.previewImage}
                            source={{
                                uri: props.share.fileURL,
                            }}
                            resizeMode='contain'
                            onError={() => setFallback(true)}
                        />
                    ) : (
                        <View style={styles.noPreview}>
                            <Text style={styles.noPreviewText}>
                                Preview Not Available
                            </Text>
                        </View>
                    )}
                </View>
            )}
            <View style={styles.body}>
                <Text style={styles.sender}>
                    From:{' '}
                    {props.share.fromDisplayName
                        ? props.share.fromDisplayName.slice(
                              0,
                              constants.MAX_DISPLAY_NAME_LENGTH
                          )
                        : 'Unknown User'}{' '}
                    [
                    {props.share.fromProfileName
                        ? props.share.fromProfileName.slice(
                              0,
                              constants.MAX_PROFILE_NAME_LENGTH
                          )
                        : 'Unknown Profile'}
                    ]
                </Text>
                {props.share.textContent ? (
                    <Text style={styles.textContent} numberOfLines={6}>
                        {props.share.textContent}
                    </Text>
                ) : (
                    <Text style={styles.noTextContent} numberOfLines={6}>
                        No Text
                    </Text>
                )}
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
                    onCopyText={
                        props.share.textContent ? handleCopyCardText : undefined
                    }
                    onDelete={handleDeleteCard}
                    onDownloadFile={
                        props.share.fileURL ? handleDownloadFile : undefined
                    }
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
    previewContainer: {
        backgroundColor: '#1A2633',
        borderTopLeftRadius: '16rem',
        borderTopRightRadius: '16rem',
        alignItems: 'center',
        justifyContent: 'center',
        height: '40%',
        overflow: 'hidden',
    },
    noPreviewContainer: {
        backgroundColor: '#1A2633',
        borderTopLeftRadius: '16rem',
        borderTopRightRadius: '16rem',
        alignItems: 'center',
        justifyContent: 'center',
        height: '15%',
        overflow: 'hidden',
    },
    noPreview: {
        alignItems: 'center',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    noPreviewText: {
        color: '#979797',
        fontWeight: 'bold',
        fontSize: '18rem',
        padding: '8rem',
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
    noTextContent: {
        fontSize: '18rem',
        color: '#BBBBBB',
        fontStyle: 'italic',
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
