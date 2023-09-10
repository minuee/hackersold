import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
  PixelRatio,
  // Modal,
  Dimensions,
  LayoutAnimation,
  UIManager,
  Alert,
  ActivityIndicator,
  ImageBackground,
  Image,
  Linking,
} from 'react-native';
// import Swipeable from 'react-native-gesture-handler/Swipeable';
import SwipeRow from '../../Utils/SwipeListView/SwipeRow';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import MainTopTabs from '../../Route/MainTopTabs';

import MyClassFilterScreen from './MyClassFilterScreen';
import ClassDetailScreen from './ClassDetailScreen';
import ApplyClassList from './ApplyClassList';
import AttendCalendar from './AttendCalendar';
import ChallengeCalendar from './ChallengeCalendar';
import StudyDiaryScreen from './StudyDiaryScreen';
import ChallengeApplyScreen from './ChallengeApplyScreen';
import MyClassStyles from '../../Style/MyClass/MyClassStyle';

import Toast from 'react-native-tiny-toast';
import Select2MyClass from '../../Utils/Select2MyClass';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFunction from '../../Utils/CommonFunction';
import {CustomText, CustomTextR, CustomTextB, CustomTextL, CustomTextM, CustomTextDL, TextRobotoM, TextRobotoR} from '../../Style/CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/AntDesign';
Icon2.loadFont();

//공통상수
import COMMON_STATES, {SERVICES} from '../../Constants/Common';
import * as getDEFAULT_CONSTANTS from '../../Constants';
import { updateMyClassFavoriteClassList } from '../../Ducks/Actions/statusAction';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
// const TAB_BAR_HEIGHT = isIphoneX() ? SCREEN_HEIGHT*0.5 : (SCREEN_HEIGHT*0.5)-40;
const TAB_BAR_HEIGHT = SCREEN_HEIGHT * 0.55;

const IMAGE_HEIGHT = 250;
const HEADER_HEIGHT = Platform.OS === 'ios' ? 64 : 50;
const SCROLL_HEIGHT = IMAGE_HEIGHT - HEADER_HEIGHT;
const THEME_COLOR = 'rgba(85,186,255, 1)';
const FADED_THEME_COLOR = 'rgba(85,186,255, 0.8)';
const HEAHER_HEIGHT = parseInt(SCREEN_HEIGHT * 0.25) + (Platform.OS === 'ios' ? CommonFunction.isIphoneX() ? 0 : 40 : 0);

//스와이프
const HEIGHT_SWIPE_ITEM = 100;
const COUNT_RIGHT_SWIPE_BUTTON = 2;
const WIDTH_RIGHT_SWIPE_BUTTON = 65;
const COUNT_LEFT_SWIPE_BUTTON = 0;
const WIDTH_LEFT_SWIPE_BUTTON = 65;

// 수강상태
const PRODUCT_STATUS_BEFORE = '수강예정';
const PRODUCT_STATUS_ING = '수강중';
const PRODUCT_STATUS_PAUSE = '일시정지';
const PRODUCT_STATUS_DONE = '수강완료';
const PRODUCT_STATUS_HIDE = '숨긴 강좌';

const abortController = new AbortController();

export function isIphoneX() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    ((dimen.height === 812 || dimen.width === 812) || (dimen.height === 896 || dimen.width === 896))
  );
}

// 상품 & 강좌 목록 샘플 데이터
const mockClassList = [
  {
    memberProductIdx: 1, productPattern: '프리패스', productStatus: '수강완료',
    productName: '상품1', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2019-05-20 10:00:00', takeCourseEndDatetime: '2020-02-29 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: null, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2019-05-20 10:00:00',  missionType: '', missionStatus: '', isChallengeApply: false,
    "memberClassIdx": 1, "className": "aaa", "openedCount": 20, "lectureCount": 40,
    "level03": "10010", "level03Name": "토플", "level04": "100000", "level04Name": "리딩",
    "difficulty": "100101", "difficultyName": "난이도1",  teacher: [{teacherIdx: 1, teacherName: "ta"}], "year": 2019, 
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
    "difficulty": "100102", "difficultyName": "난이도2",  teacher: [{teacherIdx: 2, teacherName: "tb"}], "year": 2019, 
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
    "difficulty": "100103", "difficultyName": "난이도3",  teacher: [{teacherIdx: 3, teacherName: "tc"}], "year": 2019, 
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
    "difficulty": "100104", "difficultyName": "난이도4",  teacher: [{teacherIdx: 4, teacherName: "td"}], "year": 2019, 
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
    "difficulty": "100105", "difficultyName": "난이도5",  teacher: [{teacherIdx: 5, teacherName: "te"}], "year": 2019, 
    "isFavorite": true, "isHidden": false, "progressRatio": 0.8, "lastOpenDatetime": "2020-01-01 10:40:00"
  },
  {
    memberProductIdx: 2, productPattern: '단과', productStatus: '수강중',
    productName: '상품2', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2020-01-01 10:00:00', takeCourseEndDatetime: '2020-05-31 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: 1.5, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2020-01-01 10:00:00',  missionType: '', missionStatus: '', isChallengeApply: false,
    "memberClassIdx": 6, "className": "aaa", "openedCount": 50, "lectureCount": 50,
    "level03": "10020", "level03Name": "토익", "level04": "100000", "level04Name": "리딩",
    "difficulty": "100201", "difficultyName": "난이도11",  teacher: [{teacherIdx: 1, teacherName: "ta"}], "year": 2019, 
    "isFavorite": true, "isHidden": false, "progressRatio": 0.5, "lastOpenDatetime": "2020-01-01 10:50:00"
  },
  {
    memberProductIdx: 2, productPattern: '단과', productStatus: '수강중',
    productName: '상품2', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2020-01-01 10:00:00', takeCourseEndDatetime: '2020-05-31 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: 1.5, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2020-01-01 10:00:00',  missionType: '', missionStatus: '', isChallengeApply: false,
    "memberClassIdx": 7, "className": "bbb", "openedCount": 25, "lectureCount": 39,
    "level03": "10020", "level03Name": "토익", "level04": "100010", "level04Name": "리스닝",
    "difficulty": "100202", "difficultyName": "난이도12",  teacher: [{teacherIdx: 2, teacherName: "tb"}], "year": 2019, 
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
    "difficulty": "100203", "difficultyName": "난이도13",  teacher: [{teacherIdx: 3, teacherName: "tc"}], "year": 2019, 
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
    "difficulty": "100301", "difficultyName": "난이도21",  teacher: [{teacherIdx: 4, teacherName: "td"}], "year": 2019, 
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
    "difficulty": "100302", "difficultyName": "난이도22",  teacher: [{teacherIdx: 5, teacherName: "te"}], "year": 2019, 
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
    "difficulty": "100401", "difficultyName": "난이도0",  teacherIdx: 6, teacherName: "tf", "year": 2019, 
    "isFavorite": true, "isHidden": false, "progressRatio": 0.4, "lastOpenDatetime": "2020-01-01 11:40:00"
  },
  { // 10분의 기적 상품 ////////////////////////////////////////////////////////////
    memberProductIdx: 3, productPattern: '환급반', productStatus: '수강중',
    productName: '중국어 회화 10분의 기적 중국어 회화 10분의 기적 중국어 회화 10분의 기적', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2020-02-01 10:00:00', takeCourseEndDatetime: '2020-06-30 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: 0, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2020-02-01 10:00:00',  missionType: 'challenge', missionStatus: '', isChallengeApply: false,
    challengeStartDatetime: '', challengeConditionDays: '50',
    "memberClassIdx": 12, "className": "회화 10분의 기적 챌린지 12", "openedCount": 25, "lectureCount": 39,
    "level03": "10020", "level03Name": "토익", "level04": "100000", "level04Name": "리딩",
    "difficulty": "100201", "difficultyName": "난이도11",  teacher: [{teacherIdx: 1, teacherName: "ta"}], "year": 2019, 
    "isFavorite": false, "isHidden": false, "progressRatio": 0.5, "lastOpenDatetime": "2020-02-01 09:00:00"
  },
  {
    memberProductIdx: 3, productPattern: '환급반', productStatus: '수강중',
    productName: '중국어 회화 10분의 기적 중국어 회화 10분의 기적 중국어 회화 10분의 기적', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2020-02-01 10:00:00', takeCourseEndDatetime: '2020-06-30 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: 0, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2020-02-01 10:00:00',  missionType: 'challenge', missionStatus: '', isChallengeApply: true,
    "memberClassIdx": 13, "className": "회화 10분의 기적 챌린지 13", "openedCount": 25, "lectureCount": 39,
    "level03": "10020", "level03Name": "토익", "level04": "100010", "level04Name": "리스닝",
    "difficulty": "100202", "difficultyName": "난이도12",  teacher: [{teacherIdx: 2, teacherName: "tb"}], "year": 2019, 
    "isFavorite": false, "isHidden": false, "progressRatio": 0.5, "lastOpenDatetime": "2020-02-02 09:00:00"
  },
  {
    memberProductIdx: 3, productPattern: '환급반', productStatus: '수강중',
    productName: '중국어 회화 10분의 기적 중국어 회화 10분의 기적 중국어 회화 10분의 기적', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2020-02-01 10:00:00', takeCourseEndDatetime: '2020-06-30 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: 0, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2020-02-01 10:00:00',  missionType: 'challenge', missionStatus: '', isChallengeApply: true,
    "memberClassIdx": 14, "className": "회화 10분의 기적 챌린지 14", "openedCount": 25, "lectureCount": 39,
    "level03": "10020", "level03Name": "토익", "level04": "100040", "level04Name": "보카",
    "difficulty": "100203", "difficultyName": "난이도13",  teacher: [{teacherIdx: 3, teacherName: "tc"}], "year": 2019, 
    "isFavorite": false, "isHidden": false, "progressRatio": 0.5, "lastOpenDatetime": "2020-02-03 09:00:00"
  },
  {
    memberProductIdx: 3, productPattern: '환급반', productStatus: '수강중',
    productName: '중국어 회화 10분의 기적 중국어 회화 10분의 기적 중국어 회화 10분의 기적', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2020-02-01 10:00:00', takeCourseEndDatetime: '2020-06-30 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: 0, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2020-02-01 10:00:00',  missionType: 'challenge', missionStatus: '', isChallengeApply: true,
    "memberClassIdx": 15, "className": "회화 10분의 기적 챌린지 15", "openedCount": 25, "lectureCount": 39,
    "level03": "10030", "level03Name": "토익스피킹", "level04": "100120", "level04Name": "토익스피킹",
    "difficulty": "100301", "difficultyName": "난이도21",  teacher: [{teacherIdx: 4, teacherName: "td"}], "year": 2019, 
    "isFavorite": false, "isHidden": false, "progressRatio": 0.5, "lastOpenDatetime": "2020-02-04 09:00:00"
  },
  {
    memberProductIdx: 3, productPattern: '환급반', productStatus: '수강중',
    productName: '중국어 회화 10분의 기적 중국어 회화 10분의 기적 중국어 회화 10분의 기적', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2020-02-01 10:00:00', takeCourseEndDatetime: '2020-06-30 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: 0, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2020-02-01 10:00:00',  missionType: 'challenge', missionStatus: '', isChallengeApply: true,
    "memberClassIdx": 16, "className": "회화 10분의 기적 챌린지 16", "openedCount": 25, "lectureCount": 39,
    "level03": "10030", "level03Name": "토익스피킹", "level04": "100120", "level04Name": "토익스피킹",
    "difficulty": "100302", "difficultyName": "난이도22",  teacher: [{teacherIdx: 5, teacherName: "te"}], "year": 2019, 
    "isFavorite": false, "isHidden": false, "progressRatio": 0.5, "lastOpenDatetime": "2020-02-05 09:00:00"
  },
  {
    memberProductIdx: 3, productPattern: '환급반', productStatus: '수강중',
    productName: '중국어 회화 10분의 기적 중국어 회화 10분의 기적 중국어 회화 10분의 기적', validBeginDatetime: '', validEndDatetime: '',
    takeCourseBeginDatetime: '2020-02-01 10:00:00', takeCourseEndDatetime: '2020-06-30 23:59:59', isTakeCourseLimit: false,
    takeCourseLimitMessage: '', lectureMultiple: 0, courseDays: 0, lectureCount: 0, attendDays: 100,
    purchaseDatetime: '2020-02-01 10:00:00',  missionType: 'challenge', missionStatus: '', isChallengeApply: true,
    "memberClassIdx": 17, "className": "회화 10분의 기적 챌린지 17", "openedCount": 25, "lectureCount": 39,
    "level03": "10040", "level03Name": "오픽", "level04": "100130", "level04Name": "오픽",
    "difficulty": "100401", "difficultyName": "난이도0",  teacher: [{teacherIdx: 6, teacherName: "tf"}], "year": 2019, 
    "isFavorite": false, "isHidden": false, "progressRatio": 0.5, "lastOpenDatetime": "2020-02-06 09:00:00"
  },
];

