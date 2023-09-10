import React, { Component } from 'react';
import {
    SafeAreaView,
    PixelRatio,
    View,
    StyleSheet,
    StatusBar,
    Image,
    TouchableOpacity,
    Dimensions,
    ImageBackground,
    Linking,
    ActivityIndicator
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from '@react-native-community/async-storage';
import { CheckBox } from 'react-native-elements';
const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");
//공통상수
import  * as getDEFAULT_CONSTANTS from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import {CustomTextM,CustomTextR, CustomTextB, TextRobotoM,TextRobotoR} from '../../Style/CustomText';


import 'moment/locale/ko'
import  moment  from  "moment";
import CommonFunction from '../../Utils/CommonFunction';

import { isIphoneX, getBottomSpace } from "react-native-iphone-x-helper";

export default  class MP3DownPopLayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            agreeCheck : false,
        }
    }
    openBrower = async(url) => {
        if ( url ) {
            Linking.openURL(url);
        }
    }

    closePopLayer = async() => {
        this.props.screenState.closePopLayer(false)
    }

    closePopLayer2 = async() => {
        await this.setupStorage();
    }

    setupStorage = async() => {
        const Tomorrow7 = moment().add(7, 'days').valueOf();
        const ExpireDate = Date.parse(new Date(Tomorrow7))
        console.log("mp3DownPopLayer.js > setupStorage()", 'ExpireDate = ' + ExpireDate)

        try {
            await AsyncStorage.setItem('mp3PopLayerExpireTime', ExpireDate.toString());
            this.closePopLayer()
        } catch (e) {
            console.log(e);
        }
    }
 
    render() {

        return( 
            
            <View style={ styles.container }>
                {
                    Platform.OS === 'android' && <StatusBar barStyle={"dark-content"} backgroundColor={'#333'} animated={true} hidden={false}/>
                }
                { 
                this.state.imgwidth === 0
                ?
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
                :
                <View 
                    //style={{flex:1,marginVertical:CommonFunction.isIphoneX ? 30 : 0,marginHorizontal:0,backgroundColor:'#fff',borderRadius:20,overflow:'hidden'}}
                    style={{
                        width: SCREEN_WIDTH * 0.7,
                        height: isIphoneX() ? SCREEN_HEIGHT * 0.6 : SCREEN_HEIGHT * 0.7,
                        alignItems: 'center',
                        overflow: 'hidden',
                        backgroundColor: '#fff',
                        borderRadius: 15
                    }}
                >
                    {/*
                    <TouchableOpacity 
                         style={{flex:4,justifyContent:'center',alignItems:'center'}}
                         onPress= {()=> {this.openBrower(this.state.item.url)}}
                    >
                        <ImageBackground
                            source={require('../../../assets/images/img_1040_x_1010.png')}
                            resizeMode='contain' //this.imgOpacity
                            style={{height: SCREEN_HEIGHT / 2, width: SCREEN_WIDTH * 0.9}}
                            //blurRadius={Platform.OS === 'ios' ? 15 : 5}
                        />
                    </TouchableOpacity>

                    <View>
                        <CustomTextR> 테스트 메세지 입니다</CustomTextR>
                    </View>
                    */}

                    {/* 상단 이미지 영역 */}
                    <View style={{ flex: 6.5 }}>
                        <Image
                            source={require('../../../assets/images/img_1040_x_1010.png')}
                            resizeMode='contain' //this.imgOpacity
                            style={{flex: 1,}}
                            //blurRadius={Platform.OS === 'ios' ? 15 : 5}
                        />
                    </View>

                    {/* 하단 컨텐츠 영역 */}
                    <View style={{ flex: 3.5, width: SCREEN_WIDTH * 0.7, }}>

                        {/* 상단 텍스트 영역 */}
                        <View style={{
                            flex: 7,
                        }}>

                            {/* 안내 메세지 영역 */}
                            <View style={{
                                flex: 4,
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                            }}>
                                <CustomTextR
                                    style={{
                                        textAlign: 'center',
                                        color: DEFAULT_COLOR.base_color_888,
                                        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize10),
                                        lineHeight: PixelRatio.roundToNearestPixel(14),
                                        letterSpacing: -0.5,
                                    }}
                                >
                                    해커스 MP3에서는 음원 스트리밍과{"\n"}
                                    다운로드 서비스를 모두 이용하실 수 있습니다
                                </CustomTextR>
                            </View>

                            {/* 다운로드 버튼 영역 영역 */}
                            <View style={{
                                flex: 6,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                {/*
                                <LinearGradient
                                    start={{x: 0.0, y: 1.0}}
                                    end={{x: 1.0, y: 1.0}}
                                    colors={['#f7a6ff', '#826af1']}
                                    style={{
                                        borderRadius: 14,
                                        margin: 10,
                                        backgroundColor: '#fff',
                                        width: 130,
                                        height: 37,
                                    }}>
                                    */}
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: '#fff',
                                            width: 128,
                                            height: 37,
                                            borderWidth: 1,
                                            borderColor: '#826af1',
                                            borderRadius: 14,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        onPress={() => {
                                            this.props.screenState.closePopLayerAndOpenStore()
                                        }}
                                        >

                                        <CustomTextR
                                            style={{
                                                textAlign: 'center',
                                                color: '#755ce0',
                                                fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),
                                                lineHeight: PixelRatio.roundToNearestPixel(53.4),
                                                letterSpacing: 0,
                                                //padding: 15,
                                            }}
                                        >
                                            다운로드
                                        </CustomTextR>
                                    </TouchableOpacity>
                                {/*
                                </LinearGradient>
                                */}
                            </View>

                        </View>

                        {/* 하단 푸터 영역 */}
                        <View style={{
                            flex: 3,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: 15,
                            borderTopColor: '#e8e8e8',
                            borderTopWidth: 1,
                        }}>
                            <View style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    onPress={()=> {
                                        this.setState({
                                            agreeCheck: !this.state.agreeCheck
                                        }, function() {
                                            this.closePopLayer2()
                                        })
                                    }}>
                                    <Image
                                        style={{ width: 23, height: 23 }}
                                        source={
                                            this.state.agreeCheck
                                                ? require('../../../assets/icons/btn_check_bl_on.png')
                                                : require('../../../assets/icons/btn_check_off.png')
                                        }
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={{
                                flex: 8,
                                paddingHorizontal: 8,
                            }}>
                                <CustomTextR
                                    style={{
                                        color: DEFAULT_COLOR.base_color_222,
                                        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),
                                        lineHeight: PixelRatio.roundToNearestPixel(18),
                                        letterSpacing: -0.6,
                                    }}
                                    >
                                    일주일간 보지 않기
                                </CustomTextR>
                            </View>

                            <View style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    onPress={()=> this.closePopLayer()}>
                                    <Image
                                        style={{ width: 16.3, height: 16.3 }}
                                        source={require('../../../assets/icons/btn_close_pop.png')}
                                        />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>


                    {/*
                    <View style={{
                        flex: 4,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: 20,
                        backgroundColor: '#00FF00',
                    }}>
                        <View style={{flex:5,paddingTop:10}}>
                            {
                                <View style={{flex:1,flexGrow:1,flexDirection:'row',alignItems:'center'}}>
                                    <CheckBox
                                        containerStyle={{padding:0,margin:0}}
                                        iconType='font-awesome'
                                        checkedIcon='check-circle'
                                        uncheckedIcon='check-circle'
                                        checkedColor={DEFAULT_COLOR.base_color_222}
                                        uncheckedColor={DEFAULT_COLOR.input_bg_color}
                                        onPress= {()=> {
                                        this.closePopLayer2(this.state.item,this.state.agreeCheck)
                                        }}
                                        checked={this.state.agreeCheck}
                                    />
                                    <CustomTextR  style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12)}}>
                                     일주일간 보지 않기
                                    </CustomTextR>
                                </View>
                            }
                        </View>
                        <TouchableOpacity 
                            style={{flex:1,justifyContent:'center',alignItems:'center',paddingTop:10}}
                            hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
                            onPress= {()=> {this.closePopLayer()}}
                        >
                          <Image source={require('../../../assets/icons/btn_feed_del.png')} resizeMode='contain' style={{width:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}/>
                        </TouchableOpacity>
                    </View>
                    */}
                </View> 
                }
               
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center'
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
});