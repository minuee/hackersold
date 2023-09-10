import React, {Component} from 'react';
import {
    StyleSheet, View, Text, ActivityIndicator, Linking, ScrollView, TouchableOpacity,
    Dimensions, FlatList, SafeAreaView, PixelRatio, Image, StatusBar, Platform, Modal, PermissionsAndroid, Alert
} from 'react-native';
import { getStatusBarHeight } from "react-native-status-bar-height";
import { isIphoneX, getBottomSpace } from "react-native-iphone-x-helper";


import SampleVideoScreen3 from '../../Utils/SampleVideoScreen3'
//import Video from 'react-native-video';

import AutoHeightImage from 'react-native-auto-height-image';
import {CustomText, CustomTextB, CustomTextR, CustomTextM} from "../../Style/CustomText";

import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/AntDesign';
Icon2.loadFont();


import AsyncStorage from '@react-native-community/async-storage';
import 'moment/locale/ko'
import  moment  from  "moment";


//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonUtil from '../../Utils/CommonUtil';
import Toast from "react-native-tiny-toast";
import {SERVICES} from '../../Constants/Common';
import LinearGradient from "react-native-linear-gradient";
import RNFetchBlob from 'rn-fetch-blob';
import RNBackgroundDownloader from 'react-native-background-downloader';
import CommonFunction from '../../Utils/CommonFunction';
import Share from 'react-native-share';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

/*
const SCREEN_WIDTH =  Dimensions.get("window").width;
getScreenHeight = () => {
    const status = getStatusBarHeight();

    if(Platform.OS == 'android') {
        return Dimensions.get("window").height;
    } else {
        if (isIphoneX()) {
            return Dimensions.get("window").height - status;
        } else {

            return Dimensions.get("window").height - status;
        }
    }
}
const SCREEN_HEIGHT = getScreenHeight();
*/


//비디오 설정
const VIDEO_WIDTH = SCREEN_WIDTH;
const VIDEO_HEIGHT = SCREEN_WIDTH * ( 9 / 16 );

//다운로드 설정
const STATE_DOWNLOAD_READY = undefined;
const STATE_DOWNLOAD_PROGRESS = 'progress';
const STATE_DOWNLOAD_COMPLETE = 'complete';

