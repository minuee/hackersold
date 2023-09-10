import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,PixelRatio,Image,TouchableOpacity,Alert,ActivityIndicator,Linking} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
//공통상수
import  * as getDEFAULT_CONSTANTS   from './src/Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from './src/Utils/CommonUtil';
import CommonFuncion from './src/Utils/CommonFunction';
import {CustomTextR, CustomTextB, TextRobotoM,TextRobotoR} from './src/Style/CustomText';

import Svg,{Image as SvgImage,SvgUri} from 'react-native-svg';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

import {connect} from 'react-redux';
import ActionCreator from './src/Ducks/Actions/MainActions';
import { cos } from 'react-native-reanimated';


class InterestSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {   
            nowResult : '관심분야를 가져오고 있습니다...',
            loading : false,
            processing: false,
            interestMode : this.props.screenState.interestMode,
            attentionSelectCode : this.props.screenState.attentionSelectCode,
            attentionSelectName : this.props.screenState.attentionSelectName?this.props.screenState.attentionSelectName:'관심분야를 선택해주세요',
            attentionSelectRGB : this.props.screenState.attentionSelectRGB,
            attentionSelectData : [],
            interestCode : [],
            marginB : 0,
            headerHeight : SCREEN_HEIGHT,
            popLayerInfo: [],
        };
    }

    async UNSAFE_componentWillMount() {              
        await this.getInterestCode();        
        
    } 

    getInterestCode = async() => {
    
        await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/meta',{
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
                        this.failCallAPi();
                        this.setState({                    
                            loading:true,
                            nowResult : '데이터 수신중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요'
                        });
                        
                    }else{               
                        this.setState({
                            interestCode : response.data.categories,
                            loading:true
                        });

                        this.saveInterestCode(response.data.categories);
                    }
                }
                
            })
            .catch(err => {
                console.log('login error => ', err);
                this.setState({                    
                    loading:true,
                    nowResult : '데이터 수신중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요'
                });
                this.failCallAPi()
        });
       
    }

    saveInterestCode = async categories => {
        // 저장된 회원의 관심분야 판별용으로 관심분야 전체 목록 저장 (전범준)
        await AsyncStorage.setItem('interestCode', JSON.stringify(categories));
    };

    failCallAPi = () => {
     
        let message = "데이터 수신중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);

    }

    selectAttention = async(data,rgb) => {      
     
        this.setState({ 
            attentionSelectCode: data.interestFieldID,
            attentionSelectName: data.interestFieldName,
            attentionSelectRGB: rgb,
            attentionSelectData: data
        })     
        //if ( this.state.interestCode.length === seq) {
            //this.ScrollView.scrollTo({ y: this.state.headerHeight,  animated: true });    
        //}
        
    }

    setTodoMyInterest = async() => {
        if ( this.state.attentionSelectCode === null ) {
            this.showAlert("관심분야 미설정", '최소 한개이상의 관심분야가 설정하셔야 합니다.');
            return true;
        } else {
            this.isEnableInterestCheck();
        }

    }

    // 전에 선택한 관심분야 사용가능 여부 체크
    isEnableInterestCheck = async () => {
        const beforeInterest = await CommonUtil.getMyInterest();
        if (!CommonUtil.isEmpty(beforeInterest)) {
            const isEnableInterest = await CommonUtil.isEnableInterest(beforeInterest.interestFieldID);
            // 기존 관심분야가 이미 숨김처리 된 경우
            if (!isEnableInterest) {
                Alert.alert('', '관심분야 변경 시, 기존에 이용 중이던 관심분야는 확인이 불가능합니다. 관심분야를 변경하시겠어요?',
                [
                    {text: '관심분야 유지', onPress: () => this.props.screenState._topCloseModal()},
                    {text: '관심분야 변경', onPress: () => this.setMyInterest()},
                ]);
            } else {
                this.setMyInterest();
            }
        } else {
            this.setMyInterest();
        }
    };

    setMyInterest = async () => {
        this.setState({loading: true, processing: true});
        if ( this.state.interestMode !== 'once') {
            let myInterestCode = [{code : this.state.attentionSelectCode,name:this.state.attentionSelectName,info:this.state.attentionSelectData,color:this.state.attentionSelectRGB}];                
            await this.props._updateMyInterestOneCode( myInterestCode[0]);
            //await AsyncStorage.setItem('myGnbMenu',JSON.stringify(this.state.attentionSelectData.gnbList) );
        }

        if ( this.state.interestMode === 'new' || this.state.interestMode === 'mod') { //최초/변경시
            let isCanUse = await this.checkeMyInterestcode(this.state.attentionSelectCode, this.state.attentionSelectData.gnbList);
            this.state.interestMode === 'mod' && await this.props.screenState.checkShowPopLayer(this.state.popLayerInfo);
        }

        this.props.screenState.setMyInterest(this.state.attentionSelectCode,this.state.attentionSelectName,this.state.attentionSelectData,this.state.attentionSelectRGB);
    };

    checkeMyInterestcode = async(mcode, gnbList) => {
        await  AsyncStorage.removeItem('myGnbMenu');
        await  AsyncStorage.removeItem('myClassBrother');
        await  AsyncStorage.removeItem('myClassMenu');
        await  AsyncStorage.removeItem('infoMessages');
        let returnCode = false;
        let reGnbList = gnbList;
        let remyClassGnbList = [];     
        let brotherList = [];     
        let textBookSubmenuList = [];     

        await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/meta/' +  mcode,{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': DEFAULT_CONSTANTS.apiAdminKey
            }), 
                body:null
            },10000
            ).then(response => {
                //console.log('response2',response.data.menu.textBookSubmenu)
                if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                    if ( response.code !== '0000' ) {
                        returnCode = true;
                        
                    }else{               
                        returnCode = false;  // 사용중이면 gnb정보를 업데이트한다.
                        reGnbList = response.data.menu.gnbList;                        
                        if ( typeof response.data.menu.myclassList !== 'undefined') {
                            remyClassGnbList = response.data.menu.myclassList;
                        }
                        
                        if ( typeof response.data.menu.interestBrotherCode !== 'undefined') {                           
                            brotherList = response.data.menu.interestBrotherCode;
                        }

                        if ( typeof response.data.menu.textBookSubmenu !== 'undefined') {                           
                            textBookSubmenuList = response.data.menu.textBookSubmenu;
                        }

                        if (response.data.popLayer && response.data.popLayer.lectureTop) {
                            const os = Platform.OS === 'ios' ? 'iOS' : 'Android';
                            const arrPopLayer = response.data.popLayer.lectureTop.filter(item => item.osType.includes(os)) || [];
                            this.setState({popLayerInfo: arrPopLayer});
                        }
                    }
                }
                
            })
            .catch(err => {
                remyClassGnbList = JSON.stringify(remyClassGnbList);
                returnCode = true;
            });
        
        // console.log('----- reGnbList topop',JSON.stringify(reGnbList))
        //console.log('textBookSubmenuList',JSON.stringify(textBookSubmenuList))
        await  AsyncStorage.setItem('myGnbMenu',JSON.stringify(reGnbList) );
        await  AsyncStorage.setItem('myClassBrother',JSON.stringify(brotherList) );
        await  AsyncStorage.setItem('myClassMenu',JSON.stringify(remyClassGnbList) );
        await  AsyncStorage.setItem('textBookSubmenu',JSON.stringify(textBookSubmenuList) );

        // 관심분야 변경 후 수강후기 서브메뉴 갱신 문제로 redux추가
        this.props.updateGlobalGnbMenu(JSON.stringify(reGnbList));

        return returnCode;
    }

    onLayoutHeader = () => {
        this.refs.TargetElement.measure((x, y, width, height, pageX, pageY) => {      
            //console.log('height222',x,y,width,height,pageX,pageY);  
            this.setState({
                headerHeight : pageY
            })
        })
    }

    render() {
        if (this.state.loading ) {
            return(
                <View style={ styles.container } onLayout={(e)=>this.onLayoutHeader(e)}>
                    {this.state.interestMode === 'mod' && (
                    <View style={{position: 'absolute', top: 10, right: 20, zIndex: 1}}>
                        <TouchableOpacity onPress={() => this.props.screenState._topCloseModal()}>
                            <Image source={require('./assets/icons/btn_close_page.png')} style={{width: PixelRatio.roundToNearestPixel(16), height: PixelRatio.roundToNearestPixel(16)}} />
                        </TouchableOpacity>
                    </View>
                    )}
                    <SafeAreaView style={{flex:1}}>
                        <View style={{height : 40,padding:15,alignItems :'center',justifyContent : 'center',flexDirection:'row',marginTop:20}}>
                            <View style={{height: SCREEN_HEIGHT / 17,justifyContent: 'center',flex:5}}>
                                { this.state.attentionSelectCode !== null ?
                                <CustomTextB style={{color:this.state.attentionSelectRGB,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_large),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize10),letterSpacing:-1.72}}>{this.state.attentionSelectName}
                                </CustomTextB>
                                :
                                <CustomTextB style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_large),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize10),letterSpacing:-1.72}}>관심분야를 설정해주세요</CustomTextB>
                                }
                            </View>
                            {/*
                            <View style={[styles.overrayHeader,{flex:1}]}>
                                <Text style={ styles.headerText }>저장</Text>
                            </View>
                            */}
                        </View>
                        <ScrollView 
                            ref={(ref) => {
                                this.ScrollView = ref;
                            }}
                            style={{backgroundColor:'#fff',paddingBottom:60}}
                        >
                            { this.state.interestMode !== 'once' &&
                                <View style={{height : 30,paddingLeft:15,flexDirection:'row',flexGrow:1}}>
                                    <Image
                                        style={{width: 29,height: 20}}
                                        source={require('./assets/icons/icon_tip.png')} 
                                        resizeMode='contain'
                                    />            
                                    <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:DEFAULT_COLOR.base_color_666,lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),letterSpacing:-1.05}}>  관심분야는 언제든지 변경할 수 있습니다.</CustomTextR>
                                </View>
                            }
                            { 
                            this.state.interestCode.length > 0 ?                            
                            this.state.interestCode.map((data1, index1) => { 
                                if ( typeof data1.interests !== 'undefined' && data1.interests.length > 0 ) {
                                    return (
                                        <View style={{flex:1,paddingHorizontal:15}} key={index1}>
                                            <View style={parseInt(index1+1)===1 ? styles.interestCodeWrapFisrt : styles.interestCodeWrapElse}>
                                                <Image source={{uri:data1.category.imagePath}} resizeMode='contain' style={{width:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium)}} />
                                                <CustomTextB style={{paddingLeft:5,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color: data1.category.backgroundRGB ? data1.category.backgroundRGB : '#d50032'}}>{data1.category.interestCategoryName}</CustomTextB>
                                            </View>
                                            <View style={{flex:1,flexWrap : 'wrap',flexDirection:'row',alignContent:'flex-start'}}>
                                                { data1.interests.map((data2,index2) => {
                                                    if ( this.state.attentionSelectCode ===  data2.interestFieldID ) {

                                                        return ( //attentionSelectCode
                                                            <View 
                                                                key={index2}
                                                                style={{minHeight:50,width:SCREEN_WIDTH/3-20,margin:5,backgroundColor: data1.category.backgroundRGB ? data1.category.backgroundRGB : '#d50032',padding:5,alignItems:'center',justifyContent:'center',borderRadius:PixelRatio.roundToNearestPixel(8)}}
                                                            >
                                                                <CustomTextR 
                                                                    style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:DEFAULT_COLOR.base_color_fff,letterSpacing:-0.91}}>
                                                                    {data2.interestFieldName}
                                                                </CustomTextR>
                                                            </View>
                                                        )
                                                    }else{
                                                        if ( data2.externalLink  ) {
                                                            return ( //attentionSelectCode
                                                                <TouchableOpacity 
                                                                    key={index2}                                                            
                                                                    style={styles.unselectedAttention}                                                            
                                                                    onPress={()=> Linking.openURL(data2.externalLink)}
                                                                >                                                            
                                                                    <CustomTextR 
                                                                        style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:DEFAULT_COLOR.base_color_444,letterSpacing:-0.91}}>{data2.interestFieldName}
                                                                    </CustomTextR>                                                                
                                                                        <View style={{position:'absolute', right:5,top:5,width:10,height:10}}>
                                                                            <Image source={require("./assets/icons/icon_external_link.png")} resizeMode='contain' style={{width:PixelRatio.roundToNearestPixel(6.2),height:PixelRatio.roundToNearestPixel(6)}} />
                                                                        </View>
                                                                </TouchableOpacity>
                                                            )

                                                        }else {
                                                            return ( //attentionSelectCode
                                                                <View 
                                                                    key={index2}                                                            
                                                                    style={styles.unselectedAttention}
                                                                >
                                                                    <TouchableOpacity 
                                                                        onPress={() => this.selectAttention(data2,data1.category.backgroundRGB)}
                                                                        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                                                                    >                                                            
                                                                        <CustomTextR 
                                                                            style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:DEFAULT_COLOR.base_color_444,letterSpacing:-0.91}}>{data2.interestFieldName}
                                                                        </CustomTextR>                                                                
                                                                    </TouchableOpacity>
                                                                </View>
                                                            )
                                                        }

                                                    }
                                                })
                                                }
                                                
                                            </View>
                                        </View>
                                    )
                                }
                            })
                            :
                            <View style={{paddingTop:30,justifyContent:'center',alignItems:'center'}}> 
                                <Text style={styles.commonDigitText02}>{this.state.nowResult}</Text>
                                <TouchableOpacity 
                                    onPress={()=> this.getInterestCode()} 
                                    style={{paddingTop:10}}
                                >
                                    <Text style={styles.commonDigitText01}>다시시도</Text>
                                </TouchableOpacity>
                            </View>
                            }
                            
                        </ScrollView>
                        
                    </SafeAreaView>
                        { ( this.state.attentionSelectCode &&  this.state.attentionSelectCode !== this.props.screenState.attentionSelectCode ) &&
                        <TouchableOpacity 
                            onPress={ () => this.setTodoMyInterest() }
                            style={{height:CommonFuncion.isIphoneX() ? 70 : 50,width:SCREEN_WIDTH,backgroundColor : '#000',alignItems:'center',justifyContent:'center'}}
                        >
                            <Text style={{color:'#fff', fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium)}}>저장</Text>
                        </TouchableOpacity>
                        }
                
                </View>
            );
        }else{
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
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
    unselectedAttention : {
        minHeight:50,width:SCREEN_WIDTH/3-20,margin:5,backgroundColor:DEFAULT_COLOR.input_bg_color,padding:5,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:PixelRatio.roundToNearestPixel(8)
    },
    selectedAttention : {
        width:SCREEN_WIDTH/3-20,margin:5,padding:10,alignItems:'center',justifyContent:'center'
    },
    textWhite  :{
        color : DEFAULT_COLOR.base_color_fff,fontWeight:'bold'
    },
    text444  :{
        color : '#444'
    },
    commonDigitText01:{
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium),color:DEFAULT_COLOR.base_color_222
    },
    commonDigitText02:{
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),color:DEFAULT_COLOR.base_color_666
    },
    interestCodeWrapFisrt : {
        flex:1,flexDirection:'row',flexGrow:1,marginVertical:10,marginHorizontal:5,justifyContent:'flex-start',alignItems:'center'
    },
    interestCodeWrapElse : {
        flex:1,flexDirection:'row',flexGrow:1,marginVertical:10,marginHorizontal:5,justifyContent:'flex-start',alignItems:'center',borderTopWidth:1,borderTopColor:DEFAULT_COLOR.input_border_color,paddingTop:10
    }
});



function mapStateToProps(state) {
    return {
        selectBook: state.GlabalStatus.selectBook,
        nowScrollY: state.GlabalStatus.nowScrollY,
        topFavoriteMenu: state.GlabalStatus.topFavoriteMenu,   
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
    };
}

function mapDispatchToProps(dispatch) {
    return {
        _updateStatusNetworking:(boolean) => {
            dispatch(ActionCreator.updateStatusNetworking(boolean));

        },
        _updateMyInterestOneCode:(str)=> {
            dispatch(ActionCreator.updateMyInterestOneCode(str))
        },
        updateGlobalGnbMenu:(obj)=> {
            dispatch(ActionCreator.updateGlobalGnbMenu(obj))
        }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(InterestSelect);
