import React, { Component } from 'react';
import {
    Platform,
    PanResponder,
    ScrollView,
    View,
    StyleSheet,
    Linking,
    Text,
    Image,
    Dimensions,
    StatusBar,
    BackHandler,
    TouchableOpacity,
    ActivityIndicator,
    PixelRatio,
    SafeAreaView
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import ParallaxScrollView from './ParallaxScrollView';
import Toast from 'react-native-tiny-toast';
import { NavigationEvents } from 'react-navigation';
import {ScrollableTabView, ScrollableTabBar}  from '../../Utils/TopTabs'
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/Feather';
Icon2.loadFont();
import Swiper from '../../Utils/ViewPager';

import FamilySiteList from './FamilySiteList';
import AppList from './AppList';
import YouTubeList from './YouTubeList';
import InstagramList from './InstagramList';
import FacebookList from './FacebookList';
import TwitterList from './TwitterList';
import NaverTVList from './NaverTVList';
import KakaoTalkChannelList from './KakaoTalkChannelList';
import NaverPostList from './NaverPostList';
import NaverBlogList from './NaverBlogList';
import KakaoStoryList from './KakaoStoryList';

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import { CustomTextB, CustomTextR, }   from '../../Style/CustomText';


const {width: SCREEN_WIDTH,height : SCREEN_HEIGHT} = Dimensions.get("window");
const IconsPaddingTop = Platform.OS === 'android' ? 10 : 20
const IconsPaddingMinus = Platform.OS === 'android' ? 40 : 0

export default class  HackersFamily extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            isVisibleOveray : false,
            focusTab : 0,
            beforeFocusTab : 0,
            selectedSample : 1,
            headerHeight : 0,
            topMenu  : [
                {index:1,title : '패밀리사이트'},
                {index:2,title : 'APP'},
                {index:3,title : 'youtube'},
                {index:4,title : 'instagram'},
                {index:5,title : 'facebook'},
                {index:6,title : 'twitter'},
                {index:7,title : '네이버TV'},
                {index:10,title : '블로그'},
                {index:9,title : '포스트'},
                {index:8,title : '플러스친구'},
                {index:11,title : '카카오스토리'},
            ],
            itemlist :[],
            contentItems: []
        }
    }

    static navigationOptions = {
        header: null
    }

    UNSAFE_componentWillMount() {                
        if ( Platform.OS === 'android') {
            setTimeout(() => {
                this.androidStatusSetup(true);
            }, 500)
        }
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }  

    componentDidMount() {     
        this.loadItem();
        
    }

    loadItem = async() => {

        const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/family';
        await CommonUtil.callAPI(url)
            .then(response => {

                
                if (response && response.code === '0000') {
                    this.setState({
                        loading: false,
                        contentItems: response.data,
                    })

                }

                else {
                    this.setState({loading: false});
                    response.message
                        ? Toast.show(response.message)
                        : Toast.show('패밀리 목록을 불러오는데 실패 했습니다.');
                }}).catch(error => {
                console.log(error)
                this.setState({
                    loading: false,
                });
                Toast.show('시스템 에러: 패밀리 목록을 불러오는데 실패 했습니다.');
            });
    }

    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보        
        
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
     
    }

    componentWillUnmount(){       
        if ( Platform.OS === 'android') {
            this.androidStatusSetup(false)
        } 
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
    }
    
    _historyBack(){        
        if ( Platform.OS === 'android') {
            this.androidStatusSetup(false)
        }  
        this.props.navigation.goBack(null);
        this.props.navigation.toggleDrawer();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton); 
       
    }

    handleBackButton = () => {
        if ( Platform.OS === 'android') {
            this.androidStatusSetup(false)
        }  
        this.props.navigation.goBack(null);
        this.props.navigation.toggleDrawer();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton); 
        return true;
    };

    selectSampleKeyword = async(idx) => {
        this.setState({selectedSample : idx});
    }

    goWriteForm = async() => {
        await this.setState({isVisibleOveray:false});
        this.props.navigation.navigate('FreeBoardWrite');    
    }


    checkMyContent = () => {
        
    }

    onLayout = () => {
        this.refs.TargetElement.measure((x, y, width, height, pageX, pageY) => {        
            this.setState({
                headerHeight : pageY/2
            })
        })
    }

    androidStatusSetup = async(bool) => {    
        if ( bool ) {            
            //StatusBar.setBarStyle("light-content");
            //StatusBar.setBackgroundColor("transparent");
        }else{            
            //StatusBar.setBackgroundColor("rgba(0,0,0,0)");
        }
        if (Platform.OS === "android") {            
            StatusBar.setTranslucent(bool);
        }
    }

    render() {
        if(this.state.loading) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        } else {
            const topNotice = CommonFuncion.fn_division(this.state.contentItems,3);
            return(
                <View style={ styles.container } onLayout={this.onLayout}>
                    { 
                    Platform.OS === 'android' && <StatusBar barStyle={"light-content"} backgroundColor={DEFAULT_COLOR.lecture_base} animated={true} hidden={false}/>
                    }  
                    <NavigationEvents
                        onWillFocus={payload => {
                            if (Platform.OS === "android") {
                                StatusBar.setBackgroundColor("transparent");
                                this.androidStatusSetup(true)
                            }
                            
                            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);            
                        }}
                        onWillBlur={payload => {
                            if (Platform.OS === "android") {
                                this.androidStatusSetup(false)
                                StatusBar.setBackgroundColor("#ffffff");
                            }
                            
                            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
                        }}
                    />                 
                    <ParallaxScrollView
                        windowHeight={SCREEN_HEIGHT * 0.35/*SCREEN_HEIGHT * 0.35*/}
                        backgroundSource={'family'}
                        navBarHeight={ Platform.OS === 'android' ? 75 :  CommonFuncion.isIphoneX() ? 65 : 55}
                        navBarColor='#ff0000'
                        navBarTitle=''
                        navBarView={false}
                        lectureName={'해커스만의\n다양하고 유익한 정보'}
                        textbookTitle=''
                        markImage={''}
                        leftIcon={{name: 'left', color: '#fff', size: 20, type: 'font-awesome'}}
                        centerTitle={'해커스 패밀리'}
                        leftIconOnPress={()=>this._historyBack()}
                        //leftIconOnPress={()=>this.props.navigation.toggleDrawer()}
                        rightIcon={null}   
                        screenProps={this.props}
                    >
                        <View style={styles.contentDataWrapper}>
                            <View
                                style={{flexDirection:'row',backgroundColor:'transparent'}}
                                ref="TargetElement" 
                            >
                                <View style={{width:SCREEN_WIDTH,zIndex:5}}>
                                    <ScrollView
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        >
                                    {
                                        this.state.topMenu.map((xitem,xindex)=> {

                                            /*
                                            topMenu  : [
                                                {index:1,title : '패밀리사이트'},
                                                {index:2,title : 'APP'},
                                                {index:3,title : 'YouTube'},
                                                {index:4,title : 'Instagram'},
                                                {index:5,title : 'Facebook'},
                                                {index:6,title : 'Twitter'},
                                                {index:7,title : 'NaverTV'},
                                                {index:8,title : 'KakaoTalkChannel'},
                                                {index:9,title : 'NaverPost'},
                                                {index:10,title : 'NaverBlog'},
                                                {index:11,title : 'KakaoStory'},
                                            ],
                                             */

                                            if(
                                                (xitem.index == 1 && (this.state.contentItems.sns.HACKERSFAMILY == null || this.state.contentItems.sns.HACKERSFAMILY.length == 0))
                                                || (xitem.index == 2 && (this.state.contentItems.app == null || this.state.contentItems.app.length == 0))
                                                || (xitem.index == 3 && (this.state.contentItems.sns.YOUTUBE == null || this.state.contentItems.sns.YOUTUBE.length == 0))
                                                || (xitem.index == 4 && (this.state.contentItems.sns.INSTAGRAM == null || this.state.contentItems.sns.INSTAGRAM.length == 0))
                                                || (xitem.index == 5 && (this.state.contentItems.sns.FACEBOOK == null || this.state.contentItems.sns.FACEBOOK.length == 0))
                                                || (xitem.index == 6 && (this.state.contentItems.sns.TWITTER == null || this.state.contentItems.sns.TWITTER.length == 0))
                                                || (xitem.index == 7 && (this.state.contentItems.sns.NAVERTV == null || this.state.contentItems.sns.NAVERTV.length == 0))
                                                || (xitem.index == 8 && (this.state.contentItems.sns.KAKAOTALKCHANNEL == null || this.state.contentItems.sns.KAKAOTALKCHANNEL.length == 0))
                                                || (xitem.index == 9 && (this.state.contentItems.sns.NAVERPOST == null || this.state.contentItems.sns.NAVERPOST.length == 0))
                                                || (xitem.index == 10 && (this.state.contentItems.sns.NAVERBLOG == null || this.state.contentItems.sns.NAVERBLOG.length == 0))
                                                || (xitem.index == 11 && (this.state.contentItems.sns.KAKAOSTORY == null || this.state.contentItems.sns.KAKAOSTORY.length == 0))
                                            ) {
                                                return null;
                                            } else {
                                                return (
                                                    <View
                                                        key={xindex}
                                                        style={
                                                            this.state.selectedSample === xitem.index
                                                                ? styles.sampleContainerOn
                                                                : styles.sampleContainer
                                                        }>
                                                        <TouchableOpacity
                                                            //onPress={() => this.setState({selectedSample : item.index})}
                                                            onPress={()=>this.selectSampleKeyword(xitem.index)}
                                                            style={this.state.selectedSample === xitem.index ? styles.sampleWrapperOn: styles.sampleWrapper}>
                                                            {
                                                                this.state.selectedSample === xitem.index
                                                                    ?
                                                                    <CustomTextB
                                                                        style={styles.smapleTextOn}>
                                                                        {xitem.title}
                                                                    </CustomTextB>
                                                                    :
                                                                    <CustomTextR
                                                                        style={styles.smapleText}>
                                                                        {xitem.title}
                                                                    </CustomTextR>
                                                            }
                                                        </TouchableOpacity>
                                                        <View style={
                                                            this.state.selectedSample === xitem.index
                                                                ? styles.sampleBorderOn
                                                                : styles.sampleBorder
                                                        }>

                                                        </View>
                                                    </View>
                                                )
                                            }
                                        })
                                    }
                                    </ScrollView>
                                    <LinearGradient
                                        colors={["rgba(255,255,255,1)", "rgba(255,255,255,0.5)", "rgba(255,255,255,0)"]}
                                        locations={[0, 0.5, 1]}
                                        style={{position: "absolute", height: "100%", width:30, right:0,bottom:2}}
                                    />
                                </View>
                                {
                                    (
                                        (this.state.contentItems.sns.HACKERSFAMILY == null || this.state.contentItems.sns.HACKERSFAMILY.length == 0)
                                        && (this.state.contentItems.app == null || this.state.contentItems.app.length == 0)
                                        && (this.state.contentItems.sns.YOUTUBE == null || this.state.contentItems.sns.YOUTUBE.length == 0)
                                        && (this.state.contentItems.sns.INSTAGRAM == null || this.state.contentItems.sns.INSTAGRAM.length == 0)
                                        && (this.state.contentItems.sns.FACEBOOK == null || this.state.contentItems.sns.FACEBOOK.length == 0)
                                        && (this.state.contentItems.sns.TWITTER == null || this.state.contentItems.sns.TWITTER.length == 0)
                                        && (this.state.contentItems.sns.NAVERTV == null || this.state.contentItems.sns.NAVERTV.length == 0)
                                        && (this.state.contentItems.sns.KAKAOTALKCHANNEL == null || this.state.contentItems.sns.KAKAOTALKCHANNEL.length == 0)
                                        && (this.state.contentItems.sns.NAVERPOST == null || this.state.contentItems.sns.NAVERPOST.length == 0)
                                        && (this.state.contentItems.sns.NAVERBLOG == null || this.state.contentItems.sns.NAVERBLOG.length == 0)
                                        && (this.state.contentItems.sns.KAKAOSTORY == null || this.state.contentItems.sns.KAKAOSTORY.length == 0)
                                    ) ||
                                            <View
                                                style={{
                                                position:'absolute',
                                                left:0,
                                                bottom:0,
                                                backgroundColor:DEFAULT_COLOR.input_border_color,
                                                height:2,
                                                width:'100%'
                                            }}>
                                            </View>
                                }
                            </View>
                            {
                                !this.state.loading
                                    &&
                                        <View style={{height:parseInt(SCREEN_HEIGHT - this.state.headerHeight)}}>
                                            <ScrollView style={{marginBottom:50}} nestedScrollEnabled={true}>
                                                {this.state.selectedSample === 1 &&
                                                <FamilySiteList screenState={this.state} screenProps={this.props} />
                                                }
                                                {this.state.selectedSample === 2 &&
                                                <AppList screenState={this.state} screenProps={this.props} />
                                                }
                                                {this.state.selectedSample === 3 &&
                                                <YouTubeList screenState={this.state} screenProps={this.props} />
                                                }
                                                {this.state.selectedSample === 4 &&
                                                <InstagramList screenState={this.state} screenProps={this.props} />
                                                }
                                                {this.state.selectedSample === 5 &&
                                                <FacebookList screenState={this.state} screenProps={this.props} />
                                                }
                                                {this.state.selectedSample === 6 &&
                                                <TwitterList screenState={this.state} screenProps={this.props} />
                                                }
                                                {this.state.selectedSample === 7 &&
                                                <NaverTVList screenState={this.state} screenProps={this.props} />
                                                }
                                                {this.state.selectedSample === 8 &&
                                                <KakaoTalkChannelList screenState={this.state} screenProps={this.props} />
                                                }
                                                {this.state.selectedSample === 9 &&
                                                <NaverPostList screenState={this.state} screenProps={this.props} />
                                                }
                                                {this.state.selectedSample === 10 &&
                                                <NaverBlogList screenState={this.state} screenProps={this.props} />
                                                }
                                                {this.state.selectedSample === 11 &&
                                                <KakaoStoryList screenState={this.state} screenProps={this.props} />
                                                }

                                            </ScrollView>
                                        </View>
                            }
                        </View>
                    </ParallaxScrollView>
                
                </View>
            );
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    contentDataWrapper : {
        width:SCREEN_WIDTH,
        height: Platform.OS === 'ios' ? CommonFuncion.isIphoneX() ? SCREEN_HEIGHT*0.85 : SCREEN_HEIGHT*0.9 : SCREEN_HEIGHT*0.94,
        maxHeight:SCREEN_HEIGHT*0.95,
        backgroundColor: '#fff',
        paddingVertical:20,
        paddingBottom:50,

    },
    sampleContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    sampleContainerOn: {
        flex: 1,
        justifyContent: 'center',
    },
    sampleBorderOn: {
        alignSelf: 'center',
        width: '80%',
        height: 2,
        backgroundColor: DEFAULT_COLOR.lecture_base,
    },
    sampleBorder: {
        width: '100%',
        height: 2,
    },
    sampleWrapper : {
        marginHorizontal:5,
        paddingVertical:10,
        paddingHorizontal:10,
        backgroundColor:'transparent',
    },
    sampleWrapperOn : {
        marginHorizontal:5,
        paddingVertical:10,
        paddingHorizontal:10,
        backgroundColor:'#fff',
    },
    smapleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),
        lineHeight: PixelRatio.roundToNearestPixel(7.1),
        letterSpacing: -0.95,
    },
    smapleTextOn : {
        color:DEFAULT_COLOR.lecture_base,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),
        lineHeight: PixelRatio.roundToNearestPixel(7.1),
        letterSpacing: -0.95,
    },
    itemWrap : {                
        marginHorizontal:10,        
        borderBottomWidth:1,
        borderBottomColor:'#ccc',
        marginVertical:10,        
        paddingVertical:10
    },

    fixedWriteButton : {
        position:'absolute',bottom:70,right:20,width:50,height:50,backgroundColor:'#222',alignItems:'center',justifyContent:'center',zIndex:2,borderColor:'#ccc',borderWidth:1,borderRadius:25,opacity:0.8
    },
    fixedWriteButton2 : {
        position:'absolute',bottom:70,right:20,width:50,height:50,backgroundColor:'#222',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:25,
    },

    slideCommonWrap: {        
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal:5,
        marginVertical:2,
        paddingHorizontal:5,
        paddingVertical:7,
        backgroundColor:'#fff',
        borderWidth:1,
        borderColor:DEFAULT_COLOR.input_border_color,
        borderRadius:5
    },

});