import React, { Component } from 'react';

import {
  TouchableOpacity,
  Image,
  Text,
  View,
  StyleSheet,
  InteractionManager,
  Animated,
} from 'react-native';

import PropTypes from 'prop-types';


class DropDown extends Component {
  static animated;
  static defaultProps = {
    contentVisible: false,
    backgroundColor: 'transparent',
    titleBackground: 'transparent',
    contentBackground: 'transparent',
    underlineColor: '#d3d3d3',
    visibleImage: false,
    invisibleImage: false,
    checkCount : 0,
    totalCount :0
  };

  static propTypes = {
    contentVisible: PropTypes.bool,
    backgroundColor: PropTypes.string,
    titleBackground: PropTypes.string,
    contentBackground: PropTypes.string,
    underlineColor: PropTypes.string,
    visibleImage: PropTypes.any,
    invisibleImage: PropTypes.any,
    checkCount : PropTypes.any,
    totalCount :PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      isMounted: false,
      contentVisible: props.contentVisible,
      headerheight: 0,
      contentHeight: 0,
    };
  }

  render() {

    const { backgroundColor, style, header, visibleImage, invisibleImage, children ,checkCount,totalCount, childHeight} = this.props;        
    const { contentVisible } = this.state;
    
    return (
      <Animated.View style={[
        styles.container,
        {
          height: this.animated,
          backgroundColor: backgroundColor,
        },
        style,
      ]}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={this.onPress}
        >
          <View
            onLayout={ this.onAnimLayout }
          >
            { header }
            
          </View>
        </TouchableOpacity>
        <View
          style={styles.content}
          onLayout={(e)=>this.onLayout(e,childHeight)}
        >
          <View
            style={[
              styles.contentChild,
            ]}
          >
            { children }
          </View>
        </View>
      </Animated.View>
    );
  }

  runAnimation = () => {
    const { contentVisible, headerHeight, contentHeight } = this.state;
    const initialValue = contentVisible
      ? headerHeight + contentHeight : headerHeight;
    const finalValue = contentVisible
      ? headerHeight : contentHeight + headerHeight;

    this.setState({
      contentVisible: !contentVisible,
    });

    this.animated.setValue(initialValue);
    Animated.spring(
      this.animated,
      {
        toValue: finalValue,
      },
    ).start();
  }

  onAnimLayout = (evt) => {
    const { isMounted, contentHeight } = this.state;
    const { contentVisible } = this.props;
    const headerHeight = evt.nativeEvent.layout.height;
    if (!isMounted && !contentVisible) {
      this.animated = new Animated.Value(headerHeight);
      this.setState({
        isMounted: true,
        headerHeight,
      });
      return;
    } else if (!isMounted) {
      InteractionManager.runAfterInteractions(() => {
        this.animated = new Animated.Value(headerHeight + contentHeight);
      });
    }
    this.setState({ headerHeight, isMounted: true });
  }

  onLayout = (evt,childHeight) => {
    //console.log('evt.nativeEvent.layout.height',evt.nativeEvent)
    const contentHeight = childHeight? childHeight :  evt.nativeEvent.layout.height;
    this.setState({ contentHeight });
  }

  onPress = () => {
    console.log('presss')

    this.runAnimation();
  }
}

export default DropDown;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  icons: {
    width: 20,
    height: 20,
    position: 'absolute',
    top:15,
    right: 16,
  },
  underline: {
    width: '100%',
    height: 1,
    position: 'absolute',
    top: 0,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  contentChild: {
    padding: 0,
  },
  contentView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  contentTxt: {
    color: 'black',
    marginLeft: 8,
    fontSize: 12,
  },
  contentFooter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 12,
  },
});
