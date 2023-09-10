import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  PixelRatio,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import CommonUtil from '../../Utils/CommonUtil';
// import Calendar from '../../Components/CalendarComponent';
import AttendCalendarContainer from './AttendCalendarContainer';

import Icon from 'react-native-vector-icons/FontAwesome';
import Icon3 from 'react-native-vector-icons/Entypo';
Icon.loadFont();
Icon3.loadFont();

import * as getDEFAULT_CONSTANTS from '../../Constants';
import { CustomTextM, TextRobotoR } from '../../Style/CustomText';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

export default class AttendCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attendHistory: [],
      confirmHistory: [],
      markedDates: {},
    };

    this.selectedProduct = this.props.screenState.selectedProduct;
    this.minDate = moment(this.selectedProduct.takeCourseBeginDatetime);
    this.maxDate = moment(this.selectedProduct.takeCourseEndDatetime);
    // this.createAttendHistory = this.createAttendHistory.bind(this);
    // this.createConfirmHistory = this.createConfirmHistory.bind(this);
  }

  UNSAFE_componentWillMount() {
    // const attendResult = this.createAttendHistory();
    // const confirmResult = this.createConfirmHistory();

    // let newObj = {};
    // const aMark = attendResult.objMarkingDate;
    // const cMark = confirmResult.objMarkingDate;
    // Object.keys(aMark).forEach(date => {
    //   if (cMark[date] !== undefined) {
    //     // 출석 O, 확인 O
    //     const obj = {[date]: {...aMark[date], isConfirm: true}};
    //     Object.assign(newObj, obj);
    //   } else {
    //     // 출석 O, 확인 X
    //     const obj = {[date]: {...aMark[date], isConfirm: false}};
    //     Object.assign(newObj, obj);
    //   }
    // });

    // this.setState({
    //   attendHistory: attendResult.arrAttendHistory,
    //   confirmHistory: confirmResult.arrConfirmHistory,
    //   markedDates: Object.assign({}, newObj),
    // });
  }

  componentDidMount() {}

  // createAttendHistory = () => {
  //   let arr = [];
  //   // let arrMarkingDate = [];
  //   let objMarkingDate = {};
  //   attendHistoryNo.forEach(item => {
  //     let cloneMinDate = this.minDate.clone();
  //     const newDate = cloneMinDate.add(item - 1, 'days').format('YYYY-MM-DD');
  //     const obj = {
  //       [newDate]: {marked: true, isAttend: true},
  //       // [newDate]: { [newDate]: {marked: true, isAttend: true} },
  //     };
  //     Object.assign(objMarkingDate, obj);
  //     // arrMarkingDate.push(obj);
  //     arr.push(newDate);
  //   });
  //   let resultObj = {arrAttendHistory: arr, objMarkingDate: objMarkingDate};
  //   // let resultObj = {arrAttendHistory: arr, arrMarkingDate: arrMarkingDate};
  //   return resultObj;
  // };

  // createConfirmHistory = () => {
  //   let arr = [];
  //   // let arrMarkingDate = [];
  //   let objMarkingDate = {};
  //   confirmHistoryNo.forEach(item => {
  //     let cloneMinDate = this.minDate.clone();
  //     const newDate = cloneMinDate.add(item - 1, 'days').format('YYYY-MM-DD');
  //     const obj = {
  //       [newDate]: {marked: true, isConfirm: true},
  //       // [newDate]: { [newDate]: {marked: true, isConfirm: true} },
  //     };
  //     Object.assign(objMarkingDate, obj);
  //     // arrMarkingDate.push(obj);
  //     arr.push(newDate);
  //   });
  //   let resultObj = {arrConfirmHistory: arr, objMarkingDate: objMarkingDate};
  //   // let resultObj = {arrConfirmHistory: arr, arrMarkingDate: arrMarkingDate};
  //   return resultObj;
  // };

  render() {
    return (
      <View style={styles.container}>
        {/* <View style={{alignItems: 'center', justifyContent: 'center', height: 35}}>
          <TouchableOpacity
            onPress={() => {
              this.props.screenState.closeModal();
            }}
            style={{padding: 5, marginRight: 10}}>
            <Icon3 name="chevron-thin-down" size={15} color={DEFAULT_CONSTANTS.base_color_222} />
          </TouchableOpacity>
        </View> */}
        <View style={styles.topTitleSection}>
          <CustomTextM style={styles.topTitleText}>{this.selectedProduct.productName}</CustomTextM>
        </View>
        <View style={styles.topDateSection}>
          <TextRobotoR style={styles.topDateText}>{CommonUtil.dateFormat('yyyy.MM.dd', this.selectedProduct.takeCourseBeginDatetime)} ~ {CommonUtil.dateFormat('yyyy.MM.dd', this.selectedProduct.takeCourseEndDatetime)}</TextRobotoR>
          <View style={{width: '100%', height: 1, backgroundColor: '#e8e8e8', marginTop: 22}}></View>
        </View>
        <ScrollView>
          <AttendCalendarContainer
          //Calendar
            // minDate={minDate.format('YYYY-MM-DD')}
            // maxDate={maxDate.format('YYYY-MM-DD')}
            startDate={moment(this.selectedProduct.takeCourseEndDatetime).format('X') > moment().format('X') ? moment().format('YYYY-MM-DD') : moment(this.selectedProduct.takeCourseEndDatetime).format('YYYY-MM-DD')}
            // attendHistory={this.state.attendHistory}
            // confirmHistory={this.state.confirmHistory}
            // markedDates={this.state.markedDates}
            selectedProduct={this.selectedProduct}
            current={moment().format('YYYY-MM-DD')}
            minDate={this.selectedProduct.takeCourseBeginDatetime}
            maxDate={this.selectedProduct.takeCourseEndDatetime}
            firstDay={0}
          />
        </ScrollView>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: 30,
  },
  topTitleSection: {
    // height: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 28,
  },
  topTitleText: {
    fontSize: PixelRatio.roundToNearestPixel(18),
    fontWeight: '500',
    letterSpacing: -0.9,
  },
  topDateSection: {
    justifyContent: 'center',
    // alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 14,
    // marginBottom: 22,
  },
  topDateText: {
    fontSize: PixelRatio.roundToNearestPixel(13),
    color: '#aaaaaa',
  },

});