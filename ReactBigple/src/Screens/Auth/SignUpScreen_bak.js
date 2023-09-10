'use strict';

import moment from 'moment';
import React from 'react';
import {View, Text, Button, Platform, StyleSheet, Modal} from 'react-native';
import {GiftedForm, GiftedFormManager} from 'react-native-gifted-form';
import DateTimePicker from 'react-native-modal-datetime-picker';

export default class SignUpScreen extends React.Component {
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
        if (this.state.modalView) {
            return (
                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={true}
                    onBackdropPress={this.closeModal}
                    onRequestClose={() => {
                        console.log('Modal has been closed.');
                    }}>
                    {/*All views of Modal*/}
                    <View style={styles.modalContent}>
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            mode="date"
                            //date={this.state.basedate}
                            date={
                                this.state.basedate
                                    ? this.state.basedate
                                    : new Date(
                                          new Date().getFullYear() - 18 + '',
                                      )
                            }
                            onConfirm={this.handleDatePicked}
                            onCancel={this.hideDateTimePicker}
                        />
                    </View>
                </Modal>
            );
        } else {
            return (
                <GiftedForm 
                    formName="signupForm"
                    openModal={route => {
                        //this.props.navigation.push('SignUpModal', route);
                        if (
                            route.getTitle() == 'Birthday' &&
                            Platform.OS === 'android'
                        ) {
                            console.log('route', route.getTitle());
                            this.setState({
                                modalView: true,
                                isDateTimePickerVisible: true,
                            });
                            return;
                        }

                        //let reRounte = {parentState: this.state, ...route};
                        this.props.navigation.navigate('SignUpModal', route);
                    }}
                    clearOnClose={false} // delete the values of the form when unmounted
                >
                </GiftedForm>
            );
            // return (                
            //     <GiftedForm
            //         formName="signupForm" // GiftedForm instances that use the same name will also share the same states
            //         openModal={route => {
            //             //this.props.navigation.push('SignUpModal', route);
            //             if (
            //                 route.getTitle() == 'Birthday' &&
            //                 Platform.OS === 'android'
            //             ) {
            //                 console.log('route', route.getTitle());
            //                 this.setState({
            //                     modalView: true,
            //                     isDateTimePickerVisible: true,
            //                 });
            //                 return;
            //             }

            //             //let reRounte = {parentState: this.state, ...route};
            //             this.props.navigation.navigate('SignUpModal', route);
            //         }}
            //         clearOnClose={false} // delete the values of the form when unmounted
            //         defaults={{
            //             username: 'Hackers',
            //             'gender{M}': true,
            //             password: 'abcdefg',
            //             country: 'FR',
            //             birthday: moment(this.state.basedate).format(
            //                 'YYYY-MM-DD',
            //             ), //this.props.user_birthday !== null ? this.props.user_birthday : new Date(new Date().getFullYear() - 18 + '')
            //         }}
            //         validators={{
            //             fullName: {
            //                 title: 'Full name',
            //                 validate: [
            //                     {
            //                         validator: 'isLength',
            //                         arguments: [1, 23],
            //                         message:
            //                             '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters',
            //                     },
            //                 ],
            //             },
            //             username: {
            //                 title: 'Username',
            //                 validate: [
            //                     {
            //                         validator: 'isLength',
            //                         arguments: [3, 16],
            //                         message:
            //                             '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters',
            //                     },
            //                     {
            //                         validator: 'matches',
            //                         arguments: /^[a-zA-Z0-9]*$/,
            //                         message:
            //                             '{TITLE} can contains only alphanumeric characters',
            //                     },
            //                 ],
            //             },
            //             password: {
            //                 title: 'Password',
            //                 validate: [
            //                     {
            //                         validator: 'isLength',
            //                         arguments: [6, 16],
            //                         message:
            //                             '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters',
            //                     },
            //                 ],
            //             },
            //             emailAddress: {
            //                 title: 'Email address',
            //                 validate: [
            //                     {
            //                         validator: 'isLength',
            //                         arguments: [6, 255],
            //                     },
            //                     {
            //                         validator: 'isEmail',
            //                     },
            //                 ],
            //             },
            //             bio: {
            //                 title: 'Biography',
            //                 validate: [
            //                     {
            //                         validator: 'isLength',
            //                         arguments: [0, 512],
            //                         message:
            //                             '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters',
            //                     },
            //                 ],
            //             },
            //             gender: {
            //                 title: 'Gender',
            //                 validate: [
            //                     {
            //                         validator: (...args) => {
            //                             if (args[0] === undefined) {
            //                                 return false;
            //                             }
            //                             return true;
            //                         },
            //                         message: '{TITLE} is required',
            //                     },
            //                 ],
            //             },
            //             birthday: {
            //                 title: 'Birthday',
            //                 validate: [
            //                     {
            //                         validator: 'isBefore',
            //                         arguments: [
            //                             moment()
            //                                 .utc()
            //                                 .subtract(18, 'years')
            //                                 .format('YYYY-MM-DD'),
            //                         ],
            //                         message:
            //                             'You must be at least 18 years old',
            //                     },
            //                     {
            //                         validator: 'isAfter',
            //                         arguments: [
            //                             moment()
            //                                 .utc()
            //                                 .subtract(100, 'years')
            //                                 .format('YYYY-MM-DD'),
            //                         ],
            //                         message: '{TITLE} is not valid',
            //                     },
            //                 ],
            //             },
            //         }}>
            //         <GiftedForm.SeparatorWidget />

            //         <GiftedForm.TextInputWidget
            //             name="fullName" // mandatory
            //             title="Full name"
            //             image={require('../../../assets/icons/user.png')}
            //             placeholder="Marco Polo"
            //             clearButtonMode="while-editing"
            //         />

            //         <GiftedForm.TextInputWidget
            //             name="username"
            //             title="Username"
            //             image={require('../../../assets/icons/contact_card.png')}
            //             placeholder="MarcoPolo"
            //             clearButtonMode="while-editing"
            //             onTextInputFocus={(currentText = '') => {
            //                 if (!currentText) {
            //                     let fullName = GiftedFormManager.getValue(
            //                         'signupForm',
            //                         'fullName',
            //                     );
            //                     if (fullName) {
            //                         return fullName.replace(
            //                             /[^a-zA-Z0-9-_]/g,
            //                             '',
            //                         );
            //                     }
            //                 }
            //                 return currentText;
            //             }}
            //         />

            //         <GiftedForm.TextInputWidget
            //             name="password" // mandatory
            //             title="Password"
            //             placeholder="******"
            //             clearButtonMode="while-editing"
            //             secureTextEntry={true}
            //             image={require('../../../assets/icons/lock.png')}
            //         />

            //         <GiftedForm.TextInputWidget
            //             name="emailAddress" // mandatory
            //             title="Email address"
            //             placeholder="example@hackers.com"
            //             keyboardType="email-address"
            //             clearButtonMode="while-editing"
            //             image={require('../../../assets/icons/email.png')}
            //         />

            //         <GiftedForm.SeparatorWidget />

            //         <GiftedForm.ModalWidget
            //             title="Gender"
            //             displayValue="gender"
            //             image={require('../../../assets/icons/gender.png')}>
            //             <GiftedForm.SeparatorWidget />

            //             <GiftedForm.SelectWidget
            //                 name="gender"
            //                 title="Gender"
            //                 multiple={false}>
            //                 <GiftedForm.OptionWidget
            //                     image={require('../../../assets/icons/female.png')}
            //                     title="Woman"
            //                     value="W"
            //                 />
            //                 <GiftedForm.OptionWidget
            //                     image={require('../../../assets/icons/male.png')}
            //                     title="Man"
            //                     value="M"
            //                 />
            //                 <GiftedForm.OptionWidget
            //                     image={require('../../../assets/icons/other.png')}
            //                     title="Other"
            //                     value="O"
            //                 />
            //             </GiftedForm.SelectWidget>
            //         </GiftedForm.ModalWidget>

            //         <GiftedForm.ModalWidget
            //             title="Birthday"
            //             displayValue="birthday"
            //             image={require('../../../assets/icons/birthday.png')}
            //             scrollEnabled={false}
            //             valeu={'ddd'}
            //             //value={this.state.basedate  ? moment(this.state.basedate).format('YYYY-MM-DD') : new Date(new Date().getFullYear() - 18 + '') }
            //         >
            //             <GiftedForm.SeparatorWidget />
            //             <GiftedForm.DatePickerIOSWidget
            //                 name="birthday"
            //                 mode="date"
            //                 getDefaultDate={() => {
            //                     return new Date(
            //                         new Date().getFullYear() - 18 + '',
            //                     );
            //                 }}
            //             />

            //             {/*<View style={{flex:1}}>
            //             <Button title="Show DatePicker" onPress={() => this.showDateTimePicker} />
            //             <Text>Selected date : {this.props.user_birthday !== null && moment(this.props.user_birthday).format('YYYY-MM-DD')}</Text>
            //             <DateTimePicker
            //                 isVisible={this.state.isDateTimePickerVisible}
            //                 mode="date"
            //                 //date={this.state.basedate}
            //                 date={this.state.basedate === null ? this.props.user_birthday ? this.props.user_birthday : new Date(new Date().getFullYear() - 18 + '') : this.state.basedate }
            //                 onConfirm={this.handleDatePicked}
            //                 onCancel={this.hideDateTimePicker}
            //                 getDefaultDate={(date) => {
            //                     return date;
            //                 }}
            //             />
            //         </View>*/}
            //         </GiftedForm.ModalWidget>

            //         <GiftedForm.ModalWidget
            //             title="Biography"
            //             displayValue="bio"
            //             image={require('../../../assets/icons/book.png')}
            //             scrollEnabled={true} // true by default
            //         >
            //             <GiftedForm.SeparatorWidget />
            //             <GiftedForm.TextAreaWidget
            //                 name="bio"
            //                 autoFocus={true}
            //                 placeholder="Something interesting about yourself"
            //             />
            //         </GiftedForm.ModalWidget>

            //         <GiftedForm.ErrorsWidget />

            //         <GiftedForm.SubmitWidget
            //             title="Sign up"
            //             widgetStyles={{
            //                 submitButton: {
            //                     backgroundColor: '#2185D0',
            //                 },
            //             }}
            //             onSubmit={(
            //                 isValid,
            //                 values,
            //                 validationResults,
            //                 postSubmit = null,
            //                 modalNavigator = null,
            //             ) => {
            //                 this.setState({lastSubmitValues: values});
            //                 if (isValid === true) {
            //                     // prepare object
            //                     values.gender = values.gender[0];
            //                     values.birthday = moment(
            //                         values.birthday,
            //                     ).format('YYYY-MM-DD');

            //                     // Implement the request to your server using values variable
            //                     // then you can do:
            //                     // postSubmit(['An error occurred, please try again']); // disable the loader and display an error message
            //                     // postSubmit(['Username already taken', 'Email already taken']); // disable the loader and display an error message
            //                     // GiftedFormManager.reset('signupForm'); // clear the states of the form manually. 'signupForm' is the formName used
            //                     this.state.isuploading
            //                         ? postSubmit()
            //                         : this._postSubmit();
            //                 }
            //             }}
            //         />

            //         <GiftedForm.NoticeWidget title="By signing up, you agree to the Terms of Service and Privacy Policity." />

            //         <GiftedForm.HiddenWidget name="tos" value={true} />
            //         {this.state.lastSubmitValues && (
            //             <Text>Last submitted value:</Text>
            //         )}
            //         {this.state.lastSubmitValues && (
            //             <Text>
            //                 {JSON.stringify(this.state.lastSubmitValues, 0, 2)}
            //             </Text>
            //         )}
            //     </GiftedForm>
            // );
            

        }
    }
}

const styles = StyleSheet.create({
    modalContent: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: 200,
        borderTopColor: '#000',
    },
    container: {},
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00BCD4',
        height: 300,
        width: '80%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
        marginTop: 80,
        marginLeft: 40,
    },
    text: {
        color: '#3f2949',
        marginTop: 10,
    },
});
