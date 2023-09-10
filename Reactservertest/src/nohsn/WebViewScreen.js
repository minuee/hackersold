import React, { Component } from 'react';
import { StyleSheet, View, Platform, ScrollView, TouchableOpacity, BackHandler,Alert} from 'react-native';
import { WebView } from 'react-native-webview';
import FetchingIndicator from 'react-native-fetching-indicator';
import { Flag } from 'react-native-svg-flagkit';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

const domain = 'https://reactserver.hackers.com/reactindex/';

const index_headers =  {
    'Accept':  'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cache': 'no-cache'
};

export default class WebViewScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            indexPage_uri: domain +'?ver=12',
            indexPage_headers : index_headers,
            indexPage_body : '',
            indexPage_method : 'POST',
            willgoback : false,
            willgoforward : false,
            items : [
                { flag :"KR",url:domain},
                { flag :"JP",url:'https://m.naver.com'},
                { flag :"US",url:'https://m.youtube.com'},
                { flag :"GB",url:domain},
                { flag :"CN",url:domain},
                { flag :"HK",url:domain},
                { flag :"FR",url:domain},
                { flag :"DE",url:domain},
                { flag :"ES",url:domain},
                { flag :"VN",url:domain},
                { flag :"EG",url:domain},
            ]
        };

        this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
        
    }

    static navigationOptions = () => {
        return {
            header: null
        };
    };
    /*
    static navigationOptions = ({navigation, screenProps}) => {

        const params =  navigation.state.params || {};
        return {
            headerTitle: params.newtitle,
            headerLeft: params.newheaderLeft
        }
    };

    _setNavigationParams(){
        let newtitle = this.state.sname ? this.state.sname : null;
        let newheaderLeft = (
            <View style={{flex:1,width:50}}>
                <Icon name="chevron-left" size={25} color="#fff" style={{textAlign : 'right', paddingRight:10}}
                      onPress={() => this.goBackHandlerEvent()} />
            </View>);

        this.props.navigation.setParams({
            newtitle,
            newheaderLeft
        });
    }
    */

    UNSAFE_componentWillMount() {
        //this._setNavigationParams();
        this._setIndexPage();
        console.log('indexPage_uri', this.state.indexPage_uri);
    }

    _setIndexPage () {    
        this.setState({
            indexPage_body : JSON.stringify(
                {
                    'isPlatform' : Platform.OS,
                    "UserId": 'minuee@hackers.com',
                    "UserName": "노성남"
                }
            )
        }) 
    }

    componentDidMount() {
        //this.props.navigation.setParams({ goBackHandlerEvent: this.goBackHandlerEvent });
        BackHandler.addEventListener('hardwareBackPress',this.BackHandlerEvent);
    }
    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress');
    }

    BackHandlerEvent = () => {
        Alert.alert(
            "Hackers Alert",
            "Are you sure exit this page?",
            [
                {text: 'ok', onPress: this.props.navigation.goBack(null)},
                {text: 'cancel', onPress: () => null},
            ],
            { cancelable: true }
        )
        
    }

    goBackHandlerEvent ( wind ) {
        if ( wind === 'left') {
            if ( this.state.willgoback) {
                this.appWebview.goBack();
                return true;
            }
            //console.log('this.state.cangoback',this.state.cangoback);
            this.props.navigation.goBack(null);
        }else if ( wind === 'right') {
            if ( this.state.willgoforward) {
                this.appWebview.goForward();
                return true;
            }
        }else{
            
        }
    }


    onNavigationStateChange(navState){
        console.log('navState',navState);
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
                /*
                if (this.appWebview) {
                    this.appWebview.injectJavaScript(window.postMessage(JSON.stringify(msgData), '*'));
                }
                */
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
        
    
        return (
            <View style={styles.container}>
                <WebView
                    startInLoadingState={true}
                    style={styles.webview}
                    source={{
                        uri : this.state.indexPage_uri,
                        headers : this.state.indexPage_headers,
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
                    onError={() => {alert('Error Occured'); Actions.pop()}}                    
                    mixedContentMode={'always'}
                    useWebKit={true}
                    onLoadEnd={() => this.passValues()}
                    renderLoading={()=>(<FetchingIndicator isFetching message='just moment' color='blue'  />)}
                />
                <View style={styles.footer_container}>
                    <View style={styles.footer_left}>
                        { this.state.willgoback && 
                        <Icon name="chevron-left" size={35} color="#fff" style={{textAlign : 'right', paddingRight:10}} onPress={() => this.goBackHandlerEvent('left')} />
                        }
                    </View>
                    <ScrollView horizontal={true} style={{marginHorizontal:50}}>
                        {this.state.items.map((data, index) => {
                            return (
                                <TouchableOpacity style={styles.itemContainer} onPress= {()=> this._updatewebviewdata(data.url,data.flag)}>
                                    <Flag id={data.flag} size={0.2} />
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                    <View style={styles.footer_right}>
                        { this.state.willgoforward && 
                        <Icon name="chevron-right" size={35} color="#fff" style={{textAlign : 'right', paddingRight:10}} onPress={() => this.goBackHandlerEvent('right')} />
                        }
                    </View>
                </View>
            </View>
        );
       
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
    footer_container:{
        width: '100%',
        height: 45,
        backgroundColor: '#20d2bb',
        justifyContent:'flex-start'
    },
    footer_left : {
        position: "absolute",
        top:5,
        left:5,
        height:35,
        width:40,        
        zIndex:2
    },
    footer_right : {
        position: "absolute",
        top:5,
        right:5,
        height:35,
        width:40,        
        zIndex:2
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