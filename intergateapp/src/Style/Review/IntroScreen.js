import {StyleSheet, Dimensions,PixelRatio, Platform} from 'react-native';

const {width: SCREEN_WIDTH,height : SCREEN_HEIGHT} = Dimensions.get("window");
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

const styles = StyleSheet.create({
  
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        width:SCREEN_WIDTH
    },
    fixedUpButton : {
        position:'absolute',bottom:20,right:20,width:50,height:50,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',zIndex:1,borderColor:'#ccc',borderWidth:1,borderRadius:25,opacity:0.5
    },

    fixedWriteButton : {
        position:'absolute',bottom:70,right:10,width:60,height:60,alignItems:'center',justifyContent:'center',zIndex:2,borderRadius:30,opacity:0.8
    },
    fixedWriteButton2 : {
        position:'absolute',bottom:70,right:20,width:60,height:60,backgroundColor:'#222',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:30,
    },
 
    bottomModal : {
        justifyContent: 'flex-end',
        margin: 0,
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : DEFAULT_COLOR.base_color_fff,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    contentDataHeader : {
        paddingVertical:Platform.OS === 'ios' ? 15 : 10 ,flexDirection:'row'
    },
    contentDataHeaderLeftRight : {
        flex:1,alignItems:'center'
    },
    contentDataHeaderLeftRightButton : {
        flex:1,flexDirection:'row',alignItems:'center'
    },
    contentDataHeaderCenter : {
        flex:0.1,alignItems:'center'
    },
    contentDataHeaderCenterText : {
        color:DEFAULT_COLOR.base_color_ccc
    },
    contentReviewSelectText : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)
    },
    contentReviewunSelectText : {
        color:DEFAULT_COLOR.base_color_ccc,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)
    },


    contentDataBody : {
        marginVertical:20,padding:10,marginBottom:50
    },

    itemBannerContainer: {
        width:190,
        minHeight: 100,
        marginHorizontal : 0
    },
    imgBannerBackground: {
        height: '100%',transform: [{ scale: 1 }]
    },

    /**** Modal  *******/
    modalContainer: {paddingTop: 16, backgroundColor: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8},

    filterWrapper : {
        flex :1,        
        paddingTop : 10,
        alignItems:'center',
        justifyContent:'center',
        //backgroundColor : '#ebebeb'
    },
    filterWrapperPadding : {
        flex:0.2
    },
    filterWrapperLeft : {
        flex:1,paddingVertical:5,overflow:'hidden'
    },
    filterWrapperCenter : {
        flex:1,paddingVertical:5,overflow:'hidden'
    },
    filterWrapperRight : {
        flex:1,paddingVertical:5,overflow:'hidden'
    },
    filterWakuWrapper : {
        flexDirection:'row',
        paddingHorizontal : 10,
        alignItems:'center',
        justifyContent:'center',
    },
    filterWakuWrapperLeft : {
        flex:5,paddingHorizontal:10,justifyContent:'center'
    },
    filterWakuWrapperLeftText  :{
        color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14)

    },
    filterWakuWrapperRight : {
        flex:1,alignItems:'center',justifyContent:'center'
    },

})

export default styles;