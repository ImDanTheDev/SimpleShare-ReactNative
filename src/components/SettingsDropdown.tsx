import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export interface Props {
    onSignOut: () => void;
    onOpenAccountSettings: () => void;
    onToggleEditMode: () => void;
    editingProfiles: boolean;
    onDismiss: () => void;
    right: number;
    top: number;
}

export const SettingsDropdown: React.FC<Props> = (props: Props) => {
    return (
        <View style={styles.fullscreenOverlay}>
            <TouchableOpacity
                style={styles.dismissOverlay}
                onPress={props.onDismiss}
            />
            <View
                style={{
                    ...styles.dropdown,
                    right: props.right,
                    top: props.top,
                }}
            >
                <TouchableOpacity
                    style={styles.item}
                    onPress={props.onToggleEditMode}
                >
                    <MaterialIcons
                        name='edit'
                        color='#FFF'
                        size={EStyleSheet.value('42rem')}
                    />
                    <Text style={styles.itemLabel}>
                        {props.editingProfiles ? 'Stop' : 'Start'} Editing
                        Profiles
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.item}
                    onPress={props.onOpenAccountSettings}
                >
                    <MaterialIcons
                        name='account-circle'
                        color='#FFF'
                        size={EStyleSheet.value('42rem')}
                    />
                    <Text style={styles.itemLabel}>Account Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item} onPress={props.onSignOut}>
                    <MaterialIcons
                        name='exit-to-app'
                        color='#E76F51'
                        size={EStyleSheet.value('42rem')}
                    />
                    <Text style={styles.itemLabel}>Sign Out</Text>
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
        width: '65%',
        position: 'absolute',
        elevation: 8,
        backgroundColor: '#0D161F',
        borderRadius: '16rem',
        paddingTop: '8rem',
        paddingHorizontal: '8rem',
    },
    item: {
        height: '50rem',
        borderRadius: '16rem',
        backgroundColor: '#2a4355',
        borderColor: '#F4A2617F',
        borderWidth: '1rem',
        paddingHorizontal: '8rem',
        marginBottom: '8rem',
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemLabel: {
        fontSize: '16rem',
        padding: '8rem',
        color: '#FFF',
    },
});
