import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, Dimensions, StatusBar, ScrollView, TouchableOpacity, SafeAreaView, } from 'react-native';
import { Button } from 'react-native-elements';
import { Header } from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

import CommonStyle from './CommonStyle';

//테스트 게시판 데이터
const board_list = [
    { idx: 1, type: '공지', title: '★6월 16일 HSK 4~6급 해설특강★출제유형 완성특강 특급 이벤트', interest: '토익', },
    { idx: 2, type: '공지', title: '★6월 16일 HSK 4~6급 해설특강★출제유형 완성특강 특급 이벤트', interest: '토익', },
    { idx: 3, type: '공지', title: '★6월 16일 HSK 4~6급 해설특강★출제유형 완성특강 특급 이벤트', interest: '토익', },
    { idx: 4, type: '공지', title: '★6월 16일 HSK 4~6급 해설특강★출제유형 완성특강', interest: '토익', },
    { idx: 5, type: '공지', title: '★6월 16일 HSK 4~6급 해설특강★출제유형 완성특강', interest: '토익', },
    { idx: 6, type: '일반', title: '4급 성적미션 4급 성적미션 4급 성적미션 4급 성적미션 4급 성적미션 4급 성적미션 4급 성적미션 4급 성적미션 ', interest: '토익', view_count: '9,999,999+', comment_count: '999+', },
    { idx: 7, type: '일반', title: '[only성적] HSK 인강+응시료 0원 무제한패스 (교재 포함)', interest: '토익', view_count: '9,999,999+', comment_count: '999+', },
    { idx: 8, type: '일반', title: '도움이 많이 됐어요', interest: '토익', view_count: '9,999,999+', comment_count: '999+', },
    { idx: 9, type: '일반', title: '도움이 많이 됐어요', interest: '토익', view_count: '9,999,999+', comment_count: '999+', },
    { idx: 10, type: '일반', title: '도움이 많이 됐어요', interest: '토익', view_count: '9,999,999+', comment_count: '999+', },
    { idx: 11, type: '일반', title: '도움이 많이 됐어요', interest: '토익', view_count: '9,999,999+', comment_count: '999+', },
];
/* const board_list = []; */

//테스트 관심분야 데이터
const interest_list = [
    { idx: 1, title: '전체', },
    { idx: 2, title: '영어회화', },
    { idx: 3, title: '중국어', },
    { idx: 4, title: 'PREP', },
    { idx: 5, title: '임용', },
    { idx: 6, title: '영어문법', },
    { idx: 7, title: '중학영어', },
    { idx: 8, title: '텝스', },
    { idx: 9, title: '지텔프(G-TELP)', },
];

// TODO FlatList 응용 - 하단 고정 버튼 연동

// TODO Navigation Bar Height
// https://github.com/react-navigation/react-navigation/issues/2411

// TODO Navigation Bar Border
// https://github.com/react-navigation/react-navigation/issues/2457#issuecomment-334927882

// TODO ScorllView Bottom Check
//

const {height: WINDOW_HEIGHT, width: WINDOW_WIDTH} = Dimensions.get('window');
const STATUSBAR_HEIGHT = 50;
const NAVIBAR_HEIGHT = Header.HEIGHT;

// 헤더 및 푸터 설정
const RATIO_HEIGHT = 13;
const HEADER_HEIGHT = WINDOW_HEIGHT / RATIO_HEIGHT;
const FOOTER_HEIGHT = WINDOW_HEIGHT / RATIO_HEIGHT;

// 헤더 설정
const HEADER_RIGHT_WIDTH = WINDOW_WIDTH / 6;

// 리스트 아이템 설정
const FLAT_ITEM_HEIGHT = WINDOW_HEIGHT / 9;
const FLAT_LEFT_ITEM_WIDTH = WINDOW_WIDTH / 6;

export default class BoardScreen extends Component {

    //네비게이션바 설정(헤더 스타일 EXPORT)
    static navigationOptions = {
        headerStyle: {
            elevation: 0,
            shadowOpacity: 0
        },
        headerTitle: '자유게시판',
        headerTitleStyle: {
            flexGrow: 1,
            textAlign: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
        },
        /*
        headerLeft: <Icon
                        name={'angle-left'}
                        size={40}
                        color={CommonStyle.textGrayBold.color}
                        iconStyle={{ marginLeft: 30, }}
                        onPress={ () => { navigation.goBack() }} />,
        */
        headerRight: <View></View>,
    }

    onPressInterestItem = (idx) => {
        alert('BEFORE : ' + this.state.selectedIdxInterest + ' / AFTER : ' + idx);


        this.setState({
            selectedIdxInterest: idx,
        });
    };

    onPressWriteButton = () => {
        alert('게시글 작성');
    };

    onPressMyButton = () => {
        alert('내 글 확인하기');
    };

    constructor(props) {
        super(props);
        this.state = {
            dataBoard: board_list,
            selectedIdxInterest: interest_list[0].idx,
        };
    }

