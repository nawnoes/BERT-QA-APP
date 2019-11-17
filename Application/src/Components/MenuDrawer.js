import React, { Component } from 'react';
import {
    StyleSheet,
    Platform,
    Dimensions,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    Image,
} from 'react-native';
import {Divider} from 'react-native-elements'
import BertButton from '../Components/BertButton';


import { Ionicons } from '@expo/vector-icons';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;


export default class MenuDrawer extends Component {

    navLink(nav, text) {
        return (
            <TouchableOpacity onPress={() => { this.props.navigation.navigate(nav) }}>
                <Text style={styles.link}>{text}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <BertButton/>
                    <Text style={{color: 'black',fontSize:32,fontWeight:'900', marginTop:-12}}>BERT</Text>
                    <Text style={{color: 'black',fontSize:13,fontWeight:'500'}}>React Native와 BERT를 이용한</Text>
                    <Text style={{color: 'black',fontSize:13,fontWeight:'500', marginTop:-5}}>MRC 시스템</Text>


                </View>
                <Divider style={{ marginLeft:10, marginRight:10,height: 0.5,backgroundColor: '#424242' }}/>
                <View style={styles.body}>
                    {this.navLink('Explain', 'System')}
                    {this.navLink('Home', 'MRC')}
                </View>
                <View style={styles.footer}>
                    <Text>ADFK version 1.0</Text>
                </View>

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fcc436',

    },
    header:{
        height: 200,
        backgroundColor: '#ffc228',
        alignItems: 'center',
        justifyContent: 'center',        
    },
    body:{
        flex:8,
        backgroundColor: '#ffd15e'
    },
    footer:{
        flex:1,
        backgroundColor:'#fcc436',
        paddingLeft: 4,
        margin: 5,
    },
    link: {
        fontSize: 18,
        fontWeight:'400',
        padding: 6,
        paddingLeft: 8,
        marginTop: 2,
        textAlign: 'left'
    }
})