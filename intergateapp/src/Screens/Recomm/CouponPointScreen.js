import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    Text,
    TextInput,
    Dimensions,
    PixelRatio,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Platform
} from 'react-native';
import {connect} from 'react-redux';
import {Button,Input} from 'react-native-elements';
import SelectCoupon from "./SelectCoupon";
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Toast from 'react-native-tiny-toast';

import DropDown from '../../Utils/DropDown';
const IC_ARR_DOWN = require('../../../assets/icons/ic_arr_down.png');
const IC_ARR_UP = require('../../../assets/icons/ic_arr_up.png');

// HTML
import HTMLConvert from '../../Utils/HtmlConvert/HTMLConvert';
const IMAGES_MAX_WIDTH = SCREEN_WIDTH - 50;
const CUSTOM_STYLES = {};
const CUSTOM_RENDERERS = {};
const DEFAULT_PROPS = {
    htmlStyles: CUSTOM_STYLES,
    renderers: CUSTOM_RENDERERS,
    imagesMaxWidth: IMAGES_MAX_WIDTH,
    onLinkPress: (evt, href) => { Linking.openURL(href); },
    debug: true,
};

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import { CustomTextR } from '../../Style/CustomText';

class CouponPointScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            useCanPoint : 0,
            usedCanPoint : parseInt(this.props.screenState.usePoint),
            //usePoint : this.props.screenState.usePoint ,
            useCouponPrice : this.props.screenState.useCouponPrice,
            SelectCoupon : '',
            inputFocus : false,
            totalDiscount : this.props.screenState.discountPrice,
            useCanCouponCount : 0,
            nowFocusProductIdx :  0,
            nowFocusProductPrice :  0,
            nowFocusProductIndex :  0,
            selectedList : this.props.screenState.useCouponPoint,
            useCanCoupon : [
                /*
                { couponIdx :1,couponName : '보노보노쿠폰001', couponType : 'rate',couponAmount : 10},
                { couponIdx :2,couponName : '보노보노쿠폰002', couponType : 'amount',couponAmount : 5000},
                { couponIdx :3,couponName : '보노보노쿠폰003', couponType : 'amount',couponAmount : 3000},
                */
            ],
            cpInfoMessages: [],
            setPointList: {},
        }
    }

    setMergeCouponData = async(data) => {
        let selectedFilterCodeList = [];  
        await data.forEach(function(element,index,array){   
            let productData = Array.isArray(element.productData) === true ? element.productData[0] : element.productData;         
            //console.log('productData.productIdx11111', productData.productIdx) 
            let canUseCouponList = this.state.useCanCoupon.filter((info) => info.productIdx === productData.productIdx);       
            //console.log('ableCoupon2222', canUseCouponList[0]) 
            //selectedFilterCodeList.push({productIdx : productData.productIdx});
        });

        return selectedFilterCodeList;
    }

    async UNSAFE_componentWillMount() {
        // console.log('xxxxxxx', this.state.selectedList)
        //무조건 쿠폰정보를 가져온다
        if ( this.props.screenState.orderNo && this.props.screenState.productList ) {
            await this.requestConponList(this.props.screenState.orderNo,this.props.screenState.productList　);
        }

        await this.setMessage();
        await this.initPoint();

        /*
        if ( this.props.screenState.useCouponList.length >  0 ) {
            await this.setState({ useCanCoupon :  this.props.screenState.useCouponList})
        }

        if ( this.props.screenState.orderNo && this.props.screenState.productList && this.props.screenState.useCouponList.length === 0　 ) {
            await this.setMergeCouponData(this.props.screenState.productList)
        }
        */
    } 

    componentDidMount() {
        // if ( this.state.useCanCoupon.length > 0  && this.props.screenState.useCouponIdx ) {

        // }
    }

    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보        
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
    }

    componentWillUnmount() {
    }

    // 안내메세지
    setMessage = async () => {
        const serviceID = await CommonUtil.getServiceID();
        if (!serviceID) {
            Alert.alert('', '안내메세지 로딩용 서비스ID가 없습니다.');
            return;
        }

        const infoMessages = await CommonUtil.getInfoMessage(serviceID);
        if (infoMessages.result === true) {
            if (infoMessages.response.code === '0000') {
                this.setState({
                    cpInfoMessages: infoMessages.response.data.message.couponPoint || [],
                });
            } else {
                Alert.alert('', infoMessages.response.message || '안내메세지 로딩 실패');
            }
        } else {
            Alert.alert('', infoMessages.error || '안내메세지 로딩 실패');
        }
    };

    initPoint = () => {
        let list = [];
        let returnArray = this.state.selectedList.filter(info => info.isType === 'point');
        returnArray.map(item => {
            if (item.productIdx) {
                list[item.productIdx] = {point: item.price, isEnable: true, isApplied: true, productIdx: item.productIdx};
                console.log('list[item.productIdx] : ', list[item.productIdx]);
                this.setState({setPointList: list});
            }
        })
    };

    setCoupon = async(data) => {
        let selectedFilterCodeList = [];
        await data.forEach(function(element,index,array) {
            selectedFilterCodeList.push({source : {uri:element.url},title:data.type});
        });

        return selectedFilterCodeList;
    }

    setProductIdx = async(data) => {
        let selectedFilterCodeList = [];
        await data.forEach(function(element,index,array) {
            let productData = Array.isArray(element.productData) === true ? element.productData[0] : element.productData;
            selectedFilterCodeList.push({productIdx : productData.productIdx,usePoint : 0});
        });

        return selectedFilterCodeList;
    }

    // 쿠폰목록 조회
    requestConponList = async(orderNo,productList　) => {
        let productListArray = await this.setProductIdx(productList);
        const memberIdx = this.props.screenState.userToken.memberIdx;
        // const formData = new FormData();
        // formData.append('orderNo',orderNo );
        // formData.append('products',JSON.stringify(productListArray));
        // console.log('requestConponList()', 'orderNo = ' + orderNo)
        // console.log('requestConponList()', 'products = ' + JSON.stringify(productListArray))

        const aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain
        // const aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey
        const params = {
            orderNo: orderNo,
            products: JSON.stringify(productListArray),
        };
        const url = aPIsDomain + '/v1/payment/userPayment/' + memberIdx + '?' + CommonUtil.objectToParamString(params);
        const options = {
            // method: 'POST',
            method: 'GET',
            // body: formData,
        };
        await CommonUtil.callAPI(url, options, 10000)
            .then(response => {
                if (!CommonUtil.isEmpty(response)) {
                    if (response.code !== '0000') {
                        Alert.alert('', response.message || '쿠폰 조회에 실패 했습니다.', [{text: '확인', onPress: () => this.props.screenState.closeModalCoupon()}]);
                    } else {
                        console.log('response.data : ', response.data);
                        let arrProductList = [];
                        const productList = response.data.productList.map(item => {
                            console.log('item : ', item);
                            return ({
                                    ...item,
                                    productName: CommonUtil.stripTags(item.productName),
                                });
                        });
                        console.log('productList : ', productList);
                        this.setState({
                            loading : false,
                            useCanCoupon : productList || [],
                            useCanCouponCount : response.data.userCouponCnt && parseInt(response.data.userCouponCnt) || 0,
                            useCanPoint : response.data.userPoint && parseInt(response.data.userPoint) || 0,
                        });
                        console.log('---- 1');
                    }
                } else {
                    Alert.alert('', '쿠폰 조회에 실패 했습니다.', [{text: '확인', onPress: () => this.props.screenState.closeModalCoupon()}]);
                }
                console.log('---- 2');
            })
            .catch(error => {
                console.log('시스템 오류: 쿠폰 조회 실패 : ', error);
                Alert.alert('', '시스템 오류: 쿠폰 조회에 실패 했습니다.', [{text: '확인', onPress: () => this.props.screenState.closeModalCoupon()}]);
            });
        /*
        await fetch(aPIsDomain + '/v1/payment/userPayment/' + memberIdx , {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'apiKey': aPIsAuthKey,
                'Content-Type': 'multipart/form-data',
            },
            //body: formData,
        })
        .then((response) => response.json())
        .then((response) => {
            console.log('requestConponList()', 'response = ' + JSON.stringify(response))
            //console.log('response.data.productList', response.data.productList[0].ableCoupon)
            //console.log('response.data.productList2', response.data.productList[1].ableCoupon)
            if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                if ( response.code !== '0000' ) {
                    const alerttoast = Toast.show('일시적 오류가 발생하였습니다.\n잠시후 이용해 주세요');
                    setTimeout(() => {
                        Toast.hide(alerttoast);       
                        this.props.screenState.closeModalCoupon();
                    }, 2000)
                }else{                            
                    this.setState({
                        loading : false,
                        useCanCoupon : response.data.productList,
                        useCanCouponCount : parseInt(response.data.userCouponCnt),
                        useCanPoint : parseInt(response.data.userPoint),
                    })
                }
            }else{
                const alerttoast = Toast.show('일시적 오류가 발생하였습니다.\n잠시후 이용해 주세요');
                setTimeout(() => {
                    Toast.hide(alerttoast);       
                    this.props.screenState.closeModalCoupon();
                }, 2000)
            }
          
        })
        .done();
        */
    };

    failCallAPi = () => {
        let message = "데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);
    }


    calTotalDiscount = async (productData, seIndex) => {
        let list = this.state.setPointList || [];
        const currentSetPoint = this.state.setPointList[productData.productIdx];
        list[productData.productIdx] = {...currentSetPoint, point: 0, isEnable: false, isApplied: false};
        this.setState({setPointList: list});

        let returnArray = await this.state.selectedList.filter((info) => info.productIdx !== productData.productIdx);
        this.setState({
            selectedList: returnArray,
        });
        this.props.screenState.productList[seIndex].usePoint = 0;
        await this.totalCal(returnArray, 'point');
        /*
        let useCoupon = this.state.useCoupon;
        let usePoint = 0;
        this.setState({
            totalDiscount :   parseInt(usePoint) +  parseInt(useCoupon)
        })
        */
    }

    setOnceChecked = async (point, productIdx, list, type, couponIdx) => {
        await list.push({productIdx: productIdx, isType: type, price: point, couponIdx: couponIdx});
        // console.log('list 2', list);
        return list;
    }

    setOnceCheckedMax = async (point,productIdx,list,type,couponIdx) => {
        await list.push({productIdx: productIdx, isType: type, price: parseInt(this.state.nowFocusProductPrice), couponIdx: couponIdx});
        return list;
    }

    setupFocus = (productIdx, price, idx) => {
        this.setState({
            nowFocusProductIdx: productIdx,
            nowFocusProductPrice: price,
            nowFocusProductIndex: idx,
        })
    }

    onChangeTextInput = async text => {
        if (text === '') {
            const data = {
                ...this.state.setPointList,
                [this.state.nowFocusProductIdx]: {point: 0, isEnable: true, isApplied: false, productIdx: this.state.nowFocusProductIdx, productPrice: this.state.nowFocusProductPrice}
            };
            this.setState({
                // nowFocusProductIdx: 0,
                // nowFocusProductPrice: 0,
                setPointList: data,
            });
        }

        const numericRegex = /^([0-9]{1,100})+$/;
        if (numericRegex.test(text)) {
            let appliedSumPoint = 0;
            if (!CommonUtil.isEmpty(this.state.setPointList)) {
                for (const [productIdx, pointData] of Object.entries(this.state.setPointList)) {
                    if (pointData) {
                        for (const [key, value] of Object.entries(pointData)) {
                            appliedSumPoint = (key === 'isApplied' && value === true) ? appliedSumPoint + parseInt(pointData.point) : appliedSumPoint;
                        };
                    }
                };
            }
            const useablePoint = this.state.setPointList[this.state.nowFocusProductIdx] ? parseInt(this.state.useCanPoint) - appliedSumPoint : parseInt(this.state.useCanPoint);
            if ( text > 0 && text <= parseInt(this.state.nowFocusProductPrice) && useablePoint >= text ) {
                const data = {
                    ...this.state.setPointList,
                    [this.state.nowFocusProductIdx]: {point: text, isEnable: true, isApplied: false, productIdx: this.state.nowFocusProductIdx, productPrice: this.state.nowFocusProductPrice}
                };
                await this.setState({setPointList: data});

                // let returnArray = [];
                // if ( this.state.selectedList.length > 0 ) {
                //     let selectedList = await this.state.selectedList.filter((info) => info.productIdx !== this.state.nowFocusProductIdx);
                //     console.log('selectedList', selectedList);
                //     returnArray = await this.setOnceChecked(text,this.state.nowFocusProductIdx,selectedList,'point',null);
                //     console.log('returnArray', returnArray);
                // } else {
                //     returnArray = await this.setOnceChecked(text,this.state.nowFocusProductIdx,[],'point',null);
                //     console.log('returnArray2', returnArray);
                // }
                // this.setState({
                //     usePoint: text,
                //     selectedList: returnArray
                // });
                // this.props.screenState.productList[this.state.nowFocusProductIndex].usePoint = text;

                // await this.totalCal(returnArray, 'point');
            } else {
                // const currentSetPoint = this.state.setPointList[this.state.nowFocusProductIdx];
                // const data = {
                //     ...this.state.setPointList,
                //     [this.state.nowFocusProductIdx]: {...currentSetPoint, isEnable: false, isApplied: false},
                // };
                // await this.setState({setPointList: data});
            }
        }
        // console.log('setPointList : ', this.state.setPointList);
    }

    applyPoint = async (index, productIdx) => {
        const currentPointSettng = this.state.setPointList[productIdx];
        let returnArray = [];
        if ( this.state.selectedList.length > 0 ) {
            let selectedList = await this.state.selectedList.filter((info) => info.productIdx !== currentPointSettng.productIdx);
            // console.log('selectedList', selectedList);
            returnArray = await this.setOnceChecked(currentPointSettng.point, currentPointSettng.productIdx, selectedList, 'point', null);
            // console.log('returnArray', returnArray);
        } else {
            returnArray = await this.setOnceChecked(currentPointSettng.point, currentPointSettng.productIdx, [], 'point', null);
            // console.log('returnArray2', returnArray);
        }
        this.setState({
            usePoint: currentPointSettng.point,
            selectedList: returnArray,
        });
        this.props.screenState.productList[index].usePoint = currentPointSettng.point;

        await this.totalCal(returnArray, 'point');

        let list = this.state.setPointList || [];
        const currentSetPoint = this.state.setPointList[productIdx];
        list[productIdx] = {...currentSetPoint, isApplied: true};
        this.setState({setPointList: list});
    };

    totalCal = async (returnArray,type) => {
        let totalPrice = 0;
        let totalUsedPoint = 0;
        await returnArray.forEach(function(element,index,array){ 
            totalPrice =  totalPrice +  parseInt(element.price)
            if ( element.isType === 'point') {
                totalUsedPoint =  totalUsedPoint +  parseInt(element.price)
            }
        })        
        this.setState({
            totalDiscount:parseInt(totalPrice)
        })
        // console.log('totalPrice', totalPrice)     
        if ( type === 'point') {
            this.setState({usedCanPoint:parseInt(totalUsedPoint)})
        }
    }

    
    onChangeTextInputTmp = async(point,data,idx) => {
        const numericRegex = /^([0-9]{1,100})+$/;
        if(numericRegex.test(point)) {            
            if ( point > 0 && point <= parseInt(data.price) ) {  
                let returnArray = [];  
                if ( this.state.selectedList.length > 0 ) {
                    let selectedList = await this.state.selectedList.filter((info) => info.productIdx !== data.productIdx);                       
                    returnArray = await this.setOnceChecked(point,data,selectedList,'point',null);  
                }else{
                    returnArray = await this.setOnceChecked(point,data,[],'point',null);  
                }                
                this.setState({
                    //usePoint:point,
                    selectedList : returnArray
                })
            }else{
                let selectedList = await this.state.selectedList.filter((info) => info.productIdx !== data.productIdx);   
                let returnArray = await this.setOnceCheckedMax(point,data,selectedList,'point',null);  
                this.setState({
                    selectedList: selectedList,
                });   
                
            }
        }else{
            let selectedList = await this.state.selectedList.filter((info) => info.productIdx !== data.productIdx);   
            // console.log('selectedList 22222', selectedList)    
            this.setState({
                selectedList : selectedList
            })
        }
        
        /*
        if ( text === '' ) this.setState({usePoint:0})
        if ( this.state.useCoupon > 0 && parseInt(text) > 0  )     {
      
            Alert.alert(
                "해커스통합앱",
                "포인트와 쿠폰은 함께 사용하실 수 없습니다.",
                [
                    {text: '확인', onPress: this.setState({usePoint:0})}
                ],
                { cancelable: false }
            ) 
        }else{
            const numericRegex = /^([0-9]{1,100})+$/;
            let useCoupon = this.state.useCoupon;
            if(numericRegex.test(text)) {            
                if ( text > 0 && this.state.useCanPoint >= text && this.state.goodsPrice >= text) {            
                    this.setState({
                        usePoint:text,
                        totalDiscount :  useCoupon +  parseInt(text)
                    })
                }
            }
        }
        */
    }

    
    
    selectFilter = async(tmpcouponData,data,index) => {

        let couponData = tmpcouponData[0]
        if( typeof couponData  !== 'undefined' ) {
         
            this.setState({
                nowFocusProductIdx: data.productIdx,
                nowFocusProductPrice: data.price,
                nowFocusProductIndex: index,
            })
            await this.setupFocus(data.productIdx,data.price,index)
            let CouponPrice = couponData.couponType === 'amount' ? couponData.couponAmount : parseInt(data.price)*parseInt(couponData.couponAmount)/100
            if ( CouponPrice > 0 && CouponPrice <= parseInt(data.price) ) {                  
                let returnArray = [];  
                if ( this.state.selectedList.length > 0 ) {
                    let selectedList = await this.state.selectedList.filter((info) => info.productIdx !== data.productIdx);                       
                    returnArray = await this.setOnceChecked(CouponPrice,data.productIdx,selectedList,'coupon',couponData.couponIdx);                      
                }else{
                    returnArray = await this.setOnceChecked(CouponPrice,data.productIdx,[],'coupon',couponData.couponIdx);                      
                }                
                this.setState({                    
                    selectedList : returnArray
                })
                await this.totalCal(returnArray,null);

                
            }else{
                /*
                let selectedList = await this.state.selectedList.filter((info) => info.productIdx !== data.productIdx);   
                let returnArray = await this.setOnceCheckedMax(CouponPrice,data.productIdx,selectedList,'coupon',couponData.couponIdx);  
                
                this.setState({
                    selectedList: selectedList
                });   
                await this.totalCal(returnArray,null);
                */
            }

        }else{            
            let selectedList = await this.state.selectedList.filter((info) => info.productIdx !== this.state.nowFocusProductIdx);
            this.setState({
                usePoint:0,
                selectedList : selectedList
            })
            await this.totalCal(selectedList,null);
        }

        /*
        if ( parseInt(this.state.usePoint) > 0 ){
            Alert.alert(
                "해커스통합앱",
                "포인트와 쿠폰은 함께 사용하실 수 없습니다.",
                [
                    {text: '확인', onPress: this.setState({usePoint:0})}
                ],
                { cancelable: false }
            ) 
        }else{
            try {
                let usePoint= this.state.usePoint;
                let useCoupon = 0;
                if ( this.state.useCanCoupon[filt-1].couponType === 'rate') {
                    useCoupon = this.state.goodsPrice*(this.state.useCanCoupon[filt-1].couponAmount/100) ;
                }else{
                    useCoupon = this.state.useCanCoupon[filt-1].couponAmount;
                }
                this.setState({
                    SelectCoupon : this.state.useCanCoupon[filt-1].couponIdx,
                    useCoupon : useCoupon,
                    totalDiscount :   parseInt(usePoint) +  parseInt(useCoupon)
                })
            }catch {                        
                return true;
            }
        }
        */
    }

    cancelSelection = async pdata => {
        // console.log('pdata222', pdata.productIdx)
        let selectedList = await this.state.selectedList.filter((info) => info.productIdx !== pdata.productIdx);
        // console.log('selectedList', selectedList)
        this.setState({
            selectedList: selectedList
        });
        await this.totalCal(selectedList, null);
    }
    applyDiscount = () => {
        if ( this.state.totalDiscount > 0 ) {
           this.props.screenState.applyPointCoupone(this.state);
        }
    }

    applydata = async () => {       
        let isPoint100 =  await this.checkPoint100(this.props.screenState.productList)
        // console.log('isPoint100', isPoint100)
        if ( !isPoint100 ) {
            Alert.alert(
                "해커스통합앱",
                "포인트 100포인트 단위로 사용해 주십시요",
                [
                    {text: '확인', onPress: null}
                ],
                { cancelable: false }
            ) 
        } else {
            this.props.screenState.applyPointCoupone(this.state)
        }
       
    }

    checkPoint100 = async(returnArray) => {
        let returnBool = true;
        await returnArray.forEach(function(element,index,array){             
            if ( typeof element.usePoint !== 'undefined') {
                // console.log('lement.usePoint%100', element.usePoint%100)
                if ( element.usePoint%100 !== 0 && element.usePoint > 0 ) {
                    returnBool =  false;
                }
            }
        }) 
        return returnBool;

    }

    render() {
        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        }else{
            return(
                <ScrollView style={ styles.container }>
                    {(this.state.cpInfoMessages && this.state.cpInfoMessages.length > 0) &&
                        this.state.cpInfoMessages.map((messages, index) => {
                            return (
                                <View style={{padding:10}} key={index}>
                                    <DropDown
                                        style={{flex:1,borderWidth:1,borderColor:'#ccc',borderRadius:5}}
                                        contentVisible={false}
                                        invisibleImage={IC_ARR_DOWN}
                                        visibleImage={IC_ARR_UP}
                                        header={
                                        <View style={{padding:5}}>
                                            <View style={{flex:1,paddingVertical:10,justifyContent:'center'}}>
                                                <Text style={styles.requestTitleText2}>
                                                    {messages.title || ''}
                                                </Text>
                                            </View>
                                        </View>
                                        }
                                    >
                                        <View style={{width:SCREEN_WIDTH ,backgroundColor:'#ebebeb',paddingVertical:10,paddingLeft:15,paddingRight:25}}>
                                            <HTMLConvert
                                                {...DEFAULT_PROPS}
                                                html={messages.content && CommonUtil.stripSlashes(messages.content) || ''}
                                            />
                                        </View>
                                    </DropDown>
                                </View>
                            )})
                    }

                    {/* <View style={{padding:10}}>
                        <DropDown                            
                            style={{flex:1,borderWidth:1,borderColor:'#ccc',borderRadius:5}}
                            contentVisible={false}
                            invisibleImage={IC_ARR_DOWN}
                            visibleImage={IC_ARR_UP}
                            header={
                            <View style={{padding:5}}>
                                <View style={{flex:1,paddingVertical:10,justifyContent:'center'}}>
                                    <Text style={styles.requestTitleText2}>
                                        쿠폰ㆍ포인트 적용 관심분야
                                    </Text>
                                </View>
                            </View>
                            }
                        >
                            <View style={{width:SCREEN_WIDTH-33 ,backgroundColor:'#ebebeb',padding:10}}>
                                <Text style={styles.requestTitleText3}>
                                    토익, 토익스피킹, 오픽, 영어문법, 중학영어, 텝스, 지텔프(G-TELP), 토플, GRE, IELTS, LSAT, TOPIK, 스페인어, 독일어, 프랑스어, 러시아어, 베트남어, 이탈리아어, 아랍어, 인도네시아어, 태국어, 포르투갈어, 중국어, 영어회화, SAP∙ACT
                                </Text>
                            </View>                                
                        </DropDown>
                    </View> */}
                    <View style={{paddingVertical:15,backgroundColor:DEFAULT_COLOR.base_color_222}}>
                        <View style={{flex:1,flexDirection:'row',paddingHorizontal:15}}>
                            <Text style={styles.requestTitleText}>보유포인트</Text>
                            <Text style={styles.requestTitleText}>{CommonFuncion.currencyFormat(parseInt(this.state.usedCanPoint))}/{CommonFuncion.currencyFormat(parseInt(this.state.useCanPoint))}</Text>
                            <Text style={styles.requestTitleText}>P</Text>
                            <Text style={styles.requestTitleText3}>|</Text>
                            <Text style={styles.requestTitleText}>보유쿠폰</Text>
                            <Text style={styles.requestTitleText}>{this.state.useCanCouponCount}</Text>
                            <Text style={styles.requestTitleText}>장</Text>
                        </View>
                    </View>
                    <View>
                        <View style={{flex:1,margin:15,paddingVertical:10,borderBottomColor:DEFAULT_COLOR.base_color_222,borderBottomWidth:1}}>
                            <Text style={styles.requestTitleText9}>결제 예정 강의</Text>
                        </View>
                        {(this.props.screenState.productList && !CommonUtil.isEmpty(this.props.screenState.productList)) &&
                        this.props.screenState.productList.map((item, seIndex) => {
                            let selectedList = this.state.selectedList;
                            let useCanCoupon = this.state.useCanCoupon;
                            let productData = Array.isArray(item.productData) === true ? item.productData[0] : item.productData;
                            let canUseCouponList = this.state.useCanCoupon.filter((info) => info.productIdx === productData.productIdx) || [];

                            /*
                            let canUseCouponList = []
                            useCanCoupon.forEach(function(element,index,array){                                       
                                console.log('element.productIdx',element.productIdx)
                                console.log('item.productIdx',productData.productIdx)                             
                                if ( element.productIdx === productData.productIdx ) {   
                                    console.log('element.ableCoupon', element.ableCoupon)
                                    element.ableCoupon.forEach(function(element2,index2,array2){                                       
                                        let isIndexOf = selectedList.findIndex(
                                            info2 => info2.couponIdx === element2.couponIdx
                                        );  
                                        console.log('isIndexOfn', isIndexOf)
                                        if ( isIndexOf != -1 ) {
                            
                                        }else{
                                            canUseCouponList.push({...element2})
                                        }
                                    })
                                    console.log('icanUseCouponList555',canUseCouponList)
                                }else{
                                    canUseCouponList = useCanCoupon.filter((info) => info.productIdx === productData.productIdx);     
                                }
                              
                            }) 
                            */
                            let ischeckedCoupon = this.state.selectedList.filter((info) => (info.productIdx === productData.productIdx && info.isType === 'coupon') );
                            let ischeckedPoint = this.state.selectedList.filter((info) => (info.productIdx === productData.productIdx && info.isType === 'point'));
                            {/* let myusePoint = this.state.setPointList[productData.productIdx] && this.state.setPointList[productData.productIdx].point || 0; */}
                            {/* let myusePoint = typeof item.usePoint !== 'undefined' && item.usePoint > 0 ? item.usePoint : ischeckedPoint.length > 0 ? ischeckedPoint[0].price : 0; */}

                                return(
                                    <View key={seIndex} style={{paddingVertical:20,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color}}>
                                        <View style={{flex:1,paddingVertical:10,paddingHorizontal:15}} key={seIndex}>
                                            <CustomTextR style={styles.requestTitleText8}>[강의]{productData.title}</CustomTextR>
                                        </View>
                                        <View style={{flex:1,marginHorizontal:15,paddingVertical:10,flexDirection:'row'}}>
                                            <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                                { ischeckedCoupon.length > 0 ?
                                                    <CustomTextR style={styles.requestTitleText2}>쿠폰 사용중</CustomTextR>
                                                    :
                                                    <Input
                                                        multiline={false}
                                                        maxLength={parseInt(productData.price)}
                                                        underlineColorAndroid='transparent'
                                                        style={{width:'95%',height:'90%',borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color,marginRight:10,alignItems:'flex-end'}}
                                                        //placeholder='0P'
                                                        keyboardType={'numeric'}
                                                        // value={parseInt(myusePoint)}
                                                        value={this.state.setPointList[productData.productIdx] && this.state.setPointList[productData.productIdx].point || 0}
                                                        onFocus={() => this.setupFocus(productData.productIdx,productData.price,seIndex)}
                                                        onChangeText={this.onChangeTextInput}
                                                        //onChangeText={(text)=>this.onChangeTextInputTmp(text,productData,seIndex)}
                                                        disabled={this.state.setPointList[productData.productIdx] && this.state.setPointList[productData.productIdx].isApplied}
                                                    />
                                                }
                                            </View>
                                            <View style={{flex:1}}>
                                                {this.state.setPointList[productData.productIdx] &&
                                                    this.state.setPointList[productData.productIdx].isApplied === true
                                                        ?   <Button
                                                                onPress={() => {
                                                                    this.setState({usePoint:0})
                                                                    this.calTotalDiscount(productData,seIndex);
                                                                    }
                                                                }
                                                                title="적용취소"
                                                                titleStyle={{color:DEFAULT_COLOR.base_color_444}}
                                                                buttonStyle={{borderColor:DEFAULT_COLOR.base_color_888,borderWidth:1}}
                                                                
                                                                type="outline"
                                                            />
                                                        :   <Button
                                                                onPress={() =>
                                                                    this.state.setPointList[productData.productIdx] && this.state.setPointList[productData.productIdx].isEnable === true ? this.applyPoint(seIndex, productData.productIdx) : console.log('적용불가')
                                                                    // this.applyDiscount();
                                                                }
                                                                title="적용"
                                                                titleStyle={{color: this.state.setPointList[productData.productIdx] && this.state.setPointList[productData.productIdx].isEnable === true ? DEFAULT_COLOR.base_color_444 : DEFAULT_COLOR.base_color_ccc}}
                                                                buttonStyle={{borderColor: this.state.setPointList[productData.productIdx] && this.state.setPointList[productData.productIdx].isEnable === true ? DEFAULT_COLOR.base_color_888 : DEFAULT_COLOR.base_color_ccc, borderWidth:1}}
                                                                type="outline"
                                                            />
                                                }

                                                {/* {ischeckedPoint.length > 0 ?
                                                <Button
                                                    onPress={() => {
                                                        this.setState({usePoint:0})
                                                        this.calTotalDiscount(productData,seIndex);
                                                        }
                                                    }
                                                    title="적용취소"
                                                    titleStyle={{color:DEFAULT_COLOR.base_color_444}}
                                                    buttonStyle={{borderColor:DEFAULT_COLOR.base_color_888,borderWidth:1}}
                                                    
                                                    type="outline"
                                                />
                                                :
                                                <Button
                                                    onPress={() => 
                                                        this.applyPoint(seIndex)
                                                        // this.applyDiscount();
                                                    }
                                                    title="적용"
                                                    titleStyle={{color:DEFAULT_COLOR.base_color_ccc}}
                                                    buttonStyle={{borderColor:DEFAULT_COLOR.base_color_ccc,borderWidth:1}}
                                                    type="outline"
                                                />
                                                } */}
                                            </View>
                                        </View>
                                        { 
                                            canUseCouponList.length === 0 ?
                                            <View style={{flex:1,borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:5,margin:10,paddingHorizontal:10}}>
                                                <View style={{flex:1,paddingVertical:10,justifyContent:'center'}}>
                                                    <CustomTextR style={styles.requestTitleText6}>사용 가능한 쿠폰이 없습니다 </CustomTextR>
                                                </View>
                                            </View>
                                            :
                                            <View style={{flex:1,flexDirection:'row',borderWidth:1,borderRadius:5,margin:10,paddingHorizontal:10,borderColor: (ischeckedPoint.length > 0 || CommonUtil.isEmpty(canUseCouponList[0].ableCoupon) || (!CommonUtil.isEmpty(canUseCouponList[0].ableCoupon) && canUseCouponList[0].ableCoupon.length === 0)) ? DEFAULT_COLOR.input_border_color : DEFAULT_COLOR.base_color_444}}>
                                                <View style={{flex:5,justifyContent:'center',alignItems:'center'}}>
                                                    {ischeckedPoint.length > 0
                                                        ?   <CustomTextR style={styles.requestTitleText6}>포인트 사용중</CustomTextR>
                                                        :   CommonUtil.isEmpty(canUseCouponList[0].ableCoupon) || (!CommonUtil.isEmpty(canUseCouponList[0].ableCoupon) && canUseCouponList[0].ableCoupon.length === 0)
                                                            ?   <CustomTextR style={styles.requestTitleText6}>사용 가능한 쿠폰이없습니다.</CustomTextR>
                                                            :   <SelectCoupon
                                                                    isSelectSingle
                                                                    style={{borderWidth:0,justifyContent:'center'}}
                                                                    selectedTitleStyle={{fontFamily:DEFAULT_CONSTANTS.defaultFontFamilyRegular,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:DEFAULT_COLOR.base_color_444,letterSpacing:-0.7}}
                                                                    colorTheme={DEFAULT_COLOR.lecture_base}
                                                                    popupTitle="쿠폰을 선택해주세요"
                                                                    title={'쿠폰을 선택해주세요'}
                                                                    showSearchBox={false}
                                                                    cancelButtonText="적용취소"
                                                                    selectButtonText="선택"                                
                                                                    data={canUseCouponList[0].ableCoupon || []}
                                                                    alreadyUsed={this.state.selectedList}
                                                                    focusProductIdx={productData.productIdx}
                                                                    selectedIdx={ischeckedCoupon}
                                                                    //selectedusePoint={this.state.usePoint}
                                                                    cancelSelection={()=>this.cancelSelection(productData)}
                                                                    onSelect={data => {
                                                                        this.selectFilter(data,productData,seIndex)
                                                                    }}
                                                                    onRemoveItem={data => {
                                                                        console.log('onRemoveItem')
                                                                        
                                                                    }}                                
                                                                /> 
                                                    }
                                                    
                                                </View>
                                                <View style={{flex:1,paddingVertical:10,justifyContent:'center',alignItems:'flex-end'}}>
                                                    <Icon name="down" size={PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)} color={DEFAULT_COLOR.base_color_666} />
                                                </View>
                                            </View>
                                            /*
                                            <View style={{flex:1,flexDirection:'row',borderWidth:1,borderColor:DEFAULT_COLOR.base_color_666,borderRadius:5,margin:10,paddingHorizontal:10}}>
                                                <View style={{flex:7,paddingVertical:10,justifyContent:'center'}}>
                                                    <Text style={styles.requestTitleText2}>쿠폰을 선택해주세요 </Text>
                                                </View>
                                                <View style={{flex:1,paddingVertical:10,justifyContent:'center',alignItems:'flex-end'}}>
                                                    <Icon name="down" size={PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)} color={DEFAULT_COLOR.base_color_222} />
                                                </View>
                                            </View>
                                            */
                                            }
                                    </View>
                                )
                            })
                        }
                    </View>
                    <View style={{paddingVertical:15,backgroundColor:DEFAULT_COLOR.input_bg_color,borderTopColor:DEFAULT_COLOR.input_border_color,borderTopWidth:1}}>
                        <View style={{flex:1,flexDirection:'row',paddingHorizontal:15}}>
                            <View style={{flex:1}}>
                                <Text style={styles.requestTitleText4}>총 할인금액</Text>
                            </View>
                            <View style={{flex:1,alignItems:'flex-end'}}>
                                <Text style={styles.requestTitleText4}>{this.state.totalDiscount>0 && '-'}{CommonFuncion.currencyFormat(this.state.totalDiscount)}원</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.canPush}>
                        <View style={{flex:1,paddingHorizontal:15}}>
                            <TouchableOpacity style={{flex:1,alignItems:'center'}} onPress={()=> this.applydata()}>
                                <Text style={styles.requestTitleText5}>적용</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    requestTitleText : {
        color:DEFAULT_COLOR.base_color_fff,fontWeight:'bold',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),paddingHorizontal:5
    },
    requestTitleText5 : {
        color:DEFAULT_COLOR.base_color_fff,fontWeight:'bold',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium),paddingHorizontal:5
    },
    requestTitleText3 : {
        color:DEFAULT_COLOR.base_color_ccc,fontWeight:'bold',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),paddingHorizontal:5
    },
    requestTitleText6 : {
        color:DEFAULT_COLOR.base_color_ccc,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),paddingHorizontal:5
    },
    requestTitleText4 : {
        color:DEFAULT_COLOR.lecture_base,fontWeight:'bold',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),paddingHorizontal:5
    },
    requestTitleText2 : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },
    requestTitleTextHead : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium)
    },
    requestTitleText3 : {
        color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },
    requestTitleText8 : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },
    requestTitleText9 : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),fontWeight:'bold'
    },
    inputDisable : {
        borderWidth:1,borderColor:'#ccc',borderRadius:5,backgroundColor:'#f7f7f7'
    },
    inputAble : {
        borderWidth:1,borderColor:'#ccc',borderRadius:5
    },
    defaultPush : {
        paddingVertical:15,backgroundColor:DEFAULT_COLOR.base_color_ccc
    },
    canPush : {
        paddingVertical:15,backgroundColor:DEFAULT_COLOR.lecture_base
    }
});

function mapStateToProps(state) {
    return {
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
    };
}
export default connect(mapStateToProps, null)(CouponPointScreen);