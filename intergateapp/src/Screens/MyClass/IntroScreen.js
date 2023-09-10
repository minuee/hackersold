import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default class IntroScreen extends Component {

   
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>This is Myclass Screen</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }

});
