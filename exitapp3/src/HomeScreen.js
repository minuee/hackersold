import React, {Component, Fragment} from 'react';
import { StyleSheet, StatusBar,Text, View,AsyncStorage,BackAndroid,NativeModules,BackHandler,AppState } from 'react-native';
import RNExitApp from 'react-native-exit-app';
import IntroScreen from "./IntroScreen";
import FirstScreen from "./FirstScreen";

export default class HomeScreen extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        LoginToken: this.props.LoginToken,
        Fn_Close: async () => {
            console.log("Oh yerh");
            RNExitApp.exitApp();

        },
    };


    render() {
        return (
            <>
                <StatusBar
                    barStyle="dark-content"  backgroundColor={'transparent'} translucent={true} />
                <FirstScreen screenProps={this.state} />
            </>
        );
    }
}