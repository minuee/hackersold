import React, { Component } from 'react';
import { View,StyleSheet,Dimensions,Image,TouchableOpacity,Text,StatusBar,Platform,Button} from 'react-native';

//For React Navigation 4+
import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator,HeaderBackButton} from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
//Import all the screens
import  SampleScreen from './SampleScreen';
import CustomSidebarMenu from './CustomSidebarMenu';

import NewsScreen from './NewsScreen';
import TabsScreen from './TabsScreen';
import ScrollableTabs from './ScrollableTabs';
import UserListScreen from './UserListScreen';
import UserDetailScreen from './UserDetailScreen';
import WebViewScreen from './WebViewScreen';

//Navigation Drawer Structure for all screen
class NavigationDrawerStructure extends Component {

    toggleDrawer = () => {
        this.props.navigationProps.toggleDrawer();
    };

    render() {
        return (
            <View style={{ flexDirection: 'row' }}>
                { Platform.OS == 'android' && <StatusBar backgroundColor="#c375f4" barStyle="light-content" />}
                <TouchableOpacity onPress={this.toggleDrawer.bind(this)} style={{paddingLeft:10}}>
                    <Icon name="bars" size={25} color="#808080" />
                </TouchableOpacity>
            </View>
        );
    }
}

class NavigationDrawerStructureRight extends Component {

    toggleDrawer = () => {
        this.props.navigationProps.toggleDrawer();
    };

    render() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={this.toggleDrawer.bind(this)} style={{paddingRight:10}}>
                    <Icon name="bars" size={25} color="#808080" />
                </TouchableOpacity>
            </View>
        );
    }
}


const HomeScreen_StackNavigator = createStackNavigator({

    First: {
        screen: SampleScreen,
        navigationOptions: ({ navigation }) => ({
            headerMode: 'none',
            header: null,
        }),
    }
});

const News_StackNavigator = createStackNavigator({
    Second : {
        screen: NewsScreen ,
        navigationOptions: ({ navigation }) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
            headerTitle: 'News Screen',
            headerStyle: {
                backgroundColor: '#c375f4',
                color : '#fff'
            },
            headerTintColor: '#fff',
        }),
    }
});

const Tabs_StackNavigator = createStackNavigator({
    three: {
        screen: TabsScreen,
        navigationOptions: ({ navigation }) => ({
            headerMode: 'none',
            header: null,
        }),
    }
});

const SlideTabs_StackNavigator = createStackNavigator({
    four: {
        screen: ScrollableTabs ,
        navigationOptions: ({ navigation }) => ({
            headerMode: 'none',
            header: null,
        }),
    }
});


const UserList_StackNavigator = createStackNavigator({
    nine: {
        screen: UserListScreen ,
        path : 'userlist',
        navigationOptions: ({ navigation }) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
            headerTitle: 'UserList Screen',
            headerRight: <NavigationDrawerStructureRight navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#c375f4',
                color : '#fff'
            },
            headerTintColor: '#fff',
        }),
    },
    UserDetailScreen :{
        screen: UserDetailScreen ,
        path : 'userdetail',
        navigationOptions: ({ navigation }) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
            headerStyle: {
                backgroundColor: '#c375f4',
                color : '#fff'
            },
            headerTintColor: '#fff',
        }),
    }
});

const WebView_StackNavigator = createStackNavigator({
    eleven: {
        screen: WebViewScreen ,
        navigationOptions: ({ navigation }) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
            headerTitle: 'WebView Screen',
            headerStyle: {
                backgroundColor: '#c375f4',
                color : '#fff'
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
                drawerLabel: 'Sample Screen ',
            },
        },
        NavNewsScreen : {
            screen: News_StackNavigator,
            navigationOptions: {
                drawerLabel: 'News Screen',
            },
        },
        NavTabsScreen : {
            screen: Tabs_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Tab Screen',
            },
        },
        NavSlideTabsScreen : {
            screen: SlideTabs_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Slide Tabs Screen',
            },
        },
        NavUserListScreen : {
            screen: UserList_StackNavigator,
            navigationOptions: {
                drawerLabel: 'UserList Screen',
            },
        },
        NavWebViewScreen : {
            screen: WebView_StackNavigator,
            navigationOptions: {
                drawerLabel: 'WebView Screen',
            },
        },
    },
    {
        contentComponent: CustomSidebarMenu,
        drawerWidth: Dimensions.get('window').width - 130
    }
);
export default createAppContainer(DrawerNavigatorExample);
