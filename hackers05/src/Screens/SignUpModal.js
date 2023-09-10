import React, {Component} from 'react';
import {StyleSheet, Text, View,Button} from 'react-native';

export default class SignUpModal extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('getTitle')(),
            headerLeft: null,
            //headerRight: null
            headerRight: (
                <Button
                    onPress={() => {
                        navigation.getParam('onClose')(null, navigation);
                    }}
                    title='선택'
                />
            )
        };
    };



    render() {
        return this.props.navigation.getParam('renderScene')();
    }
}
