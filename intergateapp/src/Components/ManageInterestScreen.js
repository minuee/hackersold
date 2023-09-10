import React, { Component } from 'react';
import { StyleSheet, Dimensions, StatusBar, View, Text, ScrollView, TouchableHighlight, Platform, } from 'react-native';
import { Header } from 'react-navigation-stack';
import SortableListView from 'react-native-sortable-listview';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

import CommonStyle from '../Styles/CommonStyle';

const {height: WINDOW_HEIGHT, width: WINDOW_WIDTH} = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Platform.OS == 'android' ? StatusBar.currentHeight : getStatusBarHeight();
const NAVI_BAR_HEIGHT = Header.HEIGHT;

// 타이틀 높이
const TITLE_HEIGHT_RATIO = 13;
const TITLE_HEIGHT = WINDOW_HEIGHT / TITLE_HEIGHT_RATIO;

// 현재 관심분야 아이템 우측 너비
const CURRENT_INTEREST_ITEM_HEIGHT = WINDOW_HEIGHT / 12;
const CURRENT_INTEREST_ITEM_RIGHT_WIDTH = WINDOW_WIDTH / 6;

// 현재 관심 분야 편집 모드
const MODIFY_MODE_DELETE_CURRENT = 'delete';
const MODIFY_MODE_REORDER_CURRENT = 'reorder';

const data_current_interest = [
    { idx: 1, title: '토익',  },
    { idx: 2, title: '토플', },
    { idx: 3, title: '중국어', },
    { idx: 4, title: '토익스피킹', },
    { idx: 5, title: '오픽', },
    { idx: 6, title: '영어문법', },
    { idx: 7, title: '중학영어', },
    { idx: 8, title: '텝스', },
    { idx: 9, title: '지텔프(G-TELP)', },
    { idx: 10, title: 'GRE', },
    { idx: 11, title: 'IELTS', },
    { idx: 12, title: 'TOPIK', },
    { idx: 13, title: 'SAT', },
    { idx: 14, title: '일본어', },
    { idx: 15, title: '9급 공무원', },
    { idx: 16, title: '7급 공무원', },
    { idx: 17, title: '군무원', },
    { idx: 18, title: '법원직', },
    { idx: 19, title: '계리직', },
];

export default class ManageInterestScreen extends Component {

    //네비게이션바 설정(헤더 스타일 EXPORT)
    static navigationOptions = {
        headerStyle: {
            elevation: 0,
            shadowOpacity: 0
        },
        headerTitle: '',
        headerTitleStyle: {
            flexGrow: 1,
            textAlign: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
        },
        headerRight: <View></View>,
    }

    constructor(props) {
        super(props);
        this.state = {
            modeForCurInterest: MODIFY_MODE_REORDER_CURRENT, //현재 관심 분야 리스트
            dataCurInterest:  data_current_interest, //현재 관심 분야 리스트
        }
    }

    /*
    <View styles={styles.currentInterestItem}>
        <View style={styles.leftAreaForCurIntItem}>
            <Text>{data.idx + '/' + data.title}</Text>
        </View>

        <View style={styles.rightAreaForCurIntItem}>
            <Icon
                name="bars"
                size={25}/>
        </View>
    </View>
    */

    _renderRow = (data) => {
        return (
            <TouchableHighlight>
                <View style={styles.currentInterestItem}>
                    <Text>{data.idx + '/' + data.title}</Text>
                    <Icon name='bars' size={25} />
                </View>
            </TouchableHighlight>
        );
    }

    _onChangeOrder = (nextOrder) => {
        console.log('onChangeOrder(nextOrder) : ' + nextOrder);
    };

    _onReleaseRow = (key, currentOrder) => {
        console.log('onReleaseRow(key, currentOrder) : ' + key + ', ' + currentOrder);
    };

    render() {
        return(
            <ScrollView style={styles.container}>
                {/* 현재 관심 분야 */}
                <View style={styles.currentInterest}>
                    {/* 타이틀 */}
                    <View style={[ CommonStyle.borderThemeTapGrayBold, styles.currentInterestTitle ]}>
                        <Text style={[ CommonStyle.textGrayLight, styles.currentInterestTitleText ]}>
                            현재 관심 분야
                        </Text>
                    </View>

                    {/* 리스트 */}
                    <View style={styles.currentInterestList}>
                        {/*
                        <SortableList
                            data={this.state.dataCurInterest}
                            renderRow={this._renderRow}
                            onChangeOrder={this._onChangeOrder}
                            onReleaseRow={this._onReleaseRow} />
                        */}

                        <SortableListView
                            style={{flex: 1, marginBottom: 0}}
                            data={this.state.dataCurInterest}
                            renderRow={row => this._renderRow(row)} />
                    </View>
                </View>

                {/* 관심 분야 추가 */}
                <View style={styles.targetInterest}>
                    {/* 타이틀 */}
                    <View style={[ CommonStyle.borderThemeTapGrayBold, styles.targetInterestTitle ]}>
                        <Text style={[ CommonStyle.textGrayLight, styles.targetInterestTitleText ]}>
                            관심 분야 추가
                        </Text>
                    </View>
                    {/* 리스트 */}
                    <View style={styles.targetInterestList}>

                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    currentInterest: {

    },
    currentInterestTitle: {
        width: WINDOW_WIDTH,
        height: TITLE_HEIGHT,
        justifyContent: 'center',
    },
    currentInterestTitleText: {
        paddingLeft: 10,
    },
    currentInterestList: {
        flex: 1,
    },
    currentInterestItem: {
        flexDirection: 'row',
        height: CURRENT_INTEREST_ITEM_HEIGHT,
    },
    leftAreaForCurIntItem: {
        justifyContent: 'center',
        width: WINDOW_WIDTH - CURRENT_INTEREST_ITEM_RIGHT_WIDTH,
        height: CURRENT_INTEREST_ITEM_HEIGHT,
        backgroundColor: '#FF0000',
    },
    rightAreaForCurIntItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: CURRENT_INTEREST_ITEM_RIGHT_WIDTH,
        height: CURRENT_INTEREST_ITEM_HEIGHT,
        backgroundColor: '#00FF00',
    },
    targetInterest: {

    },
    targetInterestTitle: {
        width: WINDOW_WIDTH,
        height: TITLE_HEIGHT,
        justifyContent: 'center',
    },
    targetInterestTitleText: {
        paddingLeft: 10,
    },
    targetInterestList: {

    },
});