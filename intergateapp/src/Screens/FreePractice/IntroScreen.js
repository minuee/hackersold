import React, {Component} from 'react';
import {
    StyleSheet, Text, View, Dimensions, TouchableOpacity, ActivityIndicator, Image, ScrollView, ImageBackground,
    PixelRatio, FlatList, Linking, RefreshControl, Alert, Platform,
} from 'react-native';
import ActionCreator from '../../Ducks/Actions/MainActions';
import { CustomText, CustomTextB, CustomTextR, CustomTextM, TextRobotoL, } from '../../Style/CustomText';
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import LinearGradient from "react-native-linear-gradient";
import AutoHeightImage from 'react-native-auto-height-image';
import Crypt from '../../Utils/Crypt';

import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/AntDesign';
Icon2.loadFont();

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

//컨텐츠 영역 상수
const CAROUSEL_SLIDER_WIDTH = SCREEN_WIDTH;
const CAROUSEL_SLIDER_HEIGHT = SCREEN_WIDTH;
const CAROUSEL_ITEM_WIDTH = SCREEN_WIDTH - 50;
const CAROUSEL_ITEM_HEIGHT = SCREEN_WIDTH - 50;
const CAROUSEL_PAGE_LEFT = CAROUSEL_ITEM_WIDTH / 2;
// const CAROUSEL_PAGE_LEFT = CAROUSEL_ITEM_WIDTH / 2; // dot 1
// const CAROUSEL_PAGE_LEFT = CAROUSEL_ITEM_WIDTH / 2 - 10; // dot 2
// const CAROUSEL_PAGE_LEFT = CAROUSEL_ITEM_WIDTH / 2 - 20; // dot 3


//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonUtil from "../../Utils/CommonUtil";
import {SERVICES} from "../../Constants/Common";
import Toast from "react-native-tiny-toast";
import AsyncStorage from "@react-native-community/async-storage";
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

const TEMP_MEMBER_IDX = 3649866;
const paginate = 5;

/*
[MemberIdx]
7012001     https://mtchina.hackers.com/?c=event&evt_id=18051804&isAppTotal=Y&memberIdx=WJeBaaGcpA==
7014826     https://mtchina.hackers.com/?c=event&evt_id=18051804&isAppTotal=Y&memberIdx=WJeBa6meqQ==
7015109     https://mtchina.hackers.com/?c=event&evt_id=18051804&isAppTotal=Y&memberIdx=WJeBbKKcrA==
3649866     https://mtchina.hackers.com/?c=event&evt_id=18051804&isAppTotal=Y&memberIdx=VJ2EcKmiqQ==
*/

class IntroScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            refreshing : false,
            currentPage: 1,
            lastPage: 0,
            thisFocus : this.props.screenState.nowFocus,
            focusTab : this.props.screenState.focusTab,
            showTopButton : false,
            activeContentSlide: 0,
            activeBannerSlide: 0,
            //컨텐츠 영역
            isSupportDailyLearn: true, // 데일리 학습 제공 여부
            isSupportLevelTest: true, // 레벨 테스트 제공 여부
            isSupportFreeData: true, // 무료 학습자료 제공 여부
            frameItems: [
                {
                    index: 2,
                    key: 'levelTest',
                    topTitle: 'LEVEL·TEST',
                    mainTitle: '레벨 테스트',
                    subTitle: '무료로 알아보는 나의 진짜 실력!',
                    imageFrom: 'local',
                    imageUrl: require('../../../assets/icons/img_learn_v.png'),
                },
                /*
                {
                    index: 1,
                    key: 'dailyStudy',
                    topTitle: 'DAILY·LEARN',
                    mainTitle: '데일리 학습',
                    subTitle: '무료 단어, 문장, 무료 문제풀이까지!',
                    imageFrom: 'local',
                    imageUrl: require('../../../assets/icons/img_learn_d.png'),
                },
                */
            ],
            contentItems:[
                {
                    index: 3,
                    key: 'freeData',
                    topTitle: 'FREE·DATA',
                    mainTitle: '무료 학습자료',
                    subTitle: '알찬 학습자료도 모든것이 무료!',
                    imageFrom: 'local',
                    imageUrl: require('../../../assets/icons/img_learn_f.png'),
                },
            ],
            //배너 영역
            bannerItems: [],
            //강의 영역
            categoryItems: [],
            lectureItems: [],
        };

        //console.log('BEFORE ENCRYPT', TEMP_MEMBER_IDX.toString())
        //console.log('AFTER ENCRYPT', Crypt.encrypt(TEMP_MEMBER_IDX.toString()))
    }

    async UNSAFE_componentWillMount() {
        this.getCategoryList()
        this.getContentList()
    }

    shouldComponentUpdate(nextProps, nextState) {
//console.log('nextProps.myInterestCodeOne.code ',nextProps.myInterestCodeOne.code )
//console.log('this.props.myInterestCodeOne.code ',this.props.myInterestCodeOne.code )
        if ( nextProps.myInterestCodeOne.code !== this.props.myInterestCodeOne.code) {
            //onsole.log('shouldComponentUpdate()', 'REFRESH!')
            this._onRefresh()
        } else {
            //console.log('shouldComponentUpdate()', 'SAME!')
        }

        return true;
    }

    componentDidUpdate(nextProps, nextState) {
        if ( nextProps.myInterestCodeOne.code !== this.props.myInterestCodeOne.code) {
            //console.log('componentDidUpdate()', 'REFRESH!')
            this._onRefresh()
        } else {
            //console.log('componentDidUpdate()', 'SAME!')
        }
    }

    moreLoading = async() => {
        if(this.state.currentPage < this.state.lastPage) {
            //console.log('moreLoading()', '추가로 로딩합니다.')
            this.setState({
                currentPage: this.state.currentPage + 1,
            }, function() {
                this.getCategoryList()
            });
        } else {
            //console.log('moreLoading()', '더이상 로딩할 수 없습니다. (this.state.currentPage = ' + this.state.currentPage + ')')
        }
    };

    getCategoryList = async() => {
        /*원본 const url = DEFAULT_CONSTANTS.apiAdminDomain
                        + '/v1/app/freeStudy/freeLectures/' + this.state.interestFieldID + '?page=' + this.state.currentPage + '&paginate=' + paginate;
        */

        const url = DEFAULT_CONSTANTS.apiAdminDomain
            + '/v1/app/freeStudy/freeLectures/' + this.props.myInterestCodeOne.code + '?page=' + this.state.currentPage + '&paginate=' + paginate;

        const config = {
            method: 'GET',
            headers: new Headers({
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': DEFAULT_CONSTANTS.apiAdminKey
            })
        }

        //console.log('getCategoryList()', 'url = ' + url)

        /*
        const url = DEFAULT_CONSTANTS.apiAdminDomain
            + '/v1/app/freeStudy/freeLectures/' + 20060001 + '?page=' + this.state.currentPage + '&paginate=' + paginate;
        */
        await CommonUtil.callAPI(url, config)
            .then(response => {
                console.log('getCategoryList()', 'response = ' + JSON.stringify(response));

                //console.log('getLectureList()', 'response.data.freeLectures = ' + JSON.stringify(response.data.freeLectures));

                //console.log('getLectureList()', 'START')
                //console.log('getLectureList()', 'categoryItems = ' + JSON.stringify([...this.state.categoryItems, ...response.data.freeLectures.categories]));
                //console.log('getLectureList()', 'END')


                if (response && response.code === '0000') {

                    if(this.state.currentPage == 1) {

                        let banners = response.data.freeLectures.banners;

                        if(!CommonUtil.isEmpty(banners)) {

                            let curOsType = Platform.OS.toLowerCase()

                            banners = banners.filter(function(bannerItem) {
                                let tarOsTypeList = bannerItem.osType;
                                if(!CommonUtil.isEmpty(tarOsTypeList) && tarOsTypeList.length > 0) {
                                    let isSupported = false
                                    tarOsTypeList = tarOsTypeList.split(',')
                                    tarOsTypeList.map((tarOsType) => {
                                        if(curOsType === tarOsType.toLowerCase()) {
                                            isSupported = true
                                        }
                                    })

                                    return isSupported
                                } else {
                                    return false;
                                }

                            })

                            this.setState({ bannerItems: banners })
                        } else {
                            this.setState({ bannerItems: [] })
                        }

                        /*
                        this.setState({
                            bannerItems: response.data.freeLectures.banners
                                            ? response.data.freeLectures.banners
                                            : []
                        })
                        */
                    }

                    this.setState({
                        loading: false,
                        categoryItems: [...this.state.categoryItems, ...response.data.freeLectures.data.categories],
                        lastPage: response.data.freeLectures.last_page,
                    })
                } else {
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('강의 목록을 불러오는데 실패 했습니다.');
                }}).catch(error => {
                console.log(error)
                Toast.show('시스템 에러: 강의 목록을 불러오는데 실패 했습니다.');
            });
    }

    refreshCategoryList = async() => {
        const url = DEFAULT_CONSTANTS.apiAdminDomain
            + '/v1/app/freeStudy/freeLectures/' + this.props.myInterestCodeOne.code + '?page=' + this.state.currentPage + '&paginate=' + paginate;

        const config = {
            method: 'GET',
            headers: new Headers({
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': DEFAULT_CONSTANTS.apiAdminKey
            })
        }

        await CommonUtil.callAPI(url, config)
            .then(response => {
                console.log('refreshCategoryList()', 'response = ' + JSON.stringify(response));

                if (response && response.code === '0000') {

                    if(this.state.currentPage == 1) {
                        let banners = response.data.freeLectures.banners;

                        if(!CommonUtil.isEmpty(banners)) {

                            let curOsType = Platform.OS.toLowerCase()

                            banners = banners.filter(function(bannerItem) {
                                let tarOsTypeList = bannerItem.osType;
                                if(!CommonUtil.isEmpty(tarOsTypeList) && tarOsTypeList.length > 0) {
                                    let isSupported = false
                                    tarOsTypeList = tarOsTypeList.split(',')
                                    tarOsTypeList.map((tarOsType) => {
                                        if(curOsType === tarOsType.toLowerCase()) {
                                            isSupported = true
                                        }
                                    })

                                    return isSupported
                                } else {
                                    return false;
                                }

                            })

                            this.setState({ bannerItems: banners })
                        } else {
                            this.setState({ bannerItems: [] })
                        }

                        if(this.state.bannerItems !== null
                            && this.state.bannerItems.length > 0
                        ) {
                            //console.log('배너 초기화 진행')
                            this.carouselBanner.stopAutoplay();
                            this.setState({
                                activeBannerSlide: 0,
                            }, function() {
                                this.carouselBanner.snapToItem(0)
                                this.carouselBanner.startAutoplay();
                            })



                        } else {
                            //console.log('배너 초기화 진행 불가')
                        }
                    }

                    this.setState({
                        categoryItems: response.data.freeLectures.data.categories,
                        lastPage: response.data.freeLectures.last_page,
                    })
                } else {
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('강의 목록을 불러오는데 실패 했습니다.');
                }}).catch(error => {
                console.log(error)
                Toast.show('시스템 에러: 강의 목록을 불러오는데 실패 했습니다.');
            });
    }

    getContentList = async() => {
        //const domain = SERVICES[this.state.serviceID].apiDomain;
        let aPIsDomain = typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        let aPIsAuthKey = typeof this.props.myInterestCodeOne.info.apiKey !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey

        const url = aPIsDomain + '/v1/freeStudy/contents';
        const config = {
            method: 'GET',
            headers: new Headers({
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': aPIsAuthKey
            })
        }

        //console.log('getContentList()', 'url = ' + url)

        await CommonUtil.callAPI(url, config)
            .then(response => {
                //console.log('getContentList()', 'response = ' + JSON.stringify(response))

                if (response && response.code === '0000') {
                    const targetInterestName = this.props.myInterestCodeOne.name;


                    this.state.frameItems.forEach(frameItem => {
                        if(response.data[frameItem.key] != null && response.data[frameItem.key].length > 0) {
                            response.data[frameItem.key].forEach(item => {
                                if(item.interestName === targetInterestName) {
                                    this.setState({
                                        contentItems: [{...frameItem, url: item.url}, ...this.state.contentItems]
                                    })
                                }
                            })
                        }
                    })
                }

                else {
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('컨텐츠 목록을 불러오는데 실패 했습니다.');
                }}).catch(error => {
                    console.log('getContentList()', 'error = ' + JSON.stringify(error) )
                    Toast.show('시스템 에러: 컨텐츠 목록을 불러오는데 실패 했습니다.');
            });
    }

    refreshContentList = async() => {
        //const domain = SERVICES[this.state.serviceID].apiDomain;
        let aPIsDomain = typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        let aPIsAuthKey = typeof this.props.myInterestCodeOne.info.apiKey !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey

        const url = aPIsDomain + '/v1/freeStudy/contents';
        //console.log('refreshContentList()', 'url = ' + url)
        //console.log('refreshContentList()', 'aPIsAuthKey = ' + aPIsAuthKey)
        const config = {
            method: 'GET',
            headers: new Headers({
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': aPIsAuthKey
            })
        }

        await CommonUtil.callAPI(url, config)
            .then(response => {
                //console.log('refreshContentList()', 'response = ' + JSON.stringify(response))

                if (response && response.code === '0000') {
                    const targetInterestName = this.props.myInterestCodeOne.name;
                    this.state.frameItems.forEach(frameItem => {
                        if(response.data[frameItem.key] != null && response.data[frameItem.key].length > 0) {
                            response.data[frameItem.key].forEach(item => {
                                //console.log('refreshContentList()', 'item.interestName = ' + item.interestName)
                                //console.log('refreshContentList()', 'targetInterestName = ' + targetInterestName)
                                if(item.interestName === targetInterestName) {
                                    this.setState({
                                        contentItems: [
                                            {...frameItem, url: item.url},
                                            {
                                                index: 3,
                                                key: 'freeData',
                                                topTitle: 'FREE·DATA',
                                                mainTitle: '무료 학습자료',
                                                subTitle: '알찬 학습자료도 모든것이 무료!',
                                                imageFrom: 'local',
                                                imageUrl: require('../../../assets/icons/img_learn_f.png'),
                                            }
                                        ]
                                    })
                                }
                            })
                        }
                    })
                }

                else {
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('컨텐츠 목록을 불러오는데 실패 했습니다.');
                }}).catch(error => {
                console.log('refreshContentList()', 'error = ' + JSON.stringify(error) )
                Toast.show('시스템 에러: 컨텐츠 목록을 불러오는데 실패 했습니다.');
            });
    }

    componentDidMount() {
        this.loadItem();
    }

    UNSAFE_componentWillUnmount() {

    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if ( nextProps.screenState.focusTab !== this.props.screenState.focusTab ) {
            //this.setState({ loading : true });
            //this.refresh_end();
            this.upButtonHandler();
        }
    }

    _onRefresh = () => {
        this.setState({refreshing: true});

        // DONE 페이징 및 컨텐츠 초기화 작업
        // TODO Warning map > foreach 변경
        this.setState({
            currentPage: 1,
            lastPage: 0,
            activeContentSlide: 0,
            contentItems:[
                {
                    index: 3,
                    key: 'freeData',
                    topTitle: 'FREE·DATA',
                    mainTitle: '무료 학습자료',
                    subTitle: '알찬 학습자료도 모든것이 무료!',
                    imageFrom: 'local',
                    imageUrl: require('../../../assets/icons/img_learn_f.png'),
                },
            ],
        }, function() {
            this.carouselContent.snapToItem(0)

            this.refreshCategoryList()
            this.refreshContentList()
        })


        setTimeout(
            () => {
                this.setState({ refreshing: false});
            },500)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    loadItem = () => {
        this.setState({ loading: true });

        //TODO API 실제 적용 시 삭제 처리
        setTimeout(
            () => {
                this.setState({ loading: false });
            },1000);
    }

    loadMoreItem = async(code) => {
        //console.log("code", code);
        //console.log("code contentOffset", code.contentOffset);
    }

    handleOnScroll = async(event) => {
        this.props._updateStatusNowScrollY(event.nativeEvent.contentOffset.y);
        this.props.screenProps.resizeTopHeader(event.nativeEvent.contentOffset.y)
        if ( event.nativeEvent.contentOffset.y >= 200 ) {
            //this.props.screenProps.resizeTopHeader(DEFAULT_CONSTANTS.hideTopHeight);
            //this.props._updateStatusNowScroll(false);
            this.props._updateStatusShowBottomBar(true);
        }else{
            //this.props.screenProps.resizeTopHeader(DEFAULT_CONSTANTS.topHeight);
            //this.props._updateStatusNowScroll(true);
            this.props._updateStatusShowBottomBar(false);
        }
    }

    upButtonHandler = async() => {
        try {
            this.ScrollView.scrollTo({ x: 0,  animated: true });
        }catch(e){

        }
    }

    moveContentPage = async(item) => {
        // 데일리 학습
        /*
        if(item.index == 1) {
            this.props.screennavigation1.navigate('PracticeDailyDetail', {
                screennavigation1: this.props.screennavigation1,
                //일본어
                webViewUrl: 'https://mjapan.hackers.com/?r=japan&c=free_lecture/daily&iframe=Y'
            })
        }
        */

        //레벨 테스트
        if(item.index == 2) {
            // UNDO 로그인 여부 확인
            // DONE 담당 영역 로그인 체크 함수 isLoginCheck로 변경(범준 파트장님)

            const isLogin = await CommonUtil.isLoginCheck()

            if(isLogin === true) {
                //console.log('moveContentPage()', 'CommonUtil.isLoginCheck() == true')
                const userInfo = await CommonUtil.getUserInfo();
                //console.log('moveContentPage()', 'userInfo = ' + JSON.stringify(userInfo))

                this.props.screennavigation1.navigate('PracticeLevelDetail', {
                    screennavigation1: this.props.screennavigation1,
                    webViewUrl: item.url + '&memberIdx=' + encodeURIComponent(Crypt.encrypt(userInfo.memberIdx.toString()))
                    //webViewUrl: 'https://mtchamp.hackers.com/?c=event&evt_id=19022200&isAppTotal=Y&memberIdx=' + Crypt.encrypt(userInfo.memberIdx.toString())
                })
            } else {
                //console.log('moveContentPage()', 'CommonUtil.isLoginCheck() == false')
                this.props.screennavigation1.navigate('PracticeLevelDetail', {
                    screennavigation1: this.props.screennavigation1,
                    webViewUrl: item.url,
                    //webViewUrl: 'https://mtchamp.hackers.com/?c=event&evt_id=19022200&isAppTotal=Y',
                })
            }
        }
        //무료 학습자료
        else {
            // UNDO 로그인 여부 확인
            /*
            const userInfo = await CommonUtil.getUserInfo();

            console.log('moveContentPage()', 'userInfo = ' + JSON.stringify(userInfo))

            if(userInfo !== null) {
            */
                this.props.screennavigation1.navigate('FreeDataIntroScreen', {
                    screennavigation1: this.props.screennavigation1,
                });
            /*
            } else {
                Alert.alert('', '로그인이 필요합니다.\n로그인 하시겠습니까?',
                    [
                        {text: '확인', onPress: () => {
                                this.props.screennavigation1.navigate('SignInScreen');
                            }
                        },
                        {text: '취소', onPress: () => function() {}},
                    ]);
            }
            */
        }
    }

    renderBannerItem = ({item, index}) => {
        return (
            <TouchableOpacity
                onPress={() => Linking.openURL(item.url)}>
                <AutoHeightImage
                    style={styles.bannerImage}
                    width={SCREEN_WIDTH}
                    source={{uri: item.image}}/>
            </TouchableOpacity>
        );
    }

    renderContentItem = ({item, index}) => {
        return (
            <View style={[styles.carouselItem, {alignItems: 'center', justifyContents: 'center', }]}>
                <ImageBackground
                    style={Platform.OS == 'ios' ? styles.carouselBackIOS : styles.carouselBackAndroid }
                    imageStyle={{borderRadius: 20,}}
                    source={ item.imageFrom == 'local' ? item.imageUrl : { uri: item.imageUrl} }>

                    <View style={styles.itemTop}>
                        <TextRobotoL style={styles.itemTopTitle}>{item.topTitle}</TextRobotoL>
                    </View>
                    <View style={styles.itemMain}>
                        <CustomTextR style={styles.itemMainTitle}>{item.mainTitle}</CustomTextR>
                        <CustomTextR style={styles.itemMainComment}>{item.subTitle}</CustomTextR>
                    </View>
                    <View style={styles.itemSub}>
                        <TouchableOpacity
                            style={styles.itemSubTitle}
                            onPress={() => this.moveContentPage(item)}>
                            <CustomTextM style={styles.itemSubTitleText}>시작하기</CustomTextM>
                        </TouchableOpacity>
                    </View>

                </ImageBackground>
            </View>
        );
    }

    renderContentPagination = () => {
        const { contentItems, activeContentSlide } = this.state;
        return (
            <Pagination
                dotsLength={contentItems.length}
                activeDotIndex={activeContentSlide}
                containerStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    position: 'absolute',
                    bottom: 10,
                    left: CAROUSEL_PAGE_LEFT - ((contentItems.length - 1) * 10),
                }}
                dotStyle={{
                    width: 8,
                    height: 8,
                    borderRadius: 5,
                    marginHorizontal: -10,
                    backgroundColor: 'rgba(255, 255, 255, 0.92)'
                }}
                inactiveDotStyle={{
                    // Define styles for inactive dots here
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        );
    }

    renderBannerPagination = () => {
        const { bannerItems, activeBannerSlide } = this.state;
        return (
            <Pagination
                dotsLength={bannerItems.length}
                activeDotIndex={activeBannerSlide}
                containerStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    position: 'absolute',
                    bottom: -30,
                    width: SCREEN_WIDTH,
                }}
                dotStyle={{
                    width: SCREEN_WIDTH / (bannerItems.length),
                    height: 3,
                    borderRadius: 0,
                    backgroundColor: DEFAULT_COLOR.lecture_base,
                    paddingLeft:0,
                    paddingRight:0,
                    marginHorizontal: -8,
                }}
                inactiveDotStyle={{
                    width: SCREEN_WIDTH / (bannerItems.length),
                    height: 3,
                    borderRadius: 0,
                    backgroundColor: '#eaebee',
                    paddingLeft:0,
                    paddingRight:0,
                }}
                inactiveDotScale={1.0}
                inactiveDotOpacity={1}
            />
        );
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        } else {
            return (
                <View style={styles.container}>
                    {
                        this.props.showBottomBar
                            &&
                                <TouchableOpacity
                                    style={this.state.showType === 'list' ? styles.btnGoTopWrap :styles.btnGoTopWrap2}
                                    onPress={e => this.upButtonHandler()}>
                                    <Icon2 name="up" size={30} color="#000" />
                                </TouchableOpacity>
                    }

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
                            this.moreLoading()
                        }}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh}
                            />
                        }
                    >

                        {/* carousel */}
                        <View style={styles.contentContainer}>
                            <Carousel
                                ref={(c) => { this.carouselContent = c; }}
                                data={this.state.contentItems}
                                renderItem={this.renderContentItem}
                                sliderWidth={CAROUSEL_SLIDER_WIDTH}
                                itemWidth={CAROUSEL_ITEM_WIDTH}
                                onSnapToItem={(index) => this.setState({ activeContentSlide: index }) }
                                inactiveSlideScale={1.0}
                                inactiveSlideOpacity={0.3}
                                />
                                { this.renderContentPagination() }
                        </View>

                        {/* banner */}
                        {
                            (
                                this.state.bannerItems.length > 0
                            )
                                &&
                                    <View style={styles.bannerContainer}>

                                        <Carousel
                                            ref={(c) => { this.carouselBanner = c; }}
                                            data={this.state.bannerItems}
                                            renderItem={this.renderBannerItem}
                                            sliderWidth={SCREEN_WIDTH}
                                            itemWidth={SCREEN_WIDTH}
                                            onSnapToItem={(index) => this.setState({ activeBannerSlide: index }) }
                                            inactiveSlideScale={1.0}
                                            autoplay={true}
                                            autoplayInterval={2000}
                                            loop={true}
                                            /*contentContainerCustomStyle={{ flex: 1 }}*/
                                            />
                                        { this.renderBannerPagination() }

                                        {/*
                                    <FlatList
                                        horizontal={true}
                                        data={this.state.bannerItems}
                                        renderItem={({item, index, separator}) => (
                                            <TouchableOpacity
                                                onPress={() => Linking.openURL(item.linkUrl)}>
                                                <AutoHeightImage
                                                    style={styles.bannerImage}
                                                    width={SCREEN_WIDTH}
                                                    source={{uri: item.thumbUrl}}/>
                                            </TouchableOpacity>
                                        )}/>
                                    */}
                                    </View>
                        }

                        {/* lecture */}
                        <View style={
                            this.state.categoryItems == null || this.state.categoryItems.length == 0
                            ? styles.lectureContainer : styles.lectureContainer
                        }>
                            {
                                (
                                    this.state.categoryItems == null
                                        || this.state.categoryItems.length == 0
                                )

                                &&
                                    <View style={styles.lectureEmptyWrapper}>
                                        <Image
                                            style={styles.categoryEmptyIcon}
                                            source={require('../../../assets/icons/icon_none_exclamation.png')}
                                        />
                                        <CustomTextR style={styles.categoryEmptyTitle}>
                                            해커스만의{"\n"}알찬 강의를 준비하고 있어요!
                                        </CustomTextR>
                                    </View>
                                ||
                                this.state.categoryItems.map((catItem) => {
                                    return (
                                        <TouchableOpacity style={styles.lectureWrapper} key={catItem.categoryCcd}>
                                            <TouchableOpacity
                                                style={styles.category}
                                                onPress={() => this.props.screennavigation1.navigate('FreeLectureList', {
                                                                    screennavigation1: this.props.screennavigation1,
                                                                    //catInfo: catItem,
                                                                    //catList: this.state.categoryItems,
                                                                    categoryItem: {
                                                                        categoryCcd: catItem.categoryCcd,
                                                                        categoryCcdName: catItem.categoryName,
                                                                    }
                                                                }) }
                                                >
                                                <CustomTextB
                                                    style={styles.categoryTitle}
                                                    numberOfLines={1}
                                                    ellipsizeMode='tail'>
                                                    {catItem.categoryName}
                                                </CustomTextB>

                                                {/*<Icon style={styles.categoryIcon} name='angle-right' size={20} />*/}
                                                <Image
                                                    style={styles.categoryIcon}
                                                    source={require('../../../assets/icons/btn_detail.png')}
                                                />
                                            </TouchableOpacity>

                                            <FlatList
                                                ItemSeparatorComponent={({highlighted}) => (
                                                    <View style={styles.lectureItemSeparator}></View>
                                                )}
                                                horizontal={true}
                                                /*
                                                data={this.state.lectureItems.filter(function(item) {
                                                    return catItem.index == item.cat_idx;
                                                })}
                                                */
                                                data={catItem.freeLectures}
                                                keyExtractor={(item) => item.freeLectureIdx}
                                                renderItem={({item}) => (
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            console.log('FreePractice/IntroScreen.js > render()', 'item = ' + JSON.stringify(item))

                                                            this.props.screennavigation1.navigate('FreeLectureDetail', {
                                                                freeLectureIdx: item.freeLectureIdx
                                                            })
                                                        }}>
                                                        <AutoHeightImage
                                                            style={styles.lectureImage}
                                                            width={SCREEN_WIDTH / 2}
                                                            source={{uri: item.lectureImage}}/>
                                                    </TouchableOpacity>
                                                )}/>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>

                    </ScrollView>
                </View>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        showBottomBar: state.GlabalStatus.showBottomBar.topHeight ,
        selectBook: state.GlabalStatus.selectBook,
        nowScrollY: state.GlabalStatus.nowScrollY,
        topFavoriteMenu: state.GlabalStatus.topFavoriteMenu,
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,
    };
}


