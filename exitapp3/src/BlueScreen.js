import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import HamburgerIcon from './HamburgerIcon';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {withNavigationFocus} from "react-navigation";


class BlueScreen extends Component {

    constructor(props) {
        super(props);

    }

    state = {
        LoginToken: null
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Blue Screen</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'skyblue',
    },
    navTtitle : {
        fontSize: 20,
        paddingLeft:10
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
});

export default withNavigationFocus(BlueScreen );
