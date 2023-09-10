import React, { Component } from 'react';
import {
    View,
    Text,
    Dimensions, StyleSheet
} from 'react-native';

import { Button } from 'react-native-elements';
import { FlatGrid } from 'react-native-super-grid';

import { StackedBarChart } from 'react-native-chart-kit';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import ReportScreen from './ReportScreen';

import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

const chartData = {
    labels: ["18-01-15", "18-01-12", "18-01-05", "18-01-04"],
    legend: ["PART5", "PART6", "PART7"],
    data: [[20, 30, 25], [15, 30, 20], [10, 10, 10], [30, 20, 30]],
    barColors: ["#83ABE2", "#E4E339", "#F97372"]
};

const screenWidth = Dimensions.get("window").width;
const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#FFFFFF",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(130, 130, 130, ${opacity})`,
    strokeWidth: 3, // optional, default 3
    barPercentage: 1.0
};

const items = [
    { num: '1' },
    { num: '2' },
    { num: '3' },
    { num: '4' },
    { num: '5' },
    { num: '6' },
    { num: '7' },
    { num: '8' },
    { num: '9' },
    { num: '10' },
    { num: '11' },
    { num: '12' },
];

class GraphBoxScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            isSelectedRound: true,
        }
    }

    _onPressArrow = () => {
        this.setState({isVisible: !this.state.isVisible})
    }

    render() {
        //const {navigate} = this.props.navigation;

        return(
            this.state.isVisible &&
            <View>
                {/* 상단 */}
                <View>
                    <StackedBarChart
                        data={chartData}
                        width={screenWidth}
                        height={250}
                        chartConfig={chartConfig}
                    />
                </View>
                {/* 하단 */}
                <View>
                    <View>
                        <FlatGrid
                            itemDimension={50}
                            items={items}
                            style={styles.gridView}
                            renderItem={({ item, index }) => (
                                <Button
                                    title={item.num}
                                    titleStyle={{ color: '#8C8C8C' }}
                                    buttonStyle={{ backgroundColor: '#E3E3E3' }}/>

                            )}
                        />
                    </View>
                    <View>
                        {
                            this.state.isSelectedRound
                                ?   <Button
                                        title='풀이 분석 결과 보기'
                                        onPress={() => this.props.screenProps.navigation.navigate('ReportScreen') }
                                    />
                                :   <Button
                                    title='풀이 분석 결과 보기'
                                />
                        }
                    </View>
                </View>
            </View>
        );
    }
}

export default GraphBoxScreen;

const styles = StyleSheet.create({
    gridView: {
        marginTop: 20,
        flex: 1,
    },
    itemContainer: {
        justifyContent: 'flex-end',
        padding: 10,
        backgroundColor: '#375DD7',
    },
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    itemCode: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
    },
});