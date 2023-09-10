import React, {Component} from 'react';
import {Animated, Dimensions, Platform, Text, View,StatusBar,PixelRatio,BackHandler,ScrollView, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator} from 'react-native';

import {Body, Header, List, ListItem as Item, ScrollableTab, Tab, TabHeading, Tabs, Title, Content,} from 'native-base';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import AutoHeightWebView from '../../Utils/AutoHeightWebView/index';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from "react-native-linear-gradient";
import { TouchableHighlight } from 'react-native-gesture-handler';

import {ScrollableTabView} from '@valdio/react-native-scrollable-tabview'
import ScrollableTabBar from '../../Utils/ScrollableTabBar';
import Select2MyClass from '../../Utils/Select2MyClass';
import Modal from 'react-native-modal';
import Toast from 'react-native-tiny-toast';

// HTML
import HTMLConvert from '../../Utils/HtmlConvert/HTMLConvert';
const IMAGES_MAX_WIDTH = SCREEN_WIDTH - 50;
const CUSTOM_STYLES = {};
const CUSTOM_RENDERERS = {};
const DEFAULT_PROPS = {
    htmlStyles: CUSTOM_STYLES,
    renderers: CUSTOM_RENDERERS,
    imagesMaxWidth: IMAGES_MAX_WIDTH,
    onLinkPress: (evt, href) => { Linking.openURL(href); },
    debug: true,
};

import MyLetureScreen from './MyLectureScreen';
import MyMP3Screen from './MyMP3Screen'; //나의 MP3
import MyPracticeScreen from './MyPracticeScreen'; //학습관리
import MyClassStyles from '../../Style/MyClass/MyClassStyle';

// import ParallaxScrollView from './ParallaxScrollView';
// import Select2MyClass from '../../Utils/Select2MyClass';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/AntDesign';
Icon2.loadFont();

//공통상수
import * as getDEFAULT_CONSTANTS from '../../Constants';
import COMMON_STATES, {SERVICES} from '../../Constants/Common';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFunction from '../../Utils/CommonFunction';
import {CustomText, CustomTextR, CustomTextB, CustomTextM, CustomTextL} from '../../Style/CustomText';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const IMAGE_HEIGHT = parseInt(SCREEN_HEIGHT * 0.25) + (Platform.OS === 'ios' ? CommonFunction.isIphoneX() ? 0 : 40 : 0);
const HEADER_HEIGHT = Platform.OS === 'ios' ? CommonFunction.isIphoneX() ? 94 : 70 : 50;
const SCROLL_HEIGHT = IMAGE_HEIGHT - HEADER_HEIGHT;
const THEME_COLOR = DEFAULT_COLOR.myclass_base;
const THEME_COLOR2 = DEFAULT_COLOR.base_color_666;
const THEME_COLOR3 = DEFAULT_COLOR.lecture_base;
const FADED_THEME_COLOR = DEFAULT_COLOR.base_color_666;

