import React from 'react';
import { Platform, Dimensions } from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import ExplainScreen from '../screens/ExplainScreen';

import MenuDrawer from '../Components/MenuDrawer'

const WIDTH = Dimensions.get('window').width;

const DrawerConfig = {
    drawerWidth: WIDTH * 0.73,
    drawerPosition: 'right',
    drawerBackgroundColor: 'white',
    contentComponent:({navigation}) =>{
        return(<MenuDrawer navigation={navigation}/>)
    },
    
}



const DrawerNavigator = createDrawerNavigator(
    {
        Home: {
            screen: HomeScreen
        },
        Explain: {
            screen: ExplainScreen
        },
        
    },
    DrawerConfig,
)

export default DrawerNavigator;