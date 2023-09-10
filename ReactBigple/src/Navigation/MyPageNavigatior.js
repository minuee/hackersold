import React from 'react';
import {View, Platform} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

import MyPageScreen from '../Screens/MyPage/MyPageScreen';
import TargetScoreScreen from '../Screens/MyPage/TargetScoreScreen';
import ExamScheduleScreen from '../Screens/MyPage/ExamScheduleScreen';
import SolveHistoryScreen from '../Screens/MyPage/SolveHistoryScreen';
import SolveDetailScreen from '../Screens/MyPage/SolveHistory/SolveDetailScreen';

// 로그인/회원가입
import MySignInScreen from '../Screens/Auth/SignInScreen';
import SignUpScreen01 from '../Screens/Auth/SignUpScreen';
import SignUpScreen02 from '../Screens/Auth/SignUpScreen02';
import SignUpScreen03 from '../Screens/Auth/SignUpScreen03';

const CloseButton = props => {
    return (
        <View style={{flex: 1, width: 50}}>
            <Icon
                name="close"
                size={25}
                color="#ccc"
                style={{textAlign: 'right', paddingRight: 10}}
                onPress={() => {props.navigation.goBack(null)}}
                // onPress={this._customgoback.bind(this)}
            />
        </View>
    );
};

const HomeButton = props => {
    return (
        <View style={{flex: 1, width: 50}}>
            <Icon
                name="home"
                size={25}
                color="#ccc"
                style={{textAlign: 'right', paddingRight: 10}}
                onPress={() => {props.navigation.popToTop()}}
                // onPress={this._customgoback.bind(this)}
            />
        </View>
    );
};

const MyPageStack = createStackNavigator(
    {
        MyPageScreen: {
            screen: MyPageScreen,
            navigationOptions: ({navigation}) => ({
                // headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
                headerTitle: '마이페이지',
                headerRight: <CloseButton navigation={navigation} />,
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
        TargetScoreScreen: {
            screen: TargetScoreScreen,
            navigationOptions: ({navigation}) => ({
                // headerLeft: <HeaderBackButton onPress={() => navigation.goBack()}  />,
                headerTitle: '목표 점수',
                headerRight: <HomeButton navigation={navigation} />,
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
        ExamScheduleScreen: {
            screen: ExamScheduleScreen,
            navigationOptions: ({navigation}) => ({
                // headerLeft: <HeaderBackButton onPress={() => navigation.goBack()}  />,
                headerTitle: '시험 일정',
                headerRight: <HomeButton navigation={navigation} />,
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
        SolveHistoryScreen: {
            screen: SolveHistoryScreen,
            navigationOptions: ({navigation}) => ({
                // headerLeft: <HeaderBackButton onPress={() => navigation.goBack()}  />,
                headerTitle: '풀이 이력',
                headerRight: <HomeButton navigation={navigation} />,
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
        SolveDetailScreen: {
            screen: SolveDetailScreen,
            navigationOptions: ({navigation}) => ({
                // headerLeft: <HeaderBackButton onPress={() => navigation.goBack()}  />,
                // headerTitle: '풀이 이력',
                // headerRight: <HomeButton navigation={navigation} />,
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
        MySignInScreen: {
            screen: MySignInScreen,
            navigationOptions: ({navigation}) => ({
                // headerLeft: null,
                // headerRight: <CloseButton navigation={navigation} />,
                headerRight: null,
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
                // headerLeft: null,
                // headerRight: null,
                headerTitle: '회원가입',
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
        SignUp02: {
            screen: SignUpScreen02,
            navigationOptions: ({navigation}) => ({
                // headerLeft: null,
                // headerRight: <CloseButton navigation={navigation} />,
                headerRight: null,
            }),
        },
        SignUp03: {
            screen: SignUpScreen03,
            navigationOptions: ({navigation}) => ({
                // headerLeft: null,
                // headerRight: <CloseButton navigation={navigation} />,
                headerRight: null,
            }),
        },
    },
    {
        // mode: 'modal',
        // headerMode: 'none',
    },
);

export default createAppContainer(MyPageStack);
