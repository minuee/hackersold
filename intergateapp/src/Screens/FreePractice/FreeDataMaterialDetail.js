import React, {Component} from 'react';
import {
    StyleSheet, View, Text, Dimensions, Platform, ActivityIndicator, PixelRatio, StatusBar, ScrollView, Image,
    TouchableOpacity, PermissionsAndroid, Alert , BackHandler
} from 'react-native';

import FreeParallaxScrollView from '../../Utils/FreeParallaxScroll/FreeParallaxScrollView';
import FileViewer from 'react-native-file-viewer';
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFetchBlob from 'rn-fetch-blob'
var RNFS = require('react-native-fs')
import Share from 'react-native-share';
import CommonFunction from "../../Utils/CommonFunction";

import DocumentPicker from 'react-native-document-picker';

// TODO Android 다운로드 기능 예외 처리
// https://github.com/joltup/rn-fetch-blob/issues/214#issuecomment-483208996
// TODO iOS 다운로드 기능 예외 처리
// https://github.com/joltup/rn-fetch-blob/issues/278#issuecomment-548621030
// TODO iOS 퍼미션 관련
// https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/iPhoneOSKeys.html#//apple_ref/doc/uid/TP40009252-SW10


import { getStatusBarHeight } from "react-native-status-bar-height";
import { isIphoneX, getBottomSpace } from "react-native-iphone-x-helper";

import {CustomTextB, CustomText, CustomTextR} from "../../Style/CustomText";
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import Toast from "react-native-tiny-toast";
import CommonUtil from "../../Utils/CommonUtil";
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

getContainerHeight= () => {
    if(Platform.OS == 'android') {
        return SCREEN_HEIGHT - 40 - NAV_BAR_HEIGHT - StatusBar.currentHeight;
    } else {
        if(isIphoneX()) {
            //alert('THIS IS iPhone X : ' + getStatusBarHeight())
            return SCREEN_HEIGHT - 40 - NAV_BAR_HEIGHT - 40;
        } else {
            //alert('THIS IS NOT iPhone X : ' + getStatusBarHeight())
            return SCREEN_HEIGHT - 40 - NAV_BAR_HEIGHT;
        }
    }
}

const TOTAL_DOWNLOAD_BUTTON = 2;
const NAV_BAR_HEIGHT = Platform.OS === 'android' ? 65 : (isIphoneX() ? 85 : 75);
const DESC_AREA_HEIGHT = getContainerHeight() * 8 / 10;
const DOWNLOAD_AREA_HEIGHT = getContainerHeight() * 2 / 10;
const DOWNLOAD_BUTTON_HEIGHT = (DOWNLOAD_AREA_HEIGHT / TOTAL_DOWNLOAD_BUTTON) - 5;

const STATE_DOWNLOAD_READY = undefined;
const STATE_DOWNLOAD_PROGRESS = 'progress';
const STATE_DOWNLOAD_COMPLETE = 'complete';

//const appendExt = '.pdf';
//const mimeType = 'application/pdf';

// TODO 어드민 기획안 내 명시되어 있는 파일 확장자 다운로드 및 실행 테스트
// https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types

// TODO 실행 가능한 기본 애플리케이션 설치 유도
// https://developers-kr.googleblog.com/2017/09/making-it-safer-to-get-apps-on-android-o.html
// https://github.com/joltup/rn-fetch-blob/issues/569#issue-587449322

// mime-type 별도로 지정하지 않는 것이 파일 실행 가능성 높아짐에 따라 재테스트
// ㄴ mime-type을 별도로 지정하지 않는 경우 웹브라우저에 다운로드를 유도하는 현상 확인됨에 따라 보류(ex *.ppt in Android)

// 1차 테스트 : rn-fetch-blob

