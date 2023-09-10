import React, {Component} from 'react';
import {
    Dimensions, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Linking, Image, ScrollView,
    RefreshControl, Modal, PixelRatio, SafeAreaView,
} from 'react-native';
import ActionCreator from '../../Ducks/Actions/MainActions';
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import AutoHeightImage from 'react-native-auto-height-image';
import LinearGradient from "react-native-linear-gradient";
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/AntDesign';
Icon2.loadFont();
import AsyncStorage from '@react-native-community/async-storage';
import 'moment/locale/ko'
import  moment  from  "moment";

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import { CustomText, CustomTextB, CustomTextR } from '../../Style/CustomText';
import Toast from "react-native-tiny-toast";
import {SERVICES} from "../../Constants/Common";
import CommonUtil from "../../Utils/CommonUtil";
const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

//순서 정렬 항목
//const ORDER_TYPE_TOTAL = 'total';
const ORDER_TYPE_LATEST = 'regDateTime';
const ORDER_TYPE_DEADLINE = 'endDateTime';

//const ORDER_TYPE_NAME_TOTAL = '전체';
const ORDER_TYPE_NAME_LATEST = '최신순';
const ORDER_TYPE_NAME_DEADLINE = '마감순';

class IntroScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            moreLoading: false,
            currentPage: 1,
            lastPage: 0,
            historyTmp : [],
            refreshing : false,
            thisFocus : this.props.screenState.nowFocus,
            focusTab : this.props.screenState.focusTab,
            showTopButton : false,
            orderType: ORDER_TYPE_LATEST,
            showModal: false,
            heightScrollView: 0,
            filterList: [
                {index: 1, title: '최신순', orderBy: 'regDateTime',},
                {index: 2, title: '마감순', orderBy: 'endDateTime',},
            ],
            selectedFilterIndex: 1,
            selectedFilterOrderBy: 'regDateTime',
            items: []
        };
    }

    UNSAFE_componentWillMount() {
        /*
        this.setState({
            loading: true
        });
        */
        this.setHistory()        
    }

    componentDidMount() {
        this.setState({ loading: true }, function() {
            this.loadItem();
        });
    }

    UNSAFE_componentWillUnmount() {
        
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if ( nextProps.screenState.focusTab !== this.props.screenState.focusTab ) {
            //this.setState({ loading : true });
            //this.refresh_end();
            this.upButtonHandler();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    setHistory = async() => {        
        await AsyncStorage.getItem('history', (error, result) => {
            {   
                if(result) {
                    let resultTmp = JSON.parse(result);
                    if ( resultTmp.length > DEFAULT_CONSTANTS.recentlyHistoryLimit ) {                        
                        let resultTmp2 = resultTmp.sort((a, b) => ( b.date > a.date) ? 1 : -1);
                        let resultTmp3 = resultTmp2.filter((info,index) => {
                            return index < DEFAULT_CONSTANTS.recentlyHistoryLimit
                         } )                        
                        this.setState({ historyTmp: resultTmp3})
                    }else{                        
                        this.setState({ historyTmp: resultTmp})
                    }
                    
                }else{
                    this.setState({historyTmp : []})
                }
            }
        });   
    }

    openBrowser = async(index) => {
        await this.saveToStorage(index);        
        Linking.openURL(this.state.items[index].linkUrl);
    }

    stroageInsert = async(target,object) => {
        await target.push(object);        
        AsyncStorage.setItem('history', JSON.stringify(target));
    }

    checkInsertOrUpdate = async( newData,idx) => {   
       
        let historyTmp = this.state.historyTmp;        
        let isIndexOf = historyTmp.findIndex(            
            info => ( info.keyindex === 'event' + this.state.items[idx].index )
        );  
        newHistory = await historyTmp.filter(info => info.keyindex !== 'event' + this.state.items[idx].index );
        console.log('isIndexOf',isIndexOf)
        if (isIndexOf != -1 )  { //update 
            console.log('update')                    
            this.stroageInsert(newHistory,newData,);
        }else{ // insert
            console.log('insert')
            this.stroageInsert(historyTmp,newData);
        }
    

    }

    saveToStorage = async(idx) => {

        if ( typeof this.state.items[idx].linkUrl !== 'undefined' && typeof this.state.items[idx].EventImagePath !== 'undefined' ) {
            let CurrentDateTimeStamp = moment().unix();
            //let setMyInterestCode = typeof this.props.myInterestCodeOne.name !== 'undefined' ? this.props.myInterestCodeOne.name : 'all';
            let newData = { interestCode : 'all',interestName : 'all',keyindex : 'event' + this.state.items[idx].index, type:'event',urllink : this.state.items[idx].linkUrl, navigate:'BrowwerLink',idx : this.state.items[idx].linkUrl,date : CurrentDateTimeStamp,imageurl : this.state.items[idx].EventImagePath,title:null};

            this.checkInsertOrUpdate( newData,idx);
        }
    }

    getOrderTypeName = (orderType) => {
        switch(orderType) {
            case ORDER_TYPE_DEADLINE:
                return ORDER_TYPE_NAME_DEADLINE;
            default:
                return ORDER_TYPE_NAME_LATEST;
        }
    }

    moreLoading = async() => {
        if(this.state.currentPage < this.state.lastPage) {
            console.log('moreLoading()', '추가로 로딩합니다.')
            this.setState({
                currentPage: this.state.currentPage + 1,
            }, function() {
                this.loadItem()
            });
        } else {
            console.log('moreLoading()', '더이상 로딩할 수 없습니다. (this.state.currentPage = ' + this.state.currentPage + ')')
        }
    };

    loadItem = async() => {

        //let interestCode = this.props.myInterestCodeOne.code;
        const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/event?page=' + this.state.currentPage
                        + '&paginate=10&orderBy=' + this.state.selectedFilterOrderBy //+ '&interestCode=' + interestCode;

        await CommonUtil.callAPI(url)
            .then(response => {
                if (response && response.code === '0000') {
                    this.setState({
                        loading: false,
                        items: [...this.state.items, ...response.data.events.data],
                        lastPage: response.data.events.last_page,
                    })
                }else {
                    this.setState({loading: false});
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('이벤트 목록을 불러오는데 실패 했습니다.');
                }}).catch(error => {
                console.log(error)
                this.setState({
                    loading: false,
                });
                Toast.show('시스템 에러: 이벤트 목록을 불러오는데 실패 했습니다.');
            });
    }

    refreshItem = async() => {
        const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/event?page=' + this.state.currentPage
            + '&paginate=10&orderBy=' + this.state.selectedFilterOrderBy //+ '&interestCode=' + interestCode;

        await CommonUtil.callAPI(url)
            .then(response => {
                if (response && response.code === '0000') {
                    this.setState({
                        items: response.data.events.data,
                        lastPage: response.data.events.last_page,
                    })
                }

                else {
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('이벤트 목록을 불러오는데 실패 했습니다.');
                }}).catch(error => {
                console.log(error)
                Toast.show('시스템 에러: 이벤트 목록을 불러오는데 실패 했습니다.');
            });
    }

    /*
    loadMoreItem = async(code) => {
        //this.loadItem();
        console.log('loadMoreItem()')
    }
    */

    handleOnScroll = async(event) => {

        this.props._updateStatusNowScrollY(event.nativeEvent.contentOffset.y);     
        this.props.screenProps.resizeTopHeader(event.nativeEvent.contentOffset.y)

        if ( event.nativeEvent.contentOffset.y >= 200 ) {
            //this.props.screenProps.resizeTopHeader(DEFAULT_CONSTANTS.hideTopHeight);
            //this.props._updateStatusNowScroll(false);
            //this.props._updateStatusShowBottomBar(true);
            this.setState({ showTopButton: true })
        }else{
            //this.props.screenProps.resizeTopHeader(DEFAULT_CONSTANTS.topHeight);
            //this.props._updateStatusNowScroll(true);
            //this.props._updateStatusShowBottomBar(false);
            this.setState({ showTopButton: false })
        }
    }

    upButtonHandler = async() => {
        try {
            this.ScrollView.scrollTo({ x: 0,  animated: true });
        }catch(e){

        }
    };

    _onRefresh = () => {
        console.log('_onRefresh()')
        this.setState({refreshing: true});
        /*
        fetchData().then(() => {
          this.setState({refreshing: false});
        });
        */

        this.setState({
            currentPage: 1,
            lastPage: 0,
        }, function() {
            this.refreshItem();
        })

       setTimeout(
        () => {
            this.setState({ refreshing: false});
        },500)
    }

    toggleModal = () => {
        this.setState({ showModal: !this.state.showModal })
    };

    selectFilter = (filterIndex, orderBy) => {
        this.setState({
            currentPage: 1,
            lastPage: 0,
            items: [],
            selectedFilterIndex: filterIndex,
            selectedFilterOrderBy: orderBy,
        }, function() {
            this.toggleModal()
            this.loadItem()
        })
    }

    getSelectedFilterTitle = () => {
        for (let filterItem of this.state.filterList) {
            if(filterItem.index == this.state.selectedFilterIndex) {
                return filterItem.title;
            }
        }
    }

    onLayoutScrollView = (event) => {
        const layout = event.nativeEvent.layout;

        console.log('height',layout.height);

        this.setState({
            heightScrollView: layout.height
        });
    }

    

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        } else {
            return (
                <View style={styles.container}>
                    {
                        ( this.state.items.length != 0 && this.state.showTopButton )
                        &&
                        <TouchableOpacity
                            style={styles.btnGoTopWrap}
                            onPress={e => this.upButtonHandler()}
                        >
                            <Image
                                style={{
                                    width: 43,
                                    height: 43,
                                }}
                                source={require('../../../assets/icons/btn_top.png')}/>
                        </TouchableOpacity>
                    }
                    {
                        this.state.items.length == 0
                            &&
                                <ScrollView
                                    ref={(ref) => {
                                        this.ScrollView = ref;
                                    }}
                                    indicatorStyle={'white'}
                                    scrollEventThrottle={16}
                                    keyboardDismissMode={'on-drag'}
                                    onScroll={e => this.handleOnScroll(e)}
                                    contentContainerStyle={styles.contentEmptyContainer}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.refreshing}
                                            onRefresh={this._onRefresh}
                                        />
                                    }
                                >
                                    <View style={styles.contentEmpty}>
                                        <CustomText
                                            style={{
                                                fontSize: DEFAULT_TEXT.head_small,
                                                color: DEFAULT_COLOR.base_color_666,
                                            }}>
                                            진행 중인 이벤트가 없습니다.
                                        </CustomText>
                                    </View>
                                </ScrollView>
                            ||
                                <ScrollView
                                    ref={(ref) => {
                                        this.ScrollView = ref;
                                    }}
                                    indicatorStyle={'white'}
                                    scrollEventThrottle={16}
                                    keyboardDismissMode={'on-drag'}
                                    onScroll={e => this.handleOnScroll(e)}
                                    onMomentumScrollEnd = {({nativeEvent}) => {
                                    }}
                                    onScrollEndDrag ={({nativeEvent}) => {
                                        this.moreLoading()
                                    }}
                                    style={styles.contentExist}
                                    refreshControl={
                                        <RefreshControl
                                          refreshing={this.state.refreshing}
                                          onRefresh={this._onRefresh}
                                        />
                                    }
                                >
                                    <View style={styles.header}>
                                        <TouchableOpacity
                                            style={styles.headerWrapper}
                                            onPress={() => this.toggleModal()}>
                                            <CustomTextR
                                                style={{
                                                    fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
                                                    color: '#444444',
                                                    marginRight: 10,
                                                    lineHeight: DEFAULT_TEXT.body_14 * 1.42,
                                                }}>
                                                {this.getSelectedFilterTitle()}
                                            </CustomTextR>
                                            <Image
                                                style={{width: 16, height: 14}}
                                                source={require('../../../assets/icons/btn_sort.png')}/>
                                        </TouchableOpacity>
                                    </View>

                                    {
                                        this.state.items.map((item, index) => {
                                            return (

                                                <TouchableOpacity
                                                    key={index}
                                                    style={{ marginBottom: 10,}}
                                                    onPress={() => this.openBrowser(index)}>
                                                    <AutoHeightImage
                                                        width={SCREEN_WIDTH}
                                                        source={{uri: item.EventImagePath}}
                                                        resizeMode='stretch'/>
                                                </TouchableOpacity>
                                            );
                                        })
                                    }
                                    {/*
                                    {this.state.currentPage < this.state.lastPage && (
                                        <TouchableOpacity style={{width: '100%', height: 40, marginBottom: 10, alignItems: 'center', justifyContent: 'center'}} onPress={() => this.moreLoading()}>
                                            <CustomTextR>더보기</CustomTextR>
                                        </TouchableOpacity>
                                    )}
                                    */}
                                </ScrollView>
                    }
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.showModal}
                        onRequestClose={() => {
                            this.setState({showModal:false})
                        }}
                        animationInTiming={300}
                        animationOutTiming={300}
                        hideModalContentWhileAnimating
                        isVisible={this.state.showModal}>

                        <SafeAreaView style={[styles.modalContainer]}>
                            <View style={styles.modalBackgrounder}>

                            </View>

                            <View style={styles.modalWrapper}>
                                <View style={styles.modalContent}>
                                    <ScrollView
                                        style={styles.modalScroll}
                                        onLayout={(event) => this.onLayoutScrollView(event)}
                                        indicatorStyle='black'>
                                        {
                                            this.state.filterList.map((item, index2) => {
                                                return (
                                                    <View style={styles.modalItem} key={index2}>
                                                        <TouchableOpacity
                                                            style={styles.modalItemWrapper}
                                                            onPress={() => this.selectFilter(item.index, item.orderBy)}>
                                                            <View style={styles.modalItemIconSelectedWrapperLeft}>
                                                            </View>

                                                            {
                                                                this.state.selectedFilterIndex == item.index
                                                                    ?
                                                                        <CustomTextB style={styles.modalItemTextSelected}>
                                                                            {item.title}
                                                                        </CustomTextB>
                                                                    :
                                                                        <CustomTextR style={styles.modalItemText}>
                                                                            {item.title}
                                                                        </CustomTextR>
                                                            }
                                                            <View style={styles.modalItemIconSelectedWrapperRight}>
                                                                {
                                                                    this.state.selectedFilterIndex == item.index
                                                                    &&
                                                                    <Image
                                                                        style={styles.modalItemIconSelected}
                                                                        source={require('../../../assets/icons/btn_check_list.png')}/>
                                                                }
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            })
                                        }
                                        <LinearGradient
                                            pointerEvents={'none'}
                                            colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0.95)", "rgba(255,255,255,1.00)"]}
                                            //colors={["rgba(255,255,255,0)", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.9)"]}
                                            locations={[0, 0.70, 1]}
                                            style={{position: "absolute", height: this.state.heightScrollView, width: "100%", }}/>
                                    </ScrollView>
                                    <View style={styles.cancelButton}>
                                        <TouchableOpacity
                                            style={styles.cancelButtonWrapper}
                                            onPress={() => this.toggleModal()}>
                                            <CustomTextR styles={styles.cancelButtonText}>취소</CustomTextR>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </SafeAreaView>
                    </Modal>
                </View>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        showBottomBar: state.GlabalStatus.showBottomBar.topHeight ,
        selectBook: state.GlabalStatus.selectBook,    
        nowScrollY: state.GlabalStatus.nowScrollY,    
        topFavoriteMenu: state.GlabalStatus.topFavoriteMenu,   
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne
    };
}


