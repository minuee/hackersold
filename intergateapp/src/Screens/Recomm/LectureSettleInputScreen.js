import React from 'react';
import {StyleSheet, Text, View, StatusBar,TextInput,TouchableOpacity ,Dimensions,ScrollView,Animated,Platform,Image,Alert,PixelRatio} from 'react-native';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Icon9 from 'react-native-vector-icons/MaterialCommunityIcons';
Icon9.loadFont();
import Toast from 'react-native-tiny-toast';
import {Button,Overlay,CheckBox,Input} from 'react-native-elements';

import DaumPostcode from '../../Utils/DaumPostCode';
import CouponPointScreen from './CouponPointScreen';
import DropDown from '../../Utils/DropDown';

const IC_ARR_DOWN = require('../../../assets/icons/ic_arr_down.png');
const IC_ARR_UP = require('../../../assets/icons/ic_arr_up.png');

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import styles from '../../Style/Recomm/LectureSettleInputScreen';
import {CustomText, CustomTextR, CustomTextB, CustomTextM, CustomTextL, TextRobotoM, TextRobotoB} from '../../Style/CustomText';

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

class LectureSettleInputScreen extends React.Component {

    constructor(props) {
        super(props);        
        this.state = {
            selectItem:1,
            isselectTab : 1,
            isVisibleOverlay : false,
            showModal : false,
            showModalCoupon : false,
            settleMethodeIndex : 0,
            settleMethodeCode : 'card',
            settleMethodeName : '신용/체크카드',
            settleItems : [
                { index :1, title : '신용/체크카드' , icon : 30, code : 'card' ,seleced : true,iconimg : 'reactserver.hackers.com/assets/react/icons/icon_payment_card.png' },
                { index :2, title : '무통장입금' , icon : 35 ,code : 'vbank',seleced : false,iconimg : 'reactserver.hackers.com/assets/react/icons/icon_payment_bank.png' },
                { index :3, title : '실시간계좌이체' , icon : 66,code : 'trans',seleced : false,iconimg : 'reactserver.hackers.com/assets/react/icons/icon_payment_realtime.png'  },
                //{ index :4, title : '페이나우' , icon : 66,code : 'paynow',seleced : false,iconimg : 'reactserver.hackers.com/assets/react/icons/icon_payment_paynow.png'  },
                //{ index :5, title : '페이코' , icon : 66,code : 'payci',seleced : false,iconimg : 'reactserver.hackers.com/assets/react/icons/icon_payment_payco.png'  },
                //{ index :6, title : '카카오페이' , icon : 66,code : 'kakao',seleced : false,iconimg : 'reactserver.hackers.com/assets/react/icons/icon_payment_kakaopay.png'  }
            ],
            addressNew : false,
            addressData_Email : '',
            addressData_Name :'',
            addressData_zipcode : '',
            addressData_address : '',
            addressData_addressDetail : '',
            addressData_phone01 : '010',
            addressData_phone02 : '010',
            addressData_phone03 : '010',
            addressData_message :  '',
            agreeCheck01 : {checked : true, title : '결제관련 개인정보 처리업무 위탁 및 개인정보수집동의 안내에 모두 동의합니다.'},
            agreeCheck02 : {checked : true, title : '개인정보 수집동의'},
            agreeCheck03 : {checked : true, title : '개인정도 제3자 위탁동의'},
            agreeCheck04 : {checked : true, title : '전자결제정보 수신동의'},
            
            productType : this.props.navigation.state.params.productType,
            productList　 : this.props.navigation.state.params.productList,
            checkCartList : this.props.navigation.state.params.checkCartList,
            optionSumPrice : this.props.navigation.state.params.optionSumPrice,
            isDeliveryPrice : this.props.navigation.state.params.isDeliveryPrice,
            orderNo : this.props.navigation.state.params.orderNo,

            applyPointCoupone : this.applyPointCoupone.bind(this),
            closeModalCoupon : this.closeModalCoupon.bind(this),
            //lectureInfo : this.props.navigation.state.params.lectureInfo,
            //lectureIdx : this.props.navigation.state.params.lectureIdx,
            memberInfo : [],
            baseTotalGoodsPrice : 0,
            baseTotalOptionsPrice : 0,
            baseTotalDiscountPrice : 0,
            baseFinalySettlePrice : 0,
            baseTotalPrePoint : 0,
            iamPortTokenKey : null,
            // 쿠폰전달받는곳            
            discountPrice : 0,
            useCouponPrice : 0,
            usePoint : 0,
            useCouponPoint : [],
            paymentInfoMessages: [], // 결제 안내메세지,

            // 재수강 수강연장
            isRepeatLecture : typeof this.props.navigation.state.params.isRepeatLecture !== 'undefined' ? this.props.navigation.state.params.isRepeatLecture  : false,
            myClassApiDomain: this.props.navigation.state.params && this.props.navigation.state.params.myClassApiDomain || '',
            myClassApiKey: this.props.navigation.state.params && this.props.navigation.state.params.myClassApiKey || '',

            userToken: this.props.userToken,
        }


        // console.log('LectureSettleInputScreen.js > constructor()', 'productType = ' + this.props.navigation.state.params.productType)
        // console.log('LectureSettleInputScreen.js > constructor()', 'productList = ' + JSON.stringify(this.props.navigation.state.params.productList))
        // console.log('LectureSettleInputScreen.js > constructor()', 'checkCartList = ' + JSON.stringify(this.props.navigation.state.params.checkCartList))
        // console.log('LectureSettleInputScreen.js > constructor()', 'optionSumPrice = ' + JSON.stringify(this.props.navigation.state.params.optionSumPrice))
        // console.log('LectureSettleInputScreen.js > constructor()', 'isDeliveryPrice = ' + this.props.navigation.state.params.isDeliveryPrice)
        // console.log('LectureSettleInputScreen.js > constructor()', 'orderNo = ' + this.props.navigation.state.params.orderNo)
        // console.log('LectureSettleInputScreen.js > constructor()', 'isRepeatLecture = ' + (typeof this.props.navigation.state.params.isRepeatLecture !== 'undefined' ? this.props.navigation.state.params.isRepeatLecture  : false))
        // console.log('LectureSettleInputScreen.js > constructor()', 'myClassApiDomain = ' + (this.props.navigation.state.params && this.props.navigation.state.params.myClassApiDomain || ''))
        // console.log('LectureSettleInputScreen.js > constructor()', 'myClassApiKey = ' + (this.props.navigation.state.params && this.props.navigation.state.params.myClassApiKey || ''))
    }

    
    static navigationOptions = ({navigation}) => {

        //console.log('question 2',navigation)
        const params =  navigation.state.params || {};        
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
    };

