import React, {Component} from "react";
import {Animated, Dimensions, Platform, Text, TouchableOpacity, View,StatusBar,PixelRatio,BackHandler,StyleSheet} from "react-native";
import { NavigationEvents } from 'react-navigation';
import {Body, Header, List, ListItem as Item, ScrollableTab, Tab, TabHeading, Tabs, Title} from "native-base";
import Icon2 from 'react-native-vector-icons/AntDesign';
Icon2.loadFont();
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextL,CustomTextR, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Style/CustomText';


const {width: SCREEN_WIDTH,height : SCREEN_HEIGHT} = Dimensions.get("window");
const IMAGE_HEIGHT = Platform.OS === 'ios' ? parseInt(SCREEN_HEIGHT*0.28) : parseInt(SCREEN_HEIGHT*0.3);
const HEADER_HEIGHT = Platform.OS === "ios" ? CommonFuncion.isIphoneX() ? 94 : 70 : 50;
const SCROLL_HEIGHT = IMAGE_HEIGHT - HEADER_HEIGHT;
const THEME_COLOR = DEFAULT_COLOR.lecture_base;
const THEME_COLOR2 = DEFAULT_COLOR.base_color_666;
const FADED_THEME_COLOR = DEFAULT_COLOR.base_color_666;


import FaqListScreen from './FaqListScreen'; //FAQ
import NoticeListScreen from "./NoticeListScreen";


export default class CustomService extends Component {

