import React from 'react';
import {Text,View,StyleSheet,BackHandler,ToastAndroid,Platform,Alert,StatusBar,Image,SafeAreaView,Dimensions,ScrollView,PixelRatio,PermissionsAndroid,TouchableOpacity, ImageBackground
} from 'react-native';
import AppIntroSlider from './src/Utils/Intro/AppIntroSlider.js';
import * as NetInfo from "@react-native-community/netinfo"
import 'react-native-gesture-handler';
import RNExitApp from 'react-native-exit-app';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import { CheckBox } from 'react-native-elements';
import {PERMISSIONS, RESULTS, check,request,checkMultiple,requestNotifications, openSettings} from 'react-native-permissions';
import 'moment/locale/ko'
import  moment  from  "moment";
import firebase from 'react-native-firebase';
import Orientation from 'react-native-orientation';
import { Overlay } from 'react-native-elements';
import CryptoJS from "react-native-crypto-js";
import { Provider } from 'react-redux';
import initStore from './src/Ducks/mainStore';
const store = initStore();
const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
const TodayTimeStamp = moment()+840 * 60 * 1000;  // 서울
const Tomorrow = moment(Tomorrow).add(1, 'day').format('YYYY-MM-DD');
import AppHomeStack from './src/Route/Navigation';

//공통상수
import  * as getDEFAULT_CONSTANTS   from './src/Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from './src/Utils/CommonUtil';
import CommonFuncion from './src/Utils/CommonFunction';

import {CustomTextR, CustomTextB, TextRobotoM,TextRobotoR} from './src/Style/CustomText';

import NetworkDisabled from './src/Utils/NetworkDisabled';
import FrontPopLayer from './FrontPopLayer';
//관심분야 설정
import InterestSelect from './InterestSelect';
import CommonFunction from './src/Utils/CommonFunction';
import { and } from 'react-native-reanimated';

const ExpireDate = Date.parse(new Date(Tomorrow + 'T04:00:00'));
export default class App extends React.PureComponent {

    constructor(props) {
        super(props);
       
        this.state = {   
            loading : true,
            interestMode : 'new',
            fcmToken : null,
            showRealApp: true,
            showPermission : true,
            showAttention : false,
            interestCodeGNB : [],
            isConnected : true, 
            exitApp : false,
            exitApp2 : false,
            LoginToken: null,
            currentScreenIndex : 1,
            deviceId : null,
            deviceName : null,
            deviceModel : null,
            isPopUP : true,
            modalVisible : false,
            popViewCheck : false,
            orientation : '',
            popLayer : [],
            popLayerView : false,
            closePopLayer : this.closePopLayer.bind(this),
            topHeight : DEFAULT_CONSTANTS.topHeight,
            resizeTopHeader : this.resizeTopHeader.bind(this),
            setExitAppDisable : this.setExitAppDisable.bind(this),
            setMyInterest : this.setMyInterest.bind(this),
            handleBackButton : this.rootHandleBackButton.bind(this),
            attentionSelectCode : null,
            attentionSelectName : null,
            attentionSelectRGB : DEFAULT_COLOR.base_color_222,
            interestCode : [],
            orientation : '',
            wasSetPermission: false,
            isCoachMark : false,
            isCoachMarkAgain : false,
            coachwidth : SCREEN_WIDTH,
            coachHeight : SCREEN_HEIGHT
        };
       
    }    

    getOrientation = () => {        
        if( this.rootView ){            
            if( Dimensions.get('window').width < Dimensions.get('window').height ){                
                this.setState({ orientation: 'portrait' });
            }else{                
                this.setState({ orientation: 'landscape' });
            }
        }
    }

    resizeTopHeader = async( istopHeight) => {
        if ( istopHeight > 0 && istopHeight < DEFAULT_CONSTANTS.hideTopHeight ) {
            this.setState({
                topHeight: DEFAULT_CONSTANTS.topHeight - istopHeight
            })
        }else if ( istopHeight <= 0 ) {
            this.setState({
                topHeight: DEFAULT_CONSTANTS.topHeight
            })
        }else{
            this.setState({
                topHeight: DEFAULT_CONSTANTS.hideTopHeight
            })
        }
        //this.setState({topHeight: istopHeight});
    }



    checkNetwork = async() => {
        //console.log('checkNetwork')
        if (Platform.OS === "android") {
            NetInfo.addEventListener(state => {
                this.setState({isConnected: state.isConnected});
            });
        }else{
            NetInfo.isConnected.addEventListener(
              "connectionChange",
              this.handleFirstConnectivityChange
            );
        }
    }
    
    handleFirstConnectivityChange = isConnected => {
        NetInfo.isConnected.removeEventListener(
          "connectionChange",
          this.handleFirstConnectivityChange
        );        
        this.setState({isConnected: isConnected});        
    };

    
    async UNSAFE_componentWillMount() {
   
        //AsyncStorage.removeItem('isRegistToken');
        await this.checkNetwork();        
        //await this.fcmCheckPermission();
        //console.log('network , ',this.state.isConnected)
        if ( this.state.isConnected ) {
            //console.log('network 22222, ',this.state.isConnected)
            //introduce check
            this.checkStorageFirstOpen();
            await this.checkStorageAttentionOpen();
            const initial = Orientation.getInitialOrientation();        
            //가로 모드 중지
            Orientation.lockToPortrait();
            //Orientation.unlockAllOrientations();
            //Orientation.lockToLandscapeLeft();
            
            const wasSetPermission = await AsyncStorage.getItem('wasSetPermission');
            const isShowCoachMark = await AsyncStorage.getItem('isShowCoachMark');

            this.setState({ 
                deviceId: DeviceInfo.getUniqueId(),
                deviceName: DeviceInfo.getDeviceName(),
                deviceModel: DeviceInfo.getModel(),
                wasSetPermission: wasSetPermission === 'true',
                isShowCoachMark: isShowCoachMark && isShowCoachMark === 'true' || true,
            });
            
            BackHandler.addEventListener('hardwareBackPress', this.rootHandleBackButton);     
           
            //FCM 확인 
            //this.checkPermission();
            //this.messageListener();   > CommonHEADER Move

            // 로컬에 저장된 로그인정보에서 자동 로그인이 아니면 로그아웃 후 시작
            const isAutoLogin = await CommonUtil.isAutoLogin();
            if (!isAutoLogin) {
                CommonUtil.logout();
            }
        }
        this.checkCoachMark();
        this.setAppUUID();

        
    }

    checkCoachMark = async() => {
        
        const popLayerCoach = await AsyncStorage.getItem('popLayerCoach');        
        if ( popLayerCoach === null || typeof popLayerCoach === 'undefined' ) {
            this.setState({
                isCoachMark : true
            })
        }
    }

