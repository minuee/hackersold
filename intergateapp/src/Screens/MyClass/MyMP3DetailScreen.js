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
    Alert,
    PermissionsAndroid,
    Animated,
} from 'react-native';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import AppLink from '../../Utils/AppLink';

import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
const RNFS = require('react-native-fs');

// import ParallaxScrollView from '../../Utils/ParallaxScroll/ParallaxScrollView';
// import ParallaxScrollView from '../TextBook/ParallaxScrollView';
import ParallaxScrollView from './ParallaxScrollView';
import Toast from 'react-native-tiny-toast';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
//공통상수
import COMMON_STATES, {SERVICES} from '../../Constants/Common';
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextB, CustomText, CustomTextR, CustomTextM, TextRobotoB} from '../../Style/CustomText';

const SendIntentAndroid = require("react-native-send-intent");
import SampleListening from "../TextBook/SampleListening"; // tabs 02 샘플듣기

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

const STATE_DOWNLOAD_READY = undefined;
const STATE_DOWNLOAD_PROGRESS = 'progress';
const STATE_DOWNLOAD_COMPLETE = 'complete';

const sampleData = {
            "zipUrl": "Hackers_Toeic_700_Shadowing.zip",
            "mp3Contents": [
                {
                    "type": "folder",
                    "path": "shadowing",
                    "title": "받아쓰기_DAY01",
                    "children": [{
                        "type": "folder",
                        "title": "받아쓰기_DAY01_01",
                        "children": [{
                            "type": "file",
                            "title": "받아쓰기_DAY01.mp3",
                            "mp3Idx": "80168",
                            "url": "https://cdnmp3.hackers.com/mp3/Hackers_Toeic_700_Shadowing%2Fshadowing%2F%EB%B0%9B%EC%95%84%EC%93%B0%EA%B8%B0_DAY01.mp3?e=1584693983&h=553152a0e25da0c5ee6f6c60158bb988"
                        },
                        {
                            "type": "file",
                            "title": "받아쓰기_DAY02.mp3",
                            "mp3Idx": "80167",
                            "url": "https://cdnmp3.hackers.com/mp3/Hackers_Toeic_700_Shadowing%2Fshadowing%2F%EB%B0%9B%EC%95%84%EC%93%B0%EA%B8%B0_DAY01.mp3?e=1584693983&h=553152a0e25da0c5ee6f6c60158bb988"
                        }
                        ]
                    }]
                },
                {
                    "type": "folder",
                    "path": "shadowing",
                    "title": "받아쓰기_DAY02",
                    "children": [{
                        "type": "file",
                        "title": "받아쓰기_DAY02.mp3",
                        "mp3Idx": "80169",
                        "url": "https://cdnmp3.hackers.com/mp3/Hackers_Toeic_700_Shadowing%2Fshadowing%2F%EB%B0%9B%EC%95%84%EC%93%B0%EA%B8%B0_DAY02.mp3?e=1584693983&h=5f7a079eb9476744c753d92e152151a6"
                    }]
                },
            ]
       
}

