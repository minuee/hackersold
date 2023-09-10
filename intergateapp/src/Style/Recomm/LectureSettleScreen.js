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
        //alignItems: 'center',
        backgroundColor: '#ffffff',        
    },
   
    selectSettleMethode : {
        width:SCREEN_WIDTH/3-10,paddingVertical:20,alignItems:'center',justifyContent:'center',marginRight:2,borderWidth:1, borderColor:DEFAULT_COLOR.lecture_base,borderRadius:5
    },
    unselectSettleMethode : {
        width:SCREEN_WIDTH/3-10,paddingVertical:20,alignItems:'center',justifyContent:'center',marginRight:2,borderWidth:1, borderColor:'#ccc',borderRadius:5
    },

    fixedUpButton : {
        position:'absolute',bottom:50,right:20,width:50,height:50,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:25,opacity:0.5
    },
    commonHr1 : {
        backgroundColor:'#ebebeb',height:10
    },

    topOrderWrapper : {
        flex:1,paddingBottom:10,marginHorizontal:10
    },
    topOrderWrapperIn : {
        flex:1,
    },
    topOrderTitleWrapper : {
        paddingHorizontal:5,borderBottomWidth:1,borderBottomColor:'#111',paddingVertical:15
    },
    topOrderTitleText : {
        color:DEFAULT_COLOR.base_color_222,fontWeight:'bold',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:PixelRatio.roundToNearestPixel(-0.75)
    },
    topOrderTitleText2 : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12)
    },
    topOrderGoodsDetailWrap : {
        width:SCREEN_WIDTH-40,flexDirection:'row',backgroundColor:'#ebebeb'
    },
    topOrderGoodsDetailLeft : {
        flex:3,paddingVertical:20,alignItems:'center',justifyContent:'center',borderRightWidth:1,borderRightColor:'#ccc'
    },
    topOrderGoodsDetailCenter : {
        flex:1,paddingVertical:20,alignItems:'center',justifyContent:'center',borderRightWidth:1,borderRightColor:'#ccc'
    },
    topOrderGoodsDetailRight : {
        flex:1.5,flexDirection:'column-reverse',paddingVertical:20,alignItems:'center',justifyContent:'center'
    },
    topOrderGoodsDetailListRow : {
        flex:1,flexDirection:'row'
    },
    topOrderGoodsDetailListLeft : {
        flex:3,paddingVertical:20,paddingHorizontal:5,alignItems:'center',justifyContent:'center',borderRightWidth:1,borderRightColor:'#ccc',borderBottomWidth:1,borderBottomColor:'#ccc'
    },
    topOrderGoodsDetailListCenter : {
        flex:1,paddingVertical:20,alignItems:'center',justifyContent:'center',borderRightWidth:1,borderRightColor:'#ccc',borderBottomWidth:1,borderBottomColor:'#ccc'
    },
    topOrderGoodsDetailListRight2 : {
        flex:1.5,flexDirection:'column',paddingVertical:20,alignItems:'center',justifyContent:'center',borderBottomWidth:1,borderBottomColor:'#ccc'
    },
    topOrderGoodsDetailListRight : {
        flex:1.5,flexDirection:'column',paddingVertical:20,alignItems:'flex-end',justifyContent:'flex-end',borderBottomWidth:1,borderBottomColor:'#ccc'
    },
    delilveryWrapper : {
        paddingTop:20,paddingBottom:10,marginHorizontal:10
    },
    deliveryHeadTitleWrapper : {
        padding:5,borderBottomWidth:1,borderBottomColor:'#111',paddingBottom:15
    },
    delilveryCommonRow : {
        padding:0,margin:0,flex:1,flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#ccc'
    },
    delilveryCommonRow2 : {
        padding:0,margin:0,flex:1,flexDirection:'row'
    },
    delilveryCommonRowLeft : {
        flex:1.4,paddingVertical:20,justifyContent:'center'
    },
    delilveryCommonRowRight : {
        flex:4,paddingVertical:20,justifyContent:'center'
    },
    tableLeftSubject: {
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing: PixelRatio.roundToNearestPixel(-0.65),color:DEFAULT_COLOR.base_color_222,
    },
    settlePriceWrapper : {
        flex:1,flexDirection:'row',backgroundColor:'#f7f7f7',justifyContent:'center',paddingHorizontal:5
    },
    settlePriceTitleLeft : {
        flex:1.4,paddingHorizontal:10,paddingVertical:20
    },
    settlePriceTitleText  : {
        color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing: PixelRatio.roundToNearestPixel(-0.65)
    },
    settlePriceTitleRight : {
        flex:4,paddingHorizontal:10,paddingVertical:20
    },
    
    dropdownWrapperTop : {
        flex:1,borderWidth:1,borderColor:'#ccc',borderTopStartRadius:5,borderTopEndRadius:5
    },
    dropdownWrapperTopHeaderWrap : {
        paddingVertical:5,paddingHorizontal:10
    },
    dropdownWrapperTopHeaderWrapIn : {
        flex:5,paddingVertical:10,justifyContent:'center'
    },
    dropdownWrapperMiddle : {
        flex:1,borderWidth:1,borderColor:'#ccc', borderTopWidth: 0
    },
    dropdownWrapperBottom : {
        flex:1,borderWidth:1,borderColor:'#ccc',borderBottomStartRadius:5,borderBottomEndRadius:5, borderTopWidth: 0, marginBottom: 10,
    },
    dropdownHiddenWrap : {
        width:SCREEN_WIDTH,backgroundColor:'#ebebeb',padding:10
    },
    dropdownTitleText : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)
    },
    dropdownContentText : {
        color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12)
    },
    dropdownTitleTextOn : {
        color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)
    },
    etcInformationWrapper : {
        paddingVertical:10
    },
    etcInformationWrapperIn : {
        padding:10,borderWidth:1,borderColor:'#ccc',borderRadius:5
    },

    agreeWideWrapper : {
        // padding:5,
        marginBottom:30,
        marginTop: 15,
    },
    agreeWrapper : {
        padding:10,flexDirection:'row',borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:5, alignItems: 'center'
    },
    agreeWrapperOn : {
        padding:10,flexDirection:'row',borderWidth:1,borderColor:DEFAULT_COLOR.lecture_base,borderRadius:5, alignItems: 'center'
    },
    agreeWrapperIn : {
        flex:1,justifyContent:'center'
    },
    agreeWrapperLeft : {
        flex:1,justifyContent:'center'
    },
    agreeWrapperRight : {
        flex:5
    },
    bottomButtonLeft : {
        flex:1,backgroundColor:'#000',paddingVertical:20,alignItems:'center',justifyContent:'center'
    },
    bottomButtonRight : {
        flex:1,backgroundColor:DEFAULT_COLOR.lecture_base,paddingVertical:20,alignItems:'center',justifyContent:'center'
    },
    bottomButtonText : {
        color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium),fontWeight:'bold'
    },
    /**** Overlay ******/
    overrayTop: {
        height : 40,
        backgroundColor : DEFAULT_COLOR.lecture_base,
        alignItems :'center',
        justifyContent : 'center'
    },
    overrayBottom: {
        height : 100,   
        backgroundColor : '#fff', 
        paddingHorizontal:10, 
        paddingVertical : 5,           
        borderTopColor : '#ebebeb',
        borderTopWidth :1 
    },
    overrayHeader: {
        backgroundColor: DEFAULT_COLOR.lecture_base,
        width: '100%',
        height: SCREEN_HEIGHT / 17,
        justifyContent: 'center',
    },
    headerText: {
        color: '#FFFFFF',
        fontSize: 17,
        textAlign: 'center',
    },
    listItemWrapper: {
        flex: 1,
        height: SCREEN_HEIGHT / 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 0.8,
        borderColor: '#CCCCCC',
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
    },
    listItemText: {
        margin: 10,
        alignSelf: 'center',
        fontSize: 17,
        color: '#404040',
    },
    listItemCheckBoxWrapper: {
        height: SCREEN_HEIGHT / 18,
        width: SCREEN_HEIGHT / 18,
        justifyContent: 'center'
    },
    listItemCheckBoxWrapperChecked: {
        backgroundColor: '#1E9DF3',
    },
    listItemCheckBoxWrapperUnchecked: {
        backgroundColor: '#E2E2E2',
    },
    gridView: {        
        flex:1,   
        margin : 5,
        flexDirection :'row',
        flexWrap: 'wrap',                
    },   
    
    gridLeft : {    
        flex :6,  
        justifyContent: 'center',
        borderColor :'#ebebeb',
        borderWidth : 1
    },
    gridRight : {   
        flex :1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        borderColor :'#ebebeb',
        borderWidth : 1
    },
    itemText: {
        paddingHorizontal : 5,
        fontSize: 15,
        color:'#555',
        fontWeight: '600',
    },
    fontColor666 : {
        color:DEFAULT_COLOR.base_color_666
    },

     /**** Modal  *******/
     modalContainer: {
        paddingTop: 16, backgroundColor: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8
    },
    postcodeWrapper : {
        paddingTop:5,paddingBottom:10,alignItems:'center',justifyContent:'center',borderBottomColor:'#ccc',borderBottomWidth:1
    },
    requestTitleText2 : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },
    settleMethodeWrapper : {
        flex:1,flexDirection:'row',flexWrap:'wrap',padding:5
    },
    
    selectSettleText : {
        fontFamily:DEFAULT_CONSTANTS.defaultFontFamilyBold,color:DEFAULT_COLOR.lecture_base,fontWeight:'bold',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)
    },
    unSelectSettleText : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)
    },


})

export default styles;