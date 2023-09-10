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
    Alert,
    BackHandler,
    StatusBar,
    ActivityIndicator,
    KeyboardAvoidingView, Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import { isIphoneX, } from "react-native-iphone-x-helper";
import SwipeRow from '../../Utils/SwipeListView/SwipeRow';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import AsyncStorage from '@react-native-community/async-storage';

import MyQnaWriteModal from './Modal/MyQnaWriteModal';
import MyQnaModifyModal from './Modal/MyQnaModifyModal';
import MyQnaCompleteModal from './Modal/MyQnaCompleteModal';
import PickerLecModal from './Modal/PickerLecModal';
import PickerLecKangModal from './Modal/PickerLecKangModal';

import {CustomTextB, CustomTextR, CustomTextM, TextRobotoR} from "../../Style/CustomText";
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFunction from '../../Utils/CommonFunction';
import {SERVICES} from "../../Constants/Common";

import { TARGET, ARTICLE } from './Modal/ModalConstant';
import moment from "moment/moment";
import Toast from "react-native-tiny-toast";

// Modal
const HEIGHT_WRITE_MODAL       = SCREEN_HEIGHT * 0.95;
const HEIGHT_MODIFY_MODAL       = SCREEN_HEIGHT * 0.95;
const HEIGHT_COMPLETE_MODAL       = isIphoneX() ? SCREEN_HEIGHT * 0.90 : SCREEN_HEIGHT * 0.95;
const HEIGHT_LEC_LIST_MODAL         = SCREEN_HEIGHT * 0.5;
const HEIGHT_LEC_KANG_LIST_MODAL    = SCREEN_HEIGHT * 0.5;

// SwipeRow
// const HEIGHT_SWIPE_ITEM = 100;
const COUNT_RIGHT_SWIPE_BUTTON = 1;
const WIDTH_RIGHT_SWIPE_BUTTON = 65.3;
const COUNT_LEFT_SWIPE_BUTTON = 0;
const WIDTH_LEFT_SWIPE_BUTTON = 65.3;

// 첨부 가능한 최대 파일 갯수(기본)
const MAXIMUM_UPLOAD_FILE_COUNT = 5;
const paginate = 10;


// DONE 1차 상세 페이지 수정(첨부파일 관련)
// DONE 2차 첨부파일 이미지 업로드
// DONE 3차 임시 저장 및 복원