    appUUIDSetup = async() => {

        //console.log('DeviceInfo.getBrand()',DeviceInfo.getBrand())
        //console.log('DeviceInfo.getModel()',DeviceInfo.getModel())
        //console.log('DeviceInfo.getManufacturer()',DeviceInfo.getMacAddressSync())
        //console.log('DeviceInfo.getUniqueId()',DeviceInfo.getUniqueId())
        // Encrypt
        //let saltkey = DeviceInfo.getMacAddressSync().replace(":",'') + DEFAULT_CONSTANTS.appID;
        //console.log('salt key ',saltkey)
        //let ciphertext = CryptoJS.AES.encrypt(DeviceInfo.getUniqueId().replace("-",""), saltkey).toString();
        let makeUUID =  DeviceInfo.getMacAddressSync() + DeviceInfo.getUniqueId();
        let makeUUID2 =  DeviceInfo.getUniqueId();
        var ciphertext = DEFAULT_CONSTANTS.appID + CryptoJS.MD5(makeUUID).toString() + CryptoJS.MD5(makeUUID2).toString() ; 
        //console.log('hashedPassword.2',ciphertext)
        //let ciphertextTmp = await CommonFunction.mixedString(DeviceInfo.getUniqueId().replace("-",""),saltkey.toString());
        //let ciphertext = CryptoJS.AES.encrypt(ciphertextTmp,hashedPassword).toString();
        //console.log('UUIDDeviceInfo.',ciphertext)
        try {
            const appUUID = await AsyncStorage.getItem('UUID');
            if(appUUID === null) {  
                await AsyncStorage.setItem('UUID',ciphertext );
            }
            const registToken = await AsyncStorage.getItem('isRegistToken');
            console.log('registToken , ',registToken);
            if(registToken === null) {  
                this.registToken(ciphertext);
            }
        } catch(e) {                        
             
        }
    }

    setAppUUID = async() => {

        let makeUUID =  DeviceInfo.getMacAddressSync() + DeviceInfo.getUniqueId();
        let makeUUID2 =  DeviceInfo.getUniqueId();
        var ciphertext = DEFAULT_CONSTANTS.appID + CryptoJS.MD5(makeUUID).toString() + CryptoJS.MD5(makeUUID2).toString() ; 
        try {
            const appUUID = await AsyncStorage.getItem('UUID');            
            if(appUUID === null) {  
                await AsyncStorage.setItem('UUID',ciphertext );
            }        
        } catch(e) {                        
             
        }
    }

    UNSAFE_componentWillUnmount() {        
        Orientation.getOrientation((err, orientation) => {
            //console.log(`Current Device Orientation: ${orientation}`);
        });
        Orientation.removeOrientationListener(this._orientationDidChange);
    }
    
