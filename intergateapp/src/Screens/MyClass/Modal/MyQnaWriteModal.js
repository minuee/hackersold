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
} from 'react-native';
import Modal from 'react-native-modal';
import { isIphoneX, } from "react-native-iphone-x-helper";
import LinearGradient from "react-native-linear-gradient";
import ImagePicker from 'react-native-image-picker';

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

const TOTAL_HEIGHT = SCREEN_HEIGHT * 0.95;
// TOTAL_HEIGHT == MyMemoContent.animatedHeight
const HEADER_PADDING_TOP = 16;
// HEADER_PADDING_TOP == MyMemoContent.styles.modalContainer.paddingTop
const HEADER_HEIGHT = 40;
const FOOTER_HEIGHT = 57;
const CONTENT_HEIGHT = TOTAL_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT - HEADER_PADDING_TOP;


const PICKER_ITEM_WIDTH = ( SCREEN_WIDTH - 15 - (15 * 5) ) / 5;
//      = (
//          SCREEN_WIDTH
//              - style.contentPickerContainer.marginLeft
//              - ( style.contentPickerItemContainer.marginRight * 5)
//        ) / 5
//      = ( SCREEN_WIDTH - 15 - (15 * 4) ) / 5

// TODO Modal 및 강좌 리스트 모듈화(선생님께 질문하기 페이지 내 ImagePicker 고려 필요)

