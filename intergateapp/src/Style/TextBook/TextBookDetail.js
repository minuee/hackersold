import {StyleSheet, Dimensions,PixelRatio} from 'react-native';

const {width: SCREEN_WIDTH,height : SCREEN_HEIGHT} = Dimensions.get("window");
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    /** tabs  *****/
    tabStyle : {  
        flex: 1,      
        padding:0,
        margin:0 ,
        alignItems: 'center',
        justifyContent : 'center',
        backgroundColor:'#fff'
    },
    tabBarTextStyle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    
    contentDataWrapper : {
        width:SCREEN_WIDTH,height:'100%',backgroundColor: '#fff'
    },
    contentDataHeader : {
        paddingVertical:10,flexDirection:'row',borderWidth:1,borderColor:DEFAULT_COLOR.base_color_ccc,marginTop:40,marginHorizontal:30,borderRadius:5
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
        color:DEFAULT_COLOR.base_color_222,fontWeight:'bold'
    },

    contentDataBody : {
        marginVertical:20,padding:10,marginBottom:50
    },

    contentDataBody2 : {
        marginTop:20,flexDirection:'row'
    },

    sampleWrapper : {
        marginHorizontal:0,paddingVertical:10,paddingHorizontal:10,backgroundColor:'transparent',zIndex:5
    },
    sampleWrapperOn : {
        marginHorizontal:0,paddingVertical:10,paddingHorizontal:10,borderBottomColor:DEFAULT_COLOR.lecture_base,borderBottomWidth:2,zIndex:5
    },
    sampleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),letterSpacing:-1.5
    },
    sampleTextOn : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:DEFAULT_COLOR.lecture_base,letterSpacing:-1.5
    },


    /**** bottom  ******/
    contentContainer: {
        flex : 0.6,
        alignItems: 'center',        
        //backgroundColor : 'transparent',
        bottom:0
    },
    fixedTop : {
        width: '100%',
        height : 50,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center', 
        backgroundColor : '#000'
    },
    NewAnswerWrap: {    
        
        backgroundColor:'#000'
        
    }, 
    AnswerWrap: {    
        flex : 1,
        flexDirection : 'row',
        paddingLeft : 30,
        paddingRight : 10,
        paddingVertical : 10,
       
    },

    bottomBuyTextWrapper : {
        width: '100%',height : SCREEN_HEIGHT*0.15,alignItems: 'center',justifyContent: 'center',textAlign: 'center'
    },
    bottomBuyTextWrapperOn : {
        width: '100%',height : 20,alignItems: 'center',justifyContent: 'center',textAlign: 'center'
    },
    bottomBuyTextIconWraper : {
        width: '100%',height : 20,alignItems: 'center',justifyContent: 'center',textAlign: 'center',zIndex:2
    },
    bottomBuyTextIcon : {
        width:50,height:20,backgroundColor:'#fff',borderTopLeftRadius:10,borderTopRightRadius:10,alignItems:'center',justifyContent:'center',borderColor:'#ccc',borderWidth:1,paddingTop:5,borderBottomColor:'#fff',borderBottomWidth:1
    },
    bottomBuyTextBodyWrapperBlk : {
        width: '100%',height:SCREEN_HEIGHT*0.15-20,justifyContent: 'center',alignItems: 'center', backgroundColor : DEFAULT_COLOR.base_color_222,
        /*
        shadowColor: "#000",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 6.27,
        elevation: 5,
        */
       ...Platform.select({
        ios: {
          shadowColor: "#222",
          shadowOpacity: 0.5,
          shadowRadius: 6.27,
          shadowOffset: {
            height: 5,
            width: 5
         }
       },
        android: {
          elevation: 15,
          backgroundColor : '#fff'
       }
     })
    },
    bottomBuyTextBodyWrapper : {
        width: '100%',height:SCREEN_HEIGHT*0.15-20,justifyContent: 'center',alignItems: 'center', backgroundColor : '#fff',
        /*
        shadowColor: "#000",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 6.27,
        elevation: 5,
        */
       ...Platform.select({
        ios: {
          shadowColor: "#222",
          shadowOpacity: 0.5,
          shadowRadius: 6.27,
          shadowOffset: {
            height: 5,
            width: 5
         }
       },
        android: {
          elevation: 15,
          backgroundColor : '#fff'
       }
     })
    },
    bottomBuyTextBodyWrapperOn : {
        width: '100%',height:20,justifyContent: 'center',alignItems: 'center', backgroundColor : '#fff',
        /*
        shadowColor: "#000",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 6.27,
        elevation: 5,
        */
       ...Platform.select({
        ios: {
          shadowColor: "#222",
          shadowOpacity: 0.5,
          shadowRadius: 6.27,
          shadowOffset: {
            height: 5,
            width: 5
         }
       },
        android: {
          elevation: 15,
          backgroundColor : '#fff'
       }
     })
    },
    bottomBuyTextBody :  {
        flex:1,flexDirection:'row',paddingTop:5
    },
    bottomBuyTextBodyLeft : {
        flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#303030'
    },
    bottomBuyTextBodyLeftText : {
        color:'#fff',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },
    bottomBuyTextBodyRight : {
        flex:1,alignItems:'center',justifyContent:'center',backgroundColor:DEFAULT_COLOR.lecture_base
    },
    bottomBuyTextContentWrapper : {
        width:'100%',justifyContent: 'flex-start',alignItems: 'center',backgroundColor:'#fff',paddingHorizontal:15
    },    
    bottomBuyTextContentTitle : {
        flex:1,padding:10,alignItems:'flex-start',justifyContent:'flex-start',width:'100%'
    },
    bottomBuyTextContentTitleText : {
        fontWeight:'bold',color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },
    bottomBuyTextContentBodyWrapper : {
        width:'95%',height:SCREEN_HEIGHT*0.1,flexDirection:'row',marginBottom:2,borderTopColor:DEFAULT_COLOR.input_border_color,borderTopWidth:1
    },
    bottomBuyTextContentBodyWrapper2 : {
        flex:1,flexDirection:'row'
    },
    bottomBuyTextContentBodyLeft : {
        flex:1,alignItems:'flex-end',justifyContent:'center',zIndex:2
    },
    bottomBuyTextContentBodyCenter :{
        flex:2,alignItems:'center',justifyContent:'center'
    },
    bottomBuyTextContentBodyenterText : {
        color:DEFAULT_COLOR.base_color_ccc,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14)
    },
    bottomBuyTextContentBodyRight : {
        flex:1,alignItems:'flex-start',justifyContent:'center',zIndex:2
    },
    bottomBuyTextPriceWrapper : {
        flex:1.5,flexDirection:'row'
    },
    bottomBuyTextPriceLeft : {
        flex:1,alignItems:'flex-end',justifyContent:'center'
    },
    bottomBuyTextPriceLeftText : {
        color:DEFAULT_COLOR.base_color_ccc,textDecorationLine:'line-through'
    },
    bottomBuyTextPriceRight :{ 
        flex:1.2,alignItems:'flex-end',justifyContent:'center',paddingRight:20
    },
    bottomBuyTextPriceRightText : {
        color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14)
    },
    bottomBuyTextButton :{ 
        width:'100%',height:SCREEN_HEIGHT*0.1,paddingVertical:10,backgroundColor:DEFAULT_COLOR.lecture_base,alignItems:'center',justifyContent:'center'
    },
    bottomBuyTextButtonText : {
        color:'#fff',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },
    bottomBuyTextButtonText2 : {
        color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),paddingVertical:20
    },
    bottomBuyMP3Wrapper : {
        width: '100%',height : (SCREEN_HEIGHT*0.15),alignItems: 'center',justifyContent: 'center',textAlign: 'center'
    },
    bottomBuyMP3WrapperOn : {
        width: '100%',height : 20,alignItems: 'center',justifyContent: 'center',textAlign: 'center'
    },
    bottomBuyMP3Left : {
        width: '100%',height : 20,alignItems: 'center',justifyContent: 'center',textAlign: 'center',
        
    },
    bottomBuyMP3LeftText : {
        width:50,height:20,backgroundColor:'#fff',borderTopLeftRadius:10,borderTopRightRadius:10,alignItems:'center',justifyContent:'center',paddingTop:5,
        ...Platform.select({
            ios: {
                shadowColor: "#222",
                shadowOpacity: 0.5,
                shadowRadius: 6.27,
                shadowOffset: {
                height: 5,
                width: 5
                }
            },
            android: {
                elevation: 15,
                backgroundColor : '#fff'
            }
        })
    },

    buymotTextWrapCommon : {
        flex:3,flexDirection:'row',justifyContent: 'center',alignItems: 'center',backgroundColor : '#222'
    },
    buymotTextWrapCommonX : {
        flex:3,flexDirection:'row',justifyContent: 'center',alignItems: 'flex-start',backgroundColor : '#222',paddingTop:10
    },
    buymotTextWrapCommon2 : {
        flex:3,flexDirection:'row',justifyContent: 'center',alignItems: 'center',backgroundColor : DEFAULT_COLOR.lecture_base
    },
    buymotTextWrapCommonX2 : {
        flex:3,flexDirection:'row',justifyContent: 'center',alignItems: 'flex-start',backgroundColor : DEFAULT_COLOR.lecture_base,paddingTop:10
    },
    buymp3Textios : {
        flex:3,flexDirection:'row',paddingTop:10
    },
    buymp3Textandroid : {
        flex:3,flexDirection:'row',alignItems:'center'
    },
    bottomBuyMP3Right :{ 
        flex:1,width: '100%',height:40,justifyContent: 'center',alignItems: 'center', backgroundColor : '#000'
    },
    bottomBuyMP3RightOn :{ 
        width: '100%',height:10,justifyContent: 'center',alignItems: 'center', backgroundColor : '#fff'
    },
    bottomBuyMP3BodyWrapper : {
        width:'100%',height : (SCREEN_HEIGHT*0.4)-20,justifyContent: 'center',alignItems: 'center',backgroundColor:'#fff'
    },
    bottomBuyMP3BodyWrapperOn : {
        width:'100%',height : 140,justifyContent: 'center',alignItems: 'center',backgroundColor:'#fff'
    },
    bottomBuyMP3Body: {
        flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center'
    },
    bottomBuyMP3BodyLeft : {
        flex:1,alignItems:'center',justifyContent:'center'
    },
    bottomBuyMP3BodyLeftText : {
        color:'#fff',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14)
    },
    bottomBuyMP3BodyRight : {
        flex:1.5,flexDirection:'row'
    },
    bottomBuyMP3BodyRightin : {
        flex:1.2,alignItems:'flex-end',justifyContent:'center',paddingRight:20
    },
    bottomBuyMP3BodyRightText : {
        color:'#fff',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14)
    },
    bottomBuyMP3BodyBottom :{ 
        flex:1,flexDirection:'row',flexGrow:1,width:'100%',backgroundColor:DEFAULT_COLOR.lecture_base,alignItems:'flex-start',justifyContent:'center',paddingTop:10
    },
    bottomBuyMP3BodyBottomios :{ 
        flex:1,flexDirection:'row',flexGrow:1,width:'100%',backgroundColor:DEFAULT_COLOR.lecture_base,alignItems:'center',justifyContent:'center',
    },
    bottomBuyMP3BodyBottomiosx :{ 
        flex:1,flexDirection:'row',flexGrow:1,width:'100%',backgroundColor:DEFAULT_COLOR.lecture_base,alignItems:'center',justifyContent:'center',paddingBottom:5
    },
    bottomBuyMP3BodyBottomandroid :{ 
        flex:1,flexDirection:'row',flexGrow:1,width:'100%',backgroundColor:DEFAULT_COLOR.lecture_base,alignItems:'center',justifyContent:'center'
    },
    bottomBuyMP3BodyBottomText :{ 
        color:'#fff',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium)
    },
    moreSellerButtonWrapper :  {
        flexDirection:'row',flexGrow:1,borderRadius:5,borderWidth:1,borderColor:DEFAULT_COLOR.base_color_666,width:'95%',justifyContent:'center',alignItems:'center',marginVertical:10,paddingVertical:10
    },
    /**** Modal  *******/
    modalContainer: {
        marginTop:SCREEN_HEIGHT*0.3,
        paddingTop: 16, 
        backgroundColor: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8
    },
    sampletitle: {
        fontSize: 20,
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


    bottomBuyTextWrapper3 : {
        width: SCREEN_WIDTH,height : SCREEN_HEIGHT*0.15,alignItems: 'center',justifyContent: 'center',textAlign: 'center'
    },
    bottomBuyTextWrapperOn3 : {
        width: SCREEN_WIDTH,height : 20,alignItems: 'center',justifyContent: 'center',textAlign: 'center'
    },

    headerLayoutStyle: {
        zIndex:5,
        width : SCREEN_WIDTH, 
        height: 30, 
        backgroundColor: DEFAULT_COLOR.lecture_base,
        justifyContent: 'center', 
        alignItems: 'center',
        overflow:'hidden'
    },
    headerLayoutStyleOn : {
        zIndex:10,
        width : SCREEN_WIDTH, 
        height: 30, 
        backgroundColor: 'transparent',
        justifyContent: 'center', 
        alignItems: 'center',
        //opacity:0.2,
        overflow:'hidden'
    },
    slidingPanelLayoutStyle: {
        zIndex:5,
        width:SCREEN_WIDTH, 
        //paddingHorizontal:20,
        height:SCREEN_HEIGHT*0.3, 
        backgroundColor: DEFAULT_COLOR.base_color_fff,
        overflow:'hidden'
    },
    slidingPanelLayoutStyle04: {
        zIndex:5,
        width:SCREEN_WIDTH, 
        //paddingHorizontal:20,
        height:SCREEN_HEIGHT*0.4, 
        backgroundColor: DEFAULT_COLOR.base_color_fff,
        overflow:'hidden'
    },
    slidingPanelLayoutStyleOff: {
        zIndex:5,
        width:SCREEN_WIDTH, 
        //paddingHorizontal:20,
        height:1, 
        backgroundColor: 'transparent',
        overflow:'hidden'
    },
   
});


export default styles;
