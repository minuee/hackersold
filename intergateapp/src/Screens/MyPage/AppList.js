import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Image,
    View,
    StyleSheet,
    Text,
    PixelRatio,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    Platform,
    Linking,
    Modal,
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextB, CustomTextM} from '../../Style/CustomText';
import AppLink from "../../Utils/AppLink";
import SendIntentAndroid from "react-native-send-intent/index";
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

import { AppInstalledChecker, CheckPackageInstallation } from '../../Utils/AppInstalledChecker'

export default  class AppList extends Component {
    constructor(props) {
        super(props);

        // 지원하지 않는 OS 항목 제외

        let itemList = [];
        let isSupport = false
        let currentOS = Platform.OS.toLowerCase();
        //let currentOS = 'android';
        let app = props.screenState.contentItems.app;

        /*
        let app =  [
            {
                "appName": "해커스 MP3 플레이어",
                "desc": "간단정보",
                "icon": "http://img.hackers.com/user/uploads/appLinkImage/1587020402978backend.png",
                "show": [
                    "IOS",
                    "Android",
                ],
                "store": [
                    {
                        "oSName": "IOS",
                        "storeName": "AppStore",
                        "customUrl": "mmplayer://",
                        "url": "https://apps.apple.com/kr/app/%ED%95%B4%EC%BB%A4%EC%8A%A4-mp3-%ED%94%8C%EB%A0%88%EC%9D%B4%EC%96%B4/id531669642"
                    },
                    {
                        "oSName": "Android",
                        "storeName": "GooglePlay",
                        "customUrl": "mmplayer://",
                        "url": "https://play.google.com/store/apps/details?id=com.hackers.app.hackersmp3"
                    },
                    {
                        "oSName": "Android",
                        "storeName": "OneStore",
                        "customUrl": "mmplayer://",
                        "url": "https://m.onestore.co.kr/mobilepoc/apps/appsDetail.omp?prodId=0000315413"
                    }
                ]
            },
            {
                "appName": "아쿠아 N 매니저",
                "desc": "간단정보",
                "icon": "http://img.hackers.com/user/uploads/appLinkImage/1587020402978backend.png",
                "show": [
                    "Android",
                    "IOS",
                ],
                "store": [
                    {
                        "oSName": "IOS",
                        "storeName": "AppStore",
                        "customUrl": "cdnmp://",
                        "url": "https://apps.apple.com/kr/app/aqua-nmanager/id1048325731"
                    },
                    {
                        "oSName": "Android",
                        "storeName": "GooglePlay",
                        "customUrl": "cdnmp://",
                        "url": "https://play.google.com/store/apps/details?id=com.cdn.aquanmanager"
                    },
                ]
            }
        ]
        */

        //props.screenState.contentItems.app.map((item, index) => {
        for(let i = 0; i<app.length; i++){
            let show = app[i].show;
            isSupport = false

            //item.show.map((showItem, showIndex) => {
            for(let j = 0; j<show.length; j++) {
                let targetOS = show[j].toLowerCase()

                if(currentOS === targetOS) {
                    isSupport = true
                }
            }

            if(isSupport) {
                let store = app[i].store;
                let storeList = [];
                let isStoreFound = false;

                //item.store.map((appItem, appIndex) => {
                for(let k = 0; k<store.length; k++) {
                    let targetOS = store[k].oSName.toLowerCase()

                    if(currentOS === targetOS) {
                        isStoreFound = true
                        storeList.push(store[k])
                    }
                }

                if(isStoreFound) {
                    itemList.push({ ...app[i], store: storeList })
                }
            }
        }

        this.state = {
            loading : true,
            showModal: false,
            heightScrollView: 0,
            itemList: itemList || [],
            pickerItems: [],
            /*
            itemlist :[
                {index:1,title : '[필독]해커스인강 서버 적검안내' , theme : '공지사항',description:'dddddddddddd'},
                {index:2,title : '해커스 이벤트 당첨' , theme : '당첨자발표',description:'dddddddddddd'},
                {index:3,title : '이벤트1111111' , theme : '이벤트',description:'dddddddddddd'},
                {index:4,title : '이벤트1111111' , theme : '이벤트',description:'dddddddddddd'},
                {index:5,title : '이벤트1111111' , theme : '이벤트',description:'dddddddddddd'},
                {index:6,title : '이벤트1111111' , theme : '이벤트',description:'dddddddddddd'},
                {index:7,title : '이벤트12222211' , theme : '이벤트',description:'dddddddddddd'},
                {index:7,title : '333333' , theme : '이벤트',description:'dddddddddddd'}
            ],
            */
        }
    }

