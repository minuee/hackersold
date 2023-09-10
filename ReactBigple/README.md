# reactBigple
React Native 샘플 프로젝트
완료목표일 ( 1월 말)

# 2019년 12월 18일
writed by nohseongnam

- 기본설정
1. bundle ID
    (ios) kr.co.hackers.reactbiple //이런 c가 빠졌네요;;;;
    (android) com.reactbigple

2. displayName: "React Bigple v1.0"

3. File Naming 
    - 일반스크린 : OOOOOScreen.js
    - Modal : OOOOModal.js
    - Style Sheet : OOOOStyle.js
    - Etc : 특수( ex : route, store, reducer등)

4. 색상
    - 기본배경 : #ffffff
    - 기본폰트색깔 : #555555
    - 기본폰트크기 : 13(pixel)
    - Header background : #173f82

5. Directory Structure
    /Assets/images
           /files
           /fonts
           /icons
    /src/Components  //자주 사용되거나 커스터마이징한 컴포넌트들
        /Ducks       //Redux집합
              /Actions
              /Reducers
        /Navigation  
        /Screen
               /Auth
               /Home
               /Modal
        /Styles     //CSS
        /Utils      //잡다        

7. 핵심모듈 
    react version : 16.9.0
    react-nativer version : 0.61.5

8. (기본 추가) UI KIT : react-native-elements@^1.2.7

9. 기본모듈
    1) "react-native-exit-app": "^1.1.0",
    2) "react-native-gesture-handler": "^1.5.2",
    3) "react-native-reanimated": "^1.4.0",
    4) "react-native-svg": "^9.13.6",
    5) "react-native-vector-icons": "^6.6.0",
    6) "react-native-webview": "^7.5.2",
    7) "react-navigation": "^4.0.10",
    8) "react-navigation-drawer": "^2.3.3",
    9) "react-navigation-stack": "^1.10.3",
   10) "react-navigation-tabs": "^2.6.2",
   11) "react-redux": "^7.1.3",
   12) "redux": "^4.0.4",
   13) "redux-thunk": "^2.3.0"
   14) "@react-native-community/async-storage": "^1.7.1"

   //추가모듈 2019.12.31 by.nohsn
   15) react-native-gifted-form  // 로그인폼을 위한 모듈
   16) react-native-modal-datetime-picker // android datatime picker , ios자는 내장모듈 사용
   17) react-native-tiny-toast // android & ios 겸용 토스트 표시기
   18) react-native-device-info  //디바이스 정보, ip address등
   19) react-native-sound  //mp3등 audio
   20) react-native-sound-player

   //추가모듈 2020.01.02 by.nohsn
   21) @valdio/react-native-scrollable-tabview  // 슬라이드탭 
   22) native-base //UI-Kit
   23) react-native-svg-charts
   24) react-native-super-grid
   
   //추가모듈 2020.01.07 by.hwangiy
   25) react-native-chart-kit

   //추가모듈 2020.01.07 by.nohsn
   26) react-native-sound-player
   
   //추가모듈 2020.01.08 by.nohsn
   27) rn-bottom-drawer
   
   //추가모듈 2020.01.09 by.hwangiy
   28) react-native-table-component
   
   //추가모듈 2020.01.10 by.hwangiy  
   ~~29) react-native-charts-wrapper~~ // SWIFT 버전 4 미지원에 따른 삭제 처리

   //추가모듈 2020.01.17 by.nohsn
   29) moment  //날짜핸들링을 위함

    //추가모듈 2020.01.20 by.nohsn
   30) react-native-network-info@4.7.0
       // 이건 ios이 안됨;;;;-> ./ios/build 다 날리고 초기화하고 재인스톨해라 된장!!!!!!!!
   
   //추가모듈 2020.01.21 by.hwangiy
   30) react-native-video //영상 재생을 위함
   

10. link 사항
    1) react-native-vector-icons

11. redux
    propTypes = {
        selectBook: PropTypes.object,
        remainTime: PropTypes.number,   
    };

    seletcBookTheme 
        - free : 무료테스트
        - concentration : 집중학습

99. 참고사항
    1)  문제지유형
        a) 타이머 유무 ( QuestionScreen : 유, 나머지 RCTestScreen, LCTestScreen)
        b) RC OR LC
        c) 답이 객관식(3,4,5지선달 특정없음 ), 주관식
        d) 지문이 텍스트냐 이미지
        e) mp3유무 ( LC : 유 , RC : 무 )
        f) 전체시험, 교재별, 강좌별 테스트 => 현재 테스트중에는 index 1,2,3

        결론은 현재 두가지의 타입으로 컴포넌트 구성중
