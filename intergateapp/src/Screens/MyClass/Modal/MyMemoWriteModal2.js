import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    Text,
    ActivityIndicator,
    Dimensions,
    PixelRatio,
    TouchableOpacity,
    Image,
    TextInput,
    Platform,
    ScrollView,
    StatusBar,
    Alert,
} from 'react-native';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import {isIphoneX} from 'react-native-iphone-x-helper';
import LinearGradient from 'react-native-linear-gradient';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Toast from 'react-native-tiny-toast';

import {CustomTextB, CustomText, CustomTextR} from '../../../Style/CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

import PickerLecModal2 from './PickerLecModal2'; // 선생님께 질문 & 메모장 강좌 선택 모달
import PickerLecKangModal2 from './PickerLecKangModal2'; // 선생님께 질문 & 메모장 강의 선택 모달

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

//공통상수
import COMMON_STATES, {SERVICES} from '../../../Constants/Common';
import  * as getDEFAULT_CONSTANTS   from '../../../Constants/index';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../../Utils/CommonUtil';

import { TARGET } from './ModalConstant';

const TOTAL_HEIGHT = SCREEN_HEIGHT * 0.95;
// TOTAL_HEIGHT == MyMemoContent.animatedHeight
const HEADER_PADDING_TOP = 16;
// HEADER_PADDING_TOP == MyMemoContent.styles.modalContainer.paddingTop
const HEADER_HEIGHT = 40;
const FOOTER_HEIGHT = 57;
const CONTENT_HEIGHT = TOTAL_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT - HEADER_PADDING_TOP;
const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight : getStatusBarHeight();
// TODO Modal 및 강좌 리스트 모듈화(선생님께 질문하기 페이지 내 ImagePicker 고려 필요)

