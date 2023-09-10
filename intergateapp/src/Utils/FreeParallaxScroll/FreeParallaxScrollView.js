import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    Text,
    View,
    Image,
    Animated,
    ScrollView,
    ImageBackground,
    Platform,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    PixelRatio,
    StatusBar
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Icon, List, ListItem } from 'react-native-elements';
import Icon2 from 'react-native-vector-icons/AntDesign';
Icon2.loadFont();

import  TextTicker from '../TextTicker';
import {CustomTextB, CustomText} from "../../Style/CustomText";

import { USER, FACEBOOK_LIST, SLACK_LIST, GENERIC_LIST, SCREEN_WIDTH, SCREEN_HEIGHT, DEFAULT_WINDOW_MULTIPLIER, DEFAULT_NAVBAR_HEIGHT } from '../ParallaxScroll/constants';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants/index';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

import styles from '../FreeParallaxScroll/styles';

const ScrollViewPropTypes = ScrollView.propTypes;

export function isIphoneX() {
    const dimen = Dimensions.get('window');
    return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        ((dimen.height === 812 || dimen.width === 812) || (dimen.height === 896 || dimen.width === 896))
    );
}

export default class ParallaxScrollView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showBottomBar :false,
            scrollY: new Animated.Value(0),
            minusScrollY : 0,
            navBarHeight : 0,
            windowHeight : 0,
            minHeight : 0
        };
    }

    UNSAFE_componentWillMount() {
        if ( Platform.OS === 'android') {
            this.androidStatusSetup(true);
        }
        this.setState({
            windowHeight :  this.props.windowHeight,
            minusScrollY :  this.props.windowHeight + (Platform.android ? 0 : isIphoneX() ? 16 : 0 ),
            navBarHeight : this.props.navBarHeight,
            minHeight : Platform.OS === 'android' ? this.props.navBarHeight : isIphoneX() ? this.props.navBarHeight + 15 : this.props.navBarHeight
        })
    }

    UNSAFE_componentWillUnmount() {        
        if ( Platform.OS === 'android') {
            this.androidStatusSetup(false)
        }  
    } 

    androidStatusSetup = async(bool) => {
        console.log('boooool3333', bool)
        if ( bool) {
            StatusBar.setBackgroundColor("transparent");
        }
        StatusBar.setTranslucent(bool);
    }
    scrollTo(where) {
        console.log('[TEST] scrollTo()', 'CALL')

        if (!this._scrollView) return;
        this._scrollView.scrollTo(where);
    }

    renderBackground() {
        var { windowHeight, backgroundSource, onBackgroundLoadEnd, onBackgroundLoadError } = this.props;
        var { scrollY } = this.state;
        if (!windowHeight || !backgroundSource) {
            return null;
        }

        return (
            <Animated.View
                style={[
                    styles.background,
                    {
                        height: this.state.minusScrollY,
                        transform: [
                            {
                                translateY: scrollY.interpolate({
                                    inputRange: [-windowHeight, 0, windowHeight],
                                    outputRange: [windowHeight / 2, 0, -windowHeight / 3]
                                })
                            },
                            {
                                scale: scrollY.interpolate({
                                    inputRange: [-windowHeight, 0, windowHeight],
                                    outputRange: [2, 1, 1]
                                })
                            }
                        ]
                    }
                ]}
                source={backgroundSource}
                onLoadEnd={onBackgroundLoadEnd}
                onError={onBackgroundLoadError}
            >
                <ImageBackground
                    source={backgroundSource}
                    resizeMode='cover' //this.imgOpacity
                    style={{height: '100%', width:SCREEN_WIDTH, opacity: 0.8}}
                    //blurRadius={Platform.OS === 'ios' ? 15 : 5}
                >
                    {/*gradient*/}
                    {/*
                    <LinearGradient
                        colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.35)", "rgba(255,255,255,0)"]}
                        locations={[0, 0.25, 1]}
                        style={{position: "absolute", height: "100%", width: "200%"}}/>
                    */}
                </ImageBackground>
            </Animated.View>
        );
    }

    renderHeaderView() {
        const { windowHeight, backgroundSource, markImage, lectureName, textbookTitle, navBarHeight } = this.props;
        const { scrollY } = this.state;
        if (!windowHeight || !backgroundSource) {
            return null;
        }

        const newNavBarHeight = navBarHeight || DEFAULT_NAVBAR_HEIGHT;
        const removeHeight = Platform.OS === 'android' ? 0 : isIphoneX() ? 50 : 20;
        const newWindowHeight = windowHeight - newNavBarHeight -removeHeight;

        return (
            <Animated.View
                style={{
                    opacity: scrollY.interpolate({
                        inputRange: [-windowHeight, 0, windowHeight * DEFAULT_WINDOW_MULTIPLIER + newNavBarHeight],
                        outputRange: [1, 1, 0]
                    })
                }}
            >
                <View style={{height: newWindowHeight, justifyContent: 'center', alignItems: 'center'}}>
                    {this.props.headerView ||
                    (
                        <View style={{flexDirection :'row',flexGrow:1,zIndex:2,justifyContent:'center',paddingTop:25,paddingHorizontal:25}}>
                            <View
                                style={{flex:1,shadowColor: "#000",shadowOffset: {width: 5,height: 5,},shadowOpacity: 0.5,shadowRadius: 6.27,elevation: 5,}}>
                                <Image source={require('../../../assets/icons/icon_mp_title.png')} style={{height: SCREEN_WIDTH/8,width:SCREEN_WIDTH/8}} resizeMode='contain' />
                            </View>
                            <View style={{flex:5,paddingLeft:10}}>
                                <CustomText
                                    numberOfLines={1} ellipsizeMode = 'tail'
                                    style={{fontSize:PixelRatio.roundToNearestPixel(16), color: 'white', paddingBottom: 5, marginRight: 20}}>
                                    {lectureName}
                                </CustomText>
                                {/*<Text style={{textAlign: 'center', fontSize: 17, color: 'rgba(247,247, 250, 1)', paddingBottom: 5}}>{textbookTitle || USER.title}</Text>*/}
                            </View>
                        </View>
                    )
                    }
                </View>
            </Animated.View>
        );
    }

    renderNavBarTitle() {
        const { windowHeight, backgroundSource, navBarTitleColor, navBarTitleComponent } = this.props;
        const { scrollY } = this.state;
        if (!windowHeight || !backgroundSource) {
            return null;
        }

        return (
            <Animated.View
                style={{
                    opacity: scrollY.interpolate({
                        inputRange: [-windowHeight, windowHeight * DEFAULT_WINDOW_MULTIPLIER, windowHeight * 0.8],
                        outputRange: [0, 0, 1]
                    })
                }}
            >
                {navBarTitleComponent ||
                <Text style={{ fontSize: 18, fontWeight: '600', color: navBarTitleColor || 'white' }}>
                    {this.props.navBarTitle || USER.name}
                </Text>}
            </Animated.View>
        );
    }

    rendernavBar() {
        const {
            windowHeight, backgroundSource, leftIcon,
            rightIcon, leftIconOnPress, rightIconOnPress, navBarColor, navBarHeight, leftIconUnderlayColor, rightIconUnderlayColor,centerTitle,lectureName
        } = this.props;
        const { scrollY } = this.state;
        if (!windowHeight || !backgroundSource) {
            return null;
        }
        const newNavBarHeight = navBarHeight || DEFAULT_NAVBAR_HEIGHT;

        if(this.props.navBarView)
        {
            return (
                <Animated.View
                    style={{
                        height: newNavBarHeight,
                        width: SCREEN_WIDTH,
                        flexDirection: 'row',
                        backgroundColor: scrollY.interpolate({
                            inputRange: [-windowHeight, windowHeight * DEFAULT_WINDOW_MULTIPLIER, windowHeight * 0.8],
                            outputRange: ['transparent', 'transparent', navBarColor || 'rgba(0, 0, 0, 1.0)'],
                            extrapolate: 'clamp'
                        })
                        /*
                        backgroundColor: scrollY.interpolate({
                          inputRange: [-windowHeight, windowHeight * DEFAULT_WINDOW_MULTIPLIER, windowHeight * 0.8],
                          outputRange: ['transparent', 'transparent', navBarColor || 'rgba(0, 0, 0, 1.0)'],
                          extrapolate: 'clamp'
                        })
                        */

                    }}
                >
                    {this.props.navBarView}
                </Animated.View>
            );
        }
        else
        {
            return (
                <Animated.View
                    style={{
                        height:Platform.OS === 'android' ? navBarHeight : isIphoneX() ? navBarHeight-25 : navBarHeight-20,
                        width: SCREEN_WIDTH,
                        flexDirection: 'row',
                        flexGrow:1,
                        zIndex:1,
                        backgroundColor: scrollY.interpolate({
                            inputRange: [windowHeight, windowHeight * 2],
                            outputRange: ['transparent', navBarColor || 'rgba(0, 0, 0, 1.0)']
                        })

                    }}
                >

                    {leftIcon &&
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingLeft:5
                        }}
                    >
                        <Icon2
                            name={leftIcon && leftIcon.name || 'menu'}
                            type={leftIcon && leftIcon.type || 'simple-line-icon'}
                            color={leftIcon && leftIcon.color || 'white'}
                            size={leftIcon && leftIcon.size || 23}
                            onPress={leftIconOnPress}
                            underlayColor={leftIconUnderlayColor || 'transparent'}
                        />
                    </View>
                    }
                    {centerTitle &&
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        { (this.state.showBottomBar && false ) ?
                            <View
                                style={{height:40,justifyContent:'center',paddingTop:10,paddingHorizontal:20}}
                            >
                                {/*
                                <TextTicker
                                    //marqueeOnMount={false}
                                    ref={c => this.marqueeRef = c}
                                    style={{color:'#fff',fontSize:16}}
                                    shouldAnimateTreshold={10}
                                    duration={5000}
                                    loop
                                    bounce
                                    repeatSpacer={50}
                                    marqueeDelay={1000}
                                >
                                */}
                                    {lectureName}
                                {/*</TextTicker>*/}
                            </View>


                            :
                            <CustomText
                                numberOfLines={1} ellipsizeMode = 'tail'
                                style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(16),marginRight:20,}}>
                                {centerTitle}
                            </CustomText>
                        }
                    </View>

                    }
                </Animated.View>

            );
        }
    }

    renderTodoListContent() {
        return (
            <View style={styles.listView}>
                <List>
                    {
                        FACEBOOK_LIST.map((item, index) => (
                            <ListItem
                                key={index}
                                onPress={() => console.log('List item pressed')}
                                title={item.title}
                                leftIcon={{name: item.icon}} />
                        ))
                    }
                </List>
                <List>
                    {
                        SLACK_LIST.map((item, index) => (
                            <ListItem
                                key={index}
                                onPress={() => console.log('List item pressed')}
                                title={item.title}
                                leftIcon={{name: item.icon}} />
                        ))
                    }
                </List>
                <List>
                    {
                        GENERIC_LIST.map((item, index) => (
                            <ListItem
                                key={index}
                                onPress={() => console.log('List item pressed')}
                                title={item.title}
                                leftIcon={{name: item.icon}} />
                        ))
                    }
                </List>
                <List containerStyle={{marginBottom: 15}}>
                    <ListItem
                        key={1}
                        hideChevron={true}
                        onPress={() => console.log('Logout Pressed')}
                        title='LOGOUT'
                        titleStyle={styles.logoutText}
                        icon={{name: ''}} />
                </List>
            </View>
        );
    }

    onScrollEndDrag = async(event) => {

        //console.log('[TEST] onScrollEndDrage()', 'CALL')

        //console.log('evenbt' ,event)
        const minHeight = Platform.OS == 'android' ? this.state.navBarHeight : isIphoneX() ? this.state.navBarHeight : this.state.navBarHeight ;
        const maxHeight = this.state.navBarHeight + 55;


        if ( event.contentOffset.y < maxHeight) {
            let newHeight = this.state.windowHeight - event.contentOffset.y;
            this.setState({
                minusScrollY : newHeight < this.state.navBarHeight ? this.state.navBarHeight : newHeight

            })
        }else if ( event.contentOffset.y < maxHeight && event.contentOffset.y > minHeight) {
            let newHeight = this.state.navBarHeight + (maxHeight- event.contentOffset.y);
            this.setState({
                minusScrollY : newHeight < this.state.navBarHeight ? this.state.navBarHeight : newHeight
            })

        }else if ( event.contentOffset.y <= this.state.windowHeight && event.contentOffset.y < minHeight) {
            let newHeight = this.state.navBarHeight + (maxHeight- event.contentOffset.y);
            this.setState({
                minusScrollY : newHeight < this.state.navBarHeight ? this.state.navBarHeight : newHeight
            })
        }

    }

    handleOnScroll = async(event) => {
        const maxHeight = this.state.windowHeight - this.state.navBarHeight;

        //58.400000000000006
        //console.log('handleOnScroll()', 'maxHeight = ' + maxHeight)

        /* 테스트코드
        if ( event.nativeEvent.contentOffset.y > maxHeight && event.nativeEvent.contentOffset.y < (maxHeight * 2) ) {
            console.log('CALL handleOnScroll : CASE UP(추정)');
            this.setState({
                minusScrollY: this.state.minHeight,
                showBottomBar: true
            })
        } else{
            console.log('CALL handleOnScroll : CASE DOWN(추정)');
            this.setState({
                minusScrollY : maxHeight,
                showBottomBar : false
            })
        }
        */

        /* 원본코드 */
        if ( event.nativeEvent.contentOffset.y > maxHeight) {
            //console.log('[TEST] handleOnScroll()', 'CALL CASE UP')
            this.setState({
                minusScrollY : this.state.minHeight,
                showBottomBar : true
            })
        } else {
            //console.log('[TEST] handleOnScroll()', 'CALL CASE DOWN')
            this.setState({
                minusScrollY : this.state.windowHeight + (Platform.android ? 0 : isIphoneX() ? 16 : 0 ) - event.nativeEvent.contentOffset.y,
                showBottomBar : false
            })
        }

        /*
        if ( event.nativeEvent.contentOffset.y <= 65 || event.nativeEvent.contentOffset.y >= 120 ) {
            this.setState({
                minusScrollY : 65
            })
        }else if (event.nativeEvent.contentOffset.y < 120 && event.nativeEvent.contentOffset.y > 65 ) {
            this.setState({
                minusScrollY : event.nativeEvent.contentOffset.y
            })

        }else{
            this.setState({
                minusScrollY : 65
            })
        }
        */
    }


    upButtonHandler = async() => {
        try {
            this._scrollView.scrollTo({ x: 0,  animated: true });
        }catch(e){

        }
    };

    showButton = async(bool) => {
        this.setState({
            showBottomBar : bool
        })
    }

    render() {
        const { style, ...props } = this.props;

        const { windowHeight, backgroundSource, markImage, lectureName, textbookTitle, navBarHeight } = this.props;
        const { scrollY } = this.state;
        if (!windowHeight || !backgroundSource) {
            return null;
        }

        const newNavBarHeight = navBarHeight || DEFAULT_NAVBAR_HEIGHT;
        const removeHeight = Platform.OS === 'android' ? 0 : isIphoneX() ? 50 : 20;
        const newWindowHeight = windowHeight - newNavBarHeight -removeHeight;

        return (
            <SafeAreaView
                style={[styles.container, style]}
                nestedScrollEnabled={true}
                >
                { 
                    Platform.OS === 'android' && <StatusBar barStyle={"dark-content"} backgroundColor={'transparent'} animated={true} hidden={false}/>
                }
                <NavigationEvents
                    onWillFocus={payload => {
                        if (Platform.OS === "android") {                                
                            StatusBar.setBackgroundColor("transparent");
                            this.androidStatusSetup(true)
                        }
                        
                    }}
                    onWillBlur={payload => {
                        if (Platform.OS === "android") {                            
                            //this.androidStatusSetup(false)
                            //StatusBar.setBackgroundColor("#ffffff");
                        }
                        
                    }}
                />
                {this.renderBackground()}
                {this.rendernavBar()}
                <ScrollView
                    ref={component => {
                        this._scrollView = component;
                    }}
                    {...props}
                    style={[styles.scrollView, { height: SCREEN_HEIGHT - newWindowHeight }]}
                    //onScroll={Animated.event([
                    //    { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
                    //]),
                    //</SafeAreaView>e => this.handleOnScroll(e)}
                    onScroll={e => this.handleOnScroll(e)}
                    scrollEventThrottle={16}
                    indicatorStyle={'white'}

                    onMomentumScrollEnd = {({nativeEvent}) => {
                    }}
                    onScrollEndDrag ={({nativeEvent}) => {
                        this.onScrollEndDrag (nativeEvent)
                    }}>
                    {this.renderHeaderView()}
                    <View style={[styles.content, props.scrollableViewStyle]}>
                        {this.props.children || this.renderTodoListContent()}
                    </View>
                </ScrollView>
                { this.state.showBottomBar &&
                <TouchableOpacity
                    style={styles.btnGoTopWrap}
                    onPress={e => this.upButtonHandler()}
                >
                    <Image
                        style={{
                            width: 43,
                            height: 43,
                        }}
                        source={require('../../../assets/icons/btn_top.png')}/>
                </TouchableOpacity>
                }
            </SafeAreaView>
        );
    }
}

ParallaxScrollView.defaultProps = {
    backgroundSource: {uri: 'http://i.imgur.com/6Iej2c3.png'},
    windowHeight: SCREEN_HEIGHT * DEFAULT_WINDOW_MULTIPLIER,
    leftIconOnPress: () => console.log('Left icon pressed'),
    rightIconOnPress: () => console.log('Right icon pressed')
};

ParallaxScrollView.propTypes = {
    ...ScrollViewPropTypes,
    backgroundSource: PropTypes.object,
    windowHeight: PropTypes.number,
    navBarTitle: PropTypes.string,
    navBarTitleColor: PropTypes.string,
    navBarTitleComponent: PropTypes.node,
    navBarColor: PropTypes.string,
    markImage: PropTypes.string,
    lectureName: PropTypes.string,
    textbookTitle: PropTypes.string,
    headerView: PropTypes.node,
    leftIcon: PropTypes.object,
    rightIcon: PropTypes.object
};