const mockSelectedClass = {
  topImage: '',
  memberProductIdx: 10, memberClassIdx: 6, productPattern: '단과', productStatus: '수강중',  productName: '상품이름 상품이름',
  validBeginDatetime: '2019-12-01 10:00:00', 'validEndDatetime': '2020-12-31 23:59:59', 'takeCourseBeginDatetime': '2019-12-01 10:10:00', 'takeCourseEndDatetime': '', 
  teacherName: '티쳐', lectureMultiple: 0, courseDays: 100, lectureCount: 60, openLectureCnt: 1,
  isEnableTempStop: true, disableTempStopReason: '', isEnableExtends: true,
  isEnableCertTakeCourse: true, isEnableCertAttend: true,
  isCurriculum: false, isStudyFiles: true, isMovieDown: true,
  lectures: [
    {memberLectureIdx: 1, lectureNo: 1, lectureName: '1강 강의 강의',
    movies: [{totalTime: '100', playTime: '10', url: ''}, {totalTime: '90', playTime: '2', url: ''}],
    isTeacherQuestion: true, isMemo: true, isLectureData: true,
    isLatest: true, lastDatetime: ''},
    {memberLectureIdx: 2, lectureNo: 2, lectureName: '2강 강의 강의',
    movies: [{totalTime: '100', playTime: '10', url: ''}],
    isTeacherQuestion: true, isMemo: true, isLectureData: true,
    isLatest: true, lastDatetime: ''},
    {memberLectureIdx: 3, lectureNo: 3, lectureName: '3강 강의 강의',
    movies: [{totalTime: '100', playTime: '10', url: ''}],
    isTeacherQuestion: true, isMemo: true, isLectureData: true,
    isLatest: true, lastDatetime: ''},
    {memberLectureIdx: 4, lectureNo: 4, lectureName: '4강 강의 강의',
    movies: [{totalTime: '100', playTime: '10', url: ''}],
    isTeacherQuestion: true, isMemo: true, isLectureData: true,
    isLatest: true, lastDatetime: ''},
    {memberLectureIdx: 5, lectureNo: 5, lectureName: '5강 강의 강의',
    movies: [{totalTime: '100', playTime: '10', url: ''}],
    isTeacherQuestion: true, isMemo: true, isLectureData: true,
    isLatest: true, lastDatetime: ''},
    {memberLectureIdx: 6, lectureNo: 6, lectureName: '6강 강의 강의',
    movies: [{totalTime: '100', playTime: '10', url: ''}],
    isTeacherQuestion: true, isMemo: true, isLectureData: true,
    isLatest: true, lastDatetime: ''},
    {memberLectureIdx: 7, lectureNo: 7, lectureName: '7강 강의 강의',
    movies: [{totalTime: '100', playTime: '10', url: ''}],
    isTeacherQuestion: true, isMemo: true, isLectureData: true,
    isLatest: true, lastDatetime: ''},
    {memberLectureIdx: 8, lectureNo: 8, lectureName: '8강 강의 강의',
    movies: [{totalTime: '100', playTime: '10', url: ''}],
    isTeacherQuestion: true, isMemo: true, isLectureData: true,
    isLatest: true, lastDatetime: ''},
    {memberLectureIdx: 9, lectureNo: 9, lectureName: '9강 강의 강의',
    movies: [{totalTime: '100', playTime: '10', url: ''}],
    isTeacherQuestion: true, isMemo: true, isLectureData: true,
    isLatest: true, lastDatetime: ''},
    {memberLectureIdx: 10, lectureNo: 10, lectureName: '10강 강의 강의',
    movies: [{totalTime: '100', playTime: '10', url: ''}],
    isTeacherQuestion: true, isMemo: true, isLectureData: true,
    isLatest: true, lastDatetime: ''},
  ]
};

// 잔여수강일 계산
const remainDays = endDate => {
    return CommonUtil.dateDiff(moment().format('YYYY-MM-DD HH:mm:ss'), endDate);
};

// 강좌 목록 Item
const RenderItem = props => {
    const state = props.state;
    const classData = props.classData;
    const isBeforeStart = CommonUtil.isEmpty(classData.takeCourseBeginDatetime) || (!CommonUtil.isEmpty(classData.takeCourseBeginDatetime) &&moment(classData.takeCourseBeginDatetime).format('X') > moment().format('X'));
    const isFavorite = props.state.favoriteClassList.indexOf(classData.memberClassIdx) > -1;
    const getProductBadgeStyle = type => {
        switch (type) {
            case '단과':
                return MyClassStyles.classRoundedBadgeBlue;
            case '종합(패키지)':
                return MyClassStyles.classRoundedBadgeBlue;
            case '프리패스':
                return MyClassStyles.classRoundedBadgeGreen;
            case '환급반':
                return MyClassStyles.classRoundedBadgeYellow;
            case '평생반':
                return MyClassStyles.classRoundedBadgePurple;
            case '모의고사':
                return MyClassStyles.classRoundedBadgeDkBlue;
            case '첨삭':
                return MyClassStyles.classRoundedBadgeSkBlue;
            default:
                return MyClassStyles.classRoundedBadgeGray;
        }
    };
    const getClassStatusBadgeStyle = type => {
        switch (type) {
            case PRODUCT_STATUS_BEFORE:
                return MyClassStyles.classRoundedBadgeGray;
            case PRODUCT_STATUS_ING:
                return MyClassStyles.classRoundedBadgeSkBlue;
            default:
                return MyClassStyles.classRoundedBadgeGray;
        }
    };
    const isSwipeOpened = state.swipeOpenedList.indexOf(classData.memberClassIdx) > -1;
    return (
        <View style={[styles.flexDirCol, styles.listItemContainer, isSwipeOpened && {backgroundColor: '#e2f3f8'}]} key={classData.memberClassIdx}>
            <View style={[styles.flexDirCol, styles.listItem]}>
                <View style={[styles.flexDirRow, {alignItems: 'center', marginTop: 20}]}>
                    {/* TEST:: memberClassIdx 임시 표시 */}
                    {/* <Text>{classData.memberClassIdx}</Text> */}
                    {/* 상품유형 : 사용안함
                      <View
                        style={[
                          MyClassStyles.classRoundedBadge,
                          getProductBadgeStyle(classData.productPattern),
                          {borderWidth: 1, borderColor: '#fff'}
                        ]}>
                        <CustomTextM style={[MyClassStyles.classRoundedBadgeText, {color: '#fff'}]}>{classData.productPattern}</CustomTextM>
                      </View>
                    */}
                    <View
                      style={[
                        MyClassStyles.classRoundedNoBorderBadge,
                        getClassStatusBadgeStyle(classData.productStatus),
                        // {borderWidth: 1, borderColor: '#fff'}
                      ]}>
                      <CustomTextM style={[MyClassStyles.classRoundedBadgeText, {color: '#fff'}]}>{classData.productStatus}</CustomTextM>
                    </View>
                    {/*
                    <View style={[
                        MyClassStyles.classRoundedBadge,
                    ]}>
                        <CustomTextM style={[MyClassStyles.classRoundedBadgeText, {color: '#888'}]}>{classData.productPattern}</CustomTextM>
                    </View>
                    */}
                    {(classData.lectureMultiple !== null && classData.lectureMultiple !== 0 && classData.lectureMultiple !== '') && (
                        <>
                        <View style={MyClassStyles.classRoundedBadge}>
                            <Image source={require('../../../assets/icons/icon_fastforward.png')} style={{width: 10, height: 8, marginRight: 4}} />
                            <CustomTextM style={[MyClassStyles.classRoundedBadgeText]}>{classData.lectureMultiple} 배수</CustomTextM>
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end', minHeight: 15, justifyContent: 'center'}}>
                            {isFavorite &&
                                <Image source={require('../../../assets/icons/icon_star_on_l.png')} style={{width: 15, height: 15, marginRight: 4}} />
                            }
                        </View>
                        </>
                    )}
                </View>

                {/* <View style={{position: 'absolute', top: Platform.OS === 'ios' ? 26 : 23, right: Platform.OS === 'ios' ? 32 : 29, minHeight: 15, justifyContent: 'center'}}>
                    {isFavorite && (
                        <Image source={require('../../../assets/icons/icon_star_on_l.png')} style={{width: 15, height: 15}} />
                    )}
                </View> */}

                <TouchableOpacity onPress={ () => props.onRowPress(classData) }>
                    <View style={{marginTop: 15, marginBottom: 10}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6}}>
                            <CustomTextM style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16), fontWeight: '500', letterSpacing: -0.8, color: '#222222'}}>{classData.className || classData.productName}</CustomTextM>
                            {(classData.lectureMultiple === null || classData.lectureMultiple === 0 || classData.lectureMultiple === '') && (
                                <View style={{minHeight: 15, justifyContent: 'center'}}>
                                    {isFavorite &&
                                        <Image source={require('../../../assets/icons/icon_star_on_l.png')} style={{width: 15, height: 15, marginRight: Platform.OS === 'ios' ? 9 : 8}} />
                                    }
                                </View>
                            )}
                        </View>
                        <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13), letterSpacing: -0.65, color: '#888'}}>
                        {classData.teachers && classData.teachers.map((item, index) => {
                          return item.teacherName + ((classData.teachers.length -1 > index) ? ', ' : '');
                        })}
                        </CustomTextR>
                    </View>
                </TouchableOpacity>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13), color: '#444'}}>
                        <Text style={[MyClassStyles.robotoM ,{color: DEFAULT_COLOR.lecture_base, fontWeight: '500'}]}>{classData.openedCount > 0 && classData.openedCount}</Text>
                        {classData.openedCount > 0 && '/' }
                        {classData.lectureCount || 0}강
                    </CustomTextR>
                    <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13), color: '#e8e8e8', marginHorizontal: 10}}>|</CustomTextR>
                    <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13), color: '#444', letterSpacing: -0.65}}>
                        {isBeforeStart ? '자동시작일 ' : '잔여수강일 '}
                        <Text style={[MyClassStyles.robotoM ,{color: DEFAULT_COLOR.lecture_base, fontWeight: '500'}]}>
                          {
                              isBeforeStart
                                  ? (CommonUtil.isEmpty(classData.startScheduledDate)
                                  ||
                                    classData.startScheduledDate === '0000-00-00'
                                        ? '미설정'
                                        : moment(classData.startScheduledDate).format('YYYY.MM.DD'))
                                        : remainDays(classData.takeCourseEndDatetime)}
                        </Text>
                        {!isBeforeStart && ('일 (~' + moment(classData.takeCourseEndDatetime).format('YY.MM.DD') + ')')}
                    </CustomTextR>
                    <View style={{flex:1, alignItems: 'flex-end'}}>
                      {(state.lectureLoading && state.lectureShow.memberClassIdx === classData.memberClassIdx) ? (
                          <View style={{paddingHorizontal: 10}}><ActivityIndicator size="small" /></View>
                      ) : (
                        <TouchableOpacity onPress={() => props.onShowLecture(classData)} style={{paddingHorizontal: 10}} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                            <Icon name={(state.lectureShow.isShow && state.lectureShow.memberClassIdx === classData.memberClassIdx) ? 'angle-up' : 'angle-down'} size={Platform.OS === 'ios' ? 25 : 20} color="#999" />
                        </TouchableOpacity>
                      )}
                    </View>
                </View>
            </View>

            {/* 학습진도율 progress bar */}
            <View style={{width: '100%', height: 3, paddingHorizontal: 20}}>
                <View style={{width: '100%', height: 3, backgroundColor: '#f5f7f8'}}>
                    <View style={{width: ((classData.openedCount/classData.lectureCount) * 100)+'%', height: 3, backgroundColor: '#3fcfff'}}></View>
                    {/* <View style={{width: (classData.progressRatio * 100)+'%', height: 3, backgroundColor: '#3fcfff'}}></View> */}
                </View>
            </View>
        </View>
    );
};

// swipe 시 노출되는 버튼
const RightSwipeButton = props => {
  const isFavorite = props.screenState.favoriteClassList.indexOf(props.classData.memberClassIdx) > -1;
  const isHidden =
      props.screenState.isUseHidden
          ? (props.classData.isHidden === true || parseInt(props.classData.isHidden) === 1) ? true : false
          : props.screenState.hiddenClassList.indexOf(props.classData.memberClassIdx) > -1
                    //props.classData.isHidden;
  return (
    <View style={styles.rightSwipeContainer}>
      <TouchableOpacity style={styles.swipeButton} onPress={() => props.screenState.toggleClassHidden(props.classData)}>
        <Image
          style={{width: 26, height: 21}}
          source={isHidden === true ? require('../../../assets/icons/btn_gesture_hide.png') : require('../../../assets/icons/btn_gesture_show.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.swipeButton, {backgroundColor: DEFAULT_COLOR.lecture_base}]} onPress={() => props.screenState.toggleClassFavorite(props.classData)}>
        <Image
          style={{width: 21, height: 20}}
          source={isFavorite === true ? require('../../../assets/icons/btn_gesture_favorite_off.png') : require('../../../assets/icons/btn_gesture_favorite_on.png')}
        />
      </TouchableOpacity>
    </View>
  );
};

// 강의 목록 Item
const LectureItem = props => {
    const selectedClassDetail = props.screenState.selectedClassDetail;
    // const selectedClass = props.screenState.lectureShow.selectedClass;
    return (
        <ScrollView
            style={{backgroundColor: '#a5b9bf'}}
            horizontal
            showsHorizontalScrollIndicator={false}
            onTouchStart={() => {
                if (Platform.OS === 'android') {
                   // props.setTopScrollDisable(true);// disabed parent scroll
                }
            }}
            onScrollEndDrag={() => {
                if (Platform.OS === 'android') {
                }
            }}>
            {(props.classData.memberClassIdx === props.screenState.lectureShow.memberClassIdx) && (
                <View style={{height: props.screenState.lectureShow.isShow ? null : 0, overflow: 'hidden', backgroundColor: 'tranparent', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 13,}}>
                    {(selectedClassDetail !== null && (selectedClassDetail.lectures && selectedClassDetail.lectures.length > 0)) &&

                    selectedClassDetail.lectures.map((lecture, key) => {
                        return (
                            <TouchableOpacity
                                style={{
                                    width: 210,
                                    height: 100,
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    backgroundColor: '#fff',
                                    marginRight: 5,
                                    borderRadius: 4,
                                    padding: 15,
                                }}
                                key={lecture.memberLectureIdx}
                                onPress={() => props.screenState.onLecturePressHandle(lecture)}>
                                <View style={{width: '100%'}}>
                                    <CustomTextM style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11), color: '#666', fontWeight: '500', letterSpacing: -0.55}} numberOfLines={2}>{lecture.lectureName}</CustomTextM>
                                </View>
                                <View style={[styles.flexDirRow, {alignItems: 'center', width: '100%', justifyContent: 'space-between', marginTop: 15}]}>
                                    <View style={styles.flexDirCol}>
                                        {lecture.movies.map((movieItem, key) => {
                                            return (
                                                <View key={key} style={[styles.flexDirRow, {justifyContent: 'center', alignItems: 'center'}]}>
                                                    <CustomTextDL style={{color: DEFAULT_COLOR.base_color_888, fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11), fontWeight: '300', letterSpacing: -0.55}}>영상{key + 1}</CustomTextDL>
                                                    <View style={{width: 1, height: 11, backgroundColor: '#e8e8e8', marginVertical: 0, marginHorizontal: 7}}></View>
                                                    <CustomTextDL style={{color: DEFAULT_COLOR.base_color_888, fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11), fontWeight: '300', letterSpacing: -0.55}}>{movieItem.playTime || 0}분 사용 (총{movieItem.totalTime}분)</CustomTextDL>
                                                </View>
                                            );
                                        })}
                                    </View>
                                </View>
                                <Image source={require('../../../assets/icons/btn_my_video_play.png')} style={{width: 31, height: 31, position: 'absolute', right: 10, bottom: 10}} />
                            </TouchableOpacity>
                        );
                      })}
                </View>
            )}
        </ScrollView>
    );
};

