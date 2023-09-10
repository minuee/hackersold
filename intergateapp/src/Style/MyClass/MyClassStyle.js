import {StyleSheet, Dimensions, PixelRatio, Platform, StatusBar} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const {width: SCREEN_WIDTH,height : SCREEN_HEIGHT} = Dimensions.get("window");
const STATUS_BAR_HEIGHT = Platform.OS == 'android' ? StatusBar.currentHeight : getStatusBarHeight();

//공통상수
import COMMON_STATES from '../../Constants/Common';
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;


const size10 = PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize10);
const size12 = PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12);
const size13 = PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13);
const size14 = PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14);
const size15 = PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15);
const size16 = PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16);
const size18 = PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18);
const size20 = PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20);
const size25 = PixelRatio.roundToNearestPixel(25);
const size45 = PixelRatio.roundToNearestPixel(45);

const styles = StyleSheet.create({
  IndicatorContainer: {
    // flex: 1,
    width: '100%',
    height: SCREEN_HEIGHT * 0.6,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  InsideIndecator: {
    flex: 1,
  },
  modalContainer: {
    paddingTop: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  swipeableModalContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  tabStyle: {
    flex: 1,
    padding: 0,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  tabBarTextStyle: {
    fontSize: size15,
    fontWeight: 'bold',
  },
  contentDataBody: {
    marginVertical: 20,
    padding: 10,
    marginBottom: 50,
  },
  font12: {
    fontSize: size12,
  },
  font13: {
    fontSize: size13,
  },
  font14: {
    fontSize: size14,
  },
  font15: {
    fontSize: size15,
  },
  font16: {
    fontSize: size16,
  },
  font20: {
    fontSize: size20,
  },
  font25: {
    fontSize: size25,
  },
  btnFavoriteStar: {
    width: size45,
    height: size45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyClassRoundedBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 3,
    marginRight: 3,
    // borderWidth: 1,
    // borderColor: '#bbbbbb',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyClassRoundedBadgeText: {
    color: '#fff',
    fontSize: size10,
    letterSpacing: -0.75,
    fontWeight: '500',
  },
  classRoundedBadge: {
    paddingHorizontal: 9,
    // paddingVertical: 2,
    // borderRadius: 9,
    // width: 65,
    height: 22,
    borderRadius: 11,
    marginRight: 3,
    borderWidth: 1,
    borderColor: '#bbbbbb',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  classRoundedNoBorderBadge: {
    paddingHorizontal: 9,
    // paddingVertical: 2,
    // borderRadius: 9,
    // width: 65,
    height: 22,
    borderRadius: 11,
    marginRight: 3,
    // borderWidth: 1,
    // borderColor: '#bbbbbb',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  classRoundedBadgeText: {
    color: '#888888',
    fontSize: size10,
    letterSpacing: -0.75,
    fontWeight: '500',
  },
  classRoundedBadgeGray: { // 배수, 수강예정
    backgroundColor: '#bbbbbb',
  },
  classRoundedBadgeDkGray: { // 수강중
    backgroundColor: '#555555',
  },
  classRoundedBadgeBlue: { // 단과
    backgroundColor: '#3674c0',
  },
  classRoundedBadgeGreen: { // 프리패스
    backgroundColor: '#009f95',
  },
  classRoundedBadgeYellow: { // 환급반
    backgroundColor: '#ed8127',
  },
  classRoundedBadgePurple: { // 평생반
    backgroundColor: '#c4267c',
  },
  classRoundedBadgeDkBlue: { // 모의고사
    backgroundColor: '#0e3a48',
  },
  classRoundedBadgeSkBlue: { // 첨삭
    backgroundColor: '#28a5ce',
  },
  classRoundedBadgeDgGray: { // 출석미션
    backgroundColor: '#0e3a48',
  },
  fontNotoR: {
    fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyRegular,
  },
  fontNotoB: {
    fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyBold,
  },
  centerModalSmall: {
    marginHorizontal: SCREEN_WIDTH * 0.05,
  },
  centerModalMedium: {
    marginHorizontal: SCREEN_WIDTH * 0.1,
  },
  centerModalBig: {
    marginHorizontal: SCREEN_WIDTH * 0.2,
  },
  navibarTitleText: {
    fontSize: size16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: -0.96,
    textAlign: 'center',
    color: '#ffffff',
  },
  // Modal in modal
  inModalHeader: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: size15, borderBottomColor: '#e8e8e8', borderBottomWidth: 1
  },
  inModalHeaderTitleText: {
    fontSize: size18, color: '#222222', letterSpacing: -0.9
  },
  inModalCloseBtn: {
    position: 'absolute', right: 17
  },
  inModalCloseBtnImage: {
    width: 16, height: 16
  },
  bullet: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  inModalBottomStickyButtonSection: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    // height: 100,
    backgroundColor: '#fff',
  //   ...Platform.select({
  //     ios: {
  //       shadowColor: "rgb(50, 50, 50)",
  //       shadowOpacity: 0.5,
  //       shadowRadius: 5,
  //       shadowOffset: {
  //         height: -1,
  //         width: 0
  //      }
  //    },
  //     android: {
  //       elevation: 5
  //    }
  //  })
  },
  inModalBottomStickyButton: {
    width: '100%',
    // height: SCREEN_HEIGHT * 0.065,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#28a5ce',
    paddingVertical: 16,
  },
  inModalBottomStickyButtonText: {
    fontSize: size18,
    fontWeight: 'bold',
    letterSpacing: -0.9,
    color: '#ffffff',
  },
  addonHowToUseMsgSection: {
    marginTop: 23,
    marginBottom: 80,
  },
  addonHowToUseMsgTitle: {
    fontSize: size15,
    fontWeight: '500',
    letterSpacing: -0.75,
    color: '#222222',
    marginBottom: 13,
  },
});
export default styles;
