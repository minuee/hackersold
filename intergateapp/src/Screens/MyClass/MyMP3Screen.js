import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Animated,
    PixelRatio,
    // Modal,
    Dimensions,
    Image,
    ActivityIndicator,
} from 'react-native';
import BottomDrawer from 'rn-bottom-drawer';
import styles2 from '../../Style/TextBook/TextBookDetail';
import LinearGradient from 'react-native-linear-gradient';
import AutoHeightImage from 'react-native-auto-height-image';
import moment from 'moment';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import SwipeRow from '../../Utils/SwipeListView/SwipeRow';
import TextTicker from '../../Utils/TextTicker';
import Modal from 'react-native-modal';

import COMMON_STATES, {SERVICES} from '../../Constants/Common';
import * as getDEFAULT_CONSTANTS from '../../Constants';

const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import {CustomTextB, CustomText, CustomTextR, CustomTextM} from '../../Style/CustomText';
import {ARTICLE, TARGET} from './Modal/ModalConstant';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

import MyClassStyles from '../../Style/MyClass/MyClassStyle';
import Toast from 'react-native-tiny-toast';
import CommonUtil from '../../Utils/CommonUtil';
import AsyncStorage from '@react-native-community/async-storage';

const TAB_BAR_HEIGHT = isIphoneX() ? 20 : 0;
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export function isIphoneX() {
    const dimen = Dimensions.get('window');
    return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        ((dimen.height === 812 || dimen.width === 812) || (dimen.height === 896 || dimen.width === 896))
    );
}

// SwipeRow
const HEIGHT_SWIPE_ITEM = 120;
const COUNT_RIGHT_SWIPE_BUTTON = 1;
const WIDTH_RIGHT_SWIPE_BUTTON = 65.3;
const COUNT_LEFT_SWIPE_BUTTON = 0;
const WIDTH_LEFT_SWIPE_BUTTON = 65.3;

class MyMP3Screen extends Component {
    constructor(props) {
        super(props);
        // SwipeRow Component Ref 배열
        this.targetRows = {};
        this.state = {

            /** 1차 수정안 적용 영역 시작 **/
            loading: false,
            myClassServiceID: props.myClassServiceID,
            apiDomain: '',
            /** 1차 수정안 적용 영역 종료 **/

            showModal: false,
            //selectedSubjectIndex: 0,
            selectedSubjectCode: '', // level03

            /** renderContent start **/
            /** renderContent start **/
            disableLeftSwipe: false,
            disableRightSwipe: true,
            /** renderContent end **/
            /** renderContent end **/

            subjectList: [
                {index: 1, title: '전체 과목',},
                {index: 2, title: 'HSK',},
                {index: 3, title: '회화',},
                {index: 4, title: '오픽 중·고급',},
                {index: 5, title: 'TSC',},
                {index: 6, title: '기초',},
                {index: 7, title: '일본어',},
                {index: 8, title: '중국어',},
            ],
            targetItems: [
                /*
                {
                    index: 1,
                    title: '[HSK 5급 단어장]단어와 예문 암기(중,한) 단어와 예문 암기(중,한)',
                    desc: '해커스 HSK 5급 단어장',
                    thumbUrl: 'http://gscdn.hackers.co.kr/hackers/files/bookmanager/5a66e50b32a2443117a79568abe7b311.jpg',
                    isFavorite: true,
                },
                {
                    index: 2,
                    title: '[HSK 5급 단어장]단어와 예문 암기(중,한) 단어와 예문 암기(중,한)',
                    desc: '해커스 HSK 5급 단어장',
                    thumbUrl: 'http://gscdn.hackers.co.kr/hackers/files/bookmanager/570e52618fddeddced7696f50983c00a.png'
                },
                */
            ],

            baseBookInfo: {
                // bookIdx: 2, //bookidx, 2,77,75
                // title: '해커스 토익 스타트 Listening 해커스 토익 스타트 Listening 해커스 토익 스타트 Listening 해커스 토익 스타트 Listening 해커스 토익 스타트 Listening 해커스 토익 스타트 Listening',
                // commonInfo: {
                //     image: '',
                //     isOffClass: true,
                //     offClassUrl: null,
                //     classList: [
                //         {
                //             id: 0,
                //             title: null,
                //             teacherName: null,
                //             lectureCnt: 0,
                //         },
                //     ],
                // },
                // bookInfo: {
                //     description: null,
                //     oriPrice: 0,
                //     price: 0,
                //     countForDiscount: 0,
                //     discountByCount: 0,
                //     infoMsg: '',
                // },
                // purchaseUrl: {
                //     url1: null,
                //     url2: null,
                // },
            },
        };
    }

