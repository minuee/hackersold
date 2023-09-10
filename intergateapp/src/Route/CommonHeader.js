import React from 'react';
import {Alert,View,Platform,Image,Button,TouchableOpacity,Dimensions,StatusBar,Text,ActivityIndicator,Animated,PixelRatio,Linking,BackHandler} from 'react-native';
import {NavigationActions} from 'react-navigation';
import { Overlay } from 'react-native-elements';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
Icon2.loadFont();
//import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';
//import Select2 from "react-native-select-two";
//import SelectCustom from "../Utils/SelectCustom";
import firebase from 'react-native-firebase';
import * as NetInfo from "@react-native-community/netinfo"
import RNRestart from 'react-native-restart';
import RNExitApp from 'react-native-exit-app';
import {connect} from 'react-redux';
import ActionCreator from '../Ducks/Actions/MainActions';
import FrontPopLayer from '../../FrontPopLayer';

import 'moment/locale/ko'
import  moment  from  "moment";
const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

import {CustomTextR, CustomTextB, TextRobotoM,TextRobotoR} from '../Style/CustomText';

const HEADER_MAX_HEIGHT = DEFAULT_CONSTANTS.topHeight;
const HEADER_MIN_HEIGHT = DEFAULT_CONSTANTS.hideTopHeight;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

import styles from '../Style/CommonHeader';
import InterestSelect from '../../InterestSelect';
import NetworkDisabled from '../Utils/NetworkDisabled';
import CommonUtil from '../Utils/CommonUtil';

import BackgroundTimer from 'react-native-background-timer';
import CommonFunction from '../Utils/CommonFunction';

//LocalPusth
import LocalNotifService from '../Utils/LocalNotifService';

class CommonHeader extends React.Component {

    
    constructor(props) {
        super(props);
        this.state = {
            interestMode : 'mod',
            isLoading : false,
            isConnected : true,
            topShowModal : false,            
            myInterestCodeOne : null,
            attentionSelectCode : null,
            attentionSelectName : null,
            attentionSelectRGB : null,
            popLayer: [],
            popLayerView: false,
            setMyInterest : this.setMyInterest.bind(this),
            _topCloseModal: this._topCloseModal.bind(this),
            checkShowPopLayer: this.checkShowPopLayer.bind(this),
            closePopLayer : this.closePopLayer.bind(this),
        } 

        this.scrollYAnimatedValue = new Animated.Value(this.props.nowScrollY);
        this.localNotif = new LocalNotifService(
            this.onRegister.bind(this),
            this.onNotif.bind(this),
            this.props
        );
    }

    onRegister(token) {        
        this.setState({registerToken: token.token, fcmRegistered: true});
    }
    
    onNotif(notif) {
        //Alert.alert(notif.title, notif.message);
    }

    static navigationOptions = () => {
        return {
            header: null
        };
    };
  
    async UNSAFE_componentWillMount() {
        this.localNotif.cancelAll();//모든 로컬푸쉬를 삭제한다r

        //await CommonFunction.isSetupPush(false);
        await this.setBaseMyInterest();
        this.checkNetwork();       
        this.getGlobalUserToken();
        this.messageListener();   

        try {
            const isUsePush = await AsyncStorage.getItem('isUsePush');            
            if(isUsePush !== 'false' && this.state.myInterestCodeOne !==  null) {  
                //맨처음 한번은 시도해준다                
                CommonFunction.ifFirstNotification(this.props,this.localNotif);
                
                //CommonFunction.sendLocalPush( 'FreeBoard', this.localNotif )
                let repeatTime = DEFAULT_CONSTANTS.localPushIntervalTime; //60000 60s
                CommonFunction.setIntervalProess(true,repeatTime,this.props,this.localNotif);
               
            }else{
                CommonFunction.setIntervalProess(false);
                //BackgroundTimer.stopBackgroundTimer(); //after this call all code on background stop run.
            }
        } catch(e) {         
            console.log('isUsePush false');               
            CommonFunction.setIntervalProess(false);
        }

        //console.log('tttretretethis.props.myInterestCodeOne toptoptopt', this.props.myInterestCodeOne)
    }
    
