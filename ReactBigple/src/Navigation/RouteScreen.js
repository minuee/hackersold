import React, { Component } from 'react';
import { View,StyleSheet,Dimensions,Image,TouchableOpacity,Text,StatusBar,Platform,Button, SafeAreaView} from 'react-native';
import Toast from 'react-native-tiny-toast';
import {createAppContainer,NavigationEvents,NavigationActions} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator,HeaderBackButton} from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import AsyncStorage from '@react-native-community/async-storage';

//Import all the screens
import MainScreen from '../Screens/MainScreen';
import CustomSidebarMenu from './CustomSidebarMenu'; //마이페이지
//ㅈㅣ금바로 무제한풀기
import QuestionScreen from '../Screens/BaseTest/QuestionScreen';

//RC Text 문제풀이
import RCTestScreen from '../Screens/RCTest/RCTestScreen';

//교재풀이
import ExplanationScreen from '../Screens/TextBook/ExplanationScreen';

import ElementsScreen from '../Screens/Etc/ElementsScreen';
import TimerScreen from '../Screens/Etc/TimerScreen';
import SampleScreen from '../Screens/Etc/SampleScreen'
import Sample01Screen from '../Screens/Etc/Sample01Screen'
import AnalysisMainScreen from '../Screens/Analysis/MainScreen'
import ReportScreen from '../Screens/Analysis/ReportScreen';

// 강의학습
import LectureStudyScreen from '../Screens/LectureStudy/MainScreen';
import TranslateScreen from '../Screens/LectureStudy/Result/TranslateScreen';
import CommentScreen from '../Screens/LectureStudy/Result/CommentScreen';
import VocaScreen from '../Screens/LectureStudy/Result/VocaScreen';


import SignInScreen from '../Screens/Auth/SignInScreen';
import AppLoginStack from '../Navigation/AppNavigator';
import MyPageStack from '../Navigation/MyPageNavigatior';



global.currentScreenIndex = 0;

const NavigationDrawerStructure=(props)=>{            
    return (
        <View>            
            <TouchableOpacity onPress= {()=> props.navigationProps.navigate('NavMyPageScreen')} style={{paddingRight:10}}>
                <Icon name="user" size={Platform.OS === 'ios' ? 25 : 20} color="#000000" />
            </TouchableOpacity>
        </View>
    )
}

class NavigationDrawerStructure2 extends Component {

    goMyPageScreen = () => {
        this.props.navigationProps.navigate('NavMyPageScreen');
    };

    render() {
        return (
            <View style={{ flexDirection: 'row' }}>                
                {/* <TouchableOpacity onPress={this.toggleDrawer.bind(this)} style={{paddingRight:10}}> */}
                <TouchableOpacity onPress= {()=> this.goMyPageScreen()} style={{paddingRight:10}}>
                    <Icon name="user" size={25} color="#000000" />
                </TouchableOpacity>
            </View>
        );
    
    }
}


class NavigationDrawerStructureRight extends Component {

    constructor() {
        super()
        this.state = {
            TopUserToken: null
        }        
    }

    UNSAFE_componentWillMount () {
        this.getStorageData();
    }

    getStorageData = async () => {
        try {
          const tvalue = await AsyncStorage.getItem('userToken')
          if(tvalue !== null) {            
            this.setState({TopUserToken: tvalue});
          }
        } catch(e) {            
            this.setState({TopUserToken: null});
        }
    }
  
    componentDidMount () {
       // console.log('token', this.state.TopUserToken);
        
    }

    toggleDrawer = () => {
        this.props.navigationProps.toggleDrawer();
    }; 

    goLoginScreen = () => {
        this.props.navigationProps.navigate('SignInScreen');
    };

    goMyPageScreen = () => {
        this.props.navigationProps.navigate('NavMyPageScreen');
    };

    render() {        

        if ( this.state.TopUserToken ) {
            return (
                <View style={{ flexDirection: 'row' }}>
                    <NavigationEvents
                        onWillFocus={payload => console.log('header will focus')}
                        onDidFocus={payload => console.log('header did focus')}
                        onWillBlur={payload => console.log('header will blur')}
                        onDidBlur={payload => console.log('header did blur')}
                    />
                    {/* <TouchableOpacity onPress={this.toggleDrawer.bind(this)} style={{paddingRight:10}}> */}
                    <TouchableOpacity onPress={this.goMyPageScreen.bind(this)} style={{paddingRight:10}}>
                        <Icon name="user" size={25} color="#000000" />
                    </TouchableOpacity>
                </View>
            );
        }else {
            return (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={this.goLoginScreen.bind(this)} style={{paddingRight:10}}>
                        <Text>Login</Text>
                    </TouchableOpacity>
                </View>
            );            
        }
    }
}

