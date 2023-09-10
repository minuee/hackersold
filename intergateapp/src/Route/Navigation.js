import React from 'react';
import { View,StyleSheet,Dimensions,Image,TouchableOpacity,Text,StatusBar,Platform,ScrollView, SafeAreaView} from 'react-native';
import {createAppContainer,NavigationEvents,NavigationActions} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator,HeaderBackButton} from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

import CustomSidebarMenu from './DrawerMenu'; //마이페이지
//Import all the screens
import MainTopTabs from './MainTopTabs';
import CommonHeader  from './CommonHeader';


//마이페이지
import MyPageScreen from '../Screens/MyPage/IntroScreen'; //마이페이지
import FreeBoard from '../Screens/Board/FreeBoard'; // 자유게시판
import CustomService from '../Screens/MyPage/CustomService';
import HackersFamily from '../Screens/MyPage/HackersFamily';
import FaqDetailScreen from '../Screens/MyPage/FaqDetailScreen';
import NoticeDetailScreen from '../Screens/MyPage/NoticeDetailScreen';
import MySettleScreen from '../Screens/MyPage/MySettleScreen';
import SettleDetail from '../Screens/Order/SettleDetail';
import BankBookDetail from '../Screens/Order/BankBookDetail';
import CartScreen from '../Screens/Order/CartScreen';
import RequestToHackers from '../Screens/MyPage/RequestToHackers'

import SetupScreen from '../Screens/Setup/SetupScreen';
import SetupPushNewsScreen from '../Screens/Setup/SetupPushNewsScreen';
import SetupViewPrivate from '../Screens/Setup/SetupViewPrivate';

import SetupMyInterest from '../Screens/Setup/SetupMyInterest';

import FreeBoardDetail from '../Screens/Board/FreeBoardDetail';
import FreeBoardWrite from '../Screens/Board/FreeBoardWrite';

//추천강의
import LectureDetailScreen from '../Screens/Recomm/LectureDetailScreen';
import LectureSettleInputScreen from '../Screens/Recomm/LectureSettleInputScreen'
import LectureSettleScreen from '../Screens/Recomm/LectureSettleScreen'

//교재MP3
import TextBookDetail from '../Screens/TextBook/TextBookDetail';
import FreeMP3Detail from '../Screens/TextBook/FreeMP3Detail';

//수강후기/합격수기
import ReviewDetailScreen from '../Screens/Review/ReviewDetailScreen';
import LectureWriteForm from '../Screens/Review/LectureWriteForm';
import PassWriteForm from '../Screens/Review/PassWriteForm';

//Screens
import SignInScreen from '../Screens/SignIn/IntroScreen'; // 로그인

// 마이클래스
// import MyClassTopTabs from './MyClassTopTabs'; // 마이클래스 > 나의 강좌 목록
import MyClassScreen from '../Screens/MyClass/MyClassScreen'; // 마이클래스 > 나의 강좌 목록
import MyClassFilterScreen from '../Screens/MyClass/MyClassFilterScreen'; // 마이클래스 > 필터
import ApplyClassScreen from '../Screens/MyClass/ApplyClassScreen'; // 마이클래스 > 수강 신청
import MyMP3DetailScreen from '../Screens/MyClass/MyMP3DetailScreen'; // 마이클래스 > 나의MP3 > 상세

// 무료학습
import FreeDataIntroScreen from '../Screens/FreePractice/FreeDataIntroScreen';
import FreeDataMaterialDetail from '../Screens/FreePractice/FreeDataMaterialDetail';
import FreeDataExamDetail from '../Screens/FreePractice/FreeDataExamDetail';
import FreeLectureList from '../Screens/FreePractice/FreeLectureList';
import FreeLectureDetail from '../Screens/FreePractice/FreeLectureDetail';
import PracticeLevelDetail from '../Screens/FreePractice/PracticeLevelDetail';
import PracticeDailyDetail from '../Screens/FreePractice/PracticeDailyDetail';

