import React, { useEffect, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IShare from '../api/IShare';

export interface Props {
    share: IShare;
    width: number;
    index: number;
    galleryPosition: number;
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

        setScale(lerp(minCardScale, maxCardScale, clampedDistance));
        setBorderWidth(lerp(minBorderWidth, maxBorderWidth, clampedDistance));
        setElevation(lerp(minElevation, maxElevation, clampedDistance));
    }, [props.galleryPosition, props.index, props.width]);

    const lerp = (a: number, b: number, t: number): number => {
        return a * (1 - t) + b * t;
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
                    From: {props.share.fromUid.slice(0, 10)} [
                    {props.share.fromProfileId.slice(0, 7)}]
                </Text>
                <Text style={styles.textContent} numberOfLines={6}>
                    {props.share.content}
                </Text>
                <View style={styles.flexSpacer} />
                <View style={styles.actionBar}>
                    <TouchableOpacity
                        style={styles.moreButton}
                        onPress={() => {
                            console.log('wip');
                        }}
                    >
                        <MaterialIcons
                            name={'more-horiz'}
                            size={28}
                            color='#FFF'
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.viewButton}
                        onPress={() => {
                            console.log('wip');
                        }}
                    >
                        <Text style={styles.viewButtonLabel}>View</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
            height: 2,
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
        fontSize: 18,
    },
    noPreviewReasonText: {
        color: '#AD7466',
        fontSize: 14,
    },
    body: {
        padding: '8rem',
        flexGrow: 1,
    },
    sender: {
        fontSize: 14,
        color: '#BBBBBB',
    },
    textContent: {
        fontSize: 18,
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
        borderWidth: 1,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewButton: {
        backgroundColor: '#1A2633',
        width: '50%',
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    moreButtonIcon: {},
    viewButtonLabel: {
        fontSize: 20,
        color: '#FFF',
        textAlignVertical: 'center',
    },
});
