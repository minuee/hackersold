import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Image,
    Text,
    Dimensions,
    PixelRatio
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

export default class RenderMaking extends Component {
    constructor(props) {
        super(props);
    }



    render() {
       
        return(
            <View style={{width:SCREEN_WIDTH,marginVertical:50,alignItems:'center',justifyContent:'center'}}>
                <Image 
                    source={require('../../../assets/icons/icon_none_exclamation.png')} 
                    style={{width:PixelRatio.roundToNearestPixel(65),height:PixelRatio.roundToNearestPixel(65)}}
                />
                <Text style={{paddingTop:10}}>현재 제공하지 않는 서비스입니다</Text>
            </View>
        );
       
    }
}

