import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
  PixelRatio,
  Modal,
  Dimensions,
  Platform,
  Image,
  ImageBackground,
} from 'react-native';
import moment from 'moment';
import {connect} from 'react-redux';
import MyClassStyles from '../../../Style/MyClass/MyClassStyle';
import {CustomTextR, CustomTextM, CustomTextB, TextRobotoR, TextRobotoM, TextRobotoB} from '../../../Style/CustomText';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
// import Icon2 from 'react-native-vector-icons/Entypo';
// Icon2.loadFont();
// import Icon from 'react-native-vector-icons/FontAwesome';
// Icon.loadFont();

//공통상수
import COMMON_STATES, {SERVICES} from '../../../Constants/Common';
import * as getDEFAULT_CONSTANTS from '../../../Constants';
import CommonUtil from '../../../Utils/CommonUtil';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

class CertScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memberName: '',
      memberBirthDate: '',
    };
  }

  async UNSAFE_componentWillMount() {
      const userInfo = await CommonUtil.getUserInfo();
      this.setState({
          memberID: userInfo.memberID,
          memberName: userInfo.memberName,
          memberBirthDate: moment(userInfo.memberBirthDate).format('YYYY.MM.DD'),
      });
  }

  getLogoImage = () => {
    switch (this.props.myClassServiceID) {
      case '3090':
        return require('../../../../assets/logo/img_logo_3090.png');
      case '3050':
        return require('../../../../assets/logo/img_logo_3050.png');
      case '3070':
        return require('../../../../assets/logo/img_logo_3070.png');
      case '3095':
        return require('../../../../assets/logo/img_logo_3095.png');
      case '3045':
        return require('../../../../assets/logo/img_logo_3045.png');
      // case '3040':
      //   return require('../../../../assets/logo/img_logo_3040.png');
      // case '3030':
      //   return require('../../../../assets/logo/img_logo_3030.png');
      // case '3230':
      //   return require('../../../../assets/logo/img_logo_3230.png');
      // case '3075':
      //   return require('../../../../assets/logo/img_logo_3075.png');
      // case '3080':
      //   return require('../../../../assets/logo/img_logo_3080.png');
      // case '3060':
      //   return require('../../../../assets/logo/img_logo_3060.png');
      // case '3210':
      //   return require('../../../../assets/logo/img_logo_3210.png');
      // case '3310':
      //   return require('../../../../assets/logo/img_logo_3310.png');
      // case '3150':
      //   return require('../../../../assets/logo/img_logo_3150.png');
    }
  };
  
  render() {
    const {classData} = this.props.screenState;
    return (
      <View style={styles.container}>
        <Image
          source={this.props.screenState.modalContent === 'certAttend' ? require('../../../../assets/icons/img_certificate_blue.png') : require('../../../../assets/icons/img_certificate_gold.png')} 
          style={{position: 'absolute', left: 0, top: 0, width: 245, height: 120, borderTopLeftRadius: 20}} />
        <ScrollView>
          <Image
            source={require('../../../../assets/logo/img_logo_h_bg.png')} 
            style={{width: 230, height: 170, position: 'absolute', left: SCREEN_WIDTH / 2 - (230 / 2), top: SCREEN_HEIGHT / 2 - (170 / 2)}} />
          <View style={{paddingVertical: 20, justifyContent: 'center'}}>
            <TouchableOpacity onPress={() => this.props.screenState.closeModal()} style={{position: 'absolute', right: 17, bottom: 0, marginBottom: 5}}>
              <Image source={require('../../../../assets/icons/btn_close_pop.png')} style={MyClassStyles.inModalCloseBtnImage} />
            </TouchableOpacity>
          </View>

          <View style={[styles.wrapper, {borderColor: this.props.screenState.modalContent === 'certAttend' ? '#3fcfff' : '#e1bf71'}]}>
              <View style={styles.bodyContents}>
                {this.props.screenState.modalContent === 'certAttend'
                  ? <Image source={require('../../../../assets/icons/img_certificate_title_02.png')} style={MyClassStyles.inModalCloseBtnImage} style={{width: 180, height: 35, alignSelf: 'center'}} />
                  : <Image source={require('../../../../assets/icons/img_certificate_title_01.png')} style={MyClassStyles.inModalCloseBtnImage} style={{width: 180, height: 35, alignSelf: 'center'}} />
                }
                <View style={[styles.flexRow, styles.row, {alignItems: 'flex-start', marginTop: 33}]}>
                  <Text style={[styles.subjectText, styles.subjectTextBox]}>성명</Text>
                  <Text style={styles.valueText}>
                  {this.state.memberName}
                  <Text style={{fontSize: PixelRatio.roundToNearestPixel(13)}}> ({this.state.memberID})</Text>
                  </Text>
                </View>
                <View style={[styles.flexRow, styles.row]}>
                  <Text style={[styles.subjectText, styles.subjectTextBox]}>생년월일</Text>
                  <Text style={styles.valueText, {fontFamily: DEFAULT_CONSTANTS.robotoFontFamilyMedium}}>{this.state.memberBirthDate}</Text>
                </View>
                <View style={[styles.flexRow, styles.row]}>
                  <Text style={[styles.subjectText, styles.subjectTextBox]}>수강과목</Text>
                  <Text style={styles.valueText}>{classData.className}</Text>
                </View>
                <View style={[styles.flexRow, styles.row]}>
                  <Text style={[styles.subjectText, styles.subjectTextBox]}>{this.props.screenState.modalContent === 'certAttend' ? '수강신청일' : '결제일'}</Text>
                  <Text style={styles.valueText}>
                      {this.props.screenState.modalContent === 'certAttend' 
                        ? !CommonUtil.isEmpty(classData.takeCourseBeginDatetime) && moment(classData.takeCourseBeginDatetime).format('YYYY년 MM월 DD일')
                        : !CommonUtil.isEmpty(classData.purchaseDatetime) && moment(classData.purchaseDatetime).format('YYYY년 MM월 DD일')
                      }
                  </Text>
                </View>
                <View style={[styles.flexRow, styles.row]}>
                  <Text style={[styles.subjectText, styles.subjectTextBox]}>수강기간</Text>
                  <Text style={styles.valueText}>{moment(classData.takeCourseBeginDatetime).format('YYYY년 MM월 DD일')} ~{'\n'}{moment(classData.takeCourseEndDatetime).format('YYYY년 MM월 DD일')}</Text>
                </View>
                <View style={[styles.flexRow, styles.row]}>
                  <Text style={[styles.subjectText, styles.subjectTextBox]}>수강률</Text>
                  <Text style={styles.valueText}>{classData.progressRatio * 100}%</Text>
                </View>
                {/* <View style={[styles.flexRow, styles.row]}>
                  <Text style={[styles.subjectText, styles.subjectTextBox]}>수강료</Text>
                  <Text style={styles.valueText}>₩ 9,296,000</Text>
                </View> */}
              </View>
              <View style={styles.bottomSection}>
                <Image source={require('../../../../assets/images/img_stamp_champ.png')} style={styles.seal} />
                <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(14), lineHeight: 14 * 1.42, letterSpacing: -0.7, color: '#444'}}>위의 현황은 사실과 같음을 증명합니다.</CustomTextR>
                <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(13), lineHeight: 13 * 1.42, letterSpacing: -0.7, color: '#222'}}>
                  <TextRobotoR>{moment().format('YYYY')}</TextRobotoR>년 <TextRobotoR>{moment().format('MM')}</TextRobotoR>월 <TextRobotoR>{moment().format('DD')}</TextRobotoR>일
                </CustomTextR>
              <Image
                // source={require('../../../../assets/logo/img_logo_3045.png')}
                source={this.getLogoImage()}
                style={{
                  marginTop: 16,
                  resizeMode: 'contain',
                  width: 250,
                  height: 0 ? 24.5 : 17,
                  //height: this.props.serviceId === 3050 ? 24.5 : 17, // 3050 = hackers talk
                }}
              />
                <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(10), lineHeight: 10 * 1.42, color: '#444444', marginTop: 38, marginBottom: 15}}>
                {SERVICES[this.props.myClassServiceID].name} <TextRobotoR style={{color: '#666666'}}>{SERVICES[this.props.myClassServiceID].domain}</TextRobotoR>
                </CustomTextR>
              </View>
        </View>

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flexRow: {flexDirection: 'row'},
  flexCol: {flexDirection: 'column'},
  container: {
    // width: '100%',
    height: '100%',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
  },
  wrapper: {
    // flexDirection: 'column',
    flex: 1,
    height: '100%',
    // marginHorizontal: 20,
    // backgroundColor: 'red',
    marginTop: 14,
    marginBottom: 15,
    marginHorizontal: 15,
    paddingTop: 43,
    paddingBottom: 16,
    borderWidth: 1,
  },
  modalTitleSection: {
    flexDirection: 'row',
    height: 40,
    // justifyContent: 'space-between',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    // borderWidth: 1,
    // borderColor: 'red',
    // borderBottomColor: '#666',
    // borderBottomWidth: 1,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium),
    color: DEFAULT_COLOR.base_color_222,
    fontFamily: DEFAULT_CONSTANTS.defaultFontFailmyBold,
    // flex: 9,
    // borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  closeBtn: {
    // borderWidth: 1,
    padding: 5,
    // marginRight: 5,
    // justifyContent: 'center',
    // alignItems: 'center',
    // flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  certTitle: {
    fontSize: PixelRatio.roundToNearestPixel(28),
    color: DEFAULT_COLOR.base_color_222,
    fontFamily: DEFAULT_CONSTANTS.defaultFontFailmyBold,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 50,
  },
  bodyContents: {
    marginHorizontal: 45,
  },
  row: {
    width: '100%',
    marginBottom: 22,
    alignItems: 'flex-start',
  },
  subjectText: {
    fontFamily: DEFAULT_CONSTANTS.defaultFontFailmyRegular,
    fontSize: PixelRatio.roundToNearestPixel(12),
    lineHeight: 12 * 1.42,
    color: '#444444',
    justifyContent: 'center',
    alignItems: 'center',
    letterSpacing: -0.6,
    marginTop: 1,
  },
  subjectTextBox: {
    width: 80,
  },
  valueText: {
    fontFamily: DEFAULT_CONSTANTS.defaultFontFailmyMedium,
    fontSize: PixelRatio.roundToNearestPixel(14),
    lineHeight: 14 * 1.42,
    color: DEFAULT_COLOR.base_color_222,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '500',
    letterSpacing: -0.7,
    width: '65%',
  },
  bottomSection: {
    marginTop: 20,
    alignItems: 'center',
    // height: 200,
    paddingTop: 10,
  },
  seal: {
    position: 'absolute',
    right: (SCREEN_WIDTH / 2 - 50) - (SCREEN_WIDTH * 0.26),
    width: 50,
    height: 50,
  },
});

const mapStateToProps = state => {
  return {
    myClassServiceID: state.GlabalStatus.myClassServiceID,
  };
};

export default connect(mapStateToProps, null)(CertScreen);