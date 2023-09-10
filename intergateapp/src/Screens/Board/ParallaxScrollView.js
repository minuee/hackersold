import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
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
    PixelRatio
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import { Icon, List, ListItem } from 'react-native-elements';
import Icon2 from 'react-native-vector-icons/AntDesign';
Icon2.loadFont();

import  TextTicker from '../../Utils/TextTicker';
const {width: SCREEN_WIDTH,height : SCREEN_HEIGHT} = Dimensions.get("window");

import { USER, FACEBOOK_LIST, SLACK_LIST, GENERIC_LIST, DEFAULT_WINDOW_MULTIPLIER, DEFAULT_NAVBAR_HEIGHT } from '../../Utils/ParallaxScroll/constants';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import { abs } from 'react-native-reanimated';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import {CustomTextL,CustomTextR, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Style/CustomText';


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

export default class ParallaxScrollView extends React.PureComponent {
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
        this.setState({
            windowHeight :  this.props.windowHeight,
            minusScrollY :  this.props.windowHeight,
            navBarHeight : this.props.navBarHeight,
            minHeight : Platform.OS === 'android' ? this.props.navBarHeight : isIphoneX() ? this.props.navBarHeight + 25 : this.props.navBarHeight
        })
    }   
  


  scrollTo(where) {
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
            backgroundColor:DEFAULT_COLOR.lecture_base,
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
                //source={require('../../../assets/images/img_notice.png')}
                source={require('../../../assets/background/img_notice.png')}
                resizeMode='contain' //this.imgOpacity
                //style={{height: '100%', width:SCREEN_WIDTH, opacity: 0.9,transform: [{ scale: Platform.OS === 'ios' ? 1 : 1.2 }]}}
                style={{
                  height: this.state.minusScrollY*0.8,
                  //width:SCREEN_WIDTH,
                  opacity: 0.9,
                  transform: [{ scale: Platform.OS === 'ios' ? 1 : 1.2 }]
                }}
                //blurRadius={Platform.OS === 'ios' ? 15 : 5}
                >
                {/*gradient
                <LinearGradient
                  colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.35)", "rgba(255,255,255,0)"]}
                  locations={[0, 0.25, 1]}
                  style={{position: "absolute", height: "100%", width: "200%"}}
                />
                */}
                
            </ImageBackground>
      </Animated.View>
    );
  }

  renderHeaderView() {
    const { windowHeight, backgroundSource, markImage, extbookTitle, navBarHeight } = this.props;
    const { scrollY } = this.state;
    if (!windowHeight || !backgroundSource) {
      return null;
    }

    const newNavBarHeight = navBarHeight || DEFAULT_NAVBAR_HEIGHT;    
    const removeHeight = Platform.OS === 'android' ? 0 : isIphoneX() ? 50 :20;
    const newWindowHeight = windowHeight - newNavBarHeight -removeHeight;

    return (
      <View
        style={{zIndex:5}}
      /*
        style={{
          opacity: scrollY.interpolate({
            inputRange: [-windowHeight, 0, windowHeight * DEFAULT_WINDOW_MULTIPLIER + newNavBarHeight],
            outputRange: [1, 1, 0]
          })
        }}
        */
      >
        <View style={{height: newWindowHeight, justifyContent: 'center', alignItems: 'center',zIndex:3}}>
          {this.props.headerView ||
            (
                <View style={{flexDirection :'row',flexGrow:1,zIndex:2,justifyContent:'center',paddingHorizontal:25}}>                    
                    <View style={{flex:1,paddingLeft:10,justifyContent:'center'}}>
                        <CustomTextL 
                            numberOfLines={4} ellipsizeMode = 'tail'
                            style={{fontSize:PixelRatio.roundToNearestPixel(23),lineHeight:PixelRatio.roundToNearestPixel(27), color: '#fff',letterSpacing:-1.72, paddingBottom: 5}}>
                                
                        </CustomTextL>
                        
                    </View>
                </View>
            )
          }
        </View>
      </View>
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
      rightIcon, leftIconOnPress, rightIconOnPress, navBarColor, navBarHeight, leftIconUnderlayColor, rightIconUnderlayColor,centerTitle
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
              height:  Platform.OS === 'android' ? navBarHeight : navBarHeight-20,
              width: SCREEN_WIDTH,
              //marginTop:-25,
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
                flex:1,
                justifyContent: 'center',                
                paddingLeft:10,
                paddingTop : Platform.OS === 'ios' ? 0 : 10
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
            <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
                <Text style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),paddingTop : Platform.OS === 'ios' ? 0 : 15}}>
                    {centerTitle}
                </Text>
            </View>
            
          }    
          {rightIcon ?
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft:5
              }}
            >
              <Icon2
                name={rightIcon && rightIcon.name || 'menu'}
                type={rightIcon && rightIcon.type || 'simple-line-icon'}
                color={leftIcon && rightIcon.color || 'white'}
                size={rightIcon && rightIcon.size || 23}
                onPress={rightIconOnPress}
                underlayColor={leftIconUnderlayColor || 'transparent'}
              />
            </View>   
            :  
            <View style={{flex:1}}></View>     
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
        
        //console.log('evenbt' ,event)
        const minHeight = this.state.navBarHeight;
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
        
        //const minHeight = this.state.minHeight;
        const maxHeight = this.state.windowHeight - this.state.navBarHeight;
        console.log('maxHeight,' ,event.nativeEvent.contentOffset.y)
        
        if ( event.nativeEvent.contentOffset.y > maxHeight) {
          this.setState({        
            showBottomBar : true
          })
          
        }else{
          this.setState({            
            showBottomBar : false
          })
          
          
        }
       
    }


    upButtonHandler = async() => {      
        try {  
            this._scrollView.scrollTo({ x: 0,  animated: true });
        }catch(e){

        }
    };


    render() {
        const { style, ...props } = this.props;
    

        return (
        <SafeAreaView style={[styles.container, style]}>
            {this.renderBackground()}
            {this.rendernavBar()}
            <ScrollView
                ref={component => {
                    this._scrollView = component;
                }}
                {...props}
                style={styles.scrollView}
                //onScroll={Animated.event([
                //    { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
                //]),
                //</SafeAreaView>e => this.handleOnScroll(e)}
                //onScroll={e => this.handleOnScroll(e)}
                scrollEventThrottle={16}
                indicatorStyle={'white'}
            
            
                onMomentumScrollEnd = {({nativeEvent}) => {                     
                }}
                onScrollEndDrag ={({nativeEvent}) => { 
                    //this.onScrollEndDrag (nativeEvent) 
                }}

            
            >
            {this.renderHeaderView()}
            <View style={[styles.content, props.scrollableViewStyle]}>
                {this.props.children || <View style={{widh:SCREEN_WIDTH,height:SCREEN_HEIGHT*0.8}}></View>}
            </View>
            </ScrollView>
            { this.state.showBottomBar &&
                <TouchableOpacity 
                    style={styles.btnGoTopWrap}
                    onPress={e => this.upButtonHandler()}
                >
                    <Icon2 name="up" size={30} color="#000" />
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
  backgroundSource: PropTypes.string,
  windowHeight: PropTypes.number,
  navBarTitle: PropTypes.string,
  navBarTitleColor: PropTypes.string,
  navBarTitleComponent: PropTypes.node,
  navBarColor: PropTypes.string,
  markImage: PropTypes.string,  
  textbookTitle: PropTypes.string,
  headerView: PropTypes.node,
  leftIcon: PropTypes.object,
  rightIcon: PropTypes.object
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      borderColor: 'transparent'
    },
    scrollView: {
      minHeight : SCREEN_HEIGHT*0.7,
      backgroundColor: 'transparent'
    },
    background: {
      position: 'absolute',
      backgroundColor: 'transparent',
      justifyContent:'flex-end',
      justifyContent:'flex-end',
      width: SCREEN_WIDTH,
      resizeMode: 'cover'
    },
    content: {
      //shadowColor: '#222',
      //shadowOpacity: 0.3,
      //shadowRadius: 2,
      backgroundColor: 'transparent',
      flex: 1,
      flexDirection: 'column'
    },
    headerView: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarView: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:'#ff0000'
    },
    listView: {
      backgroundColor: 'rgba(247,247, 250, 1)'
    },
    logoutText: {
      color: 'red',
      textAlign: 'center',
      fontWeight: 'bold'
    },
    btnGoTopWrap : {
      position:'absolute',bottom:50,right:20,width:50,height:50,paddingTop:5,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:25,opacity:0.5
  },
  });