import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { IProfile, IPublicGeneralInfo, IShare } from 'simpleshare-common';
import { getPublicGeneralInfo } from '../api/AccountAPI';
import { getProfile } from '../api/ProfileAPI';

export interface Props {
    share: IShare;
}

export const OutboxListItem: React.FC<Props> = (props: Props) => {
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
                    await getPublicGeneralInfo(props.share.toUid);
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
                    props.share.toUid,
                    props.share.toProfileId
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

    return (
        <View style={styles.item}>
            <View style={styles.picture}>
                <Text style={styles.pictureText}>PFP</Text>
            </View>
            <View style={styles.body}>
                <Text style={styles.recipient}>
                    To: {displayName.slice(0, 15)} [{profileName.slice(0, 7)}]
                </Text>
                <Text style={styles.fileName}>File: No File</Text>
                <Text style={styles.textContent}>{props.share.content}</Text>
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
    picture: {
        borderRadius: '16rem',
        height: '100%',
        aspectRatio: 1,
        backgroundColor: '#1A2633',
        marginRight: '8rem',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pictureText: {
        color: '#FFF',
        fontSize: '28rem',
    },
    body: {
        flexDirection: 'column',
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
});
