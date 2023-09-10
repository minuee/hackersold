import React from 'react';
import {StyleSheet, Text, View, StatusBar,Image,TouchableOpacity ,Dimensions,ScrollView,Animated,PixelRatio, Alert} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Icon9 from 'react-native-vector-icons/MaterialCommunityIcons';
Icon9.loadFont();
import {Button,Overlay,CheckBox,Input} from 'react-native-elements';
import 'moment/locale/ko'
import  moment  from  "moment";
import DropDown from '../../Utils/DropDown';
import Modal from 'react-native-modal';

const IC_ARR_DOWN = require('../../../assets/icons/ic_arr_down.png');
const IC_ARR_UP = require('../../../assets/icons/ic_arr_up.png');


//공통상수
import COMMON_STATES, {SERVICES} from '../../Constants/Common';
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import styles from '../../Style/Recomm/LectureSettleScreen';
import {CustomText, CustomTextR, CustomTextB, CustomTextM, CustomTextL, TextRobotoR, TextRobotoB} from '../../Style/CustomText';

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

const MESSAGE_PART_0201 = '최초시스템 사양 및 필수 소프트웨어 안내사항';
const MESSAGE_PART_0202 = '취소/환불 안내사항';
const MESSAGE_PART_0203 = '이용약관 안내사항';
const MESSAGE_PART_0204 = '기타문의 안내사항';
const INFO_MESSGE = {
    '0201': MESSAGE_PART_0201,
    '0202': MESSAGE_PART_0202,
    '0203': MESSAGE_PART_0203,
    '0204': MESSAGE_PART_0204,
};

class LectureSettleScreen extends React.Component {

