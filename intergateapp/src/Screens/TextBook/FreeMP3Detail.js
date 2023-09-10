import React, { Component } from 'react';
import {
    Platform,
    ScrollView,
    View,
    StyleSheet,
    Text,
    Image,
    Dimensions,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator,
    PixelRatio,
    BackHandler,
    PermissionsAndroid,
    Alert,
} from 'react-native';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import AppLink from '../../Utils/AppLink';
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
const RNFS = require('react-native-fs');
import { NavigationEvents } from 'react-navigation';
import ParallaxScrollView from './ParallaxScrollView2';
import Toast from 'react-native-tiny-toast';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextB, CustomTextM,TextRobotoM,TextRobotoR} from '../../Style/CustomText';
import { Overlay } from 'react-native-elements';
import MP3DownPopLayer from './mp3DownPopLayer';


const SendIntentAndroid = require("react-native-send-intent");
import SampleListening from "./SampleListening"; // tabs 02 샘플듣기
import { AppInstalledChecker, CheckPackageInstallation } from '../../Utils/AppInstalledChecker'
import AutoHeightImage from 'react-native-auto-height-image';


const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

const STATE_DOWNLOAD_READY = undefined;
const STATE_DOWNLOAD_PROGRESS = 'progress';
const STATE_DOWNLOAD_COMPLETE = 'complete';

import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment/moment";

