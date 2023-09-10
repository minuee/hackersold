import React from 'react';
import { StyleSheet, View, Text, Image,BackHandler,ToastAndroid,RefreshControl,Platform,Alert,StatusBar  } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import RNExitApp from 'react-native-exit-app';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import  AppHomeStack from './src/Screens/HomeScreen';
import  AppLoginStack from './AppNavigator';

import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import initStore from './src/Thunk/store';
const store = initStore();
//import { store } from './src/Saga/store';


const prefix = 'hackers://';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showRealApp: false,
            exitApp : false,
            LoginToken: null,
            currentScreenIndex : 1
        };
    }
    _onDone = () => {
       this.setState({ showRealApp: true });
    };
    _onSkip = () => {
        this.setState({ showRealApp: true });
    };
    _renderItem = ({ item }) => {
        return (
            <View
            style={{
                flex: 1,
                backgroundColor: item.backgroundColor,
                alignItems: 'center',
                justifyContent: 'space-around',
                paddingBottom: 100
            }}>
            <Text style={styles.title}>{item.title}</Text>
            <Image style={styles.image} source={item.image} />
            <Text style={styles.text}>{item.text}</Text>
            </View>
        );
    };


    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);        
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);        
        this.notificationListener();
        this.notificationOpenedListener();
        this.messageListener();
    }

    toggleDrawer = () => {
        this.props.navigation.dispatch(DrawerActions.toggleDrawer())
    }

    messageListener = async () => {
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body } = notification;
            this.showAlert(title, body);
        });
    
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        });
    
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        }
    
        this.messageListener = firebase.messaging().onMessage((message) => {
            console.log("ffffff",JSON.stringify(message));
        });
    }
    
    showAlert = (title, message) => {
        Alert.alert(
            title,
            message,
            [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
        );
    }

    componentDidMount() {        
      AsyncStorage.getItem('userToken')
          .then((token) => {
          this.setState({ LoginToken : token });
      })
      .catch(error => {
          this.setState({ LoginToken :  null });
      })
      //console.log('this.state.LoginToken',this.state.LoginToken);
        this._checkPermission();
        this._listenForNotifications();
    }
    
    _checkPermission(){
        const enabled = firebase.messaging().hasPermission();
        if (enabled) {
            // user has permissions
            console.log('enabled2',enabled);
            this._updateTokenToServer();
        } else {
            // user doesn't have permission
            this._requestPermission();
        }
    }
    
    async _requestPermission(){
        console.log('_requestPermission');
        try {
            // User has authorised
            await firebase.messaging().requestPermission();
            await this._updateTokenToServer();
        } catch (error) {
            // User has rejected permissions
            alert("you can't handle push notification");
        }
    }
    
    async _updateTokenToServer(){
        const fcmToken = await firebase.messaging().getToken();
    
        console.log('token2',fcmToken);
        const header = {
            method: "POST",
            headers: {
                'Accept':  'application/json',
                'Content-Type': 'application/json',
                'Cache': 'no-cache'
            },
            body: JSON.stringify({
                user_id: "CURRENT_USER_ID",
                firebase_token: fcmToken
            }),
            credentials: 'include',
        };
        //const url = "http://YOUR_SERVER_URL";
    
        // if you want to notification using server,
        // do registry current user token
    
        // await fetch(url, header);
    }
    
    async _listenForNotifications(){
        // onNotificationDisplayed - ios only
        

        this.notificationListener = firebase.notifications().onNotification((notification) => {
            console.log('onNotification', notification);
            const { title, body } = notification;
            this.showAlert(title, body);
        });

        if ( Platform.OS == 'ios') {
            notificationDisplayedListener = firebase.notifications().onNotificationDisplayed(notification =>  {
                console.log('ios Recieved notification 1');
            });            
        }else{
            this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
                console.log('android onNotificationOpened', notificationOpen);
            });
        }
    
        
    
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            console.log('getInitialNotification', notificationOpen);
        }

        
    }

    handleBackButton = () => {

        if (this.state.exitApp == undefined || !this.state.exitApp) {
            ToastAndroid.show('한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);

            this.setState({ exitApp: true });
            this.timeout = setTimeout(
                () => {
                this.setState({ exitApp: false });
        },
            2000    // 2초
        );
        } else {
            clearTimeout(this.timeout);
            this.setState({ exitApp: false });
            RNExitApp.exitApp();  // 앱 종료
        }
        return true;

    };

    

    render() {
        //If false show the Intro Slides
        if (this.state.showRealApp) {
            //Real Application
            return (
                <Provider store={store}>
                    { this.state.LoginToken ?  <AppHomeStack screenProps={this.state} uriPrefix={prefix} /> : <AppLoginStack screenProps={this.state} uriPrefix={prefix} />}
                </Provider>
                
        );
        } else {
            //Intro slides
            return (
                <View style={{ flex: 1 }}>
                    { Platform.OS == 'android' && <StatusBar backgroundColor="#20d2bb" barStyle="light-content" />}
                    <AppIntroSlider
                    slides={slides}
                    renderItem={this._renderItem}
                    onDone={this._onDone}
                    showSkipButton={true}
                    onSkip={this._onSkip}
                    />
                </View>
        );
        }
    }
}
const styles = StyleSheet.create({
    Rootcontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    image: {
        width: 200,
        height: 200,
    },
    text: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        paddingVertical: 30,
    },
    title: {
        fontSize: 25,
        color: 'white',
        textAlign: 'center',
        marginBottom: 16,
    },
});

const slides = [
    {
        key: 's1',
        text: '해커스 모바일 앱',
        title: 'Hackers Mobile App',
        image: {
            uri:
                'https://reactserver.hackers.com/assets/images/react/intro_mobile_recharge.png',
        },
        backgroundColor: '#20d2bb',
    },
    {
        key: 's2',
        title: 'Hackers Trip',
        text: '해커스 여행',
        image: {
            uri:
                'https://reactserver.hackers.com/assets/images/react/intro_flight_ticket_booking.png',
        },
        backgroundColor: '#20d2bb',
    },
    {
        key: 's3',
        title: 'Hackers Discount',
        text: '해커스 할인혜택',
        image: {
            uri: 'https://reactserver.hackers.com/assets/images/react/intro_discount.png',
        },
        backgroundColor: '#20d2bb',
    },
    {
        key: 's4',
        title: 'Hackers Shopping',
        text: ' 해커스 쇼핑',
        image: {
            uri: 'https://reactserver.hackers.com/assets/images/react/intro_best_deals.png',
        },
        backgroundColor: '#20d2bb',
    },
    {
        key: 's5',
        title: 'Hackers Train',
        text: '해커스 기차여행',
        image: {
            uri:
                'https://reactserver.hackers.com/assets/images/react/intro_bus_ticket_booking.png',
        },
        backgroundColor: '#20d2bb',
    },
];
