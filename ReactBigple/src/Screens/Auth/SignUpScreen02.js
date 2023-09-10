/**
 * TODO:: Form Validation
 */

import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import {Input, CheckBox, ButtonGroup, Divider, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

import DateTimePicker from 'react-native-modal-datetime-picker';

import commonStyles from '../../Styles/CommonStyle';
import signinStyles, {signupStyles, formStyles} from '../../Styles/SigninStyle';

const validErrorText = {
    userName: '이름을 입력 해주세요.',
    birthday: '생년월일을 입력 해주세요.',
    userID: '아이디를 입력해 주세요.',
    userIDAlready: '이미 사용중인 아이디입니다.',
    userPW: '비밀번호를 입력 해주세요.',
    userPWConfirm: '비밀번호 확인을 입력 해주세요.',
    userEmail: '이메일을 입력 해주세요.',
    phoneNumber: '휴대폰번호를 입력 해주세요.',
    certNumber: '인증번호를 입력 해주세요.',
};
export default class SignUpScreen02 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validatorIsError: {
                userName: false,
                birthday: false,
                userID: false,
                userIDAlready: false,
                userPW: false,
                userPWConfirm: false,
                userEmail: false,
                phoneNumber: false,
                certNumber: false,
            },
            genderButtonIndex: null,
            userName: '',
            birthday: '',
            userID: '',
            userPW: '',
            userPWConfirm: '',
            userEmail: '',
            phoneNumber: '',
            certNumber: '',
        };
        this.genderSelect = this.genderSelect.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
        this.inputValidation = this.inputValidation.bind(this);
    }
    genderSelect(genderButtonIndex) {
        this.setState({genderButtonIndex: genderButtonIndex});
    }
    formSubmit() {
        this.props.navigation.navigate('SignUp03');
    }
    inputValidation(name, value) {
        switch (name) {
            case 'userName':
                if (value === '' || value === undefined) {
                    this.setState({validatorIsError: {...this.state.validatorIsError, userName: true}});
                } else {
                    this.setState({validatorIsError: {...this.state.validatorIsError, userName: false}});
                }
                break;
            case 'birthday':
                if (value === '' || value === undefined) {
                    this.setState({validatorIsError: {...this.state.validatorIsError, birthday: true}});
                } else {
                    this.setState({validatorIsError: {...this.state.validatorIsError, birthday: false}});
                }
                break;
            default:
                break;
        }

        console.log(this.state.validatorIsError.userName);
    }
    render() {
        const genderButtons = ['남자', '여자'];
        const {genderButtonIndex} = this.state;
        return (
            <ScrollView>
                <View style={signupStyles.wrapper}>
                    <View style={signupStyles.container}>
                        <Text style={signinStyles.pageTitle}>
                            해커스 통합 회원{' '}
                            <Text style={signinStyles.textSkyBlue}>신규가입</Text>
                        </Text>

                        {/* 이름 */}
                        <View style={formStyles.inputSection}>
                            <View style={formStyles.inputAndButtonSection}>
                                <TextInput
                                    style={[
                                        formStyles.textInput,
                                        commonStyles.flex2,
                                    ]}
                                    placeholder="이름"
                                    placeholderTextColor="#666"
                                    name="userName"
                                    onChangeText={(name) => this.setState({name})}
                                    onBlur={() => this.inputValidation('userName', this.state.name)}
                                    value={this.state.name}
                                />
                                <ButtonGroup
                                    onPress={this.genderSelect}
                                    selectedIndex={genderButtonIndex}
                                    buttons={genderButtons}
                                    containerStyle={[
                                        formStyles.buttonGroupContainer,
                                        commonStyles.flex1,
                                    ]}
                                />
                            </View>
                            {this.state.validatorIsError.userName && (
                                <Text
                                    style={[
                                        formStyles.errorMsg,
                                        commonStyles.font12,
                                ]}>
                                    {validErrorText.userName}
                                </Text>
                            )}
                        </View>

                        {/* 생년월일 */}
                        <View style={formStyles.inputSection}>
                            <TextInput
                                style={[formStyles.textInput, commonStyles.flex2]}
                                placeholder="생년월일"
                                placeholderTextColor="#666"
                                name="birthday"
                                onChangeText={(birthday) => this.setState({birthday})}
                                onBlur={() => this.inputValidation('birthday', this.state.birthday)}
                            />
                            {this.state.validatorIsError.birthday && (
                                <Text
                                    style={[
                                        formStyles.errorMsg,
                                        commonStyles.font12,
                                    ]}>
                                    {validErrorText.birthday}
                                </Text>
                            )}
                        </View>

                        <Divider style={[signupStyles.termsDivider, commonStyles.mb20]} />

                        {/* 아이디 */}
                        <View style={formStyles.inputSection}>
                            <TextInput
                                style={[formStyles.textInput, commonStyles.flex2]}
                                placeholder="아이디"
                                placeholderTextColor="#666"
                                name="userID"
                            />
                            {this.state.validatorIsError.userID && (
                                <Text
                                    style={[
                                        formStyles.errorMsg,
                                        commonStyles.font12,
                                    ]}>
                                    {validErrorText.userID}
                                </Text>
                            )}
                        </View>

                        {/* 비밀번호 */}
                        <View style={formStyles.inputSection}>
                            <TextInput
                                style={[formStyles.textInput, commonStyles.flex2]}
                                placeholder="비밀번호"
                                placeholderTextColor="#666"
                                name="userPW"
                            />
                            {this.state.validatorIsError.userPW && (
                                <Text
                                    style={[
                                        formStyles.errorMsg,
                                        commonStyles.font12,
                                    ]}>
                                    {validErrorText.userPW}
                                </Text>
                            )}
                        </View>

                        {/* 비밀번호 확인 */}
                        <View style={formStyles.inputSection}>
                            <TextInput
                                style={[formStyles.textInput, commonStyles.flex2]}
                                placeholder="비밀번호 확인"
                                placeholderTextColor="#666"
                                name="userPWConfirm"
                            />
                            {this.state.validatorIsError.userPWConfirm && (
                                <Text
                                    style={[
                                        formStyles.errorMsg,
                                        commonStyles.font12,
                                    ]}>
                                    {validErrorText.userPWConfirm}
                                </Text>
                            )}
                        </View>

                        {/* 이메일 */}
                        <View style={formStyles.inputSection}>
                            <TextInput
                                style={[formStyles.textInput, commonStyles.flex2]}
                                placeholder="이메일"
                                placeholderTextColor="#666"
                                name="userEmail"
                            />
                            {this.state.validatorIsError.userEmail && (
                                <Text
                                    style={[
                                        formStyles.errorMsg,
                                        commonStyles.font12,
                                    ]}>
                                    {validErrorText.userEmail}
                                </Text>
                            )}
                        </View>

                        <Divider style={[signupStyles.termsDivider, commonStyles.mb20]} />

                        {/* 휴대폰 인증 */}
                        <View style={formStyles.inputSection}>
                            <View style={formStyles.inputAndButtonSection}>
                                <TextInput
                                    style={[
                                        formStyles.textInput,
                                        commonStyles.flex2,
                                    ]}
                                    placeholder="휴대폰 인증"
                                    placeholderTextColor="#666"
                                    name="name"
                                />
                                <Button 
                                    title="인증번호 받기"
                                    titleStyle={{fontSize: 14, fontWeight: 'bold'}}

                                />
                            </View>
                            {this.state.validatorIsError.phoneNumber && (
                                <Text
                                    style={[
                                        formStyles.errorMsg,
                                        commonStyles.font12,
                                    ]}>
                                    {validErrorText.phoneNumber}
                                </Text>
                            )}
                        </View>

                        {/* 인증번호 */}
                        <View style={formStyles.inputSection}>
                            <View style={formStyles.inputAndButtonSection}>
                                <TextInput
                                    style={[
                                        formStyles.textInput,
                                        commonStyles.flex2,
                                    ]}
                                    placeholder="인증번호"
                                    placeholderTextColor="#666"
                                    name="name"
                                />
                                <Button 
                                    title="인증번호 확인"
                                    titleStyle={{fontSize: 14, fontWeight: 'bold'}}
                                    buttonStyle={commonStyles.bgGray}
                                />
                            </View>
                            {this.state.validatorIsError.certNumber && (
                                <Text
                                    style={[
                                        formStyles.errorMsg,
                                        commonStyles.font12,
                                    ]}>
                                    {validErrorText.certNumber}
                                </Text>
                            )}
                        </View>

                        <Divider style={[signupStyles.termsDivider, commonStyles.mb20]} />

                        {/* 이전 / 회원가입 버튼 */}
                        <View style={signupStyles.ageButtonSection}>
                            <TouchableOpacity
                                style={[signinStyles.btnSecondary, signinStyles.width45p, signupStyles.signupAgeButton]}
                                onPress={() => this.props.navigation.goBack()}>
                                <Text style={signinStyles.loginButtonTitle}>
                                    이전
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[signinStyles.btnPrimary, signinStyles.width45p, signupStyles.signupAgeButton]}
                                onPress={this.formSubmit}>
                                <Text style={signinStyles.loginButtonTitle}>
                                    회원가입
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}
