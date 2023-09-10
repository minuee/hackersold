import React, { Component } from 'react';
import { ScrollView, View, Text, Dimensions, SafeAreaView, } from 'react-native';
import { Overlay, Button, CheckBox, } from 'react-native-elements';
import CommonAnalysisStyle from "../../../Styles/CommonAnalysisStyle";

import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const listTarget = [
    { index: 1, name: '전체' },
    { index: 2, name: 'PART5' },
    { index: 3, name: 'PART6' },
    { index: 4, name: 'PART7' },
    /*
    { index: 5, name: 'PART8' },
    { index: 6, name: 'PART9' },
    { index: 7, name: 'PART10' },
    { index: 8, name: 'PART11' },
    { index: 9, name: 'PART12' },
    { index: 10, name: 'PART13' },
    { index: 11, name: 'PART14' },
    { index: 12, name: 'PART15' },
    { index: 13, name: 'PART16' },
    { index: 14, name: 'PART17' },
    { index: 15, name: 'PART18' },
    { index: 16, name: 'PART19' },
    */
];

class PartSelectOverlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisibleOverlay: false,
            checkedIndex: 0,
        }
    }



    toggleOverlay = () => {
        this.setState({ isVisibleOverlay: !this.state.isVisibleOverlay })
    }

    toggleCheckBox = (index) => {
        //this.setState({checkedIndex: item.index})

        if(this.state.checkedIndex == index) {
            this.setState({ checkedIndex: 0 });
        } else {
            this.setState({ checkedIndex: index });
        }
    }

    render() {
        return(
            <View styles={ styles.container }>
                <View style={ styles.seperator } />
                <View style={ styles.selection }>
                    <Text style={[ CommonAnalysisStyle.textGrey, styles.selectionText ]}>전체</Text>
                    <Icon
                        name='angle-down'
                        size={40}
                        color='#8C8C8C'
                        style={ styles.selectionIcon }
                        onPress={ () => this.toggleOverlay() }></Icon>
                </View>

                <Overlay
                    width='90%'
                    height='90%'
                    isVisible={this.state.isVisibleOverlay}>
                    <SafeAreaView style={{ flexGrow: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                        <View style={ styles.top }>
                            {/* 헤더 */}
                            <View style={ styles.header }>
                                <Text style={ styles.headerText }>분석 대상 PART 선택</Text>
                            </View>

                            {/* 컨텐츠 */}
                            <ScrollView>
                                {
                                    listTarget.map((item) => {
                                        return(
                                            <View style={ styles.listItemWrapper }>
                                                <Text style={ styles.listItemText }>{item.name}</Text>
                                                <View style={[
                                                        styles.listItemCheckBoxWrapper,
                                                        this.state.checkedIndex == item.index ? styles.listItemCheckBoxWrapperChecked : styles.listItemCheckBoxWrapperUnchecked ]}>
                                                    <CheckBox
                                                        checked
                                                        size={30}
                                                        containerStyle={{padding:0,margin:0, alignSelf: 'center'}}
                                                        iconType='font-awesome'
                                                        checkedIcon='check'
                                                        uncheckedIcon='check'
                                                        checkedColor='#FDFEFF'
                                                        uncheckedColor='#CCCCCC'
                                                        checked={this.state.checkedIndex == item.index ? true  : false}
                                                        onPress={() => this.toggleCheckBox(item.index)}
                                                    />
                                                </View>
                                            </View>
                                        );
                                    })
                                }
                            </ScrollView>
                        </View>

                        <View style={ styles.bottom }>
                            {/* 푸터 */}
                            <View>



                                <Button
                                    title='설정 완료'
                                    onPress={ () => this.toggleOverlay() }/>

                                <View style={{ height: 8 }} />

                                <Button
                                    title='나가기'
                                    buttonStyle={{ backgroundColor: '#D9D9D9', }}
                                    titleStyle={{ color: '#616161' }}
                                    onPress={ () => this.toggleOverlay() }/>
                            </View>
                        </View>
                    </SafeAreaView>
                </Overlay>
            </View>
        );
    }
}

export default PartSelectOverlay;

const styles = {
    container: {
        flex: 1,
    },
    seperator: {
        height: 30,
    },
    selection: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 0.4,
        borderBottomWidth: 0.4,
        marginLeft: 12,
        marginRight: 12,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 10,
    },
    selectionText: {
        fontSize: 20,
        alignSelf: 'center',
    },
    selectionIcon: {
        alignSelf: 'center',
    },
    top: {
    },
    bottom: {
    },
    header: {
        backgroundColor: '#174280',
        width: '100%',
        height: SCREEN_HEIGHT / 17,
        justifyContent: 'center',
    },
    headerText: {
        color: '#FFFFFF',
        fontSize: 17,
        textAlign: 'center',
    },
    listItemWrapper: {
        flex: 1,
        height: SCREEN_HEIGHT / 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 0.8,
        borderColor: '#CCCCCC',
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
    },
    listItemText: {
        margin: 10,
        alignSelf: 'center',
        fontSize: 17,
        color: '#404040',
    },
    listItemCheckBoxWrapper: {
        height: SCREEN_HEIGHT / 18,
        width: SCREEN_HEIGHT / 18,
        justifyContent: 'center'
    },
    listItemCheckBoxWrapperChecked: {
        backgroundColor: '#1E9DF3',
    },
    listItemCheckBoxWrapperUnchecked: {
        backgroundColor: '#E2E2E2',
    },
};