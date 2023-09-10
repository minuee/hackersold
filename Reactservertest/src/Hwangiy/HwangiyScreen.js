//navigation overriding
//ㄴ https://facebook.github.io/react-native/docs/navigation
//ㄴ https://alligator.io/react/react-native-navigation/

// navigation
import React, {Component} from 'react';
import {
  View, TouchableOpacity
} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';

// 1차 DrawerStructure 구성
// 2차 StackNavigator 생성(DrawStructure 연동)
// 3차 DrawerNavigator 생성(StackNavigator 매핑)
// 4차 createAppContainer 정의

// ㅁ 아래와 같이 별도 네비게이션을 설정하지 않는 경우에는 기존 네비게이션이 노출되는 원리는?

// Copy
class NavigationDrawerStructure extends Component {
  toggleDrawer = () => {
    this.props.navigationProps.toggleDrawer();
  };

  render() {
    return(
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)} style={{paddingLeft: 10}}>
        </TouchableOpacity>
      </View>
    );
  }
}

const HomeNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
    })
  }
});

//StackNavigator > DrawerStructure > DrawerNavigator > createAppContainer


const ProfileNavigator = createStackNavigator({
  Profile: {
    screen: ProfileScreen,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
    })
  }
});

const MainDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: HomeNavigator,
    navigationOptions: {
      drawerLabel: "Home",
      headerMode: "screen",
    }
  },
  Profile: {
    screen: ProfileNavigator,
    navigationOptions: {
      drawerLabel: "Profile",
      headerMode: "screen",
    }
  }
});

const App = createAppContainer(MainDrawerNavigator);

export default App;