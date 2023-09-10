import React, { Component } from 'react';
import {View,StyleSheet,Text,Animated,Dimensions,PixelRatio,BackHandler,StatusBar,TouchableOpacity,Image} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import MySettleList from './MySettleList'
import BankBookList from './BankBookList'

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextB, CustomTextL,CustomTextM,TextRobotoM,TextRobotoR} from '../../Style/CustomText';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

class MySettleScreen extends Component {
    constructor(props) {
        super(props);
        //console.log('props', this.props)
        this.state = {
            loading : true,
            selectedSample : 1,           
            myFavoriteItem : []
        }
        
    }
    
    animatedHeight2 = new Animated.Value(SCREEN_HEIGHT * 0.5);

    async UNSAFE_componentWillMount() {    
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);       
        let myClassBrother = await AsyncStorage.getItem('myClassBrother')     
        if( myClassBrother !== null ) {
            this.setState({myFavoriteItem: JSON.parse(myClassBrother)})
        }
    }  

    componentDidMount() {     
        this.props.navigation.setParams({ onPressOpenModal: this._onPressOpenModal });        
                  
    }

    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보        
        
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
     
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
    }

    
    _onPressOpenModal = () => {
        console.log("function called");
        this.setState({showModal:true})
    }

    handleBackButton = () => {
        this.props.navigation.goBack(null);
        this.props.navigation.toggleDrawer();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
        return true;
    };

    _closeModal = async() => {
        this.setState({ showModal : false })
        
    };
    
    selectSampleKeyword = async(bool) => {        
        this.setState({
            selectedSample:bool
        });        
    }

    
    render() {


        return(
            <View style={ styles.container }>
                { Platform.OS == 'android' && <StatusBar backgroundColor={DEFAULT_COLOR.lecture_base} translucent={false}  barStyle="dark-content" />}
                

                {/** 인포메이션 모달 **/}
                <Modal
                    onBackdropPress={this._closeModal}
                    animationType="slide"
                    //transparent={true}
                    onRequestClose={() => {
                        this.setState({showModal:false})
                    }}
                    onBackdropPress={() => {
                        //this.setState({showModal:false})
                    }}
                    style={{justifyContent: 'flex-end',margin: 0}}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating                    
                    isVisible={this.state.showModal}
                >
                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                        <View style={styles.modalContainer2}>
                            <View style={{flexDirection:'row',paddingHorizontal:10,backgroundColor:DEFAULT_COLOR.input_bg_color,borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
                                <View style={{flex:10,flexDirection:'row',flexGrow:1,paddingLeft:15,paddingVertical:15}}>
                                    <View style={{paddingTop:2}}>
                                    <Image source={require('../../../assets/icons/btn_info_line.png')} style={{width:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20)}} />                                        
                                    </View>                                    
                                    <CustomTextR style={{paddingLeft:5,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),lineHeight:PixelRatio.roundToNearestPixel(1),color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.85}}>적용관심분야</CustomTextR>                                      
                                </View>
                                <View style={{flex:1,alignItems:'flex-end',justifyContent:'center',paddingHorizontal:5}}>
                                    <TouchableOpacity onPress={()=>this.setState({showModal:false})}>
                                        <Image source={require('../../../assets/icons/btn_feed_del.png')} style={{width:20,height:20}} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{flex:3,paddingHorizontal:20,paddingVertical:15,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color,flexDirection:'row',flexGrow:1,flexWrap:'wrap'}}>
                                {
                                    this.state.myFavoriteItem.map((fitem,findex) => {
                                        return (
                                            <View style={{paddingHorizontal:5}} key={findex}>
                                                <CustomTextM style={styles.termText3}>
                                                    {fitem.brotherName}{this.state.myFavoriteItem.length === parseInt(findex+1) ? ' ':','}
                                                </CustomTextM>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                            <View style={{paddingHorizontal:20,paddingVertical:15}}>
                                <CustomTextR style={styles.termText4}>다른 관심분야에 대한 확인이 필요하실 경우,</CustomTextR>
                                <View style={{flexDirection:'row',flexGrow:1}}>
                                    <CustomTextB style={styles.termText42}>메인 {'>'} 관심분야 설정</CustomTextB>
                                    <CustomTextR style={styles.termText4}>에서</CustomTextR>
                                </View>                                
                                <CustomTextR style={styles.termText4}>관심분야를 변경하신 후 확인 부탁드립니다.</CustomTextR>
                            </View>
                        
                        </View>
                    </View>
                    
                    
                </Modal>
                
                <View style={{height:50,marginTop:10}}>
                    <View 
                        style={{position:'absolute',left:0,bottom:0,width:SCREEN_WIDTH,height:2,backgroundColor:DEFAULT_COLOR.input_border_color}}
                    />
                    <View style={{flex:1,flexDirection:'row',marginHorizontal:20}}>
                        <TouchableOpacity 
                            onPress={()=>this.selectSampleKeyword(true)}
                            style={this.state.selectedSample ? styles.sampleWrapperOn: styles.sampleWrapper}                                
                        >
                            { this.state.selectedSample ?
                            <CustomTextB style={styles.smapleTextOn} >결제 ∙ 배송내역</CustomTextB>
                            :
                            <CustomTextR style={styles.smapleText} >결제 ∙ 배송내역</CustomTextR>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={()=>this.selectSampleKeyword(false)}
                            style={!this.state.selectedSample ? styles.sampleWrapperOn: styles.sampleWrapper}
                        >
                            { !this.state.selectedSample ?
                            <CustomTextB style={styles.smapleTextOn} >무통장입금신청내역</CustomTextB>
                            :
                            <CustomTextR style={styles.smapleText} >무통장입금신청내역</CustomTextR>
                            }
                            
                        </TouchableOpacity>
                    </View>
                </View>

                { this.state.selectedSample 
                ?
                <MySettleList screenState={this.state} screenProps={this.props} />
                :
                <BankBookList screenState={this.state} screenProps={this.props} />
                }
                
            </View>
        );
    }
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    /**** Modal  *******/    
    modalContainer: {
     
    },    
    modalContainer2: {                
        backgroundColor: '#fff',
        height:SCREEN_HEIGHT*0.5,
        width:SCREEN_WIDTH*0.9,
        borderRadius:15
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sampleWrapper : {
        flex:1,paddingVertical:10,alignItems:'center',justifyContent:'center'
    },
    sampleWrapperOn :{
        flex:1,borderBottomColor:DEFAULT_COLOR.lecture_base,borderBottomWidth:2,paddingVertical:10,alignItems:'center',justifyContent:'center'
    },
    smapleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.96
    },
    smapleTextOn : {fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:DEFAULT_COLOR.lecture_base,letterSpacing:-0.96},

    termWrapper : {
        marginVertical:10,marginHorizontal:5,paddingVertical:10,paddingHorizontal:15,borderColor:DEFAULT_COLOR.input_border_color,borderWidth:1,backgroundColor:'#fff',borderRadius:20,alignItems:'center'
    },
    termWrapperOn : {
        marginVertical:10,marginHorizontal:5,paddingVertical:10,paddingHorizontal:15,borderColor:DEFAULT_COLOR.lecture_base,borderWidth:1,backgroundColor:'#fff',borderRadius:20,alignItems:'center'
    },
    termText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },
    termTextOn : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),color:DEFAULT_COLOR.lecture_base
    },
    termText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),paddingHorizontal:5,color:DEFAULT_COLOR.base_color_666
    },
    termText3 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.7
    },
    termText4 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),paddingHorizontal:5,color:DEFAULT_COLOR.base_color_666,letterSpacing:-0.6
    },
    termText42 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),paddingHorizontal:5,color:DEFAULT_COLOR.lecture_base,letterSpacing:-0.6
    },

    itemWrap : {                
        marginHorizontal:10,        
        borderBottomWidth:1,
        borderBottomColor:'#ccc',
        marginVertical:10,        
        paddingVertical:10
    },

    fixedWriteButton : {
        position:'absolute',bottom:70,right:20,width:50,height:50,backgroundColor:'#222',alignItems:'center',justifyContent:'center',zIndex:2,borderColor:'#ccc',borderWidth:1,borderRadius:25,opacity:0.8
    },
    fixedWriteButton2 : {
        position:'absolute',bottom:70,right:20,width:50,height:50,backgroundColor:'#222',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:25,
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

    
});


function mapStateToProps(state) {
    return {
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
        userToken: state.GlabalStatus.userToken,   
    };
}



export default connect(mapStateToProps, null)(MySettleScreen);
