2020.02.11 11:00
    gitlabp setup

2020.02.11 12:00 
    first Commit by Noh seongnam

2020.02.11 14:00
    push setup ( ios, android 완료 )

2020.02.17 10:46
    참고사항 : 추천강의등 top tabs적용시 swipe false처리 ( android에서 문제됨 ) 만약 swipe기능이 추가되려면 새로 작업을 하는게나아보임


Nohseongnam Work 
1.  base app ( 2020.02.11 )
2.  base navigation ( 2020.02.12 )
3.  base main frame ( 2020.02.12 )
4.  image number slide ( 2020.02.13 )
5.  text ticker sample ( 2020.02.17 )
6.  sample video format ( 2020.02.18 )
7.  앱소개 표시 최초 1회 적용 -> storage 사용 ( 2020. 02.18 )
8.  관심분야 설정 최초 1회 적용 -> storage 사용 ( 2020. 02.18 )
9.  다음우편번호 조회용 작업 -> Webview이용 ( 2020.02.18 )
10. 권한퍼미션 설정 부분  ( 2020.02.18 )


2020.05.11
관심분야 적용
1. 최초 /InterestSelect.js 설정   : 현재는 우선 렌더링 할때마다 API호출 , 현재 App.js와 CommonHeader.js에서 사용중
    ( 사용시 필수 props 
       interestMode,   // new,mod,once,null   
       attentionSelectCode,
       attentionSelectName,
       attentionSelectRGB,
       setMyInterest ( 함수 )
   )
   - interestMode 는 아래처럼 once를 제외한 나머지 호출시  //once는 해커스에 바란다의 경우처럼 사용
   - this.props._updateMyInterestOneCode( myInterestCode[0]);  
     1) redux  앱에서 나의 관심분야 정보를 사용
        포맷 {code : null, name: null ,info: [],color: null}
    AsyncStorage.setItem('myGnbMenu',[...]);  //GNB저장 stroage , 추후 아래 2번에서 상세체크후 업데이트로 변경하면 사용안함

2. 2회이후 (체크API ) 내관심코드가 사용유무에 따라 ( api /meta/{MyInterestCode} )
   if true -> gnb update AsyncStorage.setItem('myGnbMenu', [...])
   else false -> 
   위의 1코드 오픈 / 알림표시(이전 관심분야가 사용중지/일시정지등에 표시 )


3. GNB 적용 ./src/Route/MainTopTabs.js
  우선 순위 (최초, 갱신등) this.props.myInterestCode.gnbList { Android, iOS }
  차순위 ( 스토로지 저장시 ) AsyncStorage.getItem('myGnbMenu')

/* if error package android.support.annotation does not exist

// build.gradle 
implementation "androidx.annotation:annotation:1.1.0"

// where use it
import androidx.annotation.Nullable;


// Create Base64 Object
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

// Define the string
var string = 'Hello World!';

// Encode the String
var encodedString = Base64.encode(string);
console.log(encodedString); // Outputs: "SGVsbG8gV29ybGQh"

// Decode the String
var decodedString = Base64.decode(encodedString);
console.log(decodedString); // Outputs: "Hello World!"