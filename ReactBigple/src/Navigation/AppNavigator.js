import React from 'react';
import {View, Platform} from 'react-native';
// import {createSwitchNavigator} from 'react-navigation';
import {createAppContainer, StackActions, DrawerActions} from 'react-navigation';
import {createStackNavigator, HeaderBackButton} from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

import SignInScreen from '../Screens/Auth/SignInScreen';
import SignUpScreen01 from '../Screens/Auth/SignUpScreen';
import SignUpScreen02 from '../Screens/Auth/SignUpScreen02';
import SignUpScreen03 from '../Screens/Auth/SignUpScreen03';
// import AuthLoadingScreen from '../Screens/Auth/AuthLoadingScreen';

const getCurrentRouteName = () => {
    let routes = props.navigation.state.routes;
    let route = routes[routes.length - 1].routes;
    if (route.length > 0) {
      return route[route.length - 1].routeName;
    }
    return null;
};

const CustomBackButton = props => {
    
    

    return (
        <View style={{flex: 1, width: 50}}>
            <Icon
                name="times"
                size={25}
                color="#ccc"
                style={{textAlign: 'right', paddingRight: 10}}
                // onPress={() => parent.goBack()}
                // onPress={() => {props.navigation.dispatch(backAction)}}
                onPress={() => {props.navigation.goBack(null)}}
            />
        </View>
    );
};

const AuthStack = createStackNavigator(
    {
        SignIn: {
            screen: SignInScreen,
            navigationOptions: ({navigation}) => ({
                headerRight: <CustomBackButton navigation={navigation} screenProps={this.props} />,
                headerTitle: '로그인',
                headerTitleStyle: {
                    color: '#fff',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    width: '100%',
                },
                headerStyle: {
                    backgroundColor: '#173f82',
                },
                headerTintColor: '#fff',
            }),
        },
        SignUp01: {
            screen: SignUpScreen01,
            navigationOptions: ({navigation}) => ({
                // headerLeft: (
                //     <HeaderBackButton onPress={() => navigation.goBack(null)} />
                // ),
                headerTitle: '회원가입 - 약관 동의',
                headerStyle: {
                    backgroundColor: '#173f82',
                    color: '#fff',
                },
                headerTintColor: '#fff',
            }),
        },
        SignUp02: {
            screen: SignUpScreen02,
            navigationOptions: ({navigation}) => ({
                // headerLeft: (
                //     <HeaderBackButton onPress={() => navigation.goBack()} />
                // ),
                headerTitle: '회원가입 - 회원 정보',
                headerStyle: {
                    backgroundColor: '#173f82',
                    color: '#fff',
                },
                headerTintColor: '#fff',
            }),
        },
        SignUp03: {
            screen: SignUpScreen03,
            navigationOptions: ({navigation}) => ({
                headerLeft: null,
                headerTitle: '회원가입 - 가입 완료',
                headerStyle: {
                    backgroundColor: '#173f82',
                    color: '#fff',
                },
                headerTintColor: '#fff',
            }),
        },
        
    },
    {
        // mode: 'modal',
        // headerMode: 'none',
    },
);
///createSwitchNavigator
// export default createAppContainer(
//     createSwitchNavigator(
//         {
//             AuthLoading: AuthLoadingScreen,
//             MainAuth: AuthStack,
//         },
//         {
//             initialRouteName: 'AuthLoading',
//         },
//     ),
// );

export default createAppContainer(AuthStack);
