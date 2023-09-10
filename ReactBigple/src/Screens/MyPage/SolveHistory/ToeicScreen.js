import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
    SafeAreaView,
    Modal,
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import {ListItem, Button} from 'react-native-elements';
const {width: SCREEN_WIDTH} = Dimensions.get('window');

import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../../Ducks/Actions/MainActions';

import EmptyResultScreen from '../../../Components/EmptyResultScreen'; // 문제풀이 없음 템플릿

import CommonStyle from '../../../Styles/CommonStyle';

const ItemSubtitle = ({item}) => {
    return (
        <View style={{flexDirection: 'row'}}>
            <Text style={[CommonStyle.font12, CommonStyle.flex1, styles.itemSubTitleText]}>{item.date}</Text>
            <Text style={[CommonStyle.font12, CommonStyle.flex1, styles.itemSubTitleText, CommonStyle.textBlue]}>{item.correctScore}/{item.totalScore} ({(item.correctScore/item.totalScore)*100}%)</Text>
        </View>
    );
};

//무료 모의고사 풀기 클릭시 홈으로 이동
const resetHomeAction = StackActions.reset({
    index: 0,
    key: null,
    actions: [NavigationActions.navigate({routeName: 'NavHomeScreen'})],
});
//교재풀이페이지를 초기로 설정
const resetQuestionAction = StackActions.reset({
    index: 0,
    key: null,
    actions: [NavigationActions.navigate({routeName: 'NavQuestionScreen'})],
});

class ToeicScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            thisFocus: this.props.screenState.thisFocus,
            focusTab: this.props.screenState.focusTab,
            firstselectTab: true,
            // modalVisible: false,
            nav_home: this.nav_home.bind(this),
            nav_test: this.nav_test.bind(this),
            rcItems: [
                {
                    index: 1,
                    title: '해커스 토익 실전 1000제 2 RC [2019 최신개정판]',
                    date: '2020-01-17 18:34:54',
                    correctScore: 3,
                    totalScore: 100,
                },
                {
                    index: 1,
                    title: 'RC 해커스 프리미엄 토익 모의고사 (vol.2)',
                    date: '2020-01-03 12:25:55',
                    correctScore: 80,
                    totalScore: 100,
                },
            ],
            lcItems: [],
        };
    }

    UNSAFE_componentWillMount() {
        console.log('toeic UNSAFE_componentWillMount');

        this.setState({
            loading: true,
            firstselectTab: true,
        });
    }

    componentDidMount() {
        console.log('toeic componentDidMount');
        setTimeout(() => {
            this.setState({loading: false});
        }, 500);
    }

    UNSAFE_componentWillUnmount() {
        console.log('toeic UNSAFE_componentWillUnmount');
    }

    changeTabs = async newvalue => {
        this.setState({
            firstselectTab: newvalue,
            loading: true,
        });

        setTimeout(() => {
            this.setState({loading: false});
        }, 500);
    };

    //무료 모의고사 풀기 클릭시 메인 > 홈으로 이동
    nav_home = () => {
        // this.props.screenProps.navigation.dispatch(resetHomeAction);
        this.props.screenProps.navigation.navigate('NavHomeScreen', {isVal : 1111 });
    }
    // 교잴풀기 클릭시 문제 풀이 페이지 이동
    nav_test = () => {
        // this.props.screenProps.navigation.dispatch(resetQuestionAction);
        this.props.screenProps.navigation.navigate('NavQuestionScreen', { lectureNo : 1 , theme :'TESTTTTT' });
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.IndicatorContainer}>
                    <ActivityIndicator size="large" />
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <View style={styles.headerTitle}>
                        <View
                            style={[
                                styles.heaerTabs,
                                this.state.firstselectTab && styles.seletetab,
                            ]}>
                            <Text
                                style={[
                                    CommonStyle.font16,
                                    CommonStyle.textCenter,
                                ]}
                                onPress={() => this.changeTabs(true)}>
                                RC
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.heaerTabs,
                                !this.state.firstselectTab && styles.seletetab,
                            ]}>
                            <Text
                                style={[
                                    CommonStyle.font16,
                                    CommonStyle.textCenter,
                                ]}
                                onPress={() => this.changeTabs(false)}>
                                LC
                            </Text>
                        </View>
                    </View>
                    <View style={{width: '100%', height: 30, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',}}>
                        <Text style={{fontSize: 12, color: '#555'}}>풀이 이력은 최대 30일까지 유지 됩니다.</Text>
                    </View>
                    <ScrollView>
                        {this.state.firstselectTab ? (
                            this.state.rcItems.length > 0 ? (
                            <View style={styles.firstWrapper}>
                                {this.state.rcItems.map((item, index) => (
                                    <ListItem
                                        key={index}
                                        title={item.title}
                                        titleStyle={CommonStyle.font14, styles.itemTitleText}
                                        subtitle={<ItemSubtitle item={item} />}
                                        // bottomDivider
                                        chevron
                                        onPress={() => {this.props.screenProps.navigation.navigate('SolveDetailScreen', {title: item.title})}}
                                        // onPress={() => {this.props.navigation.navigate('SolveDetailScreen')}}
                                        style={styles.itemList}
                                    />
                                ))}
                            </View>
                            ) : (
                                <View>
                                <Text style={{fontSize: 11}}>기획서에는 문제풀이 바로가기 버튼이 있으나, 실제 앱에서는 구현되지 않음</Text>
                                <EmptyResultScreen screenState={this.state} />
                                </View>
                            )
                        ) : (
                            <View style={styles.firstWrapper}>
                            {this.state.lcItems.length > 0 ? 
                                this.state.lcItems.map((item, index) => (
                                    <ListItem
                                        key={index}
                                        title={item.title}
                                        titleStyle={CommonStyle.font14, styles.itemTitleText}
                                        subtitle={<ItemSubtitle item={item} />}
                                        // bottomDivider
                                        chevron
                                        onPress={() => {this.props.screenProps.navigation.navigate('SolveDetailScreen', {title: item.title})}}
                                        // onPress={() => {this.props.navigation.navigate('SolveDetailScreen')}}
                                        style={styles.itemList}
                                    />
                                ))
                                : (
                                    <View style={{alignItems: 'center', alignContent: 'center', justifyContent: 'center'}}>
                                        <View style={{alignItems: 'center', alignContent: 'center', justifyContent: 'center', width: '80%'}}>
                                            <Text style={{fontSize: 10, color: 'red', backgroundColor: 'yellow'}}>
                                                참고) 기획서에는 문제풀이 바로가기 버튼이 있으나, {'\n'}실제 앱에서는 구현되지 않음
                                            </Text>
                                        </View>
                                        <EmptyResultScreen screenState={this.state} />
                                    </View>
                                )
                            }
                            </View>
                        )}
                    </ScrollView>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    IndicatorContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#ccc',
    },
    selectContainer: {
        flex: 1,
        width: '100%',
        padding: 10,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#ccc',
    },
    firstWrapper: {
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingBottom: 10,
    },
    headerTitle: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        flexDirection: 'row',
    },
    heaerTabs: {
        flex: 1,
        paddingVertical: 9,
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
    },
    seletetab: {
        backgroundColor: '#fff',
        color: '#bbb',
    },
    itemList: {
        borderWidth: 1,
        borderColor: '#efefef',
        marginBottom: 5,
        width: '94%',
    },
    itemTitleText: {
        fontSize: 13,
        marginBottom: 7,
    },
    itemSubTitleText: {
        fontSize: 11,
        color: '#999',
    },
});

function mapStateToProps(state) {
    return {
        selectBook: state.GlabalStatus.selectBook,
        remainTime: state.GlabalStatus.remainTime,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        _updateStatusSelectBook: object => {
            dispatch(ActionCreator.updateStatusSelectBook(object));
        },
    };
}

ToeicScreen.propTypes = {
    selectBook: PropTypes.object,
    remainTime: PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(ToeicScreen);
