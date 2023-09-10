import React from 'react';
import {
    Text,AsyncStorage
} from 'react-native';
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';


const AppStack = createStackNavigator(
    {
        LoginScreen: LoginScreen,
        HomeScreen: HomeScreen
    }
);

export default createAppContainer(AppStack);
