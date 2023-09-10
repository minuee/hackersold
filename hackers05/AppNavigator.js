import React from 'react';
import {createAppContainer,createSwitchNavigator} from 'react-navigation';
import {createStackNavigator,HeaderBackButton} from 'react-navigation-stack';

import MainScreen from './src/Screens/SelectScreen';
import SignInScreen from './src/Screens/SignInScreen';
import SignUpScreen from './src/Screens/SignUpScreen';
import SignUpModal  from './src/Screens/SignUpModal';
import AuthLoadingScreen from './src/Screens/AuthLoadingScreen';

const MainAppStack = createStackNavigator({ Main: MainScreen });      // 앱 메인 화면
const AuthStack = createStackNavigator({
    SignIn: SignInScreen,
    SignUp : {
        screen: SignUpScreen,
        navigationOptions: ({navigation}) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}/>,
            headerTitle: 'Sing Up',
            headerStyle: {
                backgroundColor: '#c375f4',
                color: '#fff'
            },
            headerTintColor: '#fff',
        }),
    },
    SignUpModal: {
        screen: SignUpModal,
        navigationOptions: ({navigation}) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}/>,
            headerStyle: {
                backgroundColor: '#c375f4',
                color: '#fff'
            },
            headerTintColor: '#fff',
        }),
    }
});
///createSwitchNavigator
export default createAppContainer(createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        MainApp: MainAppStack,
        MainAuth: AuthStack
    },
    {
        initialRouteName: 'AuthLoading',
    }
));