    componentDidMount() {
        if ( this.state.isPopUP ) {
            //this.getStorageCookie();
        }
        this.getStorageData();//    별도 페이지에서 로그인 여부를 처리중이라 패스
        //fmc token regist
       
        Orientation.addOrientationListener(this._orientationDidChange);

        this.getOrientation();
    
        Dimensions.addEventListener( 'change', () =>    {
            console.log('Dimensions.addEventListener')
            this.getOrientation();
        });
    }

    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보

    }

    permissionAlert = callback => {
        Alert.alert(
            "해커스통합앱",
            "앱을 사용하기 위해\n접근 권한 허용이 필요합니다.",
            [
                {text: '권한설정', onPress: () => callback && callback()},
                {text: '취소', onPress: () => RNExitApp.exitApp()},
            ],
            {
                cancelable: false,
            }
        );
    };

    permissionOpenSettings = () => {
        openSettings().catch(() => console.warn('cannot open settings'));
    };

    // 필수 권한체크
    setupPermissions = async() => {
        await this.fcmCheckPermission();
        await this.appUUIDSetup();
        if ( Platform.OS === 'ios' ) {
            let returnResult = true;
            let permissionStatus = {};
            try {
                // await checkMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE, PERMISSIONS.IOS.PHOTO_LIBRARY, PERMISSIONS.IOS.MEDIA_LIBRARY, PERMISSIONS.IOS.CALENDARS]).then(
                await checkMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE, PERMISSIONS.IOS.PHOTO_LIBRARY]).then(
                    (statuses) => {
                        console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
                        console.log('MICROPHONE', statuses[PERMISSIONS.IOS.MICROPHONE]);
                        console.log('PHOTO_LIBRARY', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]);
                        // console.log('MEDIA_LIBRARY', statuses[PERMISSIONS.IOS.MEDIA_LIBRARY]);
                        // console.log('CALENDARS', statuses[PERMISSIONS.IOS.CALENDARS]);
                        
                        permissionStatus[PERMISSIONS.IOS.CAMERA] = statuses[PERMISSIONS.IOS.CAMERA];
                        permissionStatus[PERMISSIONS.IOS.MICROPHONE] = statuses[PERMISSIONS.IOS.MICROPHONE];
                        permissionStatus[PERMISSIONS.IOS.PHOTO_LIBRARY] = statuses[PERMISSIONS.IOS.PHOTO_LIBRARY];
                        // permissionStatus[PERMISSIONS.IOS.MEDIA_LIBRARY] = statuses[PERMISSIONS.IOS.MEDIA_LIBRARY];
                        // permissionStatus[PERMISSIONS.IOS.CALENDARS] = statuses[PERMISSIONS.IOS.CALENDARS];

                        // if ( RESULTS.DENIED == statuses[PERMISSIONS.IOS.CAMERA] || RESULTS.BLOCKED == statuses[PERMISSIONS.IOS.CAMERA]  ) {
                        //     console.log('CAMERA result 1 : ', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]);
                        //     // returnResult = false;
                        //     request(PERMISSIONS.IOS.CAMERA ).then((result) => {
                        //         console.log('CAMERA result 2 : ', result);
                        //         if (result === RESULTS.GRANTED) {
                        //             returnResult = true;
                        //         }
                        //     })
                        // }
                        // if ( RESULTS.DENIED == statuses[PERMISSIONS.IOS.MICROPHONE] || RESULTS.BLOCKED == statuses[PERMISSIONS.IOS.MICROPHONE]  ) {
                        //     console.log('MICROPHONE result 1 : ', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]);
                        //     // returnResult = false;
                        //     request(PERMISSIONS.IOS.MICROPHONE ).then((result) => {
                        //         console.log('MICROPHONE result 2 : ', result);
                        //         if (result === RESULTS.GRANTED) {
                        //             returnResult = true;
                        //         }
                        //     })
                        // }
                        // if ( RESULTS.DENIED == statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] || RESULTS.BLOCKED == statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]  ) {
                        //     console.log('PHOTO_LIBRARY result 1 : ', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]);
                        //     // returnResult = false;
                        //     request(PERMISSIONS.IOS.PHOTO_LIBRARY ).then((result) => {
                        //         console.log('PHOTO_LIBRARY result 2 : ', result);
                        //         if (result === RESULTS.GRANTED) {
                        //             returnResult = true;
                        //         }
                        //     })
                        // }
                        // if ( RESULTS.DENIED == statuses[PERMISSIONS.IOS.MEDIA_LIBRARY] || RESULTS.BLOCKED == statuses[PERMISSIONS.IOS.MEDIA_LIBRARY]  ) {
                        //     console.log('MEDIA_LIBRARY result 1 : ', statuses[PERMISSIONS.IOS.MEDIA_LIBRARY]);
                        //     // returnResult = false;
                        //     request(PERMISSIONS.IOS.MEDIA_LIBRARY ).then((result) => {
                        //         console.log('MEDIA_LIBRARY result 2 : ', result);
                        //         if (result === RESULTS.GRANTED) {
                        //             returnResult = true;
                        //         }
                        //     })
                        // }
                        // if ( RESULTS.DENIED == statuses[PERMISSIONS.IOS.CALENDARS] || RESULTS.BLOCKED == statuses[PERMISSIONS.IOS.CALENDARS]  ) {
                        //     // returnResult = false;
                        //     request(PERMISSIONS.IOS.CALENDARS ).then((result) => {
                        //         if (result !== RESULTS.GRANTED) {
                        //             // returnResult = false;
                        //         }
                        //     })
                        // }
                    },
                );

                if ( RESULTS.DENIED == permissionStatus[PERMISSIONS.IOS.CAMERA] || RESULTS.BLOCKED == permissionStatus[PERMISSIONS.IOS.CAMERA]  ) {
                    await request(PERMISSIONS.IOS.CAMERA ).then(result => {
                        if (result !== RESULTS.GRANTED) {
                            returnResult = false;
                        }
                    });
                }
                if ( RESULTS.DENIED == permissionStatus[PERMISSIONS.IOS.PHOTO_LIBRARY] || RESULTS.BLOCKED == permissionStatus[PERMISSIONS.IOS.PHOTO_LIBRARY]  ) {
                    await request(PERMISSIONS.IOS.PHOTO_LIBRARY ).then(result => {
                        if (result !== RESULTS.GRANTED) {
                            returnResult = false;
                        }
                    });
                }
                // TODO:: check => MEDIA_LIBRARY unavailable
                // if ( RESULTS.DENIED == permissionStatus[PERMISSIONS.IOS.MEDIA_LIBRARY] || RESULTS.BLOCKED == permissionStatus[PERMISSIONS.IOS.MEDIA_LIBRARY]  ) {
                //     await request(PERMISSIONS.IOS.MEDIA_LIBRARY ).then(result => {
                //         if (result !== RESULTS.GRANTED) {
                //             returnResult = false;
                //         }
                //     });
                // }
                // 캘린더 권한 체크 안함
                // if ( RESULTS.DENIED == permissionStatus[PERMISSIONS.IOS.CALENDARS] || RESULTS.BLOCKED == permissionStatus[PERMISSIONS.IOS.CALENDARS]  ) {
                //     await request(PERMISSIONS.IOS.CALENDARS ).then((result) => {
                //         if (result !== RESULTS.GRANTED) {
                //         }
                //     })
                // }
                if ( RESULTS.DENIED == permissionStatus[PERMISSIONS.IOS.MICROPHONE] || RESULTS.BLOCKED == permissionStatus[PERMISSIONS.IOS.MICROPHONE]  ) {
                    await request(PERMISSIONS.IOS.MICROPHONE ).then(result => {
                        if (result !== RESULTS.GRANTED) {
                            returnResult = false;
                        }
                    });
                }
                // console.log('iOS Permission returnResult : ', returnResult);
                // if (!returnResult) {
                //     this.permissionAlert(this.permissionOpenSettings);
                // }
            } catch (error) {
                console.log('askPermission', error);
                returnResult = false;
            }

            // await requestNotifications(['alert','badge', 'sound']).then(({status, settings}) => {
            //     console.log('requestNotifications', status);
            // });

            return returnResult;
        } else {
            let returnResult = true;
            try {
                const userResponse = await PermissionsAndroid.requestMultiple([
                    //PermissionsAndroid.PERMISSIONS.READ_CALENDAR,
                    //PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
                    //PermissionsAndroid.PERMISSIONS.CAMERA,
                    //PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    //PermissionsAndroid.PERMISSIONS.SEND_SMS,
                    //PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
                    PermissionsAndroid.PERMISSIONS.CALL_PHONE,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                ]);
                // console.log('PermissionsAndroid.PERMISSIONS.CALL_PHONE : ', PermissionsAndroid.PERMISSIONS.CALL_PHONE);
                // console.log('userResponse : ', userResponse);
                if (userResponse[PermissionsAndroid.PERMISSIONS.CALL_PHONE] !== 'granted' || 
                    userResponse[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] !== 'granted' || 
                    userResponse[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] !== 'granted') {
                        returnResult = false;
                }
                // return userResponse;
                // return returnResult;
            } catch (error) {
                console.log('askPermission', error);
                returnResult = false;
            }

            // console.log('android Permission returnResult : ', returnResult);
            // if (!returnResult) {
            //     this.permissionAlert(this.permissionOpenSettings);
            // }

            return returnResult;

            /*
            try {
                checkMultiple([PERMISSIONS.ANDROID.CALL_PHONE, PERMISSIONS.ANDROID.CAMERA,PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,PERMISSIONS.ANDROID.READ_CALENDAR,PERMISSIONS.ANDROID.WRITE_CALENDAR]).then(
                    (statuses) => {
                        console.log('CALL_PHONE', statuses[PERMISSIONS.ANDROID.CALL_PHONE]);
                        console.log('CAMERA', statuses[PERMISSIONS.ANDROID.CAMERA]);
                        console.log('READ_EXTERNAL_STORAGE', statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]);
                        console.log('READ_CALENDAR', statuses[PERMISSIONS.ANDROID.READ_CALENDAR]);
                        console.log('WRITE_CALENDAR', statuses[PERMISSIONS.ANDROID.WRITE_CALENDAR]);

                        if ( RESULTS.DENIED == statuses[PERMISSIONS.ANDROID.CALL_PHONE] || RESULTS.BLOCKED == statuses[PERMISSIONS.ANDROID.CALL_PHONE]  ) {
                            console.log('CALL_PHONE2222', statuses[PERMISSIONS.ANDROID.CALL_PHONE]);
                            request(PERMISSIONS.ANDROID.CALL_PHONE ).then((result) => {
                                if (result === RESULTS.GRANTED) {
                                    //console.log('CALL_PHONE2222', statuses[PERMISSIONS.ANDROID.CALL_PHONE]);
                                }
                            })
                        }
                        if ( RESULTS.DENIED == statuses[PERMISSIONS.ANDROID.CAMERA] || RESULTS.BLOCKED == statuses[PERMISSIONS.ANDROID.CAMERA]  ) {
                            console.log('CAMERA2222', statuses[PERMISSIONS.ANDROID.CAMERA]);
                            request(PERMISSIONS.ANDROID.CAMERA ).then((result) => {
                                if (result === RESULTS.GRANTED) {
                                   //console.log('CALL_PHONE2222', statuses[PERMISSIONS.ANDROID.CALL_PHONE]);
                                }
                            })
                            
                        }
                        if ( RESULTS.DENIED == statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]  || RESULTS.BLOCKED == statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]  ) {
                            console.log('READ_EXTERNAL_STORAGE33333', statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]);
                            request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE ).then((result) => {
                                if (result === RESULTS.GRANTED) {
                                   
                                }
                            })
                            
                        }
                        if ( RESULTS.DENIED == statuses[PERMISSIONS.ANDROID.READ_CALENDAR] || RESULTS.BLOCKED == statuses[PERMISSIONS.ANDROID.READ_CALENDAR]  ) {
                            console.log('READ_CALENDAR333333', statuses[PERMISSIONS.ANDROID.READ_CALENDAR]);
                            request(PERMISSIONS.ANDROID.READ_CALENDAR ).then((result) => {
                                if (result === RESULTS.GRANTED) {
                                    
                                }
                            })
                            
                        }
                        if ( RESULTS.DENIED == statuses[PERMISSIONS.ANDROID.WRITE_CALENDAR] || RESULTS.BLOCKED == statuses[PERMISSIONS.ANDROID.WRITE_CALENDAR]  ) {
                            console.log('WRITE_CALENDAR444444', statuses[PERMISSIONS.ANDROID.WRITE_CALENDAR]);
                            request(PERMISSIONS.ANDROID.WRITE_CALENDAR ).then((result) => {
                                if (result === RESULTS.GRANTED) {
                                    
                                }
                            })
                            
                        }                        
                       
                    }
                );
            }catch(error) {
                console.log('askPermission', error);
            }
            */
        }
    }

    registToken = async(uuid) => {
        if ( this.state.fcmToken === null ) {

            Alert.alert(
                "해커스통합앱",
                "푸시 발송용 토큰이 정상적으로 발급되지 않았습니다.",
                // "FCM Token이 정상적으로 발생하지 않았습니다.",
                [
                  {text: '확인', onPress: () => console.log('OK Pressed')},
                ],
                {
                    cancelable: false
                }
            );

        }else {
            const formData = new FormData();       
            formData.append('UUID', uuid);        
            formData.append('appID',DEFAULT_CONSTANTS.appID);
            formData.append('OS', Platform.OS);  
            formData.append('token', this.state.fcmToken);
            formData.append('deviceModel', this.state.deviceModel);
            await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/apptoken/regist',{
                method: 'POST', 
                headers: new Headers({
                    Accept: 'application/json',                
                    'Content-Type': 'application/json; charset=UTF-8',
                    'apiKey': DEFAULT_CONSTANTS.apiAdminKey
                }), 
                    body:formData
                },10000
                ).then(response => {
                
                    if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                        if ( response.code === '0000' ) {                        
                            //first reist recrod
                            let registTimeStamp = moment().unix();
                            //console.log('fcm registTimeStamp', registTimeStamp)
                            AsyncStorage.setItem('isRegistToken',registTimeStamp.toString())
                        
                        }
                    }
                })
                .catch(err => {
                    console.log('login error => ', err);
                
            });
        }
    }
    
    _onDone = async() => {
        await AsyncStorage.setItem('isFirstOpen', ExpireDate.toString());
        this.setState({ showRealApp: true });
    };
    _onSkip = async() => {
        await AsyncStorage.setItem('isFirstOpen', ExpireDate.toString());
        this.setState({ showRealApp: true });
    };
    
    /* 여기부터 fcm 설정 */
    fcmCheckPermission = async () => {
        const enabled = await firebase.messaging().hasPermission();
        console.log('fcmCheckPermission enabled : ', enabled);
        if (enabled) {
            this.getFcmToken();
        } else {
            this.requestPermission();
        }
    }
    
    getFcmToken = async () => {
        const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {          
            console.log('fcm Token', Platform.OS, fcmToken)
            this.setState({
                fcmToken : fcmToken
            })
        } else {
          //this.showAlert('Failed', 'No token received');
        }
    }

    requestPermission = async () => {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
        } catch (error) {
            // User has rejected permissions
            console.log('requestPermission error : ', error);
        }
    }
    
    messageListener = async () => {
  
        
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body } = notification;
            this.showAlert(title, body);
        });
    
        //여기가 로컬도 겸용 ios경우
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        });
      
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {        
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        }
    
        
        this.messageListener = firebase.messaging().onMessage((message) => {
          //console.log(JSON.stringify(message));
        });
        
        
    }
    
    
    showAlert = async(title, message) => {       
        Alert.alert(
          title,
          message,
          [
            {text: 'OK111', onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: false},
        );
    }
    /* 여기까지가 fcm 설정 */

    _orientationDidChange = (orientation) => {
        //onsole.log('orientation',orientation);
        if (orientation === 'LANDSCAPE') {
            // do something with landscape layout
            //console.log('LANDSCAPE');
            this.setState({ orientation: 'LANDSCAPE' });
        } else {
            // do something with portrait layout
            //console.log('PORTRAIT');
            this.setState({ orientation: 'PORTRAIT' });
        }
    }
    //
    getStorageData = async () => {
        try {
          const tvalue = await AsyncStorage.getItem('userToken')
          if(tvalue !== null) {            
            this.setState({LoginToken: tvalue});
          }
        } catch(e) {            
            this.setState({LoginToken: null});
        }

        this.setState({
            loading : false
        })
    }

    // 앱설치후 최초에만 나오도록
    checkStorageFirstOpen = async () => {
        try {
          const tisFirstOpen = await AsyncStorage.getItem('isFirstOpen')
          //console.log('tisFirstOpen',tisFirstOpen)
          if(tisFirstOpen !== null) {  
            this.setState({showRealApp: true});
          }else{
            this.setState({showRealApp: false});  
          }
        } catch(e) {                        
            this.setState({showRealApp: false});
        }
    }

    // 앱설치후 최초에만 나오도록 관심종목설정
    checkStorageAttentionOpen = async () => {                
        let myInterestCode = await AsyncStorage.getItem('myInterestCode');
        // console.log('myInterestCode top22 ',Platform.OS , myInterestCode && myInterestCode.length)
        if(myInterestCode !== null) {    
            // 코드 조회             
            let isCanUse = await this.checkeMyInterestcode(JSON.parse(myInterestCode).code, JSON.parse(myInterestCode).info.gnbList)
            //console.log('isCanUse',isCanUse)
            this.setState({showAttention: isCanUse});                
        }else{
            this.setState({showAttention: true});  
        }
    }

    closePopLayer = (bool) => {        
        this.setState({popLayerView : bool})
    }

    closePopCoach = (bool) => {        
        this.setState({isCoachMark : bool})
    }
    closePopCoach2 = async( bool ) => {
        //console.log('boolllll', bool);
        this.setState({isCoachMarkAgain : !bool})
        if ( !bool ) {
            await this.setupCoachStorage();
        }else{     
            
            await AsyncStorage.removeItem('popLayerCoach');
        }       
    }

    setupCoachStorage = async() => {
        try {
            
            await AsyncStorage.setItem('popLayerCoach', '1');
        } catch (e) {
            console.log(e);
        }
    }

    checkeMyInterestcode = async(mcode, gnbList) => {
        let returnCode = false;
        let reGnbList = gnbList;
        let remyClassGnbList = [];
        //await AsyncStorage.removeItem('myGnbMenu')
         //event popLayer check if hide
        //await AsyncStorage.removeItem('myInterestCode');
        const popLayerExpireTime  = await AsyncStorage.getItem('popLayerExpireTime_' + mcode);
        await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/meta/' +  mcode,{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': DEFAULT_CONSTANTS.apiAdminKey
            }), 
                body:null
            },10000
            ).then(response => {
                //console.log('checkeMyInterestcode respons111e',response.data)
                if ( response && typeof response.data !== 'undefined' ) {                    
                    if ( response.code !== '0000' ) {
                        returnCode = true;
                        //console.log("DDDDDD")
                    }else{     
                        // console.log('11111', response.data.interestCode)
                        reGnbList = response.data.menu.gnbList;
                        remyClassGnbList = response.data.menu.myclassList || [];
                        this.checkIndexindex(mcode,response.data.interestCode.interestFieldName,response.data.interestCode,response.data.interestCode.backgroundRGB);
                        // console.log('33333', response.data.interestCode)
                        if ( typeof response.data.popLayer !== 'undefined'){
                            if ( response.data.popLayer.lectureTop.length > 0 ) {
                                const os = Platform.OS === 'ios' ? 'iOS' : 'Android';
                                const arrPopLayer = response.data.popLayer.lectureTop.filter(item => item.osType.includes(os)) || [];
                                let isView = ( popLayerExpireTime === null || popLayerExpireTime < TodayTimeStamp ) ? true : false ;
                                this.setState({
                                    popLayer : arrPopLayer,
                                    popLayerView : isView
                                })
                            }
                        }
                       
                    }
                }
                
            })
            .catch(err => {

        });
        //console.log('returnCode',returnCode)
        await  AsyncStorage.setItem('myGnbMenu',JSON.stringify(reGnbList) );
        await  AsyncStorage.setItem('myClassMenu',JSON.stringify(remyClassGnbList) );
        return returnCode;
    }

    getInterestCode = async() => {
    
        await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/meta',{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': DEFAULT_CONSTANTS.apiAdminKey
            }), 
                body:null
            },10000
            ).then(response => {
                if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                    if ( response.code !== '0000' ) {
                        this.failCallAPi()
                    }else{               
                        //console.log('daaaaa',response.data)
                        this.setState({
                            interestCode : response.data.categories
                        })
                    }
                }
                
            })
            .catch(err => {
                console.log('login error => ', err);
                this.failCallAPi()
        });
       
    }

    failCallAPi = () => {

        let message = "데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);
    
    }

    getStorageCookie = async () => {
        try {
            const expireTime = await AsyncStorage.getItem('expireTime')
            //console.log('Today', TodayTimeStamp);
            //console.log('expireTime', expireTime);
            if( expireTime === undefined || expireTime === null ) {
                //console.log('undefined');
                this.setState({modalVisible: true});
            }else if( expireTime < TodayTimeStamp ) {
                //console.log('expireTime < TodayTimeStamp');
                this.setState({modalVisible: true});
            }else if( expireTime > TodayTimeStamp ) {
                //console.log('expireTime > TodayTimeStamp');
            }
          } catch(e) {            
              this.setState({modalVisible: false});
          }
        
    }
    componentDidUpdate() {
      this.checkNetwork();
    }    

    setExitAppDisable = async(bool = true) => {
        //console.log('setExitAppDisable', bool)
        if ( bool ) {
            BackHandler.addEventListener('hardwareBackPress', this.rootHandleBackButton);     
        }else{
            BackHandler.removeEventListener('hardwareBackPress', this.rootHandleBackButton);     
        }
        
    }

    rootHandleBackButton = () => {
        //console.log('root handleBackButton', TodayTimeStamp);        
        if ( this.state.exitApp ) {
            clearTimeout(this.timeout);
            this.setState({ exitApp: false });
            RNExitApp.exitApp();  // 앱 종료
        } else {
            ToastAndroid.show('한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
            this.setState({ 
                exitApp: true                
            });
            this.timeout = setTimeout(
                () => {
                this.setState({ 
                    exitApp: false
                });
            },
                2000    // 2초
            );                        
        }
        return true;
    };   

    removeCookie = (sval) => {
        this.setState({ popViewCheck: sval }); 
    }

    setCookie = async() => {
        //const ExpireDate = Date.parse(new Date(Tomorrow + 'T04:00:00'));
        try {
            await AsyncStorage.setItem('expireTime', ExpireDate.toString());
        } catch (e) {
            console.log(e);
        }
    }

    closeTopPop = async() => {
        if ( this.state.popViewCheck ) {
            await this.setCookie();
        }
        this.setState({ modalVisible: false }); 
    }

  
    checkIndexindex = async(wcode,wname,wdata,wcolor) => {                
        if ( typeof wcode !== 'undefinded' || wcode !== '' ) {            
            let dataw = [{code : wcode,name: wname,info : wdata,color:wcolor}];
            await AsyncStorage.setItem('myInterestCode',JSON.stringify(dataw[0]) );
        }
    }
    setMyInterest = async(code,name,data,color) => {        
        await this.checkIndexindex(code,name,data,color);
         
        this.setState({ 
            showAttention: false
         })
    }

    androidReConfirm = async () => {
        const returnResult = await this.setupPermissions();
        if (!returnResult) {
            return;
        }

        Alert.alert('', '푸시 알림을 통하여 해커스의 다양한 무료 혜택과 이벤트 등의 광고성 정보를 수신하시겠습니까?\n\n[거부] 설정 > 푸시 알림에서 설정 변경', [
            {text: '허용', onPress: () => this.setNotificationConfig(true)},
            {text: '허용안함', onPress: () => this.setNotificationConfig(false)}
        ], {cancelable: false});
    };

    toggleOverlay2 = async index => {
        const returnResult = await this.setupPermissions();
        if (!returnResult && Platform.OS !== 'ios') {
        // if (!returnResult) {
            // this.permissionAlert(Platform.OS === 'ios' ? this.permissionOpenSettings : this.androidReConfirm);
            this.permissionAlert(this.androidReConfirm);
            return;
        }

        if (Platform.OS === 'ios') {
            await AsyncStorage.setItem('wasSetPermission', 'true');
            this.setState({ wasSetPermission: true, showPermission: false });
        } else {
            Alert.alert('', '푸시 알림을 통하여 해커스의 다양한 무료 혜택과 이벤트 등의 광고성 정보를 수신하시겠습니까?\n\n[거부] 설정 > 푸시 알림에서 설정 변경', [
                {text: '허용', onPress: () => this.setNotificationConfig(true)},
                {text: '허용안함', onPress: () => this.setNotificationConfig(false)}
            ], {cancelable: false});
        }
    }

    setNotificationConfig = async val => {
        CommonFuncion.isSetupPush(val);
        if(val === true ) {  
            let repeatTime = DEFAULT_CONSTANTS.localPushIntervalTime; //60000 60s
            CommonFuncion.setIntervalProess(true,repeatTime,this.props,this.localNotifSetup);
        } else {
            CommonFuncion.setIntervalProess(false);            
        }
        await this.updateSeupPush(val, 'push');
        await AsyncStorage.setItem('wasSetPermission', 'true');
        this.setState({ wasSetPermission: true, showPermission: false });
    }

    updateSeupPush = async(isUse, type='push') => {
        const appUUID = await AsyncStorage.getItem('UUID');
        if (CommonUtil.isEmpty(appUUID)) {
            return;
        }
        const formData = new FormData();
        formData.append('UUID', appUUID);
        formData.append('appID',DEFAULT_CONSTANTS.appID);
        formData.append('isUse', isUse);
        let url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/push/setup';
        if ( type === 'ad') {
            url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/push/setup';
        }
        await CommonUtil.callAPI( url ,{
            method: 'POST', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': DEFAULT_CONSTANTS.apiAdminKey
            }), 
                body:formData
            },10000
            ).then(response => {                
                console.log('response  => ', response);
            })
            .catch(err => {                
                console.log('login error => ', err);
              
        });
    }

    selectAttention = async(data,rgb) => {
        this.setState({ 
            attentionSelectCode: data.InterestFieldID,
            attentionSelectName: data.InterestFieldName,
            attentionSelectColor: rgb
        });
    }

    _renderItem = ({ item }) => {

        const a = 360;
        const b = 660;
        return (
            <View style={{width: SCREEN_WIDTH,height: SCREEN_HEIGHT,alignItems: 'center',justifyContent: 'center',backgroundColor: item.backgroundColor}}>
                <Image
                    style={{width: SCREEN_WIDTH}}
                    source={item.image} 
                    resizeMode='contain'
                />
            </View>
        );
    };

    render() {
        if ( !this.state.isConnected ) {
            return (
                <View style={styles.Rootcontainer}>                    
                   <NetworkDisabled />
                </View>
            );
        } else {            
            //console.log('this.state.showAttention',this.state.showAttention)
            if (this.state.showRealApp) {              
                if (this.state.showAttention) {                    
                    return (
                        <View style={{flex:1,width:SCREEN_WIDTH,height:SCREEN_HEIGHT,backgroundColor:'#fff'}}>
                            <Provider store={store} >
                                <InterestSelect screenState={this.state} screenProps={this.props} />
                            </Provider>
                            {  this.state.attentionSelectCode &&  
                                <TouchableOpacity 
                                    onPress={ () => this.toggleOverlay(this.state.attentionSelectCode) }
                                    style={{height : 50,width:SCREEN_WIDTH,backgroundColor : '#000',alignItems:'center',justifyContent:'center'}}
                                >
                                    <Text style={{color:'#fff', fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium)}}>저장</Text>
                                </TouchableOpacity>
                                
                            }
                        
                        </View>
                    );
                } else {
                    if ( this.state.isCoachMark) {
                        return (
                            
                            <SafeAreaView 
                                style={{
                                    flex:1,
                                    justifyContent:'center',
                                    alignItems:'flex-start',
                                    position:'absolute',left:-1,top:0,bottom:0,right:0,
                                    width:SCREEN_WIDTH+1,
                                    //height:SCREEN_HEIGHT*(this.state.coachHeight/this.state.coachwidth),
                                    height:Platform.OS === 'android' ? (SCREEN_WIDTH*this.state.coachHeight/this.state.coachwidth)+30 : CommonFuncion.isIphoneX() ? (SCREEN_WIDTH*this.state.coachHeight/this.state.coachwidth) + 110: (SCREEN_WIDTH*this.state.coachHeight/this.state.coachwidth)+10,                                    
                                    overflow:'hidden'
                                }}
                            >
                                <View
                                    style={{flex:1,flexDirection:'row',position:'absolute',top:Platform.OS === 'android' ? SCREEN_HEIGHT-70 : CommonFuncion.isIphoneX() ? SCREEN_HEIGHT-70 : SCREEN_HEIGHT-50,left:0,height: Platform.OS === 'android' ? 70 : CommonFuncion.isIphoneX() ? 70 : 50,width:SCREEN_WIDTH,backgroundColor:'#fff',zIndex:100,alignItems:'center',borderTopLeftRadius:15,borderTopRightRadius:15}}
                                >
                                    <View style={{flex:4,flexGrow:1,flexDirection:'row',alignItems:'center',paddingLeft:15}}>
                                        <CheckBox 
                                            containerStyle={{padding:0,margin:0}}   
                                            iconType='font-awesome'
                                            checkedIcon='check-circle'
                                            uncheckedIcon='check-circle'
                                            checkedColor={DEFAULT_COLOR.base_color_222}
                                            uncheckedColor={DEFAULT_COLOR.base_color_ccc}
                                            onPress= {()=> {
                                            this.closePopCoach2(this.state.isCoachMarkAgain)
                                            }}
                                            checked={this.state.isCoachMarkAgain}
                                        />
                                        <CustomTextR  style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12)}}>다시 보지 않기</CustomTextR>
                                    </View>
                                    <TouchableOpacity 
                                        style={{flex:0.2,justifyContent:'flex-end',alignItems:'center'}}
                                        hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
                                        onPress= {()=> {this.closePopCoach(false)}}
                                    >
                                    <Image source={require('./assets/icons/btn_feed_del.png')} resizeMode='contain' style={{width:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}/>
                                    </TouchableOpacity>
                                </View>
                                <Image
                                    onLoad={(value) => {
                                        const { height, width } = value.nativeEvent.source;
                                        //console.log('dddd3333', width, height);                                            
                                        if (this.props.width && !this.props.height) {
                                            this.setState({
                                                coachwidth: this.props.width,
                                                coachHeight: height * (this.props.width / width)
                                            });
                                        } else if (!this.props.width && this.props.height) {
                                            this.setState({
                                                coachwidth: width * (this.props.height / height),
                                                coachHeight: this.props.height
                                            });
                                        } else {
                                            this.setState({ coachwidth: width, coachHeight: height });
                                        }
                                    }}
                                    style={{width: SCREEN_WIDTH+15,zIndex:1}}
                                    //style={{transform: [{ scale: 1}],width:'100%'}}
                                    source={require('./assets/images/img_coach_mark.png')}
                                    resizeMode='contain'
                                />
                                
                            </SafeAreaView>
                            
                        )
                    }else {
                        return (
                            <Provider store={store} >
                                { Platform.OS == 'android' && <StatusBar backgroundColor={'#fff'} translucent={false}  barStyle="dark-content" />}
                                <AppHomeStack 
                                    screenProps={this.state} 
                                    ref={(ref) => {
                                        this.rootView = ref;
                                    }} 
                                />
                                {
                                    
                                    (this.state.popLayer && this.state.popLayer.length > 0 && this.state.popLayerView) &&
                                        <View style={styles.Rootcontainer}>
                                            <Overlay
                                                isVisible={this.state.popLayerView}
                                                windowBackgroundColor="rgba(0, 0, 0, 0.8)"
                                                overlayBackgroundColor="tranparent"
                                                containerStyle={{margin: 0}}>
                                                <FrontPopLayer screenState={this.state} />
                                            </Overlay>
                                        </View>
                                }
                            </Provider>
                        );
                    }
                }
                
            } else {
                
                if (this.state.showPermission && this.state.wasSetPermission !== true) {
                    if ( Platform.OS === 'android') {
                        return (
                            <View style={{flex:1}}>
                                <SafeAreaView style={{ flex:1}}>
                                    
                                    <View style={styles.overrayTop}>
                                        <View style={styles.overrayHeader}>
                                            <CustomTextR style={ styles.headerText }>앱 접근 권한 안내</CustomTextR>
                                        </View>
                                        
                                    </View>                                
                                    <ScrollView style={{backgroundColor:'#fff'}}>
                                        <View style={{flex:1,paddingHorizontal:20,paddingTop:30}}>
                                            <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.6}}>
                                                앱에서 사용하는 접근 권한에 대하여 아래와 같이 안내 해 드립니다. {"\n"}
                                                접근권한은 필수적 접근 권한과 선택적 접근 권한으로 나누어 지며, 선택적 접근 권한의 경우 허용에 동의하지 않으셔도 앱 사용이 가능합니다.{"\n"}
                                            </CustomTextR>
                                            
                                        </View>
                                        <View style={{flex:1,paddingHorizontal:20,marginBottom:10}}>
                                            <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.lecture_base,lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),letterSpacing:-0.75}}>
                                                필수적 접근 권한 
                                            </CustomTextB>
                                        </View>
                                        <View style={{flex:1,flexDirection:'row',flexGrow:1,paddingHorizontal:20,marginBottom:10}}>
                                            <View style={{flex:1}}>
                                                <Image source={require('./assets/icons/icon_approach_media.png')} resizeMode='contain' style={{width:48,height:48}} />
                                            </View>
                                            <View style={{flex:4}}>
                                                <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.7}}>
                                                    저장공간
                                                </CustomTextB>
                                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(12),lineHeight:PixelRatio.roundToNearestPixel(16),color:DEFAULT_COLOR.base_color_666,letterSpacing:-0.6}}>
                                                    기기 사진 미디어 파일 엑세스 권한으로 영상 및 음성을 저장 및 재생을 위해 사용됩니다.
                                                </CustomTextR>
                                            </View>
                                            
                                        </View>
                                        <View style={{flex:1,flexDirection:'row',flexGrow:1,paddingHorizontal:20,marginBottom:10}}>
                                            <View style={{flex:1}}>
                                                <Image source={require('./assets/icons/icon_approach_phone.png')} resizeMode='contain' style={{width:48,height:48}} />
                                            </View>
                                            <View style={{flex:4}}>
                                                <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.7}}>
                                                    전화
                                                </CustomTextB>
                                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:DEFAULT_COLOR.base_color_666,letterSpacing:-0.6}}>
                                                    전화걸기 및 관리 권한으로 PUSH 환경설정을 위해 사용합니다.
                                                </CustomTextR>
                                            </View>
                                        </View>

                                        <View style={{flex:1,flexDirection:'row',paddingHorizontal:20,marginVertical:10}}>
                                            <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.lecture_base,lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),letterSpacing:-0.75}}>
                                                선택적 접근 권한 
                                            </CustomTextB>
                                        </View>
                                        <View style={{flex:1,flexDirection:'row',flexGrow:1,paddingHorizontal:20,marginBottom:10}}>
                                            <View style={{flex:1}}>
                                                <Image source={require('./assets/icons/icon_approach_calendar.png')} resizeMode='contain' style={{width:48,height:48}} />
                                            </View>
                                            <View style={{flex:4,justifyContent:'center'}}>
                                                <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.7}}>
                                                    캘린더
                                                </CustomTextB>
                                            </View>
                                        </View>
                                        
                                        <View style={{flex:1,paddingHorizontal:20,paddingTop:20}}>
                                            <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.6}}>
                                                안드로이드 운영체제 6.0미만 버전 스마트폰을 이용하시는 경우, 선택적 접근 권한 없이 모두 필수적 접근 권한으로 적용될 수 있습니다. 이 경우 운영체제를 6.0이상으로 업그레이드 하신 후 앱을 삭제 후 재설치 하셔야 접근권한 설정이 정상적으로 가능합니다.{"\n"}
                                            </CustomTextR>
                                        </View>
                                        <TouchableOpacity 
                                            onPress={ () => this.setupPermissions() }
                                            style={{flex:1,flexDirection:'row',paddingHorizontal:20,marginVertical:10}}
                                        >
                                            <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:DEFAULT_COLOR.lecture_base,letterSpacing:-0.7,textDecorationLine:'underline'}}>접근권한 설정메뉴 바로가기</CustomTextB>
                                        </TouchableOpacity>
                                        
                                    </ScrollView>
                                    
                                    <View style={{marginVertical:10,marginHorizontal:20}}>
                                        <TouchableOpacity 
                                            onPress={ () => this.toggleOverlay2(null) }
                                            style={{height : 50,width:'100%',backgroundColor : DEFAULT_COLOR.lecture_base ,alignItems:'center',justifyContent:'center',borderRadius:5}}
                                        >
                                            <CustomTextB style={{color: DEFAULT_COLOR.base_color_fff,fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),lineHeight : PixelRatio.roundToNearestPixel(30),letterSpacing : -0.8,textAlign: 'center',
                                            }}>확인</CustomTextB>
                                        </TouchableOpacity>
                                        {/*
                                        <Button
                                            title='확인'
                                            buttonStyle={{ backgroundColor: DEFAULT_COLOR.lecture_base }}
                                            onPress={ () => this.toggleOverlay2(null) }
                                        /> 
                                        */}                                       
                                    </View>
                                </SafeAreaView>
                            </View>
                        );
                    }else{
                        return (
                            <View style={{flex:1}}>
                                <SafeAreaView style={{ flex:1}}>
                                    
                                    <View style={styles.overrayTop}>
                                        <View style={styles.overrayHeader}>
                                            <CustomTextR style={ styles.headerText }>앱 접근 권한 안내</CustomTextR>
                                        </View>
                                        
                                    </View>                                
                                    <ScrollView style={{backgroundColor:'#fff'}}>
                                        <View style={{flex:1,paddingHorizontal:20,paddingTop:30}}>
                                            <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.6}}>
                                                엡에서 사용하는 접근 권한에 대하여 아래와 같이 안내 해 드립니다.
                                            </CustomTextR>
                                            
                                        </View>                                       
                                        
                                        <View style={{flex:1,flexDirection:'row',paddingHorizontal:20,marginVertical:10}}>
                                            <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.lecture_base,lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),letterSpacing:-0.75}}>
                                                선택적 접근 권한 
                                            </CustomTextB>
                                        </View>
                                        <View style={{flex:1,flexDirection:'row',flexGrow:1,paddingHorizontal:20,marginBottom:10}}>
                                            <View style={{flex:4,justifyContent:'center',paddingLeft:10}}>
                                                <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.7}}>
                                                ∙ 저장공간
                                                </CustomTextB>
                                            </View>
                                        </View>
                                        <View style={{flex:1,paddingHorizontal:40}}>
                                            <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.6}}>
                                               기기 사진 미디어 파일 액세스 권한으로 영상 및 음성을 저장 및 재생을 위해 사용됩니다.
                                            </CustomTextR>
                                        </View>
                                        <View style={{flex:1,flexDirection:'row',flexGrow:1,paddingHorizontal:20,marginBottom:10,paddingTop:20}}>
                                            <View style={{flex:4,justifyContent:'center',paddingLeft:10}}>
                                                <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.7}}>
                                                ∙ 알림
                                                </CustomTextB>
                                            </View>
                                        </View>
                                        <View style={{flex:1,paddingHorizontal:40}}>
                                            <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.6}}>
                                               PUSH 환경설정을 위해 사용합니다.
                                            </CustomTextR>
                                        </View>

                                        <View style={{flex:1,flexDirection:'row',flexGrow:1,paddingHorizontal:20,marginBottom:10,paddingTop:20}}>
                                            <View style={{flex:4,justifyContent:'center',paddingLeft:10}}>
                                                <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.7}}>
                                                ∙ 캘린더
                                                </CustomTextB>
                                            </View>
                                        </View>
                                        <View style={{flex:1,paddingHorizontal:40}}>
                                            <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.6}}>
                                               기기에 저장된 일정을 가져오기 위해 사용합니다.
                                            </CustomTextR>
                                        </View>
                                        
                                        <View style={{flex:1,paddingHorizontal:20,marginTop:50}}>
                                            <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.6}}>
                                            ➀ 선택적 접근 권한에 동의하지 않으실 수 있으나, 해당 접근권한이 필요한 일부 기능 사용에 제한이 있을 수 있습니다.{"\n"}
                                            </CustomTextR>
                                        </View>
                                        <View style={{flex:1,paddingHorizontal:20}}>
                                            <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.6}}>
                                            ➁ 동의여부는 언제든 바꿀 수 있습니다.{"\n"} ( 경로 : iOS 설정 → 해커스ONE)

                                            </CustomTextR>
                                        </View>
                                                                               
                                    </ScrollView>
                                    
                                    <View style={{marginVertical:10,marginHorizontal:20}}>
                                        <TouchableOpacity 
                                            onPress={ () => this.toggleOverlay2(null) }
                                            style={{height : 50,width:'100%',backgroundColor : DEFAULT_COLOR.lecture_base ,alignItems:'center',justifyContent:'center',borderRadius:5}}
                                        >
                                            <CustomTextB style={{color: DEFAULT_COLOR.base_color_fff,fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),lineHeight : PixelRatio.roundToNearestPixel(30),letterSpacing : -0.8,textAlign: 'center',
                                            }}>확인</CustomTextB>
                                        </TouchableOpacity>
                                        {/*
                                        <Button
                                            title='확인'
                                            buttonStyle={{ backgroundColor: DEFAULT_COLOR.lecture_base }}
                                            onPress={ () => this.toggleOverlay2(null) }
                                        /> 
                                        */}                                       
                                    </View>
                                </SafeAreaView>
                            </View>
                        );

                    }
                }else{
                    //StatusBarIOS.setHidden(true);
                    return (
                        <View style={{ flex: 1 }}>
                            { Platform.OS === 'android' && <StatusBar barStyle={"dark-content"} animated={true} hidden={true}/>}
                            
                            <AppIntroSlider
                                slides={slides}
                                renderItem={this._renderItem}
                                onDone={this._onDone}
                                showSkipButton={true}
                                onSkip={this._onSkip}
                                paginationStyle={{backgroundColor:'#fff'}}
                            />
                        
                        </View>
                    );       
                }
                
            }
        }
    }
}

