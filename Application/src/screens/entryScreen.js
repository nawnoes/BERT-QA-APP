import React, {Component} from 'react';
import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
// import { withNavigation } from 'react-navigation';

export default class EntryScreen extends Component {
  constructor(props) {
    super(props);
    this._moveMainScreen();
  }
  _moveMainScreen() {
    setTimeout(() => {
      this.props.navigation.navigate('Main');
    }, 3000);
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.h1}> TechLab2.0</Text>
        <Text style={styles.h2}> React Native와 BERT를 이용한</Text>
        <Text style={styles.h2}> MRC 시스템 </Text>
      </SafeAreaView>
    );
  }
}
// export default withNavigation(EntryScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fcc436',
  },
  h1: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom:20,
  },
  h2: {
    fontSize: 25,
    fontWeight: '600',
  },
});
