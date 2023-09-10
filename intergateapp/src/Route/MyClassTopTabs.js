import React from 'react';
import {SafeAreaView, StyleSheet, Platform, StatusBar } from 'react-native';
import {
  ScrollableTabView,
  ScrollableTabBar,
} from '@valdio/react-native-scrollable-tabview';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import ActionCreator from '../Ducks/Actions/MainActions';

//공통상수
import COMMON_STATES from '../Constants/Common';

import MyLectureScreen from '../Screens/MyClass/MyLectureScreen'; //나의 강의
import MyMP3Screen from '../Screens/MyClass/MyMP3Screen'; //나의 MP3
import MyPracticeScreen from '../Screens/MyClass/MyPracticeScreen'; //학습관리

class MyClassTopTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focusTab: 0,
      beforeFocusTab: 0,
      // moveTopTab: this.moveTopTab.bind(this),
      // getTokenStorage: this.getTokenStorage.bind(this),
      topScrollDisable: true,
      LoginToken: null,
    };
  }

  setStateForTabChange = (e) => {
    this.props._updateStatusNowScroll(true);
    this.props.screenProps.resizeTopHeader(80);
    console.log("to tab",e.i);
    console.log("from tab",e.from);
    this.setState({focusTab: e.i});
    this.setState({beforeFocusTab: e.from});
  }

  render() {
    return (
      <ScrollableTabView
        //style={{ height :20,padding:0,margin:0 }}
        refreshControlStyle={{backgroundColor: 'red'}}
        initialPage={0}
        tabStyle={styles.tabStyle}
        tabBarTextStyle={styles.tabBarTextStyle}
        tabBarActiveTextColor={COMMON_STATES.baseColor}
        tabBarInactiveTextColor="#cccccc"
        tabBarUnderlineStyle={styles.underlineStyle}
        renderTabBar={() => <ScrollableTabBar />}
        onChangeTab={event => {
          this.setStateForTabChange(event);
        }}
        tabBarPosition="top"
        page={this.state.focusTab}
        locked={this.state.topScrollDisable}
        //pullToRefresh={this._pullToRefresh()}
      >
        <SafeAreaView style={{flex: 1}} tabLabel="나의 강의">
          <MyLectureScreen
            screennavigation1={this.props.navigation}
            screenProps={this.props.screenProps}
            screenState={this.state}
          />
        </SafeAreaView>
        <SafeAreaView style={{flex: 1}} tabLabel="나의 MP3">
          <MyMP3Screen
            screennavigation1={this.props.navigation}
            screenProps={this.props.screenProps}
            screenState={this.state}
          />
        </SafeAreaView>
        <SafeAreaView style={{flex: 1}} tabLabel="학습관리">
          <MyPracticeScreen
            screenProps={this.props.screenProps}
            screenState={this.state}
          />
        </SafeAreaView>
      </ScrollableTabView>
    );
  }
}

const styles = StyleSheet.create({
  tabStyle: {
    padding: 0,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarTextStyle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  underlineStyle: {
    height: 3,
    backgroundColor: COMMON_STATES.baseColor,
  },
});

function mapStateToProps(state) {
  return {
    selectBook: state.GlabalStatus.selectBook,
    topFavoriteMenu: state.GlabalStatus.topFavoriteMenu,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    _updateStatusNowScroll: boolean => {
      dispatch(ActionCreator.updateStatusNowScroll(boolean));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyClassTopTabs);
