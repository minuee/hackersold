import React from 'react';
import {SafeAreaView,Image,View,StyleSheet,PixelRatio,Dimensions,Platform} from 'react-native';
import {createStackNavigator, HeaderTitle} from '@react-navigation/stack';
import IntroScreen from './IntroScreen'; 
const Stack = createStackNavigator();
const BACK_BUTTON_IMAGE = require('../../../assets/icons/back_icon.png');
const LOGO_IMAGE = require('../../../assets/icons/logo.png');
//공통상수 필요에 의해서 사용
import CommonUtil  from '../../Utils/CommonUtil';


const Tabs04Stack = ({navigation,route}) => {
    return (
      <Stack.Navigator 
        initialRouteName="IntroScreen" 
        screenOptions={{          
              headerLeft : (props) => (<View style={{flex:1,flexGrow:1}} />),                     
              headerTitle : () => (
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Image
                        source={LOGO_IMAGE}
                        resizeMode={"contain"}
                        style={{ width:CommonUtil.dpToSize(60),height:CommonUtil.dpToSize(40)}}
                    />
                </View>
              ),
              headerRight : (props) => (<View style={{flex:1,flexGrow:1}} />)
          }}
      >
          <Stack.Screen name="IntroScreen">
                {props => <IntroScreen {...props} extraData={route} />}
          </Stack.Screen>     
      </Stack.Navigator>
    );
};

export default Tabs04Stack;
