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

import {CustomTextB, CustomText, CustomTextR} from "../../../Style/CustomText";
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../../Constants/index';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

import { TARGET } from './ModalConstant';
import Toast from "react-native-tiny-toast";
import CommonUtil from "../../../Utils/CommonUtil";
import {SERVICES} from "../../../Constants/Common";

const TOTAL_HEIGHT = SCREEN_HEIGHT * 0.95;
// TOTAL_HEIGHT == MyMemoContent.animatedHeight
const HEADER_PADDING_TOP = 16;
// HEADER_PADDING_TOP == MyMemoContent.styles.modalContainer.paddingTop
const HEADER_HEIGHT = 40;
const FOOTER_HEIGHT = 57;
const CONTENT_HEIGHT = TOTAL_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT - HEADER_PADDING_TOP;

export default class MyMemoWriteModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            content: props.screenState.typedMemoContent || '',
            isExistDuplicateMemo: props.screenState.isExistDuplicateMemo || false,
            memoIdx: props.screenState.memoIdx,
        }

        console.log('MyMemoWriteModal.constructor()', 'props.screenState.typedMemoContent = ' + props.screenState.typedMemoContent)
        console.log('MyMemoWriteModal.constructor()', 'props.screenState.isExistDuplicateMemo = ' + props.screenState.isExistDuplicateMemo)
        console.log('MyMemoWriteModal.constructor()', 'this.props.screenState.memoIdx = ' + this.props.screenState.memoIdx)
    }

    async UNSAFE_componentWillMount() {
        /*
        if(this.props.screenState.memoIdx != 0) {
            const memberIdx = await CommonUtil.getMemberIdx();
            this.setState({memberIdx: memberIdx}, function() {
                this.getOwnMemoItem();
            });
        }
        */
    }

    getContent = () => {
        return this.state.content;
    }

    getOwnMemoItem = async() => {
        //this.setState({loading: true});

        const domain = SERVICES[this.props.screenState.myClassServiceID].apiDomain;
        const url = domain + '/v1/myClass/memo/'+ this.state.memberIdx + '/' + this.state.memoIdx;

        const options = {
            method: 'GET',
            headers: {
                ApiKey: SERVICES[this.props.screenState.myClassServiceID].apiKey,
            },
        };

        await CommonUtil.callAPI(url, options, 10000)
            .then(response => {
                //console.log('getOwnMemoItem()', 'response = ' + JSON.stringify(response));

                if (response && response.code === '0000') {
                    let targetItem = response.data;
                    targetModifyItem = targetItem;

                    this.setState({
                        content: targetItem.memoContent,
                    });
                }

                else {
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('메모 상세를 불러오는데 실패 했습니다.');
                }}).catch(error => {
                console.log(error)
                Toast.show('시스템 에러: 메모 상세를 불러오는데 실패 했습니다.');
            });
    }

    onChangeMemoContent = (text) => {
        this.setState({content: text})
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
                                메모 추가
                            </CustomTextR>
                        </View>
                        <View style={styles.headerRight}>
                            <TouchableOpacity
                                style={styles.headerRightWrapper}
                                onPress={() => this.props.screenState.closeWriteModal()}
                                >
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
                                    onPress={() => this.props.screenState.toggleWriteMemoModal(TARGET.FROM_LEC)}
                                    >
                                    <View style={styles.lecListTitle}>
                                        <CustomTextR
                                            style={styles.lecListTitleText}
                                            numberOfLines={1}
                                            >
                                            {this.props.screenState.getSelectedLecItemTitle()}
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
                                    onPress={() => this.props.screenState.toggleWriteMemoModal(TARGET.FROM_LEC_KANG)}
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
                            </View>
                        </View>

                        <View style={styles.contentMain}>
                            <TextInput
                                ref={(ref) => this.textInput = ref }
                                style={styles.contentMainInput}
                                placeholder='내용을 입력 해주세요.'
                                placeholderTextColor={DEFAULT_COLOR.base_color_bbb}
                                //clearTextOnFocus={true}
                                onChangeText={text => this.onChangeMemoContent(text)/*this.props.screenState.onChangeMemoContent(text)*/}
                                multiline={true}
                                value={this.state.content/*this.props.screenState.getDataMemoContent()*/}
                                />
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.footerWrapper}
                            onPress={() => {
                                if(this.state.isExistDuplicateMemo) {
                                    this.props.screenState.updateOwnDuplicateMemoItemRemote(this.state.content)
                                } else {
                                    this.props.screenState.createItemRemote(this.state.content)
                                }
                            }}>
                            <CustomTextB style={styles.footerText}>저장</CustomTextB>
                        </TouchableOpacity>
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
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
        lineHeight: PixelRatio.roundToNearestPixel(20),
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
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
        lineHeight: PixelRatio.roundToNearestPixel(20),
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
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: DEFAULT_COLOR.input_border_color,
        borderRadius: 15,
    },
    contentMainInput: {
        margin: 16,
        color: DEFAULT_COLOR.base_color_666,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
        lineHeight: PixelRatio.roundToNearestPixel(20),
        letterSpacing: -0.7,
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
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),
        letterSpacing: -0.9,
    },
})