export default class FreeLectureDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            historyTmp : [],
            containerWidth: '100%',
            containerHeight: null,
            isPlayFirst: true,
            isFullscreen: false,
            disablePlayVideoPrev: false,
            disablePlayVideoNext: false,
            loading: false,
            showTopButton : false,
            freeLectureIdx: props.navigation.getParam('freeLectureIdx'),
            lectureItem: {},//props.navigation.getParam('lectureItem'),
            currentItemIndex: 0,
            relatedLectureItems: [],
            moveLectureItem: this.moveLectureItem.bind(this),
            heightScrollView: 0,
            showModal: false,
            fromHistory : typeof this.props.navigation.state.params.fromHistory !== 'undefined' ? true : false
        }

        console.log('FreeLectureDetail.js > constructor()', 'freeLectureIdx = ' + props.navigation.getParam('freeLectureIdx'))
    }

    static navigationOptions = ({ navigation }) => ({
        headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            //backgroundColor: DEFAULT_COLOR.lecture_base,
            backgroundColor: 'transparent',
        },
        headerTitle: '',
        headerTitleStyle: {
            flexGrow: 1,
            textAlign: 'center',
            alignItems: 'center',
            fontSize: DEFAULT_TEXT.head_medium,
            color: DEFAULT_COLOR.base_color_fff,
            backgroundColor: 'transparent',
        },
        headerLeft: <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Icon
                name={'angle-left'}
                size={40}
                color={DEFAULT_COLOR.base_color_fff}
                style={{paddingLeft:10}}
                onPress={ () => { this.naviBack() }} />
        </View>,
        headerRight: <View></View>,
    });

    naviBack = () => {
        console.log('this.state.fromHistory',this.state.fromHistory)
        navigation.goBack();
        if ( this.state.fromHistory ) {
            navigation.toggleDrawer();
        }
    }

    
    async UNSAFE_componentWillMount() {
        this.setHistory()

        let myInterestCode = await AsyncStorage.getItem('myInterestCode')
        const memberIdx = await CommonUtil.getMemberIdx();

        this.setState({
            interestFieldID: JSON.parse(myInterestCode).info.interestFieldID,
            myInterestCode: myInterestCode,
            memberIdx: memberIdx,
        }, function() {
            this.getLectureList()
        })
    }

    componentDidMount() {
        this.timeout = setTimeout(
            () => {
                this.saveToStorage();
        },
            1000    // 1초
        );
    }

    setHistory = async() => {
        await AsyncStorage.getItem('history', (error, result) => {
            {
                if(result) {
                    let resultTmp = JSON.parse(result);
                    if ( resultTmp.length > DEFAULT_CONSTANTS.recentlyHistoryLimit ) {
                        let resultTmp2 = resultTmp.sort((a, b) => ( b.date > a.date) ? 1 : -1);
                        let resultTmp3 = resultTmp2.filter((info,index) => {
                            return index < DEFAULT_CONSTANTS.recentlyHistoryLimit
                         } )
                        this.setState({ historyTmp: resultTmp3})
                    }else{
                        this.setState({ historyTmp: resultTmp})
                    }

                }else{
                    this.setState({historyTmp : []})
                }
            }
        });
    }

    stroageInsert = async(target,object) => {
        await target.push(object);
        AsyncStorage.setItem('history', JSON.stringify(target));
    }

    checkInsertOrUpdate = async( newData) => {
        if ( this.props.navigation.state.params.lectureItem.index ) {
            let historyTmp = this.state.historyTmp;

            let isIndexOf = historyTmp.findIndex(
                //info => (info.type === 'freepractice' && info.idx === this.props.navigation.state.params.lectureItem.index )
                info => ( info.keyindex === 'freepractice' + this.props.navigation.state.params.lectureItem.index )
            );
            newHistory = await historyTmp.filter(info => info.keyindex !== 'freepractice' + this.props.navigation.state.params.lectureItem.index );
            if (isIndexOf != -1 )  { //update
                this.stroageInsert(newHistory,newData,);
            }else{ // insert
                this.stroageInsert(historyTmp,newData);
            }
        }

    }
    saveToStorage = async() => {
        let CurrentDateTimeStamp = moment().unix();
        let newData = { keyindex : 'freepractice' + this.props.navigation.state.params.lectureItem.index, type:'freepractice',urllink : '', navigate:'FreeLectureDetail',idx : this.props.navigation.state.params.lectureItem.index ,date : CurrentDateTimeStamp,imageurl : this.props.navigation.state.params.lectureItem.thumbUrl,title:this.props.navigation.state.params.lectureItem.mainTitle }
        this.checkInsertOrUpdate( newData);
    }


    refeshLectureItem = (item) => {
        let index = this.state.relatedLectureItems.findIndex(
            lecture => lecture.freeLectureIdx === item.freeLectureIdx
        )

        this.setState({
            lectureItem: item,
            currentItemIndex: index === -1 ? 0 : index
        });
    }

    handleOnScroll = async(event) => {
        if ( event.nativeEvent.contentOffset.y >= 200 ) {
            this.setState({
                showTopButton: true,
            });
        }else{
            this.setState({
                showTopButton: false,
            });
        }
    }

    upButtonHandler = async() => {
        try {
            this.ScrollView.scrollTo({ x: 0,  animated: true });
        }catch(e){

        }
    }

    loadItem = () => {
        this.setState({ loading: true });

        //TODO API 실제 적용 시 삭제 처리
        setTimeout(
            () => {
                this.setState({ loading: false });
            },500);
    }

    loadMoreItem = async(code) => {
        //this.loadItem();
    }

    filterList = () => {
        return this.state.relatedLectureItems.filter((item) => {
            return item.freeLectureIdx != this.state.freeLectureIdx;
        });
    }

    getLectureList = async() => {
        const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/freeStudy/freeLectures/'
            + JSON.parse(this.state.myInterestCode).code + '/playList/'
            + this.state.freeLectureIdx;

        console.log('getLectureList()', 'url = ' + url)

        await CommonUtil.callAPI(url)
            .then(response => {
                console.log('getLectureList()', 'response = ' + JSON.stringify(response));

                if (response && response.code === '0000') {
                    //console.log('getOwnMemoList()', 'response = ' + JSON.stringify([...this.state.items, response.data.events.data]));

                    this.setState({
                        lectureItem: response.data.freeLectures.lecture,
                        relatedLectureItems: [response.data.freeLectures.lecture, ...response.data.freeLectures.playList],
                    }, function() {

                    })
                }

                else {
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('강의 목록을 불러오는데 실패 했습니다.');
                }}).catch(error => {
                console.log(error)
                Toast.show('시스템 에러: 강의 목록을 불러오는데 실패 했습니다.');
            });
    }

    //currentItemIndex
    moveLectureItem = ( isForward ) => {
        const { currentItemIndex, relatedLectureItems, lectureItem } = this.state;

        if(isForward) {
            if(currentItemIndex + 1 < relatedLectureItems.length) {
                this.setState({
                    lectureItem: relatedLectureItems[currentItemIndex + 1],
                    currentItemIndex: currentItemIndex + 1
                });
            } else {
                this.setState({
                    lectureItem: relatedLectureItems[0],
                    currentItemIndex: 0
                });
            }
        } else {
            if(currentItemIndex > 0) {
                this.setState({
                    lectureItem: relatedLectureItems[currentItemIndex - 1],
                    currentItemIndex: currentItemIndex - 1
                });
            } else {
                this.setState({
                    lectureItem: relatedLectureItems[relatedLectureItems.length - 1],
                    currentItemIndex: relatedLectureItems.length - 1
                });
            }
        }
    }

    onPlay = async() => {
        console.log('onPlay()', '##################################')

        /*
        if(this.state.isPlayFirst) {
            await this.updatePlayCount(this.state.freeLectureIdx)
        }
        */
    }

    onLoad = async(freeLectureIdx) => {
        await this.updatePlayCount(freeLectureIdx)
    }

    updatePlayCount = async(freeLectureIdx) => {
        const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/freeStudy/freeLectures/view/' + freeLectureIdx;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
        };

        await CommonUtil.callAPI(url, options)
            .then(response => {
                console.log('updatePlayCount()', 'response = ' + JSON.stringify(response));
                if (response && response.code === '0000') {
                    this.setState({
                        isPlayFirst: false
                    })
                }
                else {
                }}).catch(error => {
            });
    }

    onEnterFullscreen = () => {
        this.setState({
            containerWidth: SCREEN_HEIGHT
                                //- (isIphoneX() ? getBottomSpace() : 0)
                                //+ (isIphoneX() ? 5 : 0) // 원인 확인 필요!!!
            , containerHeight: SCREEN_WIDTH - (isIphoneX() ? getBottomSpace() : 0),
            isFullscreen: true,
        });
    }

    onExitFullscreen = () => {
        this.setState({
            containerWidth: VIDEO_WIDTH,
            containerHeight: VIDEO_HEIGHT,
            isFullscreen: false,
        })
    }

    onLayoutScrollView = (event) => {
        const layout = event.nativeEvent.layout;

        this.setState({
            heightScrollView: layout.height
        });
    }

    toggleModal = () => {
        if(!this.state.showModal) {
            if(this.state.lectureItem.files != null
                && this.state.lectureItem.files.length > 0
            ) {
                this.setState({ showModal: true })
            }
        } else {
            this.setState({ showModal: false })
        }
    };

    requestWriteStoragePermission = async (index) => {
        try {
            if(Platform.OS == 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
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
            this.setState({showModal:false}, function() {
                Alert.alert('', '로그인이 필요합니다.\n로그인 하시겠습니까?',
                    [
                        {text: '확인', onPress: () => {
                                this.props.navigation.navigate('SignInScreen');
                            }
                        },
                        {text: '취소', onPress: () => function(){} },
                    ]);
            })
        }
    }

    alertDownloadFile = (fileItemIndex) => {
        var file_size = this.state.lectureItem.files[fileItemIndex].fileSize || 0
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
        if ( this.state.lectureItem.files[fileItemIndex].state === STATE_DOWNLOAD_READY ) {
            let fileName = this.state.lectureItem.files[fileItemIndex].fileName;

            let config;
            if(Platform.OS == 'android') {

                // Download Manager 사용하는 경우
                config = {
                    addAndroidDownloads: {
                        title: fileName,
                        overwrite : true,
                        useDownloadManager: true,
                        mediaScannable: true,
                        notification: true,
                        path: RNFetchBlob.fs.dirs.DownloadDir + '/' + fileName,
                        mime: this.mapMimeType(fileName.split('.').pop())
                    },
                    fileCache: false,
                    trusty: true,
                }
            } else {
                config = {
                    fileCache: false,
                    path: `${RNBackgroundDownloader.directories.documents}/` + fileName,
                    appendExt: fileName.split('.').pop(),
                    trusty: true,
                }
            }

            var free_disk = 0;

            RNFetchBlob.fs.df().then( response => {
                console.log('downloadFile()', 'START CALL df()')

                console.log('downloadFile()', 'response = ' + JSON.stringify(response))
                console.log('Free space in bytes: ' + response.free);
                console.log('Total space in bytes: ' + response.total);

                if (Platform.OS === 'ios') {
                    free_disk = response.free;
                } else {
                    free_disk = response.internal_free;
                }

                /*
                //Android
                {
                    "external_total": "27425546240",
                    "external_free": "1213349888",
                    "internal_total": "27446517760",
                    "internal_free": "1239564288"
                }

                //iOS
                {
                    "free": 15724916736,
                    "total":31978983424
                }
                */

                var file_size = this.state.lectureItem.files[fileItemIndex].fileSize || 0
                //var file_size = 16724916736

                if (parseInt(free_disk) < parseInt(file_size)) {
                    Alert.alert('', '디바이스 내 저장 공간이 부족합니다.');
                } else {
                    this.state.lectureItem.files[fileItemIndex].state = STATE_DOWNLOAD_PROGRESS;
                    this.state.lectureItem.files[fileItemIndex].progressPercent = 0;
                    this.forceUpdate()

                    RNFetchBlob
                        .config(config)
                        .fetch('GET', (Platform.OS == 'ios'
                            && encodeURI(this.state.lectureItem.files[fileItemIndex].fileUrl)
                            || this.state.lectureItem.files[fileItemIndex].fileUrl
                        ))
                        .progress((received, total) => {
                            console.log('progress', 'received : total = ' + received + ' : ' + total)
                            this.state.lectureItem.files[fileItemIndex].downloadPercent = parseInt((received / total) * 100);
                            this.forceUpdate()
                        })
                        .then((res) => {
                            let status = res.info().status;
                            this.state.lectureItem.files[fileItemIndex].state = STATE_DOWNLOAD_COMPLETE;
                            this.state.lectureItem.files[fileItemIndex].localFilePath = res.path();
                            this.forceUpdate()

                            if (Platform.OS == 'ios') {
                                this.share(this.mapMimeType(fileName.split('.').pop()), res.path())
                            }

                        })
                        .catch((err) => {
                            console.log('RNFetchBlob', err)
                        })
                }
            })
        } else {
            this.ToastMessage('다운로드 중입니다.');
        }
    }

    // TODO 안드로이드의 다운로드 매니저에서 네트워크 끊김 및 재연결

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

    renderModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.showModal}
                onRequestClose={() => {
                    this.setState({showModal:false})
                }}
                animationInTiming={300}
                animationOutTiming={300}
                hideModalContentWhileAnimating
                isVisible={this.state.showModal}>

                <SafeAreaView style={[styles.modalContainer]}>
                    <View style={styles.modalBackgrounder}>

                    </View>

                    <View style={styles.modalWrapper}>
                        <View style={styles.modalContent}>
                            <ScrollView
                                style={styles.modalScroll}
                                onLayout={(event) => this.onLayoutScrollView(event)}
                                indicatorStyle='black'>
                                {
                                    this.state.lectureItem.files.map((item, index) => {
                                        return (
                                            <View style={styles.modalItem} key={index}>
                                                <TouchableOpacity
                                                    style={styles.modalItemWrapper}
                                                    onPress={() =>
                                                        item.state === STATE_DOWNLOAD_READY
                                                            ?
                                                                //this.requestWriteStoragePermission(index)
                                                                //this.alertDownloadFile(index)
                                                                this.checkLogin(index)
                                                            : item.state === STATE_DOWNLOAD_PROGRESS
                                                                    ? function(){}
                                                                    :
                                                                        Platform.OS == 'ios'
                                                                            &&
                                                                                this.share(
                                                                                    this.mapMimeType(this.state.lectureItem.files[index].appendExt),
                                                                                    this.state.lectureItem.files[index].localFilePath
                                                                                )
                                                    }
                                                    >
                                                    <View style={styles.modalItemIconSelectedWrapperLeft}>
                                                    </View>

                                                    <View style={styles.modalItemIconSelectedWrapperCenter}>
                                                        <CustomTextR
                                                            style={
                                                                item.state === STATE_DOWNLOAD_COMPLETE
                                                                ? styles.modalItemTextComplete
                                                                : styles.modalItemText
                                                            }
                                                            numberOfLines={1}
                                                            ellipsizeMode='middle'
                                                            >
                                                            {item.fileName}
                                                        </CustomTextR>
                                                    </View>

                                                    <View style={styles.modalItemIconSelectedWrapperRight}>
                                                        {/*
                                                        <Image
                                                            style={styles.modalItemIconSelected}
                                                            source={require('../../../assets/icons/btn_check_list.png')}/>
                                                        */}
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
                                <LinearGradient
                                    pointerEvents={'none'}
                                    colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0.95)", "rgba(255,255,255,1.00)"]}
                                    //colors={["rgba(255,255,255,0)", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.9)"]}
                                    locations={[0, 0.70, 1]}
                                    style={{position: "absolute", height: this.state.heightScrollView, width: "100%", }}/>
                            </ScrollView>
                            <View style={styles.cancelButton}>
                                <TouchableOpacity
                                    style={styles.cancelButtonWrapper}
                                    onPress={() => this.toggleModal()}>
                                    <CustomTextR styles={styles.cancelButtonText}>취소</CustomTextR>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        )
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large"/></View>
            )
        } else {
            //여기
            return (
                <SafeAreaView style={[
                        styles.container,
                        { width: this.state.containerWidth, height: this.state.containerHeight },
                        { backgroundColor: (this.state.isFullscreen ? DEFAULT_COLOR.base_color_000 : DEFAULT_COLOR.base_color_fff )}
                    ]}>
                        
                    {
                        this.state.showTopButton
                        &&
                        <TouchableOpacity
                            style={styles.btnGoTopWrap}
                            onPress={e => this.upButtonHandler()}>
                            <Image
                                style={{
                                    width: 43,
                                    height: 43,
                                }}
                                source={require('../../../assets/icons/btn_top.png')}/>
                        </TouchableOpacity>
                    }
                    <ScrollView
                        ref={(ref) => {
                            this.ScrollView = ref;
                        }}
                        style={styles.containerWrapper}
                        indicatorStyle={'white'}
                        scrollEventThrottle={16}
                        keyboardDismissMode={'on-drag'}
                        onScroll={e => this.handleOnScroll(e)}
                        onMomentumScrollEnd = {({nativeEvent}) => {
                        }}
                        onScrollEndDrag ={({nativeEvent}) => {
                            this.loadMoreItem (nativeEvent)
                        }}
                        bounces={false}>

                        {/* Main Video */}
                        {/*
                        <Video
                            style={styles.backgroundVideo}
                            resizeMode='stretch'
                            source={{uri: this.state.lectureItem.videoUrl}}   // Can be a URL or a local file.
                            ref={(ref) => {
                                this.player = ref
                            }}                                      // Store reference
                            onBuffer={this.onBuffer}                // Callback when remote video is buffering
                            onError={this.videoError}               // Callback when video cannot be loaded
                            />
                        */}

                        <SampleVideoScreen3
                            screenState={this.state}
                            videoWidth={VIDEO_WIDTH}
                            videoHeight={VIDEO_HEIGHT}
                            navigation={ this.props.navigation }
                            source={{ uri: this.state.lectureItem.lectureUrl }}
                            poster={this.state.lectureItem.lectureImage}
                            showOnStart={true}
                            title={this.state.lectureItem.title}
                            seekBarFillColor={DEFAULT_COLOR.lecture_sub}
                            //moveLectureItem={(isForward) => this.moveLectureItem(isForward)}
                            onEnterFullscreen={() => this.onEnterFullscreen()}
                            onExitFullscreen={() => this.onExitFullscreen()}
                            onPlay={() => this.onPlay()}
                            onLoad={() => this.onLoad(this.state.freeLectureIdx)}
                            />

                        {
                            this.state.isFullscreen
                                || (
                                    <View>
                                        <View style={styles.description}>
                                            <CustomTextB
                                                style={styles.descriptionMain}
                                                numberOfLines={1}>
                                                {this.state.lectureItem.title}
                                            </CustomTextB>
                                            <CustomTextR
                                                style={styles.descriptionSub}
                                                numberOfLines={1}>
                                                {this.state.lectureItem.subTitle}
                                            </CustomTextR>
                                            {
                                                (
                                                    this.state.lectureItem.files != null
                                                    && this.state.lectureItem.files.length > 0
                                                )
                                                    &&
                                                        <TouchableOpacity
                                                            onPress={() => this.toggleModal()}>
                                                            <View style={styles.downloadArea}>
                                                                <Image
                                                                    style={styles.downloadIcon}
                                                                    source={require('../../../assets/icons/icon_download.png')}/>
                                                                <CustomTextM
                                                                    style={
                                                                        styles.downloadText
                                                                    }>
                                                                    자료 다운로드
                                                                </CustomTextM>
                                                            </View>
                                                        </TouchableOpacity>
                                            }
                                        </View>

                                        <View style={styles.separator}></View>

                                        {/* Related Video */}
                                        <View style={styles.relatedLectures}>
                                        <CustomTextB style={styles.relatedLecturesTitle}>관련 영상</CustomTextB>

                                        {
                                            (
                                                this.state.relatedLectureItems == null
                                                || this.state.relatedLectureItems.length == 0
                                                || this.state.relatedLectureItems.length == 1
                                            )
                                                &&
                                                    <View style={styles.emptyContainer}>
                                                        <Image
                                                            style={styles.emptyIcon}
                                                            source={require('../../../assets/icons/icon_none_exclamation.png')}
                                                        />
                                                        <CustomTextR style={styles.emptyTitle}>
                                                            등록된 영상이 없습니다
                                                        </CustomTextR>
                                                    </View>
                                                ||
                                                    <FlatList
                                                        data={this.filterList()/*this.state.relatedLectureItems*/}
                                                        ItemSeparatorComponent={({highlighted}) => (
                                                            <View style={styles.lectureSeparator}>
                                                                <View style={styles.lectureSeparatorContent}></View>
                                                            </View>
                                                        )}
                                                        renderItem={({item, index, separator}) => (
                                                            <TouchableOpacity
                                                                onPress={() => this.refeshLectureItem(item)}>

                                                                <View style={styles.relatedLectureContent}>
                                                                    <View style={styles.relatedLectureLeft}>
                                                                        <AutoHeightImage
                                                                            source={{uri: item.lectureImage}}
                                                                            width={SCREEN_WIDTH / 2 - 40}/>
                                                                    </View>

                                                                    <View style={styles.relatedLectureRight}>
                                                                        <CustomTextM
                                                                            style={styles.relatedLectureMainTitle}
                                                                            numberOfLines={2}>
                                                                            {item.title}
                                                                        </CustomTextM>
                                                                        <CustomTextR
                                                                            style={styles.relatedLectureSubTitle}
                                                                            numberOfLines={2}>
                                                                            {item.subTitle}
                                                                        </CustomTextR>
                                                                    </View>
                                                                </View>
                                                            </TouchableOpacity>
                                                        )}/>
                                        }
                                        </View>
                                    </View>
                                )
                            }
                    </ScrollView>
                    {
                        (
                            this.state.lectureItem.files != null
                            && this.state.lectureItem.files.length > 0
                        ) && this.renderModal()
                    }
                </SafeAreaView>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //width: '100%',
        //height: null,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    IndicatorContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: DEFAULT_COLOR.base_color_fff,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerWrapper: {
        flex: 1,
        backgroundColor: DEFAULT_COLOR.base_color_fff,
    },
    separator: {
        backgroundColor: '#EAEBEE',
        width: SCREEN_WIDTH,
        height: 8,
    },
    lectureSeparator: {
        height: 30,
        justifyContent: 'center',
    },
    lectureSeparatorContent: {
        height: 1,
        backgroundColor: DEFAULT_COLOR.input_border_color,
    },
    description: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingRight: 10,
    },
    descriptionMain: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(18),
        lineHeight: 18 * 1.42,
    },
    descriptionSub: {
        color: DEFAULT_COLOR.base_color_666,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),
        paddingBottom: 20,
        lineHeight: DEFAULT_TEXT.head_small * 1.42,
    },
    downloadArea: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: DEFAULT_COLOR.base_color_ccc,
        marginBottom: 20,
    },
    downloadIcon: {
        width: 19,
        height: 17,
        marginRight: 9.5,
    },
    downloadText: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
        lineHeight: DEFAULT_TEXT.body_14 * 1.42,
    },
    downloadTextDisabled: {
        color: DEFAULT_COLOR.base_color_ccc,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
        lineHeight: DEFAULT_TEXT.body_14 * 1.42,
    },
    relatedLectures: {
        margin: 20,
    },
    relatedLecturesTitle: {
        marginBottom: 10,
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),
        lineHeight: DEFAULT_TEXT.head_small * 1.42,
    },
    relatedLectureContent: {
        flexDirection: 'row',
    },
    relatedLectureLeft: {
        flex: 1,
    },
    relatedLectureRight: {
        flex: 1,
    },
    relatedLectureMainTitle: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
        lineHeight: DEFAULT_TEXT.body_14 * 1.42,
        marginBottom: 8,
    },
    relatedLectureSubTitle: {
        color: DEFAULT_COLOR.base_color_888,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12),
        lineHeight: DEFAULT_TEXT.body_12 * 1.42,
    },
    btnGoTopWrap : {
        position:'absolute',
        bottom:20,
        right:20,
        width:50,
        height:50,
        paddingTop:5,
        backgroundColor:'transparent',
        alignItems:'center',
        justifyContent:'center',
        zIndex:3,
        //borderColor:'#ccc',
        //borderWidth:1,
        //borderRadius:25,
        //opacity:0.5
    },
    emptyContainer: {
        flex: 1,
        height: SCREEN_HEIGHT * 0.4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyIcon: {
        width: 65,
        height: 65,
        marginBottom: 15,
    },
    emptyTitle: {
        color: DEFAULT_COLOR.base_color_888,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
        lineHeight: DEFAULT_TEXT.body_14 * 1.42,
    },

    /** Modal **/
    modalContainer: {
        backgroundColor: 'transparent',
        height: '100%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    modalBackgrounder: {
        flex: 2,
        backgroundColor: '#00000055',
    },
    modalWrapper: {
        flex: 3,
        backgroundColor: '#00000055',
    },
    modalContent: {
        flex: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: DEFAULT_COLOR.base_color_fff
    },
    modalScroll: {

    },
    modalItem: {
        height: 65,
        //alignItems: 'center',
        justifyContent: 'center',
    },
    modalItemWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalItemText: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(16),
        lineHeight: 16 * 1.42,
    },
    modalItemTextComplete: {
        color: DEFAULT_COLOR.base_color_888,
        fontSize: PixelRatio.roundToNearestPixel(16),
        lineHeight: 16 * 1.42,
    },
    modalItemIconSelectedWrapperLeft: {
        flex: 1.5,
        alignItems: 'center',
    },
    modalItemIconSelectedWrapperCenter: {
         flex: 7,
    },
    modalItemIconSelectedWrapperRight: {
        flex: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 17,
    },
    modalItemIconSelected: {
        width: 15,
        height: 15,
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
    },
    cancelButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonWrapper: {
        width: SCREEN_WIDTH - 34,
        height: 50,
        backgroundColor: DEFAULT_COLOR.input_bg_color,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 17,
        paddingRight: 17,
        marginBottom: 17,
    },
    cancelButtonText: {
        color: DEFAULT_COLOR.base_color_888,
        fontSize: PixelRatio.roundToNearestPixel(16),
        lineHeight: 16 * 1.42,
    },
});