const slides = [    
    {
        key: 's1',
        text: '',
        title: '',
        type : 'require',
        image: require('./assets/images/img_intro_01.png'),
        backgroundColor: '#00a0d5',
    },
    {
        key: 's2',
        text: '',
        title: '',
        type : 'require',
        image: require('./assets/images/img_intro_02.png'),
        backgroundColor: '#e6eff3',
    },
    {
        key: 's3',
        text: '',
        title: '',
        type : 'require',
        image: require('./assets/images/img_intro_03.png'),
        backgroundColor: '#e6eff3',
    },
    {
        key: 's4',
        text: '',
        title: '',
        type : 'require',
        image: require('./assets/images/img_intro_04.png'),
        backgroundColor: '#e6eff3',
    }
    /*,
    {
        key: 's5',
        title: 'Hackers Train',
        text: '해커스 기차여행',    
        type : 'uri',    
        image: {
            uri:
                'http://reactserver.hackers.com/assets/images/react/intro_bus_ticket_booking.png',
        },
        backgroundColor: '#20d2bb',
    },
    */
];

const styles = StyleSheet.create({
    Rootcontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    introImageWrapper : {
        
    },
    introImage: {
        
    },
    text: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        paddingVertical: 30,
    },
    title: {
        fontSize: 25,
        color: 'white',
        textAlign: 'center',
        marginBottom: 16,
    },  
    networkSubText : {
        fontSize: 25,
        color: '#222',
        textAlign: 'center',        
    },
    /**** Overlay ******/
    overrayTop: {
        height : 40,        
        alignItems :'center',
        justifyContent : 'center',
        flexDirection:'row',
        borderBottomColor:'#e8e8e8',
        borderBottomWidth:1
    },
    overrayBottom: {
        height : 100,   
        backgroundColor : '#fff', 
        paddingHorizontal:10, 
        paddingVertical : 5,           
        borderTopColor : '#ebebeb',
        borderTopWidth :1 
    },
    overrayBottom2: {
        height : 50,   
        backgroundColor : '#fff', 
        paddingHorizontal:10, 
        paddingVertical : 5,           
        borderTopColor : '#ebebeb',
        borderTopWidth :1 
    },
    overrayHeader: {
       
        width: '100%',
        height: SCREEN_HEIGHT / 17,
        justifyContent: 'center',
    },
    headerText: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),
        lineHeight : PixelRatio.roundToNearestPixel(22),
        letterSpacing : -0.9,
        textAlign: 'center',
    },
    listItemWrapper: {
        flex: 1,
        height: SCREEN_HEIGHT / 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 0.8,
        borderColor: DEFAULT_COLOR.input_border_color,
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
    },
    listItemText: {
        margin: 10,
        alignSelf: 'center',
        fontSize: 17,
        color: '#404040',
    },
    listItemCheckBoxWrapper: {
        height: SCREEN_HEIGHT / 18,
        width: SCREEN_HEIGHT / 18,
        justifyContent: 'center'
    },
    listItemCheckBoxWrapperChecked: {
        backgroundColor: '#1E9DF3',
    },
    listItemCheckBoxWrapperUnchecked: {
        backgroundColor: '#E2E2E2',
    },
    gridView: {        
        flex:1,   
        margin : 5,
        flexDirection :'row',
        flexWrap: 'wrap',                
    },   
    
    gridLeft : {    
        flex :6,  
        justifyContent: 'center',
        borderColor :'#ebebeb',
        borderWidth : 1
    },
    gridRight : {   
        flex :1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        borderColor :'#ebebeb',
        borderWidth : 1
    },
    itemText: {
        paddingHorizontal : 5,
        fontSize: 15,
        color:'#555',
        fontWeight: '600',
    },
    unselectedAttention : {
        minHeight:50,width:SCREEN_WIDTH/3-20,margin:5,backgroundColor:DEFAULT_COLOR.input_bg_color,padding:5,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:5
    },
    selectedAttention : {
        width:SCREEN_WIDTH/3-20,margin:5,padding:10,alignItems:'center',justifyContent:'center'
    },
    textWhite  :{
        color : DEFAULT_COLOR.base_color_fff,fontWeight:'bold'
    },
    text444  :{
        color : '#444'
    }
});


