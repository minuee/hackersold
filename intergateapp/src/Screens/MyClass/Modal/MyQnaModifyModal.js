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
    Alert,
    Linking,
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

import {CustomTextB, CustomText, CustomTextR, TextRobotoR} from "../../../Style/CustomText";
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../../Constants/index';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

import { TARGET, ARTICLE } from './ModalConstant';
import CommonUtil from "../../../Utils/CommonUtil";
import Toast from "react-native-tiny-toast";
import ImageView from '../../../Utils/ImageViewer/ImageView';


const TOTAL_HEIGHT = SCREEN_HEIGHT * 0.95;
// TOTAL_HEIGHT == MyMemoContent.animatedHeight
const HEADER_PADDING_TOP = 16;
// HEADER_PADDING_TOP == MyMemoContent.styles.modalContainer.paddingTop
const HEADER_HEIGHT = 40;
const FOOTER_HEIGHT = 57;

const CONTENT_HEIGHT = TOTAL_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT - HEADER_PADDING_TOP;
const NOTICE_CONTENT_HEIGHT = TOTAL_HEIGHT - HEADER_HEIGHT;

const PICKER_ITEM_WIDTH = ( SCREEN_WIDTH - 15 - (15 * 5) ) / 5;
//      = (
//          SCREEN_WIDTH
//              - style.contentPickerContainer.marginLeft
//              - ( style.contentPickerItemContainer.marginRight * 5)
//        ) / 5
//      = ( SCREEN_WIDTH - 15 - (15 * 4) ) / 5

