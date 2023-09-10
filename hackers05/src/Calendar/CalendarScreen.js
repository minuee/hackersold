import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions , ScrollView, ActivityIndicator,FlatList ,Alert,AsyncStorage} from 'react-native';
import { NavigationEvents,NavigationInjectedProps, withNavigation,NavigationScreenProp, NavigationState  } from 'react-navigation';
import {
  // getDay,
  format,
  addDays,
  subDays,  
} from 'date-fns';
import CalendarStrip from './CalendarStrip';
const width = Dimensions.get('window').width;

import moment from 'moment';
const nowdate = new Date();


class CalendarScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isdetailveiw : true,
      loading : false,
      ratesInventoryDataArray: [],
      selectedDate: new Date(),
      beforedate : new Date(nowdate.getFullYear(), nowdate.getMonth() - 1, nowdate.getDate()),
      afterdate : new Date(nowdate.getFullYear(), nowdate.getMonth() + 1, nowdate.getDate()),
    };
    
    
  }

  UNSAFE_componentWillMount() {
    console.log("componentWillMount",new Date(Date.now()));    
  }
  componentDidMount = () => {
    console.log("componentDidMount",new Date(Date.now()));
    this._checkAsyncToken();
  }
  UNSAFE_componentWillUnmount() {
    console.log("omponentWillUnmount",new Date(Date.now()));
  }
  _checkAsyncToken = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    
    //this.props.navigation.navigate(userToken ? "App" : "Auth");
  };

  _move_prev = async() => {
    const prevDate =  new Date(this.state.selectedDate.getFullYear(), this.state.selectedDate.getMonth()-1, this.state.selectedDate.getDate());
    const prevprevDate =  new Date(this.state.selectedDate.getFullYear(), this.state.selectedDate.getMonth()-2, this.state.selectedDate.getDate());
    this.setState({
      selectedDate: prevDate,
      beforedate : prevprevDate
    });
  }

  _move_next = async() => {
    const nextDate =  new Date(this.state.selectedDate.getFullYear(), this.state.selectedDate.getMonth()+1, this.state.selectedDate.getDate());
    const nextnextDate =  new Date(this.state.selectedDate.getFullYear(), this.state.selectedDate.getMonth()+2, this.state.selectedDate.getDate());
    this.setState({
      selectedDate: nextDate,   
      afterdate: nextnextDate,            
    });
  }

  _PressDate = async(date) => {
    const prevDate =  new Date(date.getFullYear(), date.getMonth()-1, date.getDate());
    const nextDate =  new Date(date.getFullYear(), date.getMonth()+1, date.getDate());
    this.setState({ 
      selectedDate: date ,
      beforedate : prevDate,
      afterdate: nextDate,
    });
    const selectedCalendarDateString = format(date, 'YYYY-MM-DD');
        
    await fetch('https://reactserver.hackers.com:3001/getvacation?rows=50&sdate=' + selectedCalendarDateString)
          .then(response => response.json())
          .then(responseJson => {
              this.setState({
                ratesInventoryDataArray: responseJson,
                loading: false
              });
          })
          .catch(error => {
              console.error(error);
              this.setState({
                  ratesInventoryDataArray: [],
                  loading: false
              });
          });
  }

  moveDetail = async (uidx,uname) => {
    this.setState({
      isdetailveiw : false
    })
    this.props.navigation.navigate('UserDetailScreen' , { UserIdx : uidx , UserName : uname});
  }

  _refreshscreen = async () => {
    console.log('didfocus okay');
      if ( this.state.isdetailveiw ) {
        this.setState({
          loading : false,
          ratesInventoryDataArray: [],
          selectedDate: new Date(),
          beforedate : new Date(nowdate.getFullYear(), nowdate.getMonth() - 1, nowdate.getDate()),
          afterdate : new Date(nowdate.getFullYear(), nowdate.getMonth() + 1, nowdate.getDate()),
        });
      }else{
        this.setState({
          isdetailveiw : true,
        })
      }
  }

  _didblur = async () => {
    console.log('didblur okay');
    //this.props.navigation.replace('HomeScreen');
  }


  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={() => this._refreshscreen()} onWillblur={() => this._didblur()} />
        <View style={styles.calendar_nav}>
          <TouchableOpacity onPress={this._move_prev}>
            <Text style={{ fontSize: 13, color: '#305082'}}>
              &lt; {this.state.beforedate.getFullYear()}년 {this.state.beforedate.getMonth()+1}월 {this.state.beforedate.getDate()}일
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._move_next}>
            <Text style={{ fontSize: 13, color: '#305082'}}>
              {this.state.afterdate.getFullYear()}년 {this.state.afterdate.getMonth()+1}월 {this.state.afterdate.getDate()}일 &gt;
            </Text>
          </TouchableOpacity>
        </View>
        <CalendarStrip
          selectedDate={this.state.selectedDate}
          onPressDate={(date) => {
            this._PressDate(date)            
          }}
          onPressGoToday={(today) => {
            this._PressDate(today)   
            //this.setState({ selectedDate: today });
          }}
          onSwipeDown={() => {
            alert('onSwipeDown');
          }}
          markedDate={['2019-12-01', '2019-12-02', '2019-12-04', '2019-12-06',]}
          weekStartsOn={1} // 0, 1,2,3,4,5,6 for S M T W T F S, defaults to 0
        />
        
        {
          this.state.loading ?
          <ActivityIndicator size="large" />
            : this.state.ratesInventoryDataArray.length > 0 &&
          <FlatList
              style={{ width: '100%',padding : 5 }}
              keyExtractor={(item, index) => index.toString()}
              data={this.state.ratesInventoryDataArray}
              renderItem={({ item, index }) => (
                  <TouchableOpacity style={styles.itemContainer} key={index} onPress= {()=> this.moveDetail(item.userId,item.name)}>
                      <Text style={styles.text} >
                          {index+1}
                          {'_'}
                          {item.User_Name}
                          {''}
                          {item.ChargeName}
                          {' '}
                          {'('}
                          {item.Group_Name}
                          {') - '}
                          {item.strType}
                      </Text>
                  </TouchableOpacity>
              )}
          />
        }
        
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  calendar_nav : {
    width,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  scrollwrap : {
    borderColor: '#000',
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'dashed'
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding : 10,
    height: 40,
    borderBottomColor: '#ebebeb',
    borderBottomWidth: 1
  },
  text: {
    fontSize: 15,
    color: 'black',
  },
});

export default withNavigation(CalendarScreen);