    constructor(props) {
        super(props);

        //console.log("settle props : ",this.props.navigation.state.params)
        this.state = {
            selectItem:1,
            showModal : false,
            isselectTab : 1,
            showTopButton : false,
            paymentInfoMessages: {},
            startInfoMsgCode: '',
            endInfoMsgCode: '',
            settleMethodeIndex : this.props.navigation.state.params.settleMethodeIndex,
            settleMethodeCode : this.props.navigation.state.params.settleMethodeCode,
            settleMethodeName : this.props.navigation.state.params.settleMethodeName,
            addressNew : this.props.navigation.state.params.addressNew,
            addressData_Name : this.props.navigation.state.params.addressData_Name,
            addressData_Email : this.props.navigation.state.params.addressData_Email,
            addressData_zipcode : this.props.navigation.state.params.addressData_zipcode,
            addressData_address : this.props.navigation.state.params.addressData_address,
            addressData_addressDetail : this.props.navigation.state.params.addressData_addressDetail,
            addressData_phone01 : this.props.navigation.state.params.addressData_phone01,
            addressData_phone02 : this.props.navigation.state.params.addressData_phone02,
            addressData_phone03 : this.props.navigation.state.params.addressData_phone03,
            addressData_message :  this.props.navigation.state.params.addressData_message,
            discountPrice : this.props.navigation.state.params.discountPrice,
            useCouponPrice : this.props.navigation.state.params.useCouponPrice,
            usePoint : this.props.navigation.state.params.usePoint,
            useCouponPoint : this.props.navigation.state.params.useCouponPoint,            
            productType : this.props.navigation.state.params.productType,
            productList　 : this.props.navigation.state.params.productList,
            checkCartList : this.props.navigation.state.params.checkCartList,
            optionSumPrice : this.props.navigation.state.params.optionSumPrice,
            isDeliveryPrice : this.props.navigation.state.params.isDeliveryPrice,
            orderNo : this.props.navigation.state.params.orderNo,
            memberInfo : this.props.navigation.state.params.memberInfo,
            baseTotalGoodsPrice : this.props.navigation.state.params.baseTotalGoodsPrice,
            baseTotalOptionsPrice : this.props.navigation.state.params.baseTotalOptionsPrice,
            baseTotalDiscountPrice : this.props.navigation.state.params.baseTotalDiscountPrice,
            baseFinalySettlePrice : this.props.navigation.state.params.baseFinalySettlePrice,
            baseTotalPrePoint : this.props.navigation.state.params.baseTotalPrePoint,
            iamPortTokenKey : this.props.navigation.state.params.iamPortTokenKey,
            isRepeatLecture : this.props.navigation.state.params.isRepeatLecture,
            myClassApiDomain : this.props.navigation.state.params.myClassApiDomain,
            myClassApiKey : this.props.navigation.state.params.myClassApiKey,
            resultScreen : typeof this.props.navigation.state.params.resultScreen !== 'undefined' ? this.props.navigation.state.params.resultScreen : 'LecturePayResult',
            agreeCheck01 : {checked : false, title : '동의'},
            sendSettleData : null,
            settleItems : [
                { index :1, title : '신용/체크카드' , icon : 30, code : 'card' ,seleced : true,iconimg : 'reactserver.hackers.com/assets/react/icons/icon_payment_card.png' },
                { index :2, title : '무통장입금' , icon : 35 ,code : 'vbank',seleced : false,iconimg : 'reactserver.hackers.com/assets/react/icons/icon_payment_bank.png' },
                { index :3, title : '실시간계좌이체' , icon : 66,code : 'trans',seleced : false,iconimg : 'reactserver.hackers.com/assets/react/icons/icon_payment_realtime.png'  },
                //{ index :4, title : '페이나우' , icon : 66,code : 'paynow',seleced : false,iconimg : 'reactserver.hackers.com/assets/react/icons/icon_payment_paynow.png'  },
                //{ index :5, title : '페이코' , icon : 66,code : 'payci',seleced : false,iconimg : 'reactserver.hackers.com/assets/react/icons/icon_payment_payco.png'  },
                //{ index :6, title : '카카오페이' , icon : 66,code : 'kakao',seleced : false,iconimg : 'reactserver.hackers.com/assets/react/icons/icon_payment_kakaopay.png'  }
            ],
            /*
            choiceSettleMethode : this.props.navigation.state.params.choiceSettleMethode ? this.props.navigation.state.params.choiceSettleMethode : 'card',
            addressNew : this.props.navigation.state.params.addressNew,
            addressData_Name : this.props.navigation.state.params.addressData_Name,
            addressData_zipcode : this.props.navigation.state.params.addressData_zipcode,
            addressData_address : this.props.navigation.state.params.addressData_address,
            addressData_addressDetail : this.props.navigation.state.params.addressData_addressDetail,
            addressData_phone01 : this.props.navigation.state.params.addressData_phone01,
            addressData_phone02 : this.props.navigation.state.params.addressData_phone02,
            addressData_phone03 : this.props.navigation.state.params.addressData_phone03,
            addressData_message : this.props.navigation.state.params.addressData_message,
            lectureIdx : this.props.navigation.state.params.lectureIdx,
            lectureInfo : this.props.navigation.state.params.lectureInfo,
            productList　: this.props.navigation.state.params.productList,
            checkCartList : this.props.navigation.state.params.checkCartList,
            optionSumPrice : this.props.navigation.state.params.optionSumPrice,
            settleTotalPrice : this.props.navigation.state.params.settleTotalPrice,
            isDeliveryPrice : this.props.navigation.state.params.isDeliveryPrice,
            orderNo : this.props.navigation.state.params.orderNo,
            discountPrice : this.props.navigation.state.params.discountPrice,
            useCouponIdx : this.props.navigation.state.params.useCouponIdx,
            usePoint : this.props.navigation.state.params.usePoint,
            useCouponPoint : this.props.navigation.state.params.useCouponPoint,
            useCouponList : this.props.navigation.state.params.useCouponList,
            */
        }
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
        // let newtitle = <View style={{flexGrow:1,textAlign:'center',alignItems:'center'}}><Text style={{color:'#fff',fontSize:DEFAULT_TEXT.head_medium}}>결제하기2</Text></View>;
        // let newheaderLeft = <TouchableOpacity onPress={()=>this.props.navigation.goBack(null)} style={{flexGrow:1,textAlign:'center',alignItems:'center',paddingLeft:10}}><Icon name="left" size={25} color="#fff" /></TouchableOpacity>
        let newtitle = <View style={{flexGrow:1,textAlign:'center',alignItems:'center'}}><CustomTextR style={{color:'#fff',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),letterSpacing:PixelRatio.roundToNearestPixel(-0.96)}}>결제하기2</CustomTextR></View>;
        let newheaderLeft = <TouchableOpacity onPress={()=>this.props.navigation.goBack(null)} style={{flexGrow:1,textAlign:'center',alignItems:'center',paddingLeft:20}}><Image source={require('../../../assets/icons/btn_back_page.png')} style={{width: 17, height: 17}} /></TouchableOpacity>
        let newheaderRight = <View style={{flexGrow:1,textAlign:'center',alignItems:'center'}}></View>
        this.props.navigation.setParams({
            newtitle,
            newheaderLeft,
            newheaderRight
        });
    }

    async UNSAFE_componentWillMount() {
        await this._setNavigationParams();
        await this.loadMessages();
        await this.calPrice();
    } 

    componentDidMount() {
    }

    // 안내메세지 불러오기
    loadMessages = async () => {
        const serviceID = await CommonUtil.getServiceID();
        if (!serviceID) {
            Alert.alert('', '안내메세지 로딩용 서비스ID가 없습니다.');
            return;
        }

        const infoMessages = await CommonUtil.getInfoMessage(serviceID);
        if (infoMessages.result === true) {
            if (infoMessages.response.code === '0000') {
                this.setMessage(infoMessages.response.data.message.payment);
            } else {
                Alert.alert('', infoMessages.response.message || '안내메세지 로딩 실패');
            }
        } else {
            Alert.alert('', infoMessages.error || '안내메세지 로딩 실패');
        }
    };

    // 안내메세지 셋팅
    setMessage = async arrMsg => {
        if (CommonUtil.isEmpty(arrMsg)) {
            return;
        }
        let newMsg = {};
        let msgPart0201 = [];
        let msgPart0202 = [];
        let msgPart0203 = [];
        let msgPart0204 = [];
        if (arrMsg.length > 0) {
            arrMsg.map(item => {
                if (item.part === MESSAGE_PART_0201) {
                    msgPart0201.push(item);
                } else if (item.part === MESSAGE_PART_0202) {
                    msgPart0202.push(item);
                } else if (item.part === MESSAGE_PART_0203) {
                    msgPart0203.push(item);
                } else if (item.part === MESSAGE_PART_0204) {
                    msgPart0204.push(item);
                }
            });
            newMsg = {
                '0201': msgPart0201,
                '0202': msgPart0202,
                '0203': msgPart0203,
                '0204': msgPart0204,
            };
            let startInfoMsgCode = '';
            let endInfoMsgCode = '';
            for (const [key, value] of Object.entries(newMsg)) {
                if (value.length > 0 && startInfoMsgCode === '') {
                    startInfoMsgCode = key.toString();
                }

                if (value.length > 0) {
                    endInfoMsgCode = key.toString();
                }
            }
            this.setState({
                startInfoMsgCode: startInfoMsgCode,
                endInfoMsgCode: endInfoMsgCode,
            });

            // if (msgPart0201.length > 0) {
            //     startInfoMsgCode = '0201';
            // }
        }
        
        this.setState({
            paymentInfoMessages: newMsg,
        });
    };



    getPaymentfInfoMessage = partCode => {
        if (CommonUtil.isEmpty(this.state.paymentInfoMessages) || CommonUtil.isEmpty(partCode)) {
            return false;
        }
        // return this.state.paymentInfoMessages.find(item => item.part === part) || false;
        return this.state.paymentInfoMessages[partCode];
    };

    calPrice = async() => {

        let firstSendSettleTitle = "";
        let SEND_SETTLE_TITLE = "";
        if ( this.state.productType === 'mp3' ) {
            await this.props.navigation.state.params.productList.forEach(function(element,index,array){   
                if ( index > 0 ) {
                    SEND_SETTLE_TITLE = firstSendSettleTitle + '외 ' + parseInt(index+1)
                     + '건';
                }else{
                    SEND_SETTLE_TITLE = element.data.title;
                    firstSendSettleTitle = element.data.title;
                }
            });

            this.setState({
                sendSettleData : {
                    title : SEND_SETTLE_TITLE
                }
            })

            
        }else{
            await this.props.navigation.state.params.productList.forEach(function(element,index,array){   
                
                let productData = Array.isArray(element.productData) === true ? element.productData[0] : element.productData;  
                if ( index > 0 ) {
                    SEND_SETTLE_TITLE = firstSendSettleTitle + '외 ' + parseInt(index+1)
                     + '건';
                }else{
                    SEND_SETTLE_TITLE = productData.title;
                    firstSendSettleTitle = productData.title;
                }
            });

            this.setState({
                sendSettleData : {
                    title : SEND_SETTLE_TITLE
                }
            })
            
        }
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

    onPressCallPg = async() => {

        if ( this.state.agreeCheck01.checked === false) {
            let message = "`" + this.state.agreeCheck01.title +"` 항목의 \n동의가 체크되지 않았습니다.";
            let timesecond = 2000;
            CommonFuncion.fn_call_toast(message,timesecond);
            return false;
        }
        console.log('this.state.settleMethodeCode',this.state.settleMethodeCode)


        let isApiUpdate = await this.updateApiCoupon(this.state.useCouponPoint);
        //ㄴconsole.log('isApiUpdate',isApiUpdate);

        const aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        const serviceID = await CommonUtil.getServiceID();
        const arrChamp = ['3090', '3050', '3070', '3095'];
        const arrTeacher = ['3045'];
        let notiUrl = '';
        if (arrChamp.includes(serviceID)) {
            notiUrl = aPIsDomain + '/?m=payment&a=cas_noteurl';
        } else if (arrTeacher.includes(serviceID)) {
            notiUrl = SERVICES[serviceID].domain + '/payment/pay_on/cas_noteurl';
        }
        console.log('notiUrl : ', notiUrl);
         /*
            - 0000 성공
            - 3021 쿠폰/포인트 중복할인 불가
            - 3022 포인트 부족
            - 3023 이미 사용한 쿠폰이거나 없는 쿠폰입니다.
        */
        if ( isApiUpdate && isApiUpdate.code === '0000') {
            
            const pg = 'uplus'; //uplus.MID ..사업부별로 처리
            const notice_url = notiUrl;
            const method = this.state.settleMethodeCode;
            const cardQuota = 0
            const merchantUid = this.state.orderNo;//(`mid_${new Date().getTime()}`);
            const name = this.state.sendSettleData.title;
            const amount = parseInt(this.state.baseFinalySettlePrice);
            const buyerName = this.state.addressData_Name;
            const buyerTel= this.state.addressData_phone01 + this.state.addressData_phone02 + this.state.addressData_phone03;
            const buyerEmail = this.state.addressData_Email ? this.state.addressData_Email : 'service@hackers.com';
            const vbankDue = '';
            const bizNum = '';
            const escrow =false;
            const digital = false;

            const params = {
                pg,
                notice_url,
                pay_method: method,
                merchant_uid: merchantUid,
                name,
                amount,
                buyer_name: buyerName,
                buyer_tel: buyerTel,
                buyer_email: buyerEmail,
                escrow,
                resultScreen : this.state.resultScreen,
                information : this.state,
                isRepeatLecture: this.state.isRepeatLecture,
                myClassApiDomain: this.state.myClassApiDomain,
                myClassApiKey: this.state.myClassApiKey,
            };
            
            // 신용카드의 경우, 할부기한 추가
            if (method === 'card' && cardQuota !== 0) {
            params.display = {
                card_quota: cardQuota === 1 ? [] : [cardQuota],
            };
            }
        
            // 가상계좌의 경우, 입금기한 추가
            if (method === 'vbank' && vbankDue) {
            params.vbank_due = vbankDue;
            }
        
            // 다날 && 가상계좌의 경우, 사업자 등록번호 10자리 추가
            if (method === 'vbank' && pg === 'danal_tpay') {
            params.biz_num = bizNum;
            }
        
            // 휴대폰 소액결제의 경우, 실물 컨텐츠 여부 추가
            if (method === 'phone') {
            params.digital = digital;
            }
        
            // 정기결제의 경우, customer_uid 추가
            if (pg === 'kcp_billing') {
            params.customer_uid = `cuid_${new Date().getTime()}`;
            }
        
            this.props.navigation.navigate('Payment', { params });
       
        } else if ( isApiUpdate && isApiUpdate.code === '3021' ) {
            Alert.alert(
                "해커스통합앱",
                "쿠폰/포인트 중복할인 불가입니다.\n이전 페이지로 돌아갑니다.",
                [
                    {text: '확인', onPress: this.errorBack }
                ],
                { cancelable: false }
            );
        } else if ( isApiUpdate && isApiUpdate.code === '3022' ) {
            Alert.alert(
                "해커스통합앱",
                "포인트가 부족한 상태입니다.\n이전 페이지로 돌아갑니다.",
                [
                    {text: '확인', onPress: this.errorBack }
                ],
                { cancelable: false }
            );
        } else if ( isApiUpdate && isApiUpdate.code === '3023' ) {
            Alert.alert(
                "해커스통합앱",
                "이미 사용한 쿠폰이거나 없는 쿠폰입니다.\n이전 페이지로 돌아갑니다.",
                [
                    {text: '확인', onPress: this.errorBack }
                ],
                { cancelable: false }
            );
        } else {
            const msg = isApiUpdate && isApiUpdate.message || '선택한 쿠폰/포인트를 사용할 수 없습니다.'
            Alert.alert(
                "해커스통합앱",
                msg,
                [
                    {text: '확인', onPress: this.errorBack }
                ],
                { cancelable: false }
            ) 
        }
    };

    errorBack = async() => {
        this.props.navigation.goBack(null)    
    }

    updateApiCoupon = async(coupondata) => {
        let returnResult = {code: '9999', message: '쿠폰/포인트 업데이트 실패'};
        if ( coupondata.length > 0 ) {
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
                console.log('formData',formData);
                // let aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.ApiDomain : DEFAULT_CONSTANTS.apiTestDomain
                // let aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.ApiKey : DEFAULT_CONSTANTS.apitestKey
                let aPIsDomain =
                    this.state.isRepeatLecture
                        ? this.state.myClassApiDomain
                        : typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
                let aPIsAuthKey =
                    this.state.isRepeatLecture
                        ? this.state.myClassApiKey
                        : typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey;

                console.log('LectureSettleScreen.js > updateApiCoupon()', 'url = ' + aPIsDomain + '/v1/payment/' + this.state.orderNo + '/memberinfo')
                console.log('LectureSettleScreen.js > updateApiCoupon()', 'formData = ' + JSON.stringify(formData))

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

                    console.log('LectureSettleScreen.js > updateApiCoupon()', 'response = ' + JSON.stringify(response))

                    if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                        if ( response.code === '0000' ) {
                            // returnVal =  '0000';
                            returnResult = {code: response.code, message: '쿠폰/포인트 업데이트 성공'};
                        // }else if ( response.code === '2006' ) {
                        //     returnVal =  '2006';
                        }else{
                            // returnVal = '9999';
                            returnResult = {code: response.code, message: response.message || '쿠폰/포인트 업데이트 실패'};
                        }
                    }else{
                        // returnVal = false;
                        returnResult = {code: false, message: '쿠폰/포인트 업데이트 실패'};
                    }
                })
                .catch(err => {
                    console.log('login error => ', err);
                    // returnVal = '9999';
                    returnResult = {code: '9999', message: '쿠폰/포인트 업데이트 실패'};
                });
            }else{
                // returnVal = '9999';
                returnResult = {code: '9999', message: '쿠폰/포인트 업데이트 실패'};
            }
        }else{
            returnVal = '0000';
            returnResult = {code: '0000', message: '쿠폰/포인트 업데이트 성공'};
        }

        return returnResult;
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.3);

    closeModal = () => this.setState({ showModal: false });
    showModal = () => this.setState({ showModal: true });
    selectSettleMethode = async(methode,code,name) => {
        this.setState({
            settleMethodeIndex : methode,
            settleMethodeCode : code,
            settleMethodeName : name,

        })
    }

    render() {

        const ModalChagneMethode = () => {        
            return (
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
            )
        }

        return (
            <View style={{flex: 1}}>
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
                >
                    { Platform.OS == 'android' && <StatusBar backgroundColor={DEFAULT_COLOR.lecture_base} translucent={false}  barStyle="dark-content" />}
                    <View style={styles.container}>
                        <View style={styles.topOrderWrapper}>
                            <View style={styles.topOrderTitleWrapper}>
                                <CustomTextB style={styles.topOrderTitleText}>주문 정보</CustomTextB>
                            </View>

                            <View style={styles.topOrderWrapperIn}>
                                <View style={[styles.topOrderGoodsDetailListRow,{backgroundColor:'#ebebeb'}]}>
                                    <View style={styles.topOrderGoodsDetailListLeft}>
                                        <CustomTextR style={styles.topOrderTitleText2}>상품명</CustomTextR>
                                    </View>
                                    <View style={styles.topOrderGoodsDetailListCenter}>
                                        <CustomTextR style={styles.topOrderTitleText2}>수량</CustomTextR>
                                    </View>
                                    <View style={styles.topOrderGoodsDetailListRight2}>
                                        <CustomTextR style={styles.topOrderTitleText2}>정가/</CustomTextR>
                                        <CustomTextR style={styles.topOrderTitleText2}>할인금액/</CustomTextR>
                                        <CustomTextR style={styles.topOrderTitleText2}>실결제금액</CustomTextR>
                                    </View>
                                </View>

                                { this.state.productType === 'mp3'
                                ?
                                this.props.navigation.state.params.productList.map((item, seIndex) => {
                                    return(
                                        <View style={styles.topOrderGoodsDetailListRow} key={seIndex}>
                                            <View style={styles.topOrderGoodsDetailListLeft}>
                                                <CustomTextR style={styles.topOrderTitleText2}>{item.data.title}</CustomTextR>
                                            </View>
                                            <View style={styles.topOrderGoodsDetailListCenter}>
                                                <TextRobotoR style={styles.topOrderTitleText2}>{CommonFuncion.currencyFormat(1)}</TextRobotoR>
                                            </View>
                                            <View style={styles.topOrderGoodsDetailListRight}>
                                                <CustomTextR style={styles.topOrderTitleText2}><TextRobotoR>{CommonFuncion.currencyFormat(item.data.price)}</TextRobotoR>원</CustomTextR>
                                                <CustomTextR style={styles.topOrderTitleText2}><TextRobotoR>-0</TextRobotoR>원</CustomTextR>
                                                <CustomTextB style={styles.topOrderTitleText2}><TextRobotoB>{CommonFuncion.currencyFormat(item.data.price)}</TextRobotoB>원</CustomTextB>
                                            </View>
                                        </View>
                                        
                                    )
                                })
                                :
                                    this.state.productList.map((item, seIndex) => {
                                    let productData = Array.isArray(item.productData) === true ? item.productData[0] : item.productData;
                                        return(

                                            <View style={styles.topOrderGoodsDetailListRow} key={seIndex}>
                                                <View style={styles.topOrderGoodsDetailListLeft}>
                                                    <CustomTextR style={styles.topOrderTitleText2}>{productData.title}</CustomTextR>
                                                </View>
                                                <View style={styles.topOrderGoodsDetailListCenter}>
                                                    <TextRobotoR style={styles.topOrderTitleText2}>{CommonFuncion.currencyFormat(1)}</TextRobotoR>
                                                </View>
                                                <View style={styles.topOrderGoodsDetailListRight}>
                                                    <CustomTextR style={styles.topOrderTitleText2}><TextRobotoR>{CommonFuncion.currencyFormat(parseInt(item.paymentAmount)+parseInt(item.discountAmount))}</TextRobotoR>원</CustomTextR>
                                                    <CustomTextR style={styles.topOrderTitleText2}><TextRobotoR>-{CommonFuncion.currencyFormat(item.discountAmount)}</TextRobotoR>원</CustomTextR>
                                                    <CustomTextB style={styles.topOrderTitleText2}>
                                                        <TextRobotoB>{CommonFuncion.currencyFormat(item.paymentAmount)}</TextRobotoB>원
                                                    </CustomTextB>
                                                </View>
                                            </View>
                                        )
                                    })
                                }

                                

                                {   
                                /*
                                this.state.checkCartList.map((seitem, seIndex) => {
                                    return (

                                        <View style={styles.topOrderGoodsDetailListRow} key={seIndex}>
                                            <View style={styles.topOrderGoodsDetailListLeft}>
                                                <Text style={styles.topOrderTitleText2}>{seitem.info.optionName}</Text>
                                            </View>
                                            <View style={styles.topOrderGoodsDetailListCenter}>
                                                <Text style={styles.topOrderTitleText2}>{CommonFuncion.currencyFormat(1)}</Text>
                                            </View>
                                            <View style={styles.topOrderGoodsDetailListRight}>
                                                <Text style={styles.topOrderTitleText2}>{CommonFuncion.currencyFormat(seitem.info.price)}원</Text>
                                                <Text style={styles.topOrderTitleText2}>-0원</Text>                                        
                                                <Text style={styles.topOrderTitleText2}>{CommonFuncion.currencyFormat(seitem.info.price)}원</Text>
                                            </View>
                                        </View>
                                    )
                                })
                                */
                                }
                            </View>
                            { ( this.state.isRepeatLecture || this.state.productType === 'mp3' )
                            ?
                            <View style={styles.delilveryWrapper}>
                                <View style={styles.deliveryHeadTitleWrapper}>
                                    <CustomTextB style={styles.topOrderTitleText}>배송 정보</CustomTextB>
                                </View>
                                <View style={styles.delilveryCommonRow}> 
                                    <View style={styles.delilveryCommonRowLeft}>
                                        <CustomTextR style={styles.tableLeftSubject}>· 받으시는 분</CustomTextR>
                                    </View>
                                    <View style={styles.delilveryCommonRowRight}>
                                        <CustomTextR style={styles.fontColor666}>{this.state.addressData_Name}</CustomTextR>
                                    </View>
                                </View> 

                                <View style={styles.delilveryCommonRow}> 
                                    <View style={styles.delilveryCommonRowLeft}>
                                        <CustomTextR style={styles.tableLeftSubject}>· 우편번호</CustomTextR>
                                    </View>
                                    <View style={styles.delilveryCommonRowRight}>
                                        <CustomTextR style={styles.fontColor666}>{this.state.addressData_zipcode}</CustomTextR>
                                    </View>
                                </View> 
                                <View style={styles.delilveryCommonRow}> 
                                    <View style={styles.delilveryCommonRowLeft}>
                                        <CustomTextR style={styles.tableLeftSubject}>· 주소</CustomTextR>
                                    </View>
                                    <View style={styles.delilveryCommonRowRight}>
                                        <CustomTextR style={styles.fontColor666}>{this.state.addressData_address} {this.state.addressData_addressDetail}</CustomTextR>
                                    </View>
                                </View>  
                                <View style={styles.delilveryCommonRow}> 
                                    <View style={styles.delilveryCommonRowLeft}>
                                        <CustomTextR style={styles.tableLeftSubject}>· 연락처</CustomTextR>
                                    </View>
                                    <View style={styles.delilveryCommonRowRight}>
                                        <CustomTextR style={styles.fontColor666}>{this.state.addressData_phone01}-{this.state.addressData_phone02}-{this.state.addressData_phone03}</CustomTextR>
                                    </View>
                                </View>     
                                <View style={styles.delilveryCommonRow}> 
                                    <View style={styles.delilveryCommonRowLeft}>
                                        <CustomTextR style={styles.tableLeftSubject}>· 배송메시지</CustomTextR>
                                    </View>
                                    <View style={styles.delilveryCommonRowRight}>
                                        <CustomTextR style={styles.fontColor666}>{this.state.addressData_message}</CustomTextR>
                                    </View>
                                </View>              
                            </View>
                            :
                            null
                            }

                            <View style={styles.delilveryWrapper}>
                                <View style={styles.deliveryHeadTitleWrapper}>
                                    <CustomTextB style={styles.topOrderTitleText}>결제 정보</CustomTextB>
                                </View>
                                <View style={styles.delilveryCommonRow}> 
                                    <View style={styles.delilveryCommonRowLeft}>    
                                        <CustomTextR style={styles.tableLeftSubject}>· 결제방법</CustomTextR>
                                    </View>
                                    <View style={styles.delilveryCommonRowRight}>
                                        <CustomTextR style={styles.fontColor666}>{this.state.settleMethodeName}</CustomTextR>
                                    </View>
                                </View> 

                                <View style={styles.delilveryCommonRow}> 
                                    <View style={styles.delilveryCommonRowLeft}>  
                                        <CustomTextR style={styles.tableLeftSubject}>· 판매가격</CustomTextR>
                                    </View>
                                    <View style={styles.delilveryCommonRowRight}>
                                        <CustomTextR style={styles.fontColor666}>{CommonFuncion.currencyFormat(this.state.baseFinalySettlePrice+this.state.baseTotalDiscountPrice)}원</CustomTextR>
                                    </View>
                                </View> 
                                <View style={styles.delilveryCommonRow}> 
                                    <View style={styles.delilveryCommonRowLeft}>  
                                        <CustomTextR style={styles.tableLeftSubject}>· 주문번호</CustomTextR>
                                    </View>
                                    <View style={styles.delilveryCommonRowRight}>
                                        <CustomTextR style={styles.fontColor666}>{this.state.orderNo}</CustomTextR>
                                    </View>
                                </View>  
                                <View style={styles.delilveryCommonRow}> 
                                    <View style={styles.delilveryCommonRowLeft}>  
                                        <CustomTextR style={styles.tableLeftSubject}>· 쿠폰/포인트{"\n    "}사용금액</CustomTextR>
                                    </View>
                                    <View style={styles.delilveryCommonRowRight}>
                                        <CustomTextR style={styles.fontColor666}>-{CommonFuncion.currencyFormat(this.state.baseTotalDiscountPrice)}원</CustomTextR>
                                    </View>
                                </View>     
                                <View style={styles.delilveryCommonRow2}> 
                                    <View style={styles.delilveryCommonRowLeft}>  
                                        <CustomTextR style={styles.tableLeftSubject}>· 주문일</CustomTextR>
                                    </View>
                                    <View style={styles.delilveryCommonRowRight}>
                                        <CustomTextR style={styles.fontColor666}>{moment().format('YYYY.MM.DD')}</CustomTextR>
                                    </View>
                                </View>              
                            </View>
                        </View>
                    </View>
                    <View style={[styles.container,{borderTopWidth:1,borderTopColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color}]}>
                        <View style={styles.settlePriceWrapper}>
                            <View style={styles.settlePriceTitleLeft}>
                                <CustomTextB style={styles.settlePriceTitleText}>·총결제금액</CustomTextB>
                            </View>
                            <View style={styles.settlePriceTitleRight}>
                                <CustomTextB style={styles.settlePriceTitleText}><TextRobotoB>{CommonFuncion.currencyFormat(parseInt(this.state.baseFinalySettlePrice))}</TextRobotoB>원</CustomTextB>
                            </View>
                        </View>
                    </View>
                    <View style={styles.commonHr1}></View>
                    <View style={[styles.topOrderWrapper,{paddingTop:20}]}>
                        {this.getPaymentfInfoMessage('0201') !== false &&
                            this.getPaymentfInfoMessage('0201').map((msg, index) => {
                                return (
                                    <DropDown                            
                                        style={index === 0 ? styles.dropdownWrapperTop : (index === this.getPaymentfInfoMessage('0201').length - 1 ? styles.dropdownWrapperBottom : styles.dropdownWrapperMiddle)}
                                        contentVisible={false}
                                        invisibleImage={IC_ARR_DOWN}
                                        visibleImage={IC_ARR_UP}
                                        header={
                                        <View style={styles.dropdownWrapperTopHeaderWrap}>
                                            <View style={styles.dropdownWrapperTopHeaderWrapIn}>
                                                <CustomTextR style={styles.dropdownTitleText}>
                                                    {msg.title || ''}
                                                </CustomTextR>
                                            </View>
                                        </View>
                                        }
                                        key={'0201_'+index}
                                    >
                                        <View style={styles.dropdownHiddenWrap}>
                                            <CustomTextR style={styles.dropdownContentText}>
                                                {msg.content || ''}
                                            </CustomTextR>
                                        </View>
                                    </DropDown>);
                            })
                        }

                        {this.getPaymentfInfoMessage('0202') !== false &&
                            this.getPaymentfInfoMessage('0202').map((msg, index) => {
                                return (
                                    <DropDown                            
                                        style={index === 0 ? styles.dropdownWrapperTop : (index === this.getPaymentfInfoMessage('0202').length - 1 ? styles.dropdownWrapperBottom : styles.dropdownWrapperMiddle)}
                                        contentVisible={false}
                                        invisibleImage={IC_ARR_DOWN}
                                        visibleImage={IC_ARR_UP}
                                        header={
                                        <View style={styles.dropdownWrapperTopHeaderWrap}>
                                            <View style={styles.dropdownWrapperTopHeaderWrapIn}>
                                                <CustomTextR style={styles.dropdownTitleText}>
                                                    {msg.title || ''}
                                                </CustomTextR>
                                            </View>
                                        </View>
                                        }
                                        key={'0202_'+index}
                                    >
                                        <View style={styles.dropdownHiddenWrap}>
                                            <CustomTextR style={styles.dropdownContentText}>
                                                {msg.content || ''}
                                            </CustomTextR>
                                        </View>                                
                                    </DropDown>);
                            })
                        }

                        {this.getPaymentfInfoMessage('0203') !== false &&
                            this.getPaymentfInfoMessage('0203').map((msg, index) => {
                                return (
                                    <DropDown                            
                                        style={index === 0 ? styles.dropdownWrapperTop : (index === this.getPaymentfInfoMessage('0203').length - 1 ? styles.dropdownWrapperBottom : styles.dropdownWrapperMiddle)}
                                        contentVisible={false}
                                        invisibleImage={IC_ARR_DOWN}
                                        visibleImage={IC_ARR_UP}
                                        header={
                                        <View style={styles.dropdownWrapperTopHeaderWrap}>
                                            <View style={styles.dropdownWrapperTopHeaderWrapIn}>
                                                <CustomTextR style={styles.dropdownTitleText}>
                                                    {msg.title || ''}
                                                </CustomTextR>
                                            </View>
                                        </View>
                                        }
                                        key={'0203_'+index}
                                    >
                                        <View style={styles.dropdownHiddenWrap}>
                                            <CustomTextR style={styles.dropdownContentText}>
                                                {msg.content || ''}
                                            </CustomTextR>
                                        </View>
                                    </DropDown>);
                            })
                        }

                        {this.getPaymentfInfoMessage('0204') !== false &&
                            this.getPaymentfInfoMessage('0204').map((msg, index) => {
                                return (
                                    <DropDown
                                        style={index === 0 ? styles.dropdownWrapperTop : (index === this.getPaymentfInfoMessage('0204').length - 1 ? styles.dropdownWrapperBottom : styles.dropdownWrapperMiddle)}
                                        contentVisible={false}
                                        invisibleImage={IC_ARR_DOWN}
                                        visibleImage={IC_ARR_UP}
                                        header={
                                        <View style={styles.dropdownWrapperTopHeaderWrap}>
                                            <View style={styles.dropdownWrapperTopHeaderWrapIn}>
                                                <CustomTextR style={styles.dropdownTitleText}>
                                                    {msg.title || ''}
                                                </CustomTextR>
                                            </View>
                                        </View>
                                        }
                                        key={'0204_'+index}
                                    >
                                        <View style={styles.dropdownHiddenWrap}>
                                            <CustomTextR style={styles.dropdownContentText}>
                                                {msg.content || ''}
                                            </CustomTextR>
                                        </View>
                                    </DropDown>);
                            })
                        }

                        {/* {this.getPaymentfInfoMessage(MESSAGE_PART_0204) !== false && (
                            <View style={styles.etcInformationWrapper}>
                                <View style={styles.etcInformationWrapperIn}>
                                    <View style={{flex:1}}>
                                        <CustomTextR style={[styles.dropdownTitleText]}>{this.getPaymentfInfoMessage(MESSAGE_PART_0204).title}</CustomTextR>
                                    </View>
                                    <View style={{flex:1,padding:10}}>
                                        <CustomTextR style={[styles.dropdownContentText, {color:DEFAULT_COLOR.base_color_888}]}>
                                            {this.getPaymentfInfoMessage(MESSAGE_PART_0204).content}
                                        </CustomTextR>
                                    </View>
                                </View>
                            </View>
                        )} */}

                        <View style={styles.agreeWideWrapper}>                            
                            <View style={this.state.agreeCheck01.checked ? styles.agreeWrapperOn : styles.agreeWrapper}>
                                <View style={styles.agreeWrapperLeft}>
                                    <CheckBox 
                                        containerStyle={{padding:0,margin:0}}   
                                        iconType='font-awesome'
                                        checkedIcon='check-circle'
                                        uncheckedIcon='check-circle'
                                        checkedColor={DEFAULT_COLOR.lecture_base}
                                        uncheckedColor={DEFAULT_COLOR.input_bg_color}
                                        onPress= {()=> {
                                            this.state.agreeCheck01.checked = !this.state.agreeCheck01.checked,
                                            this.setState({loading:true})
                                        }}
                                        checked={this.state.agreeCheck01.checked}
                                    />
                                </View>
                                <View style={styles.agreeWrapperRight}>
                                    <CustomTextR style={this.state.agreeCheck01.checked ? styles.dropdownTitleTextOn : styles.dropdownTitleText}>
                                        상기 내용을 확인 및 이해하였으며 이에 동의합니다.
                                    </CustomTextR>
                                </View>
                            </View>
                        </View>

                            
                    </View>
                    <View style={{backgroundColor:'#222'}}>
                        <View style={{flex:1,flexDirection:'row'}}>
                            <TouchableOpacity
                                style={styles.bottomButtonLeft}
                                onPress={()=> this.setState({showModal:true}) }
                                /*
                                onPress= {()=> this.props.navigation.navigate('LecturePayResult',{
                                    response  : {
                                        imp_success : true, 
                                        success : true , 
                                        imp_uid :'test_imp_uid',
                                        merchant_uid : 'test_merchant_uid',
                                        error_msg : null
                                    }
                                })}
                                */
                                >
                                <CustomTextB style={styles.bottomButtonText}>결제수단변경</CustomTextB>
                            </TouchableOpacity>
                            <TouchableOpacity                             
                                style={styles.bottomButtonRight}
                                onPress= {()=> this.onPressCallPg()}
                                >
                                <CustomTextB style={styles.bottomButtonText}>결제</CustomTextB>
                            </TouchableOpacity>
                            
                        </View>
                    </View>
                    
                </ScrollView>

                {/*  결제수단변경  */}
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
                            <CustomText style={styles.requestTitleText2}>
                            결제수단변경
                            </CustomText>
                            <TouchableOpacity 
                                onPress= {()=> this.closeModal()}
                                style={{position:'absolute',top:0,right:15,width:30,height:30}}>
                                <Icon name="close" size={25} color="#555" />
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:1,flexDirection:'row',flexWrap:'wrap',padding:5}}>
                           <ModalChagneMethode />
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
export default connect(mapStateToProps, null)(LectureSettleScreen);