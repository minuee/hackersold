import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
 
//For React Navigation 3+
//import {
//  createStackNavigator,
//  createDrawerNavigator,
//  createAppContainer,
//} from 'react-navigation';
 
//For React Navigation 4+
import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator, HeaderBackButton} from 'react-navigation-stack';
import Screen1 from './src/Screens/Screen01';
import Screen2 from './src/Screens/Screen02';
import Screen3 from './src/Screens/Screen03';
 
// 여기서부터는 개인별 작업
// By noh.seongnam
import NohsnScreen from './src/nohsn/NohsnScreen';
global.currentScreenIndex = 0; // noh.seongnam glibal index no

// By hwang.inyeop
import HwangiyScreen from './src/Hwangiy/HwangiyScreen';

// By Jeon.beomjun
import JeonbhScreen from './src/Jeonbj/SampleScreen';


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


class NavigationDrawerStructure extends Component {
  toggleDrawer = () => {
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)} style={{paddingLeft:10}}>
          {/*Donute Button Image */}
          <Icon name="bars" size={25} color="#808080" />
        </TouchableOpacity>
      </View>
    );
  }
}
 
const FirstActivity_StackNavigator = createStackNavigator({
  //All the screen from the Screen1 will be indexed here
  First: {
    screen: Screen1,
    navigationOptions: ({ navigation }) => ({
      title: 'Demo Screen 1',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});
 
const Screen2_StackNavigator = createStackNavigator({
  //All the screen from the Screen2 will be indexed here
  Second: {
    screen: Screen2,
    navigationOptions: ({ navigation }) => ({
      title: 'Demo Screen 2',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});
 
const Screen3_StackNavigator = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  Third: {
    screen: Screen3,
    navigationOptions: ({ navigation }) => ({
      title: 'Demo Screen 3',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#FF9800',
      },
      headerTintColor: '#fff',
    }),
  },
});

const ScreenNSN_StackNavigator = createStackNavigator({
    //All the screen from the Screen3 will be indexed here
    four: {
        screen: NohsnScreen ,
        navigationOptions: ({ navigation }) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
            headerRight: <NavigationDrawerStructureRight navigationProps={navigation} />,
            headerTitle: 'NohSeongnam Screen',
            headerStyle: {
                backgroundColor: '#c375f4',
                color : '#fff'
            },
            headerTintColor: '#fff',
        }),
    }
  });

  const ScreenJBH_StackNavigator = createStackNavigator({
    five: {
      screen: JeonbhScreen ,
      navigationOptions: ({ navigation }) => ({
        headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
        headerRight: <NavigationDrawerStructureRight navigationProps={navigation} />,
        headerTitle: 'JeonBeomjoon Screen',
        headerStyle: {
          backgroundColor: '#c375f4',
          color : '#fff'
        },
        headerTintColor: '#fff',
      }),
    }
  });

const ScreenHIY_StackNavigator = createStackNavigator({
  five: {
    screen: HwangiyScreen ,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
      headerRight: <NavigationDrawerStructureRight navigationProps={navigation} />,
      headerTitle: 'HwangInyeop Screen',
      headerStyle: {
        backgroundColor: '#ff0000',
        color : '#fff'
      },
      headerTintColor: '#fff',
    }),
  }
});

const DrawerNavigatorExample = createDrawerNavigator({
  //Drawer Optons and indexing
  Screen1: {
    //Title
    screen: FirstActivity_StackNavigator,
    navigationOptions: {
      drawerLabel: 'Demo Screen 1',
    },
  },
  Screen2: {
    //Title
    screen: Screen2_StackNavigator,
    navigationOptions: {
      drawerLabel: 'Demo Screen 2',
    },
  },
  Screen3: {
    //Title
    screen: Screen3_StackNavigator,
    navigationOptions: {
      drawerLabel: 'Demo Screen 3',
    },
  },
  Screen6: {
    //Title
    screen: ScreenJBH_StackNavigator,
    navigationOptions: {
      drawerLabel: 'JeonBeomjoon Screen',
    },
  },
  Screen4: {
    //Title
    screen: ScreenNSN_StackNavigator,
    navigationOptions: {
      drawerLabel: 'NohSeongnam Screen',
    },
  },
  Screen5: {
    //Title
    screen: ScreenHIY_StackNavigator,
    navigationOptions: {
      drawerLabel: 'HwangInyeop Screen',
    },
  },
});
 
export default createAppContainer(DrawerNavigatorExample);