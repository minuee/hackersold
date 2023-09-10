import React, { Component } from 'react';
import {
    TouchableOpacity,
    ScrollView,
    View,
    StyleSheet,
    Text,
    Dimensions,
    PixelRatio,
    ActivityIndicator
} from 'react-native';
//공통상수
import {connect} from 'react-redux';
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';

import {CustomTextR, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Style/CustomText';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const pageViewLimit = 10;
class NoticeListScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            moreLoading : false,            
            currentpage : 1,
            ismore : false,    
            totalReview : 0,
            searchType : null,   
            itemlist :[],
            defaultKeyword : ["공지사항"]
            
        }
    }

    UNSAFE_componentWillMount() {        
        this.refreshTextBookInfo(1);
    }  

    componentDidMount() {     
        
    }

    refreshTextBookInfo = async(page) => {    
        page > 1 && this.setState({moreLoading: true});
        await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/board/notice?page='+page+'&' + 'paginate=' + pageViewLimit + '&searchType=' + encodeURIComponent(this.state.searchType !== null ? this.state.searchType : '') ,{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': DEFAULT_CONSTANTS.apiAdminKey
            }), 
                body:null
            },10000
            ).then(response => {
                console.log('response : ', response)
                if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                    if ( response.code !== '0000' ) {
                        this.failCallAPi(response.message || '공지사항 목록을 불러오는데 실패했습니다.');
                    } else {
                        const newItemList = typeof response.data.noticeList !== 'undefined' && [...this.state.itemlist, ...response.data.noticeList] || [];
                        this.setState({
                            loading : false,
                            itemlist: newItemList,
                            defaultKeyword : typeof response.data.keywordList !== 'undefined' ? response.data.keywordList : ["공지사항"],
                            ismore : response.data.current_page < response.data.last_page ? true : false,
                            currentpage : response.data.current_page,
                            totalReview : parseInt(response.data.total)
                        })
                    }

                }else{
                    this.failCallAPi('공지사항 목록을 불러오는데 실패했습니다.');
                }

                this.setState({loading:false});

            
            })
            .catch(err => {
                console.log('login error => ', err);
                this.failCallAPi()
        });
        page > 1 && this.setState({moreLoading: false});
    }
    
    failCallAPi = msg => {
     
        let message = msg || "데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);

    }

    selectSampleKeyword = async (keyword,isbool) => {
        if ( this.state.searchType === keyword && isbool ) {
            await this.setState({searchType:null});     
        }else{
            await this.setState({searchType:keyword});            
        }
        
        this.refreshTextBookInfo(1)
    }

    render() {    
        return(
            <View style={ styles.container }>
                <View style={{borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1,backgroundColor:DEFAULT_COLOR.input_bg_color}}>
                    <ScrollView horizontal={true}>
                        {this.state.defaultKeyword.map((kitem,index)=> {
                            return (
                                <View key={index}>
                                    {
                                    this.state.searchType === kitem.code ? 
                                    <TouchableOpacity 
                                        onPress={()=>this.selectSampleKeyword(kitem.code,true)}
                                        style={styles.sampleWrapperOn}>
                                        <CustomTextR style={styles.smapleTextOn}>{kitem.name}</CustomTextR>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity 
                                        style={styles.sampleWrapper}
                                        onPress={()=>this.selectSampleKeyword(kitem.code,false)}
                                    >
                                        <CustomTextR style={styles.smapleText}>{kitem.name}</CustomTextR>
                                    </TouchableOpacity>
                                    }
                                </View>
                            )
                        })}
                        
                    </ScrollView>
                </View>
                <View style={{marginHorizontal:5}}>
                        { 
                            this.state.itemlist.length === 0 ?
                            
                                <View style={[styles.itemWrap,{alignItems:'center'}]}>
                                    <Text                                                 
                                        style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14)}}
                                    >검색 결과가 없습니다.
                                    </Text>
                                </View>
                            
                            :
                            this.state.itemlist.map((titem, index) => {     
                                return(                           
                                    <TouchableOpacity 
                                        style={styles.itemWrap} key={index}
                                        onPress={() => this.props.screenProps.navigation.navigate('NoticeDetailScreen',{
                                            titem
                                        }) }
                                    >                                
                                        <View style={{flex:1,flexDirection:'row',paddingBottom:5}}>
                                            <View style={{flex:3}}>
                                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color: DEFAULT_COLOR.lecture_base,letterSpacing:-0.6}}>{titem.keyword}</CustomTextR>
                                            </View>
                                            <View style={{flex:1}}>
                                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color: DEFAULT_COLOR.base_color_666,letterSpacing:-0.6}}>
                                                    {titem.regDatetime.substring(0,10)}
                                                </CustomTextR>
                                            </View>
                                        </View>
                                        <View style={{flex:1}}>
                                            <CustomTextR 
                                                numberOfLines={2} ellipsizeMode = 'tail'
                                                style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color: DEFAULT_COLOR.base_color_222,letterSpacing:-0.6}}
                                            >{titem.title}
                                            </CustomTextR>
                                        </View>                                       
                                    </TouchableOpacity>
                                )
                            })
                        }
                </View>

                { this.state.ismore && 
                    <View style={{flex:1,justifyContent:'center'}}>
                        <View style={styles.bodyContainer }>
                            <View style={styles.inbodyContainer }>
                                {this.state.moreLoading 
                                ?
                                <View style={styles.moreContainer}><ActivityIndicator size="small" /></View>
                                :
                                <TouchableOpacity 
                                    style={{flex:1,flexDirection:'row',flexGrow:1,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,paddingVertical:10,borderRadius:5}}
                                    onPress={()=> this.refreshTextBookInfo(parseInt(this.state.currentpage)+1)}
                                >
                                    <Text style={styles.commonText02}>+ 더보기</Text>
                                    <Text style={{paddingLeft:5,color:DEFAULT_COLOR.lecture_base}}>
                                        {this.state.currentpage*pageViewLimit}/{this.state.totalReview}
                                    </Text>
                                </TouchableOpacity>
                                }
                            </View>
                        </View>
                    </View>
                }
                
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sampleWrapper : {
        marginVertical:10,marginHorizontal:5,paddingVertical:10,paddingHorizontal:15,borderColor:DEFAULT_COLOR.input_border_color,borderWidth:1,backgroundColor:'#fff',borderRadius:20
    },
    sampleWrapperOn : {
        marginVertical:10,marginHorizontal:5,paddingVertical:10,paddingHorizontal:15,borderColor:DEFAULT_COLOR.lecture_base,borderWidth:1,backgroundColor:'#fff',borderRadius:20
    },
    smapleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },
    smapleTextOn : {fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),color:DEFAULT_COLOR.lecture_base
    },
    itemWrap : {                
        marginHorizontal:10,        
        borderBottomWidth:1,
        borderBottomColor:'#ccc',
        marginVertical:10,        
        paddingVertical:10
    },
    bodyContainer : {        
        flexDirection:'row',
        backgroundColor : "#fff",
        borderBottomColor:DEFAULT_COLOR.input_border_color,
        borderBottomWidth:1  ,
        padding:20,
        
    },
    inbodyContainer : {      
        flex:1,flexDirection:'row',backgroundColor : "#fff",     
    },
    itemWrap : {                
        marginHorizontal:15,
        borderBottomWidth:1,
        borderBottomColor:'#ccc',
        marginVertical:10,        
        paddingVertical:10
    },
    itemWrapBlank : {
        marginHorizontal:15,
        marginVertical:10,        
        paddingVertical:10
    },
    moreContainer: {
        flex: 1, justifyContent: 'center'
    }
});

function mapStateToProps(state) {
    return {
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne
    };
}

export default connect(mapStateToProps, null)(NoticeListScreen);