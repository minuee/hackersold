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
    ScrollView, Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import { isIphoneX, } from "react-native-iphone-x-helper";
import LinearGradient from "react-native-linear-gradient";

import {CustomTextB, CustomTextM, CustomTextR, TextRobotoR} from "../../../Style/CustomText";
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../../Constants/index';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

import { TARGET } from './ModalConstant';
import CommonFuncion from "../../../Utils/CommonFunction";

const TOTAL_HEIGHT = SCREEN_HEIGHT * 0.95;
// TOTAL_HEIGHT == MyMemoContent.animatedHeight
const HEADER_PADDING_TOP = 16;
// HEADER_PADDING_TOP == MyMemoContent.styles.modalContainer.paddingTop
const HEADER_HEIGHT = 40;
const FOOTER_HEIGHT = 57;
const CONTENT_HEIGHT = TOTAL_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT - HEADER_PADDING_TOP;

// TODO Modal 및 강좌 리스트 모듈화(선생님께 질문하기 페이지 내 ImagePicker 고려 필요)

export default class MyMemoModifyModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            content: this.props.targetModifyItem.memoContent,
            isVisibleSaveBtn: false,
        }
    }

    componentDidMount() {
        /*
        this.timeout = setTimeout(() => {
                this.setState({ loading: false });
            }, 2000
        );
        */
    }

    onChangeMemoContent = (text) => {
        this.setState({
            content: text,
            isVisibleSaveBtn: this.props.targetModifyItem.memoContent === text ? false : true
        })
    }

    render() {
        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}>
                    <ActivityIndicator size="large" />
                </View>
            )
        } else {
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>

                        </View>
                        <View style={styles.headerCenter}>
                            <CustomTextR style={styles.headerCenterTitle}>
                                메모 상세
                            </CustomTextR>
                        </View>
                        <View style={styles.headerRight}>
                            <TouchableOpacity
                                style={styles.headerRightWrapper}
                                onPress={() => {
                                    //console.log('원본 = ' + this.props.targetModifyItem.memoContent)
                                    //console.log('현재 = ' + this.state.content)

                                    if(this.props.targetModifyItem.memoContent === this.state.content) {
                                        //console.log('원본과 현재는 같음')
                                        this.props.screenState.toggleModifyMemoModal()
                                    } else {
                                        //console.log('원본과 현재가 같지 않음')

                                        Alert.alert('', '작성 중인 내용이 저장되지 않습니다.\n' +
                                            '종료하시겠습니까?', [
                                            {text: '확인', onPress: () => {
                                                    this.props.screenState.toggleModifyMemoModal()
                                                }},
                                            {text: '취소'},
                                        ]);
                                    }
                                }}
                                >
                                <Image
                                    style={styles.headerRightIcon}
                                    source={require('../../../../assets/icons/btn_close_pop.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.contentHeader}>
                            <View style={styles.contentHeaderTitle}>
                                <CustomTextM
                                    style={styles.contentHeaderTitleText}
                                    numberOfLines={2}
                                    >
                                    {this.props.targetModifyItem.lectureName}
                                </CustomTextM>
                            </View>

                            <View style={styles.contentHeaderDesc}>
                                <CustomTextR style={styles.contentHeaderDescKang}>
                                    {'제 ' + this.props.targetModifyItem.lectureNo + '강'}
                                </CustomTextR>
                                <TextRobotoR style={styles.contentHeaderDescDate}>
                                    {CommonFuncion.replaceAll(this.props.targetModifyItem.regDatetime, '-', '.').substring(0, 10)}
                                </TextRobotoR>
                            </View>
                        </View>

                        <View style={styles.contentMain}>
                            <View style={styles.contentMainWrapper}>
                                <TextInput
                                    ref={(ref) => this.textInput = ref }
                                    style={styles.contentMainInput}
                                    placeholder='내용을 입력 해주세요.'
                                    placeholderTextColor={DEFAULT_COLOR.base_color_bbb}
                                    //clearTextOnFocus={true}
                                    onChangeText={text => this.onChangeMemoContent(text)}
                                    multiline={true}
                                    value={this.state.content}
                                />
                            </View>
                            <View style={styles.contentMainControl}>
                                <TouchableOpacity
                                    onPress={() => this.props.screenState.deleteItemRemote(this.props.targetModifyItem.memoIdx)}
                                    style={styles.contentMainControlWrapper}>
                                    <Image
                                        style={styles.contentMainControlIcon}
                                        source={require('../../../../assets/icons/btn_del_waste.png')}
                                    />
                                    <CustomTextR style={styles.contentMainControlText}>
                                        메모삭제
                                    </CustomTextR>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.footer}>
                        {
                            this.state.isVisibleSaveBtn
                                &&
                                    <TouchableOpacity
                                        style={styles.footerWrapper}
                                        onPress={() => {
                                            console.log('MyMemoModifyModal.render()', 'memoIdx = ' + this.props.targetModifyItem.memoIdx)
                                            this.props.screenState.updateItemRemote(
                                                this.props.targetModifyItem.memoIdx,
                                                this.state.content
                                            )
                                        }}>
                                        <CustomTextB style={styles.footerText}>저장</CustomTextB>
                                    </TouchableOpacity>
                                ||
                                    <TouchableOpacity style={styles.footerWrapperNoChange}>
                                        <CustomTextB style={styles.footerText}>저장</CustomTextB>
                                    </TouchableOpacity>
                        }
                    </View>
                </SafeAreaView>
            )
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
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),
        lineHeight: PixelRatio.roundToNearestPixel(22),
        letterSpacing: -0.9,
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
        width: 16.3,
        height: 16.3,
    },
    content: {
        height: CONTENT_HEIGHT,
    },
    contentHeader: {
        flex: isIphoneX() ? 1 : 1,
        flexDirection: 'column',
        margin: 20,
        marginTop: 25,
        justifyContent: 'space-between',
    },
    contentHeaderTitle: {
    },
    contentHeaderTitleText: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),
        lineHeight: PixelRatio.roundToNearestPixel(25),
        letterSpacing: -0.9,
    },
    contentHeaderDesc: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    contentHeaderDescKang: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),
        letterSpacing: 0,
    },
    contentHeaderDescDate: {
        color: '#AAAAAA',
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),
        letterSpacing: 0,
    },
    contentMain: {
        flex: isIphoneX() ? 6 : 4,
    },
    contentMainWrapper: {
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        borderWidth: 1,
        borderColor: DEFAULT_COLOR.input_border_color,
        borderRadius: 4,
    },
    contentMainInput: {
        //marginTop: 16,
        //marginBottom: 16,
        marginLeft: 15.8,
        marginRight: 17.3,
        color: DEFAULT_COLOR.base_color_666,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
        lineHeight: PixelRatio.roundToNearestPixel(25),
        letterSpacing: -0.7,
    },
    contentMainControl: {
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 19,
        marginRight: 20,
    },
    contentMainControlWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    contentMainControlIcon: {
        width: 14.5,
        height: 16,
        marginRight: 6,
    },
    contentMainControlText: {
        color: DEFAULT_COLOR.base_color_888,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
        lineHeight: PixelRatio.roundToNearestPixel(20),
        letterSpacing: -0.7,
    },
    footer: {
        width: SCREEN_WIDTH,
        height: FOOTER_HEIGHT,
    },
    footerWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: DEFAULT_COLOR.lecture_base,
    },
    footerWrapperNoChange: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#d7dce3',
    },
    footerText: {
        color: DEFAULT_COLOR.base_color_fff,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),
        letterSpacing: -0.9,
    },
})