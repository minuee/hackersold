import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    Text,
    Dimensions,
    ActivityIndicator,
    PixelRatio
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Toast from 'react-native-tiny-toast';
import CommonUtil from '../../Utils/CommonUtil';
import { CustomTextR, CustomTextM } from '../../Style/CustomText';

// HTML
import HTMLConvert from '../../Utils/HtmlConvert/HTMLConvert';
const IMAGES_MAX_WIDTH = SCREEN_WIDTH - 50;
const CUSTOM_STYLES = {};
const CUSTOM_RENDERERS = {};
const DEFAULT_PROPS = {
    htmlStyles: CUSTOM_STYLES,
    renderers: CUSTOM_RENDERERS,
    imagesMaxWidth: IMAGES_MAX_WIDTH,
    onLinkPress: (evt, href) => { Linking.openURL(href); },
    debug: true,
};

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

export default class IntruduceScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true
        }
    }

    UNSAFE_componentWillMount() {
        if ( this.props.screenState.baseBookInfo.bookIdx && this.props.screenState.baseBookInfo.bookIdx !== 0 ) {
        } else {
            let msg = '';
            if (!CommonUtil.isEmpty(this.props.screenState.bookInfoResult) && this.props.screenState.bookInfoResult.code !== '0000') {
                msg = this.props.screenState.bookInfoResult.message || '';
            }
            this.failCallAPi(msg);
        }
    }    

    componentDidMount() {        
        setTimeout(() => {
            this.setState({loading:false})
        }, 500)    
    }

    UNSAFE_componentWillUnmount() {
        
    }  

    
    shouldComponentUpdate(nextProps, nextState) {      
        //console.log('main shouldComponentUpdate nextState',nextState);          
        return true;
    }
    

    onLayoutHeader1 = (evt ) => {
        //console.log('height intro',evt.nativeEvent.layout);    
        //this.props.screenState.tabsSetupHeight(1,evt.nativeEvent.layout.height)
    }

    failCallAPi = (msg) => {
        const toastMessage = msg || '데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요';
        const alerttoast = Toast.show(toastMessage);
        setTimeout(() => {
            Toast.hide(alerttoast);
        }, 2000);
    }

    render() {
        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        }else {
            return(
                <View
                    style={[ styles.container, {backgroundColor: '#eaebee'} ]}
                    onLayout={(e)=>this.onLayoutHeader1(e)}
                >
                    <View style={{backgroundColor: '#fff', width: '100%', padding: 20}}>
                        {/* <HTMLConvert
                            {...DEFAULT_PROPS}
                            html={this.props.screenState.baseBookInfo.bookInfo.description && CommonUtil.stripSlashes(this.props.screenState.baseBookInfo.bookInfo.description) || ''}
                        /> */}
                        <CustomTextR style={{fontSize: DEFAULT_TEXT.fontSize13, color: DEFAULT_COLOR.base_color_666, letterSpacing: PixelRatio.roundToNearestPixel(-0.65)}}>{this.props.screenState.baseBookInfo.bookInfo.description}</CustomTextR>
                    </View>
                    {!CommonUtil.isEmpty(this.props.screenState.baseBookInfo.bookInfo) && this.props.screenState.baseBookInfo.bookInfo.canBuyInside === true && !CommonUtil.isEmpty(this.props.screenState.baseBookInfo.bookInfo.infoMsg) &&
                        <View style={{backgroundColor: '#fff', width: '100%', padding: 20, marginTop: 10}}>
                        {this.props.screenState.baseBookInfo.bookInfo.infoMsg.map((item, index) => {
                            return (
                            <View style={{backgroundColor: '#fff', width: '100%', padding: 20, marginVertical: 10, borderBottomColor: '#e8e8e8', borderBottomWidth: 1}} key={index}>
                                <CustomTextM style={{fontSize: DEFAULT_TEXT.fontSize15, color: DEFAULT_COLOR.base_color_222, letterSpacing: PixelRatio.roundToNearestPixel(-0.75), marginBottom: 10}}>{item.title || ''}</CustomTextM>
                                <CustomTextR style={{fontSize: DEFAULT_TEXT.fontSize13, color: DEFAULT_COLOR.base_color_666, letterSpacing: PixelRatio.roundToNearestPixel(-0.65)}}>{item.content || ''}</CustomTextR>
                            </View>);
                        })}
                        </View>
                    }
                </View>
            );
        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding:20,
        alignItems:'center',
        justifyContent:'flex-start',
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