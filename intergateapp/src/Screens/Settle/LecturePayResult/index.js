import React from 'react';
import { View,ScrollView,Dimensions,StyleSheet,ImageBackground,StatusBar, Platform,TouchableOpacity,PixelRatio,Image,ActivityIndicator } from 'react-native';
import { Text } from 'native-base';
import 'moment/locale/ko'
import  moment  from  "moment";
import Toast from 'react-native-tiny-toast';
import {connect} from 'react-redux';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
import CommonFuncion from '../../../Utils/CommonFunction'
import CommonUtil from '../../../Utils/CommonUtil';

import {CustomText, CustomTextR, CustomTextB, CustomTextM, CustomTextL, TextRobotoM, TextRobotoB} from '../../../Style/CustomText';
const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");
import { resultStyles, resultSuccessStyles, resultFailureStyles } from '../styles';
const { wrapper, title, listContainer, list, label, value } = resultStyles;

const startDateText =  moment().subtract(-7, 'd').format('YYYY년 MM월 DD일');

class LecturePayResult extends React.Component {
  constructor(props) {
    super(props);        
    this.state = {
      loading : true,
      paymentInformation : null,
      response : this.props.navigation.getParam('response'),
      information : this.props.navigation.getParam('settleData').information,
      isRepeatLecture : this.props.navigation.getParam('settleData').isRepeatLecture,
      myClassApiDomain : this.props.navigation.getParam('settleData').myClassApiDomain,
      myClassApiKey : this.props.navigation.getParam('settleData').myClassApiKey,
    }
  }
  
  async UNSAFE_componentWillMount() {         
    // [WARNING: 이해를 돕기 위한 것일 뿐, imp_success 또는 success 파라미터로 결제 성공 여부를 장담할 수 없습니다.]
    // 아임포트 서버로 결제내역 조회(GET /payments/${imp_uid})를 통해 그 응답(status)에 따라 결제 성공 여부를 판단하세요.
    //console.log('response',this.props.navigation.getParam('response'))
    //console.log('settleData',this.props.navigation.getParam('settleData'))
    if ( (this.props.navigation.getParam('response').imp_success === 'true' ||  this.props.navigation.getParam('response').imp_success === true ) && this.props.navigation.getParam('response').imp_uid )  {
      await this.refreshTextBookInfo(this.props.navigation.getParam('response').imp_uid)
      //await this.getCardList(this.props.navigation.getParam('settleData').information.iamPortTokenKey)
    }else{
      const alerttoast = Toast.show('정상적으로 결제가 이루어지지 않았습니다.\n잠시 뒤에 다시 이용해주세요');
      setTimeout(() => {
          Toast.hide(alerttoast);       
          this.props.navigation.goBack(null)
      }, 2000)
    }
  } 

  getCardList = async(access_token) => {
    console.log('responaccess_tokense22', access_token);
    if ( access_token !==  null ) {
        await CommonUtil.callAPI( DEFAULT_CONSTANTS.iamPortAPIDomain + '/cards' ,{
            method: 'GET', 
            headers: new Headers({
            Accept: 'application/json',                
            'Content-Type': 'application/json; charset=UTF-8',
            'imp_apikey': access_token
            }), 
            body:null
        },10000
        ).then(response => {
            console.log('getCardList response', response);
            if ( response.code !== -1 ) {
            
            }else{
            this.failCallAPi()
            }
        })
        .catch(err => {
            console.log('login error => ', err);
            this.failCallAPi()
        });
    }
}

  refreshTextBookInfo = async(uid) => {
    //console.log('imp_uid', uid);
    //console.log('token', this.props.navigation.getParam('settleData').information.iamPortTokenKey)
    if ( uid ) {

      console.log('LecturePayResult/index.js > refreshTextBookInfo()', 'url = ' + DEFAULT_CONSTANTS.iamPortAPIDomain + '/payments/' + uid + '?_token='+this.props.navigation.getParam('settleData').information.iamPortTokenKey)

      await CommonUtil.callAPI( DEFAULT_CONSTANTS.iamPortAPIDomain + '/payments/' + uid + '?_token='+this.props.navigation.getParam('settleData').information.iamPortTokenKey ,{
        method: 'GET', 
        headers: new Headers({
        Accept: 'application/json',                
          'Content-Type': 'application/json; charset=UTF-8',
          'imp_apikey': this.props.navigation.getParam('settleData').information.iamPortTokenKey
        }), 
        body:null
      },10000
      ).then(response => {
          console.log('LecturePayResult/index.js > refreshTextBookInfo()', 'response = ' + JSON.stringify(response))
        if ( response.code !== -1 ) {
          this.setState({            
            paymentInformation : response.response
          });
          //결제정보를 업데이트 한다
          this.updateSettleInformation(response, this.props.navigation.getParam('settleData').information)
          
        }else{
          this.failCallAPi()
        }
      })
      .catch(err => {
        console.log('login error => ', err);
        this.failCallAPi()
      });
    }else{
      this.failCallAPi();
    }
  }

  failCallAPi = () => {
    let message = "처리중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
    let timesecond = 2000;
    CommonFuncion.fn_call_toast(message,timesecond);
    
  }

