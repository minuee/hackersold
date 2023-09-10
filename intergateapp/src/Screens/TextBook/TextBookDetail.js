import React, { Component } from 'react';
import {Platform,ScrollView,View,StyleSheet,Linking,Text,Image,Dimensions,StatusBar,TouchableOpacity,ActivityIndicator,PixelRatio,SafeAreaView,Alert,BackHandler} from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import 'moment/locale/ko'
import  moment  from  "moment";

import ParallaxScrollView from './ParallaxScrollView';
import SlidingPanel from './SlidingPanel';
import SlidingPanel2 from './SlidingPanel2';
import Toast from 'react-native-tiny-toast';
import { NavigationEvents } from 'react-navigation';
//import {ScrollableTabView, ScrollableTabBar} from '@valdio/react-native-scrollable-tabview';
import {ScrollableTabView, ScrollableTabBar}  from '../../Utils/TopTabs'
import Icon from 'react-native-vector-icons/AntDesign';

Icon.loadFont();
import Icon2 from 'react-native-vector-icons/Entypo';
Icon2.loadFont();
import Icon3 from 'react-native-vector-icons/MaterialIcons';
Icon3.loadFont();

import BottomDrawer from 'rn-bottom-drawer';
import BottomSheet from './BottomSheet';
//import RenderMaking from './RenderMaking'

const SendIntentAndroid = require("react-native-send-intent");
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextM,CustomTextR, CustomTextB, TextRobotoM,TextRobotoR} from '../../Style/CustomText';


const HeaderNewContent = 100;
const {width: SCREEN_WIDTH,height : SCREEN_HEIGHT} = Dimensions.get("window");
const IMAGE_HEIGHT = 250 ;
const HEADER_HEIGHT = Platform.OS === "ios" ? (CommonFuncion.isIphoneX() ? 84 : 64 ) : 50 ;
const SCROLL_HEIGHT = IMAGE_HEIGHT - HEADER_HEIGHT + HeaderNewContent;
const THEME_COLOR = DEFAULT_CONSTANTS.baseColor;//"rgba(85,186,255, 1)";
const THEME_TEXT_COLOR = DEFAULT_COLOR.base_color_222;
const FADED_THEME_COLOR = "rgba(85,186,255, 0.8)";

const TAB_BAR_HEIGHT = CommonFuncion.isIphoneX() ? 50 : 45;//Platform.OS === 'ios' ? 30 : 20;

const HEADER_BLANK = 50;
const CONTAINER_HEIGHT = SCREEN_HEIGHT*0.3;
const ChangePositionY = SCREEN_HEIGHT*0.8;
const ChangeLimitY = SCREEN_HEIGHT*0.8;

import styles from '../../Style/TextBook/TextBookDetail';

//본문
import LectureList from "./LectureList"; // 동영상강의
//문제풀이MP3 tabs
import IntruduceScreen from './IntruduceScreen'; //tabs 01 책소개 
import TextBookMP3Screen from './TextBookMP3Screen'; //tabs 02 문제풀이
import SampleListening from "./SampleListening"; // tabs 02 샘플듣기
import FreeMP3Screen from "./FreeMP3Screen"; // tabs 03 무료MP3
import FreeDataScreen from "./FreeDataScreen"; // tabs 04 무료MP3

class TextBookDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            historyTmp : [],
            focusTab : 1,
            beforeFocusTab : 0,
            headerHeight : 0,
            topMenu  : [
                {index:1,title : '교재소개'},
                {index:2,title : '문제풀이MP3'},
                {index:3,title : '무료MP3'},
                {index:4,title : '무료자료'}
            ],
            isagent : typeof this.props.navigation.state.params.isagent !== 'undefined' ? this.props.navigation.state.params.isagent : null,
            userToken : null,
            bannerurl : this.props.navigation.state.params.bannerurl,
            bookIdx: this.props.navigation.state.params.bookIdx || 0,
            baseBookInfo : {
                "bookIdx": 0,
                "title": "",
                "commonInfo": {
                    "image": "",
                    "isOffClass": true,
                    "offClassUrl": null,
                    "classList": [
                        {
                            "id": 0,
                            "title": null,
                            "teacherName": null,
                            "lectureCnt": 0
                        }
                    ]
                },
                "bookInfo": {
                    "description": null,
                    "oriPrice": 0,
                    "price": 0,
                    "countForDiscount": 0,
                    "discountByCount": 0,
                    "infoMsg": ""
                },
                "purchaseUrl": {
                    "url1": null,
                    "url2": null
                }
            },
            textBookSubmenu : [],
            isInstalledMP3Player : false,
            showBottomBar : false,
            isInstalledMP3Player : false,
            isMultiSeller : false,
            moreSellerHeight : 100,
            showModal : false,      
            modalContent :'movie',
            showTopButton : false,
            showBottom:true,
            activeTab: 0,
            height: 0,
            tabViewStyle :{height:200},
            bottombar:false,
            bottombar2 : false,
            bottombar3 : false,
            bottomReset : false,
            isBottomSheet : false,
            defaultBookCount : 1,
            selectedMP3List : [],
            selectedMP3Price : 0,
            samplemp3list : [],
            bookInfoResult: {},
            _buyMp3Goods : this._buyMp3Goods.bind(this),
            _showModal : this._showModal.bind(this),
            _closeModal : this._closeModal.bind(this),
            //tabsSetupHeight : this.tabsSetupHeight.bind(this)
        }
        
    }

    static navigationOptions = {
        header: null
    }

    async UNSAFE_componentWillMount() {      

        await AsyncStorage.getItem('textBookSubmenu', (error, result) => {
            {   
                // console.log('result2', result)
                if(result) {
                    // console.log('result', result)
                    let resultTmp = JSON.parse(result);
                    this.setState({textBookSubmenu :  resultTmp})
                }
            }
        }); 
        
        if (Platform.OS == 'android') {
            SendIntentAndroid.isAppInstalled(DEFAULT_CONSTANTS.mp3playerplayStoreId).then(
                isInstalled => {
                    //console.log('com.hackers.app.hackersmp3', isInstalled)
                    this.setState({isInstalledMP3Player: isInstalled})
                }
            );   
            this.androidStatusSetup(true);
        }        
        
        if ( this.props.navigation.state.params.bookIdx === null  ) {
            await this.failCallAPi();
        }else{            
            await this.getBookInfo(this.props.navigation.state.params.bookIdx );
        }
        this.setHistory();
        if ( this.props.userToken !== null ) {
            this.setState({userToken : this.props.userToken})
        }

    }  

    componentDidMount() {     
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);          
        //this.props._updateStatusNowScroll(false);          
        this.timeout = setTimeout(
            () => {
                this.saveToStorage();
                // console.log('textBookSubmenu', this.state.textBookSubmenu)
        },
            1000    // 1초
        );
        
    }

    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보                
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        
    }


    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);          
    }

    setHistory = async() => {                
        await AsyncStorage.getItem('history', (error, result) => {
            {   
                if(result) {
                    let resultTmp = JSON.parse(result);
                    if ( resultTmp.length > DEFAULT_CONSTANTS.recentlyHistoryLimit ) {                        
                        let resultTmp2 = resultTmp.sort((a, b) => ( b.date > a.date) ? 1 : -1);
                        let resultTmp3 = resultTmp2.filter((info,index) => {
                            return index < DEFAULT_CONSTANTS.recentlyHistoryLimit
                         } )                        
                        this.setState({ historyTmp: resultTmp3})
                    }else{                        
                        this.setState({ historyTmp: resultTmp})
                    }
                }else{
                    this.setState({historyTmp : []})
                }
            }
        });   
    }

    stroageInsert = async(target,object) => {
        await target.push(object);   
        //console.log('target', target);     
        AsyncStorage.setItem('history', JSON.stringify(target));
    }

    checkInsertOrUpdate = async( newData) => {   
        if ( this.props.navigation.state.params.bookIdx ) {     
            let historyTmp = this.state.historyTmp;            
            let isIndexOf = historyTmp.findIndex(                            
                info => ( info.keyindex === 'textbook' + this.props.navigation.state.params.bookIdx )
            );  
            
            let newHistory = await historyTmp.filter(info => info.keyindex !== 'textbook' +this.props.navigation.state.params.bookIdx );
            if (isIndexOf != -1 )  { //update                                     
                this.stroageInsert(newHistory,newData,);
            }else{ // insert                            
                this.stroageInsert(historyTmp,newData);
            }
        }

    }
    saveToStorage = async() => {

        let CurrentDateTimeStamp = moment().unix();
        let setMyInterestCode = typeof this.props.myInterestCodeOne.code !== 'undefined' ? this.props.myInterestCodeOne.code : 'all';
        let setMyInterestName = typeof this.props.myInterestCodeOne.name !== 'undefined' ? this.props.myInterestCodeOne.name : 'all';
        let newData = {interestCode : setMyInterestCode,interestName : setMyInterestName, keyindex : 'textbook' + this.props.navigation.state.params.bookIdx, type:'textbook',urllink : '', navigate:'TextBookDetail',idx : this.props.navigation.state.params.bookIdx,date : CurrentDateTimeStamp,imageurl : this.state.bannerurl,title:this.state.baseBookInfo.title,description:this.state.baseBookInfo.bookInfo.description}        
        this.checkInsertOrUpdate( newData);

    }

    failCallAPi = () => {        
        const alerttoast = Toast.show('처리중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요');
        setTimeout(() => {
            Toast.hide(alerttoast);       
            if (Platform.OS === "android") {
                this.androidStatusSetup(false)
                StatusBar.setBackgroundColor("#ffffff");
            }
            this.props.navigation.goBack(null)
        }, 2000)
    }

    failCallAPi2 = (msg) => {
        const toastMessage = msg || '처리중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요';
        const alerttoast = Toast.show(toastMessage);
        setTimeout(() => {
            Toast.hide(alerttoast);
        }, 2000)
    }

    getBookInfo = async(bookIdx) => {       

        let aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        let aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey;

        console.log('TextBookDetail.js > getBookInfo()', 'url = ' + aPIsDomain + '/v1/book/' + bookIdx)

        await CommonUtil.callAPI( aPIsDomain + '/v1/book/' + bookIdx,{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': aPIsAuthKey
            }), 
                body:null
            },5000).then(response => {

                //console.log('TextBookDetail.js > getBookInfo()', 'response  = ' + JSON.stringify(response))

                if (response && typeof response === 'object' || Array.isArray(response) === false) {
                    if ( response.code !== '0000' ) {                    
                        //this.failCallAPi()
                        this.setState({bookInfoResult: response});
                        const alerttoast = Toast.show(response.message);
                        setTimeout(() => {
                            Toast.hide(alerttoast);
                        }, 2000)
                    }else{
                        
                        //baseBookInfo.purchaseUrl.url2
                        let moreSellerCnt = 0;
                        let moreSellerHeight = SCREEN_HEIGHT*0.1;
                        //console.log('response.data.purchaseUrl', response.data.purchaseUrl)
                        if ( typeof response.data.purchaseUrl.url1 !== 'undefined' )  {                            
                            if ( response.data.purchaseUrl.url1 !== '') {                                
                                moreSellerCnt++;
                            }
                        }
                        if ( typeof response.data.purchaseUrl.url2 !== 'undefined' )  {
                            if ( response.data.purchaseUrl.url2 !== '') {                                
                                moreSellerCnt++;
                            }
                        }

                        if ( moreSellerCnt > 1 ) {
                            moreSellerHeight = CommonFuncion.isIphoneX() ? SCREEN_HEIGHT*0.4 + 50: SCREEN_HEIGHT*0.4;
                            //console.log('moreSellerHeight 111', moreSellerHeight);
                        }else if ( moreSellerCnt === 1 ) {
                            moreSellerHeight = CommonFuncion.isIphoneX() ? SCREEN_HEIGHT*0.2 + 50: SCREEN_HEIGHT*0.2;
                            //console.log('moreSellerHeight 222', moreSellerHeight);
                        }

                        
                        this.setState({
                            loading : false,
                            baseBookInfo:response.data,
                            bannerurl : response.data.commonInfo.image,
                            bookInfoResult: {},
                            moreSellerHeight : moreSellerHeight
                        })
                    }
                }else{                    
                    this.failCallAPi()
                }
                this.setState({loading:false})    
            })
            .catch(err => {
                console.log('login error => ', err);               
                this.failCallAPi()
            });

            
    }

    handleBackButton = () => {        
        this.props.navigation.goBack(null);        
        if ( this.state.isagent ) {
            this.props.navigation.toggleDrawer()
        }
        if (Platform.OS === "android") {
            this.androidStatusSetup(false)
            StatusBar.setBackgroundColor("#ffffff");
        }
        return true;
    };


    _historyBack(){        
        
        //this.props._updateStatusNowScrollY(0);     
        //this.props.screenProps.resizeTopHeader(0)
        if (Platform.OS === "android") {
            this.androidStatusSetup(false)
            StatusBar.setBackgroundColor("#ffffff");
        }
        this.props.navigation.goBack(null);
        if ( this.state.isagent ) {
            this.props.navigation.toggleDrawer()
        }
    }

    

    _closeModal = () => {
        this.setState({ showModal: false })
    };
    _showModal = async(mode,mp3List) => {        
        await this.setState({ modalContent: mode })        
        if ( mode === 'movie') {
            this.setState({ showModal: true })
        }else if ( mode === null && mp3List.length === 0 ) {
            const alerttoast = Toast.show('재생가능한 샘플목록이 없습니다.');
            setTimeout(() => {
                Toast.hide(alerttoast);
            }, 1500)
        }else{
            this.setState({ 
                samplemp3list : mp3List,
                showModal: true
             })
        }
    }
    
    _summaryPrice = async(senddata) => {        
        let summaryPrice = 0;
        await senddata.map((userData) => {            
            summaryPrice = summaryPrice+parseInt(userData.data.price);
        });        

        this.setState({
            selectedMP3Price : summaryPrice
        })
        //return summaryPrice;
    }
    
    _buyMp3Goods = async(senddata) => {      
       
        let summaryPrice = await this._summaryPrice(senddata);
        this.setState({
            selectedMP3List : senddata,
            //selectedMP3Price : summaryPrice
        })
    }
    

    cartNumber = async(mode) => {   
        if ( mode === 'plus') {
            if(this.state.defaultBookCount < 999) {
                this.setState({defaultBookCount :  ++this.state.defaultBookCount})
            }
        }else{
            if(this.state.defaultBookCount > 1) {
                this.setState({defaultBookCount :  --this.state.defaultBookCount})
            }
        }
    }

    handleOnScroll = async(event) => {     
        //console.log('evenbt' ,event);
        //this._ScrollView.scrollTo({ x: 0,  animated: true });
    }

    onScrollCheckDrag = async(event) => {             
        
        if ( event.contentOffset.y > 200  ) {
            this.props._updateStatusNowScroll(true);     
        }else{
            this.props._updateStatusNowScroll(false);     
        }
        
    }
    
    moreSeller = () => {        
        
        if ( typeof this.state.baseBookInfo.purchaseUrl !== 'undefined') {
            if ( this.state.baseBookInfo.purchaseUrl.url1 && this.state.baseBookInfo.purchaseUrl.url2 ) {
                //console.log(1)
                this.setState({isMultiSeller : true})
            }else if ( this.state.baseBookInfo.purchaseUrl.url1 && this.state.baseBookInfo.purchaseUrl.url2 === '' ) {
                Linking.openURL(this.state.baseBookInfo.purchaseUrl.url1);
            }else if ( this.state.baseBookInfo.purchaseUrl.url1 === '' && this.state.baseBookInfo.purchaseUrl.url2  ) {
                Linking.openURL(this.state.baseBookInfo.purchaseUrl.url2);
            }else{
            }
        }
    }

    LinkingopenURL = (url) => {        
        if ( url) {
            Linking.openURL(url);
        }
    }

    upButtonHandler = async() => {      
        try {  
            this.ScrollView.scrollTo({ x: 0,  animated: true });
        }catch(e){

        }
    };

    goDownLoadMP3Player = () =>{        
        SendIntentAndroid.openApp(DEFAULT_CONSTANTS.androidMP3Player).then(wasOpened => {});
    }

    removeCartList = async(data) => {
        let tmpselectedMP3List = await this.state.selectedMP3List.filter(item => data.productIdx !== item.productIdx);        
        await this._summaryPrice(tmpselectedMP3List);
        this.setState({            
            selectedMP3List : tmpselectedMP3List,
            //summaryPrice : summaryPrice
        });
    }

    tabsSetupHeight = (hell) => {        
        //console.log('hell' , hell)
        this.setState({
            tabViewStyle : { height : hell < 100 ? 100 : hell }
        })
    }

    onLayoutHeader = () => {
        this.refs.TargetElement.measure((x, y, width, height, pageX, pageY) => {      
            //console.log('height222',x,y,width,height,pageX,pageY);  
            this.setState({
                headerHeight : pageY/2
            })
        })
    }
    /*
    onLayoutHeader = (evt ) => {
        console.log('height222',evt.nativeEvent.layout.height);
        if( this.state.loading ) {
            this.setState({tabViewStyle : { height : evt.nativeEvent.layout.height }  }) 
        }
    }
    */

    selectSampleKeyword = async(idx) => {        
        this.setState({focusTab : idx});        
        if ( idx === 2) {
            this.setState({
                isBottomSheet : false,
                bottombar2 : false,
                bottombar3 : false
             });
        }else if ( idx === 1) {
            this.setState({        
                bottombar2 : false,        
                bottombar3 : false
             });
        }
    }

    _changeStatus2 = async(bool) => {        
        this.setState({bottombar2 : bool});
    }

    // 주문번호 생성 
    requestOrderNo = async() => {
        if ( this.state.selectedMP3List.length > 0 ) {
            if ( this.state.userToken === null ) {
                Alert.alert(DEFAULT_CONSTANTS.appName, '로그인이 필요합니다.\n로그인 하시겠습니까?',
                [
                    //{text: '확인 1', onPress: () => this.props.screenProps.navigation.navigate('SignInScreen', {onLoginBack: () => this.onLoginBack()})},
                    {text: '확인', onPress: () => this.props.navigation.navigate('SignInScreen', {goScreen: 'TextBoookDetail',routeIdx : this.state.bookIdx})},
                    //{text: '확인 3', onPress: () => this.props.screenProps.navigation.navigate('SignInScreen')},
                    {text: '취소', onPress: () => console.log('로그인 취소')},
                ]);

            }else{
                
                const memberIdx = this.state.userToken.memberIdx;       
                const formData = new FormData();
                formData.append('orderType', "mp3");
                formData.append('memberIdx', memberIdx);
                formData.append('paymentStatus', 1); //안씀
                formData.append('productList', JSON.stringify(this.state.selectedMP3List));
                
                let aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain
                let aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey
                await CommonUtil.callAPI( aPIsDomain + '/v1/payment/orderNo/' + memberIdx,{
                    method: 'POST', 
                    headers: new Headers({
                        Accept: 'application/json',                
                        'Content-Type': 'multipart/form-data',
                        'apiKey': aPIsAuthKey
                }), 
                    body:formData
                },10000
                ).then(response => {                
                    if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                        if ( response.code !== '0000' ) {
                            const msg = response.message || '';
                            this.failCallAPi2(msg);
                        }else{
                            if ( response.data.orderNo ) {                    
                                this.props.navigation.navigate('LectureSettleInputScreen',{
                                    //lectureIdx : this.state.lectureIdx,
                                    //lectureInfo : this.state.lectureInfo,
                                    productType : 'mp3',
                                    productList　: this.state.selectedMP3List,
                                    checkCartList : [],
                                    optionSumPrice : 0,
                                    isDeliveryPrice : 0,
                                    orderNo :  response.data.orderNo
                                })
                            }else{
                                let message = "일시적 오류가 발생하였습니다.\n 잠시후 이용해 주세요";
                                let timesecond = 2000;
                                CommonFuncion.fn_call_toast(message,timesecond);
                            }
                        }
                    }else{
                        this.failCallAPi2()
                    }
                })
                .catch(err => {
                    console.log('login error => ', err);
                    this.failCallAPi2()
                });              

            }
        }else{
            const alerttoast = Toast.show('구매할 상품을 선택해주세요');
            setTimeout(() => {
                Toast.hide(alerttoast);
            }, 2000)
        }

    };

    androidStatusSetup = async(bool) => {    
        // console.log('androidStatusSetup', bool)
        if (Platform.OS === "android") {            
            StatusBar.setTranslucent(bool);
        }
    }

    pageScroll = (event) => {                    
        
        if ( event.nativeEvent.pageY <= HEADER_BLANK ) {
            this.setState({bottombar2 : true}) 
            this.setState({bottombar3 : true}) 
        }else{
            this.setState({bottombar2 : false}) 
            this.setState({bottombar3 : false}) 
        }
        
        //this.onLayout()
    }

    onAnimationEnd = (val) => {
        console.log('onAnimationEnd', val);
    }

    onMoveTop2 = async(bool) =>{    
        //console.log('onMoveTop2', this.state.bottombar3)
        if ( this.state.bottombar3 === false && bool) {
            this.setState({bottombar3: true});
        }else if ( this.state.bottombar3 === true && bool === false) {
            this.setState({bottombar3: false});
        }
    }
    onMoveTop = async(scrollInfo) =>{      
        //console.log('scrollInfo.dy', scrollInfo.dy);
        //console.log('scrollInfo.moveY', scrollInfo.moveY);
        //console.log('ChangeLimitY', ChangeLimitY);
        //console.log('CONTAINER_HEIGHT', CONTAINER_HEIGHT);
        if ( scrollInfo.dy < 0 && scrollInfo.moveY < ChangeLimitY )  {
            if ( this.state.bottombar3 === false ) {                
                this.setState({bottombar3: true});
            }
            
        }else if ( scrollInfo.dy > 0 && scrollInfo.moveY  >= ChangeLimitY+50  ) {
            if ( this.state.bottombar3 ) {
                //console.log('scrollInfo.moveY', scrollInfo.moveY);
                //console.log('ChangeLimitY', ChangeLimitY);
                this.setState({bottombar3: false});
            }
        }
        
    }

    on2MoveTop2 = async(bool) =>{            
        if ( this.state.bottombar2 === false && bool) {
            this.setState({bottombar2: true});
        }else if ( this.state.bottombar2 === true && bool === false) {
            this.setState({bottombar2: false});
        }
    }
    on2MoveTop = async(scrollInfo) =>{      
        if ( scrollInfo.dy < 0 && scrollInfo.moveY < ChangeLimitY )  {
            if ( this.state.bottombar2 === false ) {                
                this.setState({bottombar2: true});
            }
            
        }else if ( scrollInfo.dy > 0 && scrollInfo.moveY  >= ChangeLimitY+50  ) {
            if ( this.state.bottombar2 ) {
                //console.log('scrollInfo.moveY', scrollInfo.moveY);
                //console.log('ChangeLimitY', ChangeLimitY);
                this.setState({bottombar2: false});
            }
        }
        
    }

    render() {


        const BottomBuyTextBook = () => {        
            return (
                <SafeAreaView style={styles.contentContainer}>
                    { 
                        Platform.OS === 'android' && <StatusBar barStyle={"dark-content"} backgroundColor={'transparent'} animated={true} hidden={false}/>
                    }
   
                    <View style={!this.state.bottombar ? styles.bottomBuyTextWrapper : styles.bottomBuyTextWrapperOn}>
                        <View style={styles.bottomBuyTextIconWraper}>
                            <View style={styles.bottomBuyTextIcon}>
                                <Icon2 name={this.state.bottombar ? "chevron-thin-down" : "chevron-thin-up"} size={15} color={DEFAULT_CONSTANTS.base_color_222} />
                            </View>                        
                        </View>
                        <View style={this.state.bottombar ? styles.bottomBuyTextBodyWrapperOn : styles.bottomBuyTextBodyWrapper}>
                            {
                            !this.state.bottombar ?
                            <View style={styles.bottomBuyTextBody}>
                                <TouchableOpacity                                     
                                    style={[styles.bottomBuyTextBodyLeft,{paddingBottom:CommonFuncion.isIphoneX() ? 10 : 0}]}
                                    onPress={()=> this.moreSeller()}
                                >
                                    <CustomTextB style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)}}>판매처더보기</CustomTextB>   
                                </TouchableOpacity>
                                { 
                                    this.state.baseBookInfo.bookInfo.canBuyInside ?
                                    <TouchableOpacity 
                                        style={[styles.bottomBuyTextBodyRight,{paddingBottom:CommonFuncion.isIphoneX() ? 10 : 0}]}
                                        onPress={()=> this.setState({isMultiSeller:false})}
                                    >
                                        <CustomTextB style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)}}>교재구매</CustomTextB>   
                                    </TouchableOpacity>
                                    :
                                    null
                                }
                            </View>
                            :
                            <View style={{height:10,flexDirection:'row'}}>
                                {/*
                                <View style={{marginTop:5,justifyContent:'center',alignItems:'center'}}>
                                    <Text style={{fontWeight:'bold',color:DEFAULT_CONSTANTS.base_color_222}}>
                                        교재구매1
                                    </Text>
                                </View>
                                */}
                                
                            </View>
                            
                            }
                        </View>
                    
                    </View>    
                    { this.state.isMultiSeller  || this.state.baseBookInfo.bookInfo.canBuyInside === false
                    ?
                    //moreSellerHeight
                    <View style={[styles.bottomBuyTextContentWrapper,{height : this.state.moreSellerHeight}]}>
                        <View style={{justifyContent:'center',alignItems:'center',width:'100%'}}>
                            <TouchableOpacity 
                                style={styles.moreSellerButtonWrapper}
                                onPress={()=> this.LinkingopenURL(this.state.baseBookInfo.purchaseUrl.url2)}
                            >
                                <CustomTextB style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}>판매처1
                                <CustomTextR>에서 구매</CustomTextR></CustomTextB>
                            </TouchableOpacity>
                        </View>
                        { 
                            ( typeof this.state.baseBookInfo.bookInfo.canBuyInside !== 'undefined' && this.state.baseBookInfo.bookInfo.canBuyInside ) &&
                            <View style={{justifyContent:'center',alignItems:'center',width:'100%'}}>
                                <TouchableOpacity 
                                    style={styles.moreSellerButtonWrapper}
                                    onPress={()=> this.LinkingopenURL(this.state.baseBookInfo.purchaseUrl.url1)}
                                >
                                    <CustomTextB style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}>판매처2<CustomTextR>에서 구매</CustomTextR></CustomTextB>
                                </TouchableOpacity>
                            </View>
                        }
                        
                    </View>
                    :
                    <View style={[styles.bottomBuyTextContentWrapper,{height : this.state.moreSellerHeight -20}]}>
                        <Text style={styles.bottomBuyTextButtonText2}>준비중</Text>
                    </View>
                    /*
                    <View style={styles.bottomBuyTextContentWrapper}>
                        <View style={styles.bottomBuyTextContentTitle}>
                            <Text 
                                numberOfLines={2} ellipsizeMode = 'tail' 
                                style={styles.bottomBuyTextContentTitleText}
                            >
                                {this.state.baseBookInfo.title}
                            </Text>
                        </View>
                        <View style={styles.bottomBuyTextContentBodyWrapper}>
                            <View style={styles.bottomBuyTextContentBodyWrapper2}>
                                <TouchableOpacity 
                                    onPress={()=> this.cartNumber('minus')}
                                    style={styles.bottomBuyTextContentBodyLeft}>
                                    <Image source={require('../../../assets/icons/btn_amount_minus.png')} style={{width:25,height:25}} resizeMode='contain' />
                                   
                                </TouchableOpacity>
                                <View style={styles.bottomBuyTextContentBodyCenter}>
                                    <Text style={styles.bottomBuyTextContentBodyenterText}>{this.state.defaultBookCount}</Text>
                                </View>
                                <TouchableOpacity 
                                    onPress={()=> this.cartNumber('plus')}
                                    style={styles.bottomBuyTextContentBodyRight}>
                                   
                                    <Image source={require('../../../assets/icons/btn_amount_plus.png')} style={{width:25,height:25}} resizeMode='contain' />
                                </TouchableOpacity>
    
                            </View>
                            <View style={styles.bottomBuyTextPriceWrapper}>
                                <View style={styles.bottomBuyTextPriceLeft}>
                                    <Text style={styles.bottomBuyTextPriceLeftText}>
                                        {CommonFuncion.currencyFormat(this.state.baseBookInfo.bookInfo.oriPrice*this.state.defaultBookCount)}원
                                    </Text>
                                </View>
                                <View style={styles.bottomBuyTextPriceRight}>
                                    <Text style={styles.bottomBuyTextPriceRightText}>
                                        {CommonFuncion.currencyFormat(this.state.baseBookInfo.bookInfo.price*this.state.defaultBookCount)}원
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.bottomBuyTextButton}>
                            <Text style={styles.bottomBuyTextButtonText}>교재구매</Text>
                        </TouchableOpacity>
                    </View>
                    */
                    }
                </SafeAreaView>
            )
        }

        const BottomBuyTextBookNew = () => {        
            return (
                <SafeAreaView style={styles.contentContainer}>
                                    
                    { this.state.isMultiSeller  || this.state.baseBookInfo.bookInfo.canBuyInside === false
                    ?
                    //moreSellerHeight
                    <View style={[styles.bottomBuyTextContentWrapper,{height : this.state.moreSellerHeight}]}>
                        <View style={{justifyContent:'center',alignItems:'center',width:'100%'}}>
                            <TouchableOpacity 
                                style={styles.moreSellerButtonWrapper}
                                onPress={()=> this.LinkingopenURL(this.state.baseBookInfo.purchaseUrl.url2)}
                            >
                                <CustomTextB style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}>판매처1
                                <CustomTextR>에서 구매</CustomTextR></CustomTextB>
                            </TouchableOpacity>
                        </View>
                        { 
                            ( typeof this.state.baseBookInfo.bookInfo.canBuyInside !== 'undefined' && this.state.baseBookInfo.bookInfo.canBuyInside ) &&
                            <View style={{justifyContent:'center',alignItems:'center',width:'100%'}}>
                                <TouchableOpacity 
                                    style={styles.moreSellerButtonWrapper}
                                    onPress={()=> this.LinkingopenURL(this.state.baseBookInfo.purchaseUrl.url1)}
                                >
                                    <CustomTextB style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}>판매처2<CustomTextR>에서 구매</CustomTextR></CustomTextB>
                                </TouchableOpacity>
                            </View>
                        }
                        
                    </View>
                    :
                    <View style={[styles.bottomBuyTextContentWrapper,{height : this.state.moreSellerHeight -20}]}>
                        <Text style={styles.bottomBuyTextButtonText2}>준비중</Text>
                    </View>
                    
                    }
                </SafeAreaView>
            )
        }

        const BottomBuyMP3 = () => {        
            return (
                <SafeAreaView style={styles.contentContainer}>
                    <View style={!this.state.bottombar ? styles.bottomBuyMP3Wrapper: styles.bottomBuyMP3WrapperOn}>
                        <View style={styles.bottomBuyMP3Left}>
                            <View style={styles.bottomBuyMP3LeftText}>
                                <Icon2 name={this.state.bottombar ? "chevron-thin-down" : "chevron-thin-up"} size={15} color="#222" />
                            </View>                        
                        </View>
                        {
                            !this.state.bottombar ?
                            <View style={styles.bottomBuyMP3Right}>
                                <View style={{height:5,width:'100%',backgroundColor:DEFAULT_COLOR.base_color_fff}}></View>
                                <View style={styles.bottomBuyMP3Body}>
                                    {/*
                                    <Text style={styles.bottomBuyMP3BodyBottomText}>총{this.state.selectedMP3List.length}개상품</Text>
                                    <Text style={[styles.bottomBuyMP3BodyBottomText,{paddingHorizontal:10}]}>|</Text>
                                    <Text style={[styles.bottomBuyMP3BodyBottomText,{fontWeight:'bold'}]}>
                                        {CommonFuncion.currencyFormat(parseInt(this.state.selectedMP3Price))}원
                                    </Text>
                                    */}
                                    <CustomTextR style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:-0.75}}>
                                        총 {this.state.selectedMP3List.length}개 상품
                                    </CustomTextR>
                                    <CustomTextR style={{color:'#ccc',marginHorizontal:10}}>|</CustomTextR>
                                    <CustomTextB style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),letterSpacing:-0.75}}>{CommonFuncion.currencyFormat(parseInt(this.state.selectedMP3Price))}원</CustomTextB>
                                    
                                </View>
                            </View>
                            :
                            <View style={styles.bottomBuyMP3RightOn}></View>
                        }
                    
                    </View>    
                    <View style={{
                        width:'100%',height : (SCREEN_HEIGHT*0.39),justifyContent: 'center',alignItems: 'center',backgroundColor:'#fff'
                    }}>
                        <View style={{flex:3,marginVertical:10}}>
                            <ScrollView nestedScrollEnabled={true} automaticallyAdjustContentInsets={true} indicatorStyle={'black'}>
                                {
                                this.state.selectedMP3List.length === 0
                                ?
                                <View style={{alignItems:'center',justifyContent:'center',paddingTop:20}}>
                                    <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:DEFAULT_COLOR.base_color_666}}>
                                        선택한 상품이 없습니다.
                                    </CustomTextR>
                                </View>
                                :
                                typeof this.state.selectedMP3List !== 'undefined' 
                                ?
                                this.state.selectedMP3List.map((sitem, sindex) => {
                                    return (
                                        <View key={sindex} style={{width:SCREEN_WIDTH,paddingVertical:5}}>
                                            <View style={{paddingVertical:10,marginHorizontal:15,borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1}}>
                                                <View style={{flex:2,paddingBottom:5}}>
                                                    <CustomTextR 
                                                        numberOfLines={2} ellipsizeMode='tail'
                                                        style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:-0.75}}
                                                    >                                                    
                                                        {sitem.data.title}
                                                    </CustomTextR>
                                                </View>
                                                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignItems:'flex-end'}}>
                                                    <View style={{flex:5,justifyContent:'flex-end',alignItems:'flex-end'}}>
                                                        <TextRobotoR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.lecture_base}}>
                                                            {CommonFuncion.currencyFormat(sitem.data.price)}원
                                                        </TextRobotoR>
                                                    </View>
                                                    <TouchableOpacity 
                                                        onPress={()=>this.removeCartList(sitem)}
                                                        style={{flex:1,justifyContent:'center',alignItems:'center'}}
                                                    >
                                                        <Image source={require('../../../assets/icons/btn_del_cart.png')} style={{width:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium)}} />
                                                    </TouchableOpacity>
                                                </View>
                                                
                                            </View>
                                            
                                        </View>
                                    )
                                })
                                :
                                null
                            }
                            </ScrollView>
                        </View>
                        <TouchableOpacity 
                            style={styles.bottomBuyMP3BodyBottom}
                            onPress={()=>this.requestOrderNo()}
                        >
                            <CustomTextR style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:-0.75}}>총 {this.state.selectedMP3List.length}개상품</CustomTextR>
                            <CustomTextR style={{color:'#ccc',marginHorizontal:10}}>|</CustomTextR>
                            <CustomTextB style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),letterSpacing:-0.75}}>{CommonFuncion.currencyFormat(parseInt(this.state.selectedMP3Price))}원 결제</CustomTextB>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            )
        }

        const BottomBuyMP3New = () => {        
            return (
                <SafeAreaView style={{height:SCREEN_HEIGHT*0.39}}>
                    {
                        this.state.bottombar2 === false &&
                        <View style={{width: '100%',height : CommonFuncion.isIphoneX() ? (SCREEN_HEIGHT*0.1) : (SCREEN_HEIGHT*0.13),alignItems: 'center',justifyContent: 'center',textAlign: 'center'}}>
                            <View style={styles.bottomBuyMP3Right}>
                                <View style={{height:5,width:'100%',backgroundColor:DEFAULT_COLOR.base_color_fff}}></View>
                                <View style={Platform.OS === 'ios'? styles.buymp3Textios : styles.buymp3Textandroid}>
                                    <CustomTextR style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:-0.75}}>
                                        총 {this.state.selectedMP3List.length}개 상품
                                    </CustomTextR>
                                    <CustomTextR style={{color:'#ccc',paddingHorizontal:10}}>|</CustomTextR>
                                    <CustomTextB style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:-0.75}}>{CommonFuncion.currencyFormat(parseInt(this.state.selectedMP3Price))}원 결제</CustomTextB>
                                </View>
                            </View>
                        </View>    
                    }
                    <View style={{width:'100%',height : (SCREEN_HEIGHT*0.39),justifyContent: 'center',alignItems: 'center',backgroundColor:'#fff'}}>
                        <View style={{flex:3,marginVertical:10}}>
                            <ScrollView nestedScrollEnabled={true} automaticallyAdjustContentInsets={true} indicatorStyle={'black'}>
                                {
                                this.state.selectedMP3List.length === 0
                                ?
                                <View style={{alignItems:'center',justifyContent:'center',paddingTop:20}}>
                                    <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:DEFAULT_COLOR.base_color_666}}>
                                        선택한 상품이 없습니다.
                                    </CustomTextR>
                                </View>
                                :
                                typeof this.state.selectedMP3List !== 'undefined' 
                                ?
                                this.state.selectedMP3List.map((sitem, sindex) => {
                                    return (
                                        <View key={sindex} style={{width:SCREEN_WIDTH,paddingVertical:5}}>
                                            <View style={{paddingVertical:10,marginHorizontal:15,borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1}}>
                                                <View style={{flex:2,paddingBottom:5}}>
                                                    <CustomTextR 
                                                        numberOfLines={2} ellipsizeMode='tail'
                                                        style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:-0.75}}
                                                    >                                                    
                                                        {sitem.data.title}
                                                    </CustomTextR>
                                                </View>
                                                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignItems:'flex-end'}}>
                                                    <View style={{flex:5,justifyContent:'flex-end',alignItems:'flex-end'}}>
                                                        <TextRobotoR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.lecture_base}}>
                                                            {CommonFuncion.currencyFormat(sitem.data.price)}원
                                                        </TextRobotoR>
                                                    </View>
                                                    <TouchableOpacity 
                                                        onPress={()=>this.removeCartList(sitem)}
                                                        style={{flex:1,justifyContent:'center',alignItems:'center'}}
                                                    >
                                                        <Image source={require('../../../assets/icons/btn_del_cart.png')} style={{width:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium)}} />
                                                    </TouchableOpacity>
                                                </View>
                                                
                                            </View>
                                            
                                        </View>
                                    )
                                })
                                :
                                null
                            }
                            </ScrollView>
                        </View>
                        <TouchableOpacity 
                            style={Platform.OS === 'ios'? CommonFuncion.isIphoneX() ? styles.bottomBuyMP3BodyBottomiosx : styles.bottomBuyMP3BodyBottomios : styles.bottomBuyMP3BodyBottomandroid}
                            onPress={()=>this.requestOrderNo()}
                        >
                            <CustomTextR style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:-0.75}}>총 {this.state.selectedMP3List.length}개상품</CustomTextR>
                            <CustomTextR style={{color:'#ccc',marginHorizontal:10}}>|</CustomTextR>
                            <CustomTextB style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:-0.75}}>{CommonFuncion.currencyFormat(parseInt(this.state.selectedMP3Price))}원 결제</CustomTextB>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            )
        }

        const RenderMaking = () => {            
            return (
                <View style={{width:SCREEN_WIDTH,marginVertical:50,alignItems:'center',justifyContent:'center'}}>
                    <Image 
                        source={require('../../../assets/icons/icon_none_exclamation.png')} 
                        style={{width:PixelRatio.roundToNearestPixel(65),height:PixelRatio.roundToNearestPixel(65)}}
                    />
                    <CustomTextR style={{color: DEFAULT_COLOR.base_color_888, fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14), letterSpacing: -0.75, marginTop: 12}}>현재 제공하지 않는 서비스입니다</CustomTextR>
                </View>
            )
        }

        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        }else {
            return(
                <View style={ styles.container }>
                    { 
                    //Platform.OS === 'android' && <StatusBar barStyle={"dark-content"} animated={true} hidden={true}/>
                    }
                    { 
                        Platform.OS === 'android' && <StatusBar barStyle={"dark-content"} backgroundColor={'transparent'} animated={true} hidden={false}/>
                    }
                    <NavigationEvents
                        onWillFocus={payload => {     
                            // console.log('onWillFocus')                       
                            if (Platform.OS === "android") {
                                StatusBar.setBackgroundColor("transparent");
                                this.androidStatusSetup(true)
                            }
                            
                        }}
                        onWillBlur={payload => {          
                            // console.log('onWillBlur')      
                            if (Platform.OS === "android") {
                                this.androidStatusSetup(false)
                                StatusBar.setBackgroundColor("#ffffff");
                            }
                        }}
                    />     
                    <ParallaxScrollView
                        windowHeight={SCREEN_HEIGHT * 0.35}
                        backgroundSource={this.state.bannerurl}
                        //1navBarHeight={Platform.OS === 'android' ? 65 :  isIphoneX() ? 85 : 75}
                        navBarHeight={ Platform.OS === 'android' ? 50 :  CommonFuncion.isIphoneX() ? 65 : 55}
                        navBarColor={'#ff0000'}
                        navBarTitle=''
                        navBarView={false}
                        lectureName={this.state.baseBookInfo.title}
                        textbookTitle=''
                        markImage={this.state.bannerurl}
                        leftIcon={{name: 'left', color: '#fff', size: 20, type: 'font-awesome'}}
                        centerTitle={'교재상세'}
                        leftIconOnPress={()=>this._historyBack()}
                        rightIcon={null}   
                        screenProps={this.props}                 
                        >
                        <View style={styles.contentDataWrapper}>
                            <View>
                                
                                {
                                    (this.state.baseBookInfo.commonInfo.offClassUrl && this.state.baseBookInfo.commonInfo.classList.length > 0)  
                                    ?
                                    <View style={styles.contentDataHeader}>
                                        <View style={styles.contentDataHeaderLeftRight}>
                                            <TouchableOpacity 
                                                style={styles.contentDataHeaderLeftRightButton}
                                                onPress={() => Linking.openURL(this.state.baseBookInfo.commonInfo.offClassUrl)}
                                            >
                                                <Icon name="enviroment" size={15} color={DEFAULT_COLOR.base_color_222} /> 
                                                <CustomTextM style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}>
                                                    {" "}현장 강의
                                                </CustomTextM>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.contentDataHeaderCenter}>
                                            <CustomTextM style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}>|</CustomTextM>
                                        </View>
                                        <View style={styles.contentDataHeaderLeftRight}>
                                            <TouchableOpacity 
                                                onPress={() => this._showModal('movie',null)}
                                                style={styles.contentDataHeaderLeftRightButton}>
                                                <Icon name="play" size={15} color={DEFAULT_COLOR.base_color_222} /> 
                                                <CustomTextM style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}>
                                                    {" "}동영상강의
                                                </CustomTextM>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    :
                                    (this.state.baseBookInfo.commonInfo.offClassUrl && this.state.baseBookInfo.commonInfo.classList.length === 0)
                                    ?
                                    <View style={styles.contentDataHeader}>
                                        <View style={styles.contentDataHeaderLeftRight}>
                                            <TouchableOpacity 
                                                style={styles.contentDataHeaderLeftRightButton}
                                                onPress={() => Linking.openURL(this.state.baseBookInfo.commonInfo.offClassUrl) }
                                            >
                                                <Icon name="enviroment" size={15} color={DEFAULT_COLOR.base_color_222} /> 
                                                <Text style={{color:DEFAULT_COLOR.base_color_222}} >
                                                    {" "}현장 강의
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    :
                                    <View style={styles.contentDataHeader}>
                                        <View style={styles.contentDataHeaderLeftRight}>
                                            <TouchableOpacity 
                                                onPress={() => this._showModal('movie',null)}
                                                style={styles.contentDataHeaderLeftRightButton}>
                                                <Icon name="play" size={15} color={DEFAULT_COLOR.base_color_222} /> 
                                                <Text style={{color:DEFAULT_COLOR.base_color_222}} >
                                                    {" "}동영상강의
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                }
                            </View>                           
                            <View style={styles.contentDataBody2} onLayout={(e)=>this.onLayoutHeader(e)} ref="TargetElement" >
                                <View style={{width:SCREEN_WIDTH,zIndex:5,flexDirection:'row',justifyContent:'space-between'}}>
                                {
                                        this.state.topMenu.map((xitem,xindex)=> {
                                        return (
                                            <View key={xindex} style={{alignItems:'center',justifyContent:'center',flex : xitem.index === 2 ? 1.4 : 1}}>
                                                <TouchableOpacity
                                                    onPress={()=>this.selectSampleKeyword(xitem.index)}
                                                    style={this.state.focusTab === xitem.index ? styles.sampleWrapperOn: styles.sampleWrapper}>
                                                        {
                                                            this.state.focusTab === xitem.index ?
                                                                <CustomTextB style={styles.sampleTextOn}>{xitem.title}</CustomTextB>
                                                                :
                                                                <CustomTextR style={styles.sampleText}>{xitem.title}</CustomTextR>
                                                        }
                                                    
                                                </TouchableOpacity>
                                            </View>
                                        )})
                                    }
                                   </View>
                                    <View style={{position:'absolute',left:0,bottom:0,backgroundColor:DEFAULT_COLOR.input_border_color,height:2,width:'100%'}}
                                ></View>
                                {/*
                                <ScrollableTabView      
                                    //style={{ height :20,padding:0,margin:0 }}    
                                    contentProps={{style:{...this.state.tabViewStyle}}}
                                    refreshControlStyle={{backgroundColor: 'red'}}
                                    initialPage={0}
                                    tabStyle={styles.tabStyle}
                                    tabBarTextStyle={styles.tabBarTextStyle}
                                    tabBarActiveTextColor={DEFAULT_COLOR.lecture_base}
                                    tabBarInactiveTextColor={DEFAULT_COLOR.base_color_666}
                                    tabBarUnderlineStyle={{height: 2,backgroundColor: DEFAULT_COLOR.lecture_base}}
                                    renderTabBar={() => <ScrollableTabBar />}
                                    onChangeTab={(event)=>{this.setStateForTabChange(event)}}
                                    tabBarPosition="top"
                                    page={this.state.focusTab}
                                    //locked={true}
                                    //pullToRefresh={this._pullToRefresh()}
                                >            

                                    <SafeAreaView style={{flex:1}} tabLabel='교재소개'>                    
                                        <IntruduceScreen  screenProps={this.props} screenState={this.state}  />
                                    </SafeAreaView>
                                    <SafeAreaView style={{flex: 1}} tabLabel='문제풀이 MP3'>
                                        <TextBookMP3Screen screenState={this.state} screenProps={this.props}  />
                                    </SafeAreaView>
                                    <SafeAreaView style={{flex: 1}} tabLabel='무료 MP3'>
                                        <FreeMP3Screen  screenState={this.state} screenProps={this.props}  />
                                    </SafeAreaView>
                                    <SafeAreaView style={{flex: 1}} tabLabel='무료자료'>
                                        <FreeDataScreen screenState={this.state} screenProps={this.props}  />
                                    </SafeAreaView> 
                                </ScrollableTabView>
                                */}
                            </View>
                            <View style={{minHeight:SCREEN_HEIGHT*0.45,justifyContent:'center',alignContent:'center',marginBottom:50}}>
                                <ScrollView nestedScrollEnabled={true}>
                                    {this.state.focusTab === 1 &&
                                        <IntruduceScreen  screenProps={this.props} screenState={this.state}  />
                                    }
                                    {this.state.focusTab === 2 ?
                                        //this.props.myInterestCodeOne.info.serviceID == '3045' ?
                                        this.state.textBookSubmenu.indexOf('문제풀이MP3') === -1 ?
                                        <RenderMaking />
                                        :
                                        <TextBookMP3Screen screenState={this.state} screenProps={this.props}  />                            
                                        :
                                        null
                                    }
                                    {this.state.focusTab === 3 ?
                                        this.state.textBookSubmenu.indexOf('무료MP3') === -1 ?
                                        <RenderMaking />
                                        :
                                        <FreeMP3Screen  screenState={this.state} screenProps={this.props}  />
                                        :
                                        null
                                    }
                                    {this.state.focusTab === 4 ?
                                        this.state.textBookSubmenu.indexOf('무료자료') === -1 ?
                                        <RenderMaking />
                                        :
                                        <FreeDataScreen screenState={this.state} screenProps={this.props}  />
                                        :
                                        null
                                    }
                                    
                                </ScrollView>
                            </View>
                        </View>
                    </ParallaxScrollView>
                    
                    {this.state.showBottom &&                        
                        this.state.focusTab === 2 ?
                        <SlidingPanel2
                            headerLayoutHeight = {this.state.bottombar2 ? 15 : 88}
                            headerLayout = { () =>
                                <View style={this.state.bottombar2 ? styles.bottomBuyTextWrapperOn3 : styles.bottomBuyTextWrapper3}>
                                    <View style={styles.bottomBuyTextIconWraper}>
                                        <View style={styles.bottomBuyTextIcon}>
                                            <Icon2 name={this.state.bottombar2 ? "chevron-thin-down" : "chevron-thin-up"} size={15} color={DEFAULT_CONSTANTS.base_color_222} />
                                        </View>                        
                                    </View>
                                    <View style={this.state.bottombar2 ? styles.bottomBuyTextBodyWrapperOn : styles.bottomBuyTextBodyWrapper}>
                                    {
                                        !this.state.bottombar2 ?
                                        <View style={styles.bottomBuyTextBody}>
                                            <View style={CommonFuncion.isIphoneX() ? styles.buymotTextWrapCommonX: styles.buymotTextWrapCommon}>
                                                <CustomTextR style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:-0.75}}>
                                                    총 {this.state.selectedMP3List.length}개 상품
                                                </CustomTextR>
                                                <CustomTextR style={{color:'#ccc',paddingHorizontal:10}}>|</CustomTextR>
                                                <CustomTextB style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:-0.75}}>{CommonFuncion.currencyFormat(parseInt(this.state.selectedMP3Price))}원 결제</CustomTextB>
                                            </View>
                                        </View>
                                        :
                                        null
                                    }
                                    </View>
                                </View>
                            } 
                            slidingPanelLayoutHeight={SCREEN_HEIGHT*0.39}
                            AnimationSpeed={500}
                            allowAnimation={true}           
                            slidingPanelLayout = { () =>
                                <View style={styles.slidingPanelLayoutStyle04}>
                                    { this.state.bottombar2 ?
                                     <BottomBuyMP3New />
                                     :
                                     null
                                     }
                                </View>
                            }
                            //panelPosition={'bottom'}
                            onDragEnd={(event)=>this.pageScroll(event)}
                            onAnimationStop={()=>this.onAnimationEnd}
                            nowTopPosition={this.state.bottombar2}
                            setChangePosition={ChangePositionY}
                            onMoveTop={this.on2MoveTop}
                            onMoveTop2={this.on2MoveTop2}
                        />                                                
                        
                        : 
                        this.state.focusTab === 1 ?
                        <SlidingPanel
                            headerLayoutHeight = {this.state.bottombar3 ? 15 : 88}
                            headerLayout = { () =>
                                <View style={this.state.bottombar3 ? styles.bottomBuyTextWrapperOn3 : styles.bottomBuyTextWrapper3}>
                                    <View style={styles.bottomBuyTextIconWraper}>
                                        <View style={styles.bottomBuyTextIcon}>
                                            <Icon2 name={this.state.bottombar3 ? "chevron-thin-down" : "chevron-thin-up"} size={15} color={DEFAULT_CONSTANTS.base_color_222} />
                                        </View>                        
                                    </View>
                                    <View style={this.state.bottombar3 ? styles.bottomBuyTextBodyWrapperOn : styles.bottomBuyTextBodyWrapper}>
                                    {
                                    !this.state.bottombar3 ?
                                    <View style={styles.bottomBuyTextBody}>
                                        <TouchableOpacity                                     
                                            //style={[styles.bottomBuyTextBodyLeft,{paddingBottom:CommonFuncion.isIphoneX() ? 10 : 0}]}
                                            style={CommonFuncion.isIphoneX() ? styles.buymotTextWrapCommonX: styles.buymotTextWrapCommon}
                                            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                                            onPress={()=> this.moreSeller()}
                                        >
                                            <CustomTextB style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)}}>판매처더보기</CustomTextB>   
                                        </TouchableOpacity>
                                        { 
                                            this.state.baseBookInfo.bookInfo.canBuyInside ?
                                            <TouchableOpacity 
                                                style={CommonFuncion.isIphoneX() ? styles.buymotTextWrapCommonX2: styles.buymotTextWrapCommon2}
                                                onPress={()=> this.setState({isMultiSeller:false})}
                                            >
                                                <CustomTextB style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)}}>교재구매</CustomTextB>   
                                            </TouchableOpacity>
                                            :
                                            null
                                        }
                                    </View>
                                    :
                                    null
                                    }
                                    </View>
                                </View>
                            } 
                            slidingPanelLayoutHeight={this.state.moreSellerHeight}
                            AnimationSpeed={500}
                            allowAnimation={true}           
                            slidingPanelLayout = { () =>
                                <View style={styles.slidingPanelLayoutStyle}>
                                    { this.state.bottombar3 ?
                                     <BottomBuyTextBookNew />
                                     :
                                     null
                                     }
                                </View>
                            }
                            //panelPosition={'bottom'}
                            onDragEnd={(event)=>this.pageScroll(event)}
                            onAnimationStop={()=>this.onAnimationEnd}
                            nowTopPosition={this.state.bottombar3}
                            setChangePosition={ChangePositionY}
                            onMoveTop={this.onMoveTop}
                            onMoveTop2={this.onMoveTop2}
                        />
                        :
                        null
                    }   

                    <Modal
                        //transparent={true}
                        //visible={this.state.showModal}
                        onRequestClose={() => {
                            this.setState({showModal:false})
                        }}
                        onBackdropPress={() => {
                            this.setState({showModal:false})
                        }}
                        //animationType='slide'
                        style={{justifyContent: 'flex-end',margin: 0}}
                        useNativeDriver={true}
                        animationInTiming={300}
                        animationOutTiming={300}
                        hideModalContentWhileAnimating  
                        isVisible={this.state.showModal}
                    >
                        
                        <View style={[styles.modalContainer,{ height: SCREEN_HEIGHT * 0.7 }]}>
                            {this.state.modalContent === 'movie' ? 
                                <LectureList screenState={this.state} />
                            :
                                <SampleListening screenState={this.state} />
                            }
                            
                        </View>
                        
                    </Modal>

                
                </View>
            );
        }
    }
}



