import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class SplashScreen extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Splash</Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 40,
  }
});
