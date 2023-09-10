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
        width:SCREEN_WIDTH,height:'100%',backgroundColor: '#fff',paddingVertical:20
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




   
   
});


export default styles;
