import React from 'react';
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import SampleScreen01 from "./SampleScreen01";
import SampleScreen02 from "./SampleScreen02";
import SampleScreen03 from "./SampleScreen03";

import {AsyncStorage} from "react-native";

const SampleTab01 = createStackNavigator({
    Intro: SampleScreen01,
    defaultNavigationOptions: ({navigation}) => ({
       headerMode: 'none',
        header: null,
    }),
});
const SampleTab02 = createStackNavigator({
    Blue : SampleScreen02,
    navigationOptions : ({navigation}) => ({
        headerMode: 'none',
        header: null,
    }),
});
const SampleTab03 = createStackNavigator({
    Auth : SampleScreen03,
    navigationOptions : ({navigation}) => ({
        headerMode: 'none',
        header: null,
    }),
});



const Tabs = createBottomTabNavigator({
        Sample01: SampleTab01,
        Sample02: SampleTab02,
        Sample03: SampleTab03
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: () => {
                const { routeName } = navigation.state;
                let tabName;
                if ( routeName === 'Sample01' ) {
                    tabName = 'user';
                }else if ( routeName === 'Sample02' ) {
                    tabName = 'gear';
                }else if ( routeName === 'Sample03' ) {
                    tabName = 'font';
                }else{
                    tabName = 'gear';
                }

                return <Icon name={tabName} size={20}  color='#888' />
            },
            headerMode: 'none'
        })
    });

export default createAppContainer(Tabs);
