import React, { Component,PropTypes } from 'react';
import {
    StatusBar, StyleSheet, View, Text, Alert, Platform, Button, TextInput, Picker, TouchableOpacity, FlatList, ScrollView,
    TouchableHighlight, ToastAndroid
} from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-community/async-storage';
import Hr from "react-native-hr-component";
import Tts from "react-native-tts";
import Voice from 'react-native-voice';
import FetchingIndicator from 'react-native-fetching-indicator';
import axios from 'axios';
import Toast from 'react-native-tiny-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import styles from '../Utils/style01'

const Sound = require('react-native-sound');

Sound.setCategory('Playback');
const whoosh = new Sound('good.mp3', Sound.MAIN_BUNDLE, (error) => {
    // loaded successfully https://www.npmjs.com/package/react-native-sound
    //console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
});
whoosh.setCurrentTime(1);
whoosh.setPan(1);
whoosh.setNumberOfLoops(-1);

export default class TextToSpeech extends Component {
    constructor(props) {
        super(props);
        this.state = {
            match:0,
            focusid:null,
            stopid:null,
            slanguage: this.props.navigation.state.params.slanguage,
            sname: this.props.navigation.state.params.sname,
            input_text : null,
            speaking_text : "",
            language : "ko",
            partialResults: [],
            isRecord: false,
            isSetup: false,
            voice: undefined,
            ttsStatus: "initiliazing",
            selectedVoice: null,
            speechRate: this.props.navigation.state.params.speechRate ? this.props.navigation.state.params.speechRate : 0.5,
            speechPitch: this.props.navigation.state.params.speechPitch ? this.props.navigation.state.params.speechPitch : 1,
            speechLanguage: this.props.navigation.state.params.voicecode ? this.props.navigation.state.params.voicecode : 'en-US',
            activeSections: [],
            serverData: [
                {
                    myvoice : null,
                    text: 'A rolling stone gathers no moss',
                    trans : '구르는 돌에는 이끼가 끼지 않는다',
                    code: 'en-US',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: 'The government of the people, by the people, for the people',
                    trans : '국민의 국민에 의한 국민을 위한 정치',
                    code: 'en-US',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: 'Seeing is believing',
                    trans : '보이는것이 진리다',
                    code: 'en-US',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: 'No sweat no sweet',
                    trans : '땀 없이 달콤함도 없다',
                    code: 'en-US',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: 'No pain no gain',
                    trans : '고통없이 얻는건 없다',
                    code: 'en-GB',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: 'Life is venture or nothing',
                    trans : '삶은 모험 아니면 아무것도 없다',
                    code: 'en-GB',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: 'Let bygones be bygones',
                    trans : '과거를 잊어라',
                    code: 'en-GB',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: 'Donner naissance à mon bébé',
                    trans: '내 아를 낳아도',
                    code: 'fr-FR',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: 'la lune était très belle',
                    trans: '달은 매우 아름다웠다',
                    code: 'fr-FR',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: 'qu’est-ce qui se passe le samedi',
                    trans: '토요일에 무슨일이?',
                    code: 'fr-FR',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: 'j’ai vu un homme qui faisait la manche',
                    trans: '소매를 한 남자를 봤어요',
                    code: 'fr-FR',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: 'お元気ですか,私は元気です',
                    trans: '잘지내나요? 전 잘지냅니다',
                    code: 'ja-JP',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: '富士山は,日本で1番高い山です',
                    trans: '후지산은 일본에서 가장 높은 산입니다.',
                    code: 'ja-JP',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: 'なるようになる,未来は見えない',
                    trans: '어떻게든 될거야 미래는 보이지 않아',
                    code: 'ja-JP',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: '消えそうに,咲きそうな,蕾が今年も僕を待ってる',
                    trans: '질듯 필듯한 꽃봉우리가 올해도 나를 기다리네',
                    code: 'ja-JP',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: 'お前殺すぞ',
                    trans: '너를 죽일꺼야',
                    code: 'ja-JP',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: '一番好きな作家は,東野圭吾さんです',
                    trans: '가장 좋아하는 작가는 히가시노 게이고입니다',
                    code: 'ja-JP',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: '나는 자랑스런 대한민국 국민이다',
                    trans: '',
                    code: 'ko-KR',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: '동해물과 백두산이',
                    trans: '',
                    code: 'ko-KR',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: '새우 간장 공장 공장장 게간장 공장 공장장',
                    trans: '',
                    code: 'ko-KR',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: '我很饿',
                    trans: '나는 매우 배고파',
                    code: 'zh-CN',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: '我只爱你',
                    trans: '난 당신을 사랑해',
                    code: 'zh-CN',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: '我们又见面了',
                    trans: '우리는 다시 만났다',
                    code: 'zh-CN',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: '你怎么又迟到了 下次早点来',
                    trans: '어떻게 다시 늦었니? 다음에 일찍 오세요',
                    code: 'zh-CN',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: '明天又是星期五了',
                    trans: '내일 다시 금요일입니다.',
                    code: 'zh-CN',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: '他上个月刚刚从中国回来 这个星期他又去了一次',
                    trans: '그는 지난달에 중국에서 돌아왔고 이번주에 다시 갔다',
                    code: 'zh-HK',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: '我们又见面了',
                    trans: '우리는 다시 만났다',
                    code: 'zh-HK',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: '你怎么又迟到了 下次早点来',
                    trans: '어떻게 다시 늦었니? 다음에 일찍 오세요',
                    code: 'zh-HK',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: '明天又是星期五了',
                    trans: '내일 다시 금요일입니다',
                    code: 'zh-HK',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: 'Kein Problem',
                    trans: '문제없습니다.',
                    code: 'de-DE',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: 'Schönen Tag noch',
                    trans: '좋은 하루 되세요',
                    code: 'de-DE',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: 'Un ejemplo muy simple',
                    trans: '매우 간단한 예',
                    code: 'es-ES',
                    fetch : false
                },
                {
                    myvoice : null,
                    text: 'Tómelo como modelo en su habla cotidiana',
                    trans: '일선 연설에서 모델로 활용',
                    code: 'es-ES',
                    fetch : false
                },
            ],
        };

        Tts.addEventListener("tts-start", event =>
            this.setState({ ttsStatus: "started" })
        );
        Tts.addEventListener("tts-finish", event =>
            this.setState({ ttsStatus: "finished" })
        );
        Tts.addEventListener("tts-cancel", event =>
            this.setState({ ttsStatus: "cancelled" })
        );
        Tts.setDefaultRate(parseFloat(this.state.speechRate));
        Tts.setDefaultPitch(parseFloat(this.state.speechPitch));
        Tts.setDefaultLanguage(this.state.speechLanguage);
        Tts.getInitStatus().then(this.initTts);
        Tts.setDucking(true);
        Voice.onSpeechStart = this.onSpeechStart.bind(this);
        Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
        Voice.onSpeechResults = this.onSpeechResults.bind(this);
        Voice.onSpeechError = this.onSpeechError.bind(this);
        //Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
        //Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);

    }


