import React, { Component } from 'react';
import {Platform,ScrollView,View,StyleSheet,Text,Image,Dimensions,StatusBar,TouchableOpacity,TouchableHighlight,ActivityIndicator,PixelRatio,Alert,BackHandler} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationEvents } from 'react-navigation';
import { Overlay } from 'react-native-elements';
import ParallaxScrollView from './ParallaxScrollView';
import Toast from 'react-native-tiny-toast';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/Feather';
Icon2.loadFont();
import LinearGradient from "react-native-linear-gradient";
import FreeBoardList from './FreeBoardList';


//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import CommonFunction from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR, CustomTextL} from '../../Style/CustomText';


const {width: SCREEN_WIDTH,height : SCREEN_HEIGHT} = Dimensions.get("window");
const IconsPaddingTop = Platform.OS === 'android' ? 10 : 20
const IconsPaddingMinus = Platform.OS === 'android' ? 40 : 0
const pageViewLimit = 5;

class  FreeBoard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            isVisibleOveray : false,
            focusTab : 0,
            isGoback : false,
            beforeFocusTab : 0,
            headerHeight : Platform.OS === 'android' ? 75 :  CommonFuncion.isIphoneX() ? 65 : 55,
            selectedSample : 1,
            itemList : [],
            topNotice : [],
            myInterestSubject : [],
            formMemberIdx : 0,
            moreLoading : false,
            isonlyMyview : false,       
            moreLoading : false,            
            currentpage : 1,
            ismore : false,    
            totalReview : 0,    
            refreshTextBookInfo : this.refreshTextBookInfo.bind(this),
            refreshTextBookInfoMore : this.refreshTextBookInfoMore.bind(this),
        }
    }

    static navigationOptions = {
        header: null
    }

    async UNSAFE_componentWillMount() {   
        await this.getUserToken(); 
        await this.refreshTextBookInfo(1);    
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);    
        this.getStorageData();//내 관심분야
        
        if ( Platform.OS === 'android') {
            this.androidStatusSetup(true);
        }
    }  

    componentDidMount() {
        /*
        let pushMessage = "お前あほかちゃんとやれよ";
        let sendTime = 10 ; //add per second 최소 5초 즉시발송개념, 그외에는 지연발송
        let isVibrate = false ;//
        let screenName = 'TextBookDetail';
        let screenIdx = 0;
        //CommonFunction.sendLocalPushNotification(pushMessage,sendTime,isVibrate,screenName,screenIdx)

       
        PushNotification.localNotificationSchedule({            
            message: "My Notification Message" + Platform.OS, // (required)
            date: new Date(Date.now() + 10 * 1000), // in 10 secs
        });        
        if ( Platform.OS === 'ios') {
            PushNotificationIOS.localNotificationSchedule({            
                message: "My Notification Message iOS", // (required)
                date: new Date(Date.now() + 10 * 1000), // in 10 secs                
                
            });
        }else{
            PushNotification.localNotificationSchedule({            
                message: "My Notification Message Andorid", // (required)
                date: new Date(Date.now() + 10 * 1000), // in 60 secs
            });
        }
        */
        
       
    }

    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보        
    }

    UNSAFE_componentWillReceiveProps(nextProps) {     
    }

    UNSAFE_componentWillUnmount(){
        if ( Platform.OS === 'android') {
            this.androidStatusSetup(false)
        }          
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
    }

    
    refreshTextBookInfo = async(page) => {        
        
        let interestFieldID = (this.state.selectedSample === 1 || this.state.selectedSample === '') ? '' : this.state.selectedSample;
        let isMemberIdx = this.state.formMemberIdx;
        let isMine = this.state.isonlyMyview ? true : false;
        console.log('page',DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/board/article?page='+page+'&' + 'paginate=' + pageViewLimit + '&interestFieldID=' + interestFieldID + '&memberIdx=' + isMemberIdx + '&isMine=' + isMine)
        await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/board/article?page='+page+'&' + 'paginate=' + pageViewLimit + '&interestFieldID=' + interestFieldID + '&memberIdx=' + isMemberIdx + '&isMine=' + isMine ,{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': DEFAULT_CONSTANTS.apiAdminKey
            }), 
                body:null
            },10000
            ).then(response => {   
                //console.log( 'response.data',response.data)             
                if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                    if ( response.code !== '0000' ) {
                        this.failCallAPi()
                        this.setState({loading:false})    
                    }else{
                        this.setState({
                            loading : false,
                            itemList: response.data.articleList,
                            topNotice : response.data.noticeList,
                            ismore : response.data.current_page < response.data.last_page ? true : false,
                            currentpage : response.data.current_page,
                            totalReview : parseInt(response.data.total)
                        })
                        this.forceUpdate()
                    }

                }else{
                    this.failCallAPi()
                    this.setState({loading:false})    
                }
                this.setState({loading:false})    
            })
            .catch(err => {
                console.log('login error => ', err);
                this.failCallAPi()
                this.setState({loading:false})    
        });
    }

    refreshTextBookInfoMore = async(page) => {
        console.log('page',page)
        this.setState({moreLoading:true})
        let interestFieldID = (this.state.selectedSample === 1 || this.state.selectedSample === '') ? '' : this.state.selectedSample;
        let isMemberIdx = this.state.formMemberIdx;
        let isMine = this.state.isonlyMyview ? true : false;
        let selectedFilterCodeList = this.state.itemList;   

        //console.log('page',DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/board/article?page='+page+'&' + 'paginate=' + pageViewLimit + '&interestFieldID=' + interestFieldID + '&memberIdx=' + isMemberIdx + '&isMine=' + isMine)
        await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/board/article?page='+page+'&' + 'paginate=' + pageViewLimit + '&interestFieldID=' + interestFieldID + '&memberIdx=' + isMemberIdx + '&isMine=' + isMine ,{
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
                        this.setState({loading:false})    
                    }else{
                        response.data.articleList.forEach(function(element,index,array){                                
                            selectedFilterCodeList.push(element);
                        });   
                        //console.log('selectedFilterCodeList', selectedFilterCodeList)
                        this.setState({
                            moreLoading : false,
                            itemList: selectedFilterCodeList,//response.data.articleList,
                            topNotice : typeof response.data.noticeList !== 'undefined' ? response.data.noticeList : [],
                            ismore : response.data.current_page < response.data.last_page ? true : false,
                            currentpage : response.data.current_page,
                        })
                    }

                }else{
                    this.failCallAPi()
                    this.setState({moreLoading:false})    
                }
                this.setState({moreLoading:false})    
            })
            .catch(err => {
                console.log('login error => ', err);
                this.failCallAPi()
                this.setState({moreLoading:false})    
        });
    }

    failCallAPi = () => {
     
        let message = "데이터 수신중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);

    }

    getUserToken = async() =>{
        
        const isLogin = await CommonUtil.isLoginCheck(this.props);
        if (isLogin === true) {
            let userToken = await AsyncStorage.getItem('userInfo');
            if ( this.props.userToken !== null  ) {
                if ( typeof this.props.userToken.memberIdx !== 'undefined'  ) {
                    await this.setState({
                        formMemberIdx : this.props.userToken.memberIdx || '',
                    })           
                }
            }else if ( userToken !== null ) {            
                await this.setState({
                    formMemberIdx : JSON.parse(userToken).memberIdx || '',
                })
            }
        }

        /*
        let userToken = await AsyncStorage.getItem('userInfo');
        
        this.props._saveUserToken(userToken)    
        if ( this.props.userToken !== null ) {
            //console.log('userToken 11521', userToken.memberIdx)
            this.setState({formMemberIdx : JSON.parse(userToken).memberIdx})
        } 
        */   
    }
   

    getStorageData = async () => {        
        const tvalue = await AsyncStorage.getItem('boardMyInterest')        
        if(tvalue !== null) {
            this.props._updateMyInterestMultiCode(JSON.parse(tvalue));            
            this.setState({
                loading : false,
                myInterestSubject : JSON.parse(tvalue)
            })
        }
        
        this.setState({
            loading : false
        })
    }

    updateStorageData = () => {        
        this.setState({
            loading : false,
            myInterestSubject : this.props.myInterestCodeMulti
        })
    }

    _historyBack(){        
        if ( Platform.OS === 'android') {
            this.androidStatusSetup(false)
        }  
        this.props.navigation.goBack(null);
        this.props.navigation.toggleDrawer();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton); 
        if(this.timeout){
            clearInterval(this.timeout);
        }
    }

    handleBackButton = () => {
        if ( Platform.OS === 'android') {
            this.androidStatusSetup(false)
        }  
        this.props.navigation.goBack(null);
        this.props.navigation.toggleDrawer();        
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton); 
        return true;
    };
    

    selectSampleKeyword = async(idx) => {
        if ( idx !== this.state.selectedSample ) {
            await this.setState({selectedSample : idx});
            this.refreshTextBookInfo(1)
        }
    }

    onRefreshMode = data => {    
        this.setState({isGoback : data.isRefresh});
    };

    goWriteForm = async() => {

        //this.notif.appLocalNotification(null,this.props)
                
        if ( this.props.userToken !== null ) {
            await this.setState({isVisibleOveray:false});
            this.props.navigation.navigate('FreeBoardWrite',{
                memberIdx : JSON.parse(this.props.userToken).memberIdx,
                onRefreshMode: this.onRefreshMode
            });
        } else {
            Alert.alert('', '로그인이 필요합니다.\n로그인 하시겠습니까?',
            [
                {text: '확인', onPress: () => {
                    this.setState({isVisibleOveray:false})
                    this.props.navigation.navigate('SignInScreen', {goScreen: 'FreeBoardWrite',onRefreshMode: this.onRefreshMode});
                    }
                },                
                {text: '취소', onPress: () => this.setState({isVisibleOveray:false})},
            ]);
        }
        
    }


    checkMyContent = async(bool) => {
        if ( bool ) {
            await this.setState({isonlyMyview:false})
            await this.refreshTextBookInfo(1)
            this.setState({isVisibleOveray : false})            
        }else {
            if ( this.state.formMemberIdx ) {
                await this.setState({
                    isonlyMyview:true,
                    isVisibleOveray:false
                })
                this.refreshTextBookInfo(1)
            }else{
                await this.setState({isVisibleOveray : false});
                let message = "로그인이 필요합니다..\n로그인 후 이용해주세요";
                let timesecond = 2000;
                CommonFuncion.fn_call_toast(message,timesecond);
                return false;
            }
        }
        
    }
   
    androidStatusSetup = async(bool) => {        
        if ( bool ) {            
            //StatusBar.setBarStyle("light-content");
            //StatusBar.setBackgroundColor("transparent");
        }else{            
            //StatusBar.setBackgroundColor("rgba(0,0,0,0)");
        }
        StatusBar.setTranslucent(bool);
    }

    render() {
        
        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        }else {
            return(
                <View style={ styles.container } >
                    { 
                    Platform.OS === 'android' && <StatusBar barStyle={"dark-content"} backgroundColor={DEFAULT_COLOR.lecture_base} animated={true} hidden={false}/>
                    }
                    { this.state.isVisibleOveray === false &&
                        <View style={styles.fixedWriteButton}>
                            <TouchableOpacity onPress={e => this.setState({isVisibleOveray : true})}>
                                <Image 
                                    source={require('../../../assets/icons/btn_floating_write.png')} resizeMode='contain' 
                                    style={{width:PixelRatio.roundToNearestPixel(72),height:PixelRatio.roundToNearestPixel(72)}}
                                />
                            </TouchableOpacity>
                        </View>
                    }
                    <NavigationEvents
                        onWillFocus={payload => {
                            if (Platform.OS === "android") {
                                this.androidStatusSetup(true);
                            }
                            console.log('FreeBoard onWillFocus',payload);
                            if ( this.state.isGoback ) {
                                console.log('onRefreshModeonRefreshMode4444444444');
                                this.refreshTextBookInfo(1)
                            }
                            this.updateStorageData();
                            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);          
                            
                        }}
                        onWillBlur={payload => { 
                            if ( Platform.OS === 'android') {
                                this.androidStatusSetup(false)
                            }  
                            console.log('FreeBoard onWillBlur')
                            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
                        }}
                    />
                    { this.state.isVisibleOveray &&
                        <View style={{zIndex:5}}>
                            
                            
                            <Overlay
                                isVisible={this.state.isVisibleOveray}
                                windowBackgroundColor="rgba(0, 0, 0, 0.8)"
                                overlayBackgroundColor="tranparent"
                                containerStyle={{
                                    margin:0
                                }}                            
                            >
                                <View style={{position:'absolute',left:SCREEN_WIDTH*0.3,top:SCREEN_HEIGHT/2-IconsPaddingMinus,width:SCREEN_WIDTH*0.55,backgroundColor:'transparent'}}>
                                    <View style={{flex:1,alignItems:'flex-end'}}>
                                        <TouchableOpacity                                     
                                            onPress={e => this.goWriteForm()}
                                            style={{flexDirection:'row',flexGrow:1,justifyContent:'center'}}
                                        >
                                            <View style={{justifyContent:'center'}}>
                                                <CustomTextR style={{color:DEFAULT_COLOR.base_color_fff,letterSpacing:-0.7,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),paddingRight:10}}>
                                                    게시글 작성하기
                                                </CustomTextR>
                                            </View>
                                            <View style={{backgroundColor:DEFAULT_COLOR.lecture_base,width:50,height:50,borderRadius:25,alignItems:'center',justifyContent:'center'}}>
                                                <Image 
                                                    source={require('../../../assets/icons/btn_floating_open_write.png')} resizeMode='contain' 
                                                    style={{width:PixelRatio.roundToNearestPixel(57),height:PixelRatio.roundToNearestPixel(57)}}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                        {this.props.userToken !==  null &&
                                        <TouchableOpacity                                     
                                            onPress={e => this.checkMyContent(this.state.isonlyMyview)}
                                            style={{flexDirection:'row',flexGrow:1,justifyContent:'center',paddingTop:IconsPaddingTop}}
                                        >
                                            <View style={{justifyContent:'center'}}>
                                                <CustomTextR style={{color:DEFAULT_COLOR.base_color_fff,letterSpacing:-0.7,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),paddingRight:10}}>
                                                    {this.state.isonlyMyview ? '전체 보기': '내글 확인하기' }
                                                </CustomTextR>
                                            </View>
                                            <View style={{backgroundColor:DEFAULT_COLOR.base_color_fff,width:50,height:50,borderRadius:25,alignItems:'center',justifyContent:'center'}}>
                                                <Image 
                                                    source={require('../../../assets/icons/btn_floating_open_mycomment.png')} resizeMode='contain' 
                                                    style={{width:PixelRatio.roundToNearestPixel(57),height:PixelRatio.roundToNearestPixel(57)}}
                                                />
                                            </View>                                            
                                        </TouchableOpacity>
                                        }
                                        <TouchableOpacity                                     
                                            onPress={e => this.setState({isVisibleOveray : false})}
                                            style={{justifyContent:'center',paddingTop:IconsPaddingTop}}
                                        >   
                                            <View style={{width:50,height:50,borderRadius:25,alignItems:'center',justifyContent:'center'}}>
                                                <Image 
                                                    source={require('../../../assets/icons/btn_floating_open_close.png')} resizeMode='contain' 
                                                    style={{width:PixelRatio.roundToNearestPixel(57),height:PixelRatio.roundToNearestPixel(57)}}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                        
                                    </View>
                                </View>
                                
                            </Overlay>
                        </View>
                    }
                    <ParallaxScrollView
                        windowHeight={SCREEN_HEIGHT * 0.35}
                        backgroundSource='../../../assets/background/img_notice.png'
                        navBarHeight={ Platform.OS === 'android' ? 75 :  CommonFuncion.isIphoneX() ? 65 : 55}
                        navBarColor={'#fff'}
                        navBarTitle=''
                        navBarView={false}
                        lectureName={<CustomTextL style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), fontWeight: '300', color: '#fff', letterSpacing: PixelRatio.roundToNearestPixel(-1.72)}}>해티즌의{'\n'}자유로운 이야기 :)</CustomTextL>}
                        textbookTitle=''
                        markImage={''}
                        leftIcon={{name: 'left', color: '#fff', size: 20, type: 'font-awesome'}}
                        centerTitle={<CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16), color: '#fff', letterSpacing: PixelRatio.roundToNearestPixel(-0.95)}}>자유게시판</CustomTextR>}
                        leftIconOnPress={()=>this._historyBack()}
                        //leftIconOnPress={()=>this.props.navigation.toggleDrawer()}
                        rightIcon={null}   
                        screenProps={this.props}
                    >
                        <View style={styles.contentDataWrapper}>
                            <View style={{flexDirection:'row',backgroundColor:'transparent'}}>
                                <View style={{width:SCREEN_WIDTH*0.9,zIndex:5}}>
                                    <ScrollView horizontal={true}>
                                        <View >
                                            <TouchableHighlight 
                                                //onPress={() => this.setState({selectedSample : item.index})}
                                                onPress={()=>this.selectSampleKeyword(1)}
                                                style={this.state.selectedSample === 1 ? styles.sampleWrapperOn: styles.sampleWrapper}>
                                                    {this.state.selectedSample === 1 ? 
                                                    <CustomTextB style={styles.smapleTextOn}>전체</CustomTextB>
                                                    :
                                                    <CustomTextR style={styles.smapleText}>전체</CustomTextR>
                                                    }
                                                
                                            </TouchableHighlight>
                                        </View>
                                    {
                                        Array.isArray(this.props.myInterestCodeMulti ) === true &&
                                        //this.props.myInterestCodeMulti.map((xitem,xindex)=> {
                                        this.state.myInterestSubject.map((xitem,xindex)=> { 
                                        return (
                                            <View key={xindex}>
                                                <TouchableHighlight 
                                                    //onPress={() => this.setState({selectedSample : item.index})}
                                                    onPress={()=>this.selectSampleKeyword(xitem.code)}
                                                    style={this.state.selectedSample === xitem.code ? styles.sampleWrapperOn: styles.sampleWrapper}>
                                                        {this.state.selectedSample === xitem.code ? 
                                                        <CustomTextB style={styles.smapleTextOn}>{xitem.name}</CustomTextB>
                                                        :
                                                        <CustomTextR style={styles.smapleText}>{xitem.name}</CustomTextR>
                                                        }
                                                </TouchableHighlight>
                                            </View>
                                        )})
                                       
                                    }
                                    </ScrollView>
                                    <LinearGradient
                                        colors={["rgba(255,255,255,1)", "rgba(255,255,255,0.5)", "rgba(255,255,255,0)"]}
                                        locations={[0, 0.5, 1]}
                                        style={{position: "absolute", height: "100%", width:30, right:0,bottom:2}}
                                    />
                                </View>
                                <View style={{position:'absolute',left:0,bottom:0,backgroundColor:DEFAULT_COLOR.input_border_color,height:2,width:'100%'}}
                                ></View>
                                <View style={{width:SCREEN_WIDTH*0.1,justifyContent:'center',alignItems:'center'}}>
                                    <TouchableOpacity
                                        onPress={()=>  this.props.navigation.navigate('SetupMyInterest')}
                                    >
                                        <Image source={require('../../../assets/icons/btn_subject_tab_add.png')} style={{width:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17)}} />
                                    </TouchableOpacity>
                                </View>
                                                                
                            </View>
                            <View 
                                style={{height:parseInt(SCREEN_HEIGHT - this.state.headerHeight)}}
                                //style={{height:CommonFuncion.isIphoneX() ? SCREEN_HEIGHT*0.7 : SCREEN_HEIGHT*0.6}}
                            >
                                <ScrollView style={{marginBottom:50}}  nestedScrollEnabled={Platform.OS === 'android' ? true : false}>
                                    <FreeBoardList screenState={this.state} screenProps={this.props} />
                                </ScrollView>
                            </View>
                        </View>
                    </ParallaxScrollView>
                
                </View>
            );
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    contentDataWrapper : {
        width:SCREEN_WIDTH,
        height: Platform.OS === 'ios' ? CommonFuncion.isIphoneX() ? SCREEN_HEIGHT*0.85 : SCREEN_HEIGHT*0.9 : SCREEN_HEIGHT*0.90,
        maxHeight:SCREEN_HEIGHT*0.95,
        backgroundColor: '#fff',
        paddingVertical:20
    },
    sampleWrapper : {
        marginHorizontal:5,paddingVertical:10,paddingHorizontal:10,backgroundColor:'transparent'
    },
    sampleWrapperOn : {
        marginHorizontal:5,paddingVertical:10,paddingHorizontal:10,borderBottomColor:DEFAULT_COLOR.lecture_base,borderBottomWidth:2,backgroundColor:'#fff'
    },
    smapleText : {fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),letterSpacing:-0.94},
    smapleTextOn : {fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:DEFAULT_COLOR.lecture_base,letterSpacing:-0.94},    
    itemWrap : {                
        marginHorizontal:10,        
        borderBottomWidth:1,
        borderBottomColor:'#ccc',
        marginVertical:10,        
        paddingVertical:10
    },

    fixedWriteButton : {
        position:'absolute',bottom:70,right:10,width:60,height:60,alignItems:'center',justifyContent:'center',zIndex:2,borderRadius:30,opacity:0.8
    },
    fixedWriteButton2 : {
        position:'absolute',bottom:70,right:20,width:60,height:60,backgroundColor:'#222',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:30,
    },

    slideCommonWrap: {        
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal:5,
        marginVertical:2,
        paddingHorizontal:5,
        paddingVertical:7,
        backgroundColor:'#fff',
        borderWidth:1,
        borderColor:DEFAULT_COLOR.input_border_color,
        borderRadius:5
    },

});

function mapStateToProps(state) {
    return {       
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
        myInterestCodeMulti: state.GlabalStatus.myInterestCodeMulti,   
        userToken: state.GlabalStatus.userToken,   
    };
}


function mapDispatchToProps(dispatch) {
    return {
        _updateMyInterestMultiCode:(str) => {
            dispatch(ActionCreator.updateMyInterestMultiCode(str));
        },
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(FreeBoard);
