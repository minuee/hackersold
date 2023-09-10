import React, { Component } from 'react';
import {View,StyleSheet,Text,PixelRatio,Dimensions,ActivityIndicator,TouchableOpacity,Animated,Alert,Image} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Swiper from '../../Utils/ViewPager';
import Modal from 'react-native-modal';
import Toast from 'react-native-tiny-toast';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/Feather';
Icon2.loadFont();
import Icon3 from 'react-native-vector-icons/Entypo';
Icon3.loadFont();
import {connect} from 'react-redux';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Style/CustomText';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const pageViewLimit = 5;

class FreeBoardList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading : this.props.screenState.loading,
            refreshing : false,
            isGoback : false,
            moreLoading : false,
            memberIdx : 0,            
            currentpage : 1,
            ismore : false,    
            totalReview : 0,
            parentCode : this.props.screenState.selectedSample,         
            topNotice : this.props.screenState.topNotice, 
            itemList : this.props.screenState.itemList,       
            showModifyForm : false,            
            selectedReivewData : null,    
            noticeHeight : 80            
        }
    }

    UNSAFE_componentWillMount() {        
    //    console.log('this.props.screenState.topNotice', this.props.screenState.topNotice)
       if ( typeof this.props.screenState.topNotice !== 'undefined' ) {
           if ( this.props.screenState.topNotice.length === 3 ) {
                this.setState({noticeHeight : 220})
            }else if ( this.props.screenState.topNotice.length === 2 ) {
                this.setState({noticeHeight : 160})
            }else if ( this.props.screenState.topNotice.length === 1 ) {
                this.setState({noticeHeight : 80})
            }
       }
    }  

    componentDidMount() {
        if ( this.props.userToken !== null ) {
            this.setState({
                memberIdx: this.props.userToken.memberIdx,
            })
        }
    }

    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보     
        if ( this.props.screenState.selectedSample !== prevState.parentCode ) {           
            this.setState({
                parentCode : this.props.screenState.selectedSample,
                
            })
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({            
            itemList : this.props.screenState.itemList, 
        })
        
    }

    componentWillUnmount(){
        
    }


    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.25);    
    closeModal = () => {
        this.setState({ 
            showModifyForm: false,
            selectedReivewData : null
         })
    };

    updateMyReview = async() => {
        if ( this.state.selectedReivewData !== null ) {
            
            await this.setState({showModifyForm:false})
            this.props.screenProps.navigation.navigate('FreeBoardWrite',{
                articleIdx : this.state.selectedReivewData,
                onRefreshMode: this.onRefreshMode
            });            
        }else{
            console.error('not selected')
        }
    
    }

    removeProcess = async() => {
        if ( this.state.selectedReivewData !== null ) {
            const formData = new FormData();       
            formData.append('articleIdx', this.state.selectedReivewData);
            console.log('formData2', formData)
            let refreshData = this.state.itemList.filter((info) => info.articleIdx !== this.state.selectedReivewData);           
            
            await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain  + '/v1/app/board/article/remove',{
                method: 'POST', 
                headers: new Headers({
                    Accept: 'application/json',                
                    'Content-Type': 'multipart/form-data',
                    'apiKey': DEFAULT_CONSTANTS.apiAdminKey
                }), 
                    body:formData
                },10000
                ).then(response => {        
                    
                    if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                        if ( response.code !== '0000' ) {
                            this.failCallAPi();
                            this.setState({showModifyForm : false})
                        }else{                            
                            this.setState({showModifyForm : false})
                            const alerttoast = Toast.show('삭제 되었습니다');
                            setTimeout(() => {
                                Toast.hide(alerttoast);
                                this.setState({itemList : refreshDatas})    
                            }, 1000)
                        }

                    }else{
                        this.setState({showModifyForm : false})
                        this.failCallAPi()
                    }
                    
                })
                .catch(err => {
                    this.setState({showModifyForm : false})
                    console.log('login error => ', err);
                    this.failCallAPi()
            });
            
        }else{
            console.error('not selected')
        }

    }

    removeMyReview = () => {
        Alert.alert(
            DEFAULT_CONSTANTS.appName + ": 자유게시판",
            "선택하신 자유게시판을 삭제하시겠습니까?",
            [
                {text: '네', onPress: this.removeProcess.bind(this)},
                {text: '아니오', onPress: () => null },
            ],
            { cancelable: false }
        )  
        
    }

    onRefreshMode = data => {    
        this.setState({isGoback : data.isRefresh});
    };

    render() {
       
        return(
            <View style={ styles.container }>
                <NavigationEvents
                    onWillFocus={payload => {                        
                        if ( this.state.isGoback ) {
                            console.log('onRefreshModeonRefreshMode');
                            this.props.screenState.refreshTextBookInfo(1)
                        }
                    }}
                    onWillBlur={payload => {                            
                        
                    }}
                />
                <Modal
                    onBackdropPress={this.closeModal}
                    style={{justifyContent: 'flex-end',margin: 0}}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating
                    isVisible={this.state.showModifyForm}>
                    <Animated.View style={{height: this.animatedHeight,backgroundColor:'transparent',margin:15}}>
                        <View style={{flex:3,backgroundColor:'#fff',borderRadius:10}}>
                            <TouchableOpacity 
                                onPress={()=>this.updateMyReview()}
                                style={{flex:1,borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1,alignItems:'center',justifyContent:'center',paddingVertical:10}}
                            >
                                <CustomTextR style={styles.requestTitleText2}>수정</CustomTextR>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={()=>this.removeMyReview()}
                                style={{flex:1,borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1,alignItems:'center',justifyContent:'center',paddingVertical:10}}
                            >
                                <CustomTextR style={styles.requestTitleText2}>삭제</CustomTextR>
                            </TouchableOpacity>                                                   
                        </View>
                        
                        <View style={{flex:1,backgroundColor:'#ccc',borderRadius:10,marginTop:10}}>
                            <TouchableOpacity 
                                onPress= {()=> this.closeModal()}
                                style={{flex:1,alignItems:'center',justifyContent:'center',paddingVertical:10}}
                            >
                                <CustomTextR style={styles.requestTitleText2}>취소</CustomTextR>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </Modal>
                {this.state.topNotice.length > 0 && 
                <Swiper 
                    style={{
                        minHeight:10,
                        maxHeight:this.state.noticeHeight,
                        backgroundColor:DEFAULT_COLOR.input_bg_color,
                        borderBottomColor:DEFAULT_COLOR.input_border_color,
                        borderBottomWidth:1,
                        paddingVertical:10,
                        paddingHorizontal:10
                    }} 
                    paginationStyle={{margin:0,padding:0,marginBottom:-20}}
                    activeDotColor={DEFAULT_COLOR.lecture_base}
                >
                    {
                        
                        this.state.topNotice.map((item,index)=> {
                            //console.log('ddd', index%3)
                            if( index%3 === 0 ) {      
                                let sendData = this.state.topNotice[index];
                                let sendData2 = typeof this.state.topNotice[index+1] !== 'undefined' ? this.state.topNotice[index+1] : null;
                                let sendData3 = typeof this.state.topNotice[index+2] !== 'undefined' ? this.state.topNotice[index+2] :  null;
                                return (
                                    <View key={index} style={{width:SCREEN_WIDTH-25}}>
                                        <TouchableOpacity 
                                            onPress={() => this.props.screenProps.navigation.navigate('NoticeDetailScreen',{
                                                titem:sendData
                                            }) }
                                            style={styles.slideCommonWrap}>
                                            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                                <Image source={require('../../../assets/icons/icon_noti.png')} style={{width: 26, height: 20}} resizeMode='stretch' /> 
                                            </View>
                                            <View style={{flex:7,justifyContent:'center'}}>
                                                <View style={{paddingVertical:1,justifyContent:'center'}}>
                                                    <CustomTextM                                                 
                                                        style={{color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:-0.6}}
                                                    >{item.interestFieldName}{item.index}</CustomTextM>
                                                </View>
                                                <View style={{paddingVertical:1,justifyContent:'center'}}>
                                                    <CustomTextM 
                                                        numberOfLines={1} ellipsizeMode = 'tail'
                                                        style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:-0.65}}
                                                    >{item.title}
                                                    </CustomTextM>
                                                </View> 
                                            </View>                                            
                                        </TouchableOpacity>
                                        { typeof this.state.topNotice[index+1] !== 'undefined' ?                                        
                                        <TouchableOpacity 
                                            onPress={() => this.props.screenProps.navigation.navigate('NoticeDetailScreen',{
                                                titem:sendData2
                                            }) }
                                            style={styles.slideCommonWrap}>
                                            <View style={{flex:1,alignItems:'center',justifyContent:'center',paddingVertical:5}}>
                                                 <Image source={require('../../../assets/icons/icon_noti.png')} style={{width: 26, height: 20}} resizeMode='stretch' /> 
                                            </View>
                                            <View style={{flex:7,justifyContent:'center'}}>
                                                <View style={{paddingVertical:1,justifyContent:'center'}}>
                                                    <CustomTextM                                                 
                                                        style={{color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:-0.6}}
                                                    >{this.state.topNotice[index+1].theme}{this.state.topNotice[index+1].index}</CustomTextM>
                                                </View>
                                                <View style={{paddingVertical:1,justifyContent:'center'}}>
                                                    <CustomTextM 
                                                        numberOfLines={1} ellipsizeMode = 'tail'
                                                        style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:-0.65}}
                                                    >{this.state.topNotice[index+1].title}</CustomTextM>
                                                </View> 
                                            </View>                                            
                                        </TouchableOpacity>
                                        :null
                                        }
                                        { typeof this.state.topNotice[index+2] !== 'undefined' &&
                                        <TouchableOpacity 
                                            onPress={() => this.props.screenProps.navigation.navigate('NoticeDetailScreen',{
                                                titem:sendData3
                                            }) }
                                            style={styles.slideCommonWrap}>
                                            <View style={{flex:1,alignItems:'center',justifyContent:'center',paddingVertical:5}}>
                                                <Image source={require('../../../assets/icons/icon_noti.png')} style={{width: 26, height: 20}} resizeMode='stretch' /> 
                                            </View>
                                            <View style={{flex:7,justifyContent:'center'}}>
                                                <View style={{paddingVertical:1,justifyContent:'center'}}>
                                                    <CustomTextM                                                 
                                                        style={{color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:-0.6}}
                                                    >{this.state.topNotice[index+2].theme}{this.state.topNotice[index+2].index}</CustomTextM>
                                                </View>
                                                <View style={{paddingVertical:1,justifyContent:'center'}}>
                                                    <CustomTextM 
                                                        numberOfLines={1} ellipsizeMode = 'tail'
                                                        style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:-0.65}}
                                                    >{this.state.topNotice[index+2].title}</CustomTextM>
                                                </View> 
                                            </View>                                            
                                        </TouchableOpacity>
                                        }
                                </View>
                                )
                            }
                        })
                    }
                    
                </Swiper>
                }                
                { 
                    this.state.itemList.length === 0 ?
                    
                        <View style={[styles.itemWrap,{alignItems:'center'}]}>
                            <CustomTextM style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:-0.65}}
                            >검색 결과가 없습니다.
                            </CustomTextM>
                        </View>
                    
                    :
                    
                    this.state.itemList.map((titem, index) => {     
                        return(                           
                            <TouchableOpacity 
                                style={styles.itemWrap} key={index}
                                onPress={() => this.props.screenProps.navigation.navigate('FreeBoardDetail',{
                                    titem,onRefreshMode: this.onRefreshMode
                                }) }
                            >                             
                                <View style={{flex:1}}>
                                    <CustomTextM 
                                        numberOfLines={1} ellipsizeMode = 'tail'
                                        style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),letterSpacing:-0.65,paddingBottom:5}}
                                    >{titem.title}
                                    </CustomTextM>

                                </View>      
                                <View style={{flex:1,paddingVertical:5,flexDirection:'row',flexGrow:1}}>
                                    <CustomTextR                                        
                                        style={{color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:-0.65}}
                                    >{titem.interestFieldName}</CustomTextR>
                                    <CustomTextR                                        
                                        style={{paddingHorizontal:5,color:DEFAULT_COLOR.base_color_ccc,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:-0.65}}
                                    >|</CustomTextR>
                                    <CustomTextR                                        
                                        style={{color:DEFAULT_COLOR.base_color_888,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:-0.65}}
                                    >조회수 {parseInt(titem.viewCnt) > 999999 ? '999,999+' : CommonFuncion.currencyFormat(titem.viewCnt)}</CustomTextR>
                                    <CustomTextR                                        
                                        style={{paddingHorizontal:5,color:DEFAULT_COLOR.base_color_ccc,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:-0.65}}
                                    >|</CustomTextR>
                                    <CustomTextR                                        
                                        style={{color:DEFAULT_COLOR.base_color_888,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:-0.65}}
                                    >댓글 {parseInt(titem.replyCnt) > 999 ? '999+' : titem.replyCnt}</CustomTextR>
                                </View>
                                                                    
                            </TouchableOpacity>
                        )
                    })
                }

                { this.props.screenState.ismore && 
                    <View style={{flex:1,justifyContent:'center'}}>
                        <View style={styles.bodyContainer }>
                            <View style={styles.inbodyContainer }>
                                {this.state.moreLoading 
                                ?
                                <View style={styles.moreContainer}><ActivityIndicator size="small" /></View>
                                :
                                <TouchableOpacity 
                                    style={{flex:1,flexDirection:'row',flexGrow:1,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,paddingVertical:10,borderRadius:5}}
                                    onPress={()=> this.props.screenState.refreshTextBookInfoMore(parseInt(this.props.screenState.currentpage)+1)}
                                >
                                    <CustomTextR                                        
                                        style={{paddingHorizontal:5,color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:-0.65}}
                                    >+ 더보기</CustomTextR>
                                    <TextRobotoM style={{paddingLeft:5,color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>
                                        {this.props.screenState.currentpage*pageViewLimit}/{this.props.screenState.totalReview}
                                    </TextRobotoM>
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
        paddingBottom:100
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

    slideCommonWrap: {        
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal:5,
        marginVertical:2,
        paddingHorizontal:5,
        paddingVertical:7,
        backgroundColor:'#fff',
        borderWidth:1,
        borderColor:DEFAULT_COLOR.input_border_color,
        borderRadius:5
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
    requestTitleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_222
    }
});

function mapStateToProps(state) {
    return {
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
        userToken: state.GlabalStatus.userToken,   
    };
}



function mapDispatchToProps(dispatch) {
    return {
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FreeBoardList);