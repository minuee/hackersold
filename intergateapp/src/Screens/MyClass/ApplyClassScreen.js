import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  ScrollView,
  PixelRatio,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import moment from 'moment';

import ApplyClassList from './ApplyClassList';
import AttendCalendar from './AttendCalendar';
import MyClassStyles from '../../Style/MyClass/MyClassStyle';

//공통상수
import * as getDEFAULT_CONSTANTS from '../../Constants';
import COMMON_STATES, {SERVICES} from '../../Constants/Common';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomText, CustomTextR, CustomTextM, CustomTextB, TextRobotoM, TextRobotoR} from '../../Style/CustomText';

import Icon from 'react-native-vector-icons/FontAwesome';
import Icon3 from 'react-native-vector-icons/Entypo';
Icon.loadFont();
Icon3.loadFont();

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// 수강상태
const PRODUCT_STATUS_BEFORE = '수강예정';
const PRODUCT_STATUS_ING = '수강중';
const PRODUCT_STATUS_PAUSE = '일시정지';
const PRODUCT_STATUS_DONE = '수강완료';
const PRODUCT_STATUS_HIDE = '숨긴 강좌';

// list Item
const RenderItem = props => {
  const productData = props.productData;
  const getProductBadgeStyle = type => {
    switch (type) {
      case '단과':
        return MyClassStyles.classRoundedBadgeBlue;
      case '종합(패키지)':
        return MyClassStyles.classRoundedBadgeBlue;
      case '프리패스':
        return MyClassStyles.classRoundedBadgeGreen;
      case '환급반':
        return MyClassStyles.classRoundedBadgeYellow;
      case '평생반':
        return MyClassStyles.classRoundedBadgePurple;
      case '모의고사':
        return MyClassStyles.classRoundedBadgeDkBlue;
      case '첨삭':
        return MyClassStyles.classRoundedBadgeSkBlue;
      case PRODUCT_STATUS_BEFORE:
        return MyClassStyles.classRoundedBadgeGray;
      case PRODUCT_STATUS_ING:
        return MyClassStyles.classRoundedBadgeSkBlue;
      default:
        return MyClassStyles.classRoundedBadgeGray;
    }
  };

  const getMissionTypeName = type => {
    switch (type) {
      case 'attend':
        return '출석미션';
      case 'refund':
        return '성적미션';
      case 'challenge':
        return '도전미션';
      default:
        return type;
    }
  };

  return (
    <TouchableOpacity onPress={() => props.showApplyClass()}>
      <View style={[styles.flexDirCol, styles.listItem]}>
        <View style={styles.flexDirRow}>
          {/* 상품유형 */}
          {/* 사용안함
            <View
              style={[
                MyClassStyles.applyClassRoundedBadge,
                getProductBadgeStyle(productData.productPattern),
                {borderWidth: 1, borderColor: '#fff'}
              ]}>
              <Text style={MyClassStyles.applyClassRoundedBadgeText}>{productData.productPattern}</Text>
            </View>
          */}

          {/* 수강상태 */}
          <View
            style={[
              MyClassStyles.applyClassRoundedBadge,
              getProductBadgeStyle(productData.productStatus),
            ]}>
            <CustomTextM style={MyClassStyles.applyClassRoundedBadgeText}>{productData.productStatus}</CustomTextM>
          </View>

          {/* 미션유형 */}
          {!CommonUtil.isEmpty(productData.missionType) && (
            <View
              style={[
                MyClassStyles.applyClassRoundedBadge,
                MyClassStyles.classRoundedBadgeDgGray,
                {flexDirection: 'row', justifyContent: 'center', alignItems: 'center'},
              ]}>
              <Image source={require('../../../assets/icons/icon_mission.png')} style={{width: 11, height: 8, marginRight: 3, marginTop: 1}} />
              <CustomTextM style={MyClassStyles.applyClassRoundedBadgeText}>{getMissionTypeName(productData.missionType)}</CustomTextM>
            </View>
          )}
        </View>

        <View style={{flexDirection: 'row', marginTop: 12}}>
          <CustomTextM
            style={{
              fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),
              fontWeight: '500',
              fontStyle: 'normal',
              letterSpacing: -0.8,}}>
            {productData.productName}
          </CustomTextM>
        </View>

        {/* 수강예정 */}
        {(productData.productStatus === PRODUCT_STATUS_BEFORE) && (
          <View style={{marginTop: 12}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <CustomTextR style={styles.classInfoDefaultText}>수강 기간{' '}
                <TextRobotoM style={styles.classInfoBlText}>{productData.courseDays}</TextRobotoM>
                일
              </CustomTextR>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
              <CustomTextR style={styles.classInfoDefaultText}>자동 시작일{' '}
                <TextRobotoM style={styles.classInfoBlText}>{productData.validBeginDatetime}</TextRobotoM>
              </CustomTextR>
            </View>
          </View>
        )}

        {/* 수강중, 미션 */}
        {(productData.productStatus === PRODUCT_STATUS_ING && !CommonUtil.isEmpty(productData.missionType)) && (
          <View style={{marginTop: 12}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <CustomTextR style={styles.classInfoDefaultText}>수강 기간{' '}
                <TextRobotoM style={styles.classInfoBlText}>
                  {CommonUtil.dateFormat(
                    'yyyy.MM.dd',
                    productData.takeCourseBeginDatetime,
                  )}{' '}
                  ~{' '}
                  {CommonUtil.dateFormat(
                    'yyyy.MM.dd',
                    productData.takeCourseEndDatetime,
                  )}
                </TextRobotoM>
              </CustomTextR>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CustomTextR style={styles.classInfoDefaultText}>출석 일수{' '}
                  <TextRobotoM style={styles.classInfoBlText}>{productData.missionAttendSuccessDays || 0}</TextRobotoM>
                  <TextRobotoR style={styles.classInfoDefaultText}>/{productData.missionAttendRequireDays}일</TextRobotoR>
                </CustomTextR>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                <TouchableOpacity style={[styles.flexDirRow, {justifyContent: 'center', alignItems: 'center'}]} onPress={() => props.showAttendCalendar()}>
                  <CustomTextM style={[styles.classInfoDefaultText, {color: '#0e3a48'}]}> 환급반 달력</CustomTextM>
                  <Image source={require('../../../assets/icons/btn_my_calendar_bg.png')} style={{width: 23, height: 23, marginLeft: 5}} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// 수강예정, 종료 강좌 터치 시 모달
const ModalClassInfoMsg = props => {
    return (
        <View style={{width: '100%', height: SCREEN_HEIGHT * 0.45 + 30, paddingBottom: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderTopLeftRadius: 15, borderTopRightRadius: 15}}>
            {/* <View style={{alignItems: 'center', justifyContent: 'center', height: 35, position: 'absolute', top: 10}}>
                <TouchableOpacity
                    onPress={() => {
                      props.screenState.closeModal();
                    }}
                    style={{padding: 5}}>
                    <Icon3 name="chevron-thin-down" size={15} color={DEFAULT_CONSTANTS.base_color_222} />
                </TouchableOpacity>
            </View> */}
            <Image source={require('../../../assets/icons/icon_none_exclamation.png')} style={{width: 65, height: 65, marginBottom: 15}} />
            <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14), letterSpacing: -0.7, textAlign: 'center'}}>
                수강예정 강의입니다{'\n'}
                수강을 시작하면 수강신청이 가능합니다
            </CustomTextR>
            {props.screenState.selectedProduct.productStatus === PRODUCT_STATUS_BEFORE && (
                <TouchableOpacity
                    style={{position: 'absolute', bottom: 30, left: 20, right: 20, height: 45, borderRadius: 4, backgroundColor: DEFAULT_COLOR.lecture_base, justifyContent: 'center', alignItems: 'center'}}
                    onPress={() => props.screenState.startClass()}>
                    <CustomTextM style={{fontWeight: '500', letterSpacing: -0.84, color: '#fff', fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14), lineHeight: 14 * 1.42}}>수강 시작</CustomTextM>
                </TouchableOpacity>
          )}
        </View>
    );
};

class ApplyClassScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalContent: '',
            isShowModal: false,
            selectedProduct: {},
            products: this.props.navigation.state.params.products || [],
            showModal: this.showModal.bind(this),
            closeModal: this.closeModal.bind(this),
            startClass: this.startClass.bind(this),
        };
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerStyle: {width: '100%', backgroundColor: DEFAULT_COLOR.myclass_base},
            headerTitle: '환급반 · 패스강의 수강신청',
            headerTitleStyle: MyClassStyles.navibarTitleText,
            headerLeft: <View style={{alignItems: 'center', justifyContent: 'center', marginLeft: 17}}>
                <TouchableOpacity onPress={ () => { navigation.goBack() }}>
                  <Image source={require('../../../assets/icons/btn_back_page.png')} style={{width: 17, height: 17}} />
                </TouchableOpacity>
              </View>,
            headerRight: <View></View>,
        };
    };

    UNSAFE_componentWillMount() {}

    componentDidMount() {}

    componentDidUpdate(prevProps, prevState) {
      // 이전 props, state에 대한 정보
    }

    UNSAFE_componentWillReceiveProps(nextProps) {}

    componentWillUnmount() {}

    // 수강예정 => 수강시작
    startClass = async () => {
        this.setState({loading: true});
        // const aPIsDomain = !CommonUtil.isEmpty(this.props.myInterestCodeOne) && typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        const url = SERVICES[this.props.myClassServiceID].apiDomain + '/v1/myClass/product/start/' + this.state.selectedProduct.memberProductIdx;
        const options = {
            method: 'PUT',
            headers: {
              ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
            },
        };
        await CommonUtil.callAPI(url, options)
            .then(response => {
                if (response && response.code === '0000') {
                    const arrProducts = this.state.products;
                    let newProducts = [];
                    arrProducts.map(product => {
                        if (product.memberProductIdx === this.state.selectedProduct.memberProductIdx) {
                            product.productStatus = PRODUCT_STATUS_ING; // 수강예정
                        }
                        newProducts.push(product);
                    });
                    this.setState({loading: false, products: newProducts});
                    Alert.alert('', '수강 시작', [{text: '확인', onPress: () => this.closeModal()}]);
                } else {
                    this.setState({loading: false});
                    response.message
                        ? Alert.alert(response.message)
                        : Alert.alert('수강 시작 처리에 실패 했습니다.');
                }
            })
            .catch(error => {
                this.setState({
                    loading: false,
                });
                Alert.alert('시스템 에러: 수강 시작 처리 실패');
            });
    };

    // 강좌 터치 시 모달 선택
    classModalCheck = product => {
      if (product.productStatus === PRODUCT_STATUS_BEFORE) {
        this.showModal('classInfoMsg', product);
      } else {
        this.showModal('applyClass', product);
      }
    };

    showModal = async (mode, product) => {
      await this.setState({modalContent: mode, selectedProduct: product});
      this.setState({isShowModal: true});
    };

    closeModal = () => {
      this.setState({modalContent: '', isShowModal: false});
    };

    // 모달 컨텐츠
    getModalContent = modalContent => {
      switch (modalContent) {
        case 'applyClass':
          return <ApplyClassList screenState={this.state} />;
        case 'attendCalendar':
          return <AttendCalendar screenState={this.state} />;
        case 'classInfoMsg':
          return <ModalClassInfoMsg screenState={this.state} />;
      }
    };

    // 모달 컨텐츠에 따라 swipeable modal 상단 닫기 영역 ui 다르게하기
    isSwipeableModal = () => {
        const swipeableModalContent = ['applyClass', 'attendCalendar', 'classInfoMsg'];
        return swipeableModalContent.indexOf(this.state.modalContent) > -1;
    };

    render() {
        // const {products} = this.props.navigation.state.params;
        const products = this.state.products;
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.wrapper}>
                    {products.map((prop, index) => {
                        let product = Object.assign({}, prop);
                        return (
                            <View key={product.memberProductIdx}>
                                <RenderItem
                                    state={this.state}
                                    productData={product}
                                    showApplyClass={() => this.classModalCheck(product)}
                                    showAttendCalendar={() => this.showModal('attendCalendar', product)}
                                />
                            </View>
                        );
                    })}
                </ScrollView>

                <Modal
                    onBackdropPress={this.closeModal}
                    animationType="slide"
                    onRequestClose={() => {
                        this.setState({showModal: false});
                    }}
                    // useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating
                    isVisible={this.state.isShowModal}
                    style={{justifyContent: 'flex-end',margin: 0}}
                    onSwipeComplete={() => this.closeModal()}
                    swipeDirection={['down']}
                    propagateSwipe={true}>
                    <View
                        style={[
                            this.isSwipeableModal() ? MyClassStyles.swipeableModalContainer : styles.modalContainer,
                            {height: this.state.modalContent === 'classInfoMsg' ? SCREEN_HEIGHT * 0.5 : SCREEN_HEIGHT * 0.9}]}>
                        {this.isSwipeableModal() && (
                        <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', height: 30}}>
                            <TouchableOpacity onPress={() => this.closeModal()}>
                                <Image source={require('../../../assets/icons/btn_more_close_wh.png')} style={{width: 18, height: 10}} />
                            </TouchableOpacity>
                        </View>
                        )}
                        {this.getModalContent(this.state.modalContent)}
                    </View>
                </Modal>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),
    textAlign: 'center',
    margin: 10,
  },
  font11: {fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11)},
  font12: {fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12)},
  spaceWidth5: {width: 5},
  flexDirRow: {flexDirection: 'row'},
  flexDirCol: {flexDirection: 'column'},
  roundedBtnSmall: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#efefef',
  },
  roundedBtnNormal: {
    borderRadius: 9,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'skyblue',
    height: 30,
  },
  select2Btn: {
    // paddingVertical: 5,
    overflow: 'hidden',
    // width: 80,
    // flex: 0.6,
  },
  topButtonSection: {
    width: '100%',
    // height: 100,
    justifyContent: 'center',
    backgroundColor: '#efefef',
  },
  listItem: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    // height: 120,
    justifyContent: 'center',
    // flex: 1,
    paddingHorizontal: 20, paddingTop: 21, paddingBottom: 17,
  },
  classInfoDefaultText: {
    fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),
    lineHeight: 13 * 1.42,
    color: '#444',
    letterSpacing: -0.6,
  },
  classInfoBlText: {
    fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),
    lineHeight: 13 * 1.42,
    color: DEFAULT_COLOR.lecture_base,
    letterSpacing: -0.6,
  },
  hiddenItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
  actionBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
  },
  modalContainer: {
    marginTop: SCREEN_HEIGHT * 0.3,
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

export default connect(mapStateToProps, null)(ApplyClassScreen);
