import {StyleSheet, Dimensions,PixelRatio, Platform} from 'react-native';

const {width: SCREEN_WIDTH,height : SCREEN_HEIGHT} = Dimensions.get("window");
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

const styles = StyleSheet.create({

    container: {      
        flex:1
    },
    filterWrapper : {
        flex :1,        
        padding : 10,        
        alignItems:'center',
        justifyContent:'center',
        borderBottomColor : '#ebebeb',
        borderBottomWidth:1
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
        flexDirection:'row'
    },
    filterWakuWrapperLeft : {
        flex:5,paddingTop:5,paddingHorizontal:10,justifyContent:'center'
    },
    filterWakuWrapperLeftText  :{
        color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing: PixelRatio.roundToNearestPixel(-0.65),
    },
    filterWakuWrapperLeftText2  :{
        color:DEFAULT_COLOR.base_color_444,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing: PixelRatio.roundToNearestPixel(-0.7),
    },
    filterWakuWrapperRight : {
        flex:1,alignItems:'center',justifyContent:'center'
    },

    /**** Modal  *******/    
    modalContainer: {
        paddingTop: 16, backgroundColor: '#fff', borderTopLeftRadius: 15, borderTopRightRadius: 15
    },

    testScheduleWrapper : {
        flex :1,        
        marginTop:5,
        paddingTop:15,
        paddingHorizontal : 5,
        alignItems:'center',
        justifyContent:'center',
        //borderTopColor :'#ebebeb',
        //borderTopWidth : 1
    },
    bodyWrapper: {  
        maxWidth:SCREEN_WIDTH-20,       
        margin : 10,
        paddingTop:5
    },
    commonWrap : {
        flex:1,
        borderRadius : 20,
        marginBottom : 10,
        backgroundColor : DEFAULT_COLOR.input_bg_color,
        borderWidth:1,
        borderColor : DEFAULT_COLOR.input_border_color,
        overflow : 'hidden',
        

    },
    imgrow: {
        flex: 1,
        alignItems:'flex-end',
        justifyContent:'flex-end',
        opacity : 0.7
    },
    textrow : {
        flex:1,
        width : SCREEN_WIDTH*0.65,
        minHeight:100,
        marginHorizontal:15,
        marginVertical: 25,
        zIndex:2,
        
    },
    textinrow : {            
        maxWidth:SCREEN_WIDTH-40, 
    },
    commonIconWrap : {
        paddingVertical:2,paddingHorizontal:5, borderRadius:10,borderWidth:1,marginRight:10,justifyContent:'center'
    },
    commonIconText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12)
    },
    LectureTitieWrapper : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)
    },
    LectureSubInfoText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),padding:5,marginRight:5,color:DEFAULT_COLOR.base_color_888
    },
    LectureSubInfoTextBold : { 
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),padding:5,marginRight:10,color:DEFAULT_COLOR.base_color_222
    }

})

export default styles;