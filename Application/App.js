import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import SwitchNavigator from './src/navigation/SwitchNavigator'


export default function App() {
  return (
    <View style={styles.container}>
      <SwitchNavigator/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
