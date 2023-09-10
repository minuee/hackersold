import {Dimensions, NativeModules,Platform} from 'react-native';
import {remove as removeDiacritics} from 'diacritics'
import Toast from 'react-native-tiny-toast';
import PushNotification from 'react-native-push-notification';
let PushNotificationIOS = NativeModules.RNCPushNotificationIOS;
import 'moment/locale/ko'
import  moment  from  "moment";

import BackgroundTimer from 'react-native-background-timer';
import AsyncStorage from '@react-native-community/async-storage';

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../Utils/CommonUtil';

//LocalPusth
import LocalNotifService from '../Utils/LocalNotifService';

class Funtion {   
  
  
  sendLocalPush = ( routeName, targetNotification ) => {        

    let soundName = null;
    let pushTitle = "해커스통합앱";
    let pushMessage = "푸쉬메시지푸쉬메시지푸쉬메시지";
    let sendTime = 10; //add per second 최소 5초 즉시발송개념, 그외에는 지연발송
    let isVibrate = false ;//
    let screenName = routeName;
    let screenIdx = 0;
    const nofiId = 4747;
    targetNotification.appLocalNotification(soundName,pushTitle,pushMessage,isVibrate,screenName,screenIdx,nofiId);

  } 

  checkMyNewsArrvalsRead = async(props = null ) => {

    const appUUID = await AsyncStorage.getItem('UUID');
    let memberIdx = 0;
    if ( props.userToken !== null) {
      if ( typeof props.userToken.memberIdx !== 'undefined' ) {
        memberIdx = props.userToken.memberIdx;
      }else{
        if ( props.userToken.length > 0 ) {
          JSON.parse(props.userToken).memberIdx;
        }
      }    
    }
    
    let appID = DEFAULT_CONSTANTS.appID;
    let interestCode = typeof props.myInterestCodeOne.code !== 'undefined' ? props.myInterestCodeOne.code : 0;
    await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/push/allread?appID=' + appID +'&UUID=' + appUUID + '&memberIdx=' + memberIdx + '&interestCode=' + interestCode ,{
        method: 'PUT', 
        headers: new Headers({
          Accept: 'application/json',                
          'Content-Type': 'application/x-www-form-urlencoded',
          'apiKey': DEFAULT_CONSTANTS.apiAdminKey
        }), 
          body:null
        },10000
      ).then(response => {         
        console.log('checkMyNewsArrvalsRead',response)   
        if ( response  ) {                    
            if ( response.code === '0000' ) {                    
                props._updateGlobalNewsUnReadCount(0);
            }else{
              //DHFB
            }
        } 
      }).catch(err => {
      });
  }

  checkMyNewsArrvals = async(props = null ) => {
    
    const appUUID = await AsyncStorage.getItem('UUID');
    await props._updateGlobalNewsUnReadCount(0);
    //console.log('appUUID2',appUUID);
    //console.log('checkMyNewsArrvals code',props.myInterestCodeOne.code);
    //console.log('checkMyNewsArrvals memberIdx',props.userToken);

    let returnCode = null;
    let memberIdx = 0;
    if ( props.userToken !== null) {
      if ( typeof props.userToken.memberIdx !== 'undefined' ) {
        memberIdx = props.userToken.memberIdx;
      }else{
        if ( props.userToken.length > 0 ) {
          JSON.parse(props.userToken).memberIdx;
        }
      }    
    }
    
    let appID = DEFAULT_CONSTANTS.appID;
    let interestCode = typeof props.myInterestCodeOne.code !== 'undefined' ? props.myInterestCodeOne.code : 0;
    await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/newarrival?appID=' + appID +'&UUID=' + appUUID + '&memberIdx=' + memberIdx + '&interestCode=' + interestCode ,{
        method: 'GET', 
        headers: new Headers({
          Accept: 'application/json',                
          'Content-Type': 'application/json; charset=UTF-8',
          'apiKey': DEFAULT_CONSTANTS.apiAdminKey
        }), 
            body:null
        },10000
        ).then(response => {    
          //console.log('response.data',response.data);        
            if ( response && typeof response.data !== 'undefined' ) {                    
              if ( response.code === '0000' ) {
                if ( typeof response.data.newArrivalCount !== 'undefined'){
                  if ( response.data.newArrivalCount > 0 ) {
                    props._updateGlobalNewsUnReadCount(parseInt(response.data.newArrivalCount));
                    props._updateGlobalNewsData(response.data.newArrival);
                    returnCode =  response.data.newArrival;
                  }
                }
              }
            }
        })
        .catch(err => {
    });
    return returnCode;
}

  isSetupPush ( bool ) {    
    AsyncStorage.setItem('isUsePush',bool ? 'true' : 'false');
    if (bool === false) {
      BackgroundTimer.stopBackgroundTimer(); 
    }
  }

  isSetupNewsPush ( bool ) {
    //
    AsyncStorage.setItem('isUseNewsPush',bool ? 'true' : 'false');
  }
  
  ifFirstNotification = async(props = null, targetNotification = null) => {
    let returnData = await this.checkMyNewsArrvals(props);
    if ( returnData !== null )  {
      //this.sendLocalPush('FreeBoard',targetNotification)
    }
  }

  setIntervalProess = async( isUse , time = 0 , props = null, targetNotification = null) => {

    if ( isUse ){      
      let returnData = null;//await this.checkMyNewsArrvals(props);
      BackgroundTimer.runBackgroundTimer(() => { 
          let CurrentDateTimeStamp = moment().unix();
          // console.log(' BackgroundTimer 3 : ',Platform.OS , CurrentDateTimeStamp, returnData);          
          if ( returnData !== null )  {
            this.sendLocalPush('FreeBoard',targetNotification)
          }else{
            // console.log(' BackgroundTimer 5 nothing');
          }
        }, 
        time
      );

    }else{
      let CurrentDateTimeStamp = moment().unix();
      console.log(' BackgroundTimer 4 : ', CurrentDateTimeStamp)
      BackgroundTimer.stopBackgroundTimer(); 

    }
  }

  mixedString ( str1, str2 ) {
    let a = str1.split("");
    let b = str2.split("");
    let count = 0;
    let merged_string = "";
    a.length < b.length ? count = a.length: count = b.length;
    
    for( var i=0; i< count; i++){
      merged_string += a[i]+b[i];    
    }

    count < str1.length 
    ? merged_string += str1.substr(count, str1.length)
    : merged_string += str2.substr(count, str2.length)

    return merged_string;
  }

  sendLocalPushNotification ( message, addTime, isVibrate = false, isScreenName = null, isScreenIdx = 0 ) {
    PushNotification.localNotificationSchedule({            
      message: message + Platform.OS, // (required)
      date: new Date(Date.now() + addTime * 1000), // in 10 secs  뒤 // (required)    
      
      /* Android Only Properties */
      vibrate: isVibrate,
      vibration: 300,
      priority: 'hight',
      visibility: 'public',
      importance: 'hight',

      /* iOS and Android properties */        
      playSound: false,
      //number: 1,
      //actions: '["OK"]',        

      //여기서부터는 옵션
      screenName : isScreenName,
      screenIdx : isScreenIdx,
    });
  }

  currencyFormat(num) {
      let num2 = parseInt(num);
      return num2.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }   

  isIphoneX() {
    const dimen = Dimensions.get('window');
    return (
      Platform.OS === 'ios' &&
      !Platform.isPad &&
      !Platform.isTVOS &&
      ((dimen.height === 812 || dimen.width === 812) || (dimen.height === 896 || dimen.width === 896))
    );
  }

  groupBy(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
      var key = obj[property];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
          return acc;
    }, {});
  }

  flatten (array) {
      return array.reduce((flat, toFlatten) => (
        flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten)
      ), [])
  }

  getValuesForKey (key, item) {
      const keys = key.split('.')
      let results = [item]
      keys.forEach(_key => {
        let tmp = []
        results.forEach(result => {
          if (result) {
            if (result instanceof Array) {
              const index = parseInt(_key, 10)
              if (!isNaN(index)) {
                return tmp.push(result[index])
              }
              result.forEach(res => {
                tmp.push(res[_key])
              })
            } else if (result && typeof result.get === 'function') {
              tmp.push(result.get(_key))
            } else {
              tmp.push(result[_key])
            }
          }
        })
        results = tmp
      })
    
      // Support arrays and Immutable lists.
      results = results.map(r => (r && r.push && r.toArray) ? r.toArray() : r)
      results = this.flatten(results)
    
      return results.filter(r => typeof r === 'string' || typeof r === 'number')
  }

  searchStrings (strings, term, {caseSensitive, fuzzy, sortResults, normalize} = {}) {
      strings = strings.map(e => {
        const str = e.toString()
        return normalize && removeDiacritics(str) || str
      })
    
      try {
        if (fuzzy) {
          if (typeof strings.toJS === 'function') {
            strings = strings.toJS()
          }
          const fuse = new Fuse(
            strings.map(s => { return {id: s} }),
            { keys: ['id'], id: 'id', caseSensitive, shouldSort: sortResults }
          )
          return fuse.search(term).length
        }
        return strings.some(value => {
          try {
            if (!caseSensitive) {
              value = value.toLowerCase()
            }
            if (value && value.search(term) !== -1) {
              return true
            }
            return false
          } catch (e) {
            return false
          }
        })
      } catch (e) {
        return false
      }
    }

    createFilter (term, keys, options = {}) {
        return (item) => {
          if (term === '') { return true }
      
          if (!options.caseSensitive) {
            term = term.toLowerCase()
          }
      
          if (options.normalize) {
            term = removeDiacritics(term)
          }
      
          const terms = term.split(' ')
      
          if (!keys) {
            return terms.every(term => searchStrings([item], term, options))
          }
      
          if (typeof keys === 'string') {
            keys = [keys]
          }
      
          return terms.every(term => {
            // allow search in specific fields with the syntax `field:search`
            let currentKeys
            if (term.indexOf(':') !== -1) {
              const searchedField = term.split(':')[0]
              term = term.split(':')[1]
              currentKeys = keys.filter(key => key.toLowerCase().indexOf(searchedField) > -1)
            } else {
              currentKeys = keys
            }
      
            return currentKeys.some(key => {
              const values = this.getValuesForKey(key, item)
              return this.searchStrings(values, term, options)
            })
          })
        }
  }

  strip_tags(input, allowed) {
    allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('')
    const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
    return input.replace(tags, ($0, $1) => (allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''))
  }

  fn_strip_tags ( data ) {
    const regex = /(<([^>]+)>)/ig;
    const result = data.replace(regex, '');

    return 'result';
  }

  fn_division( arr, n ) {        
      
      var len = arr.length;
      var cnt = Math.floor(len / n);
      var tmp = [];

      for (var i = 0; i <= cnt; i++) {
          tmp.push(arr.splice(0, n));
      }
      return tmp;
  }

  addOrReplace(object) {
    var index = arrIndex[object.uid];
    if(index === undefined) {
        index = arr.length;
        arrIndex[object.uid] = index;
    }
    arr[index] = object;
  }


  fn_call_toast(message, timesecond) {
    const atoast = Toast.show(message);
        setTimeout(() => {
            Toast.hide(atoast); 
        }, timesecond)
  }

  replaceAll(strTemp, strValue1, strValue2){ 
    while(1){
        if( strTemp.indexOf(strValue1) != -1 )
            strTemp = strTemp.replace(strValue1, strValue2);
        else
            break;
    }
    return strTemp;
  }

  unicodeToKor(str){
    //유니코드 -> 한글     
    let returndata = unescape(this.replaceAll(str, "\\", "%"));
    return returndata
  }

  korToUnicode(str){
    let returndata =  escape(this.replaceAll(str, "\\", "%"));
    return returndata
  }

  escapeHtml(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
  
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  }

  isForbiddenWord (message, words) {
    let result = message;  
    for (let i = 0; i < words.length; i++) {      
        if ( words[i] !== '*')  {
          if (message.match(words[i])) {
              result = this.replaceAll(result, words[i], "OO");
          }
        }
    }
    return result;
  };

  //start : regist timestamp
  // end : now timestamp
  compareTime(start, end = null , date) {
    //let CurrentDateTimeStamp = moment().unix();
    let end2 = end === null ? moment().unix() : end;
    let msDiff = end2 - start;
    if ( msDiff <  60) {
      return '방금';
    }else if ( msDiff >= 60 && msDiff < 60*60 ) {
      return '1시간전'
    }else if ( date.substr(0,10) === moment().format('YYYY-MM-DD') ) {
      return date.substr(-7,5);
    }else{      
      return date.substr(5,5);
    }
  }

}

const CommonFunction = new Funtion();
export default CommonFunction;