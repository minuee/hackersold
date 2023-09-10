import React, { Component } from 'react';
import {
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    PixelRatio,
    View,
    Image,
    StyleSheet,
    Text,
    ImageBackground,
    Dimensions,
    Linking,
    LayoutAnimation,
    UIManager,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
Icon.loadFont();
import DropDown from '../../Utils/DropDown';
import {connect} from 'react-redux';
//import HTMLView from 'react-native-htmlview';

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import {CustomTextR, CustomTextM, CustomTextB, TextRobotoR, TextRobotoM, TextRobotoB} from '../../Style/CustomText';

//HTML 
import HTMLConvert from '../../Utils/HtmlConvert/HTMLConvert';
const IMAGES_MAX_WIDTH = SCREEN_WIDTH - 50;
const CUSTOM_STYLES = {};
const CUSTOM_RENDERERS = {};
const DEFAULT_PROPS = {
    htmlStyles: CUSTOM_STYLES,
    renderers: CUSTOM_RENDERERS,
    imagesMaxWidth: IMAGES_MAX_WIDTH,
    onLinkPress: (evt, href) => { Linking.openURL(href); },
    debug: true
};

const pageViewLimit = 5;
class LectureQna extends Component {
    constructor(props) {

        super(props);
        this.state = {
            loading: true,
            moreLoading : false,
            historyTmp : [],
            imageIndex: null,
            isImageViewVisible: false,
            showModifyForm : false,
            showShareForm : false,
            totalReview : 0,
            currentpage : 0,
            reviewItems : [],
            reviewNoti : [],
            openRowIdx: 0,
            classIdx : this.props.screenState.lectureIdx,
            //classIdx : 6340
        };
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    UNSAFE_componentWillMount() {
        this.setState({
            loading: true
        });

        this.refreshTextBookInfo(this.state.classIdx,1,pageViewLimit);
    }

    componentDidMount() {
       
    }

    UNSAFE_componentWillUnmount() {

    }


    refreshTextBookInfo = async(classIdx,page = 0,paginate = 0) => {
        let aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        let aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apiTestDomain;
        await CommonUtil.callAPI( aPIsDomain + '/v1/myClass/teacherQuestion/'+classIdx+'/?type=class&page='+page + '&paginate=' + paginate,{
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
                        this.setState({loading:false})    
                        this.failCallAPi(response.message || '선생님께 질문하기 목록 가져오기에 실패했습니다.')
                    }else{
                        
                        if ( typeof response.data.questionList !== 'undefined') {
                            console.log('response.data.notiList', response.data.notiList)
                            this.setState({
                                loading : false,
                                ismore : response.data.currentPage < response.data.lastPage ? true : false,
                                reviewItems : response.data.questionList,
                                reviewNoti : typeof response.data.notiList !== 'undefined' ? response.data.notiList : [],
                                currentpage : response.data.currentPage,
                                totalReview : parseInt(response.data.total)
                            })
                        }
                    }

                }else{
                    this.failCallAPi('선생님께 질문하기 목록 가져오기에 실패했습니다.')
                }
                this.setState({loading:false})    
            })
            .catch(err => {
                console.log('login error => ', err);
                this.setState({loading:false})    
                this.failCallAPi()
        });
    }

    refreshTextBookInfoMore = async(classIdx,page,paginate) => {              
        this.setState({moreLoading:true});
        let selectedFilterCodeList = this.state.reviewItems;
        let aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        let aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apiTestDomain;
        await CommonUtil.callAPI( aPIsDomain + '/v1/myClass/teacherQuestion/'+classIdx+'/?type=class&page='+page+'&paginate='+paginate,{
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
                        this.failCallAPi(response.message || '선생님께 질문하기 목록 가져오기에 실패했습니다.')
                    }else{

                        if ( typeof  response.data.questionList !== 'undefined' ) {
                            response.data.questionList.forEach(function(element,index,array){                                
                                selectedFilterCodeList.push(element);
                            });                            
                            this.setState({
                                moreLoading : false,
                                ismore : response.data.currentPage < response.data.lastPage ? true : false,
                                reviewItems : selectedFilterCodeList,
                                currentpage : response.data.currentPage
                            })
                        }else{
                            this.setState({moreLoading:false})
                        }
                    }
                }else{
                    this.failCallAPi('선생님께 질문하기 목록 가져오기에 실패했습니다.');
                }
                this.setState({moreLoading:false})
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

    _handleTextReady = () => {
        
    }

    renderFooter({title}) {
        return (
            <View style={styles.footer}>
                <Text style={styles.footerText}>{title}</Text>
            </View>
        );
    }

    toggleRow = async item => {
        if (item.isSecret === true) {
            const memberIdx = await CommonUtil.getMemberIdx();
            if (item.memberIdx !== memberIdx) {
                Alert.alert('', '비밀게시글입니다.');
                return;
            }
        }
        const idx = item.teacherQuestionIdx;
        await LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const openedIdx = this.state.openRowIdx;
        this.state.openRowIdx !== 0 && await this.setState({openRowIdx: 0});
        await this.setState({openRowIdx: this.state.openRowIdx === 0 && idx !== openedIdx ? idx : 0});
    };

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        } else {

            let topNotice = this.state.reviewNoti && this.state.reviewNoti || []; //.filter((info) => info.isNoti === true );   
            let itemlist = this.state.reviewItems && this.state.reviewItems.filter((info) => info.isNoti === false ) || [];  
            return(
                <View style={ styles.container }>
                    { topNotice.length  > 0 
                    && (
                        topNotice.map((item, index) => {
                            return(
                                <View style={{paddingVertical: 15, borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color}} key={index}>
                                    {/* <DropDown
                                        style={styles.agreeWapper}
                                        contentVisible={false}
                                        header={
                                        <View style={{paddingHorizontal:15,justifyContent:'center'}}>
                                            <View style={[styles.qnaStatusSection]}>
                                                <CustomTextM style={[styles.qnaStatusText, {color:'#ca3e8a'}]}>공지사항</CustomTextM>
                                            </View>
                                            <CustomTextR style={styles.qnaQuestionTitleText}>
                                                {item.questionTitle}
                                            </CustomTextR>
                                            <View style={{flex:1,paddingVertical:5,flexDirection:'row',flexGrow:1}}>
                                                <CustomTextR                                                 
                                                    style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:5}}
                                                >{item.regDatetime}</CustomTextR>
                                                <CustomTextR                                                 
                                                    style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingHorizontal:5}}
                                                >|</CustomTextR>
                                                <CustomTextR                                                 
                                                    style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingHorizontal:5}}
                                                >{item.userName}</CustomTextR>
                                            </View>   
                                        </View>
                                    
                                        }
                                    > */}
                                    <TouchableOpacity onPress={() => this.toggleRow(item)}>
                                        <View style={{paddingHorizontal:15,justifyContent:'center'}}>
                                            <View style={[styles.qnaStatusSection]}>
                                                <CustomTextM style={[styles.qnaStatusText, {color:'#ca3e8a'}]}>공지사항</CustomTextM>
                                            </View>
                                            <CustomTextR numberOfLines={this.state.openRowIdx === item.teacherQuestionIdx ? 10 : 2} style={styles.qnaQuestionTitleText}>{item.questionTitle}</CustomTextR>
                                            
                                            <View style={{flex:1,paddingVertical:5,flexDirection:'row',flexGrow:1}}>
                                                <CustomTextR                                                 
                                                    style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:5}}
                                                >{item.regDatetime}</CustomTextR>
                                                <CustomTextR                                                 
                                                    style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingHorizontal:5}}
                                                >|</CustomTextR>
                                                <CustomTextR                                                 
                                                    style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingHorizontal:5}}
                                                >{item.userName}</CustomTextR>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    {this.state.openRowIdx === item.teacherQuestionIdx && (
                                        <View style={{width:SCREEN_WIDTH ,backgroundColor:DEFAULT_COLOR.input_bg_color,padding:15}}>
                                            <View style={{paddingBottom:10}}>
                                                <HTMLConvert 
                                                    {...DEFAULT_PROPS}
                                                    html={item.questionContent}
                                                />
                                            </View>
                                        </View>
                                    )}
                                    {/* </DropDown> */}
                                </View>
                            )
                        })
                    )}
                    { itemlist.length  > 0 
                    ?
                    itemlist.map((item, index) => {
                        if ( item.replyStatus === '답변완료') {
                            return (
                                <View style={{paddingVertical:15,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color}} key={index}>
                                    {/* <DropDown
                                        style={styles.agreeWapper}
                                        contentVisible={false}
                                        //invisibleImage={IC_ARR_DOWN}
                                        //visibleImage={IC_ARR_UP}
                                        header={
                                        <View style={{paddingHorizontal:15,justifyContent:'center'}}>
                                            <View style={[styles.qnaStatusSection]}>
                                                <CustomTextM style={[styles.qnaStatusText, {color:DEFAULT_COLOR.lecture_base}]}>답변완료</CustomTextM>
                                                {item.isSecret && (
                                                    <Image source={require('../../../assets/icons/icon_lock.png')} style={{marginLeft: 3, width: PixelRatio.roundToNearestPixel(16), height: PixelRatio.roundToNearestPixel(16)}} />
                                                )}
                                            </View>
                                            <CustomTextR style={styles.qnaQuestionTitleText}>
                                                {item.questionTitle}
                                            </CustomTextR>
                                            <View style={{flex:1,paddingVertical:5,flexDirection:'row',flexGrow:1}}>
                                                <CustomTextR
                                                    style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:5}}
                                                >{item.regDatetime}</CustomTextR>
                                                <CustomTextR
                                                    style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingHorizontal:5}}
                                                >|</CustomTextR>
                                                <CustomTextR
                                                    style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingHorizontal:5}}
                                                >{CommonUtil.middleMask(item.userName, '*')}</CustomTextR>
                                            </View>
                                        </View>
                                    
                                        }
                                    > */}
                                    <TouchableOpacity onPress={() => this.toggleRow(item)}>
                                        <View style={{paddingHorizontal:15,justifyContent:'center'}}>
                                            <View style={[styles.qnaStatusSection]}>
                                                <CustomTextM style={[styles.qnaStatusText, {color:DEFAULT_COLOR.lecture_base}]}>답변완료{item.memberIdx}</CustomTextM>
                                                {item.isSecret && (
                                                    <Image source={require('../../../assets/icons/icon_lock.png')} style={{marginLeft: 3, width: PixelRatio.roundToNearestPixel(16), height: PixelRatio.roundToNearestPixel(16)}} />
                                                )}
                                            </View>
                                            <CustomTextR numberOfLines={this.state.openRowIdx === item.teacherQuestionIdx ? 10 : 2} style={styles.qnaQuestionTitleText}>{item.questionTitle}</CustomTextR>
                                            <View style={{flex:1,paddingVertical:5,flexDirection:'row',flexGrow:1}}>
                                                <CustomTextR
                                                    style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:5}}
                                                >{item.regDatetime}</CustomTextR>
                                                <CustomTextR
                                                    style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingHorizontal:5}}
                                                >|</CustomTextR>
                                                <CustomTextR
                                                    style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingHorizontal:5}}
                                                >{CommonUtil.middleMask(item.userName, '*')}</CustomTextR>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    {this.state.openRowIdx === item.teacherQuestionIdx && (
                                        <View style={{width:SCREEN_WIDTH ,backgroundColor:DEFAULT_COLOR.input_bg_color,padding:15}}>
                                            <View style={{marginBottom: 10}}>
                                               <Image source={require('../../../assets/icons/icon_qa_q.png')} style={{width:PixelRatio.roundToNearestPixel(36*1.5),height:PixelRatio.roundToNearestPixel(17*1.5)}} />
                                            </View>

                                            <View style={{marginBottom: 20}}>
                                                <HTMLConvert 
                                                    {...DEFAULT_PROPS}
                                                    html={item.questionContent}
                                                />
                                            </View>
                                            <View style={{marginBottom: 10}}>
                                                <Image source={require('../../../assets/icons/icon_qa_a.png')} style={{width:PixelRatio.roundToNearestPixel(69*1.5),height:PixelRatio.roundToNearestPixel(17*1.5)}} />
                                            </View>
                                                {item.questionAnswer.map(
                                                    (qitem, qindex) => {
                                                        return (
                                                            <View style={{marginBottom: 10}} key={qindex}>
                                                                <HTMLConvert
                                                                    {...DEFAULT_PROPS}
                                                                    //style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12)}} 
                                                                    html={qitem.content}
                                                                />
                                                            </View>
                                                        );
                                                    },
                                                )}
                                        </View>
                                    )}
                                    {/* </DropDown> */}
                                </View>
                            )

                        } else {
                            return(
                                <View style={{paddingVertical:15,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color}} key={index}>
                                    <TouchableOpacity onPress={() => this.toggleRow(item)}>
                                        <View style={{paddingHorizontal:15}}>
                                            <View style={{flex:1}}>
                                                <View style={[styles.qnaStatusSection]}>
                                                    <CustomTextM style={[styles.qnaStatusText, {color:'#aaa'}]}>답변대기{item.memberIdx}</CustomTextM>
                                                    {item.isSecret && (
                                                    <Image source={require('../../../assets/icons/icon_lock.png')} style={{marginLeft: 3, marginTop: 3, width: PixelRatio.roundToNearestPixel(16), height: PixelRatio.roundToNearestPixel(16)}} />
                                                    )}
                                                </View>
                                                <CustomTextR numberOfLines={this.state.openRowIdx === item.teacherQuestionIdx ? 10 : 2} style={styles.qnaQuestionTitleText}>{item.questionTitle}</CustomTextR>
                                            </View>
                                            <View style={{flex:1,paddingVertical:5,flexDirection:'row',flexGrow:1}}>
                                                <CustomTextR
                                                    style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:5}}
                                                >{item.regDatetime}</CustomTextR>
                                                <CustomTextR
                                                    style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingHorizontal:5}}
                                                >|</CustomTextR>
                                                <CustomTextR
                                                    style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingHorizontal:5}}
                                                >{CommonUtil.middleMask(item.userName, '*')}</CustomTextR>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    {this.state.openRowIdx === item.teacherQuestionIdx && (
                                        <View style={{width:SCREEN_WIDTH ,backgroundColor:DEFAULT_COLOR.input_bg_color,padding:15}}>
                                            <View style={{paddingBottom:5}}>
                                                <Image source={require('../../../assets/icons/icon_qa_q.png')} style={{width:PixelRatio.roundToNearestPixel(36*1.5),height:PixelRatio.roundToNearestPixel(17*1.5)}} />
                                            </View>

                                            <View style={{paddingBottom:10}}>
                                                <HTMLConvert 
                                                    {...DEFAULT_PROPS}
                                                    html={item.questionContent}
                                                />
                                            </View>
                                            <View style={{paddingBottom:5,paddingTop:10}}>
                                                <Image source={require('../../../assets/icons/icon_qa_a.png')} style={{width:PixelRatio.roundToNearestPixel(69*1.5),height:PixelRatio.roundToNearestPixel(17*1.5)}} />
                                            </View>
                                            {
                                            item.questionAnswer.map((qitem, qindex) => {
                                                return (
                                                    <View key={qindex}>
                                                        <HTMLConvert 
                                                             {...DEFAULT_PROPS}
                                                            //style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12)}} 
                                                            html={qitem.content}
                                                        />
                                                    </View>
                                                    
                                                    
                                                )
                                            })
                                            }
                                        </View>
                                    )}
                                </View>
                            )
                        }
                    })
                    :
                    <View style={[styles.itemWrapBlank,{alignItems:'center', justifyContent: 'center', height: SCREEN_HEIGHT * 0.25}]}>
                        <Image source={require('../../../assets/icons/icon_none_exclamation.png')} style={{width: PixelRatio.roundToNearestPixel(65), height: PixelRatio.roundToNearestPixel(65), marginBottom: 12}} />
                        <CustomTextR
                            style={{color:DEFAULT_COLOR.base_color_888,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14)}}
                        >검색 결과가 없습니다.
                        </CustomTextR>
                    </View>
                    }
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
                                        onPress={()=> this.refreshTextBookInfoMore(this.state.classIdx,parseInt(this.state.currentpage)+1,pageViewLimit)}
                                    >
                                        <Text style={styles.commonText02}>+ 질문 더보기</Text>
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
}

