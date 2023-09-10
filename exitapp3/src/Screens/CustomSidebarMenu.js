//This is an example code for Navigation Drawer with Custom Side bar//
import React, { Component } from 'react';
import {View, StyleSheet, Image, Text, Alert, AsyncStorage} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/AntDesign';
import {NavigationActions, StackActions} from "react-navigation";
import RNRestart from "react-native-restart";


export default class CustomSidebarMenu extends Component {

    constructor() {
        super();
        this.items = [
            {
                navOptionThumb: 'home',
                navOptionName: 'Home Screen',
                screenToNavigate: 'NavHomeScreen',
            },
            {
                navOptionThumb: 'microphone',
                navOptionName: 'Speech Screen',
                screenToNavigate: 'NavSpeechScreen',
            },
            {
                navOptionThumb: 'volume-up',
                navOptionName: 'Voice Screen',
                screenToNavigate: 'NavVoiceScreen',
            },
            {
                navOptionThumb: 'th-list',
                navOptionName: 'Member Screen',
                screenToNavigate: 'NavMemberScreen',
            },{
                navOptionThumb: 'linux',
                navOptionName: 'Tabs Screen',
                screenToNavigate: 'NavTabsScreen',
            }
        ];
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

    _logout(){
        this.state.removeToken();
        const resetAction = StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: 'LoginScreen' })],
        });
        RNRestart.Restart();
        //this.props.navigation.dispatch(resetAction);
    }

    render() {
        return (
            <View style={styles.sideMenuContainer}>
                {/*Top Large Image */}
                {/*Divider between Top Image and Sidebar Option*/}
                <View
                    style={{
                        width: '100%',
                        height: 1,
                        backgroundColor: '#e2e2e2',
                        marginTop: 15,
                    }}
                />
                {/*Setting up Navigation Options from option array using loop*/}
                <View style={{ width: '100%' }}>
                    {this.items.map((item, key) => (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingTop: 10,
                                paddingBottom: 10,
                                backgroundColor: global.currentScreenIndex === key ? '#e0dbdb' : '#ffffff',
                            }}
                            key={key}>
                            <View style={{ marginRight: 10, marginLeft: 20 }}>
                                <Icon name={item.navOptionThumb} size={25} color="#808080" />
                            </View>
                            <Text
                                style={{
                                    fontSize: 15,
                                    color: global.currentScreenIndex === key ? 'red' : 'black',
                                }}
                                onPress={() => {
                                    global.currentScreenIndex = key;
                                    this.props.navigation.navigate(item.screenToNavigate);
                                }}>
                                {item.navOptionName}
                            </Text>
                        </View>
                    ))}
                    <View
                        style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingTop: 10,
                        paddingBottom: 10,
                        backgroundColor: '#ffffff'
                    }}>
                        <View style={{ marginRight: 10, marginLeft: 20 }}>
                            <Icon2 name="logout" size={25} color="#808080" />
                        </View>
                        <Text
                            style={{
                                fontSize: 15,
                                color: 'black',
                            }}
                            onPress={this._checkLogout.bind(this)}
                        >
                            Log Out
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    sideMenuContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 20,
    },
    sideMenuProfileIcon: {
        resizeMode: 'center',
        width: 150,
        height: 150,
        marginTop: 20,
        borderRadius: 150 / 2,
    },
});