function mapDispatchToProps(dispatch) {
    return {
        _updateStatusNowScroll:(boolen) => {
            dispatch(ActionCreator.updateStatusNowScroll(boolen));
        },
        _updateStatusNowScrollY:(number) => {
            dispatch(ActionCreator.updateStatusNowScrollY(number));
        },
        _updateStatusShowBottomBar:(boolen) => {
            dispatch(ActionCreator.updateStatusShowBottomBar(boolen));
        }
    };
}

IntroScreen.propTypes = {
    showBottomBar: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(IntroScreen);

const styles = StyleSheet.create({
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : DEFAULT_COLOR.base_color_fff,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        width: SCREEN_WIDTH,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: DEFAULT_COLOR.base_color_fff,
    },
    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentEmptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentEmpty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentExist: {
        flex: 1,
    },
    btnGoTopWrap : {
        position:'absolute',
        bottom:20,
        right:20,
        width:50,
        height:50,
        paddingTop:5,
        backgroundColor:'transparent',
        alignItems:'center',
        justifyContent:'center',
        zIndex:3,
    },

    modalContainer: {
        backgroundColor: 'transparent',
        height: '100%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    modalBackgrounder: {
        flex: 2,
        backgroundColor: '#00000055',
    },
    modalWrapper: {
        flex: 3,
        backgroundColor: '#00000055',
    },
    modalContent: {
        flex: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: DEFAULT_COLOR.base_color_fff,
    },
    modalScroll: {

    },
    modalItem: {
        height: 65,
        //alignItems: 'center',
        justifyContent: 'center',
    },
    modalItemWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalItemText: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(16),
        lineHeight: 16 * 1.42,
    },
    modalItemTextSelected: {
        textAlign: 'center',
        color: DEFAULT_COLOR.lecture_base,
        fontSize: PixelRatio.roundToNearestPixel(16),
        lineHeight: 16 * 1.42,
    },
    modalItemIconSelectedWrapperLeft: {
        width: 40,
        alignItems: 'center',
    },
    modalItemIconSelectedWrapperRight: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: 17,
    },
    modalItemIconSelected: {
        width: 15,
        height: 15,
    },
    cancelButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonWrapper: {
        width: SCREEN_WIDTH - 34,
        height: 50,
        backgroundColor: DEFAULT_COLOR.input_bg_color,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 17,
        paddingRight: 17,
        marginBottom: 17,
    },
    cancelButtonText: {
        color: DEFAULT_COLOR.base_color_888,
        fontSize: PixelRatio.roundToNearestPixel(16),
        lineHeight: 16 * 1.42,
    },
});