const CustomBackButton = (props) => {
    //console.log("CustomBackButton",props);
    _customgoback = () => {
        props.navigationProps.goBack(null);
    }
    return ( 
        <View style={{flex:1,width:50}}>
            <Icon name="times" size={25} color="#ccc" style={{textAlign : 'right', paddingRight:10}}
            onPress={this._customgoback.bind(this)} />
        </View>
    )
}

const CustomBackButton2 = (props) => {

    const navigateAction = NavigationActions.navigate({
        routeName: 'NavHomeScreen',
        params: {},
        action: NavigationActions.navigate({ routeName: 'NavHomeScreen' }),
    });
    _customgoback = () => {
        props.navigationProps.dispatch(navigateAction);
    }
    return ( 
        <View style={{flex:1,width:50}}>
            <Icon name="home" size={25} color="#ccc" style={{textAlign : 'right', paddingRight:10}}
            onPress={this._customgoback.bind(this)} />
        </View>
    )
}


//여기서부터 메인스택
// 홈스택
const HomeScreen_StackNavigator = createStackNavigator({

    MainScreen: {
        screen: MainScreen,
        navigationOptions: ({ navigation,}) => ({
            headerLeft: <View style={{flex:1,textAlign:'center',alignItems:'center'}}>{/*<Image source={require('../../assets/images/hackers_ingang.png')} style={{width: 80}} resizeMode='contain' />*/}</View>,
            headerTitle: <View style={{flex:1,textAlign:'center',alignItems:'center'}}><Image source={require('../../assets/images/top_logo_bigple.png')} style={{height: 20}} resizeMode='contain' /></View>,
            headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#fff',
                height:40
            },
            headerTintColor: '#fff'
        }),
    },   

    QuestionScreen : {
        screen : QuestionScreen,
        navigationOptions: ({ navigation }) => ({
            drawerLabel: 'QuestionScreen',
            drawerLockMode: "locked-closed",
        },
        {
            mode: 'modal',
        }),
    },
    ExplanationScreen : {
        screen : ExplanationScreen,
        navigationOptions: ({ navigation }) => ({
            header: null, // only this works
            headerMode: 'none',
        },
        {            
            headerMode: 'none',
        }
        )
    },
    SampleScreen :{
        screen: SampleScreen ,
        navigationOptions: ({ navigation }) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
            headerTitle: 'SampleScreen Screen',
            headerStyle: {
                backgroundColor: '#fff',
                color : '#888'
            },
            headerTintColor: '#888',
        }),
    },
    Sample01Screen :{
        screen: Sample01Screen ,
        navigationOptions: ({ navigation }) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
            headerTitle: 'Audio Screen',
            headerStyle: {
                backgroundColor: '#fff',
                color : '#888'
            },
            headerTintColor: '#888',
        }),
    },
    AnalysisMainScreen :{
        screen: AnalysisMainScreen ,
        navigationOptions: ({ navigation }) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
            headerTitle: 'Audio 2 Screen',
            headerStyle: {
                backgroundColor: '#fff',
                color : '#888'
            },
            headerTintColor: '#888',
        }),
    },
    ReportScreen :{
        screen: ReportScreen ,
        navigationOptions: ({ navigation }) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
            headerTitle: '분석 레포트',
            headerStyle: {
                backgroundColor: '#24407E',
            },
            headerTitleStyle: {
                textAlign: 'center',
                alignItems: 'center',
                flexGrow: 1
            },
            headerRight: <View></View>,
            headerTintColor: '#FFFFFF',
        }),
    },
    LectureStudyScreen :{
        screen: LectureStudyScreen ,
        navigationOptions: ({ navigation }) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
            headerTitle: '강의 학습',
            headerStyle: {
                backgroundColor: '#24407E',
            },
            headerTitleStyle: {
                textAlign: 'center',
                alignItems: 'center',
                flexGrow: 1
            },
            headerRight: <View></View>,
            headerTintColor: '#FFFFFF',
        }),
    },
    TranslateScreen: {
        screen: TranslateScreen,
        navigationOptions: ({ navigation }) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
            headerTitle: '',
            headerStyle: {
                backgroundColor: '#24407E',
            },
            headerTitleStyle: {
                textAlign: 'center',
                alignItems: 'center',
                flexGrow: 1
            },
            headerRight: <View></View>,
            headerTintColor: '#FFFFFF',
        }),
    },
    CommentScreen: {
        screen: CommentScreen,
        navigationOptions: ({ navigation }) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
            headerTitle: '',
            headerStyle: {
                backgroundColor: '#24407E',
            },
            headerTitleStyle: {
                textAlign: 'center',
                alignItems: 'center',
                flexGrow: 1
            },
            headerRight: <View></View>,
            headerTintColor: '#FFFFFF',
        }),
    },
    VocaScreen: {
        screen: VocaScreen,
        navigationOptions: ({ navigation }) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
            headerTitle: '',
            headerStyle: {
                backgroundColor: '#24407E',
            },
            headerTitleStyle: {
                textAlign: 'center',
                alignItems: 'center',
                flexGrow: 1
            },
            headerRight: <View></View>,
            headerTintColor: '#FFFFFF',
        }),
    },

}
/*
,{
    mode: 'modal',
}
*/
);
// 기본 A포맷 타이머있음( 참고사항 : RC/LC 혼합형 )
const QuestionScreen_StackNavigator = createStackNavigator({
    QuestionScreen : {
        screen : QuestionScreen,
        navigationOptions: {
            drawerLabel: 'QuestionScreen',
            drawerLockMode: "locked-closed",
        },
    },
},
{
    mode: 'modal',
  
  }
);