    onLayoutScrollView = (event) => {
        const layout = event.nativeEvent.layout;

        this.setState({
            heightScrollView: layout.height
        });
    }

    UNSAFE_componentWillMount() {        
        
    }  

    componentDidMount() {     
        this.setState({loading:false});
    }

    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보        
        
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
     
    }

    componentWillUnmount(){
        if(this.timeout){
            clearInterval(this.timeout);
        }
    }

    togglePicker = () => {
        this.setState({ showModal: !this.state.showModal })
    };

    selectFilter = (store) => {
        Linking.openURL(store.url)
        this.togglePicker()
    }

    controllerApps = (store) => {
        // CANCEL store 항목 내 customUrl 파라미터 추가 요청 필요
        //테스트코드 const customUrl = 'HackersToeic://';
        //테스트코드 const storeUrl = 'https://apps.apple.com/kr/app/id430260350';
        //테스트코드 const customUrl = store[0].customUrl;

        if(store.length == 1) {
            Linking.openURL(store[0].url)
        } else {
            this.setState({
                pickerItems: store
            }, function() {
                this.togglePicker()
            })
        }

        /*테스트코드
        Linking.openURL(customUrl).catch(err => {
            // 현재 기준으로 customUrl은 무결하다고 가정하고
            // catch 경우를 앱이 설치 않은 것으로 간주하여 처리

            console.log('err :' + JSON.stringify(err))
            Linking.openURL(storeUrl)

            if(store.length == 1) {
                Linking.openURL(store[0].url)
            } else {
                this.setState({
                    pickerItems: store
                }, function() {
                    this.togglePicker()
                })
            }
        });
        */
    }

    // TODO 통합앱에서의 외부앱 실행 업무 공유를 위한 레퍼런스
    testControllerApps = (store) => {

        /** 관련 작업 영역 파악 **/
        /*
        1. (p.348) 화면 "해커스패밀리 > APP 탭" (인엽 프로)
            ㄴ 관련 API "해커스패밀리 > 목록"
            ㄴ 대상 : 모든 해커스앱
            ㄴ 요구 : 해당 앱 설치 여부 확인, 외부앱 호출

        2. (p.211) 화면 "나의 MP3 > 상세 > 전체 다운로드" (범준 파트장님)
            ㄴ 관련 API "마이클래스 - 나의 MP3 > 상세 - MP3 컨텐츠 상세"
            ㄴ 대상 : 해커스 MP3 플레이어
            ㄴ 요구 : 해당 앱 설치 여부 확인(배너), 레거시 Custom URL 호출

        3. (p.198) 화면 "나의 강의 - 상세 > 강의 다운로드" (범준 파트장님)
            ㄴ 관련 API "마이클래스 - 나의 강의 > 강의 다운로드"
            ㄴ 대상 : 아쿠아 매니저
            ㄴ 요구 : 레거시 Custom URL 호출

        4. (p.198) 화면 "나의 강의 - 상세 > 강의 목록 > 항목" (범준 파트장님)
            ㄴ 관련 API "마이클래스 - 나의 강의 > 강의 재생 요청"
            ㄴ 대상 : 아쿠아 매니저
            ㄴ 요구 : 레거시 Custom URL 호출

        5. (p.111) 화면 "교재/MP3 - 무료 MP3 > 상세 > 전체 다운로드" (성남 파트장님)
            ㄴ 관련 API "교재/MP3 > 교재 상세 - 무료 MP3 상세"
            ㄴ 대상 : 해커스 MP3 플레이어
            ㄴ 요구 : 해당 앱 설치 여부 확인(배너), 레거시 Custom URL 호출
        */

        /** 관련 요구사항 종합 **/

        /*
        (보류) 1-1. 해당 앱 설치 여부 확인(번들 ID 혹은 패키지명)
        (완료) 1-2. 해당 앱 설치 여부 확인(Custom URL Scheme) => 영역 1번(해커스패밀리)을 제외한 나머지 영역에 적합함
        (완료) 1-3. 해당 앱 설치 여부 확인(레거시 intentUrl) => 영역 1번(해커스패밀리)을 제외한 나머지 영역에 적합함(단, intentUrl을 미리 알고 있어야 함)

        (완료) 2-1. 미설치 시, 스토어로 이동(번들 ID, 스토어 ID 혹은 패키지명) => 영역 1번(해커스패밀리)을 제외한 나머지 영역에 적합함

        (보류) 3-1. 외부앱 호출(번들 ID 혹은 패키지명)
        (완료) 3-2. 외부앱 호출(Custom URL Scheme) => 영역 1번(해커스패밀리)을 제외한 나머지 영역에 적합함
        (완료) 3-3. 외부앱 호출(레거시 intentUrl) => 영역 1번(해커스패밀리)에 적합함

        (대기) 4-1. 복합
        */

        /** 1-1. 해당 앱 설치 여부 확인(번들 ID 혹은 패키지명)
            * 특이 사항
                : iOS에서 번들 ID로 앱 설치 여부 확인 불가
         **/

        /*
        let playStoreId = '';
        if(Platform.OS === 'android') {
            playStoreId = 'com.cdn.aquanmanager';
            SendIntentAndroid.isAppInstalled(playStoreId)
                .then(function(isInstalled){
                    if(isInstalled) {
                        alert('INSTALLED')
                    } else {
                        alert('NOT INSTALLED')
                    }
                }).catch((err) => {
                alert('ERROR');
            });
        } else {
            playStoreId = 'com.cdn.aquanmanager';
        }
        */

        /** 1-2. 해당 앱 설치 여부 확인(Custom URL Scheme)
            * 특이 사항
                 : AppLink.maybeOpenURL()은 유효하지 않은 URL인 경우,
                 자동으로 스토어로 이동하기 때문에 사용할 수 없음
                 : 패키지 react-native-check-app-install 사용 시,
                 iOS는 Info.plist > LSApplicationQueriesSchemes에 스킴을 등록해야 사용 가능
                 => 변경 가능성이 없는 앱(아쿠아 플레이어, MP3 플레이어)에 대해서 한정 사용 가능
         **/

        /*
        //let scheme = 'cdnmp';
        let scheme = 'mmplayer';
        AppInstalledChecker
            .checkURLScheme(scheme)
            .then((isInstalled) => {
                if(isInstalled) {
                    alert('INSTALLED')
                } else {
                    alert('NOT INSTALLED')
                }
            })
        */

        /** 1-3. 해당 앱 설치 여부 확인(레거시 intentUrl)
            * 특이 사항
                : Custom URL Scheme 액션이 이뤄지지 않고 설치 여부만 확인할 수 있어야 함
                : iOS에서 Linking.canOpenURL() 사용 시,
                항목 1-2과 동일하게 스킴을 사전에 등록하지 않으면 사용할 수 없음
         */

        /*
        let intentUrl = ''
        if(Platform.OS === 'android')
            intentUrl = 'intent://mmplayer:type=0&userid=I inyeophwang&useridx=4825753&site_code=champstudy&lmno=1432914144&mpcode=81089&addfile=&ret=http%3A%2F%2Fm.champstudy.com%2F%3Fm%3Dlecture%26mode%3Dmp3list%26lmno%3D1432914144?#Intent;scheme=mmplayer;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.hackers.app.hackersmp3;end';
        else
            intentUrl = 'mmplayer://type=0&userid=I inyeophwang&useridx=4825753&site_code=champstudy&lmno=1432914144&mpcode=81089&addfile=&ret=http%3A%2F%2Fm.champstudy.com%2F%3Fm%3Dlecture%26mode%3Dmp3list%26lmno%3D1432914144';

        Linking.canOpenURL(intentUrl).then(supported => {
            if (!supported) {
                alert('UNSUPPORTED')
            } else {
                alert('SUPPORTED')
            }
        }).catch(err => {
            alert('ERROR')
        })
        */

        /** 2-1. 미설치 시, 스토어로 이동(번들 ID, 스토어 ID 혹은 패키지명)
            * 특이 사항
                :
         */

        /*
        let appStoreId = '1048325731';
        let playStoreId = 'com.cdn.aquanmanager';

        AppLink.openInStore({ appStoreId, playStoreId }).then(() => {
            alert('THEN')
        })
        */


        /** 3-1. 외부앱 호출(번들 ID 혹은 패키지명)
            * 특이 사항
                :
         */


        /** 3-2. 외부앱 호출(Custom URL Scheme)
            * 특이 사항
                : 스킴을 사전에 등록하지 않아도 사용이 가능함
                : 단, 스킴이 무결하다고 가정하고 catch에는 앱이 설치되어 있지 않다고 간주하여 처리해야 함
         */

        /*
        const scheme = 'mmplayer://';
        Linking.openURL(scheme).catch(err => {
            alert('ERROR')
        });
        */

        /** 3-3. 외부앱 호출(레거시 intentUrl)
            * 특이 사항
                : 항목 3-2과 동일한 방식으로 사용 가능함
         */

        /*
        let intentUrl = ''
        if(Platform.OS === 'android')
            intentUrl = 'intent://mmplayer:type=0&userid=I inyeophwang&useridx=4825753&site_code=champstudy&lmno=1432914144&mpcode=81089&addfile=&ret=http%3A%2F%2Fm.champstudy.com%2F%3Fm%3Dlecture%26mode%3Dmp3list%26lmno%3D1432914144?#Intent;scheme=mmplayer;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.hackers.app.hackersmp3;end';
        else
            intentUrl = 'mmplayer://type=0&userid=I inyeophwang&useridx=4825753&site_code=champstudy&lmno=1432914144&mpcode=81089&addfile=&ret=http%3A%2F%2Fm.champstudy.com%2F%3Fm%3Dlecture%26mode%3Dmp3list%26lmno%3D1432914144';
        Linking.openURL(intentUrl).catch(err => {
            alert('ERROR')
        });
        */








        /*
        // 아쿠아플레이어(iOS)
        let appName = '아쿠아 플레이어';
        let appStoreId = '1048325731';
        let appStoreLocale = 'KO';
        let playStoreId = 'com.cdn.aquanmanager';
        let intent_url = 'cdnmp://cddr_dnp/webstream?param=KCPFanwZ2gN155LPm/xd9aLOm7qnCAT5Wid+14VHDwegBMmHvgTPDpKogBVTbtIIWsbMLkQ1oY6FdTt+zyEMETc9Wd6Bg/J7W7C7EtObMfofwRKPBhAYkyPr9UanmqA7zJfzVsWS1IBADuZzI6EfmjaKwVUgSOkpSvRVWTOyzAGeQZc+gw/gMIvhdjdIBTuY1viI6lg8hLCBPGsZ6FkrXazioGlHjmoyHJL3ftgHf5TrXBxWy+xtxkHl8aHiScdrNwPzw2aq15xghF513QFDwwdorXO+Su7gvNNXPsd1zLtVMoZPcBE5mpG3T8eie/NxzzZ7hwWSxZzlDT6KJt59Ev/1rOwMu6etBAC839wkbBv07XGmwQ3mFmNx+eDhjceBYl6zYDkt6ykN7P7RNVWZmVjH5sOPIjydeJ1q58I7sRx3up3rafBINXj73S0dW+ibHlyGhgWPcXKSPjY5tseJ8v5ZIZeye73jLh1RD2T5/95K8jvq8EEtr1ZyeA2jy6juTjaWrIGHY1leuFsWrTwwCSwqlsrtF88wsCpJAO7pLNl2sL61HDq+b/uyTVf0QQxSAMaoRp7HkVr1V065mOG1MKJJ6jFqGzxBhtl1UDwQcGZqFrbGUJBaTkvbU/l1G0/Ciimm2BjRxj8H7cr6zVUNPSLuiimJ7hUzCqox8sicyegcDc/LMeu6d3Y959HWDinl2ahfxsN0JQX4yWdJvCGYDwUtNKh0RjBe7aBxbb9x7jvQ5S/FIqwefiS09OhmnSkXOeG7HDXTV7y4TeloPI4T7U2F/wttfspVx0Q1mWANAhxe2cP43dufm9UFfGbemIeS56SdjR7A0Yn5MuZxK/66WuS/N5Vjv0PJVRiFHK78IDgEfV95ffOfjMCxEMU1FiveiApyLgHrjUBsAludgmJPACiEbSCafttCMNduzKyW1Iia1QkwFjzotYNcFq/UP1K2RpqQYwZs9F0s3+6LMEvYFO3S8fVoY2MfRiLBON8RyIeSkX/zdMoc/RjdIM3erNX0e9m6bPWFcXWWD3a1o22neqT/okYq+LnmxxOx28LQDDL97zW+5zZdaPzYYuopEU20gkQlC94A4dyLRkft/hioNnOuMftJ46iM/LHvJSuc3ygMUoX1Vf9vB0bND4BkgWBYekJKVlza1pAfaVk3wh97g6NypateAtC6OOfBz/KyOq09qslNYx/YKLhAKHDI/voRGWR2uwSZZk346KDmL9NzsgP/KjojfB4wZtOcZ3/j1NJwT3jAVTtW42NfsBcI8KWIMA=='

        // 해커스 MP3 플레이어(Android)
        let appName = '해커스 MP3 플레이어';
        let appStoreId = '531669642';
        let appStoreLocale = 'KO';
        let playStoreId = 'com.hackers.app.hackersmp3';
        let intent_url = 'intent://mmplayer:type=0&userid=I inyeophwang&useridx=4825753&site_code=champstudy&lmno=1432914144&mpcode=81089&addfile=&ret=http%3A%2F%2Fm.champstudy.com%2F%3Fm%3Dlecture%26mode%3Dmp3list%26lmno%3D1432914144?#Intent;scheme=mmplayer;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.hackers.app.hackersmp3;end'

        // 해커스 MP3 플레이어(iOS)
        let appName = '해커스 MP3 플레이어';
        let appStoreId = '531669642';
        let appStoreLocale = 'KO';
        let playStoreId = 'kr.co.hackers.HackersPlayer';
        let intent_url = 'mmplayer://type=0&userid=I inyeophwang&useridx=4825753&site_code=champstudy&lmno=1432914144&mpcode=81089&addfile=&ret=http%3A%2F%2Fm.champstudy.com%2F%3Fm%3Dlecture%26mode%3Dmp3list%26lmno%3D1432914144'
        */
    }


    tmpControllerApps = (store) => {

        /*
        Android와 ios 모두 설정되어 있지 않은 경우에는 애초에 반환되지 않음
        {
            "appName": "해커스토익",
            "desc": "TOEIC 토익무료인강 토익단어 시험일정",
            "icon": "http://img.hackers.com/user/uploads/appLinkImage/1590214616231다운로드.png",
            "show": [
                "Android",
                "IOS"
            ],
            "store": [
                {
                    "oSName": "IOS",
                    "storeName": "AppStore",
                    "packageName": "kr.co.hackers.HackersToeic", // 추가 예정
                    "url": "https://apps.apple.com/kr/app/%ED%95%B4%EC%BB%A4%EC%8A%A4%ED%86%A0%EC%9D%B5-toeic/id430260350"
                },
                {
                    "oSName": "Android",
                    "storeName": "GooglePlay",
                    "packageName": "com.hackers.app", // 추가 예정
                    "url": "https://play.google.com/store/apps/details?id=com.hackers.app&hl=ko"
                }
            ]
        }
        */

        // TODO 앱 실행 프로세스 작성
        // - 패키지명 기준, 앱 설치 유무 확인

        /**
         ① 앱이 설치되어 있는 경우
         -tap > 해당 앱 실행
         **/

        //const appStoreId = 'kr.co.hackers.HackersPlayer';
        //const appName = '해커스 MP3 플레이어';
        //const appStoreLocale = 'ko';
        //const playStoreId = 'com.hackers.app.hackersmp3';

        /********** Android **********/

        //기존 방식
        //const intentUrl = 'intent://mmplayer:type=0&userid=I inyeophwang&useridx=4825753&site_code=champstudy&lmno=1432914144&mpcode=81089&addfile=&ret=http%3A%2F%2Fm.champstudy.com%2F%3Fm%3Dlecture%26mode%3Dmp3list%26lmno%3D1432914144?#Intent;scheme=mmplayer;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.hackers.app.hackersmp3;end';

        // 컨텐츠 제거, 앱 실행은 가능하나 스플래시 화면에서 반응 없음
        //const intentUrl = 'intent://mmplayer#Intent;scheme=mmplayer;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.hackers.app.hackersmp3;end';

        // 최소 실행 기준, 1차, 정상
        //const intentUrl = 'intent://mmplayer:type=0#Intent;scheme=mmplayer;action=android.intent.action.VIEW;package=com.hackers.app.hackersmp3;end';

        // 최소 실행 기준, 2차, 정상
        //const intentUrl = 'intent://mmplayer:type=0';

        // 최소 실행 기준, 3차, 정상
        //const intentUrl = 'intent://mmplayer';

        // 최소 실행 기준, 4차, 정상(ios와 동일), 유력
        //const intentUrl = 'mmplayer://';

        // 최소 실행 기준, 5차, 인식 불가(ios와 동일)
        //const intentUrl = 'mmplayer:';

        /********** ios **********/

        // 기존 방식
        //const intentUrl = 'mmplayer://type=0&userid=I inyeophwang&useridx=4825753&site_code=champstudy&lmno=1432914144&mpcode=81089&addfile=&ret=http%3A%2F%2Fm.champstudy.com%2F%3Fm%3Dlecture%26mode%3Dmp3list%26lmno%3D1432914144';

        // 최소 실행 기준, 1차, 정상
        //const intentUrl = 'mmplayer://type=0';

        // 최소 실행 기준, 2차, 정상, 유력
        const intentUrl = 'mmplayer://';

        // 최소 실행 기준, 3차, 정상
        //const intentUrl = 'mmplayer:';

        // 최소 실행 기준, 4차, 인식 불가
        //const intentUrl = 'mmplayer';


        if(Platform.OS === 'android') {
            console.log('controllerApps()', 'ANDROID')

            // 1안, 기존 방식, 테스트 완료, 패키지 정보도 필요함
            /*
            SendIntentAndroid.isAppInstalled(playStoreId)
                .then(function(isInstalled){
                    if(!isInstalled){
                        //AppLink.openInStore({ appName, appStoreId, appStoreLocale, playStoreId }).then(() => {})
                        alert('안드로이드 설치되어 있지 않음')
                        return;
                    } else {
                        alert('안드로이드 설치되어 있음')
                        //SendIntentAndroid.openChromeIntent(intentUrl);
                        return;
                    }
                }).catch((err) => {
                    console.log('controllerApps()', 'ANDROID = ' + JSON.stringify(err))
                    //alert('err occurred on android');
            });
            */

            // 2안, 아이폰과 동일한 기본 방식
            Linking.openURL(intentUrl).catch(err => {
                console.log('controllerApps()', 'err = ' + JSON.stringify(err))
                // 현재 기준으로 intertUrl은 무결하다고 가정하고
                // catch 경우를 앱이 설치 않은 것으로 간주하여 처리 가능합니다.
                alert('URL을 실행할 수 있는 설치된 앱 확인 불가')
                if (err.code === 'EUNSPECIFIED') {

                } else {
                    throw new Error(`Could not open ${appName}. ${err.toString()}`);
                }
            });

            // 3안, 디바이스 통합, 아이폰에서 동작하지 않음
            /*
            Linking.canOpenURL(intentUrl).then(supported => {
                if (!supported) {
                    alert('안드로이드 지원하지 않는 URL')
                } else {
                    return Linking.openURL(intentUrl);
                }
            }).catch(err => {
                console.log('controllerApps()', 'err = ' + JSON.stringify(err))
                alert('안드로이드 예상치 못한 오류')
            })
            */
        } else {
            console.log('controllerApps()', 'IOS')

            // 1안, 앱이 설치되지 않은 경우 자동으로 App Store으로 이동하지만 해당 앱이 노출되지 않음
            /*
            AppLink.maybeOpenURL(intentUrl, { appName, appStoreId, appStoreLocale, playStoreId }).then(() => {
                alert('아이폰 설치되어 있음')
            }).catch((err) => {
                //alert('err occurred on ios');
                //console.log('controllerApps()', 'IOS = ' + JSON.stringify(err))
                alert('아이폰 오류 ' + JSON.stringify(err))
            });
            */

            // 2안, 아이폰 테스트 완료
            Linking.openURL(intentUrl).catch(err => {
                console.log('controllerApps()', 'err = ' + JSON.stringify(err))
                // 현재 기준으로 intertUrl은 무결하다고 가정하고
                // catch 경우를 앱이 설치 않은 것으로 간주하여 처리 가능합니다.
                alert('URL을 실행할 수 있는 설치된 앱 확인 불가')
                if (err.code === 'EUNSPECIFIED') {

                } else {
                    throw new Error(`Could not open ${appName}. ${err.toString()}`);
                }
            });

            // 3안, 디바이스 통합, 아이폰에서 동작하지 않음
            /*
                https://reactnative.dev/docs/linking.html
                As of iOS 9, your app needs to provide the LSApplicationQueriesSchemes key inside Info.plist or canOpenURL will always return false.
                This canOpenURL method has limitations on iOS 9+. From the official Apple documentation:
             */
            /*
            Linking.canOpenURL(intentUrl).then(supported => {
                if (!supported) {
                    alert('아이폰 지원하지 않는 URL')
                } else {
                    return Linking.openURL(intentUrl);
                }
            }).catch(err => {
                console.log('controllerApps()', 'err = ' + JSON.stringify(err))
                alert('아이폰 예상치 못한 오류')
            })
            */
        }

        /**
        ② 앱이 설치되어 있지 않는 경우
        Tap > 외부 브라우저를 통해 각 스토어 다운로드 주소로 랜딩
        └ android : google/ one store 모두 등록되어 있는 경우 “스토어 선택 action sheet “ 출력
        (본 기획서 - 해커스패밀리- 스토어 선택 action sheet 참고)
        **/

        /*
        if(store.length == 1) {
            Linking.openURL(store[0].url)
        } else {
            this.setState({
                pickerItems: store
            }, function() {
                this.togglePicker()
            })
        }
        */
    }

    renderPicker() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.showModal}
                onRequestClose={() => {
                    this.setState({showModal:false})
                }}
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
                                onLayout={(event) => this.onLayoutScrollView(event)}
                                indicatorStyle='black'>
                                {
                                    this.state.pickerItems.map((item, index) => {
                                        return (
                                            <View style={styles.modalItem} key={index}>
                                                <TouchableOpacity
                                                    style={styles.modalItemWrapper}
                                                    onPress={() => this.selectFilter(item)}>
                                                    <View style={styles.modalItemIconSelectedWrapperLeft}>
                                                    </View>

                                                    {
                                                        //this.state.selectedFilterIndex == item.index
                                                        false
                                                            ?
                                                            <CustomTextB style={styles.modalItemTextSelected}>
                                                                {item.title}
                                                            </CustomTextB>
                                                            :
                                                            <CustomTextR style={styles.modalItemText}>
                                                                {item.storeName}
                                                            </CustomTextR>
                                                    }
                                                    <View style={styles.modalItemIconSelectedWrapperRight}>
                                                        {/*
                                                            this.state.selectedFilterIndex == item.index
                                                            &&
                                                            <Image
                                                                style={styles.modalItemIconSelected}
                                                                source={require('../../../assets/icons/btn_check_list.png')}/>
                                                        */}
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })
                                }
                                <LinearGradient
                                    pointerEvents={'none'}
                                    colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0.95)", "rgba(255,255,255,1.00)"]}
                                    //colors={["rgba(255,255,255,0)", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.9)"]}
                                    locations={[0, 0.70, 1]}
                                    style={{position: "absolute", height: this.state.heightScrollView, width: "100%", }}/>
                            </ScrollView>
                            <View style={styles.cancelButton}>
                                <TouchableOpacity
                                    style={styles.cancelButtonWrapper}
                                    onPress={() => this.togglePicker()}>
                                    <CustomTextR styles={styles.cancelButtonText}>취소</CustomTextR>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        )
    }

    render() {
        if ( false ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        }else {
            return(
                <View style={ styles.container }>
                    { 
                        this.state.itemList.length === 0 ?

                            <View style={[styles.itemWrap,{flex:1, alignItems: 'center', justifyContent: 'center', height: '100%'}]}>
                                <Text
                                    style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14)}}
                                >검색 결과가 없습니다.
                                </Text>
                            </View>
                        
                        :
                        this.state.itemList.map((titem, index) => {
                            return(                           
                                <View
                                    key={index}
                                    style={{
                                        flexDirection:'row',
                                        marginHorizontal:20,
                                        borderBottomWidth:1,
                                        borderBottomColor:'#ccc',
                                        paddingVertical:15
                                    }}
                                    >
                                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                        <Image
                                            style={{
                                                width:PixelRatio.roundToNearestPixel(50),
                                                height:PixelRatio.roundToNearestPixel(50),
                                                borderRadius:10,
                                                borderColor:'#e8e8e8',
                                                borderWidth:1,
                                            }}
                                            source={{uri: titem.icon}}
                                            />
                                    </View>
                                    <View style={{
                                        flex:5,
                                        marginHorizontal:15,
                                        justifyContent: 'center',
                                    }}>
                                        <CustomTextM
                                            numberOfLines={1} ellipsizeMode = 'tail'
                                            style={{
                                                color:DEFAULT_COLOR.base_color_222,
                                                fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),
                                                lineHeight: PixelRatio.roundToNearestPixel(20.1),
                                                letterSpacing: -0.79,
                                                paddingBottom: 5,
                                            }}
                                        >{titem.appName}
                                        </CustomTextM>
                                        <CustomTextR
                                            style={{
                                                color:DEFAULT_COLOR.base_color_888,
                                                fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),
                                                letterSpacing: 0,
                                            }}
                                        >{titem.desc}</CustomTextR>
                                    </View>
                                    <TouchableOpacity
                                        style={{
                                            flex:1,
                                            justifyContent:'center',
                                            alignItems:'center'
                                        }}
                                        onPress={() => this.controllerApps(titem.store) /* this.testControllerApps(titem.store) */}
                                        >
                                        <Image
                                            source={require('../../../assets/icons/btn_appdown_link.png')}
                                            style={{
                                                width:PixelRatio.roundToNearestPixel(50),
                                                height:PixelRatio.roundToNearestPixel(50)
                                            }} />
                                    </TouchableOpacity>
                                                                        
                                </View>
                            )
                        })
                    }
                    { this.renderPicker() }
                </View>
            );
        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        //height: 300,
        marginTop: 15,
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    /** Picker Start **/
    modalContainer: {
        backgroundColor: 'transparent',
        height: '100%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    modalBackgrounder: {
        flex: 7,
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
        height: 45,
        //alignItems: 'center',
        justifyContent: 'center',
    },
    modalItemWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalItemText: {
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
        width: 40,
        alignItems: 'center',
    },
    modalItemIconSelectedWrapperRight: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: 17,
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
    /** Picker End **/
});