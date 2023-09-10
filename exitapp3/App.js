import React from 'react';
import { StyleSheet, View, Text, Image,BackHandler,AsyncStorage,ToastAndroid,RefreshControl  } from 'react-native';
import { Container } from 'native-base';
import AppIntroSlider from 'react-native-app-intro-slider';
import RNExitApp from 'react-native-exit-app';

import AppHomeStack from './src/Screens/index4.js';
import AppLoginStack from './src/Screens/AuthScreen.js';


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showRealApp: false,
            exitApp : false,
            LoginToken: null,
            currentScreenIndex : 0
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
    }

    toggleDrawer = () => {
        this.props.navigation.dispatch(DrawerActions.toggleDrawer())
    }

    componentDidMount() {
        //console.log("this.open LoginToken ",this.state.LoginToken );
        AsyncStorage.getItem('userToken')
            .then((token) => {
                this.setState({ LoginToken : token });
            })
            .catch(error => {
                this.setState({ LoginToken :  null });
            })

    }

    handleBackButton = () => {
        this.setState({ currentScreenIndex :  0 });
        if (this.state.exitApp == undefined || !this.state.exitApp) {
            ToastAndroid.show('한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
            global.currentScreenIndex = 1;
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
            //this.setState({ showRealApp: false });
            RNExitApp.exitApp();  // 앱 종료
        }
        return true;

    };

    render() {
        //If false show the Intro Slides
        if (this.state.showRealApp) {
            //Real Application
            return (
                <AppHomeStack screenProps={this.state}/> //this.state.LoginToken === null ? <AppLoginStack /> : <AppHomeStack screenProps={this.state}/>
            );
        } else {
            //Intro slides
            return (
                <AppIntroSlider
                    slides={slides}
                    renderItem={this._renderItem}
                    onDone={this._onDone}
                    showSkipButton={true}
                    onSkip={this._onSkip}
                />
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
                'https://raw.githubusercontent.com/AboutReact/sampleresource/master/intro_mobile_recharge.png',
        },
        backgroundColor: '#20d2bb',
    },
    {
        key: 's2',
        title: 'Hackers Trip',
        text: '해커스 여행',
        image: {
            uri:
                'https://raw.githubusercontent.com/AboutReact/sampleresource/master/intro_flight_ticket_booking.png',
        },
        backgroundColor: '#febe29',
    },
    {
        key: 's3',
        title: 'Hackers Discount',
        text: '해커스 할인혜택',
        image: {
            uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/intro_discount.png',
        },
        backgroundColor: '#22bcb5',
    },
    {
        key: 's4',
        title: 'Hackers Shopping',
        text: ' 해커스 쇼핑',
        image: {
            uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/intro_best_deals.png',
        },
        backgroundColor: '#3395ff',
    },
    {
        key: 's5',
        title: 'Hackers Train',
        text: '해커스 기차여행',
        image: {
            uri:
                'https://raw.githubusercontent.com/AboutReact/sampleresource/master/intro_bus_ticket_booking.png',
        },
        backgroundColor: '#f6437b',
    },
];
