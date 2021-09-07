import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, ViewStyle } from 'react-native';

interface Props {
    containerStyle?: ViewStyle;
    children: React.ReactNode;
}

const Spinner: React.FC<Props> = (props: Props) => {
    const spinnerRotationAnim = useRef(new Animated.Value(0)).current;

    const [spinnerRotation, setSpinnerRotation] =
        useState<Animated.AnimatedInterpolation>();

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinnerRotationAnim, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        setSpinnerRotation(
            spinnerRotationAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
            })
        );
    }, [spinnerRotationAnim]);

    return (
        <Animated.View
            style={{
                ...props.containerStyle,
                transform: [
                    {
                        rotate: spinnerRotation ? spinnerRotation : '0deg',
                    },
                ],
            }}
        >
            {props.children}
        </Animated.View>
    );
};

export default Spinner;
export type { Props };
