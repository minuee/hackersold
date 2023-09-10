import React, {Component} from 'react'
import {SafeAreaView,StyleSheet,Platform,StatusBar  } from 'react-native'
import {ScrollableTabView, ScrollableTabBar} from '@valdio/react-native-scrollable-tabview'
import AsyncStorage from '@react-native-community/async-storage';

import HomeScreen from './HomeScreen';
import WeakFocusScreen from '../Screens/WeakFocus/HomeScreen'
import TextBookListScreen from "../Screens/TextBook/TextBookListScreen";
import AnalysisMainScreen from "./Analysis/MainScreen";

export default class MainScreen extends React.Component {

    constructor(props) {
        super(props);
        //console.log('main screen',props);
        //console.log('main screen screenProps',props.screenProps);
        this.state = {
            focusTab : 0,
            beforeFocusTab : 0,
            moveTopTab : this.moveTopTab.bind(this),
            getTokenStorage : this.getTokenStorage.bind(this),
            LoginToken : null
        }
    }

    UNSAFE_componentWillMount() {        
        this.getTokenStorage();
    } 

    componentDidMount() {        
        console.log('main home componentDidMount')        
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            Platform.OS === 'android' && StatusBar.setBackgroundColor('#fff');
        });    
       
    }

    UNSAFE_componentWillUnmount() {        
        this._navListener.remove();
    } 

    moveTopTab = async(tabs) => {
        console.log("this new taba",tabs);
        this.setState({focusTab: tabs});
    }

    setStateForTabChange = (e) => {
        console.log("to tab",e.i);
        console.log("from tab",e.from);
        this.setState({focusTab: e.i});
        this.setState({beforeFocusTab: e.from});
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
    }

    shouldComponentUpdate(nextProps, nextState) {      
        //console.log('main shouldComponentUpdate nextState',nextState);          
        return true;
    }
    
    
    render() {
        return (
            
            <ScrollableTabView      
                style={{ height :20,padding:0,margin:0 }}    
                refreshControlStyle={{backgroundColor: 'red'}}
                initialPage={0}
                tabStyle={styles.tabStyle}
                tabBarTextStyle={styles.tabBarTextStyle}
                tabBarActiveTextColor="#173f82"
                tabBarInactiveTextColor='#cccccc'
                tabBarUnderlineStyle={styles.underlineStyle}
                //renderTabBar={() => <ScrollableTabBar />}
                onChangeTab={(event)=>{this.setStateForTabChange(event)}}
                tabBarPosition="top"
                page={this.state.focusTab}
            >            

                <SafeAreaView style={{flex: 1}} tabLabel=' 홈 ' >                    
                    <HomeScreen screenProps={{...this.props,moveTopTab : this.moveTopTab.bind(this)}} screenState={this.state} />
                </SafeAreaView>
                <SafeAreaView style={{flex: 1}} tabLabel='교재풀이'>
                    <TextBookListScreen screenProps={this.props} screenState={this.state} />
                </SafeAreaView>            
                <SafeAreaView style={{flex: 1}} tabLabel='분석리포트'>
                    <AnalysisMainScreen screenProps={this.props} screenState={this.state}/>
                </SafeAreaView>
                <SafeAreaView style={{flex: 1}} tabLabel='약점집중학습'>                
                    <WeakFocusScreen screenProps={this.props} screenState={this.state} />
                </SafeAreaView> 
                        
            </ScrollableTabView>
        )
    }

}

const styles = StyleSheet.create({
    tabStyle : {        
        padding:0,
        margin:0 ,
        alignItems: 'center',
        justifyContent : 'center'
    },
    tabBarTextStyle: {
        fontSize: 14,
        fontWeight: 'normal',
    },
    underlineStyle: {
        height: 2,
        backgroundColor: '#173f82',
        borderRadius: 3,
    },
});
