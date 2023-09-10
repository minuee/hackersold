import {Dimensions, Platform, PixelRatio, Linking, Alert} from 'react-native';
import { cos } from 'react-native-reanimated';
import AppLink from '../Utils/AppLink';
import SendIntentAndroid from 'react-native-send-intent';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

//공통상수
import COMMON_STATES from '../Constants/Common';
import * as getDEFAULT_CONSTANTS from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const scale = SCREEN_WIDTH / 320;

// 하단 how to use 참고
class Util {
  // memberFlag에 따른 serviceID 사용 범위
  MEBMER_FLAG = {
    // 챔프
    '100': [
      '3090', // 챔프 인강
      '3050', // 기초영어 (해커스톡)
      '3095', // 프렙
    ],
    // 패스
    '200': [
      '3045', // 임용
      '3040', // 공무원
      '3030', // 경찰
      '3230', // 소방
    ],
    // 중국어
    '300': [
      '3070', // 중국어
    ],
    // 취업
    '400': [
      '3080', // 취업 인강
    ],
  };

  // 서비스코드 및 서비스명 매칭
  // TODO:: 추후 API로 불러오기
  HACKERS_SERVICES = {
    '3090': '인강-챔프스터디',
    '3060': '인강-중개사',
    '3050': '인강-기초영어',
    '3095': '인강-프렙',
    '50002': '인강-공기업',
    '1000': '학원-어학원-강남역',
    '3075': '인강-일본어',
    '3210': '인강-주택사',
    '3230': '인강-소방',
    '3150': '인강-금융',
    '3070': '인강-중국어',
    '3045': '인강-임용',
  };

