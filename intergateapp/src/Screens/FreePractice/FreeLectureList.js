import React, {Component} from 'react';
import {
    StyleSheet, View, Text, ActivityIndicator, Linking, ScrollView, TouchableOpacity,
    Dimensions, PixelRatio, Image, SafeAreaView, Platform, StatusBar,
} from 'react-native';
import Modal from 'react-native-modal';
import AutoHeightImage from 'react-native-auto-height-image';
import LinearGradient from "react-native-linear-gradient";
import {CustomText, CustomTextM, CustomTextR} from "../../Style/CustomText";

import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/AntDesign';
Icon2.loadFont();

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import {TARGET} from "../MyClass/Modal/ModalConstant";
import FreeLectureCategoryModal from "./Modal/FreeLectureCategoryModal";
import FreeLectureFilterModal from "./Modal/FreeLectureFilterModal";
import Toast from "react-native-tiny-toast";
import CommonUtil from "../../Utils/CommonUtil";
import AsyncStorage from "@react-native-community/async-storage";
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

//순서 정렬 항목
const ORDER_TYPE_TOTAL = 'total';
const ORDER_TYPE_LATEST = 'latest';
const ORDER_TYPE_POPULAR = 'popular';

const ORDER_TYPE_NAME_TOTAL = '전체';
const ORDER_TYPE_NAME_LATEST = '최신순';
const ORDER_TYPE_NAME_POPULAR = '인기순';

//Picker(Modal)
const HEIGHT_CATEGORY_MODAL         = SCREEN_HEIGHT * 0.5;
const HEIGHT_FILTER_MODAL         = SCREEN_HEIGHT * 0.5;

