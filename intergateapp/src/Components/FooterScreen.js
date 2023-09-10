import React, {Component} from 'react';
import {StyleSheet, Text, View,TouchableOpacity,Dimensions, Platform} from 'react-native';
const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");
import DaumPostcode from '../Utils/DaumPostCode';
import JWPlayer from '../Utils/JWPlayer';
export default class FooterScreen extends Component {

    constructor(props) {
        super(props);        
        this.state  = {          
        }
    } 
      
    goNextScreen = (snav) => {    
        
        switch(snav) {
            case 'login' : this.props.screenProps.navigation.navigate('NavSignInScreen',{});  break;
            case 'join' : this.props.screenProps.navigation.navigate('NavSignInScreen',{});  break;
            case 'information' : this.props.screenProps.navigation.navigate('NavSignInScreen',{});  break;
            default : null
        }
    }
  
   
    render() {
        return (
            <View
                style={styles.container}>
                    <View style={styles.linkWrap}>
                        
                        <TouchableOpacity 
                            style={styles.paddingh5}
                            //onPress= {()=> this.goNextScreen('login')}
                        >
                            <Text style={styles.linkText}>해커스에 바란다</Text>                                
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.paddingh5}
                            //onPress= {()=> this.goNextScreen('join')}
                        >
                            <Text style={styles.linkText}>ㄷㅓ존 갈까</Text>                                
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.paddingh5}
                            //onPress= {()=> this.goNextScreen('information')}
                        >
                            <Text style={styles.linkText}>고객센터</Text>                                
                        </TouchableOpacity>
                    </View>
                    {/*
                    <View style={styles.linkWrap}>
                    <JWPlayer
                        style={{ zIndex:5,width: SCREEN_WIDTH-20, height: Platform.OS === 'ios' ? SCREEN_WIDTH-20 : SCREEN_WIDTH}}
                        jsOptions={{ animated: true }}
                        onSelected={(data) => alert(JSON.stringify(data))}
                    />
                    </View>
                    */}
                    <View
                        style={{flex:1}}>
                        <Text style={styles.infoText}>
                            (C)Hackers Education Group{"\n"}
                            (주)챔프스터디 | 사업자등록번호 120-87-09984{"\n"}
                            대표번호 : 02.554.7272 | FAX : 02.554.0551{"\n"}
                            대표이사 : 전재윤
                        </Text>
                    </View>
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        padding:10,
        backgroundColor:'#ccc',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    linkWrap : {
        flex:1,
        backgroundColor :'transparent',
        flexDirection :'row',
        paddingVertical:10,
        marginBottom:20,
        zIndex:100
    },
    linkText : {
        color:'#fff',
        fontSize:15,
        //letterSpacing:0.5
    },
    infoText :  {
        color:'#555',fontSize:13,textAlign: 'center',alignItems: 'center'
    },
    paddingh5 : {
        paddingHorizontal : 5
    }

  

});
