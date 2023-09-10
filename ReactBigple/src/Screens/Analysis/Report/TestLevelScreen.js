import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, } from 'react-native';
import { Rating, Overlay } from 'react-native-elements';
import { Table, TableWrapper, Row, Rows, Cols, Col, Cell, } from 'react-native-table-component';
import { BarChart, Grid, YAxis } from 'react-native-svg-charts';

import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

import TestLevelDetailOverlay from './TestLevelDetailOverlay';
import CommonAnalysisStyle from '../../../Styles/CommonAnalysisStyle';

class TestLevelScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisibleOverlay: false
        }
    }

    onPressArrow = () => {
        this.setState({isVisibleOverlay: !this.state.isVisibleOverlay});
    }

    render() {

        const levelProblemTable = {
            tableHead: [ '구분', 'A', 'B', 'C', 'D'  ],
            tableData: [
                [ '문제수', '13', '21', '32', '34' ],
                [ '맞은 개수', '10', '20', '28', '26' ],
            ]
        };

        const part5Table = {
            tableHead: [ '구분', 'A', 'B', 'C', 'D'  ],
            tableData: [
                [ '문제수', '13', '21', '32', '34' ],
                [ '맞은 개수', '10', '20', '28', '26' ],
            ]
        };

        const fill = 'rgb(134, 65, 244)'
        const data = [13, 10, undefined, 21, 20, undefined, 32, 28, undefined, 34, 28, ]
        const dataTotal = [ 13, 21, 32, 34 ];
        const dataCorrect = [ 10, 20, 28, 26 ];

        const barData = [
            {
                data: dataTotal,
                value: "문제수",
                svg: {
                    fill: '#F97372',
                }
            },
            {
                data: dataCorrect,
                value: "맞은 개수",
                svg: {
                    fill: '#83ACE2',
                }
            },
        ];

        return(
            <View style={ styles.container }>
                <ScrollView style={ styles.subContainer }>
                    {/* TEST 난이도 영역 시작 >>> */}
                    <View style={ styles.levelMain }>
                        {/* 제목 */}
                        <View>
                            <Text style={ CommonAnalysisStyle.titleForArea }>
                                TEST 난이도
                            </Text>
                        </View>

                        <View style={ styles.levelMainSeperator } />

                        {/* 내용 */}
                        <View style={ styles.wrapper } >

                            <View style={ styles.levelMainContent } >
                                {/* 배경 이미지 */}
                                <Image
                                    source={require('../../../../assets/images/test-level-background.png')}
                                    style={ styles.levelMainImage }
                                />
                                {/* 상단 영역 */}
                                <View style={ styles.levelMainTop }>
                                    <Text style={ styles.levelMainTopText }>
                                        B
                                    </Text>
                                </View>

                                {/* 하단 영역 */}
                                <View style={{ flex: 1, }}>
                                    <View style={{ flex: 1, }}>
                                        <Text style={ styles.levelMainBottomText } >
                                            난이도가 조금 높습니다.{'\n'}신중하게 풀어주세요~
                                        </Text>
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Rating
                                            type='custom'
                                            ratingCount={4}
                                            startingValue={3}
                                            imageSize={20}
                                            ratingColor='#367EE2'
                                            readonly
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* >>> TEST 난이도 영역 종료 */}

                    {/* TEST 문제별 난이도 및 맞은 개수 영역 시작 >>> */}

                    <View>
                        {/* 제목 */}
                        <View>
                            <Text style={ CommonAnalysisStyle.titleForArea }>
                                TEST 문제별 난이도 및 맞은 개수
                            </Text>
                        </View>

                        <View style={ styles.levelProblemSeperator } />

                        {/* 내용 */}
                        <View style={ styles.wrapper } >
                            <View style={ styles.levelProblemContent } >

                                {/* 테이블 영역 */}
                                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff' }}>
                                    <Row
                                        data={levelProblemTable.tableHead}
                                        style={{
                                            height: 45,
                                            backgroundColor: '#F5F5F5',
                                        }}
                                        textStyle={{
                                            color: '#969696',
                                            textAlign: 'center',
                                        }} />

                                    <Rows
                                        data={levelProblemTable.tableData}
                                        style={{
                                            height: 45,
                                        }}
                                        textStyle={{
                                            color: '#969696',
                                            textAlign: 'center',
                                        }} />
                                </Table>

                                {/* 그래프 영역 */}
                                <View style={{ flex: 1, backgroundColor: '#F5FCFF', paddingTop: 20, width: '100%' }}>

                                    <View style={{ flexDirection: 'row', }}>
                                        <View style={{ flex: 4, }} />
                                        <View style={{ flex: 2, flexDirection: 'row', }} >
                                            <View style={{ backgroundColor: '#F97372', width: 20, height: 20 }} />
                                            <Text style={{ textAlign: 'center', color: 'grey' }}> 문제수</Text>
                                        </View>
                                        <View style={{ flex: 2, flexDirection: 'row', }} >
                                            <View style={{ backgroundColor: '#83ABE2', width: 20, height: 20 }} />
                                            <Text style={{ textAlign: 'center', color: 'grey' }}> 맞은 개수</Text>
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
                                        <Text style={{ flex: 2, textAlign: 'center', color: 'grey' }}>A</Text>
                                        <Text style={{ flex: 2, textAlign: 'center', color: 'grey' }}>B</Text>
                                        <Text style={{ flex: 2, textAlign: 'center', color: 'grey' }}>C</Text>
                                        <Text style={{ flex: 2, textAlign: 'center', color: 'grey' }}>D</Text>
                                    </View>
                                </View>

                                <View style={ styles.levelProblemSeperator } />

                                {/* 세부 문항 영역 */}
                                <View style={ styles.levelProblemContentDetail }>
                                    {/* 제목 영역 */}
                                    <View style={ styles.levelProblemContentDetailTitle }>
                                        <Text style={ styles.levelProblemContentDetailTitleText }>세부 문항 번호 보기</Text>
                                        <Icon name='angle-down' size={25} color='white' onPress={ () => this.onPressArrow() }></Icon>
                                    </View>
                                    {/* 내용 영역 */}
                                    <View style={ styles.levelProblemSeperator } />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* >>> TEST 문제별 난이도 및 맞은 개수 영역 종료 */}
                </ScrollView>

                <Overlay
                    width='95%'
                    height='95%'
                    isVisible={this.state.isVisibleOverlay}>
                    <TestLevelDetailOverlay onPressArrow={this.onPressArrow} />
                </Overlay>
            </View>
        );
    }
}

