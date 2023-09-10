import React, {Component} from 'react';
import {StyleSheet, Text, View,SafeAreaView,Modal,Button,TouchableOpacity,Platform} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import YouTube, {
    YouTubeStandaloneIOS,
    YouTubeStandaloneAndroid,
} from 'react-native-youtube';


export default class SampleScreen03 extends Component {

    static navigationOptions = () => {
        return {
            header: null
        };
    };

    constructor(props) {
        super(props);
        this.state  = {
            ModalVisibleStatus: false,
            youtubeid :  null
        }
    }

    ShowModalFunction = async (visible, yid) => {
        this.setState({
            ModalVisibleStatus: visible,
            youtubeid : yid
        });
    }

    render() {
        if (this.state.ModalVisibleStatus) {
            return (
                <Modal
                    transparent={false}
                    animationType={'fade'}
                    visible={this.state.ModalVisibleStatus}
                    onRequestClose={() => {
                        this.ShowModalFunction(!this.state.ModalVisibleStatus, '');
                    }}>
                    <SafeAreaView style={styles.modelStyle}>
                        <WebView
                            style={{flex:1}}
                            javaScriptEnabled={true}
                            source={{ uri: Platform.OS == 'ios' ? "https://www.youtube.com/embed/" + this.state.youtubeid : "https://www.youtube.com/watch?v=" + this.state.youtubeid }}
                            startInLoadingState={true}
                            renderLoading={this.renderLoading}
                            renderError={this.renderError}
                            automaticallyAdjustContentInsets={false}
                        />
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={styles.closeButtonStyle}
                            onPress={() => {
                                this.ShowModalFunction(!this.state.ModalVisibleStatus, '');
                            }}>
                            <Icon name="times" size={35} color="#fff"
                                  onPress={() => this.ShowModalFunction(!this.state.ModalVisibleStatus, '')} />
                        </TouchableOpacity>
                    </SafeAreaView>
                </Modal>
            );
        } else {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Call the Youtube on the Webview </Text>
                    <Button title="Load Youtube Aladin OST" onPress={() => this.ShowModalFunction(!this.state.ModalVisibleStatus,'mw5VIEIvuMI')}/>
                    <Text style={styles.title}>Call the Youtube on the Webview</Text>
                    <Button title="Load Youtube Hackers Live" onPress={() => this.ShowModalFunction(!this.state.ModalVisibleStatus,'J9blR-vpm7o')}/>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    modelStyle: {
        flex: 1,
        width : "100%",
    },
    closeButtonStyle: {
        width: 25,
        height: 25,
        top: 9,
        right: 9,
        position: 'absolute',
    },

});
