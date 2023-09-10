import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default class JapanScreen extends Component {

   
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>This is JapanScreen</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width : '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ccc',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color : '#fff'
    }

});
