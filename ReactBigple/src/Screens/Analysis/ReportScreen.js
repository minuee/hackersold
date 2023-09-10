import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Picker,
    PickerIOS,
    Platform,
    Dimensions,
    Animated,
    ScrollView,
    SafeAreaView,
} from 'react-native';

import {ScrollableTabView, ScrollableTabBar} from '@valdio/react-native-scrollable-tabview'

import {
    ScrollableTab,
    Tabs,
    Tab,
} from 'native-base';

import ScoreAnalysisScreen from './Report/ScoreAnalysisScreen';
import TestLevelScreen from './Report/TestLevelScreen';
import DepthAnalysisScreen from './Report/DepthAnalysisScreen';
import WeaknessScreen from './Report/WeaknessScreen';
import CommentScreen from './Report/CommentScreen';

const NAVBAR_HEIGHT = 0;
const {width: SCREEN_WIDTH} = Dimensions.get("window");
const COLOR = "#cccccc";
const Activity_COLOR = "#ffffff";
const TAB_PROPS = {
    tabStyle: {width: SCREEN_WIDTH / 5, backgroundColor: COLOR,},
    activeTabStyle: {width: SCREEN_WIDTH / 5, backgroundColor: Activity_COLOR},
    textStyle: {color: "#ffffff", fontWeight: 'bold',},
    activeTextStyle: {color: "#3580E1"}
};


class ReportScreen extends Component {

    scroll = new Animated.Value(0);
    headerY;

    constructor(props) {
        super(props);
        this.state = {
            focusTab : 0
        }

        this.headerY = Animated.multiply(Animated.diffClamp(this.scroll, 0, NAVBAR_HEIGHT), -1);
    }

    setStateForTabChange = (e) => {
        this.setState({focusTab: e});
    }

    render() {
        const tabY = Animated.add(this.scroll, this.headerY);

        return(
            <View style={styles.container}>
                {/* Picker */}
                {Platform.OS == 'ios' ? null :
                    <View style={ styles.containerTop }>
                            <Picker
                                style={{ height: 30, width: '100%', backgroundColor: '#FFFFFF' }}
                                itemStyle={{ fontSize: 17, }}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({language: itemValue})
                                }
                                mode='dialog'>
                                <Picker.Item label="RC - TEST01 (400/445, 2018-01-12 16:32)" value="RC - TEST01 (400/445, 2018-01-12 16:32)"/>
                            </Picker>
                    </View>
                }

                {/* 하단 */}
                <View style={styles.conatinerBottom}>
                    {/* 탭 영역 */}
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
                        tabBarPosition="top"
                    >
                        <SafeAreaView style={{flex: 1}} tabLabel='성적분석'>
                            <ScoreAnalysisScreen screenProps={this.props.screenProps} />
                        </SafeAreaView>
                        <SafeAreaView style={{flex: 1}} tabLabel='난이도'>
                            <TestLevelScreen screenProps={this.props.screenProps} />
                        </SafeAreaView>
                        <SafeAreaView style={{flex: 1}} tabLabel='심층분석'>
                            <DepthAnalysisScreen screenProps={this.props.screenProps} />
                        </SafeAreaView>
                        <SafeAreaView style={{flex: 1}} tabLabel='취약점'>
                            <WeaknessScreen screenProps={this.props.screenProps} />
                        </SafeAreaView>
                        <SafeAreaView style={{flex: 1}} tabLabel='코멘트'>
                            <CommentScreen screenProps={this.props.screenProps} />
                        </SafeAreaView>

                    </ScrollableTabView>

                    {/*
                    <Tab heading="성적분석" {...TAB_PROPS}>
                        <ScoreAnalysisScreen screenProps={this.props.screenProps}/>
                    </Tab>
                    <Tab heading="난이도" {...TAB_PROPS}>
                        <TestLevelScreen screenProps={this.props.screenProps}/>
                    </Tab>
                    <Tab heading="심층분석" {...TAB_PROPS}>
                        <DepthAnalysisScreen screenProps={this.props.screenProps}/>
                    </Tab>
                    <Tab heading="취약점" {...TAB_PROPS}>
                        <WeaknessScreen screenProps={this.props.screenProps}/>
                    </Tab>
                    <Tab heading="코멘트" {...TAB_PROPS}>
                        <CommentScreen screenProps={this.props.screenProps}/>
                    </Tab>

                    <ScrollView style={styles.containerTap}>
                        <View style={styles.subContainer}>
                            <Animated.ScrollView
                                scrollEventThrottle={1}
                                bounces={false}
                                showVerticalScrollIndicator={false}
                                style={styles.wrapper}
                                contentContainerStyle={{paddingTop: NAVBAR_HEIGHT}}
                                onScroll={Animated.event(
                                    [{nativeEvent: {contentOffset: {y: this.scroll}}}],
                                    {useNativeDriver: true},
                                )}
                                overScrollMode="never">
                                <View>
                                    <Tabs renderTabBar={(props) =>
                                        <Animated.View
                                            style={[{
                                                transform: [{translateY: tabY}],
                                                zIndex: 1,
                                                width: "100%",
                                                backgroundColor: COLOR,
                                            }, Platform.OS === "ios" ? {paddingTop: 0} : null]}>
                                            <ScrollableTab {...props} underlineStyle={{ backgroundColor: 'white' }}/>
                                        </Animated.View>
                                    }>
                                        <Tab heading="성적분석" {...TAB_PROPS}>
                                            <ScoreAnalysisScreen screenProps={this.props.screenProps}/>
                                        </Tab>
                                        <Tab heading="난이도" {...TAB_PROPS}>
                                            <TestLevelScreen screenProps={this.props.screenProps}/>
                                        </Tab>
                                        <Tab heading="심층분석" {...TAB_PROPS}>
                                            <DepthAnalysisScreen screenProps={this.props.screenProps}/>
                                        </Tab>
                                        <Tab heading="취약점" {...TAB_PROPS}>
                                            <WeaknessScreen screenProps={this.props.screenProps}/>
                                        </Tab>
                                        <Tab heading="코멘트" {...TAB_PROPS}>
                                            <CommentScreen screenProps={this.props.screenProps}/>
                                        </Tab>
                                    </Tabs>
                                </View>
                            </Animated.ScrollView>
                        </View>
                    </ScrollView>
                    */}
                </View>
            </View>
        );
    }
}

export default ReportScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2E2E2'
    },
    containerTop: {
        alignItems: 'center',
        padding: 10,
    },
    conatinerBottom: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerTap: {
        flex: 1,
        backgroundColor: '#E2E2E2',
    },
    subContainer: {
    },
    wrapper: {
        zIndex: 0,
        height: "100%",
        elevation: -1
    }
})