    componentDidMount() {
        if (Platform.OS === 'android') { //안드로이드는 아래와 같이 initialURL을 확인하고 navigate 합니다.
            Linking.getInitialURL().then(url => {
              if(url) this.getNavigateInfo(url); //
            });
        }else{ //ios는 이벤트리스너를 mount/unmount 하여 url을 navigate 합니다.
            Linking.addEventListener('url', this.handleOpenURL);
        }
    }

    UNSAFE_componentWillUnmount() { 
        Linking.removeEventListener('url', this.handleOpenURL);
    }

    handleOpenURL = (event) => { //이벤트 리스너.
        this.getNavigateInfo(event.url);
    }

    getGlobalUserToken = async() => {
        
        let userToken = await AsyncStorage.getItem('userInfo');
        //console.log('getGlobalUserToken',userToken);
        this.props._saveUserToken(JSON.parse(userToken));
    }

    getNavigateInfo = (url) =>{
        //console.log('url',url); // exampleapp://somepath?id=3
        const basepaths = url.split('?'); // 쿼리스트링 관련한 패키지들을 활용하면 유용합니다.
        const paths = basepaths[1].split('|'); // 쿼리스트링 관련한 패키지들을 활용하면 유용합니다.
        let arrayParams = [];
        if(paths.length>1){ //파라미터가 있다
          const params= paths[1].split('&');
          let id;
          for(let i=0; i<params.length; i++){
            //let param = params[i].split('=');// [0]: key, [1]:value
            let nextData = params[i].replace('=',':');
            arrayParams.push(nextData)
            
          }
            //id 체크 후 상세페이지로 navigate 합니다.
          //console.log('nextData : ', arrayParams)
          this.props.navigationProps.navigate(paths[0],arrayParams)
        }
    }

    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보

        // 로그인 시 서버 저장 버전을 기준으로 현재 관심분야를 변경 시
        if (!CommonUtil.isEmpty(this.state.myInterestCodeOne) && this.state.myInterestCodeOne.info && this.props.myInterestCodeOne.info.interestFieldID !== this.state.myInterestCodeOne.info.interestFieldID) {
            this.setBaseMyInterest();
        }

