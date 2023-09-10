import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    Text,
    Dimensions,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';
import {
    Button
} from 'react-native-elements';

import TranslateScreen from '../LectureStudy/Result/TranslateScreen';
import CommentScreen from '../LectureStudy/Result/CommentScreen';
import VocaScreen from '../LectureStudy/Result/VocaScreen';

import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

// TODO: RadioBox Customize
// ㄴ https://dev.to/saadbashar/create-your-own-radio-button-component-in-react-native-easily-59il

// TODO: 이미지 영역을 비율을 유지하고 가로 기준으로 전체를 늘리게 하는 방법은?


// TODO: 케이스 스터디
// 문제와 정답 및 각종 해설지 정보를 데이터셋으로 생성하여 활용할 수 있어야 함

// RC
    // 객관식
    // 주관식

// LC
    // 객관식
    // 주관식

const examples = [
    { key: 1, code: 'A', word: 'manufacture', },
    { key: 2, code: 'B', word: 'manufacturer', },
    { key: 3, code: 'C', word: 'manufacturing', },
    { key: 4, code: 'D', word: 'manufactured', },

    /* 주관식 */
    /* { key: 1, code: '5', sentence: 'Customers seeking refunds should present a receipt.', answer: '(주관식 답안명)',  } */
];

class ProblemComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            isSelectAnswer: true,
        }
    }

    onPressButton = () => {
        if(this.state.value === null) {
            Alert.alert(
                '정답 선택',
                '제시된 답안 중 정답을 선택해주세요.',
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
            );
        } else {
            this.setState({ isSelectAnswer: true });
        }
    }

    render() {
        return(
            <View style={ styles.container }>

                <View style={ styles.subContainerRC }>
                    <View style={ styles.areaTitle }>
                        <Image style={ styles.questionIcon }
                            source={ require('../../../assets/icons/question.png') } />
                        <Text style={ styles.questionText }>
                            Question 131-134 refer to the following e-mail.
                        </Text>
                    </View>
                    <View style={ styles.areaPassage }>
                        <Text style={ styles.passageText }>
                            To: McRay Productions{"\n"}
                            {"<"}inquires@mcrayprod.com{">"}{"\n"}
                            Sugbject: Proposal{"\n"}
                            Attachment: Product list{"\n"}
                            {"\n"}
                            To Whom It May Concern,{"\n"}

                            My retail business, Delrio, currently needs a new ------- for its products.
                            Delrio mostly sells souvenir items, like canvas bags, pouches, and umbrellas,
                            and I was wondering if you could produce some goods I've designed for an upcoming trade fair.
                            This event will provide an opportunity for my company to attract customers and establish a positive ------- with them.
                            It is therefore very important for the merchandise I sell to appeal to my target market.
                            -------, everything must be convenient to use and made of durable materials.
                            I have attached a list of products I intend to feature and would like a sample of each one. -------.
                        </Text>
                    </View>


                    <View style={ styles.areaExample }>
                        <View style={ styles.areaExampleLeft }>
                            <Text>
                                131.
                            </Text>
                        </View>


                        <View style={ styles.areaExampleRightMultiple }>
                            {
                                examples.map((item) => {
                                    return(
                                        <View style={{ flex: 1, flexDirection: 'row', marginBottom: 20, }}>
                                            <TouchableOpacity
                                                style={ this.state.value === item.key ? styles.checkedCircle : styles.circle }
                                                onPress={() => this.setState({ value: item.key })}/>
                                            <Text style={ this.state.value === item.key ? styles.checkedExample : {} }>
                                                ({item.code}) {item.word}
                                            </Text>
                                        </View>
                                    );
                                })
                            }
                        </View>

                        {/*
                        <View style={ styles.areaExampleRightShort }>
                            <Text>
                                Customers seeking refunds should present a receipt.
                            </Text>
                        </View>
                        */}

                    </View>
                    <View style={ styles.areaMark }>
                        <View style={ styles.areaMarkBefore }>
                            <Button
                                title='정답 확인'
                                onPress={() => this.onPressButton() }/>
                        </View>

                        <View style={ styles.areaMarkAfter }>
                            <View style={ styles.areaMarkAfterRoute }>
                                <Text style={ styles.areaMarkAfterRouteText }>해석</Text>
                                <Icon
                                    name='chevron-right'
                                    style={ styles.areaMarkAfterRouteIcon }/>
                            </View>
                            <View style={ styles.areaMarkAfterRoute }>
                                <Text style={ styles.areaMarkAfterRouteText }>해설</Text>
                                <Icon
                                    name='chevron-right'
                                    style={ styles.areaMarkAfterRouteIcon } />
                            </View>
                            <View style={ styles.areaMarkAfterRoute }>
                                <Text style={ styles.areaMarkAfterRouteText }>어휘</Text>
                                <Icon
                                    name='chevron-right'
                                    style={ styles.areaMarkAfterRouteIcon } />
                            </View>
                        </View>
                    </View>
                </View>

                {/*
                <View style={ styles.subContainerLC }>
                    <View style={ styles.areaTitle }>
                        <Image
                            style={ styles.questionIcon }
                            source={ require('../../../assets/icons/question.png') } />
                        <Text style={ styles.questionText }>
                            Question 1.
                        </Text>
                    </View>
                    <View style={ styles.areaPassage }>
                        <Image
                            style={ styles.passageImage }
                            source={ require('../../../assets/images/sample-lc.png') }
                        />
                    </View>
                </View>
                */}

            </View>
        );
    }
}

export default ProblemComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
    },
    subContainerLC: {

    },
    subContainerRC: {

    },
    areaTitle: {
        flex: 1,
        flexDirection: 'row',
    },
    questionIcon: {
    },
    questionText: {
        color: '#4A4A4A',
        fontSize: 16,
        marginLeft: 10,
        marginRight: 20,
    },
    areaPassage: {
        flex: 1,
        margin: 10,
        borderWidth: 0.5,
        borderColor: '#8A8A8A',
    },
    passageText: {
        margin: 10,
        lineHeight: 20,
    },
    passageImage: {
        margin: 10,
        width: SCREEN_WIDTH - 60,
        alignSelf: 'stretch',
    },
    areaExample: {
        flex: 1,
        flexDirection: 'row',
        margin: 10,
    },
    areaExampleLeft: {
        flex: 1,
    },
    areaExampleRightMultiple: {
        flex: 5,
    },
    areaExampleRightShort: {
        flex: 5,
    },
    circle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ACACAC',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 30,
    },
    checkedCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#4D99F0',
        marginRight: 30,
    },
    checkedExample: {
        color: 'red',
    },
    areaMark: {

    },
    areaMarkBefore: {

    },
    areaMarkAfter: {

    },
    areaMarkAfterRoute: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FCF9F9',
        height: SCREEN_HEIGHT / 20,
        borderWidth: 1,
        borderColor: '#EBEAEA',
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 10,
    },
    areaMarkAfterRouteText: {
        alignSelf: 'center',
    },
    areaMarkAfterRouteIcon: {
        alignSelf: 'center',
    },
});