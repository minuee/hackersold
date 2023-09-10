import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  Easing,
  PixelRatio,
  Dimensions,
  Platform,
  Alert,
  StatusBar,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import HTMLConvert from '../../../Utils/HtmlConvert/HTMLConvert';
import Modal from 'react-native-modal';

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
const STATUS_BAR_HEIGHT = Platform.OS == 'android' ? StatusBar.currentHeight : getStatusBarHeight();

// 일시정지 신청 alert 모달
const ModalAlert = props => {
  const {classData, startDate, endDate, isApplyComplete, closeModal, procApply, applyDone} = props.screenState;
  // const lecture = props.screenState.selectedProduct;
  const contentHeight = isApplyComplete ? 370 : 330;
  const applyDays = moment(endDate).diff(moment(startDate), 'days') + 1;
  return (
    <View style={{backgroundColor: '#fff', borderRadius: 14, marginHorizontal: 50, height: contentHeight, alignItems: 'center'}}>
      <Image source={require('../../../../assets/icons/icon_alert_exclamation.png')} style={{width: 25, height: 25, marginTop: 25, marginBottom: 13}} />
      <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(14), color:isApplyComplete ? '#888888' : DEFAULT_COLOR.base_color_222, lineHeight: 14 * 1.42, letterSpacing: -0.7, marginHorizontal: 35, marginBottom: 10, textAlign: 'center'}}>
      {classData.className}
      </CustomTextR>

        {isApplyComplete
          ? <View style={{justifyContent: 'center', alignItems: 'center', marginHorizontal: 35, marginBottom: 10}}>
              <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(14), color: DEFAULT_COLOR.base_color_222, lineHeight: 14 * 1.42, letterSpacing: -0.7, textAlign: 'center'}}>
                총  <TextRobotoM style={{fontSize: PixelRatio.roundToNearestPixel(14), color: DEFAULT_COLOR.lecture_base, lineHeight: 14 * 1.42, letterSpacing: -0.7, fontWeight: '500'}}>{applyDays}</TextRobotoM>일의 일시정지 신청이{'\n'}
                완료되었습니다.
              </CustomTextR>
            </View>
          : <View style={{justifyContent: 'center', alignItems: 'center', marginHorizontal: 35, marginBottom: 10}}>
              <TextRobotoM style={{fontSize: PixelRatio.roundToNearestPixel(14), color: DEFAULT_COLOR.lecture_base, lineHeight: 14 * 1.42, letterSpacing: -0.7, fontWeight: '500'}}>
                {moment(startDate).format('YYYY.MM.DD')} ~ {moment(endDate).format('YYYY.MM.DD')}
              </TextRobotoM>
              <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(14), color: DEFAULT_COLOR.lecture_base, lineHeight: 14 * 1.42, letterSpacing: -0.7}}>
                (신청기간: {applyDays}일)
              </CustomTextR>
            </View>
        }
      
      <View style={{height: 1, width: '90%', backgroundColor: '#e8e8e8', marginTop: 16, marginBottom: 18}}></View>

      {isApplyComplete
        ? <View style={{paddingHorizontal: 30, marginBottom: 23}}>
            <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(13), lineHeight: 14 * 1.42, letterSpacing: -0.7, color: '#888888', textAlign: 'center'}}>
            일시정지 기간은{'\n'}
            <TextRobotoM style={{color: DEFAULT_COLOR.lecture_base}}>
            {moment(startDate).format('YYYY.MM.DD')} ~ {moment(endDate).format('YYYY.MM.DD')}
            </TextRobotoM>
            까지이며,{'\n'}
            일시정지 기간 만료 후에는{'\n'}
            자동으로 강의가 시작됩니다.{'\n'}
            </CustomTextR>
          </View>
        : <View style={{marginBottom: 23}}>
            <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(14), lineHeight: 14 * 1.42, letterSpacing: -0.7, color: '#888888', textAlign: 'center'}}>
            위 강의를 일시정지 신청{'\n'}
            하시겠습니까?
            </CustomTextR>
          </View>
      }
      <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 0, borderTopColor: '#e8e8e8', borderTopWidth: 1}}>
      {!isApplyComplete && (
        <TouchableOpacity style={{flex: 1, paddingVertical: 13, justifyContent: 'center', alignItems: 'center', borderRightColor: '#e8e8e8', borderRightWidth: 1}} onPress={() => closeModal()}>
          <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(16), lineHeight: 16 * 1.42, color: DEFAULT_COLOR.base_color_888}}>취소</CustomTextR>
        </TouchableOpacity>
      )}
        <TouchableOpacity
          style={{flex: 1, paddingVertical: 13, justifyContent: 'center', alignItems: 'center'}}
          onPress={() => {
            isApplyComplete
              ? applyDone()
              : procApply()
          }}>
          <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(16), lineHeight: 16 * 1.42, color: DEFAULT_COLOR.lecture_base}}>확인</CustomTextR>
        </TouchableOpacity>
      </View>
    </View>
  );
};

class TempStopScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classData: props.screenState.classData || {},
            isDatePickerVisible: false,
            startDate: moment([moment().year(), moment().month(), moment().date(), 23, 59, 59]).toDate(),
            endDate: moment([moment().year(), moment().month(), moment().date(), 23, 59, 59]).toDate(),
            isApplyComplete: false,
            currentType: '',
            viewAnim: new Animated.Value(0),
            datepickerOpacity: 0,
            isShowModal: false,
            modalContent: '',
            modalType: '',
            tempstopInfoMessage: [],
            closeModal: this.closeModal.bind(this),
            procApply: this.procApply.bind(this),
            applyDone: this.applyDone.bind(this),
        };
        // this.classData = props.screenState.classData;
    }

    UNSAFE_componentWillMount() {
        this.setMessage();
    }

    // 안내메세지
    setMessage = async () => {
      const infoMessages = await CommonUtil.getInfoMessage(this.props.myClassServiceID);
      if (infoMessages.result === true) {
          if (infoMessages.response.code === '0000') {
              this.setState({
                tempstopInfoMessage: infoMessages.response.data.message.tempStop || [],
              });
          } else {
              Alert.alert('', infoMessages.response.message || '안내메세지 로딩 실패');
          }
      } else {
          Alert.alert('', infoMessages.error || '안내메세지 로딩 실패');
      }
  };

    showDatepicker = type => {
      if (Platform.OS === 'ios') {
        if (this.state.isDatePickerVisible) {
          this.setState({
            datepickerOpacity: 0,
          });
          Animated.timing(this.state.viewAnim, {
            toValue: 0,
            duration: 300,
          }).start(() => {
            this.setState({
              isDatePickerVisible: false,
              currentType: '',
            });
          });
        } else {
          this.setState({
            isDatePickerVisible: true,
            currentType: type,
            datepickerOpacity: 1,
          });
          Animated.timing(this.state.viewAnim, {
            toValue: 200,
            duration: 300,
          }).start();
        }
      } else {
        this.setState({
          isDatePickerVisible: true,
          currentType: type,
          datepickerOpacity: 1,
        });
      }
    };

    onChangeDate = async (event, selectedDate) => {
        if (selectedDate === undefined) {
            this.dismissDatePicker();
            return;
        };
        const currentDate = selectedDate || this.state.startDate;
        if (Platform.OS === 'android') {
            await this.setState({
                [this.state.currentType]: moment([moment(currentDate).year(), moment(currentDate).month(), moment(currentDate).date(), 23, 59, 59]).toDate(),
                isDatePickerVisible: false,
            });
        } else {
            await this.setState({
              [this.state.currentType]: moment([moment(currentDate).year(), moment(currentDate).month(), moment(currentDate).date(), 23, 59, 59]).toDate(),
            });
        }
    };

    handlePressAplly = () => {
        // this.showModal('confirmApplyTempStop', 'centerModal');
        // return;
        const applyDays = moment(this.state.endDate).diff(moment(this.state.startDate), 'days') + 1;
        if (this.state.classData.tempStopRemainCount <= 0 || this.state.classData.tempStopRemainDays <= 0) {
            Alert.alert(
                '',
                '일시정지 신청 횟수 또는 일수가 모두 소진되어 일시정지 신청이 불가능합니다.',
            );
        } else if (applyDays <= 0) {
            Alert.alert('', '시작일이 종료일이 클 수 없습니다.');
        } else if (applyDays > this.state.classData.tempStopRemainDays) {
            Alert.alert('', '일시정지 신청 가능 일수를 초과 하였습니다.');
        } else {
            this.showModal('confirmApplyTempStop', 'centerModal');
        }
    };

    dismissDatePicker = async () => {
      if (!this.state.isDatePickerVisible) {
        return;
      }
      await this.setState({
        datepickerOpacity: 0,
        // isDatePickerVisible: false,
        // currentType: '',
      });

      Platform.OS === 'ios'
        ? Animated.timing(this.state.viewAnim, {
            toValue: 0,
            duration: 300,
          }).start(() => {
            this.setState({
              isDatePickerVisible: false,
              currentType: '',
            });
          })
        : this.setState({
            isDatePickerVisible: false,
            currentType: '',
          })
    };

    showModal = async (mode, modalType) => {
      await this.setState({modalContent: mode, modalType: modalType});
      this.setState({isShowModal: true});
    };

    closeModal = () => {
        this.setState({modalContent: '', isShowModal: false, modalType: ''});
    };

    // 모달 컨텐츠
    getModalContent = modalContent => {
      if (CommonUtil.isEmpty(modalContent)) {
        return;
      }

      switch (modalContent) {
        case 'confirmApplyTempStop':
          return <ModalAlert screenState={this.state} />;
      }
    };

    showConfirmApplyModal = () => {
      this.showModal('confirmApplyTempStop', 'centerModal');
    };

    procApply = async () => {
      const applyDays = moment(this.state.endDate).diff(moment(this.state.startDate), 'days') + 1;
      // TODO:: 일시정지 API 실데이터 테스트 필요
      this.setState({loading: true});
      const memberIdx = await CommonUtil.getMemberIdx();
      const url = SERVICES[this.props.myClassServiceID].apiDomain + '/v1/myClass/additional/pause/' + memberIdx + '/' + this.state.classData.memberProductIdx;
      const formData = new FormData();
      const sDate = moment(this.state.startDate);
      const sDatetime = moment([sDate.year(), sDate.month(), sDate.date(), '00', '00', '00']).format('YYYY-MM-DD HH:mm:ss');
      const eDate = moment(this.state.endDate);
      const eDatetime = moment([eDate.year(), eDate.month(), eDate.date(), '23', '59', '59']).format('YYYY-MM-DD HH:mm:ss');
      formData.append('tempStopBeginDatetime', sDatetime);
      formData.append('tempStopEndDatetime', eDatetime);
      const options = {
        method: 'POST',
        headers: {
          ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
        },
        body: formData,
      };
      console.log('일시정지 : ', url, options);
      CommonUtil.callAPI(url, options, 10000)
        .then(response => {
          console.log('resonse : ', response);
          if (response && response.code === '0000') {
            this.setState({loading: false});
            this.updateApplyTempStopResult(applyDays);
            // Alert.alert('', '일시정지 신청 완료', [{text: '확인', onPress: () => {this.props.screenState.closeModal()}}]);
          } else {
            this.setState({loading: false});
            response.message
              ? Alert.alert('', response.message)
              : Alert.alert('', '일시정지 신청 실패');
          }
        })
        .catch(error => {
          console.log('error : ', error);
          this.setState({loading: false});
          // Alert.alert('Error', '시스템 에러');
        });
    };

    updateApplyTempStopResult = applyDays => {
      const newClassData = {
        ...this.state.classData,
        tempStopRemainCount: parseInt(this.state.classData.tempStopRemainCount) - 1,
        tempStopRemainDays: parseInt(this.state.classData.tempStopRemainDays) - applyDays,
      };
      this.setState({
        classData: newClassData,
        isApplyComplete: true,
      });
      this.props.screenState.updateClassData(this.state.classData);
    };

    applyDone = () => {
      this.props.screenState.closeModal();
    };

    render() {
        //tempStopRemainCount, tempStopRemainDays
        return (
            <View style={styles.container}>
                <View style={MyClassStyles.inModalHeader}>
                    <CustomTextR style={MyClassStyles.inModalHeaderTitleText}>일시정지</CustomTextR>
                    <TouchableOpacity onPress={() => this.props.screenState.closeModal()} style={MyClassStyles.inModalCloseBtn}>
                        <Image source={require('../../../../assets/icons/btn_close_pop.png')} style={MyClassStyles.inModalCloseBtnImage} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.bodyScroll} contentContainerStyle={{ flexGrow: 1 }}>
                    <TouchableWithoutFeedback onPress={() => this.dismissDatePicker()}>
                        <View style={styles.wrapper}>
                            <View style={{marginTop: 23}}>
                              <CustomTextM style={{fontSize: PixelRatio.roundToNearestPixel(18), color: '#222', fontWeight: '500', lineHeight: 18 * 1.42, letterSpacing: -0.9, marginBottom: 11}}>{this.state.classData.className}</CustomTextM>
                              <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(13), color: '#222', lineHeight: 13 * 1.42}}>{this.state.classData.teacherName}</CustomTextR>
                              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 12, marginBottom: 18}}>
                                  <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(13), color: '#888888', lineHeight: 13 * 1.42}}>수강기간 </CustomTextR>
                                  <TextRobotoM style={{color: '#28a5ce', fontSize: PixelRatio.roundToNearestPixel(13), lineHeight: 13 * 1.42, fontWeight: '500',}}>
                                      {moment(this.state.classData.takeCourseBeginDatetime).format('YYYY.MM.DD')} ~{' '}
                                      {moment(this.state.classData.takeCourseEndDatetime).format('YYYY.MM.DD')}
                                  </TextRobotoM>
                              </View>
                            </View>
                            <View>
                              <View style={styles.termsSection}>
                                  <CustomTextR style={styles.termsSubjectText}>일시정지 시작일</CustomTextR>
                                  <Image source={require('../../../../assets/icons/icon_line_dot.png')} style={{width: 15, height: 2, marginHorizontal: 10}} />
                                  <TouchableOpacity onPress={() => this.showDatepicker('startDate')} style={styles.dateSection}>
                                      <TextRobotoR style={styles.termsDateText}>{moment(this.state.startDate).format('YYYY-MM-DD')}</TextRobotoR>
                                  </TouchableOpacity>
                              </View>
                              {(this.state.isDatePickerVisible &&
                                (this.state.currentType === 'startDate')) && (
                                  <Animated.View style={{width: '100%', height: this.state.viewAnim, justifyContent: 'center',}}>
                                    <DateTimePicker
                                      mode="date"
                                      minimumDate={moment().toDate()}
                                      // maximumDate={moment(this.state.startDate).add(parseInt(this.state.classData.tempStopRemainDays)-1, 'days').toDate()}
                                      timeZoneOffsetInMinutes={0}
                                      value={moment(this.state.startDate).toDate()}
                                      is24Hour={true}
                                      display="spinner"
                                      onChange={this.onChangeDate}
                                      style={{opacity: this.state.datepickerOpacity}}
                                    />
                                  </Animated.View>
                                )}
                              <View style={[styles.termsSection, {borderBottomColor: '#e8e8e8', borderBottomWidth: 1}]}>
                                  <CustomTextR style={styles.termsSubjectText}>일시정지 종료일</CustomTextR>
                                  <Image source={require('../../../../assets/icons/icon_line_dot.png')} style={{width: 15, height: 2, marginHorizontal: 10}} />
                                  <TouchableOpacity onPress={() => this.showDatepicker('endDate')} style={styles.dateSection}>
                                      <TextRobotoR style={styles.termsDateText}>{moment(this.state.endDate).format('YYYY-MM-DD')}</TextRobotoR>
                                  </TouchableOpacity>
                              </View>
                              {(this.state.isDatePickerVisible &&
                                this.state.currentType === 'endDate') && (
                                    <Animated.View style={{width: '100%', height: this.state.viewAnim, justifyContent: 'center',}}>
                                      <DateTimePicker
                                          mode="date"
                                          minimumDate={moment().toDate()}
                                          // maximumDate={moment(this.state.startDate).add(parseInt(this.state.classData.tempStopRemainDays)-1, 'days').toDate()}
                                          timeZoneOffsetInMinutes={0}
                                          value={moment(this.state.endDate).toDate()}
                                          is24Hour={true}
                                          display="spinner"
                                          onChange={this.onChangeDate}
                                          style={{opacity: this.state.datepickerOpacity}}
                                      />
                                    </Animated.View>
                                )}
                            </View>
                            <View style={styles.summarySection}>
                                <CustomTextR style={styles.summaryTitle}>총 일시정지 일수</CustomTextR>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <TextRobotoM style={styles.summaryText}>{moment(this.state.endDate).diff(moment(this.state.startDate), 'days') + 1}</TextRobotoM>
                                    <CustomTextM style={styles.summaryText}>일</CustomTextM>
                                </View>
                            </View>
                            <View style={MyClassStyles.addonHowToUseMsgSection}>
                                {this.state.tempstopInfoMessage.map(
                                    (item, index) => {
                                        return (
                                            <View style={{marginVertical: 10}} key={index}>
                                                <CustomTextM style={MyClassStyles.addonHowToUseMsgTitle}>{item.title || ''}</CustomTextM>
                                                <HTMLConvert
                                                    {...this.props}
                                                    html={item.content && CommonUtil.stripSlashes(item.content) || ''}
                                                />
                                            </View>
                                        );
                                    },
                                )}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>

                {/* <View style={styles.bottomSticky}>
                  <TouchableOpacity style={styles.bottomBtn} onPress={() => this.handlePressAplly()}>
                    <Text>신 청</Text>
                  </TouchableOpacity>
                </View> */}
            
                <View style={MyClassStyles.inModalBottomStickyButtonSection}>
                    <TouchableOpacity style={MyClassStyles.inModalBottomStickyButton} onPress={() => this.handlePressAplly()}>
                        <CustomTextB style={MyClassStyles.inModalBottomStickyButtonText}>신 청</CustomTextB>
                    </TouchableOpacity>
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
                    <View
                        style={[
                            this.state.modalType === 'centerModal' ? {justifyContent: 'center'} : MyClassStyles.modalContainer,
                            {
                                // height: SCREEN_HEIGHT * 0.9,
                                height: this.state.modalType === 'centerModal' ? SCREEN_HEIGHT : SCREEN_HEIGHT * 0.9,
                            },
                    ]}>
                        {this.getModalContent(this.state.modalContent)}
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  flexRow: {flexDirection: 'row'},
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
    marginHorizontal: 20,
    // backgroundColor: 'red',
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
    borderBottomColor: '#666',
    borderBottomWidth: 1,
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
    padding: 5,
    // marginRight: 5,
    // justifyContent: 'center',
    // alignItems: 'center',
    // flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  bodyScroll: {
    // height: '100%',
    // backgroundColor: 'yellow',
    flex: 1,
  },
  termsSection: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    paddingVertical: 16,
  },
  dateSection: {
    // borderWidth: 1,
    // borderColor: '#efdfcf',
    // padding: 10,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  termsSubjectText: {
    color: '#222222',
    fontSize: PixelRatio.roundToNearestPixel(14),
    lineHeight: 14 * 1.42,
    letterSpacing: -0.7,
  },
  termsDateText: {
    color: '#aaaaaa',
    fontSize: PixelRatio.roundToNearestPixel(14),
    lineHeight: 14 * 1.42,
  },
  summarySection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#e2f3f8',
    borderRadius: 4,
    paddingVertical: 25,
    // marginBottom: 18,
  },
  // circle: {
  //   backgroundColor: '#dcdcdc',
  //   width: SCREEN_WIDTH * 0.4,
  //   height: SCREEN_WIDTH * 0.4,
  //   borderRadius: (SCREEN_WIDTH * 0.4) / 2,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  summaryTitle: {
    color: '#222222',
    fontSize: PixelRatio.roundToNearestPixel(16),
    lineHeight: 16 * 1.42,
    letterSpacing: -0.8,
    marginBottom: 6,
  },
  summaryText: {
    color: '#28a5ce',
    fontSize: PixelRatio.roundToNearestPixel(30),
    fontWeight: '500',
    lineHeight: 30 * 1.42,
  },
  warningMsg: {
    marginBottom: 80,
  },
  bottomSticky: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: -10,
  },
  bottomBtn: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dfdfdf',
  },
});


const mapStateToProps = state => {
  return {
    myClassServiceID: state.GlabalStatus.myClassServiceID,
    myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,
  };
};

export default connect(mapStateToProps, null)(TempStopScreen);