    static navigationOptions = ({navigation, screenProps}) => {

        const params =  navigation.state.params || {};
        return {
            headerTitle: params.newtitle,
            headerRight: params.newheaderRight
        }
    };

    _setNavigationParams(){
        let newtitle = this.state.sname ? this.state.sname : null;
        let newheaderRight = (
            <View style={{flex:1,width:50}}>
                <Icon name={this.state.isSetup === false ? "cog" : "times" } size={25} color="#fff" style={{textAlign : 'right', paddingRight:10}}
                      onPress={() => this.ToggleResetSetup()} />
            </View>);

        this.props.navigation.setParams({
            newtitle,
            newheaderRight
        });
    }

    UNSAFE_componentWillMount() {
        this._setNavigationParams();
        
    }
    componentDidMount() {
        /*
        axios.get('https://apis.hackers.com/test/string_match?target=1&myvoice=1')
            .then(response => {
                console.log("okdddd");
            })
            .then(error => console.log("err1111or",error));
            */
    }

    UNSAFE_componentWillUnMount(){
        Voice.destroy().then(Voice.removeAllListeners);
        whoosh.release();
    }

    onSpeechStart = e => {
        console.log('onSpeechStart: ', e);
        this.setState({voice: ''});
    };

    onSpeechEnd = e => {
        console.log('onSpeechEnd: ', e);
    };

    onSpeechError = e => {
        console.log('onSpeechError: ', e);
        if ( this.state.stopid === null && this.state.focusid && this.state.isRecord === true ) {
            for (let i = 0; i < this.state.serverData.length; i++) {
                if ( this.state.focusid == i  ) {
                    this.state.serverData[i]['fetch'] = false;
                    this.state.serverData[i]['myvoice'] = "Error, not input data ";
                }
            }
            setTimeout(
                () => {
                    this.setState({focusid: null});
                },500)
        }
        this.setState({ isRecord: false});
    };

