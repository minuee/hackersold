import React, { Component } from 'react';
import {StyleSheet, View, Text, ScrollView, Dimensions, processColor, TouchableWithoutFeedback} from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

import { StackedBarChart, PieChart } from 'react-native-chart-kit';
import { BarChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';

const screenWidth = Dimensions.get("window").width - 10;
const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#FFFFFF",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(130, 130, 130, ${opacity})`,
    strokeWidth: 3, // optional, default 3
    barPercentage: 1.0
};

class ScoreAnalysisScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollHeight: 0
        }
    }

    setScrollHeight = (width, height) => this.setState({scrollHeight: height});

    render() {
        const fill = 'rgb(134, 65, 244)'

        const dataMine = [ 6, 5, 5, 4 ];
        const dataTop10 = [ 23, 24, 22, 18 ];
        const dataTop30 = [ 27, 36, 30, 24 ];
        const dataTotal = [ 28, 28, 22, 16 ];

        const data = [6, 23, 27, 28, undefined, 5, 24, 36, 28, undefined, 5, 22, 30, 22, undefined, 4, 18, 24, 16]

        const barData = [
            {
                data: dataMine,
                value: "내 맞은 개수",
                svg: {
                    fill: '#A8DFA8',
                }
            },
            {
                data: dataTop10,
                value: "상위 10%",
                svg: {
                    fill: '#F97372',
                }
            },
            {
                data: dataTop30,
                value: "상위 30%",
                svg: {
                    fill: '#E4E339',
                }
            },
            {
                data: dataTotal,
                value: "전체평균",
                svg: {
                    fill: '#83ABE2',
                }
            },
        ];

        {/*
        const labelX = [
            "내 맞은 개수", "상위 10%", "상위 30%", "전체평균",
        ];
        */}

        const topTotalTable = {
            tableHead: [ '내 점수', '상위 10%', '상위 30%', '전체 평균'  ],
            tableData: [
                [ 400, 412, 380, 320 ]
            ]
        };

        const partCorrectTable = {
            tableHead: [ 'Total', 'PART1', 'PART2', 'PART3', 'PART4'  ],
            tableData: [
                [ '84/100', '6/8', '23/25', '27/39', '28/30' ]
            ]
        };

        const topPartCorrectTable = {
            tableHead: [ '구분', 'PART1', 'PART2', 'PART3', 'PART4'  ],
            tableData: [
                [ '맞은 개수', '6/6', '23/25', '27/39', '28/30' ],
                [ '상위 10%', '5/6', '24/25', '36/39', '28/30' ],
                [ '상위 30%', '5/6', '22/25', '30/39', '22/30' ],
                [ '전체 평균', '4/6', '18/25', '24/39', '16/30' ],
            ]
        };

        const topTotalChart = {
            labels: ["", "", "", ""],
            legend: [ "내 점수", "상위 10%", "상위 30%", "전체 평균" ],
            data: [[400, null, null, null], [null, 412, null, null], [null, null, 380, null], [null, null, null, 320]],
            barColors: ["#F97372", "#E4E339", "#75D992", "#83ABE2", ]
        };

        const partCorrectChart = [
            {
                name: "PART1",
                population: 6,
                color: "#A8DFA8",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15,
                hasLegend: false
            },
            {
                name: "PART2",
                population: 23,
                color: "#F97372",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            },
            {
                name: "PART3",
                population: 27,
                color: "#E4E339",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            },
            {
                name: "PART4",
                population: 28,
                color: "#83ABE2",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            },
        ];

        const topPartCorrectChart = {
            legend: {
                enabled: true,
                textSize: 14,
                form: "SQUARE",
                formSize: 14,
                xEntrySpace: 10,
                yEntrySpace: 5,
                wordWrapEnabled: true
            },
            data: {
                dataSets: [{
                    values: [6, 5, 5, 4],
                    label: 'PART1',
                    config: {
                        drawValues: false,
                        colors: [processColor('#A8DFA8')],
                    }
                }, {
                    values: [23, 24, 22, 18],
                    label: 'PART2',
                    config: {
                        drawValues: false,
                        colors: [processColor('#F97372')],
                    }
                }, {
                    values: [27, 36, 30, 24],
                    label: 'PART3',
                    config: {
                        drawValues: false,
                        colors: [processColor('#E4E339')],
                    }
                }, {
                    values: [28, 28, 22, 16],
                    label: 'PART4',
                    config: {
                        drawValues: false,
                        colors: [processColor('#83ABE2')],
                    }
                }],
                config: {
                    barWidth: 0.15,
                    group: {
                        fromX: 0,
                        groupSpace: 0.2,
                        barSpace: 0.05,
                    },
                }
            },
            xAxis: {
                valueFormatter: ['내 맞은 개수 ', '상위 10%', '상위 30%', '전체 평균'],
                granularityEnabled: true,
                granularity: 1,
                axisMaximum: 4,
                axisMinimum: 0,
                centerAxisLabels: true
            },

            marker: {
                enabled: false,
                markerColor: processColor('#F0C0FF8C'),
                textColor: processColor('white'),
                markerFontSize: 14,
            },
        };

        return(
            <View style={ styles.container }>
                <ScrollView style={{ flex: 1, margin: 15, height: this.state.scrollHeight }} onContentSizeChange={this.setScrollHeight} >
                    <View>

                        {/* 수치 영역 */}
                        <View style={ styles.scoreArea }>

                            {/* 총점 영역 */}
                            <View style={ styles.scoreAreaWrapper }>

                                {/* 제목 영역 */}
                                <View style={ styles.scoreAreaWrapperTitle }>
                                    <Text style={{ color: '#969696' }}>총점</Text>
                                </View>

                                {/* 수치 영역 */}
                                <View style={ styles.scoreAreaWrapperValue }>
                                    <Text style={{ color: '#FF0000', fontSize: 20, fontWeight: 'bold' }}>400/445</Text>
                                    <Text style={{ color: '#FF0000', }}>점</Text>
                                </View>

                            </View>

                            {/* 석차 영역 */}
                            <View style={ styles.scoreAreaWrapper }>

                                {/* 제목 영역 */}
                                <View style={ styles.scoreAreaWrapperTitle }>
                                    <Text style={{ color: '#969696' }}>석차 백분율</Text>
                                </View>

                                {/* 수치 영역 */}
                                <View style={ styles.scoreAreaWrapperValue }>
                                    <Text style={{ color: '#FF0000', fontSize: 20, fontWeight: 'bold' }}>11.9</Text>
                                    <Text style={{ color: '#FF0000', }}>%</Text>
                                </View>

                            </View>
                        </View>

                        {/* 통계 영역 */}
                        <View style={ styles.analysisArea }>


                            {/* 상위권 대비 총점 비교 영역 시작 */}
                            {/* 상위권 대비 총점 비교 영역 시작 */}
                            {/* 상위권 대비 총점 비교 영역 시작 */}

                            <View styles={ styles.analysisTopTotalWrapper }>
                                {/* 제목 영역 */}
                                <View style={{ flex: 1, }}>
                                    <Text style={{ color: '#4488E3', fontWeight: 'bold', fontSize: 15 }} >상위권 대비 총점 비교</Text>
                                </View>

                                {/* 테이블 영역 */}
                                <View style={{ flex: 1, paddingTop: 10}}>
                                    <View>
                                        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff' }}>
                                            <Row
                                                data={topTotalTable.tableHead}
                                                style={{
                                                    height: 45,
                                                    backgroundColor: '#F5F5F5',
                                                }}
                                                textStyle={{
                                                    color: '#969696',
                                                    textAlign: 'center',
                                                }} />

                                            <Rows
                                                data={topTotalTable.tableData}
                                                style={{
                                                    height: 45,
                                                }}
                                                textStyle={{
                                                    color: '#969696',
                                                    textAlign: 'center',
                                                }} />
                                        </Table>
                                    </View>
                                </View>

                                {/* 그래프 영역 */}
                                <View>
                                    <StackedBarChart
                                        data={topTotalChart}
                                        width={screenWidth}
                                        height={250}
                                        chartConfig={chartConfig}
                                        style={{ paddingTop: 20 }}
                                    />
                                </View>
                            </View>

                            {/* 상위권 대비 총점 비교 영역 종료 */}
                            {/* 상위권 대비 총점 비교 영역 종료 */}
                            {/* 상위권 대비 총점 비교 영역 종료 */}

                            {/* PART별 맞은 개수 영역 시작 */}
                            {/* PART별 맞은 개수 영역 시작 */}
                            {/* PART별 맞은 개수 영역 시작 */}

                            <View style={ styles.analysisPartCorrectWrapper}>
                                {/* 제목 영역 */}
                                <View style={{ flex: 1, }}>
                                    <Text style={{ color: '#4488E3', fontWeight: 'bold', fontSize: 15 }} >PART별 맞은 개수</Text>
                                </View>

                                {/* 테이블 영역 */}
                                <View style={{ flex: 1, paddingTop: 10}}>
                                    <View>
                                        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff' }}>
                                            <Row
                                                data={partCorrectTable.tableHead}
                                                style={{
                                                    height: 45,
                                                    backgroundColor: '#F5F5F5',
                                                }}
                                                textStyle={{
                                                    color: '#969696',
                                                    textAlign: 'center',
                                                }} />

                                            <Rows
                                                data={partCorrectTable.tableData}
                                                style={{
                                                    height: 45,
                                                }}
                                                textStyle={{
                                                    color: '#969696',
                                                    textAlign: 'center',
                                                }} />
                                        </Table>
                                    </View>
                                </View>

                                {/* 그래프 영역 */}
                                <View>
                                    <PieChart
                                        data={partCorrectChart}
                                        width={screenWidth - 20}
                                        height={250}
                                        chartConfig={chartConfig}
                                        accessor="population"
                                        backgroundColor="transparent"
                                        paddingLeft={20}
                                    />
                                </View>
                            </View>

                            {/* PART별 맞은 개수 영역 종료 */}
                            {/* PART별 맞은 개수 영역 종료 */}
                            {/* PART별 맞은 개수 영역 종료 */}

                            {/* 상위권 대비 PART별 맞은 개수 비교 영역 시작 */}
                            <View>
                                <View styles={ styles.analysisTopPartCorrectWrapper }>
                                    {/* 제목 영역 */}
                                    <View style={{ flex: 1, }}>
                                        <Text style={{ color: '#4488E3', fontWeight: 'bold', fontSize: 15 }} >상위권 대비 PART별 맞은 개수 비교</Text>
                                    </View>

                                    {/* 테이블 영역 */}
                                    <View style={{ flex: 1, paddingTop: 10}}>
                                        <View>
                                            <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff' }}>
                                                <Row
                                                    data={topPartCorrectTable.tableHead}
                                                    style={{
                                                        height: 45,
                                                        backgroundColor: '#F5F5F5',
                                                    }}
                                                    textStyle={{
                                                        color: '#969696',
                                                        textAlign: 'center',
                                                    }} />

                                                <Rows
                                                    data={topPartCorrectTable.tableData}
                                                    style={{
                                                        height: 45,
                                                    }}
                                                    textStyle={{
                                                        color: '#969696',
                                                        textAlign: 'center',
                                                    }} />
                                            </Table>
                                        </View>
                                    </View>

                                    {/* 그래프 영역 */}
                                    <View style={{ flex: 1, paddingTop: 20, width: '100%' }}>

                                        <View style={{ flexDirection: 'row', }}>
                                            <Text style={{ flex: 1, textAlign: 'center', }}></Text>
                                            <View style={{ flex: 2, flexDirection: 'row', }} >
                                                <View style={{ backgroundColor: '#A8DFA8', width: 20, height: 20 }} />
                                                <Text style={{ textAlign: 'center', color: 'grey' }}> PART1</Text>
                                            </View>
                                            <View style={{ flex: 2, flexDirection: 'row', }} >
                                                <View style={{ backgroundColor: '#F97372', width: 20, height: 20 }} />
                                                <Text style={{ textAlign: 'center', color: 'grey' }}> PART2</Text>
                                            </View>
                                            <View style={{ flex: 2, flexDirection: 'row', }} >
                                                <View style={{ backgroundColor: '#E4E339', width: 20, height: 20 }} />
                                                <Text style={{ textAlign: 'center', color: 'grey' }}> PART3</Text>
                                            </View>
                                            <View style={{ flex: 2, flexDirection: 'row', }} >
                                                <View style={{ backgroundColor: '#83ABE2', width: 20, height: 20 }} />
                                                <Text style={{ textAlign: 'center', color: 'grey' }}> PART4</Text>
                                            </View>
                                        </View>
                                        <View style={{ height: 10 }}></View>
                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            <YAxis
                                                style={{ flex: 1 }}
                                                data={data}
                                                contentInset={{ left: 10, bottom: 20 }}
                                                svg={{
                                                    fill: 'grey',
                                                    fontSize: 10,
                                                }}
                                                numberOfTicks={10}
                                                formatLabel={(value) => `${value}`}
                                            />
                                            <BarChart
                                                style={{ flex: 9, height: 200 }}
                                                data={barData}
                                                svg={{ fill }}
                                                contentInset={{ top: 30, bottom: 30 }}>
                                                <Grid />
                                            </BarChart>

                                        </View>
                                        <View style={{ flexDirection: 'row', }}>
                                            <Text style={{ flex: 1, textAlign: 'center', }}></Text>
                                            <Text style={{ flex: 2, textAlign: 'center', color: 'grey' }}>내 맞은 개수</Text>
                                            <Text style={{ flex: 2, textAlign: 'center', color: 'grey' }}>상위 10%</Text>
                                            <Text style={{ flex: 2, textAlign: 'center', color: 'grey' }}>상위 30%</Text>
                                            <Text style={{ flex: 2, textAlign: 'center', color: 'grey' }}>전체 평균</Text>
                                        </View>
                                        {/*
                                        <XAxis
                                            data={labelX}
                                            contentInset={{ top: 10, bottom: 20, left: 17 }}
                                            svg={{
                                                fill: 'grey',
                                                fontSize: 10,
                                            }}
                                            numberOfTicks={10}
                                            xAccessor={({ item }) => item}
                                        />
                                        */}
                                    </View>
                                </View>
                            </View>
                            {/* 상위권 대비 PART별 맞은 개수 비교 영역 종료 */}

                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default ScoreAnalysisScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scoreArea: {
        flex: 1,
        flexDirection: 'row',
        height: 60,
        borderBottomWidth: 0.5
    },
        scoreAreaWrapper: {
            flex: 1,
            flexDirection: 'row'
        },
            scoreAreaWrapperTitle: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            },
            scoreAreaWrapperValue: {
                flex: 1.4,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
            },

    analysisArea: {
        flex: 1,
        margin: 5,
    },
        analysisTopTotalWrapper: {
            flex: 1,
            margin: 50,
            backgroundColor: '#FF0000'
        },

        analysisPartCorrectWrapper: {
            flex: 1,
        },

        analysisTopPartCorrectWrapper: {
            flex: 1,
        },

    partCorrectArea: {

    },

    topRateCorrectArea: {
        margin: 5
    },

    chart: {
        flex: 1,
        width: '100%',
        height: 200,
    }

});