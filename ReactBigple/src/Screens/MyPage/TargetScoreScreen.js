import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, Button} from 'react-native';

class TargetScoreScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <ScrollView>
                <View>
                    <Text>목표 점수</Text>
                </View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('SolveHistoryScreen')}>
                    <Text>풀이 이력</Text>
                </TouchableOpacity>
                <Button title="풀이 이력" onPress={() => this.props.navigation.navigate('SolveHistoryScreen')} />
            </ScrollView>
        );
    }
}

export default TargetScoreScreen;
