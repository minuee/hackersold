import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,TouchableOpacity,StyleSheet,Text,Dimensions,ActivityIndicator,StatusBar,PixelRatio,Platform,BackHandler,Image,Vibration} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationEvents } from 'react-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import ToggleSwitch from './ToggleSwitch';

import {CheckBox} from 'react-native-elements';
import SortableListView from '../../Utils/SortableListView'
import DropDown from './DropDown';

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Style/CustomText';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

class RowComponent extends React.Component {
    constructor(props) {
        super(props);        
    }
    render() {
      return (
        
        <TouchableOpacity
          underlayColor={'#eee'}
          style={{                
                alignItems:'center',
                justifyContent:'center',
                paddingVertical: 15,
                backgroundColor: '#F8F8F8',
                marginVertical:5,
                marginHorizontal:15
                
          }}
          {...this.props.sortHandlers}
        >
          <Text style={styles.commonText04}>{this.props.data.name}</Text>
          <View style={{position:'absolute',right:10,top:10,width:25,height:25}}>
              <Image source={require('../../../assets/icons/btn_list_move.png')} style={{width:25,height:25}} />
          </View>
        </TouchableOpacity>
      )
    }
}



class SetupMyInterest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nowResult : '관심분야를 가져오고 있습니다...',
            oneHeight : 60,
            scrollEnabled: false,
            isEditState: true,
            loading : true,     
            switchOn1: true,     
            isDelmode : false,
            myInterestItem : [
                /*
                { index : 1, name : '토익' ,checked : false},
                { index : 2, name : '토익스피킹',checked : false},
                { index : 3, name : '오픽',checked : false},
                { index : 4, name : '영어회화',checked : false},
                { index : 5, name : '일본어',checked : true}
                */
            ],
            FaItem : [
            ] 
        }
    }

    async UNSAFE_componentWillMount() {    
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);       
        await this.getInterestCode();
        if ( Array.isArray(this.props.myInterestCodeMulti ) === true ) {
            this.setState({
                myInterestItem : this.props.myInterestCodeMulti
            })           
            let returnReArray = await this.setupItems(this.props.myInterestCodeMulti);                
            this.setState({                
                FaItem : returnReArray
            })  
        }else{
            this.setState({
                myInterestItem : []
            }) 
        }
    }  

    componentDidMount() {             
       this.setState({
           loading:false,
           scrollEnabled:true
        })
    }

    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보        
        
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
     
    }

    shouldComponentUpdate(nextProps, nextState) {
        //console.log('nextState.myInterestCodeOne.code nextProps',this.state.scrollEnabled );       
        //console.log('nextState.myInterestCodeOne.code textbook',nextState.scrollEnabled );       
        
        return true;
    }

    componentWillUnmount(){
       
    }

    handleBackButton = () => {
        this.props.navigation.goBack(null);
        return true;
    };

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
                        this.setState({nowResult : '데이터 수신중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요'})
                    }else{                        
                        this.setState({
                            FaItem : response.data.categories,
                            loading:false
                        })
                    }
                }
                
            })
            .catch(err => {
                this.setState({nowResult : '데이터 수신중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요'})
                console.log('login error => ', err);
                this.failCallAPi()
        });
       
    }

    failCallAPi = () => {
     
        let message = "데이터 수신중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);

    }

    removeMyInterest = async(data) => {        
        this.state.FaItem[data.depth1].interests[data.depth2].checked = false;
        let returnArray = await this.setOnceChecked(data.info,data.depth1,data.depth2,'remove');            
        this.setState({
            myInterestItem : returnArray
        })   
        //일단 스토리지에 넣는다        
        await AsyncStorage.setItem('boardMyInterest', JSON.stringify(returnArray));
        this.props._updateMyInterestMultiCode(returnArray);
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
    
    checkToggle = async(index,index2, data) => {
        this.state.FaItem[index].interests[index2].checked = !data.checked;
        
        let returnArray = await this.setOnceChecked(data,index,index2);    
        
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
        await AsyncStorage.setItem('boardMyInterest', JSON.stringify(returnArray));
        this.props._updateMyInterestMultiCode(returnArray);

    }

    onSelectedDrag = async(mode) => {        
        console.log('onSelectedDrag', mode)
        if ( mode) {
            this.setState({scrollEnabled: false})
        } else {
            this.setState({scrollEnabled: true})
        }        

        //일단 스토리지에 넣는다      
        await AsyncStorage.removeItem('boardMyInterest');  
        await AsyncStorage.setItem('boardMyInterest', JSON.stringify(this.state.myInterestItem));
        this.props._updateMyInterestMultiCode(this.state.myInterestItem);
    }

    /*
    onSelectedClickItem = (data,item,index) => {        
        if (this.state.isEditState) {
            this.setState({
                selectedItems: [...data].filter((wItem,windex)=> windex !== index),
                unselectedItems: [item, ...this.state.unselectedItems]
            })
        }
    }

    onSelectedDragStart = () => {
        console.log('dddddd')
        if (!this.state.isEditState) {
            this.setState({
                isEditState: true,
                scrollEnabled: false
            })
        } else {
            this.setState({
                scrollEnabled: false
            })
        }
    }
    onSelectedDragEnd = () => this.setState({scrollEnabled: true})
    renderSelectedItemView = (item,index) => {        
        return (
            <View style={{flex:1,marginVertical:5,marginHorizontal:10,borderRadius:10,backgroundColor:DEFAULT_COLOR.input_bg_color}} key={index}>   
                <View style={{paddingVertical:15,alignItems:'center',justifyContent:'center'}}>
                    <Text style={styles.commonText04}>
                        {item.name}
                    </Text>
                </View>                                        
            </View>
        )
    }

    */

    onLayout = (evt,index) => {
        if ( evt.nativeEvent.layout.height > 0 ) {
            this.state.FaItem[index].height = parseInt(evt.nativeEvent.layout.height)
        }
    }

    onLayoutHeader = () => {
        this.refs.TargetElement.measure((x, y, width, height, pageX, pageY) => {      
            //console.log('height222',x,y,width,height,pageX,pageY);  
            this.setState({oneHeight : parseInt(height)})
            
        })
    }

    render() {

        
        if ( this.state.loading ) {
            return (
                <SafeAreaView style={styles.IndicatorContainer}><ActivityIndicator size="large" /></SafeAreaView>
            )
        }else {

            const ONE_SECOND_IN_MS = 1000;
            let orders = Object.keys(this.state.myInterestItem);
            const PATTERN = [
                1 * ONE_SECOND_IN_MS,
                2 * ONE_SECOND_IN_MS,
                3 * ONE_SECOND_IN_MS
            ];

            const PATTERN_DESC =
                Platform.OS === "android"
                ? "wait 1s, vibrate 2s, wait 3s"
                : "wait 1s, vibrate, wait 2s, vibrate, wait 3s";
                
            return(
                
                <SafeAreaView style={ styles.container }>
                    { 
                        //Platform.OS === 'android' && <StatusBar backgroundColor={DEFAULT_COLOR.lecture_base} translucent={false}  barStyle="dark-content" />
                        Platform.OS === 'android' && <StatusBar barStyle={"dark-content"} backgroundColor={DEFAULT_COLOR.lecture_base} animated={true} hidden={false}/>
                    }
                    <NavigationEvents
                        onWillFocus={payload => {                    
                            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);          
                        }}
                        onWillBlur={payload => {                            
                            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
                        }}
                    />
                    <ScrollView
                        scrollEnabled = {this.state.scrollEnabled}
                        nestedScrollEnabled={true}
                    >
                        <View style={[styles.bodyContainer,{marginTop:15}]}>
                            <View style={{flex:5,paddingVertical:15}}>
                                <CustomTextB
                                    style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}
                                >현재 관심 분야</CustomTextB>
                            </View>
                            {
                                this.state.myInterestItem.length > 0 
                                ?
                                this.state.isDelmode ?
                                <TouchableOpacity 
                                    onPress={()=> this.setState({isDelmode:false})}
                                    style={{flex:1,alignItems:'flex-end',justifyContent:'center',paddingVertical:15}}
                                >
                                    <CustomTextR
                                        style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}
                                    >취소</CustomTextR>
                                </TouchableOpacity> 
                                :
                                <TouchableOpacity 
                                    onPress={()=> this.setState({isDelmode:true})}
                                    style={{flex:1,alignItems:'flex-end',justifyContent:'center',paddingVertical:15}}
                                >
                                    <CustomTextR
                                        style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}
                                    >삭제</CustomTextR>
                                </TouchableOpacity>
                                :
                                null
                            }
                            
                        </View>
                        <View>
                        <View style={{flex:1,width:SCREEN_WIDTH,backgroundColor:'transparent',height :  this.state.myInterestItem.length === 0 ? parseInt(this.state.oneHeight) : this.state.myInterestItem.length*parseInt(this.state.oneHeight)}}>
                        
                            {
                                this.state.myInterestItem.length === 0 ?
                                <View style={{alignItems:'center',justifyContent:'center',paddingVertical:20}} onLayout={(e)=>this.onLayoutHeader(e)} ref="TargetElement">
                                    <CustomTextR
                                        style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}
                                    >선택하신 관심분야가 없습니다</CustomTextR>
                                </View>
                                :
                                this.state.isDelmode  ?
                                    this.state.myInterestItem.map((item2,index2) => {
                                        return (
                                            
                                            <View 
                                                style={{flex:1,paddingVertical:5,marginHorizontal:10,borderRadius:10,backgroundColor:DEFAULT_COLOR.input_bg_color}} 
                                                key={index2}
                                            >
                                                <View style={{paddingVertical:15,alignItems:'center',justifyContent:'center'}}>
                                                    <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>
                                                        {item2.name}
                                                    </CustomTextR>
                                                    <TouchableOpacity 
                                                        onPress={()=> this.removeMyInterest(item2)}
                                                        style={{position:'absolute',right:13,top:10,width:25,height:25}}
                                                    >
                                                        <Image source={require('../../../assets/icons/btn_list_del.png')} style={{width:25,height:25}} />
                                                    </TouchableOpacity>
                                                </View>                                        
                                            </View>
                                        )
                                    })
                                :
                                          
                                <SortableListView
                                    style={{ flex: 1 }}
                                    data={this.state.myInterestItem}
                                    //order={this.state.myInterestItem}
                                    order={orders}
                                    activeOpacity={1} //활성 요소의 불투명도를 설정합니다. 기본 값 : 0.2.
                                    onMoveStart={() => {
                                        console.log('onMoveStart',this.state.scrollEnabled);
                                        this.setState({scrollEnabled: false});                                       
                                        }
                                    }
                                    onRowActive={(e) => {                                        
                                        console.log('onRowActive',this.state.scrollEnabled);
                                    }}
                                    onMoveEnd={() => {
                                        this.onSelectedDrag(false);
                                        console.log('onMoveEnd',this.state.scrollEnabled);
                                    }
                                    }
                                    //moveOnPressIn={true}
                                    limitScrolling={true}
                                    // disableSorting={false} true로 설정하면 모든 정렬이 비활성화되어 SortableListView가 일반 ListView처럼 효과적으로 작동
                                    //disableAnimatedScrolling={true} true로 설정하면 스크롤이 더 이상 애니메이션되지 않습니
                                    onRowMoved={e => {                                
                                        try {
                                            this.state.myInterestItem.splice(e.to, 0, this.state.myInterestItem.splice(e.from, 1)[0])                                            
                                            this.forceUpdate()
                                        }catch(e) {
                                        }
                                    }}
                                    renderRow={row => <RowComponent data={row} />}
                                />
                               
                                }
                            
                                
                            </View>       
                        </View>
                        
                        <View style={ styles.bodyContainer }>
                            <View style={{flex:5,justifyContent:'center',paddingVertical:15}}>
                                <CustomTextB
                                    style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}
                                >관심 분야 추가</CustomTextB>
                            </View>
                            
                        </View>
                        {/*
                        <View style={{height:10,backgroundColor:DEFAULT_COLOR.input_bg_color,borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1,}} />
                        */}

                        {
                        this.state.FaItem.length > 0
                        ?
                        <View style={ {backgroundColor : "#fff"}}>
                            { 
                            this.state.FaItem.map((item,index) => {
                                let checkArray = item.interests.filter(info => info.checked === true);
                                return (

                                    <DropDown
                                        //style={{padding:10}}
                                        key={index}
                                        contentVisible={false}
                                        checkCount={2}
                                        totalCount={2}
                                        childHeight={item.height}
                                        header={
                                        <View style={{flexDirection:'row'}} >
                                            <View style={{flex:3,paddingVertical:20,paddingLeft:20}}>
                                                <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>{item.category.interestCategoryName}</CustomTextR>
                                            </View>
                                            <View style={{flex:1,paddingVertical:20,flexDirection:'row',alignItems:'flex-end',justifyContent:'center'}}>
                                                <TextRobotoR style={styles.commonDigitText01}>{checkArray.length}</TextRobotoR>
                                                <TextRobotoR style={styles.commonDigitText02}>{" / "}</TextRobotoR>
                                                <TextRobotoR style={styles.commonDigitText02}>{item.interests.length}</TextRobotoR>
                                            </View>
                                            <View
                                                style={{position:'absolute',bottom:0,left:20,width:SCREEN_WIDTH-40,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color}} 
                                            />
                                            
                                        </View>
                                        }
                                    >
                                        <View style={{flex:1,width:SCREEN_WIDTH}} onLayout={(e)=>this.onLayout(e,index)}>
                                            {
                                                item.interests.map((item2,index2) => {
                                                    let isIndexOf = this.state.myInterestItem.findIndex(
                                                        info => info.code === item2.interestFieldID
                                                    );  
                                                    let isChecked = ( isIndexOf != -1 || item2.checked )  ?  true : false ;
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
                                                                <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>
                                                                    {item2.interestFieldName}
                                                                </CustomTextR>
                                                            </View>  
                                                            <View
                                                                style={{position:'absolute',bottom:0,left:20,width:SCREEN_WIDTH-40,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color}} 
                                                            />                                      
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </View>                                
                                    </DropDown>

                            )})}
                            
                        </View>
                        :
                        <View style={{paddingTop:30,justifyContent:'center',alignItems:'center'}}>
                            <Text style={styles.commonDigitText02}>{this.state.nowResult}</Text>
                        </View>
                            
                        }
                        <View style={{flex:1,height:100}} />
                    </ScrollView>
                </SafeAreaView>
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
        borderBottomColor:DEFAULT_COLOR.base_color_222,
        borderBottomWidth:1,        
        marginHorizontal:20
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
    commonText04:{
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),color:DEFAULT_COLOR.lecture_base
    },
    commonDigitText01:{
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),color:DEFAULT_COLOR.lecture_base
    },
    commonDigitText02:{
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),color:DEFAULT_COLOR.base_color_666
    },
    commonBoxItemWrap : {
        flexDirection:'row',flexGrow:1,backgroundColor:DEFAULT_COLOR.input_bg_color
    }

});

function mapStateToProps(state) {
    return {       
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
        myInterestCodeMulti: state.GlabalStatus.myInterestCodeMulti,   
    };
}


function mapDispatchToProps(dispatch) {
    return {
        _updateMyInterestMultiCode:(str) => {
            dispatch(ActionCreator.updateMyInterestMultiCode(str));
        },
        
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SetupMyInterest);