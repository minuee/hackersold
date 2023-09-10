import React, {Component} from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    FlatList,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    TextInput,
    TouchableWithoutFeedback,
    Image,
    PixelRatio,
    Modal,
    ActivityIndicator,
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";

import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/AntDesign';
Icon2.loadFont();

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import COMMON_STATES from "../../Constants/Common";
import {CustomTextB, CustomText, CustomTextR,} from "../../Style/CustomText";
import AsyncStorage from "@react-native-community/async-storage";
import Toast from "react-native-tiny-toast";
import CommonUtil from "../../Utils/CommonUtil";
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

const paginate = 10;

export default class FreeDataExamList extends Component {
    constructor(props) {
        super(props);
        this.state= {
            currentPage: 1,
            isSearchMode: false,
            showModal: false,
            filterList: [
                {
                    index: 0,
                    title: '전체',
                }
            ],
            searchWord: '',
            selectedFilterIndex: 0,
            examItems: [],
            selection: {
                start: 0,
            }
        };
    }

    async UNSAFE_componentWillMount() {
        let myInterestCode = await AsyncStorage.getItem('myInterestCode')
        console.log('UNSAFE_componentWillMount()', 'myInterestCode = ' + myInterestCode)

        this.setState({
            interestFieldID: JSON.parse(myInterestCode).info.interestFieldID,
            //테스트코드 interestFieldID: 20060001,
            myInterestCode: myInterestCode,
        }, function() {
            this.getExamList()
        })
    }

    componentDidMount() {
    }

    searchSubmit = (text) => {
        this.setState({
            searchWord: text,
            currentPage: 1,
            examItems: [],
            selection: {
                start: 0,
            }
        }, function() {
            this.getExamList()
        })
    }

    moreLoading = async() => {
        if(this.state.currentPage < this.state.lastPage) {
            console.log('moreLoading()', '추가로 로딩합니다.')
            this.setState({
                currentPage: this.state.currentPage + 1,
            }, function() {
                this.getExamList()
            });
        } else {
            console.log('moreLoading()', '더이상 로딩할 수 없습니다. (this.state.currentPage = ' + this.state.currentPage + ')')
        }
    };

    getExamList = async() => {
        if(this.state.currentPage == 1){
            this.setState({
                loading: true,
            })
        }

        const url = DEFAULT_CONSTANTS.apiAdminDomain
            + '/v1/app/freeStudy/preExam/' + JSON.parse(this.state.myInterestCode).code
            + '?page=' + this.state.currentPage + '&paginate=' + paginate
            + (this.state.searchWord !== '' ? '&searchWord=' + encodeURIComponent(this.state.searchWord) : '');

        /* 테스트코드
        const url = DEFAULT_CONSTANTS.apiAdminDomain
            + '/v1/app/freeStudy/preExam/' + 20060001
            + '?page=' + this.state.currentPage
            + '&paginate=' + paginate
            + (this.state.searchWord !== '' ? '&searchWord=' + encodeURIComponent(this.state.searchWord) : '');
        */

        console.log('freeDataExamList.js > getExamList()', 'url = ' + url)

        await CommonUtil.callAPI(url)
            .then(response => {

                console.log('freeDataExamList.js > getExamList()', 'response = ' + JSON.stringify(response))

                if (response && response.code === '0000') {

                    if(this.state.currentPage == 1) {
                        this.setState({
                            loading: false,
                        })
                    }

                    let filterIndex = 1;
                    let filterList = [{
                        index: 0,
                        title: '전체',
                    }];
                    let filterArray = [];

                    // TODO 필터링 과목 종합
                    ([...this.state.examItems, ...response.data.preExams.data]).map((item) => {
                        if(!filterArray.includes(item.subject)) {
                            filterArray.push(item.subject)
                        }
                    })

                    if(filterArray.length > 0) {
                        filterArray.map((item) => {
                            filterList.push({
                                index: filterIndex++,
                                title: item
                            })
                        })
                    }

                    this.setState({
                        filterList: filterList,
                        examItems: [...this.state.examItems, ...response.data.preExams.data],
                        lastPage: response.data.preExams.last_page,
                    })
                } else {
                    if(this.state.currentPage == 1) {
                        this.setState({
                            loading: false,
                        })
                    }

                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('기출문제 목록을 불러오는데 실패 했습니다.');
                }}).catch(error => {
                if(this.state.currentPage == 1) {
                    this.setState({
                        loading: false,
                    })
                }

                console.log(error)
                Toast.show('시스템 에러: 기출문제 목록을 불러오는데 실패 했습니다.');
            });
    }

    onPressSearchButton = () => {
        if(this.state.isSearchMode) {
            this.setState({
                isSearchMode: !this.state.isSearchMode,
                searchWord: '',
                currentPage: 1,
                selectedFilterIndex: 0,
                examItems: [],
            }, function() {
                this.getExamList()
            });
        } else{
            this.setState({
                isSearchMode: !this.state.isSearchMode,
            });
        }
    }

    onChangeSearchInput = (text) => {
        this.setState({searchWord: text})
    }

