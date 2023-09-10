import React from 'react';
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import SampleScreen01 from "./Tabs/SampleScreen01";
import SampleScreen02 from "./Tabs//SampleScreen02";
import SampleScreen03 from "./Tabs//SampleScreen03";
import SampleScreen04 from "./Tabs//SampleScreen04";
import SampleScreen05 from "./Tabs//SampleScreen05";

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

const SampleTab04 = createStackNavigator({
    Auth : SampleScreen04,
    navigationOptions : ({navigation}) => ({
        headerMode: 'none',
        header: null,
    }),
});

const SampleTab05 = createStackNavigator({
    Auth : SampleScreen05,
    navigationOptions : ({navigation}) => ({
        headerMode: 'none',
        header: null,
    }),
});



const Tabs = createBottomTabNavigator({
        Sample01: SampleTab01,
        Sample02: SampleTab02,
        Sample03: SampleTab03,
        Sample04: SampleTab04,
        Sample05: SampleTab05
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: () => {
                const { routeName } = navigation.state;
                let tabName;
                if ( routeName === 'Sample01' ) {
                    tabName = 'photo';
                }else if ( routeName === 'Sample02' ) {
                    tabName = 'volume-up';
                }else if ( routeName === 'Sample03' ) {
                    tabName = 'youtube-play';
                }else if ( routeName === 'Sample04' ) {
                    tabName = 'upload';
                }else if ( routeName === 'Sample05' ) {
                    tabName = 'won';
                }else{
                    tabName = 'gear';
                }

                return <Icon name={tabName} size={20}  color='#888' />
            },
            headerMode: 'none',
        })
    });

export default createAppContainer(Tabs);