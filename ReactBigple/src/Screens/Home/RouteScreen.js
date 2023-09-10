/*
import React, { Component } from 'react';

import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator,HeaderBackButton} from 'react-navigation-stack';

import ToeicScreen from './ToeicScreen';
//ㅈㅣ금바로 무제한풀기
import QuestionScreen from './Contents/QuestionScreen';


import JapanScreen from './JapanScreen';
import ChinaScreen from './ChinaScreen';

const RouteScreen_StackNavigator = createStackNavigator(
    {
        Toeic : {
            screen: ToeicScreen,            
        },
        QuestionScreen: QuestionScreen,
        Toeic : {
            screen: ToeicScreen,
        },
        Japan: {
            screen: JapanScreen,
        },
        China: {
            screen: ChinaScreen,
        },
    },{    
        initialRouteName: 'Toeic',
    }        
);

export default createAppContainer(RouteScreen_StackNavigator);
*/



import React from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';

//import ToeicRouter from './ToeicRouter';
import ToeicScreen from './ToeicScreen';
import JapanScreen from './JapanScreen';
import ChinaScreen from './ChinaScreen';

const components = {
    ToeicScreen: ToeicScreen,
    JapanScreen: JapanScreen,
    ChinaScreen: ChinaScreen
};

class RouteScreen extends React.Component {

    constructor(props) {       
        super(props);
        //console.log('home route screen',props);   
        //console.log('home route screen',props.screenState);   
        this.state  = {
            loading : false,
            thisFocus : this.props.screenState.nowFocus,
            focusTab : this.props.screenState.focusTab            
        }
    }
    
    UNSAFE_componentWillMount() {
        this.setState({ loading: true});
    }

    

    componentDidMount() {      
        //console.log('home route componentDidMount');     
        setTimeout(
        () => {
            this.setState({ loading: false});
        },300)
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        //console.log('componentWillReceiveProps',nextProps);
        //console.log('nextProps.screenState.nowFocus',nextProps.screenState.nowFocus);   
        //console.log('nextProps.screenState.focusTab',nextProps.screenState.focusTab);   
        this.setState({ 
            thisFocus: nextProps.screenState.nowFocus,
            focusTab: nextProps.screenState.focusTab,
            //loading : true
        }); 
        
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }


    render() {      
        
        const NowScreen = components[this.state.thisFocus];
        
        return (
            <View style={styles.container}>                
                {this.state.loading ? (
                    <ActivityIndicator size="large" />
                ) : (                    
                    <NowScreen screenProps={this.props.screenProps} screenState={this.state} />
                )
                }
            </View>
        )        
    }
   
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color:'#ff0000'
    }

});



function mapStateToProps(state) {
    return {
        selectBook: state.GlabalStatus.selectBook,    
        remainTime: state.GlabalStatus.remainTime,       
    };
}


function mapDispatchToProps(dispatch) {
    return {
        _updateStatusSelectBook:(str) => {
            dispatch(ActionCreator.updateStatusSelectBook(str));

        }
    };
}

RouteScreen.propTypes = {
    selectBook: PropTypes.object,
    remainTime: PropTypes.number, 
};


export default connect(mapStateToProps, mapDispatchToProps)(RouteScreen);