//      Android iOS mime-type
// jpg  O       O   image/jpeg
// jpeg O       O   image/jpeg
// png  O       O   image/png
// pdf  O       O   application/pdf
// mp3  O       O   audio/mp3
// mp4  O       O   video/mp4
// txt  O       O   text/plain
// avi  ?       ?   video/avi(응용 프로그램 실행은 되지만 영상 재생이 안됨, 코덱 문제?)
// docx X       ?   application/vnd.openxmlformats-officedocument.wordprocessingml.document
//                  (응용 프로그램 실행은 되지만 파일 내용이 보이지 않음)
// hwp  X       X   application/x-hwp
//                  application/haansofthwp
//                  application/vnd.hancom.hwp
// wmv  X       X   video/x-ms-wmv
// xml  X       O   application/xml
// zip  X       O   application/zip, application/x-zip-compressed(실행 가능한 애플리케이션이 있는 경우 실행됨)
// ppt  X       O   application/vnd.ms-powerpoint
// doc  X       O   application/msword
//                  application/doc
//                  application/ms-doc
// xlsx X       O   application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
//                  application/vnd.ms-excel
//                  application/x-msexcel
//                  application/excel
//                  application/x-excel

// 2차 테스트 : (android) Download Manager

//      버튼 클릭 푸시 클릭  버튼 클릭(iOS) mime-type
// jpg  O       O                   image/jpeg
// jpeg O       O                   image/jpeg
// png  O       O                   image/png
// pdf  O       O                   application/pdf
// mp3  O       O                   audio/mp3
// mp4  X       O                   video/mp4, application/mp4

// txt  O       O       O           text/plain
// avi  △       △       △           video/avi(응용 프로그램 실행은 되지만 영상 재생이 안됨, 코덱 문제?)
// docx X       X       △           application/vnd.openxmlformats-officedocument.wordprocessingml.document
//                                  (응용 프로그램 실행은 되지만 파일 내용이 보이지 않음)
// hwp  X       X       X           application/x-hwp
//                                  application/haansofthwp
//                                  application/vnd.hancom.hwp
// wmv  X       X       X           video/x-ms-wmv
// xml  X       X       O           application/xml
// zip  X       O       O           application/zip, application/x-zip-compressed(실행 가능한 애플리케이션이 있는 경우 실행됨)
// ppt  X       X       O           application/vnd.ms-powerpoint
// doc  X       X       O           application/msword
//                                  application/doc
//                                  application/ms-doc
// xlsx X       X       O           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
//                                  application/vnd.ms-excel
//                                  application/x-msexcel
//                                  application/excel
//                                  application/x-excel

// 3차 테스트 : + FileViewer

//      Android iOS mime-type
// jpg  O       O   image/jpeg
// jpeg O       O   image/jpeg
// png  O       O   image/png
// pdf  O       O   application/pdf
// mp3  O       O   audio/mp3
// mp4  O       O   video/mp4

// txt  O       O   text/plain
// avi  ?       ?   video/avi(응용 프로그램 실행은 되지만 영상 재생이 안됨, 코덱 문제?)
// docx X       ?   application/vnd.openxmlformats-officedocument.wordprocessingml.document
//                  (응용 프로그램 실행은 되지만 파일 내용이 보이지 않음)
// hwp  X       X   application/x-hwp
// wmv  X       X   video/x-ms-wmv
// xml  X       O   application/xml
// zip  X       O   application/zip, application/x-zip-compressed(실행 가능한 애플리케이션이 있는 경우 실행됨)
// ppt  X       O   application/vnd.ms-powerpoint
//                  application/haansofthwp
//                  application/vnd.hancom.hwp
// doc  X       O   application/msword
//                  application/doc
//                  application/ms-doc
// xlsx X       O   application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
//                  application/vnd.ms-excel
//                  application/x-msexcel
//                  application/excel
//                  application/x-excel

// 1차 요구사항 반영
/*
공통
    - (완료) 터치 영역 버튼 전체로 확대
    - (대기) 디바이스별 스크린샷 첨부 및 노출 문구 요청

안드로이드
    - (보류) 파일 쓰기 권한 인트로에서 제공
    - (진행) Download Manager Progress 연동
    : (완료) 만약 해결 불가능한 경우 Progress Icon 적용
    - (대기) Download Manager Cancel 연동

아이폰
    - (완료) 다운로드 완료 후, 버튼 클릭 시 Share 재실행
 */

// TODO iOS 파일 저장 권한 부여
// https://stackoverflow.com/questions/39519773/nsphotolibraryusagedescription-key-must-be-present-in-info-plist-to-use-camera-r


