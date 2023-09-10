import React from 'react';
import {StyleSheet,View,Text,Image, ScrollView, ActivityIndicator} from 'react-native';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';

import CommonStyle from '../../Styles/CommonStyle'

class IntroScreen extends React.Component {

    constructor(props) {       
        super(props);        
        //console.log("intro props", this.props.screenState);
        //console.log('question selectBook',this.props.selectBook);
        //console.log('question selectBook',this.props.selectBook.selectBookIndex);
        this.props.screenProps.navigation.addListener('didFocus', payload=>{
            this.setState({
                selectBookIndex : this.props.selectBook.selectBookIndex,
                selectTheme : this.props.selectBook.selectTheme,
            })
            this.forceUpdate();
        })
        this.state  = {
            selectBookIndex : this.props.selectBook.selectBookIndex,
            selectTheme : this.props.selectBook.selectTheme,
            remainTime : this.props.remainTime,
            isLoading : true,
            lectureInfo : null
        }
    }

    
    UNSAFE_componentWillMount() {
        //console.log('UNSAFE_componentWillMount : ', this.props.selectBook.selectBookIndex);

        fetch('https://reactserver.hackers.com:3001/getlecture?lectureidx=' + this.props.selectBook.selectBookIndex)
            .then(response => response.json())
            .then(responseJson => {
                console.log('responseJson',responseJson[0])
                this.setState({
                    lectureInfo: responseJson[0],
                    isLoading : false
                });
            })
            .catch(error => {
                console.error(error);
            });
    }   

    componentDidMount() {      
     
    }
 
    UNSAFE_componentWillReceiveProps() {
        
    }

    render() {             
        if ( this.state.isLoading ) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" />
                </View>
            )
        }else{
            return (
                <View style={styles.container}>
                    <ScrollView style={styles.MainContainer}>     
                        <View style={styles.headerTitle}>           
                            <Text style={[CommonStyle.mt20,CommonStyle.font18]}>선택한 교재는 {this.state.lectureInfo.Title}</Text>
                        </View>
                        <View style={styles.headerTitle}>           
                            <Text style={[CommonStyle.font15]}>(문항별 문제 제공, 제한 시간 : {this.state.lectureInfo.TimeLimit}min)</Text>
                        </View>
                        
                        <View style={[styles.headerTitle,CommonStyle.mt20]}>
                            <Text style={[CommonStyle.mt20,CommonStyle.font18]}>선생님 : {this.state.lectureInfo.Teacher}</Text>
                            <Text style={[CommonStyle.mt20,CommonStyle.font18]}>구분 : {this.state.selectTheme}</Text>
                        </View>
                        
                        <View style={[styles.headerTitle,CommonStyle.mt20]}>
                            <View style={[styles.subjectImage]}>
                                <Image 
                                    source={{uri:this.state.lectureInfo.ImageUri}}
                                    style={{
                                        width: '100%',
                                        height : 150,
                                        borderColor : '#fff',
                                        borderWidth : 1
                                    }} 
                                    resizeMode='contain' 
                                />
                                {/*
                                <Text style={[styles.itemText,CommonStyle.underline,CommonStyle.font18,CommonStyle.textGray]}>RC{"\n"}</Text>
                                <Text style={[styles.itemText,CommonStyle.textCenter,CommonStyle.textGray]}>해커스 프리미엄 토익 모의고사(vol.2)</Text>
                                */}
                            </View>
                        </View>
                        <View style={[styles.headerTitle,CommonStyle.mt20]}>
                            <View style={[{flex:1,width:'98%'},styles.ButtonWrap]}>
                                <View style={{flex:1,paddingHorizontal:5}}>
                                    <Button
                                        title="START"
                                        buttonStyle={{flex:1}}
                                        onPress= {()=> this.props.screenState.startPage()}
                                    />
                                </View>
                                { this.props.remainTime > 0 && 
                                <View style={{flex:1,paddingHorizontal:5}}>
                                    <Button
                                        title="이어풀기"
                                        buttonStyle={{flex:1}}
                                        onPress= {()=> this.props.screenState.continuePage()}
                                    />
                                </View>
                                }
                            </View>
                            <View style={[{width:'95%'},CommonStyle.mt10]}>                            
                                <Button                                
                                    title="나가기"                            
                                    buttonStyle={{backgroundColor:'#bbb'}}
                                    onPress= {()=> this.props.screenState.exitPage()}
                                />
                            </View>
                        </View>
                        <View style={[styles.footerTitle,CommonStyle.mt20]}>
                            <Text style={CommonStyle.textWhite}>
                                저작권자 해커스어학연구소 저작권자의 동의 없이 본 텍스트의 내용을 복제,전송,배포하는 등의 행위를 금합니다.{"\n"}
                                COPYRIGHTS Hackers Language Research....
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            )   
        }     
    }
   
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    MainContainer : {        
        backgroundColor: '#ccc',
    },
    headerTitle: {            
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',        
        paddingVertical : 5
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    subjectImage : {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',        
        width:100,
        height:150,
        padding : 5,        
    },
    itemText: {
        paddingHorizontal : 5,
        fontSize: 13,
        fontWeight: '600',        
    },
    ButtonWrap : {  
        flex : 1,      
        flexDirection : 'row'
    },
    footerTitle : {
        paddingHorizontal : 10,
        marginBottom : 20
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

IntroScreen.propTypes = {
    selectBook: PropTypes.object,   
    remainTime: PropTypes.number,   
};


export default connect(mapStateToProps, mapDispatchToProps)(IntroScreen);
