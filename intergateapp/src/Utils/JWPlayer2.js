import React, { Component } from 'react';
import { StyleSheet, View,Platform, Dimensions, ActivityIndicator, Clipboard} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
//import moment from 'moment';
import Toast from 'react-native-tiny-toast';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const index_headers =  {
    'Accept':  'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cache': 'no-cache'
};
const domain = 'http://reactserver.hackers.com/jwplayer/';
const domainhttps = 'https://reactserver.hackers.com/jwplayer/';


export default class JWPlayer2 extends Component {
    constructor(props) {
        super(props);        
        this.state = {
            indexPage_uri: Platform.OS === 'ios' ? domainhttps +'?ver=12' : domain +'?ver=12',      
            //indexPage_uri: domain +'?ver=12',
            isLoading : true,
            indexPage_headers : index_headers,
            indexPage_body : '',
            indexPage_method : 'POST',
            willgoback : false,
            willgoforward : false,
            //indexPage_uri : this.props.navigation.state.params.indexUrl ? this.props.navigation.state.params.indexUrl :  null
        };
    }

    UNSAFE_componentWillMount() { 

        this._setIndexPage();              
    }


    _setIndexPage () {    
        this.setState({
            indexPage_body : JSON.stringify(
                {
                    'isPlatform' : Platform.OS,
                    'movieurl' : this.props.movieurl,
                    
                }
            )
        }) 
    }

    componentDidMount() {
        
        this.setState({
            isLoading : false
        })  
    }
    UNSAFE_componentWillUnmount() {
        
    }

    
    onNavigationStateChange = async(navState) =>{
        //console.log('navState',navState);
        this.setState({
            willgoback : navState.canGoBack,
            willgoforward : navState.canGoForward,
        }) 
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
    

    /**
     * 영화목록을 받아와서 화면에 전달한다.
     */
    getMovieList = msgData => {
        const option = {
            method: 'GET',
            timeout: 60000
        }
        let url = msgData.data.url;
        console.log('fetch url', url)
        fetch(url, option)
            .then(res => {
                return res.json()
            })
            .then(response => {
                console.log('<====== response', response);
                msgData.isSuccessfull = true;
                msgData.data = response;
                try {
                    this.appWebview.postMessage(JSON.stringify(msgData));
                    console.log("no Error");
                } catch (e) {
                    console.log("Error parsing promise");
                    console.log(e);                    
                }              
            })
            .catch(error => {
                console.log(error)
            })
    }

 
    passValues= () =>{        
        /*
        let data = {
            isPlatform : Platform.OS
        }
        console.log("Platform.OS",Platform.OS);
        this.appWebview.postMessage(JSON.stringify(data));        
        */        
    }

    _updatewebviewdata = async (url,flag) => {
        console.log('url',url);
       
        if ( flag === 'GB') {
            this.appWebview.reload();                
        }else{
            this.setState({
                indexPage_uri : url
            })   
        }
    }

    setTextIntoClipboard = async () => {
        const alerttoast = Toast.show('URL이 복사되었습니다.');
        setTimeout(() => {
            Toast.hide(alerttoast);                
        }, 1000)
        Clipboard.setString(this.state.indexPage_uri);
        
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
                
                    <WebView
                        startInLoadingState={true}
                        style={styles.webview}
                        source={{
                            uri : this.state.indexPage_uri,
                            //headers : this.state.indexPage_headers,
                            body : this.state.indexPage_body,
                            method : this.state.indexPage_method
                        }}                    
                        originWhitelist={['*']}
                        ref={webview => this.appWebview = webview}
                        //ref="webview"
                        onMessage={this.onWebViewMessage}
                        javaScriptEnabled={true}
                        useWebKit={true}
                        injectedJavaScript={patchPostMessageJsCode}
                        onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                        scrollEnabled={true}
                        domStorageEnabled={true}
                        onError={() => {
                            
                        }}
                        mixedContentMode={'always'}
                        useWebKit={true}
                        onLoadEnd={() => this.passValues()}
                        renderLoading={()=>(<ActivityIndicator size="large" />)}
                    />                   
                
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
        zIndex:5,
        width: SCREEN_WIDTH,
        height: Platform.OS === 'ios' ? SCREEN_WIDTH-20 : SCREEN_WIDTH
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