        this.animate();
        //this.getGlobalUserToken();
    }

    // 여기서부터 Push Notifications
    messageListener = async () => {
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body } = notification;
            //console.log('notificationOpen.notification1',Platform.OS, "--", notification);
            this.showAlert(title, body,notification);
        });
        //여기가 로컬도 겸용 ios경우
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body } = notificationOpen.notification;
            //console.log('notificationOpen.notification2',Platform.OS, "--", notificationOpen.notification);
            //this.showAlert(title, body);
            if ( typeof notificationOpen.notification._data.routeName !== 'undefined' ) {                
                //console.log('NotificationHandler: 2222', notification.navigation);
                const navigateAction = NavigationActions.navigate({
                    routeName: notificationOpen.notification._data.routeName,
                    params: notificationOpen.notification._data,
                    action: NavigationActions.navigate({ routeName: notificationOpen.notification._data.routeName }),
                });              
                this.props.navigationProps.dispatch(navigateAction);
                //this.props.navigationProps.navigate(notificationOpen.notification._data.routeName);
                
            }
        });
        //이건 FCM 안드로이드만 외부푸쉬 클릭시
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {        
            const { title, body } = notificationOpen.notification;            
            //console.log('notificationOpen.notification333',Platform.OS, "--", notificationOpen.notification._data);
            if ( typeof notificationOpen.notification._data.routeName !== 'undefined' ) {                
                //console.log('NotificationHandler: 2222', notification.navigation);
                const navigateAction = NavigationActions.navigate({
                    routeName: notificationOpen.notification._data.routeName,
                    params: notificationOpen.notification._data,
                    action: NavigationActions.navigate({ routeName: notificationOpen.notification._data.routeName }),
                });              
                this.props.navigationProps.dispatch(navigateAction);                
            }           
        }
        this.messageListener = firebase.messaging().onMessage((message) => {          
          //console.log(JSON.stringify(message));
        });        
    }

    
    
    showAlert = async(title, message, notification) => {       
        Alert.alert(
          "해커스통합앱 알림",
          message,
          [
            {text: '닫기', onPress: () => console.log('pressssss')},
            {text: '확인', onPress: () => this.actionNotification(notification)},
          ],
          {cancelable: false},
        );
    }

    setGlobalReadMark = (num = 0 ) => {
        this.props._updateGlobalNewsUnReadCount(num);
    }
    actionNotification = async ( notification ) => {
        if ( typeof notification._data.routeName !== 'undefined' ) {                
            //console.log('NotificationHandler: 2222', notification.navigation);
            const navigateAction = NavigationActions.navigate({
                routeName: notification._data.routeName,
                params: notification._data,
                action: NavigationActions.navigate({ routeName: notification._data.routeName }),
            });              
            this.props.navigationProps.dispatch(navigateAction);
        }
    }
    // 여기까지 Push Notifications

    checkIndexindex = async(wcode,wname,wdata,wcolor) => {
        if ( typeof wcode !== 'undefinded' || wcode !== '' ) {            
            let dataw = [{code : wcode,name: wname,info : wdata,color:wcolor}];                
            await AsyncStorage.setItem('myInterestCode',JSON.stringify(dataw[0]) );
            await this.setState({
                myInterestCodeOne : wdata,
                attentionSelectCode : wcode,
                attentionSelectName : wname,
                attentionSelectRGB : wcolor,
            }) 
        }
        this.setState({topShowModal:false})     
        
    }

    setMyInterest = async (code, name, data, color) => {
        // 관심분야 계정 연동 처리 (전범준)
        // 로그인 되었고, 기존 선택한 관심분야에서 변경 발생한 경우 처리
        const isLoginCheck = await CommonUtil.isLoginCheck(this.props);
        if (isLoginCheck === true) {
            // case 2) 숨김 상태 관심 분야 이용 중 관심분야 변경 시도를 하는 경우
            // 사용 가능한 관심분야로 변경 경우
            const beforeInterest = await CommonUtil.getMyInterest();
            if (!CommonUtil.isEmpty(beforeInterest) && beforeInterest.interestFieldID !== code) {
                this.setMemberAppSetting(code, name, data, color);
                this.props.updateMyClassServiceID(data.serviceID);
            }
        }
        this.setMyInterest2(code, name, data, color);
    }

    setMemberAppSetting = async (code, name, data, color) => {
        const myInterest = await CommonUtil.getMyInterest();
        if (code !== myInterest.interestFieldID) {
            const isLoginCheck = await CommonUtil.isLoginCheck(this.props);
            if (isLoginCheck === true) {
                const memberAppSettings = await CommonUtil.saveRemoteInterest(code, name);
                await CommonUtil.saveLocalMemberAppSetting(memberAppSettings);
            }
            this.setMyInterest2(code, name, data, color);
        } else {
            this.setState({topShowModal: false});
        }
    }

    setMyInterest2 = async (code, name, data, color) => {
        await this.checkIndexindex(code, name, data, color);
        //await AsyncStorage.removeItem('myInterestCode');
        await this.setBaseMyInterest();
        //console.log('datadatadatadatadatadata',data);
        //await this.checkIndexindex(code,name,data,color);
        this.setState({topShowModal: false});
        //RNRestart.Restart();
    }

    setBaseMyInterest = async() => {
        // if ( typeof this.props.myInterestCodeOne !== 'undefined' && this.props.myInterestCodeOne.length > 0) {
        if ( typeof this.props.myInterestCodeOne !== 'undefined' && Object.keys(this.props.myInterestCodeOne).length > 0) {
            // console.log('111111111',this.props.myInterestCodeOne );
            await this.setState({
                myInterestCodeOne: this.props.myInterestCodeOne,
                attentionSelectCode: this.props.myInterestCodeOne.code,
                attentionSelectName: this.props.myInterestCodeOne.name,
                attentionSelectRGB: this.props.myInterestCodeOne.color,
            });
            setTimeout(() => {
                this.setState({isLoading: true});
            }, 500);
        } else {
            try {
                let storageMyInterestCode = await AsyncStorage.getItem('myInterestCode');
                //console.log('33333',storageMyInterestCode)
                if (storageMyInterestCode !== null) {
                    await this.props._updateMyInterestOneCode(JSON.parse(storageMyInterestCode));
                    await this.setState({
                        myInterestCodeOne: JSON.parse(storageMyInterestCode),
                        attentionSelectCode: JSON.parse(storageMyInterestCode).code,
                        attentionSelectName: JSON.parse(storageMyInterestCode).name,
                        attentionSelectRGB: JSON.parse(storageMyInterestCode).color,
                    });
                    setTimeout(() => {
                        this.forceUpdate()
                        this.setState({isLoading: true});
                    }, 500);
                } else {
                    this.setState({
                        isLoading: true,
                        topShowModal: true
                    });
                }
            } catch (e) {}
        }
    }

    animate () {
        //console.log('this.this.props.nowScrollY ',this.props.nowScrollY );
        this.scrollYAnimatedValue.setValue(this.props.nowScrollY)
    }

    checkNetwork = async() => {
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
        //console.log("Is connected?", isConnected);
        this.setState({isConnected: isConnected});        
    };

    toggleDrawer = () => {       
        this.props._updateDrawerOpen(true);
        this.props.navigationProps.toggleDrawer();
    };

    selectFilter = (filt) => {   
        /*     
        try {
            let selectedId = this.state.mockData1[filt-1].id;            
        }catch {            
            this.state.mockData1[0].checked = true;
            return true;
        }
        */
    }

    _topCloseModal = async() => {
        this.setState({ topShowModal: false })
    };
    _topShowModal = async() => {    
        //console.log('xxx', this.state.attentionSelectName)
        this.setState({ topShowModal: true })
    }

    closePopLayer = (bool) => {
        this.setState({popLayerView : bool})
    }

    goMyClass = async () => {
        const isLoginCheck = await CommonUtil.isLoginCheck(this.props);
        if (isLoginCheck === true) {
            this.props.navigationProps.navigate('MyClassScreen');
        } else {
            Alert.alert('', '로그인이 필요합니다.', [
                {text: '로그인', onPress: () => {
                    this.props.navigationProps.navigate('SignInScreen', {goScreen: 'MyClassScreen'});
                }},
                {text: '취소'}
            ], {cancelable: false});
        }
    };

    checkShowPopLayer = async popLayerList => {
        const popLayerExpireTime  = await AsyncStorage.getItem('popLayerExpireTime_' + this.props.myInterestCodeOne.code);
        setTimeout(() => {
            const TodayTimeStamp = moment()+840 * 60 * 1000;  // 서울
            if (popLayerList && popLayerList.length > 0){
                let isView = ( popLayerExpireTime === null || popLayerExpireTime < TodayTimeStamp ) ? true : false ;
                this.setState({
                    popLayer: popLayerList,
                    popLayerView: isView,
                });
            } else {
                this.setState({
                    popLayer: [],
                    popLayerView: false,
                });
            }
        }, 500);
    };

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.9);

    render() {
        const headerHeight = this.scrollYAnimatedValue.interpolate(
            {
            inputRange: [0,DEFAULT_CONSTANTS.topHeight],
            outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            extrapolate: 'clamp'
        });
        
        
        if ( this.state.isConnected ) {

            if ( typeof this.state.myInterestCodeOne !== 'undefined') {

                return (
                    <Animated.View style={[styles.animatedHeaderContainer, {zIndex:-1, height: headerHeight,overflow:'hidden'}]}>
                    { Platform.OS == 'android' && <StatusBar backgroundColor={'#fff'} translucent={false}  barStyle="dark-content" />}
                    <View style={styles.HeaderWrapper}>
                        <View style={styles.LogoWrapper}>
                            <Image source={require('../../assets/logo/img_top_logo.png')} style={{width: PixelRatio.roundToNearestPixel(77)}} resizeMode='contain' />
                        </View>
                        <View style={styles.iconsWrapper}>
                            <View style={styles.iconsWrapperIn}>
                                <TouchableOpacity 
                                    onPress= {()=> this.props.navigationProps.navigate('RequestToHackers')} 
                                    style={styles.iconWrapper}
                                >
                                
                                    <Image source={require('../../assets/icons/btn_navi_cs.png')} style={styles.iconsSize30} resizeMode='contain' />
                                    
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress= {()=> this.goMyClass()} 
                                        style={styles.iconWrapper}
                                    >                                            
                                        <Image source={require('../../assets/icons/btn_navi_my.png')} style={styles.iconsSize30} resizeMode='contain' />
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity 
                                        onPress={this.toggleDrawer.bind(this)}
                                        style={styles.iconWrapper}
                                    >
                                        { this.props.newsUnreadCount > 0 &&
                                        <View style={styles.noticeWrapper}>
                                            <Text style={styles.noticeNumberText}>{this.props.newsUnreadCount}</Text>
                                        </View>
                                        }
                                        <Image source={require('../../assets/icons/btn_navi_menu.png')} style={styles.iconsSize25} resizeMode='contain' />

                                    </TouchableOpacity>
                                    
                                </View>
                            </View>
                        </View> 

                        
                        
                        <View style={{height:50,paddingLeft:0,paddingHorizontal:15,display:this.props.topFavoriteMenu?'flex':'none' }}>
                            { this.state.isLoading ?                            
                            <TouchableOpacity 
                                style={{flexDirection:'row',flexGrow:1,paddingHorizontal:15,justifyContent:'flex-start',alignItems:'flex-start'}}
                                onPress={()=> this._topShowModal()}
                            >
                                <CustomTextB style={{color: this.props.myInterestCodeOne.color ?  this.props.myInterestCodeOne.color : '#d50032',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_large),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize10),letterSpacing:-1.72}}>
                                    {this.props.myInterestCodeOne.name ? this.props.myInterestCodeOne.name : '관심분야를 선택해주세요'}
                                </CustomTextB>                                
                                <View style={{paddingTop:5,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)}}>
                                    { this.props.myInterestCodeOne.name ? 
                                    <Icon2 name={'chevron-down'} color={this.props.myInterestCodeOne.color ?  this.props.myInterestCodeOne.color : '#d50032'} size={PixelRatio.roundToNearestPixel(23)} />                                    
                                    :
                                    null
                                    }
                                </View>
                                { 
                                    
                                    typeof this.props.myInterestCodeOne.info !== 'undefined' &&
                                    (typeof this.props.myInterestCodeOne.info.siteURL !== 'undefined' && this.props.myInterestCodeOne.info.siteURL && this.props.myInterestCodeOne.name  )  
                                    ?
                                    <View style={{flex:1,flexDirection:'row',flexGrow:1,paddingTop:6}}>
                                        <TouchableOpacity 
                                            onPress={()=> Linking.openURL(this.props.myInterestCodeOne.info.siteURL)}
                                        >
                                            <TextRobotoM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:DEFAULT_COLOR.base_color_bbb,letterSpacing:-0.5}}>
                                                {this.props.myInterestCodeOne.info.siteURL.replace('https://','')}
                                            </TextRobotoM>                                           
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={{marginLeft:-1}}
                                            onPress={()=> Linking.openURL(this.props.myInterestCodeOne.info.siteURL)}
                                        >
                                            <Icon2 name={'arrow-top-right'} color={'#bbb'} size={PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)} />
                                        </TouchableOpacity>      
                                    </View>
                                    :
                                    null
                                    
                                }
                            </TouchableOpacity>
                            :
                            <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
                            }
                        </View>
                        {
                        this.state.topShowModal ?
                        <Modal
                            onBackdropPress={this._topCloseModal}
                            animationType="slide"
                            //transparent={true}
                            onRequestClose={() => {
                                this.setState({topShowModal:false})
                            }}
                            onBackdropPress={() => {
                                this.setState({topShowModal:false})
                            }}
                            style={{justifyContent: 'flex-end',margin: 0}}
                            useNativeDriver={true}
                            animationInTiming={300}
                            animationOutTiming={300}
                            hideModalContentWhileAnimating                    
                            isVisible={this.state.topShowModal}
                        >
                            
                            <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight }]}>
                                <InterestSelect screenState={this.state} screenProps={this.props} />
                            </Animated.View>
                            
                        </Modal>
                        :
                        null
                        }

                        {this.state.popLayerView && (
                            <View>
                                <Overlay
                                    isVisible={this.state.popLayerView}
                                    windowBackgroundColor="rgba(0, 0, 0, 0.8)"
                                    overlayBackgroundColor="tranparent"
                                    containerStyle={{margin: 0}}>
                                    <FrontPopLayer screenState={this.state} />
                                </Overlay>
                            </View>
                        )}
                    </Animated.View>
                )
            }else{
                return (
                    <View style={styles.Rootcontainer}>
                        { Platform.OS == 'android' && <StatusBar backgroundColor={DEFAULT_COLOR.base_lecture} translucent={false}  barStyle="dark-content" />}
                        <TouchableOpacity 
                            style={{zIndex:10000,flex:1,width:SCREEN_WIDTH,height:SCREEN_HEIGHT,justifyContent: 'center',alignItems: 'center',}} 
                            onPress={()=> this.forceUpdate()}>
                            <Image source={require('../../assets/icons/icon_network.png')} resizeMode='contain' style={{width:75,height:50}} />
                            <View style={{marginBottom:20,alignItems:'center',justifyContent:'center'}}>                                
                                <Text style={styles.networkSubText}>Loading...</Text>
                            </View>
                            <View>
                                <Button 
                                    title=' 재시도 ' 
                                    style={{borderColor:'#ccc'}}
                                    onPress= {()=> this.checkNetwork()}
                                />
                            </View>
                        </TouchableOpacity>
    
                    </View>
                )

            }
        }else{
            return (
                <View style={styles.Rootcontainer}>
                    { Platform.OS == 'android' && <StatusBar backgroundColor={DEFAULT_COLOR.base_lecture} translucent={false}  barStyle="dark-content" />}
                    <NetworkDisabled />
                </View>
            )

        }
       
    }
}



