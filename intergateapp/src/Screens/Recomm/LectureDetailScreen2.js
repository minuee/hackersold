import React from 'react';
import {Text, View, StatusBar,TouchableOpacity,ImageBackground ,Dimensions,ScrollView,SafeAreaView,Image,ActivityIndicator,Alert,Platform,findNodeHandle,BackHandler} from 'react-native';
import {connect} from 'react-redux';
import {CheckBox,Overlay,Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import { NavigationEvents } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-tiny-toast';
import 'moment/locale/ko'
import  moment  from  "moment";
import LectureReview from './LectureReview';
import LectureQna from './LectureQna';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import styles from '../../Style/Recomm/LectureDetailScreen';

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

//비디오 설정
const VIDEO_WIDTH = SCREEN_WIDTH;
const VIDEO_HEIGHT = SCREEN_WIDTH * ( 9 / 16 );

//import SampleVideoScreen from '../../Utils/SampleVideoScreen'
import SampleVideoScreen from './SampleVideoScreen'


class LectureDetailScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading:true,
            historyTmp : [],
            userToken : null,
            checkOptionList : [],            
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
            productList　: [],        
            optionList : [],    
            mainImgHeight : parseInt(SCREEN_WIDTH*0.5),
            mainImgWidth : parseInt(SCREEN_WIDTH*0.5/2),
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
            setSeekerPosition : this.setSeekerPosition.bind(this)
        }
        this._nodes = new Map();
    }

    static navigationOptions = ({navigation}) => {
        
        const params =  navigation.state.params || {};        
        if ( params.newHeight ) {
            return {
                header : null
            }
        }else {
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
        }
    };

    _setNavigationParams(bool){
        //console.log('_setNavigationParams ', bool)
        let newtitle = <View style={{flexGrow:1,textAlign:'center',alignItems:'center'}}><Text style={{color:'#fff',fontSize:DEFAULT_TEXT.head_medium}}>강의상세</Text></View>;
        let newheaderLeft = <TouchableOpacity onPress={()=> this.backPress()} style={{flexGrow:1,textAlign:'center',alignItems:'center',paddingLeft:10}}><Icon name="left" size={25} color="#fff" /></TouchableOpacity>
        let newheaderRight = <View style={{flexGrow:1,textAlign:'center',alignItems:'center'}}></View>
        this.props.navigation.setParams({
            newtitle,
            newheaderLeft,
            newheaderRight,
            newHeight : bool 
        });
    }

    backPress = async() => {
        if ( !this.state.isFullscreen) {
            this.props.navigation.goBack(null)
        }
    }

    async UNSAFE_componentWillMount() {                 
        this._setNavigationParams(false);
        if ( typeof this.props.navigation.state.params.lectureIdx !== 'undefined' ) {
            await this.refreshTextBookInfo(this.props.navigation.state.params.lectureIdx);
        }else{
            const alerttoast = Toast.show('데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요');
            setTimeout(() => {
                Toast.hide(alerttoast);       
                this.props.navigation.goBack(null)
            }, 2000)
        }
        this.setHistory();
        this.setState({globalCurrentTime:0})
        console.log('this.props.userToken ',this.props.userToken )
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
    }

    refreshTextBookInfo = async(classIdx) => {
        if ( classIdx ) {
        
            let aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
            let aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey;
            console.log('aPIsDomain', aPIsDomain) 
            console.log('aPIsAuthKey', aPIsAuthKey) 
            console.log('classIdx', classIdx) 
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
                    console.log('responseresponse', response) 
                    if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                        if ( response.code !== '0000' ) {
                            this.setState({loading:false});
                            this.failCallAPigoBack()
                        }else{                            
                            this.setState({
                                loading : false,
                                lectureInfo:response.data.productInfo,
                                productList:response.data.productList,
                                //optionList:response.data.optionList
                            })
                        }
                    }else{
                        this.failCallAPigoBack()
                    }
                    this.setState({loading:false});
                })
                .catch(err => {
                    console.log('login error => ', err);
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

    failCallAPi = () => {
        let message = "데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
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
        let newData = {interestCode : setMyInterestCode, keyindex : 'lecture' +  this.props.navigation.state.params.lectureIdx ,type:'lecture',urllink : '', navigate:'LectureDetailScreen',idx : this.props.navigation.state.params.lectureIdx,date : CurrentDateTimeStamp,imageurl : lectureImage,title:this.state.lectureInfo.title}       
        this.checkInsertOrUpdate( newData);   
    }

    changeTabs = async(newvalue) => {
        this.setState({
             isselectTab:newvalue
        });
    }
    
    upButtonHandler = () => {        
        this.ScrollView.scrollTo({ x: 0,  animated: true });
    };

    handleOnScroll (event) {     
        if ( event.nativeEvent.contentOffset.y >= 100 ) {
            this.setState({
                showTopButton : true
            })
        }else{
            this.setState({
                showTopButton : false
            })
        }
    }

    onLayoutHeader = (evt ) => {
        
        //console.log('height',evt.nativeEvent.layout);        
        this.setState({
            mainImgHeight : evt.nativeEvent.layout.height,
            mainImgWidth : evt.nativeEvent.layout.width
        });
    }

    toggleOverlay = async(index) => {      
        let isVisibleOverlay = this.state.isVisibleOverlay;
        this.setState({ 
            isVisibleOverlay: !isVisibleOverlay
         })
    }

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
    
    _checkOptionList = async(index,data,mode) =>{
        let returnArray = await this.setOnceChecked(data,mode);   
        
        let tmpoptionSumPrice = 0;
        returnArray.map((items) => {
            tmpoptionSumPrice += parseInt(items.info.price);
            if ( items.info.type === 'book') {
                this.setState({isDeliveryPrice : true })
            }
        })        
        
        this.setState({
            checkOptionList: Array.from(new Set(returnArray)),
            optionSumPrice : parseInt(tmpoptionSumPrice)
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
            optionSumPrice : parseInt(tmpoptionSumPrice)
        })
    }

     // 주문번호 생성 
     requestOrderNo = async() => {       
         console.log('this.state.userToken', this.state.userToken)
        if ( this.state.userToken === null ) {
            Alert.alert('해커스통합앱', '로그인이 필요합니다.\n로그인 하시겠습니까?',
            [
                //{text: '확인 1', onPress: () => this.props.screenProps.navigation.navigate('SignInScreen', {onLoginBack: () => this.onLoginBack()})},
                {text: '확인', onPress: () => this.props.navigation.navigate('SignInScreen', {goScreen: 'TextBoookDetail',routeIdx : this.state.bookIdx})},
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

            await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiTestDomain + '/v1/payment/orderNo/' + memberIdx,{
                method: 'POST', 
                headers: new Headers({
                    Accept: 'application/json',                
                    'Content-Type': 'multipart/form-data',
                    'apiKey': DEFAULT_CONSTANTS.apitestKey
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
                    "해커스통합앱 : 수강신청",
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
        const memberIdx = this.state.memberIdx;    
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

    cartInsert = async() => {
        const memberIdx = this.state.memberIdx;       
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
            //console.log('formData',formData)
            await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiTestDomain + '/v1/payment/cart/' + memberIdx,{
                method: 'POST', 
                headers: new Headers({
                    Accept: 'application/json',                
                    'Content-Type': 'multipart/form-data',
                    'apiKey': DEFAULT_CONSTANTS.apitestKey
            }), 
                body:formData
            },10000
            ).then(response => {
                //console.log('response', response)
                if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                    if ( response.code === '2006' ) {

                        const alerttoast2 = Toast.show('현재 수강대기,판매다기,판매불가로 인해 등록이 불가합니다.');
                        setTimeout(() => {
                            Toast.hide(alerttoast2);       
                        }, 2000)

                    }else if ( response.code === '0000' || response.code === '3014' ) {
                        const alerttoast2 = Toast.show('등록되었습니다.');
                        setTimeout(() => {
                            Toast.hide(alerttoast2);       
                        }, 2000)
                    }else{                    
                        this.failCallAPi()
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
    
    

    render() {
        
        if ( this.state.loading ) {
            return (
                <View style={{flex: 1,width:'100%',backgroundColor : "#fff",textAlign: 'center',alignItems: 'center',justifyContent: 'center',}}><ActivityIndicator size="large" /></View>
            )
        }else {
            const LectureIntroduce =()=>{            
                return (
                    <View style={{flex:1,padding:20}}>
                        <Text style={{color:'#555',fontSize:15}}>
                                {this.state.lectureInfo.classInfo}
                        </Text> 
                        {/*
                        <View style={{flex:1,paddingHorizontal:10}}>
                            <Text style={{fontWeight:'bold',fontSize:18}}>강의</Text>
                        </View>
                        <View style={{flex:1,padding:10}}>
                            <Text style={{color:'#555',fontSize:15}}>
                                해커스 토익 총평강의 1위 박가은 선생님의 토익 보카 노하우를 총정리
                            </Text>                        
                        </View>
                        <View style={{flex:1,paddingHorizontal:10}}>
                            <Text style={{fontWeight:'bold',fontSize:18}}>교재</Text>
                        </View>
                        <View style={{flex:1,padding:10}}>
                            <Text style={{color:'#555',fontSize:15}}>
                                어휘 암기가 빨라지는 상황별 설명! 단순 암기가 아닌 상황별 설명 및 예문을 통해 자연스러운 어휘 암기가 가능해집니다.
                            </Text>                        
                        </View>    
                        */}               
                    </View>
                    )
            }

            const LectureClassIndex = ()=>{            
                return (
                    <View style={{flex:1,paddingVertical:10,minHeight:100}}>
                        {
                            this.state.lectureInfo.classIndex.map((classItem, classIndex) => {
                                return (
                                    <View style={{flexDirection:'row'}} key={classIndex}>
                                        <View style={{flex:1,borderRightWidth:1,borderRightColor:DEFAULT_COLOR.input_border_color,justifyContent:'center',alignItems:'center'}}>
                                            <Text style={{color:'#555',fontSize:15,padding:5}}>
                                                {classItem.num}
                                            </Text> 
                                        </View>
                                        <View style={{flex:4,justifyContent:'flex-start',alignItems:'flex-start',paddingLeft:10}}>
                                            <Text style={{color:'#555',fontSize:15,padding:5}}>
                                               {classItem.title}
                                            </Text> 
                                        </View>
                                    </View>

                                )
                            })
                        }
                    </View>
                )
            }
           
         
            let learnLevel = typeof this.state.lectureInfo.learnLevel !== 'undefined' ? this.state.lectureInfo.learnLevel.split('(') : [] ; 
            return (
                <SafeAreaView style={[
                    { flex: 1,textAlign: 'center',alignItems: 'center',justifyContent: 'center'},
                    { width: this.state.containerWidth, height: this.state.containerHeight },
                    { backgroundColor: (this.state.isFullscreen ? DEFAULT_COLOR.base_color_000 : DEFAULT_COLOR.base_color_fff )}
                ]}>      
                    <NavigationEvents
                        onWillFocus={payload => {        
                            //console.log('onWillFocus')
                            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);          
                        }}
                        onWillBlur={payload => {                            
                            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
                        }}
                    />                   
                    { this.state.showTopButton &&
                        <TouchableOpacity 
                            style={styles.fixedUpButton}
                            onPress={e => this.upButtonHandler()}
                        >
                            <Icon name="up" size={30} color="#000" />
                        </TouchableOpacity>
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
                            <View style={[styles.topWrapper,{paddingTop:20}]}>
                                <View style={styles.titleHeaderInfo}>
                                    <View style={styles.commoneTopWrapLeft}></View>
                                    <View style={[styles.commoneTopWrap,{paddingTop:20}]} onLayout={(e)=>this.onLayoutHeader(e)}>
                                        {
                                            this.state.lectureInfo ?
                                            <Image
                                                source={{uri:this.state.lectureInfo.image}}
                                                style={{width:this.state.mainImgWidth,height:this.state.mainImgHeight,overflow:'hidden'}}
                                                resizeMode='cover'
                                            />
                                            :
                                            <ImageBackground                                    
                                                style={{flex:1,padding: SCREEN_HEIGHT/9,position: 'absolute',bottom:0,right:0,//opacity:0.5
                                                }}
                                                resizeMode='cover'
                                                source={require('../../../assets/images/sample_woman2.png')}
                                                >                                
                                            </ImageBackground>   
                                        }
                                        
                                        {/*
                                        <View style={styles.textrow}>
                                            <View style={[styles.textinrow,{flexDirection:'row'}]}>
                                                <Text style={{backgroundColor:'#fff',paddingVertical:1,paddingHorizontal:10, borderRadius:1,borderColor:'#fff', color:'#1effe4',borderWidth:1,marginRight:10}}>2주완성</Text>
                                            </View>
                                            <View style={styles.textinrow}>
                                                <Text style={{fontWeight:'bold',fontSize:20, color:'#fff'}}>
                                                    세이임의 토스 발음 클리닉
                                                </Text>
                                            </View>
                                            <View style={[styles.textinrow,{flexDirection:'row'}]}>
                                                <Text style={{padding:5,marginRight:10,color:'#e4ff26'}}>세이 임</Text>
                                            </View>                               
                                        </View>
                                        
                                        <ImageBackground                                    
                                            style={{flex:1,padding: SCREEN_HEIGHT/8,position: 'absolute',bottom:0,right:0,//opacity:0.5
                                            }}
                                            resizeMode='cover'
                                            source={require('../../../assets/images/sample_woman2.png')}
                                            >                                
                                        </ImageBackground>   
                                        */}                                                       
                                    </View>  
                                    <View style={styles.commoneTopWrapRight}></View>
                                </View>
                            </View>
                            <View style={styles.topWrapper2}>
                                <View style={styles.titleHeaderInfo}>
                                    <View style={styles.commoneBottomWrapLeft}></View>
                                    <View style={styles.commoneBottomWrap}>
                                        <View style={{paddingHorizontal:20}}>
                                            <Text style={styles.mainLectureText}>
                                                {this.state.lectureInfo.title}
                                            </Text>
                                        </View>
                                        <View style={{paddingHorizontal:20,paddingTop:15}}>
                                            <Text style={styles.mainInformationSubText}>{this.state.lectureInfo.desc}</Text>
                                            {/*
                                            <View style={styles.mainInformationSubLeftRight}>
                                                <Text style={styles.mainInformationSubText}>토익기출어휘30일정복</Text>
                                            </View>
                                            <View style={styles.mainInformationSubCenter}>
                                                <Text style={{color:'#ccc'}}>|</Text>
                                            </View>
                                            <View style={styles.mainInformationSubLeftRight}>
                                                <Text style={styles.mainInformationSubText}>수강기간30일 연장</Text>
                                            </View>
                                            */}
                                        </View>
                                    </View>
                                    <View style={styles.commoneBottomWrapRight}></View>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.secondInformationWrap}
                                onPress= {()=> this.closeTooltip()}
                            >                        
                                <View style={styles.secondInformationTitle}>
                                    <Text style={styles.secondInformationTitleText}>강좌 정보</Text>
                                </View>
                                <View style={styles.secondInformationSubWarp}>
                                    <View style={styles.secondInformationSubLeft}>
                                        <Text style={styles.secondInformationSubText}>선생님</Text>
                                    </View>
                                    <View style={styles.secondInformationSubCenter}>
                                        <Text style={{color:'#d8d8d8'}}>|</Text>
                                    </View>
                                    <View style={styles.secondInformationSubRight}>
                                        <Text style={styles.secondInformationSubText}>{this.state.lectureInfo.teacher}</Text>
                                    </View>
                                </View>
                                <View style={styles.secondInformationSubWarp}>
                                    <View style={styles.secondInformationSubLeft}>
                                        <Text style={styles.secondInformationSubText}>교재</Text>
                                    </View>
                                    <View style={styles.secondInformationSubCenter}>
                                        <Text style={{color:'#d8d8d8'}}>|</Text>
                                    </View>
                                    <View style={styles.secondInformationSubRight}>
                                        { 
                                            this.state.selectedGoods !== null ?         
                                            <Text style={styles.secondInformationSubText}>
                                                {this.state.productList[this.state.selectedGoods].book}
                                            </Text>                                        
                                            :
                                            <Text style={styles.secondInformationSubText}>
                                                강의상품별 상이
                                            </Text>                                        
                                        }
                                        
                                        {/*
                                            this.state.lectureInfo.book.map((book,bindex) =>  {
                                                return (
                                                    <Text style={styles.secondInformationSubText}>{book}</Text>
                                                )
                                            })
                                        */}
                                    </View>
                                </View>
                                <View style={styles.secondInformationSubWarp}>
                                    
                                    <View style={[styles.secondInformationSubLeft,{flexDirection:'row'}]}>
                                        <Text style={styles.secondInformationSubText}>배수</Text>
                                        <TouchableOpacity
                                            style={{paddingLeft:5}}
                                            onPress= {()=> this.setState({showRepeatInfo : !this.state.showRepeatInfo})}
                                            >
                                            <Icon name="questioncircleo" size={16} color="#666" />
                                        </TouchableOpacity>                            
                                    </View>
                                    <View style={styles.secondInformationSubCenter}>
                                        <Text style={{color:'#d8d8d8'}}>|</Text>
                                    </View>
                                    <View style={styles.secondInformationSubRight}>
                                        <Text style={styles.secondInformationSubText}>{this.state.lectureInfo.lectureMultiple}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.secondInformationIconWrap}>
                                {this.state.showRepeatInfo &&
                                    <View style={styles.secondInformationHidden}>
                                        <View style={[styles.secondInformationHiddenCommonRow,{paddingBottom:10}]}>
                                            <Text style={styles.secondInformationHiddenTitleText}>배수란 ?</Text>
                                        </View>
                                        <View style={styles.secondInformationHiddenCommonRow}>
                                            <Text style={styles.secondInformationHiddenBodyText}>강의수강 가능시간으로 강좌별 설정된 배수에 따라 강의마다 수강 시간이 달라집니다.</Text>
                                        </View>
                                        <View style={styles.secondInformationHiddenCommonRow}>
                                            <Text style={styles.secondInformationHiddenBodyText}>예) 2배수 강좌 내'1강'의 강의 시간이 50분인 경우, '50분X2배수' 설정되어 총 100분 수강가능</Text>
                                        </View>
                                    </View>
                                }
                    
                                <View style={styles.secondInformationIconData}>
                                    <View style={styles.secondInformationIconDataRow}>
                                        <Text style={styles.secondInformationIconDataText}>학습수준</Text>
                                    </View>
                                    <View style={styles.secondInformationIconDataRow}>
                                        <Text style={styles.secondInformationIconDataText}>학습기간</Text>
                                    </View>
                                    <View style={styles.secondInformationIconDataRow}>
                                        <Text style={styles.secondInformationIconDataText}>지원기기</Text>
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
                                        <Text style={styles.secondInformationIconDataColorText}>
                                            {this.state.lectureInfo.learnLevel && learnLevel[0]}
                                        </Text>
                                    </View>
                                    <View style={styles.secondInformationIconDataRow}>
                                        <Text style={styles.secondInformationIconDataColorText}>{this.state.lectureInfo.courseDays ? this.state.lectureInfo.courseDays : 0}일</Text>
                                    </View>
                                    <View style={styles.secondInformationIconDataRow}>
                                        <Text style={styles.secondInformationIconDataColorText}>
                                            {typeof this.state.lectureInfo.device !== 'undefined' ? this.state.lectureInfo.device[0].toUpperCase() : null }
                                        </Text>
                                    </View>
                                </View>
                                <View style={{paddingHorizontal:5,flexDirection:'row'}}>
                                    <View style={styles.secondInformationIconDataRow}>
                                        <Text style={styles.secondInformationIconDataColorText}>
                                            {(this.state.lectureInfo.learnLevel && typeof learnLevel[1] !== 'undefined') && "("+learnLevel[1]}
                                        </Text>
                                    </View>
                                    <View style={styles.secondInformationIconDataRow}>
                                        <Text style={styles.secondInformationIconDataColorText}>({this.state.lectureInfo.lectureCount ? this.state.lectureInfo.lectureCount : 0}강)</Text>
                                    </View>
                                    <View style={styles.secondInformationIconDataRow}>
                                        <Text style={styles.secondInformationIconDataColorText}>
                                        {typeof this.state.lectureInfo.device !== 'undefined' && this.state.lectureInfo.device[1].toUpperCase()}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{backgroundColor:DEFAULT_COLOR.input_bg_color2}}>
                                <View style={styles.selectGoodsWrapper}>
                                    <View style={{paddingHorizontal:15}}>
                                        <Text style={styles.selectGoodsTitleText}>상품선택</Text>
                                    </View>                        
                                    <View style={{padding:5}}>
                                        { 
                                        this.state.productList.map((titem, tindex) => {     
                                            return(                           
                                                <View style={this.state.selectedGoods === tindex ? styles.checkedItem : styles.unCheckedItem} key={tindex}>
                                                    <View style={styles.selectGoodsBoxWrapper}>
                                                        <CheckBox
                                                            containerStyle={styles.checkboxWrap}                                            
                                                            checkedIcon="dot-circle-o"
                                                            uncheckedIcon="circle-o" 
                                                            readOnly
                                                            checked={this.state.selectedGoods === tindex ? true : false }
                                                            onPress= {()=> this.selectProduct(tindex,titem)}
                                                        />                            
                                                    </View>
                                                    <View style={{flex:4}}>
                                                        <View >
                                                            <Text style={styles.selectGoodsBoxRightTitleText}>{titem.title}</Text>
                                                        </View>
                                                        { titem.originalPrice !== titem.price
                                                        ?
                                                        <View style={styles.selectGoodsBoxRightOption}>
                                                            <Text style={styles.selectGoodsBoxRightOptionText1}>{CommonFuncion.currencyFormat(titem.originalPrice)}원</Text>
                                                            <Text style={styles.selectGoodsBoxRightOptionText2}>{parseInt(100-(titem.price/titem.originalPrice*100))}%</Text>
                                                            <Text style={styles.selectGoodsBoxRightOptionText3}>{CommonFuncion.currencyFormat(titem.price)}원</Text>   
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
                                        <Text style={styles.selectGoodsTitleText}>옵션선택</Text>
                                    </View>                  
                                    {
                                        this.state.selectedGoods === null  
                                        ?
                                        <View style={styles.selectGoodsOptionSelectBox}>
                                            <View style={styles.selectGoodsOptionSelectBoxView}>
                                                <Text numberOfLines={1} ellipsizeMode = 'tail' style={styles.selectGoodsOptionSelectBoxText}>
                                                    상품은 먼저 선택해주세요
                                                </Text>
                                            </View>                                
                                        </View>
                                        :
                                        ( this.state.selectedGoods !== null && this.state.optionList.length > 0) 
                                        ?
                                            <View style={styles.selectGoodsOptionSelectBox}>
                                                <View style={styles.selectGoodsOptionSelectBoxView}>
                                                    <Text numberOfLines={1} ellipsizeMode = 'tail' style={styles.selectGoodsOptionSelectBoxText}>
                                                        {this.state.optionList[0].title}
                                                    </Text>
                                                </View>
                                                <TouchableOpacity style={{flex:0.5,justifyContent:'center',alignItems:'center'}} onPress={()=>this.toggleOverlay(null)}>   
                                                    <Icon name="down" size={20} color={DEFAULT_COLOR.lecture_base} />
                                                </TouchableOpacity>
                                            </View>
                                        :
                                        <View style={styles.selectGoodsOptionSelectBox}>
                                            <View style={styles.selectGoodsOptionSelectBoxView}>
                                                <Text numberOfLines={1} ellipsizeMode = 'tail' style={styles.selectGoodsOptionSelectBoxText}>
                                                    해당 강의상품은 옵션항목이 없습니다.
                                                </Text>
                                            </View>                                
                                        </View>
                                    }
                                </View>
                                {
                                    this.state.selectedGoods !== null &&
                                    <View style={styles.selectGoodsResultWrap}>
                                        <View style={styles.selectGoodsResultInWrap}>
                                            <View style={styles.selectGoodsResultTitle}>
                                                <Text style={styles.selectGoodsTitleText}>신청내역</Text>
                                            </View>
                                            <View style={styles.selectGoodsResultLectureTitle}>
                                                <Text style={styles.selectGoodsResultLectureTitleText}>
                                                    {this.state.productList[this.state.selectedGoods].title}
                                                </Text>                        
                                            </View>
                                            <View style={styles.selectGoodsResultLecturePrice}>
                                                <Text style={styles.selectGoodsResultLecturePriceText}>
                                                    {CommonFuncion.currencyFormat(this.state.productList[this.state.selectedGoods].price)}원
                                                </Text>  
                                            </View>   
                                            <View>
                                            {   
                                            this.state.checkOptionList.map((seitem, seIndex) => {
                                                return (
                                                    <View key={seIndex} style={{borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1,paddingBottom:10}}>
                                                        <View style={styles.selectGoodsResultOptionWrap}>
                                                            <View style={styles.selectGoodsResultOptionTitile}>
                                                                <Text style={styles.selectGoodsResultOptionTitileTextBold}>선택옵션 : </Text>                                        
                                                                <Text style={styles.selectGoodsResultOptionTitileText}>
                                                                    {seitem.info.title}
                                                                </Text>                        
                                                            </View>
                                                            <TouchableOpacity 
                                                                style={styles.selectGoodsResultOptionCancel}
                                                                onPress={()=> this.removeOptionList(seitem.index)}
                                                            >
                                                                <Icon name="closecircle" size={20} color="#ccc" />
                                                            </TouchableOpacity>
                                                        </View>
                                                        <View style={styles.selectGoodsResultOptionPrice}>
                                                            <Text style={styles.selectGoodsResultOptionPriceText}>
                                                                {CommonFuncion.currencyFormat(seitem.info.price)}원
                                                            </Text>  
                                                        </View>
                                                    </View>
                                                )
                                            })
                                            }
                                            </View>
                                        </View>
                                    </View>
                                }
                            
                                <View style={styles.selectGoodsResultPriceWrap}>
                                    <View style={styles.selectGoodsResultPriceInWrap}>
                                        <View style={styles.selectGoodsResultPriceLeft}>
                                            <Text style={styles.selectGoodsResultPriceText1}>총상품금액</Text>
                                        </View>
                                        <View style={styles.selectGoodsResultPriceCenter}>
                                            {( this.state.selectedGoods !== null && this.state.productList[this.state.selectedGoods].originalPrice > this.state.productList[this.state.selectedGoods].price ) ? 
                                            <Text style={styles.selectGoodsResultPriceText2}>
                                                {CommonFuncion.currencyFormat(this.state.productList[this.state.selectedGoods].originalPrice)}원
                                            </Text>
                                            :null
                                            }
                                        </View>
                                        <View style={styles.selectGoodsResultPriceRight}>
                                            <Text style={styles.selectGoodsResultPriceText1}>
                                                {
                                                    this.state.selectedGoods !== null ? 
                                                    CommonFuncion.currencyFormat(parseInt(this.state.optionSumPrice) + parseInt(this.state.productList[this.state.selectedGoods].price)) 
                                                    :
                                                    0
                                                }원
                                            </Text>   
                                        </View>
                                        
                                    </View>
                                </View>

                                <View style={{backgroundColor:DEFAULT_COLOR.input_bg_color2}} onLayout={(e)=>this.onLayoutSample(e)}>
                                    <View style={styles.sampleVideoWrapper}>
                                        <View 
                                            style={{padding:15}} 
                                            ref={(ref) => {
                                                this._nodes = ref;
                                            }}
                                        >
                                            <Text style={styles.sampleVideoTitleText}>샘플강의 보기</Text>
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

                                <View style={{backgroundColor:'#ccc'}}>
                                    <View style={styles.bottomTabsWrapper}>
                                        <View style={[this.state.isselectTab === 1 ? styles.heaerTabsOn : styles.heaerTabs,{flex:1}]}>
                                            <Text                                     
                                                onPress= {()=> this.changeTabs(1)}
                                                style={[this.state.isselectTab === 1 ? styles.selectedText : styles.unselectedText]}
                                                >
                                                강의소개
                                            </Text>
                                        </View>
                                        <View style={[this.state.isselectTab === 2 ? styles.heaerTabsOn : styles.heaerTabs,{flex:1}]}>
                                            <Text 
                                                onPress= {()=> this.changeTabs(2)}
                                                style={[this.state.isselectTab === 2 ? styles.selectedText : styles.unselectedText]}
                                            >
                                                강의목차
                                            </Text>
                                        </View>
                                        <View style={[this.state.isselectTab === 3 ? styles.heaerTabsOn : styles.heaerTabs,{flex:1}]}>
                                            <Text 
                                                onPress= {()=> this.changeTabs(3)}
                                                style={[this.state.isselectTab === 3 ? styles.selectedText : styles.unselectedText]}
                                            >
                                                수강후기
                                            </Text>
                                        </View>
                                        <View style={[this.state.isselectTab === 4 ? styles.heaerTabsOn : styles.heaerTabs,{flex:1.5}]}>
                                            <Text 
                                                onPress= {()=> this.changeTabs(4)}
                                                style={[this.state.isselectTab === 4 ? styles.selectedText : styles.unselectedText]}
                                            >
                                                선생님께질문하기
                                            </Text>
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

                                {
                                    //Platform.OS === 'android' &&
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
                                                <Text style={styles.bottomButtonRightText}>수강신청</Text>
                                            </TouchableOpacity>
                                            
                                        </View>
                                    </View>
                                }
                            </View>

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
                                    { this.state.selectedGoods !== null &&
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
                                    }
                                
                                    <View style={ styles.overrayBottom }>
                                        <Button
                                            title='선택완료'
                                            onPress={ () => this.toggleOverlay(1) }
                                        />
                                        <View style={{width:'100%',height:5}}></View>
                                        { this.state.checkOptionList.length > 0 &&                                    
                                            <Button
                                                title='전체취소'
                                                buttonStyle={{ backgroundColor: '#D9D9D9', }}
                                                titleStyle={{ color: '#616161' }}
                                                onPress={ () => this.setState({checkOptionList:[]}) }
                                            />                                
                                        }
                                    </View>
                                </SafeAreaView>
                            </Overlay>
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
        userToken: state.GlabalStatus.userToken   
    };
}
export default connect(mapStateToProps, null)(LectureDetailScreen);