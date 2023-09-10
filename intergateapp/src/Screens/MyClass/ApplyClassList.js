import React, {Component} from 'react';
import {
  PixelRatio,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import Toast from 'react-native-tiny-toast';
import moment from 'moment';
import Modal from 'react-native-modal';

import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';

import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/Entypo';
Icon.loadFont();
Icon2.loadFont();
Icon3.loadFont();

import MyClassStyles from '../../Style/MyClass/MyClassStyle';

//공통상수
import * as getDEFAULT_CONSTANTS from '../../Constants';
import COMMON_STATES, {SERVICES} from '../../Constants/Common';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import { CustomTextM, CustomTextR, TextRobotoR, CustomTextB } from '../../Style/CustomText';

import Select2MyClass from '../../Utils/Select2MyClass';

import MyClassFilterScreen from './MyClassFilterScreen';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

const mockClassList = [
  {
    memberProductIdx: 1, productPattern: '프리패스', productStatus: '수강완료',
    productName: '상품1', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2019-05-20 10:00:00', takeCourseEndDatetime: '2020-02-29 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: null, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2019-05-20 10:00:00',  missionType: '', missionStatus: '', isChallengeApply: false,
    "memberClassIdx": 1, "className": "aaa", "openedCount": 25, "lectureCount": 39,
    "level03": "10010", "level03Name": "토플", "level04": "100000", "level04Name": "리딩",
    "difficulty": "100101", "difficultyName": "난이도1",  "teacherIdx": 1, "teacherName": "ta", "year": 2019, 
    "isFavorite": true, "isHidden": false, "progressRatio": 0.8, "lastOpenDatetime": "2020-01-01 10:00:00"
  },
  {
    memberProductIdx: 1, productPattern: '프리패스', productStatus: '수강완료',
    productName: '상품1', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2019-05-20 10:00:00', takeCourseEndDatetime: '2020-02-29 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: null, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2019-05-20 10:00:00',  missionType: '', missionStatus: '', isChallengeApply: false,
    "memberClassIdx": 2, "className": "bbb", "openedCount": 25, "lectureCount": 39,
    "level03": "10010", "level03Name": "토플", "level04": "100000", "level04Name": "리딩",
    "difficulty": "100102", "difficultyName": "난이도2",  "teacherIdx": 2, "teacherName": "tb", "year": 2019, 
    "isFavorite": true, "isHidden": false, "progressRatio": 0.8, "lastOpenDatetime": "2020-01-01 10:10:00"
  },
  {
    memberProductIdx: 1, productPattern: '프리패스', productStatus: '수강완료',
    productName: '상품1', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2019-05-20 10:00:00', takeCourseEndDatetime: '2020-02-29 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: null, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2019-05-20 10:00:00',  missionType: '', missionStatus: '', isChallengeApply: false,
    "memberClassIdx": 3, "className": "ccc", "openedCount": 25, "lectureCount": 39,
    "level03": "10010", "level03Name": "토플", "level04": "100010", "level04Name": "리스닝",
    "difficulty": "100103", "difficultyName": "난이도3",  "teacherIdx": 3, "teacherName": "tc", "year": 2019, 
    "isFavorite": true, "isHidden": false, "progressRatio": 0.8, "lastOpenDatetime": "2020-01-01 10:20:00"
  },
  {
    memberProductIdx: 1, productPattern: '프리패스', productStatus: '수강완료',
    productName: '상품1', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2019-05-20 10:00:00', takeCourseEndDatetime: '2020-02-29 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: null, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2019-05-20 10:00:00',  missionType: '', missionStatus: '', isChallengeApply: false,
    "memberClassIdx": 4, "className": "ddd", "openedCount": 25, "lectureCount": 39,
    "level03": "10010", "level03Name": "토플", "level04": "100020", "level04Name": "스피킹",
    "difficulty": "100104", "difficultyName": "난이도4",  "teacherIdx": 4, "teacherName": "td", "year": 2019, 
    "isFavorite": true, "isHidden": false, "progressRatio": 0.8, "lastOpenDatetime": "2020-01-01 10:30:00"
  },
  {
    memberProductIdx: 1, productPattern: '프리패스', productStatus: '수강완료',
    productName: '상품1', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2019-05-20 10:00:00', takeCourseEndDatetime: '2020-02-29 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: null, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2019-05-20 10:00:00',  missionType: '', missionStatus: '', isChallengeApply: false,
    "memberClassIdx": 5, "className": "eee", "openedCount": 25, "lectureCount": 39,
    "level03": "10010", "level03Name": "토플", "level04": "100030", "level04Name": "라이팅",
    "difficulty": "100105", "difficultyName": "난이도5",  "teacherIdx": 5, "teacherName": "te", "year": 2019, 
    "isFavorite": true, "isHidden": false, "progressRatio": 0.8, "lastOpenDatetime": "2020-01-01 10:40:00"
  },
  {
    memberProductIdx: 2, productPattern: '단과', productStatus: '수강중',
    productName: '상품2', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2020-01-01 10:00:00', takeCourseEndDatetime: '2020-05-31 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: 1.5, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2020-01-01 10:00:00',  missionType: '', missionStatus: '', isChallengeApply: false,
    "memberClassIdx": 6, "className": "aaa", "openedCount": 25, "lectureCount": 39,
    "level03": "10020", "level03Name": "토익", "level04": "100000", "level04Name": "리딩",
    "difficulty": "100201", "difficultyName": "난이도11",  "teacherIdx": 1, "teacherName": "ta", "year": 2019, 
    "isFavorite": true, "isHidden": false, "progressRatio": 0.4, "lastOpenDatetime": "2020-01-01 10:50:00"
  },
  {
    memberProductIdx: 2, productPattern: '단과', productStatus: '수강중',
    productName: '상품2', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2020-01-01 10:00:00', takeCourseEndDatetime: '2020-05-31 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: 1.5, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2020-01-01 10:00:00',  missionType: '', missionStatus: '', isChallengeApply: false,
    "memberClassIdx": 7, "className": "bbb", "openedCount": 25, "lectureCount": 39,
    "level03": "10020", "level03Name": "토익", "level04": "100010", "level04Name": "리스닝",
    "difficulty": "100202", "difficultyName": "난이도12",  "teacherIdx": 2, "teacherName": "tb", "year": 2019, 
    "isFavorite": true, "isHidden": false, "progressRatio": 0.4, "lastOpenDatetime": "2020-01-01 11:00:00"
  },
  {
    memberProductIdx: 2, productPattern: '단과', productStatus: '수강중',
    productName: '상품2', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2020-01-01 10:00:00', takeCourseEndDatetime: '2020-05-31 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: 1.5, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2020-01-01 10:00:00',  missionType: '', missionStatus: '', isChallengeApply: false,
    "memberClassIdx": 8, "className": "ccc", "openedCount": 25, "lectureCount": 39,
    "level03": "10020", "level03Name": "토익", "level04": "100040", "level04Name": "보카",
    "difficulty": "100203", "difficultyName": "난이도13",  "teacherIdx": 3, "teacherName": "tc", "year": 2019, 
    "isFavorite": true, "isHidden": false, "progressRatio": 0.4, "lastOpenDatetime": "2020-01-01 11:10:00"
  },
  {
    memberProductIdx: 2, productPattern: '단과', productStatus: '수강중',
    productName: '상품2', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2020-01-01 10:00:00', takeCourseEndDatetime: '2020-05-31 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: 1.5, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2020-01-01 10:00:00',  missionType: '', missionStatus: '', isChallengeApply: false,
    "memberClassIdx": 9, "className": "ddd", "openedCount": 25, "lectureCount": 39,
    "level03": "10030", "level03Name": "토익스피킹", "level04": "100120", "level04Name": "토익스피킹",
    "difficulty": "100301", "difficultyName": "난이도21",  "teacherIdx": 4, "teacherName": "td", "year": 2019, 
    "isFavorite": true, "isHidden": false, "progressRatio": 0.4, "lastOpenDatetime": "2020-01-01 11:20:00"
  },
  {
    memberProductIdx: 2, productPattern: '단과', productStatus: '수강중',
    productName: '상품2', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2020-01-01 10:00:00', takeCourseEndDatetime: '2020-05-31 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: 1.5, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2020-01-01 10:00:00',  missionType: '', missionStatus: '', isChallengeApply: false,
    "memberClassIdx": 10, "className": "eee", "openedCount": 25, "lectureCount": 39,
    "level03": "10030", "level03Name": "토익스피킹", "level04": "100120", "level04Name": "토익스피킹",
    "difficulty": "100302", "difficultyName": "난이도22",  "teacherIdx": 5, "teacherName": "te", "year": 2019, 
    "isFavorite": true, "isHidden": false, "progressRatio": 0.4, "lastOpenDatetime": "2020-01-01 11:30:00"
  },
  {
    memberProductIdx: 2, productPattern: '단과', productStatus: '수강중',
    productName: '상품2', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2020-01-01 10:00:00', takeCourseEndDatetime: '2020-05-31 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: 1.5, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2020-01-01 10:00:00',  missionType: '', missionStatus: '', isChallengeApply: false,
    "memberClassIdx": 11, "className": "eee", "openedCount": 25, "lectureCount": 39,
    "level03": "10040", "level03Name": "오픽", "level04": "100130", "level04Name": "오픽",
    "difficulty": "100401", "difficultyName": "난이도0",  "teacherIdx": 6, "teacherName": "tf", "year": 2019, 
    "isFavorite": true, "isHidden": false, "progressRatio": 0.4, "lastOpenDatetime": "2020-01-01 11:40:00"
  },
  {
    memberProductIdx: 3, productPattern: '환급반', productStatus: '수강중',
    productName: '상품3', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2020-02-01 10:00:00', takeCourseEndDatetime: '2020-06-30 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: 0, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2020-02-01 10:00:00',  missionType: 'challenge', missionStatus: '', isChallengeApply: true,
    "memberClassIdx": 12, "className": "회화 10분의 기적 챌린지 12", "openedCount": 25, "lectureCount": 39,
    "level03": "10020", "level03Name": "토익", "level04": "100000", "level04Name": "리딩",
    "difficulty": "100201", "difficultyName": "난이도11",  "teacherIdx": 1, "teacherName": "ta", "year": 2019, 
    "isFavorite": false, "isHidden": false, "progressRatio": 0.5, "lastOpenDatetime": "2020-02-01 09:00:00"
  },
  {
    memberProductIdx: 3, productPattern: '환급반', productStatus: '수강중',
    productName: '상품3', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2020-02-01 10:00:00', takeCourseEndDatetime: '2020-06-30 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: 0, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2020-02-01 10:00:00',  missionType: 'challenge', missionStatus: '', isChallengeApply: true,
    "memberClassIdx": 13, "className": "회화 10분의 기적 챌린지 13", "openedCount": 25, "lectureCount": 39,
    "level03": "10020", "level03Name": "토익", "level04": "100010", "level04Name": "리스닝",
    "difficulty": "100202", "difficultyName": "난이도12",  "teacherIdx": 2, "teacherName": "tb", "year": 2019, 
    "isFavorite": false, "isHidden": false, "progressRatio": 0.5, "lastOpenDatetime": "2020-02-02 09:00:00"
  },
  {
    memberProductIdx: 3, productPattern: '환급반', productStatus: '수강중',
    productName: '상품3', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2020-02-01 10:00:00', takeCourseEndDatetime: '2020-06-30 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: 0, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2020-02-01 10:00:00',  missionType: 'challenge', missionStatus: '', isChallengeApply: true,
    "memberClassIdx": 14, "className": "회화 10분의 기적 챌린지 14", "openedCount": 25, "lectureCount": 39,
    "level03": "10020", "level03Name": "토익", "level04": "100040", "level04Name": "보카",
    "difficulty": "100203", "difficultyName": "난이도13",  "teacherIdx": 3, "teacherName": "tc", "year": 2019, 
    "isFavorite": false, "isHidden": false, "progressRatio": 0.5, "lastOpenDatetime": "2020-02-03 09:00:00"
  },
  {
    memberProductIdx: 3, productPattern: '환급반', productStatus: '수강중',
    productName: '상품3', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2020-02-01 10:00:00', takeCourseEndDatetime: '2020-06-30 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: 0, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2020-02-01 10:00:00',  missionType: 'challenge', missionStatus: '', isChallengeApply: true,
    "memberClassIdx": 15, "className": "회화 10분의 기적 챌린지 15", "openedCount": 25, "lectureCount": 39,
    "level03": "10030", "level03Name": "토익스피킹", "level04": "100120", "level04Name": "토익스피킹",
    "difficulty": "100301", "difficultyName": "난이도21",  "teacherIdx": 4, "teacherName": "td", "year": 2019, 
    "isFavorite": false, "isHidden": false, "progressRatio": 0.5, "lastOpenDatetime": "2020-02-04 09:00:00"
  },
  {
    memberProductIdx: 3, productPattern: '환급반', productStatus: '수강중',
    productName: '상품3', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2020-02-01 10:00:00', takeCourseEndDatetime: '2020-06-30 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: 0, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2020-02-01 10:00:00',  missionType: 'challenge', missionStatus: '', isChallengeApply: true,
    "memberClassIdx": 16, "className": "회화 10분의 기적 챌린지 16", "openedCount": 25, "lectureCount": 39,
    "level03": "10030", "level03Name": "토익스피킹", "level04": "100120", "level04Name": "토익스피킹",
    "difficulty": "100302", "difficultyName": "난이도22",  "teacherIdx": 5, "teacherName": "te", "year": 2019, 
    "isFavorite": false, "isHidden": false, "progressRatio": 0.5, "lastOpenDatetime": "2020-02-05 09:00:00"
  },
  {
    memberProductIdx: 3, productPattern: '환급반', productStatus: '수강중',
    productName: '상품3', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2020-02-01 10:00:00', takeCourseEndDatetime: '2020-06-30 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: 0, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2020-02-01 10:00:00',  missionType: 'challenge', missionStatus: '', isChallengeApply: true,
    "memberClassIdx": 17, "className": "회화 10분의 기적 챌린지 17", "openedCount": 25, "lectureCount": 39,
    "level03": "10040", "level03Name": "오픽", "level04": "100130", "level04Name": "오픽",
    "difficulty": "100401", "difficultyName": "난이도0",  "teacherIdx": 6, "teacherName": "tf", "year": 2019, 
    "isFavorite": false, "isHidden": false, "progressRatio": 0.5, "lastOpenDatetime": "2020-02-06 09:00:00"
  },
];

class ApplyClassList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            apiLoading: false,
            product: props.screenState.selectedProduct || {},
            classList: [],
            selectedClass: [],
            filter: {
                level03: '',
                level04: '',
                difficulty: '',
                teacherIdx: 0,
            },
            myClassApplyClassFilter: props.myClassApplyClassFilter || {},
            modalContent: '',
            isShowModal: false,
            memberIdx: 0,
            apiDomain: '',
            SORT_TYPE: [
                { id: 1, name: '남은 수강일 순', checked: true},
                { id: 2, name: '남은 수강일 역순' },
            ],
            closeModal: this.closeModal.bind(this),
        };
        this.classCounting = 0;
    }

    async UNSAFE_componentWillMount() {
        const memberIdx = await CommonUtil.getMemberIdx();
        await this.setState({
            memberIdx: memberIdx,
            apiDomain: SERVICES[this.props.myClassServiceID].apiDomain,
        });
        
        this.setState({loading: true});
        // const aPIsDomain = !CommonUtil.isEmpty(this.props.myInterestCodeOne) && typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        const url = this.state.apiDomain + '/v1/myClass/product/classes/' + memberIdx + '/' + this.state.product.memberProductIdx;
        const options = {
          method: 'GET',
          headers: {
            ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
          },
        };
        await CommonUtil.callAPI(url, options)
            .then(response => {
                // if (response && response.code === '0000') {
                if (response && response.data.classList.length > 0) {
                    this.setState({
                        loading: false,
                        classList: [...response.data.classList],
                    });
                } else {
                    this.setState({loading: false});
                    response.message
                        ? Alert.alert(response.message)
                        : Alert.alert('강좌 목록을 불러오는데 실패 했습니다.');
                        // ? Toast.show(response.message)
                        // : Toast.show('강좌 목록을 불러오는데 실패 했습니다.');
                }
            })
            .catch(error => {
                this.setState({
                    loading: false,
                    classList: [],
                });
                Alert.alert('시스템 에러: 강좌 목록을 불러오는데 실패 했습니다.');
                // Toast.show('시스템 에러: 강좌 목록을 불러오는데 실패 했습니다.');
            });
    }

    async UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.myClassApplyClassFilter !== this.state.myClassApplyClassFilter) {
        await this.setState({myClassApplyClassFilter: nextProps.myClassApplyClassFilter});
      }
    }

    componentDidUpdate(prevProps, prevState) {
      // 이전 props, state에 대한 정보
    }

    componentWillUnmount() {}

    selectClass = classIdx => {
      const arr = [...this.state.selectedClass];
      const index = arr.indexOf(classIdx);
      if (index > -1) {
        arr.splice(index, 1);
      } else {
        arr.push(classIdx);
      }
      this.setState({
        selectedClass: arr,
      });
    }

    isChecked = classIdx => {
      return this.state.selectedClass.indexOf(classIdx) > -1;
    }

    // 수강 신청 (강좌 추가하기)
    applyClass = async () => {
      if (this.state.selectedClass.length === 0) {
        Alert.alert('강좌 추가', '강좌를 선택해 주세요.');
        return;
      }

      this.setState({apiLoading: true});
      // const memberIdx = await CommonUtil.getMemberIdx();
      // const aPIsDomain = !CommonUtil.isEmpty(this.props.myInterestCodeOne) && typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
      const url = this.state.apiDomain + '/v1/myClass/class/apply/' + this.state.memberIdx + '/' + this.state.product.memberProductIdx;
      const formData = new FormData();
      formData.append('classIdx', this.state.selectedClass.toString());
      const options = {
        method: 'POST',
        headers: {
          ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
        },
        body: formData,
      };
      // this.updateClassList();
      await CommonUtil.callAPI(url, options)
        .then(response => {
          this.setState({apiLoading: false});
          if (response && response.code === '0000') {
            this.updateClassList();
          } else {
            response.message
              ? Alert.alert(response.message)
              : Alert.alert('강좌 추가에 실패 했습니다.');
          }
        })
        .catch(error => {
          this.setState({apiLoading: false});
          // Alert.alert('Error', error.toString());
          Alert.alert('시스템 에러: 강좌 추가에 실패 했습니다.');
        });
    };

    // 강좌 추가 성공 처리
    updateClassList = async () => {
        const classList = [...this.state.classList];
        let myClassClassList = [...this.props.myClassClassList];
        this.state.selectedClass.forEach( item => {
            const index = classList.findIndex(el => el.classIdx === item);
            // classList[index].productStatus = '수강중';
            // classList[index].productPattern = this.state.product.productPattern;
            // classList[index].validBeginDatetime = moment().format('YYYY-MM-DD hh:mm:ss');
            // classList[index].validEndDatetime = '2020-12-31 23:59:59';
            // classList[index].takeCourseBeginDatetime = moment().format('YYYY-MM-DD hh:mm:ss');
            // classList[index].takeCourseEndDatetime = '2020-12-31 23:59:59';
            myClassClassList.push(classList[index]);
        });
        await this.props.updateMyClassClassList(myClassClassList);
        Alert.alert('INFO', '강좌를 추가 했습니다.', [
          {text: '확인', onPress: () => this.props.screenState.closeModal()},
        ]);
    }

    // 필터 스크린 열기
    goFilterScreen = () => {
      this.showModal();
    };

    showModal = async mode => {
      await this.setState({modalContent: mode});
      this.setState({isShowModal: true});
    };

    closeModal = () => {
      this.setState({modalContent: '', isShowModal: false});
    };

    // 모달 컨텐츠
    getModalContent = modalContent => {
      return <MyClassFilterScreen screenState={this.state} fromScreen="ApplyClassList" />;
      // switch (modalContent) {
      //   case 'attendCalendar':
      //     return <AttendCalendar screenState={this.state} />;
      // }
    };

    // 강의 리스트 정렬: 오름, 내림차순 반환
    getSortValue = (val1, val2, order, valType) => {
      let value1 = val1;
      let value2 = val2;
      if (valType === 'date') {
        value1 = moment(val1).format('X');
        value2 = moment(val2).format('X');
      }
      if (value1 == value2) {
        return 0;
      } else if ((order === 'asc' && value1 > value2) || (order === 'desc' && value1 < value2)) {
        return 1;
      } else if ((order === 'asc' && value1 < value2) || (order === 'desc' && value1 > value2)) {
        return -1;
      }
    };

    // 필터 적용에 대한 결과 Boolean
    getResultByFilter = myclass => {
      // return this.state.checkedFilter.filter === product.productStatus;
    };

    // 필터 적용 여부
    isSetFilter = () => {
      // return this.state.checkedFilter.filter === product.productStatus;
    };

    // 선택된 필터 개별 삭제
    removeFilter = async (filter, type) => {
      const arrFilter = this.state.myClassApplyClassFilter;
      const index = arrFilter[type].indexOf(filter);
      arrFilter[type].splice(index, 1);
      await this.setState({myClassApplyClassFilter: arrFilter});
      this.props.updateMyClassApplyClassFilter(arrFilter);
    };

    // 정렬 선택
    selectSortType = data => {
      if (data.length === 0) {
          this.setState({
              sortType: 1,
          });
          this.state.SORT_TYPE[0].checked = true;
          return;   
      }

      try {
          this.setState({
              sortType: data[0],
          });
      } catch {
          this.state.SORT_TYPE[0].checked = true;
          // return true;
      }
  };

    render() {
        const myClassApplyClassFilter = this.state.myClassApplyClassFilter; //this.props;
        const isFilterSelectedLevel03 = myClassApplyClassFilter.selectedLevel03 && myClassApplyClassFilter.selectedLevel03.length > 0;
        const isFilterSelectedLevel04 = myClassApplyClassFilter.selectedLevel04 && myClassApplyClassFilter.selectedLevel04.length > 0;
        const isFilterSelectedDifficulty = myClassApplyClassFilter.selectedDifficulty && myClassApplyClassFilter.selectedDifficulty.length > 0;
        const isFilterTeacher = myClassApplyClassFilter.selectedTeacher && myClassApplyClassFilter.selectedTeacher.length > 0;
        const isFilterYear = myClassApplyClassFilter.selectedYear && myClassApplyClassFilter.selectedYear.length > 0;

        // 필터 적용된 강좌 목록 생성
        const filteredClassList = this.state.classList.filter(item => {
                const arrTeacherIdx = item.teachers.map(teacher => teacher.teacherIdx);
                const teacherFlag = isFilterTeacher ? myClassApplyClassFilter.selectedTeacher.some(filterItem => arrTeacherIdx.indexOf(filterItem) > -1) : true;
                return (
                    (isFilterSelectedLevel03
                        ? myClassApplyClassFilter.selectedLevel03.indexOf(item.level03) > -1
                        : true) &&
                    (isFilterSelectedLevel04
                        ? myClassApplyClassFilter.selectedLevel04.indexOf(item.level04) > -1
                        : true) &&
                    (isFilterSelectedDifficulty
                        ? myClassApplyClassFilter.selectedDifficulty.indexOf(item.difficulty) > -1
                        : true) &&
                    (isFilterTeacher
                        ? teacherFlag
                        : true) &&
                    (isFilterYear
                        ? myClassApplyClassFilter.selectedYear.indexOf(item.year) > -1
                        : true)
                );
            })
            .map((myclass, key) => {
                return this.isSetFilter()
                    ? this.getResultByFilter(myclass) && myclass
                    : myclass;
            });

        // 검색된 강좌 없음 컴포넌트: 수강 중인 강좌가 없습니다.
        const noClassListResult = () => {
          return (
            <View style={{width: '100%', height: SCREEN_HEIGHT * 0.4, justifyContent: 'center', alignItems: 'center'}}>
              <Image source={require('../../../assets/icons/icon_none_exclamation.png')} style={{width: 65, height: 65, marginBottom: 15}} />
              <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14), letterSpacing: -0.7}}>검색된 강좌가 없습니다</CustomTextR>
            </View>);
        };

        // 강좌 리스트 아이템 Component
        const listItem = (data, index) => {
            this.classCounting++;
            return (
                <View style={{width: '100%', backgroundColor: index % 2 === 1 ? '#f5f7f8' : '#fff'}} key={data.classIdx + '_' + index}>
                    <TouchableOpacity style={styles.listItemContainer} key={index} onPress={() => this.selectClass(data.classIdx)}>
                        <View style={styles.listItemCheckbox}>
                            <CheckBox
                                containerStyle={{padding: 0, margin: 0, marginRight: 15}}
                                iconType='font-awesome'
                                // checkedIcon='check-circle'
                                // uncheckedIcon='circle-o'
                                checkedIcon={<Image source={require('../../../assets/icons/btn_check_on.png')} style={{width: 23, height: 23}} />}
                                uncheckedIcon={<Image source={require('../../../assets/icons/btn_check_off.png')} style={{width: 23, height: 23}} />}
                                checkedColor={DEFAULT_COLOR.lecture_base}
                                uncheckedColor={DEFAULT_COLOR.base_color_ccc}
                                onPress= {() => this.selectClass(data.classIdx)}
                                checked={this.isChecked(data.classIdx)}
                            />
                        </View>
                        <View style={styles.listItemList} key={index}>
                            <View style={{flex: 1, paddingBottom: 9}}>
                                <CustomTextM
                                    style={{
                                        color: DEFAULT_COLOR.base_color_222,
                                        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),
                                        fontWeight: '500',
                                        letterSpacing: -0.6,
                                    }}>
                                    {data.className}
                                </CustomTextM>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', flexGrow: 1, alignItems: 'center'}}>
                                <View>
                                    <CustomTextR
                                        style={{
                                            color: DEFAULT_COLOR.base_color_888,
                                            fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),
                                            letterSpacing: -0.6,
                                        }}>
                                        {data.teachers && data.teachers.map((teacher, index) => {
                                          return teacher.teacherName + (data.teachers.length - 1 > index ? ', ' : '');
                                        })}
                                    </CustomTextR>
                                </View>
                                <View style={{width: 1, height: 11, backgroundColor: '#e8e8e8', marginHorizontal: 10}}></View>
                                <View>
                                    <CustomTextR
                                        style={{
                                            color: DEFAULT_COLOR.base_color_888,
                                            fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),
                                        }}>
                                        <TextRobotoR>{data.lectureCount}</TextRobotoR>강
                                    </CustomTextR>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        };

        const classListResult = () => {
            this.classCounting = 0;
            const result = filteredClassList.sort((a, b) => {
                    switch (this.state.sortType) {
                        case 1: // 최근 수강 순
                            return this.getSortValue(a.lastOpenDatetime, b.lastOpenDatetime, 'asc', 'date');
                        case 2: // 최근 수강 역순
                            return this.getSortValue(a.lastOpenDatetime, b.lastOpenDatetime, 'desc', 'date');
                        case 3: // 최근 구매 순
                            return this.getSortValue(a.purchaseDatetime, b.purchaseDatetime, 'asc', 'date');
                        case 4: // 최근 구매 역순
                            return this.getSortValue(a.purchaseDatetime, b.purchaseDatetime, 'desc', 'date');
                        case 5: // 남은 수강일 순
                            return this.getSortValue(a.takeCourseEndDatetime, b.takeCourseEndDatetime, 'asc', 'date');
                        case 6: // 남은 수강일 역순
                            return this.getSortValue(a.takeCourseEndDatetime, b.takeCourseEndDatetime, 'desc', 'date');
                        case 7: // 진도율 순
                            return this.getSortValue(a.progressRatio, b.progressRatio, 'asc', 'date');
                        default:
                            return 0;
                    }
                })
                .map((myclass, index) => {
                  return this.isSetFilter() 
                    ? this.getResultByFilter(myclass) && listItem(myclass, index)
                    : listItem(myclass, index);
                });

            if (this.classCounting === 0) {
                return noClassListResult();
            } else {
                return result;
            }
        };

        if (this.state.loading === true) {
            return (<View style={MyClassStyles.IndicatorContainer}><ActivityIndicator size="large" /></View>);
        }

        return (
            <View style={styles.container}>
                {this.state.apiLoading && (
                    <View style={{position: 'absolute', left: SCREEN_WIDTH * 0.5, top: SCREEN_HEIGHT * 0.5, zIndex: 10}}><ActivityIndicator size="large" /></View>
                )}
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
                    <CustomTextM style={styles.topTitleText}>{this.state.product.productName}</CustomTextM>
                </View>
                <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
                  {/* 필터 영역 */}
                  {filteredClassList.length === 0 && (
                    <View style={styles.horizontalDividerLine}></View>
                  )}
                  {filteredClassList.length > 0 && (
                  <View style={[styles.flexDirRow, styles.topFilterSection]}>
                      <View style={[styles.flexDirRow, {alignItems: 'center'}]}>
                          {/* 정렬: 사용하지 않음 */}
                          {/* <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 20}}>
                            <Select2MyClass
                              isSelectSingle
                              style={{}}
                              selectedTitleStyle={MyClassStyles.font14}
                              showSearchBox={false}
                              colorTheme={COMMON_STATES.baseColor}
                              popupTitle="정렬 기준을 선택해 주세요."
                              title="정렬 기준"
                              cancelButtonText="취소"
                              selectButtonText="선택"
                              searchPlaceHolderText="검색어를 입력하세요"
                              listEmptyTitle="일치하는 결과가 없습니다"
                              data={this.state.SORT_TYPE}
                              onSelect={data => {
                                this.selectSortType(data);
                              }}
                            />
                            <Icon
                              name="caret-down"
                              size={Platform.OS === 'ios' ? PixelRatio.roundToNearestPixel(20) : PixelRatio.roundToNearestPixel(15)}
                              color="#cbcccb"
                              style={{marginLeft: 3}}
                            />
                          </View> */}
                      </View>

                      <View style={[styles.flexDirRow, {alignItems: 'center'}]}>
                          {/* 필터 */}
                          <View style={[styles.flexDirRow, {alignItems: 'center'}]}>
                          {(this.state.classList.length > 0) && (
                            <TouchableOpacity style={{paddingHorizontal: 15, paddingVertical: 9, borderRadius: 4, borderWidth: 1, borderColor: '#d8d8d8'}} onPress={() => this.goFilterScreen()}>
                                <CustomTextR style={styles.topFilterText}>필터</CustomTextR>
                            </TouchableOpacity>
                          )}
                          </View>
                      </View>
                  </View>
                  )}
                  {(isFilterSelectedLevel03 || isFilterSelectedLevel04 || isFilterSelectedDifficulty || isFilterTeacher || isFilterYear) && (
                      <View style={styles.filterResultSection}>
                          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                              {myClassApplyClassFilter.selectedLevel03 &&
                                myClassApplyClassFilter.selectedLevel03.map((item, key) => {
                                  return <TouchableOpacity style={styles.btnBorderedFilter} onPress={() => this.removeFilter(item, 'selectedLevel03')} key={'level03_'+key}><CustomTextR style={styles.borderedFilterText}>{myClassApplyClassFilter.filterTable.level03.find(element => element.Code === item).Name}</CustomTextR><Image source={require('../../../assets/icons/btn_del_keyword.png')} style={styles.delKeyword} /></TouchableOpacity>;
                                })}
                              {myClassApplyClassFilter.selectedLevel04 &&
                                myClassApplyClassFilter.selectedLevel04.map((item, key) => {
                                  return <TouchableOpacity style={styles.btnBorderedFilter} onPress={() => this.removeFilter(item, 'selectedLevel04')} key={'level04_'+key}><CustomTextR style={styles.borderedFilterText}>{myClassApplyClassFilter.filterTable.level04.find(element => element.Code === item).Name}</CustomTextR><Image source={require('../../../assets/icons/btn_del_keyword.png')} style={styles.delKeyword} /></TouchableOpacity>;
                                })}
                              {myClassApplyClassFilter.selectedDifficulty &&
                                myClassApplyClassFilter.selectedDifficulty.map((item, key) => {
                                  return <TouchableOpacity style={styles.btnBorderedFilter} onPress={() => this.removeFilter(item, 'selectedDifficulty')} key={'difficulty_'+key}><CustomTextR style={styles.borderedFilterText}>{myClassApplyClassFilter.filterTable.difficulty.find(element => element.Code === item).Name}</CustomTextR><Image source={require('../../../assets/icons/btn_del_keyword.png')} style={styles.delKeyword} /></TouchableOpacity>;
                                })}
                              {myClassApplyClassFilter.selectedTeacher &&
                                myClassApplyClassFilter.selectedTeacher.map((item, key) => {
                                  return <TouchableOpacity style={styles.btnBorderedFilter} onPress={() => this.removeFilter(item, 'selectedTeacher')} key={'teacher_'+key}><CustomTextR style={styles.borderedFilterText}>{myClassApplyClassFilter.filterTable.teachers.find(element => element.Code === item).Name}</CustomTextR><Image source={require('../../../assets/icons/btn_del_keyword.png')} style={styles.delKeyword} /></TouchableOpacity>;
                                })}
                              {myClassApplyClassFilter.selectedYear &&
                                myClassApplyClassFilter.selectedYear.map((item, key) => {
                                  return <TouchableOpacity style={styles.btnBorderedFilter} onPress={() => this.removeFilter(item, 'selectedYear')} key={'year_'+key}><CustomTextR style={styles.borderedFilterText}>{myClassApplyClassFilter.filterTable.year.find(element => element.Code === item).Name}</CustomTextR><Image source={require('../../../assets/icons/btn_del_keyword.png')} style={styles.delKeyword} /></TouchableOpacity>;
                                })}
                          </ScrollView>
                      </View>
                  )}

                  <View
                    style={{
                      flex: 1,
                      backgroundColor: '#fff',
                    }}>
                    {classListResult()}
                  </View>
                </ScrollView>
                <View style={{bottomMargin: 20, alignItems: 'center', backgroundColor: '#fff'}}>
                    <TouchableOpacity
                        style={{backgroundColor: DEFAULT_COLOR.lecture_base, width: '100%', height: SCREEN_HEIGHT * 0.1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}
                        onPress={() => this.applyClass()}>
                        <CustomTextR style={{color: '#fff', fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15), lineHeight: 15 * 1.42, letterSpacing: -0.6}}>
                        총 <TextRobotoR>{this.state.selectedClass.length}</TextRobotoR>개
                        </CustomTextR>
                        <View style={{width: 1, height: 15, backgroundColor: '#fff', marginHorizontal: 20}}></View>
                        <CustomTextB style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18), lineHeight: 18 * 1.42, letterSpacing: -0.9, color: '#fff'}}>강좌 추가하기</CustomTextB>
                    </TouchableOpacity>
                </View>

                <Modal
                    onBackdropPress={this.closeModal}
                    animationType="slide"
                    onRequestClose={() => {
                      this.setState({showModal: false});
                    }}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating
                    isVisible={this.state.isShowModal}
                    style={{justifyContent: 'flex-end', margin: 0}}>
                    <View
                        style={[
                          this.state.modalType === 'centerModal' ? {justifyContent: 'center'} : MyClassStyles.modalContainer,
                          {
                            // height: SCREEN_HEIGHT * 0.9,
                            height: this.state.modalType === 'centerModal' ? SCREEN_HEIGHT : SCREEN_HEIGHT * 0.9,
                          },
                        ]}>
                        {this.getModalContent(this.state.modalContent)}
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  flexDirCol: {flexDirection: 'column'},
  flexDirRow: {flexDirection: 'row'},
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    // paddingBottom: 30,
  },
  topTitleSection: {
    // height: 40,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 28,
  },
  topTitleText: {
    fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),
    lineHeight: 18 * 1.42,
    color: '#222222',
    letterSpacing: -0.9,
  },
  topFilterText: {
    fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
    lineHeight: 14 * 1.42,
    color: '#444444',
    letterSpacing: -0.7,
  },
  topFilterSection: {
    width: '100%',
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  horizontalDividerLine: {
    height: 1,
    backgroundColor: '#e8e8e8',
  },
  listItemContainer: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  listItemCheckbox: {
    justifyContent: 'center',
    marginLeft: -10,
    // flex: 1,
    // borderWidth: 1,
  },
  filterResultSection: {
    width: '100%', paddingHorizontal: 10, backgroundColor: '#f5f7f8', borderTopWidth: 1, borderTopColor: '#e8e8e8', borderBottomWidth: 1, borderBottomColor: '#ebeef0'
  },
  btnBorderedFilter: {
    borderRadius: 20,
    paddingLeft: 15,
    paddingRight: 7,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#470000',
    shadowOffset: {width: 1, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginVertical: 12,
    marginRight: 5,
    flexDirection: 'row',
  },
  borderedFilterText: {
    fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
    color: DEFAULT_COLOR.lecture_base,
    letterSpacing: -0.7,
  },
  delKeyword: {
    width: 16,
    height: 16,
    marginLeft: 8,
  },
  listItemList: {}
});

const mapStateToProps = state => {
  return {
    myClassServiceID: state.GlabalStatus.myClassServiceID,
    myClassClassList: state.GlabalStatus.myClassClassList,
    myClassApplyClassFilter: state.GlabalStatus.myClassApplyClassFilter,
    myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateMyClassClassList: object => {
      dispatch(ActionCreator.updateMyClassClassList(object));
    },
    updateMyClassApplyClassFilter: object => {
      dispatch(ActionCreator.updateMyClassApplyClassFilter(object));
    },
  };
}

ApplyClassList.propTypes = {
  myClassApplyClassFilter: PropTypes.object,
  myClassClassList: PropTypes.array,
};

export default connect(mapStateToProps, mapDispatchToProps)(ApplyClassList);