function mapStateToProps(state) {
    return {
        selectBook: state.GlabalStatus.selectBook,
        nowScrollY: state.GlabalStatus.nowScrollY,
        topFavoriteMenu: state.GlabalStatus.topFavoriteMenu,   
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
        userToken : state.GlabalStatus.userToken,   
        isDrawerOpen :state.GlabalStatus.isDrawerOpen,   
        newsUnreadCount: state.GlabalStatus.newsUnreadCount,   
        myClassServiceID: state.GlabalStatus.myClassServiceID,
        popLayerMain: state.GlabalStatus.popLayerMain,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        _updateStatusNetworking:(boolean) => {
            dispatch(ActionCreator.updateStatusNetworking(boolean));
        },
        _updateMyInterestOneCode:(str)=> {
            dispatch(ActionCreator.updateMyInterestOneCode(str))
        },
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        },
        _updateDrawerOpen:(boolean)=> {
            dispatch(ActionCreator.updateDrawerOpen(boolean))
        },
        _updateGlobalNewsUnReadCount:(num)=> {
            dispatch(ActionCreator.updateGlobalNewsUnReadCount(num))
        },
        _updateGlobalNewsData:(str)=> {
            dispatch(ActionCreator.updateGlobalNewsData(str))
        },
        updateMyClassServiceID: serviceID => {
            dispatch(ActionCreator.updateMyClassServiceID(serviceID));
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(CommonHeader);
