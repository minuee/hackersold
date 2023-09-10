//This is an example code for Navigation Drawer with Custom Side bar//
import React, { Component } from 'react';
import {View, StyleSheet, Image, Text, Alert, ScrollView,TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/AntDesign';
import RNRestart from "react-native-restart";
import RNExitApp from 'react-native-exit-app';

export default class CustomSidebarMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            TopUserToken: null,
            userName : null,          
            tabshome : true,
            tabshard : false,
            tabssoft : false,
            tabsetc : false,
            saveToken: async () => {
                try {
                    const resp = await AsyncStorage.setItem('userToken', 'abc');
                    return resp;
                }
                catch (error) {
                    this.setState({ error })
                }

            },
            removeToken: async () => {
                try {
                    const resp = await AsyncStorage.removeItem('userToken');
                    return resp
                }
                catch (error) {
                    this.setState({ error })
                }
            },
            getToken: async () => {
                try {
                    const resp = await AsyncStorage.getItem('userToken');
                    return resp;
                }
                catch (error) {
                    this.setState({ error })
                }
            }

        };

        console.log("global.currentScreenIndex",global.currentScreenIndex);

        this.items = [
            {
                tabs : 'home',
                tabsName : null,
                navOptionThumb: 'home',
                navOptionName: 'Home Screen',
                screenToNavigate: 'NavHomeScreen',
            },
            {
                tabs : 'tabshard',
                tabsName : "Native H/W Control",
                navOptionThumb: 'plus',
                navOptionName: 'main',
                screenToNavigate: null,
            },            
            {
                tabs : 'tabshard',
                tabsName : null,
                navOptionThumb: 'clock-o',
                navOptionName: 'Timer Screen',
                screenToNavigate: 'NavTimerScreen',
            },
            {
                tabs : 'tabssoft',
                tabsName : "Native S/W Control",
                navOptionThumb: 'plus',
                navOptionName: 'main',
                screenToNavigate: null,
            },
            {
                tabs : 'tabssoft',
                tabsName : null,
                navOptionThumb: 'spinner',
                navOptionName: 'Elements Test Screen',
                screenToNavigate: 'NavElementsScreen',
            },
        ];


    }
    componentDidMount() {
        AsyncStorage.getItem('userToken')
          .then((token) => {            
            this.setState({ TopUserToken : token });
        })
        .catch(error => {
            this.setState({ TopUserToken :  null });
        }); 
        
        AsyncStorage.getItem('userName')
          .then((name) => {
            //console.log("userName",name);
          this.setState({ userName : name });
        })
        .catch(error => {
            this.setState({ userName :  null });
        }); 
    }


    _TerminateApp(){
        Alert.alert(
            "Hackers Alert",
            "Are you sure exit app?",
            [
                {text: 'ok', onPress: this._exitapp.bind(this)},
                {text: 'cancel', onPress: () => null},
            ],
            { cancelable: true }
        )
    }

    _exitapp(){
        RNExitApp.exitApp();  // 앱 종료
    }

    _checkLogout = async() =>{
        this.state.removeToken();
        RNRestart.Restart();        
    }

    toggleDrawer2 = () => {
        this.props.navigation.toggleDrawer();
    }

    _switchSubmenu = ( tagname,chstatus ) =>{

        if ( chstatus ) {
            switch( tagname ) {
                case 'tabssoft' : this.setState({tabssoft : false }); break;
                case 'tabshard' : this.setState({tabshard : false }); break;
                case 'tabsetc' : this.setState({tabsetc : false }); break;
                default : null; break;
            }

        }else{
            switch( tagname ) {
                case 'tabssoft' : this.setState({tabssoft : true }); break;
                case 'tabshard' : this.setState({tabshard : true }); break;
                case 'tabsetc' : this.setState({tabsetc : true }); break;
                default : null; break;
            }
        }

}


    render() {
        if ( this.state.TopUserToken === null ) {
            return (
                <View style={styles.sideMenuContainer}>

                    <View style={{ flexDirection: 'row',width: '100%',justifyContent:'flex-end', paddingTop: 10,paddingBottom: 4,paddingRight: 6,backgroundColor: '#fff'}}>
                        <Icon2 name="close" size={30} color="#888" onPress={this.toggleDrawer2.bind(this)} />
                    </View>
                    <View style={{ height: 40, width: '100%', justifyContent: "center", alignItems: "center", backgroundColor:'#ffffff'}}>
                        <Text>로그인이 필요</Text>
                    </View>
                    <View>
                        <TouchableOpacity  
                        style={{flexDirection: 'row',paddingTop: 10, paddingBottom: 10}} 
                            onPress={() => {                                            
                                this.props.navigation.navigate('SignInScreen');
                            }}
                        >
                            <Text style={{fontSize: 15}}>
                                Go Login
                            </Text>   
                        </TouchableOpacity>                     
                    </View>
                       
                </View>
            )
        }else{
            return (
                <View style={styles.sideMenuContainer}>

                    <View style={{ flexDirection: 'row',width: '100%',justifyContent:'flex-end', paddingTop: 10,paddingBottom: 4,paddingRight: 6,backgroundColor: '#fff'}}>
                        <Icon2 name="close" size={30} color="#888" onPress={this.toggleDrawer2.bind(this)} />
                    </View>
                    <View style={{ height: 40, width: '100%', justifyContent: "center", alignItems: "center", backgroundColor:'#ffffff'}}>
                        <Text>{this.state.userName}님 반갑습니다.</Text>
                    </View>               
                    <ScrollView style={{width: '100%'}}>
                        <View>
                        {this.items.map((item, key) => {
                            let Tagstatus = false;
                            switch( item.tabs) {
                                case 'tabssoft' : Tagstatus = this.state.tabssoft; break;
                                case 'tabshard' : Tagstatus = this.state.tabshard; break;
                                case 'tabsetc' : Tagstatus = this.state.tabsetc; break;
                                default : Tagstatus = true; break;
                            }
                            if (item.screenToNavigate === null && item.navOptionName == 'main' ) {
                                return (
                                    <TouchableOpacity  style={{flexDirection: 'row',paddingTop: 10, paddingBottom: 10, backgroundColor: Tagstatus ? '#9b9b9b' : '#ffffff',}} key={key}
                                        onPress={() => {
                                            
                                            this._switchSubmenu(item.tabs , Tagstatus)
                                        }}
                                    >
                                        <Text style={{marginRight: 10, marginLeft: 20, fontSize: 15, color: 'black'}}>
                                            {item.tabsName}
                                        </Text>
                                        <View style={{position:'absolute',right:20, top :10, width:40,alignItems : 'flex-end'}}>
                                            <Icon name={Tagstatus ? 'minus' : item.navOptionThumb} size={15} color="#808080" />
                                        </View>
                                    </TouchableOpacity>
                                )

                            }else {
                                return (
                                    <TouchableOpacity  style={{ display: Tagstatus ? 'flex' : 'none',flexDirection: 'row', alignItems: 'center', paddingTop: 10, paddingBottom: 10, backgroundColor: global.currentScreenIndex === key ? '#ebebeb' : '#ffffff',borderBottomColor: '#ebebeb',borderBottomWidth: 1,}} key={key}
                                        onPress={() => {
                                            global.currentScreenIndex = key;
                                            this.toggleDrawer2,
                                            this.props.navigation.navigate(item.screenToNavigate);
                                        }}
                                    >
                                        <View style={{marginRight: 10, marginLeft: 30}}>
                                            <Icon name={item.navOptionThumb} size={25} color="#808080"/>
                                        </View>
                                        <Text style={{fontSize: 15, color: global.currentScreenIndex === key ? 'red' : 'black',}}>
                                            {item.navOptionName}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }
                            })
                        }

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingTop: 10,
                                paddingBottom: 10,
                                backgroundColor: '#d9da42',
                                borderBottomColor: '#ebebeb',
                                borderBottomWidth: 1
                            }}>
                            <View style={{ marginRight: 10, marginLeft: 20 }}>
                                <Icon2 name="logout" size={25} color="#808080" />
                            </View>
                            <Text
                                style={{
                                    fontSize: 15,
                                    color: 'black',
                                }}
                                onPress={this._checkLogout.bind(this)}
                            >
                                Log Out
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingTop: 10,
                                paddingBottom: 10,
                                backgroundColor: '#d9da42',
                                borderBottomColor: '#ebebeb',
                                borderBottomWidth: 1
                            }}>
                            <View style={{ marginRight: 10, marginLeft: 20 }}>
                                <Icon name="power-off" size={25} color="#808080" />
                            </View>
                            <Text
                                style={{
                                    fontSize: 15,
                                    color: 'black',
                                }}
                                onPress={this._TerminateApp.bind(this)}
                            >
                                Exit App
                            </Text>
                        </View>
                    </View>
                    </ScrollView>
            </View>
            );
        }
    }
}
const styles = StyleSheet.create({
    sideMenuContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    sideMenuProfileIcon: {
        resizeMode: 'center',
        width: 150,
        height: 150,
        marginTop: 20,
        borderRadius: 150 / 2,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: "white",
        alignSelf:'center',
        position: 'absolute',
    },
});
