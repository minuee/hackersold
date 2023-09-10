import React from 'react';
import { StyleSheet, View, Text, Alert,Platform,Button ,TextInput,Picker,TouchableOpacity} from 'react-native';
import ListView from "deprecated-react-native-listview";
import Tts from "react-native-tts";
import FetchingIndicator from 'react-native-fetching-indicator';


export default class TextToSpeech extends React.Component {

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            slanguage: this.props.navigation.state.params.slanguage,
            dataSource: ds.cloneWithRows(
                {[
                        'A rolling stone gathers no moss',
                    'The government of the people, by the people, for the people',
                    'Seeing is beleiving',
                    'No seat, no sweet',
                    'No pain, no gain',
                    'Life is venture or nothing',
                    'Let bygones be bygones',
                    'Donner naissance à mon bébé',
                    'おまえ、ころすぞ',
                    'お前、殺すぞ',
                    '나는 자랑스런 대한민국 국민이다',
                    '我只爱你 我很饿',
                    '他上个月刚刚从中国回来，这个星期他又去了一次'
    ]},
        {[
            'en-US',
            'en-US',
            'en-US',
            'en-US',
            'en-GB',
            'en-GB',
            'en-GB',
            'fr-FR',
            'ja-JP',
            'ja-JP',
            'ko-KR',
            'zh-CN',
            'zh-HK'
        ]}
    ),
        input_text : "",
            speaking_text : "",
            language : "ko",
            voices: [],
            ttsStatus: "initiliazing",
            selectedVoice: null,
            speechRate: 0.4,
            speechPitch: 1,
            speechLanguage: this.props.navigation.state.params.slanguage ? this.props.navigation.state.params.slanguage : 'en-US',
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
        Tts.setDefaultRate(this.state.speechRate);
        Tts.setDefaultPitch(this.state.speechPitch);
        Tts.setDefaultLanguage(this.state.speechLanguage);
        Tts.getInitStatus().then(this.initTts);
    }


    ToSpeackPlay (rowData) {
        //Alert.alert(rowData);
        this.setState({ speaking_text: rowData });
        setTimeout(
            () => {
                Tts.stop();
                //Tts.speak(rowData,{ androidParams: { KEY_PARAM_PAN: -1, KEY_PARAM_VOLUME: 0.5, KEY_PARAM_STREAM: 'STREAM_MUSIC' ,quality: 500} });
                Tts.setDefaultLanguage(this.state.speechLanguage);
                Tts.speak(rowData);
                console.log("text", this.state.speechLanguage);
                console.log("text", rowData);
            },
            500
        )

    };

    setSpeechRate = async rate => {
        await Tts.setDefaultRate(rate);
        this.setState({ speechRate: rate });
    };

    setSpeechPitch = async rate => {
        await Tts.setDefaultPitch(rate);
        this.setState({ speechPitch: rate });
    };
    setDefaultLanguage = async languages => {
        await Tts.setDefaultLanguage(languages);
        this.setState({ speechLanguage: languages });
    };


    renderHeader = () => {
        var header = (
            <View style={styles.header_style}>
                <Picker
                    selectedValue={this.state.speechLanguage}
                    style={{height: 50, width: "100%"}}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({speechLanguage: itemValue})
                    }>
                    <Picker.Item label="한국어" value="ko-KR" />
                    <Picker.Item label="영어(미국)" value="en-US" />
                    <Picker.Item label="영어(영국)" value="en-GB" />
                    <Picker.Item label="일본어" value="ja-JP" />
                    <Picker.Item label="중국어" value="zh-CN" />
                    <Picker.Item label="중국어(광동어)" value="zh-HK" />
                    <Picker.Item label="중국어(타이완)" value="zh-TW" />
                    <Picker.Item label="프랑스어" value="fr-FR" />
                    <Picker.Item label="독일어" value="de-DE" />
                </Picker>
            </View>
        );
        return header;
    };

    ListViewItemSeparator = () => {
        return (
            <View
                style={{
                    height: .5,
                    width: "100%",
                    backgroundColor: "#000",
                }}
            />
        );
    };

    renderFooter = () => {
        var footer = (
            <View style={styles.footer_style}>
                <TextInput
                    style={{ height: 40,width: "100%" }}
                    placeholder="Enter a Word"
                    placeholderTextColor="gray"
                    underlineColorAndroid="transparent"
                    onChange={ (evt) => this.textchg(evt) }
                    keyboardType={ 'default' }
                    value={this.state.input_text}
                />

            </View>
        );
        return footer;
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
                <View style={styles.container}>
                    <View style={styles.header_style}>
                        <Picker
                            selectedValue={this.state.speechLanguage}
                            style={{height: 50, width: "100%"}}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({speechLanguage: itemValue})
                            }>
                            <Picker.Item label="한국어" value="ko-KR" />
                            <Picker.Item label="영어(미국)" value="en-US" />
                            <Picker.Item label="영어(영국)" value="en-GB" />
                            <Picker.Item label="일본어" value="ja-JP" />
                            <Picker.Item label="중국어" value="zh-CN" />
                            <Picker.Item label="중국어(광동어)" value="zh-HK" />
                            <Picker.Item label="중국어(타이완)" value="zh-TW" />
                            <Picker.Item label="프랑스어" value="fr-FR" />
                            <Picker.Item label="독일어" value="de-DE" />
                        </Picker>
                    </View>
                    <ListView
                        dataSource={this.state.dataSource}
                        //renderHeader={this.renderHeader}
                        //renderFooter={this.renderFooter}
                        renderNavigator={
                            <View style={styles.navigator_style}>
                                <Button style={styles.myButton} onPress={() => {
                                    navigation.goBack();
                                }} title="Click to Back" color='#ccc'/>
                            </View>
                        }
                        renderSeparator={this.ListViewItemSeparator}
                        renderRow={
                            (rowData) => <Text style={styles.rowViewContainer} onPress={this.ToSpeackPlay.bind(this, rowData.text)}>{rowData.text}[{rowData.code}]</Text>
                        }
                    />

                    { this.state.input_text === "" ?
                        null
                        :
                        <Text style={styles.rowViewContainer} onPress={this.ToSpeackPlay.bind(this, this.state.input_text)}>{this.state.input_text}</Text> }
                    <View style={styles.footer_style}>
                        <TextInput
                            style={{ height: 40,width: "100%" }}
                            placeholder="Enter a Word"
                            placeholderTextColor="gray"
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width : "100%"
    },
    rowViewContainer:
        {
            padding: 10,
            fontSize: 18,

        },
    header_style:{
        width: '100%',
        height: 45,
        backgroundColor: '#62b7ff',
        justifyContent:'flex-end'
    },
    footer_style:{
        width: '100%',
        height: 45,
        backgroundColor: '#62b7ff',
        justifyContent:'flex-end'
    },
    navigator_style:{
        width: '100%',
        height: 45,
    },
    textStyle:{
        textAlign: 'center',
        color: '#fff',
        fontSize: 20,
        padding: 7
    },
    myButton : {
        width:50
    },
});
