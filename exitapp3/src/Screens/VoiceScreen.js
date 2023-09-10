import React from 'react';
import {Container, View, Text, Button, StyleSheet,Picker} from 'react-native';
import Voice from 'react-native-voice';

export default class VoiceScreen extends React.Component {

    constructor(props: Props) {
        super(props);

        this.state = {
            isRecord: false,
            voice: undefined,
            speechLanguage: 'en-US',
        };

        Voice.onSpeechStart = this._onSpeechStart;
        Voice.onSpeechEnd = this._onSpeechEnd;
        Voice.onSpeechResults = this._onSpeechResults;
        Voice.onSpeechError = this._onSpeechError;
    }

    componentWillUnmount() {
        Voice.destroy().then(Voice.removeAllListeners);
    }

    _onSpeechStart = event => {
        console.log('onSpeechStart');
        this.setState({
            voice: '',
        });
    };
    _onSpeechEnd = event => {
        console.log('onSpeechEnd');
    };
    _onSpeechResults = event => {
        console.log('onSpeechResults');
        this.setState({
            voice: event.value[0],
        });
    };
    _onSpeechError = event => {
        console.log('_onSpeechError');
        console.log(event.error);
        this.setState({
            isRecord: false,
        });
    };

    _onRecordVoice = () => {
        const { isRecord } = this.state;
        console.log("speechLanguage", this.state.speechLanguage);
        if (isRecord) {
            Voice.stop();
        } else {
            Voice.start(this.state.speechLanguage);
        }
        this.setState({
            isRecord: !isRecord,
        });
    };

    render() {
        const { isRecord, voice } = this.state;
        const buttonLabel = isRecord ? 'Stop' : 'Start';
        const voiceLabel = voice
            ? voice
            : isRecord
                ? 'Say something...'
                : 'press Start button';
        return (
            <View style={styles.container}>
                <Text style={styles.header_style}>{voiceLabel}</Text>
                <Button style={styles.footer_style} onPress={this._onRecordVoice} title={buttonLabel} />
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
                        <Picker.Item label="중국어" value="zh" />
                        <Picker.Item label="프랑스어" value="fr-FR" />
                        <Picker.Item label="독일어" value="de-DE" />
                    </Picker>
                </View>
            </View>
        );
    }

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        width : "100%"
    },
    header_style:{
        width: '100%',
        fontSize: 18,
        padding: 7,
        textAlign: 'center',
    },
    footer_style:{
        width: '100%',
        height: 60,
        fontSize: 22,
        padding: 8,
        backgroundColor: '#62b7ff',
        justifyContent:'flex-end'
    },
});
