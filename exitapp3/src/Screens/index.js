import React from 'react';
import {
    Text,AsyncStorage,StyleSheet,Dimensions,View,ScrollView
} from 'react-native';
import { createAppContainer,SafeAreaView } from "react-navigation";
import { createDrawerNavigator,DrawerItems} from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HeaderNav from '../Component/HeaderNav';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import SettingScreen from './SettingScreen';
import SpeechScreen from "./SpeechScreen";
import VoiceScreen from './VoiceScreen';

const styles = StyleSheet.create({
    navTtitle : {
        fontSize: 20,
        paddingLeft:10,
        color:"#fff"
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
});

const { width } = Dimensions.get("window");


const HamburgerNavigation = createDrawerNavigator(
    {
        contentComponent: props => {

            return (
                <ScrollView>
                    <SafeAreaView
                        forceInset={{ top: 'always', horizontal: 'never' }}
                    >
                        <View style={styles.NavContainer}>
                            <Text
                                onPress={() => {
                                    props.navigation.navigate('HomeScreen');
                                    props.navigation.closeDrawer();
                                }}
                            >
                                <Ionicons name="ios-home" size={20} /> Home
                            </Text>
                            <Text
                                onPress={() => {
                                    props.navigation.navigate('DefaultScreen');
                                    props.navigation.closeDrawer();
                                }}
                            >
                                <Ionicons name="ios-settings" size={20} /> 설정
                            </Text>
                            <View>
                                {   props.screenProps.LoginToken === null  ?
                                    <View>

                                        <Text  onPress={() => {
                                            //let moveAuthScreen = props.LoginToken == ""  ? 'LoginScreen' : 'LogoutScreen';
                                            props.navigation.navigate("LoginScreen");
                                            props.navigation.closeDrawer();
                                        }}>
                                            <Ionicons name="md-log-in" size={20} /> 로그인
                                        </Text>
                                    </View>
                                    :
                                    <View>

                                        <Text   onPress={() => {
                                            AsyncStorage.removeItem('userToken');

                                        }}><Ionicons name="md-log-out" size={20} /> 로그아웃</Text>
                                    </View>
                                }
                            </View>
                            <Text
                                onPress={() => {
                                    props.screenProps.Fn_Close();
                                }}
                            >
                                <Ionicons name="ios-settings" size={20} /> 앱종료
                            </Text>
                        </View>
                    </SafeAreaView>
                </ScrollView>
            )
        }
    }
);



const HomeStack = createStackNavigator(
    {
        HomeScreen

    },
    // if you need.
    // recommend custom header
    {
        defaultNavigationOptions: ({navigation}) => ({
            //title: 'Hackers React Native APP',
            headerRight: <HamburgerNavigation />,
            headerLeft : <Text style={[styles.navTtitle ]}>Hackers Developer</Text>,
            headerStyle: {
                backgroundColor: '#a93af4',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold'
            }

        }),
    }

);
const SettingStack = createStackNavigator(
    {
        SettingScreen,
        SpeechScreen,
        VoiceScreen
    },
    {
        defaultNavigationOptions: ({navigation}) => ({
            //header: null,

        }),
        initialRouteName: 'SettingScreen',
    }

);


const TabNavigator = createBottomTabNavigator(
    {
        Home: HomeStack,
        Setting: SettingStack
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
        TabNavigator: {
            screen: TabNavigator,
            navigationOptions: ({navigation}) => ({
                header: null,
            }),
        }

    }
);

export default createAppContainer(AppStack);
