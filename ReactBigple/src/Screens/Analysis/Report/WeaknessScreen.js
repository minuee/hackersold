import React, { Component } from 'react';
import {StyleSheet, View, Text, ScrollView, Dimensions} from 'react-native';
import { Button } from 'react-native-elements';

import CommonAnalysisStyle from '../../../Styles/CommonAnalysisStyle';
import {NavigationActions} from "react-navigation";

const {width: SCREEN_WIDTH} = Dimensions.get("window");

class WeaknessScreen extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.screenProps);
    }

    render() {
        return(
            <ScrollView style={ styles.container }>
                {/* 취약 파트 weakPart */}
                <View style={ styles.weakPart }>
                    {/* 제목 weakPartTitle */}
                    <View style={ styles.weakPartTitle }>
                        <Text style={CommonAnalysisStyle.textBlue}>
                            취약 파트
                        </Text>
                    </View>

                    {/* 내용 */}
                    <View>
                        <Text style={ CommonAnalysisStyle.textGrey }>
                            PART2 (오답률 : 43%)
                        </Text>
                    </View>
                </View>

                {/* 취약 유형 weakType */}
                <View style={ styles.weakType }>
                    {/* 제목 */}
                    <View>
                        <Text style={CommonAnalysisStyle.textBlue}>
                            취약 유형
                        </Text>
                    </View>

                    {/* 내용 */}
                    <View style={ styles.weakTypeContent }>
                        {/* 첫번째 오답률 차트*/}
                        <View style={ styles.weakTypeContentWrapper }>
                            {/* 도형 영역 */}
                            <View style={ styles.weakTypeContentWrapperChartRed }>
                                {/* 상단 */}
                                <View>
                                    <Text style={ styles.weakTypeContentWrapperChartPercent }>80%</Text>
                                </View>

                                <View style={ styles.weakTypeContentWrapperChartSeperator } />

                                {/* 하단 */}
                                <View>
                                    <Text style={ styles.weakTypeContentWrapperChartText }>오답률</Text>
                                </View>
                            </View>

                            {/* 제목 영역 */}
                            <View style={ styles.weakTypeContentWrapperTitle }>
                                <Text style={[ styles.weakTypeContentWrapperTitleText, CommonAnalysisStyle.textGrey ]}>
                                    준동사구{'\n'}(Part5)
                                </Text>
                            </View>
                        </View>

                        {/* 두번째 오답률 차트*/}
                        <View style={ styles.weakTypeContentWrapper }>
                            {/* 도형 영역 */}
                            <View style={ styles.weakTypeContentWrapperChartYellow }>
                                {/* 상단 */}
                                <View>
                                    <Text style={ styles.weakTypeContentWrapperChartPercent }>60%</Text>
                                </View>

                                <View style={ styles.weakTypeContentWrapperChartSeperator } />

                                {/* 하단 */}
                                <View>
                                    <Text style={ styles.weakTypeContentWrapperChartText }>오답률</Text>
                                </View>
                            </View>

                            {/* 제목 영역 */}
                            <View style={ styles.weakTypeContentWrapperTitle }>
                                <Text style={[ styles.weakTypeContentWrapperTitleText, CommonAnalysisStyle.textGrey ]}>
                                    어휘{'\n'}(Part6)
                                </Text>
                            </View>
                        </View>

                        {/* 세번째 오답률 차트*/}
                        <View style={ styles.weakTypeContentWrapper }>
                            {/* 도형 영역 */}
                            <View style={ styles.weakTypeContentWrapperChartBlue }>
                                {/* 상단 */}
                                <View>
                                    <Text style={ styles.weakTypeContentWrapperChartPercent }>40%</Text>
                                </View>

                                <View style={ styles.weakTypeContentWrapperChartSeperator } />

                                {/* 하단 */}
                                <View>
                                    <Text style={ styles.weakTypeContentWrapperChartText }>오답률</Text>
                                </View>
                            </View>

                            {/* 제목 영역 */}
                            <View style={ styles.weakTypeContentWrapperTitle }>
                                <Text style={[ styles.weakTypeContentWrapperTitleText, CommonAnalysisStyle.textGrey ]}>
                                    주제/목적 찾기{'\n'}(Part7)
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* 관련 데이터(우선 RC 기준) */}
                <View style={ styles.weakTypeDetail }>
                    {/* PART5 */}
                    <View style={ styles.weakTypeDetailPart }>
                        {/* 제목 */}
                        <View style={ styles.weakTypeDetailTitle }>
                            <Text style={[ CommonAnalysisStyle.textGrey, styles.weakTypeDetailTitleText]}>1. 준동사구</Text>
                            <Text style={[ CommonAnalysisStyle.textGrey, styles.weakTypeDetailTitleTextSub]}>(PART5, 오답률 : 80%)</Text>
                        </View>

                        {/* 테이블 */}
                        <View>
                            {/* tableHead */}
                            <View style={ TableStyles.head }>
                                {/* tableHeadColFirst */}
                                <View style={ TableStyles.headColFirst }>
                                    <Text style={ CommonAnalysisStyle.textGrey }>맞은 문제수</Text>
                                </View>
                                <View style={ TableStyles.headColFirst }>
                                    <Text style={ CommonAnalysisStyle.textGrey }>오답 문제</Text>
                                </View>
                                <View style={ TableStyles.headColFirst }>
                                    <Text style={ CommonAnalysisStyle.textGrey }>내 정답률</Text>
                                </View>
                                <View style={ TableStyles.headColFirst }>
                                    <Text style={ CommonAnalysisStyle.textGrey }>응시생 정답률</Text>
                                </View>
                            </View>
                            {/* tableBody */}
                            <View style={ TableStyles.body }>
                                {/* tableBodyRows */}
                                <View style={TableStyles.bodyRows}>
                                    {/* tableBodyRowsColFirst */}
                                    <Text style={[ TableStyles.bodyRowsColOthers, CommonAnalysisStyle.textGrey]}>1/5</Text>
                                    {/* tableBodyRowsColOthers */}
                                    <Text
                                        style={[ TableStyles.bodyRowsColOthers, CommonAnalysisStyle.textGrey ]}>[104][105][107][111]</Text>
                                    <Text style={[ TableStyles.bodyRowsColOthers, CommonAnalysisStyle.textGrey ]}>20%</Text>
                                    <Text style={[ TableStyles.bodyRowsColOthers, TableStyles.bodyRowsColOthersTextMax ]}>34%</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* PART6 */}
                    <View style={ styles.weakTypeDetailPart }>
                        {/* 제목 */}
                        <View style={ styles.weakTypeDetailTitle }>
                            <Text style={[ CommonAnalysisStyle.textGrey, styles.weakTypeDetailTitleText]}>2. 어휘</Text>
                            <Text style={[ CommonAnalysisStyle.textGrey, styles.weakTypeDetailTitleTextSub]}>(PART6, 오답률 : 60%)</Text>
                        </View>

                        {/* 테이블 */}
                        <View>
                            {/* tableHead */}
                            <View style={ TableStyles.head }>
                                {/* tableHeadColFirst */}
                                <View style={TableStyles.headColFirst}>
                                    <Text style={ CommonAnalysisStyle.textGrey }>맞은 문제수</Text>
                                </View>
                                <View style={TableStyles.headColFirst}>
                                    <Text style={ CommonAnalysisStyle.textGrey }>오답 문제</Text>
                                </View>
                                <View style={TableStyles.headColFirst}>
                                    <Text style={ CommonAnalysisStyle.textGrey }>내 정답률</Text>
                                </View>
                                <View style={TableStyles.headColFirst}>
                                    <Text style={ CommonAnalysisStyle.textGrey }>응시생 정답률</Text>
                                </View>
                            </View>
                            {/* tableBody */}
                            <View style={ TableStyles.body }>
                                {/* tableBodyRows */}
                                <View style={TableStyles.bodyRows}>
                                    {/* tableBodyRowsColFirst */}
                                    <Text style={[ TableStyles.bodyRowsColOthers, CommonAnalysisStyle.textGrey]}>3/5</Text>
                                    {/* tableBodyRowsColOthers */}
                                    <Text
                                        style={[ TableStyles.bodyRowsColOthers, CommonAnalysisStyle.textGrey ]}>[108][109]</Text>
                                    <Text style={[ TableStyles.bodyRowsColOthers, CommonAnalysisStyle.textGrey ]}>40%</Text>
                                    <Text style={[ TableStyles.bodyRowsColOthers, TableStyles.bodyRowsColOthersTextMin ]}>12%</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* PART7 */}
                    <View style={ styles.weakTypeDetailPart }>
                        {/* 제목 */}
                        <View style={ styles.weakTypeDetailTitle }>
                            <Text style={[ CommonAnalysisStyle.textGrey, styles.weakTypeDetailTitleText]}>3. 주제/목적 찾기</Text>
                            <Text style={[ CommonAnalysisStyle.textGrey, styles.weakTypeDetailTitleTextSub]}>(PART7, 오답률 : 40%)</Text>
                        </View>

                        {/* 테이블 */}
                        <View>
                            {/* tableHead */}
                            <View style={ TableStyles.head }>
                                {/* tableHeadColFirst */}
                                <View style={TableStyles.headColFirst}>
                                    <Text style={ CommonAnalysisStyle.textGrey }>맞은 문제수</Text>
                                </View>
                                <View style={TableStyles.headColFirst}>
                                    <Text style={ CommonAnalysisStyle.textGrey }>오답 문제</Text>
                                </View>
                                <View style={TableStyles.headColFirst}>
                                    <Text style={ CommonAnalysisStyle.textGrey }>내 정답률</Text>
                                </View>
                                <View style={TableStyles.headColFirst}>
                                    <Text style={ CommonAnalysisStyle.textGrey }>응시생 정답률</Text>
                                </View>
                            </View>
                            {/* tableBody */}
                            <View style={ TableStyles.body }>
                                {/* tableBodyRows */}
                                <View style={TableStyles.bodyRows}>
                                    {/* tableBodyRowsColFirst */}
                                    <Text style={[ TableStyles.bodyRowsColOthers, CommonAnalysisStyle.textGrey ]}>2/5</Text>
                                    {/* tableBodyRowsColOthers */}
                                    <Text
                                        style={[ TableStyles.bodyRowsColOthers, CommonAnalysisStyle.textGrey]}>[121][132][154]</Text>
                                    <Text style={[ TableStyles.bodyRowsColOthers, CommonAnalysisStyle.textGrey ]}>60%</Text>
                                    <Text style={[ TableStyles.bodyRowsColOthers, TableStyles.bodyRowsColOthersTextMax ]}>84%</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* 최하단 */}
                <View>
                    <Button
                        title='약점 집중 학습 이동'
                        onPress={() => console.log('추후 수정 예정')}/>
                </View>
            </ScrollView>
        );
    }
}

