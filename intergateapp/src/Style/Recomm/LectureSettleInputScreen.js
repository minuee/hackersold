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
        //alignItems: 'center',
        backgroundColor: '#ffffff',
        
    },
   
    selectSettleMethode : {
        width:SCREEN_WIDTH/3-15,paddingVertical:20,alignItems:'center',justifyContent:'center',marginRight:5,marginBottom:5,borderWidth:1, borderColor:DEFAULT_COLOR.lecture_base,borderRadius:5
    },
    unselectSettleMethode : {
        width:SCREEN_WIDTH/3-15,paddingVertical:20,alignItems:'center',justifyContent:'center',marginRight:5,marginBottom:5,borderWidth:1, borderColor:'#ccc',borderRadius:5
    },
    selectSettleText : {
        fontFamily:DEFAULT_CONSTANTS.defaultFontFamilyBold,color:DEFAULT_COLOR.lecture_base,fontWeight:'bold',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:PixelRatio.roundToNearestPixel(-0.7)
    },
    unSelectSettleText : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:PixelRatio.roundToNearestPixel(-0.7)
    },

    fixedUpButton : {
        position:'absolute',bottom:50,right:20,width:50,height:50,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:25,opacity:0.5
    },
    commonHr1 : {
        backgroundColor:'#ebebeb',height:10
    },

    selectGoodsResultOptionWrap : 
    {
        flex:1,flexDirection:'row',padding:10
    },
    selectGoodsResultOptionTitile  : {
        flex:5,flexDirection:'row',paddingRight:50
    },
    selectGoodsResultOptionTitileText : {
        color:DEFAULT_COLOR.base_color_888,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing: PixelRatio.roundToNearestPixel(-0.65)
    },
    selectGoodsResultOptionTitileTextBold : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing: PixelRatio.roundToNearestPixel(-0.65),
    },
    selectGoodsResultOptionCancel : {
        flex:1,alignItems:'flex-end'
    },
    selectGoodsResultOptionPrice : {
        flex:1,paddingHorizontal:10,alignItems:'flex-end'
    },
    selectGoodsResultOptionPriceText : {
        padding:5,marginRight:10,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_222,fontWeight: '500',
    },

    /*** main  ****/
    modalTitle: {
        paddingLeft: 5, color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),letterSpacing:PixelRatio.roundToNearestPixel(-0.9)
    },
    requestTitleWrapper : {
        paddingTop:20,paddingBottom:10,marginHorizontal:10, borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.base_color_222
    },
    requestTitleText : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:PixelRatio.roundToNearestPixel(-0.75)
    },
    requestTitleText2 : {
        paddingLeft: 5, color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:PixelRatio.roundToNearestPixel(-0.75)
    },
    requestTitleText2On : {
        color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:PixelRatio.roundToNearestPixel(-0.75)
    },
    requestGoodsTitleWrapper : {
        //paddingBottom:10
    },
    requestGoodsTitleWrap : {
        paddingTop:20,paddingBottom:10,marginHorizontal:15
    },
    requestGoodsTitleWrap2 : {
        paddingTop:20,paddingBottom:10,marginHorizontal:15,borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1
    },
    requestGoodsTitleWrap3 : {
        paddingTop:20,paddingBottom:10,marginHorizontal:15,borderBottomColor:DEFAULT_COLOR.base_color_ccc,borderBottomWidth:2
    },
    requestGoodsTitleText : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:PixelRatio.roundToNearestPixel(-0.65)
    },
    requestGoodsOptionWrap : {
        padding:5
    },
    requestGoodsLectureOptionText : {
        color:DEFAULT_COLOR.base_color_888,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:PixelRatio.roundToNearestPixel(-0.65)
    },
    requestGoodsPriceWrap : {
        padding:10,marginTop:10,alignItems:'flex-end',borderBottomColor:'#ccc', borderBottomWidth:1
    },
    requestGoodsPriceText : {
        color:DEFAULT_COLOR.base_color_222,fontWeight:'bold',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },

    requestGoodsPartTotalWrapper: {
        backgroundColor:DEFAULT_COLOR.input_bg_color,borderTopWidth:1,borderTopColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color
    },
    requestGoodsPartTotalInside : {
        flex:1,flexDirection:'row',backgroundColor:DEFAULT_COLOR.input_bg_color,paddingVertical:15,alignItems:'center'
    },
    requestGoodsPartTotalInsideText1 : {
        color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),letterSpacing: PixelRatio.roundToNearestPixel(-0.8)
    },
    requestGoodsPartTotalInsideText2 : {
        color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),textDecorationLine:'line-through'
    },
    requestGoodsOptionWrap2  : {
        paddingTop:20,paddingBottom:10,marginHorizontal:15
    },
    requestGoodsOptionText :{
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },
    requestGoodsResultPriceWrap : {
        backgroundColor:'#f7f7f7',borderColor:'#ccc',borderWidth:1
    },
    requestGoodsResultPriceInWrap : {
        flexDirection:'row',paddingVertical:20,paddingHorizontal:10,alignItems:'stretch'
    },
    requestGoodsResultPriceLeft  : {
        flex:1.2,alignItems:'flex-start',justifyContent:'center'
    },
    requestGoodsResultPriceRight  :{
        flex:1,alignItems:'flex-end',justifyContent:'center'
    },
    requestGoodsResultPriceSettle : {
        padding:5,marginRight:10,color:DEFAULT_COLOR.lecture_base,fontWeight:'bold',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },
    requestGoodsResultPriceOrigin : {
        padding:5,marginRight:10,textDecorationLine:'line-through',color:DEFAULT_COLOR.base_color_ccc
    },    
    resultGoodsWarpper : {
        paddingTop:20,paddingBottom:10,marginHorizontal:10, borderBottomWidth:1,borderBottomColor:'#222'
    },
    resultGoodsBodyWrapper : {
        paddingBottom:10,marginHorizontal:20
    },
    resultGoodsBodyTotalPriceWrap : {
        flexDirection:'row',paddingVertical:15,alignItems:'stretch', borderBottomColor:'#ccc',borderBottomWidth:1
    },
    resultGoodsBodyTotalPriceLeft : {
        flex:1,alignItems:'flex-start',justifyContent:'center'
    },
    resultGoodsBodyTotalPriceLeftText : {
        marginRight:10,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:PixelRatio.roundToNearestPixel(-0.75),color:DEFAULT_COLOR.base_color_222
    },
    resultGoodsBodyTotalPriceRight : {
        flex:1,alignItems:'flex-end',justifyContent:'center'
    },
    resultGoodsBodyTotalPriceRightText : {
        marginRight:10,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),fontWeight: "500",color:DEFAULT_COLOR.base_color_222
    },

    resultGoodsBodyCouponWrap : {
        flexDirection:'row',paddingTop:10,alignItems:'stretch'
    },
    resultGoodsBodyCouponLeft : {
        flex:3,alignItems:'flex-start',justifyContent:'center'
    },
    resultGoodsBodyCouponRight : {
        flex:1,alignItems:'flex-end',justifyContent:'center'
    },
    resultGoodsBodyCouponRightText : {
        marginRight:10,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_ccc
    },
    resultGoodsBodyDiscountWrap : {
        flexDirection:'row',paddingVertical:10,alignItems:'stretch', borderBottomColor:'#ccc',borderBottomWidth:1
    },
    resultGoodsBodyDiscountLeft : {
        flex:1,alignItems:'flex-start',justifyContent:'center'
    },
    resultGoodsBodyDiscountText : {
        marginRight:10,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#aaa',letterSpacing:PixelRatio.roundToNearestPixel(-0.75)
    },
    resultGoodsBodyTotalDeilveryWrap : {
        flexDirection:'row',paddingVertical:15,alignItems:'stretch'
    },

    agreeWapper : {
        flex:1,borderWidth:1,borderColor:DEFAULT_COLOR.base_color_ccc,borderRadius:4
    },
    agreeWapperOn : {
        flex:1,borderWidth:1,borderColor:DEFAULT_COLOR.lecture_base,borderRadius:4
    },

    resultGoodsBodyBottomWrapper : {
        backgroundColor:DEFAULT_COLOR.input_bg_color,borderTopWidth:1,borderTopColor:DEFAULT_COLOR.input_border_color
    },
    resultGoodsBodyBottomIconMinus : {
        position:'absolute',top:35,left:SCREEN_WIDTH/3-15,width:30,height:30,zIndex:3
    },
    resultGoodsBodyBottomIconPlus : {
        position:'absolute',top:35,left:SCREEN_WIDTH/3*2-15,width:30,height:30,zIndex:3
    },
    resultGoodsBodyBottomHeader : {
        paddingTop:25,flex:1,flexDirection:'row',backgroundColor:'#ebebeb'
    },
    resultGoodsBodyBottomFooter : {
       paddingBottom:25,flex:1,flexDirection:'row',backgroundColor:'#ebebeb'
    },
    resultGoodsBodyBottomLeft : {
        flex:1,paddingVertical:5,alignItems:'center',justifyContent:'center',borderRightColor:'#ccc',borderRightWidth:1
    },
    resultGoodsBodyBottomRight : {
        flex:1,paddingVertical:5,alignItems:'center',justifyContent:'center'
    },
    resultGoodsBodyBottomText : {
        color:DEFAULT_COLOR.base_color_222,fontWeight:'500',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing: PixelRatio.roundToNearestPixel(-0.65)
    },
    resultGoodsBodyResultWrapper : {
        backgroundColor:DEFAULT_COLOR.lecture_base
    },
    resultGoodsBodyResultHeader : {
        flex:1,paddingVertical:10,alignItems:'center',justifyContent:'center',borderBottomColor:'#fff',borderBottomWidth:1
    },
    resultGoodsBodyResultHeaderText : {
        fontWeight:'bold',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:'#fff',fontWeight: "500",letterSpacing:PixelRatio.roundToNearestPixel(-1),
    },
    resultGoodsBodyResultFooter : {
        flex:1,flexDirection:'row',paddingVertical:10,alignItems:'center',justifyContent:'center'
    },
    resultGoodsBodyResultFooterText : {
        fontWeight:'500',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff',letterSpacing:PixelRatio.roundToNearestPixel(-0.75),
    },
    deliveryInfromationWrapper  :{
        paddingTop:30,paddingBottom:10,marginHorizontal:10
    },
    deliverySelectModeWrap  :{
        padding:5,flexDirection:'row'
    },
    deliverySelectUnSelected  :{
        flex:1,paddingVertical:Platform.select({
            ios  : 10,
            android : 10
        }),alignItems:'center',justifyContent:'center',borderTopColor:'#ebebeb',borderTopWidth:2,borderBottomColor:'#ebebeb', borderBottomWidth:2
    },
    deliverySelectSelected  :{
        flex:1,paddingVertical:Platform.select({
            ios  : 10,
            android : 10
        }),alignItems:'center',justifyContent:'center',borderTopColor:DEFAULT_COLOR.lecture_base,borderTopWidth:2,borderBottomColor:DEFAULT_COLOR.lecture_base, borderBottomWidth:2
    },
    deliverySelectText  : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)
    },
    deliverySelectText2  : {
        fontFamily:DEFAULT_CONSTANTS.defaultFontFamilyMedium,color:DEFAULT_COLOR.lecture_base,fontWeight:'500',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)
    },
    deliveryAddressWrapper : {
        paddingTop:5,paddingBottom:10,marginHorizontal:10
    },
    deliveryAddressBody : {
        marginTop:10,flexDirection:'row'
    },
    deliveryAddressDetailWrapper : {
        marginTop:10,paddingBottom:20,borderBottomColor:'#ccc',borderBottomWidth:1
    },
    inputDisable : {
        borderWidth:1,borderColor:'#d8d8d8',borderRadius:4,backgroundColor:'#f7f7f7',paddingLeft:15,height:40,marginLeft:3
    },
    inputAble : {
        borderWidth:1,borderColor:'#d8d8d8',borderRadius:4,paddingLeft:15,height:40,marginLeft:3
    },
    inputText: {
        // fontFamily:DEFAULT_CONSTANTS.defaultFontFamilyRegular,
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
        letterSpacing:PixelRatio.roundToNearestPixel(-0.7),
        // lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)*1.42,
    },
    settleMethodeWrapper : {
        flex:1,flexDirection:'row',flexWrap:'wrap',padding:5
    },
    agreeWrapper : {
        padding:10,flexDirection:'row',borderWidth:1,borderColor:DEFAULT_COLOR.base_color_ccc,borderRadius:4,alignItems:'center'
    },
    agreeWrapperOn : {
        padding:10,flexDirection:'row',borderWidth:1,borderColor:DEFAULT_COLOR.lecture_base,borderRadius:4,alignItems:'center'
    },
    bottomButtonWrapper : {
        flex:1,flexDirection:'row',paddingVertical:20
    },
    bottomButtonLeft : {
        flex:1,alignItems:'center',justifyContent:'center'
    },
    bottomButtonRight : {
        flex:5,alignItems:'center',justifyContent:'center'
    },
    bottomButtonRightText :{
        color:'#fff',fontWeight:'bold',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)
    },
    /** PostCode  ****/

    postcodeWrapper : {
        paddingTop:5,paddingBottom:10,alignItems:'center',justifyContent:'center',borderBottomColor:'#ccc',borderBottomWidth:1
    },

    /**** Modal  *******/
    modalContainer: {
        paddingTop: 16, backgroundColor: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8
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


})

export default styles;