export default class FreeLectureList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showTopButton : false,
            loading: false,
            currentPage: 1,
            lastPage: 0,
            categoryItem: props.navigation.getParam('categoryItem'),
            categoryList: [],
            filterList: [
                {index: 1, title: '최신순', orderBy: 'regDateTime',},
                {index: 2, title: '인기순', orderBy: 'popularity',},
            ],
            showCategoryModal: false,
            orderType: ORDER_TYPE_TOTAL,

            /** renderCategoryModal start **/
            /** renderCategoryModal start **/
                setCatItemSelected: this.setCatItemSelected.bind(this),
                toggleCategoryModal: this.toggleCategoryModal.bind(this),
                //원본코드 selectedCatIndex: props.navigation.getParam('catInfo').index,
            /** renderCategoryModal end **/
            /** renderCategoryModal end **/

            /** renderFilterModal start **/
            /** renderFilterModal start **/
                setFilterItemSelected: this.setFilterItemSelected.bind(this),
                toggleFilterModal: this.toggleFilterModal.bind(this),
                selectedFilterIndex: 1, // 초기 설정값 '최신순'
            /** renderFilterModal end **/
            /** renderFilterModal end **/

            /*
            lectureItems: props.navigation.getParam('lectureItems').filter(function(item) {
                return item.cat_idx == props.navigation.getParam('catInfo').index
            }),
            */
            //selectedCategoryItem: props.navigation.getParam('categoryItem'),
            /* 초반 데이터만 강의 데이터가 함께 들어오고 이후에는 사용자가 선택한 카테고리 정보만 입력됨
            {
                "categoryCcd": "6",
                "categoryCcdName": "토익 리딩 왕초보 탈출"
            }
            */
            lectureItems: [],
            //lectureItems: props.navigation.getParam('lectureItems'),
            mockData1 : [
                { id: 1, name: "인강기초영어",site:"champ.hackers.com", checked: true },
                { id: 2, name: "인강중국어",site:"china.hackers.com" },
                { id: 3, name: "PREP",site:"prep.hackers.com" },
                { id: 4, name: "임용",site:"teacher.hackers.com" },
                { id: 5, name: "한국사능력검정시험",site:"teacher.hackers.com" }
            ]
        }

        //console.log('FreeLectureList', 'lectureItems = ' + JSON.stringify(props.navigation.getParam('lectureItems')))
        console.log('FreeLectureList', 'categoryItem = ' + JSON.stringify(this.state.categoryItem))
    }

    async UNSAFE_componentWillMount() {

        let myInterestCode = await AsyncStorage.getItem('myInterestCode')
        const memberIdx = await CommonUtil.getMemberIdx();

        this.setState({
            interestFieldID: JSON.parse(myInterestCode).info.interestFieldID,
            myInterestCode: myInterestCode,
            memberIdx: memberIdx,
        }, function() {
            this.getLectureList()
        })

        this.getCategoryList()
    }

    selectFilter = (filt) => {
        try {
            let selectedId = this.state.mockData1[filt-1].id;
        }catch {
            this.state.mockData1[0].checked = true;
            return true;
        }
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

    getCategoryList = async() => {
        const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/freeStudy/freeLectures/categories/'
            + JSON.parse(this.state.myInterestCode).code;

        await CommonUtil.callAPI(url)
            .then(response => {
                console.log('getCategoryList()', 'response = ' + JSON.stringify(response))

                if (response && response.code === '0000') {
                    this.setState({
                        categoryList: response.data.categories.data,
                    })
                }

                else {
                    this.setState({loading: false});
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('카테고리 목록을 불러오는데 실패 했습니다.');
                }}).catch(error => {
                console.log(error)
                this.setState({
                    loading: false,
                });
                Toast.show('시스템 에러: 카테고리 목록을 불러오는데 실패 했습니다.');
            });
    }

    getLectureList = async() => {
        if(this.state.currentPage == 1) {
            this.setState({ loading: true });
        }

        const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/freeStudy/freeLectures/'
                        + JSON.parse(this.state.myInterestCode).code + '/'
                        + this.state.categoryItem.categoryCcd + '/'
                        + '?page=' + this.state.currentPage + '&paginate=10&orderBy=' + this.getSelectedFilterOrderBy();

        console.log('getLectureList()', 'url = ' + url)

        await CommonUtil.callAPI(url)
            .then(response => {
                console.log('getLectureList()', 'response = ' + JSON.stringify(response));

                if (response && response.code === '0000') {
                    //console.log('getOwnMemoList()', 'response = ' + JSON.stringify([...this.state.items, response.data.events.data]));

                    this.setState({
                        loading: false,
                        lectureItems: [...this.state.lectureItems, ...response.data.freeLectures.data],
                        lastPage: response.data.freeLectures.last_page,
                    })
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

    loadMoreItem = async(code) => {
        if(this.state.currentPage < this.state.lastPage) {
            console.log('moreLoading()', '추가로 로딩합니다.')
            this.setState({
                currentPage: this.state.currentPage + 1,
            }, function() {
                this.getLectureList()
            });
        } else {
            console.log('moreLoading()', '더이상 로딩할 수 없습니다. (this.state.currentPage = ' + this.state.currentPage + ')')
        }
    }

    changeOrderType = () => {
        let nextOrderType = ORDER_TYPE_TOTAL;
        switch(this.state.orderType) {
            case ORDER_TYPE_TOTAL:
                nextOrderType = ORDER_TYPE_LATEST;
                break;
            case ORDER_TYPE_LATEST:
                nextOrderType = ORDER_TYPE_POPULAR;
                break;
            default:
                nextOrderType = ORDER_TYPE_TOTAL;
                break;
        }

        this.setState({
            orderType: nextOrderType,
        });

        this.getLectureList();
    }

    getOrderTypeName = (orderType) => {
        switch(orderType) {
            case ORDER_TYPE_LATEST:
                return ORDER_TYPE_NAME_LATEST;
            case ORDER_TYPE_POPULAR:
                return ORDER_TYPE_NAME_POPULAR;
            default:
                return ORDER_TYPE_NAME_TOTAL;
        }
    }

    getSelectedFilterTitle = () => {
        for (let filterItem of this.state.filterList) {
            if(filterItem.index == this.state.selectedFilterIndex) {
                return filterItem.title;
            }
        }
    }

    getSelectedFilterOrderBy = () => {
        for (let filterItem of this.state.filterList) {
            if(filterItem.index == this.state.selectedFilterIndex) {
                return filterItem.orderBy;
            }
        }
    }

    componentDidMount() {
        /*
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.container}>
                    ...
                </SafeAreaView>
            </>

        StatusBar.setBarStyle( 'dark-content',true)
        StatusBar.setBackgroundColor(DEFAULT_COLOR.lecture_base)
        */
    }

    UNSAFE_componentWillUnmount() {
        //this.restoreStatusBar()
    }

    restoreStatusBar() {
        StatusBar.setBarStyle( 'dark-content',false)
        StatusBar.setBackgroundColor(DEFAULT_COLOR.base_color_fff)
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large"/></View>
            )
        } else {
            return (
                <SafeAreaView style={styles.container}>
                    {/*
                        Platform.OS === 'android'
                            && <StatusBar barStyle={"dark-content"} backgroundColor={DEFAULT_COLOR.lecture_base} animated={true} hidden={false}/>
                            || <StatusBar barStyle={"dark-content"} backgroundColor={DEFAULT_COLOR.lecture_base} animated={true} hidden={false}/>
                    */}
                    <View style={styles.headerTop}>
                        <View style={styles.headerTopLeft}>
                            <TouchableOpacity
                                style={styles.headerTopLeftWrapper}
                                onPress={() => this.props.navigation.goBack()}>
                                <Image
                                    style={styles.headerTopLeftIcon}
                                    source={require('../../../assets/icons/btn_back_page.png')}
                                    />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.headerTopCenter}>
                            <TouchableOpacity
                                style={styles.headerTopCenterWrapper}
                                onPress={() => this.toggleCategoryModal()}
                                >
                                <CustomTextR style={styles.headerTopCenterTitle}>
                                    { this.state.categoryItem.categoryCcdName }
                                </CustomTextR>
                                <Image
                                    style={styles.headerTopCenterIcon}
                                    source={require('../../../assets/icons/btn_list_open_s.png')}
                                    />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.headerTopRight}>

                        </View>
                    </View>
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
                    {
                        this.state.lectureItems.length == 0
                            &&
                                <View style={styles.contentEmpty}>
                                    <Text style={{
                                        fontSize: DEFAULT_TEXT.head_small,
                                        color: DEFAULT_COLOR.base_color_666,
                                    }}>
                                        관련 영상이 존재하지 않습니다.
                                    </Text>
                                </View>
                            ||
                                <ScrollView
                                    ref={(ref) => {
                                        this.ScrollView = ref;
                                    }}
                                    indicatorStyle={'white'}
                                    scrollEventThrottle={16}
                                    keyboardDismissMode={'on-drag'}
                                    onScroll={e => this.handleOnScroll(e)}
                                    onMomentumScrollEnd = {({nativeEvent}) => {
                                    }}
                                    onScrollEndDrag ={({nativeEvent}) => {
                                        this.loadMoreItem (nativeEvent)
                                    }}
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.contentExist}>
                                    <View style={styles.header}>
                                        <TouchableOpacity
                                            style={styles.headerWrapper}
                                            onPress={() => this.toggleFilterModal()}>
                                            <CustomTextR
                                                style={{
                                                    color: '#444444',
                                                    fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
                                                    marginRight: 10,
                                                    lineHeight: DEFAULT_TEXT.body_14 * 1.42,
                                                }}>
                                                {this.getSelectedFilterTitle()}
                                            </CustomTextR>
                                            {/*
                                            <Icon
                                                name="exchange"
                                                size={20}
                                                color={DEFAULT_COLOR.base_color_666}/>
                                            */}
                                            <Image
                                                style={{width: 16, height: 14}}
                                                source={require('../../../assets/icons/btn_sort.png')} />
                                        </TouchableOpacity>
                                    </View>
                                    {
                                        this.state.lectureItems.map((item, index) => {
                                            return (
                                                <TouchableOpacity
                                                    style={{backgroundColor: '#EAEBEE', paddingBottom: 10,}}
                                                    onPress={() =>
                                                        this.props.navigation.navigate('FreeLectureDetail', {
                                                            screennavigation1: this.props.screennavigation1,
                                                            freeLectureIdx: item.freeLectureIdx
                                                        })
                                                    }>

                                                    <AutoHeightImage
                                                        width={SCREEN_WIDTH}
                                                        source={{uri: item.lectureImage}}
                                                        resizeMode='stretch'/>

                                                    <View style={styles.lectureItemBottom}>
                                                        <View style={styles.itemTopTitle}>
                                                            <CustomTextM style={styles.itemTopTitleText}>
                                                                {item.title}
                                                            </CustomTextM>
                                                        </View>
                                                        <View style={styles.itemBottomTitle}>
                                                            <CustomTextR style={styles.itemBottomTitleText}>
                                                                {item.subTitle}
                                                            </CustomTextR>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        })
                                    }
                                </ScrollView>
                    }
                    { this.renderCategoryModal() }
                    { this.renderFilterModal() }
                </SafeAreaView>
            );
        }
    }

    renderCategoryModal = () => {
        return (
            <Modal
                style={styles.commonModalContainer}
                animationType="slide"
                onRequestClose={() => this.toggleCategoryModal() }
                onBackdropPress={() => this.toggleCategoryModal() }
                animationInTiming={300}
                animationOutTiming={300}
                hideModalContentWhileAnimating
                isVisible={this.state.showCategoryModal}
                /* onModalHide={() => {}} */
                >
                <View
                    style={[
                        styles.commonModalWrapper,
                        styles.categoryModalWrapper,
                    ]}
                    >
                    <FreeLectureCategoryModal screenState={this.state}/>
                </View>
            </Modal>
        )
    }

    /** renderCategoryModal start **/
    /** renderCategoryModal start **/
        setCatItemSelected = (item) => {
            this.setState({ categoryItem: item })
            this.toggleCategoryModal()
            this.setState({
                currentPage: 1,
                lectureItems: [],
            }, function() {
                this.getLectureList()
            })
        }

        toggleCategoryModal = () => {
            this.setState({ showCategoryModal: !this.state.showCategoryModal })
        }
    /** renderCategoryModal end **/
    /** renderCategoryModal end **/

    renderFilterModal = () => {
        return (
            <Modal
                style={styles.commonModalContainer}
                animationType="slide"
                onRequestClose={() => this.toggleFilterModal() }
                onBackdropPress={() => this.toggleFilterModal() }
                animationInTiming={300}
                animationOutTiming={300}
                hideModalContentWhileAnimating
                isVisible={this.state.showFilterModal}
                /* onModalHide={() => {}} */
            >
                <View
                    style={[
                        styles.commonModalWrapper,
                        styles.filterModalWrapper,
                    ]}
                >
                    <FreeLectureFilterModal screenState={this.state}/>
                </View>
            </Modal>
        )
    }

    /** renderFilterModal start **/
    /** renderFilterModal start **/
        setFilterItemSelected = (index) => {
            this.setState({
                currentPage: 1,
                lastPage: 0,
                lectureItems: [],
                selectedFilterIndex: index,
            }, function() {
                this.toggleFilterModal()
                this.getLectureList()
            })
        }

        toggleFilterModal = () => {
            this.setState({ showFilterModal: !this.state.showFilterModal })
        }
    /** renderFilterModal end **/
    /** renderFilterModal end **/

}

