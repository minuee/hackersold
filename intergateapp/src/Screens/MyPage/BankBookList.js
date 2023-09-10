import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    Text,
    Dimensions,
    PixelRatio,
    TouchableOpacity,
    ActivityIndicator,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import {connect} from 'react-redux';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextB, CustomTextL,CustomTextM,TextRobotoM,TextRobotoR} from '../../Style/CustomText';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

class BankBookList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            itemlist :[],
        }
    }

    async UNSAFE_componentWillMount() {
        // const isLogin = await CommonUtil.isLoginCheck();
        // isLogin === true && this.refreshTextBookInfo();
        this.refreshTextBookInfo();
    }

    componentDidMount() {
      
    }

    UNSAFE_componentWillUnmount() {

    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    refreshTextBookInfo = async() => {
        const memberIdx = this.props.userToken.memberIdx;
        const aPIsDomain = typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        const aPIsAuthKey = typeof this.props.myInterestCodeOne.info.apiKey !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey;    
        await CommonUtil.callAPI( aPIsDomain + '/v1/mypayment/account/'+memberIdx,{
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
                        this.failCallAPi(response.message || '무통장입금 내역 조회 실패');
                    } else {
                        if ( typeof response.data.accountList !== 'undefined') {
                            this.setState({
                                loading : false,
                                itemlist : response.data.accountList
                            })
                        }
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

    failCallAPi = msg => {
     
        let message = msg || "데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);

    }

    render() {
        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        }else {

            return(
                <View style={ styles.container }>
                    <View>
                        <ScrollView >
                            <View style={{flex:1,marginBottom:100,paddingHorizontal:10}}>
                            { 
                                this.state.itemlist.length === 0 ?
                                
                                    <View style={{marginHorizontal:10,marginVertical:10,paddingVertical:10,alignItems:'center'}}>
                                        <CustomTextR                                                 
                                            style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}
                                        >진행 이력이 없습니다.
                                        </CustomTextR>
                                    </View>
                                
                                :
                                this.state.itemlist.map((titem, index) => {     
                                    return(                           
                                        <TouchableOpacity 
                                            style={styles.itemWrap} key={index}
                                            onPress={() => this.props.screenProps.navigation.navigate('BankBookDetail',{
                                                titem
                                            }) }
                                        >                             
                                            <View style={{flex:1,flexDirection:'row',flexGrow:1}}>
                                                <TextRobotoR style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>
                                                <CustomTextR style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}
                                                >주문번호{"  "}</CustomTextR>
                                                {titem.orderNo}({titem.applyDatetime})</TextRobotoR>
                                            </View>      
                                            <View style={{flex:1}}>
                                                <CustomTextR 
                                                    numberOfLines={2} ellipsizeMode = 'tail'
                                                    style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)}}
                                                >{titem.productName}
                                                </CustomTextR>
                                            </View>      
                                            <View style={{flex:1,paddingVertical:10,flexDirection:'row',flexGrow:1}}>
                                                <View style={{paddingRight:5,paddingTop:4}}>
                                                    { 
                                                    titem.applyStatus === '입금완료'
                                                    ?
                                                    <Image source={require('../../../assets/icons/icon_deposit_done.png')} style={{width:PixelRatio.roundToNearestPixel(18),height:PixelRatio.roundToNearestPixel(18)}} />
                                                    :
                                                    titem.applyStatus === '입금취소' 
                                                    ?
                                                    <Image source={require('../../../assets/icons/icon_deposit_cancel.png')} style={{width:PixelRatio.roundToNearestPixel(18),height:PixelRatio.roundToNearestPixel(18)}} />
                                                    :
                                                    <Image source={require('../../../assets/icons/icon_deposit_wait.png')} style={{width:PixelRatio.roundToNearestPixel(18),height:PixelRatio.roundToNearestPixel(18)}} />
                                                    }
                                                </View>
                                                <View style={{paddingLeft:5}}>
                                                    {
                                                        titem.applyStatus === '입금취소' ?
                                                        <CustomTextM style={{color:'#aaaaaa',fontSize:PixelRatio.roundToNearestPixel(18)}}>
                                                            {titem.applyStatus}
                                                        </CustomTextM>
                                                        :
                                                        <CustomTextM style={{color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(18)}}>
                                                            {titem.applyStatus}
                                                        </CustomTextM>
                                                    }
                                                    
                                                </View>
                                            </View>
                                                                                
                                        </TouchableOpacity>
                                    )
                                })
                            }
                            </View>
                        </ScrollView>                 
                    </View>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fff'
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemWrap : {                
        marginHorizontal:10,        
        borderBottomWidth:1,
        borderBottomColor:'#ccc',
        marginVertical:10,        
        paddingVertical:10
    },
    termWrapper : {
        marginVertical:10,marginHorizontal:5,paddingVertical:10,paddingHorizontal:15,borderColor:DEFAULT_COLOR.input_border_color,borderWidth:1,backgroundColor:'#fff',borderRadius:20,alignItems:'center'
    },
    termWrapperOn : {
        marginVertical:10,marginHorizontal:5,paddingVertical:10,paddingHorizontal:15,borderColor:DEFAULT_COLOR.lecture_base,borderWidth:1,backgroundColor:'#fff',borderRadius:20,alignItems:'center'
    },
    termText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },
    termTextOn : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),color:DEFAULT_COLOR.lecture_base
    },
    termText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),paddingHorizontal:5,color:DEFAULT_COLOR.base_color_666
    },
    termText3 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium),paddingHorizontal:5,color:DEFAULT_COLOR.base_color_222
    },
    termText4 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),paddingHorizontal:5,color:DEFAULT_COLOR.base_color_666
    },
});

function mapStateToProps(state) {
    return {
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,
        userToken: state.GlabalStatus.userToken,
    };
}
export default connect(mapStateToProps, null)(BankBookList);