export default class MyQnaModifyModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            imageIndex: null,
            isImageViewVisible: false,
            title: props.screenState.targetModifyItem.questionContentTitle,
            content: props.screenState.targetModifyItem.questionContent,
            targetModifyItem: props.screenState.targetModifyItem,
            attachedFileSize: 0,
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

    async UNSAFE_componentWillMount() {

    }

    /*
    getQuestionDetail = async() => {
        const url = DEFAULT_CONSTANTS.apiTestDomain
            + '/v1/myClass/teacherQuestion/' + this.state.memberIdx + '/' + this.props.screenState.targetModifyItem.teacherQuestionIdx

        await CommonUtil.callAPI(url, null, 10000)
            .then(response => {
                if (response && response.code === '0000') {


                    var targetModifyItem = response.data.question;
                    targetModifyItem[ARTICLE.TYPE.NAME] = this.props.screenState.targetModifyItem[ARTICLE.TYPE.NAME]
                    console.log('getQuestionDetail()', 'targetModifyItem = ' + JSON.stringify(targetModifyItem))

                    this.setState({
                       targetModifyItem: targetModifyItem,
                       loading: false,
                    })
                } else {
                    this.setState({
                        loading: false
                    });
                    response.message
                        ? Alert.alert('', response.message)
                        : Alert.alert('', '질문 상세를 불러오는데 실패 했습니다.');
                }
            })
            .catch(error => {
                Toast.show('시스템 에러: 질문 상세를 불러오는데 실패 했습니다.');
                this.setState({
                    loading: false
                }, function() {
                    this.props.screenState.toggleModifyModal()
                });
            });
    }
    */

    onChangeContent = (text) => {
        this.setState({
            targetModifyItem: {...this.state.targetModifyItem, content: text},
        })
    }

    onChangeTitle = (text) => {
        this.setState({
            targetModifyItem: {...this.state.targetModifyItem, title: text},
        })
    }

    renderAttachedItems = () => {
        return(
            <View style={styles.contentPickerContainer}>
                {
                    this.state.targetModifyItem.files.map((item, index) => {
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
                {/*
                    this.props.screenState.getTmpAttachedItems().map((item, index) => {
                        return (
                            <TouchableOpacity
                                style={styles.contentPickerItemContainer}
                                onPress={() => this.props.screenState.removeAttachedItems(index)}
                                >
                                <View style={styles.contentPickerItemWrapper}>
                                    <Image
                                        style={styles.contentPickerItemImage}
                                        source={{ uri: item.imageUrl }}
                                    />
                                    <Image
                                        style={styles.contentPickerItemRemover}
                                        source={require('../../../../assets/icons/btn_img_file_del.png')}
                                    />
                                </View>
                            </TouchableOpacity>
                        )
                    })
                */}
                {/*
                    this.props.screenState.getTmpAttachedItems().length < 5
                        &&
                            <TouchableOpacity
                                style={styles.contentPickerItemContainer}
                                onPress={() => this.handleChoosePhoto()}
                                >
                                <Image
                                    style={styles.contentPickerItemImage}
                                    source={require('../../../../assets/icons/btn_img_file_add_wh.png')}
                                />
                            </TouchableOpacity>
                */}
            </View>
        )
    }

    handleChoosePhoto = async() => {
        await this.localcheckfile();
    }

    localcheckfile = () => {
        const options = {
            noData: true,
        }
        ImagePicker.launchImageLibrary(options, response => {
            try {
                if(response.type.indexOf('image') != -1) {
                    if (response.uri) {
                        if ( parseInt((this.state.attachedFileSize + response.fileSize)/1024/1024) > 50 ) {
                            Alert.alert('image upload error', '50MB를 초과하였습니다.');
                            return;
                        } else{
                            var newAttachedItem = {
                                type: response.type === undefined ? 'txt' : response.type,
                                imageUrl: response.uri,
                                height: response.height,
                                width: response.width,
                                fileSize: response.fileSize,
                                fileName: response.fileName,
                            }

                            this.setState({
                                attachedFileSize: this.state.attachedFileSize + response.fileSize
                            })

                            this.props.screenState.insertTmpItemRemote(newAttachedItem)

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
                            {
                                this.state.targetModifyItem[ARTICLE.TYPE.NAME] === ARTICLE.TYPE.NORMAL
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
                                    this.state.targetModifyItem[ARTICLE.TYPE.NAME] === ARTICLE.TYPE.NOTICE
                                        ? '공지사항'
                                        : '질문 상세'
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
                    <View style={[
                            styles.content,
                            // 수정하기 기능 제외에 따른 저장 버튼 영역 제거
                            this.state.targetModifyItem[ARTICLE.TYPE.NAME] === ARTICLE.TYPE.NOTICE
                                && { height: NOTICE_CONTENT_HEIGHT }
                                || { height: NOTICE_CONTENT_HEIGHT /*CONTENT_HEIGHT*/ }
                        ]}>
                        <View style={styles.contentHeader}>
                            {
                                this.state.targetModifyItem[ARTICLE.TYPE.NAME] === ARTICLE.TYPE.NORMAL
                                    &&
                                        <View style={styles.contentHeaderTitle}>
                                            <CustomTextB
                                                style={styles.contentHeaderTitleText}
                                                numberOfLines={2}
                                                >
                                                { this.state.targetModifyItem.lectureName }
                                            </CustomTextB>
                                        </View>
                                    ||
                                        <View style={styles.contentHeaderTitle}>
                                            <CustomTextB
                                                style={styles.contentHeaderTitleText}
                                                numberOfLines={2}
                                            >
                                                { this.state.targetModifyItem.questionTitle }
                                            </CustomTextB>
                                        </View>
                            }

                            <View style={styles.contentHeaderDesc}>
                                <CustomTextR style={styles.contentHeaderDescKang}>
                                    {
                                        (
                                            this.state.targetModifyItem[ARTICLE.TYPE.NAME] === ARTICLE.TYPE.NORMAL
                                                && this.state.targetModifyItem.lectureNo !== null
                                        )
                                            &&
                                                "제 " + this.state.targetModifyItem.lectureNo + "강"
                                    }
                                </CustomTextR>
                                <TextRobotoR style={styles.contentHeaderDescDate}>
                                    {
                                        this.props.screenState.targetModifyItem.regDatetime != null
                                            && moment(this.props.screenState.targetModifyItem.regDatetime).format('YYYY.MM.DD')
                                    }
                                </TextRobotoR>
                            </View>
                        </View>

                        <View style={styles.contentMain}>
                            <View style={styles.contentMainWrapper}>
                                {
                                    this.state.targetModifyItem[ARTICLE.TYPE.NAME] === ARTICLE.TYPE.NORMAL
                                        && (
                                            <View style={styles.contentMainWrapper}>
                                                {/* 수정하기 기능 제외에 따른 답변완료(MyQnaCompleteModal) 디자인 이관 적용 */}

                                                <View style={styles.contentQuestionHeader}>
                                                    <CustomTextB style={styles.contentQuestionHeaderText}>
                                                        { this.state.targetModifyItem.questionTitle }
                                                    </CustomTextB>
                                                </View>

                                                {/*
                                                <TextInput
                                                    style={[
                                                        styles.contentMainCommon,
                                                        styles.contentMainTitleInput,
                                                    ]}
                                                    placeholder='제목을 입력 해주세요'
                                                    placeholderTextColor={DEFAULT_COLOR.base_color_bbb}
                                                    onChangeText={text => this.onChangeTitle(text)}
                                                    value={this.state.targetModifyItem.questionTitle}
                                                    />
                                                */}
                                                <ScrollView style={{paddingHorizontal: 20}}>
                                                    <HTMLConvert
                                                        {...DEFAULT_PROPS}
                                                        imagesMaxWidth={SCREEN_WIDTH - 40}
                                                        html={
                                                            CommonUtil.stripSlashes(this.state.targetModifyItem.questionContent)
                                                            /* "임용 내용 test4<p><img width='50' align='bottom' class='txc-image photo' alt='' src='https://hackersg.hackers.com/teacher/bbs/data/2020/06/08/f2cef75148012d4a51a609d4137752b4062640.jpg'></p>" */
                                                        }
                                                    />
                                                </ScrollView>
                                                {/*
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
                                                    value={this.state.targetModifyItem.questionContent}
                                                    textAlignVertical={'top'}
                                                    editable={this.state.targetModifyItem[ARTICLE.TYPE.NAME] === ARTICLE.TYPE.NORMAL}
                                                    />
                                                */}
                                            </View>
                                        )
                                }

                                {
                                    this.state.targetModifyItem[ARTICLE.TYPE.NAME] === ARTICLE.TYPE.NOTICE
                                        &&
                                            <ScrollView style={{paddingHorizontal: 20}}>
                                                <HTMLConvert
                                                    {...DEFAULT_PROPS}
                                                    html={this.state.targetModifyItem.questionContent}
                                                />
                                            </ScrollView>
                                }
                            </View>
                            {
                                (
                                    this.state.targetModifyItem[ARTICLE.TYPE.NAME] === ARTICLE.TYPE.NORMAL
                                    && this.state.targetModifyItem.files !== null
                                    && this.state.targetModifyItem.files !== undefined
                                    && this.state.targetModifyItem.files.length != 0
                                )
                                    && this.renderAttachedItems()
                            }
                            {/*
                                (
                                    this.state.targetModifyItem[ARTICLE.TYPE.NAME] === ARTICLE.TYPE.NORMAL
                                    && this.state.targetModifyItem.files !== null
                                    && this.state.targetModifyItem.files.length != 0
                                )
                                    && this.renderAttachedItems()
                            */}
                            {
                                this.state.targetModifyItem[ARTICLE.TYPE.NAME] === ARTICLE.TYPE.NORMAL
                                    &&
                                        <View style={styles.contentMainControl}>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.props.screenState.deleteItemRemote(
                                                        //this.props.screenState.getTargetItemKey(),
                                                        this.state.targetModifyItem.teacherQuestionIdx
                                                    )}
                                                style={styles.contentMainControlWrapper}>
                                                <Image
                                                    style={styles.contentMainControlIcon}
                                                    source={require('../../../../assets/icons/btn_del_waste.png')}
                                                    />
                                                <CustomTextR style={styles.contentMainControlText}>
                                                    질문삭제
                                                </CustomTextR>
                                            </TouchableOpacity>
                                        </View>
                            }
                        </View>
                    </View>
                    {/* 수정하기 기능 제외에 따른 저장 버튼 제거 */}
                    {
                        //this.state.targetModifyItem[ARTICLE.TYPE.NAME] === ARTICLE.TYPE.NORMAL
                        false
                           &&
                                <View style={styles.footer}>
                                    <TouchableOpacity
                                        style={styles.footerWrapper}
                                        onPress={() => this.props.screenState.updateItemRemote(
                                            /*
                                            this.props.screenState.targetItems.indexOf(
                                                this.props.screenState.targetModifyItem
                                            ),*/
                                            //this.state.targetItemIndex,
                                            this.props.screenState.getTargetItemKey(),
                                            this.state.targetModifyItem.questionTitle,
                                            this.state.targetModifyItem.questionContent
                                        )}>
                                        <CustomTextB style={styles.footerText}>저장</CustomTextB>
                                    </TouchableOpacity>
                                </View>
                    }
                    {
                        (
                            this.state.targetModifyItem.files !== null
                            && this.state.targetModifyItem.files !== undefined
                            && this.state.targetModifyItem.files.length != 0
                        )
                        &&
                            <ImageView
                                glideAlways
                                images={this.state.targetModifyItem.files}
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
                                            / {this.state.targetModifyItem.files.length}
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
                </SafeAreaView>
            )
        }
    }
}

const styles = StyleSheet.create({
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : DEFAULT_COLOR.base_color_fff,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
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
        justifyContent: 'center',
        alignItems: 'center',
        // height: HEADER_HEIGHT,
        borderBottomWidth: 0.5,
        borderBottomColor: DEFAULT_COLOR.base_color_bbb,
        paddingBottom: 16,
    },
    headerLeft: {
        // flex: 2,
        // alignItems: 'flex-start',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        paddingLeft: 17,
        paddingBottom: 16,
    },
    headerLeftWrapper: {
        borderRadius: 15,
        borderWidth: 1,
        borderColor: DEFAULT_COLOR.lecture_base,
        paddingHorizontal: 11,
        paddingVertical: 4,
        // paddingLeft: 11,
        // paddingRight: 11,
        // paddingTop: 5,
        // paddingBottom: 5,
    },
    headerLeftTitle: {
        color: DEFAULT_COLOR.lecture_base,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),
        lineHeight: PixelRatio.roundToNearestPixel(25),
        letterSpacing: -0.9,
    },
    headerCenter: {
        // flex: 5,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenterTitle: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),
        lineHeight: PixelRatio.roundToNearestPixel(22),
    },
    headerRight: {
        // flex: 2,
        position: 'absolute',
        right: 0,
        // alignItems: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 17,
        paddingBottom: 16,
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
        //height: CONTENT_HEIGHT,
    },
    contentHeader: {
        // flex: isIphoneX() ? 1 : 1,
        flexDirection: 'column',
        // margin: 20,
        marginHorizontal: 20,
        marginTop: 25,
        justifyContent: 'space-between',
    },
    contentHeaderTitle: {
    },
    contentHeaderTitleText: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(18),
        lineHeight: 18 * 1.42,
    },
    contentHeaderDesc: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 11,
        marginBottom: 18,
    },
    contentHeaderDescKang: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_13),
        lineHeight: DEFAULT_TEXT.body_13 * 1.42,
    },
    contentHeaderDescDate: {
        color: '#AAAAAA',
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_13),
        lineHeight: DEFAULT_TEXT.body_13 * 1.42,
    },
    contentMain: {
        flex: isIphoneX() ? 7 : 5,
    },
    contentMainWrapper: {
        flex: 1,
        marginBottom: 15,
        //backgroundColor: '#FF0000'
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
    },
    contentMainControl: {
        justifyContent: 'center',
        //marginTop: 20,
        //marginBottom: 20,
        marginBottom: 40,
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
    contentPickerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: 55,
        marginLeft: 15,
        //marginRight: 15,
        marginBottom: 20,
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


    /** MySnaCompleteModal.js **/
    contentQuestionHeader: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        //borderBottomWidth: 1,
        //borderBottomColor: '#e8e8e8',
    },
    contentQuestionHeaderText: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(18),
        fontWeight: 'bold',
        lineHeight: 18 * 1.42,
        letterSpacing: -0.9,
    },
})