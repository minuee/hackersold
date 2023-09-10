import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, PixelRatio, Alert, ActivityIndicator,
} from 'react-native';

import MyMemoContent from './MyMemoContent';
import MyQnaContent from './MyQnaContent';

import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';

import {CustomTextB, CustomText, CustomTextR} from "../../Style/CustomText";
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/AntDesign';
Icon2.loadFont();

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");

//공통상수
import * as getDEFAULT_CONSTANTS from '../../Constants';
import Toast from "react-native-tiny-toast";
import CommonUtil from "../../Utils/CommonUtil";
import {SERVICES} from "../../Constants/Common";

const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

class MyPracticeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            myClassServiceID: props.myClassServiceID,
            showTopButton: false,
            selectMenuTabs: props.screenState.selectMenuTabs,
            contentList: /*props.screenState.contentList,*/ {
                memo:{
                    isSupport: false
                },
                teacherQuestion:{
                    isSupport: true
                },
            },
        }

        console.log('MyPracticeScreen.contructor()', 'props.screenState.contentList = ' + JSON.stringify(props.screenState.contentList))
    }

    componentDidMount() {

    }

    async UNSAFE_componentWillMount() {
        this.setState({
            loading: true,
        }, function() {
           this.getContentList()
        })
    }

    getContentList = async() => {
        const url = SERVICES[this.props.myClassServiceID].apiDomain
            + '/v1/myClass/practice/contents';

        const options = {
            method: 'GET',
            headers: {
                ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
            },
        };

        await CommonUtil.callAPI(url, options, 10000)
            .then(response => {

                console.log('getContentList()', 'response = ' + JSON.stringify(response))

                if (response && response.code === '0000') {
                    this.setState({
                        loading: false,
                        contentList: response.data,
                    });

                    if(this.state.selectMenuTabs == 1) {
                        if(!response.data.memo.isSupport) {
                            this.setState({ selectMenuTabs: 2 })
                            this.props.screenState.updateSelectMenuTabs(2)
                            this.props.updateMyClassModifyModeTarget('qna')
                        } else {
                            this.setState({ selectMenuTabs: 1 })
                            this.props.screenState.updateSelectMenuTabs(1)
                            this.props.updateMyClassModifyModeTarget('memo')
                        }
                    } else {
                        this.setState({ selectMenuTabs: 2 })
                        this.props.screenState.updateSelectMenuTabs(2)
                        this.props.updateMyClassModifyModeTarget('qna')
                    }
                } else {
                    this.setState({
                        loading: false,
                    });
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('컨텐츠 목록을 불러오는데 실패 했습니다.');
                }
            })
            .catch(error => {
                this.setState({
                    loading: false
                });
                Toast.show('시스템 에러: 컨텐츠 목록을 불러오는데 실패 했습니다.');
            });
    }

    deleteMemoList = () => {
        this._MyMemoContent.deleteList()
    }

    deleteQnaList = () => {
        this._MyQnaContent.deleteList()
    }

    toggleWriteMemoModal = () => {
        this._MyMemoContent.toggleWriteMemoModal()
    }

    openWriteQnaModal = () => {
        console.log('MyPracticeScreen > openWriteQnaModal()', 'CALL')
        this._MyQnaContent.openWriteModal()
    }

    openWriteMemoModal = () => {
        this._MyMemoContent.openWriteModal()
    }
    handleOnScroll = async (event) => {
        if (event.nativeEvent.contentOffset.y >= 200) {
            this.setState({
                showTopButton: true,
            });
        } else {
            this.setState({
                showTopButton: false,
            });
        }
    }

    upButtonHandler = async() => {
        try {
            this.ScrollView.scrollTo({ x: 0,  animated: true });
        }catch(e){

        }
    }

    changeMenuTabs = (index) => {
        this.setState({selectMenuTabs: index})
        this.props.screenState.updateSelectMenuTabs(index)

        if(index == 1) {
            this.props.updateMyClassModifyModeTarget('memo')
        } else if(index == 2) {
            this.props.updateMyClassModifyModeTarget('qna')
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.IndicatorContainer}>
                    <ActivityIndicator size="large" />
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <View style={styles.navigator}>
                        <View style={styles.navigatorContainer}>
                            {
                                this.state.contentList.memo.isSupport
                                &&
                                <View style={
                                    this.state.selectMenuTabs == 1
                                        ? styles.navigatorButtonActive
                                        : styles.navigatorButton
                                }>
                                    <TouchableOpacity
                                        onPress={() => this.changeMenuTabs(1)}
                                        style={styles.navigationButtonContainer}>
                                        <View style={
                                            this.state.selectMenuTabs == 1
                                                ? styles.navigationButtonWrapperActive
                                                : styles.navigationButtonWrapper
                                        }>
                                            <CustomTextR style={
                                                this.state.selectMenuTabs == 1
                                                    ? styles.navigationButtonTextActive
                                                    : styles.navigationButtonText
                                            }>
                                                메모장
                                            </CustomTextR>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            }
                            {
                                this.state.contentList.teacherQuestion.isSupport
                                &&
                                <View style={
                                    this.state.selectMenuTabs == 2
                                        ? styles.navigatorButtonActive
                                        : styles.navigatorButton
                                }>
                                    <TouchableOpacity
                                        onPress={() => this.changeMenuTabs(2)}
                                        style={styles.navigationButtonContainer}>
                                        <View style={
                                            this.state.selectMenuTabs == 2
                                                ? styles.navigationButtonWrapperActive
                                                : styles.navigationButtonWrapper
                                        }>
                                            <CustomTextR style={
                                                this.state.selectMenuTabs == 2
                                                    ? styles.navigationButtonTextActive
                                                    : styles.navigationButtonText
                                            }>
                                                선생님께 질문하기
                                            </CustomTextR>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                    </View>

                    <View style={{flex: 1,}}>
                        {
                            this.state.showTopButton
                            &&
                            <TouchableOpacity
                                style={styles.btnGoTopWrap}
                                onPress={e => this.upButtonHandler()}>
                                <Icon2 name="up" size={30} color="#000"/>
                            </TouchableOpacity>
                        }
                        {/*
                        <ScrollView
                            ref={(ref) => { this.ScrollView = ref; }}
                            style={styles.content}
                            onScroll={e => this.handleOnScroll(e)}>
                            {
                                this.state.selectMenuTabs == 1
                                    ? <MyMemoContent/>
                                    : <MyQnaContent/>
                            }
                        </ScrollView>
                        */}
                        <View style={styles.content}>
                            {
                                ( !this.state.loading && this.state.selectMenuTabs == 1 )
                                    ? <MyMemoContent
                                        ref={(component) => this._MyMemoContent = component}
                                        screenState={this.state}/>
                                    : <MyQnaContent
                                        ref={(component) => this._MyQnaContent = component}
                                        screenState={this.state}/>
                            }
                        </View>
                    </View>
                </View>
            );
        }
    }
}

