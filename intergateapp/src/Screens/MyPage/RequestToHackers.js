import React, { Component } from 'react';
import {
    StatusBar, ScrollView, View, StyleSheet, Text, Dimensions, PixelRatio, TextInput, TouchableOpacity, Image,
    Alert, Platform, Animated, ActivityIndicator, NativeModules, BackHandler
} from 'react-native';
import Toast from 'react-native-tiny-toast';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/FontAwesome';
Icon2.loadFont();

import SelectType from "./SelectType";
import {Button,Overlay,CheckBox,Input} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker'
import DropDown from '../../Utils/DropDown';

//import MediaMeta from '../../Utils/MediaMeta';
import Upload from 'react-native-background-upload';
//import SearchInterest from './SearchInterest';
import InterestSelect from '../../../InterestSelect';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextB, CustomText, TextRobotoB, CustomTextR, CustomTextM} from "../../Style/CustomText";
import { exists } from 'react-native-fs';
import SendIntentAndroid from "react-native-send-intent/index";
import AppLink from "../../Utils/AppLink";
import AsyncStorage from "@react-native-community/async-storage";
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const IC_ARR_DOWN = require('../../../assets/icons/ic_arr_down.png');
const IC_ARR_UP = require('../../../assets/icons/ic_arr_up.png');

//무한로딩을 방지하기 위한 임시 장치
const MAXIMUM_UPLOAD_COUNT = 10;

// TODO 해커스에 바란다 등록 테스트

// iOS
    // 사진 탭 > 텍스트만 등록 O
    // 사진 탭 > 단일 파일 첨부 및 등록 O
    // 사진 탭 > 다중 파일 첨부 및 등록 O
    // 동영상 탭 > 텍스트만 등록 X
    // 동영상 탭 > 단일 파일 첨부 및 등록 X

// Android
    // 사진 탭 > 단일 파일 첨부 및 등록 O
    // 사진 탭 > 텍스트만 등록 X
    // 사진 탭 > 다중 파일 첨부 및 등록 X
    // 동영상 탭 > 텍스트만 등록 X
    // 동영상 탭 > 단일 파일 첨부 및 등록 X

