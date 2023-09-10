import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import {
    Button,
} from 'react-native-elements';

import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

class AlertBoxScreen extends Component {
    constructor(props) {
        super(props);
        console.log('CHECK FROM HERE');
        console.log(this.props);
    }

    render() {
        return(
            <View style={ styles.container }>
                {/* 메세지 */}
                <View style={ styles.contentTop }>
                    <View style={ styles.contentTopIcon }>
                        <Icon
                            name='exclamation-circle'
                            size={30}
                            color='#8C8C8C'
                            />
                    </View>
                    <Text style={ styles.contentTopText }>
                        아직 교재 풀이를 진행하지 않으셨어요.{"\n"}무료 모의고사 or 교재풀이를 하시면{"\n"}상세한 풀이 결과를 분석 받으실 수 있습니다.
                    </Text>
                </View>
                <View style={{ height: 10 }} />
                {/* 버튼 */}
                <View style={ styles.contentBottom }>
                    <Button
                        title='무료 모의고사 풀기'
                        style={styles.btnExam}
                        onPress={() => this.props.screenProps.navigation.navigate('NavQuestionScreen')} />
                    <View style={{ height: 10 }} />
                    <Button
                        title='교재 풀기'
                        style={ styles.btnBook }/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E2E2E2'
    },
    contentTop: {
        width: '100%',
        height: 150,
        backgroundColor: '#ffffff',
    },
    contentTopIcon: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentTopText: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#8C8C8C'
    },
    contentBottom: {
        width: '100%',
        backgroundColor: '#bbbbbb'
    },
    btnExam: {
        width: '100%'
    },
    btnBook: {
        width: '100%'
    }
})

export default AlertBoxScreen;