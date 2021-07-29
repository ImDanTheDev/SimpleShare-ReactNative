import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export interface Props {
    onCopyText: () => void;
    onDelete: () => void;
    onDismiss: () => void;
    left: number;
    bottom: number;
}

export const CardDropdown: React.FC<Props> = (props: Props) => {
    return (
        <View style={styles.fullscreenOverlay}>
            <TouchableOpacity
                style={styles.dismissOverlay}
                onPress={props.onDismiss}
            />
            <View
                style={{
                    ...styles.dropdown,
                    left: props.left,
                    bottom: props.bottom,
                }}
            >
                <TouchableOpacity
                    style={styles.item}
                    onPress={props.onCopyText}
                >
                    <MaterialIcons
                        name='content-copy'
                        color='#FFF'
                        size={EStyleSheet.value('24rem')}
                    />
                    <Text style={styles.itemLabel}>Copy Text</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item} onPress={props.onDelete}>
                    <MaterialIcons
                        name='delete-forever'
                        color='#E76F51'
                        size={EStyleSheet.value('24rem')}
                    />
                    <Text style={styles.itemLabel}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
const styles = EStyleSheet.create({
    fullscreenOverlay: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
    },
    dismissOverlay: {
        width: '100%',
        height: '100%',
    },
    dropdown: {
        width: '55%',
        position: 'absolute',
        borderRadius: '16rem',
        paddingTop: '8rem',
        paddingHorizontal: '8rem',
    },
    item: {
        height: '32rem',
        borderRadius: '16rem',
        backgroundColor: '#2a4355',
        borderColor: '#F4A2617F',
        borderWidth: '1rem',
        paddingHorizontal: '8rem',
        marginBottom: '8rem',
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
    },
    itemLabel: {
        fontSize: '12rem',
        paddingHorizontal: '4rem',
        color: '#FFF',
    },
});
