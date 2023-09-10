import React, {Component} from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';

import CommonStyle from '../../Styles/CommonStyle'
import ListSubject from './ListSubject';


class SubjectScreen extends Component {

    constructor(props) {
        super(props);                
        
        this.state = {
            loading : false,     
                   
        }        
       
    }
    
    UNSAFE_componentWillMount() {        
        this.setState({ 
            loading: true,
        });
    }    

    componentDidMount() {
        setTimeout(
            () => {
                this.setState({ loading: false});
            },500)
    }

    UNSAFE_componentWillReceiveProps(nextProps){
       
       
    }

    nav_test = () => {
        console.log("nav_test");
        let sendData = {            
            selectBookIndex : 2,
            selectTheme : 'concentration'
        }        
        this.props._updateStatusSelectBook(sendData);
        this.props.screenProps.screenProps.navigation.navigate('NavRCTestScreen', { lectureNo : 1 , theme :'TESTTTTT' });
    }

   
    render() {
        return (
            this.props.screenState.childloading ?
            <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            :
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <Text style={[CommonStyle.font20,{paddingVertical:6}]}>
                        {this.props.screenState.parentsecondSelectTab ? '취약유형' : '도전유형'} : {this.props.screenState.items[(this.props.screenState.nowItem-1)].subject} {this.props.screenState.items[(this.props.screenState.nowItem-1)].part}
                    </Text>                
                </View>
                <View style={styles.buttonContainer}>
                    <Text style={[CommonStyle.textCenter,CommonStyle.font20]}>
                        맟춤 집중 학습
                    </Text> 
                    <Text style={[CommonStyle.textCenter,CommonStyle.font16,CommonStyle.mt10]}>
                        맟춤 집중학습을 완료하시면 {"\n"} <Text style={CommonStyle.fontBold}>적합한 1:1맞춤형 이론 및 문제</Text>를 추천해 드립니다.
                    </Text> 
                </View>
                <View style={[styles.buttonContainer,{justifyContent: 'center',alignItems: 'center',}]}>
                    <Button                                
                        title="맞춤집중 학습하기"
                        buttonStyle={{paddingHorizontal:20}}
                        onPress= {()=> this.nav_test()}
                    />    
                </View>
                <View style={{flex:1,marginTop :20,padding : 10,}}>
                    <ListSubject screenProps={{...this.state, title:'이론 학습'}} />
                    <ListSubject screenProps={{...this.state, title:'문제 풀이'}} />
                    <ListSubject screenProps={{...this.state, title:'실전 레벨 학습'}} />
                    
                </View> 
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width : '100%',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    textContainer : {
        flex:1,
        width : '96%',
        paddingVertical : 5
        
    },
    buttonContainer : {
        flex :1,
        width:'96%',   
        padding : 20,
        backgroundColor : '#ebebeb',
    },
});



function mapStateToProps(state) {
    return {
        selectBook: state.GlabalStatus.selectBook,    
        remainTime: state.GlabalStatus.remainTime,   
    };
}


function mapDispatchToProps(dispatch) {
    return {
        _updateStatusSelectBook:(object) => {
            dispatch(ActionCreator.updateStatusSelectBook(object));

        }
    };
}

SubjectScreen.propTypes = {
    selectBook: PropTypes.object,
    remainTime: PropTypes.number,   
};


export default connect(mapStateToProps, mapDispatchToProps)(SubjectScreen);