import React, { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IShare from '../api/IShare';
import { OutboxListItem } from './OutboxListItem';

export interface Props {
    outbox: IShare[];
    onNewShare: () => void;
}

export const OutboxList: React.FC<Props> = (props: Props) => {
    const renderShares = (): ReactNode[] => {
        const items: ReactNode[] = [];

        items.push(
            <TouchableOpacity
                style={styles.item}
                key={'addShare'}
                onPress={props.onNewShare}
            >
                <MaterialIcons
                    style={styles.icon}
                    name='add'
                    size={EStyleSheet.value('56rem')}
                    color='white'
                />
                <Text style={styles.textContent}>Send a new Share</Text>
            </TouchableOpacity>
        );

        if (props.outbox.length > 0) {
            items.push(
                props.outbox.map((share, i) => {
                    return <OutboxListItem key={i} share={share} />;
                })
            );
        } else {
            items.push(
                <Text style={styles.outboxEmptyText} key='emptyOutbox'>
                    Outbox Empty
                </Text>
            );
        }

        return items;
    };

    return <View>{renderShares()}</View>;
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
        height: '72rem',
        marginBottom: '8rem',
    },
    icon: {
        height: '100%',
        aspectRatio: 1,
        textAlignVertical: 'center',
    },
    body: {
        flexDirection: 'column',
    },
    recipient: {
        fontSize: '14rem',
        color: '#979797',
        textAlignVertical: 'center',
    },
    fileName: {
        fontSize: '14rem',
        color: '#979797',
        textAlignVertical: 'center',
    },
    textContent: {
        flex: 1,
        fontSize: '22rem',
        color: '#FFF',
        textAlignVertical: 'center',
    },
    outboxEmptyText: {
        color: '#BDBDBD',
        fontSize: '18rem',
        paddingTop: '16rem',
        alignSelf: 'center',
    },
});
