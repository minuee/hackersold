import React, { Component } from 'react';
import {
    StyleSheet,Text,View,TouchableHighlight,Alert,ActivityIndicator,ScrollView,NativeModules,TouchableOpacity,Platform
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

import t from 'tcomb-form-native';
import FetchingIndicator from 'react-native-fetching-indicator';

export const MyContext = React.createContext();

const Form = t.form.Form;

const LoginForm = t.struct({
    email : t.String,
    password : t.String,
    rememberMe : t.Boolean
});
import RNRestart from 'react-native-restart';
import RNExitApp from "react-native-exit-app";


const options = {
    fields : {
        email : {
            label : 'E-Mail',
            error : "e-mail주소를 입력하세요!",
            placeholder : "Email",
            placeholderTextColor : "#dddddd"
        },
        password : {
            label : 'Password',
            error : "패스워드를 입력해주세요.",
            placeholder : "비밀번호",
            placeholderTextColor : "#dddddd"
        },
        rememberMe : {
            label : 'ID 저장',
            isCollapsed :  true
        }
    }
};

export default class SignInScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email : null,
            password : null,
            rememberMe :  false,
            isFetching :  false,
            IsMemoryID : false,
            user: {},
            isLoading: true,
            token: '',
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
    }

    static navigationOptions = ({navigation}) => {

        const params =  navigation.state.params || {};
        return {
            headerTitle: params.newtitle,
            headerRight: params.newheaderRight
        }
    };

    _setNavigationParams(){
        let newtitle = "Login";
        let newheaderRight = (
            <View style={{flex:1,width:50}}>
                <Icon name="times" size={25} color="#ccc" style={{textAlign : 'right', paddingRight:10}}
                      onPress={() => this._checkLogout()} />
            </View>);

        this.props.navigation.setParams({
            newtitle,
            newheaderRight
        });
    }

    _checkLogout (){
        Alert.alert(
            "Hackers Alert",
            "Are you sure exit app?",
            [
                {text: 'ok', onPress: this._fn_ExitApp.bind(this)},
                {text: 'cancel', onPress: () => null},
            ],
            { cancelable: true }
        )
    }

    _fn_ExitApp(){
        RNExitApp.exitApp();  // 앱 종료
    }

    UNSAFE_componentWillMount() {

        this._setNavigationParams();
        AsyncStorage.getItem('userToken')
            .then((token) => {
                this.setState({ token : token });
            })
            .catch(error => {
                this.setState({ token : null });
            });

        AsyncStorage.getItem('rememberMe')
            .then((isnull) => {
                if ( isnull === null ) {
                    this.setState({ rememberMe : false });
                    this.setState({ email : null });
                }else{
                    this.setState({ rememberMe : true });
                    this.setState({ email : isnull });
                }
            })
            .catch(error => {
                this.setState({ rememberMe : false });
            });
    }


    onClickListener = async(viewId) => {

        const value = this._form.getValue();
        console.log('token : ', this.state.token);
        if ( value !== null  ) {
            let params = {
                email: value.email,
                password: value.password
            };

            this.setState({
                email : value.email,
                password : value.password
            });

            let formBody = [];
            for (let property in params) {
                let encodedKey = encodeURIComponent(property);
                let encodedValue = encodeURIComponent(params[property]);
                formBody.push(encodedKey + "  : " + encodedValue);
            }

            this.setState({ isFetching: true});
            await fetch("https://reactserver.hackers.com:3001/loginporcess", {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: value.email ? value.email : null,
                    password: value.password ? value.password : null
                })
                /*headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formBody*/
            })
                .then((response) => response.json())
                .then((response) => {
                    //console.log('response : ', response);

                    //console.log('response Email : ', response[0].Email);
                    if (response.length > 0 ) {
                        //Alert.alert("로그인", "인증결과 " + response[0].UserName);
                        console.log('response : ', response[0]);
                        if ( value.rememberMe === true) {
                            AsyncStorage.setItem('rememberMe', value.email )
                                .then(() => {
                                    //console.log('response rememberMe  Okay');
                                    this.setState({ rememberMe : true });
                                })
                                .catch(error => {
                                    this.setState({ rememberMe : null });
                                    //console.log('response rememberMe  NG',error);
                                });
                        }else{
                            AsyncStorage.setItem('rememberMe', null )
                                .then(() => {
                                    this.setState({ rememberMe : null });
                                    //console.log('response rememberMe remove Okay');
                                })
                                .catch(error => {
                                    this.setState({ rememberMe : null });
                                    //console.log('response rememberMe remove NG');
                                });

                        }
                        this.setState({ user: response[0]}, function() {

                        });
                        console.log('rresponse[0].UserPassword',response[0].password);
                        AsyncStorage.setItem('userToken', response[0].password )
                            .then((token) => {
                                this.setState({ token })
                            })
                            .catch(error => {
                                this.setState({ error })
                            });
                        AsyncStorage.setItem('userFace', response[0].face )
                            .then((token) => {
                                this.setState({ token })
                            })
                            .catch(error => {
                                this.setState({ error })
                            });

                        this.setState({ isFetching: false});
                        //console.log('this.state : ', this.state);
                        //this.props.navigation.navigate('MainApp');
                        setTimeout(() => {
                            RNRestart.Restart()
                        }, 500)
                        //Plaform.OS == 'android' && RNRestart.Restart();
                        //this.props.navigation.dispatch('MainAppStack');
                        //this.props.navigation.replace('MainAppStack')
                        //this.props.navigation.navigate('MainAppStack' , { LoginToken : this.state.token});
                       // this.props.navigation.navigate('MainApp');
                        //this.props.navigation.dispatch(resetAction);
                        //NativeModules.DevSettings.reload();
                        //navigation.push('GreenScreen');

                    }else{
                        Alert.alert("로그인","등록된 계정이 없습니다.");
                        this.setState({ isFetching: false});

                    }
                })
                .done();
        }

    };

    render() {
        let formdata = {
            email : this.state.email,
            password : this.state.password,
            rememberMe : this.state.rememberMe
        };
        return (
            <View style={styles.container}>
                <ScrollView>
                    <Form
                        type={LoginForm}
                        ref={c=>this._form = c }
                        options={options}
                        value={formdata}
                    />
                    {this.state.isFetching
                        ?
                        <View style={styles.button} onPress={() => this.onClickListener()}>
                            <FetchingIndicator isFetching={this.state.isFetching} message='Loading' color='blue'/>
                        </View>
                        :
                        <View style={[styles.container, styles.horizontal]}>
                            <TouchableHighlight style={styles.button} onPress={() => this.onClickListener()} underlayColor='#99d9f4'>
                                <Text style={styles.buttonText}>Sign In</Text>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.button} onPress={() => this.props.navigation.navigate('SignUp')} underlayColor='#99d9f4'>
                                <Text style={styles.buttonText}>Sign Up</Text>
                            </TouchableHighlight>
                        </View>
                    }
                </ScrollView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:30,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    button: {
        height: 45,
        width : "40%",
        minWidth : 100,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    buttonContainer: {
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        borderRadius:30,
    },
    loginButton: {
        backgroundColor: "#00b5ec",
    },
    buttonText: {
        color: 'white',
    },
    navRTitle : {
        fontSize: 20,
        paddingRight:20
    },
    navLTitle : {
        fontSize: 20,
        paddingLeft:20
    },
});