export default TestLevelScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    subContainer: {
      flex: 1,
      margin: 15,
    },

    wrapper: {
        flex: 1,
        alignItems: 'center',
         justifyContent: 'center',
    },

    // TEST 난이도 영역(level_main) 시작 >>>
    levelMain: {
        paddingBottom: 50,
    },

        // 제목 영역
        levelMainSeperator: {
            height: 30,
        },

        // 컨텐츠 영역
        levelMainContent: {
            width: 200,
            height: 200,
        },

            levelMainImage: {
                position: 'absolute',
                zIndex: 0,
                width: 200,
                height: 200,
            },

            levelMainTop: {
                flex: 1.5,
                alignItems: 'center',
                justifyContent: 'center',
            },

                levelMainTopText: {
                    fontSize: 70,
                    marginTop: 20,
                    color: '#0E448E',
                    fontWeight: 'bold',
                },

            levelMainBottom: {

            },

                levelMainBottomText: {
                    textAlign: 'center',
                    color: '#6188BD',
                    fontWeight: 'bold',
                },
    // >>> TEST 난이도 영역(level_main) 종료

    // TEST 문제별 난이도 및 맞은 개수 영역(levelProblem) 시작 >>>
    levelProblem: {
        paddingBottom: 50,
    },

        // 제목 영역
        levelProblemSeperator: {
            height: 10,
        },

        // 컨텐츠 영역
        levelProblemContent: {
            flex: 1,
            width: '100%',
        },
            // 세부 문항 영역
        levelProblemContentDetail: {

        },

            levelProblemContentDetailTitle: {
                height: 30,
                marginLeft: 10,
                marginRight: 10,
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: '#3072DF',
                padding: 5,
            },

                levelProblemContentDetailTitleText: {
                    color: 'white',
                },

            levelProblemContentDetailTables: {
                flex: 1,
                borderWidth: 1,
                borderColor: '#E7E7E7',
                padding: 10,
            }
});