    _closeModal = () => {
        this.setState({ showModal: false })

    };
    _showModal = async(mode) => {
        this.setState({ showModal: true })
    }

    selectFilter = (filterIndex) => {
        this.setState({selectedFilterIndex: filterIndex})
        this._closeModal()
    }

    getSelectedFilterTitle = () => {
        for (let filterItem of this.state.filterList) {
            if(filterItem.index == this.state.selectedFilterIndex) {
                return filterItem.title;
            }
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        } else {
            return (
                <SafeAreaView style={styles.container}>
                    {
                        !this.state.isSearchMode
                            ? (
                                <View style={styles.headerOff}>
                                    <View style={styles.searchOffArea}>
                                        <TouchableOpacity
                                            style={styles.searchOffIconWrapper}
                                            onPress={() => this.onPressSearchButton()}>

                                            <Image
                                                style={styles.searchOffIcon}
                                                source={require('../../../assets/icons/icon_seach_bl.png')}/>

                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.filterArea}>
                                        <CustomTextR style={styles.filterTitle}>
                                            {this.getSelectedFilterTitle()}
                                        </CustomTextR>
                                        <TouchableOpacity
                                            style={styles.filterIconWrapper}
                                            onPress={() => this._showModal()}>
                                            <Icon
                                                style={styles.filterIcon}
                                                name='angle-down'
                                                size={20}/>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                            : (
                                <View style={styles.headerOn}>
                                    <View style={styles.searchOnArea}>
                                        <TouchableOpacity
                                            style={styles.searchOffIconWrapper}
                                            onPress={() => this.onPressSearchButton()}>

                                            <Image
                                                style={styles.searchOnIcon}
                                                source={require('../../../assets/icons/icon_seach_wh.png')}/>

                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.inputArea}>
                                        {/* inputMainArea */}
                                        <View style={styles.inputMainArea}>
                                            <TextInput
                                                ref={(ref) => this.textInput = ref}
                                                style={styles.inputText}
                                                value={this.state.searchWord}
                                                selection={this.state.selection}
                                                placeholder='검색어를 입력해주세요.'
                                                placeholderTextColor='#8E8E8E'
                                                clearTextOnFocus={true}
                                                onFocus={()=> function(){}}
                                                onChangeText={text => this.onChangeSearchInput(text)}
                                                onSubmitEditing={(event) => this.searchSubmit(event.nativeEvent.text)}/>

                                            <TouchableOpacity
                                                style={styles.inputClearIconWrapper}
                                                onPress={() => this.textInput.clear()}>
                                                <Image
                                                    style={styles.inputClearIcon}
                                                    source={require('../../../assets/icons/btn_del_txt.png')}/>
                                            </TouchableOpacity>
                                        </View>

                                        {/* inputButtonArea */}
                                        <View style={styles.inputButtonArea}>
                                            <TouchableOpacity
                                                onPress={() => this.onPressSearchButton()}>
                                                <CustomText style={styles.inputButtonText}>취소</CustomText>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )
                    }
                    <View style={styles.content}>
                        {
                            this.state.examItems.length == 0
                            &&
                            <View style={styles.emptyContainer}>
                                <Image
                                    style={styles.emptyIcon}
                                    source={require('../../../assets/icons/icon_none_exclamation.png')}
                                />
                                <CustomTextR style={styles.emptyTitle}>
                                    제공하는 기출문제가 없습니다
                                </CustomTextR>
                            </View>
                            ||
                            this.state.examItems.filter((item) => {
                                return this.state.selectedFilterIndex == 0
                                || item.subject === this.state.filterList[this.state.selectedFilterIndex].title
                            }).map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.contentItem}
                                        onPress={() => this.props.navigation.navigate('FreeDataExamDetail', {
                                            preExamIdx: item.preExamIdx,
                                        })}>
                                        <View style={styles.contentItemTextWrapper}>
                                            <CustomTextR
                                                style={styles.contentItemText}
                                                numberOfLines={1}>
                                                {item.title}
                                            </CustomTextR>
                                        </View>
                                        <View style={styles.contentItemIconWrapper}>
                                            <Icon
                                                style={styles.contentItemIcon}
                                                name='angle-right'
                                                size={20}
                                                color={DEFAULT_COLOR.base_color_888}/>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })
                        }
                        {
                            (
                                this.state.currentPage < this.state.lastPage
                                && this.state.filterList[this.state.selectedFilterIndex].title === '전체'
                            )
                            && (
                                <TouchableOpacity style={{
                                    width: '100%',
                                    height: 40,
                                    marginBottom: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroudColor: '#FF0000',
                                }} onPress={() => this.moreLoading()}>
                                    <CustomTextR>더보기</CustomTextR>
                                </TouchableOpacity>
                            )
                        }
                    </View>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.showModal}
                        onRequestClose={() => {
                            this.setState({showModal: false})
                        }}
                        //onBackdropPress={this._closeModal}
                        //useNativeDriver={true}
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
                                        indicatorStyle='black'>
                                        {
                                            this.state.filterList.map((item, index) => {
                                                return (
                                                    <View style={styles.modalItem} key={index}>
                                                        <TouchableOpacity
                                                            style={styles.modalItemWrapper}
                                                            onPress={() => this.selectFilter(item.index)}>

                                                            <View style={styles.modalItemIconSelectedWrapperLeft}>
                                                            </View>
                                                            <View style={styles.modalItemIconSelectedWrapperCenter}>
                                                                {
                                                                    this.state.selectedFilterIndex == item.index
                                                                        ?
                                                                        <CustomTextB
                                                                            style={styles.modalItemTextSelected}>
                                                                            {item.title}
                                                                        </CustomTextB>
                                                                        :
                                                                        <CustomTextR style={styles.modalItemText}>
                                                                            {item.title}
                                                                        </CustomTextR>
                                                                }
                                                            </View>
                                                            <View style={styles.modalItemIconSelectedWrapperRight}>
                                                                {
                                                                    this.state.selectedFilterIndex == item.index
                                                                    &&
                                                                    <Image
                                                                        style={styles.modalItemIconSelected}
                                                                        source={require('../../../assets/icons/btn_check_list.png')}/>
                                                                }
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            })
                                        }
                                        <LinearGradient
                                            pointerEvents={'none'}
                                            colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.35)", "rgba(255,255,255,0.9)"]}
                                            locations={[0, 0.80, 1]}
                                            style={{position: "absolute", height: "100%", width: "100%",}}/>
                                    </ScrollView>
                                    <View style={styles.cancelButton}>
                                        <TouchableOpacity
                                            style={styles.cancelButtonWrapper}
                                            onPress={() => this._closeModal()}>
                                            <CustomTextR styles={styles.cancelButtonText}>취소</CustomTextR>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </SafeAreaView>
                    </Modal>
                </SafeAreaView>
            )
        }
    }
}