  updateSettleInformation = async( pg_response, information) => {

    console.log('updateSettleInformation response', pg_response);
    console.log('updateSettleInformation information', information);

    let DATA_NULL = '';
        
    /*
    {
      "addressData_Email": "hackers@",
      "addressData_Name": "cdffee1",
      "addressData_address": "서울시",
      "addressData_addressDetail": "2222",
      "addressData_message": "2222",
      "addressData_phone01": "020",
      "addressData_phone02": "000",
      "addressData_phone03": "0000",
      "addressData_zipcode": "000000",
      "addressNew": false,
      "agreeCheck01": {"checked": true, "title": "동의"},
      "baseFinalySettlePrice": 64800,
      "baseTotalDiscountPrice": 10000,
      "baseTotalGoodsPrice": 69000,
      "baseTotalOptionsPrice": 5800,
      "baseTotalPrePoint": 2070,
      "discountPrice": 10000,
      "iamPortTokenKey": "dce4e5b8ac57042d076544c7eac6a714c24eb927",
      "isDeliveryPrice": false,
      "isselectTab": 1,
      "loading": true,
      "memberInfo": {"Address": "서울시", "DetailAddress": "미입력", "Email": "hackers@", "Name": "cdffee1", "Postcode": "000000", "TEL": "0200000000", "TEL1": "020", "TEL2": "000", "TEL3": "0000"},
      "optionSumPrice": 5800,
      "orderNo": "CHT2020051913343008",
      "productList": [{"basePrice": "69000", "discountAmount": 0, "eventcode": "", "extendsDay": 0, "freeOptionList": [Array], "memberProductIdx": 0, "optionList": [Array], "paymentAmount": 74800, "productData": [Object], "productType": ""}],
      "productType": "lecture",
      "resultScreen": "LecturePayResult",
      "selectItem": 1,
      "sendSettleData": {"title": "Hackers Vocabulary 2nd Edition 전반부"},
      "settleItems": [{"code": "card", "icon": 30, "iconimg": "reactserver.hackers.com/assets/react/icons/icon_payment_card.png", "index": 1, "seleced": true, "title": "신용/체크카드"}, {"code": "vbank", "icon": 35, "iconimg": "reactserver.hackers.com/assets/react/icons/icon_payment_bank.png", "index": 2, "seleced": false, "title": "무통장입금"}, {"code": "trans", "icon": 66, "iconimg": "reactserver.hackers.com/assets/react/icons/icon_payment_realtime.png", "index": 3, "seleced": false, "title": "실시간계좌이체"}],
      "settleMethodeCode": "vbank",
      "settleMethodeIndex": 1,
      "settleMethodeName": "무통장입금",
      "showModal": false, "showTopButton": true,
      "useCouponPoint": [{"couponIdx": "24389878", "isType": "coupon", "price": "10000", "productIdx": "6340"}],
      "useCouponPrice": 0,
      "usePoint": 0}

    useCouponPoint [
      {"couponIdx": null, "isType": "point", "price": "5000", "productIdx": "5725"},
      {"couponIdx": "24389879", "isType": "coupon", "price": 13800, "productIdx": "6340"}
    ]

    LOG  response {
  "code": 0, //LGD_RESPCODE (응답코드)
  "message": null, //LGD_RESPMSG (응답메세지)
  "response": {
    "amount": 75800, LGD_AMOUNT (결제금액)
    "apply_num": null,
    "bank_code": null,
    "bank_name": null,
    "buyer_addr": null,
    "buyer_email": "hackers@",  //LGD_BUYEREMAIL (구매자이메일)
    "buyer_name": "cdffee1",  //LGD_BUYER (구매자명)
    "buyer_postcode": null,
    "buyer_tel": "0200000000",  //LGD_BUYERPHONE (구매자휴대폰번호)
    "cancel_amount": 0,
    "cancel_history": [],
    "cancel_reason": null,
    "cancel_receipt_urls": [],
    "cancelled_at": 0,
    "card_code": null,
    "card_name": null,
    "card_number": null,   // LGD_CARDNUM (신용카드번호)
    "card_quota": 0,
    "card_type": null,
    "cash_receipt_issued": false,
    "channel": "mobile",
    "currency": "KRW",
    "custom_data": null,
    "customer_uid": null,
    "escrow": false,
    "fail_reason": null,
    "failed_at": 0,
    "imp_uid": "imp_369384819572",
    "merchant_uid": "CHT2020051315585913",  //LGD_OID (주문ID)
    "name": "Hackers Vocabulary 2nd Edition 전반부", //LGD_PRODUCTINFO (구매내역)
    "paid_at": 0,
    "pay_method": "vbank", //LGD_PAYTYPE 
    "pg_id": "tlgdacomxpay", // LGD_MID (상점ID)   
    "pg_provider": "uplus",
    "pg_tid": "tlgda2020051316201890179",  //LGD_TID (거래번호)
    "receipt_url": "http://pgweb.dacom.net:7085/pg/wmp/etc/jsp/Receipt_Link.jsp?mertid=tlgdacomxpay&tid=tlgda2020051316201890179&authdata=b78bee15c9f61f401b91e9dfbded6d03",
    "started_at": 1589354384,  //LGD_PAYDATE (결제일시)
    "status": "ready",
    "user_agent": "sorry_not_supported_anymore",
    "vbank_code": "004",
    "vbank_date": 0,
    "vbank_holder": "이크레디트",
    "vbank_issued_at": 1589354419,
    "vbank_name": "국민",
    "vbank_num": "X65659014070491"  //LGD_ACCOUNTNUM (무통장 가상계좌일련번호)
  }
  */
    
    let deliveryInfo = {
      'Name' : information.deliveryInfo,
      'TEL' : information.addressData_phone01 + information.addressData_phone02 + information.addressData_phone03,
      'TEL1' : information.addressData_phone01,
      'TEL2' : information.addressData_phone02,
      'TEL3' : information.addressData_phone03,
      'PostCode' : information.addressData_zipcode,
      'Address' : information.addressData_address,
      'DetailAddress' : information.addressData_addressDetail
    }
    /*
    let paymentData =  [];
    await information.useCouponPoint.forEach(function(element,index,array){            
      paymentData.push({
            productIdx : element.productIdx,
            pointAmount : element.isType === 'point' ? element.price : 0,
            couponAmount : element.isType === 'coupon' ? element.price : 0,
            couponIdx : element.isType === 'coupon' ? element.couponIdx : 0
        });            
    });
    */

    let card_code = "";
    if ( pg_response.response.pay_method === 'card' ) {
      switch(pg_response.response.card_code ) {
        case "361": card_code = "31";break; //비씨
        case "364": card_code = "46";break; //광주
        case "365": card_code = "51";break; //삼성
        case "366": card_code = "41";break; //신한
        case "367": card_code = "61";break; //현대
        case "368": card_code = "71";break; //롯데
        case "369": card_code = "34";break; //수협
        case "370": card_code = "36";break; //씨티
        case "371": card_code = "91";break; //NH농협
        case "372": card_code = "35";break; //전북
        case "373": card_code = "42";break; //제주
        case "374": card_code = "32";break; //하나
        case "381": card_code = "11";break; //국민
        case "041": card_code = "33";break; //우리
        case "071": card_code = "37";break; //우체국        
        case "VIS": card_code = "4V";break; //해외VISA
        case "MAS": card_code = "4M";break; //해외MASTER
        case "DIN": card_code = "6D";break; //해외DINERS
        case "JCB": card_code = "4J";break; //해외JCB
        case "UNI": card_code = "3C";break; //중국은련
      }      
    }

    let LGD_DATA = {
      'LGD_RESPCODE' : pg_response.code === 0 ? '0000' : pg_response.code,
      'LGD_RESPMSG' : pg_response.message,
      'LGD_MID' : pg_response.response.pg_id,
      'LGD_OID' : pg_response.response.merchant_uid,
      'LGD_AMOUNT' : pg_response.response.amount,
      'LGD_TID' : pg_response.response.pg_tid,
      'LGD_PAYTYPE' : pg_response.response.pay_method === 'vbank' ? 'SC0040' : pg_response.response.pay_method === 'trans' ? 'SC0030' : 'SC0010',
      'LGD_PAYDATE' : pg_response.response.started_at,
      'LGD_HASHDATA' : DATA_NULL,
      'LGD_FINANCECODE' : pg_response.response.pay_method === 'card' ? card_code : pg_response.response.vbank_code, //결제기관코드
      'LGD_FINANCENAME' : pg_response.response.pay_method === 'card' ? pg_response.response.card_name : pg_response.response.vbank_name, //결제기관명      
      'LGD_ESCROWYN' : pg_response.escrow ? 'Y' : 'N',
      'LGD_TRANSAMOUNT' : DATA_NULL,//환율적용금액 사용X
      'LGD_EXCHANGERATE' : DATA_NULL,  // 적용환율 사용X
      'LGD_CARDNUM' : pg_response.response.card_number,
      'LGD_CARDINSTALLMONTH' : pg_response.response.card_quota,
      'LGD_CARDNOINTYN' : DATA_NULL, //신용카드 무이자 여부 1 : 무이자  0 : 일반
      'LGD_FINANCEAUTHNUM' : pg_response.response.apply_num,// 결제기관승인번호
      'LGD_BUYER' : pg_response.response.buyer_name,
      'LGD_BUYERID' : DATA_NULL,//memberId???
      'LGD_BUYEREMAIL' : pg_response.response.buyer_email,
      'LGD_PRODUCTINFO' : pg_response.response.name,
      'LGD_CASHRECEIPTNUM' : DATA_NULL,// 계좌이체 현금영수증승인번호
      'LGD_CASHRECEIPTSELFYN' : DATA_NULL,
      'LGD_CASHRECEIPTKIND' : DATA_NULL,
      'LGD_ACCOUNTNUM' : pg_response.response.vbank_num,
      'LGD_CASTAMOUNT' : 0,// 누적금액
      'LGD_CASCAMOUNT' : 0,//현 입금금액
      'LGD_CASFLAG' : pg_response.response.pay_method === 'vbank' ? 'R' : '',//R : 할당, I : 입금, C : 취소
      'LGD_CASSEQNO' : DATA_NULL,
    }

    console.log('pg_response.response', pg_response.code)
    const formData = new FormData();        
    formData.append('memberIdx', this.props.userToken.memberIdx);
    formData.append('paymentStatus', 1);
    //formData.append('payment', paymentData.length > 0 ? JSON.stringify(paymentData) : '');
    !this.state.isRepeatLecture && formData.append('deliveryInfo', JSON.stringify(deliveryInfo));
    formData.append('paymentMethod', pg_response.response.pay_method === 'vbank' ? 'SC0040' : pg_response.response.pay_method === 'trans' ? 'SC0030' : 'SC0010');
    //여기서부터 LG U+ 정보
    formData.append('LGD', JSON.stringify(LGD_DATA));
    /*
    formData.append('LGD_RESPCODE', pg_response.code);
    formData.append('LGD_RESPMSG', pg_response.message);
    formData.append('LGD_MID', pg_response.response.pg_id);
    formData.append('LGD_OID', pg_response.response.merchant_uid);
    formData.append('LGD_AMOUNT', pg_response.response.amount);
    formData.append('LGD_TID', pg_response.response.pg_tid);
    formData.append('LGD_PAYTYPE', pg_response.response.pay_method);
    formData.append('LGD_PAYDATE', pg_response.response.started_at);
    formData.append('LGD_HASHDATA', DATA_NULL);
    formData.append('LGD_FINANCENAME', DATA_NULL);
    formData.append('LGD_FINANCECODE', DATA_NULL);
    formData.append('LGD_ESCROWYN', pg_response.escrow ? 'Y' : 'N');
    formData.append('LGD_TRANSAMOUNT', DATA_NULL);
    formData.append('LGD_EXCHANGERATE', DATA_NULL);
    formData.append('LGD_CARDNUM', pg_response.response.card_number);
    formData.append('LGD_CARDINSTALLMONTH', pg_response.response.card_quota);
    formData.append('LGD_CARDNOINTYN', DATA_NULL);  //신용카드 무이자 여부 1 : 무이자  0 : 일반
    formData.append('LGD_FINANCEAUTHNUM', pg_response.response.apply_num);  // 결제기관승인번호
    formData.append('LGD_BUYER', pg_response.response.buyer_name);
    formData.append('LGD_BUYERID', DATA_NULL); //memberId???
    formData.append('LGD_BUYEREMAIL', pg_response.response.buyer_email);
    formData.append('LGD_PRODUCTINFO', pg_response.response.buyer_name);
    //여기서부터 게좌이체
    formData.append('LGD_CASHRECEIPTNUM', DATA_NULL); // 계좌이체 현금영수증승인번호
    formData.append('LGD_CASHRECEIPTSELFYN', DATA_NULL);
    formData.append('LGD_CASHRECEIPTKIND', DATA_NULL);
    //여기서부터 무통장
    formData.append('LGD_ACCOUNTNUM', pg_response.response.vbank_num);
    formData.append('LGD_CASTAMOUNT', 0);  // 누적금액
    formData.append('LGD_CASCAMOUNT', 0); //현 입금금액
    formData.append('LGD_CASFLAG', information.settleMethodeCode === 'vbank' ? 'R' : ''); //R : 할당, I : 입금, C : 취소
    formData.append('LGD_CASSEQNO', DATA_NULL);   
    */

    // let aPIsDomain = typeof this.props.myInterestCodeOne.info.ApiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.ApiDomain : DEFAULT_CONSTANTS.apiTestDomain
    // let aPIsAuthKey = typeof this.props.myInterestCodeOne.info.ApiKey !== 'undefined' ? this.props.myInterestCodeOne.info.ApiKey : DEFAULT_CONSTANTS.apitestKey      
    let aPIsDomain =
        this.state.isRepeatLecture
            ? this.state.myClassApiDomain
            : typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
    let aPIsAuthKey =
        this.state.isRepeatLecture
            ? this.state.myClassApiKey
            : typeof this.props.myInterestCodeOne.info.apiKey !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey;

    console.log('LecturePayResult/index.js > updateSettleInformation()', 'url = ' + aPIsDomain + '/v1/payment/' + information.orderNo)
    console.log('LecturePayResult/index.js > updateSettleInformation()', 'formData = ' + JSON.stringify(formData))

    await CommonUtil.callAPI( aPIsDomain + '/v1/payment/' + information.orderNo ,{
        method: 'POST', 
        headers: new Headers({
          Accept: 'application/json',
          'apiKey': aPIsAuthKey,
          'Content-Type': 'multipart/form-data'
        }), 
            body:formData
        },10000
        ).then(response => {

            console.log('LecturePayResult/index.js > updateSettleInformation()', 'response = ' + JSON.stringify(response))

            if (response && typeof response === 'object' || Array.isArray(response) === false) {                   
              console.log('responseresponse',response)
                if ( response.code !== '0000' ) {
                    this.failCallAPi()
                }else{
                  this.setState({loading:false})
                  if ( typeof information.checkCartList !== 'undefined' && information.checkCartList.length > 0 ) {
                    console.log('information.checkCartList',information.checkCartList)
                    //장바구니일수있으니 전부 삭제한다.
                    this.removeMyCartData(information.checkCartList);
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

  removeMyCartData = async( information ) => {

    let productIdxArray =  [];
    await information.cartList.forEach(function(element,index,array){            
        productIdxArray.push({
            //productIdx : element.productIdx,
            cartIdx : element.cartIdx
        });            
    });
    console.log('productIdxArray => ', productIdxArray);
    if ( productIdxArray.length > 0 ) {
    const formData = new FormData();
      formData.append('memberIdx', this.props.userToken.memberIdx);
      formData.append('cartList', JSON.stringify(productIdxArray));
      console.log('formData => ', formData);

      /*
      let aPIsDomain = typeof this.props.myInterestCodeOne.info.ApiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.ApiDomain : DEFAULT_CONSTANTS.apiTestDomain
      let aPIsAuthKey = typeof this.props.myInterestCodeOne.info.ApiKey !== 'undefined' ? this.props.myInterestCodeOne.info.ApiKey : DEFAULT_CONSTANTS.apitestKey
      await CommonUtil.callAPI( aPIsDomain + '/v1/payment/cart/remove',{
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
              if ( response.code !== '0000' ) {                        
                  this.failCallAPi()
              }else{
                  this.setState({loading : false})
                  const alerttoast = Toast.show( '삭제 되었습니다');
                  setTimeout(() => {
                      Toast.hide(alerttoast);       
                      this.setState({
                          checkCartList: [],
                          checkeTotalSettlePrice : 0,
                          checkeTotalPoint : 0
                      })                
                      this.refreshTextBookInfo();  
                  }, 2000)
              } 
          })
          .catch(err => {
              console.log('login error => ', err);
              this.failCallAPi()
      });
      */
    }
  }

  render() {
    if ( this.state.loading ) {
      return (
        <View style={{flex: 1,width:'100%',backgroundColor : "#fff",textAlign: 'center',alignItems: 'center',justifyContent: 'center',}}>
          <ActivityIndicator size="large" />
          <CustomText style={{color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)}}>
            결제처리중입니다{"\n"}잠시만 기다려 주십시요
          </CustomText>
        </View>
      )
    }else {
      const { imp_success, success, imp_uid, merchant_uid, error_msg } = this.state.response;      
      const isSuccess = !(imp_success === 'false' || imp_success === false || success === 'false' || success === false);  
      const { icon, btn, btnText, btnIcon } = isSuccess ? resultSuccessStyles : resultFailureStyles;

      return (
        <View>
          { Platform.OS == 'android' && <StatusBar backgroundColor={DEFAULT_COLOR.lecture_base} translucent={false}  barStyle="dark-content" />}
          <ScrollView>
            <View style={styles.topWrapper}>
              <View style={styles.titleHeaderInfo}>                    
                <View style={styles.commoneTopWrap}>
                  <ImageBackground                                    
                    style={{position: 'absolute',top:0,left:0,bottom:0,right:0,backgroundColor:'transparent'}}
                    resizeMode='stretch'
                    source={require('../../../../assets/icons/bg_bill_card.png')}
                  />                                

                  {/*
                  <Icon
                  style={[icon,{paddingTop:30,fontSize:60}]}
                  type="AntDesign"
                  name={isSuccess ? 'checkcircle' : 'exclamationcircle'}
                  /> 
                  */}
                  <View style={{paddingTop:30,paddingBottom:20}}>
                    <Image 
                      resizeMode='contain'
                      source={require('../../../../assets/icons/icon_check_done.png')}
                      style={{width:PixelRatio.roundToNearestPixel(45),height:PixelRatio.roundToNearestPixel(45)}}
                    />        
                  </View>
                  <View style={{flexDirection:'row'}}>
                    <CustomTextB style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),letterSpacing:PixelRatio.roundToNearestPixel(-1)}}>
                      {this.state.information.addressData_Name}
                    </CustomTextB>
                    <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),letterSpacing:PixelRatio.roundToNearestPixel(-1)}}>{`님의`}</CustomTextR>
                  </View>
                  <View style={{paddingVertical:5}}>
                    { 
                      this.state.information.productType === 'lecture' 
                      ?
                      <CustomTextR style={[title,{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),letterSpacing:PixelRatio.roundToNearestPixel(-1)}]}>
                        {`수강신청이 ${isSuccess ? '완료' : '실패'}하였습니다`}
                      </CustomTextR>
                      :
                      <CustomTextR style={[title,{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),letterSpacing:PixelRatio.roundToNearestPixel(-1)}]}>
                        {`구매처리가 ${isSuccess ? '완료' : '실패'}하였습니다`}
                      </CustomTextR>
                    }
                    
