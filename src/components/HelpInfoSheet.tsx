import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
    Navigation,
    NavigationFunctionComponent,
} from 'react-native-navigation';

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
    header: string;
    info: string;
    dismissable: boolean;
    dismissText?: string;
    confirmText?: string;
    confirmable: boolean;
    onDismiss?: () => void;
    onConfirm?: () => void;
}

export const HelpInfoSheet: NavigationFunctionComponent<Props> = (
    props: Props
) => {
    const handleDismiss = async () => {
        props.onDismiss?.();
        await Navigation.dismissModal(props.componentId);
    };

    const handleConfirm = async () => {
        props.onConfirm?.();
        await Navigation.dismissModal(props.componentId);
    };

    return (
        <View style={styles.overlay}>
            <TouchableOpacity
                style={styles.dismissOverlay}
                onPress={handleDismiss}
            />
            <View style={styles.modal}>
                <Text style={styles.headerText}>{props.header}</Text>
                <Text style={styles.infoText}>{props.info}</Text>
                <View style={styles.actionGroup}>
                    {props.dismissable ? (
                        <TouchableOpacity
                            style={styles.dismissButton}
                            onPress={handleDismiss}
                        >
                            <Text style={styles.actionButtonLabel}>
                                {props.dismissText}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <></>
                    )}
                    {props.confirmable ? (
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={handleConfirm}
                        >
                            <Text style={styles.actionButtonLabel}>
                                {props.confirmText}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <></>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = EStyleSheet.create({
    overlay: {
        flex: 1,
        flexDirection: 'column-reverse',
    },
    dismissOverlay: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
    },
    modal: {
        height: '200rem',
        marginHorizontal: '16rem',
        padding: '16rem',
        backgroundColor: '#0D161F',
        borderTopLeftRadius: '16rem',
        borderTopRightRadius: '16rem',
        borderColor: '#F4A2617F',
        borderTopWidth: '2rem',
        borderLeftWidth: '2rem',
        borderRightWidth: '2rem',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: '2rem',
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 6,
    },
    headerText: {
        fontSize: '22rem',
        color: '#FFF',
        textAlign: 'center',
        paddingBottom: '16rem',
    },
    infoText: {
        color: '#FFF',
        fontSize: '14rem',
        flex: 1,
    },
    actionGroup: {
        flexDirection: 'row',
        marginTop: '16rem',
    },
    dismissButton: {
        backgroundColor: '#1A2633',
        flex: 1,
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: '1rem',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '16rem',
    },
    confirmButton: {
        backgroundColor: '#1A2633',
        flex: 1,
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: '1rem',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtonLabel: {
        fontSize: '20rem',
        color: '#FFF',
        textAlignVertical: 'center',
        paddingVertical: '4rem',
    },
});

export default HelpInfoSheet;
export type { Props };
export const ComponentId = 'com.simpleshare.HelpInfoSheet';
