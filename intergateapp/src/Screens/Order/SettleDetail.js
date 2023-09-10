import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    Text,
    Dimensions,
    PixelRatio,
    BackHandler,
    ActivityIndicator
} from 'react-native';
import {connect} from 'react-redux';
import { NavigationEvents } from 'react-navigation';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextB, CustomTextL,CustomTextM,TextRobotoM,TextRobotoR} from '../../Style/CustomText';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

class SettleDetail extends Component {
    constructor(props) {
        super(props);
        this.state =  {
            loading : true,
            itemData : [],
            productList : [],
            deliveryProductList : []
        }
    }

    async UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);    
        if ( this.props.navigation.state.params.titem.orderNo ) {
            await this.refreshTextBookInfo(this.props.navigation.state.params.titem.orderNo );
        }else{
            await this.failRequired();
        }
    }


    componentDidMount() {        
              
 
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
    }  

    handleBackButton = () => {
        this.props.navigation.goBack(null);    
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);      
        return true;
    };

    failRequired = () => {

        const alerttoast = Toast.show('필수항목이 누락된 잘못된 접근입니다.\n잠시 뒤에 다시 이용해주세요');
        setTimeout(() => {
            Toast.hide(alerttoast);       
            this.props.navigation.goBack(null)
        }, 2000)
    }

    refreshTextBookInfo = async(orderNo) => {

        const memberIdx = this.props.userToken.memberIdx;
        const aPIsDomain = typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain
        const aPIsAuthKey = typeof this.props.myInterestCodeOne.info.apiKey !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey   
        await CommonUtil.callAPI( aPIsDomain + '/v1/mypayment/'+memberIdx+'/'+orderNo,{
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
                        this.failCallAPi(response.message || '결제 내역 상세 조회 실패');
                    }else{                        
                        if ( typeof response.data.payment !== 'undefined') {                            
                            if ( typeof response.data.payment.deliveryProductName !== 'undefined' ) {
                                this.setState({                                    
                                    deliveryProductList :  response.data.payment.deliveryProductName
                                })
                            }

                            this.setState({
                                loading : false,
                                itemData : response.data.payment,
                                productList : response.data.payment.productName
                            })
                            
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

    failCallAPi = () => {
        let message = "데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);
    }

    render() {
        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        }else {
            //let productNameList = this.state.itemData.productName.replace('[','').replace(']','');
            return(
                <View style={ styles.container }>
                    <NavigationEvents
                        onWillFocus={payload => {
                            console.log('onWillFocus')
                            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);          
                        }}
                        onWillBlur={payload => {
                            console.log('onWillBlur')
                            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
                        }}
                    />
                    <ScrollView>
                        <View style={styles.topWrapper} />
                        <View style={{zIndex:5,width:SCREEN_WIDTH,alignItems:'center',justifyContent:'center',paddingTop:20}}>
                            
                            <View style={styles.titleHeaderInfo}>
                                <View style={styles.commoneTopWrap}>
                                    <View style={{margin:20}}>
                                        {
                                               
                                            this.state.productList.map((pdata,pindex) => {
                                                return (
                                                    <View style={{flex:1,paddingVertical:10,borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1}} key={pindex}>
                                                        <CustomTextR style={styles.defaultProduct}>{pdata.productName}</CustomTextR>
                                                    </View>
                                                )
                                            })
                                            
                                        }
                                        <View style={{flex:1,flexDirection:'row',paddingVertical:10,marginTop:10}}>
                                            <View style={{flex:1}} >
                                                <CustomTextR style={styles.defaultFont1}>상품 금액</CustomTextR>
                                            </View> 
                                            <View style={{flex:1,alignItems:'flex-end'}} >
                                                <CustomTextM style={styles.defaultFont1}>{CommonFuncion.currencyFormat(this.state.itemData.totalAmount)}원</CustomTextM>
                                            </View>                
                                        </View>
                                        <View style={{flex:1,flexDirection:'row',paddingVertical:10}}>
                                            <View style={{flex:1}} >
                                                <CustomTextR style={styles.defaultFont1}>할인 금액</CustomTextR>
                                            </View> 
                                            <View style={{flex:1,alignItems:'flex-end'}} >
                                                <CustomTextM style={styles.defaultFont1}>-{CommonFuncion.currencyFormat(this.state.itemData.discountAmt)}원</CustomTextM>
                                            </View>                
                                        </View>
                                        <View style={{flex:1,flexDirection:'row',paddingVertical:10}}>
                                            <View style={{flex:1}} >
                                                <CustomTextR style={styles.defaultFont1}>예상 적립 포인트</CustomTextR>
                                            </View> 
                                            <View style={{flex:1,alignItems:'flex-end'}} >
                                                <CustomTextM style={styles.defaultFont1}>{CommonFuncion.currencyFormat(this.state.itemData.prePoint)}P</CustomTextM>
                                            </View>                
                                        </View>
                                        <View style={{flex:1,flexDirection:'row',paddingVertical:10}}>
                                            <View style={{flex:1}} >
                                                <CustomTextB style={styles.defaultFont0}>총 결제 금액</CustomTextB>
                                            </View> 
                                            <View style={{flex:1,alignItems:'flex-end'}} >
                                                <CustomTextB style={styles.defaultFont0}>{CommonFuncion.currencyFormat(this.state.itemData.paymentAmt)}원</CustomTextB>
                                            </View>                
                                        </View>

                                    </View>
                                
                                </View>  
                            </View>

                            <View style={styles.titleBodyInfo}>
                                <View style={styles.middleWrapper}>
                                    <CustomTextB style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>
                                        결제정보
                                    </CustomTextB>
                                    <View style={{height:1,width:'100%',backgroundColor:DEFAULT_COLOR.base_color_222,marginVertical:10}} />
                                    <View style={styles.infoWrapper}>
                                        <View style={{flex:1}} >
                                            <CustomTextR style={styles.defaultFont1}>∙ 결제방법</CustomTextR>
                                        </View> 
                                        <View style={{flex:2}} >
                                            <CustomTextR style={styles.defaultFont12}>{this.state.itemData.paymentMethod}</CustomTextR>
                                        </View>                
                                    </View>
                                    <View style={styles.infoWrapper}>
                                        <View style={{flex:1}} >
                                            <CustomTextR style={styles.defaultFont1}>∙ 판매가격</CustomTextR>
                                        </View> 
                                        <View style={{flex:2}} >
                                            <CustomTextR style={styles.defaultFont12}>{CommonFuncion.currencyFormat(this.state.itemData.totalAmount)}원</CustomTextR>
                                        </View>                
                                    </View>
                                    <View style={styles.infoWrapper}>
                                        <View style={{flex:1}} >
                                            <CustomTextR style={styles.defaultFont1}>∙ 쿠폰/포인트{"\n"}  사용금액</CustomTextR>
                                        </View> 
                                        <View style={{flex:2}} >
                                            <CustomTextR style={styles.defaultFont12}>-{CommonFuncion.currencyFormat(this.state.itemData.pointcpnAmt)}원</CustomTextR>
                                        </View>                
                                    </View>
                                    <View style={styles.infoWrapper}>
                                        <View style={{flex:1}} >
                                            <CustomTextR style={styles.defaultFont1}>∙ 주문번호</CustomTextR>
                                        </View> 
                                        <View style={{flex:2}} >
                                            <CustomTextR style={styles.defaultFont12}>{this.state.itemData.orderNo}</CustomTextR>
                                        </View>                
                                    </View>
                                    <View style={styles.infoWrapperNonBorder}>
                                        <View style={{flex:1}} >
                                            <CustomTextR style={styles.defaultFont12}>∙ 주문일</CustomTextR>
                                        </View> 
                                        <View style={{flex:2}} >
                                            <CustomTextR style={styles.defaultFont1}>{this.state.itemData.orderDatetime}</CustomTextR>
                                        </View>                
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.titleBodyInfoTotal}>
                            <View style={{flex:1}} >
                                <CustomTextB style={styles.defaultFont2}>∙ 총 결제금액</CustomTextB>
                            </View> 
                            <View style={{flex:2}} >
                                <CustomTextB style={styles.defaultFont2}>{CommonFuncion.currencyFormat(this.state.itemData.paymentAmt)}</CustomTextB>
                            </View>   
                        </View>                 
                        { this.state.itemData.deliveryStatus !== null && this.state.itemData.deliveryStatus !== '' && typeof this.state.itemData.deliveryStatus !== 'undefined' ?
                        <View>
                            <View style={styles.commonHr1}></View>
                            <View style={{zIndex:5,width:SCREEN_WIDTH,alignItems:'center',justifyContent:'center'}}>
                                <View style={styles.titleBodyInfo}>
                                    
                                    <View style={styles.middleWrapper}>
                                        <CustomTextB style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>
                                            배송현황
                                        </CustomTextB>
                                        <View style={{height:1,width:'100%',backgroundColor:DEFAULT_COLOR.base_color_222,marginVertical:10}} />
                                        <View style={styles.infoWrapper}>
                                            <View style={{flex:1}} >
                                                <CustomTextR style={styles.defaultFont1}>∙ 배송상태</CustomTextR>
                                            </View> 
                                            <View style={{flex:2}} >
                                                <CustomTextR style={styles.defaultFont13}>{this.state.itemData.deliveryStatus}</CustomTextR>
                                            </View>                
                                        </View>
                                        <View style={styles.infoWrapper}>
                                            <View style={{flex:1}} >
                                                <CustomTextR style={styles.defaultFont1}>∙ 배송물품</CustomTextR>
                                            </View> 
                                            <View style={{flex:2}} >
                                                {
                                                    
                                                    this.state.deliveryProductList.map((pdata2,pindex2) => {
                                                        return (
                                                            <CustomTextR style={styles.defaultFont12} key={pindex2}>{pdata2.productName}</CustomTextR>
                                                        )
                                                    })
                                                    
                                                }
                                                
                                            </View>                
                                        </View>
                                        <View style={styles.infoWrapper}>
                                            <View style={{flex:1}} >
                                                <CustomTextR style={styles.defaultFont1}>∙ 비고</CustomTextR>
                                            </View> 
                                            <View style={{flex:2}} >
                                                <CustomTextR style={styles.defaultFont12}>
                                                    {typeof this.state.itemData.deliveryNote !== 'undefined' ? this.state.itemData.deliveryNote : null}
                                                </CustomTextR>
                                            </View>                
                                        </View>
                                    </View>
                                </View>
                            </View>                            
                        </View>
                        :
                        null
                        }
                
                    </ScrollView>
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
    commonHr1 : {
        backgroundColor:'#ebebeb',height:10
    },
    topWrapper : {
        position:'absolute',
        top:0,
        left:0,
        width:SCREEN_WIDTH,
        height:SCREEN_HEIGHT*0.3,
        backgroundColor : DEFAULT_COLOR.lecture_base,
        alignItems : 'center',
        justifyContent : 'center'
    },
    bottomWrapper :{
        flex:1.5,
        
    },
    titleHeaderInfo : {
        flex:1,
        width:SCREEN_WIDTH - 40,
        
    },
    titleBodyInfo : {
        flex:1,
        width:SCREEN_WIDTH - 40,
        marginTop:50,
        paddingHorizontal:10,
    },
    titleBodyInfoTotal : {
        width:SCREEN_WIDTH,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:DEFAULT_COLOR.input_bg_color,
        flexDirection:'row',
        paddingVertical:15,
        paddingHorizontal:30,
        borderBottomColor:DEFAULT_COLOR.input_border_color,
        borderBottomWidth:1,
        borderTopColor:DEFAULT_COLOR.input_border_color,
        borderTopWidth:1
    },
    commoneTopWrap : {        
        minHeight : SCREEN_HEIGHT/3,
        borderRadius : 20,        
        backgroundColor : '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 5
    },

    infoWrapper : {
        flex:1,flexDirection:'row',paddingVertical:15,borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1
    },
    infoWrapperNonBorder : {
        flex:1,flexDirection:'row',paddingVertical:15
    },
    defaultProduct : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.65
    },
    defaultFont0 : {
        color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14)
    },
    defaultFont1 : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:-0.65
    },
    defaultFont12 : {
        color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:-0.65
    },
    defaultFont13 : {
        color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:-0.65
    },
    defaultFont2 : {
        color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:-0.65
    }
    
});

function mapStateToProps(state) {
    return {
        myInterestCodeOne : state.GlabalStatus.myInterestCodeOne,
        userToken : state.GlabalStatus.userToken,
    };
}

export default connect(mapStateToProps, null)(SettleDetail);