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
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { CheckBox } from 'react-native-elements';
const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");
//공통상수
import  * as getDEFAULT_CONSTANTS   from './src/Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import {CustomTextM,CustomTextR, CustomTextB, TextRobotoM,TextRobotoR} from './src/Style/CustomText';


import 'moment/locale/ko'
import  moment  from  "moment";
import CommonFunction from './src/Utils/CommonFunction';
import CommonUtil from './src/Utils/CommonUtil';
const TodayTimeStamp = moment()+840 * 60 * 1000;  // 서울
const Tomorrow = moment(Tomorrow).add(1, 'day').format('YYYY-MM-DD');
const Tomorrow7 = moment(Tomorrow).add(7, 'day').format('YYYY-MM-DD');



class NetworkDisabled extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            item : this.props.screenState.popLayer[0],
            agreeCheck : false,
            imgwidth : 0,
            imgheight : 0,
            imgWrapperWidth : SCREEN_WIDTH-20,
            imgWrapperHeight : SCREEN_WIDTH
        } 

        console.log("screenData",this.props.screenState.popLayer)
    }

    async UNSAFE_componentWillMount() {
        console.log('this.state.item.image', this.state.item.image);
        await Image.getSize(this.state.item.image, (width, height) => {                     
            if ( width > height) {
                // console.log('parseInt((SCREEN_WIDTH)*(height/width)  width)',SCREEN_WIDTH-40);
                // console.log('parseInt((SCREEN_WIDTH)*(height/width)  height)',parseInt((SCREEN_WIDTH)*(height/width)));
                // console.log('parseInt((SCREEN_WIDTH)*(height/width)  height)',parseInt((SCREEN_WIDTH)*(width/height)));
                this.setState({ 
                    imgwidth: SCREEN_WIDTH-40, 
                    imgheight: parseInt((SCREEN_WIDTH)*(width/height)),
                    imgWrapperWidth : SCREEN_WIDTH-40,
                    imgWrapperHeight : parseInt((SCREEN_WIDTH)*(height/width)) > SCREEN_HEIGHT ? SCREEN_HEIGHT-50 : parseInt((SCREEN_WIDTH)*(height/width)),
                });
            }else{
                //console.log('parseInt((SCREEN_WIDTH)*(height/width)22222)', parseInt((SCREEN_WIDTH)*(width/height)));
                this.setState({ 
                    imgwidth: SCREEN_WIDTH-40, 
                    imgheight: parseInt((SCREEN_WIDTH)*(height/width)) ,
                    imgWrapperWidth : SCREEN_WIDTH-60,
                    imgWrapperHeight : parseInt((SCREEN_WIDTH)*(height/width)) > SCREEN_HEIGHT ? SCREEN_HEIGHT-50 : parseInt((SCREEN_WIDTH)*(height/width)-20),
                });
            }                
            
        });
    }

    componentDidMount() {     
        //console.log('imgwidth', this.state.imgwidth);
        //console.log('imgheight', this.state.imgheight);
    }

    openBrower = async(url) => {
        if ( url ) {
            Linking.openURL(url);
        }
    }
    closePopLayer = async() => {
        console.log('11111')
        this.props.screenState.closePopLayer(false)
    }

    closePopLayer2 = async( data,bool ) => {
        console.log("bool",bool)
        this.setState({agreeCheck : !bool})
        if ( !bool ) {
            await this.setupStorage(data);
        } else {
            if (!CommonUtil.isEmpty(this.props.myInterestCodeOne)) {
                await AsyncStorage.removeItem('popLayerExpireTime_' + this.props.myInterestCodeOne.code);
            }
        }       

    }


    setupStorage = async(data) => {
        const ExpireDate = data.displayOption == 7  ?  Date.parse(new Date(Tomorrow7 + 'T04:00:00')) : Date.parse(new Date(Tomorrow + 'T04:00:00'));
        console.log("ExpireDate",ExpireDate)
        try {
            if (!CommonUtil.isEmpty(this.props.myInterestCodeOne)) {
                await AsyncStorage.setItem('popLayerExpireTime_' + this.props.myInterestCodeOne.code, ExpireDate.toString());
            }
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
                    style={{width:this.state.imgWrapperWidth,height:this.state.imgWrapperHeight,alignItems:'center',overflow:'hidden',backgroundColor:'#fff',borderRadius:15}}
                >
                    <TouchableOpacity 
                         style={{flex:4,justifyContent:'center',alignItems:'center'}}
                         onPress= {()=> {this.openBrower(this.state.item.url)}}
                    >
                        { 
                        this.state.imgheight > this.state.imgwidth
                        ?
                        <ImageBackground 
                            source={{uri:this.state.item.image}}
                            resizeMode='contain' //this.imgOpacity
                            style={{height: this.state.imgheight-60, width:this.state.imgwidth}}
                            //blurRadius={Platform.OS === 'ios' ? 15 : 5}
                        />
                        :                        
                        <ImageBackground 
                            source={{uri:this.state.item.image}}
                            resizeMode='contain' //this.imgOpacity
                            style={{height: this.state.imgheight, width:this.state.imgwidth}}
                            //blurRadius={Platform.OS === 'ios' ? 15 : 5}
                        />
                        }
                    </TouchableOpacity>
                    
                    <View style={{zIndex:10,flex: CommonFunction.isIphoneX ? 0.5 : 0.7,flexDirection:'row',justifyContent:'center',alignItems:'center',minHeight:20}}>
                        <View style={{flex:5,paddingTop:10}}>
                            { this.state.item.displayOption > 0 &&
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
                                 { this.state.item.displayOption == 7 ? '일주일' : '하루'}동안 보지 않기
                                </CustomTextR>
                            </View>
                            }
                        </View>
                        <TouchableOpacity 
                            style={{flex:1,justifyContent:'center',alignItems:'center',paddingTop:10}}
                            hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
                            onPress= {()=> {this.closePopLayer()}}
                        >
                          <Image source={require('./assets/icons/btn_feed_del.png')} resizeMode='contain' style={{width:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}/>
                        </TouchableOpacity>
                    </View>
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

function mapStateToProps(state) {
    return {
        myInterestCodeOne : state.GlabalStatus.myInterestCodeOne,
    };
}

export default connect(mapStateToProps)(NetworkDisabled);