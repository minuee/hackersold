import React, { Component } from 'react';
import {StyleSheet,Text,View,SafeAreaView,Dimensions,PixelRatio,Platform,TouchableOpacity,Image,ScrollView,BackHandler,Alert,NativeModules} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import SlidingPanel from './SlidingPanel';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/Entypo';
Icon2.loadFont();
import 'moment/locale/ko'
import  moment  from  "moment";
import RecentlyHistory from './RecentlyHistory';
import NewsContents from './NewsContents';

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonFuncion from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';
import {CustomTextR, CustomTextB, CustomTextL,CustomTextM,TextRobotoM,TextRobotoR} from '../../Style/CustomText';

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");
const HEADER_HEIGHT = 50;
const HEADER_BLANK = 50;
//const CONTAINER_HEIGHT = Platform.OS === 'ios' ?  CommonFuncion.isIphoneX() ? SCREEN_HEIGHT*0.35 :SCREEN_HEIGHT*0.45 :  SCREEN_HEIGHT*0.4;
const CONTAINER_HEIGHT = SCREEN_HEIGHT > 800 ? SCREEN_HEIGHT * 0.4 :  SCREEN_HEIGHT*0.45;
const ChangePositionY = Platform.OS === 'ios' ?  CommonFuncion.isIphoneX() ? SCREEN_HEIGHT*0.25 :SCREEN_HEIGHT*0.2 :  SCREEN_HEIGHT*0.25;
const ChangeLimitY = SCREEN_HEIGHT*0.1;


let isFirst = true;
class IntroScreen extends React.PureComponent {

    constructor(props) {
        super(props)        
        this.state={
            nowPageY : CONTAINER_HEIGHT,
            headerHeight : CONTAINER_HEIGHT,
            bottombar : false,
            showTopButton : false,
            isExpandedContent: false,
            isActiveLatest: true,
            nowTopPosition : false,
            nowTimeHour: moment().format('HH'),
            isDrawerOpen : this.props.screenProps.navigation.state.isDrawerOpen,
            userToken : null,
            userName : '',
            slideRightWidth : SCREEN_WIDTH*0.6,
            onScrollHeight : SCREEN_HEIGHT > 800 ? CONTAINER_HEIGHT*0.8 : CONTAINER_HEIGHT,
            backOpacity : 0.5,
            backHorizotal : 20,
            isBackOpacity : false,
        };

        console.log('SCREEN_HEIGHT', Platform.OS, SCREEN_HEIGHT)
       
    }

    
    async UNSAFE_componentWillMount() {        
        BackHandler.removeEventListener('hardwareBackPress');   
        await this.getUserToken()
    }  