    /** 1차 수정안 적용 영역 시작 **/
    async UNSAFE_componentWillMount() {
        await this.setState({
            apiDomain: SERVICES[this.props.myClassServiceID].apiDomain,
        });
        // API Data
        await this.getOwnMP3List();
    }

    async UNSAFE_componentWillReceiveProps(nextProps) {
        // 강의실 이동 시 reload
        if (nextProps.myClassServiceID !== this.state.myClassServiceID) {
            await this.setState({
                myClassServiceID: nextProps.myClassServiceID,
                apiDomain: SERVICES[nextProps.myClassServiceID].apiDomain,
            });
            await this.getOwnMP3List();
        }
    }

    getOwnMP3List = async () => {
        this.setState({loading: true});

        const memberIdx = await CommonUtil.getMemberIdx();
        // let aPIsDomain = !CommonUtil.isEmpty(this.props.myInterestCodeOne) && typeof this.props.myInterestCodeOne.info.ApiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.ApiDomain : DEFAULT_CONSTANTS.apiTestDomain
        //console.log('getOwnMP3List()', 'domain = ' + domain)
        const url = this.state.apiDomain + '/v1/myClass/mp3/' + memberIdx;
        const options = {
            method: 'GET',
            headers: {
                ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
            },
        };
        await CommonUtil.callAPI(url, options, 10000)
            .then(response => {
                // console.log('getOwnMP3List()', 'response = ' + JSON.stringify(response));

                if (response && response.code === '0000') {
                    // console.log('getOwnMP3List()', 'mp3List = ' + JSON.stringify(response.data));
                    this.setBookList(response.data);
                } else {
                    this.setState({loading: false});
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('MP3 목록을 불러오는데 실패 했습니다.');
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    loading: false,
                    classList: [],
                });
                Toast.show('시스템 에러: MP3 목록을 불러오는데 실패 했습니다.');
            });
    };

    setBookList = async targetItems => {
        // AsyncStorage.removeItem('MyMP3FavoriteItems');
        const tempFavo = await AsyncStorage.getItem('MyMP3FavoriteItems');
        let myMp3FavoriteItems = [];
        if (tempFavo) {
            myMp3FavoriteItems = JSON.parse(tempFavo);
        }
        let subjectList = [
            {
                level03: '',
                level03Name: '전체 과목',
            },
        ];

        const newTargetItems = targetItems
            .map((item, key) => {
                // console.log('targetItems[' + index + ']', 'level03 = ' + item.level03)
                // console.log('targetItems[' + index + ']', 'level03Name = ' + item.level03Name)
                const newSubjectItem = {
                    level03: item.level03,
                    level03Name: item.level03Name,
                };

                // 애초에 키를 기준으로 데이터가 들어가 있어야 함Ω©
                if (
                    subjectList.filter(function(subItem) {
                        return (
                            item.level03 === subItem.level03 &&
                            item.level03Name === item.level03Name
                        );
                    }).length > 0
                ) {
                    //console.log('해당 항목은 이미 배열에 존재함')
                } else {
                    //console.log('해당 항목은 배열에 존재하지 않음')
                    subjectList.push(newSubjectItem);
                }
                let tempItems = {...item};
                const favoriteItem = myMp3FavoriteItems && myMp3FavoriteItems.find(favoriteItem => item.bookIdx === favoriteItem.bookIdx);
                if (favoriteItem) {
                    tempItems = {
                        ...item,
                        isFavorite: favoriteItem.isFavorite,
                        isOpened: false,
                    };
                }
                return tempItems;
            })
            .sort((a, b) => {
                // 즐겨찾기 정렬
                if (a.isFavorite || b.isFavorite) {
                    return a.isFavorite ? -1 : 1;
                }

                // // 최근 즐겨찾기 정렬
                if (a.favoriteTimestamp || b.favoriteTimestamp) {
                    a.favoriteTimestamp < b.favoriteTimestamp ? -1 : 1;
                }

                // 과목 정렬 (level03Name)
                if (a.level03Name !== b.level03Name) {
                    return a.level03Name.localeCompare(b.level03Name);
                }

                // MP3 title 정렬
                // if (a.mp3Title !== b.mp3Title) {
                //     return a.mp3Title.localeCompare(b.mp3Title);
                // }

                // 최근 구매순
                if (a.puchasedDatetime !== b.puchasedDatetime) {
                    return moment(b.puchasedDatetime) - moment(a.puchasedDatetime);
                }

                return 0;
            });

        await this.setState({
            loading: false,
            //targetItems: response.data,
            targetItems: newTargetItems,
            subjectList: subjectList,
        });
    };

    selectSubject = subjectCode => {
        //this.setState({selectedSubjectIndex: subjectIndex})
        this.setState({selectedSubjectCode: subjectCode});
        this._closeModal();
    };

    _showModal = async mode => {
        this.setState({showModal: true});
    };

    _closeModal = () => {
        this.setState({showModal: false});
    };

    getSelectedSubjectTitle = () => {
        for (let subjectItem of this.state.subjectList) {
            if (subjectItem.level03 === this.state.selectedSubjectCode) {
                return subjectItem.level03Name;
            }
        }

        //return this.state.subjectList[this.state.selectedSubjectIndex].level03Name;
        //return this.state.subjectList[this.state.selectedSubjectCode].level03Name;
    };

    goDetail = async book => {
        this.props.screenProps.navigation.navigate('MyMP3DetailScreen', {
            // bookInfo: this.state.baseBookInfo,
            bookInfo: {
                bookIdx: book.bookIdx,
                title: book.bookTitle,
            },
            bannerurl: book.bookImage,
            mpCode: book.mpCode,
            fileIdx: book.fileIdx || 0,
            certResult: book.certResult || false,
        });
    };

    render() {
        this.state.targetItems.length === 0
            ? this.props.updateIsMyClassOwnMP3Empty(true)
            : this.props.updateIsMyClassOwnMP3Empty(false);

        return this.state.loading ? (
            <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
        ) : (
            <View style={styles.container}>
                {this.state.targetItems.length > 0 && this.renderHeader()}
                {this.state.targetItems.length === 0
                    ? this.renderEmpty()
                    : this.renderContent()}
                {this.renderModal()}
            </View>
        );
    }

    renderEmpty = () => {
        return (
            <View style={styles.emptyContainer}>
                <Image
                    style={styles.emptyIcon}
                    source={require('../../../assets/icons/icon_none_exclamation.png')}
                />
                <CustomTextR style={styles.emptyTitle}>
                    구매하신 MP3가 없습니다
                </CustomTextR>
            </View>
        );
    };

    renderContent = () => {
        let selectedSubjectCode = this.state.selectedSubjectCode;

        return (
            <View style={styles.listContainer}>
                {// 1단계 필터링 > 2단계 매핑 순으로 진행
                // 필터링 조건
                // - 전체 과목 시, 전체 리턴
                // - 과목 선택 시, 특정 리턴
                this.state.targetItems
                    .filter(function(item) {
                        return selectedSubjectCode === '' || selectedSubjectCode === item.level03;
                    })
                    .map((item, index) => {
                        return (
                            <SwipeRow
                                key={index}
                                ref={ref => (this.targetRows[item.mpCode] = ref)}
                                onRowPress={() => {
                                    if (item.isOpened) {
                                        var newTargetItems = [];
                                        this.state.targetItems.map((newItem, newIndex) => {
                                                if (index === newIndex) {
                                                    newItem.isOpened &&
                                                        this.targetRows[newItem.mpCode].closeRow();
                                                    newTargetItems.push({...newItem, isOpened: false})
                                                } else {
                                                    newTargetItems.push({...newItem});
                                                }
                                            },
                                        );
                                        this.setState({targetItems: newTargetItems});
                                    } else {
                                        // alert(JSON.stringify(item))
                                        this.goDetail(item);
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
                                            if (index === newIndex) {
                                                newTargetItems.push({...newItem, isOpened: true})
                                            } else {
                                                newItem.isOpened && this.targetRows[newItem.mpCode].closeRow();
                                                newTargetItems.push({...newItem, isOpened: false});
                                            }
                                    });
                                    this.setState({targetItems: newTargetItems});
                                }}
                                onRowClose={() => {
                                    var newTargetItems = this.state.targetItems.map((item, newIndex) => (
                                            index === newIndex
                                                ? {...item, isOpened: false}
                                                : item
                                    ));
                                    this.setState({targetItems: newTargetItems});
                                }}>
                                {/* <View style={hiddenRowStyle} /> */}
                                <View style={styles.rowBackContainer}>
                                    <TouchableOpacity></TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.backCommonBtn,
                                            styles.backRightBtn,
                                            styles.backRightBtnFirst,
                                        ]}
                                        onPress={() => this.toggleFavoriteItem(index)}>
                                        <Image
                                            style={styles.backRightBtnFirstIcon}
                                            source={
                                                item.isFavorite
                                                    ? require('../../../assets/icons/btn_gesture_favorite_off.png')
                                                    : require('../../../assets/icons/btn_gesture_favorite_on.png')
                                            }
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* <View style={visibleRowStyle} /> */}
                                <View style={
                                        item.isOpened || item.isSelected
                                            ? [ styles.rowFrontContainer, styles.rowFrontContainerSwiped ]
                                            : [ styles.rowFrontContainer, styles.rowFrontContainerUnswiped ]
                                    }>
                                    <View style={[{width: '100%', flexDirection: 'row', paddingVertical: 16, borderBottomColor: '#e8e8e8'}]}>
                                        <View style={styles.rowFrontLeftWrapper}>
                                            <AutoHeightImage
                                                style={styles.rowFrontLeftThumb}
                                                width={SCREEN_WIDTH * 0.15}
                                                source={{ uri: item.bookImage }}
                                            />
                                        </View>

                                        <View style={styles.rowFrontCenterWrapper}>
                                            <CustomTextM
                                                style={styles.rowFrontTitle}
                                                numberOfLines={2}>
                                                { item.mp3Title }
                                            </CustomTextM>
                                            <TextTicker
                                                //marqueeOnMount={false} 
                                                ref={c => this.marqueeRef = c}
                                                style={[MyClassStyles.fontNotoR, styles.rowFrontDesc]}
                                                shouldAnimateTreshold={10}
                                                duration={5000}
                                                loop
                                                bounce
                                                repeatSpacer={50}
                                                marqueeDelay={1000}>
                                                { item.bookTitle }
                                            </TextTicker>
                                            {/* <CustomTextR
                                                style={styles.rowFrontDesc}
                                                numberOfLines={1}>
                                                { item.bookTitle } ({item.puchasedDatetime})
                                            </CustomTextR> */}
                                        </View>

                                        <View style={styles.rowFrontRightWrapper}>
                                            {item.isFavorite && (
                                                <Image
                                                    style={styles.rowFrontRightIcon}
                                                    source={require('../../../assets/icons/icon_star_on_l.png')}
                                                />
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </SwipeRow>
                        );
                    })}
            </View>
        );
    };

    renderHeader = () => {
        return (
            <View style={styles.headerOff}>
                <View style={styles.searchOffArea}></View>
                <View style={styles.filterArea}>
                    <CustomTextR style={styles.filterTitle}>
                        { this.getSelectedSubjectTitle() }
                    </CustomTextR>
                    <TouchableOpacity
                        style={styles.filterIconWrapper}
                        onPress={() => this._showModal()}>
                        <Image
                            style={styles.filterIcon}
                            source={require('../../../assets/icons/btn_select_open_on.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    toggleFavoriteItem = async index => {
        // 자연스러운 삭제 처리를 위한 스와이프 종료 이벤트를 받기 위한 SwipeRow.closeRow 함수 커스터마이즈
        var newTargetItems = [];
        const savedFavo = await AsyncStorage.getItem('MyMP3FavoriteItems');
        let favoriteItems = savedFavo ? JSON.parse(savedFavo) : [];
        this.state.targetItems.map((newItem, newIndex) => {
            if (index === newIndex) {
                const item = {...newItem, isFavorite: !newItem.isFavorite, favoriteTimestamp: moment().format('X'), isOpened: false};
                if (!newItem.isFavorite) {
                    // 즐겨찾기 추가인 경우
                    favoriteItems.push(item);
                } else {
                    // 즐겨찾기 해제 경우
                    const idx = favoriteItems.findIndex(fov => fov.mpCode === newItem.mpCode);
                    if (idx > -1) {
                        favoriteItems.splice(idx, 1);
                    }
                }
                newTargetItems.push(item);
            } else {
                newTargetItems.push({...newItem, isOpened: false});
            }
            // 스와이프 닫기
            this.targetRows[newItem.mpCode].closeRow();
        });
        await AsyncStorage.setItem('MyMP3FavoriteItems', JSON.stringify(favoriteItems));
        this.setBookList(newTargetItems);
    };

    renderModal = () => {
        return (
            <Modal
                onBackdropPress={this._closeModal}
                animationType="slide"
                onRequestClose={() => {
                    this.setState({showModal: false});
                }}
                useNativeDriver={true}
                animationInTiming={300}
                animationOutTiming={300}
                hideModalContentWhileAnimating
                isVisible={this.state.showModal}
                style={{justifyContent: 'flex-end', margin: 0}}
                >
                {/* <View style={[styles.modalContainer]}> */}
                <View style={{height: SCREEN_HEIGHT * 0.4}}>
                    {/* <View style={styles.modalBackgrounder}></View> */}

                    <View style={styles.modalWrapper}>
                        <View style={styles.modalContent}>
                            <ScrollView
                                style={styles.modalScroll}
                                indicatorStyle="black">
                                {this.state.subjectList.map((item, index) => {
                                    return (
                                        <View style={styles.modalItem} key={index}>
                                            <TouchableOpacity
                                                style={styles.modalItemWrapper}
                                                onPress={() => this.selectSubject(item.level03)}>
                                                <View style={styles.modalItemIconSelectedWrapperLeft}>
                                                </View>
                                                <Text
                                                    style={[
                                                        {
                                                            color: this.state.selectedSubjectCode === item.level03 ? DEFAULT_COLOR.lecture_base : DEFAULT_COLOR.base_color_222,
                                                            fontSize: PixelRatio.roundToNearestPixel(16),
                                                        }, this.state.selectedSubjectCode === item.level03 ? MyClassStyles.fontNotoB : MyClassStyles.fontNotoR]}>
                                                    {item.level03Name}
                                                </Text>
                                                <View style={styles.modalItemIconSelectedWrapperRight}>
                                                    {this.state.selectedSubjectCode === item.level03 && (
                                                        <Image
                                                            style={styles.modalItemIconSelected}
                                                            source={require('../../../assets/icons/btn_check_list.png')}
                                                        />
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}
                            </ScrollView>
                            <LinearGradient
                                pointerEvents={'none'}
                                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.35)', 'rgba(255,255,255,0.9)']}
                                locations={[0, 0.5, 1]}
                                style={{position: 'absolute', bottom: 67, height: 50, width: '100%'}} />
                            <View style={styles.cancelButton}>
                                <TouchableOpacity
                                    style={styles.cancelButtonWrapper}
                                    onPress={() => this._closeModal()}>
                                    <CustomText styles={styles.cancelButtonText}>취소</CustomText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    };
}

MyMP3Screen.propTypes = {
    isMyClassOwnMP3Empty: PropTypes.bool,
};

const mapStateToProps = state => {
    return {
        isMyClassOwnMP3Empty: state.GlabalStatus.isMyClassOwnMP3Empty,
        myClassServiceID: state.GlabalStatus.myClassServiceID,
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateIsMyClassOwnMP3Empty: boolean => {
            dispatch(ActionCreator.updateIsMyClassOwnMP3Empty(boolean));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(MyMP3Screen);

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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },

    /** renderHeader start **/
    /** renderHeader start **/
    headerOff: {
        flexDirection: 'row',
        width: SCREEN_WIDTH,
        height: 50,
        padding: 10,
        backgroundColor: DEFAULT_COLOR.input_bg_color,
        borderBottomColor: '#e8e8e8',
        borderBottomWidth: 1,
    },
    headerOn: {
        flexDirection: 'row',
        width: SCREEN_WIDTH,
        height: 50,
    },
    searchOnArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#444444',
    },
    searchOnIconWrapper: {
        alignSelf: 'center',
    },
    searchOnIcon: {
        width: 21,
        height: 25,
    },
    searchOffArea: {
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginLeft: 10,
        marginRight: 10,
    },
    searchOffIconWrapper: {
        alignSelf: 'center',
    },
    searchOffIcon: {
        width: 21,
        height: 25,
    },
    filterArea: {
        flex: 2.5,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginLeft: 10,
        marginRight: 10,
    },
    filterTitle: {
        color: '#444444',
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
        alignSelf: 'center',
        textAlign: 'right',
        marginRight: 10,
    },
    filterIconWrapper: {
        alignSelf: 'center',
    },
    filterIcon: {
        width: 12,
        height: 12,
    },
    /** renderHeader end **/
    /** renderHeader end **/

    /** renderContent start **/
    /** renderContent start **/
    listContainer: {
        flex: 1,
        width: SCREEN_WIDTH,
        //marginBottom: 55,
    },
    listSeparator: {
        height: 1,
        backgroundColor: '#E8E8E8',
    },
    rowFrontContainer: {
        height: HEIGHT_SWIPE_ITEM,
        justifyContent: 'space-between',
        //paddingTop: 15,
        //paddingBottom: 15,
        //paddingRight: 10,
        //paddingLeft: 10,
        // paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        // borderWidth: 1,
    },
    rowFrontContainerUnswiped: {
        backgroundColor: DEFAULT_COLOR.base_color_fff,
    },
    rowFrontContainerSwiped: {
        backgroundColor: '#e2f3f8',
    },
    rowFrontLeftWrapper: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        // paddingRight: 10,
        // paddingLeft: 10,
        //backgroundColor: '#FF0000',
        marginRight: 20,
    },
    rowFrontLeftThumb: {
    },
    rowFrontCenterWrapper: {
        flex: 7,
        justifyContent: 'center',
        paddingTop: 15,
    },
    rowFrontTitle: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_13),
        lineHeight: DEFAULT_TEXT.body_13 * 1.42,
        // marginRight: 15,
    },
    rowFrontDesc: {
        color: DEFAULT_COLOR.base_color_888,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12),
        lineHeight: DEFAULT_TEXT.body_12 * 1.42,
        marginTop: 11,
        height: 20,
    },
    rowFrontRightWrapper: {
        flex: 1,
        //alignItems: 'center',
        //backgroundColor: '#0000FF',
        paddingTop: 15,
    },
    rowFrontRightIcon: {
        width: 15,
        height: 15,
    },
    rowBackContainer: {
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // height: 70,
        height: '100%',
    },
    backCommonBtn: {
        // position: 'absolute',
        // bottom: 0,
        // top: 0,
        // height: HEIGHT_SWIPE_ITEM,
        height: '100%',
        // height: 300,
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
        // left: 0,
    },
    backRightBtnFirst: {
        // right: 0,
        backgroundColor: DEFAULT_COLOR.lecture_base,
    },
    backRightBtnFirstIcon: {
        width: 21,
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

    /** renderModal start **/
    /** renderModal start **/
    modalContainer: {
        //marginTop:SCREEN_HEIGHT*0.3,
        //marginBottom: isIphoneX() ? getBottomSpace() : 9,
        //backgroundColor: DEFAULT_COLOR.base_color_fff,
        //backgroundColor: DEFAULT_COLOR.base_color_000,
        //opacity: 0.4,
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
        backgroundColor: DEFAULT_COLOR.base_color_fff,
        paddingTop: 10,
    },
    modalScroll: {

    },
    modalItem: {
        // height: 65,
        //alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 13,
        // borderWidth: 1, borderColor: 'red',
    },
    modalItemWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalItemText: {
        textAlign: 'center',
        color: DEFAULT_COLOR.base_color_000,
        fontSize: PixelRatio.roundToNearestPixel(16)
    },
    modalItemTextSelected: {
        textAlign: 'center',
        color: DEFAULT_COLOR.lecture_base,
        fontWeight: 'bold',
        fontSize: PixelRatio.roundToNearestPixel(16)
    },
    modalItemIconSelectedWrapperLeft: {
        width: 40,
        alignItems: 'center',
    },
    modalItemIconSelectedWrapperRight: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    modalItemIconSelected: {
        width: 15,
        height: 15,
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
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium),
    },
    /** renderModal end **/
    /** renderModal end **/


    /** renderEmtpy start **/
    /** renderEmtpy start **/
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
    },
    /** renderEmtpy end **/
    /** renderEmtpy end **/
});