                  </View>
                  <View style={{height:1,width:'80%',backgroundColor:DEFAULT_COLOR.lecture_base,marginVertical:10}} />
                  <CustomTextB style={[title,{color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}]}>
                      {`주문번호 : `} {merchant_uid}
                  </CustomTextB>
                  { this.state.information.settleMethodeCode === 'vbank' &&
                    <View style={{paddingVertical:10,marginVertical:20}}>
                      <CustomTextR style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:PixelRatio.roundToNearestPixel(-0.6)}}>
                        아래의 무통장입금 정보를 확인하여
                      </CustomTextR>
                      <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),textDecorationLine:'underline',letterSpacing:PixelRatio.roundToNearestPixel(-0.6)}}>
                        {startDateText}(신청일로부터 7일내)까지
                      </CustomTextR>
                      <CustomTextR style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:PixelRatio.roundToNearestPixel(-0.6)}}>
                        입금해주시기 바랍니다.
                      </CustomTextR>
                    </View>
                  }  
                </View>
                
              </View>
            </View>
            { this.state.information.settleMethodeCode === 'vbank' && this.state.paymentInformation !== null &&
            <View>
              <View style={styles.middleWrapper}>
                <CustomTextB style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:PixelRatio.roundToNearestPixel(-0.75)}}>무통장 입금정보</CustomTextB>
                <View style={{height:1,width:'100%',backgroundColor:DEFAULT_COLOR.base_color_222,marginVertical:10}} />  
                <View style={{flex:1,flexDirection:'row',paddingVertical:10}}>
                  <View style={{flex:1}} >
                    <CustomTextR style={styles.defaultFont1}>상태</CustomTextR>
                  </View> 
                  <View style={{flex:1,alignItems:'flex-end'}} >
                    <CustomTextM style={styles.defaultFont1}>입금대기</CustomTextM>
                  </View>                
                </View>
                <View style={{flex:1,flexDirection:'row',paddingVertical:10}}>
                  <View style={{flex:1}} >
                    <CustomTextR style={styles.defaultFont1}>예금주</CustomTextR>
                  </View> 
                  <View style={{flex:1,alignItems:'flex-end'}} >
                    <CustomTextM style={styles.defaultFont1}>{this.state.paymentInformation.vbank_holder}</CustomTextM>
                  </View>                
                </View>
                <View style={{flex:1,flexDirection:'row',paddingVertical:10}}>
                  <View style={{flex:1}} >
                    <CustomTextR style={styles.defaultFont1}>은행</CustomTextR>
                  </View> 
                  <View style={{flex:1,alignItems:'flex-end'}} >
                    <CustomTextM style={styles.defaultFont1}>{this.state.paymentInformation.vbank_name}</CustomTextM>
                  </View>                
                </View>
                <View style={{flex:1,flexDirection:'row',paddingVertical:10}}>
                  <View style={{flex:1}} >
                    <CustomTextR style={styles.defaultFont1}>계좌번호</CustomTextR>
                  </View> 
                  <View style={{flex:1,alignItems:'flex-end'}} >
                    <CustomTextM style={styles.defaultFont1}>{this.state.paymentInformation.vbank_num}</CustomTextM>
                  </View>                
                </View>
              </View>
              <View style={{flex:1,backgroundColor:DEFAULT_COLOR.input_bg_color,paddingVertical:20,borderTopWidth:1,borderTopColor:DEFAULT_COLOR.input_border_color}}>
                <View style={{flex:1,paddingHorizontal:20}} >
                  <CustomTextB style={{color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:PixelRatio.roundToNearestPixel(-0.7)}}>
                    발급된 무통장 입금 계좌는 발급후 1주일간만 유효합니다.
                  </CustomTextB>
                </View>
                <View style={{flex:1,paddingHorizontal:20,paddingTop:5}} >
                  <CustomTextR style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:PixelRatio.roundToNearestPixel(-0.6)}}>
                    1주일내에 입금해주셔야 정상적으로 결제가 완료됩니다.{"\n"}
                    가상계좌는 마이클래스 결제내역에서 다시 확인하실 수 있습니다.
                  </CustomTextR>
                </View>
              </View>  
              <View style={{height:10,width:'100%',backgroundColor:'#eaebee'}} />
            </View>            
            }

            <View style={styles.middleWrapper}>
              <CustomTextB style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:PixelRatio.roundToNearestPixel(-0.75)}}>주문내역</CustomTextB>
              <View style={{height:1,width:'100%',backgroundColor:DEFAULT_COLOR.base_color_222,marginVertical:10}} />
              <View style={{flex:1,flexDirection:'row',paddingVertical:10}}>
                <View style={{flex:1}} >
                  <CustomTextR style={styles.defaultFont1}>총 주문금액</CustomTextR>
                </View> 
                <View style={{flex:1,alignItems:'flex-end'}} >
                  <CustomTextM style={styles.defaultFont1}><TextRobotoM>{CommonFuncion.currencyFormat(parseInt(this.state.information.baseFinalySettlePrice))}</TextRobotoM>원</CustomTextM>
                </View>                
              </View>
              <View style={{flex:1,flexDirection:'row',paddingVertical:10}}>
                <View style={{flex:1}} >
                  <CustomTextR style={styles.defaultFont1}>할인 금액</CustomTextR>
                </View> 
                <View style={{flex:1,alignItems:'flex-end'}} >
                  <CustomTextM style={styles.defaultFont1}><TextRobotoM>-{CommonFuncion.currencyFormat(parseInt(this.state.information.baseTotalDiscountPrice))}</TextRobotoM>원</CustomTextM>
                </View>                
              </View>
              <View style={{flex:1,flexDirection:'row',paddingVertical:10}}>
                <View style={{flex:1}} >
                  <CustomTextR style={styles.defaultFont1}>배송비</CustomTextR>
                </View> 
                <View style={{flex:1,alignItems:'flex-end'}} >
                  <CustomTextM style={styles.defaultFont1}><TextRobotoM>+{CommonFuncion.currencyFormat(this.state.information.isDeliveryPrice ? 2500 : 0)}</TextRobotoM>원</CustomTextM>
                </View>                
              </View>
              <View style={{flex:1,flexDirection:'row',paddingVertical:10}}>
                <View style={{flex:1}} >
                  <CustomTextR style={styles.defaultFont1}>포인트 적립</CustomTextR>
                </View> 
                <View style={{flex:1,alignItems:'flex-end'}} >
                  <CustomTextM style={styles.defaultFont1}><TextRobotoM>{CommonFuncion.currencyFormat(this.state.information.baseTotalPrePoint ? this.state.information.baseTotalPrePoint : 0)}</TextRobotoM>P</CustomTextM>
                </View>                
              </View>
              <View style={{flex:1,flexDirection:'row',paddingVertical:10}}>
                <View style={{flex:1}} >
                  <CustomTextR style={styles.defaultFont1}>결제수단</CustomTextR>
                </View> 
                <View style={{flex:1,alignItems:'flex-end'}} >
                  <CustomTextM style={styles.defaultFont1}>{this.state.information.settleMethodeName}</CustomTextM>
                </View>                
              </View>
            </View>

            <View style={{flex:1,flexDirection:'row',backgroundColor:DEFAULT_COLOR.input_bg_color,paddingVertical:20,borderTopWidth:1,borderTopColor:DEFAULT_COLOR.input_border_color}}>
              <View style={{flex:1,paddingLeft:20}} >
                <CustomTextB style={{color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),letterSpacing:PixelRatio.roundToNearestPixel(-0.8)}}>총 상품금액</CustomTextB>
              </View>
              <View style={{flex:1,alignItems:'flex-end',paddingRight:20}} >
                <CustomTextB style={{color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20)}}>
                  <TextRobotoB>{CommonFuncion.currencyFormat(parseInt(this.state.information.baseFinalySettlePrice))}</TextRobotoB>원
                </CustomTextB>
              </View>
            </View>  
            <View style={{backgroundColor:'#222'}}>
              <View style={{flex:1,flexDirection:'row'}}>
                <TouchableOpacity                             
                  style={{flex:1,backgroundColor:'#000',paddingVertical:20,alignItems:'center',justifyContent:'center'}}
                  onPress= {()=> this.props.navigation.goBack()}
                >
                  <CustomTextB style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),letterSpacing:PixelRatio.roundToNearestPixel(-0.9)}}>이전화면</CustomTextB>
                </TouchableOpacity>
                <TouchableOpacity                             
                  style={{flex:1,backgroundColor:DEFAULT_COLOR.lecture_base,paddingVertical:20,alignItems:'center',justifyContent:'center'}}
                  onPress= {()=> {
                      // this.props.navigation.replace('MyClassScreen') 
                      this.props.navigation.popToTop();
                      this.props.navigation.navigate('MyClassScreen'); 
                    }}
                >
                  <CustomTextB style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),letterSpacing:PixelRatio.roundToNearestPixel(-0.9)}}>나의 강의실</CustomTextB>
                </TouchableOpacity>
              </View>
            </View>          
          </ScrollView>
        </View>
      )
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,        
    //alignItems: 'center',
    backgroundColor : 'transparent',
  },
  IndicatorContainer : {
    flex: 1,
    width:'100%',
    backgroundColor : '#fff',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topWrapper : {
    minHeight : Platform.OS === 'ios' ? SCREEN_HEIGHT/3+20 : SCREEN_HEIGHT/3+50 ,
    //maxHeight : Platform.OS === 'ios' ? SCREEN_HEIGHT/3+120 : SCREEN_HEIGHT/3+150 ,
    width:SCREEN_WIDTH,   
    backgroundColor : DEFAULT_COLOR.lecture_base,
    alignItems : 'center',
    justifyContent : 'center'
  },
  middleWrapper : {
    flex:1,
    marginTop:10,
    paddingVertical:30,
    paddingHorizontal:30
  },    
  titleHeaderInfo : {
    flex:1,
    width:SCREEN_WIDTH - 20,
    backgroundColor : 'transparent',
  },
  commoneTopWrap : {        
    top:30,
    minHeight : Platform.OS === 'ios' ? SCREEN_HEIGHT/3+20 : SCREEN_HEIGHT/3+50 ,
    borderTopStartRadius : 20,
    borderTopEndRadius : 20,        
    backgroundColor : 'transparent',
    alignItems:'center',
  },
  defaultFont1 : {
    color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:PixelRatio.roundToNearestPixel(-0.75)
  }
})

