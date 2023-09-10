import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  PixelRatio,
  Dimensions,
  LayoutAnimation,
  UIManager,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import moment from 'moment';
// import ActionCreator from '../../Ducks/Actions/MainActions';

// import MyClassFilterScreen from './MyClassFilterScreen';
// import ClassDetailScreen from './ClassDetailScreen';
// import AttendCalendar from './AttendCalendar';

import SelectCustom from "../../Utils/SelectCustom";
import Select2MyClass from '../../Utils/Select2MyClass';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
Icon.loadFont();
Icon2.loadFont();

//공통상수
import * as getDEFAULT_CONSTANTS from '../../Constants';
import COMMON_STATES, {SERVICES} from '../../Constants/Common';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomText, CustomTextR, CustomTextB, CustomTextM, TextRobotoB} from '../../Style/CustomText';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
// const TAB_BAR_HEIGHT = isIphoneX() ? SCREEN_HEIGHT*0.5 : (SCREEN_HEIGHT*0.5)-40;

export function isIphoneX() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    ((dimen.height === 812 || dimen.width === 812) || (dimen.height === 896 || dimen.width === 896))
  );
}


const AGE = [
  // { id: 0, name: "나이" },
  { id: 1, name: "10대", value: '10' },
  { id: 2, name: "20대", value: '20' },
  { id: 3, name: "30대", value: '30' },
  { id: 4, name: "40대", value: '40' },
  { id: 5, name: "50대", value: '50' },
  { id: 6, name: "60대 이상", value: '60' },
];
const GENDER = [
  // { id: 0, name: "성별" },
  { id: 1, name: "남", value: '남' },
  { id: 2, name: "여", value: '여' }
];

class ChallengeApplyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiLoading: false,
      startType: 'now',
      age: 0,
      gender: '',
      introduce: '',
      momentum: '',
      userWord: '',
      validationAge: false,
      validationGender: false,
      validationIntroduce: false,
      validationMomentum: false,
      validationUserWord: false,
      enableStartBtn: false,
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  expand() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ isExpandDiaryList: !this.state.isExpandDiaryList });
  }

  selectAge = async data => {
    await this.setState({
      age: AGE.find(item => item.id === data[0]).value,
      validationAge: false,
    });
    this.validationCheck();
  };

  selectGender = async data => {
    await this.setState({
      gender: GENDER.find(item => item.id === data[0]).value,
      validationGender: false,
    });
    this.validationCheck();
  };

  changeText = async (text, type) => {
    const validationType = 'validation' + type.charAt(0).toUpperCase() + type.slice(1);
    await this.setState({
      [type]: text,
      [validationType]: false,
    });
    this.validationCheck();
  };

  startChallenge = async () => {
    const validationAge = this.state.age === 0 ? true : false;
    const validationGender = this.state.gender === '' ? true : false;
    const validationIntroduce = this.state.introduce === '' ? true : false;
    const validationMomentum = this.state.momentum === '' ? true : false;
    const validationUserWord = this.state.userWord === '' ? true : false;
    this.setState({
      ...this.state,
      validationAge: validationAge,
      validationGender: validationGender,
      validationIntroduce: validationIntroduce,
      validationMomentum: validationMomentum,
      validationUserWord: validationUserWord,
    });

    // if (validationAge || validationGender || validationIntroduce || validationMomentum || validationUserWord) {
    //   return;
    // }

    this.setState({apiLoading: true});
    const challengeProduct = this.props.screenState.selectedChallengeProduct;
    const memberIdx = await CommonUtil.getMemberIdx();
    // const aPIsDomain = !CommonUtil.isEmpty(this.props.myInterestCodeOne) && typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
    const url = SERVICES[this.props.myClassServiceID].apiDomain + '/v1/myClass/mission/challenge/' + memberIdx + '/' + challengeProduct.memberProductIdx;
    const formData = new FormData();
    formData.append('age', this.state.age);
    formData.append('gender', this.state.gender);
    formData.append('desc1', this.state.introduce);
    formData.append('desc2', this.state.momentum);
    formData.append('desc2', this.state.userWord);
    formData.append('startType', this.state.startType === 'now' ? 0 : 1);
    const options = {
      method: challengeProduct.isChallengeApply ? 'PUT' : 'POST',
      headers: {
        ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
      },
      body: formData,
      // body: JSON.stringify({
      //   age: this.state.age,
      //   gender: this.state.gender,
      //   desc1: this.state.introduce,
      //   desc2: this.state.momentum,
      //   desc3: this.state.userWord,
      //   startType: this.state.startType === 'now' ? 0 : 1,
      // })
    };
    await CommonUtil.callAPI(url, options, 10000)
      .then(response => {
        if (response && response.code === '0000') {
          this.updateChallengeProduct();
          this.setState({apiLoading: false});
          this.props.screenState.closeModal();
        } else {
          this.setState({apiLoading: false});
          response.message
            ? Alert.alert('', response.message)
            : Alert.alert('', '도전 신청 실패');
        }
      })
      .catch(error => {
        this.setState({apiLoading: false});
        Alert.alert('', '시스템 오류');
      });
  };

  // 강좌목록에서 10분의 기적 강좌의 도전 정보 수정
  updateChallengeProduct = async () => {
    const classList = [...this.props.screenState.classList];
    const challengeProduct = classList ? classList.find(element => { return element.missionType === 'challenge' }) : {};
    classList.map(item => {
      if (item.missionType === 'challenge') {
        item.challengeRetryCount = item.challengeRetryCount ? item.challengeRetryCount : 0;
        item.challengeRetryCount = item.isChallengeApply === 'true' ? item.challengeRetryCount + 1 : item.challengeRetryCount;
        item.isChallengeApply = true;
        item.challengeStartDatetime = this.state.startType === 'now' ? moment().format('YYYY-MM-DD HH:mm:ss') : moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss');
      } 
      return item;
    });
    this.props.screenState.updateClassList(classList);
  };

  validationCheck = () => {
    let flag = false;
    if (this.state.age !== 0 && 
      (!this.state.validationAge && !this.state.validationGender && !this.state.validationIntroduce && !this.state.validationMomentum && !this.state.validationUserWord)) 
    {
      flag = true;
    } else {
      flag = false;
    }

    this.setState({
      enableStartBtn: flag,
    });
  };
  
  render() {
    // const {selectedChallengeProduct} = this.props.screenState;
    return (
      <View style={[styles.container]}>
        {this.state.apiLoading && (
          <View style={{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, backgroundColor: 'transparent', zIndex: 1}}>
            <ActivityIndicator
              style={{position: 'absolute', top: SCREEN_HEIGHT/3, alignSelf: 'center', zIndex: 2}}
              size="large"
            />
          </View>
        )}
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: PixelRatio.roundToNearestPixel(15), borderBottomColor: '#e8e8e8', borderBottomWidth: 1, marginTop: -16}}>
          <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(18), lineHeight: 18 * 1.42, color: '#222222', letterSpacing: -0.9}}>도전 신청서</CustomTextR>
          <View style={{borderRadius: 18, borderWidth: 1, borderColor: '#28a5ce', marginLeft: 10, paddingHorizontal: 11, paddingVertical: 4}}>
            <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(12), lineHeight: 12 * 1.42, color: '#28a5ce', letterSpacing: -0.9}}>10분의 기적 챌린지</CustomTextR>
          </View>
          <TouchableOpacity onPress={() => this.props.screenState.closeModal()} style={{position: 'absolute', right: 17}}>
            <Image source={require('../../../assets/icons/btn_close_pop.png')} style={{width: 16, height: 16}} />
          </TouchableOpacity>
        </View>
        <ScrollView style={{paddingVertical: 29, paddingHorizontal: 20}}>
            <CustomTextM style={styles.subjectText}>도전자 정보</CustomTextM>
            <View style={{flexDirection: 'row'}}>
              <Select2MyClass
                isSelectSingle
                style={[styles.selectbox, this.state.validationAge && styles.selectboxOn]}
                selectedTitleStyle={[styles.selectedTitleText, this.state.validationAge && styles.selectedTitleTextOn]}
                rightIcon={<Image source={this.state.validationAge ? require('../../../assets/icons/btn_select_open_selected.png') : require('../../../assets/icons/btn_select_open.png')} style={{position: 'absolute', right: 10, width: 12, height: 12}} />}
                showSearchBox={false}
                colorTheme={COMMON_STATES.baseColor}
                popupTitle="나이를 선택해 주세요."
                title="나이"
                cancelButtonText="취소"
                selectButtonText="선택"
                searchPlaceHolderText="검색어를 입력하세요"
                listEmptyTitle="일치하는 결과가 없습니다"
                data={AGE}
                onSelect={data => {
                  this.selectAge(data);
                }}
                onRemoveItem={data => {
                  console.log('onRemoveItem : ', data);
                  // mockClassStatus[0].checked = true;
                }}
              />
              <View style={{height: 0, width: 10}}></View>
              <Select2MyClass
                isSelectSingle
                style={[styles.selectbox, this.state.validationGender && styles.selectboxOn]}
                selectedTitleStyle={[styles.selectedTitleText, this.state.validationGender && styles.selectedTitleTextOn]}
                rightIcon={<Image source={this.state.validationGender ? require('../../../assets/icons/btn_select_open_selected.png') : require('../../../assets/icons/btn_select_open.png')} style={{position: 'absolute', right: 10, width: 12, height: 12}} />}
                showSearchBox={false}
                colorTheme={COMMON_STATES.baseColor}
                popupTitle="성별를 선택해 주세요."
                title="성별"
                cancelButtonText="취소"
                selectButtonText="선택"
                searchPlaceHolderText="검색어를 입력하세요"
                listEmptyTitle="일치하는 결과가 없습니다"
                data={GENDER}
                onSelect={data => {
                  this.selectGender(data);
                }}
                onRemoveItem={data => {
                  console.log('onRemoveItem : ', data);
                  // mockClassStatus[0].checked = true;
                }}
              />
            </View>
            <View style={{marginTop: 7}}>
              {(this.state.validationAge || this.state.validationGender) && (
                <CustomTextR style={styles.validateText}>도전자 정보를 체크해 주세요</CustomTextR>
                )}
            </View>

            <View style={styles.inputRow}>
              <CustomTextM style={styles.subjectText}>간단한 자기소개</CustomTextM>
              <TextInput placeholder="최대 100자" maxLength={100} style={[styles.formInput, this.state.validationIntroduce && styles.borderOn]} inputTextStyle={styles.inputText} onChangeText={text => this.changeText(text, 'introduce')} value={this.state.introduce} />
              <View style={{marginTop: 7}}>
                {this.state.validationIntroduce && (
                  <CustomTextR style={styles.validateText}>자기소개를 입력해 주세요.</CustomTextR>
                  )}
              </View>
            </View>

            <View style={styles.inputRow}>
              <CustomTextM style={styles.subjectText}>10분의 기적 챌린지에 도전하게 된 계기는?</CustomTextM>
              <TextInput placeholder="최대 100자" maxLength={100} style={[styles.formInput, this.state.validationMomentum && styles.borderOn]} inputTextStyle={styles.inputText} onChangeText={text => this.changeText(text, 'momentum')} value={this.state.momentum} />
              <View style={{marginTop: 7}}>
                {this.state.validationMomentum && (
                  <CustomTextR style={styles.validateText}>도전 계기를 입력해 주세요.</CustomTextR>
                  )}
              </View>
            </View>

            <View style={styles.inputRow}>
              <CustomTextM style={styles.subjectText}>10분의 기적 챌린지에 도전하는 각오 한마디!</CustomTextM>
              <TextInput placeholder="최대 100자" maxLength={100} style={[styles.formInput, this.state.validationUserWord && styles.borderOn]} inputTextStyle={styles.inputText} onChangeText={text => this.changeText(text, 'userWord')} value={this.state.userWord} />
              <View style={{marginTop: 7}}>
                {this.state.validationUserWord && (
                  <CustomTextR style={styles.validateText}>도전 각오를 입력해 주세요.</CustomTextR>
                  )}
              </View>
            </View>

            <View style={[styles.inputRow, {marginBottom: 80}]}>
              <CustomTextM style={styles.subjectText}>도전 시작일자</CustomTextM>
              <View style={{borderRadius: 4, backgroundColor: '#f5f7f8', padding: 15}}>
              <CustomTextR styel={{fontSize: PixelRatio.roundToNearestPixel(12), lineHeight: 15, letterSpacing: -0.6, color: '#888888', borderWidth: 1}}>
              바로 시작 선택 시, 도전 시작하기 버튼을 누른 일자로부터 
              미션이 시작됩니다. 따라서, 신청서 제출 후 강의수강, 학습일기 
              제출이 필요한 점 참고 바랍니다.
              </CustomTextR>
              </View>

              <View style={{marginTop: 15, flexDirection: 'row'}}>
                <CheckBox
                  title="바로 시작"
                  checked={this.state.startType === 'now'}
                  onPress={() => this.setState({startType: 'now'})}
                  containerStyle={styles.checkboxContainer}
                  textStyle={styles.checkboxText}
                  checkedIcon={<Image source={require('../../../assets/icons/btn_radio_on.png')} style={{width: 23, height: 23}} />}
                  uncheckedIcon={<Image source={require('../../../assets/icons/btn_radio_off.png')} style={{width: 23, height: 23}} />}
                />
                {(moment(this.props.screenState.selectedChallengeProduct.takeCourseEndDatetime).diff(moment(), 'days') + 2) >= this.props.screenState.selectedChallengeProduct.challengeConditionDays && (
                  <CheckBox
                    title="1일 후 시작"
                    checked={this.state.startType === 'day'}
                    onPress={() => this.setState({startType: 'day'})}
                    containerStyle={styles.checkboxContainer}
                    textStyle={styles.checkboxText}
                    checkedIcon={<Image source={require('../../../assets/icons/btn_radio_on.png')} style={{width: 23, height: 23}} />}
                    uncheckedIcon={<Image source={require('../../../assets/icons/btn_radio_off.png')} style={{width: 23, height: 23}} />}
                  />
                  )}
              </View>
            </View>
        </ScrollView>
        <View>
          <TouchableOpacity style={[styles.bottomBtn, this.state.enableStartBtn && styles.bottomBtnOn]} onPress={() => this.startChallenge()}>
            <CustomTextM style={styles.bottomBtnText}>도전 시작하기</CustomTextM>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  font12: {fontSize: 12},
  font14: {fontSize: 14},
  font16: {fontSize: 16},
  flexDirRow: {flexDirection: 'row'},
  flexDirCol: {flexDirection: 'column'},
  spaceWidth5: {width: 5},
  subjectText: {
    fontSize: PixelRatio.roundToNearestPixel(14), fontWeight: '500', lineHeight: 14 * 1.42, letterSpacing: -0.7, color: '#222', marginBottom: 9
  },
  inputRow: {
    marginTop: 29,
  },
  selectbox: {
    flex: 1, borderWidth: 1, borderRadius: 4, borderColor: '#d8d8d8', paddingVertical: 12
  },
  selectboxOn: {
    borderColor: '#28a5ce'
  },
  selectedTitleText: {
    fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyRegular,
    fontSize: PixelRatio.roundToNearestPixel(14),
    lineHeight: 14 * 1.42,
    letterSpacing: -0.7,
    marginLeft: 16,
    color: '#bbbbbb',
  },
  selectedTitleTextOn: {
    color: '#28a5ce',
  },
  bottomBtn: {
    height: SCREEN_HEIGHT * 0.1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#222222'
  },
  bottomBtnOn: {
    backgroundColor: '#28a5ce',
  },
  bottomBtnText: {
    fontSize: PixelRatio.roundToNearestPixel(18),
    lineHeight: 18 * 1.42,
    fontWeight: "bold",
    letterSpacing: -0.9,
    color: '#ffffff',
  },
  validateText: {
    fontSize: PixelRatio.roundToNearestPixel(11),
    lineHeight: 11 * 1.42,
    lineHeight: 18,
    letterSpacing: -0.55,
    color: '#28a5ce',
  },
  formInput: {
    borderWidth: 1, borderRadius: 4, borderColor: '#d8d8d8', paddingVertical: 13, paddingLeft: 16, paddingRight: 10,
  },
  borderOn: {
    borderColor: '#28a5ce'
  },
  inputText: {
    fontSize: PixelRatio.roundToNearestPixel(14),
    lineHeight: 14 * 1.42,
    letterSpacing: -0.7,
  },
  checkboxContainer: {
    padding: 0,
    margin: 0,
    flex: 1,
    borderWidth: 0,
    backgroundColor: '#fff',
  },
  checkboxText: {
    fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyRegular,
    fontSize: PixelRatio.roundToNearestPixel(14),
    lineHeight: 14 * 1.42,
    letterSpacing: -0.7,
    color: '#222',
    fontWeight: 'normal',
  },
});

const mapStateToProps = state => {
  return {
    myClassServiceID: state.GlabalStatus.myClassServiceID,
    myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,
  };
};

export default connect(mapStateToProps, null)(ChallengeApplyScreen);
