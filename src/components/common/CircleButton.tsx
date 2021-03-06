import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    ImageStyle,
    LayoutChangeEvent,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export interface Props {
    size: number;
    invertAnimation?: boolean;
    /** `elevation` is not supported. https://github.com/facebook/react-native/issues/26544 */
    style?: ViewStyle | TextStyle | ImageStyle;
    children?: React.ReactNode;
    onPress?: () => void;
    onLongPress?: () => void;
    onLayout?: (e: LayoutChangeEvent) => void;
}

export const CircleButton: React.FC<Props> = (props: Props) => {
    const activeRadiusSize = EStyleSheet.value('rem') * (props.size / 4);
    const inactiveRadiusSize = EStyleSheet.value('rem') * (props.size / 2);
    const radiusAnimationDuration = 25;

    const animatedBorderRadius = useRef(
        new Animated.Value(
            props.invertAnimation ? activeRadiusSize : inactiveRadiusSize
        )
    ).current;

    const [borderRadius, setBorderRadius] =
        useState<number>(inactiveRadiusSize);
    const [active, setActive] = useState<boolean>(false);

    useEffect(() => {
        const listener = animatedBorderRadius.addListener((c) =>
            setBorderRadius(c.value)
        );
        return () => {
            animatedBorderRadius.removeListener(listener);
        };
    }, [animatedBorderRadius]);

    useEffect(() => {
        // Update the border radius animation when the inverted state changes.
        try {
            animatedBorderRadius.setValue(
                props.invertAnimation ? activeRadiusSize : inactiveRadiusSize
            );
        } catch (e) {}
    }, [
        props.invertAnimation,
        activeRadiusSize,
        inactiveRadiusSize,
        animatedBorderRadius,
    ]);

    const handlePressIn = () => {
        setActive(!active);

        Animated.timing(animatedBorderRadius, {
            toValue: props.invertAnimation
                ? inactiveRadiusSize
                : activeRadiusSize,
            duration: radiusAnimationDuration,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.timing(animatedBorderRadius, {
            toValue: props.invertAnimation
                ? activeRadiusSize
                : inactiveRadiusSize,
            duration: radiusAnimationDuration,
            useNativeDriver: true,
        }).start();
    };

    const styles = EStyleSheet.create({
        button: {
            ...props.style,
            width: `${props.size}rem`,
            height: `${props.size}rem`,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    return (
        <View onLayout={props.onLayout}>
            <TouchableOpacity
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={props.onPress}
                onLongPress={props.onLongPress}
                style={{
                    ...styles.button,
                    borderRadius: borderRadius,
                    borderWidth: EStyleSheet.value(
                        `${
                            props.invertAnimation
                                ? styles.button.borderWidth + 2
                                : styles.button.borderWidth
                        }rem`
                    ),
                }}
                activeOpacity={1.0}
            >
                {props.children}
            </TouchableOpacity>
        </View>
    );
};
