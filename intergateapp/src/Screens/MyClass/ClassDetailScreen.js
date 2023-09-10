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
  // Modal,
  Dimensions,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
  Image,
  BackHandler,
  Linking,
} from 'react-native';
import {Body, Header, List, ListItem as Item, ScrollableTab, Tab, TabHeading, Tabs, Title} from 'native-base';
import {connect} from 'react-redux';
import moment from 'moment';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Modal from 'react-native-modal';
import { isIphoneX, } from "react-native-iphone-x-helper";
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-tiny-toast';

import StudyFileScreen from './addon/StudyFileScreen'; // 학습자료
import ExtendsScreen from './addon/ExtendsScreen'; // 수강연장
import TempStopScreen from './addon/TempStopScreen'; // 일시정지
import CertScreen from './addon/CertScreen'; // 증명서

import MyQnaWriteModal2 from './Modal/MyQnaWriteModal2'; // 새생님께 질문 작성 폼 모달
import MyMemoWriteModal2 from './Modal/MyMemoWriteModal2'; // 메모 작성 폼 모달
import PickerLecModal2 from './Modal/PickerLecModal2'; // 선생님께 질문 & 메모장 강좌 선택 모달
import PickerLecKangModal2 from './Modal/PickerLecKangModal2'; // 선생님께 질문 & 메모장 강의 선택 모달
// 작성 모달만 사용하고 나머지 사용 안함
import MyQnaModifyModal from './Modal/MyQnaModifyModal'; // 선생님께 질문 수정 폼 모달
import MyQnaCompleteModal from './Modal/MyQnaCompleteModal'; // 선생님께 질문 완료 모달

import MyClassStyles from '../../Style/MyClass/MyClassStyle';
import {CustomText, CustomTextL, CustomTextDL, CustomTextR, CustomTextM, CustomTextB, TextRobotoL, TextRobotoR, TextRobotoM, TextRobotoB} from '../../Style/CustomText';

import { TARGET, ARTICLE } from './Modal/ModalConstant';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFunction from '../../Utils/CommonFunction';
// import Icon from 'react-native-vector-icons/FontAwesome';
// Icon.loadFont();
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/Entypo';
Icon2.loadFont();

//공통상수
import COMMON_STATES, {SERVICES} from '../../Constants/Common';
import * as getDEFAULT_CONSTANTS from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const TABBAR_MAX_POSITION = 0;
const TABBAR_MIN_POSITION = -(SCREEN_HEIGHT * 0.1);
const TABBAR_SCROLL_DISTANCE = TABBAR_MAX_POSITION - TABBAR_MIN_POSITION;
const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight : getStatusBarHeight();
const abortController = new AbortController();

// Modal
const HEIGHT_WRITE_MODAL = SCREEN_HEIGHT * 0.95;
const HEIGHT_MODIFY_MODAL = SCREEN_HEIGHT * 0.95;
const HEIGHT_COMPLETE_MODAL = isIphoneX() ? SCREEN_HEIGHT * 0.90 : SCREEN_HEIGHT * 0.95;
const HEIGHT_LEC_LIST_MODAL = SCREEN_HEIGHT * 0.5;
const HEIGHT_LEC_KANG_LIST_MODAL = SCREEN_HEIGHT * 0.5;
const HEIGHT_WRITE_MEMO_MODAL = SCREEN_HEIGHT * 0.95;

const addonConst = {
    message: {
        tempStop: '일시정지 신청이 불가능한 강좌입니다.',
        extends: '수강연장 신청이 불가능한 강좌입니다.',
        certTakeCourse: '수강증을 제공하지 않는 강좌입니다.',
        certAttend: '출석 확인증을 제공하지 않는 강좌입니다.',
    },
};

class ClassDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            apiLoading: false,
            currentTabarPosition: TABBAR_MAX_POSITION,
            scrollY: new Animated.Value(0),
            classList: props.screenState.classList,
            classData: props.screenState.selectedClass || {},
            classDetail: props.screenState.selectedClassDetail || {},
            selectedLecture: [],
            isShowModal: false,
            modalContent: '',
            isSelectable: false,
            selectedTabIndex: 0,
            memberIdx: 0,
            apiDomain: '',
            closeModal: this.closeModal.bind(this),
            updateClassData: this.updateClassData.bind(this),

            // 선생님께 질문 modal
            showWriteModal: false,
            toggleWriteModal: this.toggleWriteModal.bind(this),

            // 메모장 모달
            showWriteMemoModal: false,
            toggleWriteMemoModal: this.toggleWriteMemoModal.bind(this),

            // 수강연장
            extendsCourse: this.extendsCourse.bind(this),

            myClassServiceID: this.props.myClassServiceID,
        };

        // this.scrollDirection = 'DOWN';
        this.scrollViewStartOffsetY = 0;
        this.tabarPosition = 0;
    }

    async UNSAFE_componentWillMount() {
        const memberIdx = await CommonUtil.getMemberIdx();
        // const aPIsDomain =
        //     (!CommonUtil.isEmpty(this.props.myInterestCodeOne) && typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined')
        //         ? this.props.myInterestCodeOne.info.apiDomain
        //         : DEFAULT_CONSTANTS.apiTestDomain;
        this.setState({
            memberIdx: memberIdx,
            apiDomain: SERVICES[this.props.myClassServiceID].apiDomain,
        });

        (CommonUtil.isEmpty(this.state.classDetail) || Object.keys(this.state.classDetail).length === 0) && this.getClassDetailData();
    }

    getClassDetailData = async () => {
        this.setState({loading: true});
        const signal = abortController.signal;
        const url =
            this.state.apiDomain +
            '/v1/myClass/classDetail/' +
            this.props.screenState.selectedClass.memberClassIdx;
        const options = {
          method: 'GET',
          headers: {
            ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
          },
        };

        console.log('ClassDetailScreen.js > getClassDetailData()', 'url = ' + url)

        CommonUtil.callAPI(url, options, 10000, signal)
            .then(response => {
              //console.log('ClassDetailScreen.js > getClassDetailData()', 'response = ' + JSON.stringify(response))

              if (response && response.code === '0000') {
                  this.setState({
                      classDetail: response.data.class,
                      myQnaLectures: response.data.class.lectures,
                      myQnaSelectedMemberLectureIdx: response.data.class.lectures[0].memberLectureIdx,
                  });
                  this.props.screenState.updateSelectedClassDetail(response.data.class);
                  this.setState({loading: false});
              } else {
                  this.setState({loading: false});
                  response.message
                      ? Alert.alert('', response.message)
                      : Toast.show('강좌 상세정보 불러오기 실패'); //Alert.alert('', '로딩 실패');
              }
            })
            .catch(error => {
                console.log('error : ', error);
                this.setState({loading: false});
                // Alert.alert('Error', '시스템 에러');
            });
    };

    // 외부 앱 열기 (아쿠아플레이어)
    openApp = async (url, storeUrl) => {
        CommonUtil.openApp(url, '', DEFAULT_CONSTANTS.aquaPlayerAppStoreId, 'KO', DEFAULT_CONSTANTS.aquaPlayerAppStoreId);
        // await Linking.openURL(url, storeUrl).catch(error => {
        //         Alert.alert('', '앱을 실행할 수 없거나 설치되지 않았습니다.\n앱스토어로 이동하시겠습니까?', [
        //             {text: '확인', onPress: () => Linking.openURL(storeUrl)},
        //             {text: '취소'},
        //         ]);
        // });
    };

    // 강의 다운로드
    lectureDownload = () => {
        // 다운로드 강좌 여러개인 경우 API 호출로 새로운 url 로딩
        // 다운로드 강좌 1개인 경우 강의 상세 리턴 항목 lectureDownloadURL 이용
        if (this.state.selectedLecture.length === 0) {
            Alert.alert('', '다운로드할 강의를 선택해 주세요.');
        } else {
            // this.openApp(response.data.lectureURL, Platform.OS === 'ios' ? url1 : url2);
            this.startLectureDownload();
        }
    };

    // 여러강의 다운로드 URL
    startLectureDownload = async () => {
        this.setState({apiLoading: true});

        let aPIsDomain = typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        let aPIsAuthKey = typeof this.props.myInterestCodeOne.info.apiKey !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey

        //console.log('ClassDetailScreen > startLectureDownload()', 'aPIsAuthKey = ' + aPIsAuthKey)

        const memberID = await CommonUtil.getMemberID();

        /*
        const formData = new FormData();
        formData.append('classIdx', this.state.classData.memberClassIdx);
        formData.append('lectures', JSON.stringify([...this.state.selectedLecture]));
        formData.append('LmIdxs', JSON.stringify([]));
        formData.append('memberIdx', this.state.memberIdx);
        formData.append('userId', memberID);
        formData.append('os', Platform.OS.toLowerCase());
        const options = {
            method: 'POST',
            body: formData
        };
        */

        const addParam =
            '?classIdx=' + this.state.classData.classIdx
            + '&lectures=' + JSON.stringify([...this.state.selectedLecture])
            //+ '&LmIdxs=' + JSON.stringify([])
            + '&memberIdx=' + this.state.memberIdx
            + '&userId=' + memberID
            + '&os=' + Platform.OS.toLowerCase()

        const url = aPIsDomain + '/v1/myClass/lectureDownload/' + this.state.classData.memberProductIdx + '/' + this.state.classData.memberClassIdx + addParam;
        console.log('ClassDetailScreen > startLectureDownload()', 'url = ' + url)

        await CommonUtil.callAPI(url, null, 10000)
            .then(response => {
                //console.log('ClassDetailScreen > startLectureDownload()', 'response = ' + JSON.stringify(response))

                if (response && response.code === '0000') {
                    // this.setState({apiLoading: false, lectureLoading: false});
                    console.log('response: ', response);
                    this.setState({
                        apiLoading: false,
                    });
                    this.openApp(response.data.lectureURL);
                } else {
                    // this.setState({apiLoading: false, lectureLoading: false});
                    this.setState({apiLoading: false});
                    response.message
                        ? Alert.alert('', response.message)
                        : Alert.alert('', '로딩 실패');
                }
            })
            .catch(error => {
                // this.setState({apiLoading: false, lectureLoading: false});
                console.log('error : ', error);
                this.setState({apiLoading: false});
                Alert.alert('', '시스템 오류');
            });
    };

    onScrollBeginDrag = event => {
        const offsetY = event.nativeEvent.contentOffset.y;
        this.scrollViewStartOffsetY = offsetY;
    };

    lecturePressHandle = (lec, isSelectable) => {
        if (this.state.isSelectable) {
            let arrSelected = this.state.selectedLecture;
            let indexOf = arrSelected.indexOf(lec.memberLectureIdx);
            if (indexOf > -1) {
                arrSelected.splice(indexOf, 1);
            } else {
                arrSelected.push(lec.memberLectureIdx);
            }
            this.setState({
                selectedLecture: arrSelected,
            });
        }
    };

    selectCert = (type, bool1, bool2) => {
        // const btn1 = (bool1) ? {text: '수강 확인증', onPress: () => this.openAddon('certTakeCourse', bool1)} : null;
        // const btn2 = (bool2) ? {text: '출석 확인증', onPress: () => this.openAddon('certAttend', bool2)} : null;
        const btn1 = {text: '수강 확인증', onPress: () => this.openAddon('certTakeCourse', bool1)};
        const btn2 = {text: '출석 확인증', onPress: () => this.openAddon('certAttend', bool2)};

        Alert.alert('', '증명서를 선택해 주세요.', [btn1, btn2, {text: '취소'}],
            {cancelable: true},
        );
    };

    // 부가기능 열기
    openAddon = (type, bool) => {
        // TEST:: 수강연장 테스트
        // if (1) {
        if (bool) {
            if (type === 'extends' && Platform.OS === 'ios') {
                Alert.alert('', 'pc 또는 모바일 웹에서\n수강연장 신청을 진행해주세요.');
                return;
            }
            this.openModal(type);
        } else {
            if (type === 'tempStop' && !CommonUtil.isEmpty(this.state.classDetail.disableTempStopReason)) {
                Alert.alert('', this.state.classDetail.disableTempStopReason);
            } else {
              Alert.alert('', addonConst.message[type]);
            }
        }
    };

    openModal = modalType => {
      this.setState({modalContent: modalType, isShowModal: true});
    };

    closeModal = () => {
        this.setState({modalContent: '', isShowModal: false});
    };

    changeSelectMode = () => {
        if (this.state.isSelectable) {
            this.setState({selectedLecture: []});
        }
        this.setState({isSelectable: !this.state.isSelectable});
    };

    selectAll = () => {
        if (this.state.selectedLecture.length > 0) {
            this.setState({
                selectedLecture: [],
            });
        } else {
            let arrSelected = [];
            this.state.classDetail.lectures.forEach(element => {
                arrSelected.push(element.memberLectureIdx);
            });
            this.setState({
                selectedLecture: arrSelected,
            });
        }
    };

    // 하단 탭 버튼 - 선생님께 질문
    addOnTeacherQuestion = async () => {
      /*
      기획 변경으로 무조건 새로 쓰기로 오픈
      */
      this.toggleWriteModal();
    };

    // 선생님께 질문 글 작성 모달
    renderWriteModal = () => {
      return (
        <Modal
          animationType="slide"
          onRequestClose={() => this.toggleWriteModal()}
          onBackdropPress={() => this.toggleWriteModal()}
          style={styles.commonModalContainer}
          useNativeDriver={true}
          animationInTiming={300}
          animationOutTiming={300}
          hideModalContentWhileAnimating
          isVisible={this.state.showWriteModal}
          onModalHide={() => console.log('onModalHide')}>
          <View style={[
            styles.commonModalWrapper,
            styles.writeModalWrapper,
            ]}>
            <MyQnaWriteModal2 screenState={this.state}/>
          </View>
        </Modal>
      );
    };

    // 선생님께 질문 작성 모달 toggle
    toggleWriteModal = async (targetFrom = TARGET.FROM_NONE) => {
      this.setState({
        // parentModal: this.state.showWriteModal ? '' : 'MyQna',
        showWriteModal: !this.state.showWriteModal,
        toggleTargetFrom: targetFrom,
      });
      /*
      // 기존 기획안: 임시저장 여부 체크
      if (this.state.showWriteModal && targetFrom === TARGET.FROM_NONE && (!CommonUtil.isEmpty(this.state.typedTitle) || !CommonUtil.isEmpty(this.state.typedContent))) {
        this.tempSaveProcess(targetFrom);
        // Alert.alert(
        //     "",
        //     "작성중 상태입니다. \n임시저장하시겠습니까?(파일제외)",
        //     [
        //         {text: '네', onPress: () => this.tempSaveProcess(targetFrom)},
        //         {text: '아니오', onPress: () => {
        //             AsyncStorage.removeItem('myQnaTemp');
        //             this.setState({
        //                 showWriteModal: false,
        //                 toggleTargetFrom: targetFrom,
        //             });
        //         }},
        //     ],
        //     { cancelable: false }
        // );
      } else {
        this.setState({
          showWriteModal: false,
          toggleTargetFrom: targetFrom,
        });
      }

      if (!this.state.showWriteModal && targetFrom !== TARGET.FROM_REOPEN) {
        await this.getHistory(targetFrom);
      } else if (!this.state.showWriteModal && targetFrom === TARGET.FROM_REOPEN) {
        this.setState({
          showWriteModal: !this.state.showWriteModal,
          toggleTargetFrom: targetFrom,
        });
      }
      */
    };

    // 토글 메모장 모달
    toggleWriteMemoModal = (targetFrom = TARGET.FROM_NONE) => {
        this.setState({
            // parentModal: this.state.showWriteModal ? '' : 'MyMemo',
            showWriteMemoModal: !this.state.showWriteMemoModal,
            toggleTargetFrom: targetFrom,
        });
    };

    renderWriteMemoModal = () => {
      return (
        <Modal
          animationType="slide"
          onRequestClose={() => this.toggleWriteMemoModal()}
          onBackdropPress={() => this.toggleWriteMemoModal()}
          style={styles.commonModalContainer}
          useNativeDriver={true}
          animationInTiming={300}
          animationOutTiming={300}
          hideModalContentWhileAnimating
          isVisible={this.state.showWriteMemoModal}
          onModalHide={() => console.log('onModalHide')}>
          <View style={[styles.commonModalWrapper, styles.writeMemoModalWrapper]}>
            <MyMemoWriteModal2 screenState={this.state} />
          </View>
        </Modal>
      );
    };

    getModalContent = modalContent => {
      if (CommonUtil.isEmpty(modalContent)) {
        return;
      }
      // certTakeCourse certAttend
      switch (modalContent) {
        case 'studyFile':
          return <StudyFileScreen screenState={this.state} />;
        case 'extends':
          return <ExtendsScreen screenState={this.state} />;
        case 'tempStop':
          return <TempStopScreen screenState={this.state} />;
        case 'certTakeCourse':
        case 'certAttend':
          return <CertScreen screenState={this.state} />;
        // case 'teacherQuestionWrite':
        //   return <MyQnaWriteModal2 screenState={this.state} />;
        // case 'teacherQuestionModify':
        //   return <MyQnaModifyModal screenState={this.state} />;
        // case 'teacherQuestionComplete':
        //   return <MyQnaCompleteModal screenState={this.state} />;
        // case 'teacherQuestionPickerLec':
        //   return <PickerLecModal2 screenState={this.state} />;
        // case 'teacherQuestionPickerLecKang':
        //   return <PickerLecKangModal2 screenState={this.state} />;
      }
    };

    // 재수강 신청
    retakeCourse = () => {
        // TEST:: 재수강 결제
        // if (1) {
        if (this.state.classDetail.isEnableRetake) {
            if (Platform.OS === 'ios') {
                Alert.alert('', 'pc 또는 모바일 웹에서\n재수강 신청을 진행해주세요.');
                return;
            }
            this.props.screenState.closeModal();
            this.props.screenState.doRetakeCourse();
            // TEST
            // this.props.screenState.doRetakeCourseTest();
        } else {
            Alert.alert('', '재수강이 불가능한 강좌입니다.');
        }
    };

    // 수강연장 결제: ExtendsScreen -> ClassDetailScreen -> MyLectureScreen
    extendsCourse = selectedExtendsProduct => {
        this.props.screenState.closeModal();
        this.props.screenState.doExtendsCourse(selectedExtendsProduct);
    };

    // 수강후기 작성
    goWriteReview = () => {
      this.props.screenState.closeModal();
      this.props.screenState.goWriteReview();
    };

    // 일시정지 신청 등으로 강좌 정보 변경된 경우 update
    updateClassData = async classData => {
        // this.classData = classData;
        await this.setState({
          classData: classData,
        });
        return true;
    };

    // 수강연장 모달에서 신청 -> 모달 닫고 결제 화면으로 이동
    // extendtakeCourse = () => {
    //   this.props.screenState.closeModal();
    //   this.props.screenState.doExtendtakeCourse();
    // };

    render() {
        if (this.state.loading) {
            return (<View style={MyClassStyles.IndicatorContainer}><ActivityIndicator size="large" /></View>);
        } else {
            return (
                <View style={styles.container}>
                    <View style={styles.wrapper}>
                        <View style={styles.defaultContainer}>
                            {/* <View style={styles.topClosebtnSection}>
                                <TouchableOpacity style={styles.closeBtn} onPress={() => this.props.closePressHandle()}>
                                    <Icon2 name="chevron-thin-down" size={15} color={DEFAULT_CONSTANTS.base_color_222} />
                                </TouchableOpacity>
                            </View> */}
                            <View style={styles.topTitleSection}>
                                <CustomTextM style={styles.titleClassNameText}>{this.state.classDetail.className}</CustomTextM>
                            </View>
                            <View style={styles.topTeacherSection}>
                                <CustomTextR style={styles.topTeacherText}>{this.state.classDetail.teacherName}</CustomTextR>
                            </View>
                        </View>

                        <Animated.ScrollView
                            style={styles.bodyScroll}
                            scrollEventThrottle={16}
                            onScroll={Animated.event(
                              [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                              // { useNativeDriver: true },
                              {
                                  listener: event => {
                                      // this.onScrollHandle;
                                      const offsetY = event.nativeEvent.contentOffset.y;
                                      if (this.scrollViewStartOffsetY > offsetY && this.tabarPosition) {
                                          // this.scrollDirection = 'DOWN';
                                          const pos = this.tabarPosition.__getValue();
                                          if (parseInt(pos) <= parseInt(TABBAR_MIN_POSITION)) {
                                              this.tabarPosition = this.state.scrollY.interpolate({
                                                  inputRange: [this.scrollViewStartOffsetY-TABBAR_SCROLL_DISTANCE, this.scrollViewStartOffsetY],
                                                  outputRange: [TABBAR_MAX_POSITION, TABBAR_MIN_POSITION],
                                                  extrapolate: 'clamp',
                                              });
                                          }
                                      } else if (this.scrollViewStartOffsetY < offsetY) {
                                          // this.scrollDirection = 'UP';
                                          const pos = (this.tabarPosition === 0) ? 0 : parseInt(this.tabarPosition.__getValue());
                                          if (pos > parseInt(TABBAR_MIN_POSITION)) {
                                              this.tabarPosition = this.state.scrollY.interpolate({
                                                  inputRange: [this.scrollViewStartOffsetY, this.scrollViewStartOffsetY + TABBAR_SCROLL_DISTANCE],
                                                  outputRange: [TABBAR_MAX_POSITION, TABBAR_MIN_POSITION],
                                                  extrapolate: 'clamp',
                                              });
                                          } else {
                                              this.tabarPosition = this.state.scrollY.interpolate({
                                                  inputRange: [0, TABBAR_SCROLL_DISTANCE],
                                                  outputRange: [TABBAR_MAX_POSITION, TABBAR_MIN_POSITION],
                                                  extrapolate: 'clamp',
                                              });
                                          }
                                      }
                                      this.setState({
                                          currentTabarPosition: offsetY,
                                      });
                                  },
                              })}
                            onScrollBeginDrag={this.onScrollBeginDrag}
                            onScrollEndDrag={this.onScrollEndDrag}>
                            <View style={styles.defaultContainer}>
                                <View style={styles.topInfoSection}>
                                    <View style={styles.topInfoRow}>
                                        <View style={styles.infoSubjec}>
                                            <Icon2 name="dot-single" color="#aaaaaa" style={styles.infoBullet} />
                                            <CustomTextR style={styles.topInfoTitleText}>수강 기간</CustomTextR>
                                        </View>
                                        <TextRobotoM style={[styles.topInfoValueText, styles.infoNumericBl]}>{moment(this.state.classDetail.takeCourseBeginDatetime).format('YYYY.MM.DD')}~{moment(this.state.classDetail.takeCourseEndDatetime).format('YYYY.MM.DD')}</TextRobotoM>
                                    </View>
                                    <View style={styles.topInfoRow}>
                                        <View style={styles.infoSubjec}>
                                            <Icon2 name="dot-single" color="#aaaaaa" style={styles.infoBullet} />
                                            <CustomTextR style={styles.topInfoTitleText}>잔여 수강일</CustomTextR>
                                        </View>
                                        <TextRobotoM style={styles.topInfoValueText}>{moment(this.state.classDetail.takeCourseEndDatetime).add(1, 'day').diff(moment(), 'day')}</TextRobotoM><CustomTextR style={styles.default14}>일</CustomTextR>
                                    </View>
                                    <View style={styles.topInfoRow}>
                                        <View style={styles.infoSubjec}>
                                            <Icon2 name="dot-single" color="#aaaaaa" style={styles.infoBullet} />
                                            <CustomTextR style={styles.topInfoTitleText}>수강 진도</CustomTextR>
                                        </View>
                                        <TextRobotoM style={styles.topInfoValueText}>{this.state.classDetail.openLectureCnt}</TextRobotoM><CustomTextR style={styles.default14}>강/</CustomTextR><TextRobotoR>{this.state.classDetail.lectureCount}</TextRobotoR><CustomTextR style={styles.default14}>강</CustomTextR>
                                    </View>
                                    {!CommonUtil.isEmpty(this.state.classDetail.lectureMultiple) && (
                                      <View style={styles.topInfoRow}>
                                          <View style={styles.infoSubjec}>
                                              <Icon2 name="dot-single" color="#aaaaaa" style={styles.infoBullet} />
                                              <CustomTextR style={styles.topInfoTitleText}>배수</CustomTextR>
                                          </View>
                                          <Text style={styles.topInfoValueText}>{this.state.classDetail.lectureMultiple} 배수</Text>
                                      </View>
                                      )}
                                </View>
                            </View>
                            <View style={styles.bodyListSection}>
                            {(moment(this.state.classDetail.takeCourseEndDatetime).format('X') < moment().format('X')) ? (
                                <View style={[styles.defaultContainer, {justifyContent: 'center', alignItems: 'center', marginBottom: SCREEN_HEIGHT * 0.2}]}>
                                  <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(14), lineHeight: 14 * 1.42, color: DEFAULT_COLOR.base_color_888, letterSpacing: -0.7, marginTop: 44, marginBottom: 44}}>수강이 종료된 강좌입니다.</CustomTextR>
                                  {this.state.classDetail.isEnableRetake && (
                                  <TouchableOpacity
                                    style={{width: '100%', backgroundColor: DEFAULT_COLOR.lecture_base, height: 45, justifyContent: 'center', alignItems: 'center', borderRadius: 4}}
                                    onPress={() => this.retakeCourse()}>
                                    <CustomTextM style={{color: '#fff', letterSpacing: -0.84, fontSize: PixelRatio.roundToNearestPixel(14), lineHeight: 14 * 1.42}}>재수강 신청</CustomTextM>
                                  </TouchableOpacity>
                                  )}
                                  <TouchableOpacity
                                    style={{width: '100%', backgroundColor: '#fff', height: 45, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginTop: 6}}
                                    onPress={() => this.goWriteReview()}>
                                    <CustomTextM style={{color: DEFAULT_COLOR.base_color_222, letterSpacing: -0.84, fontSize: PixelRatio.roundToNearestPixel(14), lineHeight: 14 * 1.42}}>수강 후기 작성</CustomTextM>
                                  </TouchableOpacity>
                                </View>
                                ) : (
                                <View>
                                    <View style={[styles.bodyListMenuSection]}>
                                        {this.state.isSelectable === false ? (
                                            <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between', zIndex: 2}}>
                                                <View style={styles.flexRow}>
                                                    <TouchableOpacity style={[styles.tabButton, this.state.selectedTabIndex === 0 && styles.tabButtonOn]} onPress={() => {this.setState({selectedTabIndex: 0})}}>
                                                        <Text style={[styles.tabButtonText, this.state.selectedTabIndex === 0 && styles.tabButtonTextOn]}>강의목록</Text>
                                                    </TouchableOpacity>
                                                    {/* P3 강의목록: 추후 오픈 */}
                                                    {/* <TouchableOpacity style={[styles.tabButton, this.state.selectedTabIndex === 1 && styles.tabButtonOn]} onPress={() => {this.setState({selectedTabIndex: 1})}}>
                                                      <Text style={[styles.tabButtonText, this.state.selectedTabIndex === 1 && styles.tabButtonTextOn]}>MP3 강의목록</Text>
                                                    </TouchableOpacity> */}
                                                </View>
                                                <TouchableOpacity style={{paddingTop: 5}} onPress={() => this.changeSelectMode()}>
                                                    <Image
                                                        source={require('../../../assets/icons/icon_download.png')}
                                                        style={{
                                                            width: PixelRatio.roundToNearestPixel(19),
                                                            height: PixelRatio.roundToNearestPixel(17),
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
                                                <TouchableOpacity style={[styles.tabButton, {flexDirection: 'row'}]} onPress={() => this.selectAll()}>
                                                    <Image
                                                        source={require('../../../assets/icons/btn_check_list.png')}
                                                        style={{width: 15, height: 15, marginRight: 8, marginTop: 5}}
                                                    />
                                                    <CustomTextR style={[styles.tabButtonText, {color: DEFAULT_COLOR.base_color_222}]}>{this.state.selectedLecture.length === 0 ? '전체선택' : '선택해제'}</CustomTextR>
                                                </TouchableOpacity>
                                                <TouchableOpacity  onPress={() => this.changeSelectMode()}>
                                                    <CustomTextR style={[styles.tabButtonText, {color: DEFAULT_COLOR.lecture_base}]}>취소</CustomTextR>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                        <View style={{position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: DEFAULT_COLOR.input_border_color, height: 2}}></View>
                                    </View>

                                    <View style={styles.bodyListContent}>
                                    {this.state.classDetail.lectures &&
                                      this.state.classDetail.lectures.map((lec, key) => {
                                        const isSelected = this.state.selectedLecture.indexOf(lec.memberLectureIdx) > -1;
                                        return (
                                          <TouchableOpacity
                                              style={[styles.listBtn, isSelected && styles.listBtnSelected]}
                                              key={key}
                                              onPress={() => this.lecturePressHandle(lec, this.state.isSelectable)}>
                                              <CustomTextR style={styles.listNoText}>{lec.lectureNo}강</CustomTextR><CustomTextR style={[styles.listSubjectText, isSelected && styles.selectedText]}>{lec.lectureName}</CustomTextR>
                                          </TouchableOpacity>
                                        );
                                      })}
                                    </View>
                                </View>
                            )}
                          </View>
                        </Animated.ScrollView>

                        <Animated.View style={{position: 'absolute', left: 0, right: 0, bottom: this.tabarPosition}}>
                          {this.state.selectedLecture.length > 0 ? (
                            <View style={[styles.bottomTabSection, {backgroundColor: DEFAULT_COLOR.lecture_base}]}>
                                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => this.lectureDownload()}>
                                    <CustomTextR style={styles.downloadText1}>총 <TextRobotoR style={styles.downloadText1}>{this.state.selectedLecture.length}</TextRobotoR> 개</CustomTextR>
                                    <View style={{width: 1, height: 15, marginHorizontal: 20, backgroundColor: '#fff', opacity: 0.5}}></View>
                                    <CustomTextB style={styles.downloadText2}>강의 다운로드</CustomTextB>
                                </TouchableOpacity>
                            </View>
                          ) : (
                            <View style={styles.bottomTabSection}>
                              <TouchableOpacity style={styles.tabbarButton} onPress={() => {
                                  if(this.state.classDetail.isStudyFiles) {
                                      this.openModal('studyFile')
                                  } else {
                                      Alert.alert('', '학습자료 다운로드 불가',
                                          [
                                            {text: '확인', onPress: () => function(){}},
                                          ]
                                      )
                                  }
                              }}>
                                {/* <Icon name="home" size={20} color={this.state.classDetail.isStudyFiles === false && '#cccccc'} /> */}
                                <Image source={require('../../../assets/icons/icon_my_list_data.png')} style={styles.bottomBarIcon} />
                                <CustomTextR style={[styles.tabbarBtnText, (this.state.classDetail.isStudyFiles === false && styles.tabbarBtnDisabledText)]} numberOfLines={1}>학습자료</CustomTextR>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.tabbarButton} onPress={() => this.openAddon('extends', this.state.classDetail.isEnableExtends)}>
                                {/* <Icon name="star" size={20} color={this.state.classDetail.isEnableExtends === false && '#cccccc'} /> */}
                                <Image source={require('../../../assets/icons/icon_my_list_extension.png')} style={styles.bottomBarIcon} />
                                <CustomTextR style={[styles.tabbarBtnText, (this.state.classDetail.isEnableExtends === false && styles.tabbarBtnDisabledText)]} numberOfLines={1}>수강연장</CustomTextR>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.tabbarButton} onPress={() => this.openAddon('tempStop', this.state.classDetail.isEnableTempStop)}>
                                {/* <Icon name="user" size={20} color={this.state.classDetail.isEnableTempStop === false && '#cccccc'} /> */}
                                <Image source={require('../../../assets/icons/icon_my_list_stop.png')} style={styles.bottomBarIcon} />
                                <CustomTextR style={[styles.tabbarBtnText, (this.state.classDetail.isEnableTempStop === false && styles.tabbarBtnDisabledText)]} numberOfLines={1}>일시정지</CustomTextR>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.tabbarButton} onPress={() => this.addOnTeacherQuestion()}>
                                {/* <Icon name="download" color="#aaaaaa" size={20} /> */}
                                <Image source={require('../../../assets/icons/icon_my_list_qa.png')} style={styles.bottomBarIcon} />
                                <CustomTextR style={styles.tabbarBtnText} numberOfLines={1}>선생님께 질문</CustomTextR>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.tabbarButton} onPress={() => this.toggleWriteMemoModal()}>
                                {/* <Icon name="bank" color="#aaaaaa" size={20} /> */}
                                <Image source={require('../../../assets/icons/icon_my_list_memo.png')} style={styles.bottomBarIcon} />
                                <CustomTextR style={styles.tabbarBtnText} numberOfLines={1}>메모장</CustomTextR>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.tabbarButton} disabled={(this.state.classDetail.isEnableCertTakeCourse === false && this.state.classDetail.isEnableCertAttend === false) && true} onPress={() => this.selectCert('cert', this.state.classDetail.isEnableCertTakeCourse, this.state.classDetail.isEnableCertAttend)}>
                                {/* <Icon name="appstore-o" size={20} color={(this.state.classDetail.isEnableCertTakeCourse === false && this.state.classDetail.isEnableCertAttend === false) && '#efefef'} /> */}
                                <Image source={require('../../../assets/icons/icon_my_list_certificate.png')} style={styles.bottomBarIcon} />
                                <CustomTextR style={[styles.tabbarBtnText, ((this.state.classDetail.isEnableCertTakeCourse === false && this.state.classDetail.isEnableCertAttend === false) && styles.tabbarBtnDisabledText)]} numberOfLines={1}>증명서</CustomTextR>
                              </TouchableOpacity>
                            </View>
                          )}
                        </Animated.View>
                    </View>

                    <Modal
                        onBackdropPress={this.closeModal}
                        animationType="slide"
                        onRequestClose={() => {
                          this.setState({showModal: false});
                        }}
                        useNativeDriver={true}
                        animationInTiming={300}
                        animationOutTiming={300}
                        hideModalContentWhileAnimating
                        isVisible={this.state.isShowModal}
                        style={{justifyContent: 'flex-end', margin: 0}}>
                        <View style={[
                            styles.modalContainer,
                            {height: SCREEN_HEIGHT - STATUS_BAR_HEIGHT},
                          ]}>
                            {this.getModalContent(this.state.modalContent)}
                        </View>
                    </Modal>
                    {/* {this.renderCompleteModal()} */}
                    {/* {this.renderModifyModal()} */}
                    {this.renderWriteModal()}
                    {this.renderWriteMemoModal()}
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    flexRow: {
      flexDirection: 'row',
    },
    btn: {
      padding: 2,
      marginHorizontal: 5,
    },
    container: {
      width: '100%',
      // height: '',
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      paddingBottom: 30,
    },
    wrapper: {
      flexDirection: 'column',
      height: '100%',
      // paddingHorizontal: 20,
    },
    defaultContainer: {
      paddingHorizontal: 20,
    },
    topClosebtnSection: {
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    closeBtn: {
      padding: 5,
      marginRight: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    topTitleSection: {
      justifyContent: 'center',
      marginTop: 28,
      marginBottom: 13,
    },
    titleClassNameText: {
      fontSize: PixelRatio.roundToNearestPixel(18),
      fontWeight: '500',
      lineHeight: 18 * 1.42,
      letterSpacing: -0.9,
      color: '#222222',
    },
    topTeacherSection: {
      justifyContent: 'center',
      marginBottom: 17,
    },
    topTeacherText: {
      color: DEFAULT_COLOR.base_color_222,
      fontSize: DEFAULT_TEXT.body_13,
      lineHeight: 13 * 1.42,
    },
    bodyScroll: {
      // marginBottom: 30,
      flex: 1,
    },
    topInfoSection: {
      borderRadius: 4,
      backgroundColor: '#f5f7f8',
      flexDirection: 'column',
      padding: 20,
      paddingBottom: 10,
      marginBottom: 30,
    },
    topInfoRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    infoSubjec: {
      flex: 1,
      flexDirection: 'row',
      // justifyContent: 'center',
      alignItems: 'center',
    },
    infoBullet: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    topInfoTitleText: {
      fontSize: PixelRatio.roundToNearestPixel(14),
      lineHeight: 14 * 1.42,
      letterSpacing: -0.7,
    },
    topInfoValueText: {
      flex: 3,
      textAlign: 'right',
      fontSize: PixelRatio.roundToNearestPixel(14),
      lineHeight: 14 * 1.42,
      letterSpacing: -0.7,
    },
    default14: {
      fontSize: PixelRatio.roundToNearestPixel(14),
      lineHeight: 14 * 1.42,
    },
    infoNumericBl: {
      color: DEFAULT_COLOR.lecture_base,
    },
    bodyListSection: {
      // padding: 10,
      // borderWidth: 1,
    },
    bodyListMenuSection: {
      paddingHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    bodyListContent: {
      marginBottom: 20,
    },
    listBtn: {
      borderBottomWidth: 1,
      borderBottomColor: '#e8e8e8',
      justifyContent: 'center',
      flexDirection: 'row',
      paddingVertical: 20,
    },
    listBtnSelected: {
      backgroundColor: '#f5f7f8',
    },
    selectedText: {
      color: DEFAULT_COLOR.lecture_base,
    },
    listNoText: {
      flex: 1,
      fontSize: PixelRatio.roundToNearestPixel(13),
      lineHeight: 13 * 1.42,
      letterSpacing: -0.65,
      color: DEFAULT_COLOR.base_color_888,
      marginLeft: 20,
    },
    listSubjectText: {
      flex: 8,
      fontSize: PixelRatio.roundToNearestPixel(13),
      lineHeight: 13 * 1.42,
      letterSpacing: -0.65,
      color: DEFAULT_COLOR.base_color_222,
      marginRight: 20,
    },
    box: {
      width: 150,
      height: 150,
      alignSelf: 'center',
      backgroundColor: 'plum',
      margin: 10,
      zIndex: 200,
    },
    bottomTabSection: {
      height: SCREEN_HEIGHT * 0.1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: DEFAULT_COLOR.myclass_base,
      shadowColor: '#777',
      shadowOpacity: 0.5,
      shadowRadius: 10,
    },
    tabbarButton: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    tabbarButtonDisabled: {
      color: '#efefef',
    },
    tabbarBtnText: {
      color: '#fff',
      fontSize: PixelRatio.roundToNearestPixel(10),
      lineHeight: 10 * 1.42,
      letterSpacing: -0.5,
    },
    tabbarBtnDisabledText: {
      color: '#aaaaaa',
    },
    bottomBarIcon: {
      width: 25,
      height: 20,
      marginBottom: 8,
    },
    modalContainer: {
      marginTop: STATUS_BAR_HEIGHT, //SCREEN_HEIGHT * 0.05,
      backgroundColor: '#fff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    tabButton: {
      marginRight: 30,
    },
    tabButtonOn: {
      borderBottomColor: DEFAULT_COLOR.lecture_base,
      borderBottomWidth: 2,
      backgroundColor: '#fff',
      // borderWidth: 1, borderColor: 'red',
    },
    tabButtonText: {
      fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyRegular,
      fontSize: PixelRatio.roundToNearestPixel(16),
      lineHeight: 16 * 1.42,
      letterSpacing: -1.2,
      color: '#888',
      marginBottom: 15,
    },
    tabButtonTextOn: {
      fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyBold,
      color: DEFAULT_COLOR.lecture_base,
    },
    downloadText1: {
      fontSize: PixelRatio.roundToNearestPixel(15),
      lineHeight: 15 * 1.42,
      letterSpacing: -0.75,
      color: '#ffffff',
    },
    downloadText2: {
      fontSize: PixelRatio.roundToNearestPixel(18),
      lineHeight: 18 * 1.42,
      letterSpacing: -0.9,
      color: '#ffffff',
    },

    // 선생님께 질문, 메모장 modal
    commonModalContainer: {
      justifyContent: 'flex-end',
      margin: 0
    },
    commonModalWrapper: {
      paddingTop: 16,
      backgroundColor: '#fff',
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15
    },
    writeModalWrapper: {
      height: HEIGHT_WRITE_MODAL,
    },
    modifyModalWrapper: {
      height: HEIGHT_MODIFY_MODAL,
    },
    completeModalWrapper : {
      backgroundColor: 'transparent',
      height: '100%', //HEIGHT_COMPLETE_MODAL,
      justifyContent: 'flex-end',
    },

    lecListModalWrapper : {
      height: HEIGHT_LEC_LIST_MODAL,
    },
    lecKangListModalWrapper : {
      height: HEIGHT_LEC_KANG_LIST_MODAL,
    },
    // 메모장 작성 모달
    writeMemoModalWrapper: {
      height: HEIGHT_WRITE_MEMO_MODAL,
    },
});

const mapStateToProps = state => {
    return {
      myClassServiceID: state.GlabalStatus.myClassServiceID,
      myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,
    };
};

export default connect(mapStateToProps, null)(ClassDetailScreen);