// 기본 R포맷 타이머앖음( 참고사항 : RC전용이나 예문등은 RC/LC 혼합형 )
const RCTestScreen_StackNavigator = createStackNavigator({
    RCTestScreen : {
        screen : RCTestScreen,
        navigationOptions: {
            drawerLabel: 'RCTestScreen',
            drawerLockMode: "locked-closed",
        },
    }
});

/*
// 기본 L포맷 타이머앖음( 참고사항 : LC전용 )
const LCTestScreen_StackNavigator = createStackNavigator({
    LCTestScreen : {
        screen : LCTestScreen,
        navigationOptions: {
            drawerLabel: 'RCTestScreen',
            drawerLockMode: "locked-closed",
        },
    }
});
*/

const ElementsScreen_StackNavigator = createStackNavigator({
    onehundred : {
        screen: ElementsScreen ,
        navigationOptions: ({ navigation }) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
            headerTitle: 'Elements Test Screen',
            headerStyle: {
                backgroundColor: '#fff',
                color : '#888'
            },
            headerTintColor: '#fff',
        }),
    }
});

//교재풀이
const ExplanationScreen_StackNavigator = createStackNavigator({
    ExplanationScreen : {
        screen : ExplanationScreen,
        navigationOptions: {
            drawerLabel: 'TextBookExplanationScreen',
            drawerLockMode: "locked-closed",
        },
    }
});

const TimerScreen_StackNavigator = createStackNavigator({
    onehundredone : {
        screen: TimerScreen ,
        navigationOptions: ({ navigation }) => ({
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
            headerTitle: 'Elements Test Screen',
            headerRight: <CustomBackButton2  navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#fff',
                color : '#888'
            },
            headerTintColor: '#fff',
        }),
    }
});

// const SignInScreen_StackNavigator = createStackNavigator({
//     onehundred : {
//         screen: SignInScreen ,
//         navigationOptions: ({ navigation }) => ({
//             headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
//             headerTitle: 'SignInScreen',
//             headerRight: <CustomBackButton2  navigationProps={navigation} />,
//             headerStyle: {
//                 backgroundColor: '#fff',
//                 color : '#888'
//             },
//             headerTintColor: '#fff',
//         }),
//     }
// });

const DrawerNavigatorRoute = createDrawerNavigator(
    {
        //Drawer Optons and indexing
        NavHomeScreen: {
            screen: HomeScreen_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Home Screen ',
            },
        },
        NavQuestionScreen: {
            screen : QuestionScreen_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Question Screen',
                drawerLockMode: "locked-closed",
            },
        },
        NavExplanationScreen : {
            screen : ExplanationScreen_StackNavigator,
            navigationOptions: {
                drawerLabel: 'NavExplanation Screen',
                drawerLockMode: "locked-closed",
            },
        },
        NavRCTestScreen : {
            screen : RCTestScreen_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Question Screen',
                drawerLockMode: "locked-closed",
            },
        },
        NavElementsScreen : {
            screen: ElementsScreen_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Elements Test Screen',
                drawerLockMode: "locked-closed",
            },
        },
        NavTimerScreen: {
            screen: TimerScreen_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Timer Screen',
            },
        },
        NavSignInScreen: {
            screen: AppLoginStack,
            //SignInScreen_StackNavigator,
        },
        NavMyPageScreen: {
            screen: MyPageStack,
        },
    },
    {
        contentComponent: CustomSidebarMenu,
        drawerWidth: Dimensions.get('window').width - 130
    }
);
export default createAppContainer(DrawerNavigatorRoute);