// 강의실 이동 모달
class ModalMyClassList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myClassList: [],
            apiLoading: false,
        };
    }

    componentDidMount() {
        this.getMyClassList();
    }

    getMyClassList = async () => {
        this.setState({apiLoading: true});
        const memberIdx = await CommonUtil.getMemberIdx();
        const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/myClass/list/' + memberIdx;
        await CommonUtil.callAPI(url)
            .then(response => {
                if (response && response.code === '0000') {
                    this.setState({
                        apiLoading: false,
                        myClassList: response.data.myClassList,
                    });
                } else {
                    this.setState({apiLoading: false});
                    response.message
                        ? Alert.alert('INFO', response.message)
                        : Alert.alert('INFO', '로딩 실패');
                }
            })
            .catch(error => {
                console.log('error : ', error);
                this.setState({apiLoading: false});
                Alert.alert('Error', '시스템 에러');
            });

        // mockup data
        // await this.setState({
        //     myClassList: [
        //         {serviceID: '3090', serviceName: "해커스 인강"},
        //         {serviceID: '3070', serviceName: '해커스 중국어'},
        //         {serviceID: '3045', serviceName: "해커스 임용"},
        //         {serviceID: '1111', serviceName: "해커스 test 1"},
        //         {serviceID: '2222', serviceName: "해커스 test 2"},
        //         {serviceID: '3333', serviceName: "해커스 test 3"},
        //         {serviceID: '4444', serviceName: "해커스 test 4"},
        //         {serviceID: '5555', serviceName: "해커스 test 5"},
        //         {serviceID: '6666', serviceName: "해커스 test 6"},
        //         {serviceID: '7777', serviceName: "해커스 test 7"},
        //         {serviceID: '8888', serviceName: "해커스 test 8"},
        //         {serviceID: '9999', serviceName: "해커스 test 9"},
        //     ],
        // });
    };
    render() {
        const MODAL_DEFAULT_FONT_SIZE = 16;
        return (
            <View style={{flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 15, borderTopRightRadius: 15, justifyContent: 'space-between'}}>
                <View style={{padding: 15, alignItems: 'center', marginTop: 20}}>
                    <ScrollView style={{width: '100%', height: (SCREEN_HEIGHT * 0.5) - 120}}>
                        {this.state.myClassList &&
                            this.state.myClassList.map(item => {
                                const isChecked = (this.props.screenState.myClassServiceID.toString() === item.serviceID.toString());
                                return (
                                    <TouchableOpacity
                                        style={{
                                            marginVertical: 10,
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        onPress={() => this.props.screenState.setMyClassServiceID(item.serviceID)}
                                        key={item.serviceID}>
                                        <Text
                                            style={[
                                                {
                                                    color: isChecked
                                                        ? DEFAULT_COLOR.lecture_base
                                                        : DEFAULT_COLOR.base_color_222,
                                                    fontSize: PixelRatio.roundToNearestPixel(MODAL_DEFAULT_FONT_SIZE),
                                                    lineHeight: MODAL_DEFAULT_FONT_SIZE * 1.42,
                                                    // marginLeft: isChecked ? MODAL_DEFAULT_FONT_SIZE : 0,
                                                },
                                                isChecked
                                                    ? MyClassStyles.fontNotoB
                                                    : MyClassStyles.fontNotoR,
                                            ]}>
                                            {item.serviceName} 강의실로 이동
                                        </Text>
                                        {isChecked && (
                                            <Image
                                                source={require('../../../assets/icons/btn_check_list.png')}
                                                style={{
                                                    width: MODAL_DEFAULT_FONT_SIZE,
                                                    height: MODAL_DEFAULT_FONT_SIZE,
                                                    position: 'absolute', right: 10,
                                                }}
                                            />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                            {this.state.myClassList.length === 0 && (
                                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 60}}>
                                    {this.state.apiLoading && <ActivityIndicator size="small" />}
                                    <Text
                                        style={[
                                            {
                                                color: DEFAULT_COLOR.base_color_222,
                                                fontSize: PixelRatio.roundToNearestPixel(MODAL_DEFAULT_FONT_SIZE),
                                                marginTop: 20,
                                                textAlign: 'center',
                                            },
                                            MyClassStyles.fontNotoR,
                                        ]}>
                                        {this.state.apiLoading
                                            ? '강의실 목록 불러오는 중'
                                            : '이동할 강의실이 없습니다.'}
                                    </Text>
                                </View>
                            )}
                        <View style={{width: '100%', height: 80}}></View>
                    </ScrollView>
                    <LinearGradient
                        colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,1)']}
                        locations={[0, 0.5, 1]}
                        style={{position: 'absolute', height: '20%', width: '100%', left: 15, right: 0, bottom: 14}}
                    />
                </View>
                <View style={{paddingBottom: 15, alignItems: 'center'}}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#f5f7f8',
                            width: '100%',
                            paddingVertical: 16,
                            // height: 40,
                            // padding: 10,
                            // position: 'absolute',
                            // bottom: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderTopLeftRadius: 4,
                            borderTopRightRadius: 4
                        }}
                        onPress={() => this.props.screenState.closeModal()}>
                        <CustomTextR
                            style={{
                                color: '#888888',
                                fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),
                                // lineHeight: 16 * 1.42,
                                letterSpacing: -0.8,
                            }}>
                            취 소
                        </CustomTextR>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

// 나의 강의실 info 모달 컴포넌트
class ModalMyClassInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myclassInfoMessage: null,
        };
    }

    componentDidMount() {
        this.setMessage();
    }

    // 안내메세지
    setMessage = async () => {
        const infoMessages = await CommonUtil.getInfoMessage(this.props.screenState.myClassServiceID);
        if (infoMessages.result === true) {
            if (infoMessages.response.code === '0000') {
                this.setState({
                    myclassInfoMessage: infoMessages.response.data.message.myclass || [],
                });
            } else {
                Toast.show(infoMessages.response.message || '안내메세지 로딩 실패');
            }
        } else {
            Toast.show(infoMessages.error || '안내메세지 로딩 실패');
        }
    };

    setAgree = async () => {
        await this.props.screenState.setAgreeMyClassInfo();
        this.props.screenState.closeModal();
    };

    render() {
        const MODAL_DEFAULT_FONT_SIZE = 16;
        const iconAgree = this.props.screenState.agreeMyClassInfo
            ? require('../../../assets/icons/btn_check_bl_on.png')
            : require('../../../assets/icons/btn_check_off.png');
        const webviewHeight = SCREEN_HEIGHT * 0.8 - 80 - (PixelRatio.roundToNearestPixel(MODAL_DEFAULT_FONT_SIZE) + 40);
        return (
            <View style={{backgroundColor: '#fff', borderRadius: 15, marginHorizontal: 30, marginVertical: SCREEN_HEIGHT * 0.1, height: SCREEN_HEIGHT * 0.8}}>
                <View
                    style={{
                        width: '100%',
                        height: PixelRatio.roundToNearestPixel(MODAL_DEFAULT_FONT_SIZE) + 40,
                        backgroundColor: '#f5f7f8',
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
                        <Image
                            source={require('../../../assets/icons/btn_info_line.png')}
                            style={{
                                width: PixelRatio.roundToNearestPixel(MODAL_DEFAULT_FONT_SIZE),
                                height: PixelRatio.roundToNearestPixel(MODAL_DEFAULT_FONT_SIZE),
                                marginRight: 6,
                            }}
                        />
                        <CustomTextR
                            style={{
                                color: DEFAULT_COLOR.base_color_222,
                                fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),
                                letterSpacing: -0.85,
                            }}>
                            {' '}
                            안내사항
                        </CustomTextR>
                    </View>
                    {this.props.screenState.agreeMyClassInfo && (
                    <TouchableOpacity
                        style={{
                            width: PixelRatio.roundToNearestPixel(MODAL_DEFAULT_FONT_SIZE),
                            height: PixelRatio.roundToNearestPixel(MODAL_DEFAULT_FONT_SIZE),
                            marginRight: 20,
                        }}
                        onPress={() => this.props.screenState.closeModal()}>
                        <Image
                            source={require('../../../assets/icons/btn_close_pop.png')}
                            style={{
                                width: PixelRatio.roundToNearestPixel(MODAL_DEFAULT_FONT_SIZE),
                                height: PixelRatio.roundToNearestPixel(MODAL_DEFAULT_FONT_SIZE),
                            }}
                        />
                    </TouchableOpacity>
                    )}
                </View>
                <View style={{padding: 15, alignItems: 'center'}}>
                    <ScrollView style={{width: '100%', height: webviewHeight}}>
                        <View style={{marginBottom: 50}}>
                            {this.state.myclassInfoMessage && this.state.myclassInfoMessage.map((item, index) => {
                                return (
                                    <View style={{marginVertical: 10}} key={index}>
                                        <CustomTextM style={{color: '#222222', fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14), fontWeight: '500', lineHeight: 14 * 1.42, letterSpacing: -0.7, marginBottom: 6}}>
                                            {item.title || ''}
                                        </CustomTextM>
                                        <HTMLConvert
                                            {...DEFAULT_PROPS}
                                            html={item.content && CommonUtil.stripSlashes(item.content) || ''}
                                        />
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>
                    <LinearGradient
                        colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.7)', 'rgba(255,255,255,1)']}
                        locations={[0, 0.5, 1]}
                        style={{position: 'absolute', height: '10%', width: '100%', left: 15, right: 0, bottom: 14}}
                    />
                </View>
                <View style={{alignItems: 'center'}}>
                    <TouchableOpacity
                        style={{
                            width: '100%',
                            height: 40,
                            padding: 10,
                            // position: 'absolute',
                            // bottom: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                        }}
                        onPress={() => this.props.screenState.agreeMyClassInfo ? {} : this.setAgree()}>
                        <Image
                            source={iconAgree}
                            style={{
                                width: PixelRatio.roundToNearestPixel(23),
                                height: PixelRatio.roundToNearestPixel(23),
                                marginRight: 6,
                            }}
                        />
                        <CustomTextR
                            style={{
                                color: this.props.screenState.agreeMyClassInfo ? DEFAULT_COLOR.base_color_222 : '#aaa',
                                fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),
                                lineHeight: 12 * 1.42
                            }}>
                            {' '}
                            안내 사항을 모두 읽고 확인했습니다
                        </CustomTextR>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

class MyClassScreen extends Component {
    nScroll = new Animated.Value(0);
    scroll = new Animated.Value(0);
    textColor = this.scroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT / 5, SCROLL_HEIGHT],
        outputRange: [THEME_COLOR3, FADED_THEME_COLOR, 'white'],
        extrapolate: 'clamp',
    });
    textColorDefault = this.scroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT / 5, SCROLL_HEIGHT],
        outputRange: [THEME_COLOR2, FADED_THEME_COLOR, 'white'],
        extrapolate: 'clamp',
    });
    tabBg = this.scroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT],
        outputRange: ['white', THEME_COLOR],
        extrapolate: 'clamp',
    });
    tabY = this.nScroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT, SCROLL_HEIGHT + 1],
        outputRange: [0, 0, 1],
    });
    headerBg = this.scroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT, SCROLL_HEIGHT + 1],
        outputRange: ['transparent', 'transparent', THEME_COLOR],
        extrapolate: 'clamp',
    });
    imgScale = this.nScroll.interpolate({
        inputRange: [-25, 0],
        outputRange: [1.1, 1],
        extrapolateRight: 'clamp',
    });
    imgOpacity = this.nScroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT],
        outputRange: [0.7, 0],
    });

    /** Tab **/
    tabBackground = this.scroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT],
        outputRange: [DEFAULT_COLOR.base_color_fff, THEME_COLOR],
        extrapolate: 'clamp',
    });
    tabColorFocused = this.scroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT / 5, SCROLL_HEIGHT],
        outputRange: [THEME_COLOR3, FADED_THEME_COLOR, 'white'],
        extrapolate: 'clamp',
    });
    tabColorUnfocused = this.scroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT / 5, SCROLL_HEIGHT],
        outputRange: [DEFAULT_COLOR.base_color_222, FADED_THEME_COLOR, 'white'],
        extrapolate: 'clamp',
    });
    tabOpacity = this.scroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT - 1, SCROLL_HEIGHT],
        outputRange: [0, 0, 1],
    });

    tabContent = (x, i) => (
        <View style={{height: this.state.height}}>
        <List onLayout={({nativeEvent: {layout: {height}}}) => {
            this.heights[i] = height;
            this.state.activeTab === i && this.setState({height});
          }}>
          {new Array(x).fill(null).map((_, i) => <Item key={i}><Text>Item {i}</Text></Item>)}
        </List>
      </View>
    );
    heights = [500, 500];
    state = {
        activeTab: 0,
        height: 500,
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            showTopButton: false,
            isShowModal: false,
            modalContent: '',
            userInfo: null,
            myClassServiceID: props.myClassServiceID, // || userInterest.serviceID,
            agreeMyClassInfo: null,
            showModal: this.showModal.bind(this),
            closeModal: this.closeModal.bind(this),
            setMyClassServiceID: this.setMyClassServiceID.bind(this),
            setAgreeMyClassInfo: this.setAgreeMyClassInfo.bind(this),
            hideSpinner: this.hideSpinner.bind(this),
            focusTab: 0,
            tabList: [],
            navi: props.navigation,
            initSelectMenuTabs: false,
            selectMenuTabs: 1,
            updateSelectMenuTabs: this.updateSelectMenuTabs.bind(this),
        };
        this.isMount = false;

        // 스크롤 제어 리스너
        this.nScroll.addListener(Animated.event([{value: this.scroll}], {useNativeDriver: false}));
        //this.scroll.addListener(({value}) => this.setState({ scrollHeight: value }))
        this.handleBackButton = this.handleBackButton.bind(this);
    }

    updateSelectMenuTabs = (selectMenuTabs) => {
        console.log('MyClassScreen > updateSelectMenuTabs', 'selectMenuTabs = ' + selectMenuTabs)


        this.setState({ selectMenuTabs: selectMenuTabs })
    }

    async UNSAFE_componentWillMount() {
        // 로그인 체크
        // const isLogin = await CommonUtil.isLoginCheck();
        // if (isLogin) {
        //     await this.initMyClass();
        // } else {
        //     CommonUtil.removeLocalUserInfo();
        //     this.props.navigation.navigate('SignInScreen', {
        //         onLoginBack: () => this.onLoginBack(),
        //         onLoginCancelBack: () => this.onLoginCancelBack(),
        //     });
        // }

        // TEST:: 로그인 체크 패스
        // await this.initMyClass();

        const agreeMyClassInfo = await AsyncStorage.getItem('agreeMyClassInfo');
    }

    async componentDidMount() {
        this.isMount = true;
        // 로그인 체크
        const isLogin = await CommonUtil.isLoginCheck();
        if (isLogin === true) {
            this.isMount && await this.initMyClass();
        } else if (isLogin.code && isLogin.code === -1) {
            // 일부 미통합 회원
            CommonUtil.incompleteUserAlert(isLogin.flagName, this.props.navigation.goBack);
        } else {
            this.goSignInScreen();
        }

        // TEST:: 로그인 체크 패스
        // this.isMount && this.initMyClass();

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    goSignInScreen = async () => {
        await CommonUtil.removeLocalUserInfo();
        this.props.navigation.navigate('SignInScreen', {
            onLoginBack: userInfo => this.onLoginBack(userInfo),
            onLoginCancelBack: () => this.onLoginCancelBack(),
        });
    };

    componentWillUnmount() {
        this.isMount = false;
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    // 로그인 화면에서 로그인 후 돌아왔을 때 호출할 함수
    onLoginBack = async userInfo => {
        const incompleteResult = await CommonUtil.checkIncompleteUser(userInfo, this.props.navigation.goBack);
        // const isLogin = await CommonUtil.isLoginCheck();
        // if (isLogin === true) {
        //     this.isMount && await this.initMyClass();
        // } else if (isLogin.code && isLogin.code === -1) {
        //     // 일부 미통합 회원
        //     CommonUtil.incompleteUser(isLogin, this.props.navigation.goBack);
        // } else {
        //     CommonUtil.removeLocalUserInfo();
        //     this.props.navigation.navigate('SignInScreen', {
        //         onLoginBack: () => this.onLoginBack(),
        //         onLoginCancelBack: () => this.onLoginCancelBack(),
        //     });
        // }
        incompleteResult === false && await this.initMyClass();
    };

    // 로그인 화면에서 로그인 취소 후 돌아왔을 때 호출할 함수
    onLoginCancelBack = async () => {
        const token = await CommonUtil.getToken(); // getMemberIdx();
        if (!token) {
            this.props.navigation.goBack();
        }
    };

    initMyClass = async () => {
        const serviceID = (!CommonUtil.isEmpty(this.props.myInterestCodeOne) && typeof this.props.myInterestCodeOne.info.serviceID !== 'undefined')
                    ? this.props.myInterestCodeOne.info.serviceID
                    : '';
        if (CommonUtil.isEmpty(this.state.myClassServiceID)) {
            await this.setMyClassServiceID(serviceID);
        }

        await this.setMyClassMenu();
        const agree = JSON.parse(await AsyncStorage.getItem('agreeMyClassInfo')) || false;
        await this.setState({agreeMyClassInfo: agree});
        const userInfo = await CommonUtil.getUserInfo();
        this.setState({userInfo: userInfo});

        !this.state.agreeMyClassInfo && this.showModal('myclassInfo');
    };

    setMyClassMenu = async () => {
        const myClassMenu = await this.getMyClassMenu();
        let arrMenu = [];
        if (myClassMenu && myClassMenu.length === 0 || CommonUtil.isEmpty(myClassMenu)) {
            Alert.alert('', '마이클래스 메뉴 생성에 실패했습니다.\n잠시 후 다시 시도해 주세요.', [
                {text: '확인', onPress: () => this.props.navigation.goBack()}
            ]);
            return;
        }
        // depth1Code : depth1Name
        // 0001 : 나의강의, 0002 : 나의MP3, 0003 : 학습관리
        myClassMenu.forEach((menu, key) => {
            const menuObject = {
                index: key + 1,
                code: menu.depth1Code,
                title: menu.depth1Name,
                isFocused: key === 0 ? true : false,
            };
            arrMenu.push(menuObject);
        });
        this.setState({tabList: [...arrMenu]});
    };
    getMyClassMenu = async () => {
        // TEST
        // return [
        //     {
        //         depth1Code: '0001',
        //         depth1Name: '나의강의',
        //     },
        //     {
        //         depth1Code: '0002',
        //         depth1Name: '나의MP3',
        //     },
        //     {
        //         depth1Code: '0003',
        //         depth1Name: '학습관리',
        //     },
        // ];
        const res = await AsyncStorage.getItem('myClassMenu');
        const menu = JSON.parse(res);
        const os = Platform.OS === 'ios' ? 'iOS' : 'Android';
        const myClassMenu = menu[os];
        return myClassMenu;
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        this.props.navigation.goBack(null);
        return true;
    };

    _historyBack = () => {
        this.props.navigation.goBack(null);
    }

    // 강의실 이동 저장
    setMyClassServiceID = async serviceID => {
        await this.props.updateMyClassServiceID(serviceID.toString());
        this.setState({
            myClassServiceID: this.props.myClassServiceID,
        });
        this.closeModal();
    };

    // 나의 강의실 안내사항 동의 (안내 사항을 모두 읽고 확인했습니다.)
    setAgreeMyClassInfo = async () => {
        // const agree = JSON.parse(await AsyncStorage.getItem('agreeMyClassInfo'));
        await AsyncStorage.setItem('agreeMyClassInfo', JSON.stringify(!this.state.agreeMyClassInfo));
        this.setState({agreeMyClassInfo: !this.state.agreeMyClassInfo});
    };

    showModal = async mode => {
        mode === 'myclassInfo' && this.setState({loading: true});
        await this.setState({modalContent: mode});
        this.setState({isShowModal: true});
    };

    closeModal = () => {
        this.setState({modalContent: '', isShowModal: false});
    };

    // 모달 컨텐츠 컴포넌트 반환
    getModalContent = modalContent => {
        switch (modalContent) {
            case 'myclassList':
                return <ModalMyClassList screenState={this.state} />;
            case 'myclassInfo':
                return <ModalMyClassInfo screenState={this.state} />;
            default:
                return;
        }
    };

    // 로딩 숨김
    hideSpinner = () => {
        this.setState({loading: false});
    };

    // 스크롤에 따른 ScrollToTop 버튼 노출
    handleOnScroll = event => {
        if (event.nativeEvent.contentOffset.y >= 100) {
            this.setState({
            showTopButton: true,
            });
        } else {
            this.setState({
            showTopButton: false,
            });
        }

      // let paddingToBottom = 1;
      // paddingToBottom += event.nativeEvent.layoutMeasurement.height;
      // if (event.nativeEvent.contentOffset.y + paddingToBottom >= event.nativeEvent.contentSize.height) {
      //   this.scrollEndReach();
      // }
    };

    // scrollEndReach = () => {
    //   if (this.state.moreLoading === false && this.state.ismore) {
    //     console.log('last end point', this.state.currentpage)
    //     this.setState({moreLoading : true})
    //     setTimeout(() => {
    //       this.refreshTextBookInfoMore(
    //         parseInt(this.state.currentpage) + parseInt(1),
    //       }, 500
    //     );
    //   }
    // }

    // ScrollToTop 액션
    upButtonHandler = async () => {
        try {
            this._ScrollView.getNode().scrollTo({y: 0, animated: true});
        } catch (e) {
            console.log('upButtonHandler error : ', e);
        }
    };

    // gnb메뉴에서 교재/MP3 메뉴 index 얻기
    getGnbLectureMenu = async () => {
        const res = await AsyncStorage.getItem('myGnbMenu');
        const menu = JSON.parse(res);
        const os = Platform.OS === 'ios' ? 'iOS' : 'Android';
        const gnbMenu = menu[os];
        const index = gnbMenu.findIndex(item => item.depth1Code === '002');
        return index > -1 ? index : 0;
    };

    // 메인화면으로 이동하면서 교재/MP3 탭으로 변경
    goMainAndMoveTab = async () => {
        const tabIndex = await this.getGnbLectureMenu();
        this.props.navigation.navigate('MainTopTabs', {moveTopTabIndex: tabIndex});
    };

    render() {
        return (
            <View>
                {/* { Platform.OS == 'android' && <StatusBar backgroundColor={DEFAULT_COLOR.myclass_base} translucent={false}  barStyle="dark-content" />} */}
                <Animated.View style={{position: 'absolute', width: '100%', backgroundColor: this.headerBg, zIndex: 10}}>
                    <Header style={{ backgroundColor: 'transparent' }} hasTabs androidStatusBarColor={DEFAULT_COLOR.myclass_base}>
                        <View
                            style={[{position: 'absolute',left: 0, width: SCREEN_WIDTH, flex: 1, zIndex: 1, top: Platform.OS === 'ios' ? 10 : 17}]}>
                            <View style={{flexDirection: 'row',}}>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        backgroundColor: 'transparent',
                                        paddingLeft: 10,
                                    }}>
                                    <TouchableOpacity onPress={()=> this._historyBack()} style={{marginLeft: 7}}>
                                        <Image source={require('../../../assets/icons/btn_back_page.png')} style={{width: 17, height: 17}} />
                                        {/* <Icon2 name={'left'} color={'#fff'} size={20} /> */}
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 2}}>
                                    <TouchableOpacity
                                        style={{flexDirection: 'row', alignItems: 'center'}}
                                        onPress={() => this.showModal('myclassList')}>
                                        <CustomTextR style={{color: DEFAULT_COLOR.base_color_fff, fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16), letterSpacing: PixelRatio.roundToNearestPixel(-0.95), marginRight: 9}}>강의실 이동 </CustomTextR>
                                        <Image source={require('../../../assets/icons/btn_list_open_s.png')} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize10), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize10)}} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex:1}}></View>
                                <TouchableOpacity
                                    style={{position: 'absolute', top: 3, right: 15}}
                                    onPress={() => this.showModal('myclassInfo')}>
                                    <Image source={require('../../../assets/icons/btn_info_wh.png')} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)}} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1, }} >
                                <Animated.View style={{
                                    flexDirection: 'row',
                                    width: SCREEN_WIDTH,
                                    height: 60,
                                    borderBottomWidth: 1.5,
                                    borderBottomColor: '#DDDDDD',
                                    backgroundColor: THEME_COLOR,
                                    opacity: this.tabOpacity,
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        width: SCREEN_WIDTH,
                                        height: 60,
                                        borderBottomWidth: 1.5,
                                        borderBottomColor: '#DDDDDD',
                                        backgroundColor: THEME_COLOR,
                                    }}>
                                        {
                                            this.state.tabList.map((item, index) => {
                                                return(
                                                    <TouchableHighlight
                                                        onPress={() => {
                                                            console.log('tab [' + item.title + '] tabOpacity = [' + JSON.stringify(this.tabOpacity) + ']')

                                                            // 초기 값은 0(false), 상단 스크롤을 통해 Fixed 된 직후 부터는 양의 정수(true)가 되는 것을 응용
                                                            if(this.tabOpacity.__getValue() != 0) {
                                                                console.log('FIXED tab [' + item.title + '] clicked')
                                                                var newTabList = [];
                                                                this.state.tabList.map((newItem, newIndex) => {
                                                                    newTabList.push({...newItem, isFocused: index == newIndex})
                                                                });
                                                                this.setState({tabList: newTabList});
                                                            } else {
                                                                console.log('FIXED tab [' + item.title + '] blocked')
                                                            }
                                                        }}
                                                        style={{
                                                            flex: 1,
                                                            height: 60,
                                                            width: SCREEN_WIDTH / this.state.tabList.length,
                                                            alignItems: 'center',
                                                        }}
                                                        key={index}
                                                    >
                                                        <View>
                                                        <View style={{
                                                            height: 57,
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}>
                                                            {
                                                                item.isFocused
                                                                    ?
                                                                    <Text
                                                                        style={{
                                                                            color: DEFAULT_COLOR.base_color_fff,
                                                                            fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),
                                                                            fontWeight: 'bold',
                                                                        }}>
                                                                        {item.title}
                                                                    </Text>
                                                                    :
                                                                    <Text
                                                                        style={{
                                                                            color: DEFAULT_COLOR.base_color_fff,
                                                                            fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),
                                                                        }}>
                                                                        {item.title}
                                                                    </Text>
                                                            }
                                                        </View>
                                                        {
                                                            item.isFocused
                                                            &&
                                                            <View style={{
                                                                width: (SCREEN_WIDTH / this.state.tabList.length) / 2,
                                                                height: 3,
                                                                backgroundColor: DEFAULT_COLOR.base_color_fff,
                                                                alignSelf: 'baseline',
                                                            }}/>
                                                        }
                                                        </View>
                                                    </TouchableHighlight>
                                                )
                                            })
                                        }
                                    </View>
                                </Animated.View>
                            </View>
                        </View>
                    </Header>
                </Animated.View>

            {this.state.showTopButton && (
                <TouchableOpacity style={styles.fixedUpButton} onPress={e => this.upButtonHandler()}>
                    <Icon2 name="up" size={30} color="#000" />
                </TouchableOpacity>
            )}
            <Animated.ScrollView
                ref={ref => {
                    this._ScrollView = ref;
                }}
                scrollEventThrottle={5}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: this.nScroll}}}],
                    {
                        useNativeDriver: true,
                        listener: event => {
                            this.handleOnScroll(event);
                        },
                    },
                )}
                // onLayout={(event) => console.log('onLayout', 'event.nativeEvent.layout.height = ' + event.nativeEvent.layout.height)}
                // onContentSizeChange={(width, height) => console.log('onContentSizeChange', 'height = ' + height)} 
                style={{zIndex: 0, height: '100%'}}>
                <Animated.View style={{
                    transform: [
                        {translateY: Animated.multiply(this.nScroll, 0.65)},
                        {scale: this.imgScale},
                    ],
                    backgroundColor: THEME_COLOR,
                    // height: IMAGE_HEIGHT,
                    minHeight: IMAGE_HEIGHT,
                    }}>
                    <Animated.Image
                        source={require('../../../assets/images/img_myclass.png')}
                        resizeMode='contain' //this.imgOpacity
                        style={{opacity: this.imgOpacity, width: '100%', height: IMAGE_HEIGHT - HEADER_HEIGHT, position: 'absolute', bottom: 0}}
                    />
                    <View style={{position:'absolute', left: 20, bottom: 30, width: SCREEN_WIDTH - 50}}>
                    {this.state.userInfo && (
                        <CustomTextL style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_large), color: 'white'}}>
                            <CustomTextM>{this.state.userInfo.memberName || ''}</CustomTextM>님{'\n'}반갑습니다 :)
                        </CustomTextL>
                    )}
                    </View>
                </Animated.View>
                <>
              {/* 기존) iOS 탭별 높이가 다른 탭의 영향을 받는 현상으로 인한 주석 처리(대체 방안은 아래의 소스 참조)
              <Tabs
                prerenderingSiblingsNumber={3}
                onChangeTab={({i}) => {
                  this.setState({height: this.heights[i], activeTab: i})
                }}
                locked={true}
                renderTabBar={props =>
                  <Animated.View
                    style={{transform: [{translateY: this.tabY}], zIndex: 1, width: '100%', backgroundColor: 'white'}}>
                    <ScrollableTab {...props}
                      renderTab={(name, page, active, onPress, onLayout) => (
                        <TouchableOpacity key={page}
                          onPress={() => {
                            onPress(page);
                            this._ScrollView.getNode().scrollTo({x: 0, animated: false})
                            }}
                          onLayout={onLayout}
                          activeOpacity={0.4}>
                          <Animated.View
                            style={{
                              flex: 1,
                              height: 100,
                              backgroundColor: this.tabBg
                            }}>
                            <TabHeading
                              scrollable
                              style={{
                                flex:1,
                                backgroundColor: 'transparent',
                                width: SCREEN_WIDTH / 3,
                                justifyContent: 'center',
                                //paddingTop:10
                              }}
                              active={active}>
                              <Animated.Text style={{
                                fontWeight: active ? 'bold' : 'normal',
                                color: active ? this.textColor : this.textColorDefault,
                                fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
                              }}>
                                {name}
                              </Animated.Text>
                            </TabHeading>
                          </Animated.View>
                        </TouchableOpacity>
                      )}
                      underlineStyle={{backgroundColor: this.textColor}}
                    />
                  </Animated.View>
                }>
                <Tab heading="나의강의">
                  <MyLetureScreen screenProps={this.props} screenState={this.state} />
                </Tab>
                <Tab heading="나의 MP3">
                  <MyMP3Screen screenProps={this.props} />
                </Tab>
                <Tab heading="학습관리">
                  <MyPracticeScreen screenProps={this.props} />
                </Tab>
              </Tabs>
              */}

              {/* 1안) iOS 탭별 높이가 다른 탭의 영향을 받는 현상으로 인한 주석 처리(대체 방안은 아래의 소스 참조)
                <ScrollableTabView
                    style={{width:SCREEN_WIDTH, height:'100%', backgroundColor: '#fff' }}
                    tabStyle={styles.tabStyle}
                    tabBarTextStyle={styles.tabBarTextStyle}
                    tabBarActiveTextColor={DEFAULT_COLOR.lecture_base}
                    tabBarInactiveTextColor={DEFAULT_COLOR.base_color_222}
                    tabBarUnderlineStyle={styles.underlineStyle}
                    renderTabBar={() => <ScrollableTabBar />}
                    tabBarPosition="top"
                    page={this.state.focusTab}>
                    <View style={{flex: 1, flexGlow: 1,}} tabLabel='나의강의' >
                        <MyLetureScreen screenProps={this.props} screenState={this.state} />
                    </View>
                    <View style={{flex: 1, flexGlow: 1,}} tabLabel='나의 MP3'>
                        <MyMP3Screen screenProps={this.props} />
                    </View>
                    <View style={{flex: 1, flexGlow: 1,}} tabLabel='학습관리'>
                        <MyPracticeScreen screenProps={this.props} />
                    </View>
                </ScrollableTabView>
              */}
                </>
              <Animated.View style={{
                    flexDirection: 'row',
                    // height: 60,
                    // borderBottomWidth: 1,
                    // borderBottomColor: '#DDDDDD',
                    backgroundColor: this.tabBackground,
                  }}>
                  {
                      this.state.tabList.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log('SCROLLED tab [' + item.title + '] clicked')
                                        var newTabList = [];
                                        this.state.tabList.map((newItem, newIndex) => {
                                            newTabList.push({...newItem, isFocused: index == newIndex})
                                        });
                                        this.setState({tabList: newTabList});
                                    }}
                                    style={{
                                        width: SCREEN_WIDTH / this.state.tabList.length,
                                        alignItems: 'center',
                                    }}
                                    key={index}
                                    >
                                    <View style={{
                                        // height: 57,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        // borderWidth: 1,
                                        paddingTop: 26,
                                        paddingBottom: 11,
                                    }}>
                                        {
                                            item.isFocused
                                                ?
                                                    <Animated.Text
                                                        style={{
                                                            fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyBold,
                                                            color: this.tabColorFocused,//DEFAULT_COLOR.lecture_base,
                                                            fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),
                                                            fontWeight: 'bold',
                                                            letterSpacing: PixelRatio.roundToNearestPixel(-1.2),
                                                            lineHeight: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16) * 1.42,
                                                    }}>
                                                        {item.title}
                                                    </Animated.Text>
                                                :
                                                    <Animated.Text
                                                        style={{
                                                            fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyRegular,
                                                            color: this.tabColorUnfocused,//DEFAULT_COLOR.lecture_base,
                                                            fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),
                                                            letterSpacing: PixelRatio.roundToNearestPixel(-1.2),
                                                            lineHeight: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16) * 1.42,
                                                        }}>
                                                        {item.title}
                                                    </Animated.Text>
                                        }
                                    </View>
                                    {
                                        item.isFocused
                                            &&
                                                <Animated.View style={{
                                                    width: (SCREEN_WIDTH / this.state.tabList.length) / 2,
                                                    height: 2,
                                                    backgroundColor: this.tabColorFocused,
                                                }}/>
                                    }
                                </TouchableOpacity>
                            )
                      })
                  }
                  <View style={{width: '100%', height: 2, backgroundColor: '#dddddd', position: 'absolute', bottom: 0, zIndex: -1}}></View>
              </Animated.View>

                {
                  // 0001 : 나의강의, 0002 : 나의MP3, 0003 : 학습관리
                    this.state.tabList.map((item, index) => {
                        if(item.isFocused) {
                            switch(item.code) {
                                case '0001':
                                    return(
                                        <View style={{flex: 1, flexGlow: 1}} tabLabel='나의강의' key={index}>
                                            <MyLetureScreen screenProps={this.props} screenState={this.state} />
                                        </View>
                                    )
                                    break;

                                case '0002':
                                    return (
                                        <View style={{flex: 1, flexGlow: 1}} tabLabel='나의 MP3' key={index}>
                                            <MyMP3Screen screenProps={this.props} screenState={this.state} />
                                        </View>
                                    )
                                    break;

                                case '0003':
                                    return (
                                        <View style={{flex: 1, flexGlow: 1}} tabLabel='학습관리' key={index}>
                                            <MyPracticeScreen
                                                ref={(component) => this._MyPracticeScreen = component}
                                                screenProps={this.props} screenState={this.state} />
                                        </View>
                                    )
                                    break;
                            }
                        }
                    })
                }
            </Animated.ScrollView>
            <View>
                <Modal
                    onBackdropPress={this.state.modalContent !== 'myclassInfo' ? this.closeModal : false}
                    animationType="slide"
                    onRequestClose={() => {
                    this.setState({showModal: false});
                    }}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating
                    isVisible={this.state.isShowModal}
                    style={{justifyContent: 'flex-end',margin: 0}}>
                        <View
                        style={[
                            {
                            height: this.state.modalContent === 'myclassInfo' ? SCREEN_HEIGHT : SCREEN_HEIGHT * 0.5,
                            },
                        ]}>
                        {this.getModalContent(this.state.modalContent)}
                        </View>
                </Modal>
            </View>

            {/*
            <View style={{
                position: 'absolute',
                bottom: 0,
                width: SCREEN_WIDTH,
                height: 55,
                backgroundColor: '#FF0000',
            }}>
                <CustomTextB>TEST</CustomTextB>
            </View>
            */}

                {this.state.tabList.map((item, index) => {
                    if (item.isFocused) {
                        switch (item.code) {
                            case '0002':
                                return (
                                    this.props.isMyClassOwnMP3Empty && (
                                        <View style={styles.controlMP3BottomContainer} key={index}>
                                            <TouchableOpacity
                                                style={styles.controlMP3BottomWrapper}
                                                onPress={() => this.goMainAndMoveTab()}>
                                                <CustomTextM style={styles.controlMP3BottomText}>
                                                    {'MP3 구매하러 가기'}
                                                </CustomTextM>
                                            </TouchableOpacity>
                                        </View>)
                                );
                                break;

                            case '0003':
                                return (
                                    <View style={styles.controlBottomContainer} key={index}>
                                        <TouchableOpacity
                                            style={styles.controlBottomWrapper}
                                            onPress={() => {
                                                if (this.props.myClassModifyModeTarget === 'memo') {
                                                    this.props.myClassMemoModifyMode
                                                        ? this._MyPracticeScreen.deleteMemoList()
                                                        : this._MyPracticeScreen.toggleWriteMemoModal()
                                                } else if (this.props.myClassModifyModeTarget === 'qna') {
                                                    this.props.myClassQnaModifyMode
                                                        ? this._MyPracticeScreen.deleteQnaList()
                                                        : this._MyPracticeScreen.openWriteQnaModal()
                                                }
                                            }}
                                        >
                                            <CustomTextB style={styles.controlBottomText}>
                                                {
                                                    this.props.myClassModifyModeTarget === 'memo'
                                                    ? (this.props.myClassMemoModifyMode ? '삭제' : '추가')
                                                    : ((this.props.myClassModifyModeTarget === 'qna')
                                                        ? (this.props.myClassQnaModifyMode ? '삭제' : '추가') : null)
                                                }
                                            </CustomTextB>
                                        </TouchableOpacity>
                                    </View>
                                )
                                break;
                        }
                    }
                })}


          </View>
        );
    }
}

