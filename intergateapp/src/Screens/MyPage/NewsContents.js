import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    Linking,
    Dimensions,
    TouchableOpacity,
    PixelRatio
} from 'react-native';
import {connect} from 'react-redux';
import 'moment/locale/ko'
import  moment  from  "moment";
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonFuncion from '../../Utils/CommonFunction';

import {CustomTextR, CustomTextB, CustomTextL,CustomTextM,TextRobotoM,TextRobotoR} from '../../Style/CustomText';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

class NewsContents extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items : [
                /*
                {  
                    contentTypeCode : 'freeBoard',
                    contentTypeName : '자유게시판',
                    interestCode : "20060001",
                    interestName : "토익",
                    linkType:  'App',//"App" OR "Web",
                    routeName: 'FreeBoardDetail2',
                    routeIdx: 3,
                    title: "방금 0원패스를 신청했습닏. 꼭 성공하고 싶어요 0원패스 0원0원 꽁짜 대머리되요 조심합시당",
                    regDatetime : '방금전'
                },
                {  
                    contentTypeCode : 'freePractice',
                    contentTypeName : '무료강의',
                    interestCode : "20060001",
                    interestName : "토익",
                    linkType:  'App',//"App" OR "Web",
                    routeName: null,
                    routeIdx: 0,
                    title: "토익 리딩 최신문제로 실전 고득점 실전 고득점 마륌ㄹ어ㅣㄹㅇ러이ㅏ러이ㅏ러이라어리얼이러이러일",
                    regDatetime : '어제'
                },
                {  
                    contentTypeCode : 'ad',
                    contentTypeName : '첫구매특가',
                    interestCode : "20060002",
                    interestName : "일본어",
                    linkType:  'Web',//"App" OR "Web",
                    routeName: 'https://m.naver.com',
                    routeIdx: 0,
                    title: "おはようございますこんにちはこんばんは今宵も眠れい暑さですね明日はきっと朝やかな雨が降るでしょう",
                    regDatetime : '어제'
                }
                */
                
            ]
        }
    }

    async UNSAFE_componentWillMount() {     
        console.log('this.props.newsData', typeof this.props.newsData);
        if ( typeof this.props.newsData === 'object') {
            await this.setState({
                items : this.props.newsData
            })
        }
    }  

    moveNavigate = async(data) => {
        console.log('data.routeName', data.routeName);
        if ( data.linkType === 'Web') {
            Linking.openURL(data.routeName);
        }else{
            if ( data.routeName !== null ) {
                this.props.screenProps.navigation.navigate( data.routeName,{                    
                    routeIdx :  data.routeIdx,
                    fromHistory : true
                })     
            }else {
               
            }
        }

    }

    render() {
        const FreeBoardData = (data) => {            
            return (
                <TouchableOpacity onPress={() =>this.moveNavigate(data.data)}>
                    <View style={{flex:1,flexDirection:'row',flexGrow:1,flexWrap:'wrap'}}>
                        <View style={{borderRadius:15,height:30,minWidth:40,borderWidth:1,borderColor:'#3674c0',justifyContent:'center',alignItems:'center',marginRight:5,paddingHorizontal:10}}>
                            <CustomTextM style={{color:'#3674c0',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:-0.6}}>{data.data.interestName}</CustomTextM>
                        </View>
                        <View style={{borderRadius:15,height:30,minWidth:50,borderWidth:1,borderColor:'#009f95',justifyContent:'center',alignItems:'center',marginRight:5,paddingHorizontal:10}}>
                            <CustomTextM style={{color:'#009f95',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:-0.6}}>{data.data.contentTypeName}</CustomTextM>
                        </View>
                    </View>
                    <View style={{flex:1}}>
                        <View style={{flex:1,paddingVertical:10}}>
                            <CustomTextM 
                                numberOfLines={2} ellipsizeMode = 'tail'
                                style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:-0.6}}>
                                {data.data.title}
                            </CustomTextM>
                        </View>
                    </View>                         
                    <View style={{flex:1,flexDirection:'row',flexGrow:1}}>
                        <View style={{flex:2,paddingRight:5}}>
                            <CustomTextR style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11)}}>
                                댓글을 확인하세요
                            </CustomTextR>
                        </View>
                        <View style={{flex:1,paddingTop:10,paddingRight:10,alignItems:'flex-end',justifyContent:'flex-end'}}>
                            <CustomTextR style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11)}}>
                                {CommonFuncion.compareTime( data.data.regDatetimeUnixTimestamp,moment().unix(),data.data.regDatetime)}
                            </CustomTextR>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }

        const FreePractice = (data) => {            
            return (
                <TouchableOpacity onPress={() =>this.moveNavigate(data.data)}>
                    <View style={{flex:1,flexDirection:'row',flexGrow:1,flexWrap:'wrap'}}>
                        <View style={{borderRadius:15,height:30,minWidth:40,borderWidth:1,borderColor:'#3674c0',justifyContent:'center',alignItems:'center',marginRight:5,paddingHorizontal:10}}>
                            <CustomTextM style={{color:'#3674c0',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:-0.6}}>{data.data.interestName}</CustomTextM>
                        </View>
                        <View style={{borderRadius:15,height:30,minWidth:50,borderWidth:1,borderColor:'#ed8127',justifyContent:'center',alignItems:'center',marginRight:5,paddingHorizontal:10}}>
                            <CustomTextM style={{color:'#ed8127',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:-0.6}}>{data.data.contentTypeName}</CustomTextM>
                        </View>
                    </View>
                    <View style={{flex:1}}>
                        <View style={{flex:1,paddingVertical:10}}>
                            <CustomTextM 
                                numberOfLines={2} ellipsizeMode = 'tail'
                                style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:-0.6}}>
                                {data.data.title}
                            </CustomTextM>
                        </View>
                    </View>                         
                    <View style={{flex:1,flexDirection:'row',flexGrow:1}}>
                        <View style={{flex:2,paddingRight:5}}>
                            <CustomTextR style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),letterSpacing:-1.5}}>
                                새로운 무료강의를 확인하세요
                            </CustomTextR>
                        </View>
                        <View style={{flex:1,paddingTop:10,paddingRight:10,alignItems:'flex-end',justifyContent:'flex-end'}}>
                            <CustomTextR style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11)}}>
                                {CommonFuncion.compareTime( data.data.regDatetimeUnixTimestamp,moment().unix(),data.data.regDatetime)}
                            </CustomTextR>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }

        const FreeData = (data) => {            
            return (
                <TouchableOpacity onPress={() =>this.moveNavigate(data.data)}>
                    <View style={{flex:1,flexDirection:'row',flexGrow:1,flexWrap:'wrap'}}>
                        <View style={{borderRadius:15,height:30,minWidth:40,borderWidth:1,borderColor:'#3674c0',justifyContent:'center',alignItems:'center',marginRight:5,paddingHorizontal:10}}>
                            <CustomTextM style={{color:'#3674c0',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:-0.6}}>{data.data.interestName}</CustomTextM>
                        </View>
                        <View style={{borderRadius:15,height:30,minWidth:50,borderWidth:1,borderColor:'#ed8127',justifyContent:'center',alignItems:'center',marginRight:5,paddingHorizontal:10}}>
                            <CustomTextM style={{color:'#ed8127',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:-0.6}}>{data.data.contentTypeName}</CustomTextM>
                        </View>
                    </View>
                    <View style={{flex:1}}>
                        <View style={{flex:1,paddingVertical:10}}>
                            <CustomTextM 
                                numberOfLines={2} ellipsizeMode = 'tail'
                                style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:-0.6}}>
                                {data.data.title}
                            </CustomTextM>
                        </View>
                    </View>                         
                    <View style={{flex:1,flexDirection:'row',flexGrow:1}}>
                        <View style={{flex:2,paddingRight:5}}>
                            <CustomTextR style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),letterSpacing:-1.5}}>
                                새로운 무료강의를 확인하세요
                            </CustomTextR>
                        </View>
                        <View style={{flex:1,paddingTop:10,paddingRight:10,alignItems:'flex-end',justifyContent:'flex-end'}}>
                            <CustomTextR style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11)}}>
                                {CommonFuncion.compareTime( data.data.regDatetimeUnixTimestamp,moment().unix(),data.data.regDatetime)}
                            </CustomTextR>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }

        const AdScreen = (data) => {            
            return (
                <TouchableOpacity onPress={() =>this.moveNavigate(data.data)}>
                    <View style={{flex:1,flexDirection:'row',flexGrow:1,flexWrap:'wrap'}}>
                        <View style={{borderRadius:15,height:30,minWidth:40,borderWidth:1,borderColor:'#3674c0',justifyContent:'center',alignItems:'center',marginRight:5,paddingHorizontal:10}}>
                            <CustomTextM style={{color:'#3674c0',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:-0.6}}>{data.data.interestName}</CustomTextM>
                        </View>
                        <View style={{borderRadius:15,height:30,minWidth:50,borderWidth:1,borderColor:'#c4267c',justifyContent:'center',alignItems:'center',marginRight:5,paddingHorizontal:10}}>
                            <CustomTextM style={{color:'#c4267c',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:-0.6}}>{data.data.contentTypeName}</CustomTextM>
                        </View>
                    </View>
                    <View style={{flex:1}}>
                        <View style={{flex:1,paddingVertical:10}}>
                            <CustomTextM 
                                numberOfLines={2} ellipsizeMode = 'tail'
                                style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:-0.6}}>
                                {data.data.title}
                            </CustomTextM>
                        </View>
                    </View>                         
                    <View style={{flex:1,flexDirection:'row',flexGrow:1}}>                        
                        <View style={{flex:1,paddingTop:10,paddingRight:10,alignItems:'flex-end',justifyContent:'flex-end'}}>
                            <CustomTextR style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11)}}>
                                {CommonFuncion.compareTime( data.data.regDatetimeUnixTimestamp,moment().unix(),data.data.regDatetime)}
                            </CustomTextR>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }

        const DefaultData = () => {        
            return (
                <View style={{alignItems:'center'}}>
                    <CustomTextM style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:-0.6}}>정보가 없거나 잘못된 정보입니다.
                    </CustomTextM>
                </View>
            )
        }

        return(
            <View style={ styles.container }>
                <ScrollView >
                {
                    this.state.items.map((item,index) => {
                    return (
                        <View style={index > 0 ? styles.baseCommonWrap : styles.baseFirstWrap} key={index}>
                            {
                                item.contentTypeCode === 'FreeBoardDetail2' || item.contentTypeCode === 'freeBoard'
                                ?
                                <FreeBoardData data={item} />
                                :
                                item.contentTypeCode === 'FreeLectureDetail2' || item.contentTypeCode === 'freePractice'
                                ?
                                <FreePractice data={item} />
                                :
                                item.contentTypeCode === 'FreeDataMaterialDetail2' 
                                ?
                                <FreeData data={item} />
                                :
                                item.contentTypeCode === 'ad' 
                                ?
                                <AdScreen data={item} />
                                :
                                <DefaultData data={item} />
                            }
                        </View>
                    )
                    })
                }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal:10,
        marginTop:10
    },
    baseFirstWrap : {
        paddingBottom:10,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_bg_color
    },
    baseCommonWrap : {
        paddingVertical:10,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_bg_color
    },
});

function mapStateToProps(state) {
    return {
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
        userToken: state.GlabalStatus.userToken,   
        mypageSelectedTabsLnb: state.GlabalStatus.mypageSelectedTabsLnb,   
        newsUnreadCount: state.GlabalStatus.newsUnreadCount,   
        newsData: state.GlabalStatus.newsData,   
        isDrawerOpen :state.GlabalStatus.isDrawerOpen,   
    };
}


export default connect(mapStateToProps, null)(NewsContents);
