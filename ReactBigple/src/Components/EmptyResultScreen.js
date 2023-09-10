import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import { Button } from 'react-native-elements';

export default class EmptyResultScreen extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <Icon name="exclamation-circle" size={25} color="#555" />
                    <Text style={styles.title}>
                        아직 교재 풀이를 진행하지 않으셨어요.{"\n"}
                        무료 모의고사 or 교재풀이를 하시면 상세한 풀이 결과를 분석 받으실 수 있습니다.
                    </Text>
                </View>
                <View style={styles.buttonContainer}>
                    <View style={styles.buttonWrap}>
                        <Button                                
                            title="무료 모의고사 풀기"                                                            
                            onPress= {()=> this.props.screenState.nav_home()}
                        />    
                    </View>
                    <View style={styles.buttonWrap}>
                        <Button                                
                            title="교재풀기"                                                            
                            onPress= {()=> this.props.screenState.nav_test()}
                        />    
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    textContainer : {
        flex:1,          
        padding:10,      
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer : {
        flex:1,
        width:'98%',        
        //flexDirection : 'row',
        marginBottom : 10
    },
    buttonWrap : {
        flex:1,
        height:40,
        paddingHorizontal : 5,
        marginVertical : 5
    },
    title: {
        fontSize: 14,
        textAlign: 'center',
        margin: 10,
        color: '#555'
    }

});
