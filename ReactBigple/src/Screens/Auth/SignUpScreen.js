/**
 * ScrollView 안에 ScrollView 운용 시 Android에서는 안쪽 ScrollView 속성으로 nestedScrollEnabled 추가 필요.
 */
import React from 'react';
import {
    View,
    Text,
    Button,
    Platform,
    StyleSheet,
    Modal,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import DateTimePicker from 'react-native-modal-datetime-picker';
import {Input, CheckBox, Divider} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

import Terms01, {Terms02, Terms03, Terms04} from './Terms';
import commonStyles from '../../Styles/CommonStyle';
import signinStyles, {signupStyles} from '../../Styles/SigninStyle';

export default class SignUpScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lastSubmitValues: '',
            isuploading: false,
            modalView: false,
            basedate: new Date(new Date().getFullYear() - 18 + ''),
            isDateTimePickerVisible: true,
            isShowTerm01: false,
            isShowTerm02: false,
            isShowTerm03: false,
            isShowTerm04: false,
        };

        this.toggleTerms = this.toggleTerms.bind(this);
    }

    toggleTerms(terms) {
        switch (terms) {
            case 'terms01':
                this.setState({isShowTerm01: !this.state.isShowTerm01});
                break;
            case 'terms02':
                this.setState({isShowTerm02: !this.state.isShowTerm02});
                break;
            case 'terms03':
                this.setState({isShowTerm03: !this.state.isShowTerm03});
                break;
            case 'terms04':
                this.setState({isShowTerm04: !this.state.isShowTerm04});
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <ScrollView>
                <View style={signupStyles.wrapper}>
                    <View style={signupStyles.container}>
                        <Text style={signinStyles.pageTitle}>
                            해커스 통합 회원{' '}
                            <Text style={signinStyles.textSkyBlue}>신규가입</Text>
                        </Text>

                        <View
                            style={[commonStyles.bgGray, signupStyles.agree0]}>
                            <Text style={[signupStyles.agree0Text]}>
                                통합 회원 이용약관, 개인정보 수집 및 이용,
                                개인정보 제3자 제공(선택), 이벤트 및 광고알림
                                수신(선택)에 모두 동의합니다.
                            </Text>
                            <CheckBox
                                containerStyle={
                                    signupStyles.agreeCheckboxContainerStyle
                                }
                                // title=""
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                                // checkedIcon={<Image source={require('../checked.png')} />}
                                // uncheckedIcon={<Image source={require('../unchecked.png')} />}
                                checked={this.state.agree}
                                onPress={() =>
                                    this.setState({
                                        agree: !this.state.agree,
                                    })
                                }
                            />
                        </View>

                        {/* 통합 회원 약관 동의 */}
                        <View style={signupStyles.agree1}>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity
                                    onPress={() => this.toggleTerms('terms01')}
                                    style={{flexDirection: 'row'}}>
                                    <Text style={[signupStyles.agree1Text, commonStyles.textGray_8c, commonStyles.font12]}>
                                        통합 회원 이용 약관 동의{' '}
                                    </Text>
                                    <Text style={commonStyles.textSkyBlue}>(필수)</Text>
                                    <Text style={[commonStyles.textSkyBlue, signupStyles.iconTextButton]}>▼▲</Text>
                                </TouchableOpacity>
                            </View>
                            <CheckBox
                                containerStyle={
                                    signupStyles.agreeCheckboxContainerStyle
                                }
                                // title=""
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                                // checkedIcon={<Image source={require('../checked.png')} />}
                                // uncheckedIcon={<Image source={require('../unchecked.png')} />}
                                checked={this.state.agree}
                                onPress={() =>
                                    this.setState({
                                        agree: !this.state.agree,
                                    })
                                }
                            />
                        </View>
                        {this.state.isShowTerm01 ? (
                            <ScrollView
                                style={signupStyles.termsScrollView}
                                nestedScrollEnabled>
                                <Terms01 />
                            </ScrollView>
                        ) : null}

                        <Divider style={signupStyles.termsDivider} />

                        {/* 개인정보 수집 및 이용에 관한 동의  */}
                        <View style={signupStyles.agree1}>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity
                                    onPress={() => this.toggleTerms('terms02')}
                                    style={{flexDirection: 'row'}}>
                                    <Text style={[signupStyles.agree1Text, commonStyles.textGray_8c, commonStyles.font12]}>
                                        개인정보 수집 및 이용에 관한 동의{' '}
                                    </Text>
                                    <Text style={commonStyles.textSkyBlue}>(필수)</Text>
                                    <Text style={[commonStyles.textSkyBlue, signupStyles.iconTextButton]}>▼▲</Text>
                                </TouchableOpacity>
                            </View>
                            <CheckBox
                                containerStyle={
                                    signupStyles.agreeCheckboxContainerStyle
                                }
                                // title=""
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                                // checkedIcon={<Image source={require('../checked.png')} />}
                                // uncheckedIcon={<Image source={require('../unchecked.png')} />}
                                checked={this.state.agree}
                                onPress={() =>
                                    this.setState({
                                        agree: !this.state.agree,
                                    })
                                }
                            />
                        </View>

                        {this.state.isShowTerm02 ? (
                            <ScrollView
                                style={signupStyles.termsScrollView}
                                nestedScrollEnabled>
                                <Terms02 />
                            </ScrollView>
                        ) : null}

                        <Divider style={signupStyles.termsDivider} />

                        {/* 개인정보 제3자 제공에 대한 동의   */}
                        <View style={signupStyles.agree1}>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity
                                    onPress={() => this.toggleTerms('terms03')}
                                    style={{flexDirection: 'row'}}>
                                    <Text style={[signupStyles.agree1Text, commonStyles.textGray_8c, commonStyles.font12]}>
                                        개인정보 제3자 제공에 대한 동의{' '}
                                    </Text>
                                    <Text style={commonStyles.textGray_8c}>(선택)</Text>
                                    <Text style={[commonStyles.textGray_8c, signupStyles.iconTextButton]}>▼▲</Text>
                                </TouchableOpacity>
                            </View>
                            <CheckBox
                                containerStyle={
                                    signupStyles.agreeCheckboxContainerStyle
                                }
                                // title=""
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                                // checkedIcon={<Image source={require('../checked.png')} />}
                                // uncheckedIcon={<Image source={require('../unchecked.png')} />}
                                checked={this.state.agree}
                                onPress={() =>
                                    this.setState({
                                        agree: !this.state.agree,
                                    })
                                }
                            />
                        </View>

                        {this.state.isShowTerm03 ? (
                            <ScrollView
                                style={signupStyles.termsScrollView}
                                nestedScrollEnabled>
                                <Terms03 />
                            </ScrollView>
                        ) : null}

                        <Divider style={signupStyles.termsDivider} />

                        {/* 이벤트 및 광고 알림 SMS/메일 수신    */}
                        <View style={signupStyles.agree1}>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity
                                    onPress={() => this.toggleTerms('terms04')}
                                    style={{flexDirection: 'row'}}>
                                    <Text style={[signupStyles.agree1Text, commonStyles.textGray_8c, commonStyles.font12]}>
                                        이벤트 및 광고 알림 SMS/메일 수신{' '}
                                    </Text>
                                    <Text style={commonStyles.textGray_8c}>(선택)</Text>
                                    <Text style={[commonStyles.textGray_8c, signupStyles.iconTextButton]}>▼▲</Text>
                                </TouchableOpacity>
                            </View>
                            <CheckBox
                                containerStyle={
                                    signupStyles.agreeCheckboxContainerStyle
                                }
                                // title=""
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                                // checkedIcon={<Image source={require('../checked.png')} />}
                                // uncheckedIcon={<Image source={require('../unchecked.png')} />}
                                checked={this.state.agree}
                                onPress={() =>
                                    this.setState({
                                        agree: !this.state.agree,
                                    })
                                }
                            />
                        </View>

                        {this.state.isShowTerm04 ? (
                            <ScrollView
                                style={signupStyles.termsScrollView}
                                nestedScrollEnabled>
                                <Terms04 />
                            </ScrollView>
                        ) : null}

                        <View>
                            <Text style={signupStyles.descText}>
                                <Text style={signupStyles.txtStringUnderline}>
                                    광고 알림 수신에 관한 동의
                                </Text>
                                는 선택사항으로서, 이용자는 동의를 거부하더라도
                                회원 가입이 가능합니다. 단, 동의를 거부할 경우
                                강의 소식, 무료 책자 제공, 할인/이벤트 소식 등
                                광고성 정보의 SMS/이메일 수신이 제한될 수
                                있습니다.
                            </Text>
                        </View>

                        <View style={signupStyles.descTableSection}>
                            <ScrollView
                                style={signupStyles.descTableWrapper}
                                horizontal>
                                <View style={signupStyles.descTable}>
                                    <View style={[signupStyles.descTableRow, signupStyles.descTableRowStart]}>
                                        <View style={signupStyles.descTableCol1}>
                                            <Text style={signupStyles.descTableTitle}>수집/이용 목적</Text>
                                        </View>
                                        <View style={signupStyles.descTableCol2}>
                                            <Text>
                                                <Text style={signupStyles.txtStringUnderline}>
                                                    회사 또한 제휴브랜드에 대한
                                                    강의소식, 무료 책자/혜택
                                                    소식, 신규이벤트 정보,
                                                    뉴스레터 등 광고성정보의
                                                    수신{'\n'}
                                                </Text>
                                                (제휴브랜드 : ㈜챔프스터디가
                                                운영하는 각종 브랜드, 해커스
                                                영어, 해커스잡, 해커스유학,
                                                해커스편입, 위더스교육 등)
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={signupStyles.descTableRow}>
                                        <View style={signupStyles.descTableCol1}>
                                            <Text style={signupStyles.descTableTitle}>수집항목</Text>
                                        </View>
                                        <View style={signupStyles.descTableCol2}>
                                            <Text>이메일, 휴대전화번호 모바일 앱의 경우 앱Push 수신여부</Text>
                                        </View>
                                    </View>
                                    <View style={signupStyles.descTableRow}>
                                        <View style={signupStyles.descTableCol1}>
                                            <Text style={signupStyles.descTableTitle}>보유 및 이용기간</Text>
                                        </View>
                                        <View style={signupStyles.descTableCol2}>
                                            <Text style={signupStyles.txtStringUnderline}>동의 철회시점까지 보유</Text>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>

                        <View style={signupStyles.ageButtonSection}>
                            <TouchableOpacity
                                style={[signinStyles.btnSecondary, signinStyles.width45p, signupStyles.signupAgeButton]}
                                onPress={() => this.props.navigation.navigate('SignUp02')}>
                                <Text style={signinStyles.loginButtonTitle}>
                                    14세 미만
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[signinStyles.btnPrimary, signinStyles.width45p, signupStyles.signupAgeButton]}
                                onPress={() => this.props.navigation.navigate('SignUp02')}>
                                <Text style={signinStyles.loginButtonTitle}>
                                    14세 이상
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}
