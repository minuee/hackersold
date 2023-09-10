import React, {Component} from 'react';
import {StyleSheet, SafeAreaView, Dimensions, View, Alert, Text, Button, TouchableOpacity, Image, PixelRatio, Linking} from 'react-native';
import Modal from 'react-native-modal';
import { WebView } from 'react-native-webview';
import FreeParallaxScrollView from '../../Utils/FreeParallaxScroll/FreeParallaxScrollView';
import AutoHeightWebView from '../../Utils/AutoHeightWebView/index';
import Crypt from '../../Utils/Crypt';
import SendIntentAndroid from 'react-native-send-intent';

import { CustomText, CustomTextR } from '../../Style/CustomText';
import { isIphoneX, getBottomSpace } from "react-native-iphone-x-helper";

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonUtil from "../../Utils/CommonUtil";
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;



// TODO [개발] 웹뷰와 Native 통신용 공통 함수 정의 필요
// TODO 1. 레벨 테스트를 시작한 경우를 감지
// TODO 2. 레벨 테스트 완료한 경우를 감지(이후 페이지 전환 시 외부 브라우저로 이동하기 위함)
// TODO [기획] 통합앱 전용 신규 레벨 테스트 이벤트 페이지 요구사항 종합 및 검토 요청

/*
const INJECTED_JAVASCRIPT = `(function() {
        var url = new URL(location.href);
        if(!url.searchParams.has('iframe')) {
            url.searchParams.append('iframe', 'Y');
            location.href = url.href;
        }    
    })();`;
*/

/*
document.ready
        document.getElementById("orderForm").addEventListener('submit', functSubmit);

        function functSubmit(event) {
          //var msg = document.getElementById("input1").value;
          window.ReactNativeWebView.postMessage({msg: "Hello!"})
        }

                document.addEventListener("DOMContentLoaded", function(){
            window.ReactNativeWebView.postMessage('{RNAction: "TEST"}');
        });

*/

/*
* Android > 정상 링크

 LOG  onShould isEndedTest = true
 LOG  onShould webViewSource.uri = https://mtchina.hackers.com/?c=event&evt_id=18051804&exam_type=1
 LOG  onShould request.url = https://mtchina.hackers.com/?c=event&evt_id=19052900
 LOG  onShould DIRRENT URL

* Android > 오류 링크(수강신청)

(onLoad nativeEvent.url = https://mtchina.hackers.com/)
★ LOG  onLoad isFirstLoad = false
★ LOG  onLoad isEndedTest = true
 LOG  onShould isEndedTest = true
 LOG  onShould webViewSource.uri = https://mtchina.hackers.com/?c=event&evt_id=18051804&exam_type=1
★ LOG  onShould request.url = https://mtchina.hackers.com/?r=china&m=order&mode=order_step1&odr_no=HCM2020040715350513
 LOG  onShould DIRRENT URL

* iOS > 정상 링크

 LOG  onShould isEndedTest = true
 LOG  onShould webViewSource.uri = https://mtchina.hackers.com/?c=event&evt_id=18051804&exam_type=1#;
 LOG  onShould request.url = https://mtchina.hackers.com/?c=event&evt_id=19052900
 LOG  onShould DIRRENT URL

* iOS > 오류 링크(수강신청)

 LOG  onShould isEndedTest = true
 LOG  onShould webViewSource.uri = https://mtchina.hackers.com/?c=event&evt_id=18051804&exam_type=1#;
★ LOG  onShould request.url = https://mtchina.hackers.com/
 LOG  onShould DIRRENT URL
*/

/*
* 챔프 레벨 테스트 리소스 추적

- 채점 완료 페이지
/hackersingang/modules/event/pages/china/2018/05/1804/_mobile/event.php

> {BTN_ORDER} 생성
/hackersingang/widgets/event/lecture/main.php

> 이벤트 등록
/hackersingang/modules/event/pages/china/2018/05/1804/_mobile/_event.js

> 이벤트 로직
/hackersingang/modules/unittest/_main.js


Request URL: https://mchina.hackers.com/
Request Method: POST

r: china
m: order
a: registration
evt_id: 18051804
evt_no:
odr_lec_id: 6168
*/

const INJECTED_JAVASCRIPT = `
    (function(){
        alert(document.getElementById("orderForm"));
        
        document.addEventListener('submit', functSubmit);

        function functSubmit(event) {
          alert('WOW')
          //var msg = document.getElementById("input1").value;
          //window.ReactNativeWebView.postMessage({msg: "Hello!"})
        }
    })();
`;

