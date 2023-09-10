import { NativeModules } from 'react-native';
import PushNotification from 'react-native-push-notification';
let PushNotificationIOS = NativeModules.RNCPushNotificationIOS;
import {NavigationActions} from 'react-navigation';
class NotificationHandler {

    constructor() {
        this.props = null;        
    }
    
    onNotification(notification) {
        //console.log("NOTIFICATION pros:", this.props);       
        
        if (typeof this._onNotification === 'function') {
          this._onNotification(notification);
        }
        if ( typeof  notification.userInfo.routeName !== 'undefined') {
            //console.log('NotificationHandler: 2222', notification.userInfo);
            const navigateAction = NavigationActions.navigate({
                routeName: notification.userInfo.routeName,
                params: { 
                    rountIdx : typeof notification.userInfo.routeName !== 'undefined' ? notification.userInfo.rountIdx : 0
                },
                action: NavigationActions.navigate({ routeName: notification.userInfo.routeName }),
            });
              
            this.props.screenProps.navigation.dispatch(navigateAction);

            
        }
    }

    onRegister(token) {
        //console.log('NotificationHandler:', token);
        if (typeof this._onRegister === 'function') {
            this._onRegister(token);
        }
    }

    attachRegister(handler) {
        this._onRegister = handler;
    }

    attachNotification(handler,props) {
        
        this._onNotification = handler;
        this.props = props;        
    }
}

const handler = new NotificationHandler();

PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
    onRegister: handler.onRegister.bind(handler),

    // (required) Called when a remote or local notification is opened or received
    onNotification: handler.onNotification.bind(handler),

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
    * (optional) default: true
    * - Specified if permissions (ios) and token (android and ios) will requested or not,
    * - if not, you must call PushNotificationsHandler.requestPermissions() later
    */
    requestPermissions: true,
});

export default handler;