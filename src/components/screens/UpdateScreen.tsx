import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationFunctionComponent } from 'react-native-navigation';

interface Props {
    /** react-native-navigation component id. */
    componentId: string;
}

const UpdateScreen: NavigationFunctionComponent<Props> = () => {
    return (
        <SafeAreaView style={styles.root}>
            <LinearGradient
                colors={['#7f5a83', '#0d324d']}
                angle={50}
                useAngle={true}
                style={styles.backgroundGradient}
            >
                <View style={styles.headerSection}>
                    <Text style={styles.welcomeText}>Out of Date</Text>
                </View>
                <View style={styles.messageContainer}>
                    <Text style={styles.message}>
                        You must update to the latest version to continue using
                        Simple Share.
                    </Text>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = EStyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#264653',
    },
    backgroundGradient: {
        flex: 1,
    },
    /* Header */
    headerSection: {
        paddingHorizontal: '24rem',
        height: '72rem',
        flexDirection: 'row',
        borderBottomWidth: '1rem',
        borderColor: '#0D161F7F',
        backgroundColor: '#0000001F',
        alignItems: 'center',
        justifyContent: 'center',
    },
    welcomeText: {
        fontSize: '28rem',
        color: '#FFF',
    },
    /* Body */
    messageContainer: {
        padding: '16rem',
    },
    message: {
        color: '#FFF',
        fontSize: '24rem',
        textAlign: 'center',
    },
});

export default UpdateScreen;
export type { Props };
export const ComponentId = 'com.simpleshare.UpdateScreen';
