import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet, AsyncStorage
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import HeaderNav from '../Component/HeaderNav';

export default class SettingScreen extends Component{
    _navigate = (nav) => {
        console.log('_navigate', nav);
        //this.props.navigation.navigate('VoiceScreen');


        this.props.navigation.navigate(nav);
    }

    _checkLogout(){
        Alert.alert(
            "Hackers Alert",
            "Are you sure?",
            [
                {text: 'ok', onPress: this._logout.bind(this)},
                {text: 'cancel', onPress: () => null},
            ],
            { cancelable: true }
        )
    }

    state = {
        token: '',
        removeToken: async () => {
            try {
                const resp = await AsyncStorage.removeItem('userToken');
                return resp
            }
            catch (error) {
                this.setState({ error })
            }
        }
    };

    _logout(){
        this.state.removeToken();
        const resetAction = StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: 'LoginScreen' })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    static navigationOptions = () => {
        return {
            headerRight: <HeaderNav/>,
            headerLeft : <Text>연습장</Text>
        };
    };

    render(){
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.wrapButton}
                    onPress={this._navigate.bind(this,'SpeechScreen')}>
                    <Text>Speech Screen</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.wrapButton}
                    onPress={this._navigate.bind(this,'VoiceScreen')}>
                    <Text>Voice Screen</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.wrapButton}
                    onPress={this._checkLogout.bind(this)}>
                    <Text>🔓 Logout</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    wrapButton: {
        width: wp('100%'),
        height: hp('8%'),
        paddingLeft: wp('8%'),
        justifyContent: 'center',
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
    }
})