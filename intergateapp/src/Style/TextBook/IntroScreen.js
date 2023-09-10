import {StyleSheet, Dimensions,PixelRatio} from 'react-native';

const {width: SCREEN_WIDTH,height : SCREEN_HEIGHT} = Dimensions.get("window");
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

const styles = StyleSheet.create({
   
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        alignItems: 'center',
        //backgroundColor: '#ffffff',
    },
    searchWrapper : {
        flexDirection:'row',
        width:SCREEN_WIDTH,                
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    listWrapper : {
        flex:1,
        //marginHorizontal:5,
        paddingTop:30
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    commoneWrap : {
        //flex:1, 
        //width:SCREEN_WIDTH,
        //alignItems:'flex-end'
        paddingVertical:10,
        paddingLeft:40,
        paddingRight:10,
        marginBottom:20        
    },

    /* 여기서부터 grid type */
    gridWrapper : {        
           
    },
    /* 여기서부터 list type */
    bgWrapper: {
        borderRadius:10,
        backgroundColor : '#f5f7f8',
        borderWidth:1,
        borderColor:'#e8e8e8',
        minHeight:150,        
        paddingHorizontal:10,
    },
    informationWrapper : {
        flex:1,
        paddingVertical:10,
        paddingLeft:90
    },
    bookimagewrap : {
        position:'absolute',
        top:-20,
        left:-30,
        width:110,
        height:150,
        ...Platform.select({
            ios: {
              shadowColor: "rgb(50, 50, 50)",
              shadowOpacity: 0.5,
              shadowRadius: 5,
              shadowOffset: {
                height: 0,
                width: 5
             }
           },
            android: {
              elevation: 15,
              backgroundColor : '#f7f7f7'
           }
         })
    },
    bookimage:{
        width:'100%',
        height:'100%'
    },
    btnGoTopWrap : {
        position:'absolute',bottom:50,right:20,width:50,height:50,paddingTop:5,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:25,opacity:0.5
    },
    btnGoTopWrap2 : {
        position:'absolute',bottom:50,right:20,width:50,height:50,paddingTop:5,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:25
    },
    bookTitleText : {        
        color:DEFAULT_COLOR.base_color_222,fontWeight:'bold',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small*1.5)
    },
    bookTitleSubText : {
        paddingTop:5,color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14)
    },
    bookOptionWrapper : {
        flex:1,justifyContent:'flex-end',flexDirection:'row'
    },
    bookOption1Wrap : {
        flex:1.4,justifyContent:'center',flexDirection:'row'
    },
    bookOption2Wrap : {
        flex:1,justifyContent:'center',flexDirection:'row'
    },
    bookOption3Wrap : {
        flex:1,justifyContent:'center',flexDirection:'row'
    },
    bookOptionText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12),letterSpacing:-1.5,color:DEFAULT_COLOR.base_color_666
    },


    /* modal search filter */
    filterWrapper : {
        flex :1, 
        flexDirection:'row',       
        paddingHorizontal : 10,
        alignItems:'center',
        justifyContent:'center',
        borderBottomColor : '#ebebeb',
        borderBottomWidth:1,
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
        color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14)
    },
    filterWakuWrapperLeftText2  :{
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12)
    },
    filterWakuWrapperRight : {
        flex:1,alignItems:'center',justifyContent:'center'
    },

    linearGradient: {
        position:'absolute',
        left:0,
        bottom:0,
        right:0,
        top:0,
        //height: '100%',
        //width: '100%',
        opacity:0.6
    },

   /**** Modal  *******/
   modalContainer: {
    paddingTop: 16, backgroundColor: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8
    },

})

export default styles;