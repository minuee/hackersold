import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    SafeAreaView,
    View,
    Dimensions,
    TouchableOpacity,
    Image,
    PropsTypes,
    ScrollView,
    Animated,
    PixelRatio,
    ActivityIndicator,
    Platform,
    Alert,
    KeyboardAvoidingView,
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Modal from 'react-native-modal';
import SwipeRow from '../../Utils/SwipeListView/SwipeRow';
import { isIphoneX, getBottomSpace } from "react-native-iphone-x-helper";

import MyMemoWriteModal from './Modal/MyMemoWriteModal';
import MyMemoModifyModal from './Modal/MyMemoModifyModal'
import PickerLecModal from './Modal/PickerLecModal';
import PickerLecKangModal from './Modal/PickerLecKangModal';

import {CustomText, CustomTextB, CustomTextR, TextRobotoR} from "../../Style/CustomText";
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

import {ARTICLE, TARGET} from './Modal/ModalConstant';
import moment from "moment/moment";
import CommonUtil from "../../Utils/CommonUtil";
import CommonFuncion from '../../Utils/CommonFunction';
import {SERVICES} from "../../Constants/Common";
import Toast from "react-native-tiny-toast";
import AsyncStorage from '@react-native-community/async-storage';

// Modal
const HEIGHT_WRITE_MEMO_MODAL       = SCREEN_HEIGHT * 0.95;
const HEIGHT_MODIFY_MEMO_MODAL       = SCREEN_HEIGHT * 0.95;
const HEIGHT_LEC_LIST_MODAL         = SCREEN_HEIGHT * 0.5;
const HEIGHT_LEC_KANG_LIST_MODAL    = SCREEN_HEIGHT * 0.5;

//스와이프
const HEIGHT_SWIPE_ITEM = 100;

const COUNT_RIGHT_SWIPE_BUTTON = 1;
const WIDTH_RIGHT_SWIPE_BUTTON = 65.3;

const COUNT_LEFT_SWIPE_BUTTON = 0;
const WIDTH_LEFT_SWIPE_BUTTON = 65.3;

let targetModifyItem = {};

class MyMemoContent extends Component {
    constructor(props) {
        super(props)
        // SwipeRow Component Ref 배열
        this.targetRows= {}
        this.state = {
            loading: false,
            myClassServiceID: props.myClassServiceID,
            isExistDuplicateMemo: false,

            //isModifyMode: props.myClassMemoModifyMode,
            isSelectAllMode: false,
            pickLecListModal: false,

            disableLeftSwipe: false,
            disableRightSwipe: true,

            showWriteMemoModal: false,
            showModifyMemoModal: false,
            showLecListModal: false,
            showLecKangListModal: false,

            ownLecItems: [],
            ownLecItem: {},
            targetModifyItem: {},

            toggleWriteMemoModal: this.toggleWriteMemoModal.bind(this),
            toggleModifyMemoModal: this.toggleModifyMemoModal.bind(this),
            toggleLecListModal: this.toggleLecListModal.bind(this),
            toggleLecKangListModal: this.toggleLecKangListModal.bind(this),
            setDataLecListModel: this.setDataLecListModel.bind(this),
            setDataLecKangListModel: this.setDataLecKangListModel.bind(this),
            getSelectedLecItemTitle: this.getSelectedLecItemTitle.bind(this),
            getSelectedLecKangItemTitle: this.getSelectedLecKangItemTitle.bind(this),
            onChangeMemoContent: this.onChangeMemoContent.bind(this),
            getDataMemoContent: this.getDataMemoContent.bind(this),
            deleteItemRemote: this.deleteItemRemote.bind(this),
            updateItemRemote: this.updateItemRemote.bind(this),
            updateOwnDuplicateMemoItemRemote: this.updateOwnDuplicateMemoItemRemote.bind(this),
            createItemRemote: this.createItemRemote.bind(this),
            toggleTargetFrom: TARGET.FROM_NONE,
            getLecTargetItemTitle: this.getLecTargetItemTitle.bind(this),
            getLecKangTargetItemTitle: this.getLecKangTargetItemTitle.bind(this),
            getSelectedLecKangItems: this.getSelectedLecKangItems.bind(this),
            closeWriteModal: this.closeWriteModal.bind(this),

            // Write Target
            selectedLecItemMemberClassIdx: -1,
            selectedLecItemMemberLectureIdx: -1,
            typedMemoContent: '',
            targetItems: [],

            memberIdx: 0,
            memoIdx: 0,
        }
    }

    async UNSAFE_componentWillMount() {
        const memberIdx = await CommonUtil.getMemberIdx();
        this.setState({memberIdx: memberIdx}, function() {
            this.getOwnMemoList();
            this.getOwnLectureList();
        });
    }

    UNSAFE_componentWillUnmount() {
        console.log('MyMemoContent > UNSAFE_componentWillUnmount()', 'CALL')
    }

    getOwnMemoList = async(targetFrom = TARGET.FROM_NONE) => {
        const domain = SERVICES[this.props.myClassServiceID].apiDomain;
        const url = domain + '/v1/myClass/memo/' + this.state.memberIdx;

        const options = {
            method: 'GET',
            headers: {
                ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
            },
        };

        await CommonUtil.callAPI(url, options, 10000)
            .then(response => {
                if (response && response.code === '0000') {
                    let targetItems = response.data.memoList;

                    this.setState({
                        targetItems: targetItems,
                    });
                }

                else {
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('메모 목록을 불러오는데 실패 했습니다.');
                }}).catch(error => {
                    console.log('getOwnMemoList()', 'error = ' + JSON.stringify(error) )
                    Toast.show('시스템 에러: 메모 목록을 불러오는데 실패 했습니다.');
            });
    }

    getLecTargetItemTitle = (lecIndex) => {
        for (let lecItem of this.state.ownLecItems) {
            if(lecItem.index == lecIndex) {
                return lecItem.title;
            }
        }
    }

    getLecKangTargetItemTitle = (lecIndex, lecKangIndex) => {
        for (let lecItem of this.state.ownLecItems) {
            if(lecItem.index == lecIndex) {
                for (let lecKangItem of lecItem.lecKangItems) {
                    if(lecKangItem.index == lecKangIndex) {
                        return lecKangItem.title;
                    }
                }
            }
        }
    }

    getNextIndex = () => {
        var maxIndex = 0;
        this.state.targetItems.map((item, index) => {
            if(maxIndex < item.index) {
                maxIndex = item.index;
            }
        });

        return maxIndex + 1;
    }