const styles = StyleSheet.create({
    fixedUpButton : {
        position:'absolute',bottom:50,right:20,width:50,height:50,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:25,opacity:0.5
    },
    tabStyle : {
        padding: 0,
        margin: 0,
        alignItems: 'center',
        justifyContent : 'center'
    },
    tabBarTextStyle: {
        fontSize: DEFAULT_TEXT.head_small,
    },
    underlineStyle: {
        height: 1.5,
        backgroundColor: DEFAULT_COLOR.lecture_base,
    },
    controlBottomContainer: {
        position: 'absolute',
        bottom: 0,
        flex: 1,
        width: SCREEN_WIDTH,
        height: 55,
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
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),
        letterSpacing: -0.9,
    },

    controlMP3BottomContainer: {
        position: 'absolute',
        bottom: 0,
        flex: 1,
        width: SCREEN_WIDTH,
        height: 85,
    },
    controlMP3BottomWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 65,
        backgroundColor: DEFAULT_COLOR.lecture_base,
        margin: 20,
        borderRadius: 4,
    },
    controlMP3BottomText: {
        color: DEFAULT_COLOR.base_color_fff,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
    },
});

MyClassScreen.propTypes = {
  myClassServiceID: PropTypes.string,
  myClassMemoModifyMode: PropTypes.bool,
  myClassQnaModifyMode: PropTypes.bool,
  myClassModifyModeTarget: PropTypes.string,
  isMyClassOwnMP3Empty: PropTypes.bool,
};

const mapStateToProps = state => {
  return {
    myClassServiceID: state.GlabalStatus.myClassServiceID,
    myClassMemoModifyMode: state.GlabalStatus.myClassMemoModifyMode,
    myClassQnaModifyMode: state.GlabalStatus.myClassQnaModifyMode,
    myClassModifyModeTarget: state.GlabalStatus.myClassModifyModeTarget,
    isMyClassOwnMP3Empty: state.GlabalStatus.isMyClassOwnMP3Empty,
    myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateMyClassServiceID: serviceID => {
      dispatch(ActionCreator.updateMyClassServiceID(serviceID));
    },
    updateMyClassModifyModeTarget:(string) => {
      dispatch(ActionCreator.updateMyClassModifyModeTarget(string));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(MyClassScreen);
