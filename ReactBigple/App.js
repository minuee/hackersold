import React from 'react';
import {StyleSheet, BackHandler, ToastAndroid} from 'react-native';
import 'react-native-gesture-handler';
import RNExitApp from 'react-native-exit-app';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';

import {Provider} from 'react-redux';

import initStore from './src/Ducks/mainStore';
const store = initStore();

import AppHomeStack from './src/Navigation/RouteScreen';

export default class Appnoh extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            exitApp: false,
            LoginToken: null,
            currentScreenIndex: 1,
            deviceId: null,
        };

        /*
        DeviceInfo.getIpAddress().then(ip => {
            console.log("getIpAddress", ip);
        });
        DeviceInfo.getDeviceName().then(deviceName => {
            console.log("getDeviceName", deviceName);
        });
        DeviceInfo.getDevice().then(device => {
            console.log("getDevice", device);
        });
        DeviceInfo.getPhoneNumber().then(phoneNumber => {
            console.log("getPhoneNumber", phoneNumber);
        });
        */
    }

    UNSAFE_componentWillMount() {
        this.setState({deviceId: DeviceInfo.getUniqueId()});
        BackHandler.addEventListener(
            'hardwareBackPress',
            this.handleBackButton,
        );
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener(
            'hardwareBackPress',
            this.handleBackButton,
        );
    }

    componentDidMount() {
        AsyncStorage.getItem('userToken')
            .then(token => {
                this.setState({LoginToken: token});
                console.log('app.js token', token);
            })
            .catch(error => {
                this.setState({LoginToken: null});
            });
        console.log('deviceId', this.state.deviceId);
    }

    handleBackButton = () => {
        if (this.state.exitApp == undefined || !this.state.exitApp) {
            ToastAndroid.show(
                '한번 더 누르시면 종료됩니다.',
                ToastAndroid.SHORT,
            );
            this.setState({exitApp: true});
            this.timeout = setTimeout(
                () => {
                    this.setState({exitApp: false});
                },
                2000, // 2초
            );
        } else {
            clearTimeout(this.timeout);
            this.setState({exitApp: false});
            RNExitApp.exitApp(); // 앱 종료
        }
        return true;
    };

    render() {
        /*
        return (
            this.state.LoginToken || this.state.deviceId == '5B7F2729-E891-4E1D-B34B-29563ED40540' || this.state.deviceId == 'fa26057ecf98684e' ?  <AppHomeStack screenProps={this.state}  /> : <AppLoginStack screenProps={this.state}  />
        );
        */
        return (
            <Provider store={store}>
                <AppHomeStack screenProps={this.state} />
            </Provider>
        );
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
