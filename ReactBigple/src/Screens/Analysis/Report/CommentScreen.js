import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';


import TestLevelDetailOverlay from "./TestLevelDetailOverlay";
import CommonAnalysisStyle from '../../../Styles/CommonAnalysisStyle';

import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
IconFontAwesome.loadFont();

class CommentScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <ScrollView style={ styles.container }>
                {/* 코멘트 요약 commentSummary */}
                <View style={ styles.commentSummary }>
                    {/* 아이콘 영역 */}
                    <View style={ styles.commentSummaryLeft } >
                        <Icon
                            name='create'
                            color='#E6F0FE'
                            reverseColor='#3196EA'
                            reverse/>
                    </View>

                    {/* 텍스트 영역 */}
                    <View style={ styles.commentSummaryRight } >
                        {/* 제목 */}
                        <View>
                            <Text style={CommonAnalysisStyle.textBlue}>코멘트 요약 </Text>
                        </View>

                        {/* 내용 */}
                        <View style={{ marginTop: 10 }}>
                            <Text style={ [ CommonAnalysisStyle.textGrey, ] }>
                                약점을 보완하여 토익 리스닝 실력을 향상시켜야 합니다.{'\n'}
                                {'\n'}
                                기본적인 듣기 실력은 있지만 심화된{'\n'}
                                paraphrase 표현 정리가 필요합니다.{'\n'}
                                {'\n'}
                                자신이 듣고 이해하는 데 어려웠던 문장이나 어휘, paraphrase 표현을 집중적으로 학습하세요.{'\n'}
                                또한, 다양한 성우와 국가별 발음, 빠른 속도에 적용할 수 있도록 다양한 문제를 많이 풀어본다면,{'\n'}
                                오느새 토익 고수가 되어 있는 자신을 발견할 수 있을 것입니다.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* 취약 파트 */}
                <View style={ styles.weakPart }>
                    {/* 제목 */}
                    <View>
                        <Text style={CommonAnalysisStyle.textBlue}>취약 파트</Text>
                    </View>

                    {/* PART7 영역 */}
                    <View style={ styles.weakPartContent } >
                        {/* 제목 */}
                        <View style={ styles.weakPartContentTitle } >
                            <Text style={ CommonAnalysisStyle.textGrey }>PART7</Text>
                        </View>

                        {/* 내용 */}
                        <View>
                            <Text style={ CommonAnalysisStyle.textGrey }>
                                Single Passage 내의 서로 다른 정보를 연관시켜 추론을 할 수 있으시고,
                                지문이 다소 어려운 어휘나 표현으로 paraphrase되어 있는 경우에도 이해할 수 있으시네요.
                                하지만, 서로 다른 두 개의 지문에 위치한 정보를 연관시켜 추론하는 데 어려움이 있으시네요.
                                Double Passage를 중심으로 두 지문을 연관시키며 정답을 찾는 연습을 하세요.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* 취약 유형 */}
                <View style={ styles.weakType }>
                    {/* 제목 */}
                    <View>
                        <Text style={ CommonAnalysisStyle.textBlue }>취약 유형</Text>
                    </View>

                    {/* 내용 */}
                    <View>
                        {/* 준동사구 영역 */}
                        <View>
                            {/* 제목 */}
                            <View style={ styles.weakTypeContentPart5Title }>
                                <Text style={CommonAnalysisStyle.textGrey}>준동사구 (PART5)</Text>
                            </View>

                            {/* 내용 */}
                            <View>
                                <Text style={ CommonAnalysisStyle.textGrey }>
                                    Part 5-6에서는 특히 준동사구 관련 문제들에 대한 연습이 추가로 필요하시네요.
                                    to 부정사, 동명사, 분사와 같은 다양한 형태의 준동사의 문법적인 기능과 각각에 대한 기본 문법 사항을 다시 한 번 정리해 본 후,
                                    관련 문제들에 적용시키는 연습을 해 보세요.
                                </Text>
                            </View>
                        </View>

                        {/* 어휘 영역 */}
                        <View>
                            {/* 제목 */}
                            <View style={ styles.weakTypeContentPart6Title }>
                                <Text style={CommonAnalysisStyle.textGrey}>어휘 (PART6)</Text>
                            </View>

                            {/* 내용 */}
                            <View>
                                <Text style={ CommonAnalysisStyle.textGrey }>
                                    Part 5-6에서는 특히 어휘 문제들에 대한 연습이 추가로 필요하시네요.
                                    매일 일정량의 단어를 꾸준히 외워야 합니다.
                                    이때, 사전적인 의미뿐만 아니라, 예문을 함께 학습하여 어떤 문맥에서 어떻게 사용되는지 알아두어야 합니다.
                                    그리고, 어휘 문제를 풀 때는 문장 전체를 정확하게 해석하여 의미에 맞는 정답을 고르는 연습을 해 보세요.
                                </Text>
                            </View>
                        </View>

                        {/* 주제/목적 찾기 영역 */}
                        <View>
                            {/* 제목 */}
                            <View style={ styles.weakTypeContentPart7Title }>
                                <Text style={CommonAnalysisStyle.textGrey}>주제/목적 찾기 (PART7)</Text>
                            </View>

                            {/* 내용 */}
                            <View>
                                <Text style={ CommonAnalysisStyle.textGrey }>
                                    Part 7에서는 특히 주제/목적 찾기 관련 문제들에 대한 연습이 추가로 필요하시네요.
                                    주로 지문의 앞부분에서 위치한 지문의 중심 내용이나 목적을 나타내는 주제 문장을 찾아 주제와 목적을 파악하는 연습을 해 보세요.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

export default CommentScreen;

const styles = StyleSheet.create({
    container: {

    },
    commentSummary: {
        flex: 1,
        flexDirection: 'row',
        margin: 10,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EBE8E8',
    },
    commentSummaryLeft: {
        flex: 1,
    },
    commentSummaryRight: {
        flex: 5,
        marginLeft: 10,
    },
    weakPart: {
        margin: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EBE8E8',
    },
    weakPartContent: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    weakPartContentTitle: {
        paddingBottom: 5,
    },
    weakType: {
        margin: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EBE8E8',
    },
    weakTypeContentPart5Title: {
        paddingTop: 10,
        paddingBottom: 5,
    },
    weakTypeContentPart6Title: {
        paddingTop: 10,
        paddingBottom: 5,
    },
    weakTypeContentPart7Title: {
        paddingTop: 10,
        paddingBottom: 5,
    },
});