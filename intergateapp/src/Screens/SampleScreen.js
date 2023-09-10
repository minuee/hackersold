import React from 'react';
import { Text, Image, View, StyleSheet, ScrollView,SafeAreaView,ImageBackground,Platform,ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../Ducks/Actions/MainActions';

class SampleScreen extends React.Component {

   constructor(props) {
      super(props);
      this.state = {      
            loading : false,
            thisFocus : this.props.screenState.nowFocus,
            focusTab : this.props.screenState.focusTab,
            names: [
               {'name': 'Ben', 'id': 1},
               {'name': 'Susan', 'id': 2},
               {'name': 'Robert', 'id': 3},
               {'name': 'Mary', 'id': 4},
               {'name': 'Daniel', 'id': 5},
               {'name': 'Laura', 'id': 6},
               {'name': 'John', 'id': 7},
               {'name': 'Debra', 'id': 8},
               {'name': 'Aron', 'id': 9},
               {'name': 'Ann', 'id': 10},
               {'name': 'Steve', 'id': 11},
               {'name': 'Olivia', 'id': 12}
            ],
            imgHeight : 45,
            imgWidth : 45
      };
      
  } 

  

   UNSAFE_componentWillMount() {
      console.log('toeic UNSAFE_componentWillMount');
    
      this.setState({ 
          loading: true   
          
      });
      
     
   }    

   componentDidMount() {        
      console.log('toeic componentDidMount');    
      setTimeout(
          () => {
              this.setState({ loading: false});
          },500)
   }

   UNSAFE_componentWillUnmount() {
      console.log('toeic UNSAFE_componentWillUnmount');    
      
   }  
   
   componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보

   }

   UNSAFE_componentWillReceiveProps(nextProps) {
      if ( nextProps.screenState.focusTab !== this.state.focusTab ) {
          this.setState({ loading : true });
          this.refresh_end();    
      }
   }

   refresh_end = () => {
      setTimeout(() => { 
         this.setState({
            loading : false,
            imgHeight : 45,
            imgWidth : 45  
         });      
      }, 500)
    }

   shouldComponentUpdate(nextProps, nextState) {
      return true;
   }
 
   handleOnScroll (event) {
      //console.log('handleOnScroll',event.nativeEvent.contentOffset.y);
     if ( event.nativeEvent.contentOffset.y >= 45 ) {
        this.setState({
           imgHeight : 20,
           imgWidth : 20         
        })
     }else if ( event.nativeEvent.contentOffset.y > 0 && event.nativeEvent.contentOffset.y < 45 ) {         
        this.setState({
           imgHeight : event.nativeEvent.contentOffset.y/2,
           imgWidth : event.nativeEvent.contentOffset.y/2         
        })
     }else{
        this.setState({            
           imgHeight : 45,
           imgWidth : 45         
        })
     }      
     if ( event.nativeEvent.contentOffset.y >= 200 ) {
        this.props.screenProps.resizeTopHeader(40);
       this.props._updateStatusNowScroll(false); 
       
     }else{
        this.props.screenProps.resizeTopHeader(80);
       this.props._updateStatusNowScroll(true);         
     }
  }
  loadMoreData = (code) => {
     //console.log("code", code);
     //console.log("code contentOffset", code.contentOffset);
     
   
  }

   render() {
      if ( this.state.loading ) {
         return (
             <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
         )
      }else {
         return (
            <View style={styles.container}>              
               <View style={styles.hiddenMenu}>
                  <Image
                     //source={{ur:'https://project.hackers.com/assets/images/react/avatar6.png'}}
                     style={{height : this.state.imgHeight, width:this.state.imgWidth, borderRadius : this.state.imgWidth/2}}
                     source={{uri: Platform.OS === 'ios' ? 'https' + '://project.hackers.com/assets/images/react/avatar6.png': 'http'  + '://project.hackers.com/assets/images/react/avatar6.png'}}
                  />
               </View>
               
               <ScrollView
                  indicatorStyle={'white'}
                  scrollEventThrottle={16}
                  keyboardDismissMode={'on-drag'}
                  onScroll={e => this.handleOnScroll(e)}
                  onMomentumScrollEnd = {({nativeEvent}) => { 
                     //this.loadMoreData (nativeEvent) 
                  }}

                  onScrollEndDrag ={({nativeEvent}) => { 
                     this.loadMoreData (nativeEvent) 
               }}
               >
                  {
                     this.state.names.map((item, index) => (
                        <View key={item.id} style={styles.item} index={index}>
                           <ImageBackground
                              // resizeMethod={'auto'}
                              style={{
                                 flex:1,
                                 padding: 30,
                                 position: 'absolute',
                                 bottom:0,
                                 right:10,
                              }}
                              resizeMode='contain'
                              source={require('../../assets/images/brain.png')}
                              
                              >
                              
                              </ImageBackground>
                              <Text style={{ color: "#000", fontSize: 16 }}>
                                 {item.name}{item.name}{item.name}{item.name}{item.name}{item.name}{item.name}
                              </Text>
                        </View>
                     ))
                  }
               </ScrollView>
            </View>
         )
      }
   }
}


const styles = StyleSheet.create ({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
  },
   hiddenMenu : {
      left : 0,
      top :0,
      width : '100%',     
      alignItems : 'center',
      justifyContent : 'center',
      backgroundColor : '#ebebeb',
      zIndex : 2
   },
   galleryWrap : {
      height : 200,
      width : '100%'
   },
   item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: 30,
      margin: 2,
      borderColor: '#2a4944',
      borderWidth: 1,
      backgroundColor: '#d2f7f1'
   },
   IndicatorContainer : {
      flex: 1,
      width:'100%',
      backgroundColor : "#fff",
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
  },
})

function mapStateToProps(state) {
    return {
        selectBook: state.GlabalStatus.selectBook,    
        topFavoriteMenu: state.GlabalStatus.topFavoriteMenu,   
    };
}


function mapDispatchToProps(dispatch) {
    return {
        _updateStatusNowScroll:(boolen) => {
            dispatch(ActionCreator.updateStatusNowScroll(boolen));

        }
    };
}

SampleScreen.propTypes = {
    selectBook: PropTypes.object,
    topFavoriteMenu: PropTypes.bool,   
};


export default connect(mapStateToProps, mapDispatchToProps)(SampleScreen);
