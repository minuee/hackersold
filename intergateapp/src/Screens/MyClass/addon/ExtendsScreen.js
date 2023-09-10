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
  Dimensions,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {CheckBox} from 'react-native-elements';
import moment from 'moment';
import HTMLConvert from '../../../Utils/HtmlConvert/HTMLConvert';
import {BoxShadow} from '../../../Utils/react-native-shadow';

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
import CommonFunction from '../../../Utils/CommonFunction';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

class ExtendsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            selectedExtendsProduct: null,
            classData: props.screenState.classData || {},
            extendProduct: [],
            extendsInfoMessage: [],
            userInfo: {},
            apiDomain: '',
        };
        // this.classData = props.classData;
    }

    async UNSAFE_componentWillMount() {
        const userInfo = await CommonUtil.getUserInfo();
        this.setState({
            userInfo: userInfo,
            apiDomain: SERVICES[this.props.myClassServiceID].apiDomain,
        });

        // /myClass/product/extend/{memberIdx}/{memberProductIdx}
        this.setState({loading: true});
        const memberIdx = userInfo.memberIdx;
        // const url = DEFAULT_CONSTANTS.apiTestDomain + '/v1/myClass/product/extend/' + memberIdx + '/' + this.state.classData.memberProductIdx;
        const url = SERVICES[this.props.myClassServiceID].apiDomain + '/v1/myClass/product/extend/' + memberIdx + '/' + this.state.classData.memberProductIdx;
        const options = {
            method: 'GET',
            headers: {
                ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
            },
        };
        await CommonUtil.callAPI(url, options, 10000)
            .then(response => {
                if (response && response.code === '0000') {
                    this.setState({
                        loading: false,
                        extendProduct: response.data.product,
                    });
                    // Alert.alert('', '일시정지 신청 완료', [{text: '확인', onPress: () => {this.props.screenState.closeModal()}}]);
                } else {
                    this.setState({loading: false});
                    response.message
                        ? Alert.alert('', response.message)
                        : Alert.alert('', '수강연장 상품 불러오기 실패');
                }
            })
            .catch(error => {
                console.log('error : ', error);
                this.setState({loading: false});
                // Alert.alert('Error', '시스템 에러');
            });

        // 관리자에서 불러온 메세지 셋팅
        this.setMessage();
    }

    // 안내메세지
    setMessage = async () => {
        const infoMessages = await CommonUtil.getInfoMessage(this.props.myClassServiceID);
        if (infoMessages.result === true) {
            if (infoMessages.response.code === '0000') {
                this.setState({
                    extendsInfoMessage: infoMessages.response.data.message.extends || [],
                });
            } else {
                Alert.alert('', infoMessages.response.message || '안내메세지 로딩 실패');
            }
        } else {
            Alert.alert('', infoMessages.error || '안내메세지 로딩 실패');
        }
    };

    onPressProduct = item => {
        this.setState({
            selectedExtendsProduct: item,
        });
    };

    handlePressApply = async () => {
        if (Platform.OS === 'ios') {
            Alert.alert('', 'pc 또는 모바일 웹에서\n재수강 신청을 진행해주세요.');
            return;
        }

        if (CommonUtil.isEmpty(this.state.selectedExtendsProduct)) {
            Alert.alert('', '수강연장 상품을 선택해 주세요.');
            return;
        }
        
        this.props.screenState.extendsCourse(this.state.selectedExtendsProduct);
    };

    render() {
        const shadowOpt = {
			width: SCREEN_WIDTH,
			height: Platform.OS === 'ios' ? 58 : 50,
			color: "#000",
			border: 10,
			radius: 0,
			opacity: 0.25,
			x: 0,
			y: 0,
			style: {justifyContent: 'center'}
        };
        if (this.state.loading === true) {
            return (<View style={MyClassStyles.IndicatorContainer}><ActivityIndicator size="large" /></View>);
        } else {
            return (
                <View style={styles.container}>
                    <View style={MyClassStyles.inModalHeader}>
                        <CustomTextR style={MyClassStyles.inModalHeaderTitleText}>수강연장 신청</CustomTextR>
                        <TouchableOpacity onPress={() => this.props.screenState.closeModal()} style={MyClassStyles.inModalCloseBtn}>
                            <Image source={require('../../../../assets/icons/btn_close_pop.png')} style={MyClassStyles.inModalCloseBtnImage} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.bodyScroll} contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={styles.wrapper}>
                            <View style={{marginTop: 23}}>
                                <CustomTextM style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18), color: '#222', fontWeight: '500', letterSpacing: -0.9, marginBottom: 11}}>{this.state.classData.className}</CustomTextM>
                                <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13), color: '#222', lineHeight: 13 * 1.42}}>{this.state.classData.teacherName}</CustomTextR>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 12}}>
                                    <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13), color: '#888888'}}>수강기간 </CustomTextR>
                                    <TextRobotoM style={{color: '#28a5ce', fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13), fontWeight: '500',}}>
                                        {this.state.classData.takeCourseBeginDatetime && moment(this.state.classData.takeCourseBeginDatetime).format('YYYY.MM.DD') || ''} ~{' '}
                                        {this.state.classData.takeCourseEndDatetime && moment(this.state.classData.takeCourseEndDatetime).format('YYYY.MM.DD') || ''}
                                    </TextRobotoM>
                                </View>
                            </View>

                            <View style={{height: 1, width: '90%', backgroundColor: '#e8e8e8', marginTop: 18, marginBottom: 18}}></View>

                            <View style={styles.productListSection}>
                                {this.state.extendProduct.map((item, key) => {
                                    return (
                                        <TouchableOpacity style={[styles.productListRow, (this.state.selectedExtendsProduct && item.extendDay === this.state.selectedExtendsProduct.extendDay) && styles.productListRowOn]} key={key} onPress={() => this.onPressProduct(item)}>
                                            <View style={styles.productLeft}>
                                                <CheckBox
                                                    checkedIcon={<Image
                                                        source={require('../../../../assets/icons/btn_check_on.png')} 
                                                        style={{width: 23, height: 23, marginRight: 20}} />}
                                                    uncheckedIcon={<Image
                                                        source={require('../../../../assets/icons/btn_radio_off.png')} 
                                                        style={{width: 23, height: 23, marginRight: 20}} />}
                                                    checked={this.state.selectedExtendsProduct && item.extendDay === this.state.selectedExtendsProduct.extendDay}
                                                    onPress={() => this.onPressProduct(item)}
                                                    containerStyle={{padding: 0, margin: 0}}
                                                />
                                                {/* <Image
                                                    source={(this.state.selectedExtendsProduct && item.extendDay === this.state.selectedExtendsProduct.extendDay) ? require('../../../../assets/icons/btn_check_on.png') : require('../../../../assets/icons/btn_radio_off.png')} 
                                                    style={{width: 23, height: 23, marginRight: 20}} /> */}
                                                <View style={styles.productLeftTextArea}>
                                                    <CustomTextM style={{color: '#222222', fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16), fontWeight: '500', letterSpacing: -0.8}}>{item.productName}</CustomTextM>
                                                </View>
                                            </View>
                                            <View style={styles.productRight}>
                                                <TextRobotoM style={{color: '#222222', fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16), fontWeight: '500', letterSpacing: -0.8}}>
                                                    {CommonFunction.currencyFormat(item.price)}
                                                </TextRobotoM>
                                                <CustomTextM style={{color: '#222222', fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16), fontWeight: '500', letterSpacing: -0.8}}>원</CustomTextM>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                                {(CommonUtil.isEmpty(this.state.extendProduct) || this.state.extendProduct.length === 0) && (
                                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <CustomTextR style={{color: '#222222', fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16), letterSpacing: -0.8}}>
                                            수강연장 상품이 없습니다.
                                        </CustomTextR>
                                    </View>
                                )}
                            </View>

                            <View style={MyClassStyles.addonHowToUseMsgSection}>
                                {this.state.extendsInfoMessage.map(
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
                    </ScrollView>
                    <BoxShadow setting={shadowOpt}>
                        <View style={MyClassStyles.inModalBottomStickyButtonSection}>
                            {/* <BoxShadow setting={shadowOpt}> */}
                                <TouchableOpacity style={MyClassStyles.inModalBottomStickyButton} onPress={() => this.handlePressApply()}>
                                    <CustomTextB style={MyClassStyles.inModalBottomStickyButtonText}>신청</CustomTextB>
                                </TouchableOpacity>
                            {/* </BoxShadow> */}
                        </View>
                    </BoxShadow>
                </View>
            );
        }
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
    marginHorizontal: 20,
  },
  bodyScroll: {
    // height: '100%',
    // backgroundColor: 'yellow',
    flex: 1,
  },
  productListSection: {
    width: '100%',
    justifyContent: 'center',
    // marginVertical: 20,
    // borderWidth: 1,
  },
  productListRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#d8d8d8',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 10,
  },
  productListRowOn: {
    borderColor: '#28a5ce',
  },
  productLeft: {
    flex: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productLeftTextArea: {
    flex: 1,
    flexGrow: 1,
    alignItems: 'center',
  },
  productRight: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

const mapStateToProps = state => {
    return {
        myClassServiceID: state.GlabalStatus.myClassServiceID,
    };
};

export default connect(mapStateToProps, null)(ExtendsScreen);
