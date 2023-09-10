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
  Modal,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  PermissionsAndroid,
} from 'react-native';
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
const RNFS = require('react-native-fs');

import MyClassStyles from '../../../Style/MyClass/MyClassStyle';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/Entypo';
Icon2.loadFont();
// import Icon2 from 'react-native-vector-icons/Entypo';
// Icon2.loadFont();
// import Icon from 'react-native-vector-icons/FontAwesome';
// Icon.loadFont();

//공통상수
import COMMON_STATES, {SERVICES} from '../../../Constants/Common';
import * as getDEFAULT_CONSTANTS from '../../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../../Utils/CommonUtil';
import CommonFunction from '../../../Utils/CommonFunction';
import {CustomTextR, CustomTextM, CustomTextB, TextRobotoR, TextRobotoB} from '../../../Style/CustomText';
import moment from 'moment';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const STATE_DOWNLOAD_READY = undefined;
const STATE_DOWNLOAD_PROGRESS = 'progress';
const STATE_DOWNLOAD_COMPLETE = 'complete';

const RenderItem = props => {
  const {selectedTabIndex, lectureNote, writingNote, selectedLectureNote, selectedWritingNote} = props.screenState;
  const data = selectedTabIndex === 0 ? lectureNote : writingNote;
  const selected = selectedTabIndex === 0 ? selectedLectureNote : selectedWritingNote;
  return (
    !CommonUtil.isEmpty(data)
    ? (data.map((item, key) => {
      // console.log('item : ', item);
        return (
        <TouchableOpacity
          key={item.lectureNo}
          onPress={() => props.onPressLecture(item.lectureNo)}
          style={[selected.get(item.lectureNo) && styles.listRowSelected]}>
          <View style={styles.listRow}>
            <View style={[styles.listCol, styles.tableCol1]}><CustomTextR style={[styles.listColText]}>{item.lectureNo}</CustomTextR></View>
            <View style={[styles.listCol, styles.tableCol2]}><CustomTextR style={[styles.listColText, {marginHorizontal: 15}, selected.get(item.lectureNo) && {color: '#28a5ce'}]} numberOfLines={1}>{item.lectureName}</CustomTextR></View>
            <View style={[styles.listCol, styles.tableCol3, {flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}]}>
              {Platform.OS === 'ios'
                ? !CommonUtil.isEmpty(item.downloadPercent) && <TextRobotoR style={[styles.listColText, {color: '#28a5ce'}]}>{item.state === STATE_DOWNLOAD_COMPLETE ? '100' : item.downloadPercent}% / </TextRobotoR>
                : (
                  item.state === STATE_DOWNLOAD_PROGRESS
                    ? (<ActivityIndicator style={[styles.downIndicator, {marginRight: 10}]} size="small"/>)
                    : (item.state === STATE_DOWNLOAD_COMPLETE && (<Image style={{width: 15, height: 15, marginRight: 10}} source={require('../../../../assets/icons/icon_done.png')} />))
                  )
                }
              <TextRobotoR style={[styles.listColText, {marginRight: 15}]}>
                {item.fileSize || 0} KB
              </TextRobotoR>
            </View>
          </View>
        </TouchableOpacity>
        );
      })
    ) : (<View style={{height: 100, width: '100%', justifyContent: 'center', alignItems: 'center'}}><CustomTextR>학습자료가 없습니다.</CustomTextR></View>)
  );
}

