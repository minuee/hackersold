import React, { Component } from 'react';
import {
    TouchableOpacity,
    ScrollView,
    View,
    StyleSheet,
    Text,
    Dimensions,
    PixelRatio
} from 'react-native';
import {Button,Overlay,CheckBox,Input} from 'react-native-elements';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Style/CustomText';


const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const KEYS_TO_FILTERS = ['title','content'];
const pageViewLimit = 10;
export default  class FaqListScreen extends Component {
    constructor(props) {
        super(props);        
        this.state = {
            loading : true,
            moreLoading : false,            
            currentpage : 1,
            ismore : false,    
            totalReview : 0,
            searchType : null,
            keyword: null,
            defaultKeyword : [],
            itemlist :[],
            itemlist2 : []
            
        }
    }

    async UNSAFE_componentWillMount() {        
        await this.refreshTextBookInfo(1);
    }  

    componentDidMount() {     
        
    }

    refreshTextBookInfo = async(page) => {        

        await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/board/faq' ,{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': DEFAULT_CONSTANTS.apiAdminKey
            }), 
                body:null
            },10000
            ).then(response => {                
                if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                    if ( response.code !== '0000' ) {
                        this.failCallAPi()
                        this.setState({loading:false})    
                    }else{
                        this.setState({
                            loading : false,
                            itemlist: typeof response.data.faqList !== 'undefined' ? response.data.faqList : [],
                            itemlist2: typeof response.data.faqList !== 'undefined' ? response.data.faqList : [],
                            defaultKeyword : typeof response.data.keywordList !== 'undefined' ? response.data.keywordList : [],
                            ismore : response.data.current_page < response.data.last_page ? true : false,
                            currentpage : response.data.current_page,
                            totalReview : parseInt(response.data.total)
                        })
                    }

                }else{
                    this.failCallAPi()
                    this.setState({loading:false})    
                }
                this.setState({loading:false})    
            })
            .catch(err => {
                console.log('login error => ', err);
                this.failCallAPi()
                this.setState({loading:false})    
        });
    }

    failCallAPi = () => {
     
        let message = "데이터 수신중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);

    }

    searchKeyword = () => {
        if ( this.state.keyword ) {
            const filteredData = this.state.itemlist.filter(CommonFuncion.createFilter(this.state.keyword, KEYS_TO_FILTERS));
            this.setState({                    
                itemlist2 : filteredData
            });
        }else{
            let oldItemList = this.state.itemlist;
            this.setState({                    
                itemlist2 : oldItemList
            });
        }

    }

    selectSampleKeyword = async (keyword,isbool) => {
        if ( this.state.searchType === keyword && isbool ) {
            await this.setState({searchType:null});     
        }else{
            await this.setState({searchType:keyword});            
        }
        
        if ( this.state.searchType ) {                
            this.setState({                    
                itemlist2 : this.state.itemlist.filter((code) => code.keyword === keyword)
            });
        }else{
            let oldItemList = this.state.itemlist;
            this.setState({                    
                itemlist2 : oldItemList
            });
        }
    }

    render() {

      
        return(
            <View style={ styles.container }>
                <View style={{borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1,backgroundColor:DEFAULT_COLOR.input_bg_color,paddingTop:10}}>
                    <ScrollView horizontal={true}>
                        {this.state.defaultKeyword.map((kitem,index)=> {
                            return (
                                <View key={index}>
                                    {
                                    this.state.searchType === kitem ? 
                                    <TouchableOpacity 
                                        onPress={()=>this.selectSampleKeyword(kitem,true)}
                                        style={styles.sampleWrapperOn}>
                                        <CustomTextR style={styles.smapleTextOn}>{kitem}</CustomTextR>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity 
                                        style={styles.sampleWrapper}
                                        onPress={()=>this.selectSampleKeyword(kitem,false)}
                                    >
                                        <CustomTextR style={styles.smapleText}>{kitem}</CustomTextR>
                                    </TouchableOpacity>
                                    }
                                </View>
                            )
                        })}                       
                    </ScrollView>
                    <View style={{marginBottom:10,flexDirection:'row'}}>
                        <View style={{flex:3.5,justifyContent:'center',alignItems:'center'}}>
                            <Input                                 
                                value={null}
                                onChangeText={text=>this.setState({keyword:text})}
                                placeholder={'  검색어를 입력하세요'}
                                placeholderStyle={{justifyContent:'center',fontFamily:'NotoSansKR-Regular'}}
                                inputContainerStyle={{borderWidth:1,borderColor:DEFAULT_COLOR.input_bg_color,borderRadius:5,height:40,backgroundColor:'#ebebeb',paddingTop:10}}
                            />
                        </View>
                        <View style={{flex:1,paddingHorizontal:3}}>
                            <Button
                                onPress={() => this.searchKeyword()}
                                title="검색"
                                titleStyle={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),fontFamily:'NotoSansKR-Regular'}}
                                buttonStyle={{borderColor:DEFAULT_COLOR.base_color_666,borderWidth:1,height:40,backgroundColor:'#fff'}}
                                
                                type="outline"
                            />
                        </View>
                    </View>                    
                </View>

                <View style={{marginHorizontal:5}}>
                        { 
                            this.state.itemlist2.length === 0 ?
                            
                                <View style={[styles.itemWrap,{alignItems:'center'}]}>
                                    <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color: DEFAULT_COLOR.base_color_666,letterSpacing:-0.6}}>검색 결과가 없습니다.
                                    </CustomTextR>
                                </View>
                            
                            :
                            this.state.itemlist2.map((titem, index) => {     
                                return(                           
                                    <TouchableOpacity 
                                        onPress={() => 
                                            this.props.screenProps.navigation.navigate('FaqDetailScreen',{titem})
                                         }
                                        style={styles.itemWrap} key={index}
                                    >
                                        <View style={{flex:1,paddingBottom:5}}>
                                            <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color: DEFAULT_COLOR.lecture_base,letterSpacing:-0.6}}>{titem.keyword}</CustomTextR>
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
    smapleTextOn : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),color:DEFAULT_COLOR.lecture_base
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
});