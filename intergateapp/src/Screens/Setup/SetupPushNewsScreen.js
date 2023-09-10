import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
    Dimensions,
    ActivityIndicator,
    StatusBar,
    PixelRatio,
    BackHandler
} from 'react-native';
import Toast from 'react-native-tiny-toast';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import ToggleSwitch from './ToggleSwitch';

import {Button,Overlay,CheckBox,Input} from 'react-native-elements';

import DropDown from './DropDown';

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');



class SetupPushNewsScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,     
            switchOn1: false,    
            UUID : null, 
            childHeight : [],
            myInterestItem : [],
            FaItem : [] 
        }
    }

    async UNSAFE_componentWillMount() {        
        await this.getInterestCode();
        let isUseNewsPush = await AsyncStorage.getItem('isUseNewsPush');
        //console.log('isUseNewsPushisUseNewsPush',isUseNewsPush)
        this.setState({
            switchOn1 : isUseNewsPush === 'false' ? false : true,
        })
        if ( Array.isArray(this.props.myInterestCodeNotice ) === true ) {
            this.setState({
                myInterestItem : this.props.myInterestCodeNotice
            })           
            let returnReArray = await this.setupItems(this.props.myInterestCodeNotice);                
            this.setState({                
                FaItem : returnReArray
            })  
        }else{
            this.setState({
                myInterestItem : []
            }) 
        }

        try {
            const getUUID = await AsyncStorage.getItem('UUID')
            if( getUUID !== null ) {  
                this.setState({
                    UUID : getUUID
                }) 
               
            }
        } catch(e) {                        
           
        }
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        
    }  

    componentDidMount() {             
       this.setState({loading:false})
       //console.log('xxxx',this.state.myInterestItem)
    }

    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보        
        return false;
     
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        return false;
     
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);  
    }

    handleBackButton = () => {
        this.props.navigation.goBack(null);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
        return true;
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
                        this.failCallAPi()
                    }else{                       
                        this.setState({
                            FaItem : response.data.categories,
                            loading:false
                        })
                    }
                }
                
            })
            .catch(err => {
                console.log('login error => ', err);
                this.failCallAPi()
        });
       
    }

    setupItems = async( baseData) => {

        let returnDataArray =  [];
        await this.state.FaItem.forEach(function(element,index,array){   
            let subArray = [];
            element.interests.forEach(function(element2,index2,array2){  
                let isIndexOf = baseData.findIndex(
                    info => info.code === element2.interestFieldID
                );  
                let isChecked = isIndexOf != -1 ?  true : false;

                subArray.push({
                    ...element2,
                    checked  : isChecked
                }); 
            })
            returnDataArray.push({
                'category' : element.category,
                'interests': subArray
            }); 
        });
        
        return returnDataArray;

    }

    
   
    setOnceChecked = async(data,index,index2,mode = null ) => {
        let selectedFilterCodeList = this.state.myInterestItem;     
        if ( mode === 'remove' ) {
            selectedFilterCodeList = await selectedFilterCodeList.filter((info) => info.code !== data.interestFieldID);   
        }else{
            if ( typeof data.checked !== 'undefined' && !data.checked ) { //제거            
                selectedFilterCodeList = await selectedFilterCodeList.filter((info) => info.code !== data.interestFieldID);        
            }else{ //추가
                await selectedFilterCodeList.push({code:data.interestFieldID,name:data.interestFieldName,info:data,depth1:index,depth2:index2});
            }
        }
        return selectedFilterCodeList;
    }
    
    //this setup each
    checkToggle = async(index,index2, data) => {
        this.state.FaItem[index].interests[index2].checked = !data.checked;
        
        let returnArray = await this.setOnceChecked(data,index,index2);    
        
        //Database to save
        this.updateSeupPush(returnArray)

    }

    updateAfterSetup = async(returnArray) => {
        this.setState({
            myInterestItem : returnArray,
            isDelmode : ( this.state.isDelmode && returnArray.length === 0 ) ? false : true
        })   
        if ( this.state.isDelmode && returnArray.length > 0  ) {
            this.setState({
                isDelmode : false
            })   
        }

        //일단 스토리지에 넣는다        
        console.log('returnArray', returnArray)
        await AsyncStorage.setItem('MyNewsInterest', JSON.stringify(returnArray));
        this.props._updateMyInterestNoticeCode(returnArray);

    }

    updateSeupPush = async(returnArray) => {
      
        let interestCodeArray = [];
        await returnArray.forEach(function(element,index,array){      
            interestCodeArray.push(element.code)
        });
        this.updateAfterSetup(returnArray); 
        const formData = new FormData();       
        formData.append("isUse",this.state.switchOn1)
        formData.append('UUID', this.state.UUID);        
        formData.append('appID',DEFAULT_CONSTANTS.appID);
        formData.append('interestCode', JSON.stringify(interestCodeArray));    
       
        await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/push/news',{
            method: 'POST', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': DEFAULT_CONSTANTS.apiAdminKey
            }), 
                body:formData
            },10000
            ).then(response => {

                if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                    if ( response.code === '0000' ) {
                        this.updateAfterSetup(returnArray);                       
                    }
                }else{
                    this.failCallAPi();
                }
               
            })
            .catch(err => {
                console.log('login error => ', err);
                this.failCallAPi()
              
        });
    }

    failCallAPi = () => {
        let message = "처리중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);

    }



    onChangeState(val) {
        CommonFuncion.isSetupNewsPush(val);
        this.setState({switchOn1: val})
        this.updateSeupPush(this.state.myInterestItem)
    }

    onLayout = (evt,index) => {
        if ( evt.nativeEvent.layout.height > 0 ) {
            this.state.FaItem[index].height = parseInt(evt.nativeEvent.layout.height)
        }
    }

    render() {
        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        }else {
            return(
                <View style={ styles.container }>
                    { Platform.OS == 'android' && <StatusBar backgroundColor={DEFAULT_COLOR.lecture_base} translucent={false}  barStyle="dark-content" />}
                    <ScrollView>
                        <View style={ styles.bodyContainer }>
                            <View style={{flex:5,justifyContent:'center',paddingVertical:15}}>
                                <Text style={styles.commonText03}>선택한 관심분야에 대해 새로운 소식을 받습니다.</Text>
                            </View>
                            <View style={{flex:1,alignItems:'flex-end',justifyContent:'center',paddingVertical:15}}>
                                <ToggleSwitch
                                    type={0}
                                    containerStyle={{
                                    marginTop: 0,
                                    width: 50,
                                    height: 24,
                                    borderRadius: 12,
                                    padding: 5,
                                    }}
                                    backgroundColorOn='#3fcfff'
                                    backgroundColorOff='#ebebeb'
                                    circleStyle={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    backgroundColor: '#fff'
                                    }}
                                    switchOn={this.state.switchOn1}
                                    onPress={()=> this.onChangeState(!this.state.switchOn1)}
                                    circleColorOff='#fff'
                                    circleColorOn='#FFF'
                                    duration={500}
                                />
                            </View>
                        </View>
                        <View style={{height:10,backgroundColor:DEFAULT_COLOR.input_bg_color,borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1,}} />
                        <View style={ {backgroundColor : "#fff"}}>
                            { 
                            this.state.FaItem.map((item,index) => {
                                let checkArray = item.interests.filter(info => info.checked === true);
                                return (
                                    <View key={index} >
                                        <DropDown                            
                                            //style={{padding:10}}
                                            contentVisible={false}
                                            checkCount={2}
                                            totalCount={item.interests.length}
                                            childHeight={item.height}
                                            header={
                                            <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color}}>
                                                <View style={{flex:3,paddingVertical:20,paddingLeft:20}}>
                                                    <Text style={styles.commonText01}>{item.category.interestCategoryName}</Text>
                                                </View>
                                                <View style={{flex:1,paddingVertical:20,flexDirection:'row',alignItems:'flex-end',justifyContent:'center'}}>
                                                    <Text style={styles.commonDigitText01}>{checkArray.length}</Text>
                                                    <Text style={styles.commonDigitText02}>{" / "}</Text>
                                                    <Text style={styles.commonDigitText02}>{item.interests.length}</Text>
                                                </View>
                                            </View>
                                            }
                                        >
                                            <View style={{flex:1,width:SCREEN_WIDTH}} onLayout={(e)=>this.onLayout(e,index)}>
                                                {
                                                    item.interests.map((item2,index2) => {
                                                        let isIndexOf2 = this.state.myInterestItem.findIndex(
                                                            info => info.code === item2.interestFieldID
                                                        );  
                                                        let isChecked = ( isIndexOf2 != -1 || item2.checked )  ?  true : false ;
                                                        return (                                                            
                                                            <TouchableOpacity 
                                                                onPress={()=> this.checkToggle(index,index2,item2)}
                                                                style={styles.commonBoxItemWrap} key={index2}
                                                            >
                                                                <View style={{paddingVertical:15,paddingLeft:10,alignItems:'flex-end',justifyContent:'center'}}>
                                                                    <CheckBox 
                                                                        containerStyle={{padding:0,margin:0}}   
                                                                        iconType='font-awesome'
                                                                        checkedIcon='check'
                                                                        uncheckedIcon='check'
                                                                        checkedColor={DEFAULT_COLOR.lecture_base}
                                                                        uncheckedColor={DEFAULT_COLOR.input_border_color}
                                                                        onPress= {()=> this.checkToggle(index,index2,item2)}
                                                                        checked={isChecked}
                                                                    />
                                                                
                                                                </View>
                                                                <View style={{paddingVertical:15,alignItems:'flex-end',justifyContent:'center'}}>
                                                                    <Text style={styles.commonText01}>
                                                                        {item2.interestFieldName}
                                                                    </Text>
                                                                </View>                                        
                                                            </TouchableOpacity>
                                                        )
                                                    })
                                                }
                                            </View>                                
                                        </DropDown>
                                    </View>

                            )})}
                            
                        </View>
                        <View style={{flex:1,height:100}} />
                    </ScrollView>
                </View>
            );
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bodyContainer : {        
        flexDirection:'row',
        backgroundColor : "#fff",
        borderBottomColor:DEFAULT_COLOR.input_border_color,
        borderBottomWidth:1,
        paddingHorizontal:20,
    },
 
    inbodyContainer : {      
        flex:1,flexDirection:'row',backgroundColor : "#fff",     
    },
    commonText01:{
        fontWeight:'bold',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),color:DEFAULT_COLOR.base_color_222
    },
    commonText02:{
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),color:DEFAULT_COLOR.base_color_666
    },
    commonText03:{
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12),color:DEFAULT_COLOR.lecture_base
    },
    commonDigitText01:{
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),color:DEFAULT_COLOR.lecture_base
    },
    commonDigitText02:{
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),color:DEFAULT_COLOR.base_color_666
    },
    commonBoxItemWrap : {
        flexDirection:'row',flexGrow:1,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color,backgroundColor:DEFAULT_COLOR.input_bg_color
    }

});

function mapStateToProps(state) {
    return {       
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
        myInterestCodeMulti: state.GlabalStatus.myInterestCodeMulti,   
        myInterestCodeNotice: state.GlabalStatus.myInterestCodeNotice
    };
}


function mapDispatchToProps(dispatch) {
    return {
        _updateMyInterestMultiCode:(str) => {
            dispatch(ActionCreator.updateMyInterestMultiCode(str));
        },
        _updateMyInterestNoticeCode:(str) => {
            dispatch(ActionCreator.updateMyInterestNoticeCode(str));
        },
        
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SetupPushNewsScreen);