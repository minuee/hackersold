import React from 'react';
import {
    View,
    Text,
    Button,
    Platform,
    StyleSheet,
    Modal,
    ScrollView,
} from 'react-native';
import {Input, CheckBox} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

import DateTimePicker from 'react-native-modal-datetime-picker';

import signinStyles from '../../Styles/SigninStyle';
import {signupStyles} from '../../Styles/SigninStyle';
import commonStyles from '../../Styles/CommonStyle';

export default class SignUpScreen03 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lastSubmitValues: '',
            isuploading: false,
            modalView: false,
            basedate: new Date(new Date().getFullYear() - 18 + ''),
            isDateTimePickerVisible: true,
        };
    }

    _postSubmit = async () => {
        console.log('data2', this.state);
        this.setState({isuploading: true});
        this.props.navigation.navigate('SignIn');
    };

    hideDateTimePicker = () => {
        this.setState({
            modalView: false,
            isDateTimePickerVisible: false,
        });
    };

    handleDatePicked = date => {
        console.log('A date has been picked: ', date);
        this.setState({
            basedate: date,
            isDateTimePickerVisible: false,
            modalView: false,
        });
    };

    closeModal = () => {
        this.setState({modalView: false});
    };

    render() {
        return (
            <ScrollView>
                <View style={signinStyles.container}>
                    <Text style={signinStyles.pageTitle}>
                        가입 완료
                    </Text>
                    <Button
                        title="완료"
                        onPress={() => {
                            this.props.navigation.popToTop();
                        }}
                    />
                </View>
            </ScrollView>
        );
    }
}
