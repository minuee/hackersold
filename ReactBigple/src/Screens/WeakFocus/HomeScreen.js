
import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, Text, ActivityIndicator ,ScrollView, TouchableOpacity,Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import { Button } from 'react-native-elements';


import RouteScreen from './RouteScreen';
const {width: SCREEN_WIDTH} = Dimensions.get("window");

const Eduitems = [
  { name: '토익',nav: 'ToeicScreen', },        
  { name: '일본어',nav: 'JapanScreen', },
  { name: '중국어',nav: 'ChinaScreen', },
];
export default class HomeScreen extends Component {

  constructor(props) {
      super(props);
      //console.log('tab4', this.props.screenState.LoginToken);
      this.props.screenProps.navigation.addListener('willFocus', async payload=>{
        await this.props.screenState.getTokenStorage();
        console.log('tabs4 home',this.props.screenState.LoginToken)
        if ( this.state.LoginToken === null  ) {
          //this.isTokenNull();  
        }
      })
      this.state  = {
        loading : false,
        nowFocus : 'ToeicScreen',
        focusTab : this.props.screenState.focusTab,
        LoginToken : this.props.screenState.LoginToken
      }
  }

  UNSAFE_componentWillMount() {
    if ( this.state.LoginToken === null  ) {
      this.isTokenNull();  
    }
  }

  isTokenNull = async() => {
    Alert.alert(        
      "로그인 후 사용 가능합니다.",        
      null,
      [
          {text: '로그인', onPress: this._goLogin.bind(this)},
          {text: '취소', onPress: null},
          
      ],
      { cancelable: false }
    )
  }
  _exitAction(){      
    this.props.screenState.moveTopTab(this.props.screenState.beforeFocusTab);
  }
  _goLogin (){    
    this.props.screenProps.navigation.navigate('NavSignInScreen');
  }
  

  moveNext = (snav) => {
    this.setState({ nowFocus : snav });
    this.setState({ focusTab : this.props.screenState.focusTab  });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if ( nextProps.screenState.focusTab !== this.state.focusTab ) {
        this.setState({ loading : true });
        this.refresh_end();    
    }
  }
  
  shouldComponentUpdate(nextProps, nextState) {      
      //console.log('this.props.screenState.focusTab',this.state.focusTab);
      return true;
  }

  refresh_end = () => {
    setTimeout(() => {        
      this.setState({                     
        loading : false
        });      
    }, 500)
  }


  render() {


    return (
      this.state.loading ? 
        <View style={[styles.MainContainer,{height:'100%',textAlign: 'center',alignItems: 'center',justifyContent: 'center',}]}>
          
          <ActivityIndicator size="large" />
        </View>
      :
      this.state.LoginToken === null && this.props.screenState.LoginToken === null       
      ?
      <View style={styles.MainContainer}>
          <View style={styles.textContainer}>
            <Icon name="exclamation-circle" size={25} color="#555" />
              <Text style={styles.title}>
                  아직 교재 풀이를 진행하지 않으셨어요.{"\n"}
                  무료 모의고사 or 교재풀이를 하시면 상세한 풀이 결과를 분석 받으실 수 있습니다.{"\n"}
                  로그인후 이용이 가능하십시다.{"\n"}
              </Text>
          </View>
          <View style={styles.buttonContainer}>
              <View style={styles.buttonWrap}>
                  <Button                                
                      title="로그인"                     
                      onPress= {()=> this._goLogin()}                       
                  />    
              </View>
          </View>
      </View>
      :
      <View style={styles.MainContainer}>
      
        <View style={styles.HeaderContainer}>
          <ScrollView  horizontal={true}>
              { Eduitems.map((item, index) => {
                  return(
                    <View key={index} 
                      style={[styles.itemContainer,this.state.nowFocus === item.nav ? styles.nowfocus : styles.notfocus]} 
                      >
                      {
                        this.state.nowFocus === item.nav ? 
                        <TouchableOpacity>
                          <Text>{item.name}</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={styles.itemView} onPress= {()=> this.moveNext(item.nav)}>
                          <Text 
                            style={this.state.nowFocus === item.nav ? styles.fontColorWhite : styles.fontColorGray} >{item.name}</Text>
                        </TouchableOpacity>
                      }
                    </View>
                  )
              })}
          </ScrollView>          
        </View>
        <View style={{flex:1}}>
            <RouteScreen screenProps={this.props.screenProps} screenState={this.state}/>
          </View>       
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1    
  },
  HeaderContainer: {    
    height : 50,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  itemContainer: {  
    flex : 1,
    width: SCREEN_WIDTH / Eduitems.length,
    height : 50,     
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemView: {      
    width: '100%',    
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nowfocus : {
    backgroundColor : '#ccc'
  },
  notfocus : {
    backgroundColor : '#fff'
  },
  fontColorWhite : {
    color : '#fff'
  },
  fontColorGray : {
    color : '#ccc'
  },
  textContainer : {
    flex:1,          
    padding:10,      
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer : {
      flex:1,
      width:'98%',        
      //flexDirection : 'row',
      marginBottom : 10
  },
  buttonWrap : {
      flex:1,
      height:40,
      paddingHorizontal : 5,
      marginVertical : 5
  },
  title: {
      fontSize: 14,
      textAlign: 'center',
      margin: 10,
      color: '#555'
  }
});