const styleshtml = StyleSheet.create({
    a: {
      fontWeight: '300',
      color: DEFAULT_COLOR.lecture_base
    },
  });

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : '#fff',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    moreContainer : {
        flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,paddingVertical:10,borderRadius:5
    },
    requestTitleText2 : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },

    reviewContentWrap : {        
        marginHorizontal:15,
        justifyContent:'flex-start'
    },
    itemBannerContainer: {
        width:100,
        minHeight: 60,
        marginHorizontal : 5
    },
    imgBannerBackground: {
        width:100,
        minHeight: 60,
        transform: [{ scale: 1 }]
    },

    card: {
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 3,
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        backgroundColor: '#fff',
    },
    cardText: {
        color:DEFAULT_COLOR.base_color_666,
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_13)        
    },
    footer: {
        width :SCREEN_WIDTH,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    footerText: {
        fontSize: 16,
        color: '#FFF',
        textAlign: 'center',
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
    qnaStatusSection: {marginBottom: 10, flexDirection: 'row', alignItems: 'center'},
    qnaStatusText: {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),fontWeight: "500",letterSpacing: PixelRatio.roundToNearestPixel(-0.6)
    },
    qnaQuestionTitleText: {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_222,letterSpacing: PixelRatio.roundToNearestPixel(-0.75)
    }
});

function mapStateToProps(state) {
    return {
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
    };
}

export default connect(mapStateToProps, null)(LectureQna);