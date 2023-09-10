import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
  PixelRatio,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import moment from 'moment';
import Modal from 'react-native-modal';
import InterestSelect from '../../../InterestSelect';
// import RNRestart from 'react-native-restart';

//공통상수
import COMMON_STATES from '../../Constants/Common';
import * as getDEFAULT_CONSTANTS from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

import CommonUtil from '../../Utils/CommonUtil.js';
import {CustomText, CustomTextL, CustomTextDL, CustomTextR, CustomTextM, CustomTextB, TextRobotoL, TextRobotoR, TextRobotoM, TextRobotoB} from '../../Style/CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SCREEN_HEIGHT } from '../../Utils/ParallaxScroll/constants';
import { cos } from 'react-native-reanimated';
import Toast from 'react-native-tiny-toast';
Icon.loadFont();

class IntroScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAutoLogin: false,
      autoLoginOnOff: 'Off',
      id: 'qatest_0624_46', // qatest_0624_46 qa0814_09
      pw: 'testing123!', // testing123!
      loginError: '',
      // inputBorderColor: '#e8ecf0',
      focusedInput: '',
      isLoginReady: false,
      topShowModal: false,
      latestMemberAppSetting: null,
      beforeMemberAppSetting: null,
      serviceID: '',
      userInfo: null,
      remoteMemberAppSetting: null,
      // interestMode : 'mod',
      // attentionSelectCode : null,
      // attentionSelectName : null,
      // attentionSelectRGB : null,
      // myInterestCodeOne : null,
      setMyInterest: this.setMyInterest.bind(this),
    };
    this._ScrollView = React.createRef();
    this.animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.9);
  }

  async UNSAFE_componentWillMount() {
    const serviceID = 
      !CommonUtil.isEmpty(this.props.myInterestCodeOne) && typeof this.props.myInterestCodeOne.info.serviceID !== 'undefined' 
        ? this.props.myInterestCodeOne.info.serviceID 
        : '';
    if (serviceID === '') {
      Alert.alert('', '관심분야 설정 저장에 문제가 있습니다.\n다시 선택 후 시도해 주세요.', [{text: '확인', onPress: () => this.props.navigation.goBack(null)}]);
    }
    this.setState({serviceID: serviceID});
    // const myInterestCodeOne = await CommonUtil.getMyInterest();
    // await CommonUtil.saveRemoteInterest(myInterestCodeOne.interestFieldID, myInterestCodeOne.interestFieldName);

    // const data = {
    //   interestFieldID: 20060005,
    //   interestFieldName: '9급공무원',
    // };

    // await CommonUtil.saveRemoteMemberAppSetting(data);

    // const data2 = {
    //   memberIdx: 6244198,
    //   settingData: {
    //     interestFieldID: 20060005,
    //     interestFieldName: '9급공무원',
    //   },
    //   settingVer: 1,
    // };
    // await CommonUtil.saveLocalMemberAppSetting(data2);

  }

  componentWillUnmount() {
    this.props.navigation.state.params &&
      this.props.navigation.state.params.onLoginCancelBack &&
      this.props.navigation.state.params.onLoginCancelBack();
  }

  toggleAutoLogin = () => {
    let isAutoLogin = false;
    let autoLoginOnOff = 'Off';
    if (!this.state.isAutoLogin) {
      isAutoLogin = true;
      autoLoginOnOff = 'On';
    } else {
      isAutoLogin = false;
      autoLoginOnOff = 'Off';
    }
    this.setState({
      isAutoLogin: isAutoLogin,
      autoLoginOnOff: autoLoginOnOff,
    });
  };

  // 로그인
  login = async () => {
    // if (this.state.id.trim() === '' || this.state.pw.trim() === '') {
    //   Alert.alert(
    //     'Login',
    //     '아이디와 패스워드를 입력해 주세요.',
    //     [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    //     {cancelable: false},
    //   );
    //   return;
    // }

    if (this.state.id.trim() === '') {
      Toast.show('아이디를 확인해주세요');
      return;
    }

    if (this.state.pw.trim() === '') {
      Toast.show('비밀번호를 확인해주세요');
      return;
    }

    const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/auth/login';
    const formData = new FormData();
    formData.append('v1', this.state.id);
    formData.append('v2', this.state.pw);
    formData.append('v3', 1);
    formData.append('v4', this.state.isAutoLogin ? 1 : 0);
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        ApiKey: '2B5A42E1BFA12821F475E4FF962E541B',
      },
      body: formData,
    };
    /*
    휴면 계정	2102	휴면 계정입니다. PC 또는 모바일 웹에서 휴면상태를 해제해주세요.
    패스워드 만료	2104	비밀번호 사용 기간이 만료되었습니다. PC 또는 모바일웹을 통해 비밀번호를 변경해주세요.
    제한 계정	2103	로그인 불가능한 계정입니다. 고객센터로 문의해주세요.
    로그인 정보 오류	2101	아이디/비밀번호를 확인해 주세요.
    */

    await CommonUtil.callAPI(url, options)
      .then(response => {
        // console.log('login response => ', response);
        if (response && typeof response === 'object' || Array.isArray(response) === false) {
          if (response.code === '0000') {
            if (response.data.isLogin && response.data.logKey !== '') {
              // if (this.state.isAutoLogin) {
              //   // this.state.saveToken(response.data.logKey);
              // }
              this.loginSuccess(response.data);
            }
          } else {
            response.message
              ? Alert.alert('', response.message)
              : Alert.alert(
                  '',
                  '로그인 실패',
                  [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                  {cancelable: false},
                );
          }
        } else {
          Alert.alert(
            '',
            '시스템오류: 관리자에게 문의해 주세요.',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
        }
      })
      .catch(err => {
        console.log('login error => ', err);
        Alert.alert(
          '',
          '시스템오류: 관리자에게 문의해 주세요.',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );
      });
  };

  // 로그인 성공
  loginSuccess = async data => {
    const unAuthMemberFlagServiceName = await CommonUtil.getUnAuthMemberFlagServiceName(data);
    if (unAuthMemberFlagServiceName !== null) {
      Alert.alert(
        '',
        unAuthMemberFlagServiceName + ' 아이디가 통합 전환하지 않아,\n' +
          '추가 계정 통합이 필요합니다.\n\n' +
          '통합회원 전환은 PC 또는 모바일 웹에서\n' +
          '가능합니다 : )',
        [{text: '확인', onPress: () => this.saveUserInfo(data)}],
      );
    } else {
      this.saveUserInfo(data);
    }
  };

  // 회원정보 저장
  saveUserInfo = data => {
    const userInfo = {
      ...data,
      isAutoLogin: this.state.isAutoLogin,
      saveDatetime: moment().format('YYYY-MM-DD HH:mm:ss'),
      updateDatetime: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
    Alert.alert('', '로그인 되었습니다.', [
      {text: '확인', onPress: () => this.procLogin(userInfo)}
    ], {cancelable: false});
  };

  // 로그인 성공 후 처리
  procLogin = async userInfo => {
    // 로그인 정보 로컬 저장
    await CommonUtil.saveLocalUserInfo(userInfo);

    // 리덕스 저장
    await this.props._saveUserToken(userInfo);
    
    this.setState({userInfo: userInfo});

    //uuid의 memberIdx update
    const appUUID = await AsyncStorage.getItem('UUID');
    if (appUUID) {
      const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/apptoken/modify';
      const bodyData = {
        uuid: appUUID,
        memberIdx: userInfo.memberIdx,
      };
      const options = {
        method: 'PUT',
        body: CommonUtil.objectToParamString(bodyData),
      };
      await CommonUtil.callAPI(url, options)
        .then(response => {
          console.log('apptoken modify success');
        })
        .catch(error => {
          console.log('apptoken modify fail : ', error);
        });
    }
    
    // 관심분야 관련 처리
    await this.procInterest(userInfo);
  };

  /*
  // 비교 프로세스 수정으로 사용 안함, 임시 기록
  // 계정 관심분야 로컬 vs 서버 버전 비교 처리
  procInterest = async userInfo => {
    // await AsyncStorage.removeItem('memberAppSetting');
    // 1) 로컬 x, 서버 x: 모두 저장 & 로그인 닫기
    // 2) 버전 다르면 변경 confirm
    // 2-1) 확인: 높은 버전으로 업데이트 (서버 -> 로컬)
    // 2-2) 취소: 현재 정보를 기준으로 업데이트 (로컬 -> 서버)
    let localMemberAppSetting = await CommonUtil.getLocalMemberAppSetting();
    let remoteMemberAppSetting = await CommonUtil.getRemoteMemberAppSetting();
    // const localVer = !CommonUtil.isEmpty(localMemberAppSetting) && parseInt(localMemberAppSetting.memberIdx) === parseInt(userInfo.memberIdx) ? parseInt(localMemberAppSetting.settingVer) : 0;
    // const remoteVer = !CommonUtil.isEmpty(remoteMemberAppSetting) ? parseInt(remoteMemberAppSetting.settingVer) : 0;
    // console.log('localMemberAppSetting : ', localMemberAppSetting, localVer, parseInt(localMemberAppSetting.memberIdx), parseInt(userInfo.memberIdx));
    // console.log('remoteMemberAppSetting : ', remoteMemberAppSetting, remoteVer);
    // console.log(CommonUtil.isEmpty(localMemberAppSetting) && CommonUtil.isEmpty(remoteMemberAppSetting));
    // console.log((CommonUtil.isEmpty(localMemberAppSetting) || CommonUtil.isEmpty(remoteMemberAppSetting)) || (localVer !== remoteVer));

    // const metaResponse = await AsyncStorage.getItem('myInterestCode');
    // const metadata = JSON.parse(metaResponse);
    const myInterestCodeOne = await CommonUtil.getMyInterest();

    if (CommonUtil.isEmpty(localMemberAppSetting) && CommonUtil.isEmpty(remoteMemberAppSetting)) {
      if (myInterestCodeOne) {
        await CommonUtil.saveLocalInterest(myInterestCodeOne.interestFieldID, myInterestCodeOne.interestFieldName);
        await CommonUtil.saveRemoteInterest(myInterestCodeOne.interestFieldID, myInterestCodeOne.interestFieldName);
      }
      this.onLoginBack(userInfo);

    } else if ((CommonUtil.isEmpty(localMemberAppSetting) || CommonUtil.isEmpty(remoteMemberAppSetting)) || (localVer !== remoteVer)) {

      if (!CommonUtil.isEmpty(localMemberAppSetting) &&
          !CommonUtil.isEmpty(localMemberAppSetting.settingData) &&
          (CommonUtil.isEmpty(localMemberAppSetting.settingData.interestFieldID) || CommonUtil.isEmpty(localMemberAppSetting.settingData.interestFieldName))) 
      {
        await CommonUtil.removeLocalMemberAppSetting();
      }
      
      if (!CommonUtil.isEmpty(remoteMemberAppSetting) &&
          !CommonUtil.isEmpty(remoteMemberAppSetting.settingData) &&
          (CommonUtil.isEmpty(remoteMemberAppSetting.settingData.interestFieldID) || CommonUtil.isEmpty(remoteMemberAppSetting.settingData.interestFieldName))) 
      {
        const local = await CommonUtil.saveLocalInterest(myInterestCodeOne.interestFieldID, myInterestCodeOne.interestFieldName);
        const remote = await CommonUtil.saveRemoteInterest(myInterestCodeOne.interestFieldID, myInterestCodeOne.interestFieldName);
        localMemberAppSetting = local;
        remoteMemberAppSetting = remote;
      }

      const latestMemberAppSetting = localVer > remoteVer ? localMemberAppSetting : remoteMemberAppSetting;
      const beforeMemberAppSetting = localVer > remoteVer ? remoteMemberAppSetting : localMemberAppSetting;
      // console.log('latestMemberAppSetting : ', latestMemberAppSetting);
      // console.log('beforeMemberAppSetting : ', beforeMemberAppSetting);
      await this.setState({
        latestMemberAppSetting: latestMemberAppSetting,
        beforeMemberAppSetting: beforeMemberAppSetting,
      });
      
      // const allInterests = await CommonUtil.getAllInterestCode();
      // console.log('allInterests : ', allInterests);
      // const selectedInterest = allInterests.find(item => {
      //   return item.interestFieldID.toString() === latestMemberAppSetting.settingData.interestFieldID.toString();
      // });
      // console.log('selectedInterest : ', selectedInterest);

      // 로컬/서버의 저장된 관심분야가 새로 선택한 관심분야와 서로 다른경우
      if (!CommonUtil.isEmpty(localMemberAppSetting) && CommonUtil.isEmpty(remoteMemberAppSetting)) {
        // 로컬 내역 o, 서버 내역 x => 처음 사용자, 서버 저장 & 로컬 저장
        const remoteResult = await CommonUtil.saveRemoteInterest(myInterestCodeOne.interestFieldID, myInterestCodeOne.interestFieldName);
        await CommonUtil.saveLocalMemberAppSetting(remoteResult);
        this.onLoginBack(userInfo);
      } else if (CommonUtil.isEmpty(localMemberAppSetting) && !CommonUtil.isEmpty(remoteMemberAppSetting)) {
        // 로컬 내역 x, 서버 내역 o => 기존 사용자이나 오류로 로컬 저장이 없는 경우, 서버 -> 로컬
        this.checkAndLocalSaveInterest(remoteMemberAppSetting);
      } else if (!CommonUtil.isEmpty(localMemberAppSetting) && !CommonUtil.isEmpty(remoteMemberAppSetting) && (localVer !== remoteVer)) {
        if (latestMemberAppSetting.settingData.interestFieldID !== beforeMemberAppSetting.settingData.interestFieldID) {
          // case 4) 공개 상태 관심분야 이용 중, 숨김 상태 관심분야 이용 계정으로 로그인 하는 경우
          Alert.alert(
            '',
            '이용하시던 관심분야와\n' +
            '현재 관심분야가 일치하지 않습니다.\n\n' +
            '[' + latestMemberAppSetting.settingData.interestFieldName + '](으)로\n' +
            '변경하시겠습니까?',
            [
              // {text: '확인', onPress: () => this.topShowModal()},
              {text: '확인', onPress: () => this.checkAndSetInterest(latestMemberAppSetting)},
              {text: '취소', onPress: () => this.cancelInterest(userInfo)},
            ],
          );
        } else {
          // case 3) 숨김 상태 관심분야 이용 중, 숨김 상태 관심분야 이용 계정으로 로그인 하는 경우
          localVer > remoteVer
            ? await CommonUtil.saveRemoteInterest(latestMemberAppSetting.settingData.interestFieldID, latestMemberAppSetting.settingData.interestFieldName)
            : await CommonUtil.saveLocalMemberAppSetting(latestMemberAppSetting);
        }
      }

    } else {
      this.onLoginBack(userInfo);
    }
  };
  */

  // 계정 관심분야 로컬 vs 서버 버전 비교 처리
  procInterest = async userInfo => {
    // 7/16 수정: 로컬 저장 필요 없다고 판단됨
    // 서버에 저장된 관심분야와 현재 선택한 관심분야만 비교
    const remoteMemberAppSetting = await CommonUtil.getRemoteMemberAppSetting();
    await this.setState({remoteMemberAppSetting: remoteMemberAppSetting});
    // const metaResponse = await AsyncStorage.getItem('myInterestCode');
    // const metadata = JSON.parse(metaResponse);
    // const myInterestCodeOne = await CommonUtil.getMyInterest();

    // ① 처음 로그인 : 서버 저장 없음
    if (CommonUtil.isEmpty(remoteMemberAppSetting)) {
      if (!CommonUtil.isEmpty(this.props.myInterestCodeOne)) {
        await CommonUtil.saveLocalInterest(this.props.myInterestCodeOne.info.interestFieldID, this.props.myInterestCodeOne.info.interestFieldName);
        await CommonUtil.saveRemoteInterest(this.props.myInterestCodeOne.info.interestFieldID, this.props.myInterestCodeOne.info.interestFieldName);
      }
      this.onLoginBack(userInfo);
    } else {
      // ② 서버 저장 정보 있고, 현재 관심분야와 다른 경우
      if (!CommonUtil.isEmpty(remoteMemberAppSetting) && remoteMemberAppSetting.settingData.interestFieldID !== this.props.myInterestCodeOne.info.interestFieldID) {
        if ((CommonUtil.isEmpty(this.props.myInterestCodeOne.info.interestFieldID) || CommonUtil.isEmpty(this.props.myInterestCodeOne.info.interestFieldName))) {
          await CommonUtil.removeLocalMemberAppSetting();
        }
        
        const localMemberAppSetting = await CommonUtil.saveLocalInterest(this.props.myInterestCodeOne.info.interestFieldID, this.props.myInterestCodeOne.info.interestFieldName);
        if (localMemberAppSetting) {
          this.setState({beforeMemberAppSetting: localMemberAppSetting});
        }
        // isUserInterestSync: 관심분야 계정 동기화 = true 인 경우만 Alert
        if (this.props.navigation.state.params && this.props.navigation.state.params.isUserInterestSync === true) {
          // case 4) 공개 상태 관심분야 이용 중, 숨김 상태 관심분야 이용 계정으로 로그인 하는 경우
          Alert.alert(
            '',
            '이용하시던 관심분야와\n' +
            '현재 관심분야가 일치하지 않습니다.\n\n' +
            '[' + remoteMemberAppSetting.settingData.interestFieldName + '](으)로\n' +
            '변경하시겠습니까?',
            [
              // {text: '확인', onPress: () => this.topShowModal()},
              {text: '관심분야 변경', onPress: () => this.checkAndSetInterest(remoteMemberAppSetting)},
              {text: '관심분야 유지', onPress: () => this.cancelInterest(userInfo)},
            ],
          );

        // 현재 관심분야 계정 동기화
        } else {
          this.cancelInterest(userInfo);
        }

      // ③ 기타, 관심분야 일치 : 바로 로그인 처리
      // And case 3) 숨김 상태 관심분야 이용 중, 숨김 상태 관심분야 이용 계정으로 로그인 하는 경우
      } else {
        this.onLoginBack(userInfo);
      }
    }
  };

  // 사용가능한 관심분야 체크 & 관심분야 설정
  checkAndSetInterest = async memberAppSetting => {
    const selectedInterest = await CommonUtil.getSelectedInterest(memberAppSetting.settingData.interestFieldID);
    if (CommonUtil.isEmpty(selectedInterest)) {
      this.noUseInterest();
    } else {
      await this.setState({latestMemberAppSetting: memberAppSetting});
      this.saveAndResetInterest(selectedInterest);
    }
  };

  // 사용가능한 관심분야 체크 & 로컬 저장
  checkAndLocalSaveInterest = async memberAppSetting => {
    const selectedInterest = await CommonUtil.getSelectedInterest(memberAppSetting.settingData.interestFieldID);
    if (CommonUtil.isEmpty(selectedInterest)) {
      this.noUseInterest();
    } else {
      await CommonUtil.saveLocalMemberAppSetting(memberAppSetting);
      this.onLoginBack(this.props.userToken);
    }
  };

  // 사용불가 관심분야 alert & 관심분야 모달 open
  noUseInterest = () => {
    // 로컬&서버의 저장된 관심분야가 사용중지되어 전체 관심분야 목록에 없을 경우
    // 사용 중지된 관심분야 재설정
    Alert.alert('', '현재 서비스하지 않는 관심분야입니다.\n다른 관심분야를 선택해주세요.',
      [{text: '확인', onPress: () => this.topShowModal()}]);
  }

  // reSelectInterest = async myInterestCodeOne => {
    // await CommonUtil.removeLocalMemberAppSetting();
    // if (myInterestCodeOne) {
    //   await CommonUtil.saveLocalInterest(myInterestCodeOne.interestFieldID, myInterestCodeOne.interestFieldName);
    //   await CommonUtil.saveRemoteInterest(myInterestCodeOne.interestFieldID, myInterestCodeOne.interestFieldName);
    // }
    // this.onLoginBack(userInfo);
  // };

  // 새버전으로 저장 & 관심분야 변경
  saveAndResetInterest = async selectedInterest => {
    // 서버 -> 로컬 동기화
    // 로컬, 서버 비교해 자동으로 업데이트
    // const interest = await CommonUtil.setMemberAppSetting();
    const {latestMemberAppSetting} = this.state;

    // 로컬 회원앱설정 저장
    await CommonUtil.saveLocalMemberAppSetting(latestMemberAppSetting);

    // 메인 관심분야 설정 업데이트
    const newMyInterestCode = {
      code: selectedInterest.interestFieldID,
      name: selectedInterest.interestFieldName,
      info: selectedInterest,
      color: selectedInterest.color,
    };
    
    // TEST
    // this.onLoginBack(memberIdx);

    // REAL
    await this.props._updateMyInterestOneCode(newMyInterestCode);
    await this.setMyInterest(selectedInterest.interestFieldID, selectedInterest.interestFieldName, selectedInterest, selectedInterest.color);
    this.onLoginBack(this.state.userInfo);
  };

  cancelInterest = async userInfo => {

    const {beforeMemberAppSetting} = this.state;
    // 관심분야 변경 안함 : 현재 선택한 관심분야 -> 서버로 업데이트
    if (!CommonUtil.isEmpty(beforeMemberAppSetting.settingData.interestFieldID) && !CommonUtil.isEmpty(beforeMemberAppSetting.settingData.interestFieldName)) {
      const newMemberAppSetting = await CommonUtil.saveRemoteInterest(beforeMemberAppSetting.settingData.interestFieldID, beforeMemberAppSetting.settingData.interestFieldName);
      await CommonUtil.saveLocalMemberAppSetting(newMemberAppSetting);
    }
    this.onLoginBack(userInfo);
  };

  onLoginBack = userInfo => {
    this.props.navigation.state.params && this.props.navigation.state.params.onLoginBack &&
      this.props.navigation.state.params.onLoginBack(userInfo);
    this.props.navigation.goBack(null);
    this.props.navigation.state.params && this.props.navigation.state.params.goScreen && (
      // this.props.navigation.state.params.routeIdx
      // ? this.props.navigation.navigate(this.props.navigation.state.params.goScreen, {loginMemberIdx : userInfo.memberIdx,...this.props.navigation.state.params})
      this.props.navigation.navigate(this.props.navigation.state.params.goScreen, {loginMemberIdx : userInfo.memberIdx,...this.props.navigation.state.params})
    )
  };

  setMyInterest = async (code, name, data, color) => {
    // await this.checkIndexindex(code, name, data, color);
    // RNRestart.Restart();
    // 관심분야 계정 연동 처리 (전범준)
    // 로그인 되었고, 기존 선택한 관심분야에서 변경 발생한 경우 처리
    const isLoginCheck = await CommonUtil.isLoginCheck(this.props);
    if (isLoginCheck === true) {
        // case 2) 숨김 상태 관심 분야 이용 중 관심분야 변경 시도를 하는 경우
        // 사용 가능한 관심분야로 변경 경우
        const beforeInterest = await CommonUtil.getMyInterest();
        if (!CommonUtil.isEmpty(beforeInterest)) {
            const isEnableInterest = await CommonUtil.isEnableInterest(beforeInterest.interestFieldID);
            // 기존 관심분야가 이미 숨김처리 된 경우
            if (!isEnableInterest) {
                Alert.alert('', '관심분야 변경 시, 기존에 이용 중이던 관심분야는 확인이 불가능합니다. 관심분야를 변경하시겠어요?',
                [
                    {text: '관심분야 유지', onPress: () => this.setMemberAppSetting(code,name)},
                    {text: '관심분야 변경', onPress: () => this.setMyInterest2(code,name,data,color)},
                ]);
            } else {
                this.setMyInterest2(code,name,data,color);
            }
        }
    } else {
        this.setMyInterest2(code,name,data,color);
    }
  }

  setMemberAppSetting = async (code, name) => {
      const myInterest = await CommonUtil.getMyInterest();
      if (code !== myInterest.interestFieldID) {
          const memberAppSettings = await CommonUtil.saveRemoteInterest(code, name);
          await CommonUtil.saveLocalMemberAppSetting(memberAppSettings);
      }
      this.onLoginBack(this.props.userToken);
  }

  setMyInterest2 = async (code,name,data,color) => {
      await AsyncStorage.removeItem('myInterestCode');
      await this.setBaseMyInterest();

      await this.checkIndexindex(code,name,data,color);        
      await this.setState({topShowModal: false});
      // RNRestart.Restart();
  }

  checkIndexindex = async (wcode, wname, wdata, wcolor) => {
    if (typeof wcode !== 'undefinded' || wcode !== '') {
      let dataw = [{code: wcode, name: wname, info: wdata, color: wcolor}];
      await AsyncStorage.setItem('myInterestCode', JSON.stringify(dataw[0]));
      // await this.setState({
      //   myInterestCodeOne: wdata,
      //   attentionSelectCode: wcode,
      //   attentionSelectName: wname,
      //   attentionSelectRGB: wcolor,
      // });
    }
  }

  setBaseMyInterest = async() => {
    // if ( typeof this.props.myInterestCodeOne !== 'undefined' && Object.keys(this.props.myInterestCodeOne).length > 0) {
    //   await this.setState({
    //       myInterestCodeOne : this.props.myInterestCodeOne,
    //       attentionSelectCode : this.props.myInterestCodeOne.code,
    //       attentionSelectName : this.props.myInterestCodeOne.name,
    //       attentionSelectRGB : this.props.myInterestCodeOne.color,
    //   }) 
    //   setTimeout(() => {
    //       this.setState({isLoading: true});   
    //   }, 500);
    // } else {
      try {
        let storageMyInterestCode = await AsyncStorage.getItem('myInterestCode');
        if(storageMyInterestCode !== null) {
            // await this.setState({
            //     myInterestCodeOne: JSON.parse(storageMyInterestCode),
            //     attentionSelectCode: JSON.parse(storageMyInterestCode).code,
            //     attentionSelectName: JSON.parse(storageMyInterestCode).name,
            //     attentionSelectRGB: JSON.parse(storageMyInterestCode).color,
            // });
            await this.props._updateMyInterestOneCode(JSON.parse(storageMyInterestCode));
        }else{
        }
      } catch (e) {}
    // }
  }

  topCloseModal = async () => {
    this.setState({topShowModal: false});
  };
  topShowModal = async () => {
    this.setState({topShowModal: true});
  };

  changeText = (type, text) => {
    type === 'id' ? this.setState({id: text}) : this.setState({pw: text});
    if (!CommonUtil.isEmpty(this.state.id) && !CommonUtil.isEmpty(this.state.pw)) {
      this.setState({isLoginReady: true});
    }
  };
  
  clearInputText = field => {
    this.setState({[field]: '', isLoginReady: false});
  };

  inputOnFocus = str => {
    // this.setState({inputBorderColor: DEFAULT_COLOR.lecture_base});
    this.setState({focusedInput: str});
    this._ScrollView.scrollTo({y: 150});
  };
  inputOnBlur = () => {
    // this.setState({inputBorderColor: '#e8ecf0'});
    this.setState({focusedInput: ''});
    this._ScrollView.scrollTo({y: 0});
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView ref={ref => this._ScrollView = ref}>
          <View style={styles.wrapper}>
            <View style={styles.topSection}>
              <Image source={require('../../../assets/logo/img_login_logo.png')} style={{width: 170, height: 33, marginBottom: 10}} />
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Image source={require('../../../assets/logo/icon_logo_h_small.png')} style={{width: 17, height: 13, marginRight: 5}} />
                <CustomTextB style={styles.title}>해커스 통합회원 <CustomTextDL style={{fontWeight: '300'}}>아이디로 로그인해주세요</CustomTextDL></CustomTextB>
              </View>
            </View>
            <View style={styles.formContainer}>
              <View style={[styles.inputContainer, {marginBottom: 10}, this.state.focusedInput === 'id' && styles.inputContainerOn]}>
                <Image source={require('../../../assets/icons/icon_login_id.png')} style={styles.inputIcon} />
                <View style={{width: '100%', height: 65, justifyContent: 'center'}}>
                  {this.state.focusedInput === 'id' &&
                    <CustomTextM style={{color: '#28a5ce', fontSize: PixelRatio.roundToNearestPixel(10), fontWeight: '500', letterSpacing: -0.5}}>아이디 입력</CustomTextM>
                  }
                  <TextInput
                    placeholder="아이디를 입력해 주세요."
                    value={this.state.id}
                    style={[styles.inputText, this.state.focusedInput === 'id' && {paddingVertical: 5}]}
                    onChangeText={text => {
                      this.changeText('id', text);
                    }}
                    onFocus={() => this.inputOnFocus('id')}
                    onBlur={() => this.inputOnBlur()}
                  />
                  {this.state.id !== '' && (
                  <TouchableOpacity style={{position: 'absolute', right: 10}} onPress={() => this.clearInputText('id')}>
                    <Image source={require('../../../assets/icons/btn_login_del_txt.png')} style={{width: PixelRatio.roundToNearestPixel(15), height: PixelRatio.roundToNearestPixel(15)}} />
                  </TouchableOpacity>
                  )}
                </View>
              </View>
              <View style={[styles.inputContainer, this.state.focusedInput === 'pw' && styles.inputContainerOn]}>
                <Image source={require('../../../assets/icons/icon_login_pw.png')} style={styles.inputIcon} />
                <View style={{width: '100%', height: 65, justifyContent: 'center'}}>
                  {this.state.focusedInput === 'pw' &&
                    <CustomTextM style={{color: '#28a5ce', fontSize: PixelRatio.roundToNearestPixel(10), fontWeight: '500', letterSpacing: -0.5}}>비밀번호 입력</CustomTextM>
                  }
                  <TextInput
                    secureTextEntry
                    placeholder="비밀번호를 입력해 주세요."
                    value={this.state.pw}
                    style={[styles.inputText, this.state.focusedInput === 'pw' && {paddingVertical: 5}]}
                    onChangeText={text => {
                      this.changeText('pw', text);
                    }}
                    onFocus={() => this.inputOnFocus('pw')}
                    onBlur={() => this.inputOnBlur()}
                  />
                  {this.state.pw !== '' && (
                  <TouchableOpacity style={{position: 'absolute', right: 10}} onPress={() => this.clearInputText('pw')}>
                    <Image source={require('../../../assets/icons/btn_login_del_txt.png')} style={{width: PixelRatio.roundToNearestPixel(15), height: PixelRatio.roundToNearestPixel(15)}} />
                  </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={styles.checkContainer}>
                <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} onPress={() => this.toggleAutoLogin()}>
                  <Image source={this.state.isAutoLogin ? require('../../../assets/icons/btn_check_list.png') : require('../../../assets/icons/icon_done.png') } style={{width: 15, height: 15, margin: 5}} />
                  <CustomTextR style={[styles.txtAutoLogin, this.state.isAutoLogin && styles.txtAutoLoginOn]}>자동 로그인 </CustomTextR>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={[styles.btnLogin, this.state.isLoginReady && styles.btnLoginOn]} onPress={() => this.login()}>
                <CustomTextB style={[styles.btnLoginText, this.state.isLoginReady && styles.btnLoginTextOn]}>로그인</CustomTextB>
              </TouchableOpacity>
            </View>
            {Platform.OS === 'ios' && (
                <View style={{height: SCREEN_HEIGHT * 0.2, marginTop: 38, alignItems: 'center', justifyContent: 'space-around'}}>
                    <CustomTextR style={{color: '#bbbbbb', fontSize: PixelRatio.roundToNearestPixel(12), lineHeight: 12 * 1.42, letterSpacing: -0.59}}>
                        회원가입 및 아이디 · 비밀번호 찾기는{'\n'}
                        PC 또는 모바일 웹에서 가능합니다.
                    </CustomTextR>
                    <TouchableOpacity onPress={() => {this.props.navigation.navigate('RequestToHackers');}}>
                        <CustomTextR style={{color: '#666666', fontSize: PixelRatio.roundToNearestPixel(12), lineHeight: 12 * 1.42, letterSpacing: -0.59}}>
                            불편사항 신고
                        </CustomTextR>
                    </TouchableOpacity>
                </View>
            )}
          </View>
          {Platform.OS !== 'ios' &&
            <View style={[styles.optionsLinkContainer, {marginTop: SCREEN_HEIGHT <= 550 ? 30 : 0}]}>
              <TouchableOpacity onPress={() => Linking.openURL('https://qmember.hackers.com/join?service_id='+this.state.serviceID)}>
                <CustomTextR style={styles.optionLinkText}>회원가입</CustomTextR>
              </TouchableOpacity>
              <View style={styles.optionLinkDivider}></View>
              <TouchableOpacity onPress={() => Linking.openURL('https://qmember.hackers.com/findpassword')}>
                <CustomTextR style={styles.optionLinkText}>아이디&#8231;비밀번호 찾기</CustomTextR>
              </TouchableOpacity>
              <View style={styles.optionLinkDivider}></View>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('RequestToHackers');
                }}>
                <CustomTextR style={styles.optionLinkText}>불편사항 신고</CustomTextR>
              </TouchableOpacity>
            </View>
          }
          <View style={{height: SCREEN_HEIGHT * 0.5}}></View>
        </ScrollView>

        <Modal
          onBackdropPress={this.topCloseModal}
          animationType="slide"
          //transparent={true}
          onRequestClose={() => {
            this.setState({topShowModal: false});
          }}
          style={{justifyContent: 'flex-end', margin: 0}}
          useNativeDriver={true}
          animationInTiming={300}
          animationOutTiming={300}
          hideModalContentWhileAnimating
          isVisible={this.state.topShowModal}>
          <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight }]}>
            <InterestSelect screenState={this.state} screenProps={this.props} />
          </Animated.View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  wrapper: {
    // justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 65,
    paddingHorizontal: 35,
    height: SCREEN_HEIGHT * 0.8,
  },
  topSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    color: '#222222',
    fontSize: PixelRatio.roundToNearestPixel(13),
    lineHeight: 13 * 1.42,
    textAlign: 'center',
    // margin: 10,
    // fontWeight: '300',
    letterSpacing: -0.65,
  },
  formContainer: {
    // margin: 10,
    // marginTop: 40,
  },
  inputContainer: {
    backgroundColor: '#f1f3f5',
    borderWidth: 1,
    borderColor: '#e8ecf0',
    borderRadius: 7,
    width: '100%',
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    // paddingVertical: 16,
    paddingHorizontal: 20,
  },
  inputContainerOn: {
    borderColor: DEFAULT_COLOR.lecture_base,
    backgroundColor: '#fff',
  },
  input: {
    // flexDirection: 'row',
    // width: '90%',
  },
  inputIcon: {
    width: 18, height: 18, marginRight: 20
  },
  inputText: {
    // flex: 1,
    // height: 50,
    // padding: 10,
    width: '100%',
    padding: 0,
    paddingVertical: Platform.OS === 'ios' ? 16 : 10,
    // paddingVertical: 16,
    fontSize: PixelRatio.roundToNearestPixel(14),
    letterSpacing: -0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputDescText: {
    color: DEFAULT_COLOR.lecture_base,
  },
  checkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  chkAutoLogin: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
  },
  chkAutoLoginOff: {
    backgroundColor: '#efefef',
  },
  chkAutoLoginOn: {
    backgroundColor: 'yellow',
  },
  txtAutoLogin: {
    color: '#888888', fontSize: PixelRatio.roundToNearestPixel(12), lineHeight: 12 * 1.42, letterSpacing: -0.6
  },
  txtAutoLoginOn: {
    color: '#222222'
  },
  btnLogin: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#cccccc',
    marginTop: 26,
  },
  btnLoginOn: {
    backgroundColor: DEFAULT_COLOR.lecture_base,
  },
  btnLoginText: {
    color: '#888888',
    fontSize: PixelRatio.roundToNearestPixel(16),
    fontWeight: 'bold',
    lineHeight: 16 * 1.42,
    letterSpacing: -0.8,
  },
  btnLoginTextOn: {
    color: '#ffffff',
  },
  optionsLinkContainer: {
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 30,
    // position: 'absolute',
    // bottom: 20,
  },
  optionLinkText: {
    color: '#666',
    fontSize: PixelRatio.roundToNearestPixel(12),
    lineHeight: 12 * 1.42,
    letterSpacing: -0.6,
  },
  optionLinkDivider: {
    width: 1,
    height: 11,
    backgroundColor: '#e8e8e8',
  },
  modalContainer: {paddingTop: 16, backgroundColor: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8},
});

function mapStateToProps(state) {
  return {
    userToken: state.GlabalStatus.userToken,
    userInfo: state.GlabalStatus.userInfo,
    myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    _saveUserToken:(str)=> {
        dispatch(ActionCreator.saveUserToken(str))
    },
    _updateMyInterestOneCode: str => {
      dispatch(ActionCreator.updateMyInterestOneCode(str));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(IntroScreen);

// export default IntroScreen;