    createItemRemote = async(content) =>  {

        if(content === '') {
            Alert.alert('', '내용을 입력해주세요.');
            return;
        }

        let tmpSelectedLecItemMemberClassIdx = this.state.selectedLecItemMemberClassIdx;
        let tmpSelectedLecItemMemberLectureIdx = this.state.selectedLecItemMemberLectureIdx;

        var duplicateTargetItems = this.state.targetItems.filter(function(item, newIndex) {
            return item.memberClassIdx == tmpSelectedLecItemMemberClassIdx
                && item.memberLectureIdx == tmpSelectedLecItemMemberLectureIdx;
        })

        if(duplicateTargetItems.length > 0) {
            Alert.alert('', '메모는 각 강좌의 강의 당 1개만 등록 가능합니다.');
            return;
        }

        this.clearQuestionInterval()

        let classIdx;
        let className;

        for (let lecItem of this.state.ownLecItems) {
            if(lecItem.memberClassIdx == this.state.selectedLecItemMemberClassIdx) {
                classIdx = lecItem.classIdx;
                className = lecItem.className;
            }
        }

        const domain = SERVICES[this.props.myClassServiceID].apiDomain;
        const url = domain + '/v1/myClass/memo/' + this.state.memberIdx + '/' + this.state.selectedLecItemMemberClassIdx + '/' + this.state.selectedLecItemMemberLectureIdx;

        console.log('createItemRemote()', 'url = ' + url)

        const formData = new FormData();
        formData.append('memoContent', content);
        formData.append('regDevice', 'mobile');
        formData.append('classIdx', classIdx);
        formData.append('className', className);

        const options = {
            method: 'POST',
            headers: new Headers({
                Accept: 'application/json',
                //'Content-Type': 'application/json; charset=UTF-8',
                'Content-Type': 'multipart/form-data',
                'apiKey': DEFAULT_CONSTANTS.apitestKey
            }),
            body: formData,
        };

        console.log('createItemRemote()', 'apiKey = ' + DEFAULT_CONSTANTS.apiTestDomain)

        await CommonUtil.callAPI(url, options)
            .then(response => {
                console.log('createOwnMemoItem()', JSON.stringify(response))
                if (response && response.code === '0000') {
                    AsyncStorage.removeItem('myMemoTemp');
                    this.getOwnMemoList(TARGET.FROM_CREATE)
                    //this.toggleWriteMemoModal(TARGET.FROM_NONE, true)
                } else {
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('메모장 등록에 실패 했습니다.');
                }}).catch(error => {
                Toast.show('시스템 에러: 메모장 등록에 실패 했습니다.');
            });

        this.toggleWriteMemoModal(TARGET.FROM_CREATE)
    }

    updateItemRemote = async(memoIdx, content) => {
        await this.updateOwnMemoItem(memoIdx, content)
    }

    updateOwnMemoItem = async(memoIdx, content) => {
        const domain = SERVICES[this.props.myClassServiceID].apiDomain;
        const url = domain + '/v1/myClass/memo/' + this.state.memberIdx + '/' + memoIdx;
        const bodyData = JSON.stringify({
            memoContent: content,
        });

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: bodyData,
        };