  // 스마트파인더 json parsing
  parseSmartFinderNoh = obj => {
    let level03 = {};
    let level04 = {};
    let difficulty = {};
    let teachers = {};

    for (let key in obj) {
      // console.log(`${key}: ${obj[key]}`);
      let arrLevel03 = [];
      let arrLevel04 = [];
      let arrDifficulty = [];
      let arrTeachers = [];

      let item = obj[key];
      if (item !== null && typeof item === 'object' && Array.isArray(item) === false) {
        // depth 1: ex) listObj1 = 교재/강의(level02)
        let listObj1 = item;
        // console.log('=> listObj1 : ', listObj1);
        for (let key2 in listObj1) {
          let item2 = listObj1[key2];
          if (item2 !== null && typeof item2 == 'object' && Array.isArray(item2) === false) {
            for (let key3 in item2) {
              // depth 2: ex) listObj2 = 과목(level03)
              let listObj2 = item2[key3];
              // console.log('==> listObj2 : ', listObj2);
              if (listObj2.Level === 'level03') {
                let data = {Code: listObj2.Code, Name: listObj2.Name};
                arrLevel03.push(data);
              }
              if (listObj2 !== null && typeof listObj2 == 'object' && Array.isArray(listObj2) === false) {
                for (let key4 in listObj2) {
                  let item3 = listObj2[key4];
                  if (item3 !== null && typeof item3 == 'object' && Array.isArray(item3) === false) {
                    for (let key5 in item3) {
                      // depth 3: : ex) listObj3 = 유형(level04) or 난이도(difficulty)
                      let listObj3 = item3[key5];
                      // console.log('===> listObj3 : ', listObj3);
                      if (listObj3.Level === 'level04') {
                        let data = {Code: listObj3.Code, Name: listObj3.Name};
                        arrLevel04.push(data);
                      } else if (listObj3.Level === 'difficulty') {
                        let data = {Code: listObj3.Code, Name: listObj3.Name};
                        arrDifficulty.push(data);
                      }
                      if (listObj3 !== null && typeof listObj3 == 'object' && Array.isArray(listObj3) === false) {
                        for (let key6 in listObj3) {
                          let item4 = listObj3[key6];
                          if (item4 !== null && typeof item4 == 'object' && Array.isArray(item4) === false) {
                            for (let key7 in item4) {
                              // depth 4: : ex) 난이도(difficulty) or 선생님(teacher)
                              let listObj4 = item4[key7];
                              // console.log('====> listObj4 : ', listObj4);
                              if (listObj4.Level === 'teacher') {
                                let data = {Code: listObj4.Code, Name: listObj4.Name};
                                arrTeachers.push(data);
                              } else if (listObj4.Level === 'difficulty') {
                                let data = {Code: listObj4.Code, Name: listObj4.Name};
                                arrDifficulty.push(data);
                              }
                              if (listObj4 !== null && typeof listObj4 == 'object' && Array.isArray(listObj4) === false) {
                                for (let key8 in listObj4) {
                                  let item5 = listObj4[key8];
                                  if (item5 !== null && typeof item5 == 'object' && Array.isArray(item5) === false) {
                                    for (let key9 in item5) {
                                      // depth 5: : ex) 선생님(teacher)
                                      let listObj5 = item5[key9];
                                      // console.log('=====> listObj5 : ', listObj5);
                                      if (listObj5.Level === 'teacher') {
                                        let data = {Code: listObj5.Code, Name: listObj5.Name};
                                        arrTeachers.push(data);
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      level03 = {
        ...level03, [key]: arrLevel03,
      };

      level04 = {
        ...level04, [key]: arrLevel04,
      };

      teachers = {
        ...teachers, [key]: arrTeachers,
      };

      difficulty = {
        ...difficulty, [key]: arrDifficulty,
      };
    }

    // 과목(level03) 중복제거
    for (let key in level03) {
      let result = [];
      let map = new Map();
      let index03 = 0;
      for (const item of level03[key]) {
        if (!map.has(item.Code)) {
          map.set(item.Code, true);
          result.push({            
            Code: item.Code,
            Name: item.Name,
            index : index03,
            checked :  false
          });
          index03++;
        }
      }
      level03[key] = result;
    }

    // 유형(level04) 중복제거
    for (let key in level04) {
      let result = [];
      let map = new Map();
      let index04 = 0;
      for (const item of level04[key]) {
        if (!map.has(item.Code)) {
          map.set(item.Code, true);
          result.push({
            Code: item.Code,
            Name: item.Name,
            index : index04,
            checked :  false
          });
          index04++;
        }
      }
      level04[key] = result;
    }

    // 난이도(difficulty) 중복제거
    for (let key in difficulty) {
      let result = [];
      let map = new Map();
      let indexdifficulty = 0;
      for (const item of difficulty[key]) {
        if (!map.has(item.Code)) {
          map.set(item.Code, true);
          result.push({
            Code: item.Code,
            Name: item.Name,
            index : indexdifficulty,
            checked :  false
          });
          indexdifficulty++;
        }
      }
      difficulty[key] = result;
    }

    // 선생님 중복제거
    for (let key in teachers) {
      let result = [];
      let map = new Map();
      let indexteacher = 0;
      for (const item of teachers[key]) {
        if (!map.has(item.Code)) {
          map.set(item.Code, true);
          result.push({
            Code: item.Code,
            Name: item.Name,
            index : indexteacher,
            checked :  false
          });
          indexteacher++;
        }
      }
      teachers[key] = result;
    }

    return {
      level03: level03,
      level04: level04,
      difficulty: difficulty,
      teachers: teachers,
    };
  };

  // '', null, undefinded, 빈객체{} 체크
  isEmpty = str => {
    return str === null || str === undefined || str === '' || (typeof str === 'object' && Array.isArray(str) === false && Object.keys(str).length === 0);
  };

  // 강좌 필터용 목록 생성: arr = 강좌목록 데이터
  getClassFilter = arr => {
    let arrProductPattern = [];
    let arrLevel03 = [];
    let arrLevel04 = [];
    let arrDifficulty = [];
    let arrTeacher = [];
    let arrYear = [];

    let productPattern = {};
    let level03 = {};
    let level04 = {};
    let difficulty = {};
    let teachers = {};
    let year = {};

    arr.forEach((val, key) => {
      const classProductPattern = {Code: val.productPattern, Name: val.productPattern};
      (!this.isEmpty(val.productPattern)) && arrProductPattern.push(classProductPattern);
      
      const classLevel03 = {Code: val.level03, Name: val.level03Name};
      (!this.isEmpty(val.level03) && !this.isEmpty(val.level03Name)) && arrLevel03.push(classLevel03);
      
      const classLevel04 = {Code: val.level04, Name: val.level04Name};
      (!this.isEmpty(val.level04) && !this.isEmpty(val.level04Name)) && arrLevel04.push(classLevel04);
      
      const classDifficulty = {Code: val.difficulty, Name: val.difficultyName};
      (!this.isEmpty(val.difficulty) && !this.isEmpty(val.difficultyName)) && arrDifficulty.push(classDifficulty);
      
      // val.teachers = [{teacherIdx: 100, teacherName: '홍길동1'}, {teacherIdx: 200, teacherName: '홍길동2'}, {teacherIdx: 300, teacherName: '홍길동3'}];
      val.teachers && 
        val.teachers.forEach(item => {
          const classTeacher = {Code: item.teacherIdx, Name: item.teacherName};
          (!this.isEmpty(item.teacherIdx) && !this.isEmpty(item.teacherName)) && classTeacher !== '' && arrTeacher.push(classTeacher);
        });

      const classYear = {Code: val.year, Name: val.year};
      (!this.isEmpty(val.year)) && arrYear.push(classYear);
    });

    // productPattern 중복제거 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    let result = [];
    let map = new Map();
    for (let key in arrProductPattern) {
      const item = arrProductPattern[key];
      if (!map.has(item.Code)) {
        map.set(item.Code, true);
        result.push({
          Code: item.Code,
          Name: item.Name,
        });
      }
      productPattern = result;
    }

    // level03 중복제거 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    result = [];
    for (let key in arrLevel03) {
      const item = arrLevel03[key];
      if (!map.has(item.Code)) {
        map.set(item.Code, true);
        result.push({
          Code: item.Code,
          Name: item.Name,
        });
      }
      level03 = result;
    }
    
    // level04 중복제거
    result = [];
    for (let key in arrLevel04) {
      const item = arrLevel04[key];
      if (!map.has(item.Code)) {
        map.set(item.Code, true);
        result.push({
          Code: item.Code,
          Name: item.Name,
        });
      }
      level04 = result;
    }

    // difficulty 중복제거
    result = [];
    for (let key in arrDifficulty) {
      const item = arrDifficulty[key];
      if (!map.has(item.Code)) {
        map.set(item.Code, true);
        result.push({
          Code: item.Code,
          Name: item.Name,
        });
      }
      difficulty = result;
    }

    // teachers 중복제거
    result = [];
    for (let key in arrTeacher) {
      const item = arrTeacher[key];
      if (!map.has(item.Code)) {
        map.set(item.Code, true);
        result.push({
          Code: item.Code,
          Name: item.Name,
        });
      }
      teachers = result;
    }

    // year 중복제거
    result = [];
    for (let key in arrYear) {
      const item = arrYear[key];
      if (!map.has(item.Code)) {
        map.set(item.Code, true);
        result.push({
          Code: item.Code,
          Name: item.Name,
        });
      }
      year = result;
    }
    
    return {
      productPattern: productPattern,
      level03: level03,
      level04: level04,
      difficulty: difficulty,
      teachers: teachers,
      year: year,
    };
  };

  normalize = size => {
    //console.log ('PixelRatio.get : ', PixelRatio.get ());
    //console.log ('PixelRatio.getFontScale : ', PixelRatio.getFontScale ());
    //console.log ('PixelRatio.getPixelSizeForLayoutSize 37 x 27.3 : ' + PixelRatio.getPixelSizeForLayoutSize (37) + ' x ' + PixelRatio.getPixelSizeForLayoutSize (21.3));
    //console.log ('PixelRatio.roundToNearestPixel : ', PixelRatio.roundToNearestPixel (21.3));
    //console.log ('PixelRatio.getPixelSizeForLayoutSize fontSize 23 : ' + PixelRatio.getPixelSizeForLayoutSize (23));
    //console.log ('PixelRatio.roundToNearestPixel fontSize 23 : ', PixelRatio.roundToNearestPixel (23));
    const newSize = size * scale;
    if (Platform.OS === 'ios') {
      return Math.round (PixelRatio.roundToNearestPixel (newSize));
    } else {
      return Math.round (PixelRatio.roundToNearestPixel (newSize)) - 2;
    }
  };

  // 카테고리 제거한 관심분야 array 생성
  getAllInterestCode = async () => {
    const result = await AsyncStorage.getItem('interestCode');
    const interestCode = JSON.parse(result);
    let arr = [];
    interestCode.map(item => {
      item.interests.map(item2 => {
        const newItem = Object.assign({color: item.category.backgroundRGB}, item2);
        item.interests && arr.push(newItem);
      });
    });
    return arr;
  };

  // memberFlag 권한 체크
  isMemberFlagCheck = async () => {
      const userMetaResponse = await AsyncStorage.getItem('myInterestCode');
      let isFlag = false;
      if (userMetaResponse) {
          const userMetadata = JSON.parse(userMetaResponse);
          const userInfo = await this.getUserInfo();
          const arrMemberFlag = userInfo.memberFlag.split(',');
          arrMemberFlag.forEach(item => {
              if (this.MEBMER_FLAG[item].indexOf(userMetadata.info.serviceID) > -1) {
                  isFlag = true;
              }
          });
      }
      return isFlag;
  };

  // memberFlag로 권한 없는 사이트 조회
  getUnAuthMemberFlagServiceName = async loginData => {
      const userMetaResponse = await AsyncStorage.getItem('myInterestCode');
      let result = null;
      let isFlag = false;
      if (userMetaResponse) {
          const userMetadata = JSON.parse(userMetaResponse);
          const userInfo = loginData ? loginData : await this.getUserInfo();
          const arrMemberFlag = userInfo.memberFlag.split(',');
          arrMemberFlag.forEach(item => {
              if (this.MEBMER_FLAG[item].indexOf(userMetadata.info.serviceID) > -1) {
                  isFlag = true;
              } else {
                  result = this.HACKERS_SERVICES[userMetadata.info.serviceID];
              }
          });
      }
      
      return isFlag ? null : result;
  };

  // 로그아웃
  logout = async () => {
    const userInfo = await this.getUserInfo();
    const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/auth/logout';
    if (this.isEmpty(userInfo)) {
      await this.removeLocalUserInfo();
      return true;
    } else {
      let returnResult = false;
      const formData = new FormData();
      formData.append('v1', userInfo.memberIdx);
      formData.append('v2', userInfo.logKey);
      formData.append('v3', 1);
      const options = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          ApiKey: '2B5A42E1BFA12821F475E4FF962E541B',
        },
        body: formData,
      };
      await this.requestAPI(url, options)
        .then(response => {
          if (response.code === '0000') {
            if (response.data.isLogout === 1) {
              // if (this.state.isAutoLogin) {
              //   // this.state.saveToken(response.data.logKey);
              // }
              this.removeLocalUserInfo();
              returnResult = true;
            } else {
              returnResult = false;
            }
          } else {
            returnResult = false;
          }
        })
        .catch(err => {
          console.log('logout error : ', err);
          returnResult = false;
        });
      return returnResult;
    }
  };

  // 로그인 체크
  isLoginCheck = async props => {
    const userInfo = await this.getUserInfo();
    if (this.isEmpty(userInfo)) {
      await this.resetLoginData(props);
      return false;
    } else {
      const validationLogKey = await this.validationLogKey(userInfo);
      if (validationLogKey) {
        const unAuthMemberFlagServiceName = await this.getUnAuthMemberFlagServiceName();
        if (unAuthMemberFlagServiceName === null) {
          return true;
        } else {
          // Alert.alert(
          //   '',
          //   unAuthMemberFlagServiceName + ' 아이디가 통합 전환하지 않아,\n' +
          //     '추가 계정 통합이 필요합니다.\n\n' +
          //     '통합회원 전환은 PC 또는 모바일 웹에서\n' +
          //     '가능합니다 : )',
          //   [{text: '확인', onPress: () => console.log('일부 미통합 확인')}],
          // );
          // if (props && props._saveUserToken) {
          //   await props._saveUserToken(null);
          //   await this.removeLocalUserInfo();
          // }
          // console.log('isLoginCheck : 일부 미통합 확인');
          return {code: -1, flagName: unAuthMemberFlagServiceName};
        }
      } else {
        await this.resetLoginData(props);
        return false;
      }
      // return validationLogKey;
    }
  };

  // 일부 미통합 회원 메세지 노출 및 callback 함수
  incompleteUserAlert = (flagName, callback) => {
    Alert.alert(
      '',
      flagName + ' 아이디가 통합 전환하지 않아,\n' +
        '추가 계정 통합이 필요합니다.\n\n' +
        '통합회원 전환은 PC 또는 모바일 웹에서\n' +
        '가능합니다 : )',
      [{text: '확인', onPress: () => callback ? callback() : console.log('일부 미통합')}],
    );
  };

  // 일부 미통합 유저 체크 후 메세지 노출, userInfo => optional
  checkIncompleteUser = async (userInfo, callback) => {
    const unAuthMemberFlagServiceName = await this.getUnAuthMemberFlagServiceName(userInfo);
    if (unAuthMemberFlagServiceName !== null) {
      this.incompleteUserAlert(unAuthMemberFlagServiceName, callback);
      return true;
    }

    return false;
  }

  resetLoginData = async props => {
    if (props && props._saveUserToken) {
      await props._saveUserToken(null);
      await this.removeLocalUserInfo();
    }
  };

  // 현재 로그인 로그키 유효성 검증
  validationLogKey = async userInfo => {
    const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/auth/validation?v1=' + userInfo.memberIdx + '&v2=' + userInfo.logKey + '&v3=1';
    let returnResult = false;
    await this.requestAPI(url)
      .then(response => {
        if (response.code === '0000') {
          if (response.data.isAuth === 1) {
            // if (this.state.isAutoLogin) {
            //   // this.state.saveToken(response.data.logKey);
            // }
            const newUserInfo = {
              ...userInfo,
              updateDatetime: moment().format('YYYY-MM-DD HH:mm:ss'),
            };
            this.saveLocalUserInfo(newUserInfo);
            // this.props.saveUserInfo(response.data);
            returnResult = true;
          } else {
            returnResult = false;
          }
        } else {
          returnResult = false;
        }
      })
      .catch(err => {
        //console.log('validationLogKey error : ', err);
        returnResult = false;
      });
    return returnResult;
  };
  // 로컬정보와 서버 정보 비교 후 다르면 업데이트
  // 로걸, 서버 모두 없으면 서버 저장
  // 로컬 > 서버 : 서버 저장
  // 로컬 < 서버 : 로컬 업데이트
  setMemberAppSetting = async () => {
    const localMemberAppSetting = await this.getLocalMemberAppSetting();
    const remoteMemberAppSetting = await this.getRemoteMemberAppSetting();
    const localVer = !CommonUtil.isEmpty(localMemberAppSetting) ? parseInt(localMemberAppSetting.settingVer) : 0;
    const remoteVer = !CommonUtil.isEmpty(remoteMemberAppSetting) ? parseInt(remoteMemberAppSetting.settingVer) : 0;
    if (this.isEmpty(localMemberAppSetting) && this.isEmpty(remoteMemberAppSetting)) {
      const metaResponse = await AsyncStorage.getItem('myInterestCode');
      const metadata = JSON.parse(metaResponse);
      if (this.isEmpty(metadata.info.interestFieldID) || this.isEmpty(metadata.info.interestFieldName)) {
        return false;
      }
      this.saveLocalInterest(metadata.info.interestFieldID, metadata.info.interestFieldName);
      const interest = await this.saveRemoteInterest(metadata.info.interestFieldID, metadata.info.interestFieldName);
      return interest;
    } else if (
      (!this.isEmpty(localMemberAppSetting) && this.isEmpty(remoteMemberAppSetting))
      || (localVer > remoteVer)
    ) {
      if (this.isEmpty(localMemberAppSetting.interestFieldID) || this.isEmpty(localMemberAppSetting.interestFieldName)) {
        return false;
      }
      const interest = this.saveRemoteInterest(localMemberAppSetting.interestFieldID, localMemberAppSetting.interestFieldName);
      return interest;
    } else if (localVer < remoteVer) {
      await this.saveLocalMemberAppSetting(remoteMemberAppSetting);
      return remoteMemberAppSetting;
    }
  };
  // 로컬 회원앱설정 조회 (계정에 저장된 관심분야 조회 용도)
  getLocalMemberAppSetting = async () => {
    // return {
    //   memberIdx: 6244198,
    //   settingData: {
    //     interestFieldID: 20060005,
    //     interestFieldName: '9급공무원',
    //   },
    //   settingVer: 1,
    // };
    const localMemberAppSetting = await AsyncStorage.getItem('memberAppSetting');
    return JSON.parse(localMemberAppSetting);
  };
  // 서버 회원앱설정 조회 (계정에 저장된 관심분야 조회 용도)
  getRemoteMemberAppSetting = async () => {
    const userInfo = await this.getUserInfo();
    let returnResult = null;
    if (userInfo) {
      const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/member/appSetting/' + userInfo.memberIdx;
      await this.callAPI(url)
        .then(response => {
          if (response.code === '0000') {
            returnResult = response.data;
          }
        })
        .catch(err => {
          //console.log('getMemberAppSetting error : ', err);
        });
    }
    return returnResult;
  };
  // 회원앱설정(관심분야) 로컬 저장
  saveLocalInterest = async (interestFieldID, interestFieldName) => {
    const memberIdx = await this.getMemberIdx();
    const memberAppSetting = {
      memberIdx: memberIdx,
      settingData: {
        interestFieldID: interestFieldID,
        interestFieldName: interestFieldName,
      },
      settingVer: 1,
    };
    return this.saveLocalMemberAppSetting(memberAppSetting);
  };
  // 회원앱설정(관심분야) 서버 저장
  saveRemoteInterest = async (interestFieldID, interestFieldName) => {
    if (this.isEmpty(interestFieldID) || this.isEmpty(interestFieldName)) {
      return;
    }
    const data = {
      interestFieldID: interestFieldID,
      interestFieldName: interestFieldName,
    };
    return await this.saveRemoteMemberAppSetting(data);
  };
  // 로컬에 회원앱설정 정보 저장
  saveLocalMemberAppSetting = async memberAppSetting => {
    try {
      await AsyncStorage.setItem('memberAppSetting', JSON.stringify(memberAppSetting));
      return await this.getLocalMemberAppSetting();
    } catch (error) {
      //console.log('saveLocalMemberAppSetting error : ', error);
      // this.setState({loginError: error});
    }
  };
  // 로컬에 회원앱설정 정보 저장
  removeLocalMemberAppSetting = async memberAppSetting => {
    try {
      await AsyncStorage.removeItem('memberAppSetting');
    } catch (error) {
      //console.log('removeLocalMemberAppSetting error : ', error);
      // this.setState({loginError: error});
    }
  };
  // 서버에 회원앱설정 정보 저장
  saveRemoteMemberAppSetting = async data => {
    if (this.isEmpty(data) || (!this.isEmpty(data) && this.isEmpty(data.interestFieldID) || this.isEmpty(data.interestFieldName))) {
      return;
    }
    const userInfo = await this.getUserInfo();
    const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/member/appSetting/' + userInfo.memberIdx; //6244198
    const formData = new FormData();
    formData.append('settingData', JSON.stringify(data));
    const options = {
      method: 'POST',
      body: formData,
    };
    let returnResult = null;
    await this.callAPI(url, options)
      .then(response => {
        if (response.code === '0000') {
          returnResult = response.data;
        }
      })
      .catch(err => {
        console.log('saveRemoteMemberAppSetting error : ', err);
      });
    return returnResult;
  };
  // 로그인 유저 정보 AsyncStorage 저장
  saveLocalUserInfo = async userInfo => {
    try {
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (error) {
      console.log('saveLocalUserInfo error : ', error);
      // this.setState({loginError: error});
    }
  };
  // 로그인 유저 정보 AsyncStorage 삭제
  removeLocalUserInfo = async () => {
    try {
      const resp = await AsyncStorage.removeItem('userInfo');
      return resp;
    } catch (error) {
      console.log('removeLocalUserInfo error : ', error);
    }
  };
  // 로컬 저장된 유저 정보 조회
  getUserInfo = async () => {
    // TEST
    // return {
    //   memberIdx: 2014896, //챔프: 5104881 7015069 7014826 3649866 / 임용: 1307399 2014896
    //   memberID: 'TEST',
    //   memberBirthDate: '2000-02-02',
    //   memberName: '테스트',
    //   isAutoLogin: true,
    // };
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      return JSON.parse(userInfo);
    } catch (error) {
      console.log('getUserInfo error : ', error);
    }
  };
  // 자동로그인 여부 조회
  isAutoLogin = async () => {
    const userInfo = await this.getUserInfo();
    if (!this.isEmpty(userInfo)) {
      return userInfo.isAutoLogin;
    } else {
      return false;
    }
  };
  // 회원 식별자 조회
  getMemberIdx = async () => {
    const userInfo = await this.getUserInfo();
    if (!this.isEmpty(userInfo)) {
      return userInfo.memberIdx;
    } else {
      return null;
    }
  };
  // 회원 아이디 조회
  getMemberID = async () => {
    // TEST
    // return 'jb3238'; //7015069 (cdffee1), 5104881 (ID = jb3238 ), 6000434 (ID = jba3238 )
    const userInfo = await this.getUserInfo();
    if (!this.isEmpty(userInfo)) {
      return userInfo.memberID;
    } else {
      return null;
    }
  };
  // 사용자 선택 관심분야 조회
  getMyInterest = async () => {
    const metaResponse = await AsyncStorage.getItem('myInterestCode');
    const jsonMeta = JSON.parse(metaResponse);

    if (this.isEmpty(jsonMeta) || this.isEmpty(jsonMeta.info)) {
      return {};
    }

    return {
      interestFieldID: jsonMeta.info.interestFieldID,
      interestFieldName: jsonMeta.info.interestFieldName,
    };
  };

  // 현재 선택 관심분야의 ServiceID조회
  getServiceID = async () => {
    const metaResponse = await AsyncStorage.getItem('myInterestCode');
    const jsonMeta = JSON.parse(metaResponse);
    if (this.isEmpty(jsonMeta)) {
      return false;
    }

    return jsonMeta.info.serviceID;
  };

  // 사용가능한 관심분야인지 체크
  isEnableInterest = async interestFieldID => {
    const selectedInterest = await this.getSelectedInterest(interestFieldID);
    return !this.isEmpty(selectedInterest);
  };

  // 전체 관심분야에서 선택한 관심분야 조회
  getSelectedInterest = async interestFieldID => {
    const allInterests = await this.getAllInterestCode();
    const selectedInterest = allInterests.find(item => {
      return interestFieldID && item.interestFieldID.toString() === interestFieldID.toString();
    });
    return selectedInterest;
  };

  // 사용자 선택 관심분야에서 ServiceID 조회
  getMyServiceID = async () => {
    const metaResponse = await AsyncStorage.getItem('myInterestCode');
    const jsonMeta = JSON.parse(metaResponse);

    if (this.isEmpty(jsonMeta)) {
      return;
    }

    return jsonMeta.info.serviceID;
  };
  // 사용자 선택 관심분야에서 API 정보 조회
  getMyApiInfo = async () => {
    const metaResponse = await AsyncStorage.getItem('myInterestCode');
    const jsonMeta = JSON.parse(metaResponse);

    if (this.isEmpty(jsonMeta)) {
      return {
        apiDomain: '',
        apiKey: '',
      };
    }

    return {
      apiDomain: jsonMeta.info.apiDomain,
      apiKey: jsonMeta.info.apiKey,
    };
  };
  // 로컬 저장된 유저의 logKey 조회
  getToken = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        return JSON.parse(userInfo).logKey;
      }
      return false;
    } catch (error) {
      console.log('getToken error : ', error);
    }
  };

  // 안내메세지
  getInfoMessage = async serviceID => {
    if (this.isEmpty(serviceID)) {
      return {result: false, error: '서비스ID가 없습니다.'};
    }

    let result = {};
    const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/meta/message/' + serviceID;
    await this.callAPI(url, null, 10000)
      .then(response => {
        result = {result: true, response: response};
      })
      .catch(err => {
        console.log('getInfoMessage error : ', err);
        result = {result: false, error: '안내메세지 로딩 실패'};
      });
    
    return result;
    // 기존 관심분야 기준 안내메세지 => ServiceID 기준 안내메세지로 api 분리함
    // const infoMessages = await AsyncStorage.getItem('infoMessages');
    // if (!this.isEmpty(infoMessages)) {
    //   const jsonInfoMessages = JSON.parse(infoMessages);
    //   return jsonInfoMessages;
    // } else {
    //   return null;
    // }
  };
  
  // call API with timeout Function, default limit = 30 seconds
  callAPI = async (url, options = null, FETCH_TIMEOUT = 30000, requiredLogin = false, signal = null) => {
    const myTimeout = this.isEmpty(FETCH_TIMEOUT) ? 30000 : FETCH_TIMEOUT;
    if (requiredLogin) {
      const isLogin = this.isLoginCheck();
      if (isLogin) {
        return this.requestAPI(url, options, myTimeout, signal);
      } else {
        // Alert.alert('', '로그인이 필요한 서비스 입니다.');
        throw new Error('requiredLogin');
      }
    } else {
      return this.requestAPI(url, options, myTimeout, signal);
    }
  };

  requestAPI = async (url, options = null, FETCH_TIMEOUT = 30000, signal = null) => {
    const metaResponse = await AsyncStorage.getItem('myInterestCode');
    const metadata = JSON.parse(metaResponse);
    const domain = url.replace('http://','').replace('https://','').split(/[/?#]/)[0];
    const apiKey = (domain === 'tapis.hackers.com' || domain === 'qapis.hackers.com' || domain === 'apis.hackers.com') || 
      (domain === 'tia.hackers.com' || domain === 'qia.hackers.com' || domain === 'ia.hackers.com')
      ? '2B5A42E1BFA12821F475E4FF962E541B' 
      : metadata 
        ? metadata.info.apiKey 
        : DEFAULT_CONSTANTS.apitestKey;
    try {
      // 1) myClass에서는 사용자가 선택한 마이클래스의 ServiceID를 사용하므로 
      //    callAPI 호출 시 options headers ApiKey 직접 기재해서 호출
      // 2) 마이클래스 이외는 관심분야 선택에 따른 ServiceID 불러와 자동 삽입
      if (options === null) {
        options = {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=UTF-8',
            ApiKey: apiKey,
          },
        };
      } else {
        // headers를 new Headers로 넘기면 map 으로 넘어옴.
        // 그냥 headers: {}, new Headers({}) 모두 허용위해 newHeaders로 받음
        // headers 대소문자 구분으로 인해 변화 후 사용
        const tmpHeaders = options.headers
          ? typeof options.headers.map !== 'undefined'
            ? options.headers.map
            : options.headers
          : {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            };
        let arrHeaders = [];
        let arrHeaderKeys = [];
        Object.keys(tmpHeaders).forEach(item => {
          arrHeaders[item.toLowerCase()] = tmpHeaders[item];
          arrHeaderKeys.push(item.toLowerCase());
        });
        // newHeaders = {
        //   Accept: newHeaders['Accept'] ? newHeaders['Accept'] : newHeaders['accept'],
        //   'Content-Type': newHeaders['Content-Type'] ? newHeaders['Content-Type'] : newHeaders['content-type'],
        //   ApiKey: newHeaders['ApiKey'] ? newHeaders['ApiKey'] : newHeaders['apiKey'],
        // };
        let newHeaders = {};
        arrHeaderKeys.forEach((value, index) => {
          let objKey = '';
          if (value === 'accept') {
            objKey = 'Accept';
          } else if (value === 'content-type') {
            objKey = 'Content-Type';
          } else if (value === 'apikey') {
            objKey = 'ApiKey';
          } else {
            objKey = value;
          }
          const obj = {[objKey]: arrHeaders[value]};
          newHeaders = {...newHeaders, ...obj};
        });
        // const newHeaders = {
        //   Accept: arrHeaders['accept'] ? arrHeaders['accept'] : 'application/json',
        //   'Content-Type': arrHeaders['content-type'],
        //   ApiKey: arrHeaders['apikey'],
        // };

        const contentType =
        options.method && options.method.toUpperCase() === 'POST'
            ? 'multipart/form-data'
            : options.method && options.method.toUpperCase() === 'PUT' || options.method && options.method.toUpperCase() === 'DELETE'
            ? 'application/x-www-form-urlencoded'
            : 'application/json; charset=UTF-8';
        const receivedApiKey = newHeaders.ApiKey ? newHeaders.ApiKey : newHeaders.apiKey;
        options.headers = {
          ...newHeaders,
          'Content-Type': contentType, // <= 강제 지정 / 호출지의 content-type 이 있으면 사용 => newHeaders['Content-Type'] ? newHeaders['Content-Type'] : contentType,
          ApiKey: receivedApiKey ? receivedApiKey : apiKey,
        };
      }
      // console.log('CallAPI requestAPI : ', url, options);
      // console.log('CallAPI body : ', options.body);
      const response = await this.fetchWithTimout(url, options, FETCH_TIMEOUT, signal);
      const responseJson = await response.json();
      // console.log('CallAPI responseJson : ', responseJson);
      return responseJson;
    } catch (error) {
      //console.log('callAPI error : ', error);
      throw new Error(error);
    }
  };

  // fetch with timeout
  fetchWithTimout = async (url, options = null, FETCH_TIMEOUT = 30000, signal = null) => {
    return Promise.race([
      fetch(url, options, signal),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), FETCH_TIMEOUT),
      ),
    ]);
  };

  // 스마트파인더 리스트 by noh
  getSFallListNoh = (data) => {    
    //const data = smartFinder.data.SmartFinder;
    return this.parseSmartFinderNoh(data);
  }

  // 문자열 날짜 -> 날짜 객체로 변환
  stringToDate = dateString => {
    dateString = dateString.replace(/-/g, "/");
    dateString = dateString.replace("T", " ");
    return new Date(
        dateString.replace(/(\+[0-9]{2})(\:)([0-9]{2}$)/, " UTC$1$3")
    );
  };

  // 두 날짜 사이 일 수 계산
  dateDiff = (dateString1, dateString2) => {
      // let date1 = new Date(dateString1);
      // let date2 = new Date(dateString2);
      // let timeDiff = Math.abs(date2.getTime() - date1.getTime());
      // let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      // return diffDays;
      return moment(dateString2).diff(moment(dateString1), 'days') + 1;
  };

  // 날짜 포맷
  dateFormat = (format, date) => {
    let d;
    const _this = this;
    if (date == undefined || date == "" || date == null) {
        d = new Date();
    } else {
        if (typeof date == "string") {
            d = _this.stringToDate(date);
        } else {
            d = date;
        }
    }

    return format.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy":
                return d.getFullYear();
                break;
            case "yy":
                return _this.mask("00", d.getFullYear() % 1000);
                break;
            case "MM":
                return _this.mask("00", d.getMonth() + 1);
                break;
            case "dd":
                return _this.mask("00", d.getDate());
                break;
            case "E":
                return weekName[d.getDay()];
                break;
            case "HH":
                return _this.mask("00", d.getHours());
                break;
            case "hh":
                return _this.mask("00", (h = d.getHours() % 12) ? h : 12);
                break;
            case "mm":
                return _this.mask("00", d.getMinutes());
                break;
            case "ss":
                return _this.mask("00", d.getSeconds());
                break;
            case "a/p":
                return d.getHours() < 12 ? "오전" : "오후";
                break;
            default:
                return $1;
        }
    });
  };

  // 마스킹
  mask = (fs, s) => {
    var string = fs.toString() + s.toString();
    var size =
        fs.length > s.toString().length ? fs.length : s.toString().length;
    return string.substr(s.toString().length, size);
  };

  middleMask = (fs, s) => {
    const string = fs.toString();
    const size = string.length;
    const maskLength = size > 2 ? size - 2 : 1;
    let maskString = '';
    for (i = 0; i < maskLength; i++) {
      maskString += s;
    }
    return string.substr(0, 1) + (size > 2 ? (maskString + string.substr(-1)) : maskString);
  };

  // 문자열에서 슬래시 제거 (역슬래시 제거)
  stripSlashes = str => {
    return str.replace(/\\(.)/gm, '$1');
  };

  stripTags = str => {
    return str.replace(/<\/?[^>]+(>|$)/g, "");
  };

    // obejct -> url get param 변환
    // {memberIdx: 1234, classIdx: 5678} => memberIdx=1234&classIdx=5678
    objectToParamString = obj => {
      return Object.entries(obj)
        .map(([key, val]) => encodeURIComponent(`${key}`) + '=' + encodeURIComponent(`${val}`))
        .join('&');
    };

    openApp = (url, appName, appStoreId, appStoreLocale, playStoreId) => {
        Platform.OS === 'ios'
            ? this.openiOSCustomUrlLinking(url, appName, appStoreId, appStoreLocale, playStoreId)
            : this.openAndroidCustomUrlLinking(url, appName, appStoreId, appStoreLocale, playStoreId)
    };

    //패키지 미설치 시, 앱 스토어 정상 이동
    //패키지 설치 시, 앱 정상 실행, 동영상 정상 실행 및 다운로드 정상 실행
    openiOSCustomUrlLinking = ( intentUrl, appName, appStoreId, appStoreLocale, playStoreId) => {
       AppLink.maybeOpenURL(intentUrl, { appName, appStoreId, appStoreLocale, playStoreId }).then(() => {
           Linking.openURL(intentUrl);
       }).catch((err) => {
          //  alert('err occurred on ios');
          AppLink.openInStore(appName, appStoreId, appStoreLocale, playStoreId);
       });
    }

    //패키지 미설치 시, 구글 스토어 정상 이동
    //패키지 설치 시, 앱 정상 실행, 동영상 정상 실행 및 다운로드 정상 실행
    openAndroidCustomUrlLinking = (intentUrl, appName, appStoreId, appStoreLocale, playStoreId) => {
        SendIntentAndroid.isAppInstalled(playStoreId)
            .then(function(isInstalled){
                if(!isInstalled){
                    //console.log('openAndroidCustomUrlLinking()', 'playStoreId = ' + playStoreId)
                    AppLink.openInStore({ appName, appStoreId, appStoreLocale, playStoreId }).then(() => {})
                    return;
                } else {
                    SendIntentAndroid.openChromeIntent(intentUrl);
                    return;
                }
            }).catch((err) => {
            alert('err occurred on android');
        });
    }
}

const CommonUtil = new Util();
export default CommonUtil;

/////// HOW TO USE /////////

//////////// 함수 유틸 ////////////
// import CommonUtil from './src/Utils/CommonUtil.js';
// console.log('23 = normalize: ', CommonUtil.normalize(23));

/*
//////////// 스마트 파인더 중복제거한 레벨별 전체 목록 ////////////
const sf = CommonUtil.getSFallList();
console.log('level03 : ', sf.level03);
console.log('level04 : ', sf.level04);
console.log('difficulty : ', sf.difficulty);
console.log('teachers : ', sf.teachers);

//////////// 로그인 ////////////
// CommonUtil.login('changook815', 'hackers1234!')
// .then( response => {console.log('login success => ', response)} )
// .catch( err => {console.log('login error => ', err)} );

//////////// 로그인 체크 ////////////
// CommonUtil.checkLogin('6c12f064d0fe584ab3808fe05b7b61e015badd38a057008e66e3c96bb30ebcba')
// .then( response => { console.log('loginCheck: ', response); } )
// .catch( error => { console.log('loginCheck error: ', error) } );

//////////// callAPI timeout test ////////////
// const url = 'https://jsonplaceholder.typicode.com/todos/1';
// const url2 = 'https://httpstat.us/200?sleep=10000';
// const url3 = 'https://tapis.hackers.com/v1/encryption/encrypt?encryptionType=integration.refund.bankAccount&plainText=test';
// const url4 = 'https://jsonplaceholder.typicode.com/posts';

//////////// API를 연달아 호출할 경우 (url, url2) ////////////
// CommonUtil.callAPI(url)
// .then( 
//     response => {
//         console.log('callAPI success => ', response);
//         CommonUtil.callAPI(url2, null, 5000)
//         .then( response => {console.log('timeout 5sec success => ', response)} )
//         .catch( err => {console.log('timeout 5sec error => ', err)} );
//     } 
// )
// .catch( err => {console.log('callAPI error => ', err)} );

//////////// options를 포함한 API 호출 options (url3) ////////////
// const options = {
//   method: 'POST',
// };

//////////// options를 포함한 API 호출 options2 (url4) ////////////
// const options2 = {
//   method: 'POST',
//   headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/json; charset=UTF-8',
//   },
//   body: JSON.stringify({
//     // post
//     title: 'foo',
//     body: 'bar',
//     userId: 1,
//   }),
// };

//////////// options를 포함한 API 호출 (url4) ////////////
// CommonUtil.callAPI(url3, options, 10000)
//   .then(response => {
//     console.log('callAPI with options success => ', response);
//   })
//   .catch(err => {
//     console.log('callAPI with options error => ', err);
//   });
*/