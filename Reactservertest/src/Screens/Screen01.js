//This is an example code for NavigationDrawer//
import React, { Component } from 'react';
//import react in our code.
import { StyleSheet, View, Text, Image } from 'react-native';
// import all basic components
 
export default class Screen01 extends Component {
  //Screen1 Component
  render() {
    return (
      <View style={styles.MainContainer}>
        <Text style={{ fontSize: 23 }}> Screen 1 </Text>      
        <Image  
            style= {{ height:150, width: 100 }}              
            source={require('../../assets/images/intro_mobile_recharge.png')} 
        />
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    //marginTop: 50,
    justifyContent: 'center',
    backgroundColor : 'skyblue'
  },
});