        await CommonUtil.callAPI(url, options)
            .then(response => {
                console.log('updateOwnMemoItem()', 'response = ' + JSON.stringify(response));

                if (response && response.code === '0000') {
                    this.toggleModifyMemoModal()
                }

                else {
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('메모 수정에 실패 했습니다.');
                }}).catch(error => {
                Toast.show('시스템 에러: 메모 수정에 실패 했습니다.');
            });
    }

    updateOwnDuplicateMemoItemRemote = async(content) => {
        const domain = SERVICES[this.props.myClassServiceID].apiDomain;
        const url = domain + '/v1/myClass/memo/' + this.state.memberIdx + '/' + this.state.memoIdx;
        const bodyData = JSON.stringify({
            memoContent: content,
        });

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: bodyData,
        };

        await CommonUtil.callAPI(url, options)
            .then(response => {
                console.log('updateOwnMemoItem()', 'response = ' + JSON.stringify(response));

                if (response && response.code === '0000') {
                    this.clearQuestionInterval()
                    this.toggleWriteMemoModal()
                }

                else {
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('메모 수정에 실패 했습니다.');
                }}).catch(error => {
                Toast.show('시스템 에러: 메모 수정에 실패 했습니다.');
            });
    }

    deleteItemRemote = async(memoIdx) => {
        Alert.alert('', '삭제하시겠습니까?', [
            {text: '확인', onPress: () => {
                    var selectedTargetItems = [];
                    this.state.targetItems.map((item, index) => {
                        if(item.memoIdx == memoIdx) {
                            selectedTargetItems.push(item.memoIdx)
                        }
                    });
                    this.deleteOwnMemoList(selectedTargetItems)
            }},
            {text: '취소'},
        ]);
    }

    deleteList = async() => {
        var selectedTargetItems = [];
        this.state.targetItems.map((item, index) => {
            if(item.isSelected) {
                selectedTargetItems.push(item.memoIdx)
            }
        });

        if(selectedTargetItems.length == 0) {
            alert('삭제할 항목을 선택해주세요');
            return;
        } else {
            Alert.alert('', '삭제하시겠습니까?', [
                {text: '확인', onPress: () => this.deleteOwnMemoList(selectedTargetItems) },
                {text: '취소'},
            ]);
        }
    }

    deleteOwnMemoList = async(memoIdxList) => {
        // API 호출 및 리스트 갱신
        //console.log('deleteOwnMemoList()', JSON.stringify(memoIdxList))

        const domain = SERVICES[this.props.myClassServiceID].apiDomain;
        const url = domain + '/v1/myClass/memo/' + this.state.memberIdx;

        // 이전, https://stackoverflow.com/a/37562814
        /*
        var details = {
            'memoIdxList': [memoIdxList],
        };

        var bodyData = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            bodyData.push(encodedKey + "=" + encodedValue);
        }
        bodyData = bodyData.join("&");
        */

        // 신규
        const bodyData = JSON.stringify({
            memoIdxList: memoIdxList,
        });

        //console.log('deleteOwnMemoList()', 'body =' + JSON.stringify(bodyData))
        //return

        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: bodyData,
        };
        await CommonUtil.callAPI(url, options)
            .then(response => {
                console.log('deleteOwnMemoList()', 'response = ' + JSON.stringify(response));

                if (response && response.code === '0000') {

                    if(this.state.showModifyMemoModal) {
                        this.setState({ showModifyMemoModal: false })
                    }

                    this.setState({
                        targetItems: [],
                    }, function() {
                        this.getOwnMemoList()
                    })

                }

                else {
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('메모 삭제에 실패 했습니다.');
                }}).catch(error => {
                    Toast.show('시스템 에러: 메모 삭제에 실패 했습니다.');
                });
    }

    setModifyMode = async isModifyMode => {
        await this.props.updateMyClassMemoModifyMode(isModifyMode);
        this.setState({
            isModifyMode: this.props.myClassMemoModifyMode,
        });
    };

    toggleModifyMode = () => {
        if(this.props.myClassMemoModifyMode) {
            var newTargetItems = [];
            this.state.targetItems.map((newItem, newIndex) => {
                newTargetItems.push({...newItem, isSelected: false})
            });

            this.setState({
                disableRightSwipe: true,
                disableLeftSwipe: false,
                targetItems: newTargetItems,
            })

            this.props.updateMyClassMemoModifyMode(false)
            //this.setModifyMode(false)
        } else {
            var newTargetItems = [];
            this.state.targetItems.map((newItem, newIndex) => {
                newItem.isOpened && this.targetRows[newItem.memoIdx].closeRow();
            });

            this.setState({
                disableRightSwipe: true,
                disableLeftSwipe: true,
            })

            this.props.updateMyClassMemoModifyMode(true)
            //this.setModifyMode(true)
        }
    }

    toggleSelectAllMode = () => {
        var isSelectAllMode = this.state.isSelectAllMode
        var newTargetItems = [];

        if(isSelectAllMode) {
            this.state.targetItems.map((item, index) => {
                newTargetItems.push({...item, isSelected: false})
            });
        } else {
            this.state.targetItems.map((item, index) => {
                newTargetItems.push({...item, isSelected: true})
            });
        }

        this.setState({
            targetItems: newTargetItems,
            isSelectAllMode: !isSelectAllMode
        });
    }

    openWriteModal = () => {
        console.log('openWriteModal()', 'START')
        // 초기화 대상
        this.setState({
            typedMemoContent: '',
            selectedLecItemMemberClassIdx: -1, //this.state.classList[0].memberClassIdx,
            selectedLecItemMemberLectureIdx: -1,
        }, function() {
            this.toggleWriteMemoModal();
        })
    };

    closeWriteModal = (targetFrom = TARGET.FROM_NONE) => {
        console.log('closeWriteModal()', 'START')

        if(!CommonUtil.isEmpty(this.state.typedMemoContent)){
            Alert.alert(
                "",
                "작성 중인 내용이 저장되지 않습니다.\n" + "종료하시겠습니까?",
                [
                    {text: '네', onPress: () => {
                            this.clearQuestionInterval(targetFrom)
                            AsyncStorage.removeItem('myMemoTemp');
                            this.setState({
                                selectedLecItemMemberClassIdx: -1,
                                selectedLecItemMemberLectureIdx: -1,
                                typedMemoContent: '',
                            });
                            this.toggleWriteMemoModal(targetFrom)
                        }},
                    {text: '아니오', onPress: () =>  {
                            this.clearQuestionInterval(targetFrom)
                        }}
                ],
                { cancelable: true }
            )
        } else {
            this.clearQuestionInterval(targetFrom)
            this.toggleWriteMemoModal(targetFrom)
        }
    }

    tempSaveProcess = async (targetFrom = TARGET.FROM_NONE) => {
        // const selectedClass = this.state.classList.find(item => item.memberClassIdx === this.state.selectedLecItemMemberClassIdx);
        const selectedClass = this.state.ownLecItems.find(item =>
            item.memberClassIdx === this.state.selectedLecItemMemberClassIdx
        );
        await AsyncStorage.removeItem('myMemoTemp');
        const newData = {
            formMemberIdx: this.state.memberIdx,
            formClassIdx: selectedClass.classIdx,
            formMemberClassIdx: selectedClass.memberClassIdx,
            formMemberLectureIdx : this.state.selectedLecItemMemberLectureIdx,
            formContents: this._MyMemoWriteModal != null ? this._MyMemoWriteModal.getContent() : this.state.typedMemoContent,
        };

        console.log('tempSaveProcess()', 'myMemoTemp = ' + JSON.stringify(newData))

        AsyncStorage.setItem('myMemoTemp', JSON.stringify(newData));
    }

    setQuestionInterval = (targetFrom = TARGET.FROM_NONE) => {
        console.log('setQuestionInterval()', 'SET INTERVAL')
        this.interval = setInterval(
            () => {
                if(!CommonUtil.isEmpty(
                        this._MyMemoWriteModal != null
                            ? this._MyMemoWriteModal.getContent()
                            : this.state.typedMemoContent
                        )) {
                    console.log('setQuestionInterval', 'CALL INTERVAL, SAVE PROCESS')
                    this.tempSaveProcess(targetFrom)
                } else {
                    console.log('setQuestionInterval', 'CALL INTERVAL, BUT MEANLESS')
                }
            },
            30000    // 30초
        );
    }

    clearQuestionInterval = (targetFrom = TARGET.FROM_NONE) => {
        console.log('clearQuestionInterval()', 'CLEAR INTERVAL')
        clearInterval(this.interval);
    }

    getHistory = async (targetFrom) => {
        await AsyncStorage.getItem('myMemoTemp', (error, result) => {
            {
                if(result) {
                    const tempData = JSON.parse(result);
                    Alert.alert(
                        "",
                        "작성 중인 게시글이 있습니다.\n" + "이동하시겠습니까?",
                        [
                            {text: '네', onPress: () => {
                                    this.setState({
                                        typedMemoContent: tempData.formContents,
                                        selectedLecItemMemberClassIdx: tempData.formMemberClassIdx,
                                        selectedLecItemMemberLectureIdx: tempData.formMemberLectureIdx,
                                        showWriteMemoModal: !this.state.showWriteMemoModal,
                                        toggleTargetFrom: targetFrom,
                                    });
                                    this.setQuestionInterval(targetFrom)
                                }},
                            {text: '아니오', onPress: () =>  {
                                    AsyncStorage.removeItem('myMemoTemp');
                                    this.setState({
                                        selectedLecItemMemberClassIdx: -1,
                                        selectedLecItemMemberLectureIdx: -1,
                                        typedMemoContent: '',
                                        showWriteMemoModal: !this.state.showWriteMemoModal,
                                        toggleTargetFrom: targetFrom,
                                    });
                                    this.setQuestionInterval(targetFrom)
                                }},
                        ],
                        { cancelable: true }
                    )

                } else {
                    if(this.state.ownLecItems == null || this.state.ownLecItems === undefined || this.state.ownLecItems.length == 0) {
                        Toast.show('현재 수강 중인 강의가 없습니다.');
                    } else {
                        this.setQuestionInterval(targetFrom)
                        this.setState({
                            selectedLecItemMemberClassIdx: -1,
                            selectedLecItemMemberLectureIdx: -1,
                            typedMemoContent: '',
                            showWriteMemoModal: !this.state.showWriteMemoModal,
                            toggleTargetFrom: targetFrom,
                            memoIdx: 0,
                        });
                    }
                }
            }
        });
    }

    toggleWriteMemoModal = async(targetFrom = TARGET.FROM_NONE, isSelected = false) => {
        console.log('toggleWriteMemoModal()', 'this.state.showWriteMemoModal = ' + this.state.showWriteMemoModal);
        console.log('toggleWriteMemoModal()', 'targetFrom = ' + targetFrom);

        /** 기존 로직 **/
        /*
        this.setState({
            //showWriteMemoModal: !this.state.showWriteMemoModal,
            toggleTargetFrom: targetFrom,
        })

        if(this.state.showWriteMemoModal) {
            this.setState({ showWriteMemoModal: false })
            if(isReloadList) {
                this.getOwnMemoList()
            }
        } else {
            //await this.getOwnLectureList();
            this.setState({
                showWriteMemoModal: !this.state.showWriteMemoModal,
            })
        }
        */

        /** 1차 수정 **/

        /** 모달이 열리는 경우 **/
        if(!this.state.showWriteMemoModal) {
            // (테스트 완료) 메인 추가 버튼 클릭 시 > 작성 모달 노출 => 임시 저장 여부 확인 필요
            if(targetFrom == TARGET.FROM_NONE) {
                await this.getHistory(targetFrom);
            }

            // (테스트 완료) 강좌 모달에서 강좌 선택 시 > 작성 모달 노출
            // (테스트 완료) 강의 모달에서 강의 선택 시 > 작성 모달 노출
            else if(targetFrom == TARGET.FROM_REOPEN) {
                this.setState({
                    showWriteMemoModal: !this.state.showWriteMemoModal,
                    toggleTargetFrom: targetFrom,
                });
            }
        }

        /** 모달이 닫히는 경우 **/
        else {
            // (테스트 완료) 작성 모달에서 취소하는 경우 => 임시 저장 처리 진행
            if(targetFrom == TARGET.FROM_NONE) {
                this.setState({
                    showWriteMemoModal: !this.state.showWriteMemoModal,
                    toggleTargetFrom: targetFrom,
                    memoIdx: 0,
                    isExistDuplicateMemo: false,
                });
            }

            // (테스트 완료) 작성 모달에서 강좌 셀렉트 박스 클릭 시 > 강좌 모달 노출
            // (테스트 완료) 작성 모달에서 강의 셀렉트 박스 클릭 시 > 강좌 모달 노출
            else if(targetFrom == TARGET.FROM_LEC || targetFrom == TARGET.FROM_LEC_KANG) {
                this.setState({
                    showWriteMemoModal: !this.state.showWriteMemoModal,
                    toggleTargetFrom: targetFrom,
                });
            }

            // (테스트 완료) 작성 모달에서 저장하는 경우
            else if(targetFrom == TARGET.FROM_CREATE) {
                this.setState({
                    showWriteMemoModal: !this.state.showWriteMemoModal,
                    toggleTargetFrom: targetFrom,
                });
            }
        }



        return;


        // (적용 완료) this.state.showWriteMemoModal === false && targetFrom == TARGET.FROM_NONE
        // : 메인 추가 버튼 클릭 시 > 작성 모달 노출 => ★★★★★ 임시 저장 여부 확인 필요

        // (적용 완료) this.state.showWriteMemoModal === true && true targetFrom == TARGET.FROM_LEC
        // : 작성 모달에서 강좌 셀렉트 박스 클릭 시 > 강좌 모달 노출

        // (적용 완료) this.state.showWriteMemoModal === false && targetFrom == TARGET.FROM_REOPEN
        // : 강좌 모달에서 강좌 선택 시 > 작성 모달 노출

        // (적용 완료) this.state.showWriteMemoModal === true && targetFrom == TARGET.FROM_LEC_KANG
        // : 작성 모달에서 강의 셀렉트 박스 클릭 시 > 강좌 모달 노출

        // (적용 완료, 중복) this.state.showWriteMemoModal === false && targetFrom == TARGET.FROM_REOPEN
        // : 강의 모달에서 강의 선택 시 > 작성 모달 노출

        // (적용 완료) this.state.showWriteMemoModal === true && targetFrom == TARGET.FROM_NONE
        // : 작성 모달에서 취소하는 경우 => ★★★★★ 임시 저장 처리 진행

        // (적용 완료) this.state.showWriteMemoModal === true && targetFrom == TARGET.FROM_CREATE
        // : 작성 모달에서 저장하는 경우

            // > createItemRemote
            // > (성공 시) getMemoList(특정 유입 경로에서만 이후 진행)
            //      > (임시로 전체 케이스에 대해 이동)
            //      > toggleWriteMemoModal
            // > (실패 시) toggleWriteMemoModal
    }

    getOwnLectureList = async() => {
        this.setState({loading: true});

        const domain = SERVICES[this.props.myClassServiceID].apiDomain;
        const url = domain + '/v1/myClass/class/'+ this.state.memberIdx;

        console.log('getOwnLectureList()', 'url = ' + url);

        const options = {
            method: 'GET',
            headers: {
                ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
            },
        };

        await CommonUtil.callAPI(url, options, 10000)
            .then(response => {
                //console.log('getOwnLectureList()', 'response = ' + JSON.stringify(response));

                if (response && response.code === '0000') {
                    let ownLecItems = response.data.class;
                    //console.log('getOwnLectureList()', 'ownLecItems = ' + JSON.stringify(ownLecItems))

                    this.setState({
                        ownLecItems: ownLecItems,
                        loading: false,
                        //showWriteMemoModal: !this.state.showWriteMemoModal,
                    });
                }

                else {
                    this.setState({loading: false});
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('강의 목록을 불러오는데 실패 했습니다.');
                }}).catch(error => {
                    console.log(error)
                    this.setState({
                        loading: false,
                    });
                    Toast.show('시스템 에러: 강의 목록을 불러오는데 실패 했습니다.');
                });
    }

    toggleModifyMemoModal = async(targetFrom = TARGET.FROM_NONE) => {
        this.setState({
            //showModifyMemoModal: !this.state.showModifyMemoModal,
            toggleTargetFrom: targetFrom,
        })

        if(this.state.showModifyMemoModal) {
            this.setState({ showModifyMemoModal: false })
        } else {
            await this.getOwnMemoItem();
        }
    }

    getOwnMemoItem = async() => {
        //this.setState({loading: true});

        const domain = SERVICES[this.props.myClassServiceID].apiDomain;
        const url = domain + '/v1/myClass/memo/'+ this.state.memberIdx + '/' + targetModifyItem.memoIdx;

        console.log('getOwnMemoItem()', 'url = ' + url);

        const options = {
            method: 'GET',
            headers: {
                ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
            },
        };

        await CommonUtil.callAPI(url, options, 10000)
            .then(response => {
                console.log('getOwnMemoItem()', 'response = ' + JSON.stringify(response));

                if (response && response.code === '0000') {
                    let targetItem = response.data;

                    targetModifyItem = targetItem;

                    this.setState({
                        loading: false,
                        showModifyMemoModal: !this.state.showModifyMemoModal
                    });
                }

                else {
                    this.setState({loading: false});
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('메모 상세를 불러오는데 실패 했습니다.');
                }}).catch(error => {
                    console.log(error)
                    this.setState({
                        loading: false,
                    });
                    Toast.show('시스템 에러: 메모 상세를 불러오는데 실패 했습니다.');
                });
    }

    /** 기존
    setDataLecListModel = (targetFrom, index) => {
        if(index != this.state.selectedLecItemMemberClassIdx) {
            console.log('setDataLecListModel()', '강좌 변경 감지됨')
            this.setState({
                selectedLecItemMemberClassIdx: index,
                selectedLecItemMemberLectureIdx: -1,
            })
        } else {
            console.log('setDataLecListModel()', '강좌 변경되지 않음')
            this.setState({
                selectedLecItemMemberClassIdx: index,
            })
        }

        this.toggleLecListModal(targetFrom)
    }

    setDataLecKangListModel = (targetFrom, index) => {
        if(index != this.state.selectedLecItemMemberLectureIdx) {
            console.log('setDataLecKangListModel()', '수업 변경 감지됨')
            this.setState({
                selectedLecItemMemberLectureIdx: index,
            })
        } else {
            console.log('setDataLecKangListModel()', '수업 변경되지 않음')
            this.setState({
                selectedLecItemMemberLectureIdx: index,
            })
        }

        this.toggleLecKangListModal(targetFrom)
    }
    **/

    setDataLecListModel = (targetFrom, index) => {
        if(index != this.state.selectedLecItemMemberClassIdx) {
            console.log('setDataLecListModel()', '강좌 변경 감지됨')

            // DONE 기존 메모 로드 및 내용 대체
            let tmpMemberClassIdx = index;
            let tmpMemberLectureIdx = this.state.selectedLecItemMemberLectureIdx;
            let tmpContent = this.state.typedMemoContent;
            let tmpMemoIdx = 0;
            let tmpIsExistDuplicateMemo = false;

            var duplicateList = this.state.targetItems.filter(function(item, newIndex) {
                return item.memberClassIdx == tmpMemberClassIdx
                    && item.memberLectureIdx == tmpMemberLectureIdx;
            })

            if(duplicateList !== null && duplicateList.length > 0) {
                console.log('setDataLecListModel()', '선택한 강좌 및 수업에 등록된 메모 있음')
                var duplicateItem = duplicateList[0]
                tmpContent = duplicateItem.memoContent
                tmpMemoIdx = duplicateItem.memoIdx
                tmpIsExistDuplicateMemo = true
            } else {
                console.log('setDataLecListModel()', '선택한 강좌 및 수업에 등록된 메모 없음')
            }

            this.setState({
                selectedLecItemMemberClassIdx: index,
                selectedLecItemMemberLectureIdx: -1,
                isExistDuplicateMemo: tmpIsExistDuplicateMemo,
                typedMemoContent: tmpContent,
                memoIdx: tmpMemoIdx,
            })
        } else {
            console.log('setDataLecListModel()', '강좌 변경되지 않음')

            this.setState({
                selectedLecItemMemberClassIdx: index,
                isExistDuplicateMemo: false,
                memoIdx: 0,
            })
        }

        this.toggleLecListModal(targetFrom)
    }

    setDataLecKangListModel = (targetFrom, index) => {
        if(index != this.state.selectedLecItemMemberLectureIdx) {
            console.log('setDataLecKangListModel()', '수업 변경 감지됨')

            // DONE 기존 메모 로드 및 내용 대체
            let tmpMemberClassIdx = this.state.selectedLecItemMemberClassIdx;
            let tmpMemberLectureIdx = index;
            let tmpContent = this.state.typedMemoContent;
            let tmpMemoIdx = 0;
            let tmpIsExistDuplicateMemo = false;

            var duplicateList = this.state.targetItems.filter(function(item, newIndex) {
                return item.memberClassIdx == tmpMemberClassIdx
                    && item.memberLectureIdx == tmpMemberLectureIdx;
            })

            if(duplicateList !== null && duplicateList.length > 0) {
                console.log('setDataLecKangListModel()', '선택한 강좌 및 수업에 등록된 메모 있음')
                var duplicateItem = duplicateList[0]
                tmpContent = duplicateItem.memoContent
                tmpMemoIdx = duplicateItem.memoIdx
                tmpIsExistDuplicateMemo = true
            } else {
                console.log('setDataLecKangListModel()', '선택한 강좌 및 수업에 등록된 메모 없음')
            }

            this.setState({
                selectedLecItemMemberLectureIdx: index,
                isExistDuplicateMemo: tmpIsExistDuplicateMemo,
                typedMemoContent: tmpContent,
                memoIdx: tmpMemoIdx,
            })
        } else {
            console.log('setDataLecKangListModel()', '수업 변경되지 않음')
            this.setState({
                selectedLecItemMemberLectureIdx: index,
                isExistDuplicateMemo: false,
                memoIdx: 0,
            })
        }

        this.toggleLecKangListModal(targetFrom)
    }

    onChangeMemoContent = (text) => {
        console.log('onChangeMemoContent()', 'text = ' + text)
        this.setState({ typedMemoContent: text, })
    }

    getDataMemoContent = () => {
        console.log('getDataMemoContent()', 'this.state.typedMemoContent = ' + this.state.typedMemoContent)
        return this.state.typedMemoContent;
    }

    getSelectedLecItemTitle = () => {
        if(this.state.selectedLecItemMemberClassIdx == -1) {
            this.setState({
                selectedLecItemMemberClassIdx: this.state.ownLecItems[0].memberClassIdx,
            })
            return this.state.ownLecItems[0].className;
        } else {
            for (let lecItem of this.state.ownLecItems) {
                if(lecItem.memberClassIdx == this.state.selectedLecItemMemberClassIdx) {
                    return lecItem.className;
                }
            }
        }
    }

    getSelectedLecKangItems = () => {
        for (let lecItem of this.state.ownLecItems) {
            if(lecItem.memberClassIdx == this.state.selectedLecItemMemberClassIdx) {
                return lecItem.lecture.memberLectureIdx;
            }
        }
    }

    getSelectedLecKangItemTitle = () => {
        if(this.state.selectedLecItemMemberLectureIdx == -1) {
            for (let lecItem of this.state.ownLecItems) {
                if (lecItem.memberClassIdx == this.state.selectedLecItemMemberClassIdx) {
                    this.setState({ selectedLecItemMemberLectureIdx: lecItem.lecture.memberLectureIdx[0] })
                    return "제 " + lecItem.lecture.memberLectureIdx[0] + "강";
                }
            }
        } else {
            for (let lecItem of this.state.ownLecItems) {
                if(lecItem.memberClassIdx == this.state.selectedLecItemMemberClassIdx) {
                    for (let memberLectureIdx of lecItem.lecture.memberLectureIdx) {
                        if(memberLectureIdx == this.state.selectedLecItemMemberLectureIdx) {
                            return "제 " + memberLectureIdx + "강";
                        }
                    }
                }
            }
        }
    }

    toggleLecListModal = (targetFrom) => {
        this.setState({
            showLecListModal: !this.state.showLecListModal,
            toggleTargetFrom: targetFrom,
        })
    };

    toggleLecKangListModal = (targetFrom) => {
        this.setState({
            showLecKangListModal: !this.state.showLecKangListModal,
            toggleTargetFrom: targetFrom,
        })
    };

    renderWriteMemoModal = () => {
        return (
            <Modal
                animationType="slide"
                onRequestClose={() => this.closeWriteModal()}
                onBackdropPress={() => this.closeWriteModal()}
                style={styles.commonModalContainer}
                useNativeDriver={true}
                animationInTiming={300}
                animationOutTiming={300}
                hideModalContentWhileAnimating
                isVisible={this.state.showWriteMemoModal}
                onModalHide={() => {
                    switch(this.state.toggleTargetFrom) {
                        case TARGET.FROM_LEC:
                            this.toggleLecListModal()
                            break;
                        case TARGET.FROM_LEC_KANG:
                            this.toggleLecKangListModal()
                            break;
                        default:
                            break;
                    }
                }}
                >
                <KeyboardAvoidingView
                    style={[
                        styles.commonModalWrapper,
                        styles.writeMemoModalWrapper,
                    ]}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={
                        Platform.OS === "ios" ? 40 : - (SCREEN_HEIGHT * 0.30)
                    }
                    >
                        <MyMemoWriteModal
                            ref={(component) => this._MyMemoWriteModal = component}
                            screenState={this.state}
                            />
                </KeyboardAvoidingView>
            </Modal>
        )
    }

    renderLecListModal = () => {
        return (
            <Modal
                style={styles.commonModalContainer}
                animationType="slide"
                onRequestClose={() => this.toggleLecListModal(TARGET.FROM_LEC) }
                onBackdropPress={() => this.toggleLecListModal(TARGET.FROM_LEC) }
                animationInTiming={300}
                animationOutTiming={300}
                hideModalContentWhileAnimating
                isVisible={this.state.showLecListModal}
                onModalHide={() => {
                    switch(this.state.toggleTargetFrom) {
                        case TARGET.FROM_LEC:
                            this.toggleWriteMemoModal(TARGET.FROM_REOPEN)
                            break;
                        default:

                            break;
                    }
                }}
                >
                <View
                    style={[
                        styles.commonModalWrapper,
                        styles.lecListModalWrapper,
                    ]}
                    >
                    <PickerLecModal screenState={this.state}/>
                </View>
            </Modal>
        )
    }

    renderLecKangListModal = () => {
        return (
            <Modal
                style={styles.commonModalContainer}
                animationType="slide"
                onRequestClose={() => this.toggleLecKangListModal(TARGET.FROM_LEC_KANG) }
                onBackdropPress={() => this.toggleLecKangListModal(TARGET.FROM_LEC_KANG) }
                animationInTiming={300}
                animationOutTiming={300}
                hideModalContentWhileAnimating
                isVisible={this.state.showLecKangListModal}
                onModalHide={() => {
                    switch(this.state.toggleTargetFrom) {
                        case TARGET.FROM_LEC_KANG:
                            this.toggleWriteMemoModal(TARGET.FROM_REOPEN)
                            break;
                        default:

                            break;
                    }
                }}
                >
                <View
                    style={[
                        styles.commonModalWrapper,
                        styles.lecKangListModalWrapper,
                    ]}
                >
                    <PickerLecKangModal screenState={this.state}/>
                </View>
            </Modal>
        )
    }

    renderModifyMemoModal = () => {
        return (
            <Modal
                onBackdropPress={() => this.toggleModifyMemoModal()}
                animationType="slide"
                onRequestClose={() => this.toggleModifyMemoModal()}
                onBackdropPress={() => this.toggleModifyMemoModal()}
                style={styles.commonModalContainer}
                useNativeDriver={true}
                animationInTiming={300}
                animationOutTiming={300}
                hideModalContentWhileAnimating
                isVisible={this.state.showModifyMemoModal}
                onModalHide={() => {
                    switch(this.state.toggleTargetFrom) {

                        // 저장 및 삭제 모두 동일하게 적용되어야 함
                        // 삭제인지 저장인지 구분이 필요한데 차라리 부모에 별도 함수를 추가하는게 나을듯
                        case TARGET.FROM_LEC_KANG:
                            this.toggleWriteMemoModal()
                            break;
                        default:

                            break;
                    }
                }}
            >
                <KeyboardAvoidingView
                    style={[
                        styles.commonModalWrapper,
                        styles.modifyMemoModalWrapper,
                    ]}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={- (SCREEN_HEIGHT * 0.3)}
                    >
                    <MyMemoModifyModal screenState={this.state} targetModifyItem={targetModifyItem}/>
                </KeyboardAvoidingView>
            </Modal>
        )
    }

    render() {
        return (
            this.state.loading
                ?
                    <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
                :

                    <View style={styles.container}>
                        {/*
                        <TouchableOpacity onPress={() => this.putTest()}>
                            <Text>putTest</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.deleteTest()}>
                            <Text>deleteTest</Text>
                        </TouchableOpacity>
                        */}
                        {
                            this.props.myClassMemoModifyMode
                                && this.renderControlActivated()
                                || this.renderControl()
                        }
                        {
                            this.state.targetItems.length == 0
                                && this.renderEmpty()
                                || this.renderContent()
                        }
                        {/* this.renderControlButton() */}
                        { this.renderWriteMemoModal() }
                        { this.renderModifyMemoModal() }
                        { this.renderLecListModal() }
                        { this.renderLecKangListModal() }
                    </View>
        );
    }

    putTest = async() => {
        const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/freeStudy/putTest/1000?number=1564&text=putText입니다';
        console.log('putTest()', 'url = ' + url)
        const options = {
            method: 'PUT',
            headers: new Headers({
                Accept: 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'apiKey': DEFAULT_CONSTANTS.apiAdminKey
            })
        };
        await CommonUtil.callAPI(url, options)
            .then(response => {
                if (response && response.code === '0000') {
                    console.log(response)
                } else {
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('putTest에 실패 했습니다.');
                }}).catch(error => {
                Toast.show('시스템 에러: putTest에 실패 했습니다.');
            });
    }

    deleteTest = async() => {
        const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/freeStudy/deleteTest/2000?number=2000&text=DELETE 테스트입니다';
        console.log('deleteTest()', 'url = ' + url)
        // https://stackoverflow.com/a/37562814
        var details = {
            number: 2564,
            text: 'deleteTest입니다'
        };

        var bodyData = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            bodyData.push(encodedKey + "=" + encodedValue);
        }
        bodyData = bodyData.join("&");

        const options = {
            method: 'DELETE',
            headers: new Headers({
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'apiKey': DEFAULT_CONSTANTS.apiAdminKey
            }),
            body: bodyData,
        };

        await CommonUtil.callAPI(url, options)
            .then(response => {
                if (response && response.code === '0000') {
                    console.log(response)
                } else {
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('deleteTest에 실패 했습니다.');
                }}).catch(error => {
                Toast.show('시스템 에러: deleteTest에 실패 했습니다.');
            });
    }

    renderControlButton = () => {
        return(
            <View style={styles.controlBottomContainer}>
                <TouchableOpacity
                    style={styles.controlBottomWrapper}
                    onPress={() => this.props.myClassMemoModifyMode
                        ? this.deleteList()
                        : this.toggleWriteMemoModal()
                    }
                    >
                    <CustomTextB style={styles.controlBottomText}>
                        {this.props.myClassMemoModifyMode ? '삭제' : '추가' }
                    </CustomTextB>
                </TouchableOpacity>
            </View>
        )
    }

    renderControl = () => {
        return (
            <View style={[
                    styles.controlContainer,
                    styles.controlTopContainer,
                ]}
                >
                <View style={styles.controlTopLeft}>
                    <TouchableOpacity
                        style={styles.controlTopLeftWrapper}
                        onPress={() => this.toggleModifyMode()}>
                        <Image
                            style={styles.controlTopModifyIcon}
                            source={require('../../../assets/icons/btn_edit_list.png')} />
                        <CustomTextR style={styles.controlTopModifyText}>편집</CustomTextR>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderControlActivated = () => {
        return (
            <View style={[
                    styles.controlContainer,
                    styles.controlTopActContainer,
                ]}
                >
                <View style={styles.controlTopActLeft}>
                    <TouchableOpacity
                        style={styles.controlTopActLeftWrapper}
                        onPress={() => this.toggleSelectAllMode()}
                        >
                        <Image
                            style={styles.controlTopActSelectAllIcon}
                            source={require('../../../assets/icons/btn_check_list.png')} />
                        <CustomTextR style={styles.controlTopActSelectAllText}>
                            {this.state.isSelectAllMode ? '선택 해제' : '전체 선택' }
                        </CustomTextR>
                    </TouchableOpacity>
                </View>

                <View style={styles.controlTopActRight}>
                    <TouchableOpacity
                        style={styles.controlTopActRightWrapper}
                        onPress={() => this.toggleModifyMode()}
                        >
                        <CustomTextR style={styles.controlTopActCancelText}>취소</CustomTextR>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderContent = () => {
        return (
            <ScrollView
                style={styles.listContainer}
                nestedScrollEnabled={true}>
                {/*<ScrollView style={styles.listWrapper}>*/}
                {
                    this.state.targetItems.map((item, index) => {
                        return (
                            <SwipeRow
                                key={index}
                                ref={ref => (this.targetRows[item.memoIdx] = ref)}
                                onRowPress={() => {
                                    if(this.props.myClassMemoModifyMode) {
                                        if(item.isSelected) {
                                            var newTargetItems = [];
                                            this.state.targetItems.map((newItem, newIndex) => {
                                                if(item.memoIdx === newItem.memoIdx) {
                                                    newTargetItems.push({...newItem, isSelected: false})
                                                } else {
                                                    newTargetItems.push({...newItem});
                                                }
                                            });
                                            this.setState({targetItems: newTargetItems});
                                        } else {
                                            var newTargetItems = [];
                                            this.state.targetItems.map((newItem, newIndex) => {
                                                if(item.memoIdx === newItem.memoIdx) {
                                                    newTargetItems.push({...newItem, isSelected: true})
                                                } else {
                                                    newTargetItems.push({...newItem});
                                                }
                                            });
                                            this.setState({targetItems: newTargetItems});
                                        }
                                    } else {
                                        if (item.isOpened) {
                                            var newTargetItems = [];
                                            this.state.targetItems.map((newItem, newIndex) => {
                                                if(item.memoIdx === newItem.memoIdx) {
                                                    newItem.isOpened && this.targetRows[newItem.memoIdx].closeRow();
                                                    newTargetItems.push({...newItem, isOpened: false})
                                                } else {
                                                    newTargetItems.push({...newItem});
                                                }
                                            });
                                            this.setState({targetItems: newTargetItems});
                                        } else {
                                            // TODO 이미 열려져 있는 다른 행이 존재하는 경우 이벤트 블럭 처리

                                            var tmpTargetList = this.state.targetItems.filter(function(tmpItem) {
                                                return tmpItem.isOpened;
                                            })

                                            if(tmpTargetList !== null && tmpTargetList.length > 0) {
                                                this.state.targetItems.map((newItem, newIndex) => {
                                                    if(index != newIndex) {
                                                        newItem.isOpened && this.targetRows[newItem.memoIdx].closeRow();
                                                    }
                                                });
                                            } else {
                                                targetModifyItem = item
                                                this.toggleModifyMemoModal()
                                            }
                                        }
                                    }
                                }}
                                closeOnRowPress={true}
                                disableLeftSwipe={this.state.disableLeftSwipe}
                                disableRightSwipe={this.state.disableRightSwipe}
                                leftOpenValue={COUNT_LEFT_SWIPE_BUTTON * WIDTH_LEFT_SWIPE_BUTTON}
                                rightOpenValue={-(COUNT_RIGHT_SWIPE_BUTTON * WIDTH_RIGHT_SWIPE_BUTTON)}
                                onRowOpen={() => {
                                    var newTargetItems = [];

                                    this.state.targetItems.map((newItem, newIndex) => {
                                        if(item.memoIdx === newItem.memoIdx) {
                                            console.log('onRowOpen()', newItem.memoIdx + 'is opened' )
                                            newTargetItems.push({...newItem, isOpened: true})
                                        } else {
                                            console.log('onRowOpen()', newItem.memoIdx + 'is not opened' )
                                            newItem.isOpened && this.targetRows[newItem.memoIdx].closeRow();
                                            newTargetItems.push({...newItem, isOpened: false});
                                        }
                                    });
                                    this.setState({targetItems: newTargetItems});
                                }}
                                onRowClose={() => {
                                    var newTargetItems = [];

                                    this.state.targetItems.map((newItem, newIndex) => {
                                        if (item.memoIdx === newItem.memoIdx) {
                                            console.log('onRowOpen()', newItem.memoIdx + 'is closed' )
                                            newTargetItems.push({...newItem, isOpened: false});
                                        } else {
                                            console.log('onRowOpen()', newItem.memoIdx + 'is not closed' )
                                            newTargetItems.push({...newItem});
                                        }
                                    });
                                    this.setState({targetItems: newTargetItems});
                                }}
                                >

                                <View style={styles.rowBackContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.backCommonBtn,
                                            styles.backRightBtn,
                                            styles.backRightBtnFirst,
                                        ]}
                                        onPress={() => this.deleteItemRemote(item.memoIdx)}
                                        >
                                        <Image
                                            style={styles.backRightBtnFirstIcon}
                                            source={require('../../../assets/icons/btn_gesture_del.png')}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={
                                        ( this.props.myClassMemoModifyMode )
                                            ?
                                                ( item.isSelected )
                                                    ? [ styles.rowFrontContainer, styles.rowFrontContainerClicked ]
                                                    : [ styles.rowFrontContainer, styles.rowFrontContainerUnclicked ]
                                            :
                                                ( item.isOpened )
                                                ? [ styles.rowFrontContainer, styles.rowFrontContainerSwiped ]
                                                : [ styles.rowFrontContainer, styles.rowFrontContainerUnswiped ]
                                    }
                                    >
                                    <CustomTextR
                                        style={styles.rowFrontTitle}
                                        numberOfLines={2}>
                                        {item.lectureName + (item.lectureNo && ' (' + item.lectureNo + '강)')}
                                    </CustomTextR>
                                    <TextRobotoR style={styles.rowFrontDate}>
                                        {CommonFuncion.replaceAll(item.regDatetime, '-', '.').substring(0, 10)}
                                    </TextRobotoR>
                                </View>
                            </SwipeRow>
                        )
                    })
                }
                {/*</ScrollView>*/}
            </ScrollView>
        )
    }

    renderEmpty = () => {
        return(
            <View style={styles.emptyContainer}>
                <Image
                    style={styles.emptyIcon}
                    source={require('../../../assets/icons/icon_none_memo.png')}
                    />
                <CustomTextR style={styles.emptyTitle}>
                    저장된 메모가 없습니다
                </CustomTextR>
            </View>
        )
    }
}

MyMemoContent.propTypes = {
    myClassMemoModifyMode: PropTypes.bool,
    myClassServiceID: PropTypes.string,
};

const mapStateToProps = state => {
    return {
        myClassMemoModifyMode: state.GlabalStatus.myClassMemoModifyMode,
        myClassServiceID: state.GlabalStatus.myClassServiceID,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateMyClassMemoModifyMode:(boolean) => {
            dispatch(ActionCreator.updateMyClassMemoModifyMode(boolean));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(MyMemoContent);


const styles = StyleSheet.create({
    IndicatorContainer: {
        width: '100%',
        height: SCREEN_HEIGHT * 0.6,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        marginTop: 30,
    },
    emptyContainer: {
        flex: 1,
        height: SCREEN_HEIGHT * 0.35,
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
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
        lineHeight: PixelRatio.roundToNearestPixel(18),
        letterSpacing: -0.7
    },
    controlContainer: {
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: DEFAULT_COLOR.base_color_222,
    },
    controlTopContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    controlTopLeft: {

    },
    controlTopLeftWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    controlTopModifyIcon: {
        width: 17,
        height: 15,
        marginRight: 7,
    },
    controlTopModifyText: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
        lineHeight: PixelRatio.roundToNearestPixel(20),
        letterSpacing: -0.7,
    },
    controlTopActContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    controlTopActLeft: {

    },
    controlTopActLeftWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    controlTopActSelectAllIcon: {
        width: 15,
        height: 15,
        marginRight: 7,
    },
    controlTopActSelectAllText: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
        lineHeight: PixelRatio.roundToNearestPixel(20),
        letterSpacing: -0.7,
    },
    controlTopActRight: {

    },
    controlTopActRightWrapper: {

    },
    controlTopActCancelText: {
        color: DEFAULT_COLOR.lecture_base,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
        lineHeight: PixelRatio.roundToNearestPixel(20),
        letterSpacing: -0.7,
    },
    listContainer: {
        flex: 4,
        marginBottom: 55,
        //height: isIphoneX() ? SCREEN_HEIGHT * 0.45 : SCREEN_HEIGHT * 0.36
        //Animated.ScrollView 및 Menu에 대한 높이 계산 필요
    },
    listWrapper: {
        //height: 300,
        flex: 1,
        //height: '100%',
    },
    listSeparator: {
        height: 1,
        backgroundColor: '#E8E8E8',
    },
    rowFrontContainer: {
        height: HEIGHT_SWIPE_ITEM,
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 20,
        paddingRight: 30,
        paddingLeft: 20,
    },
    rowFrontContainerUnswiped: {
        backgroundColor: DEFAULT_COLOR.base_color_fff,
    },
    rowFrontContainerSwiped: {
        backgroundColor: '#e2f3f8',
    },
    rowFrontContainerUnclicked: {
        backgroundColor: DEFAULT_COLOR.base_color_fff,
    },
    rowFrontContainerClicked: {
        backgroundColor: '#f5f7f8',
    },
    rowFrontTitle: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),
        lineHeight: PixelRatio.roundToNearestPixel(18),
        letterSpacing: -0.65,
    },
    rowFrontDate: {
        color: '#AAAAAA',
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),
        letterSpacing: 0,
    },
    rowBackContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backCommonBtn: {
        position: 'absolute',
        bottom: 0,
        top: 0,
        height: HEIGHT_SWIPE_ITEM,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backLeftBtn: {
        width: WIDTH_LEFT_SWIPE_BUTTON,
    },
    backRightBtn: {
        width: WIDTH_RIGHT_SWIPE_BUTTON,
    },
    backLeftBtnFirst: {
        backgroundColor: '#0000FF',
        left: 0,
    },
    backRightBtnFirst: {
        right: 0,
        backgroundColor: DEFAULT_COLOR.lecture_base,
    },
    backRightBtnFirstIcon: {
        width: 21,
        height: 20,
    },
    backRightBtnSecond: {
        backgroundColor: '#00FF00',
        right: WIDTH_RIGHT_SWIPE_BUTTON,
    },
    controlBottomContainer: {
        //position: 'absolute',
        //bottom: 0,
        flex: 1,
        width: SCREEN_WIDTH,
        backgroundColor: DEFAULT_COLOR.lecture_base,
    },
    controlBottomWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 55,
    },
    controlBottomText: {
        color: DEFAULT_COLOR.base_color_fff,
        fontSize: PixelRatio.roundToNearestPixel(18),
    },

    commonModalContainer: {
        justifyContent: 'flex-end',
        margin: 0
    },

    commonModalWrapper: {
        paddingTop: 16,
        backgroundColor: '#fff',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    writeMemoModalWrapper: {
        height: HEIGHT_WRITE_MEMO_MODAL,
    },
    modifyMemoModalWrapper: {
        height: HEIGHT_MODIFY_MEMO_MODAL,
    },
    lecListModalWrapper: {
        height: HEIGHT_LEC_LIST_MODAL,
    },
    lecKangListModalWrapper: {
        height: HEIGHT_LEC_KANG_LIST_MODAL,
    }
});

/*
    메모 추가 시, 선택한 강좌 및 수업에 이미 등록한 메모가 있는 경우에는
    i) UI 변경 없이 내용 입력란에 등록한 메모 내용을 불러오고
    ii) 저장 버튼을 클릭 시, 이미 등록된 메모가 수정되도록 진행하겠습니다.
*/

// TODO 1단계, 선택 강좌 및 수업 변경 감지 및 기록

/*
    setDataLecListModel = (targetFrom, index) => {
        if(index != this.state.selectedLecItemMemberClassIdx) {
            console.log('setDataLecListModel()', '강좌 변경 감지됨')

            // DONE 기존 메모 로드 및 내용 대체
            let tmpMemberClassIdx = this.state.selectedLecItemMemberClassIdx;
            let tmpMemberLectureIdx = this.state.selectedLecItemMemberLectureIdx;
            let tmpContent = this.state.typedMemoContent;

            var duplicateList = this.state.targetItems.filter(function(item, newIndex) {
                return item.memberClassIdx == tmpMemberClassIdx
                    && item.memberLectureIdx == tmpMemberLectureIdx;
            })

            if(duplicateList !== null && duplicateList.length > 0) {
                var duplicateItem = duplicateList[0]
                tmpContent = duplicateItem.memoContent
            }

            this.setState({
                selectedLecItemMemberClassIdx: index,
                selectedLecItemMemberLectureIdx: -1,
                isExistDuplicateMemo: true,
                typedMemoContent: tmpContent,
            })
        } else {
            console.log('setDataLecListModel()', '강좌 변경되지 않음')

            this.setState({
                selectedLecItemMemberClassIdx: index,
                isExistDuplicateMemo: false,
            })
        }

        this.toggleLecListModal(targetFrom)
    }

    setDataLecKangListModel = (targetFrom, index) => {
        if(index != this.state.selectedLecItemMemberLectureIdx) {
            console.log('setDataLecKangListModel()', '수업 변경 감지됨')

            // DONE 기존 메모 로드 및 내용 대체
            let tmpMemberClassIdx = this.state.selectedLecItemMemberClassIdx;
            let tmpMemberLectureIdx = this.state.selectedLecItemMemberLectureIdx;
            let tmpContent = this.state.typedMemoContent;

            var duplicateList = this.state.targetItems.filter(function(item, newIndex) {
                return item.memberClassIdx == tmpMemberClassIdx
                    && item.memberLectureIdx == tmpMemberLectureIdx;
            })

            if(duplicateList !== null && duplicateList.length > 0) {
                var duplicateItem = duplicateList[0]
                tmpContent = duplicateItem.memoContent
            }

            this.setState({
                selectedLecItemMemberLectureIdx: index,
                isExistDuplicateMemo: true,
                typedMemoContent: tmpContent,
            })
        } else {
            console.log('setDataLecKangListModel()', '수업 변경되지 않음')
            this.setState({
                selectedLecItemMemberLectureIdx: index,
                isExistDuplicateMemo: false,
            })
        }

        this.toggleLecKangListModal(targetFrom)
    }
*/

// TODO 2단계, 변경된 강좌 및 수업와 일치하는 메모가 존재하는 경우 해당 메모 내용 대체 노출

/*
    getDataMemoContent = () => {
        console.log('getDataMemoContent()', 'CALL')

        if(this.state.isSelectedLecItemChanged) {
            let tmpMemberClassIdx = this.state.selectedLecItemMemberClassIdx;
            let tmpMemberLectureIdx = this.state.selectedLecItemMemberLectureIdx;

            var duplicateList = this.state.targetItems.filter(function(item, newIndex) {
                return item.memberClassIdx == tmpMemberClassIdx
                    && item.memberLectureIdx == tmpMemberLectureIdx;
            })

            if(duplicateList !== null && duplicateList.length > 0) {
                var duplicateItem = duplicateList[0]
                return duplicateItem.memoContent
            } else {
                return this.state.typedMemoContent;
            }
        } else {
            return this.state.typedMemoContent;
        }
    }
*/

// ㄴ TODO 2-1단계, isSelectedLecItemChanged가 true가 되어 있는 경우 이전 작성 메모 내용으로 입력란이 고정되는 현상 해결

/*
    1단계의 typedMemoContent를 활용하여 처리
 */


// TODO 3단계, 저장 버튼에 등록 API가 아닌 수정 API로 연결

/*
    MyMemoWriteModal에서 상태 isExistDuplicateMemo가 true일때
    신규 생성한 함수 updateOwnDuplicateMemoItemRemote를 호출하는 방식으로 진행
*/
