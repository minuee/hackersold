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
} from 'react-native';
import Modal from 'react-native-modal';
import { isIphoneX, } from "react-native-iphone-x-helper";
import LinearGradient from "react-native-linear-gradient";
import ImagePicker from 'react-native-image-picker';
import moment from 'moment';

//HTML 
import HTMLConvert from '../../../Utils/HtmlConvert/HTMLConvert';
const IMAGES_MAX_WIDTH = SCREEN_WIDTH - 50;
const CUSTOM_STYLES = {};
const CUSTOM_RENDERERS = {};
const DEFAULT_PROPS = {
    htmlStyles: CUSTOM_STYLES,
    renderers: CUSTOM_RENDERERS,
    imagesMaxWidth: IMAGES_MAX_WIDTH,
    onLinkPress: (evt, href) => { Linking.openURL(href); },
    debug: true
};

import {CustomTextB, CustomTextM, CustomTextR, TextRobotoR} from "../../../Style/CustomText";
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../../Constants/index';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

import { TARGET, ARTICLE } from './ModalConstant';

const TOTAL_HEIGHT = isIphoneX() ? SCREEN_HEIGHT * 0.90 : SCREEN_HEIGHT * 0.95;
// TOTAL_HEIGHT == MyMemoContent.animatedHeight
const HEADER_PADDING_TOP = 16;
// HEADER_PADDING_TOP == MyMemoContent.styles.modalContainer.paddingTop
const HEADER_HEIGHT = 30;
const FOOTER_HEIGHT = 57;
const CONTENT_HEIGHT = TOTAL_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT - HEADER_PADDING_TOP;

const PICKER_ITEM_WIDTH = ( SCREEN_WIDTH - 15 - 15 - (15 * 5) ) / 5;
//      = (
//          SCREEN_WIDTH
//              - style.content.paddingLeft
//              - style.contentPickerContainer.marginRight
//              - ( style.contentPickerItemContainer.marginRight * 5)
//        ) / 5


// TODO Modal 및 강좌 리스트 모듈화(선생님께 질문하기 페이지 내 ImagePicker 고려 필요)

