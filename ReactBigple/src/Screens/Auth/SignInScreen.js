import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    TextInput,
    TouchableOpacity,
    FlatList,
    Linking,
    ScrollView,
} from 'react-native';
import {CheckBox, ListItem} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart';
import RNExitApp from 'react-native-exit-app';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

import signinStyles from '../../Styles/SigninStyle';
import initStore from '../../Ducks/mainStore';
const store = initStore();

const Item = ({data}) => {
    return (
        <View style={signinStyles.item}>
            <Text
                onPress={() => Linking.openURL(data.url)}
                style={signinStyles.scalableText_W3}>
                - {data.name}: {data.url}
            </Text>
        </View>
    );
};

const familySiteList = [
    {name: '해커스 인강', url: 'http://m.champ.hackers.com/', id: '1'},
    {name: '해커스 톡', url: 'http://m.talk.hackers.com/', id: '2'},
    {name: '해커스 PREP', url: 'http://prep.hackers.com/', id: '3'},
    {name: '해커스 금융', url: 'http://m.fn.hackers.com/', id: '4'},
    {name: '해커스 임용', url: 'http://m.teacher.hackers.com/', id: '5'},
    {name: '해커스 공무원 1/15', url: 'http://m.gosi.hackers.com/', id: '6'},
    {name: '해커스 공무원 2/15', url: 'http://m.gosi.hackers.com/', id: '8'},
    {name: '해커스 공무원 3/15', url: 'http://m.gosi.hackers.com/', id: '9'},
    {name: '해커스 공무원 4/15', url: 'http://m.gosi.hackers.com/', id: '10'},
    {name: '해커스 공무원 5/15', url: 'http://m.gosi.hackers.com/', id: '11'},
    {name: '해커스 공무원 6/15', url: 'http://m.gosi.hackers.com/', id: '12'},
    {name: '해커스 공무원 7/15', url: 'http://m.gosi.hackers.com/', id: '13'},
    {name: '해커스 공무원 8/15', url: 'http://m.gosi.hackers.com/', id: '14'},
    {name: '해커스 공무원 9/15', url: 'http://m.gosi.hackers.com/', id: '15'},
    {name: '해커스 공무원 10/15', url: 'http://m.gosi.hackers.com/', id: '16'},
    {name: '해커스 공무원 11/15', url: 'http://m.gosi.hackers.com/', id: '17'},
    {name: '해커스 공무원 12/15', url: 'http://m.gosi.hackers.com/', id: '18'},
    {name: '해커스 공무원 13/15', url: 'http://m.gosi.hackers.com/', id: '19'},
    {name: '해커스 공무원 14/15', url: 'http://m.gosi.hackers.com/', id: '20'},
    {name: '해커스 공무원 15/15', url: 'http://m.gosi.hackers.com/', id: '21'},
];

class SignInScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            rememberMe: false,
            token: '',
            userName: null,
        };

        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerMode: null,
        };
        // const params = navigation.state.params || {};
        // return {
        //     headerTitle: params.newtitle,
        //     headerRight: params.newheaderRight,
        //     headerStyle: {
        //         backgroundColor: '#173f82',
        //     },
        //     headerTitleStyle: {
        //         color: '#fff',
        //         fontWeight: 'bold',
        //     },
        // };
    };

    // _setNavigationParams() {
    //     let newtitle = '로그인';
    //     let newheaderRight = (
    //         <View style={{flex: 1, width: 50}}>
    //             <Icon
    //                 name="times"
    //                 size={25}
    //                 color="#fff"
    //                 style={{textAlign: 'right', paddingRight: 10}}
    //                 onPress={() => this.closeModal()}
    //                 // onPress={() => this._checkLogout()}
    //             />
    //         </View>
    //     );

    //     this.props.navigation.setParams({
    //         newtitle,
    //         newheaderRight,
    //     });
    // }

    UNSAFE_componentWillMount() {
        // this._setNavigationParams();
        AsyncStorage.getItem('userToken')
            .then(token => {
                this.setState({token: token});
            })
            .catch(error => {
                this.setState({token: null});
            });

        AsyncStorage.getItem('rememberMe')
            .then(isnull => {
                if (isnull === null) {
                    this.setState({rememberMe: false});
                    this.setState({email: null});
                } else {
                    this.setState({rememberMe: true});
                    this.setState({email: isnull});
                }
            })
            .catch(error => {
                this.setState({rememberMe: false});
            });
    }

    _checkLogout() {
        Alert.alert(
            'Hackers Alert',
            'Are you sure exit app?',
            [
                {text: 'ok', onPress: this._fn_ExitApp.bind(this)},
                {text: 'cancel', onPress: () => null},
            ],
            {cancelable: true},
        );
    }

    closeModal() {
        // this.props.navigation.popToTop();
        this.props.navigation.goBack(null);
    }

    _fn_ExitApp() {
        RNExitApp.exitApp(); // 앱 종료
    }

    handleChangeEmail = email => {
        this.setState({email: email});
    };
    handleChangePassword = password => {
        this.setState({password: password});
    };

    // 로그인
    handlePressSigninButton = () => {
        const {email, password} = this.state;
        if (!email || email.trim() === '') {
            Alert.alert('Login', '아이디를 입력해 주세요.');
            return false;
        }

        if (!password || password.trim() === '') {
            Alert.alert('Login', '비밀번호를 입력해 주세요.');
            return false;
        }
        this._fn_login();
    };

    // 로그인 처리
    _fn_login = async () => {
        try {
            const response = await fetch(
                'https://reactserver.hackers.com:3001/loginporcess',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: this.state.email ? this.state.email : null,
                        password: this.state.password
                            ? this.state.password
                            : null,
                    }),
                },
            );

            const result = await response.json();

            if (result.length > 0) {
                console.log('result : ', result[0]);
                if (this.state.rememberMe === true) {
                    try {
                        await AsyncStorage.setItem(
                            'rememberMe',
                            this.state.email,
                        );
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    try {
                        await AsyncStorage.setItem('rememberMe', null);
                    } catch (e) {
                        console.log(e);
                    }
                }
                this.setState({user: result[0]}, function() {});
                //console.log('result[0].UserPassword', result[0].password);
                try {
                    await AsyncStorage.setItem('userToken', result[0].password);
                } catch (e) {
                    console.log(e);
                }

                try {
                    await AsyncStorage.setItem('userName', result[0].name);
                } catch (e) {
                    console.log(e);
                }
                // this.props.navigation.state.params.onGoBack();
                this.props.navigation.goBack(null);
                // RNRestart.Restart();
            } else {
                Alert.alert('Login', '등록된 계정이 없습니다.');
                this.setState({isFetching: false});
            }
        } catch (error) {
            Alert.alert('Error', error);
            console.log(error);
        }
    };

    // 회원가입
    handlePressSignup = () => {
        this.props.navigation.navigate('SignUp01');
    };

    // 아이디/비번 찾기
    handlePressFindid = () => {
        this.props.navigation.push('SignUp01');
    };

    render() {
        return (
            <ScrollView>
                <View style={signinStyles.container}>
                    <Text style={signinStyles.pageTitle}>
                        해커스 통합 회원{' '}
                        <Text style={signinStyles.textSkyBlue}>로그인</Text>
                    </Text>
                    <View style={signinStyles.signinForm}>
                        <TextInput
                            style={signinStyles.textInput}
                            placeholder="아이디"
                            keyboardType="email-address"
                            value={this.state.email}
                            onChangeText={text => this.handleChangeEmail(text)}
                        />
                        <TextInput
                            style={signinStyles.textInput}
                            placeholder="비밀번호"
                            autoCompleteType="password"
                            secureTextEntry
                            value={this.state.password}
                            onChangeText={text =>
                                this.handleChangePassword(text)
                            }
                        />
                        <View style={signinStyles.signinOptions}>
                            <CheckBox
                                containerStyle={signinStyles.rememberMe}
                                title="로그인 상태 유지"
                                textStyle={signinStyles.scalableText_W3}
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                                // checkedIcon={<Image source={require('../checked.png')} />}
                                // uncheckedIcon={<Image source={require('../unchecked.png')} />}
                                checked={this.state.rememberMe}
                                onPress={() =>
                                    this.setState({
                                        rememberMe: !this.state.rememberMe,
                                    })
                                }
                            />
                            <View style={signinStyles.signinLink}>
                                <TouchableOpacity
                                    onPress={this.handlePressSignup}>
                                    <Text style={signinStyles.scalableText_W3}>
                                        회원가입
                                    </Text>
                                </TouchableOpacity>
                                <Text style={signinStyles.scalableText_W3}>
                                    {' '}
                                    |{' '}
                                </Text>
                                <TouchableOpacity
                                    onPress={this.handlePressFindid}>
                                    <Text style={signinStyles.scalableText_W3}>
                                        아이디/비밀번호 찾기
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[signinStyles.btnPrimary, signinStyles.loginButton]}
                            onPress={this.handlePressSigninButton}>
                            <Text style={signinStyles.loginButtonTitle}>
                                로그인
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={signinStyles.signinDesc}>
                        <Text style={signinStyles.descTitle}>해커스 통합 회원이란</Text>
                        <Text style={signinStyles.descText}>
                            해커스 교육그룹에서 운영하는 아래의 서비스에서 제공하는
                            모든 유.무료의 교육 정보 서비스를 하나의 아이디로
                            편리하게 이용 할 수 있는 통합 아이디 입니다.
                        </Text>
                        <View style={signinStyles.familySite}>
                            <FlatList
                                data={familySiteList}
                                renderItem={({item}) => <Item data={item} />}
                                keyExtractor={item => item.id}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

export default SignInScreen;