function mapDispatchToProps(dispatch) {
    return {
        _updateStatusNowScroll:(boolen) => {
            dispatch(ActionCreator.updateStatusNowScroll(boolen));
        },
        _updateStatusNowScrollY:(number) => {
            dispatch(ActionCreator.updateStatusNowScrollY(number));
        },
        _updateStatusShowBottomBar:(boolen) => {
            dispatch(ActionCreator.updateStatusShowBottomBar(boolen));
        }
    };
}

IntroScreen.propTypes = {
    showBottomBar: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(IntroScreen);

const styles = StyleSheet.create({
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : DEFAULT_COLOR.base_color_fff,
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
    contentContainer: {
        marginTop: 30,
        marginBottom: 10,
    },
    carouselItem: {
        height: CAROUSEL_ITEM_HEIGHT,
    },
    //https://stackoverflow.com/a/46984602
    carouselBackAndroid: {
        flex: 1,
        width: CAROUSEL_ITEM_WIDTH - 20,
        height: CAROUSEL_ITEM_HEIGHT - 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        elevation: 5,
        marginBottom: 20,
    },
    carouselBackIOS: {
        flex: 1,
        width: CAROUSEL_ITEM_WIDTH - 20,
        height: CAROUSEL_ITEM_HEIGHT - 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },
    itemTop: {
        flex: 1.5, alignItems: 'center', justifyContent: 'flex-end',
    },
    itemTopTitle: {
        color: DEFAULT_COLOR.base_color_fff,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12),
        lineHeight: DEFAULT_TEXT.body_12 * 1.42,
        letterSpacing: 3.64,
    },
    itemMain: {
        flex: 1.9, alignItems: 'center', justifyContent: 'flex-start',
        marginTop: 10,
    },
    itemMainTitle: {
        color: '#f5f7f8',
        fontSize: PixelRatio.roundToNearestPixel(44.9),
        lineHeight: 44.9 * 1.42,
        letterSpacing: -4.5,
    },
    itemMainComment: {
        color: DEFAULT_COLOR.base_color_fff,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
        lineHeight: DEFAULT_TEXT.body_14 * 1.42,
        letterSpacing: -0.7,
    },
    itemSub: {
        flex: Platform.OS == 'ios' ? 1.6 : 1.3,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    itemSubTitle: {
        textAlign: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        width: CAROUSEL_ITEM_WIDTH / 3,
        height: CAROUSEL_ITEM_HEIGHT / 10,
    },
    itemSubTitleText: {
        color: DEFAULT_COLOR.base_color_fff,
        fontSize: PixelRatio.roundToNearestPixel(16),
        lineHeight: 16 * 1.42,
        alignSelf: 'center',
    },
    bannerContainer: {
        marginBottom: 30,
    },
    lectureContainer: {
        marginLeft: 20,
        //marginRight: 20,
        marginBottom: 20,
        /*
        justifyContent: 'center',
        alignItems: 'center',
        */
    },
    lectureContainer: {
        //marginLeft: 20,
        //marginRight: 20,
        marginBottom: 20,
        /*
        justifyContent: 'center',
        alignItems: 'center',
        */
    },
    lectureWrapper: {
        marginBottom: 20,
    },
    lectureEmptyWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //height: SCREEN_HEIGHT - CAROUSEL_ITEM_HEIGHT,
    },
    category: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    categoryEmptyIcon: {
        width: 65,
        height: 65,
        marginBottom: 15,
    },
    categoryEmptyTitle: {
        color: DEFAULT_TEXT.base_color_888,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
        lineHeight: PixelRatio.roundToNearestPixel(18),
        letterSpacing: PixelRatio.roundToNearestPixel(-0.7),
        textAlign: 'center',
    },
    categoryTitle: {
        color: DEFAULT_TEXT.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),
        lineHeight: DEFAULT_TEXT.head_small * 1.42,
        marginRight: 5,
    },
    categoryIcon: {
        /*marginBottom: 5,*/
        width: 11,
        height: 14,
    },
    lecture: {

    },
    lectureItemSeparator: {
        width: 10,
    },
    lectureImage: {

    },
    bannerImage: {

    },
    btnGoTopWrap : {
        position:'absolute',bottom:50,right:20,width:50,height:50,paddingTop:5,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:25,opacity:0.5
    },
    btnGoTopWrap2 : {
        position:'absolute',bottom:50,right:20,width:50,height:50,paddingTop:5,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:25
    },
});
