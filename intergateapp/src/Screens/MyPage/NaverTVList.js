import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Image,
    View,
    StyleSheet,
    Text,
    PixelRatio,
    Dimensions,
    BackHandler,
    ActivityIndicator,
    TouchableOpacity,
    Linking
} from 'react-native';
import { NavigationEvents } from 'react-navigation';

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import { CustomTextM,CustomTextR }   from '../../Style/CustomText';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

export default  class NaverTVList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            itemList: props.screenState.contentItems.sns.NAVERTV || []
        }
    }

    UNSAFE_componentWillMount() {

    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.setState({loading:false});
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보

    }

    UNSAFE_componentWillReceiveProps(nextProps) {

    }

    componentWillUnmount(){
        if(this.timeout){
            clearInterval(this.timeout);
        }
    }

    handleBackButton = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        this.props.navigation.goBack(null);
        this.props.navigation.toggleDrawer();
        return true;
    };

    _historyBack = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        this.props.navigation.goBack(null);
        this.props.navigation.toggleDrawer();
    }

    render() {
        if ( false ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        }else {
            return(
                <View style={ styles.container }>
                    <NavigationEvents
                        onWillFocus={payload => {

                        }}
                        onWillBlur={payload => {

                        }}
                    />
                    {
                        this.state.itemList.length === 0 ?

                            <View style={[styles.itemWrap,{flex:1, alignItems: 'center', justifyContent: 'center', height: '100%'}]}>
                                <Image
                                    style={{
                                        width: 65,
                                        height: 65,
                                        marginBottom: 15,
                                    }}
                                    source={require('../../../assets/icons/icon_none_exclamation.png')}
                                />
                                <CustomTextR
                                    style={{
                                        color: DEFAULT_COLOR.base_color_666,
                                        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),
                                        lineHeight: DEFAULT_TEXT.body_14 * 1.42,
                                    }}
                                >검색 결과가 없습니다.
                                </CustomTextR>
                            </View>

                            :
                            this.state.itemList.map((titem, index) => {
                                return(
                                    <View
                                        key={index}
                                        style={{
                                            flexDirection:'row',
                                            marginHorizontal:20,
                                            borderBottomWidth:1,
                                            borderBottomColor:'#ccc',
                                            paddingVertical:5,
                                            justifyContent:'center'
                                        }}
                                    >
                                        <View style={{flex:5}}>
                                            <CustomTextM
                                                numberOfLines={1} ellipsizeMode = 'tail'
                                                style={{
                                                    color:DEFAULT_COLOR.base_color_222,
                                                    fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),
                                                    lineHeight: PixelRatio.roundToNearestPixel(20.1),
                                                    letterSpacing: -0.79,
                                                    paddingTop:10,
                                                    paddingBottom:5,
                                                }}>
                                                {titem.siteName}
                                            </CustomTextM>
                                            <CustomTextR
                                                style={{
                                                    color: DEFAULT_COLOR.base_color_888,
                                                    fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),
                                                    letterSpacing: 0,
                                                    paddingBottom: 10,
                                                }}
                                                numberOfLines={1}
                                            >{titem.siteDesc}</CustomTextR>
                                            {/*
                                            <TextRobotoM
                                                style={{
                                                    color:DEFAULT_COLOR.lecture_base,
                                                    fontSize:PixelRatio.roundToNearestPixel(11),
                                                    paddingBottom:10,
                                                    lineHeight:11 * 1.42,
                                                }}
                                                numberOfLines={1}
                                            >{titem.siteUrl.replace('https://', '').replace('http://', '')}</TextRobotoM>
                                            */}
                                        </View>
                                        <TouchableOpacity
                                            style={{flex:1,justifyContent:'center',alignItems:'center'}}
                                            onPress={() => Linking.openURL(titem.siteUrl)}
                                        >
                                            <Image source={require('../../../assets/icons/btn_external_link.png')} style={{width:PixelRatio.roundToNearestPixel(35),height:PixelRatio.roundToNearestPixel(35)}} />
                                        </TouchableOpacity>

                                    </View>
                                )
                            })
                    }
                </View>
            );
        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        //height: 300,
        marginTop: 15,
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