export default  class RequestToHackers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            selectVideoUsingCamera: true,
            showSelectVideoModal: false,
            isBackdrop: false,
            interestMode : 'once',
            myInterestCodeOne : null,
            attentionSelectCode : null,
            attentionSelectName : null,
            attentionSelectRGB : null,
            appVersion :null,
            buildVersion :null,
            bundleIdentifier :null,
            topShowModal : false,
            user_name : null,     
            user_email : null,       
            user_interest : null,
            //user_interest_code : 98, attentionSelectCode 대체
            //user_interest_name : '공무원', attentionSelectName 대체
            user_content : null,
            file_uid : [],
            selectedSample : 1,            
            selectDomain : '직접입력',
            selectDomainText: '',
            selectTheme : 1,
            setMyInterest : this.setMyInterest.bind(this),
            mockData1 : [
                { id: 1, name : 'naver.com', checked: false },
                { id: 2, name : 'daum.net', checked: false },
                { id: 3, name : 'gmail.com', checked: false },
                { id: 4, name : 'nate.com', checked: false },
                { id: 5, name : '직접입력', checked: true },  
            ],
            mockData2 : [
                { id: 1, name : '제안문의', checked: true },
                { id: 2, name : '오류문의', checked: false },
                { id: 3, name : '불편문의', checked: false },
                
            ],
            agreeCheck : {checked : false, title : '개인정보 수집 및 이용 동의(필수)'},
            attachFileSize : 0,
            photoarray: [],
            moviearray : null,
            moviethumbnail : '',
            currentUploadCount: 0,
        }
    }

    async UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);     
        this.setState({
            appVersion : NativeModules.RNVersionNumber.appVersion,
            buildVersion : NativeModules.RNVersionNumber.buildVersion,
            bundleIdentifier : NativeModules.RNVersionNumber.bundleIdentifier
        })

        let myInterestCode = await AsyncStorage.getItem('myInterestCode')
        console.log('UNSAFE_componentWillMount()', 'myInterestCode = ' + JSON.parse(myInterestCode).code)

        if(myInterestCode !== null) {
            this.setMyInterest(
                JSON.parse(myInterestCode).info.interestFieldID,
                JSON.parse(myInterestCode).info.interestFieldName,
                null,
                JSON.parse(myInterestCode).color,
            )
        }
    }  

    componentDidMount() {

    }
 
    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보        
         
    }
 
    UNSAFE_componentWillReceiveProps(nextProps) {
      
    }
 
    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
    }


    handleBackButton = () => {        
        this.props.navigation.goBack(null);
        this.props.navigation.toggleDrawer();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton); 
        return true;
    };

    selectFilter = (filt) => {        
        try {
            let selectedId = this.state.mockData1[filt-1].id;            
            this.setState({selectDomain : this.state.mockData1[filt-1].name})
        }catch {            
            this.state.mockData1[0].checked = true;
            return true;
        }
    }

    selectFilter2 = (filt) => {        
        try {
            let selectedId = this.state.mockData2[filt-1].id;
            this.setState({selectTheme : this.state.mockData2[filt-1].id})
        }catch {
            this.state.mockData2[0].checked = true;
            
            return true;
        }
    }

    tempSaveProcess = () =>{
        this.setState({
            photoarray : [],
            selectedSample : false,
            attachFileSize: 0,
        })
    }

    tempSaveProcess2 = () =>{
        this.setState({
            moviearray : null,
            selectedSample : true,
            attachFileSize: 0,
        })
    }

    selectSampleKeyword = async(bool) => {        
        if ( !bool && this.state.photoarray.length > 0 ) {
            Alert.alert(
                "해커스통합앱 : 해커스에 바란다",
                "이미 선택하신 이미지가 있습니다.\n이미지 제거 후 동영상을 업로드 하시겠습니까?",
                [
                    {text: '네', onPress: this.tempSaveProcess.bind(this)},
                    {text: '아니오', onPress: () => null },
                ],
                { cancelable: false }
            )
        }else if ( bool && this.state.moviearray ) {
            Alert.alert(
                "해커스통합앱 : 해커스에 바란다",
                "이미 동영상이 있습니다.\동영상 제거 후 이미지를 업로드 하시겠습니까?",
                [
                    {text: '네', onPress: this.tempSaveProcess2.bind(this)},
                    {text: '아니오', onPress: () => null },
                ],
                { cancelable: false }
            )
        }else{
            this.setState({selectedSample : bool})
        } 
    }

    removeAttachImage = async(idx) => {
        console.log('removeAttachImage()', 'target = ' + JSON.stringify(this.state.photoarray[idx]))

        let selectedFilterList = await this.state.photoarray.filter((info,index) => index !== idx);
        this.setState({
            photoarray: selectedFilterList,
            attachFileSize: this.state.attachFileSize - this.state.photoarray[idx].fileSize,
        })
    }

    localcheckfile = () => {
        const options = {
            noData: true,
        }
        ImagePicker.launchImageLibrary(options, response => {
            try {
                if(response.type.indexOf('image') != -1) {
                    if (response.uri) {
                        //console.log('response.uri', response.uri)
                        if ( parseInt((this.state.attachFileSize+response.fileSize)/1024/1024) > 50 ) {
                            Alert.alert('image upload error', '50MB를 초과하였습니다.');
                            return;
                        }else{

                            console.log('localcheckfile()', 'response = ' + JSON.stringify(response))

                            this.state.photoarray.push({type : response.type === undefined ? 'txt' :  response.type,uri : response.uri, height:response.height,width:response.width,fileSize:response.fileSize,fileName:response.fileName});
                            this.setState({
                                attachFileSize :  this.state.attachFileSize+response.fileSize
                            })
                            this.ScrollView.scrollToEnd({ animated: true});

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

   
    handleChoosePhoto = async() => {
              
        await this.localcheckfile();
        //this.setState({ photo: photoarray });
    }

    // 통합 버전
        /*
            ImagePicker.showImagePicker()
        */

    // 동영상 녹화 단일:
        /*
            ImagePicker.launchCamera()
        */

    // 동영상 업로드 단일
        /*
            const options = {
                noData: true,
            }
            ImagePicker.launchImageLibrary()
        */

    //동영상 녹화 단독
    handleChooseVideoUsingCamera = async() => {
        const options = {
            cameraType: 'back', // 'front' or 'back'
            waitUntilSaved: true,
            thumbnail: true,
            //durationLimit: 300, // 5 mins ???
            allowsEditing: true,
            mediaType: 'video', // 'photo' or 'video'
            videoQuality: 'high', // 'low', 'medium', or 'high'
            storageOptions: { // if this key is provided, the image will get saved in the documents/pictures directory (rather than a temporary directory)
                skipBackup: true, // image will NOT be backed up to icloud
                path: 'images' // will save image at /Documents/images rather than the root
            }
        }

        try {
            ImagePicker.launchCamera(options, (video) => {
                console.log('Response = ', video);
                if (video.didCancel) {
                    console.log('User cancelled photo picker');
                } else if (video.error) {
                    console.log('ImagePicker Error: ', video.error);
                } else if (video.customButton) {
                    console.log('User tapped custom button: ', video.customButton);
                } else {
                    const path = Platform.OS === 'ios' ? video.uri.substring(7) : video.path;
                    RNFetchBlob.fs.stat(path)
                        .then((stats) => {
                            if(stats.size > 1024 * 1024 * 50) {
                                Alert.alert(
                                    "해커스통합앱 : 해커스에 바란다",
                                    '50Mbyte를 초과하였습니다.',
                                    [
                                        {text: 'OK', onPress: () => console.log('OK Pressed')}
                                    ],
                                    {cancelable: false}
                                );
                            } else {
                                NativeModules.RNVideoThumbnail.get(path)
                                    .then((res) => {
                                        this.setState({
                                            moviearray: path,
                                            moviethumb: res.data,
                                            attachFileSize :  this.state.attachFileSize+stats.size
                                        })
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                            }

                        })
                        .catch((err) => {
                            console.log('handleChooseVideo()', 'err = ' + JSON.stringify(err))
                        })
                }
            })
        } catch(e) {
            console.error(e);
        }
    }

    //동영상 업로드 단독
    handleChooseVideoUsingLibrary = async() => {
        const options = {
            cameraType: 'back', // 'front' or 'back'
            waitUntilSaved: true,
            thumbnail: true,
            //durationLimit: 300, // 5 mins ???
            allowsEditing: true,
            mediaType: 'video', // 'photo' or 'video'
            videoQuality: 'high', // 'low', 'medium', or 'high'
            storageOptions: { // if this key is provided, the image will get saved in the documents/pictures directory (rather than a temporary directory)
                skipBackup: true, // image will NOT be backed up to icloud
                path: 'images' // will save image at /Documents/images rather than the root
            }
        }

        try {
            ImagePicker.launchImageLibrary(options, (video) => {
                console.log('Response = ', video);
                if (video.didCancel) {
                    console.log('User cancelled photo picker');
                } else if (video.error) {
                    console.log('ImagePicker Error: ', video.error);
                } else if (video.customButton) {
                    console.log('User tapped custom button: ', video.customButton);
                } else {
                    const path = Platform.OS === 'ios' ? video.uri.substring(7) : video.path;
                    RNFetchBlob.fs.stat(path)
                        .then((stats) => {
                            if(stats.size > 1024 * 1024 * 50) {
                                Alert.alert(
                                    "해커스통합앱 : 해커스에 바란다",
                                    '50Mbyte를 초과하였습니다.',
                                    [
                                        {text: 'OK', onPress: () => console.log('OK Pressed')}
                                    ],
                                    {cancelable: false}
                                );
                            } else {
                                NativeModules.RNVideoThumbnail.get(path)
                                    .then((res) => {
                                        this.setState({
                                            moviearray: path,
                                            moviethumb: res.data,
                                            attachFileSize :  this.state.attachFileSize+stats.size
                                        })
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                            }

                        })
                        .catch((err) => {
                            console.log('handleChooseVideo()', 'err = ' + JSON.stringify(err))
                        })
                }
            })
        } catch(e) {
            console.error(e);
        }
    }

    handleChooseVideo = async() => {

        console.log('handleChooseVideo()', 'START');

        const options = {
            title: '', // specify null or empty string to remove the title
            cancelButtonTitle: '취소',
            takePhotoButtonTitle: '동영상 녹화', // specify null or empty string to remove this button
            chooseFromLibraryButtonTitle: '동영상 업로드', // specify null or empty string to remove this button
            cameraType: 'back', // 'front' or 'back'
            //cameraRoll: true,
            waitUntilSaved: true,
            thumbnail: true,
            durationLimit: 300, // 5 mins
            allowsEditing: true,
            mediaType: 'video', // 'photo' or 'video'
            videoQuality: 'high', // 'low', 'medium', or 'high'
            storageOptions: { // if this key is provided, the image will get saved in the documents/pictures directory (rather than a temporary directory)
                skipBackup: true, // image will NOT be backed up to icloud
                path: 'images' // will save image at /Documents/images rather than the root
            }
        }

        try {
            ImagePicker.showImagePicker(options, (video) => {
                console.log('Response = ', video);
                if (video.didCancel) {
                    console.log('User cancelled photo picker');
                } else if (video.error) {
                    console.log('ImagePicker Error: ', video.error);
                } else if (video.customButton) {
                    console.log('User tapped custom button: ', video.customButton);
                } else {
                    const path = Platform.OS === 'ios' ? video.uri.substring(7) : video.path;
                    RNFetchBlob.fs.stat(path)
                        .then((stats) => {
                            if(stats.size > 1024 * 1024 * 50) {
                                Alert.alert(
                                    "해커스통합앱 : 해커스에 바란다",
                                    '50Mbyte를 초과하였습니다.',
                                    [
                                        {text: 'OK', onPress: () => console.log('OK Pressed')}
                                    ],
                                    {cancelable: false}
                                );
                            } else {
                                NativeModules.RNVideoThumbnail.get(path)
                                    .then((res) => {
                                        this.setState({
                                            moviearray: path,
                                            moviethumb: res.data,
                                            attachFileSize :  this.state.attachFileSize+stats.size
                                        })
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                            }

                        })
                        .catch((err) => {
                            console.log('handleChooseVideo()', 'err = ' + JSON.stringify(err))
                        })
                }
            })
        } catch(e){
            console.error(e);
        }
    }

    registFile = (index) => {
        console.log('registFile()', 'START [' + index + ']')

        const options = {
            url: DEFAULT_CONSTANTS.fileUploadDomain,
            path: this.state.selectedSample ? this.state.photoarray[index].uri : this.state.moviearray,
            method: 'POST',
            field : 'upload_files[]',
            type: 'multipart',
            maxRetries: 2,
            headers: {
                'Content-Type': 'multipart/form-data;',
                'apiKey': DEFAULT_CONSTANTS.apitestKey
            },
            notification: {
                enabled: false
            },
        }

        Upload.startUpload(options).then((uploadId) => {
            //console.log('Upload started')
            Upload.addListener('progress', uploadId, (data) => {
                //console.log(`Progress: ${data.progress}%`)
            })
            Upload.addListener('error', uploadId, (data) => {
                //console.log(`Error: ${data.error}%`)
            })
            Upload.addListener('cancelled', uploadId, (data) => {
                //console.log(`Cancelled!`)
            })
            Upload.addListener('completed', uploadId, (data) => {
                // data includes responseCode: number and responseBody: Object
                //console.log('Completed!',data)
                var res = JSON.parse(CommonFuncion.unicodeToKor(data.responseBody))
                console.log('registFile()', JSON.stringify(res))

                if(res.result) {
                    /** 사진 첨부 **/
                    if(this.state.selectedSample) {
                        let new_file_uid = this.state.file_uid;
                        new_file_uid.push(res.file_uid[0])

                        let nextUploadIndex = -1;
                        let new_photoarray = [];
                        this.state.photoarray.map((newItem, newIndex) => {
                            if(index == newIndex) {
                                new_photoarray.push({...newItem, isUpload: true})
                            } else {
                                if(nextUploadIndex == -1 && (newItem.isUpload == false || newItem.isUpload == undefined)) {
                                    nextUploadIndex = newIndex
                                }

                                new_photoarray.push({...newItem});
                            }
                        });
                        this.setState({
                            photoarray: new_photoarray,
                            file_uid: new_file_uid,
                            currentUploadCount: this.state.currentUploadCount + 1,
                        });

                        if(nextUploadIndex == -1) {
                            console.log('registFile()', 'FINISH UPLOAD IMAGE');
                            console.log('registFile()', 'ㄴ this.state.file_uid = ' + JSON.stringify(this.state.file_uid));
                            console.log('registFile()', 'ㄴ this.state.photoarray = ' + JSON.stringify(this.state.photoarray));
                            this.registData();
                        } else {
                            if(this.state.currentUploadCount >= MAXIMUM_UPLOAD_COUNT) {
                                console.log('registFile()', 'EXCEED UPLOAD COUNT MAXIMUM');
                                let message = "파일 업로드에 실패하였습니다.";
                                let timesecond = 2000;
                                CommonFuncion.fn_call_toast(message,timesecond);
                            } else {
                                this.registFile(nextUploadIndex)
                            }
                        }
                    }

                    /** 동영상 첨부 **/
                    else {
                        let new_file_uid = this.state.file_uid;
                        new_file_uid.push(res.file_uid[0])

                        console.log('registFile()', 'FINISH UPLOAD VIDEO');
                        console.log('registFile()', 'ㄴ this.state.file_uid = ' + JSON.stringify(this.state.file_uid));
                        console.log('registFile()', 'ㄴ this.state.moviearray = ' + JSON.stringify(this.state.moviearray));

                        this.registData();
                    }
                } else {
                    let message = "파일 업로드에 실패하였습니다.";
                    let timesecond = 2000;
                    CommonFuncion.fn_call_toast(message,timesecond);
                    this.setState({loading: false})
                }
            })
        }).catch((err) => {
            //console.log('Upload error!', err)
            let message = "파일 업로드에 실패하였습니다.";
            let timesecond = 2000;
            CommonFuncion.fn_call_toast(message,timesecond);
            this.setState({loading: false})
        })
    }

    registStart = () => {
        this.setState({
            loading: true,
            file_uid: []
        })

        //이미지 업로드
        if(this.state.selectedSample) {
            if(this.state.photoarray.length == 0) {
                this.registData();
            } else {
                this.registFile(0);
            }
        }

        //동영상 업로드
        else {
            if(this.state.moviearray == null || this.state.moviearray === "") {
                this.registData();
            } else {
                this.registFile(0);
            }
        }
    }

    /* 여기부터 관심분야 설정 */
    _topCloseModal = async() => {
        this.setState({ topShowModal: false })
    };
    _topShowModal = async() => {    
        this.setState({ topShowModal: true })
    }
    topAnimatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.9);

    setMyInterest = async(code,name,data,color) => {
        
        await this.setState({
            attentionSelectCode : code,
            attentionSelectName : name,
            attentionSelectRGB : color,
            topShowModal : false
        }) 
        
    }
    /* 여기까지 관심분야 설정 */

    registData = async() => {
        //await this.firstImageUpload();
        //this.setState({loading:true})
        if ( !this.state.user_name  ) {
            let message = "`이름`을 입력해 주세요";
            let timesecond = 2000;
            CommonFuncion.fn_call_toast(message,timesecond);
            this.setState({loading:false})
            return false;
        }

        if ( !this.state.user_email || !this.state.selectDomain || (this.state.selectDomain === '직접입력' && this.state.selectDomainText === '') ) {
            let message = "`이메일주소` 를 입력해 주세요";
            let timesecond = 2000;
            CommonFuncion.fn_call_toast(message,timesecond);
            this.setState({loading:false})
            return false;
        }

        if ( !this.state.selectTheme  ) {
            let message = "`문의내용 구분`을 선택해 주세요";
            let timesecond = 2000;
            CommonFuncion.fn_call_toast(message,timesecond);
            this.setState({loading:false})
            return false;
        }

        if ( !this.state.attentionSelectCode  ) {
            let message = "`이용 관심분야`을 입력해 주세요";
            let timesecond = 2000;
            CommonFuncion.fn_call_toast(message,timesecond);
            this.setState({loading:false})
            return false;
        }

        if ( !this.state.user_content  ) {
            let message = "`문의내용`을 입력해 주세요";
            let timesecond = 2000;
            CommonFuncion.fn_call_toast(message,timesecond);
            this.setState({loading:false})
            return false;
        }

        if ( !this.state.agreeCheck.checked) {
            let message = "`개인정보 수집 및 이용동의(필수)`에 동의가 필요합니다.";
            let timesecond = 2000;
            CommonFuncion.fn_call_toast(message,timesecond);
            this.setState({loading:false})
            return false;
        }

        /*
        인트라넷 해커스에바란다 테이블(TO_HACKERS_NEW?) 샘플 데이터
        [
            {
                "app_code":"gateway_new",
                "name":"\ud574\ucee4\uc2a4\ud1a1",
                "app_version":"2.2.2",
                "os_name":"Android\/REL\/10\/29",
                "model":"SM-A908N\/r3q\/msmnile",
                "resolution":"2198x1080"
             }
         ]
         */

        const formData = new FormData();
        formData.append('app_code', 'integrateapp');
        formData.append('app_version', this.state.appVersion);
        formData.append('os_name', Platform.OS);
        formData.append('os_version', Platform.Version);
        formData.append('model', DeviceInfo.getBrand());
        formData.append('resolution', SCREEN_HEIGHT + 'x' + SCREEN_WIDTH);
        formData.append('app_version', this.state.appVersion);        
        formData.append('ask_type', this.state.selectTheme);
        formData.append('category', 2); // 1:문의사항, 2:해커스에바란다, 3:게시판 신설요청
        formData.append('user_name', this.state.user_name);
        formData.append('user_email', this.state.user_email + '@' + (this.state.selectDomain === '직접입력' ? this.state.selectDomainText : this.state.selectDomain));
        formData.append('user_tel', "");
        formData.append('user_id', "" );
        formData.append('user_title', this.state.user_content);
        formData.append('user_content', this.state.user_content);
        formData.append('user_interest_code', this.state.attentionSelectCode);
        formData.append('user_interest_name', this.state.attentionSelectName);


        if(this.state.file_uid.length > 0) {
            this.state.file_uid.map((value) => {
                formData.append('file_uid[]', value)
            })
        }

        //console.log('formData', formData)
        await CommonUtil.callAPI( DEFAULT_CONSTANTS.requestToHackersDomain,{
            method: 'POST', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'multipart/form-data'
            }), 
            body:formData
        },10000
        ).then(response => {
            this.setState({loading:false})    
            if ( response.result ) {
                const alerttoast = Toast.show(response.msg);                
                setTimeout(() => {
                    Toast.hide(alerttoast);                     
                }, 2000)
                this.props.navigation.goBack()
            }else{
                this.failCallAPi()
            }
        })
        .catch(err => {
            console.log('login error => ', err);
            this.failCallAPi()
        });
    }

    failCallAPi = () => {
        const alerttoast = Toast.show('처리중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요');
        setTimeout(() => {
            Toast.hide(alerttoast); 
            this.setState({loading:false})    
        }, 2000)
    }
    

    renderVideoUpload (){        
        return (
            <View style={{
                flex: 1,
                flexGrow: 1,
                flexDirection: 'row'
            }}>
                {
                    this.state.moviearray &&
                    <View style={{
                        flex:1,
                        width:(SCREEN_WIDTH - 16 - 8) / 4 - 8,
                        height: (SCREEN_WIDTH - 16 - 8) / 4 - 8,
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        marginRight: 8,
                        borderWidth: 1,
                        borderColor:'#ccc',
                        overflow:'hidden'
                    }}>
                        <View style={{
                            position: 'absolute',
                            width: 24,
                            height: 24,
                            zIndex: 2,
                            borderColor: '#ccc',
                            backgroundColor: 'transparent'
                        }}>
                            <TouchableOpacity
                                onPress={() => this.setState({moviearray: null, attachFileSize: 0})}
                                >
                                <Image
                                    source={require('../../../assets/icons/btn_cs_img_file_del.png')}
                                    resizeMode='cover'
                                    style={{ width: "100%", height: '100%' }}
                                />
                            </TouchableOpacity>
                        </View>
                        <Image
                            source={{ uri: this.state.moviethumb }}
                            resizeMode='cover'
                            style={{
                                width: "100%",
                                height: '100%', }}
                            />
                    </View>
                        
                }

                { this.state.moviearray ===  null &&
                    <TouchableOpacity 
                        onPress={() => this.toggleSelectVideoModal()/*this.handleChooseVideo()*/}
                        style={{
                            flex: 1,
                            width: (SCREEN_WIDTH - 16 - 8) / 4 - 8,
                            height: (SCREEN_WIDTH - 16 - 8) / 4 - 8,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: 5,
                        }}
                        >
                        <Image
                            source={require('../../../assets/icons/btn_cs_img_file_add_wh.png')}
                            style={{width:'100%',height:'100%'}}
                        />
                    </TouchableOpacity>
                }
            </View>
        )
    }

    renderImageUpload (){        
        return (
            <View style={{flex:1,flexGrow:1,flexDirection:'row'}}>
                {
                    this.state.photoarray.map((data, index) => {
                        return (                
                            <View style={{
                                flex: 1,
                                width: (SCREEN_WIDTH - 16 - 8) / 4 - 8,
                                height: (SCREEN_WIDTH - 16 - 8) / 4 - 8,
                                justifyContent: 'flex-end',
                                alignItems: 'flex-end',
                                marginRight: 8,
                                borderWidth: 1,
                                borderColor: '#ccc',
                                overflow: 'hidden',
                            }} key={index}>
                                <View style={{
                                    position: 'absolute',
                                    width: 24,
                                    height: 24,
                                    zIndex: 2,
                                    borderColor: '#ccc',
                                    backgroundColor: 'transparent'
                                    }}>
                                    <TouchableOpacity
                                        onPress={() => this.removeAttachImage(index)}
                                        >
                                        <Image
                                            source={require('../../../assets/icons/btn_cs_img_file_del.png')}
                                            resizeMode='cover'
                                            style={{ width: "100%", height: '100%' }}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Image
                                    source={{ uri: data.uri }}
                                    resizeMode='cover'
                                    style={{ width: "100%", height: '100%' }}
                                />                        
                            </View>
                        )}
                    )
                }

                {this.state.photoarray.length < 4 &&
                    <TouchableOpacity 
                        onPress={() => this.handleChoosePhoto()}
                        style={{
                            flex: 1,
                            width: (SCREEN_WIDTH - 16 - 8) / 4 - 8,
                            height: (SCREEN_WIDTH - 16 - 8) / 4 - 8,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: 5,
                        }}>
                        <Image
                            source={require('../../../assets/icons/btn_cs_img_file_add_wh.png')}
                            style={{width:'100%',height:'100%'}}
                        />
                    </TouchableOpacity>
                }
            </View>
        )
    }

    toggleSelectVideoModal = () => {
        this.setState({
            showSelectVideoModal: !this.state.showSelectVideoModal,
            isBackdrop: false,
        })
    }

    renderSelectVideoModal = () => {
        return(
            <Modal
                style={styles.commonModalContainer}
                animationType="slide"
                transparent={true}
                // 파이어 시점 확인!!!!
                onRequestClose={() => {
                    console.log('onRequestClose()', 'CALL')
                    this.setState({
                        showSelectVideoModal:false,
                        isBackdrop: true,
                    })
                }}
                onBackdropPress={() => {
                    console.log('onBackdropPress()', 'CALL')
                    this.setState({
                        showSelectVideoModal:false,
                        isBackdrop: true,
                    })
                }}
                animationInTiming={300}
                animationOutTiming={300}
                //useNativeDriver={true}
                hideModalContentWhileAnimating
                isVisible={this.state.showSelectVideoModal}
                backdropOpacity={0.3}
                onModalHide={() => {
                    console.log('onModalHide()', 'CALL')
                    if(!this.state.isBackdrop) {
                        if (this.state.selectVideoUsingCamera) {
                            setTimeout(
                                () => {
                                    this.handleChooseVideoUsingCamera()
                                }, 500)
                        } else {
                            setTimeout(
                                () => {
                                    this.handleChooseVideoUsingLibrary()
                                }, 500)
                        }
                    }
                }}
                >

                <View style={[styles.modalSelectVideoContainer]}>
                    <View style={styles.modalSelectVideoWrapper}>
                        <View style={styles.modalSelectVideoContent}>
                            {/*
                            <Text onPress={() => this.handleChooseVideoUsingCamera()}>이거슨 카메라 선택 모달!!!</Text>
                            <Text onPress={() => this.handleChooseVideoUsingLibrary()}>이거슨 업로드 선택 모달!!!</Text>
                            */}
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity
                                    style={{
                                        flex: 6,
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                    }}
                                    onPress={() => {
                                        this.setState({
                                            selectVideoUsingCamera: true,
                                            showSelectVideoModal: false
                                        })

                                        //this.handleChooseVideoUsingCamera()
                                    }}
                                >
                                    <Image
                                        style={{
                                            width: 48,
                                            height: 48,
                                        }}
                                        source={require('../../../assets/icons/icon_cs_camera.png')}
                                    />
                                </TouchableOpacity>
                                <View style={{
                                    flex: 4,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <CustomTextM
                                        style={{
                                            color: '#343434',
                                            fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
                                            lineHeight: DEFAULT_TEXT.body_14 * 1.42,
                                        }}>
                                        카메라
                                    </CustomTextM>
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity
                                    style={{
                                        flex: 6,
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                    }}
                                    onPress={() => {
                                        this.setState({
                                            selectVideoUsingCamera: false,
                                            showSelectVideoModal: false
                                        })

                                        //this.handleChooseVideoUsingLibrary()
                                    }}
                                    >
                                    <Image
                                        style={{
                                            width: 48,
                                            height: 48,
                                        }}
                                        source={require('../../../assets/icons/icon_cs_gallery.png')}
                                    />
                                </TouchableOpacity>
                                <View style={{
                                    flex: 4,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <CustomTextM
                                        style={{
                                            color: '#343434',
                                            fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
                                            lineHeight: DEFAULT_TEXT.body_14 * 1.42,
                                        }}>
                                        갤러리
                                    </CustomTextM>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    render() {
        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}>
                    <ActivityIndicator size="large" />
                    <Text>등록중입니다. 잠시만 기다려 주십시요.</Text>
                </View>
            )
        }else {
            return(
                <View style={ styles.container }>
                    { Platform.OS == 'android' && <StatusBar backgroundColor={DEFAULT_COLOR.input_bg_color} translucent={false}  barStyle="dark-content" />}                    
                    <ScrollView>
                        <View style={{
                            flexDirection:'row',
                            paddingVertical:20,
                            paddingHorizontal:15,
                            justifyContent: 'flex-end',
                        }}>
                            <View style={{
                                //flex: 5,
                                width: (SCREEN_WIDTH - 30 - 20) * 0.7,
                                marginRight: 10,
                            }}>
                                {/*
                                <TextRobotoB style={styles.title}>해커스에 바란다</TextRobotoB>
                                <Text style={styles.subtitle}>해커스 어플을 사용하며 좋은{'\n'}제안이나 오류,불편한 점을 보내 주세요.</Text>
                                */}
                                <Image
                                    source={require('../../../assets/icons/img_cs_title.png')}
                                    style={{width:'100%', height: (SCREEN_WIDTH - 30 - 20) * 0.3,}}
                                />
                            </View>
                            <View style={{
                                //flex: 2,
                                width: (SCREEN_WIDTH - 30 - 20) * 0.3,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginLeft: 10,
                            }}>
                                <Image 
                                    source={require('../../../assets/icons/img_cs_illust.png')}
                                    style={{width:'100%', height: (SCREEN_WIDTH - 30 - 20) * 0.3,}}
                                    />
                            </View>
                        </View>

                        <View style={{paddingVertical:5}}>
                            <Input
                                placeholder='이름'
                                inputContainerStyle={styles.inputAble}
                                onChangeText={text => this.setState({user_name : text })}
                                inputStyle={{
                                    paddingLeft: 15,
                                    paddingRight: 15,
                                    color: '#343434',
                                    fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
                                    lineHeight: DEFAULT_TEXT.body_14 * 1.42,
                                }}
                            />
                        </View>
                        <View style={{flexDirection:'row',paddingVertical:5}}>
                            <View style={{flex:1}}>
                                <Input 
                                    placeholder='이메일'
                                    value={this.state.email}
                                    inputContainerStyle={styles.inputAble}
                                    inputStyle={{color:DEFAULT_COLOR.base_color_ccc}}
                                    onChangeText={text => this.setState({user_email : text })}
                                    inputStyle={{
                                        paddingLeft: 15,
                                        paddingRight: 15,
                                        color: '#343434',
                                        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
                                        lineHeight: DEFAULT_TEXT.body_14 * 1.42,
                                    }}
                                />
                            </View>
                            <View style={{flex:0.1,justifyContent:'center',alignItems:'center'}}>
                                <CustomTextR style={{
                                    color: '#343434',
                                    fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
                                    lineHeight: DEFAULT_TEXT.body_14 * 1.42,
                                }}>
                                    @
                                </CustomTextR>
                            </View>
                            <View style={{flex:1}}>
                                { this.state.selectDomain === '직접입력'                             
                                    ?
                                    <Input    
                                        placeholder={this.state.selectDomain}
                                        value={this.state.selectDomainText}
                                        onChangeText={(text) => this.setState({ selectDomainText: text })}
                                        inputContainerStyle={styles.inputAble}
                                        inputStyle={{
                                            paddingLeft: 15,
                                            paddingRight: 15,
                                            color: '#8e8e8e',
                                            fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
                                            lineHeight: DEFAULT_TEXT.body_14 * 1.42,
                                        }}
                                    />
                                    :
                                    <Input
                                        readonly                                    
                                        value={this.state.selectDomain}
                                        inputContainerStyle={styles.inputDisable}
                                        inputStyle={{
                                            paddingLeft: 15,
                                            paddingRight: 15,
                                            color: '#8e8e8e',
                                            fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
                                            lineHeight: DEFAULT_TEXT.body_14 * 1.42,
                                        }}
                                    />
                                }
                                
                            </View>                  
                        </View>

                        <View style={{
                            marginTop:5,
                            marginHorizontal:10,
                            borderWidth:1,
                            borderColor:DEFAULT_COLOR.input_border_color,
                            borderRadius:5,
                            flexDirection:'row',}}>
                            <View style={{
                                flex: 7,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <SelectType
                                    isSelectSingle
                                    style={{borderWidth:0,justifyContent:'center'}}
                                    selectedTitleStyle={{
                                        color: '#343434',
                                        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
                                        lineHeight: DEFAULT_TEXT.body_14 * 1.42,
                                    }}
                                    colorTheme={DEFAULT_COLOR.lecture_base}
                                    popupTitle="메일 도메인을 선택해주세요"
                                    title={'직접입력'}
                                    showSearchBox={false}
                                    cancelButtonText="취소"
                                    selectButtonText="선택"
                                    data={this.state.mockData1}
                                    onSelect={data => {
                                        this.selectFilter(data)
                                    }}
                                    onRemoveItem={data => {
                                        this.state.mockData1[4].checked = true;
                                    }}
                                    initHeight={SCREEN_HEIGHT * 0.5}
                                />
                            </View>
                            <View
                                style={{
                                    flex:1,
                                    justifyContent:'center',
                                    alignItems:'center',
                                }}>
                                {/*<Icon name="down" size={10} color="#e9ebed" />btn_more_open*/}
                                <Image
                                    style={{
                                        width: 10,
                                        height: 5,
                                    }}
                                    source={require('../../../assets/icons/btn_more_open.png')}
                                />
                            </View>
                        </View>

                        <View style={{paddingTop:30, paddingBottom:10,paddingHorizontal:15,}}>
                            <CustomTextB style={{
                                color: '#8c8c8c',
                                fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12),
                                lineHeight: DEFAULT_TEXT.body_12 * 1.42,
                            }}>
                                이용 관심분야
                            </CustomTextB>
                        </View>
                        {/** 기존 **/}
                        {/*
                        <View style={{flex:1,flexDirection:'row',marginHorizontal:10}}>
                            <View style={{flex:5,paddingVertical:5,paddingHorizontal:10}}>
                                {  this.state.attentionSelectCode === null
                                ?
                                    <Text style={{
                                        color:DEFAULT_COLOR.lecture_base,
                                        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14)}}
                                    >
                                        선택버튼을 클릭해주세요
                                    </Text>
                                :
                                    <Text style={{
                                        color: this.state.attentionSelectRGB
                                                ? this.state.attentionSelectRGB
                                                :  DEFAULT_COLOR.lecture_base,
                                        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
                                        marginRight:10}}
                                    >
                                        {this.state.attentionSelectName}
                                    </Text>
                                }
                            </View>
                            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                <TouchableOpacity 
                                    style={{paddingVertical:5,paddingHorizontal:10,alignContent:'center',justifyContent:'center',borderWidth:1,borderColor:DEFAULT_COLOR.base_color_ccc,borderRadius:5}}
                                    onPress={()=>this._topShowModal()}
                                >
                                    <Text style={{
                                        color:DEFAULT_COLOR.base_color_222,
                                        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12)}}>선택</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        */}
                        {/** 수정 **/}
                        <View style={{
                            flex:1,
                            marginTop:5,
                            marginHorizontal:10,
                            borderWidth:1,
                            borderColor:DEFAULT_COLOR.input_border_color,
                            borderRadius:5,
                            flexDirection:'row',}}>
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: 45,
                                borderRadius: 2,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 4
                            }}>
                                <TouchableOpacity
                                    onPress={() => this._topShowModal()}
                                    style={{flex: 7, marginLeft: 15,}}
                                    >
                                    {
                                        this.state.attentionSelectCode === null
                                            ?
                                                <Text style={{
                                                    color: '#343434',
                                                    fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
                                                    lineHeight: DEFAULT_TEXT.body_14 * 1.42,
                                                }}
                                                >
                                                    관심분야를 선택해주세요
                                                </Text>
                                        :
                                        <Text style={{
                                            color: this.state.attentionSelectRGB
                                                ? this.state.attentionSelectRGB
                                                :  DEFAULT_COLOR.lecture_base,
                                            fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
                                            marginRight:10}}
                                        >
                                            {this.state.attentionSelectName}
                                        </Text>
                                    }
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{
                                        flex:1,
                                        justifyContent:'center',
                                        alignItems:'center',
                                    }}
                                    onPress={() => this._topShowModal()}
                                    >
                                    {/*<Icon name="down" size={10} color="#e9ebed" />btn_more_open*/}
                                    <Image
                                        style={{
                                            width: 10,
                                            height: 5,
                                        }}
                                        source={require('../../../assets/icons/btn_more_open.png')}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/*
                            <View style={{flex:5,paddingVertical:5,paddingHorizontal:10}}>
                                {  this.state.attentionSelectCode === null
                                    ?
                                    <Text style={{
                                        color:DEFAULT_COLOR.lecture_base,
                                        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14)}}
                                    >
                                        선택버튼을 클릭해주세요
                                    </Text>
                                    :
                                    <Text style={{
                                        color: this.state.attentionSelectRGB
                                            ? this.state.attentionSelectRGB
                                            :  DEFAULT_COLOR.lecture_base,
                                        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
                                        marginRight:10}}
                                    >
                                        {this.state.attentionSelectName}
                                    </Text>
                                }
                            </View>
                            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                <TouchableOpacity
                                    style={{paddingVertical:5,paddingHorizontal:10,alignContent:'center',justifyContent:'center',borderWidth:1,borderColor:DEFAULT_COLOR.base_color_ccc,borderRadius:5}}
                                    onPress={()=>this._topShowModal()}
                                >
                                    <Text style={{
                                        color:DEFAULT_COLOR.base_color_222,
                                        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12)}}>선택</Text>
                                </TouchableOpacity>
                            </View>
                            */}
                        </View>
                        <View style={{paddingTop: 30, paddingBottom:10,paddingHorizontal:15}}>
                            <CustomTextB style={{
                                color: '#8c8c8c',
                                fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12),
                                lineHeight: DEFAULT_TEXT.body_12 * 1.42,
                            }}>
                                문의 내용
                            </CustomTextB>
                        </View>
                        {/** 기존 **/}
                        {/*
                        <View style={{marginHorizontal:10,borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:5,flexDirection:'row'}}>
                            <View style={{flex:5}} >
                                <SelectType
                                    isSelectSingle
                                    style={{borderWidth:0,justifyContent:'center'}}
                                    selectedTitleStyle={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),color:DEFAULT_COLOR.base_color_ccc,fontWeight:'bold',letterSpacing:-1.5}}
                                    colorTheme={DEFAULT_COLOR.lecture_base}
                                    popupTitle="문의하실 타입을 선택해 주세요"
                                    title={'직접입력'}
                                    showSearchBox={false}
                                    cancelButtonText="취소"
                                    selectButtonText="선택"
                                    data={this.state.mockData2}
                                    onSelect={data => {
                                        this.selectFilter2(data)
                                    }}
                                    onRemoveItem={data => {
                                        this.state.mockData2[0].checked = true;
                                    }}                                
                                /> 
                            </View>
                            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                <Icon name="down" size={20} color="#ccc" />
                            </View>


                            <View
                                style={{
                                    flex:1,
                                    justifyContent:'center',
                                    alignItems:'center',
                                }}>
                                <Image
                                    style={{
                                        width: 10,
                                        height: 5,
                                    }}
                                    source={require('../../../assets/icons/btn_more_open.png')}
                                />
                            </View>
                        </View>
                        */}


                        <View style={{
                            marginTop:5,
                            marginHorizontal:10,
                            borderWidth:1,
                            borderColor:DEFAULT_COLOR.input_border_color,
                            borderRadius:5,
                            flexDirection:'row',}}>
                            <View style={{
                                flex: 7,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <SelectType
                                    isSelectSingle
                                    style={{borderWidth:0,justifyContent:'center'}}
                                    selectedTitleStyle={{
                                        color: '#343434',
                                        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
                                        lineHeight: DEFAULT_TEXT.body_14 * 1.42,
                                    }}
                                    colorTheme={DEFAULT_COLOR.lecture_base}
                                    popupTitle="문의하실 타입을 선택해 주세요"
                                    title={'직접입력'}
                                    showSearchBox={false}
                                    cancelButtonText="취소"
                                    selectButtonText="선택"
                                    data={this.state.mockData2}
                                    onSelect={data => {
                                        this.selectFilter2(data)
                                    }}
                                    onRemoveItem={data => {
                                        this.state.mockData2[0].checked = true;
                                    }}
                                    initHeight={SCREEN_HEIGHT * 0.3}
                                />
                            </View>
                            <View
                                style={{
                                    flex:1,
                                    justifyContent:'center',
                                    alignItems:'center',
                                }}>
                                {/*<Icon name="down" size={10} color="#e9ebed" />btn_more_open*/}
                                <Image
                                    style={{
                                        width: 10,
                                        height: 5,
                                    }}
                                    source={require('../../../assets/icons/btn_more_open.png')}
                                />
                            </View>
                        </View>

                        <View style={{marginHorizontal:10,marginTop:5,marginBottom:25,paddingVertical:5}}>
                            <TextInput
                                style={[
                                    styles.inputAble,
                                    {
                                        minHeight:200,
                                        paddingTop: 15.8,
                                        paddingBottom: 15.8,
                                        paddingLeft: 17.8,
                                        paddingRight: 17.8,
                                        textAlignVertical: 'top',
                                        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
                                    }]}
                                placeholder="문의 팁:
문제 사항에 대한 스크린샷 혹은 동영상을 첨부해 주시면
보다 빠른 확인이 가능합니다."
                                onChangeText={text=>this.setState({user_content:text})}
                                multiline={true}
                                clearButtonMode='always'
                            />
                        </View>   
                        <View style={styles.commonHr1}></View>
                        <View style={{paddingVertical:10}}>
                            <View style={{height:50,borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1}}>
                                <View style={{flex:1,flexDirection:'row',}}>
                                    <TouchableOpacity 
                                        onPress={()=>this.selectSampleKeyword(true)}
                                        style={this.state.selectedSample ? styles.sampleWrapperOn: styles.sampleWrapper}                                
                                        >
                                        <CustomTextM style={
                                            this.state.selectedSample
                                                ? styles.smapleTextOn:
                                                styles.smapleText}>
                                            사진
                                        </CustomTextM>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={()=>this.selectSampleKeyword(false)}
                                        style={!this.state.selectedSample ? styles.sampleWrapperOn: styles.sampleWrapper}
                                        >
                                        <CustomTextM style={
                                            !this.state.selectedSample
                                                ? styles.smapleTextOn
                                                : styles.smapleText
                                        }>
                                            동영상
                                        </CustomTextM>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            paddingTop: 10,
                            paddingBottom: 20,
                            paddingLeft: 15,
                            paddingRight: 5,
                        }}>
                            { this.state.selectedSample ?
                                <View style={{
                                    borderBottomColor: DEFAULT_COLOR.input_border_color,
                                    borderBottomWidth: 1,
                                    marginBottom: 10
                                }}>
                                    <ScrollView 
                                        horizontal={true}
                                        ref={(ref) => {
                                            this.ScrollView = ref;
                                        }}
                                    >
                                        {this.renderImageUpload()}
                                    </ScrollView>
                                    <View style={{flexGrow:1,flexDirection:'row',marginTop:20, marginBottom:15}}>
                                        <View style={{
                                            //flex:4,
                                            //paddingRight:5,
                                            justifyContent:'center',
                                            width: (SCREEN_WIDTH - 16 - 8) / 4 * 3,
                                        }}>
                                            <View style={{height:3,width:'100%',backgroundColor:DEFAULT_COLOR.input_bg_color}}>
                                                <View style={{
                                                    height:3,
                                                    width:(
                                                        this.state.attachFileSize > 0
                                                            ? parseInt(this.state.attachFileSize/1024/1024)
                                                            : 0
                                                    ) / 50 * 100 + '%',
                                                    backgroundColor: DEFAULT_COLOR.input_border_color
                                                }}
                                                >
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{
                                            //flex: 1,
                                            flexDirection: 'row',
                                            justifyContent:'flex-end',
                                            //lignItems: 'center',
                                            //justifyContent: 'center',
                                            paddingRight: 8,
                                            width: (SCREEN_WIDTH - 16 - 8) / 4 * 1,
                                        }}>
                                            <CustomTextM style={{
                                                color:DEFAULT_COLOR.base_color_666,
                                                fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12),
                                                lineHeight: DEFAULT_TEXT.body_12 * 1.42,
                                            }}
                                            >
                                                {this.state.attachFileSize > 0 ? (this.state.attachFileSize/1024/1024).toFixed(1) : 0}/
                                            </CustomTextM>
                                            <CustomTextM style={{
                                                color: '#aaaaaa',
                                                fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12),
                                                lineHeight: DEFAULT_TEXT.body_12 * 1.42,
                                            }}
                                            >
                                                50MB
                                            </CustomTextM>
                                        </View>
                                    </View>
                                </View>
                                :
                                <View style={{
                                    borderBottomColor: DEFAULT_COLOR.input_border_color,
                                    borderBottomWidth: 1,
                                    marginBottom: 10,}}>
                                    <ScrollView
                                        horizontal={true}
                                        ref={(ref) => {
                                            this.ScrollView = ref;
                                        }}>
                                        {this.renderVideoUpload()}
                                    </ScrollView>
                                    {/* this.state.selectedSample  &&
                                    <View style={{flexGrow:1,flexDirection:'row',marginBottom:10}}>
                                        <View style={{flex:4,alignItems:'flex-start',paddingRight:5}}>
                                            
                                        </View>
                                        <View style={{flex:1,alignItems:'flex-end',paddingLeft:5}}>
                                            <Text style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12)}}>
                                                {this.state.attachFileSize > 0 ? parseInt(this.state.attachFileSize/1024/1024) : 0}/50MB
                                            </Text>
                                        </View>
                                    </View>
                                    */}
                                    <View style={{flexGrow:1,flexDirection:'row',marginTop:20, marginBottom:15}}>
                                        <View style={{
                                            //flex:4,
                                            //paddingRight:5,
                                            justifyContent:'center',
                                            width: (SCREEN_WIDTH - 16 - 8) / 4 * 3,
                                        }}>
                                            <View style={{height:3,width:'100%',backgroundColor:DEFAULT_COLOR.input_bg_color}}>
                                                <View style={{
                                                    height:3,
                                                    width:(
                                                        this.state.attachFileSize > 0
                                                            ? parseInt(this.state.attachFileSize/1024/1024)
                                                            : 0
                                                    ) / 50 * 100 + '%',
                                                    backgroundColor: DEFAULT_COLOR.input_border_color
                                                }}
                                                >
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{
                                            //flex: 1,
                                            flexDirection: 'row',
                                            justifyContent:'flex-end',
                                            //lignItems: 'center',
                                            //justifyContent: 'center',
                                            paddingRight: 8,
                                            width: (SCREEN_WIDTH - 16 - 8) / 4 * 1,
                                        }}>
                                            <CustomTextM style={{
                                                color:DEFAULT_COLOR.base_color_666,
                                                fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12),
                                                lineHeight: DEFAULT_TEXT.body_12 * 1.42,
                                            }}
                                            >
                                                {this.state.attachFileSize > 0 ? (this.state.attachFileSize/1024/1024).toFixed(1) : 0}/
                                            </CustomTextM>
                                            <CustomTextM style={{
                                                color: '#aaaaaa',
                                                fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12),
                                                lineHeight: DEFAULT_TEXT.body_12 * 1.42,
                                            }}
                                            >
                                                50MB
                                            </CustomTextM>
                                        </View>
                                    </View>
                                </View>
                            }
                            
                            <CustomTextR style={{
                                color: '#c0c0c0',
                                fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12),
                                lineHeight: DEFAULT_TEXT.body_12 * 1.42,
                                paddingVertical: 10,
                                //paddingBottom: 10,
                            }}>
                                - 첨부파일은 50Mbyte까지 등록 가능합니다.{"\n"}
                                {" "}* 사진파일 : 최대 4개{"\n"}
                                {" "}* 영상파일 : 최대 1개{"\n"}
                                - 사진과 동영상을 동시에 업로드 할 수 없습니다.{"\n"}
                                - 파일 형식은 jpg,gif,png,tif,mp4,m4v,avi,asf, wmv, mkv, ts, mpg, mpeg, mov, flv, ogv만 가능합니다{"\n"}
                                - 3G/LTE 환경에서는 사진 용량에 따라 과도한 요금이 부과될 수 있습니다.
                            </CustomTextR>
                        </View>
                        <View style={styles.commonHr1}></View>
                        <View style={{
                            paddingHorizontal: 15,
                        }}>
                            <DropDown                            
                                style={styles.agreeWapper}
                                contentVisible={false}
                                invisibleImage={IC_ARR_DOWN}
                                visibleImage={IC_ARR_UP}
                                header={
                                <View style={{
                                    paddingTop: 5,
                                    flexDirection: 'row',
                                    flexGrow: 1
                                }}>
                                    <View style={{paddingVertical:10}}>
                                        <CheckBox 
                                            containerStyle={{padding:0,margin:0}}   
                                            //iconType='font-awesome'
                                            //checkedIcon='check'
                                            //uncheckedIcon='check'
                                            checkedIcon={
                                                <Image
                                                    style={{
                                                        width: 23,
                                                        height: 23,
                                                    }}
                                                    source={require('../../../assets/icons/btn_check_on.png')
                                                }/>
                                            }
                                            uncheckedIcon={
                                                <Image
                                                    style={{
                                                        width: 23,
                                                        height: 23,
                                                    }}
                                                    source={require('../../../assets/icons/btn_check_off.png')
                                                    }/>
                                            }
                                            checkedColor={DEFAULT_COLOR.lecture_base}
                                            uncheckedColor={DEFAULT_COLOR.input_border_color}
                                            onPress= {()=> {
                                                this.state.agreeCheck.checked = !this.state.agreeCheck.checked
                                                this.setState({loading:false})
                                            }}
                                            checked={this.state.agreeCheck.checked}
                                        />
                                    </View>
                                    <View style={{paddingVertical:10,justifyContent:'center'}}>
                                        <CustomTextM style={{
                                            color: '#343434',
                                            fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
                                            lineHeight: DEFAULT_TEXT.body_14 * 1.42,
                                        }}>
                                            개인정보 수집 및 이용동의(필수)
                                        </CustomTextM>
                                    </View>
                                </View>
                                }
                            >
                                <View style={{width:SCREEN_WIDTH-33 ,backgroundColor:DEFAULT_COLOR.input_bg_color,padding:20}}>
                                    <CustomTextR style={{
                                        color: '#8e8e8e',
                                        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12),
                                        lineHeight: DEFAULT_TEXT.body_12 * 1.42,
                                    }}>
                                        1. 개인정보 수집/이용 목적{"\n"}
                                        ‘해커스에 바란다’ 문의 사항 접수 및 답변 안내{"\n"}
                                        2. 개인정보 수집항목{"\n"}
                                        해커스 통합회원 아이디, 이메일주소{"\n"}
                                        3. 개인정보 이용 기간{"\n"}
                                        수집 목적 달성 시 또는 이용자의 삭제요청 시까지{"\n"}
                                        * 이용자는 개인정보 수집/ 이용에 동의하지 않을 수 있습니다.{"\n"}
                                        단, 동의 거부 시 해당 서비스 이용이 제한됩니다.
                                    </CustomTextR>
                                </View>                                
                            </DropDown>
                        </View>
                        <View style={{
                            paddingTop: 12,
                            paddingBottom: 20,
                            paddingHorizontal:15
                        }}>
                            {/*
                            <Button
                                //disabled={this.state.photoarray.length > 0 ? false : true }
                                title="보내기"
                                buttonStyle={{backgroundColor:DEFAULT_COLOR.lecture_base}}
                                onPress={()=>this.registStart()}
                            />
                            */}
                            <TouchableOpacity
                                style={{
                                    height: 48,
                                    width: SCREEN_WIDTH - 30,
                                    backgroundColor: DEFAULT_COLOR.lecture_base,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 4,
                                }}
                                onPress={() => this.registStart()}>
                                <CustomTextM
                                    style={{
                                        color: DEFAULT_COLOR.base_color_fff,
                                        fontSize: PixelRatio.roundToNearestPixel(16),
                                        lineHeight: 16 * 1.42,
                                    }}>
                                    보내기
                                </CustomTextM>
                            </TouchableOpacity>
                        </View>
                        {/*
                        <View style={{paddingVertical:10,paddingHorizontal:15}}>
                            <Button
                                //disabled={this.state.photoarray.length > 0 ? false : true }
                                title="앱 실행"
                                buttonStyle={{backgroundColor:DEFAULT_COLOR.lecture_base}}
                                onPress={()=>this.executeApp()}
                            />
                        </View>
                        */}
                        <View style={{
                            //margin: 10,
                            padding: 20,
                            paddingBottom: 40,
                            //marginBottom: 100,
                            backgroundColor: '#EEEEEE',
                            //flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <CustomTextR style={{
                                color: '#9f9f9f',
                                fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12),
                                lineHeight: DEFAULT_TEXT.body_12 * 1.42,
                            }}>
                                문의 내용에 대한 답변은 입력한 이메일 주소로 보내드립니다.{"\n"}
                                상세한 문의는 <CustomTextR style={{
                                    color: '#343434',
                                    fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12),
                                    lineHeight: DEFAULT_TEXT.body_12 * 1.42,
                            }} onPress={() => Linking.openURL('mailto:app1@hackers.com')}>app1@hackers.com</CustomTextR> 으로 메일 부탁 드립니다.
                            </CustomTextR>
                        </View>
                    </ScrollView>
                    {/* 여기서부터 검색필터 영역 */}
                    <Modal
                            onBackdropPress={this._topCloseModal}
                            animationType="slide"
                            //transparent={true}
                            onRequestClose={() => {
                                this.setState({topShowModal:false})
                            }}
                            onBackdropPress={() => {
                                this.setState({topShowModal:false})
                            }}
                            style={{justifyContent: 'flex-end',margin: 0}}
                            useNativeDriver={true}
                            animationInTiming={300}
                            animationOutTiming={300}
                            hideModalContentWhileAnimating                    
                            isVisible={this.state.topShowModal}
                        >
                            
                            <Animated.View style={[styles.modalContainer,{ height: this.topAnimatedHeight }]}>
                                <InterestSelect screenState={this.state} screenProps={this.props} />
                            </Animated.View>
                            
                        </Modal>
                    {this.renderSelectVideoModal()}
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
        width:SCREEN_WIDTH,
        height : SCREEN_HEIGHT,        
        alignItems: 'center',
        justifyContent: 'center',
    },
    commonHr1 : {
        backgroundColor:'#ebebeb',height:10
    },
    title : {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(32),
        //fontWeight:'bold',
        lineHeight: 32 * 1.42,
        marginBottom:10
    },
    subtitle : {
        color: DEFAULT_COLOR.base_color_666,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),
    },
    inputDisable : {
        borderWidth:1,borderColor:'#fff',borderRadius:5,backgroundColor:'#f7f7f7'
    },
    inputAble : {
        borderWidth:1,borderColor:'#fff',borderRadius:5,backgroundColor:DEFAULT_COLOR.input_bg_color
    },
    agreeWapper : {
        flex:1
    },
    sampleWrapper : {
        flex:1,alignItems:'center',justifyContent:'center'
    },
    sampleWrapperOn :{
        flex:1,borderBottomColor:DEFAULT_COLOR.lecture_base,borderBottomWidth:2,alignItems:'center',justifyContent:'center'
    },
    smapleText : {
        color: '#aab7c0',
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
        lineHeight: DEFAULT_TEXT.body_14 * 1.42,
    },
    smapleTextOn : {
        color:DEFAULT_COLOR.lecture_base,
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
        lineHeight: DEFAULT_TEXT.body_14 * 1.42,
    },

    /* modal search filter */
    filterWrapper : {
        flex :1, 
        flexDirection:'row',       
        padding : 10,
        alignItems:'center',
        justifyContent:'center',
        borderBottomColor : '#ebebeb',
        borderBottomWidth:1
    },
    filterWrapperPadding : {
        flex:0.2
    },
    filterWrapperLeft : {
        flex:1,paddingVertical:5,overflow:'hidden'
    },
    filterWrapperCenter : {
        flex:1,paddingVertical:5,overflow:'hidden'
    },
    filterWrapperRight : {
        flex:1,paddingVertical:5,overflow:'hidden'
    },
    filterWakuWrapper : {
        flexDirection:'row'
    },
    filterWakuWrapperLeft : {
        flex:5,paddingVertical:5,paddingHorizontal:10
    },
    filterWakuWrapperLeftText  :{
        color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14)
    },
    filterWakuWrapperLeftText2  :{
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12)
    },
    filterWakuWrapperRight : {
        flex:1,alignItems:'center',justifyContent:'center'
    },

   /**** Modal  *******/
   modalContainer: {
    paddingTop: 16, backgroundColor: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8
    },


   /**** SelectVideoModal ****/
   commonModalContainer: {
       justifyContent: 'flex-end',
       margin: 0,
       backgroundColor: 'rgba(0,0,0,0.5)',
   },
   modalSelectVideoContainer: {
       //backgroundColor: 'transparent',
       width: '100%',
       height: '22%',
       borderTopLeftRadius: 10,
       borderTopRightRadius: 10,
   },
    modalSelectVideoBackgrounder: {
        flex: 6,
        //backgroundColor: '#00000055',
    },
    modalSelectVideoWrapper: {
        flex: 4,
        //backgroundColor: '#00000055',
    },
    modalSelectVideoContent: {
        flex: 1,
        flexDirection: 'row',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: DEFAULT_COLOR.base_color_fff,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },

});
/*
update   B_BIZ_PARTNER
set      USAGE_FLAG = 'n'
where    BP_CD 


update   B_BIZ_PARTNER
set      USAGE_FLAG = 'n'
where   BP_CD not exists (
        select
            A.BP_CD
        from 
        (
        select 
            BP_CD as BP_CD
        from a_vat A, b_minor B, b_minor C, b_biz_partner_history D
        where 
        A.ISSUED_DT BETWEEN '2018-01-01' AND '2020-03-31' 
        AND      A.CONF_FG = 'C'  
        AND      B.MAJOR_CD = 'A1003'  
        AND      B.MINOR_CD = A.IO_FG  
        AND      C.MAJOR_CD = 'B9001'  
        AND      C.MINOR_CD = A.VAT_TYPE 
        AND      D.BP_CD = A.BP_CD 
        AND      D.VALID_FROM_DT = (SELECT MAX(VALID_FROM_DT) FROM B_BIZ_PARTNER_HISTORY BP WHERE BP.BP_CD = A.BP_CD AND BP.VALID_FROM_DT <= A.ISSUED_DT)  
        AND      A.IO_FG = 'I'
        union all 
        select c.BP_CD as BP_CD
        from      (
                    select      b.ITEM_ACCT, b.ITEM_CD, a.BP_CD, a.IV_DT
                    from      M_IV_HDR a
                    inner join   M_IV_DTL b
                    on         a.IV_NO = b.IV_NO
                    where      a.IV_DT between '2018-01-01' and '2020-03-31'
                    ) c                     
        left join   M_ITEM_PUR_PRICE d on   c.ITEM_CD = d.ITEM_CD
        ) as A
        group by A.BP_CD
               
        ) and   USAGE_FLAG = 'y'

*/