export default class FreeDataMaterialDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            freeStudyIdx: this.props.navigation.getParam('freeStudyIdx'),
            targetItem: {},//this.props.navigation.getParam('materialItem'),
            fromHistory : typeof this.props.navigation.state.params.fromHistory !== 'undefined' ? true : false
        }

        console.log('FreeDataMaterialDetail()', 'targetItem = ' + this.props.navigation.getParam('materialItem'))
    }

    UNSAFE_componentWillMount() {
        if ( Platform.OS === 'android') {
            this.androidStatusSetup(true);
        }
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

        this.getMaterialItem()
    }

    getMaterialItem = async() => {
        const url = DEFAULT_CONSTANTS.apiAdminDomain
            + '/v1/app/freeStudy/studyFile/view/' + this.state.freeStudyIdx


        console.log('FreeDataMaterialDetail.js > getMaterialItem()', 'url = ' + url)

        await CommonUtil.callAPI(url)
            .then(response => {

                console.log('FreeDataMaterialDetail.js > getMaterialItem()', 'response = ' + JSON.stringify(response))

                if (response && response.code === '0000') {
                    this.setState({
                        targetItem: response.data.studyFile || {},
                    })
                } else {
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('학습자료 상세를 불러오는데 실패 했습니다.');
                }}).catch(error => {
                    console.log(error)
                    Toast.show('시스템 에러: 학습자료 상세를 불러오는데 실패 했습니다.');
            });
    }

    componentDidMount() {
        this.loadItem();
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
        if ( Platform.OS === 'android') {
            this.androidStatusSetup(false)
        }  
    } 

    handleBackButton = () => {
        if ( Platform.OS === 'android') {
            this.androidStatusSetup(false)
        }  
        this.props.navigation.goBack(null);
        if ( this.state.fromHistory ) {
            this.props.navigation.toggleDrawer();
        }
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
        return true;
    }

    androidStatusSetup = async(bool) => {
        console.log('boooool', bool)
        if ( bool) {
            StatusBar.setBackgroundColor("transparent");
        }
        StatusBar.setTranslucent(bool);
    }

    mapMimeType = (extension) => {
        let mimeType = 'application/octet-stream';

        switch(extension) {
            case 'txt':     mimeType = 'text/plain'; break;
            case 'xml':     mimeType = 'application/xml'; break;
            case 'jpg':     mimeType = 'image/jpeg'; break;
            case 'jpeg':    mimeType = 'image/jpeg'; break;
            case 'png':     mimeType = 'image/png'; break;
            case 'mp3':     mimeType = 'audio/mp3'; break;
            case 'mp4':     mimeType = 'video/mp4'; break;
            case 'avi':     mimeType = 'video/avi'; break;
            case 'wmv':     mimeType = 'video/x-ms-wmv'; break;
            case 'zip':     mimeType = 'application/zip'; break;
            case 'pdf':     mimeType = 'application/pdf'; break;
            case 'hwp':     mimeType = 'application/x-hwp'; break;
            case 'doc':     mimeType = 'application/msword'; break;
            case 'docx':    mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; break;
            case 'xls':     mimeType = 'application/vnd.ms-excel'; break;
            case 'xlsx':    mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; break;
            case 'ppt':     mimeType = 'application/vnd.ms-powerpoint'; break;
            case 'pptx':    mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'; break;
        }

        return mimeType;
    }

    loadItem = () => {
        this.setState({ loading: true });

        //TODO API 실제 적용 시 삭제 처리
        setTimeout(
            () => {
                this.setState({ loading: false });
            },1000);
    }

    _historyBack(){
        this.props.navigation.goBack(null);
        console.log('this.state.fromHistory',this.state.fromHistory)
        if ( this.state.fromHistory ) {
            this.props.navigation.toggleDrawer();
        }
    }

    generateFileName = (fileItemIndex) => {
        return this.state.targetItem.index + '-' + fileItemIndex;
    }

    ToastMessage = (message) => {
        const alerttoast2 = Toast.show(message);
        setTimeout(() => {
            Toast.hide(alerttoast2);
        }, 2000)
    }

    requestWriteStoragePermission = async (index) => {
        try {
            if(Platform.OS == 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    /*
                    {
                        title: "Cool Photo App Camera Permission",
                        message:
                        "Cool Photo App needs access to your camera " +
                        "so you can take awesome pictures.",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                    */
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.downloadFile(index)
                } else {
                    console.log("Camera permission denied");
                }
            } else {
                this.downloadFile(index)
            }
        } catch (err) {
            console.warn(err);
        }
    };

    getFileFormat = (fileSize) => {
        if(fileSize < 1024) { //Byte
            return fileSize + ' Byte'
        } else if(fileSize < 1024 * 1024) { //KB
            return (fileSize / 1024).toFixed(1) + ' KB'
        } else if(fileSize < 1024 * 1024 * 1024) { //MB
            return (fileSize / (1024 * 1024)).toFixed(1) + ' MB'
        } else { //GB
            return (fileSize / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
        }
    }

    checkLogin = async(fileItemIndex) => {
        // DONE 담당 영역 로그인 체크 함수 isLoginCheck로 변경(범준 파트장님)
        const isLogin = await CommonUtil.isLoginCheck()

        if(isLogin === true) {
            this.alertDownloadFile(fileItemIndex)
        } else {
            Alert.alert('', '로그인이 필요합니다.\n로그인 하시겠습니까?',
                [
                    {text: '확인', onPress: () => {
                            this.props.navigation.navigate('SignInScreen', /*{goScreen: 'FreeBoardWrite'}*/);
                        }
                    },
                    {text: '취소', onPress: () => function(){} },
                ]);
        }
    }

    alertDownloadFile = (fileItemIndex) => {
        var file_size = this.state.targetItem.files[fileItemIndex].fileSize || 0
        //var file_size = 16724916736

        Alert.alert(
            '',
            this.getFileFormat(file_size) + ' 이상의 저장 공간이 필요합니다.\n' +
                '가입하신 요금제에 따라 \n' +
                '데이터 요금이 부과될 수 있으니, \n' +
                'Wi-Fi 환경에서 이용하시길 권해드립니다.',
            [
                {text: '확인', onPress: () => {
                        this.requestWriteStoragePermission(fileItemIndex)
                    }
                },
                {text: '취소', onPress: () => function(){} },
            ]);
    }

    downloadFile = (fileItemIndex) => {
        if ( this.state.targetItem.files[fileItemIndex].state === STATE_DOWNLOAD_READY ) {
            //let fileId = this.generateFileName(fileItemIndex);
            //let fileName = fileId + '.' + this.state.targetItem.files[fileItemIndex].appendExt;
            let fileName = this.state.targetItem.files[fileItemIndex].fileName;

            let config;
            if(Platform.OS == 'android') {

                console.log('TEST', RNFetchBlob.fs.dirs)
                console.log('SAVE PATH ORIGIN', `${RNBackgroundDownloader.directories.documents}/` + fileName)

                // Download Manager 사용하는 경우
                config = {
                    addAndroidDownloads: {
                        title: fileName,
                        overwrite : true,
                        useDownloadManager: true,
                        mediaScannable: true,
                        notification: true,
                        //description: '해커스 통합앱',
                        //path: `${RNBackgroundDownloader.directories.documents}/` + fileName,
                        //내장 메모리
                        path: RNFetchBlob.fs.dirs.DownloadDir + '/' + fileName,
                        //path: RNFS.ExternalDirectoryPath + '/' + fileName,
                        //원본코드 mime: this.mapMimeType(this.state.targetItem.files[fileItemIndex].appendExt)
                        mime: this.mapMimeType(fileName.split('.').pop())
                    },
                    fileCache: false,
                    //path: `${RNBackgroundDownloader.directories.downloads}` + fileName,
                    //appendExt: appendExt,
                    trusty: true,
                }


                // Download Manager 사용하지 않는 경우
                /*
                config = {
                    fileCache: false,
                    //path: `${RNBackgroundDownloader.directories.documents}/` + fileName,
                    path: RNFetchBlob.fs.dirs.DownloadDir + '/' + fileName,
                    // ㄴ /storage/emulated/0/Download

                    //path: RNFetchBlob.fs.dirs.SDCardDir + '/Download/' + fileName,
                    // ㄴ /storage/emulated/0/Downloads/*

                    appendExt: this.state.targetItem.files[fileItemIndex].appendExt,
                    trusty: true,
                }
                */
            } else {
                config = {
                    fileCache: false,
                    path: `${RNBackgroundDownloader.directories.documents}/` + fileName,
                    //원본코드 appendExt: this.state.targetItem.files[fileItemIndex].appendExt,
                    appendExt: fileName.split('.').pop(),
                    overwrite: true,
                    trusty: true,
                    //IOSBackgroundTask: true,
                    // DONE false인 경우에는 앱 숨김 시 다운로드 지속됨 / 앱 종료 시 중지
                    // DONE true인 경우에도 false인 경우와 동일함
                }

                RNFetchBlob.fs.exists(`${RNBackgroundDownloader.directories.documents}/` + fileName)
                    .then((ext) => {
                        if(ext) {
                            console.log('downloadFile()', '해당 파일이 이미 존재합니다.')
                        } else {
                            console.log('downloadFile()', '해당 파일이 존재하지 않습니다.')
                        }
                    });
            }

            var free_disk = 0;

            RNFetchBlob.fs.df().then( response => {
                console.log('downloadFile()', 'START CALL df()')

                console.log('downloadFile()', 'response = ' + JSON.stringify(response))

                if(Platform.OS === 'ios') {
                    free_disk = response.free;
                } else {
                    free_disk = response.internal_free;
                }

                /*
                //Android
                { "external_total": "27425546240", "external_free": "1213349888", "internal_total": "27446517760", "internal_free": "1239564288" }
                //iOS
                { "free": 15724916736, "total":31978983424 }
                */

                var file_size = this.state.targetItem.files[fileItemIndex].fileSize || 0

                console.log('Free space in bytes: ' + parseInt(free_disk));
                console.log('File size in bytes: ' + parseInt(file_size))


                if(parseInt(free_disk) < parseInt(file_size)) {
                    Alert.alert('', '디바이스 내 저장 공간이 부족합니다.');
                } else {
                    this.state.targetItem.files[fileItemIndex].state = STATE_DOWNLOAD_PROGRESS;
                    this.state.targetItem.files[fileItemIndex].progressPercent = 0;
                    this.forceUpdate()

                    RNFetchBlob
                        .config(config)
                        .fetch('GET', (Platform.OS == 'ios'
                            && encodeURI(this.state.targetItem.files[fileItemIndex].fileUrl)
                            || this.state.targetItem.files[fileItemIndex].fileUrl
                        ))
                        .progress((received, total) => {
                            console.log('progress', 'received : total = ' + received + ' : ' + total)
                            this.state.targetItem.files[fileItemIndex].downloadPercent = parseInt((received / total) * 100);
                            this.forceUpdate()
                        })
                        .then((res) => {
                            let status = res.info().status;
                            this.state.targetItem.files[fileItemIndex].state = STATE_DOWNLOAD_COMPLETE;
                            this.state.targetItem.files[fileItemIndex].localFilePath = res.path();
                            //this.state.targetItem.files[fileItemIndex].localFilePath = RNFetchBlob.fs.dirs.DownloadDir + '/' + fileName;
                            this.forceUpdate()

                            if(Platform.OS == 'ios') {
                                //원본코드 this.share(this.mapMimeType(this.state.targetItem.files[fileItemIndex].appendExt), res.path());
                                this.share(this.mapMimeType(fileName.split('.').pop()), res.path())
                            }

                        })
                        .catch((err) => {
                            console.log('RNFetchBlob', err)
                        })
                }
            });
        } else {
            this.ToastMessage('다운로드 중입니다.');
        }
    }

    share = async(mimeType, path) => {
        try {
            const options = {
                url: 'file://' + path,
                type: mimeType,
            };
            await Share.open(options);
        } catch (e) {
            console.log(e);
        }
    }

    openFile = (fileItemIndex) => {

        // 1안) promise 이벤트 수신 => 코드 상에서 이벤트 없음
        // 2안) Use React Native and Android Native Merged Boilerplate
        // ㄴ https://medium.com/@moshfiqrony/react-native-and-android-native-boiler-plate-72a08409feed
        // 3안) 파일 실행을 위한 별도 라이브러리 사용

        if(Platform.OS == 'android') {
            /*
            const android = RNFetchBlob.android
            android
                .actionViewIntent(
                    this.state.targetItem.files[fileItemIndex].localFilePath,
                    this.mapMimeType(this.state.targetItem.files[fileItemIndex].appendExt)
                )
                .then((success) => {
                    console.log('success: ', success)
                })
                .catch((err) => {
                    console.log('err:', err)
                })
            */
            // Pick a single file
            /*
            try {
                const res = DocumentPicker.pick({
                    type: [DocumentPicker.types.allFiles],
                });
                console.log(res);
            } catch (err) {
                console.log('err', err);
                if (DocumentPicker.isCancel(err)) {
                    // User cancelled the picker, exit any dialogs or menus and move on
                } else {
                    throw err;
                }
            }
            */

            return;

            const path = this.state.targetItem.files[fileItemIndex].localFilePath
                FileViewer.open(path)
                    .then(() => {
                        // success
                        console.log('success')
                    })
                    .catch(error => {
                        console.log(error)
                    });
        } else {
            const ios = RNFetchBlob.ios;
            ios.openDocument(this.state.targetItem.files[fileItemIndex].localFilePath)
                .then(() => {
                    console.log('success')
                })
                .catch(error => {
                    console.log('error', error)
                });
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large"/></View>
            )
        } else {
            return (
                <View style={styles.container}>
                    
                    <FreeParallaxScrollView
                        windowHeight={NAV_BAR_HEIGHT}
                        backgroundSource={require('../../../assets/icons/img_learn_f.png')}
                        navBarHeight={NAV_BAR_HEIGHT}
                        navBarColor={'#ff0000'}
                        navBarTitle=''
                        navBarView={false}
                        lectureName={!CommonUtil.isEmpty(this.state.targetItem.title) ? this.state.targetItem.title : ''}
                        headerView={<View></View>}
                        textbookTitle='123'
                        markImage='../../../assets/icons/icon_mp_title.png'
                        leftIcon={{name: 'left', color: '#fff', size: 25, type: 'font-awesome'}}
                        centerTitle={this.state.targetItem.title  || ''}
                        leftIconOnPress={() => this._historyBack()}
                        rightIcon={null}>

                        {/* 설명 영역 */}
                        <ScrollView
                            style={[styles.descArea, {height: DESC_AREA_HEIGHT}]}
                            nestedScrollEnabled={true}>
                            <CustomTextR
                                style={styles.descText}>
                                {this.state.targetItem.content}
                            </CustomTextR>
                        </ScrollView>

                        {/* 버튼 영역 */}
                        <View style={[styles.downloadArea, {height: DOWNLOAD_AREA_HEIGHT}]}>
                            {
                                this.state.targetItem.files.map((item, index) => {
                                    return (
                                        <View key={index}>
                                            <TouchableOpacity
                                                style={
                                                    item.state === STATE_DOWNLOAD_COMPLETE
                                                        ? styles.downButtonAreaComplete
                                                        : styles.downButtonAreaReady}
                                                onPress={() =>
                                                    item.state === STATE_DOWNLOAD_READY
                                                        ?
                                                            //this.requestWriteStoragePermission(index)
                                                            //this.alertDownloadFile(index)
                                                            this.checkLogin(index)
                                                        : item.state === STATE_DOWNLOAD_PROGRESS
                                                            ?
                                                                function(){}
                                                            :
                                                                Platform.OS == 'ios'
                                                                    &&
                                                                        this.share(
                                                                            this.mapMimeType(this.state.targetItem.files[index].appendExt),
                                                                            this.state.targetItem.files[index].localFilePath
                                                                        )
                                                }>

                                                {/* 클립 영역 */}
                                                <View style={styles.downIconArea}>
                                                    <Image
                                                        style={styles.clipIcon}
                                                        source={require('../../../assets/icons/icon_clip.png')}/>
                                                </View>

                                                {/* 타이틀 영역 */}
                                                <View style={styles.downTitleArea}>
                                                    <CustomTextR
                                                        style={
                                                            item.state === STATE_DOWNLOAD_COMPLETE
                                                                && styles.downTitleCompleteText
                                                                || styles.downTitleText
                                                        }
                                                        numberOfLines={1}
                                                        ellipsizeMode='middle'>
                                                        {item.fileName}
                                                    </CustomTextR>
                                                </View>

                                                {/* 상태 영역 */}
                                                <View style={styles.downControlArea}>
                                                    {
                                                        item.state === STATE_DOWNLOAD_READY
                                                            ?
                                                                <Image
                                                                    style={styles.downIcon}
                                                                    source={require('../../../assets/icons/icon_download.png')}/>
                                                            : item.state === STATE_DOWNLOAD_PROGRESS
                                                                ?
                                                                    Platform.OS == 'ios'
                                                                        ?
                                                                            <CustomTextB style={styles.downPercent}>
                                                                                {item.downloadPercent === undefined ? 0 : item.downloadPercent}%
                                                                            </CustomTextB>
                                                                        :
                                                                            <ActivityIndicator
                                                                                style={styles.downIndicator}
                                                                                size="small"/>
                                                                :
                                                                    <Image
                                                                        style={styles.completeIcon}
                                                                        source={require('../../../assets/icons/icon_done.png')}/>
                                                    }
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </FreeParallaxScrollView>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    IndicatorContainer: {
        flex: 1,
        backgroundColor: DEFAULT_COLOR.base_color_fff,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
    },
    /* 설명 영역 */
    descArea: {
        backgroundColor: DEFAULT_COLOR.input_bg_color,
    },
    descText: {
        marginTop: 30,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        color: DEFAULT_COLOR.base_color_666,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
        lineHeight: DEFAULT_TEXT.body_14 * 1.42,
    },
    /* 버튼 영역 */
    downloadArea: {
        margin: 20,
        backgroundColor: DEFAULT_COLOR.base_color_fff,
    },
    downButtonAreaReady: {
        flexDirection: 'row',
        width: SCREEN_WIDTH - 40,
        height: DOWNLOAD_BUTTON_HEIGHT,
        borderWidth: 1,
        borderColor: DEFAULT_COLOR.base_color_888,
        borderRadius: 4,
        marginBottom: 10,
    },
    downButtonAreaComplete: {
        flexDirection: 'row',
        width: SCREEN_WIDTH - 40,
        height: DOWNLOAD_BUTTON_HEIGHT,
        borderWidth: 1,
        borderColor: DEFAULT_COLOR.input_border_color,
        borderRadius: 4,
        marginBottom: 10,
    },
    downIconArea: {
        flex: 1.5,
        //flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        //justifyContent: 'flex-end',
    },
    clipIcon: {
        //width: DOWNLOAD_BUTTON_HEIGHT / 3,
        //height: DOWNLOAD_BUTTON_HEIGHT / 3,
        width: 15,
        height: 14,
        marginLeft: 10,
        //alignSelf: 'center',
    },
    downTitleArea: {
        flex: 8,
        alignItems: 'center',
        justifyContent: 'center',
        //marginLeft: 10,
    },
    downTitleText: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_13),
        lineHeight: DEFAULT_TEXT.body_13 * 1.42,
    },
    downTitleCompleteText: {
        color: DEFAULT_COLOR.base_color_888,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_13),
        lineHeight: DEFAULT_TEXT.body_13 * 1.42,
    },
    downControlArea: {
        flex: 1.5,
        //flexDirection: 'row',
        alignItems: 'center',
        //justifyContent: 'flex-start',
        justifyContent: 'center',
        //marginLeft: 5,
        marginRight: 5,
    },
    downIcon: {
        //width: DOWNLOAD_BUTTON_HEIGHT / 3,
        //height: DOWNLOAD_BUTTON_HEIGHT / 3,
        width: 15,
        height: 14,
        //alignSelf: 'center',
    },
    completeIcon: {
        //width: DOWNLOAD_BUTTON_HEIGHT / 3,
        //height: DOWNLOAD_BUTTON_HEIGHT / 3,
        width: 15,
        height: 15,
        //alignSelf: 'center',
    },
    downIndicator: {
        color: DEFAULT_COLOR.lecture_base,
    },
    downPercent: {
        color: DEFAULT_COLOR.lecture_base,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_13),
    }
});