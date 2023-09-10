import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    Text,
    Dimensions,
    PixelRatio,
    ActivityIndicator,
    BackHandler
} from 'react-native';

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextB, CustomTextL,CustomTextM,TextRobotoM,TextRobotoR} from '../../Style/CustomText';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export default class BankBookDetail extends Component {
    constructor(props) {
        super(props);

        this.state =  {
            loading : true,
            itemData : [],
            contentWidth : 0,
            contentHeight : 0
        }
    }

    async UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);    
        if ( this.props.navigation.state.params.titem.orderNo ) {
            await this.setState({
                itemData : this.props.navigation.state.params.titem
            })
        }else{
            await this.failRequired();
        }
    }

    failRequired = () => {

        const alerttoast = Toast.show('필수항목이 누락된 잘못된 접근입니다.\n잠시 뒤에 다시 이용해주세요');
        setTimeout(() => {
            Toast.hide(alerttoast);       
            this.props.navigation.goBack(null)
        }, 1000)
    }


    componentDidMount() {        
        setTimeout(() => {
            this.setState({loading:false})
        }, 500)
 
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
    }  

    handleBackButton = () => {
        this.props.navigation.goBack(null);    
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);      
        return true;
    };

    onLayoutHeader = ( evt ) => {
        //console.log('height2',SCREEN_HEIGHT);
        console.log('height',evt.nativeEvent.layout);
        this.setState({
            contentWidth : evt.nativeEvent.layout.width,
            contentHeight : evt.nativeEvent.layout.height
        });
    }

    render() {
        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        }else{
            return(
                <View style={ styles.container }>
                    <ScrollView>
                    <View style={[styles.topWrapper,{height:this.state.contentHeight - 40}]}>
                        
                    </View>                
                    <View style={{zIndex:5,width:SCREEN_WIDTH,alignItems:'center',paddingTop:20,marginBottom:100}}>
                        
                            <View style={styles.titleHeaderInfo} onLayout={(e)=>this.onLayoutHeader(e)}>
                                <View style={styles.commoneTopWrap}>
                                    <View style={{margin:20}}>
                                        <View style={{flex:1,paddingVertical:10,borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1}}>
                                            <CustomTextR style={styles.defaultProduct}>{this.state.itemData.productName}</CustomTextR>
                                        </View>
                                        
                                        <View style={{flex:1,flexDirection:'row',paddingVertical:10,marginTop:10}}>
                                            <View style={{flex:1}} >
                                                <CustomTextR style={styles.defaultFont1}>주문번호</CustomTextR>
                                            </View> 
                                            <View style={{flex:2,alignItems:'flex-end'}} >
                                                <CustomTextM style={styles.defaultFont1}>{this.state.itemData.orderNo}</CustomTextM>
                                            </View>                
                                        </View>
                                        <View style={{flex:1,flexDirection:'row',paddingVertical:10}}>
                                            <View style={{flex:1}} >
                                                <CustomTextR style={styles.defaultFont1}>상태</CustomTextR>
                                            </View>
                                            <View style={{flex:2,alignItems:'flex-end'}} >
                                                <CustomTextM style={styles.defaultFont1}>{this.state.itemData.applyStatus}</CustomTextM>
                                            </View>                
                                        </View>
                                        <View style={{flex:1,flexDirection:'row',paddingVertical:10}}>
                                            <View style={{flex:1}} >
                                                <CustomTextR style={styles.defaultFont1}>입금요청금액</CustomTextR>
                                            </View> 
                                            <View style={{flex:2,alignItems:'flex-end'}} >
                                                <CustomTextM style={styles.defaultFont1}>{CommonFuncion.currencyFormat(this.state.itemData.requestAmount)}원</CustomTextM>
                                            </View>                
                                        </View>
                                    </View>
                                </View>  
                            </View>

                            <View style={styles.titleBodyInfo}>
                                <View style={styles.middleWrapper}>
                                    <CustomTextB style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>입금계좌 상세정보</CustomTextB>
                                    <View style={{height:1,width:'100%',backgroundColor:DEFAULT_COLOR.base_color_222,marginVertical:10}} />
                                    <View style={styles.infoWrapper}>
                                        <View style={{flex:1}} >
                                            <CustomTextR style={styles.defaultFont1}>에금주</CustomTextR>
                                        </View> 
                                        <View style={{flex:1,alignItems:'flex-end'}} >
                                            <CustomTextR style={styles.defaultFont12}>{this.state.itemData.accountUserName}</CustomTextR>
                                        </View>                
                                    </View>
                                    <View style={styles.infoWrapper}>
                                        <View style={{flex:1}} >
                                            <CustomTextR style={styles.defaultFont1}>은행</CustomTextR>
                                        </View> 
                                        <View style={{flex:1,alignItems:'flex-end'}} >
                                            <CustomTextR style={styles.defaultFont12}>{this.state.itemData.bankName}</CustomTextR>
                                        </View>                
                                    </View>
                                    <View style={styles.infoWrapper}>
                                        <View style={{flex:1}} >
                                            <CustomTextR style={styles.defaultFont1}>계좌번호</CustomTextR>
                                        </View> 
                                        <View style={{flex:1,alignItems:'flex-end'}} >
                                            <CustomTextR style={styles.defaultFont12}>{this.state.itemData.account}</CustomTextR>
                                        </View>                
                                    </View>         
                                    { 
                                        this.state.itemData.applyStatus === '입금대기' && 
                                        <View style={{flex:1,paddingVertical:10}}>
                                            <View style={{flex:1,flexDirection:'row',flexGrow:1,flexWrap:'wrap'}} >
                                                <CustomTextR style={styles.defaultFont1}>
                                                    상기 계좌정보로
                                                </CustomTextR>
                                                <CustomTextR style={styles.defaultFont0}>
                                                    {" "}{this.state.itemData.limitDatetime}(신청일로부터 7일 내){" "}
                                                </CustomTextR>
                                                <CustomTextR style={styles.defaultFont1}>
                                                까지 입금해주시기 바랍니다.
                                                </CustomTextR>
                                            </View>                                         
                                        </View>
                                    }
                                </View>
                                
                            </View>
                        
                    </View>
                    
                
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
        color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),letterSpacing:-0.65
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
