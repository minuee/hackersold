//This is an example code for Navigation Drawer with Custom Side bar//
import React, { Component } from 'react';
import {View, StyleSheet, Image, Text, Alert, ScrollView,TouchableOpacity,SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import MyPageIntroScreen from '../Screens/MyPage/IntroScreen';

export default class DrawerMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            TopUserToken: null,
        };
    }


    UNSAFE_componentWillMount() {   
        
    }  

    componentDidMount() {
    }

    
    render() {
        return (
            <SafeAreaView style={styles.sideMenuContainer}>
                <MyPageIntroScreen screenProps={this.props} />
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    sideMenuContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        //backgroundColor: '#FF0000',
        //alignItems: 'center',
    },
    sideMenuProfileIcon: {
        resizeMode: 'center',
        width: 150,
        height: 150,
        marginTop: 20,
        borderRadius: 150 / 2,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: "white",
        alignSelf:'center',
        position: 'absolute',
    },
});
