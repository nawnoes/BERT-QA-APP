import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {
  createDrawerNavigator,
  createSwitchNavigator,
  createAppContainer,
} from 'react-navigation';

import EntryScreen from '../screens/entryScreen';
import DrawerNavigator from './DrawNavigator';


const SwitchContainer = createSwitchNavigator(
  {
    Entry: EntryScreen,
    Main: DrawerNavigator,
  },
  {
    initialRouteName: 'Entry',
  },
);

export default createAppContainer(SwitchContainer);