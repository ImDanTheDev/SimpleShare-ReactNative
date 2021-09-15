import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { constants, OutboxEntry } from 'simpleshare-common';

export interface Props {
    entry: OutboxEntry;
}

export const OutboxListItem: React.FC<Props> = (props: Props) => {
    const [fallback, setFallback] = useState<boolean>(false);

    return (
        <View style={styles.item}>
            <View style={styles.pictureBox}>
                {fallback || props.entry.pfpURL === constants.DEFAULT_PFP_ID ? (
                    <Text style={styles.pictureText}>
                        {props.entry.share.toProfileName &&
                        props.entry.share.toProfileName.length > 2
                            ? props.entry.share.toProfileName.slice(0, 2)
                            : props.entry.share.toProfileName}
                    </Text>
                ) : (
                    <Image
                        style={styles.pfp}
                        resizeMode='contain'
                        source={{ uri: props.entry.pfpURL }}
                        onError={() => setFallback(true)}
                    />
                )}
            </View>
            <View style={styles.body}>
                <View style={styles.infoGroup}>
                    <Text style={styles.infoLabel}>To: </Text>
                    <Text style={styles.infoValue}>
                        {props.entry.share.toDisplayName?.slice(0, 15)} [
                        {props.entry.share.toProfileName?.slice(0, 7)}]
                    </Text>
                </View>
                <View style={styles.infoGroup}>
                    <Text style={styles.infoLabel}>File: </Text>
                    {props.entry.share.fileURL ? (
                        <Text style={styles.infoValue}>
                            {props.entry.share.fileURL.slice(
                                props.entry.share.fileURL.length - 20
                            )}
                        </Text>
                    ) : (
                        <Text style={styles.infoNoValue}>No File</Text>
                    )}
                </View>
                {props.entry.share.textContent ? (
                    <Text style={styles.textContent}>
                        {props.entry.share.textContent}
                    </Text>
                ) : (
                    <Text style={styles.noTextContent}>No Text</Text>
                )}
            </View>
        </View>
    );
};

const styles = EStyleSheet.create({
    item: {
        backgroundColor: '#0D161F',
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: '1rem',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: '2rem',
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 2,
        flexDirection: 'row',
        padding: '8rem',
        height: '100rem',
        marginBottom: '8rem',
    },
    pictureBox: {
        borderRadius: '16rem',
        height: '100%',
        aspectRatio: 1,
        backgroundColor: '#1A2633',
        marginRight: '8rem',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    pfp: {
        flex: 1,
        width: '100%',
        height: '100%',
        margin: '8rem',
    },
    pictureText: {
        color: '#FFF',
        fontSize: '28rem',
    },
    body: {
        flexDirection: 'column',
    },
    infoGroup: {
        flexDirection: 'row',
    },
    infoLabel: {
        fontSize: '14rem',
        color: '#BBBBBB',
        textAlignVertical: 'center',
    },
    infoValue: {
        fontSize: '14rem',
        color: '#BBBBBB',
        textAlignVertical: 'center',
    },
    infoNoValue: {
        fontSize: '14rem',
        color: '#BBBBBB',
        textAlignVertical: 'center',
        fontStyle: 'italic',
    },
    recipient: {
        fontSize: '14rem',
        color: '#BBBBBB',
        textAlignVertical: 'center',
    },
    fileName: {
        fontSize: '14rem',
        color: '#BBBBBB',
        textAlignVertical: 'center',
    },
    textContent: {
        flex: 1,
        fontSize: '18rem',
        color: '#FFF',
    },
    noTextContent: {
        flex: 1,
        fontSize: '18rem',
        color: '#BBBBBB',
        fontStyle: 'italic',
    },
});
