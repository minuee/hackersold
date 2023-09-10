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
            token: '',
            userFace : null,          
            tabshome : true,
            tabshard : false,
            tabssoft : false,
            tabsetc : false

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
                navOptionThumb: 'hand-o-up',
                navOptionName: 'FingerPring Screen',
                screenToNavigate: 'NavFingerScreen',
            },
            {
                tabs : 'tabshard',
                tabsName : null,
                navOptionThumb: 'camera',
                navOptionName: 'Camera Screen',
                screenToNavigate: 'NavRNCamera',
            },
            {
                tabs : 'tabshard',
                tabsName : null,
                navOptionThumb: 'wikipedia-w',
                navOptionName: 'Webview Screen',
                screenToNavigate: 'NavWebViewScreen',
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
                navOptionThumb: 'map-marker',
                navOptionName: 'MapView Screen',
                screenToNavigate: 'NavMapViewScreen',
            },
            {
                tabs : 'tabssoft',
                tabsName : null,
                navOptionThumb: 'group',
                navOptionName: 'UserList Screen',
                screenToNavigate: 'NavUserListScreen',
            },
            {
                tabs : 'tabssoft',
                tabsName : null,
                navOptionThumb: 'calendar',
                navOptionName: 'Calendar Screen',
                screenToNavigate: 'NavCalendarScreen',
            },
            {
                tabs : 'tabssoft',
                tabsName : null,
                navOptionThumb: 'calendar',
                navOptionName: 'Calendar2 Screen',
                screenToNavigate: 'NavCalendarScreen2',
            },
            {
                tabs : 'tabssoft',
                tabsName : null,
                navOptionThumb: 'trello',
                navOptionName: 'Tabs Screen',
                screenToNavigate: 'NavTabsScreen',
            },
            {
                tabs : 'tabssoft',
                tabsName : null,
                navOptionThumb: 'spinner',
                navOptionName: 'Redux(Saga) Screen',
                screenToNavigate: 'NavReduxScreen',
            },
            {
                tabs : 'tabssoft',
                tabsName : null,
                navOptionThumb: 'spinner',
                navOptionName: 'Redux(Thunk) Screen',
                screenToNavigate: 'NavRedux2Screen',
            },
            {
                tabs : 'tabssoft',
                tabsName : null,
                navOptionThumb: 'newspaper-o',
                navOptionName: 'NewsApi Screen',
                screenToNavigate: 'NavNewsScreen',
            },
        ];


    }
    componentDidMount() {
        //console.log("this.open LoginToken ",this.state.LoginToken );
        AsyncStorage.getItem('userFace')
        .then((face) => {
            const face2 = face !== null ? face : "https://reactserver.hackers.com/assets/images/react/avatar6.png";
            this.setState({ userFace : face2 });
        })
        .catch(error => {
            this.setState({ userFace :  null });
        })
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

    _checkLogout(){
        this.state.removeToken();
        RNRestart.Restart();
        //this.props.navigation.dispatch(resetAction);
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
        return (
            <View style={styles.sideMenuContainer}>

                <View style={{ flexDirection: 'row',width: '100%',justifyContent:'flex-end', paddingTop: 4,paddingBottom: 4,paddingRight: 6,backgroundColor: '#c375f4'}}>
                    <Icon2 name="close" size={30} color="#fff" onPress={this.toggleDrawer2.bind(this)} />
                </View>
                <View style={{ height: 120, width: '100%', paddingVertical:10, backgroundColor:'#c375f4'}}>
                    <Image style={styles.avatar} source={this.state.userFace === null  ? null : {uri: this.state.userFace}}/>
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