const styles = StyleSheet.create({
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        height: SCREEN_HEIGHT * 0.6,
        backgroundColor : DEFAULT_COLOR.base_color_fff,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    containerWrapper: {
    },
    headerOff: {
        flexDirection: 'row',
        width: SCREEN_WIDTH,
        height: 50,
        padding: 10,
        backgroundColor: DEFAULT_COLOR.input_bg_color,
        borderBottomWidth: 0.5,
        borderBottomColor: '#DDDDDD',
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
        lineHeight: DEFAULT_TEXT.body_14 * 1.42,
        alignSelf: 'center',
        textAlign: 'right',
        marginRight: 10,
    },
    filterIconWrapper: {
        alignSelf: 'center',
    },
    filterIcon: {
    },
    inputArea: {
        flex: 9,
        flexDirection: 'row',
    },
    inputMainArea: {
        flex: 8,
        flexDirection: 'row',
        backgroundColor: '#444444',
        justifyContent: 'space-between',
    },
    inputClearIconWrapper: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputClearIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
    inputText: {
        flex: 8,
        padding: 0,
        margin: 0,
        borderWidth: 0,
        color: DEFAULT_COLOR.base_color_fff,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
    },
    inputButtonArea: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333333',
    },
    inputButtonText: {
        color: '#ffffff',
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
    },
    content: {
        width: SCREEN_WIDTH,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    contentItem: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 20,
        marginRight: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8e8',
    },
    contentItemTextWrapper: {
        flex: 10,
        alignSelf: 'center',
    },
    contentItemText: {
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_13),
        lineHeight: DEFAULT_TEXT.body_13 * 1.42,
        color: DEFAULT_COLOR.base_color_222,
        marginRight: 10,
    },
    contentItemIconWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    contentItemIcon: {
        alignSelf: 'flex-end',
    },
    contentItemSeparator: {
        width: SCREEN_WIDTH - 40,
        marginLeft: 20,
        marginRight: 20,
        height: 1,
        backgroundColor: DEFAULT_COLOR.input_border_color,
    },

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
        backgroundColor: DEFAULT_COLOR.base_color_fff,
    },
    modalScroll: {

    },
    modalItem: {
        height: 65,
        //alignItems: 'center',
        justifyContent: 'center',
    },
    modalItemWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalItemText: {
        textAlign: 'center',
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(16),
        lineHeight: 16 * 1.42,
    },
    modalItemTextSelected: {
        textAlign: 'center',
        color: DEFAULT_COLOR.lecture_base,
        fontSize: PixelRatio.roundToNearestPixel(16),
        lineHeight: 16 * 1.42,
    },
    modalItemIconSelectedWrapperLeft: {
        //width: 40,
        //alignItems: 'center',
        flex: 1,
        alignItems: 'center',
        alignSelf: 'center',
    },
    modalItemIconSelectedWrapperCenter: {
        flex: 5,
        alignItems: 'center',
        alignSelf: 'center',
    },
    modalItemIconSelectedWrapperRight: {
        //width: 40,
        //alignItems: 'center',
        //justifyContent: 'flex-start',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignSelf: 'center',
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
        fontSize: PixelRatio.roundToNearestPixel(16),
        lineHeight: 16 * 1.42,
    },
    emptyContainer: {
        flex: 1,
        height: SCREEN_HEIGHT * 0.6,
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
});
