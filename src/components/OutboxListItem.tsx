import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { constants, OutboxEntry } from 'simpleshare-common';
import { download } from '../download-helper';
import { pushToast } from '../redux/toasterSlice';
import RNFS from 'react-native-fs';
import { RNErrorCode, RNSimpleShareError } from '../RNSimpleShareError';
import { useDispatch } from 'react-redux';

export interface Props {
    entry: OutboxEntry;
}

export const OutboxListItem: React.FC<Props> = (props: Props) => {
    const dispatch = useDispatch();
    const [fallback, setFallback] = useState<boolean>(false);

    const handleDownload = async () => {
        if (props.entry.share.fileURL) {
            const fileName = decodeURIComponent(props.entry.share.fileURL)
                .split('/')
                .pop()
                ?.split('#')[0]
                .split('?')[0];
            try {
                await download(
                    props.entry.share.fileURL,
                    fileName || `${new Date().getUTCMilliseconds()}`
                );
                dispatch(
                    pushToast({
                        duration: 5,
                        message: `File downloaded to: ${RNFS.DownloadDirectoryPath}/${fileName}`,
                        type: 'info',
                    })
                );
            } catch (e) {
                if (
                    e instanceof RNSimpleShareError &&
                    e.code === RNErrorCode.PERMISSION_DENIED
                ) {
                    dispatch(
                        pushToast({
                            duration: 5,
                            message: 'Permission to save file was denied.',
                            type: 'warn',
                        })
                    );
                } else {
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
            }
        }
    };

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
                        <TouchableOpacity onPress={handleDownload}>
                            <Text style={styles.downloadLink}>Download</Text>
                        </TouchableOpacity>
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
    downloadLink: {
        fontSize: '14rem',
        color: '#54a3e4',
        textAlignVertical: 'center',
        fontStyle: 'italic',
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