    onSpeechResults = e => {
        console.log('onSpeechResults: ', e);
        for (let i = 0; i < this.state.serverData.length; i++) {
            if ( this.state.focusid == i  ) {
                this.state.serverData[i]['myvoice'] = e.value[0];
            }
        }
        //this.state.serverData[this.state.focusid]['fetch'] = true;
        //this.state.serverData[this.state.focusid]['myvoice'] = e.value[0];
        setTimeout(
            () => {
                //this.setState({focusid: null});
                this.setState({voice: e.value[0],});
                //this.setState({ isRecord: false});
            },500)
    };



    _startRecognizing = async (readIndex) => {
        //Starts listening for speech for a specific locale
        this.setState({ focusid: readIndex });
        this.setState({ stopid: null });
        this.setState({ isRecord: true});
        console.log("readindx", readIndex);
        this.state.serverData[readIndex]['fetch'] = "ing";
        this.state.serverData[readIndex]['myvoice'] = 'Read according to the sentence';
        console.log("1111");
        Tts.stop();
        console.log("22222");
        try {
            console.log("3333",this.state.speechLanguage);
            await Voice.start(this.state.speechLanguage);
        } catch (e) {
            console.error(e);
            this.state.serverData[readIndex]['fetch'] = false;
            this.state.serverData[readIndex]['myvoice'] = e;
        }
    };

    _onRecordVoice = async (readIndex) => {
        const { isRecord } = this.state;
        this.setState({ focusid: readIndex });
        this.setState({ stopid: null });
        this.setState({ isRecord: true});
        console.log("readindx", readIndex);

        this.state.serverData[readIndex]['fetch'] = "ing";
        this.state.serverData[readIndex]['myvoice'] = 'Read according to the sentence';

        await Voice.start(this.state.speechLanguage);
    };

    StopRecode = async (readIndex) => {

        //this.setState({ stopid: readIndex });
        if ( this.state.voice === undefined || this.state.voice === "" ) {
            this.state.serverData[readIndex]['fetch'] = false;
            this.state.serverData[readIndex]['myvoice'] = "";
            this.setState({ focusid: null });
            this.setState({ stopid: readIndex });
            this.setState({ isRecord: false});
            await Voice.stop();
        }else{
            this.state.serverData[readIndex]['fetch'] = true;
            this.setState({ isRecord: false});
            await Voice.stop();
        }


    };

    ResetSpeechSetup() {
        const baseRate = 0.5;
        const basePitch = 1;
        Tts.setDefaultRate(baseRate);
        Tts.setDefaultPitch(basePitch);
        this.setState({ speechRate: baseRate });
        this.setState({ speechPitch: basePitch });
        AsyncStorage.setItem('myVoiceRate', baseRate.toString())
            .then((rate) => {
            })
            .catch(error => {
            });
        this.props.navigation.state.params.upspeechRate(baseRate.toString());

        AsyncStorage.setItem('myVoicePitch',basePitch.toString() )
            .then((rate) => {

            })
            .catch(error => {
            });
        this.props.navigation.state.params.upspeechPitch(basePitch.toString());
    }

    ToggleResetSetup() {
        if ( this.state.isSetup === true ) {
            this.setState({ isSetup: false });
        }else{
            this.setState({ isSetup: true });
        }
    }

    ToSpeackPlay (rowData,tranData) {
        //Alert.alert(rowData);
        if ( this.state.isRecord === false ) {
            let addStr = ( tranData !== null || tranData !== false )  && "\n\n" + tranData;
            this.setState({speaking_text: rowData.replace(/,/gi,"") + addStr});
            setTimeout(
                () => {
                    Tts.stop();
                    //Tts.speak(rowData,{ androidParams: { KEY_PARAM_PAN: -1, KEY_PARAM_VOLUME: 0.5, KEY_PARAM_STREAM: 'STREAM_MUSIC' ,quality: 500} });
                    Tts.setDefaultLanguage(this.state.speechLanguage);
                    Tts.speak(rowData, {
                        androidParams: {
                            KEY_PARAM_PAN: -1,
                            KEY_PARAM_STREAM: 'STREAM_MUSIC',
                            quality: 500
                        }
                    });
                },
                500
            )
        }else{
            const alerttoast = Toast.showLoading('음성작업중입니다');
            setTimeout(() => {
                Toast.hide(alerttoast)
            }, 3000)
        }
    };

    _stopRecognizing = async () => {
        try {
            await Voice.stop();
        } catch (e) {
            console.error(e);
        }
    };

