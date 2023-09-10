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
    checkboxWrap: {
        flex: 1,
        borderWidth: 0,
        padding: 0,
        margin: 0,
        backgroundColor: '#fff',
    },
    topWrapper : {
        minHeight : SCREEN_HEIGHT/4+20,
        width:SCREEN_WIDTH,   
        backgroundColor : DEFAULT_COLOR.lecture_base,
        alignItems : 'center',
        justifyContent : 'center',
    },
    topWrapper2 : {
        minHeight : 100, 
        width:SCREEN_WIDTH,   
        backgroundColor : '#fff',
        alignItems : 'center',
        justifyContent : 'center',        
    },
    titleHeaderInfo : {
        flex:1,
        width:SCREEN_WIDTH - 40,
    },
    titleHeaderInfoNew : {
        flex:1,        
        paddingBottom:5,
        paddingHorizontal:5,
    },
    commoneTopWrapLeft : {
        position:'absolute',
        left:-35,
        top:0,
        width:20,
        height : SCREEN_HEIGHT/4 +20,
        borderTopEndRadius : 20,        
        backgroundColor : '#00abbf',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 5,
    },
    commoneTopWrapNew : {        
        //height : SCREEN_HEIGHT/4 ,
        //marginBottom:20,
        alignItems:'flex-start',
        justifyContent:'flex-start',
        borderTopLeftRadius : 20,
        borderTopRightRadius : 20,      
        overflow:'hidden',  
        backgroundColor : '#00abbf',
        shadowColor: "#888",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 5
    },
    commoneTopWrap : {        
        height : SCREEN_HEIGHT/4 ,
        marginBottom:20,
        borderTopStartRadius : 20,
        borderTopEndRadius : 20,        
        backgroundColor : '#00abbf',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 5
    },
    commoneTopWrapRight : {
        position:'absolute',
        right:-35,
        top:0,
        width:20,
        height : SCREEN_HEIGHT/4 +20,
        borderTopStartRadius : 20,        
        backgroundColor : '#00abbf',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 5
    },
    commoneBottomWrapLeft : {
        position:'absolute',
        left:-35,
        top:0,
        width:20,
        minHeight : 120,        
        paddingVertical:20,        
        borderBottomEndRadius : 20,        
        backgroundColor : '#fff',
        alignItems:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 5,
    },
    commoneBottomWrap : {      
        flex:1,  
        paddingVertical:20,
        minHeight : 120,
        borderBottomStartRadius : 20,
        borderBottomEndRadius : 20,
        backgroundColor : '#fff',
        alignItems:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 5,
        
    },
    commoneBottomWrapNew : {      
        flex:1,  
        paddingVertical:10,
        maxHeight : 150,
        borderBottomStartRadius : 20,
        borderBottomEndRadius : 20,
        backgroundColor : '#fff',
        //alignItems:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 5,
        zIndex:5
        
    },
    commoneBottomWrapRight : {
        position:'absolute',
        right:-35,
        top:0,
        width:20,        
        minHeight : 120,
        paddingVertical:20,        
        borderBottomStartRadius : 20,        
        backgroundColor : '#fff',
        alignItems:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 5,
    },
    imgrow: {
        flex: 1,
        alignItems:'flex-end',
        justifyContent:'flex-end',
        opacity : 1
    },
    textrow : {
        flex:1,
        width : '70%',
        marginHorizontal:15,
        marginVertical:10,
        zIndex:2
    },
    textinrow : {    
        paddingVertical : 5    
    },
    
    fixedUpButton : {
        position:'absolute',bottom:50,right:20,width:50,height:50,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:25,opacity:0.5
    },
    /**** Tabs ******/
    TabheaderTitle: {
        height:39,
        paddingVertical:20,marginVertical:5,backgroundColor:'#fff',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center', 
        flexDirection : 'row'
    },
    heaerTabs :  {        
        paddingVertical:9,
        alignItems:'center',
        justifyContent:'center',
        borderBottomColor : DEFAULT_COLOR.input_border_color,
        borderBottomWidth : 2
    },
    heaerTabsOn :  {
        paddingVertical:9,
        alignItems:'center',
        justifyContent:'center',
        borderBottomColor : DEFAULT_COLOR.lecture_base,
        borderBottomWidth : 2
    },
    selectedText : {
        fontFamily:DEFAULT_CONSTANTS.defaultFontFamilyBold,color:DEFAULT_COLOR.lecture_base,fontWeight:'bold',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:PixelRatio.roundToNearestPixel(-1.5)
    },
    unselectedText : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:PixelRatio.roundToNearestPixel(-1.5)
    },
    seletetab : {
        backgroundColor: '#fff',
        color : '#bbb',
        
    },
    firstWrapper : { 
        minHeight:250,       
        backgroundColor : "#fff",
    },

    /**** Overlay ******/
    overrayTop: {
        height : 40,
        backgroundColor : DEFAULT_COLOR.lecture_base,
        alignItems :'center',
        justifyContent : 'center'
    },
    overrayBottom: {        
        backgroundColor : '#fff', 
        paddingHorizontal:10, 
        paddingVertical : 5,           
        borderTopColor : '#ebebeb',
        borderTopWidth :1 
    },
    overrayHeader: {
        backgroundColor: DEFAULT_CONSTANTS.lecture_base,
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
        padding: 10,
        alignItems: 'center',
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
        color: DEFAULT_COLOR.base_color_222,
    },
    listItemCheckBoxWrapper: {
        height: SCREEN_HEIGHT / 18,
        width: SCREEN_HEIGHT / 18,
        justifyContent: 'center'
    },
    listItemCheckBoxWrapperChecked: {
        backgroundColor: '#E2E2E2',
    },
    listItemCheckBoxWrapperUnchecked: {
        backgroundColor: '#E2E2E2',
    },
    gridView: {        
        flex:1,   
        //margin : 5,
        flexDirection :'row',
        flexWrap: 'wrap',
        padding:10,
        borderBottomColor:'#e8e8e8',
        borderBottomWidth:1
    }, 
    
    gridViewOn: {        
        flex:1,   
        //margin : 5,
        flexDirection :'row',
        flexWrap: 'wrap',
        padding:10,
        backgroundColor:'#e8e8e8',
        borderBottomColor:'#ccc',
        borderBottomWidth:1
    }, 
    
    gridLeft : {    
        flex :6,  
        padding:5,
        justifyContent: 'center',
        
    },
    gridRight : {   
        flex :1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        //backgroundColor :DEFAULT_COLOR.input_bg_color,
        //borderTopColor :DEFAULT_COLOR.input_border_color,
        //borderTopWidth : 1,
        //borderBottomColor :DEFAULT_COLOR.input_border_color,
        //borderBottomWidth : 1,
        //borderRightColor :DEFAULT_COLOR.input_border_color,
        //borderRightWidth : 1,
        
    },
    itemText: {
        paddingHorizontal : 5,
        fontSize: 15,
        color:'#555',
        fontWeight: '600',
    },

    mainLectureText : {
        color:DEFAULT_COLOR.base_color_222,fontWeight:'bold',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),letterSpacing:PixelRatio.roundToNearestPixel(-1.08),
    },
    mainInformationSubWrap : {
        paddingTop:10,
        
    },
    mainInformationSubLeftRight : {
        flex:1,alignItems:'center'
    },
    mainInformationSubText : { 
        color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:PixelRatio.roundToNearestPixel(-0.84),
    },
    mainInformationSubCenter : {
        flex:0.1,alignItems:'center'
    },
    secondInformationWrap : {
        paddingVertical:20,marginHorizontal:15, borderBottomWidth:1,borderBottomColor:'#e8e8e8'
    },
    secondInformationTitle : {
        padding : 5
    },
    secondInformationTitleText : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing: PixelRatio.roundToNearestPixel(-0.75),
    },
    secondInformationSubWarp : {
        padding:5,flexDirection:'row',justifyContent:'center'
    },
    secondInformationSubLeft  : {
        flex : 0.7,justifyContent:'center'
    },
    secondInformationSubCenter  : {
        flex : 0.2
    },
    secondInformationSubRight  : {
        flex : 3,justifyContent:'center'
    },
    secondInformationSubText : {
        color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)*1.42,letterSpacing: PixelRatio.roundToNearestPixel(-0.7),
    },
    secondInformationIconWrap : {
        paddingVertical:20,marginHorizontal:10
    },
    secondInformationHidden : {
        position:'absolute',left:5,top:-20,width:SCREEN_WIDTH*0.8,minHeight:100,borderWidth:1,borderColor:DEFAULT_COLOR.lecture_base,borderRadius:10,backgroundColor:'#fff',padding:17,zIndex:5,shadowColor:'#330000',shadowRadius:6.27,shadowOffset:{width: 0,height: 0},shadowOpacity:0.3
    },
    secondInformationHiddenCommonRow : {
        flex:1,paddingHorizontal:10
    },
    secondInformationHiddenTitleText : {
        color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:PixelRatio.roundToNearestPixel(-0.7)
    },
    secondInformationHiddenBodyText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),letterSpacing:PixelRatio.roundToNearestPixel(-0.55)
    },

    secondInformationIconData : {
        padding:5,flexDirection:'row'
    },
    secondInformationIconDataRow : {
        flex:1,alignItems:'center'
    },
    secondInformationIconDataText : {
        color:DEFAULT_COLOR.base_color_222,fontWeight:'500',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:PixelRatio.roundToNearestPixel(-0.7)
    },
    secondInformationIconDataColorText : {
        color:DEFAULT_COLOR.lecture_base,fontWeight:'500',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:PixelRatio.roundToNearestPixel(-0.7)
    },
    secondInformationIconDataColorText2 : {
        color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:PixelRatio.roundToNearestPixel(-0.6)
    },
    selectGoodsWrapper : {
        paddingVertical:20,paddingHorizontal:5,marginTop:10,backgroundColor:'#fff'
    },


    selectGoodsTitleText : {
        color:DEFAULT_COLOR.base_color_222,fontWeight:'bold',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:PixelRatio.roundToNearestPixel(-0.75)
    },
    checkedItem : {
        flex:1,
        flexDirection : 'row',
        marginHorizontal:5,
        padding:10,
        borderRadius : 10,
        borderWidth:1,
        borderColor:DEFAULT_COLOR.lecture_base,
        marginVertical:5
    },
    unCheckedItem : {
        flex:1,
        flexDirection : 'row',
        marginHorizontal:5,
        padding:10,
        borderRadius : 10,
        borderWidth:1,
        borderColor:'#ccc',
        marginVertical:5
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    selectGoodsBoxLeft: {
        flex:1,alignItems:'center',justifyContent:'center'
    },
    selectGoodsBoxRight: {
        flex:4
    },
    selectGoodsBoxRightTitleText : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),fontWeight:'bold'
    },
    selectGoodsBoxRightOption : {
        flexDirection:'row',alignItems:'center'
    },
    selectGoodsBoxRightOptionText1 : {
        padding:5,paddingLeft:0,marginRight:10,textDecorationLine:'line-through',color:DEFAULT_COLOR.base_color_888,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)
    },
    selectGoodsBoxRightOptionText2 : {
        padding:5,marginRight:10,color:DEFAULT_COLOR.lecture_base,fontWeight: "500",fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)
    },
    selectGoodsBoxRightOptionText3 : {
        padding:5,marginRight:10,color:DEFAULT_COLOR.base_color_222,fontWeight: "500",fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)
    },
    selectGoodsOptionWrapper : {
        paddingHorizontal:15,marginTop:20
    },
    selectGoodsOptionSelectBox : {
        margin:10,padding:10,flexDirection:'row',borderColor:'#149CB1',borderWidth:1,borderRadius:4
    },
    selectGoodsOptionSelectBoxView : {
        flex:5,paddingHorizontal:10
    },
    selectGoodsOptionSelectBoxText : {
        color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:PixelRatio.roundToNearestPixel(-0.7),
    },
    selectGoodsResultWrap : {
        flex:1,backgroundColor:'#f5f7f8',borderTopColor:'#ccc',borderTopWidth:1
    },
    selectGoodsResultInWrap : {
        flex:1,paddingHorizontal:10,paddingVertical:20
    },
    selectGoodsResultTitle : {
        flex:1,padding:10,borderBottomColor:DEFAULT_COLOR.base_color_222,borderBottomWidth:1
    },
    selectGoodsResultLectureTitle : {
        flex:1,padding:10
    },
    selectGoodsResultLectureTitleText  :{
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:PixelRatio.roundToNearestPixel(-0.65)
    },
    selectGoodsResultLecturePrice : {
        flex:1,paddingHorizontal:10,alignItems:'flex-end',borderBottomColor:'#ccc',borderBottomWidth:1,paddingBottom:20
    },
    selectGoodsResultLecturePriceText : {
        padding:5,marginRight:10,fontWeight:'500',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:DEFAULT_COLOR.base_color_222,
    },
    selectGoodsResultOptionWrap : 
    {
        flex:1,flexDirection:'row',padding:10
    },
    selectGoodsResultOptionTitile  : {
        flex:5,flexDirection:'row',paddingRight:50
    },
    selectGoodsResultOptionTitileText : {
        color:DEFAULT_COLOR.base_color_888,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:PixelRatio.roundToNearestPixel(-0.65)
    },
    selectGoodsResultOptionTitileTextBold : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:PixelRatio.roundToNearestPixel(-0.65)
    },
    selectGoodsResultOptionCancel : {
        flex:1,alignItems:'flex-end'
    },
    selectGoodsResultOptionPrice : {
        flex:1,paddingHorizontal:10,alignItems:'flex-end'
    },
    selectGoodsResultOptionPriceText : {
        padding:5,marginRight:10,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:DEFAULT_COLOR.base_color_222
    },
    selectGoodsResultPriceWrap : {
        backgroundColor:DEFAULT_COLOR.lecture_base,alignItems:'center'
    },
    selectGoodsResultPriceInWrap : {
        flexDirection:'row',padding:20,alignItems:'stretch',alignItems:'center'
    },
    selectGoodsResultPriceLeft : {
        flex:1,alignItems:'flex-start'
    },
    selectGoodsResultPriceCenter : {
        flex:1,alignItems:'flex-end'
    },
    selectGoodsResultPriceRight : {
        flex:1,alignItems:'flex-end'
    },
    selectGoodsResultPriceText1 : {
        padding:5,marginRight:10,color:'#fff',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),fontWeight:'bold',letterSpacing:PixelRatio.roundToNearestPixel(-0.8)
    },
    selectGoodsResultPriceText2 : {
        padding:5,marginRight:10,textDecorationLine:'line-through',color:'#fff',opacity:0.5,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)
    },

    sampleVideoWrapper : {
        paddingVertical:20,marginVertical:10,backgroundColor:'#fff'
    },
    sampleVideoTitleText : {
        color:DEFAULT_COLOR.base_color_222,fontWeight:'bold',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },

    bottomTabsWrapper : {
        paddingVertical:Platform.OS === 'ios' ? 10 : 0,backgroundColor:'#fff',flexDirection:'row',justifyContent:'space-between'
    },
    bottomButtonWrapper : {
        flex:1,flexDirection:'row'
    },
    bottomButtonLeft : {
        flex:1,alignItems:'center',justifyContent:'center',backgroundColor:DEFAULT_COLOR.lecture_base,paddingVertical:20,paddingHorizontal:10
    },
    bottomButtonRight : {
        flex:5,alignItems:'center',justifyContent:'center',paddingVertical:20
    },
    bottomButtonRightText :{
        color:'#fff',fontWeight:'bold',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),letterSpacing:PixelRatio.roundToNearestPixel(-0.9)
    },
    /**** Modal  *******/
    modalContainer: {
        paddingTop: 16, backgroundColor: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8
    },
    postcodeWrapper : {
        paddingTop:5,paddingBottom:10,alignItems:'center',justifyContent:'center',borderBottomColor:'#ccc',borderBottomWidth:1
    },
    modalTitle: {
        paddingLeft: 5, color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),letterSpacing:PixelRatio.roundToNearestPixel(-0.9)
    },
    bottomButtonLeft2 : {
        flex:1,alignItems:'center',justifyContent:'center',paddingVertical:20,paddingHorizontal:10
    },
    bottomButtonRight2 : {
        flex:1,alignItems:'center',justifyContent:'center',paddingVertical:20,backgroundColor:DEFAULT_COLOR.lecture_base,
    },

    bottomButtonLeftText2 :{
        color:'#fff',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),letterSpacing:PixelRatio.roundToNearestPixel(-0.9)
    },
    bottomButtonRightText2 :{
        color:'#fff',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),letterSpacing:PixelRatio.roundToNearestPixel(-0.9)
    },

})

export default styles;