import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform, PixelRatio, Image, UIManager, LayoutAnimation, Alert} from 'react-native';
import moment from 'moment';
import {Calendar} from 'react-native-calendars';
import Toast from 'react-native-tiny-toast';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

//공통상수
import * as getDEFAULT_CONSTANTS from '../../Constants';
import COMMON_STATES, {SERVICES} from '../../Constants/Common';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';

import { TextRobotoR, TextRobotoB, CustomTextR } from '../../Style/CustomText';

import Icon from 'react-native-vector-icons/FontAwesome';
import HTMLConvert from '../../Utils/HtmlConvert/HTMLConvert';
Icon.loadFont();

const Arrow = props => {
  return props.direction === 'left' ? (
    <TouchableOpacity onPress={() => props.actions(-1)}>
      <Image source={require('../../../assets/icons/btn_calendar_prev.png')} style={{width: 15, height: 20}} />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity onPress={() => props.actions(1)}>
      <Image source={require('../../../assets/icons/btn_calendar_next.png')} style={{width: 15, height: 20}} />
    </TouchableOpacity>
  );
};

class AttendCalendarContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      myClassServiceID: props.myClassServiceID,
      loading: false,
      current: this.props.startDate
        ? this.props.startDate
        : moment().format('YYYY-MM-DD'),
      attendHistory: [],
      confirmHistory: [],
      markedDates: {},
      isOpenRowIndex: null,
      attendList: [],
      confirmList: [],
      infoMsg: [],
      errorMsg: null,
    };
    this.changeMonth = this.changeMonth.bind(this);
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  async UNSAFE_componentWillMount() {
    this.setState({loading: true});
    const memberIdx = await CommonUtil.getMemberIdx();
    // const aPIsDomain = !CommonUtil.isEmpty(this.props.myInterestCodeOne) && typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
    const url = SERVICES[this.props.myClassServiceID].apiDomain + '/v1/myClass/mission/calendar/attend/' + memberIdx + '/' + this.props.selectedProduct.memberProductIdx;
    const options = {
      method: 'GET',
      headers: {
        ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
      },
    };
    await CommonUtil.callAPI(url, options, 10000)
      .then(response => {
        if (response && response.code === '0000') {
          this.setCalendar(response.data);
        } else {
          this.setState({loading: false});
          response.message
            ? this.setState({errorMsg: response.message})
            : this.setState({errorMsg: '달력 정보를 불러오는데 실패 했습니다.'});
            // ? Alert.alert('', response.message)
            // : Alert.alert('', '달력 정보를 불러오는데 실패 했습니다.');
        }
      })
      .catch(error => {
        this.setState({
          loading: false,
          attendList: [],
          errorMsg: '시스템 에러: 달력 정보를 불러오는데 실패 했습니다.',
        });
        // Alert.alert('Error', '시스템 에러');
        // Alert.alert('', '시스템 에러: 달력 정보를 불러오는데 실패 했습니다.');
      });
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.state.errorMsg) {
        Alert.alert('', this.state.errorMsg);
        // this.setState({errorMsg: null});
      }
    }, 100);
  }

  setCalendar = data => {
    const attendList = [...data.attendList];
    const confirmList = [...data.confirmList];
    const attendResult = this.createAttendHistory(attendList);
    const confirmResult = this.createConfirmHistory(confirmList);

    let newObj = {};
    const aMark = attendResult.objMarkingDate;
    const cMark = confirmResult.objMarkingDate;
    Object.keys(aMark).forEach(date => {
      if (cMark[date] !== undefined) {
        // 출석 O, 확인 O
        const obj = {[date]: {...aMark[date], isConfirm: true}};
        Object.assign(newObj, obj);
      } else {
        // 출석 O, 확인 X
        const obj = {[date]: {...aMark[date], isConfirm: false}};
        Object.assign(newObj, obj);
      }
    });

    this.setState({
      loading: false,
      attendList: attendList,
      confirmList: confirmList,
      infoMsg: [...data.infoMsg],
      attendHistory: attendResult.arrAttendHistory,
      confirmHistory: confirmResult.arrConfirmHistory,
      markedDates: Object.assign({}, newObj),
    });
  };

  // 출석 일차수를 날짜로 변환
  createAttendHistory = attendList => {
    let arr = [];
    // let arrMarkingDate = [];
    let objMarkingDate = {};
    attendList.forEach(item => {
      let cloneMinDate = this.minDate.clone();
      const newDate = cloneMinDate.add(item - 1, 'days').format('YYYY-MM-DD');
      const obj = {
        [newDate]: {marked: true, isAttend: true},
        // [newDate]: { [newDate]: {marked: true, isAttend: true} },
      };
      Object.assign(objMarkingDate, obj);
      // arrMarkingDate.push(obj);
      arr.push(newDate);
    });
    let resultObj = {arrAttendHistory: arr, objMarkingDate: objMarkingDate};
    // let resultObj = {arrAttendHistory: arr, arrMarkingDate: arrMarkingDate};
    return resultObj;
  };

  // 학습일기 인증 일차수를 날짜로 변환
  createConfirmHistory = confirmList => {
    let arr = [];
    // let arrMarkingDate = [];
    let objMarkingDate = {};
    confirmList.forEach(item => {
      let cloneMinDate = this.minDate.clone();
      const newDate = cloneMinDate.add(item - 1, 'days').format('YYYY-MM-DD');
      const obj = {
        [newDate]: {marked: true, isConfirm: true},
        // [newDate]: { [newDate]: {marked: true, isConfirm: true} },
      };
      Object.assign(objMarkingDate, obj);
      // arrMarkingDate.push(obj);
      arr.push(newDate);
    });
    let resultObj = {arrConfirmHistory: arr, objMarkingDate: objMarkingDate};
    // let resultObj = {arrConfirmHistory: arr, arrMarkingDate: arrMarkingDate};
    return resultObj;
  };

  changeMonth = count => {
    this.setState({
      current: moment(this.state.current).add(count, 'M').format('YYYY-MM-DD'),
    });
  };

  toggleRow = async index => {
    await LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({isOpenRowIndex: this.state.isOpenRowIndex === index ? null : index});
  };

  render() {
    const today = moment();
    let toDate = moment();
    toDate = moment([toDate.year(), toDate.month(), toDate.date()]);
    let minDate = moment(this.props.minDate);
    minDate = moment([minDate.year(), minDate.month(), minDate.date()]);
    let maxDate = moment(this.props.maxDate);
    maxDate = moment([maxDate.year(), maxDate.month(), maxDate.date()]);

    const totalDays = maxDate.diff(minDate, 'days') + 1; // 강좌의 총 수강 기간
    const toDays = moment(this.props.startDate).diff(minDate, 'days'); // 강좌 시작일부터 오늘 또는 종료일까지의 날짜 차이
    const attendDays = this.state.attendHistory.length; // 출석체크한 날 수
    const confirmDays = this.state.confirmHistory.length; // 일기 확인 날 수
    const arrAttendHistory = this.state.attendHistory;
    const arrConfirmHistory = this.state.confirmHistory;
    const endDate = moment([maxDate.year(), maxDate.month(), maxDate.date(), 23, 59, 59]); //new Date(this.maxDate + " 23:59:59");
    const strToday = moment(today).format('YYYY-MM-DD'); // utils.dateFormat("yyyy-MM-dd", today);
    const attendDayCnt = (arrAttendHistory.indexOf(strToday) == -1)? attendDays : (attendDays -1);
    const confirmDayCnt = (arrConfirmHistory.indexOf(strToday) == -1)? confirmDays : (confirmDays -1);
    let absentDays = 0;

    if (today.format('X') > endDate.format('X')) {
      // 종료일 지난 경우 전체 강좌일에서 출석일을 제외해서 결석일 수 산출
      absentDays = totalDays - attendDayCnt;
    } else {
      // 종료일이 지나지 않은 경우 시작일이 오늘이면 0
      // 아니면 시작일부터 오늘까지 일수에서 출석일 제외해서 결석일 수 산출
      absentDays = toDays === 0 ? 0 : toDays - attendDayCnt;
    }

    const countInfo = {
      totalDays: totalDays,
      attendDays: attendDays,
      absentDays: absentDays,
      confirmDayCnt: confirmDayCnt,
    };

    const todayTimestamp = moment([moment().year(), moment().month(), moment().date()]).format('X');
    const minDateTimestamp = moment(this.props.minDate).format('X');
    const maxDateTimestamp = moment(this.props.maxDate).format('X');

    const dateTextColor = (day, marking, calendarDateTimestamp) => {
      if (calendarDateTimestamp == todayTimestamp) {
        return styles.dayTodayText;
      }

      if (day === 0) {
        return marking.isAttend ? styles.dayTextSun : styles.dayTextSunFail;
      // } else if (day === 6) {
      //   return styles.dayTextSat;
      } else {
        return marking.isAttend
          ? styles.dayTextDefault
          : (calendarDateTimestamp >= minDateTimestamp &&
            calendarDateTimestamp <= maxDateTimestamp &&
            calendarDateTimestamp < todayTimestamp)
          ? styles.dayTextDefaultFail
          : styles.dayTextDefault;
      }
    };

    const checkAbsent = calendarDateTimestamp => {
      if (calendarDateTimestamp == todayTimestamp) {
        return styles.dayToday;
      } else if (
        calendarDateTimestamp >= minDateTimestamp &&
        calendarDateTimestamp <= maxDateTimestamp &&
        calendarDateTimestamp < todayTimestamp
      ) {
        return styles.dayAttendFail;
      } else {
        return;
      }
    };

    const dayMarking = type => {
      switch (type) {
        case 'dayAttendSuccess':
          return styles.dayAttendSuccess;
        case 'dayAttendFail':
          return styles.dayAttendFail;
        case 'dayToday':
          return styles.dayToday;
        default:
          return;
      }
    };

    return (
      <View style={{marginBottom: 100}}>
        {/* <Calendar {...this.props} /> */}
        <Calendar
          style={{
            // borderWidth: 1,
            // borderColor: 'gray',
            // height: 350
            paddingHorizontal: 20,
            paddingVertical: 10,
            // marginBottom: 20,
          }}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            // textSectionTitleColor: '#222', //'#b6c1cd',
            // selectedDayBackgroundColor: '#00adf5',
            // selectedDayTextColor: '#ffffff',
            // todayTextColor: '#00adf5',
            // dayTextColor: '#2d4150',
            // textDisabledColor: '#222', //'#d9e1e8',
            // dotColor: '#00adf5',
            // selectedDotColor: '#ffffff',
            // arrowColor: '#888888',
            // disabledArrowColor: '#d9e1e8',
            // monthTextColor: '#222',
            // indicatorColor: '#888888',
            textDayFontFamily: DEFAULT_CONSTANTS.robotoFontFamilyRegular,
            textMonthFontFamily: DEFAULT_CONSTANTS.robotoFontFamilyMedium,
            textDayHeaderFontFamily: DEFAULT_CONSTANTS.robotoFontFamilyRegular, //robotoFontFamilyBold, //'System',
            // textDayFontWeight: '300',
            textMonthFontWeight: '500',
            // textDayHeaderFontWeight: '300',
            // textDayFontSize: 12,
            textMonthFontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),
            // textDayHeaderFontSize: 12,
            'stylesheet.calendar.header': {
              week: {
                marginTop: 22,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                backgroundColor: '#f5f7f8',
                paddingVertical: 11,
                paddingHorizontal: 0,
              },
              dayHeader: {
                fontFamily: DEFAULT_CONSTANTS.robotoFontFamilyRegular,
                fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),
                lineHeight: 11 * 1.42,
                color: '#888888',
              },
            },
            // 'stylesheet.day.single': {
            // 'stylesheet.day.basic': {
            //   base: {
            //     width: 42,
            //     height: 42,
            //     alignItems: 'flex-end',
            //     // justifyContent: 'center',
            //     backgroundColor: 'yellow',
            //   },
            //   text: {
            //     color: 'red',
            //     fontSize: 12,
            //   },
            //   alignedText: {
            //     marginTop: Platform.OS === 'android' ? 4 : 6,
            //   },
            // },
          }}
          // Initially visible month. Default = Date()
          current={this.state.current}
          // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
          minDate={this.props.minDate}
          // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
          maxDate={this.props.maxDate}
          // Handler which gets executed on day press. Default = undefined
          onDayPress={(day) => {console.log('selected day', day)}}
          // Handler which gets executed on day long press. Default = undefined
          onDayLongPress={(day) => {console.log('selected day', day)}}
          // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
          monthFormat={'yyyy.MM'}
          // Handler which gets executed when visible month changes in calendar. Default = undefined
          onMonthChange={(month) => {console.log('month changed', month)}}
          // Hide month navigation arrows. Default = false
          hideArrows={false}
          // Replace default arrows with custom ones (direction can be 'left' or 'right')
          renderArrow={(direction) => (<Arrow direction={direction} actions={this.changeMonth} />)}
          // renderArrow={(direction) => (direction === 'left' ? <Icon name="chevron-left" size={20} /> : <Icon name="chevron-right" size={20} />)}
          // Do not show days of other months in month page. Default = false
          hideExtraDays={true}
          // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
          // day from another month that is visible in calendar page. Default = false
          disableMonthChange={false}
          // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
          firstDay={0}
          // Hide day names. Default = false
          hideDayNames={false}
          // Show week numbers to the left. Default = false
          showWeekNumbers={false}
          // Handler which gets executed when press arrow icon left. It receive a callback can go back month
          onPressArrowLeft={substractMonth => substractMonth()}
          // Handler which gets executed when press arrow icon right. It receive a callback can go next month
          onPressArrowRight={addMonth => addMonth()}
          // Disable left arrow. Default = false
          disableArrowLeft={false}
          // Disable right arrow. Default = false
          disableArrowRight={false}
          // markingType={'custom'}
          // markedDates={{
          //   '2020-02-20': {selected: true, marked: true, selectedColor: 'blue'},
          //   '2020-03-12': {marked: true},
          //   '2020-03-13': {marked: true, dotColor: 'red', activeOpacity: 0},
          //   '2020-03-16': {disabled: true, disableTouchEvent: true},
          //   '2020-03-15': {selected: true, marked: true, selectedColor: 'blue'},
          //   '2020-03-19': {
          //     customStyles: {
          //       container: {
          //         backgroundColor: 'green',
          //       },
          //       text: {
          //         color: 'black',
          //         fontWeight: 'bold',
          //       },
          //     },
          //   },
          // }}
          markedDates={this.state.markedDates}
          dayComponent={({date, marking, state}) => {
            // console.log('date : ', date);
            // console.log('state : ', state);
            // console.log('marking : ', marking);
            // console.log('minDate, date : ', this.props.minDate, date.dateString);
            // console.log('moment timestamp : ', moment(this.props.minDate).format('X'));
            // console.log('date dateString : ', moment(date.dateString).format('X'));
            // console.log(moment(this.props.minDate).format('X') < moment(date).);
            const calendarDateTimestamp = moment(date.dateString).format('X');
            // todayTimestamp minDateTimestamp maxDateTimestamp
            const dayNum = moment(date.dateString).day();

            return (
              <View style={[{flexDirection: 'column', width: 25, height: 25, justifyContent: 'center'}, 
                  marking.marked
                  ? marking.isAttend && dayMarking('dayAttendSuccess')
                  : checkAbsent(calendarDateTimestamp)
                ]}>
                <View>
                  <TextRobotoR style={[{textAlign: 'center', fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12)}, dateTextColor(dayNum, marking, calendarDateTimestamp)]}>
                  {date.day}
                  </TextRobotoR>
                </View>
                {/* <View>
                  {marking.marked ? (
                    marking.isAttend && (
                      marking.isConfirm
                      ? <Icon name="check-circle" size={20} color="orange" />
                      : <Icon name="asterisk" size={20} color="purple" />
                    )
                  ) : (
                    AbsentIcon(calendarDateTimestamp)
                  )}
                </View> */}
              </View>
            );
          }}
        />
        <View style={{width: '100%', paddingHorizontal: 20}}>
          <View style={{borderWidth: 1, borderColor: '#28a5ce', borderRadius: 4, width: '100%', paddingVertical: 15}}>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{backgroundColor: '#e7f5f8', width: 10, height: 10, borderRadius: 10, marginRight: 7}}></View>
                  <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13), color: '#222'}}><TextRobotoR>{countInfo.totalDays}</TextRobotoR>일 중 출석 <TextRobotoB style={{color: '#28a5ce'}}>{countInfo.attendDays}</TextRobotoB>회</CustomTextR>
              </View>
              <View style={{backgroundColor: '#d8d8d8', width: 1, height: '80%', marginHorizontal: 15}}></View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* <View style={{borderWidth: 1, borderColor: '#656665', borderStyle: 'dashed', width: 10, height: 10, borderRadius: 10, marginRight: 7}}></View> */}
                  <Image source={require('../../../assets/icons/icon_calendar_check_off.png')} style={{width: 10, height: 10, marginRight: 7}} />
                  <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13), color: '#222'}}>결석 <TextRobotoB style={{color: '#28a5ce'}}>{countInfo.absentDays}</TextRobotoB>회</CustomTextR>
              </View>
            </View>
          </View>
        </View>

        <View style={{width: '100%', paddingHorizontal: 20, marginTop: 20}}>
          {this.state.infoMsg.map((item, index) => {
            return (
              <View style={{borderRadius: 4, borderWidth: 1, borderColor: '#d8d8d8', marginBottom: 10}} key={index}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
                  <CustomTextR style={{color: '#222', fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14), letterSpacing: -0.6}}>{item.title}</CustomTextR>
                  <TouchableOpacity onPress={() => this.toggleRow(index)}>
                    <Image source={this.state.isOpenRowIndex === index ? require('../../../assets/icons/btn_select_close.png') : require('../../../assets/icons/btn_select_open_on.png')} style={{width: 12, height: 12}} />
                  </TouchableOpacity>
                </View>

                  {this.state.isOpenRowIndex === index && (
                    <View style={{padding: 15, backgroundColor: '#f5f7f8'}}>
                      {/* <CustomTextR syle={{color: '#666', fontSize: PixelRatio.roundToNearestPixel(12), letterSpacing: -0.6}}>
                      {this.state.infoMsg}
                      </CustomTextR> */}
                      <HTMLConvert
                        {...this.props}
                        html={CommonUtil.stripSlashes(item.content)}
                      />
                    </View>
                  )}
              </View>);
            })}
        </View>

        {/* <View style={styles.countInfoSection}>
          <Text style={styles.countInfoText}>{countInfo.totalDays}일 중 출석 {countInfo.attendDays}일</Text>
          <Text style={styles.countInfoText}>결석 {countInfo.absentDays}회</Text>
          <Text style={styles.countInfoText}>--------------------------------</Text>
          <Text style={styles.countInfoText}>도전 출석 횟수 {countInfo.attendDays}일</Text>
          <Text style={styles.countInfoText}>학습일지 인증 횟수 {countInfo.confirmDayCnt}회</Text>
          <Text style={styles.countInfoText}>누적 장학금 9,999,999월</Text>
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dayTextSun: {
    color: '#e19191',
  },
  dayTextSunFail: {
    color: '#f3d3d3',
  },
  dayTextSat: {
    color: '#799dc9',
  },
  dayTextDefault: {
    color: '#888',
  },
  dayTextDefaultFail: {
    color: '#cccccc',
  },
  dayAttendSuccess: {
    borderRadius: 25, backgroundColor: '#e7f5f8',
  },
  dayAttendFail: {
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbcccb',
    borderStyle: 'dashed',
  },
  dayToday: {
    borderRadius: 25, backgroundColor: '#3ecffe',
  },
  dayTodayText: {
    fontFamily: DEFAULT_CONSTANTS.robotoFontFamilyBold,
    fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),
    color: '#fff',
  },
});

const mapStateToProps = state => {
  return {
    myClassServiceID: state.GlabalStatus.myClassServiceID,
    myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,
  };
};

export default connect(mapStateToProps, null)(AttendCalendarContainer);
// export default AttendCalendarContainer;
