import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../Thunk/actions';


class ReduxThunkScreen extends Component {
    constructor(props, context) {
        super(props, context);

        console.log("redux props", props.cal_result);
        console.log("redux props", props.cal_first);

    }

    render() {
        return (
            <View style={calculatorStyles.container}>
                <TextInput
                    style={ calculatorStyles.input }
                    keyboardType={'number-pad'}
                    maxLength={2}
                    placeholder={'0'}
                    onChangeText={(text) =>  {
                        this.setState({text});
                        var numberAsInt = 0
                        if (text !== '') {
                            numberAsInt = parseInt(text, 10);
                        }
                        ///console.log(numberAsInt);
                        this.props.updateFirst(numberAsInt);
                    }}
                    // onSubmitEditing = {() => { this.props.updateFirst(1); }}
                    // placeholderTextColor = {'red'}
                />
                <View style={calculatorStyles.view}>
                    <Text
                        s3yle={ calculatorStyles.text }
                    >+</Text>
                </View>
                <TextInput
                    style={ calculatorStyles.input }
                    keyboardType={'number-pad'}
                    maxLength={2}
                    placeholder={'0'}
                    onChangeText={(text) =>  {
                        this.setState({text});
                        var numberAsInt = 0
                        if (text !== '') {
                            numberAsInt = parseInt(text, 10);
                        }
                        //console.log(numberAsInt);
                        this.props.updateSecond(numberAsInt);
                    }}
                />
                <View style={ calculatorStyles.view }>
                    <Text
                        style={ calculatorStyles.text }
                    >=</Text>
                </View>
                <View style={ calculatorStyles.view }>
                    <Text
                        style={ calculatorStyles.text }
                    >{this.props.cal_result}</Text>
                </View>

            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        cal_result: state.calculator.cal_result,
        cal_first: state.calculator.cal_sumInfo.cal_first,
        cal_second: state.calculator.cal_sumInfo.cal_second
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updateFirst:(num) => {
            dispatch(ActionCreator.updateSumValueFirst(num));

        },
        updateSecond:(num) => {
            dispatch(ActionCreator.updateSumValueSecond(num));
        }
    };
}

ReduxThunkScreen.propTypes = {
    cal_result: PropTypes.number,   
};

var FONT_CALCULATOR_DEFULT = 18;

const calculatorStyles = StyleSheet.create({
    container: {
        flexDirection:'row',
        justifyContent: 'center',
        marginTop:50,
        backgroundColor:'white',
    },
    input: {
        width: 50 ,
        height: 50,
        backgroundColor:'transparent',
        fontSize: FONT_CALCULATOR_DEFULT,
        justifyContent: 'center',
    },
    text: {
        fontSize: FONT_CALCULATOR_DEFULT,
        backgroundColor:'transparent',
    },
    view: {
        width: 50 ,
        height: 50,
        backgroundColor:'transparent',
        justifyContent: 'center',
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ReduxThunkScreen);
