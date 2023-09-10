import React, {Component} from 'react';
import { StatusBar,StyleSheet, View, Text, TouchableOpacity, ImageBackground, Linking, RNSV} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { FlatGrid } from 'react-native-super-grid';
import Toast from "react-native-tiny-toast";
import {connect} from 'react-redux';
import ActionCreator from "../Thunk/actions";
import { Flag } from 'react-native-svg-flagkit'


class SelectScreen extends Component {

    constructor(prop) {
        super(prop);
        this.state  = {
            speechRate: 0.5,
            speechPitch: 1
        }
    }


    UNSAFE_componentWillMount() {
        AsyncStorage.getItem('myVoicePitch')
            .then((pitch) => {
                this.setState({speechPitch: pitch.toString()});
            })
            .catch(error => {

                this.setState({speechPitch: 1});
            });
        AsyncStorage.getItem('myVoiceRate')
            .then((speed) => {

                this.setState({speechRate: speed.toString()});
            })
            .catch(error => {

                this.setState({speechRate: 0.5});
            });
    }

    componentDidMount() {

        Linking.getInitialURL().then((url) => {
            if (url) {
                console.log('Initial url is: ' + url);
            }else{
                console.log('Initial url is: false ');
            }
        }).catch(err => console.error('An error occurred', err));
    }


    upspeechRate = async ( rate ) => {
        console.log("rate2",rate);
        if ( rate !== null ) {
            this.setState({speechRate: rate});
        }
    }

    upspeechPitch = async ( rate ) => {
        console.log("rate",rate);
        if ( rate !== null ) {
            this.setState({speechPitch: rate});
        }
    }

    moveDetail = (slanguage,sname,vcode) => {

        this.props.navigation.navigate('TextToSpeech',
            {
                slanguage: slanguage,
                voicecode: vcode,
                sname: sname,
                isSetup: false,
                speechRate: parseFloat(this.state.speechRate),
                speechPitch: parseFloat(this.state.speechPitch),
                upspeechRate: this.upspeechRate.bind(this),
                upspeechPitch: this.upspeechPitch.bind(this)
            });

    }


    render() {
        const items = [
            { name: '한국어' + this.props.cal_result , code : '#1abc9c',flag :"KR" ,langcode :"ko-KR",voicecode :"ko-KR" ,image :'https://reactserver.hackers.com/assets/images/react/korea2.jpg' },
            { name: '영어(미국식)', code: '#2ecc71',flag :"US",langcode :"en-US",voicecode :"en-US",image :'https://reactserver.hackers.com/assets/images/react/usa.jpg' },
            { name: '영어(영국식)', code: '#3498db',flag :"GB" ,langcode :"en-GB",voicecode :"en-GB" ,image :'https://reactserver.hackers.com/assets/images/react/england.jpg'},
            { name: '일본어', code: '#9b59b6',flag :"JP" ,langcode :"ja-JP",voicecode :"ja-JP" ,image :'https://reactserver.hackers.com/assets/images/react/japan2.jpg' },
            { name: '중국어(북경어)', code: '#34495e' ,flag :"CN",langcode :"zh-CN",voicecode :"zh" ,image :'https://reactserver.hackers.com/assets/images/react/china2.jpg' },
            { name: '중국어(광동어)', code: '#16a085' ,flag :"HK",langcode :"zh-HK",voicecode :"zh" ,image :'https://reactserver.hackers.com/assets/images/react/hongkong.jpg' },
            { name: '프랑스어', code: '#27ae60' ,flag :"FR",langcode :"fr-FR",voicecode :"fr-FR" ,image :'https://reactserver.hackers.com/assets/images/react/france.jpg'},
            { name: '독일어', code: '#2980b9' ,flag :"DE",langcode :"de-DE",voicecode :"de-DE" ,image :'https://reactserver.hackers.com/assets/images/react/german.jpg' },
            { name: '스페인어', code: '#e74c3c',flag : 'ES' ,langcode :"es-ES",voicecode :"es-ES" ,image :'https://reactserver.hackers.com/assets/images/react/spain.jpg' },
            { name: '외계어', code: '#bdc3c7' ,flag :"CY",langcode :"ko-KR",voicecode :"ko-KR" ,image :'https://reactserver.hackers.com/assets/images/react/alien.jpg'}
        ];


        return (
            <FlatGrid
                itemDimension={130}
                items={items}
                style={styles.gridView}
                renderItem={({ item, index }) => (

                    <TouchableOpacity key={index}  onPress= {()=> this.moveDetail(item.langcode,item.name,item.voicecode)}>
                        <View style={styles.itemContainer} >
                            <ImageBackground style={ styles.imgBackground } resizeMode='cover' source={{uri:item.image}}>
                                <View style={styles.itemFlag}>
                                    <Flag id={item.flag} width={30} height={20} />
                                </View>
                                <View style={styles.itemText}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                </View>
                            </ImageBackground>
                        </View>
                    </TouchableOpacity>
                )}
            />
        );
    }
}

const styles = StyleSheet.create({
    gridView: {
        marginTop: 20,
        flex: 1,
    },
    imgBackground: {
        height: '100%'
    },
    itemContainer: {
        justifyContent: 'flex-start',
        borderRadius: 5,
        padding: 5,
        height: 100,        
    },
    itemFlag: {
        position: "absolute",
        top:10,
        right:10
    },
    itemText: {
        position: "absolute",
        bottom:5,
        left:5
    },
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    itemCode: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
    },
});

function mapStateToProps(state) {
    console.log("select 2state", state);
    return {
        cal_result: state.calculator.cal_result,
        cal_first: state.calculator.cal_sumInfo.cal_first,
        cal_second: state.calculator.cal_sumInfo.cal_second,
        user_name : state.userinformation.user_name
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updateFirst:(num) => {
            dispatch(ActionCreator.updateSumValueFirst(num));

        },
        updateSecond:(num) => {
            dispatch(ActionCreator.updateSumValueSecond(num));
        },
        updateMyname:(str) => {
            dispatch(ActionCreator.updateStatusMyName(str));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectScreen);
