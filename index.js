import { Navigation } from 'react-native-navigation';
import WelcomeScreen, { ComponentId as WelcomeScreenComponentId } from './src/WelcomeScreen';

Navigation.registerComponent(WelcomeScreenComponentId, () => WelcomeScreen);
Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            stack: {
                children: [
                    {
                        component: {
                            name: WelcomeScreenComponentId
                        }
                    }
                ]
            }
        }
    });
});