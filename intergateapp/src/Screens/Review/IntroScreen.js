import React, {Component} from 'react';
import {ImageBackground, Text, View, ActivityIndicator, ScrollView,TouchableOpacity,Dimensions,PixelRatio,Platform,Animated,RefreshControl, Linking,Alert,Image} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();

import { Overlay } from 'react-native-elements';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextB, TextRobotoM,TextRobotoR} from '../../Style/CustomText';


const {width: SCREEN_WIDTH,height : SCREEN_HEIGHT} = Dimensions.get("window");
import styles from '../../Style/Review/IntroScreen';
import SearchFilter from './SearchFilter';
import SearchFilterPass from './SearchFilterPass';

import PassReview from './PassReview';
import LectureReview from './LectureReview';

const IconsPaddingTop = Platform.OS === 'android' ? 10 : 20
const IconsPaddingMinus = Platform.OS === 'android' ? 40 : 0
const pageViewLimit = 10;

const defaultThumbUrl = 'https://mchamp.hackers.com/files/lecture/2019/11/3c3bcde9f02ec0d291fcbac735561aac.jpg';

class IntroScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            refreshing : false,
            moreLoading : false,
            isonlyMyview : false,
            currentpage : 1,
            ismore : false,    
            formMemberIdx : 0,
            thisFocus : this.props.screenState.nowFocus,
            focusTab : this.props.screenState.focusTab,
            showModal : false,
            subGnbMenu : [],
            selectedFilterCodeList : [],
            _showModal : this._showModal.bind(this),
            _closeModal : this._closeModal.bind(this),
            refreshTextBookInfo : this.refreshTextBookInfo.bind(this),
            showTopButton : false,
            isVisibleOveray : false,
            // selectMenuTabs : [],
            selectMenuTabs : '',
            activeContentSlide: 0,
            activeBannerSlide: 0,
            //컨텐츠 영역
            broadcastItems: [],
            reviewItems : [],
            scrollToRemote: this.scrollToRemote.bind(this),
        }
    }

    async UNSAFE_componentWillMount() {

        await this.setGnbMenu();
        let returnData = await this.devideFilter();
        // if ( this.state.selectMenuTabs.length > 0 ) {
        if ( this.state.selectMenuTabs !== '' ) {
            await this.refreshGetBroadcast()
            await this.refreshTextBookInfo(1,pageViewLimit, returnData[0],returnData[1])
        }
        
        if ( this.props.userToken !== null ) {            
            this.setState({formMemberIdx : this.props.userToken.memberIdx})
        }
    }

    componentDidMount() {
    }

    UNSAFE_componentWillUnmount() {
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if ( nextProps.screenState.focusTab !== this.props.screenState.focusTab ) {
            this.upButtonHandler();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        //console.log('prevProps.myInterestCodeOne.code ',nextProps.myInterestCodeOne.code )
        //console.log('this.props.myInterestCodeOne.code ',this.props.myInterestCodeOne.code )
        if ( nextProps.myInterestCodeOne.code !== this.props.myInterestCodeOne.code) {
            this._onRefresh();
        }
        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        const os = Platform.OS === 'ios' ? 'iOS' : 'Android';
        if ( prevProps.globalGnbMenu && this.props.globalGnbMenu) {
            const prevPropsMenu = JSON.parse(prevProps.globalGnbMenu);
            const thisPropsMenu = JSON.parse(this.props.globalGnbMenu);
            if (prevPropsMenu[os].find(item => item.depth1Code === '005').depth2List.length !== thisPropsMenu[os].find(item => item.depth1Code === '005').depth2List.length) {
                this.setGnbMenu(this.props.globalGnbMenu);
            }
        }
    }

    setGnbMenu = async gnbMenu => {
        let returnArray = [];
        let myGnbMenu = gnbMenu || await AsyncStorage.getItem('myGnbMenu');
        if ( myGnbMenu !== null ) {
            returnArray = await this.setSubGnbMenu(Platform.OS === 'ios' ? JSON.parse(myGnbMenu).iOS : JSON.parse(myGnbMenu).Android )
        }
        //메뉴설정
        this.setState({
            subGnbMenu : returnArray,
            selectMenuTabs : returnArray.length > 0 ? returnArray[0].depth2Code : null
        })

    }
    setSubGnbMenu = async(menu) => {
        // console.log("introScreen menu", menu);
        let returnArray = [];
        let tmpmenu = await menu.filter((info) => info.depth1Code === DEFAULT_CONSTANTS.gnbMenuReviewCourseCode);
        let tmpmenu2 = await menu.filter((info) => info.depth1Code === DEFAULT_CONSTANTS.gnbMenuReviewPassCode);
        if ( tmpmenu.length > 0  ) {
            if ( tmpmenu[0].depth2List.length > 0 ) {
                //console.log("tmpmenu[0].depth2List", tmpmenu[0].depth2List);
                returnArray = tmpmenu[0].depth2List;
            }
        }else if ( tmpmenu2.length > 0  ) {
            if ( tmpmenu2[0].depth2List.length > 0 ) {
                //console.log("tmpmenu[0].depth2List", tmpmenu[0].depth2List);
                returnArray = tmpmenu2[0].depth2List;
            }

        }
        return returnArray;
        
    }

    upButtonHandler = async() => {
        try {
            this.ScrollView.scrollTo({ x: 0,  animated: true });
        }catch(e){

        }
    }

    scrollToRemote = (params) => {
        try {
            this.ScrollView.scrollTo(params)
        } catch(e) {
            console.log('Review/IntroScreen.js > scrollTo()', 'err = ' + e)
        }
    }

    refreshGetBroadcast = async() => {

        if ( typeof this.props.myInterestCodeOne.info !== 'undefined' ) {
            await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/review/broadcast/' +  this.props.myInterestCodeOne.info.interestFieldID,{
                method: 'GET', 
                headers: new Headers({
                    Accept: 'application/json',                
                    'Content-Type': 'application/json; charset=UTF-8',
                    'apiKey': DEFAULT_CONSTANTS.apiAdminKey
                }), 
                    body:null
                },10000
                ).then(response => {
                    console.log('response',response)
                    if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                        if ( response.code === '0000' ) {                        
                            this.setState({                            
                                broadcastItems : response.data.broadcastList,
                            })
                        }

                    }
                })
                .catch(err => {                
                }
            );
        }

    }

    refreshTextBookInfo = async(page,limitCnt,level03 = [], teacher = []) => {        
        //console.log('revie page', page)
        let limitCnt2 = limitCnt > 0 ? limitCnt : 10;        
        let reviewMode = this.state.selectMenuTabs === '005' ? 'course' : 'pass';
        // let apiTestDomain = this.state.selectMenuTabs === '005' ? DEFAULT_CONSTANTS.apiTestDomain : DEFAULT_CONSTANTS.apiTestDomain2;
        let isMine = this.state.isonlyMyview ? this.state.formMemberIdx : '';
        let addParams = "";
        if ( this.state.selectMenuTabs === '005' ) {
            if ( typeof this.props.reviewSelectDataCourse !== 'undefined' && this.props.reviewSelectDataCourse.length > 0 ) {
                addParams = "&level03cd="+encodeURIComponent(level03)+'&teacherIdx='+encodeURIComponent(teacher)+"";

                /*
                if(teacher.length > 0) {
                    teacher.map(function(value, index) {
                        addParams += '&teacherIdx[' + index + ']='+encodeURIComponent(value);
                    })
                }

                if(level03.length > 0) {
                    level03.map(function(value, index) {
                        addParams += '&level03cd[' + index + ']='+encodeURIComponent(value);
                    })
                }
                */
            }
        }else{
            if ( typeof this.props.reviewSelectDataPass !== 'undefined' && this.props.reviewSelectDataPass.length > 0 ) {
                //addParams = "&level03cd="+encodeURIComponent(level03)+'&teacherIdx='+encodeURIComponent(teacher)+"";

                if(level03.length > 0) {
                    level03.map(function (value, index) {
                        addParams += "&categoryName[" + index + "]=" + encodeURIComponent(value);
                    });
                }
            }
        }

        let aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        let aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey;

        //console.log('/Review/IntroScreen.js > refreshTextBookInfo()', 'url = ' + aPIsDomain + '/v1/review/'+reviewMode+'?page='+page+'&' + 'paginate=' + limitCnt2 + '&memberIdx=' + isMine + addParams)

        await CommonUtil.callAPI( aPIsDomain + '/v1/review/'+reviewMode+'?page='+page+'&' + 'paginate=' + limitCnt2 + '&memberIdx=' + isMine + addParams,{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': aPIsAuthKey
            }), 
                body:null
            },10000
            ).then(response => {
                //console.log('/Review/IntroScreen.js > refreshTextBookInfo()', 'response = ' + JSON.stringify(response));
                if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                    if ( response.code !== '0000' ) {
                        this.setState({loading:false,refreshing : false,})    
                        this.failCallAPi()
                    }else{                        
                        if ( typeof response.data.reviewList !== 'undefined') {
                            this.setState({
                                loading : false,
                                refreshing : false,
                                ismore : response.data.current_page < response.data.last_page ? true : false,
                                currentpage : response.data.current_page,
                                reviewItems : response.data.reviewList
                            })
                        }else{
                            if ( typeof response.data.current_page !== 'undefined') {
                                this.setState({
                                    loading:false,
                                    refreshing : false,
                                    ismore : response.data.current_page < response.data.last_page ? true : false,
                                    currentpage : response.data.current_page,
                                    reviewItems : []
                                })
                            }else{
                                this.setState({loading:false,refreshing : false,})
                            }
                        }
                    }

                }else{
                    this.failCallAPi()
                }
                this.setState({loading:false})    
            })
            .catch(err => {
                console.log('1login error => ', err);
                this.setState({loading:false,refreshing : false,})    
                this.failCallAPi()
        });
    }

    refreshTextBookInfoMore = async(page,limitCnt,level03 = [], teacher = []) => {
        
        let limitCnt2 = limitCnt > 0 ? limitCnt : 10;        
        let reviewMode = this.state.selectMenuTabs === '005' ? 'course' : 'pass';
        let apiTestDomain = this.state.selectMenuTabs === '005' ? DEFAULT_CONSTANTS.apiTestDomain : DEFAULT_CONSTANTS.apiTestDomain2;
        let selectedFilterCodeList = this.state.reviewItems;          
        let isMine = this.state.isonlyMyview ? this.state.formMemberIdx : '';
        let addParams = "";
        if ( this.state.selectMenuTabs === '005' ) {
            if ( typeof this.props.reviewSelectDataCourse !== 'undefined' && this.props.reviewSelectDataCourse.length > 0 ) {
                addParams = "&level03cd="+encodeURIComponent(level03)+'&teacherIdx='+encodeURIComponent(teacher)+"";

                /*
                if(teacher.length > 0) {
                    teacher.map(function(value, index) {
                        addParams += '&teacherIdx[' + index + ']='+encodeURIComponent(value);
                    })
                }

                if(level03.length > 0) {
                    level03.map(function(value, index) {
                        addParams += '&level03cd[' + index + ']='+encodeURIComponent(value);
                    })
                }
                */
            }
        }else{
            if ( typeof this.props.reviewSelectDataPass !== 'undefined' && this.props.reviewSelectDataPass.length > 0 ) {
                //addParams = "&level03cd="+encodeURIComponent(level03)+'&teacherIdx='+encodeURIComponent(teacher)+"";

                if(level03.length > 0) {
                    level03.map(function (value, index) {
                        addParams += "&categoryName[" + index + "]=" + encodeURIComponent(value);
                    });
                }
            }
        }

        
        let aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        let aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey;

        // console.log('/Review/IntroScreen.js > refreshTextBookInfoMore()', 'url = ' + aPIsDomain + '/v1/review/'+reviewMode+'?page='+page+'&' + 'paginate=' + limitCnt2 + '&memberIdx=' + isMine + addParams)

        await CommonUtil.callAPI( aPIsDomain + '/v1/review/'+reviewMode+'?page='+page+'&' + 'paginate=' + limitCnt2 + '&memberIdx=' + isMine + addParams,{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': aPIsAuthKey
            }), 
                body:null
            },10000
            ).then(response => {
                // console.log('/Review/IntroScreen.js > refreshTextBookInfoMore()', 'response = ' + JSON.stringify(response))
                if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                    if ( response.code !== '0000' ) {
                        this.failCallAPi()
                    }else{
                        
                        if ( typeof  response.data.reviewList !== 'undefined' ) {
                            response.data.reviewList.forEach(function(element,index,array){                                
                                selectedFilterCodeList.push(element);
                            });                            
                            this.setState({
                                moreLoading : false,
                                ismore : response.data.current_page < response.data.last_page ? true : false,
                                reviewItems : selectedFilterCodeList,
                                currentpage : response.data.current_page
                            })
                        }
                    }

                }else{
                    this.setState({moreLoading:false})    
                    this.failCallAPi();
                }
                this.setState({moreLoading:false})    
            })
            .catch(err => {
                console.log('2login error => ', err);
                this.setState({moreLoading:false})    
                this.failCallAPi()
        });
        
        this.setState({moreLoading:false})    
       
    }

    failCallAPi = () => {
     
        let message = "데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);

    }


    goWriteForm = async() => {
        let route = 'LectureWriteForm';
        if ( this.state.selectMenuTabs === '005'  ) {
            route = 'LectureWriteForm';
        }else{
            route = 'PassWriteForm';
        }
        console.log('this.props.userToken',this.props.userToken);
        console.log('this.state.formMemberIdx',this.state.formMemberIdx)
        if ( this.props.userToken !== null && this.state.formMemberIdx > 0 ) {
            await this.setState({isVisibleOveray:false});            
            this.props.screennavigation1.navigate(route,{
                memberIdx : this.state.formMemberIdx
            })
        } else {
            Alert.alert('', '로그인이 필요합니다.\n로그인 하시겠습니까?',
            [
                {text: '확인', onPress: () => {
                    this.setState({isVisibleOveray:false})
                    this.props.screennavigation1.navigate('SignInScreen', {goScreen: route});
                    }
                },                
                {text: '취소', onPress: () => this.setState({isVisibleOveray:false})},
            ]);
        }
        
       
        
    }

    handleOnScroll (event) {     

        this.props._updateStatusNowScrollY(event.nativeEvent.contentOffset.y);     
        this.props.screenProps.resizeTopHeader(event.nativeEvent.contentOffset.y)
        if ( event.nativeEvent.contentOffset.y >= 200 ) {
            //this.props.screenProps.resizeTopHeader(DEFAULT_CONSTANTS.hideTopHeight);
            //this.props._updateStatusNowScroll(false);       
            this.setState({showTopButton : true}) 
        }else{
            //this.props.screenProps.resizeTopHeader(DEFAULT_CONSTANTS.topHeight);
            //this.props._updateStatusNowScroll(true);         
            this.setState({showTopButton : false}) 
        }

        let paddingToBottom = 1;
        paddingToBottom += event.nativeEvent.layoutMeasurement.height;                            
        if (event.nativeEvent.contentOffset.y + paddingToBottom >= event.nativeEvent.contentSize.height) {            
            this.scrollEndReach();
        }
    }

    scrollEndReach = async() => {
        if ( this.state.moreLoading === false && this.state.ismore) {       
            let returnData = await this.devideFilter();
            this.setState({moreLoading : true})
            setTimeout(
                () => {
                    this.refreshTextBookInfoMore(parseInt(this.state.currentpage)+parseInt(1),pageViewLimit,returnData[0],returnData[1])
            },500)
            
        }
    }

    devideFilter = async() => {
        let selectedFilterCodeList = [];
        let selectedFilterCodeList2 = [];
        let selectedFilterCodeList3 = [];
        let selectedFilterCodeList4 = [];
        let selectedFilterCodeList5= [];
        let selectedFilterCodeList6 = [];
        if ( this.state.selectMenuTabs === '005' ) {
            if ( typeof this.props.reviewSelectDataCourse !== 'undefined' && this.props.reviewSelectDataCourse.length > 0 ) {
                let tmplevel03 = this.props.reviewSelectDataCourse.filter((info) => info.type === 'level03');
                await tmplevel03.forEach(function(element,index,array){            
                    selectedFilterCodeList.push(element.code);
                });    
                
                let tmpteacher = this.props.reviewSelectDataCourse.filter((info) => info.type === 'teacher');
                await tmpteacher.forEach(function(element,index,array){            
                    selectedFilterCodeList2.push(element.code);
                });    
            }
            return [selectedFilterCodeList,selectedFilterCodeList2] ;
        }else{

            if ( typeof this.props.reviewSelectDataPass !== 'undefined' && this.props.reviewSelectDataPass.length > 0 ) {
                let tmplevel03 = this.props.reviewSelectDataPass.filter((info) => info.category === 1);
                await tmplevel03.forEach(function(element,index,array){            
                    selectedFilterCodeList.push(element.code);
                });    
            }
            return [selectedFilterCodeList,selectedFilterCodeList2] ;
        }        
    }

    _closeModal = async(mode) => {
        if ( mode ) { // 검색필터            
            let returnData = await this.devideFilter();
            this.setState({refreshing:true})
            this.refreshTextBookInfo(1,pageViewLimit, returnData[0],returnData[1])
        }
        this.setState({ showModal: false })
        
    };
    _showModal = async() => {                
        this.setState({ showModal: true })
        
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.9);

    _onRefresh = async() => {
        this.setState({
            refreshing: true,
            reviewItems : []
        });
        let returnData = await this.devideFilter();             
        this.refreshTextBookInfo(1,pageViewLimit, returnData[0],returnData[1]);
        await this.refreshGetBroadcast();
        //this.refreshTextBookInfo(1,pageViewLimit)
        setTimeout(
            () => {
                this.setState({ refreshing: false});
            },500)
    }

    checkMyContent = async(bool) => {

        if(this.props.userToken !== null) {
            if ( bool ) {
                await this.setState({isonlyMyview:false})
                await this._onRefresh()
                this.setState({isVisibleOveray : false})
            }else {
                await this.setState({isonlyMyview:true})
                await this._onRefresh()
                this.setState({isVisibleOveray : false})
            }
        } else {
            let route = 'LectureWriteForm';
            if ( this.state.selectMenuTabs === '005'  ) {
                route = 'LectureWriteForm';
            }else{
                route = 'PassWriteForm';
            }
            Alert.alert('', '로그인이 필요합니다.\n로그인 하시겠습니까?',
                [
                    {text: '확인', onPress: () => {
                            this.setState({isVisibleOveray:false})
                            this.props.screennavigation1.navigate('SignInScreen');
                        }
                    },
                    {text: '취소', onPress: () => function(){}},
                ]);
        }
    }
    changeTabs = async(tabs) => {
        await this.setState({selectMenuTabs:tabs})
        let returnData = await this.devideFilter();   
        this.refreshTextBookInfo(1,pageViewLimit, returnData[0],returnData[1])
    }

    // 후기 동영상 배너 동영상 열기
    openBroadcast = async item => {
        await Linking.openURL(item.linkUrl);
        // TODO:: 동영상 오픈 후 조회수 업데이트 가능한지 체크
        this.updateBroadcastViewCnt(item.articleIdx);
    };

    // 후기 동영상 배너 조회수 업데이트
    updateBroadcastViewCnt = async idx => {
        const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/review/broadcast/' + idx;
        const options = {
            method: 'PUT'
        };
        await CommonUtil.callAPI(url, options, 10000)
            .then(response => {
            })
            .catch(error => {
            });
    };

    /*
    onLayoutHeader = (evt ) => {
        
        console.log('height',evt.nativeEvent.layout);        
        this.setState({
            //mainImgHeight : evt.nativeEvent.layout.height,
            //mainImgWidth : evt.nativeEvent.layout.width
        });
    }
    */

    setupClearFilter = async() => {
        let sendData = [];
        this.props._updatereviewSelectDataCourse(sendData);
        await this._onRefresh();
        this.setState({
            selectedFilterCodeList : [],
            loading : false
        })

    }

    setupClearPassFilter = async() => {
        let sendData = []
        this.props._updatereviewSelectDataPass(sendData);
        await this._onRefresh();
        await this.setState({
            selectedFilterCodeList : []
        })
    }

    render() {
        
        if (this.state.loading) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        } else {
            if (this.state.subGnbMenu.length > 0 ) {
                return (
                    <View style={styles.container}>
                        <NavigationEvents
                            onWillFocus={payload => {
                                //console.log('review nWillFocus', payload);
                                //this._onRefresh()
                                if ( this.props.userToken !== null ) {            
                                    this.setState({formMemberIdx : this.props.userToken.memberIdx})
                                }
                            }}
                            onDidFocus={payload => {                            
                                //console.log('review did focus');                            
                                }
                            }
                            onWillBlur={payload => {
                                //console.log('review will blur')                            
                                }
                            }
                            onDidBlur={payload => 
                                {
                                //console.log('review did blur');
                                }
                            }
                        />
                        { this.state.showTopButton &&
                            <TouchableOpacity 
                                style={styles.fixedUpButton}
                                onPress={e => this.upButtonHandler()}
                            >
                                <Icon name="up" size={30} color="#000" />
                            </TouchableOpacity>
                        }
                        { this.state.isVisibleOveray === false &&
                            <View style={styles.fixedWriteButton}>
                                <TouchableOpacity onPress={e => this.setState({isVisibleOveray : true})}>
                                    <Image 
                                        source={require('../../../assets/icons/btn_floating_write.png')} resizeMode='contain' 
                                        style={{width:PixelRatio.roundToNearestPixel(66),height:PixelRatio.roundToNearestPixel(66)}}
                                    />
                                </TouchableOpacity>
                            </View>
                        }

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
                                        <View style={{flex:1,alignItems:'flex-end',justifyContent:'flex-end'}}>
                                            <TouchableOpacity                                     
                                                onPress={e => this.goWriteForm()}
                                                style={{flexDirection:'row',flexGrow:1,justifyContent:'center'}}
                                            >
                                                <View style={{justifyContent:'center'}}>
                                                    <CustomTextR style={{color:DEFAULT_COLOR.base_color_fff,letterSpacing:-0.7,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),paddingRight:10}}>
                                                        {this.state.selectMenuTabs === '005' ? '수강후기 ' : '합격수기 '}작성하기
                                                    </CustomTextR>
                                                </View>
                                                <View style={{backgroundColor:DEFAULT_COLOR.lecture_base,width:50,height:50,borderRadius:25,alignItems:'center',justifyContent:'center'}}>
                                                    <Image 
                                                        source={require('../../../assets/icons/btn_floating_open_write.png')} resizeMode='contain' 
                                                        style={{width:PixelRatio.roundToNearestPixel(55),height:PixelRatio.roundToNearestPixel(55)}}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                            {
                                            <TouchableOpacity                                     
                                                onPress={e => this.checkMyContent(this.state.isonlyMyview)}
                                                style={{flexDirection:'row',flexGrow:1,justifyContent:'center',paddingTop:IconsPaddingTop}}
                                            >
                                                <View style={{justifyContent:'center'}}>
                                                    <CustomTextR style={{color:DEFAULT_COLOR.base_color_fff,letterSpacing:-0.7,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),paddingRight:10}}>
                                                        { this.props.userToken !== null
                                                            ? (
                                                                this.state.isonlyMyview
                                                                    ? '전체 보기': (
                                                                        this.state.selectMenuTabs === '005'
                                                                            ? '내 후기 확인하기'
                                                                            : '내 수기 확인하기'
                                                                    )
                                                                )
                                                            : (
                                                                this.state.selectMenuTabs === '005'
                                                                    ? '내 후기 확인하기'
                                                                    : '내 수기 확인하기'
                                                            )
                                                        }
                                                    </CustomTextR>
                                                </View>
                                                <View style={{backgroundColor:DEFAULT_COLOR.base_color_fff,width:50,height:50,borderRadius:25,alignItems:'center',justifyContent:'center'}}>
                                                    <Image 
                                                        source={require('../../../assets/icons/btn_floating_open_mycomment.png')} resizeMode='contain' 
                                                        style={{width:PixelRatio.roundToNearestPixel(55),height:PixelRatio.roundToNearestPixel(55)}}
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
                                                        style={{width:PixelRatio.roundToNearestPixel(55),height:PixelRatio.roundToNearestPixel(55)}}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                            
                                        </View>
                                    </View>
                                    
                                </Overlay>
                            </View>
                        }
                        {/* 여기서부터 검색필터 영역 */}
                        <Modal
                            onBackdropPress={this.closeModal}
                            animationType="slide"
                            //transparent={true}
                            onRequestClose={() => {
                                this.setState({showModal:false})
                            }}
                            onBackdropPress={() => {
                                this.setState({showModal:false})
                            }}
                            style={{justifyContent: 'flex-end',margin: 0}}
                            useNativeDriver={true}
                            animationInTiming={300}
                            animationOutTiming={300}
                            hideModalContentWhileAnimating                    
                            isVisible={this.state.showModal}
                        >
                            
                            <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight }]}>
                                { 
                                    this.state.selectMenuTabs === '005'
                                    ?
                                    <SearchFilter screenState={this.state} screenProps={this.props} />
                                    :
                                    <SearchFilterPass screenState={this.state} screenProps={this.props} />
                                }
                            </Animated.View>
                            
                        </Modal>
                        
                        <ScrollView
                            ref={(ref) => {
                                this.ScrollView = ref;
                            }}
                            indicatorStyle={'white'}
                            scrollEventThrottle={16}
                            keyboardDismissMode={'on-drag'}
                            onScroll={e => this.handleOnScroll(e)}
                            onMomentumScrollEnd = {({nativeEvent}) => { 
                                //this.loadMoreData (nativeEvent) 
                            }}
                            onScrollEndDrag ={({nativeEvent}) => { 
                                //this.loadMoreData (nativeEvent) 
                            }}
                            refreshControl={
                                <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh}
                                />
                            }
                        >                            
                            <View style={styles.contentDataHeader}>
                               
                                {
                                    this.state.subGnbMenu.map((tab,tindex) => {
                                        if ( tindex > 0 ) {
                                            return (        
                                                <TouchableOpacity
                                                    key={tindex}
                                                    style={styles.contentDataHeaderLeftRight}
                                                    onPress={() => this.changeTabs(tab.depth2Code)}
                                                >                        
                                                    <CustomTextR style={this.state.selectMenuTabs ===  tab.depth2Code ? styles.contentReviewSelectText : styles.contentReviewunSelectText} >
                                                        {tab.depth2Name}
                                                    </CustomTextR>
                                                </TouchableOpacity> 
                                               
                                            )
                                        }else{
                                            return (                                  
                                                <TouchableOpacity 
                                                    key={tindex} 
                                                    style={styles.contentDataHeaderLeftRight}
                                                    onPress={() => this.changeTabs(tab.depth2Code)}
                                                >  
                                                                        
                                                    <CustomTextR style={this.state.selectMenuTabs ===  tab.depth2Code ? styles.contentReviewSelectText : styles.contentReviewunSelectText} >
                                                        {tab.depth2Name}
                                                    </CustomTextR>
                                                </TouchableOpacity> 
                                               
                                            )

                                        }
                                        
                                    })
                                }
                                {/*
                                <TouchableOpacity 
                                    style={styles.contentDataHeaderLeftRight}
                                    onPress={() => this.changeTabs(1)}
                                >                        
                                    <Text style={this.state.selectMenuTabs === 1 ? styles.contentReviewSelectText : styles.contentReviewunSelectText} >
                                        수강후기
                                    </Text>
                                </TouchableOpacity>                        
                                <View style={styles.contentDataHeaderCenter}>
                                    <Text style={styles.contentDataHeaderCenterText}>|</Text>
                                </View>
                                <TouchableOpacity 
                                    style={styles.contentDataHeaderLeftRight}
                                    onPress={() => this.changeTabs(2)}
                                >
                                    <Text style={this.state.selectMenuTabs === 2 ? styles.contentReviewSelectText : styles.contentReviewunSelectText} >
                                        합격수기
                                    </Text>
                                </TouchableOpacity>
                                */}
                            </View>
                            <View style={{flex:1,paddingBottom:5,borderBottomWidth:1,borderColor:DEFAULT_COLOR.input_border_color}}>
                                <ScrollView  horizontal={true}>
                                { this.state.broadcastItems.map((item, index) => {
                                    return(
                                        <TouchableOpacity 
                                            key={index}
                                            style={styles.itemBannerContainer} 
                                            onPress={()=> this.openBroadcast(item)}
                                        >
                                            { 
                                            typeof item.thumbUrl !== 'undefined' && item.thumbUrl !== null ?
                                            <ImageBackground style={ styles.imgBannerBackground } resizeMode='contain' source={{uri:item.thumbUrl}} />
                                            :
                                            <ImageBackground style={ styles.imgBannerBackground } resizeMode='contain' source={{uri:defaultThumbUrl}} />
                                            }
                                        </TouchableOpacity>
                                    )
                                })}
                                </ScrollView>
                            </View>

                            <View style={styles.filterWrapper}>                    
                                <View style={styles.filterWakuWrapper} >
                                    <View style={[
                                        styles.filterWakuWrapperLeft,
                                        {
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            paddingTop: 0,
                                            paddingHorizontal: 5,
                                        }
                                    ]}>
                                        <ScrollView         
                                            style={{
                                                paddingVertical: 10,
                                                marginRight: 5,
                                            }}
                                            horizontal={true}>
                                                { 
                                                this.state.selectMenuTabs === '005' 
                                                ?
                                                    typeof this.props.reviewSelectDataCourse !== 'undefined' && this.props.reviewSelectDataCourse.length > 0
                                                    ?
                                                    this.props.reviewSelectDataCourse.map((fdata,index3) => {
                                                        return (
                                                            <CustomTextR style={{
                                                                    color: DEFAULT_COLOR.lecture_base,
                                                                        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),
                                                                        lineHeight: PixelRatio.roundToNearestPixel(7.1),
                                                                        letterSpacing: -0.65,
                                                                        paddingRight: this.props.reviewSelectDataCourse.length - 1 == index3 ? 5 : 20
                                                                }} key={index3}>
                                                                    {fdata.name}
                                                            </CustomTextR>
                                                        )
                                                    })
                                                    :
                                                    <CustomTextR style={{color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:5}}>전체항목</CustomTextR>
                                                :
                                                    typeof this.props.reviewSelectDataPass !== 'undefined' && this.props.reviewSelectDataPass.length > 0
                                                    ?
                                                    this.props.reviewSelectDataPass.map((fdata,index3) => {
                                                        return (
                                                            <Text style={[styles.filterWakuWrapperLeftText,{marginRight:10}]} key={index3}>
                                                                {fdata.name}
                                                            </Text>
                                                        )
                                                    })
                                                    :
                                                    <CustomTextR style={{color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:5}}>전체항목</CustomTextR>
                                                }
                                        </ScrollView>
                                        {
                                            (
                                                this.state.selectMenuTabs === '005'
                                                && typeof this.props.reviewSelectDataCourse !== 'undefined'
                                                && this.props.reviewSelectDataCourse.length > 0
                                            ) &&
                                            <TouchableOpacity
                                                style={{
                                                    justifyContent: 'center',
                                                }}
                                                onPress={() => this.setupClearFilter()}
                                            >
                                                <Image
                                                    style={{width: 25, height: 25,}}
                                                    source={require('../../../assets/icons/btn_del_keyword_all.png')}/>
                                            </TouchableOpacity>
                                        }
                                        {
                                            (
                                                this.state.selectMenuTabs !== '005'
                                                && typeof this.props.reviewSelectDataPass !== 'undefined'
                                                && this.props.reviewSelectDataPass.length > 0
                                            ) &&
                                            <TouchableOpacity
                                                style={{
                                                    justifyContent: 'center',
                                                }}
                                                onPress={() => this.setupClearPassFilter()}
                                            >
                                                <Image
                                                    style={{width: 25, height: 25,}}
                                                    source={require('../../../assets/icons/btn_del_keyword_all.png')}/>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                    <View style={styles.filterWakuWrapperRight}>
                                        <TouchableOpacity 
                                            style={{paddingVertical:5,paddingHorizontal:10,alignContent:'center',justifyContent:'center',borderWidth:1,borderColor:DEFAULT_COLOR.base_color_ccc,borderRadius:5}}
                                            onPress={()=>this._showModal()}
                                        >
                                            <CustomTextR style={{color:DEFAULT_COLOR.base_color_444,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:-1.5}}>필터</CustomTextR>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <View style={{flex:1,marginTop:10,width:SCREEN_WIDTH}}>   
                                {
                                    this.state.selectMenuTabs === '005' ?
                                    <LectureReview screenState={this.state} screenProps={this.props} />
                                    :
                                    <PassReview screenState={this.state} screenProps={this.props}/>
                                }
                                { this.state.moreLoading &&
                                    <View style={{flex:1,paddingVertical:10,alignItems:'center',justifyContent:'center'}}>
                                        <ActivityIndicator size="large" />
                                    </View>
                                }
                            </View>
                        </ScrollView>
                    </View>
                );
            }else{
                return (
                    <View style={styles.IndicatorContainer}>
                        <ActivityIndicator size="large" />
                        <CustomTextR style={{color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:5}}>준비중입니다</CustomTextR>
                    </View>
                )
            }
        }
    }
}


function mapStateToProps(state) {
    return {
        selectBook: state.GlabalStatus.selectBook,    
        topFavoriteMenu: state.GlabalStatus.topFavoriteMenu,   
        showBottomBar: state.GlabalStatus.showBottomBar,
        textBookFocusHeight : state.GlabalStatus.textBookFocusHeight,
        myTopFilter : state.GlabalStatus.myTopFilter,
        reviewSelectDataCourse : state.GlabalStatus.reviewSelectDataCourse,
        reviewFilterDataCourse : state.GlabalStatus.reviewFilterDataCourse,
        reviewSelectDataPass : state.GlabalStatus.reviewSelectDataPass,
        reviewFilterDataPass : state.GlabalStatus.reviewFilterDataPass,
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,
        userToken: state.GlabalStatus.userToken,
        globalGnbMenu: state.GlabalStatus.globalGnbMenu,
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
        _updatereviewSelectDataCourse:(object) => {
            dispatch(ActionCreator.updatereviewSelectDataCourse(object));
        },
        _updatereviewSelectDataPass:(object) => {
            dispatch(ActionCreator.updatereviewSelectDataPass(object));
        }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(IntroScreen);