class FreeMP3Detail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,                
            tabDepth : 0,
            tabViewMode :'folder',            
            downloadStatus : null,
            nowDownloadPercentage : 0,
            bookInfo :this.props.navigation.state.params.bookInfo,
            baseBookInfo : this.props.navigation.state.params.bookInfo,
            bannerurl:this.props.navigation.state.params.bannerurl,
            isInstalledMP3Player : false,
            showBottomBar : false,
            filelist : [
                {
                    zipUrl : null,
                    mp3Contents : []
                }
            ],    
            showModal : false,
            samplemp3list : [],            
            _closeModal : this._closeModal.bind(this),
            popLayerView: false,
            closePopLayer: this.closePopLayer.bind(this),
            closePopLayerAndOpenStore: this.closePopLayerAndOpenStore.bind(this),
        }

        this.pathHistory = new Array();

        console.log('FreeMP3Detail.js > constructor()', 'mpCode = ' + this.props.navigation.state.params.mpCode)
        console.log('FreeMP3Detail.js > constructor()', 'bookInfo = ' + JSON.stringify(this.props.navigation.state.params.bookInfo))
    }

    static navigationOptions = {
        header: null
    }
    
    async UNSAFE_componentWillMount() {
        if ( this.props.navigation.state.params.bookInfo.bookIdx && this.props.navigation.state.params.mpCode  ) {
            //this.getBookInfo(this.props.navigation.state.params.bookIdx,this.props.navigation.state.params.mpCode);
            await this.getBookInfo(
                this.props.navigation.state.params.bookInfo.bookIdx,
                this.props.navigation.state.params.mpCode
            );
        }else{
            this.failCallAPi();
        }
        // case 2 : arrayData = [this.state.filelist.mp3Contents[this.pathHistory[0].index].children[this.pathHistory[1].index].children];break;
        

        if (Platform.OS === 'android') {
            this.androidStatusSetup(true);
        }

        this.checkMP3PlayerInstalled()
    }

    checkMP3PlayerInstalled = async() => {
        let scheme = 'mmplayer';
        AppInstalledChecker
            .checkURLScheme(scheme)
            .then((isInstalled) => {
                if(isInstalled) {
                    this.setState({ isInstalledMP3Player: true })
                } else {
                    this.setState({
                        isInstalledMP3Player: false,
                    }, function() {
                        this.checkExpireTime()
                    })
                }
            })

        //AsyncStorage.removeItem('mp3PopLayerExpireTime')
    }

    checkExpireTime = async() => {
        const TodayTimeStamp = moment().valueOf()

        const mp3PopLayerExpireTime  = await AsyncStorage.getItem('mp3PopLayerExpireTime');
        console.log('FreeMP3Detail.js > checkMP3PlayerInstalled()', 'mp3PopLayerExpireTime = ' + JSON.stringify(mp3PopLayerExpireTime))
        console.log('FreeMP3Detail.js > checkMP3PlayerInstalled()', 'TodayTimeStamp = ' + JSON.stringify(TodayTimeStamp))

        let isView = ( mp3PopLayerExpireTime === null || parseInt(mp3PopLayerExpireTime) < TodayTimeStamp ) ? true : false ;
        console.log('FreeMP3Detail.js > checkMP3PlayerInstalled()', 'isView = ' + isView)

        this.setState({
            popLayerView: isView,
        })
    }


    openAppStore = async() => {
        const playStoreId = DEFAULT_CONSTANTS.mp3playerAppStoreId;
        const appStoreId = DEFAULT_CONSTANTS.mp3playerAppStoreId;

        console.log('FreeMP3Screen.js > openAppStore()', 'playStoreId = ' + playStoreId)
        console.log('FreeMP3Screen.js > openAppStore()', 'appStoreId = ' + appStoreId)

        AppLink.openInStore({ appStoreId, playStoreId }).then(() => {

        })
    };

    componentDidMount() {        
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton2);
    }

    UNSAFE_componentWillUnmount() {
        
        
    }  
    
    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보
        
    }

    
    UNSAFE_componentWillReceiveProps(nextProps) {
        
        
    }
    
    androidStatusSetup = async(bool) => {          
        if (Platform.OS === "android") {                        
            StatusBar.setTranslucent(bool);
            StatusBar.setBackgroundColor("transparent");
            
        }
    }

    handleBackButton2 = () => {        
        this.props.navigation.goBack(null);
        if (Platform.OS === "android") {
            this.androidStatusSetup(true)
            StatusBar.setBackgroundColor("transparent");
        }
        return true;
    };

    failCallAPi = () => {
        const alerttoast = Toast.show('데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요');
        setTimeout(() => {
            Toast.hide(alerttoast);
            this.setState({                
                filelist : [],
                loading:false
            });
        }, 2000)
    }

    getBookInfo = async(bookIdx,mpCode) => {
        //console.log('bookIdx',bookIdx)
        //await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiTestDomain + '/v1/book/' + bookIdx + '/freeMP3/'+mpCode,{
        let aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        let aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey;

        console.log('FreeMP3Detail > getBookInfo()', 'url = ' + aPIsDomain + '/v1/book/' + bookIdx + '/freeMP3/' + mpCode)

        await CommonUtil.callAPI( aPIsDomain + '/v1/book/' + bookIdx + '/freeMP3/' + mpCode,{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': aPIsAuthKey
            }), 
                body:null
            }).then(response => {
            //console.log('FreeMP3Detail > getBookInfo()', 'response = ' + JSON.stringify(response))

                if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                    
                    if ( response.code !== '0000' ) {                    
                        this.failCallAPi()
                    }else{                        
                        this.setState({
                            loading : false,                            
                            filelist:response.data
                        })
                    }
                }else{                    
                    this.failCallAPi()
                }
                this.setState({loading:false})
            })
            .catch(err => {
                console.log('login error => ', err);               
                this.failCallAPi()
            });
    }


    _historyBack(){        
        this.props.navigation.goBack(null)
    }

    checkAll = () => {

    }
    goprevTabs = async() => {
        let newTabDepth = this.state.tabDepth-1;
        this.pathHistory.splice(newTabDepth, 1)
        this.setState({            
            tabDepth : newTabDepth,
            samplemp3list : [],
            tabViewMode : 'folder'
        });
        
    }

    goNextTabs = async(tData, index) => {

        let newTabDepth = this.state.tabDepth+1;
        if ( typeof this.pathHistory[this.state.tabDepth]  === 'undefined' ) {
            this.pathHistory.push({
                title : tData.title,
                hindex : index
            })
        }else{
            this.pathHistory[this.state.tabDepth].title = tData.title;
            this.pathHistory[this.state.tabDepth].hindex = index;
        }
        
        this.setState({            
            tabDepth : newTabDepth,
            tabViewMode : (typeof tData.children[0].type !== 'undefined' && tData.children[0].type === 'file') ? 'file' : tData.type
        });
        this.__ScrollView.scrollToEnd({ animated: true});
        //console.log('this.state.pathHistory ' , this.pathHistory);
       
    }

    fileDownload = () => {
        if ( this.state.downloadStatus === null ) {
            let task = RNBackgroundDownloader.download({
                id: 'file123',
                url: DEFAULT_CONSTANTS.apiMP3Domain + '/'+ this.state.filelist.zipUrl,
                destination: `${RNBackgroundDownloader.directories.documents}/`+this.state.filelist.zipUrl
            }).begin((expectedBytes) => {
                this.setState({downloadStatus : 'start'})
                this.ToastMessage('파일다운로드중...')
                //console.log(`Going to download ${expectedBytes} bytes!`);
            }).progress((percent) => {
                //console.log(`Downloaded: ${percent * 100}%`);
                this.setState({nowDownloadPercentage : percent*100})
            }).done(() => {
                //console.log('Download is done!');
                this.ToastMessage('파일다운로드가 완료되었습니다.')
                this.setState({downloadStatus : null})
            }).error((error) => {
                this.ToastMessage('파일다운로드에 실패하였습니다.')
                //console.log('Download canceled due to error: ', error);
            });
        }

    }

    ToastMessage = (message) => {
        const alerttoast2 = Toast.show(message);
        setTimeout(() => {
            Toast.hide(alerttoast2);            
        }, 2000)
    }

    setChecked = (title,url,mp3Idx,mode) => {

        let selectedFilterCodeList = this.state.samplemp3list;                  
        if ( mode === 'remove' ) { //제거            
            selectedFilterCodeList = selectedFilterCodeList.filter((info) => info.code !== mp3Idx);        
        }else{ //추가
            selectedFilterCodeList.push({title:title,code:mp3Idx,mp3Url:url});
        }
        return selectedFilterCodeList;
    }
    
    checkCartList = async(title,url,mp3Idx,mode) =>{
        let returnArray = await this.setChecked(title,url,mp3Idx,mode);                
        this.setState({samplemp3list: Array.from(new Set(returnArray))})

    }

    checkAll = async(arrayData,mode) => {
        if ( mode ) { //전체선택
            let selectedFilterCodeList = [];
            await arrayData.map((titem, index) => {
                selectedFilterCodeList.push({code:titem.mp3Idx})
            })
            this.setState({samplemp3list:selectedFilterCodeList});
        }else{
            this.setState({samplemp3list:[]});
        }
    }

    _closeModal = () => {
        this.setState({ showModal: false })
    };

    goDownLoadMP3Player = () => {
        const appStoreId = DEFAULT_CONSTANTS.mp3playerAppStoreId;
        AppLink.openInStore({ appStoreId}).then(() => {
            // do stuff
        })
        .catch((err) => {
        // handle error
        });

    }

    //여기서부터 다운로드
    share = async (mimeType, path) => {
        try {
          const options = {
            url: 'file://' + path,
            type: mimeType,
          };
          await Share.open(options);
        } catch (e) {
          console.log(e);
        }
      };
    
      mapMimeType = extension => {
        let mimeType = 'application/octet-stream';
        switch (extension) {
          case 'txt':  mimeType = 'text/plain'; break;
          case 'xml':  mimeType = 'application/xml'; break;
          case 'jpg':  mimeType = 'image/jpeg'; break;
          case 'jpeg': mimeType = 'image/jpeg'; break;
          case 'png':  mimeType = 'image/png'; break;
          case 'mp3':  mimeType = 'audio/mp3'; break;
          case 'mp4':  mimeType = 'video/mp4'; break;
          case 'avi':  mimeType = 'video/avi'; break;
          case 'wmv':  mimeType = 'video/x-ms-wmv'; break;
          case 'zip':  mimeType = 'application/zip'; break;
          case 'pdf':  mimeType = 'application/pdf'; break;
          case 'hwp':  mimeType = 'application/x-hwp'; break;
          case 'doc':  mimeType = 'application/msword'; break;
          case 'docx': mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; break;
          case 'xls':  mimeType = 'application/vnd.ms-excel'; break;
          case 'xlsx': mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; break;
          case 'ppt':  mimeType = 'application/vnd.ms-powerpoint'; break;
          case 'pptx': mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'; break;
        }
        return mimeType;
      };

    closePopLayer = (bool) => {
        this.setState({popLayerView : bool})
    }

    closePopLayerAndOpenStore = () => {
        this.setState({
            popLayerView: false
        }, function() {
            this.openAppStore()
        })
    }

    prepareToDownload = async () => {

        // 로그인 상태 :
        //     ㄴ 해커스 MP3 보유 : 해커스 MP3에서 다운로드 진행되어야 한다. ( 용량 확인 및 해커스 MP3 플레이어 이동 confirm창 노출 -> 해커스 MP3 플레이어에서 다운로드)
        // ㄴ 해커스 MP3 미보유 : 해커스 MP3 플레이어 다운로드 Alert 이 노출되어야 한다.

        // 비로그인 상태:
        //     ㄴ 해커스 MP3 보유 : 로그인 페이지 이동 되어야 하며, 로그인 후 해커스 MP3에서 다운로드 진행되어야 한다. ( 용량 확인 및 해커스 MP3 플레이어 이동 confirm창 노출 -> 해커스 MP3 플레이어에서 다운로드)
        // ㄴ 해커스 MP3 미보유 : 로그인 페이지 이동 되어야 하며, 해커스 MP3 플레이어 다운로드 Alert 이 노출되어야 한다.


        const isLogin = await CommonUtil.isLoginCheck();

        if(isLogin === true) {
            this.setState({
                memberIdx: await CommonUtil.getMemberIdx()
            })
            let scheme = 'mmplayer';
            AppInstalledChecker
                .checkURLScheme(scheme)
                .then((isInstalled) => {
                    if(isInstalled) {
                        this.checkAuth(
                            this.props.navigation.state.params.bookInfo.bookIdx,
                            this.props.navigation.state.params.mpCode,
                            this.props.navigation.state.params.fileIdx
                        )
                    } else {
                        Alert.alert('', '해커스 MP3 플레이어 설치가 필요합니다. 스토어로 이동하시겠습니까?', [
                            {text: '확인', onPress: () => {
                                    this.openAppStore()
                                }},
                            {text: '취소'}
                        ], {cancelable: false});
                    }
                })
        } else {
            Alert.alert('', '로그인이 필요합니다.', [
                {text: '로그인', onPress: () => {
                        this.props.navigation.navigate('SignInScreen');
                    }},
                {text: '취소'}
            ], {cancelable: false});
        }
    }

    checkAuth = async(bookIdx, mpCode, fileIdx) => {
        let aPIsDomain = typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        let aPIsAuthKey = typeof this.props.myInterestCodeOne.info.apiKey !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey

        const url = aPIsDomain + '/v1/book/' + bookIdx + '/freeFiles/' + fileIdx + '/' + this.state.memberIdx;
        const config = {
            method: 'GET',
            headers: new Headers({
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': aPIsAuthKey
            })
        }

        console.log('FreeMP3Detail.js > checkAuth()', 'url = ' + url)

        await CommonUtil.callAPI(url, config)
            .then(response => {
                console.log('FreeMP3Detail.js > checkAuth()', 'response = ' + JSON.stringify(response))

                if (response && response.code === '0000') {
                    const certResult = response.data.certResult

                    if(certResult) {
                        this.getIntentUrl(bookIdx, mpCode, fileIdx)
                    } else {
                        Alert.alert('', '자료 다운로드를 위해서 인증이 필요합니다.\n' +
                            'PC 또는 모바일 웹에서 ' +
                            '인증을 진행해주세요.',
                            [
                                {text: '확인', onPress: () => {}},
                            ]);
                    }
                } else {
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('인증 확인에 실패 했습니다.');
                }
            })
            .catch(error => {
                console.log('FreeMP3Detail.js > checkAuth()', 'error = ' + error)

                console.log('getContentList()', 'error = ' + JSON.stringify(error) )
                Toast.show('시스템 에러: 인증 확인에 실패 했습니다.');
            });
    }

    openApp = url => {
        CommonUtil.openApp(url, '', DEFAULT_CONSTANTS.mp3playerAppStoreId, 'KO', DEFAULT_CONSTANTS.mp3playerAppStoreId);
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

    getIntentUrl = async(bookIdx, mpCode, fileIdx) => {
        let aPIsDomain = typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        let aPIsAuthKey = typeof this.props.myInterestCodeOne.info.apiKey !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey

        const memberID = await CommonUtil.getMemberID();

        const url = aPIsDomain + '/v1/book/' + bookIdx + '/intentURL/' + mpCode
                        + '?memberIdx=' + this.state.memberIdx
                        + '&userId=' + memberID
                        + '&os=' + Platform.OS.toLowerCase()

        console.log('FreeMP3Detail.js > getIntentUrl()', 'url = ' + url)

        const config = {
            method: 'GET',
            headers: new Headers({
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': aPIsAuthKey
            })
        }

        console.log('FreeMP3Detail.js > getIntentUrl()', 'url = ' + url)

        await CommonUtil.callAPI(url, config)
            .then(response => {
                console.log('FreeMP3Detail.js > getIntentUrl()', 'response = ' + JSON.stringify(response))

                if (response && response.code === '0000') {
                    const intentURL = response.data.intentURL
                    const fileSize = response.data.fileSize
                    //const fileSize = 30 * 1024 * 1024

                    Alert.alert('', fileSize + ' 이상의 저장 공간이 사용됩니다. 다운로드 받으시겠습니까?' ,
                        [
                            {text: '확인', onPress: () => {this.openApp(intentURL)}},
                            {text: '취소'}
                        ]);
                } else {
                    response.message
                    ? Toast.show(response.message)
                    : Toast.show('P3 다운로드 설정에 실패 했습니다.');
                }
            })
            .catch(error => {
                console.log('FreeMP3Detail.js > checkAuth()', 'error = ' + error)

                console.log('getContentList()', 'error = ' + JSON.stringify(error) )
                Toast.show('시스템 에러: MP3 다운로드 설정에 실패 했습니다.');
            });


    }

    renderPopLayer = () => {
        return(
            <Overlay
                isVisible={this.state.popLayerView}
                windowBackgroundColor="rgba(0, 0, 0, 0.8)"
                overlayBackgroundColor="tranparent"
                containerStyle={{margin:0}}
            >
                <MP3DownPopLayer screenState={this.state} />
            </Overlay>
        )
    }

      // 파일 다운로드 시작 전 체크
      tmpPrepareToDownload = async () => {

        if ( this.state.filelist.zipUrl !== null ) {
            let base64 = require('base-64');
            const filePath = DEFAULT_CONSTANTS.apiMP3Domain + '/' + this.state.filelist.zipUrl;
            //console.log("filePath " + filePath);
            let sumFileSize = 0;
            await RNFetchBlob.fs.readFile(filePath, 'base64')
                .then((data) => {                    
                    var decodedData = base64.decode(data);
                    sumFileSize = ecodedData.length; 
                    /*
                    var bytes=decodedData.length;
                    if(bytes < 1024) console.log(bytes + " Bytes");
                    else if(bytes < 1048576) console.log("KB:"+(bytes / 1024).toFixed(3) + " KB");
                    else if(bytes < 1073741824) console.log("MB:"+(bytes / 1048576).toFixed(2) + " MB");
                    else console.log((bytes / 1073741824).toFixed(3) + " GB");
                    */
                })
                      
            /*
            sumFileSize = 52402954; //46949881344;
            await RNFS.getFSInfo().then(info => {
                console.log("Free Space is " + info.freeSpace + " Bytes");
                console.log("Free Space is " + info.freeSpace / 1024 + " KB");
                if (sumFileSize > info.freeSpace) {
                    Alert.alert('', '디바이스 내 저장 공간이 부족합니다.');
                    return;
                } else {
                    Alert.alert('', parseInt(sumFileSize/1024/1024)+'MB 이상의 저장 공간이 필요합니다.\n가입하신 요금제에 따라\n데이터 요금이 부과될 수 있으니,\nWi-Fi 환경에서 이용하시길 권해드립니다.',
                        [{
                            text: '확인',
                            onPress: () => {
                                this.requestWriteStoragePermission();
                            },
                        },
                        {
                            text: '취소',
                            onPress: () => {
                                return;
                        },
                        }]
                    );
                }
            });
            */
        }
      };
    
        // 권한 체크
        requestWriteStoragePermission = async () => {
            try {
                if (Platform.OS === 'android') {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    );

                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        this.downloadFile();
                    } else {
                        console.log('Camera permission denied');
                    }
                } else {
                    this.downloadFile();
                }
            } catch (err) {
                console.warn(err);
            }
        };
    
    downloadFile = lectureNo => {
        
        const selectFile = DEFAULT_CONSTANTS.apiMP3Domain + '/' + this.state.filelist.zipUrl;//'https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_1280_10MG.mp4';
        const fileExt = 'zip';
        const fileName =  this.state.filelist.zipUrl;
    
        this.forceUpdate();
    
        let config;
        if (Platform.OS === 'android') {
          config = {
            addAndroidDownloads: {
              title: fileName,
              overwrite: true,
              useDownloadManager: true,
              mediaScannable: true,
              notification: true,
              //description: '해커스 통합앱',
              //path: `${RNBackgroundDownloader.directories.documents}/` + fileName,
              path: RNFetchBlob.fs.dirs.DownloadDir + '/' + fileName,
              //path: RNFS.ExternalDirectoryPath + '/' + fileName,
              mime: this.mapMimeType(fileExt),
            },
            fileCache: false,
            //path: `${RNBackgroundDownloader.directories.downloads}` + fileName,
            //appendExt: appendExt,
            trusty: true,
          };
        } else {
          config = {
            fileCache: false,
            path: `${RNBackgroundDownloader.directories.documents}/` + fileName,
            appendExt: fileExt,
            trusty: true,
          };
        }
    
        RNFetchBlob.config(config)
        .fetch('GET', selectFile)
        .progress((received, total) => {
            //console.log('progress', 'received : total = ' + received + ' : ' + total);
            //lec.downloadPercent = parseInt((received / total) * 100);
            this.forceUpdate();
        })
        .then(res => {
            let status = res.info().status;
            //lec.downloadPercent = 100;
            //lec.state = STATE_DOWNLOAD_COMPLETE;
            //lec.localFilePath = res.path();            
            this.forceUpdate();

            if (Platform.OS === 'ios') {
                this.share(this.mapMimeType(fileExt), res.path());
            }
        })
        .catch(err => {
            console.log('RNFetchBlob', err);
        });
        // });
      };

    
    render() {
        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        }else {
            let arrayData = [];
            //console.log('arrayData top', this.state.filelist.mp3Contents[this.state.nowIndex]);
            
            if ( this.state.tabDepth > 0 ){
                console.log('FreeMP3Detail > render()', 'this.state.tabDepth = ' + this.state.tabDepth)

                switch(this.state.tabDepth ) {                    
                    case 1 : 
                        arrayData = this.state.filelist.mp3Contents[this.pathHistory[0].hindex].children;break;
                    case 2 : 
                        arrayData = this.state.filelist.mp3Contents[this.pathHistory[0].hindex].children[this.pathHistory[1].hindex].children;break;
                    case 3 : 
                        arrayData = this.state.filelist.mp3Contents[this.pathHistory[0].hindex].children[this.pathHistory[1].hindex].children[this.pathHistory[2].hindex].children;break;
                    case 4 : 
                        arrayData = this.state.filelist.mp3Contents[this.pathHistory[0].hindex].children[this.pathHistory[1].hindex].children[this.pathHistory[2].hindex].children[this.pathHistory[3].hindex].children;break;
                    case 5 : 
                        arrayData = this.state.filelist.mp3Contents[this.pathHistory[0].hindex].children[this.pathHistory[1].hindex].children[this.pathHistory[2].hindex].children[this.pathHistory[3].hindex].children[this.pathHistory[4].hindex].children;break;
                    case 6 : 
                        arrayData = this.state.filelist.mp3Contents[this.pathHistory[0].hindex].children[this.pathHistory[1].hindex].children[this.pathHistory[2].hindex].children[this.pathHistory[3].hindex].children[this.pathHistory[4].hindex].children[this.pathHistory[5].hindex].children;break;
                    case 7 : 
                        arrayData = this.state.filelist.mp3Contents[this.pathHistory[0].hindex].children[this.pathHistory[1].hindex].children[this.pathHistory[2].hindex].children[this.pathHistory[3].hindex].children[this.pathHistory[4].hindex].children[this.pathHistory[5].hindex].children[this.pathHistory[6].hindex].children;break;                        
                    default : 
                        arrayData = this.state.filelist.mp3Contents[this.pathHistory[0].hindex].children;break;
                       
                }
                
            }else{
                arrayData = this.state.filelist.mp3Contents;
                //console.log('FreeMP3Detail.js > render()', 'this.state.tabDepth = ' + this.state.tabDepth)
                //console.log('FreeMP3Detail.js > render()', 'arrayData = ' + JSON.stringify(this.state.filelist.mp3Contents))
            }
    
            return(
                <View style={ styles.container }>
                    { 
                     Platform.OS === 'android' && <StatusBar barStyle={"dark-content"} backgroundColor={'transparent'} animated={true} hidden={false}/>
                    }
                    <NavigationEvents                        
                        onWillBlur={payload => {                            
                            if (Platform.OS === "android") {
                                StatusBar.setBackgroundColor("transparent");                                
                            }
                            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton2);        
                        }}
                    />
                   
                    <Modal
                        onRequestClose={() => {
                            this.setState({showModal:false})
                        }}
                        onBackdropPress={() => {
                            this.setState({showModal:false})
                        }}                        
                        style={{justifyContent: 'flex-end',margin: 0}}
                        useNativeDriver={true}
                        animationInTiming={300}
                        animationOutTiming={300}
                        hideModalContentWhileAnimating  
                        isVisible={this.state.showModal}
                    >
                        
                        <View style={[styles.modalContainer,{ height: SCREEN_HEIGHT * 0.7 }]}>
                            <SampleListening screenState={this.state} />
                        </View>
                        
                    </Modal>
                    
                    <ParallaxScrollView
                        windowHeight={SCREEN_HEIGHT * 0.35}
                        backgroundSource={this.state.bannerurl.toString()}
                        navBarHeight={Platform.OS === 'android' ? 55 :  CommonFuncion.isIphoneX() ? 85 : 75}
                        navBarColor={'#ff0000'}
                        navBarTitle=''
                        navBarView={false}
                        lectureName={this.state.bookInfo.title}
                        textbookTitle=''
                        markImage='../../../assets/icons/icon_mp_title.png'
                        leftIcon={{name: 'left', color: '#fff', size: 20, type: 'font-awesome'}}
                        centerTitle={'무료MP3'}
                        leftIconOnPress={()=>this._historyBack()}
                        rightIcon={null}                    
                        >
                        <View style={{width:SCREEN_WIDTH,height:'100%',backgroundColor: '#fff)'}}>
                            <ScrollView ref={(ref) => {
                                    this._ScrollView = ref;
                                }}>
                                <View style={{marginVertical:20,paddingTop:20}}>
                                    <View style={{paddingVertical:10,flexDirection:'row',borderWidth:1,borderColor:DEFAULT_COLOR.base_color_ccc,marginHorizontal:20,borderRadius:5}}>
                                        <View style={{flex:1,alignItems:'center'}}>                                    
                                            <TouchableOpacity 
                                                style={{flex:1,flexDirection:'row',alignItems:'center'}} 
                                                //onPress={() => this.fileDownload()}
                                                onPress={()=>this.prepareToDownload()}
                                            >
                                                <Icon name="download" size={15} color={DEFAULT_COLOR.base_color_222} />
                                                <CustomTextM style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:0.8}}> 
                                                    {" "}전체다운로드
                                                </CustomTextM>
                                            </TouchableOpacity>
                                        </View>                                
                                    </View>
                                </View>                                
                                <View                                  
                                    style={{flex:1,flexDirection:'row',backgroundColor:DEFAULT_COLOR.input_bg_color,borderTopColor:DEFAULT_COLOR.input_border_color,borderTopWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1,overflow:'hidden'}}>
                                    <ScrollView 
                                        horizontal={true}                            
                                        ref={(ref) => {
                                            this.__ScrollView = ref;
                                        }}
                                        nestedScrollEnabled={true}
                                    >
                                        <View style={{paddingVertical:15,paddingLeft:20,paddingRight:50,flexDirection:'row',flexGrow:1}}>
                                            <CustomTextR style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:0.8}}> 
                                                {this.state.filelist.zipUrl}
                                            </CustomTextR>
                                            {
                                                this.pathHistory.map((nav,navindex) => {
                                                    return (
                                                        <CustomTextR style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:0.8}}> 
                                                           {" "}▶{" "}{nav.title}
                                                        </CustomTextR>
                                                    )
                                                })
                                            }
                                        </View>
                                                                           
                                    </ScrollView>
                                    {this.state.tabDepth > 0 &&
                                            <TouchableOpacity 
                                                onPress={()=> this.goprevTabs()}
                                                style={{position:'absolute',right:0,top:1,width:44,height:48,padding:10,zIndex:2,backgroundColor:DEFAULT_COLOR.input_bg_color,justifyContent:'center'}}>
                                                {/*<Icon name="back" size={15} color={DEFAULT_COLOR.base_color_222} /> */}
                                                <Image 
                                                    source={require('../../../assets/icons/btn_back_list.png')} 
                                                    resizeMode='contain'
                                                    style={{width:17,height:17}}
                                                />
                                            </TouchableOpacity>
                                        } 
                                </View>
                                
                                { this.state.tabViewMode === 'file' &&
                                    <View style={{flex:1,paddingHorizontal:10,marginTop:10}}>
                                        {this.state.samplemp3list.length > 0 
                                        ?
                                        <TouchableOpacity 
                                            onPress={() => this.checkAll(arrayData,false)}
                                            style={{flex:1,flexDirection:'row',paddingVertical:15,flexGrow:1,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.base_color_222}}
                                        >       
                                            <Icon name="check" size={15} color={DEFAULT_COLOR.lecture_base} /> 
                                            <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:0.7}}>
                                                {"  "}선택해제
                                            </CustomTextR>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity 
                                            onPress={() => this.checkAll(arrayData,true)}
                                            style={{flex:1,flexDirection:'row',paddingVertical:15,flexGrow:1,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.base_color_222}}
                                        >       
                                            <Icon name="check" size={15} color={DEFAULT_COLOR.lecture_base} /> 
                                            <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:0.7}}>
                                                {"  "}전체선택
                                            </CustomTextR>
                                        </TouchableOpacity>
                                        }
                                        
                                    </View>
                                }
                                
                                <View style={{marginTop:10,minHeight:SCREEN_HEIGHT*0.7}}>
                                    <View style={{flex:1}}>
                                        {
                                        arrayData.map((titem, index) => {    
                                            if ( titem.type === 'file')  {
                                                let indexName = index < 10 ? '0'+(index+1) : index+1;
                                                var isIndexOf = this.state.samplemp3list.findIndex(
                                                    info => info.code === titem.mp3Idx
                                                );  
                                                return(                           
                                                    <View style={ isIndexOf != -1 ? styles.itemWrap2:styles.itemWrap} key={index}>                                
                                                        <TouchableOpacity 
                                                            onPress= {()=> this.checkCartList(titem.title,titem.url,titem.mp3Idx,isIndexOf != -1 ? 'remove' : null)}
                                                            style={{flex:10,flexDirection:'row',flexGrow:1,paddingHorizontal:10}}
                                                        >
                                                            <CustomTextR 
                                                                numberOfLines={1} ellipsizeMode = 'tail'
                                                                style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:0.65}}
                                                            >
                                                                {indexName}{" "} {titem.title}
                                                            </CustomTextR>
                                                            <View style={{position:'absolute',right:5,top:0,width:17,height:17}}>
                                                                <Icon name="playcircleo" size={17} color={DEFAULT_COLOR.base_color_222} /> 
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            }else{
                                                return(                           
                                                    <View style={styles.itemWrap} key={index}>                                
                                                        <View style={{flex:10,flexDirection:'row',flexGrow:1,paddingHorizontal:10}}>
                                                            <Icon name="folder1" size={15} color={DEFAULT_COLOR.base_color_222} /> 
                                                            <CustomTextR 
                                                                numberOfLines={1} ellipsizeMode = 'tail'
                                                                style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:0.65}}
                                                            >{" "} {titem.title}
                                                            </CustomTextR>
                                                        </View>
                                                        {titem.children &&
                                                        <TouchableOpacity 
                                                            onPress= {()=> this.goNextTabs(titem, index)}                              
                                                            style={{flex:1,alignItems:'flex-end',justifyContent:'center',paddingRight:10}}>
                                                            <Icon name={'right'} size={20} color={DEFAULT_COLOR.base_color_ccc} />
                                                        </TouchableOpacity>           
                                                        }                                     
                                                    </View>
                                                )
                                            }
                                            
                                        })
                                        }
                                    </View>

                                </View>
                            </ScrollView>
                            {
                            !this.state.isInstalledMP3Player && 
                            <TouchableOpacity 
                                onPress={()=>this.openAppStore()}
                                style={{marginTop:20,position:'absolute',left:0,bottom:0,width:SCREEN_WIDTH,justifyContent:'flex-end'}}>
                                <AutoHeightImage
                                    source={require('../../../assets/images/img_banner_1440_x_240.png')}
                                    resizeMode='cover'
                                    width={SCREEN_WIDTH}
                                />
                            </TouchableOpacity>  
                            }
                        </View>
                    </ParallaxScrollView>
                    {
                        this.state.samplemp3list.length > 0 &&
                        <TouchableOpacity 
                            onPress={()=>this.setState({showModal:true})}
                            style={{zIndex:3,position:'absolute',left:0,bottom:0,height:Platform.OS === 'android' ? 50 :  CommonFuncion.isIphoneX() ? 60 : 50,width:SCREEN_WIDTH,backgroundColor:DEFAULT_COLOR.lecture_base,borderTopColor:DEFAULT_COLOR.input_border_color,borderTopWidth:1,justifyContent:'center',alignItems:'center',flexDirection:'row',flexGrow:1}}
                        >
                            <Image source={require('../../../assets/icons/icon_playlist.png')} resizeMode='contain' style={{width:15,height:15}} />
                            <CustomTextB style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),paddingLeft:10}}>재생하기</CustomTextB>
                            <View style={{height:20,paddingHorizontal:10,borderRadius:15,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'}}>
                                <CustomTextB style={{color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingLeft:10}}>+{this.state.samplemp3list.length}</CustomTextB>
                            </View>
                        </TouchableOpacity>
                    }
                    {
                    this.state.downloadStatus && 
                    <View style={{zIndex:3,position:'absolute',left:0,bottom:0,height:50,width:SCREEN_WIDTH,backgroundColor:'#fff',borderTopColor:DEFAULT_COLOR.input_border_color,borderTopWidth:1,justifyContent:'center',alignItems:'center'}}>
                        <View
                            style={{width: this.state.nowDownloadPercentage > 0 ? this.state.nowDownloadPercentage/this.state.nowDownloadPercentage*100+'%' : 0,height: '100%',position: 'absolute',backgroundColor:DEFAULT_COLOR.lecture_base}}>
                                
                        </View>
                        <CustomTextB style={{color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingLeft:10}}>다운로드</CustomTextB>
                    </View>
                    }

                    { this.renderPopLayer() }
                </View>
            );
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemWrap : {        
        flexDirection:'row',                
        paddingVertical:15,
        borderBottomWidth:1,
        borderBottomColor:DEFAULT_COLOR.input_border_color
    },
    itemWrap2 : {        
        flexDirection:'row',                
        paddingVertical:15,
        borderBottomWidth:1,
        backgroundColor : DEFAULT_COLOR.input_bg_color,
        borderBottomColor:DEFAULT_COLOR.input_border_color
    },

    /**** Modal  *******/
    modalContainer: {
        marginTop:SCREEN_HEIGHT*0.3,
        paddingTop: 16, 
        backgroundColor: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8
    },
    sampletitle: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop: 30,
        padding: 20,
        textAlign: 'center',
        backgroundColor: 'rgba(240,240,240,1)',
    },
    samplebutton: {
        fontSize: 20,
        backgroundColor: 'rgba(220,220,220,1)',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(80,80,80,0.5)',
        overflow: 'hidden',
        padding: 7,
    },
    sampleheader: {
        textAlign: 'left',
    },
    samplefeature: {
        flexDirection: 'row',
        padding: 10,
        alignSelf: 'stretch',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgb(180,180,180)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(230,230,230)',
    },
    samplefeature2: {
        flexDirection: 'row',    
        //padding:10,
        alignSelf: 'stretch',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgb(180,180,180)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(230,230,230)',
    },
    Rootcontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    }
});

function mapStateToProps(state) {
    return {       
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
    };
}

export default connect(mapStateToProps, null)(FreeMP3Detail);