function mapStateToProps(state) {
  return {
      myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,
      userToken: state.GlabalStatus.userToken,
  };
}

export default connect(mapStateToProps, null)(LecturePayResult);

/*

{
  "code": 0,
  "message": null,
  "response": [
  {
  "code": "361",
  "name": "BC카드"
  },
  {
  "code": "364",
  "name": "광주카드"
  },
  {
  "code": "365",
  "name": "삼성카드"
  },
  {
  "code": "366",
  "name": "신한카드"
  },
  {
  "code": "367",
  "name": "현대카드"
  },
  {
  "code": "368",
  "name": "롯데카드"
  },
  {
  "code": "369",
  "name": "수협카드"
  },
  {
  "code": "370",
  "name": "씨티카드"
  },
  {
  "code": "371",
  "name": "NH카드"
  },
  {
  "code": "372",
  "name": "전북카드"
  },
  {
  "code": "373",
  "name": "제주카드"
  },
  {
  "code": "374",
  "name": "하나SK카드"
  },
  {
  "code": "381",
  "name": "KB국민카드"
  },
  {
  "code": "041",
  "name": "우리카드"
  },
  {
  "code": "071",
  "name": "우체국카드"
  },
  {
  "code": "VIS",
  "name": "해외비자카드"
  },
  {
  "code": "MAS",
  "name": "해외마스터카드"
  },
  {
  "code": "DIN",
  "name": "해외다이너스카드"
  },
  {
  "code": "AMX",
  "name": "해외아멕스카드"
  },
  {
  "code": "JCB",
  "name": "해외JCB카드"
  },
  {
  "code": "UNI",
  "name": "중국은련카드"
  },
  {
  "code": "DIS",
  "name": "해외디스커버카드"
  }
  ]
}

{
  "code": 0,
  "message": null,
  "response": [
  {
  "code": "001",
  "name": "한국은행"
  },
  {
  "code": "002",
  "name": "산업은행"
  },
  {
  "code": "003",
  "name": "기업은행"
  },
  {
  "code": "004",
  "name": "국민은행"
  },
  {
  "code": "007",
  "name": "수협중앙회"
  },
  {
  "code": "008",
  "name": "수출입은행"
  },
  {
  "code": "011",
  "name": "농협은행"
  },
  {
  "code": "012",
  "name": "지역농.축협"
  },
  {
  "code": "020",
  "name": "우리은행"
  },
  {
  "code": "023",
  "name": "SC은행"
  },
  {
  "code": "027",
  "name": "한국씨티은행"
  },
  {
  "code": "031",
  "name": "대구은행"
  },
  {
  "code": "032",
  "name": "부산은행"
  },
  {
  "code": "034",
  "name": "광주은행"
  },
  {
  "code": "035",
  "name": "제주은행"
  },
  {
  "code": "037",
  "name": "전북은행"
  },
  {
  "code": "039",
  "name": "경남은행"
  },
  {
  "code": "045",
  "name": "새마을금고중앙회"
  },
  {
  "code": "048",
  "name": "신협중앙회"
  },
  {
  "code": "050",
  "name": "상호저축은행"
  },
  {
  "code": "052",
  "name": "모건스탠리은행"
  },
  {
  "code": "054",
  "name": "HSBC은행"
  },
  {
  "code": "055",
  "name": "도이치은행"
  },
  {
  "code": "056",
  "name": "알비에스피엘씨은행"
  },
  {
  "code": "057",
  "name": "제이피모간체이스은행"
  },
  {
  "code": "058",
  "name": "미즈호은행"
  },
  {
  "code": "059",
  "name": "미쓰비시도쿄UFJ은행"
  },
  {
  "code": "060",
  "name": "BOA은행"
  },
  {
  "code": "061",
  "name": "비엔피파리바은행"
  },
  {
  "code": "062",
  "name": "중국공상은행"
  },
  {
  "code": "063",
  "name": "중국은행"
  },
  {
  "code": "064",
  "name": "산림조합중앙회"
  },
  {
  "code": "065",
  "name": "대화은행"
  },
  {
  "code": "066",
  "name": "교통은행"
  },
  {
  "code": "071",
  "name": "우체국"
  },
  {
  "code": "076",
  "name": "신용보증기금"
  },
  {
  "code": "077",
  "name": "기술보증기금"
  },
  {
  "code": "081",
  "name": "KEB하나은행"
  },
  {
  "code": "088",
  "name": "신한은행"
  },
  {
  "code": "089",
  "name": "케이뱅크"
  },
  {
  "code": "090",
  "name": "카카오뱅크"
  },
  {
  "code": "093",
  "name": "한국주택금융공사"
  },
  {
  "code": "094",
  "name": "서울보증보험"
  },
  {
  "code": "095",
  "name": "경찰청"
  },
  {
  "code": "096",
  "name": "한국전자금융(주)"
  },
  {
  "code": "099",
  "name": "금융결제원"
  },
  {
  "code": "209",
  "name": "유안타증권"
  },
  {
  "code": "218",
  "name": "현대증권"
  },
  {
  "code": "221",
  "name": "골든브릿지투자증권"
  },
  {
  "code": "222",
  "name": "한양증권"
  },
  {
  "code": "223",
  "name": "리딩투자증권"
  },
  {
  "code": "224",
  "name": "BNK투자증권"
  },
  {
  "code": "225",
  "name": "IBK투자증권"
  },
  {
  "code": "226",
  "name": "KB투자증권"
  },
  {
  "code": "227",
  "name": "KTB투자증권"
  },
  {
  "code": "230",
  "name": "미래에셋증권"
  },
  {
  "code": "238",
  "name": "대우증권"
  },
  {
  "code": "240",
  "name": "삼성증권"
  },
  {
  "code": "243",
  "name": "한국투자증권"
  },
  {
  "code": "247",
  "name": "NH투자증권"
  },
  {
  "code": "261",
  "name": "교보증권"
  },
  {
  "code": "262",
  "name": "하이투자증권"
  },
  {
  "code": "263",
  "name": "HMC투자증권"
  },
  {
  "code": "264",
  "name": "키움증권"
  },
  {
  "code": "265",
  "name": "이베스트투자증권"
  },
  {
  "code": "266",
  "name": "SK증권"
  },
  {
  "code": "267",
  "name": "대신증권"
  },
  {
  "code": "269",
  "name": "한화투자증권"
  },
  {
  "code": "270",
  "name": "하나대투증권"
  },
  {
  "code": "278",
  "name": "신한금융투자"
  },
  {
  "code": "279",
  "name": "동부증권"
  },
  {
  "code": "280",
  "name": "유진투자증권"
  },
  {
  "code": "287",
  "name": "메리츠종합금융증권"
  },
  {
  "code": "289",
  "name": "NH투자증권"
  },
  {
  "code": "290",
  "name": "부국증권"
  },
  {
  "code": "291",
  "name": "신영증권"
  },
  {
  "code": "292",
  "name": "엘아이지투자증권"
  },
  {
  "code": "293",
  "name": "한국증권금융"
  },
  {
  "code": "294",
  "name": "펀드온라인코리아"
  },
  {
  "code": "295",
  "name": "우리종합금융"
  },
  {
  "code": "296",
  "name": "삼성선물"
  },
  {
  "code": "297",
  "name": "외환선물"
  },
  {
  "code": "298",
  "name": "현대선물"
  }
  ]
}

"{
    ""memberIdx"": 0,
    ""paymentStatus"": 1,
    ""payment"":[
        {""productIdx"": 0, ""pointAmount"": 0, ""couponIdx"": 0, ""couponAmount"": 0}
    ],
    ""deliveryInfo"": {
        ""Name"": ""홍길동"", ""TEL"": ""01012345678"",
        ""TEL1"": ""010"", ""TEL2"": ""1234"", ""TEL3"": ""5678"",
        ""Postcode"": null, ""Address"": null, ""DetailAddress"": null
    },
    ""paymentMethod"": """",
    ""LGD"": {
        LGD_RESPCODE (응답코드)
        LGD_RESPMSG (응답메세지)
        LGD_MID (상점ID)
        LGD_OID (주문ID)
        LGD_AMOUNT (결제금액)
        LGD_TID (거래번호)
        LGD_PAYTYPE (결제수단코드)  
        LGD_PAYDATE (결제일시)
        LGD_HASHDATA (해쉬데이터)  //일단없음
        LGD_FINANCENAME (결제기관명)
        LGD_FINANCECODE (결제기관코드)
        LGD_ESCROWYN (최종에스크로적용여부)
        LGD_TRANSAMOUNT (환율적용금액)
        LGD_EXCHANGERATE (적용환율)
        LGD_CARDNUM (신용카드번호)
        LGD_CARDINSTALLMONTH (신용카드 할부개월)
        LGD_CARDNOINTYN (신용카드 무이자할부여부)
        LGD_FINANCEAUTHNUM (결제기관승인번호)
        LGD_BUYER (구매자명)
        LGD_BUYERID (구매자아이디)
        LGD_BUYERPHONE (구매자휴대폰번호)
        LGD_BUYEREMAIL (구매자이메일)
        LGD_PRODUCTINFO (구매내역)
        LGD_CASHRECEIPTNUM (현금영수증 승인번호)
        LGD_CASHRECEIPTSELFYN (현금영수증 자진발급유무)
        LGD_CASHRECEIPTKIND (현금영수증 종류)
        LGD_ACCOUNTNUM (무통장 입금할 계좌번호)
        LGD_CASTAMOUNT (무통장 입금누적금액)
        LGD_CASCAMOUNT (무통장 현입금금액)
        LGD_CASFLAG (무통장 거래종류)
        LGD_CASSEQNO (무통장 가상계좌일련번호)
    }
}"

LOG  imp_uid imp_369384819572
LOG  token 85b64325632cacc230816f84de46536b4a46674c
LOG  response {
  "code": 0, //LGD_RESPCODE (응답코드)
  "message": null, //LGD_RESPMSG (응답메세지)
  "response": {
    "amount": 75800, LGD_AMOUNT (결제금액)
    "apply_num": null,
    "bank_code": null,
    "bank_name": null,
    "buyer_addr": null,
    "buyer_email": "hackers@",  //LGD_BUYEREMAIL (구매자이메일)
    "buyer_name": "cdffee1",  //LGD_BUYER (구매자명)
    "buyer_postcode": null,
    "buyer_tel": "0200000000",  //LGD_BUYERPHONE (구매자휴대폰번호)
    "cancel_amount": 0,
    "cancel_history": [],
    "cancel_reason": null,
    "cancel_receipt_urls": [],
    "cancelled_at": 0,
    "card_code": null,
    "card_name": null,
    "card_number": null,   // LGD_CARDNUM (신용카드번호)
    "card_quota": 0,
    "card_type": null,
    "cash_receipt_issued": false,
    "channel": "mobile",
    "currency": "KRW",
    "custom_data": null,
    "customer_uid": null,
    "escrow": false,
    "fail_reason": null,
    "failed_at": 0,
    "imp_uid": "imp_369384819572",
    "merchant_uid": "CHT2020051315585913",  //LGD_OID (주문ID)
    "name": "Hackers Vocabulary 2nd Edition 전반부", //LGD_PRODUCTINFO (구매내역)
    "paid_at": 0,
    "pay_method": "vbank", //LGD_PAYTYPE 
    "pg_id": "tlgdacomxpay", // LGD_MID (상점ID)   
    "pg_provider": "uplus",
    "pg_tid": "tlgda2020051316201890179",  //LGD_TID (거래번호)
    "receipt_url": "http://pgweb.dacom.net:7085/pg/wmp/etc/jsp/Receipt_Link.jsp?mertid=tlgdacomxpay&tid=tlgda2020051316201890179&authdata=b78bee15c9f61f401b91e9dfbded6d03",
    "started_at": 1589354384,  //LGD_PAYDATE (결제일시)
    "status": "ready",
    "user_agent": "sorry_not_supported_anymore",
    "vbank_code": "004",
    "vbank_date": 0,
    "vbank_holder": "이크레디트",
    "vbank_issued_at": 1589354419,
    "vbank_name": "국민",
    "vbank_num": "X65659014070491"  //LGD_CASSEQNO (무통장 가상계좌일련번호)
  }
}
 */

