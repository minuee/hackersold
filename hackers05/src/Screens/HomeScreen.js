import React, { Component } from 'react';
import { View,StyleSheet,Dimensions,Image,TouchableOpacity,Text,StatusBar,Platform,Button} from 'react-native';
import Toast from 'react-native-tiny-toast';
//For React Navigation 4+
import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator,HeaderBackButton} from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
//Import all the screens
import  SelectScreen from './SelectScreen';
import  TextToSpeech  from './TextToSpeech';
import CustomSidebarMenu from './CustomSidebarMenu';

import CameraScreen  from './CameraScreen';
import FingerPrintScreen from './FingerPrintScreen';
import TabsScreen from './TabsScreen';
import CalendarScreen2  from '../Calendar2/CalendarScreen';
import CalendarScreen  from '../Calendar/CalendarScreen';
import ReduxSagaScreen from './ReduxSagaScreen';
import ReduxThunkScreen from './ReduxThunkScreen';
import UserListScreen from './UserListScreen';
import UserDetailScreen from './UserDetailScreen';
import NewsScreen from './NewsScreen';
import MapViewScreen from './MapViewScreen';
import WebViewScreen from './WebViewScreen';

global.currentScreenIndex = 0;

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
        screen: SelectScreen,
        navigationOptions: ({ navigation }) => ({
            headerTitle: 'Languages Select',
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
            headerStyle: {
                backgroundColor: '#c375f4',
            },
            headerBackTitle :"뒤로",
            headerTintColor: '#fff'
        }),
    }

});

const CameraScreen_StackNavigator = createStackNavigator({
    //All the screen from the Third Option will be indexed here
    second: {
        screen: CameraScreen,
        navigationOptions: ({ navigation }) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
            headerTitle: 'Native Camera',
            headerRight: <NavigationDrawerStructureRight navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#c375f4',
                color : '#fff'
            },
            headerTintColor: '#fff',

        }),
    }
});

const Finger_StackNavigator = createStackNavigator({
    three: {
        screen: FingerPrintScreen ,
        navigationOptions: ({ navigation }) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
            headerTitle: 'FingerPrint Screen',
            headerRight: <NavigationDrawerStructureRight navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#c375f4',
                color : '#fff'
            },
            headerTintColor: '#fff',
        }),
    }
});

const Tabs_StackNavigator = createStackNavigator({
    four: {
        screen: TabsScreen,
        navigationOptions: ({ navigation }) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
            headerTitle: 'Bottom Tabs Test',
            headerRight: <NavigationDrawerStructureRight navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#c375f4',
                color : '#fff'
            },
            headerTintColor: '#fff',

        }),
    }
});

const Redux_StackNavigator = createStackNavigator({
    five: {
        screen: ReduxSagaScreen ,
        navigationOptions: ({ navigation }) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
            headerTitle: 'Redux(Saga) Screen',
            headerStyle: {
                backgroundColor: '#c375f4',
                color : '#fff'
            },
            headerTintColor: '#fff',
        }),
    }
});

const Redux2_StackNavigator = createStackNavigator({
    six: {
        screen: ReduxThunkScreen ,
        navigationOptions: ({ navigation }) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
            headerTitle: 'Redux(Thunk) Screen',
            headerStyle: {
                backgroundColor: '#c375f4',
                color : '#fff'
            },
            headerTintColor: '#fff',
        }),
    }
});

const Calendar_StackNavigator = createStackNavigator({
    seven: {
        screen: CalendarScreen ,
        navigationOptions: ({ navigation }) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
            headerTitle: 'Calendar Screen',
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
    },
    
});

const Calendar2_StackNavigator = createStackNavigator({
    eight: {
        screen: CalendarScreen2 ,
        navigationOptions: ({ navigation }) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
            headerTitle: 'Calendar2 Screen',
            headerStyle: {
                backgroundColor: '#c375f4',
                color : '#fff'
            },
            headerTintColor: '#fff',
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
    },
    HomeScreen : {
        screen: SelectScreen,
        navigationOptions: ({ navigation }) => ({
            headerTitle: 'Languages Select',
            headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#c375f4',
            },
            headerTintColor: '#fff'
        }),
    },
});

const News_StackNavigator = createStackNavigator({
    ten: {
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

const MapView_StackNavigator = createStackNavigator({
    eleven: {
        screen: MapViewScreen ,
        navigationOptions: ({ navigation }) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
            headerTitle: 'MapView Screen',
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
            //headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
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
                drawerLabel: 'Home Screen ',
            },
        },
        NavRNCamera : {
            screen: CameraScreen_StackNavigator,
            navigationOptions: {
                drawerLabel: 'RN Camera',
            },
        },
        NavTabsScreen : {
            screen: Tabs_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Tab Screen',
            },
        },
        NavReduxScreen : {
            screen: Redux_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Redux Screen',
            },
        },
        NavRedux2Screen : {
            screen: Redux2_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Redux Screen',
            },
        },
        NavFingerScreen : {
            screen: Finger_StackNavigator,
            navigationOptions: {
                drawerLabel: 'FingerPrint Screen',
            },
        },
        NavCalendarScreen2 : {
            screen: Calendar2_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Calendar2 Screen',
            },
        },
        NavCalendarScreen : {
            screen: Calendar_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Calendar Screen',
            },
        },
        NavUserListScreen : {
            screen: UserList_StackNavigator,
            navigationOptions: {
                drawerLabel: 'UserList Screen',
            },
        },
        NavNewsScreen : {
            screen: News_StackNavigator,
            navigationOptions: {
                drawerLabel: 'News Screen',
            },
        },
        NavMapViewScreen : {
            screen: MapView_StackNavigator,
            navigationOptions: {
                drawerLabel: 'MapView Screen',
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