export default class MyQnaWriteModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            ownLecItems: props.screenState.ownLecItems,
            attachedFileSize : props.screenState.attachedFileSize || 0,
            attachedItems: props.screenState.tmpAttachedItems,
            ableFileCnt: props.screenState.ableFileCnt
        };

        //console.log('MyQnaWriteModal.constructor()', 'attachedFileSize = ' + props.screenState.attachedFileSize)

    }

    handleChoosePhoto = async() => {
        await this.localcheckfile();
    }

    localcheckfile = () => {
        const options = {
            noData: true,
            /*
            storageOptions: {
                skipBackup: true,
                path: 'images'
            },
            */
            mediaType: 'photo',
        }
        ImagePicker.launchImageLibrary(options, response => {
            try {
                if(response.type.indexOf('image') != -1) {
                    if (response.uri) {
                        if ( parseInt((this.state.attachedFileSize + response.fileSize)/1024/1024) > 50 ) {
                            Alert.alert('', '제한 용량이 초과되어 업로드 할 수 없습니다.');
                            return;
                        }
                        else if(
                            response.type === undefined
                            || (
                                !response.type === "image/jpeg"
                                && !response.type === "image/png"
                                && !response.type === "image/heic"
                            )
                        ) {
                            Alert.alert('', '지원하지 않는 확장자의 파일입니다.');
                            return;
                        } else{
                            /*
                            var newAttachedItem = this.state.attachedItems;

                            newAttachedItem.push({
                                type: response.type === undefined ? 'txt' : response.type,
                                imageUrl : response.uri,
                                height: response.height,
                                width: response.width,
                                fileSize: response.fileSize,
                                fileName: response.fileName,
                            })
                            */


                            /*
                            this.state.photoarray.push({
                                    type : response.type === undefined ? 'txt' :  response.type,
                                    uri : response.uri,
                                    height: response.height,
                                    width: response.width,
                                    fileSize:response.fileSize,
                                    fileName:response.fileName
                            });
                            */

                            //console.log('localcheckfile()', JSON.stringify(response))

                            var newAttachedItem = {
                                /*
                                type: response.type === undefined ? 'txt' : response.type,
                                imageUrl : response.uri,
                                height: response.height,
                                width: response.width,
                                fileSize: response.fileSize,
                                fileName: response.fileName,
                                */
                                //uri: response.uri,
                                uri: Platform.OS === "android" ? response.uri : response.uri.replace("file://", ""),
                                type: response.type === undefined ? 'txt' : response.type,
                                fileName: response.fileName,
                                height: response.height,
                                width: response.width,
                                fileSize:response.fileSize,
                                fileName:response.fileName,
                                name: response.fileName,
                            }

                            //console.log('첨부된 파일 사이즈 : ' + parseInt((response.fileSize)/1024/1024))
                            //console.log('전체 파일 사이즈 : ' + parseInt((this.state.attachedFileSize + response.fileSize)/1024/1024))

                            this.setState({
                                //attachedItems: newAttachedItem,
                                attachedFileSize: this.state.attachedFileSize + response.fileSize
                            }, function() {
                                this.props.screenState.insertTmpItemRemote(newAttachedItem, this.state.attachedFileSize)
                            })


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

    removeAttachedItems = (index) => {
        //console.log('removeAttachedItems()', '기존' + JSON.stringify(this.state.attachedItems))

        var newPickerItems = this.state.attachedItems.filter(function(item, newIndex) {
            return index !== newIndex;
        })

        //console.log('removeAttachedItems()', '신규 ' + JSON.stringify(newPickerItems))

        //console.log('삭제된 파일 사이즈 : ' + parseInt((this.state.attachedItems[index].fileSize)/1024/1024))
        //console.log('전체 파일 사이즈 : ' + parseInt((this.state.attachedFileSize - this.state.attachedItems[index].fileSize)/1024/1024))

        this.setState({
            attachedItems: newPickerItems,
            attachedFileSize: this.state.attachedFileSize - this.state.attachedItems[index].fileSize,
        }, function() {
            this.props.screenState.updateTmpItemRemote(newPickerItems, this.state.attachedFileSize)
        })
    }

    renderAttachedItems = () => {
        return(
                this.state.ableFileCnt > 0
                    &&
                        <View style={styles.contentPickerContainer}>
                            {
                                this.state.attachedItems.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            style={styles.contentPickerItemContainer}
                                            onPress={() => this.removeAttachedItems(index)}
                                            >
                                            <View style={styles.contentPickerItemWrapper}>
                                                <Image
                                                    style={styles.contentPickerItemImage}
                                                    source={{ uri: item.uri }}
                                                    />
                                                <Image
                                                    style={styles.contentPickerItemRemover}
                                                    source={require('../../../../assets/icons/btn_img_file_del.png')}
                                                    />
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                            {
                                this.state.attachedItems.length < this.state.ableFileCnt
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
                        <View style={styles.headerLeft}>

                        </View>
                        <View style={styles.headerCenter}>
                            <CustomTextR style={styles.headerCenterTitle}>
                                질문 추가
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
                                    onPress={() => this.props.screenState.toggleWriteModal(TARGET.FROM_LEC)}
                                    >
                                    <View style={styles.lecListTitle}>
                                        <CustomTextR
                                            style={styles.lecListTitleText}
                                            numberOfLines={1}
                                            >
                                            { this.props.screenState.getSelectedLecItemTitle() }
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
                            {/*
                            <View style={styles.lecKangListContainer}>
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
                            </View>
                            */}
                        </View>

                        <View style={styles.contentMain}>
                            <View style={styles.contentMainWrapper}>
                                <TextInput
                                    style={[
                                        styles.contentMainCommon,
                                        styles.contentMainTitleInput,
                                    ]}
                                    returnKeyType={"next"}
                                    onSubmitEditing={() => { this._contentInput.focus(); }}
                                    placeholder='제목을 입력해주세요'
                                    placeholderTextColor={DEFAULT_COLOR.base_color_bbb}
                                    onChangeText={text => this.props.screenState.onChangeTitle(text)}
                                    value={this.props.screenState.getDataTitle()}
                                    maxLength={50}
                                    />
                                <TextInput
                                    ref={(ref) => this._contentInput = ref}
                                    style={[
                                        styles.contentMainCommon,
                                        styles.contentMainContentInput
                                    ]}
                                    placeholder='내용을 입력하세요'
                                    placeholderTextColor={DEFAULT_COLOR.base_color_bbb}
                                    //clearTextOnFocus={true}
                                    onChangeText={text => this.props.screenState.onChangeContent(text)}
                                    multiline={true}
                                    value={this.props.screenState.getDataContent()}
                                    textAlignVertical={'top'}
                                    />
                            </View>
                            { this.renderAttachedItems() }
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.footerWrapper}
                            onPress={() => this.props.screenState.createItemRemote()}>
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
        flex: isIphoneX() ? 0.5 : 0.5,
        flexDirection: 'column',
        margin: 20,
        //marginHorizontal: 20,
        justifyContent: 'center',
    },
    lecListContainer: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        //marginTop: 25,
        //marginBottom: 20,
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
        justifyContent: 'center',
        marginTop: 15,
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
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
        lineHeight: PixelRatio.roundToNearestPixel(20),
        letterSpacing: -0.7,
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
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),
        letterSpacing: -0.9,
    },
})