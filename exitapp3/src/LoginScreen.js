import React, { Component } from 'react';
import {
    StyleSheet,Text,View,TouchableHighlight,Alert,AsyncStorage,ActivityIndicator,ScrollView,NativeModules
} from 'react-native';

import { NavigationActions,StackActions } from 'react-navigation'
import t from 'tcomb-form-native';
import FetchingIndicator from 'react-native-fetching-indicator';

export const MyContext = React.createContext();

const Form = t.form.Form;

const LoginForm = t.struct({
    email : t.String,
    password : t.String,
    rememberMe : t.Boolean
});

const dvalue = {
    email : 'minuee@nate.com',
    password : 'lena47',
    rememberMe :  false
};
const options = {
    fields : {
        email : {
            label : 'input to email address',
            error : "Insert a valid email address",
            placeholder : "Email",
            placeholderTextColor : "#dddddd",
            help : 'this is help message'
        },
        password : {
            label : 'Enter a Password',
            error : "패스워드를 입력해주세요.",
            placeholder : "비밀번호",
            placeholderTextColor : "#dddddd"
        },
        rememberMe : {
            label : 'ID 저장',
            isCollapsed :  false
        }
    }
};

const initials = {
    kConsumerKey: 'jGgxO4j2tScindpHT9mI',
    kConsumerSecret: 'RwCNAxgZXO',
    kServiceAppName: '해커스리액트테스트앱01',
    kServiceAppUrlScheme: 'hackersscheme', // only for iOS
};


class LoginScreen extends Component {

    constructor(props) {
        super(props);
    }

    static navigationOptions = () => {
        return {
            headerRight : <Text style={styles.navTtitle}>로그인</Text>
        };
    };

    state = {
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

    UNSAFE_componentDidMount() {
        //AsyncStorage.getItem('rememberMe').then((value) => state.IsMemoryID = true );
        AsyncStorage.getItem('userToken')
            .then((token) => {
                this.setState({ token })
            })
            .catch(error => {
                this.setState({ error })
            })
    }



    onClickListener = (viewId) => {
        //Alert.alert("Alert", "Button pressed "+viewId);
        AsyncStorage.getItem('userToken')
            .then((token) => {
                this.setState({ token })
            })
            .catch(error => {
                this.setState({ error })
            });

        this.setState({ isFetching: true});
        const value = this._form.getValue();

        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'HomeScreen' }),
            ],
            key: null
        });


        if ( value.email && value.password) {
            let params = {
                email: value.email ? value.email : null,
                password: value.password ? value.password : null,
                mode :  __DEV__ ? 'dev' : 'prod'
            };

            let formBody = [];
            for (let property in params) {
                let encodedKey = encodeURIComponent(property);
                let encodedValue = encodeURIComponent(params[property]);
                formBody.push(encodedKey + "  : " + encodedValue);
            }
            //formBody = formBody.join("&");

            fetch("http://52.78.207.87:8080/loginporcess", {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: value.email ? value.email : null,
                    password: value.password ? value.password : null,
                    mode :  __DEV__ ? 'dev' : 'prod'
                })
                /*headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formBody*/
            })
                .then((response) => response.json())
                .then((response) => {
                    console.log('response : ', response);
                    //console.log('response Email : ', response[0].Email);
                    if (response.length > 0 ) {
                        //Alert.alert("로그인", "인증결과 " + response[0].UserName);
                        if ( value.rememberMe === true) {

                        }else{

                        }
                        this.setState({ user: response[0]}, function() {

                        });

                        AsyncStorage.setItem('userToken', response[0].UserPassword )
                            .then((token) => {
                                this.setState({ token })
                            })
                            .catch(error => {
                                this.setState({ error })
                            });

                        this.setState({ isFetching: false});
                        //this.props.navigation.dispatch(resetAction);
                        this.props.navigation.replace('TabNavigator')
                        //this.props.navigation.navigate('HomeScreen' , { LoginToken : this.state.token});
                        //this.props.navigation.dispatch(resetAction);
                        //NativeModules.DevSettings.reload();
                        //navigation.push('GreenScreen');

                    }else{
                        Alert.alert("로그인","등록된 계정이 없습니다.");
                        this.setState({ isFetching: false}, function() {
                            // do something with new state
                        });
                    }


                })
                .done();
        }

    };

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <MyContext.Provider value={this.state}>
                        {this.props.children}
                    </MyContext.Provider>
                    <Form
                        type={LoginForm}
                        ref={c=>this._form = c }
                        options={options}
                        value={dvalue}
                    />
                    <TouchableHighlight style={styles.button} onPress={() => this.onClickListener('login')} underlayColor='#99d9f4'>
                        <Text style={styles.buttonText}>{this.state.token === null ? "LOGIN" : "LOGOUT"}</Text>
                    </TouchableHighlight>
                    <FetchingIndicator isFetching={this.state.isFetching} message='Loading' color='blue'  />
                </ScrollView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        justifyContent: 'center',
        marginTop: 50,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    button: {
        height: 45,
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
    navTtitle : {
        fontSize: 20,
        paddingRight:20
    },
});

export default LoginScreen;