import React, { PropsWithChildren } from 'react';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { NavigationComponentProps } from 'react-native-navigation';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../../redux/store';
import { AuthMeScreen } from './AuthMeScreen';
import SplashScreen from './SplashScreen';
import { ToastedScreen } from './ToastedScreen';

const BaseScreenComponentType = <T extends NavigationComponentProps>(
    Screen: React.FC<T>,
    requireUser: boolean,
    requireCompletedAccount: boolean
): React.ComponentType<T> => {
    return gestureHandlerRootHOC((props: PropsWithChildren<T>) => {
        return (
            <Provider store={store}>
                <PersistGate loading={<SplashScreen />} persistor={persistor}>
                    <ToastedScreen>
                        <AuthMeScreen
                            requireUser={requireUser}
                            requireCompleteAccount={requireCompletedAccount}
                        >
                            <Screen {...props} />
                        </AuthMeScreen>
                    </ToastedScreen>
                </PersistGate>
            </Provider>
        );
    });
};

export default BaseScreenComponentType;
