import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity,View, Image, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

//TouchableOpacity와 onPress={()=>this.props.navigation.toggleDrawer()}
// 추가 10.21

export default class MenuButton extends Component {
    render() {
        return (

            <View style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center', zIndex: 400, position: 'absolute', borderRadius: 30, top: 40, right: 10 }}>
                <TouchableOpacity
                    onPress={()=>this.props.navigation.toggleDrawer()}
                >
                    <Image
                        source={require('../../assets/images/menu-button.png')}
                        style={styles.ImageIconStyle}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    menuIcon: {
        zIndex: 300,
        position: 'absolute',
        top: 40,
        right: 20,
    },
    ImageIconStyle: {
        padding: 10,
        margin: 5,
        height: 25,
        width: 25,
        resizeMode: 'stretch',
    },

})