class MyMemoWriteModal2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isShowModal: false,
      memberIdx: 0,
      apiDomain: '',
      // classList: props.screenState.classList,
      ownLecItems: [], //props.screenState.ownLecItems,
      // selectedLecItemIndex: 0,
      // selectedLecKangItemIndex: -1,
      selectedMemberClassIdx: props.screenState.classData.memberClassIdx,
      selectedLectureNo: 0,
      typedMemoContent: '',
      toggleModal: this.toggleModal.bind(this),
      setDataLecListModel: this.setDataLecListModel.bind(this),
      setDataLecKangListModel: this.setDataLecKangListModel.bind(this),
      getSelectedLecKangItems: this.getSelectedLecKangItems.bind(this),
    };

    //console.log('MyMemoWriteModal', 'ownLecItems = ' + JSON.stringify(props.screenState.ownLecItems))
  }

  async UNSAFE_componentWillMount() {
    const memberIdx = await CommonUtil.getMemberIdx();
    // const aPIsDomain =
    //   (!CommonUtil.isEmpty(this.props.myInterestCodeOne) && this.props.myInterestCodeOne.info !== undefined && typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined')
    //     ? this.props.myInterestCodeOne.info.apiDomain
    //     : DEFAULT_CONSTANTS.apiTestDomain;
    this.setState({
      memberIdx: memberIdx,
      apiDomain: SERVICES[this.props.myClassServiceID],
    });
    await this.getOwnLectureList();
  }

  // 글 작성용 강좌&강의 목록 조회
  getOwnLectureList = async () => {
    this.setState({loading: true});

    // const aPIsDomain = this.props.myInterestCodeOne && typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
    const url = this.state.aPIsDomain + '/v1/myClass/class/'+ this.state.memberIdx;
    console.log('url : ', url);
    await CommonUtil.callAPI(url, null, 10000)
      .then(response => {
        //console.log('getOwnLectureList()', 'response = ' + JSON.stringify(response));

        if (response && response.code === '0000') {
          let ownLecItems = response.data.class;
          // console.log('getOwnLectureList()', 'ownLecItems = ' + JSON.stringify(ownLecItems));
          const lectureNoList = this.state.ownLecItems.find(item => item.memberClassIdx === this.state.selectedMemberClassIdx).lecture.lectureNo;
          this.setState({
            ownLecItems: ownLecItems,
            loading: false,
            selectedMemberClassIdx: this.state.selectedMemberClassIdx, //ownLecItems[0].memberClassIdx,
            selectedLectureNo: lectureNoList[0],
          });
        } else {
          this.setState({loading: false});
          response.message
            ? Toast.show(response.message)
            : Toast.show('강의 목록을 불러오는데 실패 했습니다.');
        }}).catch(error => {
        console.log(error);
        this.setState({
          loading: false,
        });
        Toast.show('시스템 에러: 강의 목록을 불러오는데 실패 했습니다.');
      });
  };

  // 강좌 선택 저장
  setDataLecListModel = (targetFrom, memberClassIdx) => {
    const selctedClass = this.state.ownLecItems.find(
      item => item.memberClassIdx === memberClassIdx,
    );
    this.setState({
      selectedMemberClassIdx: memberClassIdx,
      selectedLectureNo: selctedClass.lecture.lectureNo[0],
    });
    this.toggleModal(targetFrom);
  };

  // 강의 선택 저장
  setDataLecKangListModel = (targetFrom, lectureNo) => {
    this.setState({
      selectedLectureNo: lectureNo,
    });
    this.toggleModal(targetFrom);
  };

  // 쓰기모달 > 강좌 선택 > 선택된 강좌명
  getSelectedLecItemTitle = () => {
    const selctedClass = this.state.ownLecItems.find(
      item => item.memberClassIdx === this.state.selectedMemberClassIdx,
    );
    if (CommonUtil.isEmpty(selctedClass)) {
      return;
    } else {
      return selctedClass.className;
    }
  };

  // 쓰기모달 > 강의 선택 > 선택된 강의명
  getSelectedLecKangItemTitle = () => {
    const selctedClass = this.state.ownLecItems.find(
      item => item.memberClassIdx === this.state.selectedMemberClassIdx,
    );
    if (CommonUtil.isEmpty(selctedClass)) {
      return;
    } else {
      return '제 ' + selctedClass.lecture.lectureNo.find(item => item === this.state.selectedLectureNo) + ' 강';
    }
  };

  // 강의 선택 모달용 강의 목록
  getSelectedLecKangItems = () => {
    const selctedClass = this.state.ownLecItems.find(
      item => item.memberClassIdx === this.state.selectedMemberClassIdx,
    );
    if (CommonUtil.isEmpty(selctedClass)) {
      return;
    } else {
      return selctedClass.lecture.lectureNo;
    }
  };

  // 메모장 내용
  onChangeMemoContent = text => {
    this.setState({
      typedMemoContent: text,
    });
  };

  // 메모장 내용 불러오기
  getDataMemoContent = () => {
    return this.state.typedMemoContent;
  };

  // 메모장 저장
  createMemoItemRemote = async () => {
    this.setState({loading: true});
    const selctedClass = this.state.ownLecItems.find(
      item => item.memberClassIdx === this.state.selectedMemberClassIdx,
    );
    const index = selctedClass.lecture.lectureNo.indexOf(this.state.selectedLectureNo);
    const memberLectureIdx = selctedClass.lecture.memberLectureIdx[index];

    let orderingNo;
    let className;

    for (let lecItem of this.state.ownLecItems) {
      if (lecItem.memberClassIdx === this.state.selectedMemberClassIdx) {
        orderingNo = lecItem.orderingNo;
        className = lecItem.className;
      }
    }

    // const aPIsDomain = this.props.myInterestCodeOne && typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
    const url =
      this.state.aPIsDomain +
      '/v1/myClass/memo/' + this.state.memberIdx + '/' + this.state.selectedMemberClassIdx + '/' + memberLectureIdx;
    const formData = new FormData();
    formData.append('memoContent', this.state.typedMemoContent);
    formData.append('regDevice', 'mobile');
    formData.append('orderingNo', orderingNo);
    formData.append('className', className);

    const options = {
      method: 'POST',
      // headers: new Headers({
      //   Accept: 'application/json',
      //   'Content-Type': 'multipart/form-data',
      //   'apiKey': DEFAULT_CONSTANTS.apiTestDomain
      // }),
      body: formData,
    };
    await CommonUtil.callAPI(url, options, 10000)
      .then(response => {
        this.setState({loading: false});
        if (response && response.code === '0000') {
          Alert.alert('', '저장되었습니다.', [
            {text: '확인', onPress: () => this.props.screenState.toggleWriteMemoModal()},
          ]);
        } else {
          response.message
            ? Alert.alert('', response.message)
            : Alert.alert('', '로딩 실패');
        }
      })
      .catch(error => {
        console.log('error : ', error);
        this.setState({loading: false});
        Alert.alert('', '오류로 등록에 실패 했습니다.\n잠시 후 다시 시도해 주세요.');
      });
  };

  // toggle 모달
  toggleModal = modalContent => {
    this.setState({
      modalContent: modalContent,
      isShowModal: !this.state.isShowModal,
    });
  };

  // 모달 컨텐츠 선별
  getModalContent = modalContent => {
    if (CommonUtil.isEmpty(modalContent)) {
      return;
    }
    // certTakeCourse certAttend
    switch (modalContent) {
      case TARGET.FROM_LEC:
        return <PickerLecModal2 screenState={this.state} />;
      case TARGET.FROM_LEC_KANG:
        return <PickerLecKangModal2 screenState={this.state} />;
    }
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.IndicatorContainer}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerLeft}></View>
            <View style={styles.headerCenter}>
              <CustomTextR style={styles.headerCenterTitle}>
                메모 추가
              </CustomTextR>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.headerRightWrapper}
                onPress={() => this.props.screenState.toggleWriteMemoModal()}>
                <Image
                  style={styles.headerRightIcon}
                  source={require('../../../../assets/icons/btn_close_pop.png')} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.content}>
            <View style={styles.contentHeader}>
              <View style={styles.lecListContainer}>
                <TouchableOpacity
                  style={styles.lecListWrapper}
                  onPress={() => this.toggleModal(TARGET.FROM_LEC)}
                  // onPress={() => this.props.screenState.toggleWriteMemoModal(TARGET.FROM_LEC)}
                >
                  <View style={styles.lecListTitle}>
                    <CustomTextR
                      style={styles.lecListTitleText}
                      numberOfLines={1}>
                      {this.getSelectedLecItemTitle()}
                    </CustomTextR>
                  </View>
                  <View style={styles.lecListIcon}>
                    <Image
                      style={styles.lecListIconImage}
                      source={require('../../../../assets/icons/btn_select_open_on.png')}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.lecKangListContainer}>
                <TouchableOpacity
                  style={styles.lecKangListWrapper}
                  onPress={() => this.toggleModal(TARGET.FROM_LEC_KANG)}
                  // onPress={() => this.props.screenState.toggleWriteMemoModal(TARGET.FROM_LEC_KANG)}
                >
                  <View style={styles.lecKangListTitle}>
                    <CustomTextR
                      style={styles.lecKangListTitleText}
                      numberOfLines={1}>
                      {this.getSelectedLecKangItemTitle()}
                    </CustomTextR>
                  </View>
                  <View style={styles.lecKangListIcon}>
                    <Image
                      style={styles.lecKangListIconImage}
                      source={require('../../../../assets/icons/btn_select_open_on.png')}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.contentMain}>
              <TextInput
                ref={(ref) => this.textInput = ref}
                style={styles.contentMainInput}
                placeholder="내용을 입력 해주세요."
                placeholderTextColor={DEFAULT_COLOR.base_color_bbb}
                //clearTextOnFocus={true}
                onChangeText={text => this.onChangeMemoContent(text)}
                multiline={true}
                value={this.getDataMemoContent()}
              />
            </View>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.footerWrapper}
              onPress={() => this.createMemoItemRemote()}>
              <CustomTextB style={styles.footerText}>저장</CustomTextB>
            </TouchableOpacity>
          </View>
          <Modal
            onBackdropPress={this.toggleModal}
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
              style={[styles.modalContainer, {height: SCREEN_HEIGHT * 0.5}]}>
              {this.getModalContent(this.state.modalContent)}
            </View>
          </Modal>
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    IndicatorContainer : {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: HEADER_HEIGHT,
        borderBottomWidth: 0.5,
        borderBottomColor: DEFAULT_COLOR.base_color_bbb,
        paddingBottom: 16,
    },
    headerLeft: {
        flex: 1,
    },
    headerCenter: {
        flex: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenterTitle: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(18),
        lineHeight: 18 * 1.42,
    },
    headerRight: {
        flex: 1,
    },
    headerRightWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerRightIcon: {
        width: 16,
        height: 16,
    },
    content: {
        height: CONTENT_HEIGHT,
    },
    contentHeader: {
        flex: isIphoneX() ? 1 : 1,
        flexDirection: 'column',
        margin: 20,
        justifyContent: 'center',
    },
    lecListContainer: {
        flex: 1,
        alignItems: 'center',
        //backgroundColor: '#FF0000',
        justifyContent: 'flex-end',
    },
    lecListWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        //paddingTop: 12,
        //paddingBottom: 12,
        borderWidth: 1,
        borderColor: DEFAULT_COLOR.base_color_888,
        borderRadius: 5,
    },
    lecListTitle: {
        flex: 9,
        marginLeft: 16,
        marginRight: 10,
        marginTop: 13.5,
        marginBottom: 11.3,

    },
    lecListTitleText: {
        color: '#444444',
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
        lineHeight: DEFAULT_TEXT.body_14 * 1.42,
    },
    lecListIcon: {
        flex: 1,
        alignItems: 'center',
    },
    lecListIconImage: {
        width: 12,
        height: 12,
    },
    lecKangListContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 15,
        //backgroundColor: '#00FF00',
    },
    lecKangListWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        //paddingTop: 12,
        //paddingBottom: 12,
        borderWidth: 1,
        borderColor: DEFAULT_COLOR.base_color_888,
        borderRadius: 5,
    },
    lecKangListTitle: {
        flex: 9,
        marginLeft: 16,
        marginRight: 10,
        marginTop: 13.5,
        marginBottom: 11.3,
    },
    lecKangListTitleText: {
        color: '#444444',
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
        lineHeight: DEFAULT_TEXT.body_14 * 1.42,
    },
    lecKangListIcon: {
        flex: 1,
        alignItems: 'center',
    },
    lecKangListIconImage: {
        width: 12,
        height: 12,
    },
    contentMain: {
        flex: isIphoneX() ? 5 : 3,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: DEFAULT_COLOR.input_border_color,
        borderRadius: 5,
    },
    contentMainInput: {
        margin: 16,
        color: DEFAULT_COLOR.base_color_666,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
        lineHeight: DEFAULT_TEXT.body_14 * 1.42,
    },
    footer: {
        width: SCREEN_WIDTH,
        height: FOOTER_HEIGHT,
        backgroundColor: DEFAULT_COLOR.base_color_222,
    },
    footerWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerText: {
        color: DEFAULT_COLOR.base_color_fff,
        fontSize: PixelRatio.roundToNearestPixel(18),
        lineHeight: 18 * 1.42,
    },
    modalContainer: {
      marginTop: STATUS_BAR_HEIGHT, //SCREEN_HEIGHT * 0.05,
      backgroundColor: '#fff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
});

const mapStateToProps = state => {
  return {
    myInterestCodeOne: state.GlabalStatus.myClassClassList,
  };
};

export default connect(mapStateToProps, null)(MyMemoWriteModal2);