const INJECTED_JAVASCRIPT_AFTER = `
    (function(){
        alert(document.getElementById("orderForm"));
        
        document.addEventListener('submit', functSubmit);

        function functSubmit(event) {
          alert('WOW AFTER')
          //var msg = document.getElementById("input1").value;
          //window.ReactNativeWebView.postMessage({msg: "Hello!"})
        }
    })();
`;

/*
const html = `
      <html>
      <head></head>
      <body>
        <script>
            window.ReactNativeWebView.postMessage({msg: "Hello!"})
        </script>
      </body>
      </html>
    `;
*/

const RN_ACTION_KEY = 'RNAction'
const RN_ACTION_START_TEST = 'START_TEST';
const RN_ACTION_END_TEST = 'END_TEST'
const RN_ACTION_NEED_TO_LOGIN = 'NEED_TO_LOGIN'
const RN_ACTION_TEST = 'TEST'


//TODO 웹/앱 통신
const html = `
    <html>
        <head>
                
            <script>
              function startTest() {
                window.ReactNativeWebView.postMessage('{"${RN_ACTION_KEY}": "${RN_ACTION_START_TEST}"}');
              }
              function endTest() {
                window.ReactNativeWebView.postMessage('{"${RN_ACTION_KEY}": "${RN_ACTION_END_TEST}"}');  
              }
              function test() {
                window.ReactNativeWebView.postMessage('{"${RN_ACTION_KEY}": "${RN_ACTION_TEST}"}');  
              }
              function needToLogin() {
                window.ReactNativeWebView.postMessage('{"${RN_ACTION_KEY}": "${RN_ACTION_NEED_TO_LOGIN}"}');  
              }
              function requestGetTest() {
                location.href = 'https://mtchina.hackers.com?r=china&m=order&a=registration&evt_id=18051804&evt_no=&odr_lec_id=6168';
                /*
                var tmp_form = $('<form id="orderForm" action ="/" name="orderForm" method="post">' +
                    '<input type="hidden" name="r" value="china">'+
                    '<input type="hidden" name="m" value="order">'+
                    '<input type="hidden" name="a" value="registration">'+
                    '<input type="hidden" name="evt_id" value="18051804">'+
                    '<input type="hidden" name="odr_lec_id" value="6168">'+
                    '</form>');
                tmp_form.appendTo('body');
                tmp_form.submit();
                */
              }
            </script>
        </head>
        <body>
            <div>
                <h1>
                    테스트 페이지
                </h1>
            </div>
            <button onclick="startTest()">테스트 시작</button>
            <button onclick="endTest()">테스트 종료</button>
            <button onclick="requestGetTest()">GET</button>            
            <a href="https://mchamp.hackers.com">챔프스터디</a>
        </body>
    </html>
`;

// PacticeDailyDetail 복제 용도
const HEADER_TITLE = '무료 레벨 테스트';
const HEADER_BACKGROUND_SOURCE = require('../../../assets/icons/img_learn_v.png');


const TEMP_MEMBER_IDX = 4062578;