    _setNavigationParams(){
        // let newtitle = <View style={{flexGrow:1,textAlign:'center',alignItems:'center'}}><Text style={{color:'#fff',fontSize:DEFAULT_TEXT.head_medium}}>결제하기</Text></View>;
        // let newheaderLeft = <TouchableOpacity onPress={()=>this.props.navigation.goBack(null)} style={{flexGrow:1,textAlign:'center',alignItems:'center',paddingLeft:10}}><Icon name="left" size={25} color="#fff" /></TouchableOpacity>
        let newtitle = <View style={{flexGrow:1,textAlign:'center',alignItems:'center'}}><CustomTextR style={{color:'#fff',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),letterSpacing:PixelRatio.roundToNearestPixel(-0.96)}}>결제하기</CustomTextR></View>;
        let newheaderLeft = <TouchableOpacity onPress={()=>this.props.navigation.goBack(null)} style={{flexGrow:1,textAlign:'center',alignItems:'center',paddingLeft:20}}><Image source={require('../../../assets/icons/btn_back_page.png')} style={{width: 17, height: 17}} /></TouchableOpacity>
        let newheaderRight = <View style={{flexGrow:1,textAlign:'center',alignItems:'center'}}></View>
        this.props.navigation.setParams({
            newtitle,
            newheaderLeft,
            newheaderRight
        });
    }

    async UNSAFE_componentWillMount() {         
        //console.log('ssss', this.props.navigation.state.params.productList)
        await this._setNavigationParams();
        await this.refreshTextBookInfo(this.props.userToken.memberIdx)
        this.calPrice()

    } 

    calPrice = async() => {
        let reBaseTotalGoodsPrice =  0;
        let rebaseTotalOptionsPrice =  0;
        let reBaseTotalDiscountPrice =  0;        
        let reBaseTotalPrePoint = 0;
        
        if ( this.state.productType === 'mp3' ) {
            
            await this.props.navigation.state.params.productList.forEach(function(element,index,array){      
                reBaseTotalGoodsPrice = parseInt(reBaseTotalGoodsPrice) + parseInt(element.data.price)
                reBaseTotalPrePoint = parseInt(reBaseTotalPrePoint) + parseInt(element.data.prePoint)
            });
        }else{
            await this.props.navigation.state.params.productList.forEach(function(element,index,array){   
                
                let productData = Array.isArray(element.productData) === true ? element.productData[0] : element.productData;  
                //console.log('3333', productData)  
                reBaseTotalGoodsPrice = parseInt(reBaseTotalGoodsPrice) + parseInt(productData.price)    
                reBaseTotalPrePoint = parseInt(reBaseTotalPrePoint) + parseInt(productData.prePoint)
                reBaseTotalDiscountPrice = parseInt(reBaseTotalDiscountPrice) //parseInt(reBaseTotalDiscountPrice) + parseInt(element.discountAmount)
                if ( typeof element.optionList !== 'undefined'  ) {
                    element.optionList.forEach(function(element2,index2,array2){      
                        if (typeof element2.price !== 'undefined') {
                            rebaseTotalOptionsPrice = parseInt(rebaseTotalOptionsPrice) + parseInt(element2.price)
                        }else{
                            rebaseTotalOptionsPrice = parseInt(rebaseTotalOptionsPrice) + parseInt(element2.info.price)
                        }
                        
                    });
                }
                
            });
            
        }

        //console.log('rebaseTotalOptionsPrice',rebaseTotalOptionsPrice)
        this.setState({
            baseTotalGoodsPrice : reBaseTotalGoodsPrice,
            baseTotalOptionsPrice : rebaseTotalOptionsPrice,
            baseTotalDiscountPrice : reBaseTotalDiscountPrice,
            baseFinalySettlePrice : parseInt(reBaseTotalGoodsPrice) + parseInt(rebaseTotalOptionsPrice),
            baseTotalPrePoint : reBaseTotalPrePoint,
        })

    }

    // 안내메세지
    setMessage = async () => {
        const serviceID = await CommonUtil.getServiceID();
        if (!serviceID) {
            Toast.show('안내메세지 로딩를 위한 서비스ID가 없습니다.');
            return;
        }

        const infoMessages = await CommonUtil.getInfoMessage(serviceID);
        if (infoMessages.result === true) {
            if (infoMessages.response.code === '0000') {
                this.setState({
                    paymentInfoMessages: infoMessages.response.data.message.payment || [],
                });
            } else {
                Toast.show(infoMessages.response.message || '안내메세지 로딩 실패');
            }
        } else {
            Toast.show(infoMessages.error || '안내메세지 로딩 실패');
        }
    };

    refreshTextBookInfo = async(memberIdx) => {
        if ( memberIdx ) {
            // console.log('this.props.myInterestCodeOne : ', this.props.myInterestCodeOne);
            let aPIsDomain =
                this.state.isRepeatLecture
                    ? this.state.myClassApiDomain
                    : typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
            let aPIsAuthKey =
                this.state.isRepeatLecture
                    ? this.state.myClassApiKey
                    : typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey;

            // console.log('refreshTextBookInfo()', 'aPIsAuthKey = ' + aPIsAuthKey)
            // console.log('refreshTextBookInfo()', 'url = ' + aPIsDomain + '/v1/member/' + memberIdx + '/info?orderNo=' + this.state.orderNo)

            // console.log('LectureSettleInputScreen.js > refreshTextBookInfo()', 'url = ' + aPIsDomain + '/v1/member/' + memberIdx + '/info?orderNo=' + this.state.orderNo)

            await CommonUtil.callAPI( aPIsDomain + '/v1/member/' + memberIdx + '/info?orderNo=' + this.state.orderNo,{
                method: 'GET', 
                headers: new Headers({
                    Accept: 'application/json',                
                    'Content-Type': 'application/json; charset=UTF-8',
                    'apiKey': aPIsAuthKey
                }), 
                    body:null
                },10000
                ).then(response => {

                    // console.log('LectureSettleInputScreen.js > refreshTextBookInfo()', 'response = ' + JSON.stringify(response))

                    if (response && typeof response === 'object' || Array.isArray(response) === false) {
                        if ( response.code !== '0000' ) {
                            // console.log('배송주소 로딩: 회원 정보 조회 실패 : ', response.message);
                            this.failCallAPi(response.message || '회원 배송 정보 로딩: 배송 정보 없음');
                        }else{               
                            // console.log('daaaaa',response.data.member.memberInfo);
                            !CommonUtil.isEmpty(response.data.member.memberInfo) &&
                                this.setState({
                                    loading : false,
                                    memberInfo : response.data.member.memberInfo,    
                                    addressData_Name : response.data.member.memberInfo.Name || '',
                                    addressData_Email : response.data.member.memberInfo.Email || '',
                                    addressData_zipcode : response.data.member.memberInfo.Postcode || '',
                                    addressData_address : response.data.member.memberInfo.Address || '',
                                    addressData_phone01 : response.data.member.memberInfo.TEL1 || '',
                                    addressData_phone02 : response.data.member.memberInfo.TEL2 || '',
                                    addressData_phone03 : response.data.member.memberInfo.TEL3 || ''
                                })
                        }

                    }else{
                        // console.log('배송주소 로딩: 회원 정보 조회 실패 - response');
                        this.failCallAPi('회원 배송 정보 로딩: 조회 실패');
                    }

                    this.setState({loading:false})    

                
                })
                .catch(err => {
                    console.log('회원 배송 정보 조회 error => ', err);
                    this.failCallAPi()
            });
        }else{
            this.failCallAPi();
            
        }

        
    }

    failCallAPi = msg => {

        let message = msg || "데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);
    
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.6);
    animatedHeightCoupon = new Animated.Value(SCREEN_HEIGHT * 0.8);    

    selectSettleMethode = async(methode,code,name) => {
        this.setState({
            settleMethodeIndex : methode,
            settleMethodeCode : code,
            settleMethodeName : name,

        })
    }

    closeModal = () => this.setState({ showModal: false });
    showModal = () => this.setState({ showModal: true });
    closeModalCoupon = () => this.setState({ showModalCoupon: false });
    showModalCoupon = () => this.setState({ showModalCoupon: true });

    //우편번호 정리
    setAddress = (data) => {
        //console.log('address', data);
        this.setState({
            addressData_zipcode : data.zonecode,
            addressData_address : data.roadAddress
        });
        this.closeModal();
    }

    upButtonHandler = () => {        
        this.ScrollView.scrollTo({ x: 0,  animated: true });
    };

    apppyCouponData = async(returnArray) => {
        let usedPoint = 0;
        let usedCoupon = 0;
        await returnArray.forEach(function(element,index,array){             
            if ( element.isType === 'point') {
                usedPoint =  usedPoint +  parseInt(element.price)
            }else if ( element.isType === 'coupon') {
                usedCoupon =  usedCoupon +  parseInt(element.price)
            }
        })    

        return [usedPoint,usedCoupon];
        
    }

    //쿠폰적용
    applyPointCoupone = async(data) => {
       
        
        // let isApiUpdate = await this.updateApiCoupon(data.selectedList);
        // console.log('isApiUpdate',isApiUpdate);
        
        // if ( isApiUpdate === '0000') {
            
            let pointcoupon = await this.apppyCouponData(data.selectedList);
            // console.log('pointcoupon',pointcoupon);
            {CommonFuncion.currencyFormat(parseInt(this.state.baseTotalOptionsPrice) + parseInt(this.state.baseTotalGoodsPrice) + (this.state.isDeliveryPrice ? 2500 : 0) - this.state.baseTotalDiscountPrice - this.state.discountPrice)}

            let resetbaseFinalySettlePrice =  parseInt(this.state.baseFinalySettlePrice) - parseInt(data.totalDiscount)
            let resetbaseTotalDiscountPrice = parseInt(data.totalDiscount) //parseInt(this.state.baseTotalDiscountPrice) + parseInt(data.totalDiscount)
            this.setState({
                discountPrice : parseInt(data.totalDiscount),            
                useCouponPoint : data.selectedList,
                baseFinalySettlePrice :resetbaseFinalySettlePrice,
                baseTotalDiscountPrice : resetbaseTotalDiscountPrice,
                usePoint : pointcoupon[0],
                useCouponPrice : pointcoupon[1],
            })
            this.setState({showModalCoupon:false});
        // }else if ( isApiUpdate === '2006' ) {
        //     Alert.alert(
        //         "해커스통합앱",
        //         "이미 사용된 쿠폰입니다\n다시 선택해주십시요",
        //         [
        //             {text: '확인', onPress: this.errorBack }
        //         ],
        //         { cancelable: false }
        //     ) 
        // }else{
        //     Alert.alert(
        //         "해커스통합앱",
        //         "포인트/쿠폰 적용중 오류가 발생하였습니다 \n포인트/쿠폰을 다시 선택해주십시요.",
        //         [
        //             {text: '확인', onPress: this.errorBack }
        //         ],
        //         { cancelable: false }
        //     ) 
        // }
        
    }

    errorBack = async() => {
        //this.props.navigation.goBack(null)
        await this.calPrice()
        this.setState({
            discountPrice : 0,
            useCouponPoint : [],            
            usePoint : 0,
            useCouponPrice : 0,
        })
        this.setState({showModalCoupon:false})
    }

    updateApiCoupon = async(coupondata) => {
        let returnVal = '9999';
        if ( this.state.orderNo ) {
            let paymentData =  [];
            await coupondata.forEach(function(element,index,array){            
            paymentData.push({
                    productIdx : element.productIdx,
                    pointAmount : element.isType === 'point' ? element.price : 0,
                    couponAmount : element.isType === 'coupon' ? element.price : 0,
                    couponIdx : element.isType === 'coupon' ? element.couponIdx : ''
                });            
            });
            const memberIdx = this.props.userToken.memberIdx;       
            const formData = new FormData();        
            formData.append('memberIdx', memberIdx);
            formData.append('paymentStatus', 1); //안씀
            formData.append('payment',JSON.stringify(paymentData));

            let aPIsDomain =
                this.state.isRepeatLecture
                    ? this.state.myClassApiDomain
                    : typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
            let aPIsAuthKey =
                this.state.isRepeatLecture
                    ? this.state.myClassApiKey
                    : typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey;

            await CommonUtil.callAPI( aPIsDomain + '/v1/payment/' + this.state.orderNo + '/memberinfo',{
                method: 'POST', 
                headers: new Headers({
                    Accept: 'application/json',                
                    'Content-Type': 'multipart/form-data',
                    'apiKey': aPIsAuthKey
            }), 
                body:formData
            },10000
            ).then(response => {
                // console.log('updateApiCoupon()', 'response = ' + JSON.stringify(response))
                if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                    if ( response.code === '0000' ) {
                        returnVal =  '0000';
                    }else if ( response.code === '2006' ) {
                        returnVal =  '2006';
                    }else{
                        returnVal = '9999';
                    }
                }else{
                    returnVal = false;
                }
            })
            .catch(err => {
                console.log('login error => ', err);
                returnVal = '9999';
            });
        }else{
            returnVal = '9999';
        }

        return returnVal;
    }

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

    agreeCheck = (idx,bool) => {
        this.state.agreeCheck[idx] =  bool;
    }

    changeAddress = (bool) => {
        if ( bool ) {
            this.setState({
                addressNew : true,
                addressData_Name : '',
                addressData_zipcode : '',
                addressData_address : '',
                addressData_phone01 : '',
                addressData_phone02 : '',
                addressData_phone03 : ''
            })
        }else{
            let addressData = this.state.memberInfo;
            this.setState({
                addressNew : false,
                addressData_Name : addressData.Name,
                addressData_zipcode : addressData.Postcode,
                addressData_address : addressData.Address,
                addressData_phone01 : addressData.TEL1,
                addressData_phone02 : addressData.TEL2,
                addressData_phone03 : addressData.TEL3
            })

        }
    }
    
    getTokenKey = async () => {
        console.log('iamPortTokenKey respons 2222 e')
        const formData = new FormData();        
        formData.append('imp_key', DEFAULT_CONSTANTS.iamPortAPIKey);
        formData.append('imp_secret', DEFAULT_CONSTANTS.iamPortAPISecrentKey);

        // console.log('LectureSettleInputScreen.js > getTokenKey()', 'url = https://api.iamport.kr/users/getToken')
        // console.log('LectureSettleInputScreen.js > getTokenKey()', 'formData = ' + JSON.stringify(formData))

        await CommonUtil.callAPI( 'https://api.iamport.kr/users/getToken',{
            method: 'POST', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8'
            }), 
                body:formData
            },10000
            ).then(response => {
            //    console.log('LectureSettleInputScreen.js > getTokenKey()', 'response = ' + JSON.stringify(response))
               if ( typeof response.response.access_token !== 'undefined') {
                   this.setState({iamPortTokenKey : response.response.access_token})
                   return response.response.access_token;
               }else{
                   return null;
               }
            })
            .catch(err => {
                return null;
            });

    }
    tempSaveProcess = async() => {
        let iamPortTokenKey = await this.getTokenKey();
        console.log('iamPortTokenKey', this.state.iamPortTokenKey)
        if ( this.state.iamPortTokenKey !== null ) {
            this.props.navigation.navigate('LectureSettleScreen',{
                settleMethodeIndex : this.state.settleMethodeIndex,
                settleMethodeCode : this.state.settleMethodeCode,
                settleMethodeName : this.state.settleMethodeName,
                addressNew : this.state.addressNew,
                addressData_Name : this.state.addressData_Name,            
                addressData_Email : this.state.addressData_Email,
                addressData_zipcode : this.state.addressData_zipcode,
                addressData_address : this.state.addressData_address,
                addressData_addressDetail : this.state.addressData_addressDetail,
                addressData_phone01 : this.state.addressData_phone01,
                addressData_phone02 : this.state.addressData_phone02,
                addressData_phone03 : this.state.addressData_phone03,
                addressData_message :  this.state.addressData_message,
                discountPrice : this.state.discountPrice,
                useCouponPrice : this.state.useCouponPrice,
                usePoint : this.state.usePoint,
                useCouponPoint : this.state.useCouponPoint,
                productType : this.state.productType,
                productList　 : this.state.productList,
                checkCartList : this.state.checkCartList,
                optionSumPrice : this.state.optionSumPrice,
                isDeliveryPrice : this.state.isDeliveryPrice,
                orderNo : this.state.orderNo,
                memberInfo : this.state.memberInfo,
                baseTotalGoodsPrice : this.state.baseTotalGoodsPrice,
                baseTotalOptionsPrice : this.state.baseTotalOptionsPrice,
                baseTotalDiscountPrice : this.state.baseTotalDiscountPrice,
                baseFinalySettlePrice : this.state.baseFinalySettlePrice,
                baseTotalPrePoint : this.state.baseTotalPrePoint,
                isRepeatLecture : this.state.isRepeatLecture,
                myClassApiDomain : this.state.myClassApiDomain,
                myClassApiKey : this.state.myClassApiKey,
                iamPortTokenKey : this.state.iamPortTokenKey
            })
        }
    }

    requestLecture = async() => {

        //console.log('this.state.addressData_zipcode', this.state.addressData_zipcode)
        //console.log('this.state.addressData_address', this.state.addressData_address)
        //console.log('this.state.addressData_addressDetail', this.state.addressData_addressDetail)

        if ( this.state.productType !== 'mp3' && !this.state.isRepeatLecture ) {
            if ( !this.state.addressData_zipcode ||  !this.state.addressData_address || !this.state.addressData_addressDetail  ) {
                let message = "`주소정보` 를 입력해 주세요";
                let timesecond = 2000;
                CommonFuncion.fn_call_toast(message,timesecond);
                return false;
            }

            if ( !this.state.addressData_Name ) {
                let message = "`받으시는 분` 를 입력해 주세요";
                let timesecond = 2000;
                CommonFuncion.fn_call_toast(message,timesecond);
                return false;
            }   

            if ( !this.state.addressData_phone01 ||  !this.state.addressData_phone02 || !this.state.addressData_phone03  ) {
                let message = "`연락처` 를 입력해 주세요";
                let timesecond = 2000;
                CommonFuncion.fn_call_toast(message,timesecond);
                return false;
            }  
        }    

        if ( this.state.agreeCheck01.checked === false) {
            let message = "`" + this.state.agreeCheck01.title +"` 항목의 \n동의가 체크되지 않았습니다.";
            let timesecond = 2000;
            CommonFuncion.fn_call_toast(message,timesecond);
            return false;
        }
        if ( this.state.agreeCheck02.checked === false) {
            let message = "`" + this.state.agreeCheck02.title +"` 항목의 \n동의가 체크되지 않았습니다.";
            let timesecond = 2000;
            CommonFuncion.fn_call_toast(message,timesecond);
            return false;
        }
        if ( this.state.agreeCheck03.checked === false) {
            let message = "`" + this.state.agreeCheck03.title +"` 항목의 \n동의가 체크되지 않았습니다.";
            let timesecond = 2000;
            CommonFuncion.fn_call_toast(message,timesecond);
            return false;
        }
        if ( this.state.agreeCheck04.checked === false) {
            let message = "`" + this.state.agreeCheck04.title +"` 항목의 \n동의가 체크되지 않았습니다.";
            let timesecond = 2000;
            CommonFuncion.fn_call_toast(message,timesecond);
            return false;
        }

        if ( this.state.selectedGoods !== null  ) {
            Alert.alert(
                "해커스통합앱 : 수강신청",
                "결제하시겠습니까?",
                [
                    {text: '네', onPress: this.tempSaveProcess.bind(this)},
                    {text: '아니오'},
                ],
                { cancelable: false }
            ) 
        }else{
            let message = "상품선택중 오류가 발생하였습니다.";
            let timesecond = 2000;
            CommonFuncion.fn_call_toast(message,timesecond);

        }

        
    }

    checkAllAgree = () => {
        const isCheckAll = !this.state.agreeCheck01.checked;
        this.setState({
            loading: true,
            agreeCheck01: {...this.state.agreeCheck01, checked: isCheckAll},
            agreeCheck02: {...this.state.agreeCheck02, checked: isCheckAll},
            agreeCheck03: {...this.state.agreeCheck03, checked: isCheckAll},
            agreeCheck04: {...this.state.agreeCheck04, checked: isCheckAll},
        });
    };

    render() {

        return (
            <View style={{flex:1}}>
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
                    //onMomentumScrollEnd = {({nativeEvent}) => { }}
                    //onScrollEndDrag ={({nativeEvent}) => { }} 
                    style={styles.container}
                >
                    { Platform.OS == 'android' && <StatusBar backgroundColor={DEFAULT_COLOR.lecture_base} translucent={false}  barStyle="dark-content" />}
                    <View style={styles.container}>
                        <View style={styles.requestTitleWrapper}>
                            <View style={{padding:5}}>
                                <CustomTextB style={styles.requestTitleText}>신청내역</CustomTextB>
                            </View>                        
                        </View>
                        {   
                            this.state.productType === 'mp3'
                            ?
                            this.props.navigation.state.params.productList.map((item, seIndex) => {
                                return(
                                    <View style={this.props.navigation.state.params.productList.length == (seIndex+1 ) ? styles.requestGoodsTitleWrap : styles.requestGoodsTitleWrap2} key={seIndex}>
                                        <View style={styles.requestGoodsOptionWrap}>
                                            <View style={{padding:5}}>
                                                <CustomTextR style={styles.requestGoodsTitleText}>{item.data.title || this.props.navigation.state.params.productName}</CustomTextR>
                                            </View>
                                            <View style={styles.selectGoodsResultOptionPrice}>
                                                <TextRobotoM style={styles.selectGoodsResultOptionPriceText}>
                                                    {CommonFuncion.currencyFormat(parseInt(item.data.price))}<CustomTextM>원</CustomTextM>
                                                </TextRobotoM>  
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                            :
                            this.props.navigation.state.params.productList.map((item, seIndex) => {
                            let productData = Array.isArray(item.productData) === true ? item.productData[0] : item.productData;
                                return(
                                    <View key={seIndex} style={styles.requestGoodsTitleWrapper}>
                                        <View style={styles.requestGoodsTitleWrap} >
                                            <View style={styles.requestGoodsOptionWrap}>
                                                <View style={{padding:5}}>
                                                    <CustomTextR style={styles.requestGoodsTitleText}>{typeof productData.title !== 'undefined' && productData.title || this.props.navigation.state.params.productName}</CustomTextR>
                                                </View>
                                                <View style={styles.requestGoodsOptionWrap}>
                                                    { typeof item.freeOptionList !== 'undefined' &&
                                                        item.freeOptionList.map((mitem, mindex) => {
                                                            return (
                                                                <CustomTextR style={styles.requestGoodsLectureOptionText} key={mindex}>ㆍ {mitem.title}</CustomTextR>
                                                            )
                                                        })
                                                    }
                                                    
                                                </View>
                                                <View style={styles.selectGoodsResultOptionPrice}>
                                                    <TextRobotoM style={styles.selectGoodsResultOptionPriceText}>
                                                        {CommonFuncion.currencyFormat(parseInt(productData.price))}<CustomTextM>원</CustomTextM>
                                                    </TextRobotoM>  
                                                </View>
                                            </View>
                                            <View style={styles.requestGoodsOptionWrap}>
                                                { typeof item.optionList !== 'undefined' &&   
                                                item.optionList.map((seitem, seIndex) => {
                                                    let optionData = typeof seitem.info !== 'undefined' ? seitem.info : seitem;
                                                    return (
                                                        <View key={seIndex} style={{borderTopColor:DEFAULT_COLOR.input_border_color,borderTopWidth:1,paddingVertical:10}}>
                                                            <View style={styles.selectGoodsResultOptionWrap}>
                                                                <View style={styles.selectGoodsResultOptionTitile}>
                                                                    <CustomTextR style={styles.selectGoodsResultOptionTitileTextBold}>선택옵션 : </CustomTextR>                                        
                                                                    <CustomTextR style={styles.selectGoodsResultOptionTitileText}>
                                                                        {optionData.title}
                                                                    </CustomTextR>                        
                                                                </View>
                                                            </View>
                                                            <View style={styles.selectGoodsResultOptionPrice}>
                                                                <TextRobotoM style={styles.selectGoodsResultOptionPriceText}>
                                                                    {CommonFuncion.currencyFormat(optionData.price)}<CustomTextM>원</CustomTextM>
                                                                </TextRobotoM>  
                                                            </View>
                                                        </View>
                                                    )
                                                })
                                                }
                                            
                                            </View>
                                        </View>

                                        <View style={styles.requestGoodsPartTotalWrapper}>
                                            <View style={styles.requestGoodsPartTotalInside}>
                                                <View style={{flex:1.2,paddingLeft:25}}>
                                                    <CustomTextB style={styles.requestGoodsPartTotalInsideText1}>
                                                    총 상품금액
                                                    </CustomTextB>
                                                </View>
                                                {/* { item.discountAmount > 0 &&
                                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                                    <TextRobotoM style={styles.requestGoodsPartTotalInsideText2}>
                                                    {CommonFuncion.currencyFormat(item.discountAmount)}<CustomTextM>원</CustomTextM>
                                                    </TextRobotoM>
                                                </View>
                                                } */}
                                                { item.discountAmount > 0 &&
                                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                                    <TextRobotoM style={styles.requestGoodsPartTotalInsideText2}>
                                                    {CommonFuncion.currencyFormat(item.basePrice)}<CustomTextM>원</CustomTextM>
                                                    </TextRobotoM>
                                                </View>
                                                }
                                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                                <TextRobotoB style={[styles.requestGoodsPartTotalInsideText1, {fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20)}]}>
                                                    {CommonFuncion.currencyFormat(item.paymentAmount)}<CustomTextB>원</CustomTextB>
                                                </TextRobotoB>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }
                        <View style={styles.commonHr1}></View>
                        <View style={styles.resultGoodsWarpper}>
                            <View style={{padding:5}}>
                                <CustomTextB style={styles.requestTitleText}>최종 결제 금액</CustomTextB>
                            </View>                        
                        </View>
                        <View style={styles.resultGoodsBodyWrapper}>
                            <View style={styles.resultGoodsBodyTotalPriceWrap}>
                                <View style={styles.resultGoodsBodyTotalPriceLeft}>
                                    <CustomTextR style={styles.resultGoodsBodyTotalPriceLeftText}>총 상품금액</CustomTextR>
                                </View>                            
                                <View style={styles.resultGoodsBodyTotalPriceRight}>
                                    <TextRobotoM style={styles.resultGoodsBodyTotalPriceRightText}>
                                    {CommonFuncion.currencyFormat(parseInt(this.state.baseTotalOptionsPrice) + parseInt(this.state.baseTotalGoodsPrice)) }<CustomTextM>원</CustomTextM>
                                    </TextRobotoM>   
                                </View>                            
                            </View> 
                            { 
                            this.state.productType === 'lecture' &&
                            <View style={[styles.resultGoodsBodyCouponWrap, {paddingRight: 10}]}>
                                <View style={styles.resultGoodsBodyCouponLeft}>
                                    <CustomTextR style={styles.resultGoodsBodyTotalPriceLeftText}>쿠폰ㆍ포인트</CustomTextR>
                                </View>  
                                <TouchableOpacity 
                                    onPress={()=> this.setState({showModalCoupon:true})}
                                    style={styles.resultGoodsBodyCouponRight}
                                >
                                    <Image source={require('../../../assets/icons/btn_list_detail.png')} style={{width: 12, height: 12}} />
                                </TouchableOpacity>
                            </View> 
                            }
                            <View style={styles.resultGoodsBodyDiscountWrap}>
                                <View style={styles.resultGoodsBodyDiscountLeft}>
                                    <CustomTextR style={styles.resultGoodsBodyDiscountText}>할인적용금액</CustomTextR>
                                </View>  
                                <View style={styles.resultGoodsBodyCouponRight}>                             
                                    <TextRobotoM style={styles.resultGoodsBodyCouponRightText}>{CommonFuncion.currencyFormat(this.state.discountPrice)}<CustomTextM>원</CustomTextM></TextRobotoM>  
                                </View>
                            </View> 
                            
                            <View style={styles.resultGoodsBodyTotalDeilveryWrap}>
                                <View style={styles.resultGoodsBodyTotalPriceLeft}>
                                    <CustomTextR style={styles.resultGoodsBodyTotalPriceLeftText}>배송비</CustomTextR>
                                </View>                            
                                <View style={styles.resultGoodsBodyTotalPriceRight}>                            
                                    <TextRobotoM style={styles.resultGoodsBodyTotalPriceRightText}>
                                        {this.state.isDeliveryPrice ? CommonFuncion.currencyFormat(99000) : 0}<CustomTextM>원</CustomTextM>
                                    </TextRobotoM>   
                                </View>                                                      
                            </View>                        
                        </View>
                        <View style={styles.resultGoodsBodyBottomWrapper}>
                            <View style={styles.resultGoodsBodyBottomIconMinus}>
                                <Icon name="minuscircle" size={30} color="#777" />
                            </View>
                            <View style={styles.resultGoodsBodyBottomIconPlus}>
                                <Icon name="pluscircle" size={30} color="#777" />
                            </View>
                            <View style={styles.resultGoodsBodyBottomHeader}>
                                <View style={styles.resultGoodsBodyBottomLeft}>
                                    <CustomTextM style={styles.resultGoodsBodyBottomText}>총상품금액</CustomTextM>                                
                                </View>
                                <View style={styles.resultGoodsBodyBottomLeft}>
                                    <CustomTextM style={styles.resultGoodsBodyBottomText}>할인금액</CustomTextM>
                                </View>
                                <View style={styles.resultGoodsBodyBottomRight}>
                                    <CustomTextM style={styles.resultGoodsBodyBottomText}>배송비</CustomTextM>
                                </View>
                                
                            </View>
                            <View style={styles.resultGoodsBodyBottomFooter}>
                                <View style={styles.resultGoodsBodyBottomLeft}>
                                    <TextRobotoM style={[styles.resultGoodsBodyBottomText, {fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)}]}>{CommonFuncion.currencyFormat(parseInt(this.state.baseTotalOptionsPrice) + parseInt(this.state.baseTotalGoodsPrice)) }<CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)}}>원</CustomTextM></TextRobotoM>
                                </View>
                                <View style={styles.resultGoodsBodyBottomLeft}>
                                    <TextRobotoM style={[styles.resultGoodsBodyBottomText, {fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)}]}>{CommonFuncion.currencyFormat(this.state.baseTotalDiscountPrice)}<CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)}}>원</CustomTextM></TextRobotoM>
                                </View>
                                <View style={styles.resultGoodsBodyBottomRight}>
                                    <TextRobotoM style={[styles.resultGoodsBodyBottomText, {fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)}]}>{this.state.isDeliveryPrice ? CommonFuncion.currencyFormat(2500) : 0}<CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)}}>원</CustomTextM></TextRobotoM>
                                </View>
                            </View>
                        </View>

                        <View style={styles.resultGoodsBodyResultWrapper}>
                            <View style={{padding:15,flex:1}}>
                                <View style={styles.resultGoodsBodyResultHeader}>
                                    <CustomTextM style={styles.resultGoodsBodyResultHeaderText}>최종 결제금액{'  '}={'  '}<CustomTextB><TextRobotoB>{CommonFuncion.currencyFormat(parseInt(this.state.baseTotalOptionsPrice) + parseInt(this.state.baseTotalGoodsPrice) + (this.state.isDeliveryPrice ? 2500 : 0) - this.state.baseTotalDiscountPrice)}</TextRobotoB>원</CustomTextB></CustomTextM>
                                </View>
                                <View style={styles.resultGoodsBodyResultFooter}>
                                    <CustomTextM style={styles.resultGoodsBodyResultFooterText}>예상적립포인트{' '}</CustomTextM>
                                    <Icon9 name='alpha-p-circle' size={20} color='#fff' style={{marginLeft: 10, marginRight: 5}} />
                                    <TextRobotoB style={[styles.resultGoodsBodyResultFooterText, {fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)}]}>{this.state.baseTotalPrePoint > 0 ? CommonFuncion.currencyFormat(this.state.baseTotalPrePoint): 0}</TextRobotoB>
                                </View>
                            </View>
                        </View>
                        <View style={styles.commonHr1}></View>
                        { 
                        ( this.state.productType !== 'mp3' && !this.state.isRepeatLecture  ) ?
                        <View>
                            <View style={styles.deliveryInfromationWrapper}>
                                <View style={{padding:5}}>
                                    <CustomTextB style={styles.requestTitleText}>배송 정보</CustomTextB>
                                </View>                   
                                <View style={styles.deliverySelectModeWrap}>
                                    <TouchableOpacity 
                                        onPress={()=>this.changeAddress(!this.state.addressNew)}
                                        style={!this.state.addressNew ? styles.deliverySelectSelected : styles.deliverySelectUnSelected}
                                    >
                                        <CustomTextR style={!this.state.addressNew ? styles.deliverySelectText2 : styles.deliverySelectText}>본배송지</CustomTextR>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={()=>this.changeAddress(!this.state.addressNew)}
                                        style={this.state.addressNew ? styles.deliverySelectSelected : styles.deliverySelectUnSelected}
                                    >
                                        <CustomTextR style={this.state.addressNew ? styles.deliverySelectText2 : styles.deliverySelectText}>신규배송지</CustomTextR>
                                    </TouchableOpacity>
                                    
                                </View>     
                            </View>
                            <View style={styles.deliveryAddressWrapper}>
                                <View>
                                    <CustomTextR style={styles.requestTitleText2}>주소</CustomTextR>
                                </View>
                                <View style={styles.deliveryAddressBody}>
                                    <View style={{flex:2}}>
                                        
                                        {/* <Input 
                                            disabled
                                            value={this.state.addressData_zipcode}
                                            inputContainerStyle={styles.inputDisable}                                        
                                            inputStyle={styles.inputText}
                                            //errorStyle={{ color: 'red' }}
                                            //errorMessage='호는 필수입니다.'
                                        /> */}
                                        <TextInput 
                                            disabled
                                            value={this.state.addressData_zipcode}
                                            style={[styles.inputDisable, styles.inputText]}
                                        />
                                    </View>
                                    <View style={{width: 6}}></View>
                                    <View                                     
                                        style={{flex:1}}>
                                        <Button
                                            onPress={() => this.showModal()}
                                            title="우편번호 찾기"
                                            titleStyle={{fontFamily:DEFAULT_CONSTANTS.defaultFontFamilyRegular,color:'#444',fontSize:DEFAULT_TEXT.fontSize14,lineHeight:DEFAULT_TEXT.fontSize14*1.42}}
                                            buttonStyle={{borderColor:DEFAULT_COLOR.base_color_888,borderWidth:1,height:40}}
                                            type="outline"
                                        />
                                    </View>
                                </View>
                                <View style={{marginTop:10}}>
                                    {/* <Input 
                                        disabled
                                        value={this.state.addressData_address}
                                        inputContainerStyle={styles.inputDisable}
                                        inputStyle={styles.inputText}
                                    /> */}
                                    <TextInput 
                                        disabled
                                        value={this.state.addressData_address}
                                        style={[styles.inputDisable, styles.inputText]}
                                    />
                                </View>
                                <View style={styles.deliveryAddressDetailWrapper}>
                                    {/* <Input 
                                        placeholder=' 상세주소 입력'
                                        inputContainerStyle={styles.inputAble}
                                        inputStyle={styles.inputText}
                                        onChangeText={text => this.setState({addressData_addressDetail : text })}
                                    /> */}
                                    <TextInput 
                                        placeholder='상세주소 입력'
                                        style={[styles.inputAble, styles.inputText]}
                                        onChangeText={text => this.setState({addressData_addressDetail : text })}
                                    />
                                    
                                </View>
                                <View style={{marginTop:20}}>
                                    <CustomTextR style={styles.requestTitleText2}>받으시는 분</CustomTextR>
                                </View>
                                <View style={{marginTop:10,paddingBottom:5}}>
                                    {/* <Input 
                                        placeholder='이름'
                                        inputContainerStyle={styles.inputAble}
                                        inputStyle={styles.inputText}
                                        value={this.state.addressData_Name}
                                        onChangeText={text => this.setState({addressData_Name : text })}
                                    /> */}
                                    <TextInput 
                                        placeholder='이름'
                                        style={[styles.inputAble, styles.inputText]}
                                        value={this.state.addressData_Name}
                                        onChangeText={text => this.setState({addressData_Name : text })}
                                    />
                                </View>
                                <View style={{flexDirection:'row',paddingBottom:20,borderBottomColor:'#ccc',borderBottomWidth:1}}>
                                    <View style={{flex:1}}>
                                        {/* <Input 
                                            value={this.state.addressData_phone01}
                                            inputContainerStyle={styles.inputAble}
                                            inputStyle={[styles.inputText, {color:DEFAULT_COLOR.base_color_ccc}]}
                                            onChangeText={text => this.setState({addressData_phone01 : text })}
                                        /> */}
                                        <TextInput 
                                            style={[styles.inputAble, styles.inputText]}
                                            value={this.state.addressData_phone01}
                                            onChangeText={text => this.setState({addressData_phone01 : text })}
                                        />
                                    </View>
                                    <View style={{flex:1}}>
                                        {/* <Input                                     
                                            value={this.state.addressData_phone02}
                                            inputContainerStyle={styles.inputAble}
                                            inputStyle={[styles.inputText, {color:DEFAULT_COLOR.base_color_ccc}]}
                                            onChangeText={text => this.setState({addressData_phone02 : text })}
                                        /> */}
                                        <TextInput 
                                            style={[styles.inputAble, styles.inputText]}
                                            value={this.state.addressData_phone02}
                                            onChangeText={text => this.setState({addressData_phone02 : text })}
                                        />
                                    </View>
                                    <View style={{flex:1}}>
                                        {/* <Input
                                            value={this.state.addressData_phone03}
                                            inputContainerStyle={styles.inputAble}
                                            inputStyle={[styles.inputText, {color:DEFAULT_COLOR.base_color_ccc}]}
                                            onChangeText={text => this.setState({addressData_phone03 : text })}
                                        /> */}
                                        <TextInput 
                                            style={[styles.inputAble, styles.inputText]}
                                            value={this.state.addressData_phone03}
                                            onChangeText={text => this.setState({addressData_phone03 : text })}
                                        />
                                    </View>
                                </View>
                                <View style={{marginTop:20}}>
                                    <CustomTextR style={styles.requestTitleText2}>배송시 주문사항</CustomTextR>
                                </View>
                                <View style={{marginTop:10,paddingBottom:5}}>
                                    <TextInput 
                                        style={[styles.inputAble,styles.inputText,{height:100,textAlignVertical: 'top'}]}
                                        placeholder=' 내용을 입력해주세요'
                                        onChangeText={text=>this.setState({addressData_message:text})}
                                        multiline={true}
                                        clearButtonMode='always'
                                    />
                                </View>
                                
                            </View>
                        </View>
                        :
                            null
                        }
                        <View style={[styles.commonHr1]}></View>

                        <View style={styles.deliveryInfromationWrapper}>
                            <View style={{padding:5}}>
                                <CustomTextB style={styles.requestTitleText}>결제 수단 선택</CustomTextB>
                            </View>   
                            <View style={styles.settleMethodeWrapper}>
                                {this.state.settleItems.map((data, mindex) => {
                                return (
                                    <TouchableOpacity 
                                        style={mindex === this.state.settleMethodeIndex ? styles.selectSettleMethode : styles.unselectSettleMethode} 
                                        key={mindex}
                                        onPress= {()=> this.selectSettleMethode(mindex,data.code,data.title)}
                                        >
                                            <Image
                                                source={{uri: Platform.OS === 'ios' ? 'https://' +  data.iconimg : 'http://' +  data.iconimg}}
                                                style={{width:'80%',height:35,marginBottom:10}}
                                                resizeMode='contain'
                                            />
                                            <CustomTextR style={data.code === this.state.settleMethodeCode ? styles.selectSettleText : styles.unSelectSettleText }>{data.title}</CustomTextR>
                                    </TouchableOpacity>
                                    )
                                })
                                }  
                            </View>
                            <View style={{padding:5}}>
                                <View style={this.state.agreeCheck01.checked ? styles.agreeWrapperOn : styles.agreeWrapper}>
                                    <View style={{flex:1}}>
                                        <CheckBox 
                                            containerStyle={{padding:0,margin:0}}   
                                            iconType='font-awesome'
                                            checkedIcon='check-circle'
                                            uncheckedIcon='check-circle'
                                            checkedColor={DEFAULT_COLOR.lecture_base}
                                            uncheckedColor={DEFAULT_COLOR.input_bg_color}
                                            onPress= {()=> this.checkAllAgree()}
                                            checked={this.state.agreeCheck01.checked}
                                        />
                                    </View>
                                    <View style={{flex:5}}>
                                        <CustomTextR style={[this.state.agreeCheck01.checked ? styles.requestTitleText2On : styles.requestTitleText2, {fontSize: DEFAULT_TEXT.fontSize14}]}>
                                            결제 관련 개인정보 처리업무 위탁 및 개인정보수집동의 안내에 모두 동의합니다.
                                        </CustomTextR>
                                    </View>
                                </View>
                            </View>
                            <View style={{padding:5}}>
                                <DropDown                            
                                    style={this.state.agreeCheck02.checked ? styles.agreeWapperOn : styles.agreeWapper}
                                    contentVisible={false}
                                    invisibleImage={IC_ARR_DOWN}
                                    visibleImage={IC_ARR_UP}
                                    header={
                                    <View style={{padding:5,flexDirection:'row',alignItems:'center'}}>
                                        <View style={{flex:1,paddingVertical:10}}>
                                            <CheckBox 
                                                containerStyle={{padding:0,margin:0}}   
                                                iconType='font-awesome'
                                                checkedIcon='check-circle'
                                                uncheckedIcon='check-circle'
                                                checkedColor={DEFAULT_COLOR.lecture_base}
                                                uncheckedColor={DEFAULT_COLOR.input_bg_color}
                                                onPress= {()=> {
                                                    this.state.agreeCheck02.checked = !this.state.agreeCheck02.checked,
                                                    this.setState({loading:true})
                                                }}
                                                checked={this.state.agreeCheck02.checked}
                                            />
                                        </View>
                                        <View style={{flex:5,paddingVertical:10,justifyContent:'center'}}>
                                            <CustomTextR style={this.state.agreeCheck02.checked ? styles.requestTitleText2On : styles.requestTitleText2}>
                                                개인정보 수집동의
                                            </CustomTextR>
                                        </View>
                                    </View>
                                    }
                                >
                                    <View style={{width:SCREEN_WIDTH-33 ,backgroundColor:'#ebebeb',padding:10}}>
                                        <CustomTextR style={styles.requestTitleText2}>
                                            sodydfdfd내용
                                        </CustomTextR>
                                    </View>                                
                                </DropDown>
                            </View>

                            <View style={{padding:5}}>
                                <DropDown                            
                                    style={this.state.agreeCheck03.checked ? styles.agreeWapperOn : styles.agreeWapper}
                                    contentVisible={false}
                                    invisibleImage={IC_ARR_DOWN}
                                    visibleImage={IC_ARR_UP}
                                    header={
                                    <View style={{padding:5,flexDirection:'row'}}>
                                        <View style={{flex:1,paddingVertical:10}}>
                                            <CheckBox 
                                                containerStyle={{padding:0,margin:0}}   
                                                iconType='font-awesome'
                                                checkedIcon='check-circle'
                                                uncheckedIcon='check-circle'
                                                checkedColor={DEFAULT_COLOR.lecture_base}
                                                uncheckedColor={DEFAULT_COLOR.input_bg_color}
                                                onPress= {()=> {
                                                    this.state.agreeCheck03.checked = !this.state.agreeCheck03.checked,
                                                    this.setState({loading:true})
                                                }}
                                                checked={this.state.agreeCheck03.checked}
                                            />
                                        </View>
                                        <View style={{flex:5,paddingVertical:10,justifyContent:'center'}}>
                                            <CustomTextR style={this.state.agreeCheck03.checked ? styles.requestTitleText2On : styles.requestTitleText2}>
                                                개인정보 제3자 위탁동의
                                            </CustomTextR>
                                        </View>
                                    </View>
                                    }
                                >
                                    <View style={{width:SCREEN_WIDTH - 33,backgroundColor:'#ebebeb',padding:10}}>
                                        <CustomTextR style={styles.requestTitleText2}>
                                        개인정보 제3자 위탁동의개인정보 제3자 위탁동의개인정보 제3자 위탁동의개인정보 제3자 위탁동의개인정보 제3자 위탁동의개인정보 제3자 위탁동의개인정보 제3자 위탁동의
                                        </CustomTextR>
                                    </View>                                
                                </DropDown>
                            </View>

                            <View style={{padding:5}}>
                                <DropDown                            
                                    style={this.state.agreeCheck04.checked ? styles.agreeWapperOn : styles.agreeWapper}
                                    contentVisible={false}
                                    invisibleImage={IC_ARR_DOWN}
                                    visibleImage={IC_ARR_UP}
                                    header={
                                    <View style={{padding:5,flexDirection:'row'}}>
                                        <View style={{flex:1,paddingVertical:10}}>
                                            <CheckBox 
                                                containerStyle={{padding:0,margin:0}}   
                                                iconType='font-awesome'
                                                checkedIcon='check-circle'
                                                uncheckedIcon='check-circle'
                                                checkedColor={DEFAULT_COLOR.lecture_base}
                                                uncheckedColor={DEFAULT_COLOR.input_bg_color}
                                                onPress= {()=> {
                                                    this.state.agreeCheck04.checked = !this.state.agreeCheck04.checked,
                                                    this.setState({loading:true})
                                                }}
                                                checked={this.state.agreeCheck04.checked}
                                            />
                                        </View>
                                        <View style={{flex:5,paddingVertical:10,justifyContent:'center'}}>
                                            <CustomTextR style={this.state.agreeCheck04.checked ? styles.requestTitleText2On : styles.requestTitleText2}>
                                                전자결제정보 수신동의
                                            </CustomTextR>
                                        </View>
                                    </View>
                                    }
                                >
                                    <View style={{width:SCREEN_WIDTH - 33,backgroundColor:'#ebebeb',padding:10}}>
                                        <CustomTextR style={styles.requestTitleText2}>
                                        전자결제정보 수신동의전자결제정보 수신동의전자결제정보 수신동의전자결제정보 수신동의전자결제정보 수신동의전자결제정보 수신동의전자결제정보 수신동의
                                        </CustomTextR>
                                    </View>                                
                                </DropDown>
                            </View>
                        </View>

                        <View style={{paddingTop:15,paddingBottom:10,marginHorizontal:10}} />


                        <View style={{backgroundColor:'#222'}}>
                            <View style={styles.bottomButtonWrapper}>
                                <TouchableOpacity                             
                                    style={styles.bottomButtonRight}
                                    onPress= {()=> this.requestLecture()}
                                    
                                    >
                                    <CustomTextB style={styles.bottomButtonRightText}>다음</CustomTextB>
                                </TouchableOpacity>
                                
                            </View>
                        </View>

                       
                    </View>

                </ScrollView>
                <Modal
                    onBackdropPress={this.closeModal}
                    style={{justifyContent: 'flex-end',margin: 0}}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating
                    isVisible={this.state.showModal}>
                    <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight }]}>
                        <View style={styles.postcodeWrapper}>
                            <Text style={styles.requestTitleText2}>
                                우편번호 찾기
                            </Text>
                            <TouchableOpacity 
                                onPress= {()=> this.closeModal()}
                                style={{position:'absolute',top:0,right:15,width:30,height:30}}>
                                <Icon name="close" size={30} color="#555" />
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:1}}>
                            <DaumPostcode                                 
                                jsOptions={{ animated: true }}
                                onSelected={(data) => this.setAddress(data)}
                            />
                        </View>
                    </Animated.View>
                </Modal>

                {/*  할인쿠폰  */}
                <Modal
                    onBackdropPress={this.closeModalCoupon}
                    style={{justifyContent: 'flex-end',margin: 0}}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating
                    isVisible={this.state.showModalCoupon}>
                    <Animated.View style={[styles.modalContainer,{ height: this.animatedHeightCoupon }]}>
                        <View style={styles.postcodeWrapper}>
                            <CustomTextR style={styles.modalTitle}>
                            쿠폰ㆍ포인트 적용
                            </CustomTextR>
                            <TouchableOpacity 
                                onPress= {()=> this.closeModalCoupon()}
                                style={{position:'absolute',top:0,right:15,width:30,height:30}}>
                                <Icon name="close" size={25} color="#555" />
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:1}}>
                            <CouponPointScreen screenState={this.state} />
                        </View>
                    </Animated.View>
                </Modal>
            </View>
        );
    }
}


function mapStateToProps(state) {
    return {
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
        userToken: state.GlabalStatus.userToken,
    };
}
export default connect(mapStateToProps, null)(LectureSettleInputScreen);