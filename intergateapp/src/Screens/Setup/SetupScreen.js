import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,StatusBar,TouchableOpacity,ActivityIndicator,Dimensions,PixelRatio,NativeModules,Animated, Platform,Alert,BackHandler} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import ToggleSwitch from './ToggleSwitch';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationEvents } from 'react-navigation';
const IC_ARR_DOWN = require('../../../assets/icons/ic_arr_down.png');
const IC_ARR_UP = require('../../../assets/icons/ic_arr_up.png');

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Style/CustomText';

//LocalPusth
import LocalNotifService from '../../Utils/LocalNotifService';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');


import AppUpdateScreen from './AppUpdateScreen';

class SetupScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            appLink : "http://play.google.com/store/apps/details?id=com.truecaller&hl=en",
            showModal : false,
            appVersion : 0,
            buildVersion : 0,
            bundleIdentifier : 0,
            switchOn1: true,
            switchOn2 : true,
            switchOn3 : true,
            userToken : null,
            UUID : null,
            myInterestItem :[],
            closeModal : this.closeModal.bind(this)
        }

        this.localNotifSetup= new LocalNotifService(
            this.onRegister.bind(this),
            this.onNotif.bind(this),
            this.props
        );
    }

    onRegister(token) {
        console.log('local token', token)
        this.setState({registerToken: token.token, fcmRegistered: true});
    }
    
    onNotif(notif) {
        //Alert.alert(notif.title, notif.message);
    }

    async UNSAFE_componentWillMount() {       
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        let isUsePush = await AsyncStorage.getItem('isUsePush');      
        let isUseADAgreePush = await AsyncStorage.getItem('isUseADAgreePush');  
        let isUseNewsPush = await AsyncStorage.getItem('isUseNewsPush');  
        let getUUID = await AsyncStorage.getItem('UUID');
        let MyNewsInterest = await AsyncStorage.getItem('MyNewsInterest');
        
        if ( Array.isArray(this.props.myInterestCodeNotice ) === true ) {
            
            //console.log(' this.props.myInterestCodeNotice',  this.props.myInterestCodeNotice)
            this.setState({
                myInterestItem : this.props.myInterestCodeNotice
            })    
        }else if ( MyNewsInterest !== null ) {
            this.setState({
                myInterestItem : JSON.parse(MyNewsInterest)
            })  
            this.props._updateMyInterestNoticeCode(JSON.parse(MyNewsInterest));
        }
        
        this.setState({
            UUID : getUUID,
            switchOn1 : isUsePush === 'false' ? false : true,
            switchOn2 : isUseNewsPush === 'false' ? false : true,
            switchOn3 : isUseADAgreePush === 'false' ? false : true,
            appVersion : NativeModules.RNVersionNumber.appVersion,
            buildVersion : NativeModules.RNVersionNumber.buildVersion,
            bundleIdentifier : NativeModules.RNVersionNumber.bundleIdentifier
        })

        // 토큰 휴효성 검증을 포함한 로그인 체크
        // true/false 반환
        // 리덕스 업데이트: _saveUserToken를 포함한 this.props를 인수로 전달하면 false일 경우 _saveUserToken(null)로 업데이트
        await CommonUtil.isLoginCheck(this.props);

        if ( this.props.userToken === null ) {
            //let userToken = await AsyncStorage.getItem('userInfo')     
            let userToken = await CommonUtil.getUserInfo()              
            this.setState({userToken : JSON.parse(userToken)})            
        }else{
            this.setState({userToken : this.props.userToken})            
        }
    }  

    componentDidMount() {             
       this.setState({loading:false})       
    }

    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보        
        
    }

    
    UNSAFE_componentWillReceiveProps(nextProps) {
       
       
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
    }

    
    
    onChangeState(val) {
        
        CommonFuncion.isSetupPush(val);
        if(val === true ) {  
            let repeatTime = DEFAULT_CONSTANTS.localPushIntervalTime; //60000 60s
            CommonFuncion.setIntervalProess(true,repeatTime,this.props,this.localNotifSetup);
           
        }else{
            CommonFuncion.setIntervalProess(false);            
        }
        this.updateSeupPush(val,'push');
        this.setState({switchOn1: val})
    }

    onChangeStateAD(val) {
        
        CommonFuncion.isSetupPush(val);
        if(val === true ) {  
            let repeatTime = DEFAULT_CONSTANTS.localPushIntervalTime; //60000 60s
            CommonFuncion.setIntervalProess(true,repeatTime,this.props,this.localNotifSetup);
           
        }else{
            CommonFuncion.setIntervalProess(false);
            //BackgroundTimer.stopBackgroundTimer(); //after this call all code on background stop run.
        }
        this.updateSeupPush(val,'ad');
        this.setState({switchOn3: val})
    }

    updateSeupPush = async(isUse, type='push') => {
        const formData = new FormData();
        formData.append('UUID', this.state.UUID);
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

    failCallAPi = () => {
     
        let message = "데이터 수신중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);

    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.8);
    closeModal = () => this.setState({ showModal: false });
    
    openAppStore = async() => {        
        let setAppLink = Platform.OS === 'ios' ? "https://apps.apple.com/app/id531669642" : "https://play.google.com/store/apps/details?id="+DEFAULT_CONSTANTS.androidAuqaPlayer+"&hl=kr";
        this.setState({ 
            showModal: true,
            appLink : setAppLink
        })
    }
    
    logOutAlert = () => {
        Alert.alert(
            DEFAULT_CONSTANTS.appName,
            '로그아웃 하시겠습니까?',
            [
              {text: '네', onPress: () => this.logOut()},
              {text: '아니오', onPress: () => console.log('logoupt')},
            ],
            {cancelable: false},
          );
    }

    logOut = async() => {
        await AsyncStorage.setItem('userInfo','');
        await this.props._saveUserToken(null)
        await this.forceUpdate();
        console.log('logout')
        this.props.navigation.goBack(null)
    }

    newsPushUpdate = async() => {
        let tmpIsUseNewsPush = await AsyncStorage.getItem('isUseNewsPush');  
        console.log('tmpIsUseNewsPush',tmpIsUseNewsPush)
        this.setState({            
            switchOn2 : tmpIsUseNewsPush === 'false' ? false : true    
        });
    }

    handleBackButton = () => {        
        this.props.navigation.goBack(null);
        this.props.navigation.toggleDrawer();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton); 
        return true;
    };

    /*
    const handleNav = async(evt) => {
        console.log('evt',evt)
        const appStoreId = 'com.cdn.aquanmanager';
        AppLink.openInStore({ appStoreId}).then(() => {
            // do stuff
        })
        .catch((err) => {
        // handle error
        });
    }
    */
    render() {
        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        }else {
            return(
                <View style={ styles.container }>
                    { Platform.OS == 'android' && <StatusBar backgroundColor={DEFAULT_COLOR.lecture_base} translucent={false}  barStyle="dark-content" />}
                    <NavigationEvents
                        onWillFocus={payload => {
                            this.newsPushUpdate();
                            this.setState({
                                myInterestItem:this.props.myInterestCodeNotice
                            });
                            this.forceUpdate();
                            
                        }}
                        onWillBlur={payload => {
                            console.log('onWillBlur 222')                        
                        }}
                    />
                    <Modal
                        onBackdropPress={this.closeModal}
                        style={{justifyContent: 'flex-end',margin: 0}}
                        useNativeDriver={true}
                        animationInTiming={300}
                        animationOutTiming={300}
                        hideModalContentWhileAnimating
                        isVisible={this.state.showModal}>
                        <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight }]}>                       
                            <View style={{flex:1}}>
                                <AppUpdateScreen    
                                    appLink={this.state.appLink}                             
                                    jsOptions={{ animated: true }}
                                    //onSelected={(data) => this.setAddress(data)}
                                    closeModal={this.state.closeModal}
                                />
                            </View>
                        </Animated.View>
                    </Modal>
                    <ScrollView>
                        <View style={ styles.bodyContainer }>
                            <View style={{flex:1,justifyContent:'center'}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_222}}>푸쉬</CustomTextR>
                            </View>
                            <View style={{flex:1,alignItems:'flex-end',justifyContent:'center'}}>
                                <ToggleSwitch
                                    type={0}
                                    containerStyle={{
                                    marginTop: 0,
                                    width: 50,
                                    height: 24,
                                    borderRadius: 12,
                                    padding: 5,
                                    }}
                                    backgroundColorOn='#3fcfff'
                                    backgroundColorOff='#ebebeb'
                                    circleStyle={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    backgroundColor: '#fff'
                                    }}
                                    switchOn={this.state.switchOn1}
                                    onPress={()=> this.onChangeState(!this.state.switchOn1)}
                                    circleColorOff='#fff'
                                    circleColorOn='#FFF'
                                    duration={500}
                                />
                            </View>
                            
                        </View>
                        {this.state.switchOn1 &&
                            <View style={ styles.bodyContainer2 }>
                                <View style={{flexDirection:'row',justifyContent:'center',marginBottom:10}}>
                                    <View style={{flex:4}}>
                                        <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_222}}>광고성 정보수신동의</CustomTextR>
                                        <CustomTextR style={{paddingTop:5,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:DEFAULT_COLOR.base_color_888}}>광고 및 이벤트의 새로운 소식을 받습니다.</CustomTextR>
                                    </View>
                                  
                                    <View style={{flex:1,alignItems:'flex-end',justifyContent:'center'}}>
                                        <ToggleSwitch
                                            type={0}
                                            containerStyle={{
                                            marginTop: 0,
                                            width: 50,
                                            height: 24,
                                            borderRadius: 12,
                                            padding: 5,
                                            }}
                                            backgroundColorOn='#3fcfff'
                                            backgroundColorOff='#ebebeb'
                                            circleStyle={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: 10,
                                            backgroundColor: '#fff'
                                            }}
                                            switchOn={this.state.switchOn3}
                                            onPress={()=> this.onChangeStateAD(!this.state.switchOn3)}
                                            circleColorOff='#fff'
                                            circleColorOn='#FFF'
                                            duration={500}
                                        />
                                    </View>
                                </View>
                                <View style={{height:1,backgroundColor:DEFAULT_COLOR.input_border_color,marginVertical:15}} />

                                <View style={{flexDirection:'row',marginBottom:10}}>
                                    <View style={{flex:4}}>
                                        <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_222}}>새로운 소식 알림</CustomTextR>
                                        { 
                                        this.state.myInterestItem.length > 0 
                                        ? 
                                        this.state.switchOn2 &&
                                        <View style={{flex:1,flexDirection:'row',flexGrow:1}}>
                                            {                                                
                                                  this.state.myInterestItem.map((titem,tindex) => {
                                                        return (
                                                            <View key={parseInt(tindex+1)}>
                                                            {
                                                                this.state.myInterestItem.length === parseInt(tindex+1)
                                                                ?
                                                                <CustomTextR style={{paddingTop:5,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:DEFAULT_COLOR.base_color_888}}>{titem.name}</CustomTextR>
                                                                :
                                                                <CustomTextR style={{paddingTop:5,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:DEFAULT_COLOR.base_color_888}}>{titem.name},</CustomTextR>
                                                            }
                                                            </View>
                                                        )
                                                  })
                                            }
                                             <CustomTextR style={{paddingTop:5,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:DEFAULT_COLOR.base_color_888}}>의 소식을 받습니다.</CustomTextR>
                                           
                                        </View>
                                        :
                                        <View style={{flex:1}}>
                                            <CustomTextR style={{paddingTop:5,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:DEFAULT_COLOR.base_color_888}}>설정된 관심분야가 없습니다.</CustomTextR>
                                        </View>

                                        }
                                       
                                    </View>
                                    <TouchableOpacity 
                                        onPress={()=>
                                            this.props.navigation.navigate('SetupPushNewsScreen')
                                        }
                                        style={{flex:1,flexDirection:'row',flexGrow:1,alignItems:'center',justifyContent:'flex-end'}}
                                    >
                                        <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.lecture_base}}>
                                            {this.state.switchOn2 ? '받기' : '받지않음'} </CustomTextR><Icon name="right" size={PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)} color={DEFAULT_COLOR.base_color_666} />
                                    </TouchableOpacity>
                                
                                </View>
                                
                            </View>
                        }

                    

                        <View style={ styles.bodyContainer }>
                            <View style={{flex:1,justifyContent:'center'}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_222}}>개인정보 처리방침</CustomTextR>
                            </View>
                            <View style={{flex:1,alignItems:'flex-end'}}>
                                <TouchableOpacity 
                                    onPress={()=>
                                        this.props.navigation.navigate('SetupViewPrivate')
                                    }
                                >
                                    <Icon name="right" size={20} color={DEFAULT_COLOR.base_color_666} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={ styles.bodyContainer }>
                            {
                                this.props.userToken === null ?
                                <TouchableOpacity 
                                    style={{flex:1,justifyContent:'center'}}
                                    onPress={(()=> this.props.navigation.navigate('SignInScreen', {isUserInterestSync: true}))}
                                >
                                    <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_222}}>로그인</CustomTextR>
                                </TouchableOpacity>
                            :
                            <TouchableOpacity 
                                style={{flex:1,justifyContent:'center'}}
                                onPress={(()=> this.logOutAlert())}
                            >
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_222}}>로그아웃</CustomTextR>
                            </TouchableOpacity>

                            }
                            
                            
                        </View>
                        <View style={styles.bodyContainer }>
                            <View style={{flex:1,justifyContent:'center'}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_222}}>버전정보</CustomTextR>
                            </View>
                            <View style={{flex:1,alignItems:'flex-end',justifyContent:'center'}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:DEFAULT_COLOR.lecture_base}}>최신버전입니다.</CustomTextR>                            
                            </View>
                            <View style={{flex:0.5,alignItems:'flex-end',justifyContent:'center'}}>            
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_222}}>ver.{this.state.appVersion}</CustomTextR>
                            </View>
                        </View>
                        <View style={styles.bodyContainer }>
                            <View style={styles.inbodyContainer }>
                                <TouchableOpacity 
                                    onPress={()=> this.openAppStore()}
                                    style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,paddingVertical:10,borderRadius:5}}
                                >
                                    <Icon name="sync" size={DEFAULT_TEXT.fontSize14} color={DEFAULT_COLOR.base_color_222} />
                                    <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:DEFAULT_COLOR.base_color_222}}>   업데이트</CustomTextR>
                                </TouchableOpacity>
                                
                            </View>
                        </View>
                    </ScrollView>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:DEFAULT_COLOR.input_bg_color,
        height:SCREEN_HEIGHT
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bodyContainer : {        
        flexDirection:'row',
        backgroundColor : "#fff",
        borderBottomColor:DEFAULT_COLOR.input_border_color,
        borderBottomWidth:1  ,
        padding:20,
        
    },
    bodyContainer2 : {                
        borderBottomColor:DEFAULT_COLOR.input_border_color,
        borderBottomWidth:1  ,
        backgroundColor:DEFAULT_COLOR.input_bg_color,
        padding:20,
        
    },
    inbodyContainer : {      
        flex:1,flexDirection:'row',backgroundColor : "#fff",     
    },
    commonText01:{
        fontWeight:'bold',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),color:DEFAULT_COLOR.base_color_222
    },
    commonText02:{
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),color:DEFAULT_COLOR.base_color_666
    },
    commonText03:{
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12),color:DEFAULT_COLOR.lecture_base
    }

});

function mapStateToProps(state) {
    return {
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
        myInterestCodeNotice: state.GlabalStatus.myInterestCodeNotice,        
        userToken: state.GlabalStatus.userToken,   
    };
}

function mapDispatchToProps(dispatch) {
    return {
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        },
        _updateMyInterestNoticeCode:(str) => {
            dispatch(ActionCreator.updateMyInterestNoticeCode(str));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SetupScreen);