export default class MyQnaCompleteModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            imageIndex: null,
            isImageViewVisible: false,
            targetItem: {
                ...this.props.screenState.targetCompleteItem,
                files: [
                    {
                        "fileName": "hackers_ingang.png",
                        "fileType": "png",
                        "fileUrl": "http://champ.hackers.com/files/qna/c442929c52847045a51e91b32453c607.png"
                    },
                    {
                        "fileName": "스크린샷 2020-05-25 오후 3.51.41.png",
                        "fileType": "png",
                        "fileUrl": "http://champ.hackers.com/files/qna/df79b188e61d7a6925a7482faca150e5.png"
                    }
                ]
            }
        }

        alert('targetItem = ' + JSON.stringify(this.state.targetItem))
    }

    componentDidMount() {
        /*
        this.timeout = setTimeout(() => {
                this.setState({ loading: false });
            }, 2000
        );
        */
    }

    onChangeContent = (text) => {
        this.setState({
            targetItem: {...this.targetItem, content: text},
        })
    }

    onChangeTitle = (text) => {
        this.setState({
            targetItem: {...this.targetItem, title: text},
        })
    }

    renderAttachedItems = () => {
        return(
            <View style={styles.contentPickerContainer}>
                {
                    this.state.targetItem.files.map((item, index) => {
                        return (
                            <TouchableOpacity
                                style={styles.contentPickerItemContainer}
                                onPress={() => {
                                    this.setState({
                                        imageIndex: index,
                                        isImageViewVisible: true,
                                    })
                                }}
                            >
                                <View style={styles.contentPickerItemWrapper}>
                                    <Image
                                        style={styles.contentPickerItemImage}
                                        source={{ uri: item.source.uri }}
                                    />
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
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
                        <TouchableOpacity
                            style={styles.headerWrapper}
                            onPress={() => this.props.screenState.toggleCompleteModal()}
                            >
                            <Image
                                style={styles.headerIcon}
                                source={require('../../../../assets/icons/btn_more_close_wh.png')}
                                />
                        </TouchableOpacity>
                    </View>
                    {/*
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            {
                                // 답변 완료는 별도 Modal로 진행할 것
                                this.state.targetItem[ARTICLE.TYPE.NAME] === ARTICLE.TYPE.NORMAL
                                &&
                                <View style={styles.headerLeftWrapper}>
                                    <CustomTextR style={styles.headerLeftTitle}>
                                        답변 대기중
                                    </CustomTextR>
                                </View>
                            }
                        </View>
                        <View style={styles.headerCenter}>
                            <CustomTextR style={styles.headerCenterTitle}>
                                {
                                    this.state.targetItem[ARTICLE.TYPE.NAME] === ARTICLE.TYPE.NOTICE
                                        ? '질문 완료'
                                        : '질문 완료'
                                }
                            </CustomTextR>
                        </View>
                        <View style={styles.headerRight}>
                            <TouchableOpacity
                                style={styles.headerRightWrapper}
                                onPress={() => this.props.screenState.toggleModifyModal()}
                                >
                                <Image
                                    style={styles.headerRightIcon}
                                    source={require('../../../../assets/icons/btn_close_pop.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    */}
                    <ScrollView style={styles.content}>
                        <View style={styles.contentHeader}>
                            <View style={styles.contentHeaderTitle}>
                                <CustomTextM
                                    style={styles.contentHeaderTitleText}
                                    numberOfLines={2}
                                    >
                                    {
                                        this.state.targetItem.className
                                        //this.props.screenState.getLecTargetItemTitle(
                                        //    this.state.targetItem.memberClassIdx
                                        //)
                                    }
                                </CustomTextM>
                            </View>

                            <View style={styles.contentHeaderDesc}>
                                <CustomTextR style={styles.contentHeaderDescKang}>
                                    {
                                        //this.state.targetItem.lectureNoName
                                        //this.props.screenState.getLecKangTargetItemTitle(
                                        //    this.state.targetItem.lecIndex,
                                        //    this.state.targetItem.lecKangIndex
                                        //)
                                    }
                                </CustomTextR>
                                <TextRobotoR style={styles.contentHeaderDescDate}>
                                    {this.state.targetItem.regDatetime && moment(this.state.targetItem.regDatetime).format('YYYY.MM.DD')}
                                </TextRobotoR>
                            </View>
                        </View>

                        <View style={styles.contentMain}>
                            <View style={styles.contentMainWrapper}>
                                <View style={styles.contentQuestion}>
                                    <View style={styles.contentQuestionHeader}>
                                        <CustomTextB style={styles.contentQuestionHeaderText}>
                                            { this.state.targetItem.questionTitle }
                                        </CustomTextB>
                                    </View>
                                    <View style={styles.contentQuestionContent}>
                                        <View style={styles.contentQuestionContentTitle}>
                                            <Image
                                                style={styles.contentQuestionContentTitleIcon}
                                                source={require('../../../../assets/icons/icon_my_qa_q.png')}
                                            />
                                            <CustomTextB style={styles.contentQuestionContentTitleText}>
                                                { '질문' }
                                            </CustomTextB>
                                        </View>
                                        <CustomTextR style={styles.contentQuestionContentText}>
                                            { this.state.targetItem.questionContent }
                                        </CustomTextR>
                                        {
                                            (
                                                this.state.targetItem.files
                                                    && this.state.targetItem.files.length > 0
                                            ) && this.renderAttachedItems()
                                        }
                                    </View>
                                </View>
                                <View style={styles.contentAnswer}>
                                    <View style={styles.contentAnswerHeader}>
                                        <Image
                                            style={styles.contentQuestionHeaderIcon}
                                            source={require('../../../../assets/icons/icon_my_qa_a.png')}
                                            />
                                        <CustomTextB style={styles.contentAnswerHeaderTitle}>
                                            선생님 답변
                                        </CustomTextB>
                                    </View>
                                    <View style={styles.contentAnswerContent}>
                                        {this.state.targetItem.questionAnswer.map((item, index) => {
                                            return (
                                                <View style={{paddingBottom:10}} key={index}>
                                                    <HTMLConvert
                                                        {...DEFAULT_PROPS}
                                                        html={item.content}
                                                    />
                                                </View>
                                            );
                                        })}
                                        {/* <CustomTextR style={styles.contentAnswerContentText}></CustomTextR> */}
                                    </View>
                                </View>


                                {/*
                                {
                                    this.state.targetItem[ARTICLE.TYPE.NAME] === ARTICLE.TYPE.NORMAL
                                        &&
                                            <TextInput
                                                style={[
                                                    styles.contentMainCommon,
                                                    styles.contentMainTitleInput,
                                                ]}
                                                placeholder='제목을 입력 해주세요'
                                                placeholderTextColor={DEFAULT_COLOR.base_color_bbb}
                                                onChangeText={text => this.onChangeTitle(text)}
                                                value={this.state.targetItem.title}
                                            />
                                }
                                <TextInput
                                    style={[
                                        styles.contentMainCommon,
                                        styles.contentMainContentInput,
                                    ]}
                                    placeholder='내용을 입력 해주세요.'
                                    placeholderTextColor={DEFAULT_COLOR.base_color_bbb}
                                    //clearTextOnFocus={true}
                                    onChangeText={text => this.onChangeContent(text)}
                                    multiline={true}
                                    value={this.state.targetItem.content}
                                    textAlignVertical={'top'}
                                    editable={this.state.targetItem[ARTICLE.TYPE.NAME] === ARTICLE.TYPE.NORMAL}
                                />
                                */}
                            </View>
                        </View>
                        {
                            (
                                this.state.targetItem.files !== null
                                && this.state.targetItem.files !== undefined
                                && this.state.targetItem.files.length != 0
                            )
                            &&
                            <ImageView
                                glideAlways
                                images={this.state.targetItem.files}
                                imageIndex={this.state.imageIndex}
                                controls={true}
                                animationType="fade"
                                isVisible={this.state.isImageViewVisible}
                                renderFooter={(currentImage) => (
                                    <View style={[
                                        styles.footer,
                                        {
                                            backgroundColor: 'transparent',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                        }
                                    ]}>
                                        <Text style={[
                                            styles.footerText,
                                            {
                                                fontWeight: 'bold',
                                            }
                                        ]}>
                                            {(this.state.imageIndex + 1) + " "}
                                        </Text>
                                        <Text style={styles.footerText}>
                                            / {this.state.targetItem.files.length}
                                        </Text>
                                    </View>)}
                                onClose={() => this.setState({
                                    isImageViewVisible: false,
                                    imageIndex: null
                                })}
                                onImageChange={index => {
                                    this.setState({imageIndex: index})
                                }}
                            />
                        }
                    </ScrollView>
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
        height: HEADER_HEIGHT,
        backgroundColor: 'transparent',
    },
    headerWrapper: {
        height: HEADER_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerIcon: {
        width: 18,
        height: 10,
    },
    /*
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: HEADER_HEIGHT,
        borderBottomWidth: 0.5,
        borderBottomColor: DEFAULT_COLOR.base_color_bbb,
        paddingBottom: 16,
    },
    headerLeft: {
        flex: 2,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: 17,
    },
    headerLeftWrapper: {
        borderRadius: 15,
        borderWidth: 0.5,
        borderColor: DEFAULT_COLOR.lecture_base,
        paddingLeft: 11,
        paddingRight: 11,
        paddingTop: 5,
        paddingBottom: 5,
    },
    headerLeftTitle: {
        color: DEFAULT_COLOR.lecture_base,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12),
    },
    headerCenter: {
        flex: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenterTitle: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(18),
    },
    headerRight: {
        flex: 2,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 17,
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
    */
    content: {
        height: CONTENT_HEIGHT,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: DEFAULT_COLOR.base_color_fff,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    contentHeader: {
        flex: isIphoneX() ? 1 : 1,
        flexDirection: 'column',
        paddingTop: 20,
        paddingBottom: 20,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: DEFAULT_COLOR.base_color_222,
    },
    contentHeaderTitle: {
        paddingBottom: 15,
    },
    contentHeaderTitleText: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),
        lineHeight: PixelRatio.roundToNearestPixel(20),
        letterSpacing: -0.75,
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
        flex: isIphoneX() ? 7 : 5,
        paddingBottom: 30,
    },
    contentMainWrapper: {
        flex: 1,
    },
    contentQuestion: {
        borderBottomWidth: 1,
        borderBottomColor: DEFAULT_COLOR.base_color_222,
        paddingBottom: 15,
    },
    contentQuestionHeader: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8e8',
    },
    contentQuestionHeaderText: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),
        lineHeight: PixelRatio.roundToNearestPixel(25),
        letterSpacing: -0.9,
    },
    contentQuestionContentTitle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingTop: 18.3,
        paddingBottom: 16.5,
    },
    contentQuestionContentTitleIcon: {
        alignSelf: 'center',
        width: 15,
        height: 20,
        marginRight: 8,
    },
    contentQuestionContentTitleText: {
        alignSelf: 'center',
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),
        letterSpacing: -0.75,
    },
    contentQuestionContent: {
        paddingBottom: 25,
    },
    contentQuestionContentText: {
        color: DEFAULT_COLOR.base_color_666,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
        lineHeight: PixelRatio.roundToNearestPixel(25),
        letterSpacing: -0.7,
    },
    contentAnswer: {

    },
    contentAnswerHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingTop: 18.3,
        paddingBottom: 16.5,
    },
    contentQuestionHeaderIcon: {
        alignSelf: 'center',
        width: 15,
        height: 20,
        marginRight: 8,
    },
    contentAnswerHeaderTitle: {
        alignSelf: 'center',
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),
        lineHeight: DEFAULT_TEXT.head_small * 1.42,
    },
    contentAnswerContent: {

    },
    contentAnswerContentText: {
        color: DEFAULT_COLOR.base_color_666,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
        lineHeight: DEFAULT_TEXT.body_14 * 1.42,
    },
    contentPickerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: 55,
        marginLeft: 15,
        //marginRight: 15,
        marginBottom: 20,
    },
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


    footer: {
        width: SCREEN_WIDTH,
        height: FOOTER_HEIGHT,
        backgroundColor: DEFAULT_COLOR.lecture_base,
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
})