MyPracticeScreen.propTypes = {
    myClassModifyModeTarget: PropTypes.string,
    myClassServiceID: PropTypes.string,
};

const mapStateToProps = state => {
    return {
        myClassModifyModeTarget: state.GlabalStatus.myClassModifyModeTarget,
        myClassServiceID: state.GlabalStatus.myClassServiceID,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateMyClassModifyModeTarget:(string) => {
            dispatch(ActionCreator.updateMyClassModifyModeTarget(string));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(MyPracticeScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    navigator: {
        height: 67,
        alignItems: 'center',
        justifyContent: 'center',

        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 20,
        backgroundColor: DEFAULT_COLOR.input_bg_color,
    },
    navigatorContainer: {
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#E3E5E5',
        flexDirection: 'row',
        overflow: 'hidden',
    },
    navigatorButton: {
        flex: 1,
        height: 37,
    },
    navigatorButtonActive: {
        flex: 1,
        height: 37,
    },
    navigationButtonContainer: {
        flex: 1,
        backgroundColor: DEFAULT_COLOR.base_color_fff,
    },
    navigationButtonWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        backgroundColor: DEFAULT_COLOR.base_color_fff,
        overflow: 'hidden',
    },
    navigationButtonWrapperActive: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        backgroundColor: '#0e3a48',
        overflow: 'hidden',
    },
    navigationButtonText: {
        alignSelf: 'center',
        textAlign: 'center',
        color: '#444444',
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
        lineHeight: PixelRatio.roundToNearestPixel(7.1),
        letterSpacing: -0.7,
    },
    navigationButtonTextActive: {
        alignSelf: 'center',
        textAlign: 'center',
        color: DEFAULT_COLOR.base_color_fff,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
        lineHeight: PixelRatio.roundToNearestPixel(7.1),
        letterSpacing: -0.7,
    },
    content: {
        flex: 1,
        backgroundColor: DEFAULT_COLOR.base_color_fff,
    },
    btnGoTopWrap: {
        position: 'absolute',
        bottom: 70,
        right: 20,
        width: 50,
        height: 50,
        paddingTop: 5,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 25,
        opacity: 0.5
    },
});