    componentDidMount() {        
        //this.setState({loading:false});
        //this.onLayout()

        //Local Notification 모듀 초기화
    }

    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보            
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({nowTimeHour: moment().format('HH')});
        //this.getUserToken();
    }
   

    componentWillUnmount(){
    
        //BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
        
    }

    getUserToken = async () => {
        const isLogin = await CommonUtil.isLoginCheck(this.props);
        if (isLogin === true) {
            const userToken = await AsyncStorage.getItem('userInfo');
            if ( this.props.userToken !== null  ) {
                if ( typeof this.props.userToken.memberIdx !== 'undefined'  ) {
                    await this.setState({
                        userName : this.props.userToken.memberName || '',
                        userToken : this.props.userToken
                    })           
                }
            }else if ( userToken !== null ) {            
                await this.setState({
                    userName : JSON.parse(userToken).memberName || '',
                    userToken : JSON.parse(userToken)
                })
            }
        }

        // console.log('this.props.userToken : ', this.props.userToken);
        // console.log('userToken : ', this.state.userToken, this.state.userName);
    }

    pageScroll = (event) => {        
        
        this.setState({nowPageY:event.nativeEvent.pageY  < 1 ? 0 : event.nativeEvent.pageY})
        if ( event.nativeEvent.pageY <= HEADER_BLANK ) {
            this.setState({bottombar : true}) 
        }else{
            this.setState({bottombar : false}) 
        }
        
        //this.onLayout()
    }

    onAnimationEnd = (val) => {
        console.log('onAnimationEnd',val)
        
        /*
        if ( this.state.nowPageY > ChangePositionY ) {
            this.setState({bottombar:true})
        }else{
            this.setState({bottombar:false})
        }
        */
    }
    
    onLoginBack = async () => {
        const userInfo = await CommonUtil.getUserInfo();
        console.log('userInfo : ', userInfo);
    };

    moveScreen = async( route ) => {
        
        if ( this.props.userToken !== null ) {
            this.props.screenProps.navigation.navigate(route);
        } else {
            Alert.alert('', '로그인이 필요합니다.\n로그인 하시겠습니까?',
            [
                //{text: '확인 1', onPress: () => this.props.screenProps.navigation.navigate('SignInScreen', {onLoginBack: () => this.onLoginBack()})},
                {text: '확인', onPress: () => this.props.screenProps.navigation.navigate('SignInScreen', {goScreen: route})},
                //{text: '확인 3', onPress: () => this.props.screenProps.navigation.navigate('SignInScreen')},
                {text: '취소', onPress: () => console.log('로그인 취소')},
            ]);
        }
    }

    handleOnScroll (event) {     
        //console.log('=== : ',event.nativeEvent.contentOffset.y )
        /*
        if ( event.nativeEvent.contentOffset.y >= 150 ) {
            this.setState({showTopButton : true}) 
        }else{
            this.setState({showTopButton : false}) 
        }
        */
    }

    onLayout = () => {        
        this.refs.TargetElement.measure((x, y, width, height, pageX, pageY) => {
            //console.log("dddd",x, y, width, height, pageX, pageY);            
            //console.log("---------",pageY);           
        })
    }

    onLayoutHeader = (evt ) => {
        
        //console.log('height',evt.nativeEvent.layout.height);
        this.setState({headerHeight : evt.nativeEvent.layout.height});
    }

    onLayoutSlide = ( evt ) => {
        if ( isFirst ) {
            console.log('onLayoutSlide2222',evt.nativeEvent.layout.width);
            this.setState({slideRightWidth : parseInt(evt.nativeEvent.layout.width)});
            isFirst = false;
        }
        
    }
    onMoveTop2 = async(bool) =>{    
        if ( this.state.bottombar === false && bool) {
            this.setState({bottombar: true,backOpacity : 0.5,backHorizotal:0});
        }else if ( this.state.bottombar === true && bool === false) {
            this.setState({bottombar: false, isBackOpacity:false,backHorizotal:20});
        }
    }
    onMoveTop = async(scrollInfo) =>{    

        if ( scrollInfo.dy < 0 && scrollInfo.moveY < ChangeLimitY )  {            
            if ( this.state.bottombar === false ) {                          
                this.setState({bottombar: true,backOpacity : 0.5});
            }else{                
                this.setState({                   
                    isBackOpacity:false
                });
            }
            
        }else if ( scrollInfo.dy > 0 && scrollInfo.moveY  >= ChangeLimitY && scrollInfo.moveY >= (CONTAINER_HEIGHT+50) ) {        
            if ( this.state.bottombar ) {
                this.setState({
                    bottombar: false,
                    isBackOpacity:false
                });
            }
        }
      
    }

        
    storageUpdate = async() =>  {
        await this.setUserToken()
    }
    

    sendLocalPush = ( routeName ) => {        
        let soundName = null;
        let pushTitle = "해커스통합앱";
        let pushMessage = "お前あほかちゃんとやれよ";
        let sendTime = 10 ; //add per second 최소 5초 즉시발송개념, 그외에는 지연발송
        let isVibrate = false ;//
        let screenName = routeName;
        let screenIdx = 0;
        
        this.notif.appLocalNotification(soundName,pushTitle,pushMessage,isVibrate,screenName,screenIdx);
    }

    sendLocalSchedule = ( routeName ) => {
        let soundName = false;
        let pushTitle = "해커스통합앱";
        let pushMessage = "お前あほかちゃんとやれよ2";
        let sendTime = 10 ; //add per second 최소 5초 즉시발송개념, 그외에는 지연발송
        let isVibrate = false ;//
        let screenName = routeName;
        let screenIdx = 0;
        this.notif.applocalNotificationSchedule(soundName,sendTime,pushTitle,pushMessage,isVibrate,screenName,screenIdx)
    }

    myCloseDrawer = () => {                
        this.props._updateDrawerOpen(false);
        this.props.screenProps.navigation.toggleDrawer();  
    }

    lnbSlideMenu = async(bool) => {
        this.props._updateMypageSelectedTabsLnb(bool);
        //console.log('this.props.newsUnreadCount', this.props.newsUnreadCount)        
        if ( bool === false && this.props.newsUnreadCount > 0) {
            CommonFuncion.checkMyNewsArrvalsRead(this.props);
        }
    }

    renderTimeDailog(param) {
        if (parseInt(param) <= 12 && parseInt(param) >= 1 ) {
            return (
                <CustomTextL style={styles.mainuserMessage}>
                    오늘 하루도{'\n'}
                    열심히 공부합시다!
                </CustomTextL>    
            )
        }else  {
            return (
                <CustomTextL style={styles.mainuserMessage}>
                    나른한 오후에도{'\n'}
                    열공하는 당신을 응원합니다
                </CustomTextL>    
            )
        }
    }
    
    /*
    shouldComponentUpdate(nextProps, nextState) {
        console.log('this.state.onScrollHeight',this.state.onScrollHeight );       
        console.log('nextState.onScrollHeight',nextState.onScrollHeight );       
        
        return true;
    }
    */


    onScrollHeight = async(e,j) => {
        let slideHeight = SCREEN_HEIGHT > 800 ? CONTAINER_HEIGHT*0.8 : CONTAINER_HEIGHT;
        //console.log('SCREEN_HEIGHT > 800', SCREEN_HEIGHT, CONTAINER_HEIGHT*0.8 , CONTAINER_HEIGHT);
        //console.log('onScrollHeight2',parseInt(e.__getValue()));
        //console.log('gestureState2',j.vy);
        let e2 =  parseInt(e.__getValue());
        let opacityValtmp = parseFloat(e2/slideHeight)*10;
        //console.log('opacityValtmp',opacityValtmp);        
        let opacityVal = opacityValtmp > 0 ? opacityValtmp.toFixed(1) : 0;
        //console.log('opacityVal',opacityVal);

        if ( j.vy < 0 ) {
            if ( e2 < 50 ) {                
                this.setState({
                    isBackOpacity : false,                    
                    backOpacity : opacityVal >= 5 ? 0.5 : opacityVal/10
                })
            }else if ( e2 > 50 ) {                
                this.setState({
                    isBackOpacity : true,
                    backOpacity : opacityVal >= 5 ? 0.5 : opacityVal/10
                })
            }else{
                
            }
        }else{
            if ( e2 < 50 ) {                
                this.setState({
                    isBackOpacity : false,
                    backOpacity : opacityVal >= 5 ? 0.5 : opacityVal/10
                })
            }else{                
                this.setState({                    
                    backOpacity : opacityVal >= 5 ? 0.5 : opacityVal/10
                })
            }            
        }

        if ( e2 < 1 ) {
            this.setState({
                backHorizotal : 20
            })
        }else{            
            this.setState({
                backHorizotal : parseInt(20 * (1 - (opacityVal/10)))
            })
        }

    }

    render() {

        return (
            <SafeAreaView style={styles.container}>
                <NavigationEvents
                    onWillFocus={payload => {
                        this.getUserToken()
                        this.storageUpdate();
                    }}
                    onWillBlur={payload => {
                        //BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);                           
                    }}
                />
                
                <View style={styles.bodyViewStyle} onLayout={(e)=>this.onLayoutHeader(e)}>
                    <View style={styles.headerWrap}>                        
                        <TouchableOpacity 
                            onPress={()=>
                                this.props.screenProps.navigation.navigate('RequestToHackers2')
                            }
                            style={styles.iconWrapper}
                        >
                            <Image
                                style={styles.iconCommon}
                                source={require('../../../assets/icons/btn_navi_cs.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={()=>
                                this.props.screenProps.navigation.navigate('SetupScreen')
                            }
                            style={styles.iconWrapper}
                        >
                            <Image
                                style={styles.iconCommon}
                                source={require('../../../assets/icons/btn_navi_setting.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.iconWrapper}
                            onPress={() => this.myCloseDrawer()}>
                            <Image
                                style={[ styles.iconCommon, styles.iconClose ]}
                                source={require('../../../assets/icons/btn_close_page.png')} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.maincontainer}>
                        {/* 헤더 */}
                        {this.props.userToken !== null ?
                        <View style={styles.mainheader}>
                            <CustomTextB style={styles.mainuserName}>
                                {typeof this.props.userToken.memberName !== 'undefined'
                                ?
                                this.props.userToken.memberName
                                :
                                this.props.userToken.length > 0
                                ?
                                JSON.parse(this.props.userToken).memberName
                                :
                                '이름없음'
                                }
                                님
                                {/*this.props.userToken.memberName || '이름없음'}님,*/}
                            </CustomTextB>
                            {this.renderTimeDailog(this.state.nowTimeHour)}
                            
                        </View>                        
                        :
                        <View style={styles.mainheader}>                            
                            <CustomTextL style={styles.mainuserMessage}>
                                더 많은 서비스를{'\n'}
                                이용하실 수 있습니다.
                            </CustomTextL>                              
                        </View>
                        }

                        {/* 컨텐츠 */}
                        <View style={styles.maincontent}>
                            <View style={styles.mainiconContainer}>
                                <TouchableOpacity 
                                    onPress={()=>
                                        this.moveScreen('MySettleScreen')
                                        //this.props.screenProps.navigation.navigate('MySettleScreen')
                                    }
                                    style={styles.mainiconWrapper}
                                >
                                    <Image
                                        style={styles.mainiconCommon}
                                        source={require('../../../assets/icons/icon_lnb_pay.png')}/>
                                    <CustomTextM style={styles.myOrderText}>결제내역</CustomTextM>
                                </TouchableOpacity>
                                {Platform.OS !== 'ios' && (
                                    <>
                                    <View style={styles.mainiconSeperator}></View>
                                    <TouchableOpacity 
                                        onPress={()=>
                                            this.moveScreen('CartScreen')
                                            //this.props.screenProps.navigation.navigate('CartScreen')
                                        }
                                        style={styles.mainiconWrapper}>
                                        <Image
                                            style={styles.mainiconCommon}
                                            source={require('../../../assets/icons/icon_lnb_cart.png')}/>
                                        <CustomTextM style={styles.myOrderText}>장바구니</CustomTextM>
                                    </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        </View>

                     

                        {/* 푸터 */}
                        <View style={styles.mainfooter}>
                            <View style={styles.mainfooterIconContainer}>
                                <TouchableOpacity 
                                    onPress={()=>
                                        this.props.screenProps.navigation.navigate('FreeBoard')
                                    }
                                    style={styles.mainfooterIconWrapper}>
                                    <Image
                                        style={styles.mainfooterIconCommon}
                                        source={require('../../../assets/icons/btn_lnb_com.png')}/>
                                    <CustomTextR style={styles.myOrderText}>
                                        자유게시판
                                    </CustomTextR>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.mainfooterIconContainer}>
                                <TouchableOpacity 
                                    onPress={()=>
                                        this.props.screenProps.navigation.navigate('HackersFamily')
                                    }
                                    style={styles.mainfooterIconWrapper}
                                >
                                    <Image
                                        style={styles.mainfooterIconCommon}
                                        source={require('../../../assets/icons/btn_lnb_fam.png')}/>
                                    <CustomTextR style={styles.myOrderText}>
                                        해커스 패밀리
                                    </CustomTextR>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.mainfooterIconContainer}>
                                <TouchableOpacity 
                                onPress={()=>
                                    this.props.screenProps.navigation.navigate('CustomService')
                                }
                                style={styles.mainfooterIconWrapper}
                                >
                                    <Image
                                        style={styles.mainfooterIconCommon}
                                        source={require('../../../assets/icons/btn_lnb_cus.png')}/>
                                    <CustomTextR style={styles.myOrderText}>
                                        고객센터
                                    </CustomTextR>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    
                </View>

                { ( this.state.bottombar ||  this.state.isBackOpacity ) &&                    
                    <View style={[styles.hiddenBack,{opacity:this.state.backOpacity}]} />
                }
                
                <View                     
                    //ref="TargetElement" 
                    //style={{backgroundColor:DEFAULT_COLOR.lecture_base}}
                >
                    <View style={{backgroundColor:DEFAULT_COLOR.lecture_base,position:'absolute',left:0,top:-35,width:SCREEN_WIDTH,height:SCREEN_HEIGHT,zIndex:-1}} />
                    <SlidingPanel
                        headerLayoutHeight = {30}
                        headerLayout = { () =>
                            <View style={this.state.bottombar ? styles.headerLayoutStyleOn : styles.headerLayoutStyle} >
                                {
                                this.state.bottombar
                                ?
                                <Image source={require('../../../assets/icons/btn_more_close_wh.png')} resizeMode='contain' style={{width:18,height:10}} />
                                :
                                <Image source={require('../../../assets/icons/btn_more_open_wh.png')} resizeMode='contain' style={{width:18,height:10}} />
                                }
                                {/*
                                <Icon2 name={this.state.bottombar ? "chevron-thin-down" : "chevron-thin-up"} size={15} color={DEFAULT_COLOR.base_color_fff} />
                                */}
                            </View>
                        } 
                        onScrollHeight={(e,j)=> this.onScrollHeight(e,j)}
                        slidingPanelLayoutHeight={SCREEN_HEIGHT > 800 ? CONTAINER_HEIGHT*0.78 : CONTAINER_HEIGHT-50}                        
                        AnimationSpeed={500}
                        allowAnimation={true}           
                        slidingPanelLayout = { () =>
                            <View style={[
                                {paddingHorizontal:this.state.backHorizotal},
                                this.state.bottombar ? styles.slidingPanelLayoutStyleOn :  styles.slidingPanelLayoutStyle]}  >
                               <View style={styles.dataWrapper}>
                                    { this.props.mypageSelectedTabsLnb 
                                    ?
                                    <View style={{flex:1,paddingTop:20}}>
                                        <View style={{borderBottomColor:DEFAULT_COLOR.base_color_222,borderBottomWidth:1,alignItems:'flex-end',paddingTop:5,paddingBottom:3}}>
                                            <CustomTextB style={styles.newsSelectedText}>최근 본 컨텐츠</CustomTextB>
                                        </View>
                                        <TouchableOpacity 
                                            onPress={()=>this.lnbSlideMenu(false)}
                                            style={{alignItems:'flex-end',paddingTop:10,paddingBottom:3}}>
                                                <View style={{flexGrow:1,flexDirection:'row'}}>
                                                    <CustomTextR style={styles.newsUnSelectedText}>새로온 소식</CustomTextR>
                                                    {this.props.newsUnreadCount === 0 && 
                                                        <Text style={{paddingLeft:2,fontSize:7,color:DEFAULT_COLOR.lecture_base}}>●</Text>
                                                    }
                                                </View>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <View style={{flex:1,paddingTop:20}}>
                                        <TouchableOpacity 
                                            onPress={()=>this.lnbSlideMenu(true)}
                                            style={{alignItems:'flex-end',paddingTop:5,paddingBottom:3}}>
                                            <CustomTextR style={styles.newsUnSelectedText}>최근 본 컨텐츠</CustomTextR>
                                        </TouchableOpacity>
                                        <View style={{borderBottomColor:DEFAULT_COLOR.base_color_222,borderBottomWidth:1,alignItems:'flex-end',paddingTop:10,paddingBottom:3}}>
                                            <View style={{flexGrow:1,flexDirection:'row'}}>
                                                <CustomTextB style={styles.newsSelectedText}>새로온 소식</CustomTextB>
                                                {this.props.newsUnreadCount === 0 && <Text style={{paddingLeft:2,fontSize:7,color:DEFAULT_COLOR.lecture_base}}>●</Text>}
                                            </View>
                                        </View>
                                    </View>
                                    }
                                    
                                    <View 
                                        style={{flex:2,paddingTop:15,paddingLeft:10,maxHeight:SCREEN_HEIGHT*0.8}} 
                                        onLayout={(e)=>this.onLayoutSlide(e)}
                                    >
                                        <View style={{width:this.state.slideRightWidth,paddingRight:5}}>
                                            <ScrollView
                                                ref={(ref) => {
                                                    this.ScrollView = ref;
                                                }}
                                                indicatorStyle={'white'}
                                                scrollEventThrottle={16}
                                                keyboardDismissMode={'on-drag'}
                                                //onScroll={e => this.handleOnScroll(e)}
                                                onMomentumScrollEnd = {({nativeEvent}) => { 
                                                //this.loadMoreData (nativeEvent) 
                                                }}
                                                onScrollEndDrag ={({nativeEvent}) => { 
                                                    //this.loadMoreData (nativeEvent) 
                                                }}
                                            
                                            >
                                                { this.props.mypageSelectedTabsLnb 
                                                ?
                                                <RecentlyHistory screenProps={this.props.screenProps} />
                                                :
                                                <NewsContents screenProps={this.props.screenProps} />
                                                }
                                            </ScrollView>
                                            { this.state.showTopButton &&
                                                <TouchableOpacity 
                                                    style={styles.fixedUpButton}
                                                    onPress={e => this.upButtonHandler()}
                                                >
                                                    <Icon name="up" size={30} color="#000" />
                                                </TouchableOpacity>
                                            } 
                                        </View>                                       
                                    </View>
                                </View>
                            </View>
                        }
                        //onDragStart={(event)=>this.pageScroll(event)}
                        onDragEnd={(event)=>this.pageScroll(event)}
                        onAnimationStop={()=>this.onAnimationEnd}
                        nowTopPosition={this.state.bottombar}
                        setChangePosition={ChangePositionY}
                        onMoveTop={this.onMoveTop}
                        onMoveTop2={this.onMoveTop2}
                    />
                </View>
              
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        //flex: 1,
    },
   
    bodyViewStyle: {
        //flex: 1,
        //justifyContent: 'center', 
        //alignItems: 'center',
        marginBottom:50
    },
   
    headerWrap : {
        height: HEADER_HEIGHT,flexDirection: 'row',justifyContent: 'flex-end',
    },
    headerLayoutStyle: {
        flex:1,
        zIndex:5,
        width : SCREEN_WIDTH, 
        height: 30, 
        
        backgroundColor: 'transparent',//backgroundColor: DEFAULT_COLOR.lecture_base,
        justifyContent: 'center', 
        alignItems: 'center',
        overflow:'hidden'
    },
    headerLayoutStyleOn : {
        flex:1,
        zIndex:10,
        width : SCREEN_WIDTH, 
        height: 30, 
        
        backgroundColor: 'transparent',
        justifyContent: 'center', 
        alignItems: 'center',
        //opacity:0.2,
        overflow:'hidden'
    },
    hiddenBack : {
        position:'absolute',
        top:0,
        left:0,
        width:SCREEN_WIDTH,
        //height:SCREEN_HEIGHT*0.8,
        height : SCREEN_HEIGHT - CONTAINER_HEIGHT,
        backgroundColor: '#333',
        //opacity:0.5,
    },
    slidingPanelLayoutStyle: {
        zIndex:5,
        width:SCREEN_WIDTH, 
        //paddingHorizontal:20,
        height:SCREEN_HEIGHT*0.9, 
        backgroundColor: 'transparent',//DEFAULT_COLOR.lecture_base,
        overflow:'hidden'
    },
    slidingPanelLayoutStyleOn: {
        zIndex:5,
        paddingBottom:20,
        width:SCREEN_WIDTH, 
        height:SCREEN_HEIGHT*0.9, 
        backgroundColor: 'transparent',//DEFAULT_COLOR.lecture_base,//"#999",
        overflow:'hidden',        
    },
    
    dataWrapper : {
        flex:1,
        flexDirection:'row',
        minHeight:SCREEN_HEIGHT*0.9,
        maxHeight:SCREEN_HEIGHT*0.9,
        backgroundColor:'#fff',
        borderTopLeftRadius:20,
        borderTopEndRadius: 20,
        //borderTopColor:DEFAULT_COLOR.base_color_fff,
        //borderTopWidth:1,
        paddingBottom:50
    },
    myOrderText : {
        color: DEFAULT_COLOR.base_color_444,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)        
    },
    newsSelectedText : {
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),     
        color: DEFAULT_COLOR.base_color_222,
        letterSpacing : -0.84
    },
    newsUnSelectedText : {
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
        color: DEFAULT_COLOR.base_color_888,
        letterSpacing : -0.84
    },
    commonTextStyle: {
        color: 'white', 
        fontSize: 18,
    },
    iconWrapper: {
        alignSelf: 'center',
    },
    iconCommon: {
        width: 33,
        height: 33,
        marginRight: 18,
    },
    iconClose: {
        width: 16,
        height: 16,
    },

    maincontainer: {
        paddingVertical:10,paddingHorizontal:20
    },
    mainheader: {        
        justifyContent: 'center',
        marginBottom:20

    },
    mainuserName: {
        color: DEFAULT_COLOR.lecture_base,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_large),
        letterSpacing : -1.72, 
        marginBottom: 10,
    },
    mainuserMessage: {
        color: DEFAULT_COLOR.base_color_444,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_large),
        lineHeight : PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_large),
        letterSpacing : -1.72
    },
    maincontent: {        
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom:20
        //backgroundColor: '#00FF0033',
    },
    mainiconContainer: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: DEFAULT_COLOR.input_bg_color,
        borderRadius: 4,
        backgroundColor: DEFAULT_COLOR.input_bg_color,
    },
    mainiconWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainiconSeperator: {
        width: 1,
        height: 20,
        alignSelf: 'center',
        backgroundColor: '#DDDDDD',
    },
    mainiconCommon: {
        width: 17,
        height: 17,
        marginRight: 10,
    },
    maintextCommon: {
        textAlign: 'center',
        color: DEFAULT_COLOR.base_color_222,
        fontSize: DEFAULT_TEXT.body_13,
    },
    mainfooter: {
        
        flexDirection: 'row',
        //backgroundColor: '#0000FF33',
    },
    mainfooterIconContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainfooterIconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainfooterIconCommon: {
        width: 60,
        height: 47,
    },
});


function mapStateToProps(state) {
    return {
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
        userToken: state.GlabalStatus.userToken,   
        mypageSelectedTabsLnb: state.GlabalStatus.mypageSelectedTabsLnb,   
        newsUnreadCount: state.GlabalStatus.newsUnreadCount,   
        isDrawerOpen :state.GlabalStatus.isDrawerOpen,   
    };
}



function mapDispatchToProps(dispatch) {
    return {
      
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        },
        _updateMypageSelectedTabsLnb:(str)=> {
            dispatch(ActionCreator.updateMypageSelectedTabsLnb(str))
        },
        _updateDrawerOpen:(boolean)=> {
            dispatch(ActionCreator.updateDrawerOpen(boolean))
        },
        _updateGlobalNewsUnReadCount:(num)=> {
            dispatch(ActionCreator.updateGlobalNewsUnReadCount(num))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(IntroScreen);