class MyQnaContent extends Component {
    constructor(props) {
        super(props);
        // SwipeRow Component Ref 배열
        this.targetRows= {}
        this.state = {
            memberIdx: 0,
            ownLecItems: [], //props.screenState.ownLecItems,
            currentPage: 1,
            lastPage: 0,
            myClassServiceID: props.myClassServiceID,
            attachedFileSize: 0,
            // classList: props.myClassClassList,

            /** renderContent start **/
            /** renderContent start **/
                isModifyMode: false,
                disableLeftSwipe: false,
                disableRightSwipe: true,
                toggleTargetFrom: TARGET.FROM_NONE,
                getTmpAttachedItems: this.getTmpAttachedItems.bind(this),
            /** renderContent end **/
            /** renderContent end **/

            /** renderModifyModal start **/
            /** renderModifyModal start **/
                showModifyModal: false,
                targetItemKey: -1,
                targetModifyItem: {},
                toggleModifyModal: this.toggleModifyModal.bind(this),
                deleteItemRemote: this.deleteItemRemote.bind(this),
                updateItemRemote: this.updateItemRemote.bind(this),
                getTargetItemKey: this.getTargetItemKey.bind(this),
            /** renderModifyModal end **/
            /** renderModifyModal end **/

            /** renderCompleteModal start **/
            /** renderCompleteModal start **/
                showCompleteModal: false,
                targetCompleteItem: {},
                toggleCompleteModal: this.toggleCompleteModal.bind(this),
            /** renderCompleteModal end **/
            /** renderCompleteModal end **/

            /** renderWriteModal start **/
            /** renderWriteModal start **/
                typedTitle: '',
                typedContent: '',
                showWriteModal: false,
                toggleWriteModal: this.toggleWriteModal.bind(this),
                onChangeTitle: this.onChangeTitle.bind(this),
                getDataTitle: this.getDataTitle.bind(this),
                onChangeContent: this.onChangeContent.bind(this),
                getDataContent: this.getDataContent.bind(this),
                createItemRemote: this.createItemRemote.bind(this),
                insertTmpItemRemote: this.insertTmpItemRemote.bind(this),
                updateTmpItemRemote: this.updateTmpItemRemote.bind(this),
                removeTmpAttachedItems: this.removeTmpAttachedItems.bind(this),
                closeWriteModal: this.closeWriteModal.bind(this),
            /** renderWriteModal end **/
            /** renderWriteModal end **/

            /** renderLecListModal start **/
            /** renderLecListModal start **/
                showLecListModal: false,
                selectedLecItemMemberClassIdx: -1, //this.props.myClassClassList[0].memberClassIdx,
                setDataLecListModel: this.setDataLecListModel.bind(this),
                toggleLecListModal: this.toggleLecListModal.bind(this),
            /** renderLecListModal end **/
            /** renderLecListModal end **/

            /** renderLecKangListModal start **/
            /** renderLecKangListModal start **/
                showLecKangListModal: false,
                selectedLecItemMemberLectureIdx: -1, //memberLectureIdx, 신규 방식
                setDataLecKangListModel: this.setDataLecKangListModel.bind(this),
                getSelectedLecItemTitle: this.getSelectedLecItemTitle.bind(this),
                toggleLecKangListModal: this.toggleLecKangListModal.bind(this),
            /** renderLecKangListModal end **/
            /** renderLecKangListModal end **/

            /** common start **/
            /** common start **/
                tmpAttachedItems: [], // WriteModal 내 선택한 이미지가 강의 및 강좌 선택 후에 초기화 되는 문제 해결을 위함
                getLecTargetItemTitle: this.getLecTargetItemTitle.bind(this),
                getSelectedLecKangItems: this.getSelectedLecKangItems.bind(this),
                getSelectedLecKangItemTitle: this.getSelectedLecKangItemTitle.bind(this),
                notiList: [],
                questionList: [],
                ableFileCnt: 0,
                orderingNo: -1,
            /** common end **/
            /** common end **/
        }

        console.log('MyQnaContent.constructor()', 'props.myClassServiceID = ' + props.myClassServiceID)
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    
    async UNSAFE_componentWillMount() {
        let myInterestCode = await AsyncStorage.getItem('myInterestCode')
        console.log('UNSAFE_componentWillMount()', 'myInterestCode = ' + myInterestCode)

        const memberIdx = await CommonUtil.getMemberIdx();
        this.setState({
            serviceID: JSON.parse(myInterestCode).info.serviceID,
            memberIdx: memberIdx,
            loading: true
        }, function() {
            this.getQuestionList();
            this.getOwnLectureList();
        });
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        //console.log('handleBackButton');
        return true;
    };

    getQuestionDetail = async(teacherQuestionIdx, articleTypeName) => {
        const url = SERVICES[this.props.myClassServiceID].apiDomain
            + '/v1/myClass/teacherQuestion/' + this.state.memberIdx + '/' + teacherQuestionIdx;

        const options = {
            method: 'GET',
            headers: {
                ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
            },
        };

        await CommonUtil.callAPI(url, options, 10000)
            .then(response => {

                //console.log('getQuestionDetail()', 'response = ' + JSON.stringify(response))

                if (response && response.code === '0000') {
                    var targetModifyItem = response.data.question;
                    targetModifyItem[ARTICLE.TYPE.NAME] = articleTypeName

                    // DONE 실서버에서 테스트 로직 제거(실제 로드 가능한 이미지로 대체하여 ImagePicker 테스트)
                    var tempFiles = [];

                    if(targetModifyItem.files !== null && targetModifyItem.files.length != 0) {
                        targetModifyItem.files.map((item) => {
                            tempFiles.push({
                                ...item,
                                source: {
                                    //uri: 'https://blog.hmgjournal.com/images_n/contents/170508_memo02.png'
                                    uri: item.fileUrl,
                                },
                                title: 'test',
                            })
                        })
                        targetModifyItem.files = tempFiles;
                    }


                    this.setState({
                        targetModifyItem: targetModifyItem,
                        loading: false,
                    })
                    this.toggleModifyModal()
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
                console.log('error : ' + error)
                Toast.show('시스템 에러: 질문 상세를 불러오는데 실패 했습니다.');
                this.setState({
                    loading: false
                });
            });
    }

    getQuestionList = async(targetFrom = TARGET.FROM_NONE) => {
        const url = SERVICES[this.props.myClassServiceID].apiDomain
                        + '/v1/myClass/teacherQuestion/' + this.state.memberIdx
                        + '?paginate=' + paginate
                        + '&page=' + this.state.currentPage;

        const options = {
            method: 'GET',
            headers: {
                ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
            },
        };
        
        await CommonUtil.callAPI(url, options, 10000)
            .then(response => {

                //console.log('getQuestionList()', 'response = ' + JSON.stringify(response))

                if (response && response.code === '0000') {
                    if(this.state.currentPage == 1 ) {
                        this.setState({
                            notiList: response.data.notiList || [],
                            loading: false
                        })
                    }

                    this.setState({
                        questionList: [...this.state.questionList, ...response.data.questionList],
                        lastPage: response.data.lastPage,
                    });
                } else {
                    if(this.state.currentPage == 1 ) {
                        this.setState({
                            loading: false
                        });
                    }
                    response.message
                        ? Alert.alert('', response.message)
                        : Alert.alert('', '질문 목록을 불러오는데 실패 했습니다.');
                }
            })
            .catch(error => {
                this.setState({
                    loading: false
                });
                Toast.show('시스템 에러: 질문 목록을 불러오는데 실패 했습니다.');
            });

        if(targetFrom == TARGET.FROM_CREATE) {
            //this.toggleWriteModal(targetFrom)
        }
    };

    moreLoading = async() => {
        this.setState({
            currentPage: this.state.currentPage + 1,
        }, function() {
            this.getQuestionList()
        });
    };

    render() {
        return (
            this.state.loading
                ?
                    <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
                :
                    <ScrollView
                        style={styles.container}
                        onScroll={e => console.log('MyQnaContent > render()', 'onScroll()')}>
                        {
                            this.state.notiList.length == 0
                                ? this.renderNoticeEmpty()
                                : this.renderNoticeContent()
                        }
                        {
                            this.state.questionList.length == 0
                                ? this.renderEmpty()
                                : this.renderContent()
                        }
                        { this.renderWriteModal() }
                        { this.renderModifyModal() }
                        { this.renderCompleteModal() }
                        { this.renderLecListModal() }
                        { this.renderLecKangListModal() }
                    </ScrollView>
        );
    }

    renderNoticeEmpty = () => {
        return (
            <View style={styles.noticeEmptyContainer}>
            </View>
        )
    }

    renderNoticeContent = () => {
        return (
            <View style={styles.noticeListContainer}>
                {
                    this.state.notiList.map((item, index) => {
                        return(
                            <View style={styles.noticeItemContainer} key={index}>
                                <TouchableOpacity
                                    style={styles.noticeItemWrapper}
                                    onPress={() => {
                                        this.getQuestionDetail(item.teacherQuestionIdx, ARTICLE.TYPE.NOTICE)

                                        /*
                                        this.setState({
                                            targetModifyItem: {...item, [ARTICLE.TYPE.NAME]: ARTICLE.TYPE.NOTICE},
                                        })
                                        this.toggleModifyModal()
                                        */
                                    }}
                                    >
                                    <View style={styles.noticeItemLeft}>
                                        <Image
                                            style={styles.noticeItemLeftIcon}
                                            source={require('../../../assets/icons/icon_noti.png')}
                                            />
                                    </View>

                                    <View style={styles.noticeItemRight}>
                                        <View style={styles.noticeItemTop}>
                                            <CustomTextM
                                                style={styles.noticeItemTopTitle}
                                                numberOfLines={1}
                                                >
                                                {this.props.myInterestCodeOne.info.interestFieldName}
                                            </CustomTextM>
                                        </View>
                                        <View style={styles.noticeItemBottom}>
                                            <CustomTextM
                                                style={styles.noticeItemBottomTitle}
                                                numberOfLines={1}
                                                >
                                                {item.questionTitle}
                                            </CustomTextM>
                                            {
                                                moment().diff(moment(item.regDatetime), 'days') <= 1
                                                    &&
                                                        <Image
                                                            style={styles.questionItemBottomIcon}
                                                            source={require('../../../assets/icons/icon_new.png')} />
                                            }
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    renderContent = () => {
        return (
            <View style={styles.listContainer}>
                {
                    this.state.questionList.map((item, index) => {
                        return (
                            <SwipeRow
                                key={index}
                                ref={ref => (this.targetRows[index] = ref)}
                                setScrollEnabled={() => console.log('renderContent()', 'CALL setScrollEnabled()')}
                                onRowPress={() => {
                                    if(this.state.isModifyMode) {
                                        if(item.isSelected) {
                                            var newTargetItems = [];
                                            this.state.questionList.map((newItem, newIndex) => {
                                                if(index == newIndex) {
                                                    newTargetItems.push({...newItem, isSelected: false})
                                                } else {
                                                    newTargetItems.push({...newItem});
                                                }
                                            });
                                            this.setState({questionList: newTargetItems});
                                        } else {
                                            var newTargetItems = [];
                                            this.state.questionList.map((newItem, newIndex) => {
                                                if(index == newIndex) {
                                                    newTargetItems.push({...newItem, isSelected: true})
                                                } else {
                                                    newTargetItems.push({...newItem});
                                                }
                                            });
                                            this.setState({questionList: newTargetItems});
                                        }
                                    } else {
                                        if (item.isOpened) {
                                            var newTargetItems = [];
                                            this.state.questionList.map((newItem, newIndex) => {
                                                if(index == newIndex) {
                                                    newItem.isOpened && this.targetRows[newIndex].closeRow();
                                                    newTargetItems.push({...newItem, isOpened: false})
                                                } else {
                                                    newTargetItems.push({...newItem});
                                                }
                                            });
                                            this.setState({questionList: newTargetItems});
                                        } else {
                                            if(item[ARTICLE.STATE.NAME] === ARTICLE.STATE.SOLVED) {
                                                this.setState({
                                                    targetCompleteItem: {...item},
                                                })
                                                this.toggleCompleteModal()
                                            }

                                            else {
                                                // TODO 이미 열려져 있는 다른 행이 존재하는 경우 이벤트 블럭 처리

                                                var tmpQuestionList = this.state.questionList.filter(function(tmpItem) {
                                                    return tmpItem.isOpened;
                                                })

                                                if(tmpQuestionList !== null && tmpQuestionList.length > 0) {
                                                    this.state.questionList.map((newItem, newIndex) => {
                                                        if(index != newIndex) {
                                                            newItem.isOpened && this.targetRows[newIndex].closeRow();
                                                        }
                                                    });
                                                } else {
                                                    this.getQuestionDetail(item.teacherQuestionIdx, ARTICLE.TYPE.NORMAL)
                                                }
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

                                    this.state.questionList.map((newItem, newIndex) => {
                                        if(index == newIndex) {
                                            newTargetItems.push({...newItem, isOpened: true})
                                        } else {
                                            newItem.isOpened && this.targetRows[newIndex].closeRow();
                                            newTargetItems.push({...newItem, isOpened: false});
                                        }
                                    });
                                    this.setState({questionList: newTargetItems});
                                }}
                                onRowClose={() => {
                                    var newTargetItems = this.state.questionList.map((item, newIndex) => (
                                        index == newIndex ? {...item, isOpened: false} : item
                                    ));
                                    this.setState({questionList: newTargetItems});
                                }}
                                >

                                {/* <View style={hiddenRowStyle} /> */}
                                <View style={styles.rowBackContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.backCommonBtn,
                                            styles.backRightBtn,
                                            styles.backRightBtnFirst,
                                        ]}
                                        onPress={() => {
                                            if(item[ARTICLE.STATE.NAME] === ARTICLE.STATE.SOLVED) {
                                                Alert.alert('', '선생님 답변이 완료된 글은 삭제하실 수 없습니다.', [
                                                    {text: '확인'},
                                                ]);
                                            } else {
                                                this.deleteItem(index, item.teacherQuestionIdx)
                                            }
                                        }}
                                        >
                                        <Image
                                            style={styles.backRightBtnFirstIcon}
                                            source={require('../../../assets/icons/btn_gesture_del.png')}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* <View style={visibleRowStyle} /> */}
                                <View style={
                                        ( item.isOpened || item.isSelected )
                                            ? [ styles.rowFrontContainer, styles.rowFrontContainerSwiped ]
                                            : [ styles.rowFrontContainer, styles.rowFrontContainerUnswiped ]
                                    }
                                    >
                                    <View style={{borderBottomWidth: 1, borderBottomColor: '#E8E8E8', paddingVertical: 19}}>

                                        <View style={{ flexDirection: 'row',}}>
                                            <CustomTextM style={
                                                    item[ARTICLE.STATE.NAME] === ARTICLE.STATE.SOLVED
                                                        ? styles.rowFrontStateSolved
                                                        : styles.rowFrontStateUnsolved
                                                }>
                                                {
                                                    item[ARTICLE.STATE.NAME] === ARTICLE.STATE.SOLVED
                                                        ? ARTICLE.STATE.SOLVED_NAME
                                                        : ARTICLE.STATE.UNSOLVED_NAME
                                                }
                                            </CustomTextM>
                                            {
                                                item.isSecret
                                                    &&
                                                        <Image
                                                            style={styles.rowFrontSecretIcon}
                                                            source={require('../../../assets/icons/icon_lock.png')} />
                                            }
                                        </View>
                                        <View style={{ flexDirection: 'row', }}>
                                            <CustomTextR
                                                style={styles.rowFrontTitle}
                                                numberOfLines={2}>
                                                {
                                                    /*this.getLecTargetItemTitle(item.lecIndex)*/
                                                    item.questionTitle
                                                }
                                            </CustomTextR>
                                            {
                                                moment().diff(moment(item.regDatetime), 'days') <= 1
                                                &&
                                                <Image
                                                    style={styles.noticeItemBottomIcon}
                                                    source={require('../../../assets/icons/icon_new.png')}/>
                                            }
                                        </View>
                                        <TextRobotoR style={styles.rowFrontDate}>
                                            {
                                                CommonFunction.replaceAll(item.regDatetime, '-', '.')
                                            }
                                        </TextRobotoR>
                                    </View>
                                </View>
                            </SwipeRow>
                        )
                    })
                }
                {
                    this.state.currentPage < this.state.lastPage
                        && (
                            <TouchableOpacity
                                style={{
                                    width: '100%',
                                    height: 50,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onPress={() => this.moreLoading()}
                                >
                                <CustomTextR>더보기</CustomTextR>
                            </TouchableOpacity>
                        )
                }
            </View>
        )
    }

    /** renderContent start **/
    /** renderContent start **/
        getTmpAttachedItems = () => {
            return this.state.tmpAttachedItems;
        }

        deleteItem = (index, teacherQuestionIdx) => {
            console.log('deleteItem()', 'teacherQuestionIdx = ' + teacherQuestionIdx)
            this.targetRows[index].closeRow(() => {
                Alert.alert('', '삭제하시겠습니까?', [
                    {text: '확인', onPress: () => this.procDelete(teacherQuestionIdx) },
                    {text: '취소'},
                ]);
            })
        }

        getLecTargetItemTitle = (memberClassIdx) => {
            for (let lecItem of this.state.ownLecItems) {
                if(lecItem.memberClassIdx == memberClassIdx) {
                    return lecItem.className;
                }
            }
        }
    /** renderContent end **/
    /** renderContent end **/

    renderWriteModal = () => {
        return (
            <Modal
                onBackdropPress={() => this.closeWriteModal()}
                onRequestClose={() => this.closeWriteModal()}
                animationType="slide"
                style={styles.commonModalContainer}
                useNativeDriver={true}
                animationInTiming={300}
                animationOutTiming={300}
                hideModalContentWhileAnimating
                isVisible={this.state.showWriteModal}
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
                        styles.writeModalWrapper,
                    ]}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={- (SCREEN_HEIGHT * 0.2)}
                    >
                    <MyQnaWriteModal screenState={this.state}/>
                </KeyboardAvoidingView>
            </Modal>
        )
    }

    /** renderWriteModal start **/
    /** renderWriteModal start **/
        removeTmpAttachedItems = (index) => {
            var newTmpAttachedItems = this.state.tmpAttachedItems.filter(function(item, newIndex) {
                return index !== newIndex;
            })

            this.setState({ tmpAttachedItems: newTmpAttachedItems })
        };

        openWriteModal = () => {
            console.log('openWriteModal()', 'START')
            // 초기화 대상
            this.setState({
                typedTitle: '',
                typedContent: '',
                selectedLecItemMemberClassIdx: -1, //this.state.classList[0].memberClassIdx,
                selectedLecItemMemberLectureIdx: -1,
                tmpAttachedItems: [],
                attachedFileSize: 0,
            }, function() {
                this.toggleWriteModal();
            })
        };

        closeWriteModal = (targetFrom = TARGET.FROM_NONE) => {
            console.log('closeWriteModal()', 'START')

            if(!CommonUtil.isEmpty(this.state.typedTitle)
                || !CommonUtil.isEmpty(this.state.typedContent)){

                Alert.alert(
                    "",
                    "작성 중인 내용이 저장되지 않습니다.\n" + "종료하시겠습니까?",
                        [
                            {text: '네', onPress: () => {
                                this.clearQuestionInterval(targetFrom)
                                AsyncStorage.removeItem('myQnaTemp');
                                this.toggleWriteModal(targetFrom)
                            }},
                            {text: '아니오', onPress: () =>  {
                                this.clearQuestionInterval(targetFrom)
                            }}
                        ],
                    { cancelable: true }
                )
            } else {
                this.clearQuestionInterval(targetFrom)
                this.toggleWriteModal(targetFrom)
            }
        }

        toggleWriteModal = async (targetFrom = TARGET.FROM_NONE) => {

            console.log('toggleWriteModal()', 'this.state.showWriteModal = ' + this.state.showWriteModal);
            console.log('toggleWriteModal()', 'targetFrom = ' + targetFrom);

            /** 기존 로직 **/
            /*
            this.setState({
                showWriteModal: !this.state.showWriteModal,
                toggleTargetFrom: targetFrom,
            });

            return;
            */

            /** 1차 수정 **/

            /** 모달이 열리는 경우 **/
            if(!this.state.showWriteModal) {
                // (테스트 완료) 메인 추가 버튼 클릭 시 > 작성 모달 노출 => 임시 저장 여부 확인 필요
                if(targetFrom == TARGET.FROM_NONE) {

                    await this.getHistory(targetFrom);

                    // 이미 해당 함수 내에서 아래 코드를 수행중임
                    /*
                    this.setState({
                        showWriteModal: !this.state.showWriteModal,
                        toggleTargetFrom: targetFrom,
                    });
                    */
                }

                // (테스트 완료) 강좌 모달에서 강좌 선택 시 > 작성 모달 노출
                else if(targetFrom == TARGET.FROM_REOPEN) {
                    console.log('toggleWriteModal()', 'I\'M HERE')

                    this.setState({
                        showWriteModal: !this.state.showWriteModal,
                        toggleTargetFrom: targetFrom,
                    });
                }
            }

            /** 모달이 닫히는 경우 **/
            else {
                // (테스트 완료) 작성 모달에서 취소하는 경우 => 임시 저장 처리 진행
                if(targetFrom == TARGET.FROM_NONE) {
                    this.setState({
                        showWriteModal: !this.state.showWriteModal,
                        toggleTargetFrom: targetFrom,
                    });

                    //closeWriteModal 작업 이관
                    /*
                    if(!CommonUtil.isEmpty(this.state.typedTitle)
                        || !CommonUtil.isEmpty(this.state.typedContent)){
                        this.tempSaveProcess(targetFrom);

                        // 이미 해당 함수 내에서 아래 코드를 수행중임
                        this.setState({
                            showWriteModal: !this.state.showWriteModal,
                            toggleTargetFrom: targetFrom,
                        });
                    }

                    else {
                        this.setState({
                            showWriteModal: !this.state.showWriteModal,
                            toggleTargetFrom: targetFrom,
                        });
                    }
                    */
                }

                // (테스트 완료) 작성 모달에서 강좌 셀렉트 박스 클릭 시 > 강좌 모달 노출
                else if(targetFrom == TARGET.FROM_LEC) {
                    this.setState({
                        showWriteModal: !this.state.showWriteModal,
                        toggleTargetFrom: targetFrom,
                    });
                }

                // (테스트 완료) 작성 모달에서 저장하는 경우
                else if(targetFrom == TARGET.FROM_CREATE) {
                    this.setState({
                        showWriteModal: !this.state.showWriteModal,
                        toggleTargetFrom: targetFrom,
                    });
                }
            }

            return;

            // TODO 모달이 열리고 닫히면서 데이터를 유지하기 위한 로직과 충돌나지 않아야 함

            // (적용 중) this.state.showWriteModal === false && targetFrom == TARGET.FROM_NONE
            // : 메인 추가 버튼 클릭 시 > 작성 모달 노출 => ★★★★★ 임시 저장 여부 확인 필요

            // (적용 중) this.state.showWriteModal === true && targetFrom == TARGET.FROM_LEC
            // : 작성 모달에서 강좌 셀렉트 박스 클릭 시 > 강좌 모달 노출

            // (적용 중) this.state.showWriteModal === false && targetFrom == TARGET.FROM_REOPEN
            // : 강좌 모달에서 강좌 선택 시 > 작성 모달 노출

            // (적용 중) this.state.showWriteModal === true && targetFrom == TARGET.FROM_NONE
            // : 작성 모달에서 취소하는 경우 => ★★★★★ 임시 저장 처리 진행

            // (적용 중) this.state.showWriteModal === true && targetFrom == TARGET.FROM_CREATE
            // : 작성 모달에서 저장하는 경우

                // > createItemRemote
                // > (성공 시) getQuestionList(특정 유입 경로에서만 이후 진행)
                //      > (임시로 전체 케이스에 대해 이동)
                //      > toggleWriteModal
                // > (실패 시) toggleWriteModal

                /**
                 LOG  createItemRemote() response = {"code":"0000","desc":"선생님께 질문 등록","message":"성공","data":[]}
                 LOG  toggleWriteModal() this.state.showWriteModal = false
                 LOG  toggleWriteModal() targetFrom = create
                 LOG  MyQnaWriteModal.constructor() ableFileCnt = 5
                 LOG  toggleWriteModal() this.state.showWriteModal = true
                 LOG  toggleWriteModal() targetFrom = create
                **/


            /** 모달이 열리는 경우에 대한 로직 **/
            /** 모달이 열리는 경우에 대한 로직 **/
            /** 모달이 열리는 경우에 대한 로직 **/

            if(!this.state.showWriteMemoModal) {
                // 임시 저장글이 존재하는 경우


                // 임시 저장글이 존재하지 않는 경우

            }

            /** 모달이 닫히는 경우에 대한 로직 **/
            /** 모달이 닫히는 경우에 대한 로직 **/
            /** 모달이 닫히는 경우에 대한 로직 **/

            else {
                // 임시 저장 필요 여부 판단에 따른 얼럿창 노출


                // 임시 저장 필요한 경우


                // 임시 저장 필요하지 않은 경우
            }

            /** 이전 작업 내역 **/
            if (!this.state.showWriteModal && targetFrom !== TARGET.FROM_REOPEN) {
                console.log('toggleWriteModal()', 'CASE 4')
                await this.getHistory(targetFrom);

            } else if (!this.state.showWriteModal && targetFrom === TARGET.FROM_REOPEN) {
                console.log('toggleWriteModal()', 'CASE 5')
                this.setState({
                    showWriteModal: !this.state.showWriteModal,
                    toggleTargetFrom: targetFrom,
                });
            }


            /** 이전 작업 내역 **/

            // TODO 임시 작성글 테스트 및 미작업 부분 구현
            if (this.state.showWriteModal && targetFrom === TARGET.FROM_NONE
                && (
                    !CommonUtil.isEmpty(this.state.typedTitle)
                    || !CommonUtil.isEmpty(this.state.typedContent)
                )
            ) {
                console.log('toggleWriteModal()', 'CASE 2')
                this.tempSaveProcess(targetFrom);
                // Alert.alert(
                //     "",
                //     "작성중 상태입니다. \n임시저장하시겠습니까?(파일제외)",
                //     [
                //         {text: '네', onPress: () => this.tempSaveProcess(targetFrom)},
                //         {text: '아니오', onPress: () => {
                //             AsyncStorage.removeItem('myQnaTemp');
                //             this.setState({
                //                 showWriteModal: false,
                //                 toggleTargetFrom: targetFrom,
                //             });
                //         }},
                //     ],
                //     { cancelable: false }
                // );
            } else {
                console.log('toggleWriteModal()', 'CASE 3')
                this.setState({
                    showWriteModal: false,
                    toggleTargetFrom: targetFrom,
                });
            }
            // 임시 저장글이 있는 경우 > 얼럿으로 선택

            // 임시 저장글이 없는 경우 > 모달 오픈
        }


        // TODO 순수하게 강좌, 강의 목록만 가져오는 기능만 수행하도록 수정
        getOwnLectureList = async() => {
            const domain = SERVICES[this.props.myClassServiceID].apiDomain
            const url = domain + '/v1/myClass/class/'+ this.state.memberIdx;

            const options = {
                method: 'GET',
                headers: {
                    ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
                },
            };
            
            await CommonUtil.callAPI(url, options, 10000)
                .then(response => {
                        if (response && response.code === '0000') {
                            let ownLecItems = response.data.class;
                            this.setState({
                                ownLecItems: ownLecItems,
                                ableFileCnt: response.data.ableFileCnt == -1
                                                ? MAXIMUM_UPLOAD_FILE_COUNT
                                                : response.data.ableFileCnt
                            });
                        } else {
                            response.message
                                ? Toast.show(response.message)
                                : Toast.show('강의 목록을 불러오는데 실패 했습니다.');
                        }
                    }).catch(error => {
                        console.log(error)
                        Toast.show('시스템 에러: 강의 목록을 불러오는데 실패 했습니다.');
                });
        }

        tempSaveProcess = async (targetFrom = TARGET.FROM_NONE) => {
            // const selectedClass = this.state.classList.find(item => item.memberClassIdx === this.state.selectedLecItemMemberClassIdx);
            const selectedClass = this.state.ownLecItems.find(item =>
                item.memberClassIdx === this.state.selectedLecItemMemberClassIdx
            );
            await AsyncStorage.removeItem('myQnaTemp');
            const newData = {
                formMemberIdx: this.state.memberIdx,
                formClassIdx: selectedClass.classIdx,
                formMemberClassIdx: selectedClass.memberClassIdx,
                formTitle: this.state.typedTitle,
                formContents: this.state.typedContent,
            };

            //console.log('tempSaveProcess()', 'myQnaTemp = ' + JSON.stringify(newData))

            AsyncStorage.setItem('myQnaTemp', JSON.stringify(newData));
            /*
            this.setState({
                showWriteModal: false,
                toggleTargetFrom: targetFrom,
            });
            */
        }

        setQuestionInterval = (targetFrom = TARGET.FROM_NONE) => {
            //console.log('setQuestionInterval()', 'SET INTERVAL')
            this.interval = setInterval(
                () => {
                    if(!CommonUtil.isEmpty(this.state.typedTitle)
                        || !CommonUtil.isEmpty(this.state.typedContent)) {
                        //console.log('setQuestionInterval', 'CALL INTERVAL, SAVE PROCESS')
                        this.tempSaveProcess(targetFrom)
                    } else {
                        //console.log('setQuestionInterval', 'CALL INTERVAL, BUT MEANLESS')
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
            await AsyncStorage.getItem('myQnaTemp', (error, result) => {
                {   
                    if(result) {
                        const tempData = JSON.parse(result);
                        Alert.alert(
                            "",
                            "작성 중인 게시글이 있습니다.\n" + "이동하시겠습니까?",
                            [
                                {text: '네', onPress: () => {
                                    this.setState({
                                        attachedFileSize: 0,
                                        toggleTargetFrom: targetFrom,
                                        selectedLecItemMemberClassIdx: tempData.formMemberClassIdx,
                                        typedTitle: tempData.formTitle,
                                        typedContent: tempData.formContents,
                                        showWriteModal: !this.state.showWriteModal,
                                    });
                                    this.setQuestionInterval(targetFrom)
                                }},
                                {text: '아니오', onPress: () =>  {
                                    AsyncStorage.removeItem('myQnaTemp');
                                    this.setState({
                                        attachedFileSize: 0,
                                        toggleTargetFrom: targetFrom,
                                        showWriteModal: !this.state.showWriteModal,
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
                                showWriteModal: !this.state.showWriteModal,
                                toggleTargetFrom: targetFrom,
                            });
                        }
                    }
                }
            });   
        }

        onChangeTitle = (text) => {
            this.setState({
                typedTitle: text,
            })
        }

        getDataTitle = () => {
            return this.state.typedTitle;
        }

        onChangeContent = (text) => {
            this.setState({
                typedContent: text,
            })
        }

        getDataContent = () => {
            return this.state.typedContent;
        }

        insertTmpItemRemote = (attachedItem, attachedFileSize) => {
            var newTmpAttachedItem = this.state.tmpAttachedItems;
            newTmpAttachedItem.push(attachedItem);

            this.setState({
                tmpAttachedItems: newTmpAttachedItem,
                attachedFileSize: attachedFileSize,
            });
        }

        updateTmpItemRemote = (attachedItems, attachedFileSize) => {
            this.setState({
                tmpAttachedItems: attachedItems,
                attachedFileSize: attachedFileSize,
            });
        }

        createItemRemote = async () =>  {
            console.log('createItemRemote()', 'CALL')


            if(this.state.typedTitle === '') {
                Alert.alert('', '제목을 입력해주세요.');
                return;
            }

            if(this.state.typedContent === '') {
                Alert.alert('', '내용을 입력해주세요.');
                return;
            }

            this.clearQuestionInterval()

            this.setState({loading: true});
            const url =
                SERVICES[this.props.myClassServiceID].apiDomain +
                '/v1/myClass/teacherQuestion/' + this.state.memberIdx;
            //console.log('createItemRemote()', 'url = ' + url)
            const formData = new FormData();
            formData.append('memberClassIdx', this.state.selectedLecItemMemberClassIdx);
            formData.append('memberLectureIdx', this.state.selectedLecItemMemberLectureIdx);
            formData.append('questionTitle', this.state.typedTitle);
            formData.append('questionContent', this.state.typedContent);
            formData.append('regDevice', 'mobile');

            this.state.tmpAttachedItems.forEach((item, i) => {
                formData.append("attachFile[]", item);
            });

            const options = {
                method: 'POST',
                headers: {
                    //Accept: 'application/json',
                    Accept: 'text/html',
                    'Content-Type': 'multipart/form-data',
                    //'apiKey': DEFAULT_CONSTANTS.apitestKey
                },
                body: formData,
            };
            
            await CommonUtil.callAPI(url, options, 100000)
                .then(response => {
                    //console.log('createItemRemote()', 'response = ' + JSON.stringify(response))
                    if (response && response.code === '0000') {
                        AsyncStorage.removeItem('myQnaTemp');
                        this.setState({
                            questionList: [],
                            currentPage: 1,
                        }, function() {
                            this.getQuestionList(TARGET.FROM_CREATE);
                        })

                    } else {
                        this.setState({loading: false});
                        response.message
                            ? Toast.show('', response.message)
                            : Toast.show('', '질문 등록에 실패 했습니다.');
                    }
                })
                .catch(error => {
                    //console.log('error : ', error);
                    Toast.show('시스템 에러: 질문 등록에 실패 했습니다.');
                    this.setState({loading: false});
                });


            this.toggleWriteModal(TARGET.FROM_CREATE)
        }

        getNextIndex = () => {
            var maxIndex = 0;
            this.state.questionList.map((item, index) => {
                if(maxIndex < item.index) {
                    maxIndex = item.index;
                }
            });

            return maxIndex + 1;
        }
    /** renderWriteModal end **/
    /** renderWriteModal end **/

    getTargetItemKey = () => {
        return this.state.targetItemKey
    }

    renderModifyModal = () => {
        return (
            <Modal
                animationType="slide"
                onRequestClose={() => this.toggleModifyModal()}
                onBackdropPress={() => this.toggleModifyModal()}
                style={styles.commonModalContainer}
                useNativeDriver={true}
                animationInTiming={300}
                animationOutTiming={300}
                hideModalContentWhileAnimating
                isVisible={this.state.showModifyModal}
                onModalHide={() => {
                    switch(this.state.toggleTargetFrom) {
                        case TARGET.FROM_LEC_KANG:
                            this.toggleWriteModal()
                            break;
                        default:
                            break;
                    }
                }}
            >
                <View style={[
                        styles.commonModalWrapper,
                        styles.modifyModalWrapper,
                    ]}
                    >
                    <MyQnaModifyModal screenState={this.state}/>
                </View>
            </Modal>
        )
    }

    /** renderModifyModal start **/
    /** renderModifyModal start **/
        deleteItemRemote = (teacherQuestionIdx) => {
            //console.log('deleteItemRemote()', 'teacherQuestionIdx = ' + teacherQuestionIdx)
            Alert.alert('', '삭제하시겠습니까?', [
                {text: '확인', onPress: () => this.procDelete(teacherQuestionIdx, true) },
                {text: '취소'},
            ]);
        }

        procDelete = (teacherQuestionIdx, doInModal = false) => {
            this.setState({loading: true});
            const url =
                SERVICES[this.props.myClassServiceID].apiDomain +
                '/v1/myClass/teacherQuestion/' + this.state.memberIdx;
            const bodyData = JSON.stringify({
                teacherQuestionIdxList: [teacherQuestionIdx],
            });
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
                body: bodyData,
            };
            console.log('url : ', url);
            console.log('options : ', options);
            CommonUtil.callAPI(url, options, 10000)
                .then(response => {

                    //console.log('procDelete()', 'response = ' + JSON.stringify(response))

                    if (response && response.code === '0000') {
                        /*테스트 코드
                        var newTargetItems = this.state.questionList.filter(function(newItem, newIndex) {
                            return teacherQuestionIdx !== newItem.teacherQuestionIdx;
                        });

                        this.setState({ questionList: newTargetItems, loading: false });
                        */

                        this.setState({
                            questionList: [],
                            page: 1,
                        }, function() {
                            this.getQuestionList();
                        })


                        if(doInModal)
                            this.toggleModifyModal();
                    } else {
                    this.setState({loading: false});
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('질문 삭제에 실패 했습니다.');
                    }
                })
                .catch(error => {
                    console.log('error : ', error);
                    Toast.show('시스템 에러: 질문 삭제에 실패 했습니다.');
                    this.setState({loading: false});
                });
        };

        updateItemRemote = (key, title, content) => {
            this.setState({loading: true});
            const url =
                SERVICES[this.props.myClassServiceID].apiDomain +
                '/v1/myClass/teacherQuestion/' + this.state.memberIdx + '/' + key;
            // const formData = new FormData();
            // formData.append('questionTitle', title);
            // formData.append('questionContent', content);
            const bodyData = JSON.stringify({
                questionTitle: title,
                questionContent: content,
            });
            const options = {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: bodyData,
            };
            console.log('url : ', url);
            console.log('options : ', options);
            CommonUtil.callAPI(url, options, 10000)
                .then(response => {
                    if (response && response.code === '0000') {
                        var newTargetItems = [];
                        this.state.questionList.map((newItem, newIndex) => {
                            if(key == newItem.index) {
                                newTargetItems.push({
                                    ...newItem,
                                    questionTitle: title,
                                    questionContent: content,
                                    attachedItems: {...this.state.tmpAttachedItems}
                                })
                            } else {
                                newTargetItems.push({...newItem});
                            }
                        });
                        this.setState({questionList: newTargetItems});
                        this.toggleModifyModal();
                    } else {
                    this.setState({loading: false});
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('질문 수정에 실패 했습니다.');
                    }
                })
                .catch(error => {
                    console.log('error : ', error);
                    Toast.show('시스템 에러: 질문 수정에 실패 했습니다.');
                    this.setState({loading: false});
                });
        }

        toggleModifyModal = (targetFrom = TARGET.FROM_NONE) => {
            this.setState({
                showModifyModal: !this.state.showModifyModal,
                toggleTargetFrom: targetFrom,
            })
        }
    /** renderModifyModal end **/
    /** renderModifyModal end **/

    renderCompleteModal = () => {
        return (
            <Modal
                onBackdropPress={() => this.toggleCompleteModal()}
                animationType="slide"
                onRequestClose={() => this.toggleCompleteModal()}
                onBackdropPress={() => this.toggleCompleteModal()}
                style={styles.commonModalContainer}
                useNativeDriver={true}
                animationInTiming={300}
                animationOutTiming={300}
                hideModalContentWhileAnimating
                isVisible={this.state.showCompleteModal}
                //onModalHide={() => {}}
                >
                <View style={[
                    styles.commonModalWrapper,
                    styles.completeModalWrapper,
                    // styles.modifyModalWrapper,
                ]}>
                    <MyQnaCompleteModal screenState={this.state}/>
                </View>
            </Modal>
        )
    }

    /** renderComplete start **/
    /** renderComplete start **/
        toggleCompleteModal = (targetFrom = TARGET.FROM_NONE) => {
            this.setState({
                showCompleteModal: !this.state.showCompleteModal,
                toggleTargetFrom: targetFrom,
            })
        }


    /** renderComplete end **/
    /** renderComplete end **/

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
                            this.toggleWriteModal(TARGET.FROM_REOPEN)
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

    /** renderLecListModal start **/
    /** renderLecListModal start **/
    toggleLecListModal = (targetFrom) => {
        this.setState({
            showLecListModal: !this.state.showLecListModal,
            toggleTargetFrom: targetFrom,
        })
    };

    setDataLecListModel = (targetFrom, memberClassIdx) => {
        if(memberClassIdx != this.state.selectedLecItemMemberClassIdx) {
            this.setState({
                selectedLecItemMemberClassIdx: memberClassIdx,
                selectedLecItemMemberLectureIdx: -1,
            })
        } else {
            this.setState({
                selectedLecItemMemberClassIdx: memberClassIdx,
            })
        }
        this.toggleLecListModal(targetFrom)
    }

    getSelectedLecItemTitle = () => {
        //console.log('this.state.ownLecItems : ', this.state.ownLecItems);
        //console.log('this.state.ownLecItems[0] : ', this.state.ownLecItems[0]);
        // return this.state.ownLecItems.find(item => item.memberClassIdx === this.state.selectedLecItemMemberClassIdx).className;
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
        // for (let lecItem of this.state.ownLecItems) {
        //     if(this.state.ownLecItems.indexOf(lecItem.memberClassIdx) == this.state.selectedLecItemMemberClassIdx) {
        //         console.log('lecItem : ', lecItem);
        //         return lecItem.className;
        //     }
        // }
    }
    /** renderLecListModal end **/
    /** renderLecListModal end **/

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
                            this.toggleWriteModal()
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

    /** renderLecKangListModal start **/
    /** renderLecKangListModal start **/
    toggleLecKangListModal = (targetFrom) => {
        this.setState({
            showLecKangListModal: !this.state.showLecKangListModal,
            toggleTargetFrom: targetFrom,
        })
    };

    setDataLecKangListModel = (targetFrom, index) => {
        this.setState({
            selectedLecItemMemberLectureIdx: index,
        })
        this.toggleLecKangListModal(targetFrom)
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
    /** renderLecKangListModal end **/
    /** renderLecKangListModal end **/

    renderEmpty = () => {
        return(
            <View style={
                this.state.notiList.length == 0
                    ? styles.emptyContainerEmptyNoti
                    : styles.emptyContainer
            }>
                <Image
                    style={styles.emptyIcon}
                    source={require('../../../assets/icons/icon_none_memo.png')}
                />
                <CustomTextR style={styles.emptyTitle}>
                    등록된 질문이 없습니다
                </CustomTextR>
            </View>
        )
    }
}

MyQnaContent.propTypes = {
    myClassQnaModifyMode: PropTypes.bool,
    myClassServiceID: PropTypes.string,
};

const mapStateToProps = state => {
    return {
        myClassClassList: state.GlabalStatus.myClassClassList,
        myClassQnaModifyMode: state.GlabalStatus.myClassQnaModifyMode,
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,
        myClassServiceID: state.GlabalStatus.myClassServiceID,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateMyClassQnaModifyMode:(boolean) => {
            dispatch(ActionCreator.updateMyClassQnaModifyMode(boolean));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(MyQnaContent);

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
        //marginTop: 30,
    },

    /** renderContent start **/
    /** renderContent start **/
    listContainer: {
        flex: 1,
        marginBottom: 60,
    },
    listSeparator: {
        height: 1,
        backgroundColor: '#E8E8E8',
    },
    rowFrontContainer: {
        // height: HEIGHT_SWIPE_ITEM,
        justifyContent: 'space-between',
        // paddingVertical: 19,
        paddingRight: 30,
        paddingLeft: 20,
    },
    rowFrontContainerUnswiped: {
        backgroundColor: DEFAULT_COLOR.base_color_fff,
    },
    rowFrontContainerSwiped: {
        backgroundColor: '#e2f3f8',
    },
    rowFrontStateUnsolved: {
        color: '#AAAAAA',
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),
        letterSpacing: -0.9,
        marginBottom: 11,
    },
    rowFrontStateSolved: {
        color: DEFAULT_COLOR.lecture_base,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),
        letterSpacing: -0.9,
        marginBottom: 11,
    },
    rowFrontSecretIcon: {
        width: 16,
        height: 16.3,
        marginLeft: 3.3,
        opacity: 0.7,
    },
    rowFrontTitle: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),
        lineHeight: PixelRatio.roundToNearestPixel(18),
        letterSpacing: -0.65,
        marginBottom: 11,
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
        height: '100%', // HEIGHT_SWIPE_ITEM,
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
        width: 21.3,
        height: 20,
    },

    controlBottomContainer: {
        width: SCREEN_WIDTH,
        height: 55,
        //position: 'absolute',
        //bottom: 0,
        //left: 0,
        //right: 0,
        backgroundColor: DEFAULT_COLOR.lecture_base,
    },
    controlBottomWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    controlBottomText: {
        color: DEFAULT_COLOR.base_color_fff,
        fontSize: PixelRatio.roundToNearestPixel(18),
    },
    /** renderContent end **/
    /** renderContent end **/


    /** renderNoticeEmpty start **/
    /** renderNoticeEmpty start **/

    /** renderNoticeEmpty end **/
    /** renderNoticeEmpty end **/


    /** renderNoticeContent start **/
    /** renderNoticeContent start **/
    noticeListContainer: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 14,
        backgroundColor: DEFAULT_COLOR.input_bg_color,
    },
    noticeItemContainer: {
        // height: 60,
        //borderRadius: 4,
        //borderWidth: 0.5,
        //borderColor: '#E3E5E5',
        marginBottom: 6,
        //marginBottom: 6,
        justifyContent: 'center',
    },
    noticeItemWrapper: {
        // height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        backgroundColor: DEFAULT_COLOR.base_color_fff,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e8e8e8',
    },
    noticeItemLeft: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noticeItemLeftIcon: {
        width: 25.3,
        height: 20,
        alignSelf: 'center',
    },
    noticeItemRight: {
        flex: 5,
        marginRight: 18,
        justifyContent: 'center',
    },
    noticeItemTop: {
        marginBottom: 6.8,
    },
    noticeItemTopTitle: {
        color: DEFAULT_COLOR.lecture_base,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),
        lineHeight: PixelRatio.roundToNearestPixel(18),
        letterSpacing: -0.6,
    },
    noticeItemBottom: {
        flexDirection: 'row',
    },
    noticeItemBottomTitle: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),
        lineHeight: PixelRatio.roundToNearestPixel(18),
        letterSpacing: -0.65,
    },
    noticeItemBottomIcon: {
        marginTop: -5,
        width: 8,
        height: 8,
    },
    questionItemBottomIcon: {
        marginTop: -1.0,
        marginLeft: 2,
        width: 8,
        height: 8,
    },
    /** renderNoticeContent end **/
    /** renderNoticeContent end **/

    /** renderEmtpy start **/
    /** renderEmtpy start **/
        emptyContainer: {
            flex: 1,
            height: SCREEN_HEIGHT * 0.3,
            alignItems: 'center',
            justifyContent: 'center',
        },
        emptyContainerEmptyNoti: {
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
            fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
            lineHeight: PixelRatio.roundToNearestPixel(18),
            letterSpacing: -0.7,
        },
    /** renderEmtpy end **/
    /** renderEmtpy end **/

    /** common start **/
    /** common start **/
        commonModalContainer: {
            justifyContent: 'flex-end',
            margin: 0,
        },
        commonModalWrapper: {
            paddingTop: 16,
            backgroundColor: '#fff',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
        },
    /** common end **/
    /** common end **/

    /** renderModifyModal start **/
    /** renderModifyModal start **/
        writeModalWrapper: {
            height: HEIGHT_WRITE_MODAL,
        },
        modifyModalWrapper: {
            height: HEIGHT_MODIFY_MODAL,
        },
    /** renderModifyModal end **/
    /** renderModifyModal end **/

    /** renderCompleteModal start **/
    /** renderCompleteModal start **/
        completeModalWrapper: {
            backgroundColor: 'transparent',
            height: '100%', //HEIGHT_COMPLETE_MODAL,
            justifyContent: 'flex-end',
        },

    /** renderCompleteModal end **/
    /** renderCompleteModal end **/

    /** renderLecListModal start **/
    /** renderLecListModal start **/
        lecListModalWrapper: {
            height: HEIGHT_LEC_LIST_MODAL,
        },
    /** renderLecListModal end **/
    /** renderLecListModal end **/

    /** renderLecKangListModal start **/
    /** renderLecKangListModal start **/
        lecKangListModalWrapper: {
            height: HEIGHT_LEC_KANG_LIST_MODAL,
        },
    /** renderLecKangListModal end **/
    /** renderLecKangListModal end **/

});
