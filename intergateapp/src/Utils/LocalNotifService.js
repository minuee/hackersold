import PushNotification from 'react-native-push-notification';
import LocalNotificationHandler from './LocalNotificationHandler';

export default class NotifService {

  constructor(onRegister, onNotification,props) {
    this.lastId = 0;    
    this.props = props;
    
    
    LocalNotificationHandler.attachRegister(onRegister);
    LocalNotificationHandler.attachNotification(onNotification,props);

    // Clear badge number at start
    PushNotification.getApplicationIconBadgeNumber(function(number) {
      if(number > 0) {
        PushNotification.setApplicationIconBadgeNumber(0);
      }
    });
  }

  // this.notif.appLocalNotification(soundName,pushTitle,pushMessage,isVibrate,screenName,screenIdx,this.props)
  appLocalNotification(soundName,pushTitle,pushMessage,isVibrate = false,screenName = null ,screenIdx = 0, nofiId = 47474) {     
        //console.log('appLocalNotification',this.props.screenProps) 
        this.lastId++;
        PushNotification.localNotification({
            /* Android Only Properties */
            id: nofiId,//this.lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            ticker: 'My Notification Ticker', // (optional)
            autoCancel: true, // (optional) default: true
            largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
            smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
            //bigText: 'My big text that will be shown when notification is expanded', // (optional) default: "message" prop
            //subText: 'This is a subText', // (optional) default: none
            color: 'red', // (optional) default: system default
            vibrate: isVibrate , // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            tag: 'some_tag', // (optional) add tag to message
            group: 'group', // (optional) add group to message
            ongoing: false, // (optional) set whether this is an "ongoing" notification

            /* iOS only properties */
            //alertAction: 'view', // (optional) default: view
            category: '', // (optional) default: empty string
            userInfo: {
                routeName : screenName ? screenName : null,
                routeIdx : screenIdx ? screenIdx : 0
            }, // (optional) default: {} (using null throws a JSON value '<null>' error)s               
            /* iOS and Android properties */
            title: pushTitle ? pushTitle : 'title Local Notification', // (optional)
            message: pushMessage ? pushMessage : 'message My Notification Message', // (required)
            playSound: !!soundName, // (optional) default: true            
            soundName: soundName ? soundName : 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
            number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
            //actions: '["Yes", "No"]', // (Android only) See the doc for notification actions to know more,            
        });
  }

    applocalNotificationSchedule(soundName,term = 10,pushTitle,pushMessage,isVibrate = false,screenName = null ,screenIdx = 0) {
        this.lastId++;
        PushNotification.localNotificationSchedule({
            date: new Date(Date.now() + term * 1000), // in 30 secs      
            /* Android Only Properties */
            id: this.lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            ticker: 'My Notification Ticker', // (optional)
            autoCancel: true, // (optional) default: true
            largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
            smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
            bigText: 'My big text that will be shown when notification is expanded', // (optional) default: "message" prop
            //subText: 'This is a subText', // (optional) default: none
            color: 'blue', // (optional) default: system default
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            tag: 'some_tag', // (optional) add tag to message
            group: 'group', // (optional) add group to message
            ongoing: false, // (optional) set whether this is an "ongoing" notification

            /* iOS only properties */
            alertAction: 'view', // (optional) default: view
            category: '', // (optional) default: empty string
            userInfo: {
                routeName : screenName ? screenName : null,
                routeIdx : screenIdx ? screenIdx : 0
            }, // (optional) default: {} (using null throws a JSON value '<null>' error)s    

            /* iOS and Android properties */
            title: pushTitle ? pushTitle : 'title Local Notification', // (optional)
            message: pushMessage ? pushMessage : 'message My Notification Message', // (required)
            playSound: !!soundName, // (optional) default: true
            number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
            soundName: soundName ? soundName : 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        });
    }

  checkPermission(cbk) {
    return PushNotification.checkPermissions(cbk);
  }

  requestPermissions() {
    return PushNotification.requestPermissions();
  }

  cancelNotif() {
    PushNotification.cancelLocalNotifications({id: '' + this.lastId});
  }

  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }

  abandonPermissions() {
    PushNotification.abandonPermissions();
  }
}