export default class PracticeLevelDetail extends Component {
    constructor(props) {
        super(props)
        this.state={
            isLogin: false,
            isStartedTest: false,
            isEndedTest: false,
            isHistoryBack: false,
            isFirstLoad: true,
            isModalVisible: false,
            // TODO 추후에 이전 페이지에서 암호화된 memberIdx를 보내줘야함
            webViewSource: {
                'uri': this.props.navigation.getParam('webViewUrl'),
                // 중국어 'uri': 'https://mtchina.hackers.com/?c=event&evt_id=18051804&isAppTotal=Y&memberIdx=' + Crypt.encrypt(TEMP_MEMBER_IDX.toString()),
                // 기초영어 'uri': 'http://mttalk.hackers.com/?r=hackerstalk&c=event&evt_id=17062800&isAppTotal=Y&memberIdx=' + Crypt.encrypt(TEMP_MEMBER_IDX.toString()),
                // 토익 'uri': 'https://mtchamp.hackers.com/?c=event&evt_id=16062210&isAppTotal=Y&memberIdx=' + Crypt.encrypt(TEMP_MEMBER_IDX.toString()),
                // 텝스 'uri': 'https://mtchamp.hackers.com/?c=event&evt_id=19022200&isAppTotal=Y&memberIdx=' + Crypt.encrypt(TEMP_MEMBER_IDX.toString()),
                // IELTS 'uri': 'http://m.tchamp.hackers.com/?c=event&evt_id=18071701&isAppTotal=Y&memberIdx=' + Crypt.encrypt(TEMP_MEMBER_IDX.toString()),


                // TODO 게이트 페이지 파라미터 전달 예정
                //body: JSON.stringify({
                //    'memberIdx': Crypt.encrypt(TEMP_MEMBER_IDX),
                //}),
                //method: 'POST',
            }
        }

        //console.log('PracticeLevelDetail.constructor()', 'uri = ' + this.state.webViewSource)

        //console.log('ENCRYPT', Crypt.encrypt('1987568'))
        //console.log('ENCRYPT', Crypt.encrypt('6002708'))
        //console.log('ENCRYPT', Crypt.encrypt('10007893'))
        //console.log('ENCRYPT', Crypt.encrypt('56978879'))
        //console.log('ENCRYPT', Crypt.encrypt('264987968'))
        //console.log("ENCRYPT", Crypt.encrypt(TEMP_MEMBER_IDX))

        /*
         LOG  encrypt string = 1987568
         LOG  ENCRYPT UqCIbqaiqw==

         LOG  encrypt string = 6002708
         LOG  ENCRYPT V5eAaaicqw==

         LOG  encrypt string = 10007893
         LOG  ENCRYPT UpeAZ6ikrGU=

         LOG  encrypt string = 56978879
         LOG  ENCRYPT Vp2Jbqmkqms=

         LOG  encrypt string = 264987968
         LOG  ENCRYPT U52EcKmjrGir

         1. 1987568
        2. 6002708
        3. 10007893
        4. 56978879
        5. 264987968
         */
    }

    _onShouldStartLoadWithRequest = (request) => {

        console.log('_onShouldStartLoadWithRequest()', JSON.stringify(request))


        // TODO request.navigationType
        // GET 방식   : click
        // POST 방식  : formsubmit

        if(this.state.isEndedTest) {
            console.log('   ㄴ', 'isEndedTest = true')
            console.log('   ㄴ', 'webViewSource.uri = ' + this.state.webViewSource.uri)
            console.log('   ㄴ ', 'request.url = ' + request.url)



            if(this.state.webViewSource.uri !== request.url) {
                console.log('   ㄴ', 'DIFFERENT URL' )

                // DONE POST 방식으로 브라우저 호출 필요

                // DONE (Android) POST URL 호출 및 리다이렉트 주소는 확보가 되지만 WebView가 blank 상태(빈 화면)
                // DONE (iOS) POST URL PARAMS MISSING

                //request.url = 'https://mtchina.hackers.com?r=china&m=order&a=registration&evt_id=18051804&evt_no=&odr_lec_id=6168';

                // DONE request.url이 about:blank인 경우에 대한 예외 처리
                if(request.url === 'about:blank') {
                    console.log('   ', 'about:blank' )
                } else {
                    if (Platform.OS == 'ios') {
                        Linking.openURL(request.url)
                            .catch(err =>
                                console.error(`Could not open URL ${request.url}`, err)
                            );
                    } else {
                        SendIntentAndroid.openChromeIntent(request.url);
                        //return true;
                        //this.webView.stopLoading()
                        //console.log('CURRENT WEBVIEW', JSON.stringify(this.state.webViewSource))
                    }
                }
            } else {
                console.log('   ', 'SAME URL' )
            }

            return false;
        } else {
            console.log('   ㄴ', 'isEndedTest = false')
            return true;
        }
    }

    _onLoadEnd = (event) => {
        console.log('_onLoadEnd()', 'START');
    }

    _onLoad = (event) => {
        console.log('_onLoad()', 'START');
    }

    _onLoadStart = (event) => {
        const { nativeEvent } = event

        console.log('_onLoadStart()', 'START');
        console.log('_onLoadStart()', 'nativeEvent.url = ' + nativeEvent.url)

        if(this.state.isFirstLoad) {
            console.log('   ㄴ', 'isFirstLoad = true')
            this.setState({
                isFirstLoad: false,
                webViewSource: {
                    uri: nativeEvent.url
                }
            })
        } else {
            console.log('   ㄴ', 'isFirstLoad = false')

            if(this.state.isEndedTest) {
                console.log('   ㄴ', 'isEndedTest = true')
            } else {
                console.log('   ㄴ', 'isEndedTest = false')
                this.setState({
                    webViewSource: {
                        uri: nativeEvent.url
                    }
                })
            }
        }
    }

