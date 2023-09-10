import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    Text,
    Dimensions
} from 'react-native';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

class TranslateScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={ styles.container }>
                <Text>This is {this.constructor.name}</Text>
            </View>
        );
    }
}

export default TranslateScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});