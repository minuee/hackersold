import React from 'react';
import {
    Text,AsyncStorage
} from 'react-native';
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import LoginScreen from './LoginScreen';
import IntroScreen from '../IntroScreen';
import HomeScreen from './HomeScreen';
import SettingScreen from './SettingScreen';
import BlueScreen from './BlueScreen';
import SpeechScreen from './SpeechScreen';
import VoiceScreen from './VoiceScreen';

import RNExitApp from "react-native-exit-app";

const HomeStack = createStackNavigator(
    {
        HomeScreen
    },
    // if you need.
    // recommend custom header
    {
        defaultNavigationOptions: ({navigation}) => ({
            title: 'Hackers React Native APP',
        }),
    }
);
const SettingStack = createStackNavigator(
    {
        SettingScreen,
        BlueScreen
    },
    {
        defaultNavigationOptions: ({navigation}) => ({
            title: 'Setting',
        }),
        initialRouteName: 'SettingScreen',
    }
);


const TabNavigator = createBottomTabNavigator(
    {
        Home: HomeStack,
        Setting: SettingStack,
    },
    {
        defaultNavigationOptions: ({navigation}) => ({
            tabBarIcon: ({focused, horizontal, tintColor}) => {
                const {routeName} = navigation.state;
                let icon = "▲";

                if(routeName === 'Home'){
                    icon = "🌈";
                } else if(routeName === 'Setting'){
                    icon = "🌙"
                }

                // can use react-native-vector-icons
                // <Icon name={iconName} size={iconSize} color={iconColor} />
                return <Text style={{color: focused && "#46c3ad" || "#888"}}>{icon}</Text>
            }
        }),
        lazy: false,
        tabBarOptions: {
            activeTintColor: "#46c3ad",
            inactiveTintColor: "#888",
        },
    }
);

const AppStack = createStackNavigator(
    {
        LoginScreen: LoginScreen,
        TabNavigator: {
            screen: TabNavigator,
            navigationOptions: ({navigation}) => ({
                header: null,
            }),
        },
        HomeScreen: HomeScreen,
        SpeechScreen: SpeechScreen,
        VoiceScreen: VoiceScreen
    }
);

export default createAppContainer(AppStack);