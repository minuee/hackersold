
import React from 'react';
import {createAppContainer} from 'react-navigation';

import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import FirstPage from '../Screens/MyPage/IntroScreen';
import SecondPage from '../Screens/Event/IntroScreen';
 
const TabScreen = createMaterialTopTabNavigator(
  {
    Home: { 
        screen: FirstPage,       
        tabStyle : {fontSize:5}, 
    },
    Settings: { 
        screen: SecondPage 
    },
    three: { 
        screen: SecondPage 
    },
    four: { 
        screen: SecondPage 
    },
    five: { 
        screen: SecondPage 
    },
  },
  {
    lazy: true,
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
        
        activeTintColor: '#ff0000',
        inactiveTintColor: '#fff',
        style: {
        backgroundColor: '#173f82',
        },
        labelStyle: {
        textAlign: 'center',
        },
        indicatorStyle: {
        borderBottomColor: '#fff',
        borderBottomWidth: 2,
        },
        header: null
    },
  }
);

 
//making a StackNavigator to export as default
const MainTopTabs2 = createStackNavigator({
  TabScreen: {
    screen: TabScreen,
    navigationOptions: {
        header: null,
    },
  },
});
export default createAppContainer(MainTopTabs2);

