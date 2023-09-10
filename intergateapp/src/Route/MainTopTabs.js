import React from 'react'
import {SafeAreaView,StyleSheet,View,Platform,StatusBar, PixelRatio ,ActivityIndicator } from 'react-native'
//import {ScrollableTabView, ScrollableTabBar} from '@valdio/react-native-scrollable-tabview'
import {ScrollableTabView, ScrollableTabBar}  from '../Utils/TopTabs'
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import ActionCreator from '../Ducks/Actions/MainActions';

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;


import {CustomTextR, CustomTextB, TextRobotoM,TextRobotoR} from '../Style/CustomText';

import RecommScreen from '../Screens/Recomm/IntroScreen'; //추천강의
import TextBookScreen from '../Screens/TextBook/IntroScreen'; //교재MP3
import FreePracticeScreen from '../Screens/FreePractice/IntroScreen'; //무료학습
import ReviewScreen from '../Screens/Review/IntroScreen'; //수강후기
import EventScreen from '../Screens/Event/IntroScreen'; //Evnet


class MainTopTabs extends React.Component {

    _isMounted = false;
    constructor(props) {        
        super(props);        
        this.state = {
            focusTab : 0,
            beforeFocusTab : 0,
            moveTopTab : this.moveTopTab.bind(this),
            getTokenStorage : this.getTokenStorage.bind(this),
            //setTopScrollDisable : this.setTopScrollDisable.bind(this),
            topScrollDisable : true,
            LoginToken : null,
            gnbTabs : []
        }
    }

    async UNSAFE_componentWillMount() {    
        
        setTimeout(
            () => {
                this.setTopGNBMenu();
            },400
        )
        await this.getTokenStorage();   

        
    } 

