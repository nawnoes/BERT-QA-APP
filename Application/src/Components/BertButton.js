import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';

export default class BertButton extends Component {
    render() {
        return (
            <TouchableOpacity
                style={styles.button}
                onPress={this.props.onPress}>
                <Image
                    style={styles.image}
                    source={require('../../assets/images/bert_face.gif')}
                />
                
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        width:"100%",
        // height:120,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        shadowOffset:{width: 3,height: 3},
        shadawColor:'black',
        shadowOpacity: 0.7,
        
        // borderRadius: 5,
        // backgroundColor: '#2e2c2e'
      },
    image:{
        width:120,
        height:120,
        borderRadius:60,
        borderWidth:3,
        borderColor:'#424242'
    }
})