    _historyBack(){
        if(this.state.isStartedTest && !this.state.isEndedTest) {
            this.setState({
                isModalVisible: true,
            })
        } else {
            this.props.navigation.goBack(null)
        }
    }

    onHistoryBack = () => {
        this.setState({
            isModalVisible: false,
            isHistoryBack: true
        })
    }

    _onModalHide = () => {
        if(this.state.isHistoryBack) {
            this.props.navigation.goBack(null)
        }
    }

    _onMessage = (event) => {
        let data = JSON.parse(event.nativeEvent.data);
        if(data.hasOwnProperty(RN_ACTION_KEY)) {
            switch(data[RN_ACTION_KEY]) {
                case RN_ACTION_START_TEST:
                    this._onRNActionStartTest()
                    break;
                case RN_ACTION_END_TEST:
                    this._onRNActionEndTest()
                    break;
                case RN_ACTION_NEED_TO_LOGIN:
                    this._onRNActionNeedToLogin()
                    break;
                case RN_ACTION_TEST:
                    this._onRNActionTest()
                    break;
            }
        }
    }

    _onRNActionStartTest = () => {
        this.setState({
            isStartedTest: true,
        })
    }

    _onRNActionEndTest = () => {
        this.setState({
            isEndedTest: true,
        })
    }

    _onRNActionNeedToLogin = () => {
        //레벨 테스트 결과 확인을 위해 로그인을 진행해주세요

        Alert.alert('', '레벨 테스트 결과 확인을 위해 로그인을 진행해주세요',
            [
                {text: '확인', onPress: () => {
                        this.props.navigation.navigate(
                            'SignInScreen',
                            {
                                onLoginCancelBack: () => this._onLoginCancelBack(),
                            });
                    }
                },
                {text: '취소', onPress: () => function(){} },
            ]);
    }

    _onLoginCancelBack = async() => {
        console.log('_onLoginCancelBack()', 'START')
        console.log('_onLoginCancelBack()', 'this.state.webViewSource.uri = ' + this.state.webViewSource.uri)

        // DONE 담당 영역 로그인 체크 함수 isLoginCheck로 변경(범준 파트장님)
        const isLogin = await CommonUtil.isLoginCheck()

        if(isLogin === true) {
            console.log('_onLoginCancelBack()', 'CommonUtil.isLoginCheck() === true')
            const userInfo = await CommonUtil.getUserInfo();

            if(this.state.isLogin) {
                console.log('_onLoginCancelBack()', 'this.state.isLogin === true')
                console.log('_onLoginCancelBack()', 'NO REPOND')
                //this.webView.reload()

            } else {
                console.log('_onLoginCancelBack()', 'this.state.isLogin === false')
                console.log('_onLoginCancelBack()', 'NEW this.state.webViewSource.uri = '
                                + this.props.navigation.getParam('webViewUrl') + '&memberIdx=' + encodeURIComponent(Crypt.encrypt(userInfo.memberIdx.toString())))


                if(Platform.OS === 'android') {
                    this.setState({
                        isLogin: true,
                        webViewSource: {uri: this.props.navigation.getParam('webViewUrl') + '&memberIdx=' + encodeURIComponent(Crypt.encrypt(userInfo.memberIdx.toString()))}
                    })
                } else {
                    this.setState({
                        isLogin: true,
                        webViewSource: {uri: this.props.navigation.getParam('webViewUrl') + '&memberIdx=' + encodeURIComponent(Crypt.encrypt(userInfo.memberIdx.toString()))}
                    })
                }
            }
        } else {
            console.log('_onLoginCancelBack()', 'CommonUtil.isLoginCheck() === false')
            this.setState({isModalVisible: true})
        }

        console.log('_onLoginCancelBack()', 'END')
    }

    _onRNActionTest = () => {
        alert('Test')
    }

