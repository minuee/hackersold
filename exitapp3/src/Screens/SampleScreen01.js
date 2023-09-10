import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default class SampleScreen01 extends Component {

    static navigationOptions = () => {
        return {
            header: null
        };
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>This is SampleScreen01</Text>
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