class MyMP3DetailScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            tabDepth: 0,
            tabViewMode: 'folder',
            downloadStatus: null,
            nowDownloadPercentage: 0,
            bookInfo: this.props.navigation.state.params.bookInfo,
            baseBookInfo: this.props.navigation.state.params.bookInfo,
            bannerurl: this.props.navigation.state.params.bannerurl,
            isInstalledMP3Player: false,
            showBottomBar: false,
            filelist: [
                {
                    zipUrl: null,
                    certResult: false,
                    mp3Contents: [],
                },
            ],
            showModal: false,
            samplemp3list: [],
            _closeModal: this._closeModal.bind(this),
        };

        this.pathHistory = new Array();
    }

    static navigationOptions = {
        header: null,
    };

    async UNSAFE_componentWillMount() {
        if (this.props.navigation.state.params.bookInfo.bookIdx && this.props.navigation.state.params.mpCode) {
            //this.getBookInfo(this.props.navigation.state.params.bookIdx,this.props.navigation.state.params.mpCode);
            // await this.getBookInfo(80169);
            await this.getBookInfo(this.props.navigation.state.params.mpCode);
        } else {
            this.failCallAPi();
        }
        // case 2 : arrayData = [this.state.filelist.mp3Contents[this.pathHistory[0].index].children[this.pathHistory[1].index].children];break;

        if (Platform.OS === 'android') {
            SendIntentAndroid.isAppInstalled(DEFAULT_CONSTANTS.mp3playerplayStoreId)
            .then(isInstalled => {
                this.setState({isInstalledMP3Player: isInstalled});
            });
        }
    }

    failCallAPi = msg => {
        const toastMsg = msg || '데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요';
        const alerttoast = Toast.show(toastMsg);
        setTimeout(() => {
            Toast.hide(alerttoast);
            this.setState({
                filelist: [],
                loading: false,
            });
        }, 2000);
    }

    getBookInfo = async mpCode => {
        //console.log('bookIdx',bookIdx)
        //await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiTestDomain + '/v1/book/' + bookIdx + '/freeMP3/'+mpCode,{
        const memberIdx = await CommonUtil.getMemberIdx();
        // const aPIsDomain = !CommonUtil.isEmpty(this.props.myInterestCodeOne) && typeof this.props.myInterestCodeOne.info.ApiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.ApiDomain : DEFAULT_CONSTANTS.apiTestDomain
        const url = SERVICES[this.props.myClassServiceID].apiDomain + '/v1/myClass/mp3/index/' + memberIdx + '/' + mpCode;
        // const url = aPIsDomain + '/v1/book/371/freeMP3/90077';
        // const url = 'https://tchamp.hackers.com/v1/myClass/mp3/index/5104881/90165';
        // const url = 'https://tchamp.hackers.com/v1/book/371/freeMP3/90077';
        // const url = 'https://tchamp.hackers.com/v1/myClass/mp3/index/7014851/90077';
        const options = {
            method: 'GET',
            headers: {
              ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
            },
          };
        await CommonUtil.callAPI(url, options, 10000)
            .then(response => {
                if (response && typeof response === 'object' || Array.isArray(response) === false) {
                    if (response.code !== '0000') {
                        this.failCallAPi();
                    } else {
                        // console.log('response.data222', response.data);
                        this.setState({
                            loading: false,
                            filelist: response.data,
                        });
                    }
                } else {
                    this.failCallAPi();
                }
                this.setState({loading: false});
            })
            .catch(err => {
                console.log('login error => ', err);
                this.failCallAPi();
            });
    };

    _historyBack() {
        this.props.navigation.goBack(null);
    }

    goprevTabs = async () => {
        let newTabDepth = this.state.tabDepth - 1;
        this.pathHistory.splice(newTabDepth, 1);
        this.setState({
            tabDepth: newTabDepth,
            samplemp3list: [],
            tabViewMode: 'folder',
        });
    };

    goNextTabs = async (tData, index) => {
        let newTabDepth = this.state.tabDepth + 1;
        console.log( 'tData.childrentData.children ', tData);

        if (typeof this.pathHistory[this.state.tabDepth]  === 'undefined') {
            this.pathHistory.push({
                title: tData.title,
                hindex: index,
            })
        } else {
            this.pathHistory[this.state.tabDepth].title = tData.title;
            this.pathHistory[this.state.tabDepth].hindex = index;
        }

        this.setState({
            tabDepth: newTabDepth,
            tabViewMode: (typeof tData.children[0].type !== 'undefined' && tData.children[0].type === 'file') ? 'file' : tData.type,
        });
        this.__ScrollView.scrollToEnd({animated: true});
        //console.log('this.state.pathHistory ' , this.pathHistory);
    };

    fileDownload = () => {
        if (this.state.downloadStatus === null) {
            let task = RNBackgroundDownloader.download({
                id: 'file123',
                url: DEFAULT_CONSTANTS.apiMP3Domain + '/'+ this.state.filelist.zipUrl,
                destination: `${RNBackgroundDownloader.directories.documents}/`+this.state.filelist.zipUrl
            })
                .begin(expectedBytes => {
                    this.setState({downloadStatus: 'start'});
                    this.ToastMessage('파일다운로드중...')
                    //console.log(`Going to download ${expectedBytes} bytes!`);
                })
                .progress(percent => {
                    //console.log(`Downloaded: ${percent * 100}%`);
                    this.setState({nowDownloadPercentage: percent*100});
                })
                .done(() => {
                    //console.log('Download is done!');
                    this.ToastMessage('파일다운로드가 완료되었습니다.');
                    this.setState({downloadStatus : null});
                })
                .error(error => {
                    this.ToastMessage('파일다운로드에 실패하였습니다.');
                    //console.log('Download canceled due to error: ', error);
                });
        }
    };

    ToastMessage = (message) => {
        const alerttoast2 = Toast.show(message);
        setTimeout(() => {
            Toast.hide(alerttoast2);
        }, 2000);
    };

    setChecked = (title,url,mp3Idx,mode) => {
        let selectedFilterCodeList = this.state.samplemp3list;
        if ( mode === 'remove' ) { //제거
            selectedFilterCodeList = selectedFilterCodeList.filter((info) => info.code !== mp3Idx);        
        } else {
            //추가
            selectedFilterCodeList.push({title:title,code:mp3Idx,mp3Url:url});
        }
        return selectedFilterCodeList;
    }

    checkCartList = async(title,url,mp3Idx,mode) =>{
        returnArray = await this.setChecked(title,url,mp3Idx,mode);                
        // 중복제거
        
        this.setState({samplemp3list: Array.from(new Set(returnArray))})
        console.log('this.samplemp3list',this.state.samplemp3list)
    };

    checkAll = async (arrayData, mode) => {
        if ( mode ) { //전체선택
            let selectedFilterCodeList = [];
            await arrayData.map((titem, index) => {
                selectedFilterCodeList.push({code:titem.mp3Idx})
            })
            this.setState({samplemp3list:selectedFilterCodeList});
        } else {
            this.setState({samplemp3list:[]});
        }
    };

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

    };

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

    // 파일 다운로드 시작 전 체크
    prepareToDownload = async () => {
        if ( this.state.filelist.zipUrl !== null ) {
            let base64 = require('base-64');
            const filePath = DEFAULT_CONSTANTS.apiMP3Domain + '/' + this.state.filelist.zipUrl;
            console.log("filePath " + filePath);
            let sumFileSize = 0;
            await RNFetchBlob.fs.readFile(filePath, 'base64').then(data => {
                console.log('dddd',data)
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
            console.log('progress', 'received : total = ' + received + ' : ' + total);
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

    openApp = url => {
        CommonUtil.openApp(url, '', DEFAULT_CONSTANTS.mp3playerAppStoreId, 'KO', DEFAULT_CONSTANTS.mp3playerAppStoreId);
    };

    // MP3 다운로드 체크
    checkMP3Download = () => {
        if (this.state.bookInfo.certResult) {
            if (!CommonUtil.isEmpty(this.state.filelist.intentURL)) {
                this.openApp(this.state.filelist.intentURL);
            } else {
                this.requestIntentURL();
            }
        } else {
            Alert.alert('', '자료 다운로드를 위해서 인증이 필요합니다.\nPC 또는 모바일 웹에서\n인증을 진행해주세요.\n다운로드 하시겠습니까?', [
                {text: '확인', onPress: () => this.getCertificationResult()},
                {text: '취소', onPress: () => console.log('다운로드 취소')},
            ]);
            return;
        }
    };

    // 무료자료 인증 결과 조회
    getCertificationResult = async () => {
        const memberIdx = await CommonUtil.getMemberIdx();
        const url = SERVICES[this.props.myClassServiceID].apiDomain + '/v1/book/' + this.state.bookInfo.bookIdx + '/freeFiles/' + this.state.bookInfo.fileIdx + '/' + memberIdx;
        const options = {
            method: 'GET',
            headers: {
              ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
            },
          };
        await CommonUtil.callAPI(url, options, 10000)
            .then(response => {
                if (response && typeof response === 'object' || Array.isArray(response) === false) {
                    if (response.code !== '0000') {
                        this.failCallAPi(response.message);
                    } else {
                        this.requestIntentURL();
                    }
                } else {
                    this.failCallAPi('자료 다운로드를 위해서 인증이 필요합니다.\nPC 또는 모바일 웹에서\n인증을 진행해주세요.');
                }
                this.setState({loading: false});
            })
            .catch(err => {
                console.log('login error => ', err);
                this.failCallAPi();
            });
    };

    // intentURL 요청
    requestIntentURL = async () => {
        const userInfo = await CommonUtil.getUserInfo();
        const params = {
            memberIdx: userInfo.memberIdx,
            userId: userInfo.memberID,
            os: Platform.OS.toLowerCase(),
        };
        const url = SERVICES[this.props.myClassServiceID].apiDomain + '/v1/book/' + this.state.bookInfo.bookIdx + '/intentURL/' + this.state.bookInfo.mpCode + '?' + CommonUtil.objectToParamString(params);
        const options = {
            method: 'GET',
            headers: {
              ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
            },
          };
        await CommonUtil.callAPI(url, options, 10000)
            .then(response => {
                if (response && typeof response === 'object' || Array.isArray(response) === false) {
                    if (response.code !== '0000') {
                        this.failCallAPi(response.message);
                    } else {
                        if (CommonUtil.isEmpty(response.data.intentURL)) {
                            this.failCallAPi();
                        } else {
                            this.openApp(response.data.intentURL);
                        }
                    }
                } else {
                    this.failCallAPi();
                }
                this.setState({loading: false});
            })
            .catch(err => {
                console.log('login error => ', err);
                this.failCallAPi();
            });
    };

    render() {
        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            );
        } else {
            let arrayData = [];
            //console.log('arrayData top', this.state.filelist.mp3Contents[this.state.nowIndex]);
            if (this.state.tabDepth > 0) {
                switch (this.state.tabDepth) {
                    case 1:
                        arrayData = this.state.filelist.mp3Contents[this.pathHistory[0].hindex].children; break;
                    case 2:
                        arrayData = this.state.filelist.mp3Contents[this.pathHistory[0].hindex].children[this.pathHistory[1].hindex].children; break;
                    case 3:
                        arrayData = this.state.filelist.mp3Contents[this.pathHistory[0].hindex].children[this.pathHistory[1].hindex].children[this.pathHistory[2].hindex].children; break;
                    case 4:
                        arrayData = this.state.filelist.mp3Contents[this.pathHistory[0].hindex].children[this.pathHistory[1].hindex].children[this.pathHistory[2].hindex].children[this.pathHistory[3].hindex].children; break;
                    case 5:
                        arrayData = this.state.filelist.mp3Contents[this.pathHistory[0].hindex].children[this.pathHistory[1].hindex].children[this.pathHistory[2].hindex].children[this.pathHistory[3].hindex].children[this.pathHistory[4].hindex].children; break;
                    case 6:
                        arrayData = this.state.filelist.mp3Contents[this.pathHistory[0].hindex].children[this.pathHistory[1].hindex].children[this.pathHistory[2].hindex].children[this.pathHistory[3].hindex].children[this.pathHistory[4].hindex].children[this.pathHistory[5].hindex].children; break;
                    case 7:
                        arrayData = this.state.filelist.mp3Contents[this.pathHistory[0].hindex].children[this.pathHistory[1].hindex].children[this.pathHistory[2].hindex].children[this.pathHistory[3].hindex].children[this.pathHistory[4].hindex].children[this.pathHistory[5].hindex].children[this.pathHistory[6].hindex].children; break;
                    default:
                        arrayData = this.state.filelist.mp3Contents[this.pathHistory[0].hindex].children; break;
                }
            } else {
                arrayData = this.state.filelist.mp3Contents || [];
            }
            return (
                <View style={styles.container}>
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
                        isVisible={this.state.showModal}>
                        <View style={[styles.modalContainer,{ height: SCREEN_HEIGHT * 0.7 }]}>
                            <SampleListening screenState={this.state} />
                        </View>
                    </Modal>
                    {Platform.OS === 'android' && (
                        <StatusBar barStyle={"light-content"} animated={true} hidden={false}/>
                    )}
                    <ParallaxScrollView
                        windowHeight={SCREEN_HEIGHT * 0.35}
                        backgroundSource={this.state.bannerurl}
                        //1navBarHeight={Platform.OS === 'android' ? 65 :  isIphoneX() ? 85 : 75}
                        navBarHeight={Platform.OS === 'android' ? 45 :  CommonFuncion.isIphoneX() ? 65 : 55}
                        navBarColor={'#ff0000'}
                        navBarTitle=""
                        navBarView={false}
                        lectureName={this.state.baseBookInfo.title}
                        textbookTitle=""
                        markImage={this.state.bannerurl}
                        leftIcon={{name: 'left', color: '#fff', size: 25, type: 'font-awesome'}}
                        centerTitle={'나의MP3'}
                        leftIconOnPress={() => this._historyBack()}
                        rightIcon={null}
                        screenProps={this.props}>
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
                                                // onPress={()=>this.prepareToDownload()}
                                                onPress={() => this.openApp(this.state.filelist.intentURL)}
                                                >
                                                <Icon name="download" size={15} color={DEFAULT_COLOR.base_color_222} />
                                                <CustomTextM style={{color:DEFAULT_COLOR.base_color_222}}>
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
                                        ref={ref => {
                                            this.__ScrollView = ref;
                                        }}
                                        nestedScrollEnabled={true}>
                                        <View style={{paddingVertical:10,paddingLeft:20,paddingRight:50,flexDirection:'row',flexGrow:1}}>
                                            <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12)}}>
                                                {this.state.filelist.zipUrl}
                                            </CustomTextR>
                                            {
                                                this.pathHistory.map((nav,navindex) => {
                                                    return (
                                                        <CustomTextR key={navindex} style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12)}}>
                                                            <CustomTextR style={{fontSize: 10}}>{" "}▶{" "}</CustomTextR>{nav.title}
                                                        </CustomTextR>
                                                    );
                                                })
                                            }
                                        </View>
                                    </ScrollView>
                                    {this.state.tabDepth > 0 &&
                                            <TouchableOpacity 
                                                onPress={()=> this.goprevTabs()}
                                                style={{position:'absolute',right:0,top:1,width:34,height:34,padding:10,zIndex:2,backgroundColor:'#fff',justifyContent:'center'}}>
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
                                            style={{flex:1,flexDirection:'row',paddingVertical:15,flexGrow:1,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.base_color_222,alignItems:'center'}}
                                        >       
                                            <Icon name="check" size={15} color={DEFAULT_COLOR.lecture_base} /> 
                                            <CustomTextR style={{color:DEFAULT_COLOR.base_color_222}}>
                                                {"  "}선택해제
                                            </CustomTextR>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity 
                                            onPress={() => this.checkAll(arrayData,true)}
                                            style={{flex:1,flexDirection:'row',paddingVertical:15,flexGrow:1,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.base_color_222,alignItems:'center'}}
                                        >       
                                            <Icon name="check" size={15} color={DEFAULT_COLOR.lecture_base} /> 
                                            <CustomTextR style={{color:DEFAULT_COLOR.base_color_222}}>
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
                                                                style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),lineHeight:20}}
                                                            >{indexName}{" "} {titem.title}
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
                                                        <View style={{flex:10,flexDirection:'row',flexGrow:1,paddingHorizontal:10,alignItems:'center'}}>
                                                            <Icon name="folder1" size={15} color={DEFAULT_COLOR.base_color_222} style={{marginBottom:-3}} /> 
                                                            <CustomTextR 
                                                                numberOfLines={1} ellipsizeMode = 'tail'
                                                                style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),lineHeight:20}}
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
                                onPress={()=>this.goDownLoadMP3Player()}
                                style={{marginTop:20,position:'absolute',left:0,bottom:0,height:70,width:SCREEN_WIDTH,justifyContent:'flex-end'}}>  
                                <Image 
                                    source={require('../../../assets/icons/btn_down_mp3player.png')} 
                                    resizeMode='contain'
                                    style={{width:SCREEN_WIDTH,height:'100%'}}
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
                            <Icon name="caretright" size={15} color={DEFAULT_COLOR.base_color_fff} /> 
                            <CustomTextB style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),fontWeight:'bold',paddingLeft:10}}>재생하기</CustomTextB>
                            <View style={{height:20,paddingHorizontal:10,borderRadius:15,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',marginLeft:10}}>
                                <TextRobotoB style={{color:DEFAULT_COLOR.lecture_base,fontWeight:'bold'}}>+{this.state.samplemp3list.length}</TextRobotoB>
                            </View>
                        </TouchableOpacity>
                    }
                    {
                    this.state.downloadStatus && 
                    <View style={{zIndex:3,position:'absolute',left:0,bottom:0,height:50,width:SCREEN_WIDTH,backgroundColor:'#fff',borderTopColor:DEFAULT_COLOR.input_border_color,borderTopWidth:1,justifyContent:'center',alignItems:'center'}}>
                        <View
                            style={{width: this.state.nowDownloadPercentage > 0 ? this.state.nowDownloadPercentage/this.state.nowDownloadPercentage*100+'%' : 0,height: '100%',position: 'absolute',backgroundColor:DEFAULT_COLOR.lecture_base}}>
                                
                        </View>
                        <Text style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)}}>다운로드</Text>
                    </View>
                    }
                
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
   
});

function mapStateToProps(state) {
    return {   
        myClassServiceID: state.GlabalStatus.myClassServiceID,    
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
    };
}

export default connect(mapStateToProps, null)(MyMP3DetailScreen);
