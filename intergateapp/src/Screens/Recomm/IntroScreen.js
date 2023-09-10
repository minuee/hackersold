import React from 'react';
import { 
    Text, Image, View, StyleSheet, ScrollView,TouchableOpacity,ActivityIndicator,RefreshControl,PixelRatio,
    Platform,Animated,Dimensions,ImageBackground,Alert
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Modal from 'react-native-modal';

import MarqueeVertical from './MarqueeVertical'
import SlideBanner from './SlideBanner';
import SlideBanner2 from './SlideBanner2';
//import LectureListScreen from './LectureListScreen';

import FooterScreen from '../../Components/FooterScreen';
import SearchFilter from './SearchFilter';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import styles from '../../Style/Recomm/LectureListScreen';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomText, CustomTextR, CustomTextB, CustomTextL, CustomTextM, CustomTextDL, TextRobotoM, TextRobotoR} from '../../Style/CustomText';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const pageViewLimit = 10;

class IntroScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {      
            loading : true,
            moreLoading : false,
            currentpage : 1,
            ismore : false,   
            refreshing : false,
            showTopButton : false,
            thisFocus : this.props.screenState.nowFocus,
            focusTab : this.props.screenState.focusTab,
            beforeFocusTab: this.props.screenState.beforeFocusTab,
            selectItem : 0,
            showItem : 2,
            items : [],
            selectedFilterCodeList : [],
            bannerList : [],
            examList : [],
            _closeModal  : this._closeModal.bind(this),
            _showModal  : this._showModal.bind(this),
            refreshTextBookInfo : this.refreshTextBookInfo.bind(this)
            
        };
    } 

    async UNSAFE_componentWillMount() {        
        setTimeout(() => { 
            this.refreshTextBookInfo(1);    
            if ( typeof this.props.myInterestCodeOne.info !== 'undefined' ) {
                if ( typeof this.props.myInterestCodeOne.info.interestFieldID !== 'undefined' ) {
                    this.refreshGetBroadcast()
                }
            }
         }, 200)
     

    }    

    componentDidMount() {
    }

    UNSAFE_componentWillUnmount() {
        
    }  

    UNSAFE_componentWillReceiveProps(nextProps) {
        if ( nextProps.screenState.focusTab !== this.state.focusTab ) {
            //console.log('xxxxxxx',nextProps.screenState.focusTab)
            //console.log('xxxxxxx22',this.state.focusTab)
            //this.setState({ loading : true });
            //this.refresh_end();    
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        //console.log('focusTab',this.props.screenState.focusTab );
        //console.log('this.state.beforeFocusTab ',this.props.screenState.beforeFocusTab );
        if ( nextProps.myInterestCodeOne.code !== this.props.myInterestCodeOne.code) {
            this.didChangeInterest();
        }
        return true;
    }

    componentDidUpdate(prevProps, prevState) {
    }

    didChangeInterest = async () => {
        await this.setupClearFilter();
        this._onRefresh();
    };

    refreshGetBroadcast = async() => {
        await this.setState({
            bannerList : [],
            examList : [],
        });
        if ( typeof this.props.myInterestCodeOne.info !== 'undefined' ) {
            await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/lecture/set/' +  this.props.myInterestCodeOne.info.interestFieldID,{
                method: 'GET', 
                headers: new Headers({
                    Accept: 'application/json',                
                    'Content-Type': 'application/json; charset=UTF-8',
                    'apiKey': DEFAULT_CONSTANTS.apiAdminKey
                }), 
                    body:null
                },10000
                ).then(response => {
                    //console.log('response.data.banners.lectureTop',response.data.banners.lectureTop)
                    if (response && typeof response === 'object' || Array.isArray(response) === false) {
                        if ( response.code === '0000' ) {
                            let bannerList = [];
                            if (response.data.banners && response.data.banners.lectureTop) {
                                const arrBanners = [...response.data.banners.lectureTop];
                                console.log('arrBanners : ', arrBanners);
                                bannerList = arrBanners.filter(item => {
                                    const arrOSType = item.osType.toUpperCase().split(',');
                                    console.log('arrOSType : ', arrOSType);
                                    return arrOSType.indexOf(Platform.OS.toUpperCase()) > -1
                                });
                            }
                            console.log('bannerList : ', bannerList);
                            this.setState({
                                bannerList: bannerList, //typeof response.data.banners.lectureTop !== 'undefined' ? response.data.banners.lectureTop : [],
                                examList: typeof response.data.exams !== 'undefined' ? response.data.exams : []
                            })
                        }

                    }
                })
                .catch(err => {
                    
            });
        }
        
    }
   
    refresh_end = () => {
      setTimeout(() => { 
         this.setState({
            loading : false,
            imgHeight : 45,
            imgWidth : 45  
         });      
      }, 100)
    }

    
 
    handleOnScroll (event) {     
        
        this.props._updateStatusNowScrollY(event.nativeEvent.contentOffset.y);     
        this.props.screenProps.resizeTopHeader(event.nativeEvent.contentOffset.y)
        
        if ( event.nativeEvent.contentOffset.y >= 200 ) {
            this.setState({showTopButton : true}) 
        }else{
            this.setState({showTopButton : false}) 
         }

        let paddingToBottom = 1;
        paddingToBottom += event.nativeEvent.layoutMeasurement.height;                            
        if (event.nativeEvent.contentOffset.y + paddingToBottom >= event.nativeEvent.contentSize.height) {            
            this.scrollEndReach();
        }
    }

    scrollEndReach = () => {
        if ( this.state.moreLoading === false && this.state.ismore) {
            //console.log('last end point', this.state.currentpage)    
            this.setState({moreLoading : true})   
            setTimeout(
                () => {
                    //this.refreshTextBookInfoMore(parseInt(this.state.currentpage)+parseInt(1))
                    this.refreshTextBookInfo(parseInt(this.state.currentpage)+parseInt(1))
                },500
            )
            
        }
    }


    loadMoreData = (code) => {
        //console.log("code", code);
        //console.log("code contentOffset", code.contentOffset);
    }
   
    upButtonHandler = () => {        
        this.ScrollView.scrollTo({ x: 0,  animated: true });
    };

    _onRefresh = async () => {
        await this.setState({
            refreshing: true,
            items : [],
            // selectedFilterCodeList : [],
            bannerList : [],
            examList : [],
        });
        // let sendData2 = [];
        // await this.props._updaterecommSelectData(sendData2);
        // await this.props._updaterecommFilterData(sendData2);
        await this.refreshTextBookInfo(1);
        await this.refreshGetBroadcast();
        setTimeout(
            () => {
                this.setState({ refreshing: false});
        },500)
    }

    refreshTextBookInfo = async(page) => {
        let checkArray1 = [];
        let checkArray2 = [];
        let checkArray3 = [];
        let checkArray4 = [];
        if ( typeof this.props.recommSelectData !== 'undefined' && this.props.recommSelectData.length > 0 ) {
            //console.log('dddd',this.props.recommSelectData)
            let groupedType = await CommonFuncion.groupBy(this.props.recommSelectData, 'type');
            
            if ( typeof groupedType[1] !== 'undefined' ) {
                groupedType[1].map((data1) => {
                    return checkArray1.push(data1.code)
                })
            }

            if ( typeof groupedType[2] !== 'undefined' ) {
                groupedType[2].map((data2) => {
                    return checkArray2.push(data2.code)
                })
            }

            if ( typeof groupedType[3] !== 'undefined' ) {
                groupedType[3].map((data3) => {
                    return checkArray3.push(data3.code)
                })
            }
            if ( typeof groupedType[4] !== 'undefined' ) {
                groupedType[4].map((data4) => {
                    return checkArray4.push(data4.code)
                })
            }
            /*
            listlevel03: this.props.screenProps.recommFilterData.listlevel03,
            listlevel04: this.props.screenProps.recommFilterData.listlevel04,
            listdifficulty: this.props.screenProps.recommFilterData.listdifficulty,
            listteachers: this.props.screenProps.recommFilterData.listteachers,
            */
        }
        
        const formData = new FormData();
        formData.append('page', page);
        formData.append('paginate', pageViewLimit);
        formData.append('memberIdx', '');  //memberIdx 2020.05.19 준오프로 요청
        formData.append('level03', checkArray1.length > 0 ? JSON.stringify(checkArray1) : '');
        //formData.append('level04', checkArray2.length > 0 ? JSON.stringify(checkArray2) : '');
        formData.append('difficulty', checkArray3.length > 0 ? JSON.stringify(checkArray3) : '');
        formData.append('teacher', checkArray4.length > 0 ? JSON.stringify(checkArray4) : '');
        //console.log('formData22',formData)
        const aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        const aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey;
        let selectedFilterCodeList = this.state.items;
        if ( page === 1 ) {
            selectedFilterCodeList = [];
        }else{
            selectedFilterCodeList = this.state.items;
        }
        
    
        await CommonUtil.callAPI( aPIsDomain  + '/v1/product',{
            method: 'POST', 
            headers: new Headers({
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'apiKey': aPIsAuthKey
            }), 
                body:formData
            },10000
            ).then(response => {
                //console.log('responseresponse', response.data)
                if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                    if ( response.code !== '0000' ) {
                        this.failCallAPi(response.message || '강좌 조회에 실패 했습니다.');
                        this.setState({loading:false,moreLoading : false})
                    }else{

                        this.moreDataUpdate(selectedFilterCodeList,response.data )

                        /*
                        response.data.productList.forEach(function(element,index,array){                                
                            selectedFilterCodeList.push(element);
                        });                           
                        this.setState({
                            loading : false,
                            moreLoading : false,
                            items : selectedFilterCodeList,//response.data.productList,
                            ismore : response.data.current_page < response.data.last_page ? true : false,
                            currentpage : response.data.current_page,
                        })
                        */
                        
                    }

                }else{
                    this.failCallAPi('강좌 조회에 실패 했습니다.')
                    this.setState({loading:false,moreLoading : false})    
                }
                this.setState({loading:false,moreLoading : false})    
            })
            .catch(err => {
                console.log('login error => ', err);
                this.failCallAPi()
                this.setState({loading:false,moreLoading : false})    
        });
    }

    moreDataUpdate = async( baseData , addData) => {        
        await addData.productList.forEach(function(element,index,array){                                
            baseData.push(element);
        });    
        this.setState({
            loading : false,
            moreLoading : false,
            items : baseData,
            ismore : addData.current_page < addData.last_page ? true : false,
            currentpage : addData.current_page,
        })
    }

    failCallAPi = msg => {
        let message = msg || "데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);

    }

    goDetail = async(classIdx,idx) => {
        //console.log('idx',idx);
        this.props.screennavigation1.navigate('LectureDetailScreen',{
            lectureIdx : classIdx,// 11835, 7277, 6340, 15055,
            lecturList : this.state.items,
            lectureSeq :  idx
        });
    }

    _closeModal = () => {
        this.setState({ showModal: false })
        
    };
    _showModal = async() => {                
        this.setState({ showModal: true })
        
    }
    showExam = async(exam) => {
        //console.log('exam : ', exam)

        Alert.alert(
            DEFAULT_CONSTANTS.appName + " : 시험일정안내",
            " " + exam.subject + " 일정 : " + exam.date,
            [                
                {text: '확인', onPress: () => null },
            ],
            { cancelable: false }
        )  
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.9);

    setupClearFilter = async() => {

        let sendData2 = [];
        await this.setState({
            selectedFilterCodeList : []
        });
        //this.props._updatemyTopFilter(sendData);
        this.props._updaterecommFilterData(sendData2);
        this.props._updaterecommSelectData(sendData2);
        await this._onRefresh()
    }

    render() {
      if ( this.state.loading ) {
         return (
             <View style={styles2.IndicatorContainer}><ActivityIndicator size="large" /></View>
         )
      }else {

        let filterData = this.state.items;
        if ( typeof this.props.recommSelectData !== 'undefined' && this.props.recommSelectData.length > 0 ) {
            /*
            groupedType = CommonFuncion.groupBy(this.props.recommSelectData, 'type');                
            
            if ( typeof groupedType[1] !== 'undefined' ) {                    
                let checkArray1 = [];
                groupedType[1].map((data1) => {
                    return checkArray1.push(data1.code)
                })
                filterData = filterData.filter(
                    fitems => {
                        return fitems.level03.indexOf(checkArray1) > -1 
                    }
                );
            }

            if ( typeof groupedType[2] !== 'undefined' ) {                    
                let checkArray2 = [];
                groupedType[2].map((data2) => {
                    return checkArray2.push(data2.code)
                })
                filterData = filterData.filter(
                    fitems => {
                        return fitems.level04.indexOf(checkArray2) > -1 
                    }
                );
                
            }
            if ( typeof groupedType[3] !== 'undefined' ) {                    
                let checkArray3 = [];
                groupedType[3].map((data3) => {
                    return checkArray3.push(data3.code)
                })
                filterData = filterData.filter(
                    fitems => {
                        return fitems.difficulty.indexOf(checkArray3) > -1 
                    }
                );
                
            }
            if ( typeof groupedType[4] !== 'undefined' ) {                    
                let checkArray4 = [];
                groupedType[4].map((data4) => {
                    return checkArray4.push(data4.code)
                })
                filterData = filterData.filter(
                    fitems => {
                        return fitems.teacherIdx.indexOf(checkArray4) > -1 
                    }
                );
            }
            */
        }

         return (
            <View style={styles2.container}>
                { this.state.showTopButton &&
                    <TouchableOpacity 
                        style={styles2.fixedUpButton}
                        onPress={e => this.upButtonHandler()}
                    >
                        <Icon name="up" size={30} color="#000" />
                    </TouchableOpacity>
                }
                {/* Main Banner */}
                
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
                    style={{width:'100%'}}
                >
                    <View style={styles2.CommonWrapper}>
                        { this.state.bannerList.length > 0 && 
                            <SlideBanner2 screenState={this.state} />
                        }
                    </View>
                    <View style={styles2.CommonWrapper}>
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
                                        horizontal={true}
                                        nestedScrollEnabled={Platform.OS === 'android' ? true : false}
                                        >
                                            { 
                                                typeof this.props.recommSelectData !== 'undefined' && this.props.recommSelectData.length > 0
                                                ?
                                                this.props.recommSelectData.map((fdata,index3) => {
                                                    return (
                                                        <CustomTextR style={{
                                                            color: DEFAULT_COLOR.lecture_base,
                                                            fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),
                                                            lineHeight: PixelRatio.roundToNearestPixel(7.1),
                                                            letterSpacing: -0.65,
                                                            paddingRight: this.props.recommSelectData.length - 1 == index3 ? 5 : 20
                                                        }} key={index3}>
                                                            {fdata.name}
                                                        </CustomTextR>
                                                    )
                                                })
                                                :
                                                <CustomTextR style={{color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:5}}>전체항목</CustomTextR>
                                            }
                                    </ScrollView>

                                    {
                                        (
                                            typeof this.props.recommSelectData !== 'undefined'
                                            && this.props.recommSelectData.length > 0
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

                                </View>

                                <View style={styles.filterWakuWrapperRight}>
                                    <TouchableOpacity 
                                        style={{
                                            padding: 5,                                            
                                            alignContent: 'center',
                                            justifyContent: 'center',
                                            borderWidth: 1,
                                            borderColor: DEFAULT_COLOR.base_color_ccc,
                                            borderRadius: 5
                                        }}
                                        onPress={()=>this._showModal()}
                                    >
                                        <CustomTextR style={{color:DEFAULT_COLOR.base_color_444,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:-1.5}}>필터</CustomTextR>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        {this.state.examList.length > 0 &&
                        <View style={styles.testScheduleWrapper} >                            
                            <MarqueeVertical
                                textList = {
                                    this.state.examList
                                }
                                /*
                                textList = {[
                                    {label : '1',value : '토익시험' + ' D-30'},
                                    {label : '2',value : '토익시험' + ' D-40'},
                                    {label : '3',value : '토익시험 D-60'},
                                    {label : '4',value : '토익시험 D-70'},
                                    {label : '5',value : '토익시험 D-90'},
                                ]}
                                */
                                width = {SCREEN_WIDTH-10}
                                height = {40}
                                separator={5}
                                reverse={true}
                                //duration = {600}
                                delay = {1800}
                                direction = {'up'}
                                numberOfLines = {1}
                                bgContainerStyle = {{width:SCREEN_WIDTH-80,backgroundColor : DEFAULT_COLOR.lecture_base,borderRadius:20}}
                                // viewStyle={{paddingTop:8,alignItems:'center',justifyContent:'center',borderWidth: 1}}
                                viewStyle={{alignItems:'center',justifyContent:'center'}}
                                textStyle = {{fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyMedium,fontSize : PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color : '#fff',letterSpacing:-0.7}}
                                onTextClick = {(titem) => {
                                    this.showExam(titem)//alert(''+JSON.stringify(item));
                                }}
                            />      

                        </View>
                        }
                        <View style={styles.bodyWrapper}>  
                            {                     
                            filterData.length === 0 ?
                            <View style={{height:150,paddingVertical:30,alignItems:'center',justifyContent:'center'}}>
                                <CustomText                                                 
                                    style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14)}}
                                >검색 결과가 없습니다.
                                </CustomText>
                            </View>
                            :
                            filterData.map((data, index) => {   
                                return (
                                    <View style={styles.commonWrap} key={index}>
                                        <TouchableOpacity onPress= {()=> this.goDetail(data.classIdx,index)}>
                                            <View style={styles.textrow}>                                               
                                                <View style={styles.textinrow}>
                                                    <CustomTextM style={styles.LectureTitieWrapper}>
                                                        {data.title}
                                                    </CustomTextM>
                                                </View>
                                                <View style={[styles.textinrow,{paddingTop:Platform.OS === 'android'? 7 : 0,height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),flexDirection:'row',flexGrow:1, alignItems: 'center'}]}>
                                                    <CustomTextR style={styles.LectureSubInfoText}>{data.courseDays > 0 && data.courseDays + '일'}{data.lectureCount > 0 && '(' + data.lectureCount + '강)'}</CustomTextR>
                                                    <CustomText style={[styles.LectureSubInfoText, {color: DEFAULT_COLOR.base_color_ccc}]}>|</CustomText>
                                                    <CustomTextR style={styles.LectureSubInfoText}>{data.teacherName}</CustomTextR>
                                                </View>
                                                { 
                                                Platform.OS === 'android' 
                                                ?
                                                data.discountRate > 0 ?
                                                <View style={[styles.textinrow,{flexDirection:'row', alignItems: 'center',height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)}]}>
                                                    <TextRobotoR style={[styles.LectureSubInfoText,{textDecorationLine:'line-through',color:DEFAULT_COLOR.base_color_ccc}]}>{CommonFuncion.currencyFormat(data.originalPrice)}<CustomTextR>원</CustomTextR></TextRobotoR>
                                                    <TextRobotoM style={[styles.LectureSubInfoText,{color:DEFAULT_COLOR.lecture_base, fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}]}>{data.discountRate}%{data.discountRate > 0 && "↓"}</TextRobotoM>
                                                    <TextRobotoM style={styles.LectureSubInfoTextBold}>{CommonFuncion.currencyFormat(data.price)}<CustomTextM>원</CustomTextM></TextRobotoM>
                                                </View>
                                                :
                                                <View style={[styles.textinrow,{height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),alignItems: 'center',flexDirection:'row'}]}>
                                                    <TextRobotoM style={styles.LectureSubInfoTextBold}>{CommonFuncion.currencyFormat(data.price)}<CustomTextM>원</CustomTextM></TextRobotoM>
                                                </View>
                                                :
                                                null
                                                }
                                            </View>
                                            <ImageBackground                                    
                                                style={{flex:1,padding: Platform.OS === 'ios'? 65 : 65,position: 'absolute',bottom:0,right:-10,opacity:0.9}}
                                                resizeMode='cover'
                                                //source={require('../../../assets/images/sample_woman2.png')}
                                                source={data.teacherImage ? {uri:data.teacherImage} : require('../../../assets/images/default_teacher.png')}
                                            />
                                                {/*
                                                    <View style={styles.imgrow}>                                    
                                                        <Image 
                                                            //source={{uri:data.bannerurl}} 
                                                            source={require('../../../assets/images/sample_woman.png')}
                                                            style={{width:110,height:150}} resizeMode='contain' 
                                                            />
                                                    </View>
                                                */}                                    
                                        </TouchableOpacity>      
                                    </View>                
                                )
                            })}  
                        </View> 

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
                                <SearchFilter screenState={this.state} screenProps={this.props} />
                            </Animated.View>
                            
                        </Modal>
                        { this.state.moreLoading &&
                            <View style={{flex:1,paddingVertical:10,alignItems:'center',justifyContent:'center'}}>
                                <ActivityIndicator size="large" />
                            </View>
                        }
                    </View>
               </ScrollView>
            </View>
         )
      }
   }
}


const styles2 = StyleSheet.create ({
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fixedUpButton : {
        position:'absolute',bottom:50,right:20,width:50,height:50,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:25,opacity:0.5
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    CommonWrapper : {
        flex:1,
        margin:0,padding:0
    }
})

function mapStateToProps(state) {
    return {
        selectBook: state.GlabalStatus.selectBook,    
        topFavoriteMenu: state.GlabalStatus.topFavoriteMenu,   
        showBottomBar: state.GlabalStatus.showBottomBar,
        textBookFocusHeight : state.GlabalStatus.textBookFocusHeight,
        myTopFilter : state.GlabalStatus.myTopFilter,
        recommSelectData : state.GlabalStatus.recommSelectData,
        recommFilterData : state.GlabalStatus.recommFilterData,
        myInterestCodeOne : state.GlabalStatus.myInterestCodeOne,
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
        _updaterecommFilterData:(object) => {
            dispatch(ActionCreator.updaterecommFilterData(object));
        },
        _updaterecommSelectData:(object) => {
            dispatch(ActionCreator.updaterecommSelectData(object));
        },
        _updaterecommFilterData:(object) => {
            dispatch(ActionCreator.updaterecommFilterData(object));
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(IntroScreen);