export default class StudyFileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      classData: props.screenState.classData,
      lectureNote: [],
      writingNote: [],
      selectedTabIndex: 0,
      selectedLectureNote: new Map(),
      selectedWritingNote: new Map(),
    };
  }

  async UNSAFE_componentWillMount() {
    this.setState({loading: false});
    // const aPIsDomain =
    // (!CommonUtil.isEmpty(this.props.myInterestCodeOne) && typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined')
    //     ? this.props.myInterestCodeOne.info.apiDomain
    //     : DEFAULT_CONSTANTS.apiTestDomain;
    const url = SERVICES[this.props.screenState.myClassServiceID].apiDomain + '/v1/myClass/studyFiles/' + this.state.classData.memberProductIdx + '/' + this.state.classData.memberClassIdx;
    console.log('UNSAFE_componentWillMount()', 'url = ' + url)
    await CommonUtil.callAPI(url)
      .then(response => {
        if (response && response.code === '0000') {
          this.setState({
            loading: false,
            lectureNote: response.data.lectureNote || [],
            writingNote: response.data.writingNote || [],
            selectedTabIndex: (response.data.lectureNote && response.data.writingNote) ? 0 : ((!response.data.lectureNote && response.data.writingNote) ? 1 : 0),
          });
        } else {
          this.setState({loading: false});
          response.message
            ? Alert.alert('', response.message)
            : Alert.alert('', '로딩 실패');
        }
      })
      .catch(error => {
        this.setState({loading: false});
        Alert.alert('', '시스템 에러');
      });
  }

  onPressTab = tabIndex => {
    this.setState({
      selectedTabIndex: tabIndex,
    });
  };

  selectLecture = lectureNo => {
    const selectedNoteData =
      this.state.selectedTabIndex === 0
        ? this.state.lectureNote.find(item => item.lectureNo === lectureNo)
        : this.state.writingNote.find(item => item.lectureNo === lectureNo);
    // const selected = this.state.selectedTabIndex === 0 ? this.state.selectedLectureNote : this.state.selectedWritingNote;
    const selected = this.state.selectedTabIndex === 0 ? this.state.selectedLectureNote : this.state.selectedWritingNote;
    const newSelected = new Map(selected);
    selected.get(lectureNo)
      ? newSelected.delete(lectureNo)
      : newSelected.set(lectureNo, selectedNoteData);
      // : newSelected.set(lectureNo, !selected.get(lectureNo));
    const keyName = this.state.selectedTabIndex === 0 ? 'selectedLectureNote' : 'selectedWritingNote';
    this.setState({
      [keyName]: newSelected,
    });
  };

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
    const {selectedTabIndex, lectureNote, writingNote, selectedLectureNote, selectedWritingNote} = this.state;
    const selected = selectedTabIndex === 0 ? selectedLectureNote : selectedWritingNote;
    if (selected.size === 0) {
      Alert.alert('', '선택된 학습자료가 없습니다.\n학습자료를 선택하신 후 다시 시도해주세요.');
      return;
    }

    let sumFileSize = 0;
    selected.forEach(item => {
      sumFileSize += item.fileSize;
    });
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
  };

  // 권한 체크
  requestWriteStoragePermission = async () => {
    const {selectedTabIndex, lectureNote, writingNote, selectedLectureNote, selectedWritingNote} = this.state;
    const selected = selectedTabIndex === 0 ? selectedLectureNote : selectedWritingNote;
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          selected.forEach((item, key) => {
            this.downloadFile(item.lectureNo);
          });
        } else {
          console.log('Camera permission denied');
        }
      } else {
        selected.forEach((item, key) => {
          this.downloadFile(item.lectureNo);
        });
      }
    } catch (err) {
      console.warn(err);
    }
  };

  downloadFile = lectureNo => {
    const {selectedTabIndex, lectureNote, writingNote, selectedLectureNote, selectedWritingNote} = this.state;
    // // const data = selectedTabIndex === 0 ? lectureNote : writingNote;
    const selected = selectedTabIndex === 0 ? selectedLectureNote : selectedWritingNote;
    // if (selected.size === 0) {
    //   Alert.alert('', '다운로드할 자료를 선택해 주세요.');
    // }

    // let arrDownload = [];
    // selected.forEach((item, key) => {
    //   if (item) {
    //     const lec = data.find(element => { return element.lectureNo.toString() === key.toString() });
    //     arrDownload.push(lec);
    //   }
    // });

    // selected.forEach((item, key) => {
    //   // console.log('item : ', item.downloadUrl);
    //   const { config, fs } = RNFetchBlob;
    //   let PictureDir = fs.dirs.PictureDir; // this is the pictures directory. You can check the available directories in the wiki.
    //   let options = {
    //     fileCache: true,
    //     addAndroidDownloads: {
    //       useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
    //       notification: false,
    //       path: PictureDir + "/me_"+Math.floor(moment().format('X') + moment().second() / 2), // this is the path where your downloaded file will live in
    //       description : 'Downloading file.'
    //     }
    //   }
    //   config(options).fetch('GET', item.downloadUrl)
    //     .then((res) => {
    //       console.log('download res : ', res);
    //     })
    //     .catch(error => {
    //       console.log('download error : ', error);
    //     });
    // });

    // selected.forEach((item, key) => {
    const lec = selected.get(lectureNo);
    const file1 = 'https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_1280_10MG.mp4';
    const file2 = 'https://teacher.hackers.com/board/?r=teacher&m=bbs&a=download&uid=9588';
    const file3 = 'https://teacher.hackers.com/board/?r=teacher&m=bbs&a=download&uid=9587';
    const fileExt = lec.fileExt;
    const fileName = this.state.classData.memberClassIdx + '-' + lectureNo + '.' + fileExt;
    // console.log('fileName : ', fileName);
    // console.log('TEST', RNFetchBlob.fs.dirs);
    // console.log('SAVE PATH ORIGIN', `${RNBackgroundDownloader.directories.documents}/` + fileName);
    const selectFile = parseInt(lectureNo) === 1 ? file1 : (parseInt(lectureNo) === 9 ? file2 : file3);

    lec.state = STATE_DOWNLOAD_PROGRESS;
    lec.progressPercent = 0;
    this.forceUpdate();

    let config;
    if (Platform.OS === 'android') {
      // let fileId = this.generateFileName(fileItemIndex);
      // let fileName = fileId + '.' + this.state.targetItem.fileList[fileItemIndex].appendExt;
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
        lec.downloadPercent = parseInt((received / total) * 100);
        this.forceUpdate();
      })
      .then(res => {
        let status = res.info().status;
        lec.downloadPercent = 100;
        lec.state = STATE_DOWNLOAD_COMPLETE;
        lec.localFilePath = res.path();
        //this.state.targetItem.fileList[fileItemIndex].localFilePath = RNFetchBlob.fs.dirs.DownloadDir + '/' + fileName;
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
    if (this.state.loading) {
      return (<View style={MyClassStyles.IndicatorContainer}><ActivityIndicator size="large" /></View>);
    } else {
      return (
        <View style={styles.container}>
          <View style={MyClassStyles.inModalHeader}>
            <CustomTextR style={MyClassStyles.inModalHeaderTitleText}>학습자료 다운로드</CustomTextR>
            <TouchableOpacity onPress={() => this.props.screenState.closeModal()} style={MyClassStyles.inModalCloseBtn}>
              <Image source={require('../../../../assets/icons/btn_close_pop.png')} style={MyClassStyles.inModalCloseBtnImage} />
            </TouchableOpacity>
          </View>
          <View style={styles.wrapper}>
            <ScrollView>
              <View style={styles.topMsg}>
                {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon2 name="dot-single" color="#aaaaaa" style={MyClassStyles.bullet} />
                  <CustomTextR style={styles.topMsgText}>다운로드하실 자료를 선택해 주세요.</CustomTextR>
                </View> */}
                <CustomTextR style={styles.topMsgText}>· 다운로드하실 자료를 선택해 주세요.</CustomTextR>
                <CustomTextR style={styles.topMsgText}>· 전체 파일 다운로드는 모바일에서 지원하지 않습니다.</CustomTextR>
                <CustomTextR style={styles.topMsgText}>· 전체 다운로드는 PC사용 부탁드립니다.</CustomTextR>
              </View>
              {((this.state.lectureNote && this.state.writingNote) && (this.state.lectureNote.length > 0 && this.state.writingNote.length > 0))
                ? (
                  <View style={styles.tabButtonContainer}>
                    <TouchableOpacity
                      style={[
                        styles.tabButton,
                        this.state.selectedTabIndex === 0 && styles.tabButtonOn,
                      ]}
                      onPress={() => this.onPressTab(0)}>
                      <CustomTextR style={[styles.tabButtonText, this.state.selectedTabIndex === 0 && styles.tabButtonTextOn]}>강의노트</CustomTextR>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.tabButton,
                        this.state.selectedTabIndex === 1 && styles.tabButtonOn,
                      ]}
                      onPress={() => this.onPressTab(1)}>
                      <CustomTextR style={[styles.tabButtonText, this.state.selectedTabIndex === 1 && styles.tabButtonTextOn]}>필살기노트</CustomTextR>
                    </TouchableOpacity>
                  </View>
                ): (
                  <View style={{marginBottom: 13}}>
                    <CustomTextM style={{fontSize: PixelRatio.roundToNearestPixel(15), lineHeight: 15 * 1.42, fontWeight: '500', letterSpacing: -0.75}}>
                      {(this.state.lectureNote && this.state.lectureNote.length > 0) ? '강의노트' : '필살기노트'}
                    </CustomTextM>
                  </View>
                )}
              <View style={styles.tableHeader}>
                <View style={[styles.tableHeaderCol, styles.tableCol1]}><CustomTextR style={[styles.tableHeaderTitleText]}>강의</CustomTextR></View>
                <View style={[styles.tableHeaderCol, styles.tableCol2]}><CustomTextR style={[styles.tableHeaderTitleText]}>강의내용</CustomTextR></View>
                <View style={[styles.tableHeaderCol, styles.tableCol3]}><CustomTextR style={[styles.tableHeaderTitleText]}>파일용량</CustomTextR></View>
              </View>
              <RenderItem screenState={this.state} onPressLecture={this.selectLecture} />
            </ScrollView>
          </View>
          <View style={MyClassStyles.inModalBottomStickyButtonSection}>
            <TouchableOpacity style={MyClassStyles.inModalBottomStickyButton} onPress={() => this.prepareToDownload()}>
              <CustomTextB style={MyClassStyles.inModalBottomStickyButtonText}>선택 자료 다운로드</CustomTextB>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    // width: '100%',
    // height: '',
    // flexDirection: 'column',
    flex: 1,
  },
  wrapper: {
    flexDirection: 'column',
    height: '100%',
    marginHorizontal: 20,
    paddingBottom: SCREEN_HEIGHT * 0.08,
  },
  topMsg: {
    marginTop: 24,
    marginBottom: 29,
  },
  topMsgText: {
    fontSize: PixelRatio.roundToNearestPixel(12),
    lineHeight: 12 * 1.42,
    letterSpacing: -0.6,
    color: '#666666',
  },
  tabSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#d8d8d8',
    backgroundColor: '#f5f7f8',
    marginBottom: 20,
  },
  tabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    // height: 35,
    flex: 1,
    paddingVertical: 12,
  },
  tabButtonOn: {
    borderRadius: 4,
    backgroundColor: '#0e3a48',
    borderWidth: 1,
    borderColor: '#0e3a48',
  },
  tabButtonText: {
    fontSize: PixelRatio.roundToNearestPixel(14),
    lineHeight: 14 * 1.42,
    letterSpacing: -0.7,
    textAlign: 'center',
    color: '#444444',
  },
  tabButtonTextOn: {
    color: '#ffffff',
  },
  tableHeader: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#222222',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  tableHeaderTitleText: {
    color: '#222222',
    fontSize: PixelRatio.roundToNearestPixel(12),
    lineHeight: 12 * 1.42,
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  tableHeaderCol: {
    paddingVertical: 17,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  tableCol1: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#e8e8e8',
  },
  tableCol2: {
    flex: 3,
    borderRightWidth: 1,
    borderRightColor: '#e8e8e8',
  },
  tableCol3: {
    flex: 2,
  },
  listRow: {
    // height: 30,
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listRowSelected: {
    backgroundColor: '#f5f7f8',
  },
  listCol: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listColText: {
    fontSize: PixelRatio.roundToNearestPixel(12),
    lineHeight: 12 * 1.42,
    color: '#666',
  },
  downPercent: {
    color: DEFAULT_COLOR.lecture_base,
    fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_13),
  }
});
