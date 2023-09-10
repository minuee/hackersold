import React, { Component } from 'react';
import {PixelRatio, Dimensions, Text, TouchableOpacity, View,StyleSheet,ScrollView} from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import Sound from 'react-native-sound';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/Entypo';
Icon2.loadFont();
import Icon3 from 'react-native-vector-icons/MaterialIcons';
Icon3.loadFont();

import  TextTicker from '../../Utils/TextTicker';

//공통상수
//import COMMON_STATES from '../../Constants/Common';

import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import {CustomTextR, CustomTextM, TextRobotoM,TextRobotoR} from '../../Style/CustomText';


const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const AudioStatePlay = "play";
const AudioStatePause = "pause";
const AudioStateStop = "stop";
const secsDelta = 10;//10초앞으로

function getAudioTimeString(seconds){
    const h = parseInt(seconds/(60*60));
    const m = parseInt(seconds%(60*60)/60);
    const s = parseInt(seconds%60);

    return ((h<10?'0'+h:h) + ':' + (m<10?'0'+m:m) + ':' + (s<10?'0'+s:s));
}

export default class LectureList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookInfo : {
                title : "",
                price : 0,
                discount : 0
            },
            lecturelist : this.props.screenState.baseBookInfo.commonInfo.classList
            
        }
    }

    UNSAFE_componentWillMount() {        
      
    }  


    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보 
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        
    }

    componentWillUnmount(){
        
    }



    render() {

        return(
            <View style={ styles.container }>                
                <View style={{paddingBottom:10,alignItems:'center',justifyContent:'center',borderBottomColor:'#ccc',borderBottomWidth:1}}>
                    <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.9}}>
                        이 교재로 진행되는 동영상 강의
                    </CustomTextR>
                    <TouchableOpacity 
                        onPress= {()=> {                            
                            this.props.screenState._closeModal();
                            }
                        }
                        style={{position:'absolute',top:0,right:15,width:25,height:25}}>
                        <Icon name="close" size={25} color={DEFAULT_COLOR.base_color_666} />
                    </TouchableOpacity>
                </View>
                <View
                    style={{height:40,backgroundColor:DEFAULT_COLOR.lecture_base,justifyContent:'center',paddingTop:10,paddingHorizontal:20}}
                >
                    <TextTicker 
                        //marqueeOnMount={false} 
                        ref={c => this.marqueeRef = c}
                        style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),fontFamily:'NotoSansKR-Regular',letterSpacing:-0.84}}                                    
                        shouldAnimateTreshold={10}
                        duration={5000}
                        loop
                        bounce
                        repeatSpacer={50}
                        marqueeDelay={1000}
                    >
                        {this.props.screenState.baseBookInfo.title}
                    </TextTicker>
                </View>
                <ScrollView style={{flex:1,backgroundColor:'#fff'}}>
                    <View style={{flex:1,paddingVertical:10,paddingHorizontal:20,backgroundColor:'#fff'}}>
                        {this.state.lecturelist.map((data,index) => {
                            return (                                    
                                <View style={{flex:1,marginBottom:10,paddingBottom:10,borderBottomColor:'#ebebeb',borderBottomWidth:1}} key={index}>
                                    <View style={{flex:1,paddingBottom:10}}>
                                        <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.65}}>
                                            {data.title}
                                        </CustomTextR>
                                    </View>
                                    <View style={{flex:1,flexDirection:'row',flexGrow:1}}>
                                        <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:DEFAULT_COLOR.base_color_888,letterSpacing:-0.65}}>{data.teacherName}</CustomTextR>
                                        <CustomTextM style={{paddingHorizontal:10,color:'#e8e8e8',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12)}}>|</CustomTextM>
                                        <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:DEFAULT_COLOR.base_color_888,letterSpacing:-0.65}}>{data.lectureCnt}강</CustomTextR>
                                    </View>
                                </View>
                            );
                        })}                      
                    </View>
                    
                </ScrollView>
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
        marginTop:SCREEN_HEIGHT*0.3,
        paddingTop: 16, 
        backgroundColor: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8
    },
    sampletitle: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop: 30,
        padding: 20,
        textAlign: 'center',
        backgroundColor: 'rgba(240,240,240,1)',
    },
    samplebutton: {
        fontSize: 20,
        backgroundColor: 'rgba(220,220,220,1)',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(80,80,80,0.5)',
        overflow: 'hidden',
        padding: 7,
    },
    sampleheader: {
        textAlign: 'left',
    },
    samplefeature: {
        flexDirection: 'row',
        padding: 10,
        alignSelf: 'stretch',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgb(180,180,180)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(230,230,230)',
    },
    samplefeature2: {
        flexDirection: 'row',    
        //padding:10,
        alignSelf: 'stretch',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgb(180,180,180)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(230,230,230)',
    },
});