    CheckCompare  (readData, readIndex)  {

        let newFetch = this.state.serverData.slice(0);
        let myvoice = newFetch[readIndex]['myvoice'];
        newFetch[readIndex]['fetch'] = false;
        this.setState({ focusid: null });
        //Toast.show('https://todo.hackers.com으로 접속중..', ToastAndroid.SHORT);
        /*const toast = Toast.showLoading('https://todo.hackers.com으로 접속중..')
        setTimeout(() => {
            Toast.hide(toast)
        }, 3000)*/
        fetch("https://reactserver.hackers.com/api/match", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                target: readData.replace(/,/gi,""),
                myvoice: this.state.serverData[readIndex]['myvoice'] === null ? "" : this.state.serverData[readIndex]['myvoice']
            })
        })
            .then(result => {
                if (!result.ok) throw result;
                return result.json();
            })
            .then(result => {
                if ( Number(result) >= 100 ) {
                    whoosh.play();
                }
                this._stopRecognizing();
                newFetch[readIndex]['myvoice'] = myvoice + " " +  Number(result).toFixed(1) + "%";
                this.setState({ serverData : newFetch });
            }).catch(error => {
            Alert.alert("HACKERS","네트워크 통신중 장애가 발생하였습니다.\n관리자에게 문의해 주세요");
            newFetch[readIndex]['myvoice'] = "에러 발생";
            this.setState({ serverData : newFetch });
            try {
                error.json().then(body => {
                    //Here is already the payload from API
                    console.log(body);
                    console.log("message = "+body.message);
                    this.setState({
                        isLoaded: true,
                        error: body
                    });
                });
            } catch (e) {
                console.log("Error parsing promise");
                console.log(error);
                this.setState({
                    isLoaded: true,
                    error: error
                });
            }
        });


    };

    ClearInput(){
        this.setState({ input_text : null });
    }

    getIndex(idx) {
        return this.state.serverData.findIndex(obj => obj.idx === idx);
    }

    setSpeechRate = async rate => {

        this.setState({ speechRate: rate });
        console.log("myVoiceRate1",rate);
        AsyncStorage.setItem('myVoiceRate', rate.toFixed(2) )
            .then((rate) => {
            })
            .catch(error => {
            });
        this.props.navigation.state.params.upspeechRate(rate.toFixed(2));
        await Tts.setDefaultRate(rate);
    };

    setSpeechPitch = async rate => {

        this.setState({ speechPitch: rate });
        console.log("myVoicePitch1",rate);
        AsyncStorage.setItem('myVoicePitch', rate.toFixed(2) )
            .then((rate) => {

            })
            .catch(error => {
            });
        this.props.navigation.state.params.upspeechPitch(rate.toFixed(2));
        await Tts.setDefaultPitch(rate);
    };
    setDefaultLanguage = async languages => {
        await Tts.setDefaultLanguage(languages);
        this.setState({ speechLanguage: languages });
    };

    render() {
        const { navigation } = this.props;
        if ( this.state.ttsStatus == 'started'  ) {
            return (
                <View style={styles.container}>
                    <FetchingIndicator isFetching message={this.state.speaking_text} color='blue'  />
                </View>
            )
        }else{
            return (
                <View style={styles.container} >

                    <ScrollView style={[styles.setting_container,this.state.isSetup === false ? {top : '100%'}:{top : 0}]}>
                        <Hr lineColor="#eee" thickness={1} width={30} text="음성조절" textStyles={{color: "white"}}  hrPadding={5} textPadding={20} hrStyles={{marginBottom:20}} />
                        <View style={[styles.sliderContainerWrap,{marginBottom:30}]}>
                            <View style={styles.sliderContainer}>
                                <Text style={styles.sliderLabel} >{`Speed: ${this.state.speechRate.toFixed(2)}`}</Text>
                                <Slider
                                    minimumValue={0.01}
                                    maximumValue={0.99}
                                    value={this.state.speechRate}
                                    onSlidingComplete={this.setSpeechRate}
                                    thumbStyle={{width:8, height:8}}
                                />
                            </View>
                            <View style={styles.sliderContainer}>
                                <Text
                                    style={styles.sliderLabel}
                                >{`Pitch: ${this.state.speechPitch.toFixed(2)}`}</Text>
                                <Slider
                                    minimumValue={0.5}
                                    maximumValue={2}
                                    value={this.state.speechPitch}
                                    onSlidingComplete={this.setSpeechPitch}
                                    thumbStyle={styles.thumbball}
                                />
                            </View>
                            <View style={styles.sliderContainer2}>
                                <Icon name="history" size={25} color="#333" style={{alignItems: 'center'}} onPress={() => this.ResetSpeechSetup()} />
                            </View>
                        </View>
                        <Hr lineColor="#eee" thickness={1} width={30} text="사용방법" textStyles={{color: "white"}}  hrPadding={5} textPadding={20}/>
                        <View style={[styles.sliderContainerWrap,{marginBottom:20,paddingLeft:10,paddingRight:10}]}>
                            <View style={styles.sliderContainer100}>
                                <Text style={styles.infolable2}>1. 문장을 클릭하여 청취</Text>
                                <Text style={styles.infolable2}>2. 연습버튼을 클릭후 그대로 발음</Text>
                                <Text style={styles.infolable2}>3. 완료후 마이크버튼을 클릭하여 녹음종료</Text>
                                <Text style={styles.infolable2}>4. 확인을 누르면 매칭률이 출력</Text>
                            </View>
                        </View>
                        <Hr lineColor="#eee" thickness={1} width={30} text="참고사항" textStyles={{color: "white"}}  hrPadding={5} textPadding={20} />
                        <View style={[styles.sliderContainerWrap,{paddingTop:30,paddingBottom:30}]}>
                            <View style={styles.sliderContainer100}>
                                <Text style={styles.infolable}>※ 음성조절하면 Cache에 의해 계속적용</Text>
                                <Text style={styles.infolable}>※ 목소리가 안나올경우 스마트폰의 환경설정필요</Text>
                                <Text style={styles.infolable}>&nbsp;&nbsp;&nbsp;Ex Note5) 일반 &gt;언어및입력방식 &gt;말하기[글자 읽어주기] 클릭 &gt;Google TTS엔진 환경설정 클릭 &gt; 음성데이터 설치</Text>
                            </View>
                        </View>
                    </ScrollView>
                    <FlatList
                        style={{ width: '100%' }}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.serverData}
                        //renderItem={({ item }) => <ViewItem title={item.text} />}
                        renderItem={({ item, index }) => (
                            item.code == this.props.navigation.state.params.slanguage &&
                            <View style={{width:"100%"}}>
                                <TouchableOpacity style={styles.item} onPress={this.ToSpeackPlay.bind(this, item.text,item.trans)} >
                                    <Text style={styles.text}>{item.text.replace(/,/gi,"")}</Text>
                                    { item.trans !== null && <Text style={[styles.text, {color :'#ccc'}]}>{item.trans}</Text>}
                                </TouchableOpacity>
                                <View style={styles.action_style}>
                                    {item.fetch === false ?
                                        <TouchableHighlight style={this.state.focusid !== null && this.state.focusid !== index ? styles.action_button_hidden : styles.action_button}
                                                            onPress={() => this._startRecognizing(index)}
                                                            underlayColor='#99d9f4'>
                                            <Text style={{textAlign: 'center'}}>연습</Text>
                                        </TouchableHighlight>
                                        : item.fetch === true ?
                                            <View>
                                                <TouchableHighlight style={styles.action_button} onPress={() => this.CheckCompare(item.text, index)} underlayColor='#99d9f4'>
                                                    <Text style={{textAlign: 'center'}}>확인</Text>
                                                </TouchableHighlight>
                                            </View>
                                            :
                                            <View style={styles.action_button} underlayColor='#99d9f4'>
                                                <Icon name="microphone" size={25} color="#808080" style={{textAlign: 'center'}} onPress={() => this.StopRecode(index)} />
                                            </View>
                                    }
                                    <View style={styles.action_text_wrap}>
                                        <Text style={styles.action_text}>{item.myvoice}</Text>
                                    </View>
                                </View>
                            </View>
                        )}

                    />
                    { this.state.input_text !== null &&
                    <View style={styles.rowViewContainer} >
                        <Text style={{width: '90%'}} onPress={this.ToSpeackPlay.bind(this, this.state.input_text , null)}>
                            {this.state.input_text}
                        </Text>
                        <Icon name="times-circle" size={25} style={{position: 'absolute',right: 5,top: 5,}} onPress={() => this.ClearInput()} />
                    </View>
                    }
                    <View style={styles.footer_style}>
                        <TextInput
                            style={{ height: 40,width: "100%" }}
                            placeholder="Enter a Word ( Listen only )"
                            placeholderTextColor="#fff"
                            underlineColorAndroid="transparent"
                            onChangeText={text => this.setState({ input_text : text })}
                            keyboardType={ 'default' }
                            value={this.state.input_text}
                            clearButtonMode='while-editing'
                        />
                    </View>
                </View>
            )
        }

    }
}
