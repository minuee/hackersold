import React, { Component } from 'react';
import { StyleSheet, View,Text, Image,Platform, Dimensions, ActivityIndicator, BackHandler,Alert,StatusBar,ScrollView,Linking,Clipboard} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import AppLink from '../../Utils/AppLink'
const SendIntentAndroid = require("react-native-send-intent");

const { width: SCREEN_WIDTH } = Dimensions.get('window');

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

export default class AppUpdateScreen extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isLoading : true,
            appLink :  this.props.appLink
        };

        this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
        this.onShouldStartLoadWithRequest = this.onShouldStartLoadWithRequest.bind(this);
        
    }
   
    UNSAFE_componentWillMount() { 

        console.log(' this.props.appLink', this.props.appLink)
    }

    componentDidMount() {        
        this.setState({
            isLoading : false
        })  
    }
    UNSAFE_componentWillUnmount() {
        
    }

    
    onNavigationStateChange = async(navState) =>{
        console.log('navState22222s',navState);
        //console.log('navState',navState.url.indexOf('Intent://'));
        //console.log('navStat2e',navState.url.indexOf('itms-appss://'));

        
        if ( Platform.OS === 'android') {
            SendIntentAndroid.openApp("com.google.android.gm").then(wasOpened => {})
       
       
            if ( navState.canGoBack  && navState.url.indexOf('Intent://') != -1 ) {
                const appStoreId = 'com.cdn.aquanmanager';
                AppLink.openInStore({ appStoreId}).then(() => {
                    // do stuff
                })
                .catch((err) => {
                // handle error
                });
                return false;
                /*
                SendIntentAndroid.isAppInstalled(DEFAULT_CONSTANTS.mp3playerplayStoreId).then(
                    isInstalled => {
                        console.log('com.hackers.app.hackersmp3', isInstalled)
                       if ( isInstalled ) {
                            SendIntentAndroid.openAppWithUri(DEFAULT_CONSTANTS.mp3playerplayStoreId)
                            .then(isOpened => {
                            if (!isOpened) {
                                console.log('com.hackers.app.hackersmp3', isOpened)
                            }
                            })
                            .catch(err => {
                            console.log(err);
                            });

                       }else{

                       }
                    }
                );  
                */
            }
        }
    }
    

    /**
     * 화면에서 post를 던지면 react-native에서 받음
     */
    onWebViewMessage = event => {
        console.log('onWebViewMessage', JSON.parse(event.nativeEvent.data))
        let msgData;
        try {
            msgData = JSON.parse(event.nativeEvent.data) || {}
        } catch (error) {
            console.error(error)
            return
        }
        this[msgData.targetFunc].apply(this, [msgData]);
    }
    
    onShouldStartLoadWithRequest(navigator) {
        console.log('navigator indexof',  navigator.url.indexOf(thisappLink))
        let thisappLink = this.props.appLink;
        console.log('thisappLink', thisappLink);
        console.log('navigator', navigator.url)
        if ( navigator.url == thisappLink ) {
            console.log('thisappLink  true')
            return true;
        } else {
            console.log('thisappLink  false')
            if ( Platform.OS === 'ios'){
                if ( navigator.url.indexOf('itms-appss://') != -1) {
                        const appStoreId = '531669642';
                        AppLink.openInStore({ appStoreId}).then(() => {
                        // do stuff
                        this.props.closeModal();
                        this.appWebview.stopLoading(); 
                        return false;
                    })
                    .catch((err) => {
                        // handle error
                        this.appWebview.stopLoading(); 
                        return false;
                    });
                    /*
                    const appStoreId = '531669642';
                    Linking.openURL(`https://apps.apple.com/app/${appStoreId}`);
                    */
                    return false;
                }else{
                    this.appWebview.stopLoading(); 
                    return false;
                }
            }else{
                const appStoreId = 'com.cdn.aquanmanager';
                Linking.openURL(`market://details?id=${appStoreId}`);
               

            }
           
        }  
      }


    render() {

        const patchPostMessageFunction = function() {
            const originalPostMessage = window.postMessage;        
            const patchedPostMessage = function (message, targetOrigin, transfer) {        
                originalPostMessage(message, targetOrigin, transfer);        
            };
        
            patchedPostMessage.toString = function() {        
                return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');        
            };        
            window.postMessage = patchedPostMessage;        
        };        
        const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';
        
        if ( this.state.isLoading ) {
            return (
                <View style={[styles.container,{justifyContent:'center'}]}>
                    <ActivityIndicator size="large" />
                </View>
            )
        }else{        
            return (
                <View style={styles.container}>
                    <WebView
                        startInLoadingState={true}
                        style={styles.webview}
                        source={{uri : this.props.appLink}}                    
                        originWhitelist={['*']}
                        ref={webview => this.appWebview = webview}                        
                        onMessage={this.onWebViewMessage}
                        javaScriptEnabled={true}
                        useWebKit={true}
                        injectedJavaScript={patchPostMessageJsCode}
                        //onShouldStartLoadWithRequest={this.onNavigationStateChange.bind(this)}
                        //onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                        onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest} //for iOS
                        onNavigationStateChange ={this.onShouldStartLoadWithRequest} //for Android
                        scrollEnabled={true}
                        domStorageEnabled={true}
                        onError={() => {
                            //alert('Error Occured');
                            this.appWebview.stopLoading(); 
                            console.log('ffdfdfdfd')
                        }}
                        mixedContentMode={'always'}
                        useWebKit={true}
                        //onLoadEnd={() => this.passValues()}
                        renderLoading={()=>(<ActivityIndicator size="large" />)}
                    />
                </View>
            );
        }
       
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:'100%',
        height:'100%'
    },
    webview: {
        flex: 1,
        width:'100%',
        height:'100%'
    },
    popupUrlHeader : {
        flexDirection : 'row',
        width: '100%',
        height: 30,        
        borderBottomColor : '#ebebeb',
        borderBottomWidth :1
    },
    footer_container:{        
        flexDirection : 'row',
        width: '100%',
        height: 40,
        backgroundColor: '#fff',        
        borderTopColor : '#ebebeb',
        borderTopWidth :1
    },
    footer_left : {
        width : 40,
        alignItems : 'center',
        justifyContent:'center',           
    },
    footer_center : {
        width : SCREEN_WIDTH - 80,
        alignItems : 'center',
        justifyContent:'center',
        
    },
    footer_right : {
        width : 40,     
        alignItems : 'center',
        justifyContent:'center',
        
    },
    itemContainer: {                
        padding: 7,
        height: 35,
    },
    itemFlag: {
        position: "absolute",
        top:10,
        right:10
    },
});