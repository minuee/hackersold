import {StyleSheet, Dimensions,PixelRatio} from 'react-native';

const {width: SCREEN_WIDTH,height : SCREEN_HEIGHT} = Dimensions.get("window");
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

const CommonStyles = StyleSheet.create({    
    fontDefault : { color : '#222'},
    fontRed : { color : '#ff0000'},
    fontblack : { color : '#000000'},
    fontGray : { color : '#ccc'},
    fontTheme : { color : '#28a5ce'},
    
})

export default CommonStyles;