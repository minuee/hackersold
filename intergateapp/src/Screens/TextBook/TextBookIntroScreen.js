import React, { Component } from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';

//공통상수
import COMMON_STATES from '../../Constants/Common';


export default class TextBookIntroScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <ScrollView style={styles.container}>
                <Text style={{
                        fontSize: COMMON_STATES.baseFontSize,
                        color: COMMON_STATES.grayFontColor
                    }}>
                    {this.props.screenState.bookInfo.desc}
                </Text>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    contentWrapper: {

    },
});