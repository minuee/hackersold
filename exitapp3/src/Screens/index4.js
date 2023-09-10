import React, { Component } from 'react';
import { View,StyleSheet,Dimensions,Image,TouchableOpacity,Platform,Text,} from 'react-native';

//For React Navigation 4+
import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/FontAwesome';

//Import all the screens
import HomeScreen from './HomeScreen';
import TextToSpeech from './TextToSpeech';
import GridHomeScreen from './GridHomeScreen';
import VoiceScreen from './VoiceScreen';
import LoginScreen from './LoginScreen';
import SpeechScreen from './SpeechScreen';
import MemberListScreen from './MemberListScreen';
import MemberDetailScreen from './MemberDetailScreen';
import TabsScreen from './TabsScreen';

//Import Custom Sidebar
import CustomSidebarMenu from './CustomSidebarMenu';
import { createBottomTabNavigator } from 'react-navigation-tabs';

global.currentScreenIndex = 0;

//Navigation Drawer Structure for all screen
class NavigationDrawerStructure extends Component {

    //Top Navigation Header with Donute Button
    toggleDrawer = () => {
        //Props to open/close the drawer
        this.props.navigationProps.toggleDrawer();
    };
    render() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={this.toggleDrawer.bind(this)} style={{paddingLeft:10}}>
                    {/*Donute Button Image */}
                    {/*<Image
                        source={require('../../assets/images/menu.png')}
                        style={{ width: 25, height: 25, marginLeft: 5 }}
                    />*/}
                    <Icon name="bars" size={25} color="#808080" />
                </TouchableOpacity>
            </View>
        );
    }
}



//Stack Navigator for the First Option of Navigation Drawer
const HomeScreen_StackNavigator = createStackNavigator({
    //All the screen from the First Option will be indexed here
    First: {
        screen: GridHomeScreen,
        navigationOptions: ({ navigation }) => ({
            title: 'Languages Practice',
            headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#c375f4',
            },
            headerTintColor: '#fff'
        }),
    },
    TextToSpeech :
    {
        screen : TextToSpeech,
        navigationOptions: ({ navigation }) => ({
            header : null
        }),
    },
    LoginScreen
});

//Stack Navigator for the Second Option of Navigation Drawer
const VoiceScreen_StackNavigator = createStackNavigator({
    //All the screen from the Second Option will be indexed here
    Second: {
        screen: VoiceScreen,
        navigationOptions: ({ navigation }) => ({
            title: '여기는 보이스스크린',
            headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,

            headerStyle: {
                backgroundColor: '#c375f4',
            },
            headerTintColor: '#fff',
        }),
    }
});

//Stack Navigator for the Third Option of Navigation Drawer
const SpeechScreen_StackNavigator = createStackNavigator({
    //All the screen from the Third Option will be indexed here
    Third: {
        screen: SpeechScreen,
        navigationOptions: ({ navigation }) => ({
            title: '여기는 스피치스크린',
            headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#c375f4',
            },
            headerTintColor: '#fff',
        }),
    }
});

//Stack Navigator for the Third Option of Navigation Drawer
const MemberList_StackNavigator = createStackNavigator({
    //All the screen from the Third Option will be indexed here
    forth: {
        screen: MemberListScreen,
        navigationOptions: ({ navigation }) => ({
            title: 'Member List',
            headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#c375f4',
            },
            headerTintColor: '#fff',

        }),
    },MemberDetailScreen
});

//Stack Navigator for the Third Option of Navigation Drawer
const Tabs_StackNavigator = createStackNavigator({
    //All the screen from the Third Option will be indexed here
    fifth: {
        screen: TabsScreen,
        navigationOptions: ({ navigation }) => ({
            title: 'Bottom Tabs Test',
            headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#c375f4',
            },
            headerTintColor: '#fff',

        }),
    }
});

//Drawer Navigator Which will provide the structure of our App
const DrawerNavigatorExample = createDrawerNavigator(
    {
        //Drawer Optons and indexing
        NavHomeScreen: {
            screen: HomeScreen_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Home Screen ',
            },
        },
        NavVoiceScreen: {
            screen: VoiceScreen_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Voice Screen',
            },
        },
        NavSpeechScreen: {
            screen: SpeechScreen_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Speech Screen',
            },
        },
        NavMemberScreen : {
            screen: MemberList_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Member List',
            },
        },
        NavTabsScreen : {
            screen: Tabs_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Member List',
            },
        }
    },
    {
        //For the Custom sidebar menu we have to provide our CustomSidebarMenu
        contentComponent: CustomSidebarMenu,
        //Sidebar width
        drawerWidth: Dimensions.get('window').width - 130,
    }
);
export default createAppContainer(DrawerNavigatorExample);
