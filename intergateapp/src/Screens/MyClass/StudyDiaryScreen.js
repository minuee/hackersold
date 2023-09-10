import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
  PixelRatio,
  Dimensions,
  Linking,
  LayoutAnimation,
  UIManager,
  Image,
  TextInput,
} from 'react-native';
import {Input} from 'react-native-elements';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// import ActionCreator from '../../Ducks/Actions/MainActions';
import moment from 'moment';
import Toast from 'react-native-tiny-toast';

// import MyClassFilterScreen from './MyClassFilterScreen';
// import ClassDetailScreen from './ClassDetailScreen';
// import AttendCalendar from './AttendCalendar';

import Select2MyClass from '../../Utils/Select2MyClass';
import CommonUtil from '../../Utils/CommonUtil';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

//공통상수
import COMMON_STATES, {SERVICES} from '../../Constants/Common';
import * as getDEFAULT_CONSTANTS from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import {CustomText, CustomTextR, CustomTextB, CustomTextL, CustomTextM, CustomTextDL, TextRobotoM, TextRobotoR} from '../../Style/CustomText';

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

class StudyDiaryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpandDiaryList: false,
      expandAnim: new Animated.Value(0),
      diaryList: [],
      registUrl: '',
      memberIdx: 0,
      apiDomain: '',
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  async UNSAFE_componentWillMount() {
    const memberIdx = await CommonUtil.getMemberIdx();
    await this.setState({
      memberIdx: memberIdx,
      apiDomain: SERVICES[this.props.myClassServiceID].apiDomain,
    });

    // const aPIsDomain = !CommonUtil.isEmpty(this.props.myInterestCodeOne) && typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
    const url = this.state.apiDomain + '/v1/myClass/mission/challenge/diary/' + memberIdx + '/' + this.props.screenState.selectedChallengeProduct.memberProductIdx;
    const options = {
      method: 'GET',
      headers: {
        ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
      },
    };
    await CommonUtil.callAPI(url, options, 10000)
      .then(response => {
        if (response && response.code === '0000') {
          // this.setState({apiLoading: false, lectureLoading: false});
          this.setState({
            diaryList: response.data.diary,
          });
        } else {
          // this.setState({apiLoading: false, lectureLoading: false});
          response.message
            ? Toast.show(response.message)
            : Toast.show('로딩 실패');
        }
      })
      .catch(error => {
        // this.setState({apiLoading: false, lectureLoading: false});
        Toast.show('시스템 에러');
      });
  }

  expandDiaryList() {
    this.setState({
      isExpandDiaryList: !this.state.isExpandDiaryList,
    });
  }

  setMaxHeight(event) {
    this.setState({
      maxHeight: event.nativeEvent.layout.height,
    });
  }

  setMinHeight(event) {
    this.setState({
      minHeight: event.nativeEvent.layout.height,
    });
  }

  toggle() {
    let initialValue = this.state.isExpandDiaryList? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
    finalValue = this.state.isExpandDiaryList? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

    this.setState({
      isExpandDiaryList: !this.state.isExpandDiaryList,
    });

    this.state.expandAnim.setValue(initialValue);
    Animated.spring(this.state.expandAnim, {
      toValue: finalValue,
    }).start();
  }

  expand() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ isExpandDiaryList: !this.state.isExpandDiaryList });
  }

  // 학습일기 등록
  registDiary = async () => {
    // const memberIdx = await CommonUtil.getMemberIdx();
    // const aPIsDomain = !CommonUtil.isEmpty(this.props.myInterestCodeOne) && typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
    const url = this.state.apiDomain + '/v1/myClass/mission/challenge/diary/' + this.state.memberIdx + '/' + this.props.screenState.selectedChallengeProduct.memberProductIdx;
    const formData = new FormData();
    formData.append('url', this.state.registUrl);
    const options = {
      method: 'POST',
      headers: {
        ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
      },
      body: formData,
    };
    await CommonUtil.callAPI(url, options, 10000)
      .then(response => {
        if (response && response.code === '0000') {
          const arr = [...this.state.diaryList];
          const n = moment().diff(moment(this.props.screenState.selectedChallengeProduct.challengeStartDatetime), 'days') + 1;
          const maxNo = Math.max.apply(Math, diaryList.map(item => {return item.no;}));
          const newObj = {no: (maxNo + 1), title: n + '일차 학습일기', regDatetime: moment().format('YYYY-MNM-DD HH:mm:ss'), diaryUrl: this.state.registUrl, certStatus: '인증대기'};
          arr.push(newObj);
          this.setState({
            diaryList: arr,
          });
        } else {
          // this.setState({apiLoading: false, lectureLoading: false});
          response.message
            ? Toast.show(response.message)
            : Toast.show('로딩 실패');
        }
      })
      .catch(error => {
        // this.setState({apiLoading: false, lectureLoading: false});
        Toast.show('시스템 에러');
      });
  }

  onChangeText = text => {
    this.setState({registUrl: text});
  };

  render() {
    const {selectedChallengeProduct} = this.props.screenState;
    return (
      <View style={{paddingHorizontal: 20, paddingTop: 29, paddingBottom: 30}}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <Image source={require('../../../assets/icons/icon_exclamation_bk.png')} style={{width: 16, height: 16, marginRight: 5}} />
          <CustomTextM style={{color: '#444', fontSize: PixelRatio.roundToNearestPixel(13), lineHeight: 13 * 1.42, fontWeight: '500', letterSpacing: -0.98}}>꼭 확인해주세요!</CustomTextM>
        </View>
        <CustomTextR style={{fontSize: 13, lineHeight: 18, letterSpacing: -0.65, color: '#666666'}}>
        · 학습일기는 1일 1회 지정된 게시판에서 작성이 필요합니다.{'\n'}
        {'    '}(지정 게시판 : #게시판 명#){'\n'}
        · 잘못된 학습일기 URL 제출 혹은 새로운 학습일기 {'\n'}
        · URL로 변경을 희망하실 경우, 제출 일자로부터 24시간 이내에{'\n'}
        {'    '}#고객센터#로 URL을 제출해주세요.{'\n'}
        </CustomTextR>
        {/* 해커스톡에서만 노출 */}
        <TouchableOpacity 
          onPress={() => {Linking.openURL('https://m.cafe.naver.com/allkillenglish/menu/1830')}} 
          style={{paddingVertical: 9, backgroundColor: '#fff', borderRadius: 4, borderWidth: 1, borderColor: '#cccccc', justifyContent: 'center', alignItems: 'center', marginBottom: 6}}>
          <CustomTextM style={{fontSize: PixelRatio.roundToNearestPixel(14), lineHeight: 14 * 1.42, fontWeight: '500', letterSpacing: -0.7, color: '#444'}}>학습일기 작성 및 제출 방법 확인하기</CustomTextM>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {Linking.openURL('https://mchamp.hackers.com/?r=champstudy&m=bbs&bid=faq&uid=30135&s=2')}} 
          style={styles.btnPrimary}>
          <CustomTextM style={styles.btnPrimaryText}>학습일기 작성하러 가기</CustomTextM>
        </TouchableOpacity>
        <View style={{backgroundColor: '#d8d8d8', width: '100%', height: 1, marginTop: 20, marginBottom: 18}}></View>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 13}}>
          <Image source={require('../../../assets/icons/icon_my_diary_write.png')} style={{width: 16, height: 16, marginRight: 5}} />
          <CustomTextM style={{fontSize: PixelRatio.roundToNearestPixel(13), fontWeight: '500', letterSpacing: -0.98, color: '#444'}}>학습일기 등록</CustomTextM>
        </View>
        <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(13), lineHeight: 18, letterSpacing: -0.65, color: '#666666'}}>
        · 제목 : {moment().diff(moment(selectedChallengeProduct.takeCourseBeginDatetime), 'days') + 1}일차 학습일기{'\n'}
        · 날짜 : {moment().year()}년 {moment().month() + 1}월 {moment().date()}일
        </CustomTextR>
        <View>
          {/* <Input placeholder="작성한 학습일기 URL을 제출해주세요" inputStyle={{fontSize: PixelRatio.roundToNearestPixel(14)}} inputContainerStyle={{width: '100%', borderWidth: 1, marginHorizontal: -10, padding: 0}} containerStyle={{padding: 0, margin: 0, borderWidth: 1, borderColor: 'red'}} /> */}
          <View style={{borderWidth: 1, borderRadius: 4, borderColor: '#d8d8d8', marginBottom: 6, marginTop: 15, justifyContent: 'center'}}>
            <TextInput placeholder="작성한 학습일기 URL을 제출해주세요" style={{fontSize: PixelRatio.roundToNearestPixel(14), paddingVertical: 10, paddingHorizontal: 10}} onChangeText={text => this.onChangeText()} />
          </View>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => this.registDiary()}>
            <CustomTextM style={styles.btnPrimaryText}>등록하기</CustomTextM>
          </TouchableOpacity>
        </View>
        <View style={{backgroundColor: '#d8d8d8', width: '100%', height: 1, marginTop: 20, marginBottom: 18}}></View>
        <View>
          {/* <TouchableOpacity onPress={() => this.expand()}> */}
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 18}} onLayout={event => this.setMinHeight(event)}>
              <Image source={require('../../../assets/icons/icon_my_diary_list.png')} style={{width: 16, height: 16, marginRight: 5}} />
              <CustomTextM style={{fontSize: PixelRatio.roundToNearestPixel(13), fontWeight: '500', letterSpacing: -0.98, color: '#444', marginRight: 10}}>학습일기 리스트</CustomTextM>
              {/* <Icon name={this.state.isExpandDiaryList ? 'angle-up' : 'angle-down'} size={Platform.OS === 'ios' ? 20 : 15} color="#999" /> */}
            </View>
          {/* </TouchableOpacity> */}

          {/* <View style={{ height: this.state.isExpandDiaryList ? null : 0, overflow: 'hidden' }}> */}
          <View>
            {this.state.diaryList &&
                this.state.diaryList
                    .sort((a, b) => { return moment(b.regDatetime).format('X') - moment(a.regDatetime).format('X') })
                    .map((item, index) => {
                        return (
                            <View style={{backgroundColor: '#f5f7f8', paddingTop: 14, paddingBottom: 16, paddingLeft: 14, paddingRight: 9, borderRadius: 4, marginBottom: 5}} key={item.no}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <CustomTextB style={{fontSize: PixelRatio.roundToNearestPixel(12), lineHeight: 10 * 1.72, fontWeight: 'bold', letterSpacing: -0.9, color: item.certStatus === '인증성공' ? '#28a5ce' : '#aaaaaa'}}>{item.certStatus}</CustomTextB>
                                    {index === 0 && (
                                        <View style={{borderColor: '#ed8127', borderRadius: 8.5, borderWidth: 1, paddingVertical: 2, paddingHorizontal: 10, justifyContent: 'center'}}>
                                            <CustomTextM style={{fontSize: PixelRatio.roundToNearestPixel(10), lineHeight: 10 * 1.42, fontWeight: '500', letterSpacing: -0.75, color: '#ed8127'}}>최근등록</CustomTextM>
                                        </View>
                                    )}
                                </View>
                                <CustomTextR style={{marginTop: 8, fontSize: PixelRatio.roundToNearestPixel(14), lineHeight: 14 * 1.42, letterSpacing: -0.7, color: '#444'}}>[{selectedChallengeProduct.className}] {item.title}</CustomTextR>
                                <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(13), lineHeight: 14 * 1.42, color: '#bbbbbb', marginTop: 8}}>{item.diaryUrl}</CustomTextR>
                            </View>);
                    })
            }
            {(CommonUtil.isEmpty(this.state.diaryList) || this.state.diaryList.length === 0) && (
                <View style={{backgroundColor: '#f5f7f8', paddingTop: 14, paddingBottom: 16, paddingLeft: 14, paddingRight: 9, borderRadius: 4, marginBottom: 5, justifyContent: 'center'}}>
                  <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(12)}}>등록된 학습일기가 없습니다.</CustomTextR>
                </View>
              )}
          </View>
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  btnPrimary: {
    paddingVertical: 9, backgroundColor: '#28a5ce', borderRadius: 4, borderWidth: 1, borderColor: '#28a5ce', justifyContent: 'center', alignItems: 'center'
  },
  btnPrimaryText: {
    fontSize: PixelRatio.roundToNearestPixel(14), fontWeight: '500', letterSpacing: -0.7, color: '#fff', lineHeight: 14 * 1.42
  },
});

const mapStateToProps = state => {
  return {
    myClassServiceID: state.GlabalStatus.myClassServiceID,
    myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,
  };
};

export default connect(mapStateToProps, null)(StudyDiaryScreen);