const styles = StyleSheet.create({
    topSafeArea: {
        flex: 0,
        backgroundColor: DEFAULT_COLOR.lecture_base
    },
    container: {
        flex: 1,
        width:'100%',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : DEFAULT_COLOR.base_color_fff,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        width: SCREEN_WIDTH,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: DEFAULT_COLOR.base_color_fff,
    },
    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentExist: {
        flex: 1,
    },
    contentEmpty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lectureItemBottom: {
        padding: 10,
        backgroundColor: DEFAULT_COLOR.base_color_fff,
        paddingBottom: 25,
    },
    itemTopTitle: {
        marginLeft: 10,
        marginRight: 10,
    },
    itemTopTitleText: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(18),
        lineHeight: 18 * 1.42,
    },
    itemBottomTitle: {
        marginLeft: 10,
        marginRight: 10,
    },
    itemBottomTitleText: {
        color: DEFAULT_COLOR.base_color_888,
        fontSize: PixelRatio.roundToNearestPixel(15),
        lineHeight: 15 * 1.42,
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

    /** Modal **/
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

    /** renderCategoryModal start **/
    /** renderCategoryModal start **/
        categoryModalWrapper: {
            height: HEIGHT_CATEGORY_MODAL,
        },
    /** renderCategoryModal end **/
    /** renderCategoryModal end **/


    /** renderFilterModal start **/
    /** renderFilterModal start **/
        filterModalWrapper: {
            height: HEIGHT_FILTER_MODAL,
        },
    /** renderFilterModal end **/
    /** renderFilterModal end **/

    modalWrapper: {
        flex: 1,
        //backgroundColor: '#00000055',
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
        color: DEFAULT_COLOR.base_color_000,
        fontSize: PixelRatio.roundToNearestPixel(16)
    },
    modalItemTextSelected: {
        textAlign: 'center',
        color: DEFAULT_COLOR.lecture_base,
        fontWeight: 'bold',
        fontSize: PixelRatio.roundToNearestPixel(16)
    },
    modalItemIconSelectedWrapperCenter: {
        flex: 5,
        alignItems: 'center',
        alignSelf: 'center',
    },
    modalItemIconSelectedWrapperLeft: {
        flex: 1,
        alignItems: 'center',
        alignSelf: 'center',
    },
    modalItemIconSelectedWrapperRight: {
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
        //width: SCREEN_WIDTH - 34,
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

    /** Header **/
    headerTop: {
        height: 55,
        backgroundColor: DEFAULT_COLOR.lecture_base,
        flexDirection: 'row',
    },
    headerTopLeft: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTopLeftWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTopLeftIcon: {
        width: 17.3,
        height: 17.3,
    },
    headerTopCenter: {
        flex: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTopCenterWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTopCenterTitle: {
        color: DEFAULT_COLOR.base_color_fff,
        fontSize: PixelRatio.roundToNearestPixel(16),
        lineHeight: 16 * 1.42,
        marginRight: 9,
    },
    headerTopCenterIcon: {
        width: 10,
        height: 10,
    },
    headerTopRight: {
        flex: 1,
    },
    /*
    <View style={styles.header}>
        <View style={styles.headerLeft}>
            <Image
                style={styles.headerLeftIcon}
                source={require('../../../assets/icons/btn_back_page.png')}
                />
        </View>
        <View style={styles.headerCenter}>
            <CustomTextR>
                초보를 위한 토익 LC 입문서
            </CustomTextR>
            <Image
                style={styles.headerCenterIcon}
                source={require('../../../assets/icons/btn_list_open_s.png')}
                />
        </View>
        <View style={styles.headerRight}>

        </View>
    </View>
     */
});

/*
{"screennavigation1":{"state":{"routeName":"MainTopTabs","key":"id-1587102645668-0"},"actions":{}},"catInfo":{"index":1,"title":"초보를 위한 토익 LC 입문서"},"catList":[{"index":1,"title":"초보를 위한 토익 LC 입문서"},{"index":2,"title":"토익 RC 독해 입문서"},{"index":3,"title":"초보를 위한 토익 LC 입문서 초보를 위한 토익 LC 입문서 초보를 위한 토익 LC 입문서"}],"lectureItems":[{"index":1,"cat_idx":1,"mainTitle":"해커스 토익 왕기초 Listening","subTitle":"토린이를 위한 토익 첫걸음 | 리스닝 4주 완성!","thumbUrl":"https://mchamp.hackers.com/files/lecture/2019/11/3c3bcde9f02ec0d291fcbac735561aac.jpg","videoUrl":"http://mvod.hackers.co.kr/champstudymobile/sample_movie/15068_s.mp4"},{"index":2,"cat_idx":1,"mainTitle":"해커스 토익 왕기초 Reading [독해]","subTitle":"토린이를 위한 토익 첫걸음 | 리딩 4주 완성!","thumbUrl":"https://mchamp.hackers.com/files/lecture/2019/11/3dfa81cec2f9b3d168e4a3bf436d41d1.jpg","videoUrl":"http://mvod.hackers.co.kr/champstudymobile/sample_movie/15070_s.mp4"},{"index":3,"cat_idx":1,"mainTitle":"해커스 토익 왕기초 Reading [문법]","subTitle":"토린이를 위한 토익 첫걸음 | 리딩 4주 완성!","thumbUrl":"https://mchamp.hackers.com/files/lecture/2019/11/111e8f4857ab868b1f4ee2e2a4dbcd78.jpg","videoUrl":"http://mvod.hackers.co.kr/champstudymobile/sample_movie/15069_s.mp4"},{"index":4,"cat_idx":1,"mainTitle":"[550점+목표] 해커스 토익 스타트 Listening (전반부) [2020 최신개정판]","subTitle":"초보를 위한 토익 LC 입문서 | 수강기간 30일(총 55일) 혜택 제공★","thumbUrl":"https://mchamp.hackers.com/files/lecture/2019/12/3d9723f8a69a41a05592b941899b461e.jpg","videoUrl":"http://mvod.hackers.co.kr/champstudymobile/sample_movie/15129_s.mp4"},{"index":5,"cat_idx":1,"mainTitle":"[550점+목표] 해커스 토익 스타트 Reading (문법) [2020 최신개정판]","subTitle":"초보를 위한 토익 RC 문법 입문서 | 수강기간 30일(총 55일) 혜택 제공★","thumbUrl":"https://mchamp.hackers.com/files/lecture/2019/12/4da5cb12e55b4a21f8efd431b67ed81b.jpg","videoUrl":"http://mvod.hackers.co.kr/champstudymobile/sample_movie/15133_s.mp4"},{"index":6,"cat_idx":2,"mainTitle":"[900점+목표] 해커스 토익 실전 1000제 2 Reading 전반부 [최신개정판]","subTitle":"해커스 토익 실전 1000제 2 Reading | 수강기간 15일 연장★","thumbUrl":"https://mchamp.hackers.com/files/lecture/2018/12/f097716b581966a458e10739c0ad5aa8.jpg","videoUrl":"http://mvod.hackers.co.kr/champstudymobile/sample_movie/13674_s.mp4"},{"index":7,"cat_idx":2,"mainTitle":"한 달 안에 끝내는 해커스 토익 기출 보카 [최신개정판]","subTitle":"토익 기출 어휘 30일 정복! | 수강기간 30일(총 80일) 혜택 제공★","thumbUrl":"https://mchamp.hackers.com/files/lecture/2018/12/91c147c04e7e3e05599956ee9c9e8921.jpg","videoUrl":"http://mvod.hackers.co.kr/champstudymobile/sample_movie/13686_s.mp4"},{"index":8,"cat_idx":2,"mainTitle":"[550점+목표] 해커스 토익 스타트 Reading [문법]","subTitle":"토익 리딩 왕초보 탈출 | 수강기간 30일(총 70일) 혜택 제공★","thumbUrl":"https://mchamp.hackers.com/files/lecture/2018/10/1c47b6afe2f8608124806c303421eb19.jpg","videoUrl":"http://mvod.hackers.co.kr/champstudymobile/sample_movie/7274_s.mp4"},{"index":9,"cat_idx":2,"mainTitle":"해커스 토익 Part 7 집중공략","subTitle":"토익 Part7 7가지 유형 완벽 정리! | 수강기간 15일(총 55일) 혜택 제공★","thumbUrl":"https://mchamp.hackers.com/files/lecture/2018/10/1944e743d614f6f52c9251bf63326d69.jpg","videoUrl":"http://mvod.hackers.co.kr/champstudymobile/sample_movie/11261_s.mp4"},{"index":10,"cat_idx":2,"mainTitle":"[750점+목표] 한 권으로 끝내는 해커스 토익 실전 RC","subTitle":"토익 초보도 부담 없이 실전 훈련 2주 완성! | 수강기간 15일(총 55일) 혜택 제공★","thumbUrl":"https://mchamp.hackers.com/files/lecture/2018/10/223146c620dd8569545b8522758b9790.jpg","videoUrl":"http://mvod.hackers.co.kr/champstudymobile/sample_movie/10970_s.mp4"},{"index":11,"cat_idx":3,"mainTitle":"[750점+목표]해커스 토익 중급 Reading 문법 (전반부)","subTitle":"토익 리딩 문법 중급에서 상급으로 도약!","thumbUrl":"https://mchamp.hackers.com/files/lecture/2018/10/669e75ea5fbbdc05aea56d4a285a4c48.jpg","videoUrl":"http://mvod.hackers.co.kr/champstudymobile/sample_movie/7289_s.mp4"},{"index":12,"cat_idx":3,"mainTitle":"[750점+목표]해커스 토익 중급 Reading 어휘","subTitle":"토익 리딩 어휘 중급에서 상급으로 도약!","thumbUrl":"https://mchamp.hackers.com/files/lecture/2018/10/34765ae25c8268b5b080aa37283d39f6.jpg","videoUrl":"http://mvod.hackers.co.kr/champstudymobile/sample_movie/7293_s.mp4"},{"index":13,"cat_idx":3,"mainTitle":"[750점+목표]해커스 토익 중급 Listening 전반부","subTitle":"토익 리스닝 중급에서 상급으로! | 여름방학 한정! 수강기간 15일 연장★","thumbUrl":"https://mchamp.hackers.com/files/lecture/2018/10/7a5a11931f8bcee2f9cbcb183223b910.jpg","videoUrl":"http://mvod.hackers.co.kr/champstudymobile/sample_movie/7236_s.mp4"},{"index":14,"cat_idx":3,"mainTitle":"[850점+목표] 해커스 토익 Listening Part 4 [2020 최신개정판]","subTitle":"토익 리스닝 기본에서 실전까지! |  수강기간 15일(총 55일) 혜택 제공★","thumbUrl":"https://mchamp.hackers.com/files/lecture/2020/02/56514638e19e8812c19d72b0059d957e.jpg","videoUrl":"http://mvod.hackers.co.kr/champstudymobile/sample_movie/15036_s.mp4"},{"index":15,"cat_idx":3,"mainTitle":"[850점+목표] 해커스 토익 Listening Part 3 [2020 최신개정판]","subTitle":"토익 리스닝 기본에서 실전까지! |  수강기간 15일(총 55일) 혜택 제공★","thumbUrl":"https://mchamp.hackers.com/files/lecture/2020/01/61d14559c437b6d14175924332c41ad6.jpg","videoUrl":"http://mvod.hackers.co.kr/champstudymobile/sample_movie/15035_s.mp4"}]}
 */
