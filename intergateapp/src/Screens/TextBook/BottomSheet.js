import React, {Component} from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  Easing,
  Keyboard,
  PanResponder,
  TouchableOpacity,
  View,
  Text
} from 'react-native';
import PropTypes from 'prop-types';
import Icon2 from 'react-native-vector-icons/Entypo';
import { SCREEN_WIDTH } from '../../Utils/ParallaxScroll/constants';
Icon2.loadFont();
class BottomSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedValue: new Animated.Value(0),
      isPanelVisible: props.isOpen,
      isPanelOpened: props.isOpen,
      contentHeight: undefined,
    };
    this._setPanResponders();
  }

  togglePanel = () => {
    const {contentHeight, animatedValue, isPanelOpened} = this.state;
    const {
      animationDuration,
      animation,
      sliderMinHeight,
      onOpen,
      onClose,
    } = this.props;

    const toValue =
      animatedValue._value === 0 ? contentHeight - sliderMinHeight : 0;
    Animated.timing(animatedValue, {
      duration: animationDuration,
      easing: animation,
      toValue,
      useNativeDriver: false,
    }).start(() => {
      this.setState({isPanelOpened: !isPanelOpened}, () => {
        if (this.state.isPanelOpened) {
          onOpen();
        } else {
          onClose();
          Keyboard.dismiss();
        }
      });
    });
  };

  _onBackPress = () => {
    this.state.isPanelOpened && this.togglePanel();
    return this.state.isPanelOpened;
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this._onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._onBackPress);
  }

  _setPanResponders() {
    this._parentPanResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => !this.state.isPanelOpened,
      onPanResponderRelease: () => this.togglePanel(),
    });

    this._childPanResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, gestureState) =>
        gestureState.dy > 15,
      onPanResponderRelease: (_, gestureState) =>
        gestureState.dy > 0 && this.togglePanel(),
    });
  }

  _handleScrollEndDrag = ({nativeEvent}) => {
    nativeEvent.contentOffset.y === 0 && this.togglePanel();
  };

  _setSize = ({nativeEvent}) => {
    this.setState({contentHeight: nativeEvent.layout.height}, () => {
      const {isOpen, sliderMinHeight} = this.props;
      const {animatedValue, contentHeight} = this.state;
      if (!isOpen && contentHeight) {
        animatedValue.setValue(contentHeight - sliderMinHeight);
        this.setState({isPanelVisible: true});
      }
    });
  };

  render() {
    const {isPanelVisible, animatedValue} = this.state;
    const {
      sliderMaxHeight,
      wrapperStyle,
      outerContentStyle,
      innerContentStyle,
      lineContainerStyle,
      lineStyle,
      children,
    } = this.props;

   
    return (
      <Animated.View
        onLayout={this._setSize}
        {...this._parentPanResponder.panHandlers}
        style={{
          ...styles.container,
          ...wrapperStyle,
          maxHeight: sliderMaxHeight,
          transform: [
            {translateY: animatedValue},
            {scale: isPanelVisible ? 1 : 0},
          ],
        }}>

        <TouchableOpacity 
            onPress={this.togglePanel} 
            style={styles.bottomBuyTextIconWraper}
            activeOpacity={1}
        >
            <View style={styles.bottomBuyTextIcon}>
                <Icon2 name={this.state.bottombar ? "chevron-thin-down" : "chevron-thin-up"} size={15} color={'#222'} />
            </View>                        
        </TouchableOpacity>
        {/*}
        <TouchableOpacity 
            onPress={this.togglePanel} 
            activeOpacity={1}
            style={styles.bottomBuyMP3LeftText}
        >
            <Icon2 name={this.props.nowStatus ? "chevron-thin-down" : "chevron-thin-up"} size={15} color="#222" />
        </TouchableOpacity>  
        */}
        {/*
        <TouchableOpacity >
            <View style={[styles.lineContainer, lineContainerStyle]}>
              <View style={[styles.line, lineStyle]} />
            </View>
        </TouchableOpacity>
        */}
        <View
          style={[styles.outerContent, outerContentStyle]}
          {...this._childPanResponder.panHandlers}>
          
          <View style={[styles.innerContent, innerContentStyle]}>
            {typeof children === 'function'
              ? children(this._handleScrollEndDrag)
              : children}
          </View>
        </View>
      </Animated.View>
    );
  }
}


const styles = {
    bottomBuyMP3LeftText : {
        width:50,height:20,backgroundColor:'#fff',borderTopLeftRadius:10,borderTopRightRadius:10,alignItems:'center',justifyContent:'center',
        ...Platform.select({
            ios: {
                shadowColor: "#222",
                shadowOpacity: 0.5,
                shadowRadius: 6.27,
                shadowOffset: {
                height: 5,
                width: 5
                }
            },
            android: {
                elevation: 5,
            }
        })
    },
    bottomBuyTextIconWraper : {
        width: SCREEN_WIDTH,height : 20,alignItems: 'center',justifyContent: 'center',textAlign: 'center',zIndex:2,
        ...Platform.select({
            ios: {
                
            },
            android: {
                
                //elevation: 12,
                borderBottomWidth:1,
                borderBottomColor:'#ebebeb'
               
            }
        })
    },
    bottomBuyTextIcon : {
        width:50,height:20,backgroundColor:'#fff',borderTopLeftRadius:10,borderTopRightRadius:10,alignItems:'center',justifyContent:'center',borderColor:'#ccc',borderWidth:1,paddingTop:5,borderBottomColor:'#fff',borderBottomWidth:1
    },
    container: {
        flex: 1,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
        paddingHorizontal: 21,
        //borderTopLeftRadius: 30,
        //borderTopRightRadius: 30,
        width : SCREEN_WIDTH,
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        //backgroundColor: '#ffffff',
        justifyContent:'center',
        alignItems:'center'
    },
    lineContainer: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    line: {
        width: 35,
        height: 4,
        borderRadius: 2,
        marginTop: 18,
        marginBottom: 30,
        backgroundColor: '#D5DDE0',
    },
    outerContent: {
        flex: -1,
        width : SCREEN_WIDTH,
    },
    innerContent: {
        flex: -1,
        width : SCREEN_WIDTH,
    },
};


BottomSheet.propTypes = {
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    isOpen: PropTypes.bool,
    sliderMaxHeight: PropTypes.number,
    sliderMinHeight: (props, propName, _) => {
      if (props[propName] > props.sliderMaxHeight) {
        return new Error(
          'sliderMinHeight value cannot be greater than sliderMaxHeight',
        );
      }
    },
    animation: PropTypes.func,
    animationDuration: PropTypes.number,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    wrapperStyle: PropTypes.object,
    outerContentStyle: PropTypes.object,
    innerContentStyle: PropTypes.object,
    lineContainerStyle: PropTypes.object,
    lineStyle: PropTypes.object,
  };
  
  BottomSheet.defaultProps = {
    children: <View />,
    isOpen: true,
    sliderMaxHeight: Dimensions.get('window').height * 0.5,
    sliderMinHeight: 50,
    animation: Easing.quad,
    animationDuration: 200,
    onOpen: () => null,
    onClose: () => null,
    wrapperStyle: {},
    outerContentStyle: {},
    innerContentStyle: {},
    lineContainerStyle: {},
    lineStyle: {},
  };

export default BottomSheet;