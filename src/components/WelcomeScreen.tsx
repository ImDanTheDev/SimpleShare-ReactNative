import React, { useEffect, useState } from 'react';
import {
  Button,
  Text,
  View,
} from 'react-native';
import { NavigationFunctionComponent } from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { increment } from '../counterSlice';
import { RootState } from '../store';

interface Props {
  /** react-native-navigation component id. */
  componentId: string
}

const WelcomeScreen: NavigationFunctionComponent<Props> = (props: Props) => {

  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  const incrementCounter = () => {
    dispatch(increment());
  }

  return (
    <View>
      <Text>Simple Share {count}</Text>
      <Button title='Increment' onPress={incrementCounter} />
    </View>
  );
};

export default WelcomeScreen;
export type { Props };
export const ComponentId = 'com.simpleshare.WelcomeScreen';