import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Voice from "react-native-voice";

export default class MemberDetailScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            UserIdx: this.props.navigation.state.params.UserIdx
        };


    }

    static navigationOptions = () => {
        return {
            header: null
        };
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Selected UserIdx {this.state.UserIdx}</Text>
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