    nScroll = new Animated.Value(0);
    scroll = new Animated.Value(0);
    textColor = this.scroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT / 5, SCROLL_HEIGHT],
        outputRange: [THEME_COLOR, FADED_THEME_COLOR, "white"],
        extrapolate: "clamp"
    });
    textColorDefault = this.scroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT / 5, SCROLL_HEIGHT],
        outputRange: [THEME_COLOR2, FADED_THEME_COLOR, "white"],
        extrapolate: "clamp"
    });
    tabBg = this.scroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT],
        outputRange: ["white", THEME_COLOR],
        extrapolate: "clamp"
    });
    tabY = this.nScroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT, SCROLL_HEIGHT + 1],
        outputRange: [0, 0, 1]
    });
    headerBg = this.scroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT, SCROLL_HEIGHT + 1],
        outputRange: ["transparent", "transparent", THEME_COLOR],
        extrapolate: "clamp"
    });
    imgScale = this.nScroll.interpolate({
        inputRange: [-25, 0],
        outputRange: [1.1, 1],
        extrapolateRight: "clamp"
    });
    imgOpacity = this.nScroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT],
        outputRange: [0.7, 0],
    });
    tabContent = (x, i) => <View style={{height: this.state.height}}>
        <List onLayout={({nativeEvent: {layout: {height}}}) => {
        this.heights[i] = height;
        if (this.state.activeTab === i) this.setState({height})
        }}>
        {new Array(x).fill(null).map((_, i) => <Item key={i}><Text>Item {i}</Text></Item>)}
        </List></View>;
    heights = [500, 500];
    state = {
        activeTab: 0,
        height: 500
    };

    constructor(props) {
        super(props);

        this.state = {
            showBottomBar : false
        }
        //this.nScroll.addListener(Animated.event([{value: this.scroll}], {useNativeDriver: false}));
    }

    static navigationOptions = {
        header: null
    }
    

    async UNSAFE_componentWillMount() {                
        if ( Platform.OS === 'android') {
            setTimeout(() => {
                this.androidStatusSetup(true);
            }, 500)
            
        }
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);          
    }  

    componentDidMount() {        
        
 
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
    }  

    upButtonHandler = async() => {      
        try {  
            this.ScrollView.scrollTo({ x: 0,  animated: true });
        }catch(e){

        }
    };

    handleBackButton = () => {
        if ( Platform.OS === 'android') {
            this.androidStatusSetup(false)
        }  
        
        this.props.navigation.goBack(null);
        this.props.navigation.toggleDrawer();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton); 
        return true;
    };

    _historyBack = () => {   
        if ( Platform.OS === 'android') {
            this.androidStatusSetup(false)
        }               
        this.props.navigation.goBack(null);
        this.props.navigation.toggleDrawer();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton); 
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
        return (
            <View style={{flex:1}} >
            { 
            Platform.OS === 'android' && <StatusBar barStyle={"dark-content"} backgroundColor={DEFAULT_COLOR.lecture_base} animated={true} hidden={false}/>
            }
            { this.props.showBottomBar &&
                <TouchableOpacity 
                    style={this.state.showType === 'list' ? styles.btnGoTopWrap :styles.btnGoTopWrap2}
                    onPress={e => this.upButtonHandler()}
                >
                    <Icon2 name="up" size={30} color="#000" />
                </TouchableOpacity>
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
            <Animated.View style={{position: "absolute", width: "100%", backgroundColor: this.headerBg, zIndex: 1}}>
                <Header style={{backgroundColor: "transparent" }} hasTabs androidStatusBarColor>
                    <View style={{position:'absolute',left:0,top:Platform.OS === 'ios' ? 10 : 25,width:SCREEN_WIDTH,flex:1,flexDirection:'row'}}>
                        <TouchableOpacity style={{flex:1,justifyContent: 'center',backgroundColor:'transparent',paddingLeft:10,zIndex:10}} onPress={()=> this._historyBack()}>
                            <Icon2 name={'left'} color={'#fff'} size={20} />
                        </TouchableOpacity>                    
                        <View style={{flex:1,justifyContent:'center',alignItems:'center',paddingTop:Platform.OS === 'ios' ? 3 : 5}}>
                            <Text style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)}}>고객센터</Text>
                        </View>
                        <View style={{flex:1}} />
                    </View>
                </Header>
            
            </Animated.View>
            <Animated.ScrollView
                ref={(ref) => {
                    this._ScrollView = ref;
                }}
                scrollEventThrottle={5}
                showsVerticalScrollIndicator={false}
                onScroll={
                    Animated.event([{nativeEvent: {contentOffset: {y: this.nScroll}}}], {useNativeDriver: true})
                }
                style={{zIndex: 0}}>
                <Animated.View style={{
                    transform: [{translateY: Animated.multiply(this.nScroll, 0.65)}, {scale: this.imgScale}],
                    backgroundColor: THEME_COLOR
                }}>
                    <Animated.Image
                        source={require('../../../assets/background/img_faq.png')}
                        resizeMode='contain' //this.imgOpacity
                        style={{height: IMAGE_HEIGHT, width:SCREEN_WIDTH, opacity: 0.9,transform: [{ scale: 1 }]}}
                    />
                    <View style={{position:'absolute',left:20,bottom:50,width:SCREEN_WIDTH-50}}>
                        <CustomTextL 
                            numberOfLines={4} ellipsizeMode = 'tail'
                            style={{fontSize:PixelRatio.roundToNearestPixel(23),lienHeight:PixelRatio.roundToNearestPixel(27), color: '#fff',letterSpacing:-1.72}}>
                            해티즌이{"\n"}가장 궁금해하는 질문
                        </CustomTextL>
                    </View>
                </Animated.View>
                <Tabs
                    prerenderingSiblingsNumber={3}
                    onChangeTab={({i}) => {
                        this.setState({height: this.heights[i], activeTab: i})
                    }}
                    locked={true}
                    renderTabBar={(props) => <Animated.View
                    style={{transform: [{translateY: this.tabY}], zIndex: 1, width: SCREEN_WIDTH,}}
                >
                    <ScrollableTab {...props}
                        renderTab={(name, page, active, onPress, onLayout) => (
                        <TouchableOpacity key={page}
                            onPress={() => {
                                onPress(page);
                                this._ScrollView.getNode().scrollTo({x:0,animated:false})
                            }}
                            onLayout={onLayout}
                            activeOpacity={0.4}                            
                        >
                            <Animated.View
                                style={Platform.OS === 'android' ? styles.tabsHeadWrap1 : styles.tabsHeadWrap2}
                            >
                                <TabHeading 
                                    scrollable
                                    style={{
                                        flex:1,
                                        backgroundColor: "transparent",
                                        width: Platform.OS === 'ios' ? SCREEN_WIDTH / 2 - 30 : SCREEN_WIDTH/2,
                                        justifyContent:'center'
                                        //paddingTop:10
                                    }}
                                    active={active}
                                >
                                    <Animated.Text style={{
                                        //fontWeight: active ? "bold" : "normal",
                                        fontFamily : active ? 'NotoSansKR-Bold' : 'NotoSansKR-Regular',
                                        color: active ? DEFAULT_COLOR.lecture_base: DEFAULT_COLOR.base_color_222,
                                        //color: active ? this.textColor : this.textColorDefault,
                                        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)
                                    }}>
                                        {name}
                                    </Animated.Text>
                                </TabHeading>
                                </Animated.View>
                        </TouchableOpacity>
                    )}
                    underlineStyle={{backgroundColor: this.textColor}}
                />
                </Animated.View>
                }>
                <Tab heading="FAQ" >
                    <FaqListScreen screenProps={this.props} />
                </Tab>
                <Tab heading="공지사항">
                    <NoticeListScreen screenProps={this.props} />
                </Tab>
            </Tabs>
            </Animated.ScrollView>
        </View>
        )
    }
}




const styles = StyleSheet.create({
    tabsHeadWrap1: {
        flex: 1,height: 100,backgroundColor: '#fff'
    },
    tabsHeadWrap2 : {
        flex: 1,height: 100
    }

});