// 강의 영상 선택 모달
const ModalSelectMovie = props => {
    const classData = props.screenState.selectedClass;
    const lecture = props.screenState.selectedProduct;
    const contentHeight = (lecture.movies.length * 46) + 180;
    return (
        <View style={{backgroundColor: '#fff', borderRadius: 14, marginHorizontal: 50, height: contentHeight, alignItems: 'center'}}>
            <Image source={require('../../../assets/icons/icon_alert_exclamation.png')} style={{width: 25, height: 25, marginTop: 25, marginBottom: 15}} />
            <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14), color: DEFAULT_COLOR.base_color_222, lineHeight: 18, letterSpacing: -0.7, marginHorizontal: 35, marginBottom: 25}}>영상이 2개 이상 준비되어 있습니다. 수강하실 영상을 선택해주세요.</CustomTextR>
            {lecture.movies && lecture.movies.length > 1 && (
                lecture.movies.map((movie, key) => {
                    return (
                        <TouchableOpacity
                            style={{width: '100%', height: 46, justifyContent: 'center', alignItems: 'center', backgroundColor: (key % 2 === 0) ? '#f5f7f8' : '#fff'}} 
                            key={'movie_'+key}
                            onPress={() => props.screenState.openApp(lecture.lectureStreamingURL[key])}>
                            <View style={{position: 'absolute', top: 0, left: 35, right: 35, height: 1, backgroundColor: '#e8e8e8', opacity: 0.5}}></View>
                            <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16), color: DEFAULT_COLOR.lecture_base}}>영상 {key+1}</CustomTextR>
                        </TouchableOpacity>);
                })
            )}
            <TouchableOpacity style={{width: '100%', height: 46, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 0, borderTopWidth: 1, borderTopColor: '#e8e8e8'}} onPress={() => props.closePressHandle()}>
                <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16), color: DEFAULT_COLOR.base_color_888}}>취소</CustomTextR>
            </TouchableOpacity>
        </View>
    );
};

{/* 미션상태 
<Text>{this.getMissionStatusString(challengeProduct.missionStatus)}</Text> 
- 도전신청서 작성 전: 도전 신청서 작성
- 도전 신청서 제출 후 바로 시작 (버튼 명 : 미션 진행 중), “tool tip : 100일 중 n일차 도전 중입니다.” 
- 도전 신청서 제출 후 1일 후 시작 (버튼 명 : 미션 대기), “tool tip : 1일 후 도전이 시작됩니다.”
- 도전 성공 (버튼 명 : 도전 성공), “tool tip : 환급신청이 가능합니다.”
- 도전 실패 (버튼 명: 도전 실패), 
: 재도전이 가능한 경우(남은 수강 기간이 110일 이상인 경우) : tap > “confirm : 재도전 신청” 출력
: 재도전이 불가능한 경우(남은 수강 기간이 110일 미만이거나, 재도전 횟수를 초과한 경우)
: tap > “tool tip : 도전에 실패했습니다. 남은 수강 기간이 부족해 재도전하실 수 없습니다.”
- 재도전 심사 중 (버튼 명: 재도전 심사 중) : tap > “tool tip : 재도전 심사 중입니다.” 
*/}
const ChallengeMisstionButton = props => {
  const {missionStatus, startDatetime, onPressApply} = props;
  return (
    <View style={{paddingHorizontal: 40, marginHorizontal: 50, marginVertical: 100}}>
      <TouchableOpacity onPress={() => onPressApply()}>
        <Text>도전 신청서 작성</Text>
      </TouchableOpacity>
    </View>
  );
};

// 수강예정, 종료 강좌 터치 시 모달
const ModalClassInfoMsg = props => {
  startCalssConfirmAlert = () => {
      Alert.alert('', '수강을 시작하시겠습니까?', [
        {text: '네', onPress: () => props.screenState.startClass()},
        {text: '아니오', onPress: () => console.log('수강 시작 취소')},
      ]);
  };
  return (
      <View style={{width: '100%', height: SCREEN_HEIGHT * 0.45 + 30, paddingBottom: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderTopLeftRadius: 15, borderTopRightRadius: 15}}>
          {/* <View style={{alignItems: 'center', justifyContent: 'center', height: 35, position: 'absolute', top: 10}}>
              <TouchableOpacity
                  onPress={() => {
                    props.screenState.closeModal();
                  }}
                  style={{padding: 5}}>
                  <Icon3 name="chevron-thin-down" size={15} color={DEFAULT_CONSTANTS.base_color_222} />
              </TouchableOpacity>
          </View> */}
          <Image source={require('../../../assets/icons/icon_none_exclamation.png')} style={{width: 65, height: 65, marginBottom: 15}} />
          <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14), letterSpacing: -0.7, textAlign: 'center'}}>
              수강예정 강의입니다.
          </CustomTextR>
          {props.screenState.selectedProduct.productStatus === PRODUCT_STATUS_BEFORE && (
              <TouchableOpacity
                  style={{position: 'absolute', bottom: 30, left: 20, right: 20, height: 45, borderRadius: 4, backgroundColor: DEFAULT_COLOR.lecture_base, justifyContent: 'center', alignItems: 'center'}}
                  onPress={() => this.startCalssConfirmAlert()}>
                  <CustomTextM style={{fontWeight: '500', letterSpacing: -0.84, color: '#fff', fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14), lineHeight: 14 * 1.42}}>수강 시작</CustomTextM>
              </TouchableOpacity>
        )}
      </View>
  );
};

class MyLectureScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            moreLoading: false,
            apiDomain: '',
            apiKey: '',
            memberIdx: 0,
            memberID: '',
            currentPage: 1,
            ismore: false,
            apiLoading: false,
            lectureLoading: false,
            myClassServiceID: props.myClassServiceID,
            isFavorite: false, // favorite 필터 여부
            favoriteClassList: [],
            hiddenClassList: [],
            swipeOpenedList: [],
            checkedFilter: {
                classStatus: PRODUCT_STATUS_ING, // 수강중, 일시정지, 수강완료, 숨긴 강좌
                filter: {},
            },
            sortType: 1, // default: 최근 수강 순
            selectedClass: null,
            selectedClassDetail: null,
            lectureShow: {
                isShow: false,
                memberClassIdx: null,
                // selectedClass: null,
            },
            modalContent: '',
            modalType: '',
            selectedProduct: null,
            selectedChallengeProduct: null,
            isShowModal: false,
            classList: [], //props.myClassClassList || [],
            classCount: 0,
            hasFreepass: false,
            isUseFavorite: false,
            isUseHidden: false,
            selectedTabIndex: 0,
            challengeExpand: false,
            activeTab: 0,
            height: 500,
            myClassProductFilter: props.myClassProductFilter || {},
            challengeTootipIsShow: false,
            challengeTootipMsg: '',
            CLASS_STATUS: [
                { id: 1, name: PRODUCT_STATUS_ING, checked: true },
                { id: 2, name: PRODUCT_STATUS_PAUSE },
                { id: 3, name: PRODUCT_STATUS_DONE },
                { id: 4, name: PRODUCT_STATUS_HIDE },
            ],
            SORT_TYPE: [
                { id: 1, name: "최근 수강 순", checked: true},
                { id: 2, name: "최근 수강 역순" },
                { id: 3, name: "최근 구매 순"},
                { id: 4, name: "최근 구매 역순" },
                { id: 5, name: "남은 수강일 순" },
                { id: 6, name: "남은 수강일 역순" },
                { id: 7, name: "진도율 순" },
            ],
            // nScroll: new Animated.Value(0),
            // scroll: new Animated.Value(0),
            showModal: this.showModal.bind(this),
            closeModal: this.closeModal.bind(this),
            onLecturePressHandle: this.onLecturePressHandle.bind(this),
            toggleClassFavorite: this.toggleClassFavorite.bind(this),
            toggleClassHidden: this.toggleClassHidden.bind(this),
            updateClassList: this.updateClassList.bind(this),
            updateSelectedClassDetail: this.updateSelectedClassDetail.bind(this),
            // doExtendtakeCourse: this.doExtendtakeCourse.bind(this),
            doRetakeCourse: this.doRetakeCourse.bind(this),
            // doRetakeCourseTest: this.doRetakeCourseTest.bind(this), // TEST
            doExtendsCourse: this.doExtendsCourse.bind(this),
            goWriteReview: this.goWriteReview.bind(this),
            openApp: this.openApp.bind(this),
            startClass: this.startClass.bind(this),
        };
        this.isMount = false;
        this.targetRows = {};
        this.classCounting = 0;
        this.lastPage = 1;
        this.showDetail = this.showDetail.bind(this);
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //   console.log('nextProps : ', nextProps.myClassServiceID);
    //   console.log('nextState : ', nextState.myClassServiceID);
    //   console.log('this.props.myClassServiceID : ', this.props.myClassServiceID);
    //   return nextProps.myClassServiceID !== this.props.myClassServiceID;
    // }
    async UNSAFE_componentWillReceiveProps(nextProps) {
        // 강의실 이동 시 reload
        if (nextProps.myClassServiceID !== this.state.myClassServiceID) {
            await this.setState({
              myClassServiceID: nextProps.myClassServiceID,
              apiDomain: SERVICES[nextProps.myClassServiceID].apiDomain,
              apiKey: SERVICES[nextProps.myClassServiceID].apiKey,
            });
            await this.getClassList();
        }

        // 프리패스 강좌 신청으로 강좌 목록 변경 시
        // if (!nextProps.myClassServiceID && nextProps.myClassClassList !== this.state.classList) {
        if (!nextProps.myClassServiceID && nextProps.myClassClassList.length !== this.state.classList.length) {
            await this.setState({classList: nextProps.myClassClassList});
        }

        // 필터 값 변경 시
        if (nextProps.myClassProductFilter !== this.state.myClassProductFilter) {
            await this.setState({myClassProductFilter: nextProps.myClassProductFilter});
        }
    }

    UNSAFE_componentWillMount() {
    }

    async componentDidMount() {
        this.isMount = true;
        await this.prepareMyClassData();
        // API Data
        this.isMount && await this.getClassList();

        // Mockup Data
        // await this.setState({classList: mockClassList});

        // setTimeout(() => {
        //     this.setState({loading: false});
        //   }, 5000);
    }

    componentWillUnmount() {
        this.isMount = false;
    }
    // componentDidUpdate(prevProps) {
    //   console.log('componentDidUpdate : ', prevProps);
    // }

    // 마이클래스 데이터 준비 작업
    prepareMyClassData = async () => {
        const userInfo = await CommonUtil.getUserInfo();
        await this.setState({
            memberIdx: userInfo ? userInfo.memberIdx : 0,
            memberID: userInfo ? userInfo.memberID : '',
            apiDomain: SERVICES[this.props.myClassServiceID].apiDomain,
            apiKey: SERVICES[this.props.myClassServiceID].apiKey,
        });

        const list = JSON.parse(await AsyncStorage.getItem('favoriteClassList')) || [];
        await this.setState({favoriteClassList: list});
        const hlist = JSON.parse(await AsyncStorage.getItem('hiddenClassList')) || [];
        await this.setState({hiddenClassList: hlist});
    };

    // 강좌 목록 API 호출
    getClassList = async () => {
        this.setState({loading: true});
        const url = this.state.apiDomain + '/v1/myClass/product/' + this.state.memberIdx;
        const options = {
          method: 'GET',
          headers: {
            ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
          },
        };

        console.log('MyLectureScreen.js > getClassList()', 'url = ' + url)

        await CommonUtil.callAPI(url, options, 10000)
            .then(response => {

                //console.log('MyLectureScreen.js > getClassList()', 'response = ' + JSON.stringify(response))

                if (response && response.code === '0000') {
                    this.setState({
                        loading: false,
                        classList: response.data.classList,
                        hasFreepass: response.data.hasFreepass || false,
                        isUseFavorite: response.data.isUseFavorite || false,
                        isUseHidden: response.data.isUseHidden || false,
                        // newOrderNo: 'AB1010101',
                    });
                    this.props.updateMyClassClassList(response.data.classList);
                } else {
                    this.setState({loading: false, classList: []});
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('강좌 목록을 불러오는데 실패 했습니다.');
                        // ? Alert.alert('INFO', response.message)
                        // : Alert.alert('INFO', '로딩 실패');
                }})
            .catch(error => {
              this.setState({
                  loading: false,
                  classList: [],
              });
              // Alert.alert('Error', '시스템 에러');
              Toast.show('시스템 에러: 강좌 목록을 불러오는데 실패 했습니다.');
            });
    };

    // 상세 정보 Modal open
    showDetail = async classData => {
        console.log('MyLectureScreen.js > showDetail()', 'classData = ' + JSON.stringify(classData))

        if (this.state.lectureShow.isShow) {
            // await this.closeRow();
            this.setState({
                lectureShow: {
                    ...this.state.lectureShow,
                    memberClassIdx: 0,
                    isShow: false,
                },
            });
        }

        if(classData.productPattern === '모의고사'
            || classData.productPattern === '첨삭') {

            Alert.alert('', 'PC에서 이용 가능합니다.', [
                {text: '확인', onPress: () => {}},
            ]);
        } else if (classData.productStatus === PRODUCT_STATUS_BEFORE) {
            // 수강 예정 강좌
            this.showModal('classInfoMsg', classData);
        } else if (classData.productStatus === PRODUCT_STATUS_PAUSE) {
            // 일시 정지 강좌

            // TODO 일시 정지 > 수강 시작 처리
            Alert.alert('', '일시정지 강좌입니다.\n수강을 시작하시겠습니까?', [
                {
                    text: '확인', onPress: () => { this.restartClass({
                        memberProductIdx: classData.memberProductIdx
                    }) }
                },
                {text: '취소', onPress: () => {}}
            ], { cancelable: false });


        } else {
          // 강좌 상세 모달 열기
          if (this.state.selectedClassDetail && this.state.selectedClassDetail.memberClassIdx === classData.memberClassIdx) {
              await this.setState({selectedClass: classData});
              this.showModal('classDetail');
              return;
          } else {
              this.state.apiLoading && abortController.abort();
              await this.setState({selectedClass: classData, selectedClassDetail: null});
              this.showModal('classDetail');
          }
        }
    };

    // 필터 스크린
    goFilterScreen = () => {
        // this.props.screenProps.navigation.navigate('MyClassFilterScreen', {
        //   classList: this.state.classList,
        // });
        this.showModal('myClassFilter');
    };

    // 필터: 즐겨찾기 on/off
    toggleBtnFavorite = () => {
        this.setState({
          isFavorite: !this.state.isFavorite,
        });
    };

    // 필터: 수강상태 선택
    selectFilterClassStatus = filt => {
        if (filt.length === 0) {
            let selectedStatue = this.state.CLASS_STATUS[0].name;
            this.setState({
                checkedFilter: {
                    ...this.state.checkedFilter,
                    classStatus: selectedStatue,
                },
            });
            this.state.CLASS_STATUS[0].checked = true;
            return;
        }

        try {
            let selectedStatue = this.state.CLASS_STATUS[filt - 1].name;
            this.setState({
                checkedFilter: {
                    ...this.state.checkedFilter,
                    classStatus: selectedStatue,
                },
            });
        } catch {
            this.state.CLASS_STATUS[0].checked = true;
            // return true;
        }
    };

    // 필터 적용에 대한 결과 Boolean
    getResultByFilter = myclass => {
        // 즐겨찾기
        const isFavorite =
            (this.state.isFavorite)
                ? this.state.isUseFavorite
                    ? (myclass.isFavorite === true || parseInt(myclas.isFavorite) === 1)
                    : (myclass.memberClassIdx && this.state.favoriteClassList.indexOf(myclass.memberClassIdx) > -1)
                : false;

        // 수강 상태: 챔프 - 실서버에서 cron으로 수강상태 변경함. (테스트서버는 cron 없음)
        const filteredClassStatus = this.state.checkedFilter.classStatus;
        const isClassStatus =
            filteredClassStatus === PRODUCT_STATUS_HIDE
                ? this.state.isUseHidden
                    ? (myclass.isHidden ===  true || parseInt(myclass.isHidden) === 1)
                    : (myclass.memberClassIdx && this.state.hiddenClassList.indexOf(myclass.memberClassIdx) > -1)
                : this.state.isUseHidden
                    // ? (filteredClassStatus === myclass.productStatus && (CommonUtil.isEmpty(myclass.isHidden) || parseInt(myclass.isHidden) === 0))
                    ? ((filteredClassStatus === PRODUCT_STATUS_ING ? (myclass.productStatus === PRODUCT_STATUS_ING || myclass.productStatus === PRODUCT_STATUS_BEFORE) : filteredClassStatus === myclass.productStatus) && (CommonUtil.isEmpty(myclass.isHidden) || parseInt(myclass.isHidden) === 0))
                    : (myclass.memberClassIdx && this.state.hiddenClassList.indexOf(myclass.memberClassIdx) === -1)
        
        // 필터
        // const isFilter = this.state.checkedFilter.filter === product.productStatus;

        return this.state.isFavorite ? isFavorite : isClassStatus;
    };

    // 필터 적용 여부
    isSetFilter = () => {
        // 즐겨찾기
        const isFavorite = this.state.isFavorite;
        // 수강 상태
        const isClassStatus = this.state.checkedFilter.classStatus !== '';
        // 필터
        // const isFilter = this.state.checkedFilter.filter === product.productStatus;

        return isFavorite ? isFavorite : isClassStatus; 
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

    // 수강신청
    goApplyClass = () => {
        // classList에서 [10분의 기적] 제외 한 memberProductIdx grouping
        const products = this.state.classList.reduce((acc, curr) => {
            acc[curr.memberProductIdx] = [...acc[curr.memberProductIdx] || [], curr];
            return acc;
        }, {});
        let arr = [];
        Object.keys(products).forEach(item => {
            products[item][0].missionType !== 'challenge' &&
              (products[item][0].productPattern == '환급반' ||
                products[item][0].productPattern == '평생반' ||
                products[item][0].productPattern == '프리패스') &&
              arr.push(products[item][0]);
        });

        this.props.screenProps.navigation.navigate('ApplyClassScreen', {
            products: arr,
        });
    };

    // 수강예정 => 수강시작
    startClass = async () => {
        const isSelectedExist = !CommonUtil.isEmpty(this.state.selectedProduct);
        if (!isSelectedExist) {
            Toast.show('선택된 강좌가 없습니다.');
            return;
        }
        
        if (isSelectedExist && this.state.selectedProduct.isTakeCourseLimit === true) {
            const message = this.state.selectedProduct.takeCourseLimitMessage || '사용자가 시작할 수 없는 강좌 입니다.';
            Toast.show(message);
            return;
        }

        this.setState({loading: true});
        // const aPIsDomain = !CommonUtil.isEmpty(this.props.myInterestCodeOne) && typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        const url = SERVICES[this.props.myClassServiceID].apiDomain + '/v1/myClass/product/start/' + this.state.selectedProduct.memberProductIdx;
        const options = {
            method: 'PUT',
            headers: {
              ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
            },
        };
        await CommonUtil.callAPI(url, options)
            .then(response => {
                if (response && response.code === '0000') {
                    const arrProducts = this.state.classList;
                    let newProducts = [];
                    arrProducts.map(product => {
                        if (product.memberProductIdx === this.state.selectedProduct.memberProductIdx) {
                            product.productStatus = PRODUCT_STATUS_ING; // 수강예정
                            product.takeCourseBeginDatetime = response.data.takeCourseBeginDatetime; //moment().format('YYYY-MM-DD HH:mm:ss');
                            product.takeCourseEndDatetime = response.data.takeCourseEndDatetime;
                        }
                        newProducts.push(product);
                    });
                    this.setState({loading: false, products: newProducts});
                    this.closeModal();
                    // Alert.alert('', '수강 시작', [{text: '확인', onPress: () => this.closeModal()}]);
                } else {
                    this.setState({loading: false});
                    response.message
                        ? Alert.alert(response.message)
                        : Alert.alert('수강 시작 처리에 실패 했습니다.');
                }
            })
            .catch(error => {
                this.setState({
                    loading: false,
                });
                Alert.alert('시스템 에러: 수강 시작 처리 실패');
            });
    };

    // 일시정지 => 수강시작
    restartClass = async (data) => {
        this.setState({loading: true});

        const url = SERVICES[this.props.myClassServiceID].apiDomain + '/v1/myClass/product/start/' + data.memberProductIdx;
        const options = {
            method: 'PUT',
            headers: {
                ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
            },
        };

        await CommonUtil.callAPI(url, options)
            .then(response => {
                if (response && response.code === '0000') {
                    const arrProducts = this.state.classList;
                    let newProducts = [];
                    arrProducts.map(product => {
                        if (product.memberProductIdx === data.memberProductIdx) {
                            product.productStatus = PRODUCT_STATUS_ING;
                            product.takeCourseBeginDatetime = response.data.takeCourseBeginDatetime; //moment().format('YYYY-MM-DD HH:mm:ss');
                            product.takeCourseEndDatetime = response.data.takeCourseEndDatetime;
                        }
                        newProducts.push(product);
                    });
                    this.setState({loading: false, products: newProducts});
                } else {
                    this.setState({loading: false});
                    response.message
                        ? Alert.alert(response.message)
                        : Alert.alert('수강 재시작 처리에 실패 했습니다.');
                }
            })
            .catch(error => {
                this.setState({loading: false});
                Alert.alert('시스템 에러: 수강 재시작 처리 실패');
            });
    };

    // 강의 목록 펼치기/접기
    showLecture = async claassData => {
        if (this.state.lectureShow.isShow) {
            await this.closeRow();
            if (this.state.lectureShow.memberClassIdx === claassData.memberClassIdx) {
                this.setState({
                    // selectedClass: null,
                    lectureShow: {
                        ...this.state.lectureShow,
                        memberClassIdx: 0,
                        // selectedClass: null,
                    },
                });
                return;
            }
        }

        // 강의 목록 펼침 상태 아니고, 직전에 선택한 강좌인 경우 API 호출 없이 오픈
        if (!this.state.lectureShow.isShow) {
            if (this.state.selectedClassDetail && (this.state.selectedClassDetail.memberClassIdx === claassData.memberClassIdx)) {
                this.openRow(claassData.memberClassIdx, this.state.selectedClassDetail);
                return;
            }
        }

        this.setState({
            apiLoading: true,
            lectureLoading: true,
            selectedClass: claassData,
            lectureShow: {
                memberClassIdx: claassData.memberClassIdx,
            },
        });
        
        const param = {
            memberIdx: this.state.memberIdx,
            userId: this.state.memberID,
            os: Platform.OS.toLowerCase(),
        };


        const url = this.state.apiDomain + '/v1/myClass/classDetail/' + claassData.memberClassIdx + '?' + CommonUtil.objectToParamString(param);
        const options = {
          method: 'GET',
          headers: {
            ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
          },
        };

        console.log('MyLectureScreen.js > showLecture()', 'url = ' + url)

        await CommonUtil.callAPI(url, options, 10000)
            .then(response => {

                console.log('MyLectureScreen.js > showLecture()', 'response = ' + JSON.stringify(response))

                if (response && response.code === '0000') {
                    this.openRow(claassData.memberClassIdx, response.data.class);
                    // this.setState({apiLoading: false, lectureLoading: false});
                    this.setState({
                        apiLoading: false,
                        lectureLoading: false,
                        lectureShow: {
                            memberClassIdx: 0,
                        },
                    });
                } else {
                  // this.setState({apiLoading: false, lectureLoading: false});
                  this.setState({
                      apiLoading: false,
                      lectureLoading: false,
                      lectureShow: {
                          memberClassIdx: 0,
                      },
                  });
                  response.message
                      ? Toast.show(response.message)
                      : Toast.show('로딩 실패');
                }
            })
            .catch(error => {
                // this.setState({apiLoading: false, lectureLoading: false});
                this.setState({
                  apiLoading: false,
                  lectureLoading: false,
                  lectureShow: {
                      memberClassIdx: 0,
                  },
                });
                Toast.show('시스템 에러');
            });
    }

    // 강의 터치: 강의 재생 or 영상 2개 이상
    onLecturePressHandle = async lecture => {
        if (this.state.selectedClass.productStatus === PRODUCT_STATUS_BEFORE) {
            this.showModal('classInfoMsg', this.state.selectedClass);
            return;
        }

        if (lecture && lecture.movies.length > 1) {
            await this.setState({modalType: 'centerModal'});
            this.showModal('selectMovie', lecture);
        } else {
            // this.getPlayUrl(lecture);
            // console.log('lecture : ', lecture);
            this.openApp(lecture.lectureStreamingURL[0]);
        }
    }

    // 아쿠아 플레이어 재생에 필요한 URL 얻기
    // 강의 상세에서 얻어오는 것으로 변경해서 사용 안함
    getPlayUrl = async lecture => {
        this.setState({
            apiLoading: true,
        });
        const memberID = await CommonUtil.getMemberID();
        const classData = this.state.selectedClass;
        // const aPIsDomain = this.props.myInterestCodeOne && typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        const url = this.state.apiDomain + '/v1/myClass/lectureStreaming/' + classData.memberProductIdx + '/' + classData.memberClassIdx;
        const formData = new FormData();
        formData.append('classIdx', classData.memberClassIdx);
        formData.append('lectures', [lecture.memberLectureIdx]);
        formData.append('LmIdxs', []);
        formData.append('memberIdx', this.state.memberIdx);
        formData.append('userId', memberID);
        formData.append('os', (Platform.OS).toLowerCase());
        const options = {
            method: 'POST',
            headers: {
              ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
            },
            body: formData,
        };
        await CommonUtil.callAPI(url, options, 10000)
            .then(response => {
                if (response && response.code === '0000') {
                    // this.setState({apiLoading: false, lectureLoading: false});
                    this.setState({
                      apiLoading: false,
                    });
                    this.openApp(response.data.lectureURL);
                } else {
                    // this.setState({apiLoading: false, lectureLoading: false});
                    this.setState({
                      apiLoading: false,
                    });
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('INFO', '로딩 실패');
                }
            })
            .catch(error => {
                // this.setState({apiLoading: false, lectureLoading: false});
                this.setState({
                  apiLoading: false,
                });
                Toast.show('시스템 오류');
            });
    }

    // 강의 row 펼치기
    openRow = async (memberClassIdx, selectedClass) => {
        if (CommonUtil.isEmpty(selectedClass) || selectedClass.lectures === undefined || selectedClass.lectures.length === 0) {
            Alert.alert('', '강의가 없습니다.');
            return;
        }

        await LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        await this.setState({
            selectedClassDetail: selectedClass,
            // selectedClass: selectedClass,
            lectureShow: {
                memberClassIdx: memberClassIdx,
                // selectedClass: selectedClass,
                isShow: true,
            },
        });
    };

    // 강의 row 접기
    closeRow = async () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      await this.setState({
          lectureShow: {
              ...this.state.lectureShow,
              // memberClassIdx: 0,
              // selectedClass: null,
              isShow: false,
          },
      });
    };

    showModal = async (mode, product) => {
        await this.setState({modalContent: mode, selectedProduct: product});
        this.setState({isShowModal: true});
    };

    closeModal = () => {
        this.setState({modalContent: '', isShowModal: false, modalType: ''});
    };

    onPressTab = tabIndex => {
        this.setState({
            selectedTabIndex: tabIndex,
        });
    };

    getMissionStatusString = status => {
        switch (status) {
            case 'end':
                return '미션 종료';
            case '':
            case 'ing':
                return '미션 진행중';
            default:
                return '';
        }
    }

    // 도전 신청서 열기
    goChallengeApply = product => {
        this.setState({
            selectedChallengeProduct: product,
        });
        this.showModal('challengeApply');
    };

    // 모달 컨텐츠
    getModalContent = modalContent => {
        if (CommonUtil.isEmpty(modalContent)) {
            return;
        }

        switch (modalContent) {
            case 'attendCalendar':
                return <AttendCalendar screenState={this.state} />;
            case 'challengeCalendar':
                return <ChallengeCalendar screenState={this.state} />;
            case 'applyClass':
                return <ApplyClassList screenState={this.state} />;
            case 'challengeApply':
                return <ChallengeApplyScreen screenState={this.state} />;
            case 'classDetail':
                return <ClassDetailScreen screenState={this.state} closePressHandle={this.closeModal} navigation={this.props.screenProps.navigation} />;
            case 'selectMovie':
                return <ModalSelectMovie screenState={this.state} closePressHandle={this.closeModal} />;
            case 'myClassFilter':
                return <MyClassFilterScreen screenState={this.state} fromScreen="MyLectureScreen" />;
            case 'classInfoMsg':
                return <ModalClassInfoMsg screenState={this.state} />;
        }
    };

    // 모달 컨텐츠에 따라 swipeable modal 상단 닫기 영역 ui 다르게하기
    isSwipeableModal = () => {
        const swipeableModalContent = ['attendCalendar', 'challengeCalendar', 'applyClass', 'classDetail', 'classInfoMsg'];
        return swipeableModalContent.indexOf(this.state.modalContent) > -1;
    };

    // 강의 리스트 정렬: 오름, 내림차순 반환
    getSortValue = (val1, val2, order, valType) => {
        if (val1 === null) {
            return 1;
        } else if (val2 === null) {
            return -1;
        }
        let value1 = val1;
        let value2 = val2;
        if (valType === 'date') {
            value1 = moment(val1).format('X');
            value2 = moment(val2).format('X');
        }
        if (value1 === value2) {
            return 0;
        } else if ((order === 'asc' && value1 > value2) || (order === 'desc' && value1 < value2)) {
            return 1;
        } else if ((order === 'asc' && value1 < value2) || (order === 'desc' && value1 > value2)) {
            return -1;
        }
    };

    // swipe open action
    swipeOpenedAction = async classData => {
        // const swipeOpenedList = [...this.state.swipeOpenedList];
        // const index = swipeOpenedList.indexOf(classData.memberClassIdx);
        // index === -1 && swipeOpenedList.push(classData.memberClassIdx);
        if (this.state.swipeOpenedList[0] && this.state.swipeOpenedList[0] !== classData.memberClassIdx) {
            this.targetRows[this.state.swipeOpenedList[0]].closeRow();
        }
        const swipeOpenedList = [classData.memberClassIdx];
        this.setState({swipeOpenedList: swipeOpenedList});
    };

    // swipe close action
    swipeClosedAction = async classData => {
        // const swipeOpenedList = [...this.state.swipeOpenedList];
        // const index = swipeOpenedList.indexOf(classData.memberClassIdx);
        // index > -1 && swipeOpenedList.splice(index, 1);
        // this.setState({swipeOpenedList: swipeOpenedList});
        this.setState({swipeOpenedList: []});
    };

    // 강좌 즐겨찾기 toggle
    toggleClassFavorite = async classData => {
        if (this.state.isUseFavorite) {
            this.targetRows[classData.memberClassIdx].closeRow();
            this.setState({apiLoading: true});
            const newFavorite = CommonUtil.isEmpty(classData.isFavorite) || !classData.isFavorite ? 1 : 0;
            const url = this.state.apiDomain + '/v1/myClass/product/' + this.state.memberIdx + '/favorite/' + newFavorite;
            const params = {productIdx: classData.memberClassIdx};
            const bodyData = CommonUtil.objectToParamString(params);
            const options = {
              method: 'PUT',
              headers: {
                ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
              },
              body: bodyData,
            };
            await CommonUtil.callAPI(url, options, 10000)
                .then(response => {
                    if (response && response.code === '0000') {
                        const newClassList = [...this.state.classList];
                        newClassList.map(item => {
                          if (parseInt(item.memberClassIdx) === parseInt(classData.memberClassIdx)) {
                              return item.isFavorite= newFavorite;
                          }
                        });
                        this.setState({apiLoading: false, classList: newClassList});
                    } else {
                        this.setState({apiLoading: false});
                        response.message
                            ? Toast.show(response.message)
                            : Toast.show('강좌 즐겨찾기 실패');
                    }
                })
                .catch(error => {
                    this.setState({apiLoading: false});
                    Toast.show('강좌 즐겨찾기: 시스템 에러');
                });
        } else {
            const favoriteClassList = [...this.state.favoriteClassList];
            const index = favoriteClassList.indexOf(classData.memberClassIdx);

            this.targetRows[classData.memberClassIdx].closeRow();

            index > -1
                ? favoriteClassList.splice(index, 1)
                : favoriteClassList.push(classData.memberClassIdx);

            await AsyncStorage.setItem('favoriteClassList', JSON.stringify(favoriteClassList));
            this.setState({favoriteClassList: favoriteClassList});
        }
    };

    // 강좌 숨기기 toggle
    toggleClassHidden = async classData => {
        if (this.state.isUseHidden) {
            this.targetRows[classData.memberClassIdx].closeRow();
            this.setState({apiLoading: true});
            const newHidden = CommonUtil.isEmpty(classData.isHidden) || parseInt(classData.isHidden) === 0 ? 1 : 0;
            const url = this.state.apiDomain + '/v1/myClass/product/' + this.state.memberIdx + '/hidden/' + newHidden;
            const params = {productIdx: classData.memberClassIdx};
            const bodyData = CommonUtil.objectToParamString(params);
            const options = {
              method: 'PUT',
              headers: {
                ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
              },
              body: bodyData,
            };
            await CommonUtil.callAPI(url, options, 10000)
                .then(response => {
                    if (response && response.code === '0000') {
                        const newClassList = [...this.state.classList];
                        newClassList.map(item => {
                          if (parseInt(item.memberClassIdx) === parseInt(classData.memberClassIdx)) {
                              return item.isHidden = newHidden;
                          }
                        });
                        this.setState({apiLoading: false, classList: newClassList});
                    } else {
                        this.setState({apiLoading: false});
                        response.message
                            ? Toast.show(response.message)
                            : Toast.show('강좌 숨김처리 실패');
                    }
                })
                .catch(error => {
                    this.setState({apiLoading: false});
                    Toast.show('강좌 숨김: 시스템 에러');
                });
        } else {
            const hiddenClassList = [...this.state.hiddenClassList];
            const index = hiddenClassList.indexOf(classData.memberClassIdx);

            this.targetRows[classData.memberClassIdx].closeRow();

            index > -1
                ? hiddenClassList.splice(index, 1)
                : hiddenClassList.push(classData.memberClassIdx);

            await AsyncStorage.setItem('hiddenClassList', JSON.stringify(hiddenClassList));
            this.setState({hiddenClassList: hiddenClassList});
        }
    };

    // 선택된 필터 개별 삭제
    removeFilter = async (filter, type) => {
        const arrFilter = this.state.myClassProductFilter;
        const index = arrFilter[type].indexOf(filter);
        arrFilter[type].splice(index, 1);
        await this.setState({myClassProductFilter: arrFilter});
        this.props.updateMyClassProdcutFilter(arrFilter);
    };

    // 10분의 기적 미션 상태 체크
    // 미션상태 
    // - 도전신청서 작성 전: 도전 신청서 작성 isChallengeApply, challengeStartDatetime
    // - 도전 신청서 제출 후 바로 시작 (버튼 명 : 미션 진행 중), “tool tip : 100일 중 n일차 도전 중입니다.” 
    // - 도전 신청서 제출 후 1일 후 시작 (버튼 명 : 미션 대기), “tool tip : 1일 후 도전이 시작됩니다.”
    // - 도전 성공 (버튼 명 : 도전 성공), “tool tip : 환급신청이 가능합니다.”
    // - 도전 실패 (버튼 명: 도전 실패), 
    //   : 재도전이 가능한 경우(남은 수강 기간이 110일 이상인 경우) : tap > “confirm : 재도전 신청” 출력
    //   : 재도전이 불가능한 경우(남은 수강 기간이 110일 미만이거나, 재도전 횟수를 초과한 경우)
    //   : tap > “tool tip : 도전에 실패했습니다. 남은 수강 기간이 부족해 재도전하실 수 없습니다.”
    // - 재도전 심사 중 (버튼 명: 재도전 심사 중) : tap > “tool tip : 재도전 심사 중입니다.” 

    // 미션 버튼 press action
    onMissionButtonPress = product => {
        const status = this.getChallengeStatus(product);
        if (status === '도전 신청서 작성') {
            this.goChallengeApply(product);
        } else if (status === '미션 대기') {
            this.showTooltip('1일 후 도전이 시작됩니다.');
        } else if (status === '미션 진행 중') {
            const diff = moment().diff(moment(product.challengeStartDatetime), 'days') + 1;
            this.showTooltip(product.challengeConditionDays + '일 중 '+diff+'일차 도전 중입니다.');
        } else if (status === '도전 성공') { 
            this.showTooltip('환급신청이 가능합니다.');
        } else if (status === '도전 실패') {
          const remainDays = moment(product.takeCourseEndDatetime).diff(moment(), 'days') + 1;
          const retryCount = product.challengeRetryCount || 0;
          const retryLimitCount = product.challengeRetryLimitCount || 1;
          if (remainDays < product.challengeConditionDays || retryCount >= retryLimitCount) {
              this.showTooltip('도전에 실패했습니다.\n남은 수강 기간이 부족해 재도전하실 수 없습니다.');
          } else {
              Alert.alert('', '재도전 신청', [
                {text: '확인', onPress: () => {this.goChallengeApply(product)}},
                {text: '취소', onPress: () => {}}
              ], { cancelable: false });
          }
        } else if (status === '재도전 심사 중') {
            this.showTooltip('재도전 심사 중');
        }
    };

    // 도전 미션 상태 체크
    getChallengeStatus = product => {
        if (!product.isChallengeApply) {
            return '도전 신청서 작성';
        } else {
            const todayTimestamp = moment([moment().year(), moment().month(), moment().date(), '00', '00', '00']).format('X');
            const startTimestamp = moment([moment(product.challengeStartDatetime).year(), moment(product.challengeStartDatetime).month(), moment(product.challengeStartDatetime).date(), '00', '00', '00']).format('X');
            if (!CommonUtil.isEmpty(product.challengeStartDatetime) && (todayTimestamp < startTimestamp)) {
                return '미션 대기';
            } else if ((CommonUtil.isEmpty(product.missionStatus) || product.missionStatus < 1) && product.isChallengeApply && todayTimestamp >= startTimestamp) {
                return '미션 진행 중';
            } else if (!CommonUtil.isEmpty(product.missionStatus) && product.missionStatus.toString() === '1') {
                return '도전 성공';
            } else if (!CommonUtil.isEmpty(product.missionStatus) && product.missionStatus.toString() === '2') {
                return '도전 실패';
            } else if (!CommonUtil.isEmpty(product.missionStatus) && product.missionStatus.toString() === '3') {
                return '재도전 심사 중';
            }
        }
    };

    // 도전 메세지: 툴팁 보였다 사라지기
    showTooltip = async msg => {
        await this.setState({
            challengeTootipIsShow: true,
            challengeTootipMsg: msg,
        });
        setTimeout(() => {
            this.setState({challengeTootipIsShow: false});
        }, 3000);
    };

    // 도전 신청 완료 후 10분의 기적 상품 정보 update, 부가기능에서 강좌정보 변경 시 업데이트
    updateClassList = classList => {
        this.setState({
            classList: classList,
        });
    };

    // 강좌 상세 정보 로딩 시 저장
    updateSelectedClassDetail = classDetailData => {
        this.setState({
            selectedClassDetail: classDetailData,
        });
    };

    // 재수강 결제
    doRetakeCourse = async () => {
        if (CommonUtil.isEmpty(this.state.selectedClass)) {
            Alert.alert('', '선택된 강좌가 없습니다.');
            return;
        }

        const {selectedClass} = this.state;

        let productIdxArray = [{
            memberProductIdx: selectedClass.memberProductIdx,
            extendsDay: 0,
            optionList: [],
            productIdx: selectedClass.productIdx,
            productType: 'lecture',
            eventcode: '',
        }];
        // productIdxArray.push({productIdx: this.state.selectedClass.productIdx});
        
        // const memberIdx = await CommonUtil.getMemberIdx(); //5104881;
        const formData = new FormData();
        formData.append('orderType', 'lecture');
        formData.append('memberIdx', this.state.memberIdx);
        formData.append('paymentStatus', 1);
        formData.append('productList', JSON.stringify(productIdxArray));
        formData.append('memberProductIdx', selectedClass.memberProductIdx);
        // formData.append('selectedOption', null);
        // formData.append('paymentMethod', '');
        // formData.append('productType', '');
        // formData.append('eventCode', '');

        // const aPIsDomain = this.props.myInterestCodeOne && typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        const url = this.state.apiDomain + '/v1/payment/orderNo/' + this.state.memberIdx;

        console.log('MyLectureScreen.js > doRetakeCourse()', 'url = ' + url)
        console.log('MyLectureScreen.js > doRetakeCourse()', 'formData = ' + JSON.stringify(formData))

        await CommonUtil.callAPI(
            url,
            {
                method: 'POST',
                headers: new Headers({
                  ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
                }),
                body: formData,
            },
            10000,
        )
            .then(response => {

                console.log('MyLectureScreen.js > doRetakeCourse()', 'response = ' + JSON.stringify(response))

                if (response && typeof response === 'object' || Array.isArray(response) === false) {
                  if ( response.code !== '0000' ) {
                      response.message
                          ? CommonFunction.fn_call_toast(response.message, 1000) //setTimeout(() => {Alert.alert('', response.message);}, 1000)
                          : this.failCallAPi();
                  } else {
                      if (response.data.orderNo) {
                          const retakeProduct = {
                              // ...selectedClass,
                              title: '[재수강] ' + selectedClass.className,
                              originalPrice: selectedClass.originalPrice,
                              price: selectedClass.retakePrice,
                          };
                          let productDataArray = [{
                              memberProductIdx: selectedClass.memberProductIdx,
                              extendsDay: 0,
                              optionList: [],
                              freeOptionList: [],
                              productData: retakeProduct,
                              basePrice: retakeProduct.originalPrice,
                              discountAmount: 0,
                              paymentAmount: retakeProduct.price,
                              productType: '',
                              eventcode: '',
                          }];
                          this.props.screenProps.navigation.navigate('LectureSettleInputScreen', {
                              productType: 'lecture',
                              productList: productDataArray,
                              checkCartList: [],
                              optionSumPrice: 0,
                              isDeliveryPrice: 0,
                              orderNo: response.data.orderNo,
                              isRepeatLecture: true,
                              myClassApiDomain: this.state.apiDomain,
                              myClassApiKey: this.state.apiKey,
                          });
                      } else {
                            let message = '일시적 오류가 발생하였습니다.\n 잠시후 이용해 주세요';
                            let timesecond = 2000;
                            CommonFunction.fn_call_toast(message, timesecond);
                            // setTimeout(() => {
                            //   Alert.alert('', message);
                            // }, timesecond);
                        }
                    }
                } else {
                    this.failCallAPi();
                }
            })
            .catch(err => {
                console.log('requestOrderNo error => ', err);
                this.failCallAPi();
            });
    };

    // 수강연장 결제
    doExtendsCourse = async selectedExtendsProduct => {
      if (CommonUtil.isEmpty(this.state.selectedClass)) {
          Alert.alert('', '선택된 강좌가 없습니다.');
          return;
      }

      const {selectedClass} = this.state;

      let productIdxArray = [{
        memberProductIdx: selectedClass.memberProductIdx,
        memberClassIdx: selectedClass.memberClassIdx,
        extendsDay: selectedExtendsProduct.extendDay,
        extendsCnt: selectedExtendsProduct.extendCnt,
        optionList: [],
        productIdx: selectedClass.productIdx,
        productType: 'lecture',
        eventCode: selectedClass.eventCode || '',
    }];
    const formData = new FormData();
    formData.append('memberIdx', this.state.memberIdx);
    formData.append('paymentStatus', 1);
    formData.append('paymentMethod', ''); // 확인 필요
    formData.append('orderType', 'lecture');
    formData.append('extendType', 'extend');
    formData.append('productList', JSON.stringify(productIdxArray));

    const url = this.state.apiDomain + '/v1/payment/orderNo/' + this.state.memberIdx;

    const options = {
        method: 'POST',
        headers: {
            ApiKey: SERVICES[this.props.myClassServiceID].apiKey,
        },
        body: formData,
    };
    CommonUtil.callAPI(url, options, 10000)
        .then(response => {
            if (response && typeof response === 'object' || Array.isArray(response) === false) {
                if ( response.code !== '0000' ) {
                    response.message
                        ? Alert.alert('', response.message)
                        : Alert.alert('', '수강연장 상품 주문 등록 실패');
                } else {
                    if (response.data.orderNo) {
                        const extendsProduct = {
                            // ...selectedClass,
                            title: '[수강연장] ' + selectedClass.className,
                            originalPrice: selectedExtendsProduct.price,
                            price: selectedExtendsProduct.price,
                        };
                        let productDataArray = [{
                            memberProductIdx: selectedClass.memberProductIdx,
                            extendsDay: selectedExtendsProduct.extendDay,
                            optionList: [],
                            freeOptionList: [],
                            productData: extendsProduct,
                            basePrice: selectedExtendsProduct.price,
                            discountAmount: 0,
                            paymentAmount: selectedExtendsProduct.price,
                            productType: 'lecture',
                            eventcode: selectedClass.eventCode || '',
                        }];
                        this.props.screenProps.navigation.navigate('LectureSettleInputScreen', {
                            productType: 'lecture',
                            productList: productDataArray,
                            checkCartList: [],
                            optionSumPrice: 0,
                            isDeliveryPrice: 0,
                            orderNo: response.data.orderNo,
                            isRepeatLecture: true,
                            myClassApiDomain: this.state.apiDomain,
                            myClassApiKey: this.state.apiKey,
                        });
                    } else {
                        Alert.alert('', '일시적 오류가 발생하였습니다.\n 잠시후 이용해 주세요');
                    }
                }
            }
        })
        .catch(err => {
            console.log('requestOrderNo error => ', err);
            Alert.alert('', '데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요');
        });
    };
    
    failCallAPi = () => {
        let message = "데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFunction.fn_call_toast(message, timesecond);
        // setTimeout(() => {
        //   Alert.alert('', message);
        // }, timesecond);
    };

    // 수강후기 작성
    goWriteReview = () => {
      this.props.screenProps.navigation.navigate('LectureWriteForm', {
        reviewData: {
          classIdx: this.state.selectedClass.classIdx,
          className: this.state.selectedClass.className,
          teacherName: this.state.selectedClass.teacherName,
          starScore: null,
          title: null,
          content: null,
        }
      });
    };

    // 아쿠아 앱 오픈
    openApp = url => {
        CommonUtil.openApp(url, '', DEFAULT_CONSTANTS.aquaPlayerAppStoreId, 'KO', DEFAULT_CONSTANTS.aquaPlayerAppStoreId);
    };

    // 필터 적용 강좌 목록
    getFilteredClassList = () => {
      const {myClassProductFilter} = this.state;
      const isFilterProductPattern = myClassProductFilter.selectedProductPattern && myClassProductFilter.selectedProductPattern.length > 0;
      const isFilterSelectedLevel03 = myClassProductFilter.selectedLevel03 && myClassProductFilter.selectedLevel03.length > 0;
      const isFilterSelectedLevel04 = myClassProductFilter.selectedLevel04 && myClassProductFilter.selectedLevel04.length > 0;
      const isFilterSelectedDifficulty = myClassProductFilter.selectedDifficulty && myClassProductFilter.selectedDifficulty.length > 0;
      const isFilterTeacher = myClassProductFilter.selectedTeacher && myClassProductFilter.selectedTeacher.length > 0;
      const isFilterYear = myClassProductFilter.selectedYear && myClassProductFilter.selectedYear.length > 0;

      const myclassList = this.state.classList
        ? this.state.classList
            .filter((item, key) => {
              // return key < 5;
              return item.missionType !== 'challenge';
              // return this.state.isFavorite ? item.missionType : item.missionType !== 'challenge';
            })
            .filter(item => {
              return myClassProductFilter.selectedProductPattern &&
                isFilterProductPattern
                ? myClassProductFilter.selectedProductPattern.indexOf(item.productPattern) > -1
                : true;
            })
            .filter(item => {
              const arrTeacherIdx = item.teachers && item.teachers.map(teacher => teacher.teacherIdx) || [];
              const teacherFlag = isFilterTeacher ? myClassProductFilter.selectedTeacher.some(filterItem => arrTeacherIdx.indexOf(filterItem) > -1) : true;
              return (
                (isFilterSelectedLevel03
                  ? myClassProductFilter.selectedLevel03.indexOf(item.level03) > -1
                  : true) &&
                (isFilterSelectedLevel04
                  ? myClassProductFilter.selectedLevel04.indexOf(item.level04) > -1
                  : true) &&
                (isFilterSelectedDifficulty
                  ? myClassProductFilter.selectedDifficulty.indexOf(item.difficulty) > -1
                  : true) &&
                (isFilterTeacher
                  ? teacherFlag
                  : true) &&
                (isFilterYear
                  ? myClassProductFilter.selectedYear.indexOf(item.year) > -1
                  : true)
              );
            })
        : [];
            // console.log('// TEST:: myclassList : ', myclassList);
      // myclassList.map((myclass, index) => {
      //   console.log(index, myclass.productName, myclass.productPattern, myclass.productStatus, myclass.lastOpenDatetime, myclass.purchaseDatetime, myclass.takeCourseEndDatetime);
      // });

      // return this.isSetFilter()
      //   ? myclassList.map((myclass, index) => {
      //     // console.log(index, myclass.productName, myclass.productPattern, myclass.productStatus, myclass.lastOpenDatetime, myclass.purchaseDatetime, myclass.takeCourseEndDatetime);
      //       // return this.getResultByFilter(myclass) && myclass;
      //       if (this.getResultByFilter(myclass)) {
      //         return myclass;
      //       }
      //     })
      //     .filter(item => item !== undefined)
      //   : myclassList.map((myclass, index) => {
      //       return myclass;
      //     });

      return this.isSetFilter()
        ? myclassList.filter(myclass => myclass !== undefined && this.getResultByFilter(myclass))
        : myclassList;
    };

    // 강좌 리스트 아이템 Component
    listItem = (myclass, index) => {
        // TEST:: 테스트 강좌만 노출
        // // 챔프
        // const test1 = ['1437956976','1437956977','1437956980','1437956981','1437956971']; // 6000434
        // const test2 = ['1432863515','1432863517','1432863436']; // 5104881
        // // 임용
        // const test3 = ['246224', '999998', '999999', '1077413', '1102234', '1335555']; // 1307399
        // const test4 = ['1198017', '1205729', '1205746', '1121390', '1182638']; // 2014896
        // const arr = {
        //   "6000434": test1,
        //   "5104881": test2,
        //   "1307399": test3,
        //   "2014896": test4,
        // };
        // const test = arr[this.state.memberIdx];
        // if (test.indexOf(myclass.memberClassIdx) === -1) {
        //     return;
        // }

        this.classCounting++;
        return (
            <View key={'listItem_'+index}>
                <SwipeRow
                    ref={ref => (this.targetRows[myclass.memberClassIdx] = ref)}
                    disableLeftSwipe={false}
                    disableRightSwipe={true}
                    closeOnRowPress={true}
                    leftOpenValue={COUNT_LEFT_SWIPE_BUTTON * WIDTH_LEFT_SWIPE_BUTTON}
                    rightOpenValue={-(COUNT_RIGHT_SWIPE_BUTTON * WIDTH_RIGHT_SWIPE_BUTTON)}
                    onRowOpen={() => this.swipeOpenedAction(myclass)}
                    onRowClose={() => this.swipeClosedAction(myclass)}>
                      <RightSwipeButton screenState={this.state} classData={myclass} />
                    <RenderItem
                        state={this.state}
                        classData={myclass}
                        onRowPress={classData => this.showDetail(classData)}
                        onShowLecture={classData => this.showLecture(classData)}
                    />
                </SwipeRow>
                <LectureItem screenState={this.state} classData={myclass} />
                {/* <Text>index: {index} : {myclass.productName}</Text>
                <Text>유형: {myclass.productPattern}</Text>
                <Text>상태: {myclass.productStatus}</Text>
                <Text>수강일: {myclass.lastOpenDatetime}</Text>
                <Text>구매일: {myclass.purchaseDatetime}</Text>
                <Text>남은수강일: {myclass.takeCourseEndDatetime}</Text> */}
            </View>
        );
    };

    // 즐겨찾기 강좌 없음 Component
    noFavorite = () => {
        return (
            <View style={{width: '100%', height: SCREEN_HEIGHT * 0.5, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={require('../../../assets/icons/icon_none_favorite.png')} style={{width: 65, height: 65, marginBottom: 15}} />
                <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14), letterSpacing: -0.7}}>아직 즐겨찾기 강의가 없어요.{'\n'}즐겨찾기 강의를 추가해주세요</CustomTextR>
            </View>
        );
    };

    // 검색된 강좌 없음 컴포넌트: 수강 중인 강좌가 없습니다.
    noClassListResult = () => {
        return (
            <View style={{width: '100%', height: SCREEN_HEIGHT * 0.4, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={require('../../../assets/icons/icon_none_exclamation.png')} style={{width: 65, height: 65, marginBottom: 15}} />
                <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14), letterSpacing: -0.7}}>검색된 강좌가 없습니다</CustomTextR>
            </View>);
    };

    // 필터적용 강좌 목록에 대해 정렬 적용된 강좌 목록 결과
    classListResult = filteredClassList => {
        const paginate = 10;
        const endIndex = this.state.currentPage * paginate;
        this.lastPage = Math.ceil(filteredClassList.length / paginate);
        this.classCounting = 0;

        const result =
          filteredClassList &&
          filteredClassList.sort((a, b) => {
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
                        return this.getSortValue((a.openedCount/a.lectureCount), (b.openedCount/b.lectureCount), 'desc', 'number');
                        // return this.getSortValue(a.progressRatio, b.progressRatio, 'desc', 'date');
                    default:
                        return 0;
                }
            })
                .map((myclass, index) => {
                    return this.listItem(myclass, index);
                    // return this.isSetFilter()
                    //   ? this.getResultByFilter(myclass) && this.listItem(myclass, index)
                    //   : this.listItem(myclass, index);
                })
                .filter((item, index) => {
                    return (index >= 0 && index < endIndex);
                });

        if (this.classCounting === 0) {
            return this.state.isFavorite
                ? this.noFavorite()
                : this.noClassListResult();
        } else {
            return result;
        }
    };

    moreLoading = () => {
        this.setState({
            currentPage: this.state.currentPage + 1,
        });
    };

    // gnb메뉴에서 추천강좌탭 메뉴 index 얻기
    getGnbLectureMenu = async () => {
        const res = await AsyncStorage.getItem('myGnbMenu');
        const menu = JSON.parse(res);
        const os = Platform.OS === 'ios' ? 'iOS' : 'Android';
        const gnbMenu = menu[os];
        const index = gnbMenu.findIndex(item => item.depth1Code === '001');
        return index > -1 ? index : 0;
    };

    // 메인화면으로 이동하면서 추천 강좌탭으로 변경
    goMainAndMoveTab = async () => {
      const tabIndex = await this.getGnbLectureMenu();
      this.props.screenProps.navigation.navigate('MainTopTabs', {moveTopTabIndex: tabIndex});
    };
    
    render() {
        // 수강중 강좌 없음 컴포넌트: 수강 중인 강좌가 없습니다.
        const noClassLis = () => {
            const viewHeight = SCREEN_HEIGHT - HEAHER_HEIGHT - 60;
            return (
                // <View style={{width: '100%', height: SCREEN_HEIGHT * 0.4, justifyContent: 'center', alignItems: 'center', borderWidth: 1}}>
                <View style={{width: '100%', height: Platform.OS === 'ios' ? viewHeight : viewHeight - 20}}>
                    <View style={{justifyContent: 'center', alignItems: 'center', height: SCREEN_HEIGHT * 0.4}}>
                      <Image source={require('../../../assets/icons/icon_none_exclamation.png')} style={{width: 65, height: 65, marginBottom: 15}} />
                      <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14), letterSpacing: -0.7}}>수강 중인 강좌가 없습니다</CustomTextR>
                    </View>
                    <TouchableOpacity 
                        style={{position: 'absolute', bottom: 20, left: 20, right: 20, height: 45, borderRadius: 4, backgroundColor: DEFAULT_COLOR.lecture_base, justifyContent: 'center', alignItems: 'center'}}
                        onPress={() => this.goMainAndMoveTab()}>
                        <CustomTextM style={{fontWeight: '500', letterSpacing: -0.84, color: '#fff', fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}>추천 강좌 보러 가기</CustomTextM>
                    </TouchableOpacity>
                </View>
            );
        };

        if (this.state.loading === true) {
            return (<View style={MyClassStyles.IndicatorContainer}><ActivityIndicator size="large" /></View>);
        } else if (this.state.loading === false && (this.state.classList && this.state.classList.length === 0)) {
            return noClassLis();
        } else {
            const challengeProduct = this.state.classList ? this.state.classList.find(element => { return element.missionType === 'challenge' }) : {};
            const myClassProductFilter = this.state.myClassProductFilter; //this.props;
            const isFilterProductPattern = !CommonUtil.isEmpty(myClassProductFilter) && myClassProductFilter.selectedProductPattern && myClassProductFilter.selectedProductPattern.length > 0;
            const isFilterSelectedLevel03 = myClassProductFilter.selectedLevel03 && myClassProductFilter.selectedLevel03.length > 0;
            const isFilterSelectedLevel04 = myClassProductFilter.selectedLevel04 && myClassProductFilter.selectedLevel04.length > 0;
            const isFilterSelectedDifficulty = myClassProductFilter.selectedDifficulty && myClassProductFilter.selectedDifficulty.length > 0;
            const isFilterTeacher = myClassProductFilter.selectedTeacher && myClassProductFilter.selectedTeacher.length > 0;
            const isFilterYear = myClassProductFilter.selectedYear && myClassProductFilter.selectedYear.length > 0;

            // 필터 적용된 강좌 목록 생성
            const filteredClassList = this.getFilteredClassList();
            // console.log('// TEST:: filteredClassList : ', filteredClassList);
            return (
                <View style={styles.container}>
                  <View style={{flex: 1, width: '100%'}}>
                    <View style={styles.topButtonSection}>
                      {/* 필터 영역 */}
                      <View style={[styles.flexDirCol]}>
                        <View style={[styles.flexDirRow, styles.topFilterSection]}>
                          {(!this.state.isFavorite) ? (
                              <View style={[styles.flexDirRow, {alignItems: 'center'}]}>
                                  {/* 정렬 */}
                                  <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 20}}>
                                    <Select2MyClass
                                      isSelectSingle
                                      style={{}}
                                      selectedTitleStyle={styles.selectedFilterText}
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
                                      onRemoveItem={data => {
                                          // this.state.SORT_TYPE[0].checked = true;
                                      }}
                                    />
                                    <Icon
                                      name="caret-down"
                                      size={Platform.OS === 'ios' ? PixelRatio.roundToNearestPixel(20) : PixelRatio.roundToNearestPixel(15)}
                                      color="#cbcccb"
                                      style={{marginLeft: 3}}
                                    />
                                  </View>

                                  {/* 수강 상태 */}
                                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                      <Select2MyClass
                                        isSelectSingle
                                        selectedTitleStyle={styles.selectedFilterText}
                                        showSearchBox={false}
                                        colorTheme={COMMON_STATES.baseColor}
                                        popupTitle="수강 상태를 선택해주세요"
                                        title="수강 상태"
                                        cancelButtonText="취소"
                                        selectButtonText="선택"
                                        searchPlaceHolderText="검색어를 입력하세요"
                                        listEmptyTitle="일치하는 결과가 없습니다"
                                        data={this.state.CLASS_STATUS}
                                        onSelect={data => {
                                          this.selectFilterClassStatus(data);
                                        }}
                                        onRemoveItem={data => {
                                          // this.state.CLASS_STATUS[0].checked = true;
                                        }}
                                      />
                                      <Icon
                                        name="caret-down"
                                        size={Platform.OS === 'ios' ? PixelRatio.roundToNearestPixel(20) : PixelRatio.roundToNearestPixel(15)}
                                        color="#cbcccb"
                                        style={{marginLeft: 3}}
                                      />
                                  </View>
                                  {/* <View style={styles.spaceWidth5}></View> */}
                              </View>
                          ) : (
                              <View style={[styles.flexDirRow, {alignItems: 'center'}]}></View>
                          )}

                          <View style={[styles.flexDirRow, {alignItems: 'center', paddingVertical: 10}]}>
                            {/* 필터 */}
                            {(!this.state.isFavorite) && (
                              <View style={[styles.flexDirRow, {alignItems: 'center'}]}>
                                {(this.state.classList && this.state.classList.length > 0) && (
                                  <TouchableOpacity style={{paddingHorizontal: 15, paddingVertical: 7, borderRadius: 4, borderWidth: 1, borderColor: '#d8d8d8'}} onPress={() => this.goFilterScreen()}>
                                    <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14), color: '#444444', letterSpacing: -0.7}}>필터</CustomTextR>
                                  </TouchableOpacity>
                                )}
                                <View style={[styles.spaceWidth5, {borderRightWidth: 1, height: 20, borderColor: '#cccccc', marginLeft: 15}]}></View>
                              </View>
                            )}
                            {/* 즐겨찾기 */}
                            <TouchableOpacity
                                onPress={() => this.toggleBtnFavorite()}
                                style={MyClassStyles.btnFavoriteStar}>
                                <Image source={this.state.isFavorite ? require('../../../assets/icons/btn_view_favorite_on.png') : require('../../../assets/icons/btn_view_favorite_off.png')} style={{width: 55, height: 50}} />
                            </TouchableOpacity>
                          </View>
                        </View>
                        {(isFilterProductPattern || isFilterSelectedLevel03 || isFilterSelectedLevel04 || isFilterSelectedDifficulty || isFilterTeacher || isFilterYear) && (
                          <View style={styles.filterResultSection}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                              {myClassProductFilter.selectedProductPattern &&
                                myClassProductFilter.selectedProductPattern.map((item, key) => {
                                  return <TouchableOpacity style={styles.btnBorderedFilter} onPress={() => this.removeFilter(item, 'selectedProductPattern')} key={'productPattern_'+key}><Text style={styles.borderedFilterText}>{item}</Text><Image source={require('../../../assets/icons/btn_del_keyword.png')} style={styles.delKeyword} /></TouchableOpacity>;
                                })}
                              {myClassProductFilter.selectedLevel03 &&
                                myClassProductFilter.selectedLevel03.map((item, key) => {
                                  return <TouchableOpacity style={styles.btnBorderedFilter} onPress={() => this.removeFilter(item, 'selectedLevel03')} key={'level03_'+key}><Text style={styles.borderedFilterText}>{myClassProductFilter.filterTable.level03.find(element => element.Code === item).Name}</Text><Image source={require('../../../assets/icons/btn_del_keyword.png')} style={styles.delKeyword} /></TouchableOpacity>;
                                })}
                              {myClassProductFilter.selectedLevel04 &&
                                myClassProductFilter.selectedLevel04.map((item, key) => {
                                  return <TouchableOpacity style={styles.btnBorderedFilter} onPress={() => this.removeFilter(item, 'selectedLevel04')} key={'level04_'+key}><Text style={styles.borderedFilterText}>{myClassProductFilter.filterTable.level04.find(element => element.Code === item).Name}</Text><Image source={require('../../../assets/icons/btn_del_keyword.png')} style={styles.delKeyword} /></TouchableOpacity>;
                                })}
                              {myClassProductFilter.selectedDifficulty &&
                                myClassProductFilter.selectedDifficulty.map((item, key) => {
                                  return <TouchableOpacity style={styles.btnBorderedFilter} onPress={() => this.removeFilter(item, 'selectedDifficulty')} key={'difficulty_'+key}><Text style={styles.borderedFilterText}>{myClassProductFilter.filterTable.difficulty.find(element => element.Code === item).Name}</Text><Image source={require('../../../assets/icons/btn_del_keyword.png')} style={styles.delKeyword} /></TouchableOpacity>;
                                })}
                              {myClassProductFilter.selectedTeacher &&
                                myClassProductFilter.selectedTeacher.map((item, key) => {
                                  return (
                                    <TouchableOpacity 
                                      style={styles.btnBorderedFilter} 
                                      onPress={() => this.removeFilter(item, 'selectedTeacher')} 
                                      key={'teacher_'+key}>
                                        <Text style={styles.borderedFilterText}>
                                          {myClassProductFilter.filterTable.teachers.find(element => element.Code === item).Name}
                                        </Text>
                                        <Image source={require('../../../assets/icons/btn_del_keyword.png')} style={styles.delKeyword} />
                                    </TouchableOpacity>
                                  );
                                })}
                              {myClassProductFilter.selectedYear &&
                                myClassProductFilter.selectedYear.map((item, key) => {
                                  return <TouchableOpacity style={styles.btnBorderedFilter} onPress={() => this.removeFilter(item, 'selectedYear')} key={'year_'+key}><Text style={styles.borderedFilterText}>{myClassProductFilter.filterTable.year.find(element => element.Code === item).Name}</Text><Image source={require('../../../assets/icons/btn_del_keyword.png')} style={styles.delKeyword} /></TouchableOpacity>;
                                })}
                            </ScrollView>
                          </View>
                        )}
                      </View>

                      {/* 수강신청 버튼 */}
                      {this.state.hasFreepass && (
                      <View style={styles.topApplyBtnSection}>
                        <TouchableOpacity onPress={() => this.goApplyClass()} style={styles.btnApply}>
                          <CustomTextR style={[styles.btnApplyText, {fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}]}>환급반 · 패스강의 <CustomTextB>수강신청</CustomTextB></CustomTextR>
                          <Image source={require('../../../assets/icons/icon_arrow_side.png')} style={styles.iconArrowSide} />
                        </TouchableOpacity>
                      </View>
                      )}
                    </View>

                    {/***** 10분의 기적 상품 상단 고정 *****/}
                    {!CommonUtil.isEmpty(challengeProduct) && (
                      <View style={{backgroundColor: '#618493', paddingBottom: 20}}>
                        <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 15, paddingHorizontal: 20,}}>
                          {challengeProduct.productStatus !== '수강예정' && (
                          <TouchableOpacity onPress={() => this.onMissionButtonPress(challengeProduct)}>
                          <View style={{backgroundColor: '#486e7c', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingVertical: 7, paddingHorizontal: 15, borderRadius: 15, marginBottom: 10}}>
                            <Image source={require('../../../assets/icons/icon_mission.png')} style={{width: 11, height: 8, marginRight: 10, opacity: this.getChallengeStatus(challengeProduct) === '미션 대기' ? 0.3 : 1}} />
                            <CustomTextM style={{color: '#fff', fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12), lineHeight: PixelRatio.roundToNearestPixel(12 * 1.45), letterSpacing: -0.6, opacity: this.getChallengeStatus(challengeProduct) === '미션 대기' ? 0.3 : 1}}>{this.getChallengeStatus(challengeProduct)}</CustomTextM>
                          </View>
                          </TouchableOpacity>
                          )}
                          {this.state.challengeTootipIsShow && (
                            <View style={{backgroundColor: '#fff', borderColor: '#28a5ce', borderRadius: 10, borderWidth: 1, padding: 20, justifyContent: 'center', alignItems: 'center', width: '85%', shadowColor: '#330000', shadowOpacity: 0.2, shadowRadius: 6, position: 'absolute', top: 20, zIndex: 55}}>
                              <CustomTextM style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11), fontWeight: '500', letterSpacing: -0.55, color: '#222', textAlign: 'center'}}>{this.state.challengeTootipMsg}</CustomTextM>
                            </View>
                          )}
                          <CustomTextB style={{color: '#fff', fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18), letterSpacing: -0.9, lineHeight: 22, textAlign: 'center', marginHorizontal: 6}} numberOfLines={!this.state.challengeExpand ? 1 : 2}>{challengeProduct.productName}</CustomTextB>
                          {!this.state.challengeExpand && (
                          <TouchableOpacity onPress={() => {this.setState({challengeExpand: !this.state.challengeExpand, selectedChallengeProduct: challengeProduct})}} style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 10,}}>
                            <Image source={require('../../../assets/icons/btn_more_open.png')} style={{width: PixelRatio.roundToNearestPixel(18), height: PixelRatio.roundToNearestPixel(10)}} />
                          </TouchableOpacity>
                          )}
                        </View>
                        
                        {this.state.challengeExpand && 
                        <View style={{marginTop: 9}}>
                          <View style={{justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20}}>
                            <CustomTextR style={{color: '#fff', fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12), letterSpacing: -0.6, textAlign: 'center', lineHeight: 18}}>
                              잔여수강일 <TextRobotoM>{moment(challengeProduct.takeCourseEndDatetime).diff(moment(), 'days') + 1}</TextRobotoM>일 (~<TextRobotoR>{moment(challengeProduct.takeCourseEndDatetime).format('YY.MM.DD')}</TextRobotoR>){'\n'}
                              도전 출석 횟수 <TextRobotoM>{challengeProduct.attendDays}</TextRobotoM>일/<TextRobotoR>{challengeProduct.courseDays}</TextRobotoR>일
                            </CustomTextR>
                            <View style={{backgroundColor: '#fff', marginVertical: 11, marginHorizontal: 20, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 4, paddingVertical: 13,}}>
                              <TouchableOpacity style={[styles.flexDirRow, {flex: 1, justifyContent: 'center', alignItems: 'center'}]} onPress={() => this.showModal('challengeCalendar', challengeProduct)}>
                                <Image source={require('../../../assets/icons/icon_my_calendar.png')} style={{width: PixelRatio.roundToNearestPixel(14), height: PixelRatio.roundToNearestPixel(17), marginRight: PixelRatio.roundToNearestPixel(8)}} />
                                <CustomTextM style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14), lineHeight: 14 * 1.56, fontWeight: '500', color: '#222'}}> 환급반 달력</CustomTextM>
                              </TouchableOpacity>
                              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                              <View style={{width: 1, height: 20, backgroundColor: '#dddddd'}}></View>
                              </View>
                              <TouchableOpacity style={[styles.flexDirRow, {flex: 1, justifyContent: 'center', alignItems: 'center'}]} onPress={() => this.showModal('applyClass', challengeProduct)}>
                                <Image source={require('../../../assets/icons/icon_my_add.png')} style={{width: PixelRatio.roundToNearestPixel(16), height: PixelRatio.roundToNearestPixel(17), marginRight: PixelRatio.roundToNearestPixel(8)}} />
                                <CustomTextM style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14), lineHeight: 14 * 1.44, fontWeight: '500', color: '#222'}}>수강 신청</CustomTextM>
                              </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => {this.setState({challengeExpand: !this.state.challengeExpand, selectedChallengeProduct: challengeProduct})}} style={{marginBottom: 15}}>
                              <Image source={!this.state.challengeExpand ? require('../../../assets/icons/btn_more_open.png') : require('../../../assets/icons/btn_more_close.png')} style={{width: PixelRatio.roundToNearestPixel(18), height: PixelRatio.roundToNearestPixel(10)}} />
                            </TouchableOpacity>
                          </View>
                        
                          <View style={{justifyContent: 'center', backgroundColor: '#fff'}}>
                            <View style={styles.tabSection}>
                              <TouchableOpacity
                                style={[
                                  styles.tabButton,
                                  this.state.selectedTabIndex === 0 && styles.tabSelected,
                                ]}
                                onPress={() => this.onPressTab(0)}>
                                <Text style={[{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}, this.state.selectedTabIndex === 0 ? styles.tabButtonTextOn : styles.tabButtonTextOff]}>[1단계] 강의듣기</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[
                                  styles.tabButton,
                                  this.state.selectedTabIndex === 1 && styles.tabSelected,
                                ]}
                                onPress={() => this.onPressTab(1)}>
                                <Text style={[{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}, this.state.selectedTabIndex === 1 ? styles.tabButtonTextOn : styles.tabButtonTextOff]}>[2단계] 학습일기 작성</Text>
                              </TouchableOpacity>
                            </View>
                              {(this.state.selectedTabIndex === 0 && this.state.classList) &&
                                this.state.classList.filter(element => {
                                    return element.missionType && element.missionType === 'challenge';
                                  })
                                  .map((myclass, index) => {
                                    return (
                                      <View key={'challenge_'+index}>
                                        <RenderItem
                                          state={this.state}
                                          classData={myclass}
                                          onRowPress={classData => this.showDetail(classData)}
                                          onShowLecture={classData => this.showLecture(classData)}
                                        />
                                        <LectureItem screenState={this.state} classData={myclass} />
                                      </View>
                                    );
                                    {/* return listItem(myclass, index); */}
                                    {/* return (
                                      <View key={myclass.memberClassIdx} style={{}}>
                                        <SwipeRow
                                          ref={ref => (this.targetRows[index] = ref)}
                                          disableLeftSwipe={false}
                                          disableRightSwipe={true}
                                          leftOpenValue={COUNT_LEFT_SWIPE_BUTTON * WIDTH_LEFT_SWIPE_BUTTON}
                                          rightOpenValue={-(COUNT_RIGHT_SWIPE_BUTTON * WIDTH_RIGHT_SWIPE_BUTTON)}
                                          onRowOpen={() => this.swipeOpenedAction(myclass)}
                                          onRowClose={() => this.swipeClosedAction(myclass)}>
                                          <RightSwipeButton screenState={this.state} classData={myclass} />
                                          <RenderItem
                                            state={this.state}
                                            classData={myclass}
                                            onRowPress={classData => this.showDetail(classData)}
                                            onShowLecture={idx => this.showLecture(idx)}
                                          />
                                        </SwipeRow>
                                        <LectureItem screenState={this.state} classData={myclass} />
                                      </View>
                                  ); */}
                              })
                            // END this.state.selectedTabIndex === 0
                            }
                            {this.state.selectedTabIndex === 1 &&
                              <StudyDiaryScreen screenState={this.state} />
                            // END this.state.selectedTabIndex === 1
                            }
                          </View>
                        </View>
                        // END this.state.challengeExpand
                        }
                      </View>
                    )}
                    {this.classListResult(filteredClassList)}
                  </View>
                  {this.state.currentPage < this.lastPage && (
                    <TouchableOpacity style={{width: '100%', height: 80, alignItems: 'center', justifyContent: 'center'}} onPress={() => this.moreLoading()}>
                      <CustomTextR>더보기</CustomTextR>
                    </TouchableOpacity>
                    )}
                  <Modal
                    onBackdropPress={this.closeModal}
                    animationType="slide"
                    onRequestClose={() => {
                      this.setState({showModal: false});
                    }}
                    // useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating
                    isVisible={this.state.isShowModal}
                    style={{justifyContent: 'flex-end', margin: 0}}
                    // hideModalContentWhileAnimating={true}
                    onSwipeComplete={() => this.closeModal()}
                    swipeDirection={['down']}
                    propagateSwipe={true}
                    >
                    <View
                      style={[
                        this.state.modalType === 'centerModal' ? {justifyContent: 'center'} : this.isSwipeableModal() ? MyClassStyles.swipeableModalContainer : MyClassStyles.modalContainer,
                        {
                          // height: SCREEN_HEIGHT * 0.9,
                          height: this.state.modalType === 'centerModal' ? SCREEN_HEIGHT : (this.state.modalContent === 'classInfoMsg' ? SCREEN_HEIGHT * 0.5 : SCREEN_HEIGHT * 0.9),
                        },
                      ]}>
                      {this.isSwipeableModal() && (
                      <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', height: 30}}>
                          <TouchableOpacity onPress={() => this.closeModal()}>
                              <Image source={require('../../../assets/icons/btn_more_close_wh.png')} style={{width: 18, height: 10}} />
                          </TouchableOpacity>
                      </View>
                      )}
                      {this.getModalContent(this.state.modalContent)}
                    </View>
                  </Modal>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  },
  wrapper: {
    width: '100%',
    // height: '100%',
    height: 100,
  },
  title: {
    fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),
    textAlign: 'center',
    margin: 10,
  },
  font11: {fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11)},
  font12: {fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12)},
  spaceWidth5: {width: 5},
  flexDirRow: {flexDirection: 'row'},
  flexDirCol: {flexDirection: 'column'},
  roundedBtnSmall: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#d8d8d8',
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  roundedBtnNormal: {
    borderRadius: 9,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'skyblue',
    height: 30,
  },
  select2Btn: {
    // paddingVertical: 5,
    overflow: 'hidden',
    // width: 80,
    // flex: 0.6,
  },
  topButtonSection: {
    width: '100%',
    // height: 100,
    justifyContent: 'center',
    borderBottomColor: '#e8e8e8',
    borderBottomWidth: 1,
  },
  topFilterSection: {
    // height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 10,
  },
  topApplyBtnSection: {
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 7,
    // height: 60,
    backgroundColor: DEFAULT_COLOR.lecture_base,
    paddingVertical: 16,
  },
  listItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    backgroundColor: '#fff',
  },
  listItem: {
    // backgroundColor: '#fff',
    // height: 120,
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 20,
    // paddingVertical: 20,
    paddingBottom: 20,
  },
  hiddenItem: {
    flex: 1, flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
  actionBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
  },
  filterResultSection: {
    width: '100%', paddingHorizontal: 10, backgroundColor: '#f5f7f8', borderTopWidth: 1, borderTopColor: '#e8e8e8', borderBottomWidth: 1, borderBottomColor: '#ebeef0'
  },
  btnBorderedFilter: {
    borderRadius: 15,
    paddingLeft: 15,
    paddingRight: 7,
    paddingVertical: 8, //PixelRatio.roundToNearestPixel(8),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#470000',
    shadowOffset: {width: 1, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginVertical: 12, //PixelRatio.roundToNearestPixel(12),
    marginRight: 5, //PixelRatio.roundToNearestPixel(5),
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
  btnApply: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnApplyText: {
    color: '#fff',
    lineHeight: 15 * 1.42,
  },
  iconArrowSide: {
    width: 16,
    height: 16,
    marginLeft: 10,
  },
  tabSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  tabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 11,
    flex: 1,
  },
  tabButtonTextOn: {
    fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyBold,
    letterSpacing: -0.84, color: '#444444',
    lineHeight: 14 * 1.42,
  },
  tabButtonTextOff: {
    fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyRegular,
    letterSpacing: -0.84, color: '#888888',
    lineHeight: 14 * 1.42,
  },
  tabSelected: {
    borderBottomColor: '#444444',
    borderBottomWidth: 1,
  },
  rightSwipeContainer: {flex: 1, flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'},
  swipeButton: {width: 65, height: '100%', backgroundColor: '#3674c0', justifyContent: 'center', alignItems: 'center'},
  selectedFilterText: {
    fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyRegular,
    fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color: '#444444',letterSpacing: -0.7
  }
});

const mapStateToProps = state => {
  return {
    myClassProductFilter: state.GlabalStatus.myClassProductFilter,
    myClassServiceID: state.GlabalStatus.myClassServiceID,
    myClassClassList: state.GlabalStatus.myClassClassList,
    myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateMyClassClassList: array => {
      dispatch(ActionCreator.updateMyClassClassList(array));
    },
    updateMyClassProdcutFilter: object => {
      dispatch(ActionCreator.updateMyClassProdcutFilter(object));
    },
  };
}

MyLectureScreen.propTypes = {
  myClassClassList: PropTypes.array,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyLectureScreen);
