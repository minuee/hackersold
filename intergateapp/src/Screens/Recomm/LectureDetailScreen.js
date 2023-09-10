import React from 'react';
import {Text, View, StatusBar,TouchableOpacity ,Dimensions,ScrollView,SafeAreaView,Image,ActivityIndicator,Alert,Platform,BackHandler,Animated, PixelRatio} from 'react-native';
import {connect} from 'react-redux';
import {CheckBox,Overlay,Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import { NavigationEvents } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-tiny-toast';
import 'moment/locale/ko'
import  moment  from  "moment";
import Modal from 'react-native-modal';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import LectureReview from './LectureReview';
import LectureQna from './LectureQna';
import  TextTicker from '../../Utils/TextTicker';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import styles from '../../Style/Recomm/LectureDetailScreen';
import {CustomTextR, CustomTextM, CustomTextB, TextRobotoR, TextRobotoM, TextRobotoB} from '../../Style/CustomText';
const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");


const StatusBarHeight = CommonFuncion.isIphoneX() ? 90 : Platform.OS === 'ios' ? 60 : 40 ;

//비디오 설정
const VIDEO_WIDTH = SCREEN_WIDTH;
const VIDEO_HEIGHT = SCREEN_WIDTH * ( 9 / 16 );

//컨텐츠 영역 상수
const CAROUSEL_SLIDER_WIDTH = SCREEN_WIDTH;
const CAROUSEL_SLIDER_HEIGHT = SCREEN_WIDTH;
const CAROUSEL_ITEM_WIDTH = SCREEN_WIDTH - 30;
const CAROUSEL_ITEM_HEIGHT = SCREEN_WIDTH - 100;
const CAROUSEL_PAGE_LEFT = CAROUSEL_ITEM_WIDTH / 2;


import SampleVideoScreen from './SampleVideoScreen'
import COMMON_STATES from '../../Constants/Common';

class LectureDetailScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading:true,
            refreshLoading : false,
            historyTmp : [],
            userToken : null,
            checkOptionList : [],
            checkOptionListTemp : [],
            selectItem:1,
            isselectTab : 1,
            showTopButton : false,
            isVisibleOverlay : false,
            showRepeatInfo : false,
            selectedGoods : null,            
            lectureIdx : this.props.navigation.state.params.lectureIdx,
            lectureInfo : {
                idx : this.props.navigation.state.params.lectureIdx,
                title : "",
                price : 0,
                discount : 0,                
            },
            
            productList : [],
            productList2 : [],        
            optionList : [],
            optionSumPrice : 0,
            isDeliveryPrice : false,
            //컨텐츠 영역
            lectureItems: [
                { index: 1, cat_idx: 1, thumbUrl: 'https://mchamp.hackers.com/files/lecture/2019/11/3c3bcde9f02ec0d291fcbac735561aac.jpg', },
                { index: 2, cat_idx: 1, thumbUrl: 'https://mchamp.hackers.com/files/lecture/2019/11/3dfa81cec2f9b3d168e4a3bf436d41d1.jpg', },
                { index: 3, cat_idx: 1, thumbUrl: 'https://mchamp.hackers.com/files/lecture/2019/11/111e8f4857ab868b1f4ee2e2a4dbcd78.jpg', },
                { index: 4, cat_idx: 1, thumbUrl: 'https://mchamp.hackers.com/files/lecture/2019/12/3d9723f8a69a41a05592b941899b461e.jpg', },
            ],
            // sample video
            videoLocation : 100,
            containerWidth: '100%',
            containerHeight: null,
            isFullscreen: false,
            currentItemIndex: 0,
            globalCurrentTime : 0,
            naviTitle: '강의상세',
            setSeekerPosition : this.setSeekerPosition.bind(this),
            //여기서부터 회전목마값
            mainImgHeight : parseInt(SCREEN_WIDTH*0.5),
            mainImgWidth : parseInt(SCREEN_WIDTH*0.5/2),
            activeContentSlide: typeof this.props.navigation.state.params.lectureSeq !== 'undefined' ? this.props.navigation.state.params.lectureSeq : 0,
            contentItems: this.props.navigation.state.params.lecturList,
            fromHistory : this.props.navigation.state.params.fromHistory 
        }
        this._nodes = new Map();
    }

    

    static navigationOptions = ({navigation}) => {
        
        const params =  navigation.state.params || {};        
        // if ( params.newHeight ) {
        //     return {
        //         header : null
        //     }
        // }else {
            return {
            
                headerTitle: params.newtitle,
                headerRight: params.newheaderRight,
                headerLeft : params.newheaderLeft,
                gesturesEnabled: false,
                headerStyle: {
                    backgroundColor: DEFAULT_COLOR.lecture_base,
                    height:40
                },
                headerTintColor: '#fff'
            }
        // }
    };

    _setNavigationParams(bool){
        console.log('_setNavigationParams ', bool)
        // let newtitle = <View style={{flexGrow:1,textAlign:'center',alignItems:'center'}}><Text style={{color:'#fff',fontSize:DEFAULT_TEXT.head_medium}}>강의상세</Text></View>;
        // let newheaderLeft = <TouchableOpacity onPress={()=> this.backPress()} style={{flexGrow:1,textAlign:'center',alignItems:'center',paddingLeft:10}}><Icon name="left" size={25} color="#fff" /></TouchableOpacity>
        let newtitle = <View style={{flexGrow:1,textAlign:'center',alignItems:'center'}}><CustomTextR style={{color:'#fff',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),letterSpacing:PixelRatio.roundToNearestPixel(-0.96)}}>강의상세</CustomTextR></View>;
        let newheaderLeft = <TouchableOpacity onPress={()=> this.backPress()} style={{flexGrow:1,textAlign:'center',alignItems:'center',paddingLeft:20}}><Image source={require('../../../assets/icons/btn_back_page.png')} style={{width: 17, height: 17}} /></TouchableOpacity>
        let newheaderRight = <View style={{flexGrow:1,textAlign:'center',alignItems:'center'}}></View>
        this.props.navigation.setParams({
            newtitle,
            newheaderLeft,
            newheaderRight
        });
        
    }

    backPress = async() => {
        
        if ( !this.state.isFullscreen) {
            if ( this.props.isDrawerOpen ) {
                this.props.navigation.goBack(null);
                this.props.navigation.toggleDrawer()

            }else{
                this.props.navigation.goBack(null)
            }
            
        }
    }

    async UNSAFE_componentWillMount() {    

        if ( typeof this.state.lectureInfo.sampleLectureUrl === 'undefined') {            
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);                
        }
        
        
        if ( Platform.OS === 'ios' ) {
            //this._setNavigationParams(false);
        }
        // if ( typeof this.props.navigation.state.params.lectureIdx !== 'undefined' ) {
        if ( !CommonUtil.isEmpty(this.props.navigation.state.params.lectureIdx) ) {
            await this.refreshTextBookInfo(this.props.navigation.state.params.lectureIdx);
            await this.initTabIndex();
        }else{
            const alerttoast = Toast.show('데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요');
            setTimeout(() => {
                Toast.hide(alerttoast);       
                this.props.navigation.goBack(null)
            }, 2000)
        }
        this.setHistory();
        this.setState({globalCurrentTime:0})        
        if ( this.props.userToken !== null && typeof this.props.userToken !== 'undefined' ) {
            this.setState({userToken : this.props.userToken})
        }

  
    } 

    componentDidMount() {     
        //console.log('CurrentDateTimeStamp',CurrentDateTimeStamp)
        this.timeout = setTimeout(
            () => {
                this.saveToStorage();
        },
            1000    // 1초
        );
    }

    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보        
    }

    UNSAFE_componentWillReceiveProps(nextProps) {     
       
    }

    
    componentWillUnmount(){    
        if ( typeof this.state.lectureInfo.sampleLectureUrl === 'undefined') {              
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);    
        }
    }

    handleBackButton = () => {
        this.props.navigation.goBack(null);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
        return true;
    }
    
    handleBackButtonNotUse = () => {        
        if ( this.props.isDrawerOpen ) {
            this.props.navigation.goBack(null);
            this.props.navigation.toggleDrawer()

        }else{
            this.props.navigation.goBack(null)
        }
        
        return true;
    };

    refreshTextBookInfo = async(classIdx) => {
        if ( classIdx ) {
        
            let aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
            let aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey;
            
            await CommonUtil.callAPI( aPIsDomain + '/v1/product/' + classIdx,{
                method: 'GET', 
                headers: new Headers({
                    Accept: 'application/json',                
                    'Content-Type': 'application/json; charset=UTF-8',
                    'apiKey': aPIsAuthKey
                }), 
                    body:null
                },10000
                ).then(response => {     
                    
                    if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                        if ( response.code !== '0000' ) {
                            this.setState({loading:false});
                            //this.failCallAPigoBack()
                            const alerttoast = Toast.show(response.message);
                            setTimeout(() => {
                                Toast.hide(alerttoast);
                            }, 2000)
                        }else{                            
                            this.setState({
                                loading : false,
                                refreshLoading : false,
                                lectureInfo : response.data.productInfo,
                                productList : response.data.productList,
                                //optionList:response.data.optionList
                            })
                        }
                    }else{
                        this.failCallAPigoBack()
                    }
                    this.setState({loading:false});
                })
                .catch(err => {
                    //console.log('login error 1111111=> ', err);
                    this.failCallAPigoBack()
            });
        }else{
            this.setState({loading:false});
            this.failCallAPigoBack();
        }
    }

    failCallAPigoBack = () => {
        const alerttoast = Toast.show('처리중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요');
        setTimeout(() => {
            Toast.hide(alerttoast);                   
            this.props.navigation.goBack(null)
        }, 2000)
    }

    failCallAPi = msg => {
        let message = msg || "데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);
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
        AsyncStorage.setItem('history', JSON.stringify(target));
    }

    checkInsertOrUpdate = async( newData) => {
        if ( this.props.navigation.state.params.lectureIdx ) {          
            let historyTmp = this.state.historyTmp;            
            let isIndexOf = historyTmp.findIndex(                            
                info => ( info.keyindex === 'lecture' + this.props.navigation.state.params.lectureIdx )
            );  
            let newHistory = await historyTmp.filter(info => info.keyindex !== 'lecture' + this.props.navigation.state.params.lectureIdx);
            if (isIndexOf != -1 )  { //update                  
                this.stroageInsert(newHistory,newData,);
            }else{ // insert                
                this.stroageInsert(historyTmp,newData);
            }
        }

    }
    saveToStorage = async() => {
        let CurrentDateTimeStamp = moment().unix();
        let lectureImage = this.state.lectureInfo.image ? this.state.lectureInfo.image : 'http://reactserver.hackers.com/assets/react/icons/sample_lecture.png';
        let setMyInterestCode = typeof this.props.myInterestCodeOne.code !== 'undefined' ? this.props.myInterestCodeOne.code : 'all';
        let setMyInterestName = typeof this.props.myInterestCodeOne.name !== 'undefined' ? this.props.myInterestCodeOne.name : 'all';
        let newData = {interestCode : setMyInterestCode,interestName : setMyInterestName, keyindex : 'lecture' +  this.props.navigation.state.params.lectureIdx ,type:'lecture',urllink : '', navigate:'LectureDetailScreen',idx : this.props.navigation.state.params.lectureIdx,date : CurrentDateTimeStamp,imageurl : lectureImage,title:this.state.lectureInfo.title, contents : this.state.lectureInfo}       
        this.checkInsertOrUpdate( newData);   
    }

    changeTabs = async(newvalue) => {
        this.setState({
             isselectTab:newvalue
        });
    }

    initTabIndex = async () => {
        const isHiddenTab1 = this.state.lectureInfo && CommonUtil.isEmpty(this.state.lectureInfo.classInfo);
        const isHiddenTab2 = this.state.lectureInfo && (!this.state.lectureInfo.classIndex || this.state.lectureInfo.classIndex.length === 0);
        if (isHiddenTab1 && !isHiddenTab2) {
            // await this.setState({isselectTab: 2});
            await this.changeTabs(2);
        } else if (!isHiddenTab1 && isHiddenTab2) {
            await this.changeTabs(1);
        } else if (isHiddenTab1 && isHiddenTab2) {
            await this.changeTabs(3);
        }
    };
    
    upButtonHandler = () => {        
        this.ScrollView.scrollTo({ x: 0,  animated: true });
    };

    handleOnScroll (event) {
        if (event.nativeEvent.contentOffset.y >= 100) {
            this.state.lectureInfo.title !== this.state.naviTitle && this.setState({naviTitle: this.state.lectureInfo.title});
            this.setState({
                showTopButton : true
            })
        } else {
            this.setState({
                naviTitle: '강의상세',
                showTopButton : false
            })
        }
    }

    onLayoutHeader = (evt ) => {
        this.setState({
            mainImgHeight : evt.nativeEvent.layout.height,
            mainImgWidth : evt.nativeEvent.layout.width
        });
    }

    animatedHeightCoupon = new Animated.Value(SCREEN_HEIGHT * 0.8);   
    toggleOverlay = async(index) => {      
        let isVisibleOverlay = this.state.isVisibleOverlay;
        this.setState({ 
            isVisibleOverlay: !isVisibleOverlay
         })
    }    

    
    closeModalCoupon = () => {        
        this.setState({ 
            isVisibleOverlay: false ,
            checkOptionListTemp : this.state.checkOptionList
        })
    };

    selectProduct = ( idx,data ) => {        
        this.setState({
            selectedGoods:idx,
            optionList : data.optionList
        })
        if ( data.optionList.length === 0 ) {
            this.setState({              
                checkOptionList : []
            })
        }
    }
    setOnceChecked = (data,mode) => {

        let selectedFilterCodeList = this.state.checkOptionList;                  
        if ( mode === 'remove' ) { //제거            
            selectedFilterCodeList = selectedFilterCodeList.filter((info) => info.index !== data.optionIdx);        
        }else{ //추가
            selectedFilterCodeList.push({index:data.optionIdx,info:data,optionIdx:data.optionIdx,price:data.price,optionType:data.optionType});
        }
        return selectedFilterCodeList;
    }
    
    _checkOptionList = async() =>{
        //let returnArray = await this.setOnceChecked(this.state.);   
        let returnArray = this.state.checkOptionListTemp;
        let tmpoptionSumPrice = 0;
        await returnArray.map((items) => {
            tmpoptionSumPrice += parseInt(items.info.price);
            if ( items.info.type === 'book') {
                this.setState({isDeliveryPrice : true })
            }
        })        
        
        this.setState({
            checkOptionList: Array.from(new Set(returnArray)),
            optionSumPrice : parseInt(tmpoptionSumPrice),
            isVisibleOverlay:false
        })

        //console.log('optionSumPrice', this.state.optionSumPrice)
    }


    setOnceCheckedTemp = (data,mode) => {

        let selectedFilterCodeList = this.state.checkOptionListTemp;                  
        if ( mode === 'remove' ) { //제거            
            selectedFilterCodeList = selectedFilterCodeList.filter((info) => info.index !== data.optionIdx);        
        }else{ //추가
            selectedFilterCodeList.push({index:data.optionIdx,info:data,optionIdx:data.optionIdx,price:data.price,optionType:data.optionType});
        }
        return selectedFilterCodeList;
    }
    
    _checkOptionListTemp = async(index,data,mode) =>{
        let returnArray = await this.setOnceCheckedTemp(data,mode);   
        
        /*
        let tmpoptionSumPrice = 0;
        returnArray.map((items) => {
            tmpoptionSumPrice += parseInt(items.info.price);
            if ( items.info.type === 'book') {
                this.setState({isDeliveryPrice : true })
            }
        })
        */        
        
        this.setState({
            checkOptionListTemp: Array.from(new Set(returnArray)),
            //optionSumPrice : parseInt(tmpoptionSumPrice)
        })

        //console.log('optionSumPrice', this.state.optionSumPrice)
    }


    setOnceRemove= (data) => {

        let selectedFilterCodeList = this.state.checkOptionList;                  
        selectedFilterCodeList = selectedFilterCodeList.filter((info) => info.index !== data);
        this.setState({isDeliveryPrice : false })
        return selectedFilterCodeList;
    }

    removeOptionList = async(idx) => {
        let returnArray = await this.setOnceRemove(idx);
        let tmpoptionSumPrice = 0;
        returnArray.map((items) => {
            tmpoptionSumPrice = parseInt(tmpoptionSumPrice+items.info.price);      
            if ( items.info.type === 'book') {
                this.setState({isDeliveryPrice : true })
            }   
        })
        this.setState({
            checkOptionList: Array.from(new Set(returnArray)),
            checkOptionListTemp: Array.from(new Set(returnArray)),
            optionSumPrice : parseInt(tmpoptionSumPrice)
        })
    }

    onLoginBack = async () => {
        await this.setState({userToken: this.props.userToken});
        this.requestOrderNo();
    };

    onLoginBackForCart = async () => {
        await this.setState({userToken: this.props.userToken});
        this.cartInsert();
    };

     // 주문번호 생성 
     requestOrderNo = async() => {       
         
        if ( this.state.userToken === null ) {
            Alert.alert(DEFAULT_CONSTANTS.appName, '로그인이 필요합니다.',
            [
                {text: '로그인', onPress: () => this.props.navigation.navigate('SignInScreen', {onLoginBack: () => this.onLoginBack()})},
                // {text: '확인', onPress: () => this.props.navigation.navigate('SignInScreen', {goScreen: 'TextBookDetail', routeIdx: this.state.bookIdx})},
                //{text: '확인 3', onPress: () => this.props.screenProps.navigation.navigate('SignInScreen')},
                {text: '취소', onPress: () => console.log('로그인 취소')},
            ]);

        }else{ 

            let rebaseTotalOptionsPrice = 0;
            let productIdxArray = [{
                    memberProductIdx : 0,
                    extendsDay : 0,
                    optionList : this.state.checkOptionList,
                    productIdx : this.state.productList[this.state.selectedGoods].productIdx,
                    productType : '',
                    eventcode : ''
                }   
            ];

            let basePrice = this.state.productList[this.state.selectedGoods].originalPrice;
            let paymentAmount = this.state.productList[this.state.selectedGoods].price;
            await this.state.checkOptionList.forEach(function(element,index,array){               
                rebaseTotalOptionsPrice = parseInt(rebaseTotalOptionsPrice) + parseInt(element.info.price)         
                
            });

            let productDataArray = [{
                memberProductIdx : 0,
                extendsDay : 0,
                optionList : this.state.checkOptionList,
                freeOptionList : this.state.productList[this.state.selectedGoods].freeOptionList,
                productData : this.state.productList[this.state.selectedGoods],
                basePrice : basePrice,
                discountAmount : parseInt(basePrice) - parseInt(paymentAmount),
                paymentAmount : parseInt(paymentAmount) + parseInt(rebaseTotalOptionsPrice),
                productType : '',
                eventcode : ''
            }];
            
            const memberIdx = this.state.userToken.memberIdx;
            const formData = new FormData();
            formData.append('orderType', "lecture");
            formData.append('memberIdx', memberIdx);
            formData.append('paymentStatus', 1);
            formData.append('productList', JSON.stringify(productIdxArray));
            //formData.append('memberProductIdx', this.state.lectureInfo.memberProductIdx);
            //formData.append('selectedOption', this.state.optionList.length > 0 ? JSON.stringify(this.state.optionList) : null );
            //formData.append('paymentMethod', "");
            //formData.append('productType', "");
            //formData.append('eventCode', "");
            //console.log('formData',formData)

            let aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
            let aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey;
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
                //console.log('response', response)
                if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                    if ( response.code !== '0000' ) {
                        this.failCallAPi();
                    }else{
                        if ( response.data.orderNo ) {                    
                            this.props.navigation.navigate('LectureSettleInputScreen',{
                                //lectureIdx : this.state.lectureIdx,
                                //lectureInfo : this.state.lectureInfo,
                                productType : 'lecture',
                                productList　: productDataArray,
                                checkCartList : [],
                                checkOptionList : this.state.checkOptionList,
                                optionSumPrice : this.state.optionSumPrice,
                                isDeliveryPrice : this.state.isDeliveryPrice,
                                orderNo :  response.data.orderNo
                            })
                        }else{
                            let message = "일시적 오류가 발생하였습니다.\n 잠시후 이용해 주세요";
                            let timesecond = 2000;
                            CommonFuncion.fn_call_toast(message,timesecond);
                        }
                    }
                }else{
                    this.failCallAPi()
                }
            })
            .catch(err => {
                console.log('login error => ', err);
                this.failCallAPi()
            });
        }
    };

    tempSaveProcess = async() => {
         await this.requestOrderNo();
       
    }

    requestLecture = async() => {
        if ( this.state.selectedGoods !== null  ) {
            if ( this.state.optionList.length > 0 && this.state.checkOptionList.length === 0 ) {
                Alert.alert(
                    DEFAULT_CONSTANTS.appName + ": 수강신청",
                    "옵션품목을 선택하지 않으셨습니다. \n이대로 수강신청 하시겠습니까?",
                    [
                        {text: '네', onPress: this.requestOrderNo.bind(this)},
                        {text: '아니오'},
                    ],
                    { cancelable: false }
                )  
            }else{
                this.requestOrderNo();                
            }
        }else{
            let message = "상품선택을 하신후 수강신청을 눌러주세요";
            let timesecond = 2000;
            CommonFuncion.fn_call_toast(message,timesecond);
        }        
    }

    setDataArray = () => {
        let selectedFilterCodeList = [];
        const memberIdx = this.state.userToken.memberIdx;    
        if ( this.state.selectedGoods > 0 ) {            
            selectedFilterCodeList = [
                {
                    memberIdx : memberIdx,
                    optionList : this.state.checkOptionList,
                    productIdx : this.state.productList[this.state.selectedGoods].productIdx,
                    pr
                }
            ]
        }
        
        return selectedFilterCodeList;
    }

    cartInsert = async () => {
        const isLogin = await CommonUtil.isLoginCheck();
        if (isLogin !== true) {
            Alert.alert('', '로그인이 필요합니다.', [
                {text: '로그인', onPress: () => this.props.navigation.navigate('SignInScreen', {onLoginBack: () => this.onLoginBackForCart()})},
                {text: '취소', onPress: () => console.log('로그인 취소')}
            ]);
            return;
        }

        const memberIdx = this.state.userToken.memberIdx;
        if ( this.state.selectedGoods !== null  ) {
        //if ( typeof this.state.productList[this.state.selectedGoods].productIdx !== 'undefined' ) {
            /*
            optionListArray = [];
            await this.state.checkOptionList.forEach(function(element,index,array){               
                optionListArray.push({})                
            });
            */

            let productIdxArray = [{
                optionList : this.state.checkOptionList,
                productIdx : this.state.productList[this.state.selectedGoods].productIdx,
                productType : '',
                eventcode : ''
                
            }];
            
            const formData = new FormData();
            //formData.append('orderType', "lecture");
            formData.append('memberIdx', memberIdx);
            formData.append('productList', JSON.stringify(productIdxArray));
            // console.log('cartInsert formData',formData)

            let aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
            let aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey;
            await CommonUtil.callAPI( aPIsDomain + '/v1/payment/cartinsert/' + memberIdx,{
                method: 'POST', 
                headers: new Headers({
                    Accept: 'application/json',                
                    'Content-Type': 'multipart/form-data',
                    'apiKey': aPIsAuthKey
            }), 
                body:formData
            },10000
            ).then(response => {
                // console.log('cartInsert response', response)
                if (response && typeof response === 'object' || Array.isArray(response) === false) {
                    if ( response.code.toString() === '2006' ) {
                        const alerttoast2 = Toast.show('현재 수강대기, 판매대기, 판매불가로 인해 등록이 불가합니다.');
                        setTimeout(() => {
                            Toast.hide(alerttoast2);       
                        }, 2000)
                    }else if ( response.code.toString() === '2005' ) {
                            const alerttoast2 = Toast.show('장바구니 등록중 오류가 발생하였습니다. 관리자에게 문의해주세요');
                            setTimeout(() => {
                                Toast.hide(alerttoast2); 
                            }, 2000)
                    }else if ( response.code.toString() === '0000' || response.code.toString() === '3014' ) {
                        // const alerttoast2 = Toast.show('등록되었습니다.');
                        // setTimeout(() => {
                        //     Toast.hide(alerttoast2);       
                        // }, 2000)
                        Alert.alert('', '강의를 장바구니에 담았습니다.\n지금확인하시겠습니까?', [
                            {text: '확인', onPress: () => this.props.navigation.navigate('CartScreen')},
                            {text: '취소'},
                        ]);
                    }else if ( response.code.toString() === '3204' ) {
                        Alert.alert('', '이미 장바구니에 상품이 담겨져 있습니다.\n장바구니로 이동하시겠습니까?', [
                            {text: '확인', onPress: () => this.props.navigation.navigate('CartScreen')},
                            {text: '취소'},
                        ]);
                    }else{
                        this.failCallAPi(response.message || '장바구니 등록에 실패 했습니다.')
                    }
                }else{
                    this.failCallAPi()
                }
            })
            .catch(err => {
                console.log('login error => ', err);
                this.failCallAPi()
            });
        }else{
            const alerttoast = Toast.show('강의 상품을 하나 이상 선택해주십시요');
            setTimeout(() => {
                Toast.hide(alerttoast);       
            }, 2000)
        }

    }

    onEnterFullscreen = () => {
        //console.log('onEnterFullscreen')
        this.setState({
            containerWidth: SCREEN_HEIGHT,
            containerHeight: SCREEN_WIDTH,
            isFullscreen: true,
        });        
        //this.props.navigation.setParams({header : null});
        this._setNavigationParams(true);
        StatusBar.setHidden(true)
    }

    onExitFullscreen = async() => {    
        //console.log('onExitFullscreen 11111')   
        
        await this.setState({
            containerWidth: VIDEO_WIDTH,
            containerHeight: VIDEO_HEIGHT,
            isFullscreen: false,
        })
        await this._setNavigationParams(false);
        //this.props.navigation.setParams({headerShown : true});
        StatusBar.setHidden(false)        
        const position = this.state.videoLocation
        //console.log('position', position)
        
        setTimeout(
            () => {
                this.ScrollView.scrollTo({ x:0,y: parseInt(position), animated: true }); 
            },500
        )

        
    }

    setSeekerPosition = (time) => {
        //console.log('time',time)
        this.setState({globalCurrentTime:time})
    }
    closeTooltip = () => {
        if ( this.state.showRepeatInfo) {
            this.setState({showRepeatInfo : false})
        }
    }
    onLayoutSample = (evt ) => {
        //console.log('onLayoutHeader',evt.nativeEvent.layout.y);      
        this.setState({videoLocation : parseInt(evt.nativeEvent.layout.y)+parseInt(Platform.OS === 'ios' ? 350 : 450) })  
        
    }

    snapChange = async(idx) => {
        //console.log('snapChange', idx);
        //console.log('this.state.contentItems[idx].classIdx', this.state.contentItems[idx].classIdx);
        await this.setState({ 
            activeContentSlide: idx,
            //refreshLoading : true,
            productList　: [],        
            optionList : [],
            optionSumPrice : 0,
            isDeliveryPrice : false,
            selectedGoods : null,
            lectureIdx : this.state.contentItems[idx].classIdx
        })

        if ( this.state.contentItems[idx].classIdx > 0 ) {
            await this.refreshTextBookInfo(this.state.contentItems[idx].classIdx)
            await this.initTabIndex();
        }
    }


    renderContentItem = ({renderItem, index}) => {
        //console.log('renderContentItem',this.state.contentItems[index])
        let lecImage = this.state.lectureInfo.image;
        let lecTitle = this.state.lectureInfo.title;
        let lecDesc = this.state.lectureInfo.desc;
        // if ( typeof this.state.contentItems[index].desc !== 'undefined' ) {
        //     if ( typeof this.state.contentItems[index].desc.image !== 'undefined' ) {
        //         lecImage = this.state.contentItems[index].desc.image;
        //         if ( typeof this.state.contentItems[index].title !== 'undefined' ) {            
        //             lecTitle = this.state.contentItems[index].title;
        //         }
                
        //         if ( typeof this.state.contentItems[index].desc.desc !== 'undefined' ) {            
        //             lecDesc = this.state.contentItems[index].desc.desc;
        //         }
        //     }else{
        //         //this.failCallAPigoBack()
        //     }
        // }else{
        //     //this.failCallAPigoBack()
        // }

        if (!CommonUtil.isEmpty(this.state.contentItems[index].desc)) {
            if (!CommonUtil.isEmpty(this.state.contentItems[index].desc.image) ) {
                lecImage = this.state.contentItems[index].desc.image;
                if (!CommonUtil.isEmpty(this.state.contentItems[index].title)) {            
                    lecTitle = this.state.contentItems[index].title;
                }
                
                if (!CommonUtil.isEmpty(this.state.contentItems[index].desc.desc)) {            
                    lecDesc = this.state.contentItems[index].desc.desc;
                }
            }else{
                //this.failCallAPigoBack()
            }
        }else{
            //this.failCallAPigoBack()
        }
        
        
        return (
                <View style={styles.titleHeaderInfoNew}>
                    <View style={styles.commoneTopWrapNew} >
                        {
                            this.state.lectureInfo && lecImage ?
                            <Image
                                source={{uri:lecImage}}
                                style={{width:'100%',height:200,overflow:'hidden'}}
                                resizeMode='cover'
                            />
                            :
                            <Image                                    
                                style={{width:'100%',height:this.state.mainImgHeight-100,overflow:'hidden'}}
                                resizeMode='cover'
                                source={require('../../../assets/images/img_banner_no_img.png')}
                                >                                
                            </Image>   
                        }          
                    </View>   
                    {/* <View style={[styles.commoneBottomWrapNew,{height:150}]}> */}
                    <View style={[styles.commoneBottomWrapNew]}>
                        <View style={{paddingHorizontal:20, marginTop:17}}>
                            <CustomTextM style={styles.mainLectureText} numberOfLines={2} ellipsizeMode = 'tail'>
                                {lecTitle}
                            </CustomTextM>
                        </View>
                        <View style={{paddingHorizontal:20,paddingTop:9,marginBottom:23}}>
                            <CustomTextR style={styles.mainInformationSubText} numberOfLines={3} ellipsizeMode = 'tail'>{lecDesc}</CustomTextR>                           
                        </View>
                    </View>
                </View>
            
        );
    }
    
    

    render() {
        
        if ( this.state.loading ) {
            return (
                <View style={{flex: 1,width:'100%',backgroundColor : "#fff",textAlign: 'center',alignItems: 'center',justifyContent: 'center',}}><ActivityIndicator size="large" /></View>
            )
        }else {
            const LectureIntroduce =()=>{
                return (
                    <View style={{flex:1,padding:20}}>
                        <CustomTextR style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>
                                {this.state.lectureInfo.classInfo}
                        </CustomTextR>                            
                    </View>
                )
            }

            const LectureClassIndex = ()=>{   
                let lecClassIndex = this.state.lectureInfo.classIndex || [];     
                // if ( typeof this.state.contentItems[this.state.activeContentSlide].desc !== 'undefined' ) {            
                //     if ( typeof this.state.contentItems[this.state.activeContentSlide].desc.classIndex !== 'undefined' ) {            
                if ( !CommonUtil.isEmpty(this.state.contentItems[this.state.activeContentSlide].desc) ) {            
                    if ( !CommonUtil.isEmpty(this.state.contentItems[this.state.activeContentSlide].desc.classIndex) ) {            
                        lecClassInfo = this.state.contentItems[this.state.activeContentSlide].desc.classIndex;
                    }
                }       
                return (
                    <View style={{flex:1,paddingVertical:10}}>
                        {
                            lecClassIndex.map((classItem, classIndex) => {
                                return (
                                    <View style={{flexDirection:'row'}} key={classIndex}>
                                        <View style={{flex:1,borderRightWidth:1,borderRightColor:DEFAULT_COLOR.input_border_color,justifyContent:'center',alignItems:'center'}}>
                                            <CustomTextR style={{color:DEFAULT_COLOR.base_color_888,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingHorizontal:5,paddingBottom:20}}>
                                                {classItem.num}
                                            </CustomTextR> 
                                        </View>
                                        <View style={{flex:4,justifyContent:'flex-start',alignItems:'flex-start',paddingLeft:10}}>
                                            <CustomTextR style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingHorizontal:5,paddingBottom:20}}>
                                               {classItem.title}
                                            </CustomTextR> 
                                        </View>
                                    </View>

                                )
                            })
                        }
                    </View>
                )
            }

            let learnLevel = typeof this.state.lectureInfo.learnLevel !== 'undefined' ? this.state.lectureInfo.learnLevel.split('(') : [] ; 
            let stateproductList = Array.isArray(this.state.productList) !== false ? this.state.productList : [];
            //console.log('stateproductListstateproductList2',Array.isArray(this.state.productList) )
            return (
                <SafeAreaView style={[
                    { flex: 1,textAlign: 'center',alignItems: 'center',justifyContent: 'center'},
                    { width: this.state.containerWidth, height: this.state.containerHeight },
                    { backgroundColor: (this.state.isFullscreen ? DEFAULT_COLOR.base_color_000 : DEFAULT_COLOR.base_color_fff )}
                ]}>  
                
                    <NavigationEvents
                        onWillFocus={payload => {                            
                            //BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);          
                        }}
                        onWillBlur={payload => {                            
                            ///BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
                        }}
                    />                   
                    { this.state.showTopButton ?
                        <TouchableOpacity 
                            style={styles.fixedUpButton}
                            onPress={e => this.upButtonHandler()}
                        >
                            <Icon name="up" size={30} color="#000" />
                        </TouchableOpacity>
                        :
                        null
                    }
                    {
                        this.state.isFullscreen ?
                        null
                        :
                        <View style={{backgroundColor:DEFAULT_COLOR.lecture_base,height:StatusBarHeight,width:SCREEN_WIDTH,position:'absolute',left:0,top:0,zIndex:10}}>
                        <TouchableOpacity 
                            onPress={()=> this.backPress()} 
                            style={{zIndex:10,alignItems:'center',justifyContent:'center',width:60,height:StatusBarHeight,position:'absolute',left:0,top:0,paddingTop:Platform.OS === 'ios' ? CommonFuncion.isIphoneX() ? 25 : 10 : 0}}>
                            <Image source={require('../../../assets/icons/btn_back_page.png')} style={{width: 17, height: 17}} />
                        </TouchableOpacity>
                        <View style={{flex:1,alignItems:'center',justifyContent:'center',paddingTop:Platform.OS === 'ios' ? CommonFuncion.isIphoneX() ? 25 : 10 : 0}}>
                            {this.state.naviTitle === '강의상세' ? (
                            <CustomTextR style={{color:'#fff',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),letterSpacing:PixelRatio.roundToNearestPixel(-0.96)}}>강의상세</CustomTextR>
                            ) : (
                                <View style={{height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16) * 1.7}}>
                                    <TextTicker 
                                        //marqueeOnMount={false} 
                                        ref={c => this.marqueeRef = c}
                                        style={{width: SCREEN_WIDTH * 0.7, lineHeight: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16) * 1.42, fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyRegular, color: '#fff', fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16), letterSpacing:PixelRatio.roundToNearestPixel(-0.96), marginTop: 2}}
                                        shouldAnimateTreshold={10}
                                        duration={5000}
                                        loop
                                        bounce
                                        repeatSpacer={50}
                                        marqueeDelay={1000}
                                    >
                                        {this.state.naviTitle}
                                    </TextTicker>
                                </View>
                            )}
                        </View>
                    </View>
                    }
                    <ScrollView 
                        ref={(ref) => {
                            this.ScrollView = ref;
                        }}
                        indicatorStyle={'white'}
                        scrollEventThrottle={16}
                        keyboardDismissMode={'on-drag'}
                        onScroll={e => this.handleOnScroll(e)}
                        onMomentumScrollEnd = {({nativeEvent}) => { 
                            
                        }}
                        onScrollEndDrag ={({nativeEvent}) => { 
                            //
                        }} 
                        style={styles.container}
                    >
                        {
                        this.state.isFullscreen ?
                        <View >
                            <StatusBar barStyle={"dark-content"} animated={true} hidden={true}/>
                            <SampleVideoScreen
                                videoWidth={this.state.containerWidth}
                                videoHeight={this.state.containerHeight}
                                navigation={ this.props.navigation }
                                source={{ uri: this.state.lectureInfo.sampleLectureUrl || 'http://mvod.hackers.co.kr/champstudymobile/sample_movie/10970_s.mp4' }}
                                poster={this.state.lectureInfo.image}
                                showOnStart={true}
                                title={this.state.lectureInfo.title}
                                seekBarFillColor={DEFAULT_COLOR.lecture_sub}
                                //moveLectureItem={(isForward) => this.moveLectureItem(isForward)}
                                onEnterFullscreen={() => this.onEnterFullscreen()}
                                onExitFullscreen={() => this.onExitFullscreen()}
                                screenState={this.state}
                            />
                        </View>
                        :                        
                        <View>                               
                            <StatusBar backgroundColor={DEFAULT_COLOR.lecture_base} translucent={false}  barStyle="dark-content" />
                            {/*
                            <View style={{backgroundColor:DEFAULT_COLOR.lecture_base,height:Platform.OS === 'ios'? 40 : 30,width:SCREEN_WIDTH,position:'absolute',left:0,top:0,zIndex:10}}>
                                <TouchableOpacity 
                                    onPress={()=> this.backPress()} 
                                    style={{zIndex:10,alignItems:'center',justifyContent:'center',width:60,height:Platform.OS === 'ios'? 40 : 30,position:'absolute',left:0,top:0}}>
                                    <Image source={require('../../../assets/icons/btn_back_page.png')} style={{width: 17, height: 17}} />
                                </TouchableOpacity>
                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                    <CustomTextR style={{color:'#fff',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),letterSpacing:PixelRatio.roundToNearestPixel(-0.96)}}>강의상세</CustomTextR>
                                </View>                                
                            </View>
                            */}
                            <View 
                                style={{backgroundColor:DEFAULT_COLOR.lecture_base,height:300,paddingVertical:10,marginBottom: 60,marginTop:Platform.OS === 'ios'? 40 : 30}}
                                onLayout={(e)=>this.onLayoutHeader(e)}
                            >
                                <View style={{width:SCREEN_WIDTH,height:350,margin:0,padding:0,zIndex:10}}>
                                    <Carousel
                                        ref={(c) => { this.carouselContent = c; }}
                                        data={this.state.contentItems}
                                        firstItem={this.state.activeContentSlide}
                                        renderItem={this.renderContentItem}
                                        sliderWidth={CAROUSEL_SLIDER_WIDTH}
                                        itemWidth={CAROUSEL_ITEM_WIDTH}
                                        onSnapToItem={(index) => this.snapChange(index) }
                                        inactiveSlideScale={1.0}
                                        inactiveSlideOpacity={0.3}
                                        />
                                </View>
                                <View style={{position:'absolute',left:0,bottom:0,height:90,width:SCREEN_WIDTH,backgroundColor:DEFAULT_COLOR.base_color_fff,zIndex:1}}/>                             
                                {
                                this.state.refreshLoading &&
                                <View 
                                    style={{position:'absolute',left:0,bottom:0,height:300,width:SCREEN_WIDTH,backgroundColor:DEFAULT_COLOR.base_color_000,zIndex:10,opacity:0.5,justifyContent:'center',alignItems:'center'}}
                                ><ActivityIndicator size="large" /></View>
                                }
                            </View>

                            {
                            this.state.refreshLoading
                            ?            
                            <View style={{flex: 1,minHeight:SCREEN_HEIGHT*0.5,alignItems: 'center',justifyContent: 'center',backgroundColor:DEFAULT_COLOR.base_color_000,zIndex:10,opacity:0.5}}>
                                <ActivityIndicator size="large" />
                            </View>
                            :
                            <View>                            
                                <TouchableOpacity
                                    style={styles.secondInformationWrap}
                                    onPress= {()=> this.closeTooltip()}
                                >                        
                                    <View style={styles.secondInformationTitle}>
                                        <CustomTextB style={styles.secondInformationTitleText}>강좌 정보</CustomTextB>
                                    </View>
                                    <View style={styles.secondInformationSubWarp}>
                                        <View style={styles.secondInformationSubLeft}>
                                            <CustomTextR style={styles.secondInformationSubText}>선생님</CustomTextR>
                                        </View>
                                        <View style={styles.secondInformationSubCenter}>
                                            <CustomTextR style={{color:'#d8d8d8',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}>|</CustomTextR>
                                        </View>
                                        <View style={styles.secondInformationSubRight}>
                                            <CustomTextR style={styles.secondInformationSubText}>
                                                {this.state.lectureInfo.teacher}
                                            </CustomTextR>
                                        </View>
                                    </View>
                                    {Platform.OS === 'ios' && this.state.productList.length > 0 && (
                                        <View style={styles.secondInformationSubWarp}>
                                            <View style={styles.secondInformationSubLeft}>
                                                <CustomTextR style={styles.secondInformationSubText}>교재</CustomTextR>
                                            </View>
                                            <View style={styles.secondInformationSubCenter}>
                                                <CustomTextR style={{color:'#d8d8d8',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}>|</CustomTextR>
                                            </View>
                                            <View style={styles.secondInformationSubRight}>
                                                { 
                                                    this.state.productList.length > 1 ? (
                                                    <CustomTextR style={styles.secondInformationSubText}>
                                                        강의상품별 상이
                                                    </CustomTextR>
                                                    ) : (
                                                    <CustomTextR style={styles.secondInformationSubText}>
                                                        {this.state.productList[0].book[0]}
                                                    </CustomTextR>
                                                    )
                                                }
                                                
                                            </View>
                                        </View>
                                    )}
                                    {Platform.OS !== 'ios' && this.state.selectedGoods !== null && this.state.productList[this.state.selectedGoods].book && (
                                    <View style={[styles.secondInformationSubWarp, {justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop: 6}]}>
                                        <View style={[styles.secondInformationSubLeft, {justifyContent: 'flex-start'}]}>
                                            <CustomTextR style={styles.secondInformationSubText}>교재</CustomTextR>
                                        </View>
                                        <View style={styles.secondInformationSubCenter}>
                                            <CustomTextR style={{color:'#d8d8d8',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}>|</CustomTextR>
                                        </View>
                                        <View style={[styles.secondInformationSubRight, {alignItems: 'flex-start', justifyContent: 'flex-start', padding: 0}]}>
                                            {this.state.productList[this.state.selectedGoods].book && this.state.productList[this.state.selectedGoods].book.map((item, index) => {
                                                return (
                                                    <CustomTextR style={[styles.secondInformationSubText, {marginBottom: 5}]} key={index}>
                                                        {item}
                                                    </CustomTextR>
                                                );
                                            })}
                                        </View>
                                    </View>
                                    )}
                                    <View style={styles.secondInformationSubWarp}>
                                        
                                        <View style={[styles.secondInformationSubLeft,{flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}]}>
                                            <CustomTextR style={styles.secondInformationSubText}>배수</CustomTextR>
                                            <TouchableOpacity
                                                style={{paddingLeft:5}}
                                                onPress= {()=> this.setState({showRepeatInfo : !this.state.showRepeatInfo})}
                                                >
                                                <Icon name="questioncircleo" size={16} color="#666" />
                                            </TouchableOpacity>                            
                                        </View>
                                        <View style={styles.secondInformationSubCenter}>
                                            <CustomTextR style={{color:'#d8d8d8',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}>|</CustomTextR>
                                        </View>
                                        <View style={styles.secondInformationSubRight}>
                                            <CustomTextR style={styles.secondInformationSubText}>{this.state.lectureInfo.lectureMultiple}</CustomTextR>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.secondInformationIconWrap}>
                                    {this.state.showRepeatInfo ?
                                        <View style={styles.secondInformationHidden}>
                                            <View style={[styles.secondInformationHiddenCommonRow,{paddingBottom:10}]}>
                                                <CustomTextB style={styles.secondInformationHiddenTitleText}>배수란 ?</CustomTextB>
                                            </View>
                                            <View style={styles.secondInformationHiddenCommonRow}>
                                                <CustomTextM style={[styles.secondInformationHiddenBodyText, {fontWeight: "500",color:DEFAULT_COLOR.base_color_222,marginBottom:4}]}>강의수강 가능시간으로 강좌별 설정된 배수에 따라 강의마다 수강 시간이 달라집니다.</CustomTextM>
                                            </View>
                                            <View style={styles.secondInformationHiddenCommonRow}>
                                                <CustomTextR style={[styles.secondInformationHiddenBodyText, {color:DEFAULT_COLOR.base_color_888}]}>예) 2배수 강좌 내'1강'의 강의 시간이 50분인 경우, '50분X2배수' 설정되어 총 100분 수강가능</CustomTextR>
                                            </View>
                                        </View>
                                        :
                                        null
                                    }
                        
                                    <View style={styles.secondInformationIconData}>
                                        <View style={styles.secondInformationIconDataRow}>
                                            <CustomTextM style={styles.secondInformationIconDataText}>학습수준</CustomTextM>
                                        </View>
                                        <View style={styles.secondInformationIconDataRow}>
                                            <CustomTextM style={styles.secondInformationIconDataText}>학습기간</CustomTextM>
                                        </View>
                                        <View style={styles.secondInformationIconDataRow}>
                                            <CustomTextM style={styles.secondInformationIconDataText}>지원기기</CustomTextM>
                                        </View>
                                    </View>

                                    <View style={styles.secondInformationIconData}>
                                        <View style={styles.secondInformationIconDataRow}>
                                            <Image
                                                source={require('../../../assets/icons/icon_info_level.png')}
                                                style={{width:40,height:40}}
                                                resizeMode='contain'
                                            />                                   
                                        </View>
                                        <View style={styles.secondInformationIconDataRow}>
                                            <Image
                                                source={require('../../../assets/icons/icon_info_term.png')}
                                                style={{width:40,height:40}}
                                                resizeMode='contain'
                                            />                                    
                                        </View>
                                        <View style={styles.secondInformationIconDataRow}>
                                            <Image
                                                source={require('../../../assets/icons/icon_info_pcmobile.png')}
                                                style={{width:40,height:40}}
                                                resizeMode='contain'
                                            />
                                            
                                        </View>
                                    </View>
                                    <View style={{padding:5,flexDirection:'row'}}>
                                        <View style={styles.secondInformationIconDataRow}>
                                            <CustomTextM style={styles.secondInformationIconDataColorText}>
                                                {this.state.lectureInfo.learnLevel ? learnLevel[0] : null}
                                            </CustomTextM>
                                        </View>
                                        <View style={styles.secondInformationIconDataRow}>
                                            <CustomTextM style={styles.secondInformationIconDataColorText}>{this.state.lectureInfo.courseDays ? this.state.lectureInfo.courseDays : 0}일</CustomTextM>
                                        </View>
                                        <View style={styles.secondInformationIconDataRow}>
                                            <CustomTextM style={styles.secondInformationIconDataColorText}>
                                                {typeof this.state.lectureInfo.device !== 'undefined' ? this.state.lectureInfo.device[0] && this.state.lectureInfo.device[0].toUpperCase() : null}
                                            </CustomTextM>
                                        </View>
                                    </View>
                                    <View style={{paddingHorizontal:5,flexDirection:'row'}}>
                                        <View style={styles.secondInformationIconDataRow}>
                                            <CustomTextM style={styles.secondInformationIconDataColorText2}>
                                                {(this.state.lectureInfo.learnLevel && typeof learnLevel[1] !== 'undefined') ? "("+learnLevel[1] : null}
                                            </CustomTextM>
                                        </View>
                                        <View style={styles.secondInformationIconDataRow}>
                                            <CustomTextM style={styles.secondInformationIconDataColorText2}>({this.state.lectureInfo.lectureCount ? this.state.lectureInfo.lectureCount : 0}강)</CustomTextM>
                                        </View>
                                        <View style={styles.secondInformationIconDataRow}>
                                            <CustomTextM style={styles.secondInformationIconDataColorText2}>
                                            {typeof this.state.lectureInfo.device !== 'undefined' ? this.state.lectureInfo.device[1] && this.state.lectureInfo.device[1].toUpperCase() : null}
                                            </CustomTextM>
                                        </View>
                                    </View>
                                </View>
                                <View style={{backgroundColor:DEFAULT_COLOR.input_bg_color2}}>
                                    {Platform.OS === 'android' && (
                                    <View style={styles.selectGoodsWrapper}>
                                        <View style={{paddingHorizontal:15}}>
                                            <CustomTextB style={styles.selectGoodsTitleText}>상품선택</CustomTextB>
                                        </View>                        
                                        <View style={{padding:5}}>
                                            {                                            
                                            
                                            stateproductList.map((titem, tindex) => {
                                                return(                           
                                                    <View style={this.state.selectedGoods === tindex ? styles.checkedItem : styles.unCheckedItem} key={tindex}>
                                                        <View style={styles.selectGoodsBoxWrapper}>
                                                            <CheckBox
                                                                containerStyle={styles.checkboxWrap}                                            
                                                                // checkedIcon="dot-circle-o"
                                                                // uncheckedIcon="circle-o" 
                                                                checkedIcon={<Image source={require('../../../assets/icons/btn_radio_on.png')} style={{width: 23, height: 23}} />}
                                                                uncheckedIcon={<Image source={require('../../../assets/icons/btn_radio_off.png')} style={{width: 23, height: 23}} />}
                                                                readOnly
                                                                checked={this.state.selectedGoods === tindex ? true : false }
                                                                onPress= {()=> this.selectProduct(tindex,titem)}
                                                            />                            
                                                        </View>
                                                        <View style={{flex:4}}>
                                                            <View >
                                                                <CustomTextM style={styles.selectGoodsBoxRightTitleText}>{titem.title}</CustomTextM>
                                                            </View>
                                                            { titem.originalPrice !== titem.price
                                                            ?
                                                            <View style={styles.selectGoodsBoxRightOption}>
                                                                <TextRobotoR style={styles.selectGoodsBoxRightOptionText1}>{CommonFuncion.currencyFormat(titem.originalPrice)}<CustomTextR>원</CustomTextR></TextRobotoR>
                                                                <TextRobotoM style={styles.selectGoodsBoxRightOptionText2}>{parseInt(100-(titem.price/titem.originalPrice*100))}%</TextRobotoM>
                                                                <TextRobotoM style={styles.selectGoodsBoxRightOptionText3}>{CommonFuncion.currencyFormat(titem.price)}<CustomTextM>원</CustomTextM></TextRobotoM>   
                                                            </View>
                                                            :
                                                            <View style={styles.selectGoodsBoxRightOption}>
                                                                <Text style={styles.selectGoodsBoxRightOptionText3}>{CommonFuncion.currencyFormat(titem.price)}원</Text>   
                                                            </View>
                                                            }
                                                        </View>
                                                    </View>
                                                )
                                            })
                                            }
                                            
                                        </View>
                                        <View style={styles.selectGoodsOptionWrapper}>
                                            <CustomTextB style={styles.selectGoodsTitleText}>옵션선택</CustomTextB>
                                        </View>                  
                                        {
                                            this.state.selectedGoods === null  
                                            ?
                                            <View style={styles.selectGoodsOptionSelectBox}>
                                                <View style={styles.selectGoodsOptionSelectBoxView}>
                                                    <CustomTextR numberOfLines={1} ellipsizeMode = 'tail' style={styles.selectGoodsOptionSelectBoxText}>
                                                        상품은 먼저 선택해주세요
                                                    </CustomTextR>
                                                </View>                                
                                            </View>
                                            :
                                            ( this.state.selectedGoods !== null && this.state.optionList.length > 0) 
                                            ?
                                                <TouchableOpacity 
                                                    onPress={()=>this.toggleOverlay(null)}
                                                    style={styles.selectGoodsOptionSelectBox}
                                                >
                                                    <View style={styles.selectGoodsOptionSelectBoxView}>
                                                        <CustomTextR numberOfLines={1} ellipsizeMode = 'tail' style={styles.selectGoodsOptionSelectBoxText}>
                                                            {this.state.optionList[0].title}
                                                        </CustomTextR>
                                                    </View>
                                                    <View style={{flex:0.5,justifyContent:'center',alignItems:'center'}} >   
                                                        <Icon name="down" size={20} color={DEFAULT_COLOR.lecture_base} />
                                                    </View>
                                                </TouchableOpacity>
                                            :
                                            <View style={styles.selectGoodsOptionSelectBox}>
                                                <View style={styles.selectGoodsOptionSelectBoxView}>
                                                    <CustomTextR numberOfLines={1} ellipsizeMode = 'tail' style={styles.selectGoodsOptionSelectBoxText}>
                                                        해당 강의상품은 옵션항목이 없습니다.
                                                    </CustomTextR>
                                                </View>                                
                                            </View>
                                        }
                                    </View>
                                    )}
                                    {
                                        Platform.OS === 'android' && this.state.selectedGoods !== null ?
                                        <View style={styles.selectGoodsResultWrap}>
                                            <View style={styles.selectGoodsResultInWrap}>
                                                <View style={styles.selectGoodsResultTitle}>
                                                    <CustomTextB style={styles.selectGoodsTitleText}>신청내역</CustomTextB>
                                                </View>
                                                <View style={styles.selectGoodsResultLectureTitle}>
                                                    <CustomTextR style={styles.selectGoodsResultLectureTitleText}>
                                                        {this.state.productList[this.state.selectedGoods].title}
                                                    </CustomTextR>                        
                                                </View>
                                                <View style={styles.selectGoodsResultLecturePrice}>
                                                    <TextRobotoM style={styles.selectGoodsResultLecturePriceText}>
                                                        {CommonFuncion.currencyFormat(this.state.productList[this.state.selectedGoods].price)}<CustomTextM>원</CustomTextM>
                                                    </TextRobotoM>  
                                                </View>   
                                                <View>
                                                {   
                                                this.state.checkOptionList.map((seitem, seIndex) => {
                                                    return (
                                                        <View key={seIndex} style={{borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1,paddingBottom:10}}>
                                                            <View style={styles.selectGoodsResultOptionWrap}>
                                                                <View style={styles.selectGoodsResultOptionTitile}>
                                                                    <CustomTextR style={styles.selectGoodsResultOptionTitileTextBold}>선택옵션 : </CustomTextR>                                        
                                                                    <CustomTextR style={styles.selectGoodsResultOptionTitileText}>
                                                                        {seitem.info.title}
                                                                    </CustomTextR>                        
                                                                </View>
                                                                <TouchableOpacity 
                                                                    style={styles.selectGoodsResultOptionCancel}
                                                                    onPress={()=> this.removeOptionList(seitem.index)}
                                                                >
                                                                    <Icon name="closecircle" size={20} color="#ccc" />
                                                                </TouchableOpacity>
                                                            </View>
                                                            <View style={styles.selectGoodsResultOptionPrice}>
                                                                <TextRobotoM style={styles.selectGoodsResultOptionPriceText}>
                                                                    {CommonFuncion.currencyFormat(seitem.info.price)}<CustomTextM>원</CustomTextM>
                                                                </TextRobotoM>  
                                                            </View>
                                                        </View>
                                                    )
                                                })
                                                }
                                                </View>
                                            </View>
                                        </View>
                                        :
                                        null
                                    }
                                    
                                    {Platform.OS === 'android' && (
                                    <View style={styles.selectGoodsResultPriceWrap}>
                                        <View style={styles.selectGoodsResultPriceInWrap}>
                                            <View style={styles.selectGoodsResultPriceLeft}>
                                                <CustomTextB style={styles.selectGoodsResultPriceText1}>총상품금액</CustomTextB>
                                            </View>
                                            <View style={styles.selectGoodsResultPriceCenter}>
                                                {( this.state.selectedGoods !== null && this.state.productList[this.state.selectedGoods].originalPrice > this.state.productList[this.state.selectedGoods].price ) ? 
                                                <TextRobotoM style={styles.selectGoodsResultPriceText2}>
                                                    {CommonFuncion.currencyFormat(this.state.productList[this.state.selectedGoods].originalPrice)}<CustomTextM>원</CustomTextM>
                                                </TextRobotoM>
                                                : null
                                                }
                                            </View>
                                            <View style={styles.selectGoodsResultPriceRight}>
                                                <TextRobotoB style={[styles.selectGoodsResultPriceText1, {fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20)}]}>
                                                    {
                                                        this.state.selectedGoods !== null ? 
                                                        CommonFuncion.currencyFormat(parseInt(this.state.optionSumPrice) + parseInt(this.state.productList[this.state.selectedGoods].price)) 
                                                        :
                                                        0
                                                    }<CustomTextB>원</CustomTextB>
                                                </TextRobotoB>   
                                            </View>
                                            
                                        </View>
                                    </View>
                                    )}
                                    
                                    {
                                    this.state.lectureInfo.sampleLectureUrl ?
                                    <View style={{backgroundColor:DEFAULT_COLOR.input_bg_color2}} onLayout={(e)=>this.onLayoutSample(e)}>
                                        <View style={styles.sampleVideoWrapper}>
                                            <View 
                                                style={{padding:15}} 
                                                ref={(ref) => {
                                                    this._nodes = ref;
                                                }}
                                            >
                                                <CustomTextB style={styles.sampleVideoTitleText}>샘플강의 보기</CustomTextB>
                                            </View>                        
                                            <View style={{flex:1,width: SCREEN_WIDTH, height: Platform.OS === 'ios' ? SCREEN_WIDTH/16*9-20 : SCREEN_WIDTH/16*9}}>
                                                <SampleVideoScreen
                                                    //videoWidth={VIDEO_WIDTH}
                                                    //videoHeight={VIDEO_HEIGHT}
                                                    videoWidth={this.state.containerWidth}
                                                    videoHeight={this.state.containerHeight}
                                                    navigation={ this.props.navigation }
                                                    source={{ uri: this.state.lectureInfo.sampleLectureUrl || 'http://mvod.hackers.co.kr/champstudymobile/sample_movie/10970_s.mp4' }}
                                                    poster={this.state.lectureInfo.image}
                                                    showOnStart={true}
                                                    title={this.state.lectureInfo.title}
                                                    seekBarFillColor={DEFAULT_COLOR.lecture_sub}
                                                    //moveLectureItem={(isForward) => this.moveLectureItem(isForward)}
                                                    onEnterFullscreen={() => this.onEnterFullscreen()}
                                                    onExitFullscreen={() => this.onExitFullscreen()}
                                                    screenState={this.state}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    :
                                    null
                                    }
                                    <View style={{backgroundColor:'#ccc'}}>
                                        <View style={styles.bottomTabsWrapper}>
                                            {(this.state.lectureInfo && !CommonUtil.isEmpty(this.state.lectureInfo.classInfo)) && (
                                            <View style={[this.state.isselectTab === 1 ? styles.heaerTabsOn : styles.heaerTabs,{flex:1}]}>
                                                <CustomTextR                                     
                                                    onPress= {()=> this.changeTabs(1)}
                                                    style={[this.state.isselectTab === 1 ? styles.selectedText : styles.unselectedText]}
                                                    >
                                                    강의소개
                                                </CustomTextR>
                                            </View>
                                            )}
                                            {(this.state.lectureInfo && this.state.lectureInfo.classIndex && this.state.lectureInfo.classIndex.length > 0) && (
                                            <View style={[this.state.isselectTab === 2 ? styles.heaerTabsOn : styles.heaerTabs,{flex:1}]}>
                                                <CustomTextR 
                                                    onPress= {()=> this.changeTabs(2)}
                                                    style={[this.state.isselectTab === 2 ? styles.selectedText : styles.unselectedText]}
                                                >
                                                    강의목차
                                                </CustomTextR>
                                            </View>
                                            )}
                                            <View style={[this.state.isselectTab === 3 ? styles.heaerTabsOn : styles.heaerTabs,{flex:1}]}>
                                                <CustomTextR 
                                                    onPress= {()=> this.changeTabs(3)}
                                                    style={[this.state.isselectTab === 3 ? styles.selectedText : styles.unselectedText]}
                                                >
                                                    수강후기
                                                </CustomTextR>
                                            </View>
                                            <View style={[this.state.isselectTab === 4 ? styles.heaerTabsOn : styles.heaerTabs,{flex:1.6}]}>
                                                <CustomTextR 
                                                    onPress= {()=> this.changeTabs(4)}
                                                    style={[this.state.isselectTab === 4 ? styles.selectedText : styles.unselectedText]}
                                                >
                                                    선생님께 질문하기
                                                </CustomTextR>
                                            </View>
                                        </View>
                                        <View>                            
                                            {
                                            this.state.isselectTab === 4 ?
                                                <View style={styles.firstWrapper}>
                                                    <LectureQna screenState={this.state} />
                                                </View> 
                                            :
                                            this.state.isselectTab === 3 ?
                                                <View style={styles.firstWrapper}>
                                                    <LectureReview screenState={this.state} />
                                                </View>
                                            :
                                            this.state.isselectTab === 2 ?
                                                <View style={styles.firstWrapper}>
                                                    <LectureClassIndex />
                                                </View>
                                            :
                                                <View style={styles.firstWrapper}>
                                                    <LectureIntroduce />
                                                </View>
                                            }
                                            
                                        </View>
                                    </View>

                                    {Platform.OS === 'android' && (
                                        <View style={{backgroundColor:'#222'}}>
                                            <View style={styles.bottomButtonWrapper}>
                                                <TouchableOpacity 
                                                    style={styles.bottomButtonLeft}
                                                    onPress= {()=> this.cartInsert()}
                                                >
                                                    <Icon name="shoppingcart" size={30} color={DEFAULT_COLOR.base_color_fff} />
                                                </TouchableOpacity>
                                                <TouchableOpacity                             
                                                    style={styles.bottomButtonRight}
                                                    onPress= {()=> this.requestLecture()}
                                                    >
                                                    <CustomTextB style={styles.bottomButtonRightText}>수강신청</CustomTextB>
                                                </TouchableOpacity>
                                                
                                            </View>
                                        </View>
                                    )}
                                </View>
                                {/*  옵션선택  */}
                                <Modal
                                    onBackdropPress={this.closeModalCoupon}
                                    onBackButtonPress={()=>this.closeModalCoupon()}
                                    style={{justifyContent: 'flex-end',margin: 0}}
                                    useNativeDriver={true}
                                    animationInTiming={300}
                                    animationOutTiming={300}
                                    hideModalContentWhileAnimating
                                    isVisible={this.state.isVisibleOverlay}>
                                    <Animated.View style={[styles.modalContainer,{ height: this.animatedHeightCoupon }]}>
                                        <View style={styles.postcodeWrapper}>
                                            <CustomTextR style={styles.modalTitle}>
                                            옵션선택
                                            </CustomTextR>
                                            <TouchableOpacity 
                                                onPress= {()=> this.toggleOverlay(1)}
                                                style={{position:'absolute',top:0,right:15,width:30,height:30}}>
                                                <Icon name="close" size={25} color="#555" />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{flex:1}}>
                                            { this.state.selectedGoods !== null ?
                                            <ScrollView style={{backgroundColor:'#fff'}}>
                                                {                                
                                                    this.state.optionList.map((oitem, keyIndex) => {
                                                        let isIndexOf = this.state.checkOptionListTemp.findIndex(
                                                            info => info.index === oitem.optionIdx
                                                        ); 
                                                        return(
                                                            <View 
                                                                key={keyIndex} 
                                                                style={isIndexOf != -1 ? styles.gridViewOn : styles.gridView }
                                                            >
                                                                <View                                                     
                                                                    style={[
                                                                        styles.gridRight,
                                                                        //isIndexOf != -1 ? styles.listItemCheckBoxWrapperChecked : styles.listItemCheckBoxWrapperUnchecked 
                                                                    ]}
                                                                    >
                                                                    <CheckBox 
                                                                        checked
                                                                        size={25}
                                                                        containerStyle={{padding:0,margin:0, alignSelf: 'center'}}
                                                                        iconType='font-awesome'
                                                                        checkedIcon='check-circle'
                                                                        uncheckedIcon='circle-o'
                                                                        checkedColor={DEFAULT_COLOR.lecture_base}
                                                                        uncheckedColor='#ebebeb'
                                                                        checked={isIndexOf != -1 ? true  : false}                                                            
                                                                        onPress= {()=> this._checkOptionListTemp(keyIndex,oitem,isIndexOf != -1 ? 'remove' : null)}
                                                                    />
                                                                </View>
                                                                <View style={styles.gridLeft}>
                                                                    <View>
                                                                        <Text style={styles.itemText}>{oitem.title}</Text>
                                                                    </View>
                                                                    <View style={{justifyContent:'flex-end',alignItems:'flex-end'}}>
                                                                        <Text style={styles.itemText}>
                                                                            {CommonFuncion.currencyFormat(oitem.price)}원
                                                                        </Text>
                                                                    </View>
                                                                    
                                                                </View>
                                                                
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </ScrollView>
                                            :
                                            null
                                            }
                                            
                                        </View>
                                        <View style={{flex:0.15,backgroundColor:'#222'}}>
                                                <View style={styles.bottomButtonWrapper}>
                                                    <TouchableOpacity 
                                                        style={styles.bottomButtonLeft2}
                                                         onPress= {()=> {
                                                             this.setState({_checkOptionListTemp : this.state.optionList});
                                                             this.toggleOverlay(1);
                                                            }}
                                                    >
                                                        <CustomTextB style={styles.bottomButtonLeftText2}>취소</CustomTextB>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity                             
                                                        style={styles.bottomButtonRight2}
                                                        onPress= {()=> this._checkOptionList()}
                                                        >
                                                        <CustomTextB style={styles.bottomButtonRightText2}>선택완료</CustomTextB>
                                                    </TouchableOpacity>
                                                    
                                                </View>
                                            </View>
                                    </Animated.View>
                                </Modal>
                                {/*
                                <Overlay
                                    width={SCREEN_WIDTH}
                                    height={SCREEN_HEIGHT-20}
                                    overlayBackgroundColor="transparent"
                                    isVisible={this.state.isVisibleOverlay}>
                                    <SafeAreaView style={{ flex:1}}>
                                        <View style={styles.overrayTop}>
                                            <View style={ styles.overrayHeader }>
                                                <Text style={ styles.headerText }>옵션선택</Text>
                                            </View>
                                        </View>
                                        { this.state.selectedGoods !== null ?
                                        <ScrollView style={{backgroundColor:'#fff'}}>
                                            {                                
                                                this.state.optionList.map((oitem, keyIndex) => {
                                                    let isIndexOf = this.state.checkOptionList.findIndex(
                                                        info => info.index === oitem.optionIdx
                                                    ); 
                                                    return(
                                                        <View key={keyIndex} style={styles.gridView}>
                                                            <View style={styles.gridLeft}>
                                                                <View>
                                                                    <Text style={styles.itemText}>{oitem.title}</Text>
                                                                </View>
                                                                <View style={{justifyContent:'flex-end',alignItems:'flex-end'}}>
                                                                    <Text style={styles.itemText}>
                                                                        {CommonFuncion.currencyFormat(oitem.price)}원
                                                                    </Text>
                                                                </View>
                                                                
                                                            </View>
                                                            <View                                                     
                                                                style={[
                                                                    styles.gridRight,
                                                                    //isIndexOf != -1 ? styles.listItemCheckBoxWrapperChecked : styles.listItemCheckBoxWrapperUnchecked 
                                                                ]}
                                                                >
                                                                <CheckBox 
                                                                    checked
                                                                    size={25}
                                                                    containerStyle={{padding:0,margin:0, alignSelf: 'center'}}
                                                                    iconType='font-awesome'
                                                                    checkedIcon='check'
                                                                    uncheckedIcon='check'
                                                                    checkedColor={DEFAULT_COLOR.lecture_base}
                                                                    uncheckedColor='#ebebeb'
                                                                    checked={isIndexOf != -1 ? true  : false}                                                            
                                                                    onPress= {()=> this._checkOptionList(keyIndex,oitem,isIndexOf != -1 ? 'remove' : null)}
                                                                />
                                                            </View>                                
                                                        </View>
                                                    )
                                                })
                                            }
                                        </ScrollView>
                                        :
                                        null
                                        }
                                    
                                        <View style={ styles.overrayBottom }>
                                            <Button
                                                title='선택완료'
                                                onPress={ () => this.toggleOverlay(1) }
                                            />
                                            <View style={{width:'100%',height:5}}></View>
                                            { this.state.checkOptionList.length > 0 ?                                    
                                                <Button
                                                    title='전체취소'
                                                    buttonStyle={{ backgroundColor: '#D9D9D9', }}
                                                    titleStyle={{ color: '#616161' }}
                                                    onPress={ () => this.setState({checkOptionList:[]}) }
                                                />
                                                :
                                                null
                                            }
                                        </View>
                                    </SafeAreaView>
                                </Overlay>
                                */}
                            </View>
                            }
                        </View>
                        }
                    </ScrollView>                    
                </SafeAreaView>
            );
            
        }
    }
}


function mapStateToProps(state) {
    return {
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
        userToken: state.GlabalStatus.userToken,
        isDrawerOpen :state.GlabalStatus.isDrawerOpen,   
    };
}
export default connect(mapStateToProps, null)(LectureDetailScreen);