import React from 'react';
import { Platform} from 'react-native';
import IMP from 'iamport-react-native';

import Loading from '../Loading';

import { getUserCode } from '../utils';

//공통상수
import COMMON_STATES from '../../../Constants/Common';


export default function Payment({ navigation }) {
  
  const params = navigation.getParam('params');
  const { pg } = params;
  const resultScreen = params.resultScreen ? params.resultScreen : 'PaymentResult'
  const data = {
    ...params,
    app_scheme: Platform.OS === 'android' ? COMMON_STATES.androidPackageName : COMMON_STATES.iosBundleId,
  };
  
  console.log('Payment/index.js', 'data = ' + JSON.stringify(data))
  return (
    <IMP.Payment
      userCode={getUserCode(pg)}
      loading={<Loading />}
      data={data}
      callback={response => navigation.replace(resultScreen, { response, 'settleData' : data })}
    />
  );   
}