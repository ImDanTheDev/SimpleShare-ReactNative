import React from 'react';
import {
  Text,
  View,
} from 'react-native';

interface Props {
  /** react-native-navigation component id. */
  componentId: string
}

const WelcomeScreen = () => {
  return (
    <View>
      <Text>Simple Share</Text>
    </View>
  );
};

export default WelcomeScreen;
export type { Props };
export const ComponentId = 'com.simpleshare.WelcomeScreen';