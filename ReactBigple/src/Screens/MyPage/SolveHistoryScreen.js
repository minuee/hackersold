import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import HomeScreen from './SolveHistory/HomeScreen';
import Detail from './SolveHistory/SolveDetailScreen';

class SolveHistoryScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focusTab: 0,
        };
    }

    render() {
        // const parentNavi = this.props.navigation.dangerouslyGetParent();
        return (
            <View>
                <HomeScreen screenProps={this.props} screenState={this.state} />
            </View>
        );
    }
}

export default SolveHistoryScreen;
