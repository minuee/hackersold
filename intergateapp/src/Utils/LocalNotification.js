import { AppState, NativeModules,Platform } from 'react-native';
import {NavigationActions} from 'react-navigation';
import PushNotification from 'react-native-push-notification';
let PushNotificationIOS = NativeModules.RNCPushNotificationIOS;


const _handleAppStateChange = nextAppState => {
  if (nextAppState === 'active') {
    _registerLocalNotification();
  }
};

const _registerLocalNotification = () => {
  PushNotification.setApplicationIconBadgeNumber(0);
  PushNotification.cancelAllLocalNotifications();

  const messages = [
    '잠깐 시간내서 일본어 공부를 해보는건 어떨까요?',
    '오늘 일본어 공부하셨나요?',
    '일본어 단어를 공부해 보세요.',
    '단어 공부는 매일매일 하는 것이 중요해요.',
    '새로운 단어와 암기한 공부를 복습해 보세요.',
    '일본어를 공부할 시간이에요.',
    '테스트 기능을 사용해서 자신의 실력을 확인해 보세요.',
    '일본어 단어들이 당신을 기다리고 있어요.',
    '일본어, 어렵지 않아요. 공부해 봅시다.',
    '일본어 마스터가 되기위해!',
  ];
  const message = messages[Math.floor(Math.random() * messages.length)];

  let nextHour = new Date();
  nextHour.setDate(nextHour.getDate() + 1);
  nextHour.setHours(nextHour.getHours() - 1);


  PushNotification.localNotificationSchedule({
    /* Android Only Properties */
    vibrate: true,
    vibration: 300,
    priority: 'hight',
    visibility: 'public',
    importance: 'hight',

    /* iOS and Android properties */
    message, // (required)
    playSound: false,
    number: 1,
    actions: '["OK"]',

    // for production
    repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
    date: nextHour,

    // test to trigger each miniute
    // repeatType: 'minute',
    // date: new Date(Date.now()),

    // test to trigger one time
    // date: new Date(Date.now() + 20 * 1000),
  });
};
export default {
  register: async () => {
    PushNotification.configure({
      onNotification: function(notification) {
        console.log("NOTIFICATION:", notification);
        if ( Platform.OS === 'ios' ) {
          notification.finish(PushNotificationIOS.FetchResult.NoData) 
        }
        if ( typeof notification.screenName !== 'undefined' ) {
          if ( notification.screenName !== null ) {
            //console.log('notification.screenName', notification.screenName);
            //NavigationActions.navigate(notification.screenName);
            //NavigationService.navigate(notification.screenName);
          }
        }

      },
      popInitialNotification: true,
      onRegister: function (token) {
        //console.log("TOKEN:", token);
      },
    });
    console.log('PushNotification register', Platform.OS)
    _registerLocalNotification();

    AppState.addEventListener('change', _handleAppStateChange);
  },
  unregister: () => {
    console.log('PushNotification unregister', Platform.OS)
    AppState.removeEventListener('change', _handleAppStateChange);
  },
};

/*
NOTIFICATION: {"action": "OK", "actions": "[\"OK\"]", "android.intent.extra.ALARM_COUNT": 1, "finish": [Function finish], "fireDate": 1591170330526, "foreground": false, "id": "2109574640", "importance": "hight", "message": "일본어 단어를 공부해 보세요.", "notificationId": 2109574640, "number": "1", "playSound": false, "priority": "hight", "repeatType": "minute", "userInteraction": true, "vibrate": true, "vibration": 300, "visibility": "public"}
*/