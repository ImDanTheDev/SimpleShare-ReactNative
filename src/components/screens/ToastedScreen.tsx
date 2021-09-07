import React, { ReactNode, useEffect } from 'react';
import { Dimensions, Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Swipeable } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import {
    ageToast,
    dismissToast,
    IToast,
    setTimer,
} from '../../redux/toasterSlice';
export type ToastType = 'info' | 'warn' | 'error';

interface Props {
    children: ReactNode;
}

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

export const ToastedScreen: React.FC<Props> = (props: Props) => {
    const dispatch = useDispatch();
    const toasts: IToast[] = useSelector(
        (state: RootState) => state.toaster.toasts
    );

    useEffect(() => {
        toasts.forEach((toast) => {
            if (toast.id === undefined) {
                console.log('Invalid toast, removing...');
                if (toast.timer) {
                    clearInterval(toast.timer);
                    console.log('Cleared timer interval.');
                }
                console.log('Dismissing toast.');
                dispatch(dismissToast(toast));
                return;
            }
            if (!toast.timer) {
                // This is a new toast without a timer.
                // Create the timer.
                const timer: NodeJS.Timer = setInterval(() => {
                    dispatch(ageToast(toast));
                }, 1000);

                dispatch(setTimer({ id: toast.id, timer: timer }));
            } else {
                // This toast has a timer.
                if (toast.duration <= 0) {
                    // This toast has expired.
                    // Cancel timer and remove toast.
                    console.log('Toast has expired, removing...');
                    if (toast.timer) {
                        clearInterval(toast.timer);
                        console.log('Clearer timer interval.');
                    }
                    console.log('Dismissing toast.');
                    dispatch(dismissToast(toast));
                } else {
                    // This toast is still fresh.
                }
            }
        });
    }, [dispatch, toasts]);

    const getToastIcon = (toast: IToast) => {
        switch (toast.type) {
            case 'info':
                return (
                    <MaterialIcons
                        style={styles.icon}
                        name='info-outline'
                        size={EStyleSheet.value('32rem')}
                        color='#2A9D8F'
                    />
                );
            case 'warn':
                return (
                    <MaterialIcons
                        style={styles.icon}
                        name='warning'
                        size={EStyleSheet.value('32rem')}
                        color='#E9C46A'
                    />
                );
            case 'error':
                return (
                    <MaterialIcons
                        style={styles.icon}
                        name='error-outline'
                        size={EStyleSheet.value('32rem')}
                        color='#E76F51'
                    />
                );
            default:
                return (
                    <MaterialIcons
                        style={styles.icon}
                        name='error-outline'
                        size={EStyleSheet.value('32rem')}
                        color='#E76F51'
                    />
                );
        }
    };

    const renderAction = () => {
        return <View style={styles.action} />;
    };

    const handleSwipableOpen = (toast: IToast) => {
        console.log('Manually dismissing toast...');
        if (toast.timer) {
            clearInterval(toast.timer);
            console.log('Cleared timer interval.');
        }
        console.log('Dismissing toast.');
        dispatch(dismissToast(toast));
    };

    const renderToasts = (): ReactNode => {
        const result: ReactNode[] = [];

        toasts.forEach((toast) => {
            result.push(
                <Swipeable
                    key={toast.id}
                    containerStyle={styles.swipableContainer}
                    childrenContainerStyle={styles.swipableChildren}
                    renderLeftActions={renderAction}
                    renderRightActions={renderAction}
                    onSwipeableOpen={() => handleSwipableOpen(toast)}
                    leftThreshold={entireScreenWidth / 3}
                >
                    <View style={styles.toast}>
                        <View style={styles.iconGroup}>
                            {getToastIcon(toast)}
                            <Text style={styles.countdownText}>
                                {toast.duration}s
                            </Text>
                        </View>
                        <Text
                            style={styles.text}
                            textBreakStrategy='highQuality'
                        >
                            {toast.message}
                        </Text>
                    </View>
                </Swipeable>
            );
        });

        return result;
    };

    return (
        <View style={styles.toastedScreen}>
            <View style={styles.childScreen}>{props.children}</View>
            <View style={styles.toastList}>{renderToasts()}</View>
        </View>
    );
};

const styles = EStyleSheet.create({
    toastedScreen: {
        flex: 1,
    },
    childScreen: {
        flex: 1,
    },
    toastList: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 6,
    },
    swipableContainer: {},
    swipableChildren: {},
    action: { flex: 1 },
    toast: {
        marginHorizontal: '24rem',
        marginBottom: '16rem',
        padding: '8rem',
        backgroundColor: '#0D161F',
        borderRadius: '16rem',
        borderColor: '#F4A2617F',
        borderWidth: '2rem',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: '2rem',
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconGroup: {
        marginRight: '5rem',
        paddingRight: '4rem',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRightWidth: '1rem',
        borderRightColor: '#454545',
    },
    icon: {
        flex: 1,
    },
    countdownText: {
        color: '#BDBDBD',
        fontSize: '14rem',
        textAlign: 'center',
    },
    text: {
        flexShrink: 1,
        color: '#FFF',
        fontSize: '14rem',
    },
});
