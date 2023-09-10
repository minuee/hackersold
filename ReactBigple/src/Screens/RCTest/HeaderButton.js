import React, { Component, createRef } from "react";
import { StyleSheet , View, TouchableOpacity, Text, Alert } from "react-native";

import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';

class TimerScreem extends React.Component {
    constructor(props) {
        super(props);
        this.state  = {
            
        }
    }

    UNSAFE_componentWillMount() {
        
        
    }    
    componentDidMount() {        
        
    }

    
    UNSAFE_componentWillUnmount() {
        console.log('timer UNSAFE_componentWillUnmount');
    
    }  


    
    _returnToppage = async() => {   
        console.log('is_returnToppage',this.props.screenState.isSaveTemp) ;
        this.props.screenProps.screenState.returnTopPage(this.props.screenState.isSaveTemp);
    }
    

    render() {
        return (
            <View style={styles.headerTitle}>                  
                
                <View style={[{flex:1,width:'98%'},styles.ButtonWrap]}>
                    <View style={{flex:1,height:35,paddingHorizontal:5}}>
                        <Button                                
                            title="임시저장"                            
                            buttonStyle={{backgroundColor:'#bbb',height:35}}
                            onPress= {()=> this.props.screenState.tempSave()}
                        />    
                    </View>
                    <View style={{flex:1,height:35,paddingHorizontal:5}}>
                        <Button                                
                            title="풀이나가기"                            
                            buttonStyle={{backgroundColor:'#bbb',height:35}}
                            onPress= {()=> this._returnToppage()}
                        />    
                    </View>
                    { !this.props.screenState.isLastPage  &&
                    <View style={{flex:1,height:35,paddingHorizontal:5}}>
                        { this.props.screenState.isSendResult  ?
                        <Button                                
                            title="다음문제풀기"                            
                            buttonStyle={{backgroundColor:'#bbb',height:35}}
                            onPress= {()=> this.props.screenState.nextPage(this.props.screenState.nowSeq+1)}
                        />    
                        :
                        <Button                                
                            title="채점하기"                            
                            buttonStyle={{backgroundColor:'#bbb',height:35}}
                            onPress= {()=> this.props.screenState.sendAnswer()}
                        />    
                        }
                        
                    </View>
                    }
                                                
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
        height : 35,
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