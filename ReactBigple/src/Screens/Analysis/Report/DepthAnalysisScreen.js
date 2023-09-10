import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Rating } from 'react-native-elements';
import {ScrollableTabView, ScrollableTabBar} from '@valdio/react-native-scrollable-tabview'

import PartSelectOverlay from './PartSelectOverlay';

import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

import CommonAnalysisStyle from "../../../Styles/CommonAnalysisStyle";

const headCorrect = [ '번호', '내답', '정답', '정/오', '난이도', '정답률' ];
const dataCorrect = [
    { num: 101, mark: 'B', answer: 'B', level: 3, rateAnswer: '63' },
    { num: 102, mark: 'C', answer: 'C', level: 3, rateAnswer: '37' },
    { num: 103, mark: 'B', answer: 'B', level: 3, rateAnswer: '57' },
    { num: 105, mark: 'A', answer: 'A', level: 3, rateAnswer: '80' },
    { num: 106, mark: 'C', answer: 'C', level: 3, rateAnswer: '75' },
    { num: 107, mark: 'C', answer: 'C', level: 3, rateAnswer: '84' },
    { num: 108, mark: 'B', answer: 'B', level: 3, rateAnswer: '34' },
    { num: 109, mark: 'B', answer: 'B', level: 3, rateAnswer: '43' },
    { num: 110, mark: 'D', answer: 'D', level: 3, rateAnswer: '78' },
    { num: 111, mark: 'C', answer: 'C', level: 3, rateAnswer: '88' },
    { num: 112, mark: 'A', answer: 'A', level: 3, rateAnswer: '56' },
    { num: 113, mark: 'B', answer: 'A', level: 3, rateAnswer: '61' },
    { num: 115, mark: 'D', answer: 'C', level: 3, rateAnswer: '42' },
    { num: 116, mark: 'B', answer: 'C', level: 3, rateAnswer: '23' },
];

const headWrong = [ '번호', '내답', '정답', '정/오', '난이도', '정답률' ];
const dataWrong = [
    { num: 104, mark: 'B', answer: 'C', level: 3, rateAnswer: '21' },
    { num: 114, mark: 'C', answer: 'B', level: 3, rateAnswer: '37' },
    { num: 124, mark: 'B', answer: 'A', level: 3, rateAnswer: '57' },
    { num: 127, mark: 'A', answer: 'C', level: 3, rateAnswer: '32' },
    { num: 147, mark: 'C', answer: 'B', level: 3, rateAnswer: '11' },
    { num: 154, mark: 'C', answer: 'B', level: 3, rateAnswer: '45' },
    { num: 173, mark: 'B', answer: 'D', level: 3, rateAnswer: '34' },
    { num: 176, mark: 'B', answer: 'D', level: 3, rateAnswer: '43' },
    { num: 179, mark: 'D', answer: 'C', level: 3, rateAnswer: '23' },
    { num: 181, mark: 'C', answer: 'A', level: 3, rateAnswer: '27' },
    { num: 183, mark: 'A', answer: 'D', level: 3, rateAnswer: '56' },
    { num: 186, mark: 'D', answer: 'A', level: 3, rateAnswer: '39' },
];

const headTopWrong = [ '번호', '내답', '정답', '정/오', '고오답지', '선택비중' ];
const dataTopWrong = [
    { num: 101, mark: 'B', answer: 'B', markTopWrong: 'A', rate: '12' },
    { num: 102, mark: 'C', answer: 'C', markTopWrong: 'D', rate: '21' },
    { num: 103, mark: 'B', answer: 'B', markTopWrong: 'C', rate: '14' },
    { num: 104, mark: 'B', answer: 'C', markTopWrong: 'B', rate: '23' },
    { num: 105, mark: 'A', answer: 'A', markTopWrong: 'B', rate: '76' },
    { num: 106, mark: 'C', answer: 'C', markTopWrong: 'D', rate: '55' },
    { num: 107, mark: 'C', answer: 'C', markTopWrong: 'B', rate: '27' },
    { num: 108, mark: 'B', answer: 'B', markTopWrong: 'A', rate: '56' },
    { num: 109, mark: 'B', answer: 'B', markTopWrong: 'C', rate: '39' },
    { num: 110, mark: 'D', answer: 'D', markTopWrong: 'C', rate: '12' },
    { num: 111, mark: 'C', answer: 'C', markTopWrong: 'A', rate: '18' },
    { num: 112, mark: 'A', answer: 'A', markTopWrong: 'B', rate: '21' },
];

class DepthAnalysisScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            focusTab : 0
        }
    }

    setStateForTabChange = (e) => {
        this.setState({focusTab: e});
    }

    render() {
        return(
            <View style={{ flex: 1 }}>
                <PartSelectOverlay />
                <ScrollableTabView
                    refreshControlStyle={{backgroundColor: 'red'}}
                    initialPage={0}
                    style={{ backgroundColor: '#FFFFFF' }}
                    tabBarTextStyle={styles.tabBarTextStyle}
                    tabBarActiveTextColor="#888"
                    tabBarInactiveTextColor='#cccccc'
                    tabBarUnderlineStyle={styles.underlineStyle}
                    renderTabBar={() => <ScrollableTabBar />}
                    onChangeTab={(event)=>{this.setStateForTabChange(event.i)}}
                    tabBarPosition="top">
                    <SafeAreaView style={{flex: 1}} tabLabel='맞은 문제'>
                        <ScrollView>
                            <View style={ TableStyles.head }>
                                {/*
                                    headCorrect.map((data) => {
                                        return (
                                            <View style={TableStyles.headCol}>
                                                <Text style={ CommonAnalysisStyle.textGrey }>{data}</Text>
                                            </View>
                                        ) ;
                                    })
                                */}
                                <View style={TableStyles.headCol}><Text style={ CommonAnalysisStyle.textGrey }>번호</Text></View>
                                <View style={TableStyles.headCol}><Text style={ CommonAnalysisStyle.textGrey }>내답</Text></View>
                                <View style={TableStyles.headCol}><Text style={ CommonAnalysisStyle.textGrey }>정답</Text></View>
                                <View style={TableStyles.headCol}><Text style={ CommonAnalysisStyle.textGrey }>정/오</Text></View>
                                <View style={[ TableStyles.headCol, {flex: 2} ]}><Text style={ CommonAnalysisStyle.textGrey }>난이도</Text></View>
                                <View style={TableStyles.headCol}><Text style={ CommonAnalysisStyle.textGrey }>정답률</Text></View>
                            </View>
                            {/* tableBody */}
                            <View style={ TableStyles.body }>
                                {
                                    dataCorrect.map((data) => {
                                        return (
                                            <View style={ TableStyles.bodyRows }>
                                                <Text style={[ TableStyles.bodyRowCol, CommonAnalysisStyle.textGrey, ]}>{ data.num }</Text>
                                                <Text style={[ TableStyles.bodyRowCol, CommonAnalysisStyle.textGrey, ]}>{ data.mark }</Text>
                                                <Text style={[ TableStyles.bodyRowCol, CommonAnalysisStyle.textGrey, ]}>{ data.answer }</Text>
                                                <Text style={[ TableStyles.bodyRowCol, CommonAnalysisStyle.textGrey, ]}>{ data.mark == data.answer ? "O" : "X" }</Text>
                                                <View style={[ TableStyles.bodyRowCol, {flex: 2} ]}>
                                                    <Rating
                                                        type='custom'
                                                        ratingCount={4}
                                                        startingValue={ data.level }
                                                        imageSize={20}
                                                        ratingColor='#367EE2'
                                                        ratingBackgroundColor='#E2E2E2'
                                                        tintColor='#FFFFFF'
                                                        readonly
                                                    />
                                                </View>
                                                <Text style={[ TableStyles.bodyRowCol, CommonAnalysisStyle.textGrey, ]}>{ data.rateAnswer }%</Text>
                                            </View>
                                        );
                                    })
                                }
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                    <SafeAreaView style={{flex: 1}} tabLabel='틀린 문제'>
                        <ScrollView>
                            <View style={ TableStyles.head }>
                                <View style={TableStyles.headCol}><Text style={ CommonAnalysisStyle.textGrey }>번호</Text></View>
                                <View style={TableStyles.headCol}><Text style={ CommonAnalysisStyle.textGrey }>내답</Text></View>
                                <View style={TableStyles.headCol}><Text style={ CommonAnalysisStyle.textGrey }>정답</Text></View>
                                <View style={TableStyles.headCol}><Text style={ CommonAnalysisStyle.textGrey }>정/오</Text></View>
                                <View style={[ TableStyles.headCol, {flex: 2} ]}><Text style={ CommonAnalysisStyle.textGrey }>난이도</Text></View>
                                <View style={TableStyles.headCol}><Text style={ CommonAnalysisStyle.textGrey }>정답률</Text></View>
                            </View>
                            {/* tableBody */}
                            <View style={ TableStyles.body }>
                                {
                                    dataWrong.map((data) => {
                                        return (
                                            <View style={ TableStyles.bodyRows }>
                                                <Text style={[ TableStyles.bodyRowCol, CommonAnalysisStyle.textGrey, ]}>{ data.num }</Text>
                                                <Text style={[ TableStyles.bodyRowCol, CommonAnalysisStyle.textGrey, ]}>{ data.mark }</Text>
                                                <Text style={[ TableStyles.bodyRowCol, CommonAnalysisStyle.textGrey, ]}>{ data.answer }</Text>
                                                <Text style={[ TableStyles.bodyRowCol, CommonAnalysisStyle.textGrey, ]}>{ data.mark == data.answer ? "O" : "X" }</Text>
                                                <View style={[ TableStyles.bodyRowCol, {flex: 2} ]}>
                                                    <Rating
                                                        type='custom'
                                                        ratingCount={4}
                                                        startingValue={ data.level }
                                                        imageSize={20}
                                                        ratingColor='#367EE2'
                                                        ratingBackgroundColor='#E2E2E2'
                                                        tintColor='#FFFFFF'
                                                        readonly
                                                    />
                                                </View>
                                                <Text style={[ TableStyles.bodyRowCol, CommonAnalysisStyle.textGrey, ]}>{ data.rateAnswer }%</Text>
                                            </View>
                                        );
                                    })
                                }
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                    <SafeAreaView style={{flex: 1}} tabLabel='고오답 문제'>
                        <ScrollView>
                            <View style={ TableStyles.head }>
                                <View style={TableStyles.headCol}><Text style={ CommonAnalysisStyle.textGrey }>번호</Text></View>
                                <View style={TableStyles.headCol}><Text style={ CommonAnalysisStyle.textGrey }>내답</Text></View>
                                <View style={TableStyles.headCol}><Text style={ CommonAnalysisStyle.textGrey }>정답</Text></View>
                                <View style={TableStyles.headCol}><Text style={ CommonAnalysisStyle.textGrey }>정/오</Text></View>
                                <View style={[ TableStyles.headCol, {flex: 2} ]}><Text style={ CommonAnalysisStyle.textGrey }>고오답치</Text></View>
                                <View style={TableStyles.headCol}><Text style={ CommonAnalysisStyle.textGrey }>선택비중</Text></View>
                            </View>
                            {/* tableBody */}
                            <View style={ TableStyles.body }>
                                {
                                    dataTopWrong.map((data) => {
                                        return (
                                            <View style={ TableStyles.bodyRows }>
                                                <Text style={[ TableStyles.bodyRowCol, CommonAnalysisStyle.textGrey, ]}>{ data.num }</Text>
                                                <Text style={[ TableStyles.bodyRowCol, CommonAnalysisStyle.textGrey, ]}>{ data.mark }</Text>
                                                <Text style={[ TableStyles.bodyRowCol, CommonAnalysisStyle.textGrey, ]}>{ data.answer }</Text>
                                                <Text style={[ TableStyles.bodyRowCol, CommonAnalysisStyle.textGrey, ]}>{ data.mark == data.answer ? "O" : "X" }</Text>
                                                <View style={
                                                    [
                                                        TableStyles.bodyRowCol,
                                                        { height: '100%', flex: 2 },
                                                        data.rate >= 50 && { backgroundColor: '#E7F0FE' }
                                                    ]}>
                                                    <Text style={[ CommonAnalysisStyle.textGrey, { textAlign: 'center' } ]}>{ data.markTopWrong }</Text>
                                                </View>
                                                <View style={
                                                    [
                                                        TableStyles.bodyRowCol,
                                                        { height: '100%' },
                                                        data.rate >= 50 && { backgroundColor: '#E7F0FE' }
                                                    ]}>
                                                    <Text style={[ CommonAnalysisStyle.textGrey, { textAlign: 'center' } ]}>{ data.rate }%</Text>
                                                </View>
                                            </View>
                                        );
                                    })
                                }
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </ScrollableTabView>
            </View>
        );
    }
}

export default DepthAnalysisScreen;

const styles = StyleSheet.create({

});

const TableStyles = StyleSheet.create({
    head: {
        height: 50,
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderTopWidth: 0.5,
        borderTopColor: 'grey',
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey',
    },
    headCol: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    body: {

    },

    bodyRows: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey',
        alignItems: 'center',
    },

    bodyRowCol: {
        flex: 1,
        textAlign: 'center',
        justifyContent: 'center',
    },

    headColFirst: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headColSecondRowFirst: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 35,
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey',
    },
    headColSecondRowSecond: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 35,
    },

    bodyRowsColFirst: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    bodyRowsColOthers: {
        flex: 2,
        textAlign: 'center',
        justifyContent: 'center',
    },
    bodyRowsColOthersTextMax: {
        color: '#EA5650',
    },
    bodyRowsColOthersTextMin: {
        color: '#5D97E6',
    },
});

