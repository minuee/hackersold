import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
    Text,
    Animated,
    Platform,
    View,
    Dimensions,
    Image,
    SafeAreaView,
} from 'react-native';

import {ScrollableTabView, ScrollableTabBar} from '@valdio/react-native-scrollable-tabview'

import {
    ScrollableTab,
    Tabs,
    Tab,
} from 'native-base';

import InfoBoxScreen from './InfoBoxScreen';
import AlertBoxScreen from './AlertBoxScreen';

import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

const NAVBAR_HEIGHT = 10;
const {width: SCREEN_WIDTH} = Dimensions.get("window");
const COLOR = "#cccccc";
const Activity_COLOR = "#ffffff";
const TAB_PROPS = {
    tabStyle: {width: SCREEN_WIDTH / 2, backgroundColor: COLOR},
    activeTabStyle: {width: SCREEN_WIDTH / 2, backgroundColor: Activity_COLOR},
    textStyle: {color: "#ffffff"},
    activeTextStyle: {color: "#888888"}
};

class MainScreen extends Component {

    scroll = new Animated.Value(0);
    headerY;

    constructor(props) {
        super(props);
        this.state = {
            isExistRCHistory: true,
            isExistLCHistory: false,
            focusTab : 0,
        }
        this.headerY = Animated.multiply(Animated.diffClamp(this.scroll, 0, NAVBAR_HEIGHT), -1);
    }

    setStateForTabChange = (e) => {
        this.setState({focusTab: e});
    }

    render() {
        //const {navigate} = this.props.navigation;
        const tabY = Animated.add(this.scroll, this.headerY);

        return (
            <ScrollView style={styles.container}>
                <View style={styles.subContainer}>

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
                        <SafeAreaView style={{flex: 1}} tabLabel='RC'>
                            {
                                this.state.isExistRCHistory ? <InfoBoxScreen screenProps={this.props.screenProps}/> : <AlertBoxScreen screenProps={this.props.screenProps}/>
                            }
                        </SafeAreaView>
                        <SafeAreaView style={{flex: 1}} tabLabel='LC'>
                            {
                                this.state.isExistLCHistory ? <InfoBoxScreen screenProps={this.props.screenProps}/> : <AlertBoxScreen screenProps={this.props.screenProps}/>
                            }
                        </SafeAreaView>
                    </ScrollableTabView>

                    {/*
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
                                            marginBottom: 10,
                                        }, Platform.OS === "ios" ? {paddingTop: 0} : null]}>
                                        <ScrollableTab {...props} underlineStyle={{ backgroundColor: 'white' }}/>
                                    </Animated.View>
                                }>
                                <Tab heading="RC" {...TAB_PROPS}>
                                    {
                                        this.state.isExistRCHistory ? <InfoBoxScreen screenProps={this.props.screenProps}/> : <AlertBoxScreen screenProps={this.props.screenProps}/>
                                    }
                                </Tab>
                                <Tab heading="LC" {...TAB_PROPS}>
                                    {
                                        this.state.isExistLCHistory ? <InfoBoxScreen screenProps={this.props.screenProps}/> : <AlertBoxScreen screenProps={this.props.screenProps}/>
                                    }
                                </Tab>
                            </Tabs>
                        </View>
                    </Animated.ScrollView>
                    */}
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2E2E2',
    },
    subContainer: {
        margin: 10
    },
    wrapper: {
        zIndex: 0,
        height: "100%",
        elevation: -1
    }
});

export default MainScreen;