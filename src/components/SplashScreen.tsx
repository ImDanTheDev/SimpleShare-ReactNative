import React from 'react';
import { Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';

const SplashScreen: React.FC = () => {
    return (
        <LinearGradient
            colors={['#7f5a83', '#0d324d']}
            angle={50}
            useAngle={true}
            style={styles.backgroundGradient}
        >
            <Text style={styles.loadingText}>Loading</Text>
        </LinearGradient>
    );
};

const styles = EStyleSheet.create({
    backgroundGradient: {
        flex: 1,
        justifyContent: 'center',
    },
    loadingText: {
        color: '#BFBFBF',
        fontSize: '42rem',
        textAlign: 'center',
    },
});

export default SplashScreen;
