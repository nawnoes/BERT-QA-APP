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
  Platform,
  Image,
} from 'react-native';
import { BlurView } from 'expo-blur';

import SendButton from '../Components/BertButton';
import MenuButton from '../Components/MenuButton';
import { Button, Icon } from 'react-native-elements';
import Modal from 'react-native-modal';


const WIDTH = Dimensions.get('window').width;



export default class HomeScreen extends Component {
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
  requestAnswer = () => {
    fetch('http://localhost:9909/api/bert/qa/post', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context: this.state.context,
        question: this.state.question,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // alert('get responseJson and modal open')
        // alert(JSON.stringify(responseJson))
        let parse_json = responseJson['result'][1]['1']
        let result_obj = {
          no1: null,
          no2: null,
          no3: null,
          no4: null,
          no5: null,

        }
        var cnt = 0
        for (obj in result_obj) {
          console.log('!!: ', JSON.stringify(parse_json[cnt]['text']) + " " + JSON.stringify(parse_json[cnt]['probability']))
          console.log('obj: ', obj)
          result_obj[obj] = {
            text: parse_json[cnt]['text'],
            probability: parse_json[cnt]['probability']
          }
          cnt++;
        }
        // alert('result_obj:'+JSON.stringify(result_obj))

        this.setState({ visibleModal: true, predict: result_obj })
      })
      .catch((error) => {
        console.error(error);
      })
  }
  requestQAdata = () => {
    fetch('http://localhost:39009/data/random/qa')
      .then((response) => response.json())
      .then((responseJson) => {
        //responseJson[0]['context'] 컨텍스트
        //responseJson[0]['question'] 질문
        this.setState({
          context: responseJson[0]['context'],
          question: responseJson[0]['question'],
          answer: responseJson[0]['answer'],
        })
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      })
  }
  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );
  modalClose = () => {
    this.setState({ visibleModal: false, predict: null })
  }
  modalOpen = (answer) => {
    // alert('modalOpen: ',answer)
    this.setState({ visibleModal: true, predict: answer })
  }
  renderModalContent = () => (
    <View style={styles.modalContent}>
      <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', zIndex: 300, position: 'absolute', borderRadius: 30, backgroundColor: '#ffd15e', top: 10, right: 10 }}>
        <TouchableOpacity
          onPress={this.modalClose}
        >
          <Image
            source={require('../../assets/images/remove-symbol.png')}
            style={styles.ImageIconStyle2}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.modal_text}>Answer</Text>
      <TextInput
        style={styles.modal_text_input}
        onChangeText={predict => this.setState({ predict })}
        multiline={true}
      >

        {this.state.predict ? <Text >1위. {JSON.stringify(this.state.predict.no1.text)}{"\n"}       Probability: {JSON.stringify(this.state.predict.no1.probability.toPrecision(3))} {"\n"}</Text> : null}
        {this.state.predict ? <Text >2위. {JSON.stringify(this.state.predict.no2.text)}{"\n"}       Probability: {JSON.stringify(this.state.predict.no2.probability.toPrecision(3))} {"\n"}</Text> : null}
        {this.state.predict ? <Text >3위. {JSON.stringify(this.state.predict.no3.text)}{"\n"}       Probability: {JSON.stringify(this.state.predict.no3.probability.toPrecision(3))} {"\n"}</Text> : null}
        {this.state.predict ? <Text >4위. {JSON.stringify(this.state.predict.no4.text)}{"\n"}       Probability: {JSON.stringify(this.state.predict.no4.probability.toPrecision(3))} {"\n"}</Text> : null}
        {this.state.predict ? <Text >5위. {JSON.stringify(this.state.predict.no5.text)}{"\n"}       Probability: {JSON.stringify(this.state.predict.no5.probability.toPrecision(3))} {"\n"}</Text> : null}

      </TextInput>

    </View>
  );
  pressRequestButton = () => {
    // alert('press Request Button')
    // answer = this.requestAnswer()
    this.requestAnswer()

  }

  imageLoaded() {
    this.setState({ viewRef: findNodeHandle(this.backgroundImage) });
  }
  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.navigate('MainScreen');
    }, 5000);
  }
  componentWillUnmount() {
    clearTimeout();
  }
  render() {
    return (
      <ImageBackground
        source={require('../../assets/images/bert_wallpaper.jpg')}
        style={styles.IBcontainer}>
        <MenuButton navigation={this.props.navigation} />
        <Modal
          isVisible={this.state.visibleModal}
          backdropColor={'#ffd15e'}
          backdropOpacity={1}
          animationIn={'zoomInDown'}
          animationOut={'zoomOutUp'}
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}
          style={{ alignSelf: 'center' }}
        >
          {this.renderModalContent()}
        </Modal>
        <BlurView
          style={styles.absolute}
          blurType="light"
          intensity={80}
        />
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.header_text}>BERT</Text>
            <Text style={styles.header_text2}>MRC</Text>
            <View style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center', zIndex: 300, position: 'absolute', borderRadius: 30, backgroundColor: '#fcc436', top: 40, right: 10 }}>
              <TouchableOpacity
                onPress={this.requestQAdata}
              >
                <Image
                  source={require('../../assets/images/reload-arrow.png')}
                  style={styles.ImageIconStyle}
                />
              </TouchableOpacity>
            </View>
          </View>
          <BlurView
            style={styles.context}
            intensity={100}
          >
            <Text style={styles.title}> Context</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={context => this.setState({ context })}
              placeholder="Context를 입력해주세요."
              value={this.state.context}
              multiline={true}
            />
          </BlurView>
          <BlurView
            style={styles.question}
            intensity={100}
          >
            <Text style={styles.title_a}> Question</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={question => this.setState({ question })}
              placeholder="질문을 입력해주세요."
              value={this.state.question}
              multiline={true}

            />
          </BlurView>
          <View style={styles.foot}>
            <Button
              icon={<Icon
                name='puzzle-piece'
                type='font-awesome'
              />}
              title="Request"
              onPress={this.pressRequestButton}
              titleStyle={{ color: 'black', marginLeft: 5 }}
              buttonStyle={{ backgroundColor: '#fcc436' }}
              containerStyle={{ width: '100%', height: '100%', justifyContent: 'flex-end' }}
            />
          </View>
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
  context: {
    height: 290,
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
  ImageIconStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
  },
  ImageIconStyle2: {
    padding: 10,
    margin: 5,
    height: 20,
    width: 20,
    resizeMode: 'stretch',
  },
});
