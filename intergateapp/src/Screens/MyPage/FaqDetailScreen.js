import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    Text,
    Dimensions,
    PixelRatio,
    BackHandler,
    StatusBar
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
//공통상수
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Style/CustomText';


import  * as SpamWords   from '../../Constants/FilterWords';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export default  class FaqDetailScreen extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            detailInfo : this.props.navigation.state.params
        }
        
    }

    componentDidMount() {        
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);          
 
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
    } 

    handleBackButton = () => {
        this.props.navigation.goBack(null);        
        return true;
    };

    render() {
        return(
            <View style={ styles.container }>
                {                     
                    Platform.OS === 'android' && <StatusBar barStyle={"dark-content"} backgroundColor={DEFAULT_COLOR.lecture_base} animated={true} hidden={false}/>
                }
                <NavigationEvents
                    onWillFocus={payload => {
                        //console.log('onWillFocus')
                        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);          
                    }}
                    onWillBlur={payload => {
                        //console.log('onWillBlur')
                        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
                    }}
                />
                <View style={{paddingTop:20,paddingHorizontal:20}}>
                    <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color: DEFAULT_COLOR.lecture_base,letterSpacing:-0.6}}>{this.state.detailInfo.titem.keyword}</CustomTextR>
                </View>
                
                <View style={{padding:20,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color}}>
                    <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),lineHeight:PixelRatio.roundToNearestPixel(25),color: DEFAULT_COLOR.lecture_base,letterSpacing:-0.9}}>{this.state.detailInfo.titem.title}</CustomTextM>
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
    descriptionText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),color:DEFAULT_COLOR.base_color_666
    },
});