    render() {
        return(
            <View style={styles.container}>
                <FreeParallaxScrollView
                    windowHeight={SCREEN_HEIGHT * 0.20}
                    backgroundSource={HEADER_BACKGROUND_SOURCE}
                    navBarHeight={Platform.OS === 'android' ? 65 :  isIphoneX() ? 85 : 75}
                    navBarColor={'#ff0000'}
                    navBarTitle=''
                    navBarView={false}
                    lectureName={HEADER_TITLE}
                    headerView={<View></View>}
                    textbookTitle='123'
                    markImage='../../../assets/icons/icon_mp_title.png'
                    leftIcon={{name: 'left', color: '#fff', size: 25, type: 'font-awesome'}}
                    centerTitle={HEADER_TITLE}
                    leftIconOnPress={()=>this._historyBack()}
                    rightIcon={null}
                    scrollableViewStyle={{flex: 1,overflow: 'hidden', }}
                    >
                    <AutoHeightWebView
                        ref={(ref) => this.webView = ref}
                        style={styles.webview}
                        source={this.state.webViewSource}
                        //source={{ html }}
                        onMessage={(event) => { this._onMessage(event) }}
                        onShouldStartLoadWithRequest={(request) => this._onShouldStartLoadWithRequest(request)}
                        onLoad={(event) => this._onLoad(event)}
                        onLoadStart={(event)=> this._onLoadStart(event)}
                        onLoadEnd={(event)=> this._onLoadEnd(event)}
                        //injectedJavaScript={INJECTED_JAVASCRIPT} DOM이 로드되고 나서 실행되기 때문에 깜빡임 발생
                        //injectedJavaScriptBeforeContentLoaded={INJECTED_JAVASCRIPT_AFTER}
                        domStorageEnabled={true}
                        scalesPageToFit={false}
                        //onSizeUpdated={(size) => console.log('onSizeUpdated', size.height)}
                        javaScriptEnabled={true}
                        incognito={true}
                        viewportContent={'width=device-width, user-scalable=no'}
                        scrollEnabledWithZoomedin={false}
                        startInLoadingState={false}
                        /*sharedCookiesEnabled={true}*/
                        />
                </FreeParallaxScrollView>
                <Modal
                    animationType={'fade'}
                    isVisible={this.state.isModalVisible}
                    onModalHide={() => this._onModalHide()}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating
                    >
                    <View style={styles.modalWrapper}>
                        <View style={styles.modalTitle}>
                            <Image
                                style={styles.modalTitleIcon}
                                source={require('../../../assets/icons/icon_alert_exclamation.png')}/>
                            <CustomTextR style={styles.modalTitleText}>
                                풀이 내용이 저장되지 않습니다.{'\n'}
                                이동하시겠습니까?
                            </CustomTextR>
                        </View>

                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.modalButtonWrapper,
                                    styles.modalButtonWrapperCancel
                                ]}
                                onPress={() => this.setState({isModalVisible: false})}>
                                <CustomTextR style={styles.modalButtonCancel}>
                                    취소
                                </CustomTextR>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.modalButtonWrapper,
                                    styles.modalButtonWrapperConfirm
                                ]}
                                onPress={() => this.onHistoryBack()}>
                                <CustomTextR style={styles.modalButtonConfirm}>
                                    확인
                                </CustomTextR>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        //width: SCREEN_WIDTH,
        //height: '100%'
        //maxHeight: SCREEN_HEIGHT,
        //minHeight: SCREEN_HEIGHT * 0.70,
        //backgroundColor: '#00FF00',
    },
    modalWrapper: {
        width: SCREEN_WIDTH * 0.70,
        alignSelf: 'center',
        justifyContent: 'space-between',
        backgroundColor: DEFAULT_COLOR.base_color_fff,
        borderRadius: 12,
    },
    modalTitle: {
        height: isIphoneX() ? SCREEN_HEIGHT * 0.15 : SCREEN_HEIGHT * 0.20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTitleIcon: {
        width: 25,
        height: 25,
        marginBottom: 15,
    },
    modalTitleText: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
        lineHeight: DEFAULT_TEXT.body_14 * 1.42,
        textAlign: 'center',
    },
    modalButtonContainer: {
        height: 45,
        flexDirection: 'row',
    },
    modalButtonWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalButtonWrapperCancel: {
        borderTopWidth: 1,
        borderTopColor: '#e8e8e8',
        borderRightWidth: 1,
        borderRightColor: '#e8e8e8',
    },
    modalButtonWrapperConfirm: {
        borderTopWidth: 1,
        borderTopColor: '#e8e8e8',
    },
    modalButtonCancel: {
        color: DEFAULT_COLOR.base_color_888,
        fontSize: PixelRatio.roundToNearestPixel(16),
        lineHeight: 16 * 1.42,
    },
    modalButtonConfirm: {
        color: DEFAULT_COLOR.lecture_base,
        fontSize: PixelRatio.roundToNearestPixel(16),
        lineHeight: 16 * 1.42,
    },
})