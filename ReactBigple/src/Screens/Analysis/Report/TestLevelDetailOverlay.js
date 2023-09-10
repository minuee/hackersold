import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';

import CommonAnalysisStyle from '../../../Styles/CommonAnalysisStyle';

class TestLevelDetailOverlay extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
    }

    render() {
        return(
            <ScrollView style={TableStyles.container}>
                <View>
                    {/* 제목 */}
                    <View>
                        <Text style={CommonAnalysisStyle.titleForArea}>
                            PART5
                        </Text>
                    </View>
                    <View style={ CommonAnalysisStyle.seperator }/>
                    <View>
                        {/* tableHead */}
                        <View style={ TableStyles.head }>
                            {/* tableHeadColFirst */}
                            <View style={TableStyles.headColFirst}>
                                <Text>난이도</Text>
                            </View>
                            {/* tableHeadColSecond */}
                            <View style={{flex: 4}}>
                                {/* tableHeadColSecondRowFirst */}
                                <View style={TableStyles.headColSecondRowFirst}>
                                    <Text>문항 번호</Text>
                                </View>
                                {/* tableHeadColSecondRowSecond */}
                                <View style={TableStyles.headColSecondRowSecond}>
                                    <Text style={{flex: 1, textAlign: 'center'}}>정답</Text>
                                    <Text style={{flex: 1, textAlign: 'center'}}>오답</Text>
                                </View>
                            </View>
                        </View>
                        {/* tableBody */}
                        <View>
                            {/* tableBodyRows */}
                            <View style={TableStyles.bodyRows}>
                                {/* tableBodyRowsColFirst */}
                                <Text style={TableStyles.bodyRowsColFirst}>A</Text>
                                {/* tableBodyRowsColOthers */}
                                <Text
                                    style={TableStyles.bodyRowsColOthers}>[115][116][117]</Text>
                                <Text style={TableStyles.bodyRowsColOthers}>[104]</Text>
                            </View>
                            <View style={TableStyles.bodyRows}>
                                <Text style={TableStyles.bodyRowsColFirst}>B</Text>
                                <Text
                                    style={TableStyles.bodyRowsColOthers}>[106][107][108][109][110][111][112][113]</Text>
                                <Text style={TableStyles.bodyRowsColOthers}>[114]</Text>
                            </View>
                            <View style={TableStyles.bodyRows}>
                                <Text style={TableStyles.bodyRowsColFirst}>C</Text>
                                <Text
                                    style={TableStyles.bodyRowsColOthers}>[101][102][103][105][118][119][120][121][122]</Text>
                                <Text style={TableStyles.bodyRowsColOthers}>[124]</Text>
                            </View>
                            <View style={TableStyles.bodyRows}>
                                <Text style={TableStyles.bodyRowsColFirst}>D</Text>
                                <Text
                                    style={TableStyles.bodyRowsColOthers}>[123][125][126][128][129][130]</Text>
                                <Text style={TableStyles.bodyRowsColOthers}>[127]</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={ CommonAnalysisStyle.seperator } />
                <View>
                    {/* 제목 */}
                    <View>
                        <Text style={CommonAnalysisStyle.titleForArea}>
                            PART6
                        </Text>
                    </View>
                    <View style={ CommonAnalysisStyle.seperator }/>
                    <View>
                        {/* tableHead */}
                        <View style={ TableStyles.head }>
                            {/* tableHeadColFirst */}
                            <View style={ TableStyles.headColFirst }>
                                <Text>난이도</Text>
                            </View>
                            {/* tableHeadColSecond */}
                            <View style={{flex: 4}}>
                                {/* tableHeadColSecondRowFirst */}
                                <View style={ TableStyles.headColSecondRowFirst }>
                                    <Text>문항 번호</Text>
                                </View>
                                {/* tableHeadColSecondRowSecond */}
                                <View style={ TableStyles.headColSecondRowSecond }>
                                    <Text style={{flex: 1, textAlign: 'center'}}>정답</Text>
                                    <Text style={{flex: 1, textAlign: 'center'}}>오답</Text>
                                </View>
                            </View>
                        </View>
                        {/* tableBody */}
                        <View>
                            {/* tableBodyRows */}
                            <View style={ TableStyles.bodyRows }>
                                {/* tableBodyRowsColFirst */}
                                <Text style={ TableStyles.bodyRowsColFirst }>A</Text>
                                {/* tableBodyRowsColOthers */}
                                <Text
                                    style={ TableStyles.bodyRowsColOthers }>[137][138][143][144][145]</Text>
                                <Text style={ TableStyles.bodyRowsColOthers }>-</Text>
                            </View>
                            <View style={ TableStyles.bodyRows }>
                                <Text style={ TableStyles.bodyRowsColFirst }>B</Text>
                                <Text
                                    style={ TableStyles.bodyRowsColOthers }>[131][132][133][134][165][166][167]</Text>
                                <Text style={ TableStyles.bodyRowsColOthers }>-</Text>
                            </View>
                            <View style={ TableStyles.bodyRows }>
                                <Text style={ TableStyles.bodyRowsColFirst }>C</Text>
                                <Text
                                    style={ TableStyles.bodyRowsColOthers }>[148][149][150][151][157][158][159][160][169][170]</Text>
                                <Text style={ TableStyles.bodyRowsColOthers }>-</Text>
                            </View>
                            <View style={ TableStyles.bodyRows }>
                                <Text style={ TableStyles.bodyRowsColFirst }>D</Text>
                                <Text
                                    style={ TableStyles.bodyRowsColOthers }>[135][136][139][140][141][142][146][152][153][155][156][161][162][163][164][168]</Text>
                                <Text style={ TableStyles.bodyRowsColOthers }>[147][154]</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={ CommonAnalysisStyle.seperator } />
                <View>
                    {/* 제목 */}
                    <View>
                        <Text style={ CommonAnalysisStyle.titleForArea }>
                            PART7
                        </Text>
                    </View>
                    <View style={ CommonAnalysisStyle.seperator }/>
                    <View>
                        {/* tableHead */}
                        <View style={TableStyles.head}>
                            {/* tableHeadColFirst */}
                            <View style={ TableStyles.headColFirst }>
                                <Text>난이도</Text>
                            </View>
                            {/* tableHeadColSecond */}
                            <View style={{ flex: 4 }}>
                                {/* tableHeadColSecondRowFirst */}
                                <View style={ TableStyles.headColSecondRowFirst }>
                                    <Text>문항 번호</Text>
                                </View>
                                {/* tableHeadColSecondRowSecond */}
                                <View style={ TableStyles.headColSecondRowSecond }>
                                    <Text style={{ flex: 1, textAlign: 'center' }}>정답</Text>
                                    <Text style={{ flex: 1, textAlign: 'center' }}>오답</Text>
                                </View>
                            </View>
                        </View>
                        {/* tableBody */}
                        <View>
                            {/* tableBodyRows */}
                            <View style={ TableStyles.bodyRows }>
                                {/* tableBodyRowsColFirst */}
                                <Text style={ TableStyles.bodyRowsColFirst }>A</Text>
                                {/* tableBodyRowsColOthers */}
                                <Text
                                    style={ TableStyles.bodyRowsColOthers }>[177][178]</Text>
                                <Text style={ TableStyles.bodyRowsColOthers }>[179][181]</Text>
                            </View>
                            <View style={ TableStyles.bodyRows }>
                                <Text style={ TableStyles.bodyRowsColFirst }>B</Text>
                                <Text
                                    style={ TableStyles.bodyRowsColOthers }>[172][174][175][180][182]</Text>
                                <Text style={ TableStyles.bodyRowsColOthers }>-</Text>
                            </View>
                            <View style={ TableStyles.bodyRows }>
                                <Text style={ TableStyles.bodyRowsColFirst }>C</Text>
                                <Text
                                    style={ TableStyles.bodyRowsColOthers }>[171][184][185][187][188][195][197][199][200]</Text>
                                <Text style={ TableStyles.bodyRowsColOthers }>[183][186][192]</Text>
                            </View>
                            <View style={ TableStyles.bodyRows }>
                                <Text style={ TableStyles.bodyRowsColFirst }>D</Text>
                                <Text
                                    style={ TableStyles.bodyRowsColOthers }>[189][190][191][193]</Text>
                                <Text style={ TableStyles.bodyRowsColOthers }>[173][176][194][196][198]</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={ CommonAnalysisStyle.seperator } />
                <Button
                    title='나가기'
                    buttonStyle={{ backgroundColor: '#D9D9D9', }}
                    titleStyle={{ color: '#616161' }}
                    onPress={ () => this.props.onPressArrow() }/>
            </ScrollView>
        );
    }
}

export default TestLevelDetailOverlay;

const TableStyles = StyleSheet.create({
    container: {
        flex: 1,
        //borderWidth: 1,
        //borderColor: '#E7E7E7',
    },
    head: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderTopWidth: 0.5,
        borderTopColor: 'grey',
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey',
    },

    headColFirst: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headColSecondRowFirst: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 35,
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey',
    },
    headColSecondRowSecond: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 35,
    },
    bodyRows: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey',
    },
    bodyRowsColFirst: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    bodyRowsColOthers: {
        flex: 2,
        textAlignVertical: 'center',
    },
});


