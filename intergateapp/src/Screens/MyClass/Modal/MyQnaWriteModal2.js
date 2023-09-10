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
import { isIphoneX, } from "react-native-iphone-x-helper";
import LinearGradient from "react-native-linear-gradient";
import {getStatusBarHeight} from 'react-native-status-bar-height';
import ImagePicker from 'react-native-image-picker';

import PickerLecModal2 from './PickerLecModal2'; // 선생님께 질문 & 메모장 강좌 선택 모달
import PickerLecKangModal2 from './PickerLecKangModal2'; // 선생님께 질문 & 메모장 강의 선택 모달

import {CustomTextB, CustomText, CustomTextR} from "../../../Style/CustomText";
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

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

const PICKER_ITEM_WIDTH = ( SCREEN_WIDTH - 15 - (15 * 5) ) / 5;
//      = (
//          SCREEN_WIDTH
//              - style.contentPickerContainer.marginLeft
//              - ( style.contentPickerItemContainer.marginRight * 5)
//        ) / 5
//      = ( SCREEN_WIDTH - 15 - (15 * 4) ) / 5

// TODO Modal 및 강좌 리스트 모듈화(선생님께 질문하기 페이지 내 ImagePicker 고려 필요)

class MyQnaWriteModal2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      memberIdx: 0,
      ownLecItems: [], //props.screenState.ownLecItems,
      attachedFileSize: 0,
      attachedItems: [],
      attachedCount: 0,
      isShowModal: false,
      modalContent: '',
      typedTitle: '',
      typedContent: '',
      ableFileCnt: 0,
      apiDomain: '',
      selectedMemberClassIdx: props.screenState.classData.memberClassIdx,
      setDataLecListModel: this.setDataLecListModel.bind(this),
      setDataLecKangListModel: this.setDataLecKangListModel.bind(this),
      getSelectedLecKangItems: this.getSelectedLecKangItems.bind(this),
    };
  }

  async UNSAFE_componentWillMount() {
    const memberIdx = await CommonUtil.getMemberIdx();
    this.setState({
      memberIdx: memberIdx,
      apiDomain: SERVICES[this.props.myClassServiceID].apiDomain,
    });
    this.getOwnLectureList();
  }

  handleChoosePhoto = async () => {
    await this.localcheckfile();
  };

  localcheckfile = () => {
    const options = {
      noData: true,
    };
    const ableUploadCount = parseInt(this.state.ableFileCnt) === -1 ? 5 : parseInt(this.state.ableFileCnt);
    ImagePicker.launchImageLibrary(options, response => {
      try {
        if (response.type.indexOf('image') !== -1) {
          if (response.uri) {
            if (ableUploadCount <= parseInt(this.state.attachedCount)) {
              Alert.alert('', '업로드는 ' + ableUploadCount + '개까지 가능합니다.');
              return;
            }else if (parseInt((this.state.attachedFileSize + response.fileSize)/1024/1024) > 50) {
              Alert.alert('image upload error', '50MB를 초과하였습니다.');
              return;
            } else {
              // var newAttachedItem = this.state.attachedItems;

              // newAttachedItem.push({
              //   type: response.type === undefined ? 'txt' : response.type,
              //   origURL: response.origURL,
              //   imageUrl: response.uri,
              //   height: response.height,
              //   width: response.width,
              //   fileSize: response.fileSize,
              //   fileName: response.fileName,
              // });
              this.setState({
                // attachedItems: newAttachedItem,
                attachedItems: [
                  ...this.state.attachedItems,
                  response,
                ],
                attachedFileSize: this.state.attachedFileSize + response.fileSize,
                attachedCount: this.state.attachedCount + 1,
              });

              // this.props.state.insertTmpItemRemote(newAttachedItem);

              //this.ScrollView.scrollToEnd({ animated: true});
            }
          }
        }else{
          Alert.alert('image upload error', '정상적인 이미지 파일이 아닙니다.');
          return;
        }
      }catch(e){
        console.log("eerorr ", e)
      }
    });
  };

  removeAttachedItems = index => {
    var newPickerItems = this.state.attachedItems.filter(function(item, newIndex) {
      return index !== newIndex;
    });

    this.setState({attachedItems: newPickerItems});
  };

  renderAttachedItems = () => {
    return (
      <View style={styles.contentPickerContainer}>
        {this.state.attachedItems.map((item, index) => {
          return (
            <TouchableOpacity
              style={styles.contentPickerItemContainer}
              onPress={() => this.removeAttachedItems(index)}>
              <View style={styles.contentPickerItemWrapper}>
                <Image
                  style={styles.contentPickerItemImage}
                  source={{uri: item.uri}}
                />
                <Image
                  style={styles.contentPickerItemRemover}
                  source={require('../../../../assets/icons/btn_img_file_del.png')}
                />
              </View>
            </TouchableOpacity>
          );
        })}
        {this.state.attachedItems.length < 5 && (
          <TouchableOpacity
            style={styles.contentPickerItemContainer}
            onPress={() => this.handleChoosePhoto()}>
            <Image
              style={styles.contentPickerItemImage}
              source={require('../../../../assets/icons/btn_img_file_add_wh.png')}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // 글 작성용 강좌&강의 목록 조회
  getOwnLectureList = async () => {
    this.setState({loading: true});
    // const aPIsDomain = !CommonUtil.isEmpty(this.props.myInterestCodeOne) && typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
    const url = this.state.apiDomain + '/v1/myClass/class/'+ this.state.memberIdx;
    const options = {
      method: 'GET',
      headers: {
        ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
      },
    };
    await CommonUtil.callAPI(url, options, 10000)
      .then(response => {
        // console.log('getOwnLectureList()', 'response = ' + JSON.stringify(response));

        this.setState({loading: false});
        if (response && response.code === '0000') {
          let ownLecItems = response.data.class;
          // console.log('getOwnLectureList()', 'ownLecItems = ' + JSON.stringify(ownLecItems));
          this.setState({
            ableFileCnt: CommonUtil.isEmpty(response.data.ableFileCnt) ? 0 : response.data.ableFileCnt,
            ownLecItems: ownLecItems,
            selectedMemberClassIdx: this.state.selectedMemberClassIdx, // ownLecItems[0].memberClassIdx,
            // selectedLectureNo: ownLecItems[0].lecture.lectureNo[0],
          });
        } else {
          response.message
            ? Alert.alert('', response.message)
            : Alert.alert('', '강좌 목록을 불러오는데 실패 했습니다.\n잠시 후 다시 시도해 주세요.', [
              {text: '확인', onPress: () => this.props.screenState.toggleWriteModal()}
            ]);
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({
          loading: false,
        });
        Alert.alert('', '시스템 에러: 강좌 목록을 불러오는데 실패 했습니다.\n잠시 후 다시 시도해 주세요.', [
          {text: '확인', onPress: () => this.props.screenState.toggleWriteModal()}
        ]);
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
    }d
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

  // 질문 제목
  onChangeTitle = text => {
    this.setState({
      typedTitle: text,
    });
  };

  // 질문 내용
  onChangeContent = text => {
    this.setState({
      typedContent: text,
    });
  };

  // 선생님께 질문 저장
  createItemRemote = async () => {
    this.setState({loading: true});
    // const aPIsDomain = !CommonUtil.isEmpty(this.props.myInterestCodeOne) && typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
    const url = this.state.apiDomain + '/v1/myClass/teacherQuestion/' + this.state.memberIdx;
    const formData = new FormData();
    // formData.append('memberProductIdx', this.state.classList.find(item => item.memberClassIdx === this.state.selectedLecItemMemberClassIdx).memberProductIdx);
    formData.append('memberClassIdx', this.state.selectedMemberClassIdx);
    // formData.append('memberLectureIdx', memberLectureIdx);
    formData.append('questionTitle', this.state.typedTitle);
    formData.append('questionContent', this.state.typedContent);
    formData.append('regDevice', 'mobile');
    this.state.attachedItems.forEach((item, i) => {
      formData.append('attachFile[]', item);
    });
    const options = {
      method: 'POST',
      headers: {
        ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
      },
      body: formData,
    };

    await CommonUtil.callAPI(url, options, 10000)
      .then(response => {
        this.setState({loading: false});
        if (response && response.code === '0000') {
          // this.getQuestionList();
          Alert.alert('', '저장되었습니다.', [
            {text: '확인', onPress: () => this.props.screenState.toggleWriteModal()}
          ]);
        } else {
          response.message
            ? Alert.alert('', response.message)
            : Alert.alert('', '저장에 실패했습니다.');
        }
      })
      .catch(error => {
        console.log('error : ', error);
        this.setState({loading: false});
        Alert.alert('', '[시스템 에러] 관리자에게 문의해 주세요.');
      });
  };

  // toggle 강좌 선택 모달
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
                질문 추가
              </CustomTextR>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.headerRightWrapper}
                onPress={() => this.props.screenState.toggleWriteModal()}>
                <Image
                  style={styles.headerRightIcon}
                  source={require('../../../../assets/icons/btn_close_pop.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.content}>
            <View style={styles.contentHeader}>
              <View style={styles.lecListContainer}>
                <TouchableOpacity
                  style={styles.lecListWrapper}
                  onPress={() => this.toggleModal(TARGET.FROM_LEC)}>
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
                {/* <View style={styles.lecKangListContainer}>
                    <TouchableOpacity
                        style={styles.lecKangListWrapper}
                        onPress={() => this.props.screenState.toggleWriteModal(TARGET.FROM_LEC_KANG)}
                        >
                        <View style={styles.lecKangListTitle}>
                            <CustomTextR
                                style={styles.lecKangListTitleText}
                                numberOfLines={1}
                                >
                                { this.props.screenState.getSelectedLecKangItemTitle() }
                            </CustomTextR>
                        </View>
                        <View style={styles.lecKangListIcon}>
                            <Image
                                style={styles.lecKangListIconImage}
                                source={require('../../../../assets/icons/btn_select_open_on.png')}
                            />
                        </View>
                    </TouchableOpacity>
                </View> */}
            </View>

            <View style={styles.contentMain}>
              <View style={styles.contentMainWrapper}>
                <TextInput
                  style={[
                    styles.contentMainCommon,
                    styles.contentMainTitleInput,
                  ]}
                  placeholder="제목을 입력 해주세요"
                  placeholderTextColor={DEFAULT_COLOR.base_color_bbb}
                  onChangeText={text => this.onChangeTitle(text)}
                  value={this.state.typedTitle}
                />
                <TextInput
                  style={[
                    styles.contentMainCommon,
                    styles.contentMainContentInput,
                  ]}
                  placeholder="내용을 입력 해주세요."
                  placeholderTextColor={DEFAULT_COLOR.base_color_bbb}
                  //clearTextOnFocus={true}
                  onChangeText={text => this.onChangeContent(text)}
                  multiline={true}
                  value={this.state.typedContent}
                  textAlignVertical={'top'}
                />
              </View>
              {this.renderAttachedItems()}
            </View>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.footerWrapper}
              onPress={() => this.createItemRemote()}>
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
    // flex: isIphoneX() ? 1 : 1,
    flexDirection: 'column',
    // margin: 20,
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  lecListContainer: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 20,
  },
  lecListWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: DEFAULT_COLOR.base_color_888,
    borderRadius: 4,
  },
  lecListTitle: {
    flex: 9,
    marginLeft: 16,
  },
  lecListTitleText: {
    color: '#444444',
    fontSize: PixelRatio.roundToNearestPixel(14),
    lineHeight: 14 * 1.42,
    letterSpacing: -0.7,
  },
  lecListIcon: {
    flex: 1,
    alignItems: 'center',
  },
  lecListIconImage: {
    width: 12,
    height: 12,
  },
    /*
    <View style={styles.contentHeader}>
        <View style={styles.lecListContainer}>
            <TouchableOpacity style={styles.lecListWrapper}>
                <View style={styles.lecListTitle}>
                    <CustomTextR
                        style={styles.lecListTitleText}
                        numberOfLines={1}
                        >
                        [550점+] 목표 해커스 토익 스타트 Listening 목표 해커스 토익 스타트 Listening
                    </CustomTextR>
                </View>
                <View style={styles.lecListIcon}>
                    <Image
                        style={styles.lecListIconImage}
                        source={require('../../../assets/icons/btn_select_open_on.png')}
                        />
                </View>
            </TouchableOpacity>
        </View>
        <View style={styles.lecKangListContainer}>
            <TouchableOpacity style={styles.lecKangListWrapper}>
                <View style={styles.lecKangListTitle}>
                    <CustomTextR
                        style={styles.lecKangListTitleText}
                        numberOfLines={1}
                        >
                        제 1강
                    </CustomTextR>
                </View>
                <View style={styles.lecKangListIcon}>
                    <Image
                        style={styles.lecKangListIconImage}
                        source={require('../../../assets/icons/btn_select_open_on.png')}
                    />
                </View>
            </TouchableOpacity>
        </View>
    </View>
    */
  lecKangListContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lecKangListWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: DEFAULT_COLOR.base_color_888,
    borderRadius: 4,
  },
  lecKangListTitle: {
    flex: 9,
    marginLeft: 16,
  },
  lecKangListTitleText: {
    color: '#444444',
    fontSize: PixelRatio.roundToNearestPixel(14),
    lineHeight: 14 * 1.42,
    letterSpacing: -0.7,
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
  },
  contentMainWrapper: {
    flex: 1,
  },
  contentPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: 55,
    marginLeft: 15,
    //marginRight: 15,
    marginBottom: 30,
  },
    /*
    contentPickerItemContainer: {
        height: PICKER_ITEM_WIDTH,
    },
    */
  contentPickerItemContainer: {
    paddingRight: 15,
  },
  contentPickerItemImage: {
    width: PICKER_ITEM_WIDTH,
    height: PICKER_ITEM_WIDTH,
  },
  contentPickerItemRemover: {
    position: 'absolute',
    width: PICKER_ITEM_WIDTH / 2,
    height: PICKER_ITEM_WIDTH / 2,
    right: 0,
    bottom: 0,
  },
  contentMainCommon: {
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 16,
    paddingRight: 16,
    paddingVertical: isIphoneX() ? 0 : 8,
    borderWidth: 1,
    borderColor: DEFAULT_COLOR.input_border_color,
    borderRadius: 4,
    color: DEFAULT_COLOR.base_color_666,
    fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
    lineHeight: DEFAULT_TEXT.body_14 * 1.42,
  },
  contentMainTitleInput: {
    flex: 1,
    marginBottom: 6,
  },
  contentMainContentInput: {
    flex: 9,
    paddingTop: 15,
    marginBottom: 20,
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
    myClassServiceID: state.GlabalStatus.myClassServiceID,
    myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,
  };
};

export default connect(mapStateToProps, null)(MyQnaWriteModal2);
