import React, {Component} from 'react'
import {Text, View, ScrollView,SafeAreaView,StyleSheet,OverViewPage  } from 'react-native'
import {ScrollableTabView, ScrollableTabBar} from '@valdio/react-native-scrollable-tabview'

import SampleScreen01 from './Tabs/SampleScreen01';
import SampleScreen02 from './Tabs/SampleScreen02';
import SampleScreen03 from './Tabs/SampleScreen03';
import SampleScreen04 from './Tabs/SampleScreen04';

export default class ScrollableTabs01 extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    setStateForTabChange = (e) => {
        console.log("this.tab",e);
    }

    render() {
        return <ScrollableTabView
            style={{marginTop: 10}}
            refreshControlStyle={{backgroundColor: 'red'}}
            initialPage={0}
            tabBarTextStyle={styles.tabBarTextStyle}
            tabBarActiveTextColor="#c375f4"
            tabBarInactiveTextColor='#cccccc'
            tabBarUnderlineStyle={styles.underlineStyle}
            renderTabBar={() => <ScrollableTabBar />}
            onChangeTab={(event)=>{this.setStateForTabChange(event.i)}}
            tabBarPosition="top"
        >
            <Text tabLabel=' 0.Home '>Home</Text>
            <SafeAreaView style={{flex: 1}} tabLabel=' 1.샘플1 ' >
                <SampleScreen01 />
            </SafeAreaView>
            <SafeAreaView style={{flex: 1}} tabLabel=' 2.샘플2 '>
                <SampleScreen02 />
            </SafeAreaView>
            <SafeAreaView style={{flex: 1}} tabLabel=' 3.샘플3 '>
                <SampleScreen03 />
            </SafeAreaView>
            <SafeAreaView style={{flex: 1}} tabLabel=' 4.샘플4 '>
                <SampleScreen04 />
            </SafeAreaView>
            <Text tabLabel=' 5.샘플5 '>스포츠</Text>
            <Text tabLabel=' 6.샘플6 '>자동차</Text>
        </ScrollableTabView>
    }

}

const styles = StyleSheet.create({
    tabBarTextStyle: {
        fontSize: 14,
        fontWeight: 'normal',
    },
    underlineStyle: {
        height: 2,
        backgroundColor: '#c375f4',
        borderRadius: 3,
    },
});
