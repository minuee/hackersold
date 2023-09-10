import React from 'react';
import { StyleSheet, View, Text, Image,BackHandler,ToastAndroid,RefreshControl,Platform,Alert,StatusBar  } from 'react-native';
import 'react-native-gesture-handler';

import AppIntroSlider from 'react-native-app-intro-slider';
import RNExitApp from 'react-native-exit-app';
import AsyncStorage from '@react-native-community/async-storage';

import  AppHomeStack from './HomeScreen';

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
            
            <Image                 
                style={styles.image}
                /*
                source={{
                    uri: item.urlimage,
                    method: 'POST',
                    headers: {
                      Pragma: 'no-cache',
                    },
                    body: 'Your Body goes here',
                  }}
                  */
                //source={item.image} 
                
                source={item.assetimage} 
        
            />
            <Text style={styles.text}>{item.text}</Text>
            </View>
        );
    };


    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);        
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);        
    }

    componentDidMount() {        

      AsyncStorage.getItem('userToken')
          .then((token) => {
          this.setState({ LoginToken : token });
      })
      .catch(error => {
          this.setState({ LoginToken :  null });
      })
      
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
            return (
                <AppHomeStack screenProps={this.state} />
                
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
        //width: "200",        
        height: "60%",
        resizeMode:'contain'
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
        assetimage : require('./assets/images/intro_mobile_recharge.png'),
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
        assetimage : require('./assets/images/intro_flight_ticket_booking.png'),
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
        assetimage : require('./assets/images/intro_discount.png'),
        image: {
            uri: 'https://reactserver.hackers.com/assets/images/react/intro_discount.png',
        },
        backgroundColor: '#20d2bb',
    },
    {
        key: 's4',
        title: 'Hackers Shopping',
        text: ' 해커스 쇼핑',
        assetimage : require('./assets/images/intro_best_deals.png'),
        image: {
            uri: 'https://reactserver.hackers.com/assets/images/react/intro_best_deals.png',
        },
        backgroundColor: '#20d2bb',
    },
    {
        key: 's5',
        title: 'Hackers Train',
        text: '해커스 기차여행',
        assetimage : require('./assets/images/intro_bus_ticket_booking.png'),
        image: {
            uri:
                'https://reactserver.hackers.com/assets/images/react/intro_bus_ticket_booking.png',
        },
        backgroundColor: '#20d2bb',
    },
];
