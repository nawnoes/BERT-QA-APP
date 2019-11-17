import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  findNodeHandle,
  TextInput,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { BlurView } from 'expo-blur';
import MenuButton from '../Components/MenuButton'
import { Button, Icon } from 'react-native-elements';



export default class ExplainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewRef: null,
      visibleModal: false,
      context: null,
      question: null,
      answer: null,
      predict: null,
    };
  }
  render() {
    return (
      <ImageBackground
        source={require('../../assets/images/bert_wallpaper.jpg')}
        style={styles.IBcontainer}>
        <MenuButton navigation={this.props.navigation} />

        <BlurView
          style={styles.absolute}
          blurType="light"
          intensity={80}
        />
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <View style={styles.header}>
              <Text style={styles.header_text2}>System</Text>
            </View>
            <View style={styles.body}>
              <BlurView
                style={styles.context}
                intensity={100}
              >
                <Text style={styles.title}> Architecture</Text>
                <Image
                  style={{
                    width: "100%",
                    height: "100%",
                    flex: 2,
                    resizeMode: 'contain',
                    // backgroundColor:'green',
                  }}
                  source={require('../../assets/images/ADFK_system.png')}
                />
                <TextInput
                  style={styles.textInput}
                  onChangeText={context => this.setState({ context })}
                  placeholder="Context를 입력해주세요."
                  value="전체적인 시스템 구조는 클라이언트, 중개 서버, Bert 서버로 나뉜다. 클라이언트는 React Native, 중개서버에는 Nodejs 기반의 Express, MongoDB를 사용해 개발. BERT 서버는 Flask를 이용해서 BERT 서비스 제공"
                  multiline={true}
                  editable={false}
                />
              </BlurView>
              <BlurView
              style={styles.context}
              intensity={100}
            >
              <Text style={styles.title}> React Native</Text>
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  flex: 2,
                  resizeMode: 'contain',
                  // backgroundColor:'green',
                }}
                source={require('../../assets/images/react-native.png')}
              />
              <TextInput
                style={styles.textInput}
                onChangeText={context => this.setState({ context })}
                placeholder="Context를 입력해주세요."
                value="React Native는 React 기반의 크로스 플랫폼 앱 개발 도구로, 한번 작성한 React Native 코드로 Android와 IOS에서 모두 동작"
                multiline={true}
                editable={false}
              />
            </BlurView>
            <BlurView
              style={styles.context}
              intensity={100}
            >
              <Text style={styles.title}> BERT</Text>
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  flex: 2,
                  resizeMode: 'contain',
                  // backgroundColor:'green',
                }}
                source={require('../../assets/images/fine_tuning.png')}
              />
              <TextInput
                style={styles.textInput}
                onChangeText={context => this.setState({ context })}
                placeholder="Context를 입력해주세요."
                value="BERT는 Deep Learning 기반의 언어모델. Transformer의 encoder 부분만을 이용하여, pre-training을 통해 모델 학습.  pre-training된 모델에 마지막 레이어를 추가하여, 목적에 맞는 새로운 모델 fine-tuning으로 사용가능"
                multiline={true}
                editable={false}
              />
            </BlurView>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>

    );
  }
}

const styles = StyleSheet.create({
  IBcontainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    flex: 1,
    marginLeft: 25,
    marginTop: 30,
    marginBottom: 10,
    justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'gray', 

  },
  body: {
    flex: 10,
    margin: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'gray', 

  },
  context: {
    height: 300,
    margin: 10,
    // padding:10,
    borderRadius: 10,
    // alignItems: 'center',
    // justifyContent:'center'
    // backgroundColor: 'purple',
  },
  question: {
    height: 80,
    margin: 10,
    // padding:10,
    borderRadius: 10,
    // alignItems: 'center',
    // backgroundColor: 'purple',
  },
  answer: {
    flex: 4,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    // backgroundColor: 'purple',
  },
  textInput: {
    flex: 1,
    // paddingLeft:3,
    // paddingRight:3,
    // height: 100, 
    // width: "100%",
    fontSize: 15,
    margin: 5,
    autoCompleteType: 'off',
    autoCorrect: false,
    // backgroundColor: 'red',
  },
  modal_text_input: {
    flex: 1,
    // paddingLeft:3,
    // paddingRight:3,
    // height: 100, 
    // width: "100%",
    fontSize: 15,
    margin: 5,
    autoCompleteType: 'off',
    autoCorrect: false,
    // backgroundColor: 'red',
  },
  foot: {
    flex: 3,
    zIndex: 9,
    margin: 10,
    // justifyContent: 'center',
    alignItems: 'center',

  },
  h1: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  title: {
    height: 22,
    fontWeight: '700',
    fontSize: 18,
    color: 'black',
    marginTop: 3,
    marginLeft: 3,
    // backgroundColor:'black',
    // zIndex:100,
    // alignItems: 'flex-end',
  },
  title_a: {
    height: 22,
    fontWeight: '700',
    fontSize: 18,
    color: 'black',
    marginTop: 3,
    marginLeft: 3,
    // backgroundColor:'black',
    // zIndex:100,
    // alignItems: 'flex-end',
  },
  header_text: {
    textShadowOffset: { width: 10, height: 10 },
    color: 'black',
    fontSize: 50,
    marginLeft: -10,
    fontWeight: '800',
  },
  header_text2: {
    textShadowOffset: { width: 10, height: 10 },
    color: 'black',
    fontSize: 55,
    marginLeft: -10,
    marginTop: -20,
    fontWeight: '900',
  },
  header_text3: {
    textShadowOffset: { width: 10, height: 10 },
    color: 'black',
    fontSize: 26,
    marginLeft: -10,
    marginTop: -30,
    fontWeight: '900',

  },
  modal_text: {
    textShadowOffset: { width: 10, height: 10 },
    color: 'black',
    fontSize: 26,
    marginLeftRight: 10,
    marginTop: 30,
    fontWeight: '900',
    fontStyle: '',
    backgroundColor: '#fcc436'
  },
  modalContent: {
    height: 600,
    width: 300,
    backdropOpacity: 10,
    backgroundColor: 'white',
    padding: 22,
    // justifyContent: 'center',
    // alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  button: {
    flex: 1,

  },
});
