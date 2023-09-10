import {StyleSheet, Dimensions,PixelRatio} from 'react-native';

const {width: SCREEN_WIDTH,height : SCREEN_HEIGHT} = Dimensions.get("window");
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

const styles = StyleSheet.create({
   
    Rootcontainer: {
        flex: 1,
        position:'absolute',
        top:0,
        left:0,
        width:SCREEN_WIDTH,
        height:SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 0,
        elevation:0,
        zIndex:1000

                
    },
    container : {
        flex: 1,
        justifyContent: "center",
    },
    animatedHeaderContainer : {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,        
        borderBottomColor:DEFAULT_COLOR.input_border_color,
        borderBottomWidth:1
    },
    HeaderWrapper : {
        flexDirection : 'row',height:40,justifyContent:'center',backgroundColor:'transparent'
    },
    LogoWrapper : {
        flex:2,alignItems:'flex-start',justifyContent:'center',paddingLeft:15
    },
    iconsWrapper : {
        flex:1,justifyContent:'center',paddingTop:5
    },
    iconsWrapperIn : {
        flexDirection:'row',justifyContent:'center',paddingBottom:5
    },
    noticeWrapper : {
        position:'absolute', right:10,top:-5,width:12,height:12,borderRadius:6,backgroundColor:'#FDC634',zIndex:3,alignItems:'center',justifyContent:'center'
    },
    noticeNumberText : {
        fontSize:PixelRatio.roundToNearestPixel(9)
    },
    iconWrapper : {
        flex:1,justifyContent:'center'
    },
    iconsSize30 : {
        height: 30,width:30
    },
    iconsSize25 : {
        height: 25,width:25
    },

    /*** NOTICE ***/
    networkText : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_large),alignItems:'center',justifyContent:'center'
    },
    networkSubText :{
        color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },
    headerText: {
        color: 'white',
        fontSize: 22
    },

    /**** Modal  *******/
    modalContainer: {paddingTop: 16, backgroundColor: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8},
    
})

export default styles;