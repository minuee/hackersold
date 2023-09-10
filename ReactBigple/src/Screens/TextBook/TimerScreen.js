import React, { Component, createRef } from "react";
import { StyleSheet , View, TouchableOpacity, Text, Alert } from "react-native";
//import TimerCutDown from "react-native-timer-cutdown";
import { Button } from 'react-native-elements';
import TimerCutDown from '../../Components/TimerCutDown';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
//import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';

class TimerScreem extends React.Component {
    constructor(props) {
        super(props);
        console.log('this.props.screenState.remainTime', this.props.screenState.remainTime);
        this.timerCutDown = createRef();
        this.state  = {
            timeStatue : 'R',
            remainTime : this.props.screenState.remainTime ? this.props.screenState.remainTime : 60*75
        }
    }

    UNSAFE_componentWillMount() {
        console.log('timer UNSAFE_componentWillMount', this.state.remainTime);
    }    
    componentDidMount() {        
        
    }

    componentDidUpdate() {
        
        const { until } = this.timerCutDown.current.state;
        //console.log('%c *******start********', 'color:red', this.timerCutDown.current.state.until);
        //this.saveRemainTime(until.toString());
    }

    
    UNSAFE_componentWillUnmount() {
        console.log('timer UNSAFE_componentWillUnmount');
        this.saveRemainTime(this.timerCutDown.current.state.until.toString());
    }  


    stopCutDownTimeOnChange = () => {
        console.log("🔚");
        this.setState({ timeStatue : 'S' });
    };

    StartTime = () => {
        //console.log("this.timerCutDown ", this.timerCutDown);
        const { current = {} } = this.timerCutDown;
        current.startCutDownTime && current.startCutDownTime();
        this.setState({ timeStatue : 'R' });
    };

    //재설정 reset
    restartCutDown = () => {
        console.log("this.restartCutDownTime");
        const { current = {} } = this.timerCutDown;
        current.restartCutDownTime && current.restartCutDownTime();
    };

    PauseTime = () => {
        console.log("PauseTime  ", this.timerCutDown.current.state.until);
        const { current = {} } = this.timerCutDown;
        current.stopCutDownTime && current.stopCutDownTime();

        this.setState({
            timeStatue : 'P',
            remainTime : this.timerCutDown.current.state.until
         });
         
         this.pausePage();
    };

    pausePage = () => {
        console.log("contipausePagenuePage");
        Alert.alert(
            "일시정지",
            "일시정지 상태입니다. \n[계속풀기]버튼을 누르시면 풀이를 계속 하실 수 있습니다.",
            [
                {text: '계속풀기', onPress: this.StartTime.bind(this)}                
            ],
            { cancelable: false }
        )        
    }

    saveRemainTime = async(time) => {
        console.log("save time", parseInt(time));
        this.props._updateStatusRemainTime(parseInt(time))
        /*
        try {
            await AsyncStorage.setItem('remainTime', time)
        } catch (e) {
            console.log(e)
        }     
        this.props.screenState.parentSaveRemainTime(time);
        */
    }

    _returnToppage = async(time) => {
        await this.saveRemainTime(time);
        this.props.screenProps.screenState.returnTopPage();
    }
    

    render() {
        return (
            <View style={styles.headerTitle}>  
                <View style={{width:'95%',height:35,flexDirection :'row'}}>
                    <View style={{flex:8,borderWidth : 1,borderColor : '#bbb',}}>
                        <TimerCutDown
                            ref={this.timerCutDown}
                            until={parseInt(this.state.remainTime)}
                            afterEndOnChange={this.stopCutDownTimeOnChange}                        
                        />
                    </View>
                    <View style={{flex:1,borderWidth : 1,borderColor : '#bbb',alignItems: 'center',justifyContent: 'center',textAlign: 'center', backgroundColor :'#bbb'}}>
                        { 
                        this.state.timeStatue == 'R' ?
                        <Icon 
                            name='pause' size={25} color="#fff" 
                            onPress={() => this.PauseTime()} />
                        :
                        this.state.timeStatue == 'P' ?
                        <Icon 
                            name='play' size={25} color="#fff" 
                            onPress={() => this.StartTime()} />
                        :
                        <Icon 
                            name='stop' size={25} color="#fff" 
                        />
                        }
                    </View>
                </View> 
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerTitle: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',        
        paddingVertical : 5,
        height : 40,
        width: '100%'
    },
    ButtonWrap : {  
        flex : 1,      
        flexDirection : 'row'
    },
})


function mapStateToProps(state) {
    return {
        selectBook: state.GlabalStatus.selectBook,    
        remainTime: state.GlabalStatus.remainTime,    
    };
}


function mapDispatchToProps(dispatch) {
    return {
        _updateStatusRemainTime:(num) => {
            dispatch(ActionCreator.updateStatusRemainTime(num));

        }
    };
}

TimerScreem.propTypes = {
    selectBook: PropTypes.object,   
    remainTime: PropTypes.number,   
};

export default connect(mapStateToProps, mapDispatchToProps)(TimerScreem);


/*

https://github.com/MrSeaWave/react-native-timer-cutdown/blob/master/src/index.js
{"current": 
{
    "_afterEnd": [Function anonymous],
    "_cutDownFun": [Function anonymous],
    "_footerContent": [Function anonymous],
    "_getPropsData": [Function anonymous],
    "_reactInternalFiber": {
        "_debugHookTypes": null,
        "_debugID": 83544,
        "_debugIsCurrentlyTiming": false,
        "_debugNeedsRemount": false,
        "_debugOwner": [FiberNode],
        "_debugSource": [Object],
        "actualDuration": 1,
        "actualStartTime": 1578360987066,
        "alternate": null,
        "child": [FiberNode],
        "childExpirationTime": 0,
        "dependencies": null,
        "effectTag": 133,
        "elementType": [Function TimerCutDown],
        "expirationTime": 0,
        "firstEffect": null,
        "index": 0,
        "key": null,
        "lastEffect": null,
        "memoizedProps": [Object],
        "memoizedState": [Object],
        "mode": 8,
        "nextEffect": [FiberNode],
        "pendingProps": [Object],
        "ref": [Circular],
        "return": [FiberNode],
        "selfBaseDuration": 0,
        "sibling": null,
        "stateNode": [Circular],
        "tag": 1,
        "treeBaseDuration": 1,
        "type": [Function TimerCutDown],
        "updateQueue": null
    },
    "_reactInternalInstance": {},
    "_renderContent": [Function anonymous],
    "_renderTimeText": [Function anonymous],
    "context": {},
    "cutInterval": 1097,
    "formatTime": [Function anonymous],
    "getTimeData": [Function anonymous],
    "props": {
        "afterEndOnChange": [Function anonymous],
        "styles": [Object],
        "until": 60
    },
    "refs": {},
    "restartCutDownTime": [Function anonymous],
    "startCutDownTime": [Function anonymous],
    "state":
          {"until": 60},
            "stopCutDownTime": [Function anonymous], "updater": {"enqueueForceUpdate": [Function enqueueForceUpdate], "enqueueReplaceState": [Function enqueueReplaceState], "enqueueSetState": [Function enqueueSetState], "isMounted": [Function isMounted]}}}
            */