    componentDidMount() {
        this._isMounted = true;
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            Platform.OS === 'android' && StatusBar.setBackgroundColor('#fff');

            // navigation params로 이동할 탭 지정: moveTopTabIndex (마이클래스 추천강좌 보러가기)
            if (this.props.navigation.state.params && this.props.navigation.state.params.moveTopTabIndex !== undefined) {
                this.moveTopTab(this.props.navigation.state.params.moveTopTabIndex);
                this.props.navigation.state.params.moveTopTabIndex = null;
            }
        });
        if (this._isMounted) {
            setTimeout(
                () => {
                    this.setState({                    
                        loading : false
                    });   
                },600
            )
        }
    }

    UNSAFE_componentWillUnmount() {        
        this._navListener.remove();
        this._isMounted = false;
    }

    

    setTopGNBMenu = async() => {      
        let myGnbMenu = await AsyncStorage.getItem('myGnbMenu')         
        if ( myGnbMenu !== null ) {            
            if(myGnbMenu !== null) {      
                myGnbMenu = JSON.parse(myGnbMenu)
                //let returnMenu = await this.setTopGNBMenu(Platform.OS === 'ios' ? myGnbMenu.iOS : myGnbMenu.Android);
                if (this._isMounted) {
                    //console.log('fdfdfdfdkjfdlkfjdlkfjdxxxx',myGnbMenu.iOS)
                    this.setState({
                        gnbTabs: Platform.OS === 'ios' ? myGnbMenu.iOS : myGnbMenu.Android                    
                    }); 
                }
            }
        }else if ( typeof this.props.myInterestCodeOne !== 'undefined' ) {                
            if ( typeof this.props.myInterestCodeOne.code !== 'undefined' ) {                
                let menuTabs = Platform.OS === 'ios' ? this.props.myInterestCodeOne.info.gnbList.iOS : this.props.myInterestCodeOne.info.gnbList.Android
                //let returnMenu = await this.setTopGNBMenu(menuTabs);
                console.log('returnMenu',menuTabs)
                //await AsyncStorage.setItem('myGnbMenu',JSON.stringify(returnMenu) );
                this.setState({
                    gnbTabs: menuTabs
                })
            }
        }
        /*
        let subArray = [];
        let menuComponent = null;
        await menuTabs.forEach(function(element,index,array){                   
            menuComponent = element.depth1Code;
            subArray.push({                    
                id  : element.depth1Code,
                label :element.depth1Name,
                component : DEFAULT_CONSTANTS.GNBMenu[menuComponent]
            }); 
        })
        
        //console.log('subArray',subArray)  
        return subArray;
        //this.setState({tabs: subArray});   
        */

        this.moveTopTab(0);
       
        
    }
    moveTopTab = async(tabs) => {        
        this.setState({focusTab: tabs});
    }

    setStateForTabChange = (e) => {
        //console.log('setStateForTabChange', e.i)
        //console.log('setStateForTabChange', e.from)
        this.props._updateStatusNowScroll(true); 
        this.props._updateStatusNowScrollY(0);     
        this.props.screenProps.resizeTopHeader(0);
        this.setState({focusTab: e.i});
        this.setState({beforeFocusTab: e.from});
    }

    setTopScrollDisable = (bool) => {        
        this.setState({topScrollDisable: bool});
    }



    getTokenStorage = async () => {
        try {
          const tvalue = await AsyncStorage.getItem('userToken')
          if(tvalue !== null) {            
            this.setState({LoginToken: tvalue});
          }
        } catch(e) {            
            this.setState({LoginToken: null});
        }
        this.forceUpdate();     
    }

    shouldComponentUpdate(nextProps, nextState) {
        //console.log('shouldComponentUpdate1111   33333', this.props.myInterestCodeOne);
        //console.log('shouldComponentUpdate2222   33333', nextProps.myInterestCodeOne);
        if ( nextProps.myInterestCodeOne.code !== this.props.myInterestCodeOne.code) {
            //console.log('shouldComponentUpdate55555', nextProps.myInterestCodeOne);
            setTimeout(
                () => {
                    this.setTopGNBMenu()
                },500
            )
            
        }
        return true;
    }


    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보

    }
    
    _pullToRefresh = () => {
        //console.log('dddddd')
    }

    renderSwitch(param) {
        switch(param) {
            case '001':
                return <RecommScreen screennavigation1={this.props.navigation} screenProps={this.props.screenProps} screenState={this.state} />;
                break;
            case '002':
                return <TextBookScreen screennavigation1={this.props.navigation} screenProps={this.props.screenProps} screenState={this.state} />;
                break;
            case '003':
                return <TextBookScreen screennavigation1={this.props.navigation} screenProps={this.props.screenProps} screenState={this.state} />;
                break;
            case '004':
                return <FreePracticeScreen screennavigation1={this.props.navigation} screenProps={this.props.screenProps} screenState={this.state} />;
                break;
            case '005':
                return <ReviewScreen screennavigation1={this.props.navigation} screenProps={this.props.screenProps} screenState={this.state} />;
                break;
            case '006':
                return <EventScreen screennavigation1={this.props.navigation} screenProps={this.props.screenProps} screenState={this.state} />;
                break;
            case '007':
                return <ReviewScreen screennavigation1={this.props.navigation} screenProps={this.props.screenProps} screenState={this.state} />;
                break;
            default:
                return <EventScreen screennavigation1={this.props.navigation} screenProps={this.props.screenProps} screenState={this.state} />;
        }
    }
    
    render() {
        
        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        }else{
            return (
                <ScrollableTabView      
                    style={{ zIndex:50,backgroundColor:'#ffffff'}}
                    refreshControlStyle={{backgroundColor: 'red'}}
                    initialPage={0}
                    tabStyle={styles.tabStyle}
                    tabBarTextStyle={styles.tabBarTextStyle}
                    tabBarActiveTextColor={DEFAULT_COLOR.lecture_base}
                    tabBarInactiveTextColor={DEFAULT_COLOR.base_color_222}
                    tabBarUnderlineStyle={styles.underlineStyle}
                    renderTabBar={() => <ScrollableTabBar />}
                    onChangeTab={(event)=>{this.setStateForTabChange(event)}}
                    tabBarPosition="top"
                    page={this.state.focusTab}
                    locked={this.state.topScrollDisable}
                    //pullToRefresh={this._pullToRefresh()}
                >
                    {
                    this.state.gnbTabs.map((tab,index) => {
                        //const DynamicTagName = `${tab.depth1Code}`;                        
                        //const TagName = Map[tab.component];
                        return (
                            <SafeAreaView 
                                style={{flex: 1,borderTopColor:'#eaebee',borderTopWidth:PixelRatio.roundToNearestPixel(8)}} 
                                key={tab.depth1Code} 
                                tabLabel={tab.depth1Name}
                            >
                                 {this.renderSwitch(tab.depth1Code)}
                                {/*<DynamicTagName screennavigation1={this.props.navigation} screenProps={this.props.screenProps} screenState={this.state} />*/}
                            </SafeAreaView>
                        )
                    })}
                    {/*
                    <SafeAreaView style={{flex: 1,borderTopColor:'#eaebee',borderTopWidth:PixelRatio.roundToNearestPixel(8)}} tabLabel='추천강의' >
                        <RecommScreen screennavigation1={this.props.navigation} screenProps={this.props.screenProps} screenState={this.state} />
                    </SafeAreaView>
                    <SafeAreaView style={{flex: 1,borderTopColor:'#eaebee',borderTopWidth:PixelRatio.roundToNearestPixel(8)}} tabLabel='교재・MP3'>
                        <TextBookScreen screennavigation1={this.props.navigation} screenProps={this.props.screenProps} screenState={this.state}  />
                    </SafeAreaView>            
                    <SafeAreaView style={{flex: 1,borderTopColor:'#eaebee',borderTopWidth:PixelRatio.roundToNearestPixel(8)}} tabLabel='무료학습'>
                        <FreePracticeScreen screennavigation1={this.props.navigation} screenProps={this.props.screenProps} screenState={this.state}  />
                    </SafeAreaView>
                    <SafeAreaView style={{flex: 1,borderTopColor:'#eaebee',borderTopWidth:PixelRatio.roundToNearestPixel(8)}} tabLabel='수강후기'>                
                        <ReviewScreen screennavigation1={this.props.navigation} screenProps={this.props.screenProps} screenState={this.state}  />
                    </SafeAreaView> 
                    <SafeAreaView style={{flex: 1,borderTopColor:'#eaebee',borderTopWidth:PixelRatio.roundToNearestPixel(8)}} tabLabel='이벤트'>                
                        <EventScreen screennavigation1={this.props.navigation} screenProps={this.props.screenProps} screenState={this.state} />
                    </SafeAreaView>
                    */}
                </ScrollableTabView>
            )
        }        
    }

}

const styles = StyleSheet.create({
    tabStyle : {        
        padding:0,
        margin:0 ,
        alignItems: 'center',
        justifyContent : 'center',
    },
    tabBarTextStyle: {
        //fontSize: 15,
        //fontWeight: 'bold',
        //color:DEFAULT_COLOR.base_color_222,   
        fontFamily:'NotoSansKR-Regular',    
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),        
        letterSpacing:-1.05
    },
    underlineStyle: {
        height: 3,        
        backgroundColor: DEFAULT_COLOR.lecture_base
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
});



function mapStateToProps(state) {
    return {
        selectBook: state.GlabalStatus.selectBook,    
        nowScrollY: state.GlabalStatus.nowScrollY,    
        topFavoriteMenu: state.GlabalStatus.topFavoriteMenu,   
        myInterestCodeOne : state.GlabalStatus.myInterestCodeOne,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        _updateStatusNowScroll:(boolean) => {
            dispatch(ActionCreator.updateStatusNowScroll(boolean));
        },
        _updateStatusNowScrollY:(number) => {
            dispatch(ActionCreator.updateStatusNowScrollY(number));
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(MainTopTabs);
