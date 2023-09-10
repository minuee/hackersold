import React from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import { NavigationEvents } from 'react-navigation';

import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';

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

        this.props.screenProps.navigation.addListener('willFocus', payload=>{        
            console.log('no4 route  willFocus', );
            
        })
    
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
        this.setState({ 
            thisFocus: nextProps.screenState.nowFocus,
            focusTab: nextProps.screenState.focusTab,       
        }); 
        
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }


    render() {      
        
        const NowScreen = components[this.state.thisFocus];
        
        return (
            <View style={styles.container}>
                <NavigationEvents
                    onWillFocus={payload => {
                        console.log('tab4 home onWillFocus')
                        
                        }
                    }
                    onDidFocus={payload => {
                        console.log('tab4 home onDidFocus')
                        
                        }
                    }
                    onWillBlur={payload => {
                        console.log('tab4 home onWillBlur')
                        }
                    }
                    onDidBlur={payload => {
                            console.log('tab4 home onDidBlur')
                        }
                    }
                />
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