export default WeaknessScreen;

const styles = {
    container: {

    },
    weakPart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EBE8E8',
    },
    weakPartTitle: {

    },
    weakType: {
        padding: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EBE8E8',
    },
    weakTypeContent: {
        flexDirection: 'row',
    },
    weakTypeContentWrapper: {
        flex: 1,
        margin: 10,
        alignItem: 'center',
        justifyContent: 'center',
    },
    weakTypeContentWrapperChartRed: {
        flex: 2,
        backgroundColor: '#FE7E7F',
        width: ( SCREEN_WIDTH / 3) - 30,
        height: ( SCREEN_WIDTH / 3) - 30,
        borderRadius: 100/2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    weakTypeContentWrapperChartYellow: {
        flex: 2,
        backgroundColor: '#FFC25F',
        width: ( SCREEN_WIDTH / 3) - 30,
        height: ( SCREEN_WIDTH / 3) - 30,
        borderRadius: 100/2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    weakTypeContentWrapperChartBlue: {
        flex: 2,
        backgroundColor: '#73A2E4',
        width: ( SCREEN_WIDTH / 3) - 30,
        height: ( SCREEN_WIDTH / 3) - 30,
        borderRadius: 100/2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    weakTypeContentWrapperChartSeperator: {
        borderWidth: 0.7,
        width: (SCREEN_WIDTH / 3 - 30) / 2,
        borderColor: 'white',
        marginBottom: 5
    },
    weakTypeContentWrapperChartPercent: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
    },
    weakTypeContentWrapperChartText: {
        color: 'white',
    },
    weakTypeContentWrapperTitle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
    },
    weakTypeContentWrapperTitleText: {
        textAlign: 'center',
        fontSize: 15,
    },
    weakTypeDetail: {
        padding: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EBE8E8',
    },
    weakTypeDetailPart: {
        paddingBottom: 20,
    },
    weakTypeDetailTitle: {
        flexDirection: 'row',
        paddingBottom: 15,
    },
    weakTypeDetailTitleText: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    weakTypeDetailTitleTextSub: {
        fontSize: 15,
        fontWeight: 'normal',
    },
};

const TableStyles = StyleSheet.create({
    container: {
        flex: 1,
        //borderWidth: 1,
        //borderColor: '#E7E7E7',
    },
    head: {
        height: 50,
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
    body: {

    },
    bodyRows: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey',
        alignItems: 'center',
    },
    bodyRowsColFirst: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    bodyRowsColOthers: {
        flex: 2,
        textAlign: 'center',
        justifyContent: 'center',
    },
    bodyRowsColOthersTextMax: {
        color: '#EA5650',
    },
    bodyRowsColOthersTextMin: {
        color: '#5D97E6',
    },
});