//결제모듈 호출
import Payment from '../Screens/Settle/Payment'
import LecturePayResult from '../Screens/Settle/LecturePayResult'; //수강신청 결과페이지

//결제모듈 테스트
import TestSettle from '../Screens/Settle/TestSettle';

//여기서부터 메인스택
global.currentScreenIndex = 0;

const HeaderBackButtonNull=(props)=>{            
    return (
        <View />
    )
}


const NavigationDrawerStructure=(props)=>{            
    return (
        <View>            
            <TouchableOpacity onPress= {()=> props.navigationProps.navigate('NavMyPageScreen')} style={{paddingRight:10}}>
                <Icon name="user" size={Platform.OS === 'ios' ? 25 : 20} color="#000000" />
            </TouchableOpacity>
        </View>
    )
}

const HeaderRightCloseButton = (props) => {
  return (
    <View>
      <TouchableOpacity onPress= {()=> props.navigation.goBack(null)} style={{paddingRight:25}}>
        <Image source={require('../../assets/icons/btn_close_page.png')} style={{width: 16, height: 16}} />
      </TouchableOpacity>
    </View>
  );
};


const HomeScreen_StackNavigator = createStackNavigator({
        MainTopTabs: {
            screen: MainTopTabs,
            navigationOptions: ({ navigation, screenProps}) => ({
                //headerLeft: <View style={{flex:1,textAlign:'center',alignItems:'center',paddingLeft : 10}}><Image source={require('../../assets/logo/top_logo_bigple.png')} style={{width: 80}} resizeMode='contain' /></View>,
                headerTitle: <CommonHeader navigationProps={navigation} screenProps={screenProps} />,
                //headerRight: <NavigationDrawerStructure navigationProps={navigation} />,
                headerStyle: {
                    backgroundColor: '#fff',
                    borderBottomWidth: 0,    
                    shadowOffset: { height: 0, width: 0 },
                    shadowOpacity: 0,
                    elevation:0,
                    height : screenProps.topHeight

                },
                //safeAreaInsets: { top: 0 },
                headerTintColor: '#fff'
            }),
        },
        Payment : { //마이클래스
            screen : Payment,
            navigationOptions: ({ navigation }) => ({
                //headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
                //headerTitle: '결제하기',
                //headerRight : <View style={{flex:1,flexGrow:1}} />,
                headerStyle: {
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                }
            },
            {
                mode: 'modal',
            }),
        }, 
        LecturePayResult : {
            screen : LecturePayResult,
            navigationOptions: ({ navigation }) => ({
                headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
                headerTitle: <View style={{flex:1,flexGrow:1,alignItems:'center',justifyContent:'center'}} ><Text style={{color:'#fff'}}>결제완료</Text></View>,
                headerRight : <View style={{flex:1,flexGrow:1}} />,
                headerStyle: {
                    backgroundColor: DEFAULT_COLOR.lecture_base,
                    color : '#fff',                    
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
            }),
        }, 
        LectureDetailScreen :{
            screen: LectureDetailScreen ,            
            navigationOptions: ({ navigation }) => ({
                //header: (headerOptions) => Platform.OS === 'ios' ? null : <HeaderBackButtonNull />,
                header : null
                //headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
                //headerTitle: '강의상세',
                //headerRight : <View style={{flex:1,flexGrow:1}} />,
                /*
                headerStyle: {
                    backgroundColor: DEFAULT_COLOR.lecture_base,
                    height : Platform.OS === 'android' ? 50 : 40, //35 : 30,
                    color : '#fff',
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
                */
                
            }),
        },
        LectureSettleInputScreen :{
            screen: LectureSettleInputScreen ,
            navigationOptions: ({ navigation }) => ({
                //headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
                //headerTitle: '결제하기',
                //headerRight : <View style={{flex:1,flexGrow:1}} />,
                headerStyle: {
                    backgroundColor: DEFAULT_COLOR.lecture_base,
                    color : '#fff',                    
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
            }),
        },
        LectureSettleScreen :{
            screen: LectureSettleScreen ,
            navigationOptions: ({ navigation }) => ({
                //headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
                //headerTitle: '결제하기2',
                //headerRight : <View style={{flex:1,flexGrow:1}} />,
                headerStyle: {
                    backgroundColor: DEFAULT_COLOR.lecture_base,
                    color : '#fff',                    
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
            }),
        },
        CustomService : {
            screen: CustomService ,
            navigationOptions: ({ navigation }) => ({             
                drawerLabel: 'CustomService',
                drawerLockMode: "locked-closed",
                header : null
            }),

        },
        FreeBoard :{
            screen: FreeBoard,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: 'FreeBoard',
                drawerLockMode: "locked-closed",
                header : null
            }),
        },
        FreeBoardDetail :{
            screen: FreeBoardDetail ,
            navigationOptions: ({ navigation }) => ({
                headerStyle: {
                    backgroundColor: DEFAULT_COLOR.lecture_base,
                    color : '#fff',                    
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
                /*
                headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
                headerTitle: <View style={{flex:1,flexGrow:1,alignItems:'center',justifyContent:'center'}} ><Text style={{color:'#fff'}}>게시글 상세</Text></View>,
                headerRight : <View style={{flex:1,flexGrow:1}} />,
                headerStyle: {
                    backgroundColor: DEFAULT_COLOR.lecture_base,
                    color : '#fff',                    
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
                */
            }),
        },
        FreeBoardDetail2 :{
            screen: FreeBoardDetail ,
            navigationOptions: ({ navigation }) => ({
                headerLeft: <HeaderBackButton onPress={() => {
                    navigation.goBack(null);
                    navigation.toggleDrawer()
                }}  
                />,
                headerTitle: <View style={{flex:1,flexGrow:1,alignItems:'center',justifyContent:'center'}} ><Text style={{color:'#fff'}}>게시글 상세</Text></View>,
                headerRight : <View style={{flex:1,flexGrow:1}} />,
                headerStyle: {
                    backgroundColor: DEFAULT_COLOR.lecture_base,
                    color : '#fff',                    
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
            }),
        },
        CartScreen : {
            screen: CartScreen ,
            navigationOptions: ({ navigation }) => ({
                headerLeft: <HeaderBackButton onPress={() => {
                    navigation.goBack(null);
                    navigation.toggleDrawer()
                }}  
                />,
                headerTitle: <View style={{flex:1,flexGrow:1,alignItems:'center',justifyContent:'center'}} ><Text style={{color:'#fff'}}>장바구니</Text></View>,
                headerRight : <View style={{flex:1,flexGrow:1}} />,
                headerStyle: {
                    backgroundColor: DEFAULT_COLOR.lecture_base,
                    color : '#fff',                    
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
            }),  
        },
        RequestToHackers : {
            screen: RequestToHackers ,
            navigationOptions: ({ navigation }) => ({
                headerLeft: <HeaderBackButton onPress={() => {
                    navigation.goBack(null);
                }}  
                />,
                headerTitle: null,
                headerRight : null,
                headerStyle: {
                    backgroundColor: DEFAULT_COLOR.input_bg_color,
                    color : '#fff',
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
            }),  
        },
        RequestToHackers2 : {
            screen: RequestToHackers ,
            navigationOptions: ({ navigation }) => ({
                headerLeft: <HeaderBackButton onPress={() => {
                    navigation.goBack(null);
                    navigation.toggleDrawer()
                }}  
                />,
                headerTitle: null,
                headerRight : null,
                headerStyle: {
                    backgroundColor: DEFAULT_COLOR.input_bg_color,
                    color : '#fff',
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
            }),  
        },
        SetupMyInterest : {
            screen: SetupMyInterest ,
            navigationOptions: ({ navigation }) => ({
                headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
                headerTitle: <View style={{flex:1,flexGrow:1,alignItems:'center',justifyContent:'center'}} ><Text style={{color:'#fff'}}>관심분야 수정</Text></View>,
                headerRight : <View style={{flex:1,flexGrow:1}} />,
                headerStyle: {
                    backgroundColor: DEFAULT_COLOR.lecture_base,
                    color : '#fff',                    
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
            }),  
        },
        SetupScreen : {
            screen: SetupScreen ,
            navigationOptions: ({ navigation }) => ({
                headerLeft: <HeaderBackButton onPress={() => {
                    navigation.goBack(null);
                    navigation.toggleDrawer()
                }}  
                />,
                headerTitle: <View style={{flex:1,flexGrow:1,alignItems:'center',justifyContent:'center'}} ><Text style={{color:'#fff'}}>설정</Text></View>,
                headerRight : <View style={{flex:1,flexGrow:1}} />,
                headerStyle: {
                    backgroundColor: DEFAULT_COLOR.lecture_base,
                    color : '#fff',                    
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
            }),  
        },
        SetupPushNewsScreen : {
            screen: SetupPushNewsScreen ,
            navigationOptions: ({ navigation }) => ({
                headerLeft: <HeaderBackButton onPress={() => {
                    navigation.goBack(null);                    
                }}  
                />,
                headerTitle: <View style={{flex:1,flexGrow:1,alignItems:'center',justifyContent:'center'}} ><Text style={{color:'#fff'}}>새로운 소식알림</Text></View>,
                headerRight : <View style={{flex:1,flexGrow:1}} />,
                headerStyle: {
                    backgroundColor: DEFAULT_COLOR.lecture_base,
                    color : '#fff',                    
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
            }),  
        },
        SetupViewPrivate : {
            screen: SetupViewPrivate ,
            navigationOptions: ({ navigation }) => ({
                headerLeft: <HeaderBackButton onPress={() => {
                    navigation.goBack(null);                    
                }}  
                />,
                headerTitle: <View style={{flex:1,flexGrow:1,alignItems:'center',justifyContent:'center'}} ><Text style={{color:'#fff'}}>개인정보 처리방침</Text></View>,
                headerRight : <View style={{flex:1,flexGrow:1}} />,
                headerStyle: {
                    backgroundColor: DEFAULT_COLOR.lecture_base,
                    color : '#fff',                    
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
            }),  
        },
        MySettleScreen :{
            screen: MySettleScreen ,
            navigationOptions: ({ navigation }) => ({
                headerLeft: <HeaderBackButton onPress={() => {
                    navigation.goBack(null);
                    navigation.toggleDrawer()
                    }
                }  />,
                headerTitle: <View style={{flex:1,flexGrow:1,alignItems:'center',justifyContent:'center'}} ><Text style={{color:'#fff'}}>결제내역</Text></View>,
            headerRight : <View style={{flex:1,flexGrow:1,paddingRight:10}} ><TouchableOpacity onPress={navigation.getParam('onPressOpenModal')}><Image source={require('../../assets/icons/btn_info.png')} style={{width:20,height:20}} /></TouchableOpacity></View>,
                headerStyle: {
                    backgroundColor: DEFAULT_COLOR.lecture_base,
                    color : '#fff',                    
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
            }),
        },
        SettleDetail : {
            screen : SettleDetail,
            navigationOptions: ({ navigation }) => ({
                headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
                headerTitle: <View style={{flex:1,flexGrow:1,alignItems:'center',justifyContent:'center'}} ><Text style={{color:'#fff'}}>결제상품정보</Text></View>,
                headerRight : <View style={{flex:1,flexGrow:1}} />,
                headerStyle: {
                    backgroundColor: DEFAULT_COLOR.lecture_base,
                    color : '#fff',                    
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
            }),
        }, 
        BankBookDetail : {
            screen : BankBookDetail,
            navigationOptions: ({ navigation }) => ({
                headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
                headerTitle: <View style={{flex:1,flexGrow:1,alignItems:'center',justifyContent:'center'}} ><Text style={{color:'#fff'}}>승인처리현황</Text></View>,
                headerRight : <View style={{flex:1,flexGrow:1}} />,
                headerStyle: {
                    backgroundColor: DEFAULT_COLOR.lecture_base,
                    color : '#fff',                    
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
            }),
        }, 
        FreeBoardWrite :{
            screen: FreeBoardWrite ,
            navigationOptions: {
                headerStyle: {      
                    borderBottomWidth: 0,              
                    backgroundColor: DEFAULT_COLOR.lecture_base,
                },
                headerTintColor: DEFAULT_COLOR.lecture_base,
            },
        },
        HackersFamily : {
            screen: HackersFamily ,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: 'HackersFamily',
                drawerLockMode: "locked-closed",
                header : null
            }),
        },
        FaqDetailScreen :{
            screen: FaqDetailScreen ,
            navigationOptions: ({ navigation }) => ({
                headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
                headerTitle: <View style={{flex:1,flexGrow:1,alignItems:'center',justifyContent:'center'}} ><Text style={{color:'#fff'}}>FAQ 상세</Text></View>,
                headerRight : <View style={{flex:1,flexGrow:1}} />,
                headerStyle: {
                    backgroundColor: DEFAULT_COLOR.lecture_base,
                    color : '#fff',                    
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
            }),
        },
        NoticeDetailScreen :{
            screen: NoticeDetailScreen ,
            navigationOptions: ({ navigation }) => ({
                headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
                headerTitle: <View style={{flex:1,flexGrow:1,alignItems:'center',justifyContent:'center'}} ><Text style={{color:'#fff'}}>공지사항 상세</Text></View>,
                headerRight : <View style={{flex:1,flexGrow:1}} />,
                headerStyle: {
                    backgroundColor: DEFAULT_COLOR.lecture_base,
                    color : '#fff',                    
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
            }),
        },
        TextBookDetail :{
            screen: TextBookDetail ,
            navigationOptions: ({ navigation }) => ({
                /*
                headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
                headerTitle: '강의상세',
                headerRight : <View style={{flex:1,flexGrow:1}} />,
                headerStyle: {
                    backgroundColor: '#2593C3',
                    color : '#fff',                    
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
                */
               header : null
            }),
        },
        LectureWriteForm :{
            screen: LectureWriteForm ,
            navigationOptions: {
                headerStyle: {      
                    borderBottomWidth: 0,              
                    backgroundColor: DEFAULT_COLOR.lecture_base,
                },
                headerTintColor: DEFAULT_COLOR.lecture_base,
            },
        },
        PassWriteForm :{
            screen: PassWriteForm ,
            navigationOptions: {
                headerStyle: {                    
                    borderBottomWidth: 0,
                    backgroundColor: DEFAULT_COLOR.lecture_base,
                },
                headerTintColor: DEFAULT_COLOR.lecture_base,
            },
        },
        ReviewDetailScreen : {
            screen: ReviewDetailScreen ,
            navigationOptions: ({ navigation }) => ({
                headerLeft: <HeaderBackButton onPress={() => {
                    navigation.goBack(null);
                    navigation.toggleDrawer()
                }}  
                />,
                headerTitle : <View style={{flex:1,flexGrow:1,alignItems:'center',justifyContent:'center'}} ><Text style={{color:'#fff'}}>후기 상세</Text></View>,
                headerRight : <View style={{flex:1,flexGrow:1}} />,
                headerStyle: {
                    backgroundColor: '#92b0be',
                    color : '#fff',                    
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
            }),  
        },
        FreeMP3Detail :{
            screen: FreeMP3Detail ,
            navigationOptions: ({ navigation }) => ({               
               header : null
            }),
        },
        TestSettle : { //마이클래스
            screen : TestSettle,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: 'TestSettle',
                drawerLockMode: "locked-closed",
            },
            {
                //mode: 'modal',
            }),
        },
        MyClassScreen : { //마이클래스> 나의 강좌 목록
            screen : MyClassScreen,
            navigationOptions: ({navigation}) => ({
                header : null
            }),
          },
        MyClassFilterScreen : { //마이클래스 > 필터
            screen : MyClassFilterScreen,
            navigationOptions: ({navigation}) => ({
                headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
                headerTitle: null,
                headerRight : <View style={{flex:1,flexGrow:1}} />,
                headerStyle: {
                    backgroundColor: DEFAULT_COLOR.lecture_base,
                    color : '#fff',
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
            }),
        },
        ApplyClassScreen : { //마이클래스 > 수강신청
            screen : ApplyClassScreen,
        },
        MyMP3DetailScreen: {  // 마이클래스 > 나의MP3 > 상세
            screen: MyMP3DetailScreen ,
            navigationOptions: ({ navigation }) => ({               
               header : null
            }),
        },
        MyPageScreen : { 
            screen : MyPageScreen,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: 'MyPageScreen',
                drawerLockMode: "locked-closed",
            },
            {
                //mode: 'modal',
            }),
        },
        SignInScreen : {
            screen : SignInScreen,
            navigationOptions: ({navigation}) => ({
                headerLeft: null,
                headerTitle: null,
                headerRight : <HeaderRightCloseButton navigation={navigation} />,
                headerStyle: {
                    backgroundColor: null,
                    color : '#fff',
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
            }),
        },
        FreeDataIntroScreen :{
            screen: FreeDataIntroScreen,
            navigationOptions: ({ navigation }) => ({
                header : null
            }),
            /*
            navigationOptions: ({ navigation }) => ({
                headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)}  />,
                headerTitle: '무료 학습자료',
                headerRight : <View style={{flex:1,flexGrow:1}} />,
                headerStyle: {
                    //backgroundColor: COMMON_STATES.lectureStaturbarColor,
                    color : '#fff',
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor :'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#fff',
            }),
            */
        },
        PracticeLevelDetail :{
            screen: PracticeLevelDetail,
            navigationOptions: ({ navigation }) => ({
                header : null
            }),
        },
        PracticeDailyDetail :{
            screen: PracticeDailyDetail,
            navigationOptions: ({ navigation }) => ({
                header : null
            }),
        },
        FreeDataMaterialDetail :{
            screen: FreeDataMaterialDetail,
            navigationOptions: ({ navigation }) => ({
                header : null
            }),
        },
        FreeDataMaterialDetail2 :{
            screen: FreeDataMaterialDetail,
            navigationOptions: ({ navigation }) => ({
                header : null
            }),
        },
        FreeDataExamDetail :{
            screen: FreeDataExamDetail,
            navigationOptions: ({ navigation }) => ({
                header : null
            }),
        },
        FreeLectureList :{
            screen: FreeLectureList,
            navigationOptions: ({navigation}) => ({
                header: null,
                drawerLockMode: "locked-closed",
            })
        },
        FreeLectureDetail :{
            screen: FreeLectureDetail,
            navigationOptions: ({navigation}) => ({
                header: null,
                drawerLockMode: "locked-closed",
            })
        },
        FreeLectureDetail2 :{
            screen: FreeLectureDetail,
            navigationOptions: ({navigation}) => ({
                header: null,
                drawerLockMode: "locked-closed",
            })
        },
    }
);


const DrawerNavigatorRoute = createDrawerNavigator(
    {
        
        NavHomeScreen: {
            screen: HomeScreen_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Home Screen ',
                //drawerLockMode: "locked-closed",
            },
        },
    },
    {
        contentComponent: CustomSidebarMenu,
        drawerPosition:'right',
        drawerWidth: Dimensions.get('window').width
    }
);


export default createAppContainer(DrawerNavigatorRoute);