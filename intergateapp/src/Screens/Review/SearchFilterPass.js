import React, { Component } from 'react';
import {PixelRatio, Dimensions, Text, TouchableOpacity, View,StyleSheet,ScrollView,Platform,ActivityIndicator} from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Style/CustomText';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

class SearchFilterPass extends Component {
    constructor(props) {
        super(props);
        this.state = {      
            loading : true, 
            attentionSelectCode : null,
            attentionItems : [],
            selectedFilterCodeList : []
        }
    }

    async UNSAFE_componentWillMount() {        
        
        if ( typeof this.props.screenProps.reviewSelectDataPass !== 'undefined' ) {            
            if ( this.props.screenProps.reviewSelectDataPass.length > 0 ) {
                this.setState({
                    selectedFilterCodeList: this.props.reviewSelectDataPass,
                    loading : false
                })
                await this.refreshTextBookInfo();
            }else{
                await this.refreshTextBookInfo();
            }
        }else{
            await this.refreshTextBookInfo();
        }
    }  

    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보 
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        
    }

    componentWillUnmount(){
        
    }

    refreshTextBookInfo = async() => {
        
        let aPIsDomain = typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain
        let aPIsAuthKey = typeof this.props.myInterestCodeOne.info.apiKey !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey
        
        await CommonUtil.callAPI( aPIsDomain + '/v1/meta/pass',{
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
                        this.failCallAPi()
                    }else{
                        //console.log('response.data',JSON.stringify(response.data))
                        if ( typeof response.data !== 'undefined') {
                            this.setState({
                                attentionItems : response.data
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

    failCallAPi = () => {
     
        let message = "데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);

    }

    _closeModal = () => {
        this.setState({ showModal: false })
    };
    _showModal = async(mode) => {        
        await this.setState({ modalContent: mode })        
        this.setState({ showModal: true })
    }

    setChecked = async(category,idx,thischeck,data) => {
        let selectedFilterCodeList = this.state.selectedFilterCodeList;                  
        

        this.state.attentionItems[category].groupCategory.categoryList[idx].checked = !thischeck;
        if ( thischeck ) { //제거            
            selectedFilterCodeList = selectedFilterCodeList.filter((info) => info.name !== data.categoryName);
        }else{ //추가
            selectedFilterCodeList.push({category :parseInt(category)+parseInt(1),code : data.categoryName,name : data.categoryName});
        }
        return selectedFilterCodeList;

    }
    //this.checkCartList(index1,data1.checked,data1)}
    checkCartList = async(category,idx,thischeck,data) =>{
        console.log('11111', data)
        let returArray = await this.setChecked(category,idx,thischeck,data);
        // 중복제거
        Array.from(new Set(returArray));
        
        this.setState({
            selectedFilterCodeList : returArray
        })
    }

    setupClearFilter = async() => {
        let sendData = []
        await this.setState({
            selectedFilterCodeList : []
        })
        //this.props._updatereviewSelectDataPass(sendData);
    }
    
    setupFilter = async() => {
        let foreData = this.props.reviewSelectDataPass;
        await this.props._updatereviewSelectDataPass(this.state.selectedFilterCodeList);        
        setTimeout(() => {
            if ( JSON.stringify(foreData) === JSON.stringify(this.state.selectedFilterCodeList)) {
                this.props.screenState._closeModal(true);
            }else{
                this.props.screenState._closeModal(true);
            }
        }, 300)

        //await this.props._updatereviewSelectDataPass(this.state.selectedFilterCodeList);
        //this.props.screenState._closeModal(true);
    }


    render() {

        if (this.state.loading) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        } else {
        
            return(
                <View style={ styles.container }>                
                    <View style={{paddingTop:5,paddingBottom:10,alignItems:'center',justifyContent:'center',borderBottomColor:'#ccc',borderBottomWidth:1}}>
                        <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)}}>
                            검색필터
                        </CustomTextR>
                        <TouchableOpacity 
                            onPress= {()=> {                            
                                this.props.screenState._closeModal(false);
                                }
                            }
                            style={{position:'absolute',top:0,right:15,width:30,height:30}}>
                            <Icon name="close" size={25} color={DEFAULT_COLOR.base_color_666} />
                        </TouchableOpacity>
                    </View>
            
                    <ScrollView 
                        style={{flex:1,backgroundColor:'#fff',marginBottom:100}}
                    >
                    { 
                        this.state.attentionItems.map((tdata, tindex) => { 
                            return (
                                <View style={{flex:1,padding:10}} key={tindex}>
                                    <View style={{flex:1,marginVertical : 10,paddingLeft:10}}>
                                        <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>{tdata.groupCategory.name}</CustomTextR>
                                    </View>
                                    <View style={{flex:1,flexDirection:'row',flexWrap:'wrap',flexGrow:1,alignContent:'stretch'}}>
                                    { 
                                        tdata.groupCategory.categoryList.map((data1, index1) => { 
                                            let isIndexOf = this.state.selectedFilterCodeList.findIndex(
                                                info => info.name === data1.categoryName
                                            );                                        
                                            return (
                                                <View key={index1} >
                                                    <TouchableOpacity
                                                        onPress= {()=> this.checkCartList(tindex,index1,isIndexOf !== -1 ? true : false,data1)}
                                                        style={isIndexOf !== -1 ? styles.selectedAttention : styles.unselectedAttention}
                                                    >
                                                        <CustomTextR style={[{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)},isIndexOf !== -1 ? styles.textWhite : styles.textGray]}
                                            >
                                                            {data1.categoryName}
                                                        </CustomTextR>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })
                                    }
                                    </View>
                                </View>
                            )
                        })
                    }
                    </ScrollView>
                    <View style={{position:'absolute',left:0,bottom:0,width:SCREEN_WIDTH,minHeight:10}}>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity 
                                onPress={()=>this.setupClearFilter()}
                                style={{flex:1,padding:20,alignItems:'center',justifyContent:'center',backgroundColor:'#222'}}
                            >
                                <CustomTextB style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)}}>
                                    초기화
                                </CustomTextB>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{flex:1,flexDirection:'row',flexGrow:1,padding:20,alignItems:'center',justifyContent:'center',backgroundColor:DEFAULT_COLOR.lecture_base}}
                                onPress={()=>this.setupFilter()}
                            >
                                <CustomTextB style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)}}>
                                    적용
                                </CustomTextB>
                                <View style={{position:'absolute',right:'30%',top:15,width:25,height:25,borderRadius:15,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',marginLeft:10}}>
                                    <CustomTextR style={{color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>{this.state.selectedFilterCodeList.length}</CustomTextR>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
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
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    unselectedAttention : {
        margin:5,backgroundColor:'#fff',paddingHorizontal:20,
        alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:10,
        ...Platform.select({
            ios: {
                paddingVertical: 10
            },
            android: {
                paddingVertical: 0
            },
            default: {              
                paddingVertical: 10
            }
          })
    },
    selectedAttention : {
        margin:5,backgroundColor:DEFAULT_COLOR.lecture_base,paddingHorizontal:20,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:10,
        ...Platform.select({
            ios: {
                paddingVertical: 10
            },
            android: {
                paddingVertical: 0
            },
            default: {              
                paddingVertical: 10
            }
          })
    },
    textWhite  :{
        color : DEFAULT_COLOR.base_color_fff
    },
    textGray  :{
        color : DEFAULT_COLOR.base_color_666
    }
    
    
});


function mapStateToProps(state) {
    return {
        selectBook: state.GlabalStatus.selectBook,    
        topFavoriteMenu: state.GlabalStatus.topFavoriteMenu,   
        showBottomBar: state.GlabalStatus.showBottomBar,
        textBookFocusHeight : state.GlabalStatus.textBookFocusHeight,
        myTopFilter : state.GlabalStatus.myTopFilter,
        reviewSelectDataCourse : state.GlabalStatus.reviewSelectDataCourse,
        reviewFilterDataCourse : state.GlabalStatus.reviewFilterDataCourse,
        reviewSelectDataPass : state.GlabalStatus.reviewSelectDataPass,
        reviewFilterDataPass : state.GlabalStatus.reviewFilterDataPass,
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,  
    };
}


function mapDispatchToProps(dispatch) {
    return {
        _updateStatusNowScroll:(boolen) => {
            dispatch(ActionCreator.updateStatusNowScroll(boolen));
        },
        _updateStatusShowBottomBar:(boolen) => {
            dispatch(ActionCreator.updateStatusShowBottomBar(boolen));
        },
        _updateTextBookFocusHeight:(number) => {
            dispatch(ActionCreator.updateTextBookFocusHeight(number));
        },
        _updatemyTopFilter:(object) => {
            dispatch(ActionCreator.updatemyTopFilter(object));
        },
        _updatereviewFilterDataCourse:(object) => {
            dispatch(ActionCreator.updatereviewFilterDataCourse(object));
        },
        _updatereviewFilterDataPass:(object) => {
            dispatch(ActionCreator.updatereviewFilterDataPass(object));
        },
        _updatereviewSelectDataCourse:(object) => {
            dispatch(ActionCreator.updatereviewSelectDataCourse(object));
        },
        _updatereviewSelectDataPass:(object) => {
            dispatch(ActionCreator.updatereviewSelectDataPass(object));
        }

    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchFilterPass);