import React, {Component} from 'react';
import {StyleSheet, SafeAreaView, Dimensions, View, Alert, Text, Button, TouchableOpacity, Image, PixelRatio} from 'react-native';
import Modal from 'react-native-modal';
import { WebView } from 'react-native-webview';
import FreeParallaxScrollView from '../../Utils/FreeParallaxScroll/FreeParallaxScrollView';
import AutoHeightWebView from '../../Utils/AutoHeightWebView/index';
import { CustomText, CustomTextB } from '../../Style/CustomText';
import { isIphoneX, getBottomSpace } from "react-native-iphone-x-helper";


const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

// TODO PracticeLevelDetail와 동기화

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

export default class PracticeLevelDetail extends Component {
    constructor(props) {
        super(props)
        this.state={
            isModalVisible: false,
            webViewSource: {
                'uri': this.props.navigation.getParam('webViewUrl'),
                //테스트코드 'uri': 'https://mjapan.hackers.com/?r=japan&c=free_lecture/daily&iframe=Y'
                // TODO 게이트 페이지 파라미터 전달 예정
                body: JSON.stringify({
                    'foo1': 'bar1',
                    'foo2': 'bar2',
                }),
                method: 'POST',
            }
        }
    }

    _onShouldStartLoadWithRequest = (request) => {
        //this.webView.source = { uri: request.url + '&iframe=Y' }
        //console.log('ref', this.webView.ref)
        return true;
    }

    _onLoadStart = (event) => {
        const {nativeEvent} = event

        var regex = /[?&]([^=#]+)=([^&#]*)/g,
            params = {},
            match;
        while (match = regex.exec(nativeEvent.url)) {
            params[match[1]] = match[2];
        }

        if (!params.hasOwnProperty('iframe')) {
            this.setState({
                isFirstLoad: false,
                webViewSource: {
                    uri: nativeEvent.url + '&iframe=Y'
                }
            })
        }
    }

    _historyBack(){
        this.props.navigation.goBack(null)
    }

    render() {
        return(
            <View style={styles.container}>
                <FreeParallaxScrollView
                    windowHeight={SCREEN_HEIGHT * 0.20}
                    backgroundSource={require('../../../assets/icons/img_learn_d.png')}
                    navBarHeight={Platform.OS === 'android' ? 65 :  isIphoneX() ? 85 : 75}
                    navBarColor={'#ff0000'}
                    navBarTitle=''
                    navBarView={false}
                    lectureName={'데일리 학습'}
                    headerView={<View></View>}
                    textbookTitle='123'
                    markImage='../../../assets/icons/icon_mp_title.png'
                    leftIcon={{name: 'left', color: '#fff', size: 25, type: 'font-awesome'}}
                    centerTitle={'데일리 학습'}
                    leftIconOnPress={()=>this._historyBack()}
                    rightIcon={null}
                    scrollableViewStyle={{flex: 1,overflow: 'hidden'}}>
                    <AutoHeightWebView
                        ref={(ref) => this.webView = ref}
                        style={styles.webview}
                        source={this.state.webViewSource}
                        /*
                        source={{ html }}
                        onMessage={event => {
                            console.log('onMessage', JSON.stringify(event.nativeEvent.data));
                        }}
                        */
                        onShouldStartLoadWithRequest={(request) => this._onShouldStartLoadWithRequest(request)}
                        onLoadStart={(event)=> this._onLoadStart(event) }
                        //injectedJavaScript={INJECTED_JAVASCRIPT} DOM이 로드되고 나서 실행되기 때문에 깜빡임 발생
                        viewportContent={'width=device-width, user-scalable=no'}
                        scalesPageToFit={true}
                        onSizeUpdated={(size) => console.log('onSizeUpdated', size.height)}
                        javaScriptEnabled={true}
                        incognito={true}
                    />
                </FreeParallaxScrollView>
                <Modal isVisible={this.state.isModalVisible}>
                    <View style={styles.modalWrapper}>
                        <View style={styles.modalTitle}>
                            <Image
                                style={styles.modalTitleIcon}
                                source={require('../../../assets/icons/icon_alert_exclamation.png')}/>
                            <CustomText style={styles.modalTitleText}>
                                풀이 내용이 저장되지 않습니다.{'\n'}
                                이동하시겠습니까?
                            </CustomText>
                        </View>

                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.modalButtonWrapper,
                                    styles.modalButtonWrapperCancel
                                ]}
                                onPress={() => this.setState({isModalVisible: false})}>
                                <CustomText style={styles.modalButtonCancel}>
                                    취소
                                </CustomText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.modalButtonWrapper,
                                    styles.modalButtonWrapperConfirm
                                ]}
                                onPress={() => this.props.navigation.goBack(null)}>
                                <CustomText style={styles.modalButtonConfirm}>
                                    확인
                                </CustomText>
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
        //maxHeight: SCREEN_HEIGHT * 10,
        minHeight: SCREEN_HEIGHT * 0.80,
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
    },
    modalButtonConfirm: {
        color: DEFAULT_COLOR.lecture_base,
        fontSize: PixelRatio.roundToNearestPixel(16),
    },
})