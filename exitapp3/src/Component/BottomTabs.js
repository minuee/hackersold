import React from 'react';
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import IntroScreen from "../IntroScreen";
import LoginScreen from "../LoginScreen";
import BlueScreen from "../BlueScreen";

import {AsyncStorage} from "react-native";

const IntroTab = createStackNavigator({
    Intro: IntroScreen
});
const BlueTab = createStackNavigator({
    Blue : BlueScreen
});
const AuthTab = createStackNavigator({
    Auth : LoginScreen
});



const Tabs = createBottomTabNavigator({
        ETC: BlueTab,
        Home: IntroTab,
        Auth: AuthTab
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: () => {
                const { routeName } = navigation.state;
                let tabName;
                if ( routeName === 'Home' ) {
                    tabName = 'home';
                }else if ( routeName === 'ETC' ) {
                    tabName = 'grid';
                }else if ( routeName === 'Auth' ) {
                    tabName = 'login';
                }else{
                    tabName = 'options';
                }

                return <Icon name={tabName} size={20} />
            }
        })
    });

export default createAppContainer(Tabs);
