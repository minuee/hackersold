import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,PixelRatio,StatusBar} from 'react-native';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Style/CustomText';



export default  class NoticeDetailScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            detailInfo : this.props.navigation.state.params
        }
    }

    render() {
        return(
            <View style={ styles.container }>
                { 
                    Platform.OS === 'android' && <StatusBar barStyle={"dark-content"} backgroundColor={DEFAULT_COLOR.lecture_base} animated={true} hidden={false}/>
                }
                <View style={{paddingTop:20,paddingHorizontal:20}}>
                    <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color: DEFAULT_COLOR.lecture_base,letterSpacing:-0.6}}>{this.state.detailInfo.titem.keyword}</CustomTextR>
                </View>
                <View style={{padding:20}}>
                    <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),lineHeight:PixelRatio.roundToNearestPixel(25),color: DEFAULT_COLOR.lecture_base,letterSpacing:-0.9}}>{this.state.detailInfo.titem.title}</CustomTextM>
                </View>
                <View style={{paddingHorizontal:20,paddingBottom:10,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color}}>
                    <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color: DEFAULT_COLOR.base_color_666,letterSpacing:-0.6}}>{this.state.detailInfo.titem.regDatetime}</CustomTextR>
                </View>
                <View style={{paddingTop:20,paddingHorizontal:20}}>
                    <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),lineHeight:PixelRatio.roundToNearestPixel(25),color: DEFAULT_COLOR.base_color_666,letterSpacing:-0.7}}>{this.state.detailInfo.titem.content}</CustomTextR>
                </View>
            </View>
        );
    }
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    themeText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium),color:DEFAULT_COLOR.lecture_base
    },
    titleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium),color:DEFAULT_COLOR.base_color_222
    },
    dateText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12),color:DEFAULT_COLOR.base_color_ccc
    },
    descriptionText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),color:DEFAULT_COLOR.base_color_666
    },
});