    render() {
        return (
            <SafeAreaView style={ styles.container }>
                {/* 헤더 */}
                <View style={[ CommonStyle.borderGrayBoldBottom, CommonStyle.borderBottomWidth, styles.header, ]}>
                    <ScrollView
                        style={styles.headerContentWrapper}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}>
                        {
                            interest_list.map((item) => {
                                return (
                                    <Text
                                        style={ this.state.selectedIdxInterest == item.idx
                                            ? [ styles.interestSelectedItemText, CommonStyle.textGrayBold, CommonStyle.textBold ]
                                            : [ styles.interestItemText, CommonStyle.textGrayLight, ]}
                                        onPress={() => this.onPressInterestItem(item.idx)}>
                                        {item.title}
                                    </Text>
                                );
                            })
                        }
                    </ScrollView>
                    <View style={styles.headerController}>
                        <Icon
                            name="plus"
                            size={20}
                            reverse
                            onPress={() => this.props.navigation.navigate('ManageInterestScreen')}/>
                    </View>
                </View>

                {/* 컨텐츠 */}
                <View style={ styles.content }>
                    {
                        this.state.dataBoard.length > 0
                            ?
                            <FlatList
                                style={styles.contentWrapper}
                                data={ this.state.dataBoard }
                                renderItem={({item}) =>
                                    <TouchableOpacity
                                        style={[ CommonStyle.borderLightGrayBottom, styles.contentWrapperItem ]}
                                        onPress={() => alert('게시글 상세 화면(idx : ' + item.idx + ')')}>
                                        {
                                            item.type == '공지' &&
                                            <View style={ styles.leftAreaForNoticeItem }>
                                                <Icon
                                                    name="bell-o"
                                                    size={25}
                                                    reverse/>
                                            </View>
                                        }

                                        <View style={ item.type == '공지' && styles.rightAreaForNoticeItem || styles.rightAreaForNormalItem }>
                                            <Text
                                                style={[ CommonStyle.textGrayBold ]}
                                                numberOfLines={1}>
                                                {item.title}
                                            </Text>
                                            <Text style={[
                                                CommonStyle.textGrayLight,
                                                CommonStyle.fontSizeSmall,
                                                styles.bottomTextOfItem,
                                            ]}>
                                                { item.type == '공지'
                                                && item.interest
                                                || ('조회 수  ' + item.view_count +  '  |  댓글  ' + item.comment_count + '  |  ' + item.interest)
                                                }
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                }/>
                            :
                            <Text style={[ CommonStyle.textGray, styles.contentEmptyText ]}>
                                조건에 맞는 게시글이 없습니다 :)
                            </Text>
                    }
                </View>

                {/* 푸터 */}
                <View style={styles.footer}>
                    <Button
                        title='게시물 작성'
                        containerStyle={ styles.footerButtonContainer }
                        buttonStyle={[ CommonStyle.buttonGray, styles.footerWriteButton, styles.footerButtonContainer ]}
                        titleStyle={ CommonStyle.textGray }
                        onPress={() => this.onPressWriteButton()}/>
                    <Button
                        title='내 글 확인하기'
                        containerStyle={ styles.footerButtonContainer }
                        buttonStyle={[ CommonStyle.buttonGrayBold, styles.footerButtonContainer ]}
                        titleStyle={ CommonStyle.textWhite }
                        onPress={() => this.onPressMyButton()}/>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        height: HEADER_HEIGHT,
    },
    headerContentWrapper: {
        width: WINDOW_WIDTH - HEADER_RIGHT_WIDTH,
        paddingRight: 10,
    },
    interestSelectedItemText: {
        alignSelf: 'center',
        marginLeft: 20,
        marginRight: 20,
        color: '#FF0000',
    },
    interestItemText: {
        alignSelf: 'center',
        marginLeft: 20,
        marginRight: 20,
    },
    headerController: {
        width: HEADER_RIGHT_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        height: WINDOW_HEIGHT - ( STATUSBAR_HEIGHT + NAVIBAR_HEIGHT + HEADER_HEIGHT + FOOTER_HEIGHT ),
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentWrapper: {
        flex: 1,
        width: '100%',
    },
    contentWrapperItem: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
    },
    leftAreaForNoticeItem: {
        width: FLAT_LEFT_ITEM_WIDTH,
        height: FLAT_ITEM_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightAreaForNoticeItem: {
        width: WINDOW_WIDTH - FLAT_LEFT_ITEM_WIDTH,
        height: FLAT_ITEM_HEIGHT,
        justifyContent: 'space-between',
        paddingTop: 15,
        paddingBottom: 15,
        paddingRight: 15,
    },
    rightAreaForNormalItem: {
        width: WINDOW_WIDTH,
        height: FLAT_ITEM_HEIGHT,
        justifyContent: 'space-between',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
    },
    topTextOfItem: {

    },
    bottomTextOfItem: {
        textAlign: 'right',
    },
    contentEmptyText: {

    },
    footer: {
        flexDirection: 'row',
        height: FOOTER_HEIGHT,
    },
    footerButtonContainer: {
        flex: 1,
        height: '100%',
    },
    footerWriteButton: {

    },
    footerMyButton: {
    },
});