function mapStateToProps(state) {
    return {
        selectBook: state.GlabalStatus.selectBook,    
        topFavoriteMenu: state.GlabalStatus.topFavoriteMenu,   
        showBottomBar: state.GlabalStatus.showBottomBar,
        textBookFocusHeight : state.GlabalStatus.textBookFocusHeight,
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
        userToken : state.GlabalStatus.userToken, 
    };
}


function mapDispatchToProps(dispatch) {
    return {
        _updateStatusNowScroll:(boolen) => {
            dispatch(ActionCreator.updateStatusNowScroll(boolen));
        },
        _updateStatusNowScrollY:(number) => {
            dispatch(ActionCreator.updateStatusNowScrollY(number));
        },
        _updateStatusShowBottomBar:(boolen) => {
            dispatch(ActionCreator.updateStatusShowBottomBar(boolen));
        },
        _updateTextBookFocusHeight:(number) => {
            dispatch(ActionCreator.updateTextBookFocusHeight(number));
        }
    };
}

TextBookDetail.propTypes = {
    selectBook: PropTypes.object,
    topFavoriteMenu: PropTypes.bool,   
    showBottomBar: PropTypes.bool,   
    textBookFocusHeight: PropTypes.number
};


export default connect(mapStateToProps, mapDispatchToProps)(TextBookDetail);