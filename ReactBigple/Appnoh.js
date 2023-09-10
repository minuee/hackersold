import React from 'react';
import { StyleSheet,BackHandler,ToastAndroid,StatusBar,Modal,SafeAreaView,View,Text,Platform,Dimensions,TouchableOpacity,Button } from 'react-native';
//import NetInfo from "@react-native-community/netinfo";
import * as NetInfo from "@react-native-community/netinfo"
import 'react-native-gesture-handler';
import RNExitApp from 'react-native-exit-app';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';

import { Provider } from 'react-redux';
import { CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import initStore from './src/Ducks/mainStore';
const store = initStore();
const {width: SCREEN_WIDTH} = Dimensions.get("window");
const TodayTimeStamp = moment()+840 * 60 * 1000;  // 서울
const Tomorrow = moment(Tomorrow).add(1, 'day').format('YYYY-MM-DD');
import AppHomeStack from './src/Navigation/RouteScreen';
import AppLoginStack from './src/Navigation/AppNavigator';
import TopPopScreen from './src/Components/TopPopScreen'; 


export default class Appnoh extends React.PureComponent {

    constructor(props) {
        super(props);

       
        this.state = {   
            isConnected : true, 
            exitApp : false,
            LoginToken: null,
            currentScreenIndex : 1,
            deviceId : null,
            isPopUP : true, // 오픈 배너가 잇으면 true
            modalVisible : false,
            popViewCheck : false
        };

        console.log(Date.parse(new Date()));
        /*
        DeviceInfo.getIpAddress().then(ip => {
            console.log("getIpAddress", ip);
        });
        DeviceInfo.getDeviceName().then(deviceName => {
            console.log("getDeviceName", deviceName);
        });
        DeviceInfo.getDevice().then(device => {
            console.log("getDevice", device);
        });
        DeviceInfo.getPhoneNumber().then(phoneNumber => {
            console.log("getPhoneNumber", phoneNumber);
        });
        */
        
    }    

    checkNetwork = async() => {
        if (Platform.OS === "android") {
            NetInfo.addEventListener(state => {
                console.log("Connection type", state.type);
                console.log("Is connected?", state.isConnected);
                this.setState({isConnected: state.isConnected});
            });
        }else{
            NetInfo.isConnected.addEventListener(
            "connectionChange",
            this.handleFirstConnectivityChange
            );

        }
    }
    
    handleFirstConnectivityChange = isConnected => {
        NetInfo.isConnected.removeEventListener(
          "connectionChange",
          this.handleFirstConnectivityChange
        );
        console.log("Is connected?", isConnected);
        this.setState({isConnected: isConnected});        
      };

    UNSAFE_componentWillMount() {
        
        this.checkNetwork();
        this.setState({ deviceId : DeviceInfo.getUniqueId() });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);        
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);        
        
    }

    componentDidMount() {
        console.log('this.state.isPopUP', this.state.isPopUP);
        if ( this.state.isPopUP ) {
            this.getStorageCookie();
        }
        this.getStorageData();//    별도 페이지에서 로그인 여부를 처리중이라 패스            
    }

    

    //
    getStorageData = async () => {
        try {
          const tvalue = await AsyncStorage.getItem('userToken')
          if(tvalue !== null) {            
            this.setState({LoginToken: tvalue});
          }
        } catch(e) {            
            this.setState({LoginToken: null});
        }
    }

    getStorageCookie = async () => {

        try {
            const expireTime = await AsyncStorage.getItem('expireTime')
            console.log('Today', TodayTimeStamp);
            console.log('expireTime', expireTime);
            if( expireTime === undefined || expireTime === null ) {
                console.log('undefined');
                this.setState({modalVisible: true});
            }else if( expireTime < TodayTimeStamp ) {
                console.log('expireTime < TodayTimeStamp');
                this.setState({modalVisible: true});
            }else if( expireTime > TodayTimeStamp ) {
                console.log('expireTime > TodayTimeStamp');
            }
          } catch(e) {            
              this.setState({modalVisible: false});
          }

        
        
    }

    /*
    componentDidUpdate(prevState,nextState){
        console.log("componentDidUpdate: " + nextState.popViewCheck);
       
        if ( typeof nextState.popViewCheck  !== undefined ) {
            console.log("componentDidUpda2te: " + JSON.stringify(nextState));
            return true;
        }
    }
    */
   componentDidUpdate() {
        console.log("componentDidUpdate: ");
         // Unsubscribe
         this.checkNetwork();
    }
    

    handleBackButton = () => {

        if (this.state.exitApp == undefined || !this.state.exitApp) {
            ToastAndroid.show('한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
            this.setState({ exitApp: true });
            this.timeout = setTimeout(
                () => {
                this.setState({ exitApp: false });
            },
                2000    // 2초
            );
        } else {
            clearTimeout(this.timeout);
            this.setState({ exitApp: false });
            RNExitApp.exitApp();  // 앱 종료
        }
        return true;
    };   

    removeCookie = (sval) => {
        this.setState({ popViewCheck: sval }); 
    }

    setCookie = async() => {

        const ExpireDate = Date.parse(new Date(Tomorrow + 'T04:00:00'));
        console.log('ExpireDate', ExpireDate);

        try {
            await AsyncStorage.setItem('expireTime', ExpireDate.toString());
        } catch (e) {
            console.log(e);
        }
    }

    closeTopPop = async() => {
        if ( this.state.popViewCheck ) {
            await this.setCookie();
        }
        this.setState({ modalVisible: false }); 
    }

   

    render() {
        
        const SetupModal=()=>{            
            return (
                <View style={styles.popup}>
                    <View style={styles.popupHeader}>    
                        <View style={styles.popupHeaderButton}>
                            <CheckBox 
                                containerStyle={{padding:0,margin:0}}   
                                //iconType='font-awesome'
                                //checkedIcon='check'
                                //uncheckedIcon='check'
                                checkedColor='#173f82'
                                uncheckedColor='#ffffff'
                                onPress= {()=> this.removeCookie(!this.state.popViewCheck)}
                                checked={this.state.popViewCheck}
                            />
                        </View>
                        <View style={styles.popupHeaderText}>
                            <Text style={styles.txtTitle}>오늘하루 다시 보지 않기</Text>
                        </View>
                        
                        <View style={[styles.popupHeaderButton,{alignItems:'flex-end',paddingRight : 10}]}>
                            <TouchableOpacity onPress= {()=> this.closeTopPop()}>
                                <Icon name="close" size={25} color="#999" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.popupContent}>                        
                        <TopPopScreen />                        
                    </View>                    
                </View>
                )
        }

        if ( this.state.isConnected ) {
            return (
                <Provider store={store}>                
                    { Platform.OS == 'android' && <StatusBar backgroundColor={'#fff'} translucent={false}  barStyle="dark-content" />}
                    <AppHomeStack screenProps={this.state}  />                
                    <Modal
                        animationType={'fade'}
                        transparent={true}
                        onRequestClose={() => this.setState({modalVisible :false})}
                        visible={this.state.modalVisible}>
                        <SafeAreaView style={styles.popupOverlay}>
                            <SetupModal />
                        </SafeAreaView>
                        
                    </Modal>                
                </Provider>
            );
        }else{
            return (
                <View style={styles.Rootcontainer}>
                    <Icon name="wifi" size={100} color="#555" />
                    <View>
                        <Button 
                        title=' 다시 시도 ' 
                        onPress= {()=> this.checkNetwork()}
                        />
                    </View>

                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    Rootcontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    image: {
        width: 200,
        height: 200,
    },
    text: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        paddingVertical: 30,
    },
    title: {
        fontSize: 25,
        color: 'white',
        textAlign: 'center',
        marginBottom: 16,
    },

    /************ modals ************/
    popup: {
        flex:1,
        backgroundColor: 'white',
        marginTop: 5,
        height : '100%',        
        //marginHorizontal: 5,
        borderRadius: 5,
    },
    popupOverlay: {        
        flex: 1,
        
    },
    popupContent: {
        //alignItems: 'center',
        flex :1,
        //margin: 5,        
    },
    popupHeader: {        
        flexDirection :'row',
        height : 30,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center', 
        backgroundColor : '#ebebeb',        
        borderBottomWidth :1,
        borderBottomColor : '#ebebeb'
    },
    popupHeaderButton : {
        flex :1,        
    },
    popupHeaderText : {
        flex :6,
    },
    popupButtonWrapper: {
        height : 100,
        backgroundColor : '#fff',
        alignItems:'center',
        justifyContent:'center',
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        marginBottom :10
    },

    popupButtons : {
        flex:1,
        width:'100%',        
        justifyContent: 'space-around',
        alignItems: 'center',        
    },
    popupButton: {
        flex: 1,
        marginVertical: 16
    },
    btnClose:{
        height:20,
        backgroundColor:'#20b2aa',
        padding:20
    },
    modalInfo:{
        alignItems:'center',
        justifyContent:'center',
    },
    txtTitle : {
        color:'#555',
        fontSize: 15
    }
});