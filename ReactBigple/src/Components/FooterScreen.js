import React, {Component} from 'react';
import {StyleSheet, Text, View,TouchableOpacity} from 'react-native';

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
                    <View
                        style={styles.linkWrap}>
                        
                        <TouchableOpacity 
                            style={styles.paddingh5}
                            onPress= {()=> this.goNextScreen('login')}
                        >
                            <Text style={styles.linkText}>로그인</Text>                                
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.paddingh5}
                            onPress= {()=> this.goNextScreen('join')}
                        >
                            <Text style={styles.linkText}>회원가입</Text>                                
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.paddingh5}
                            onPress= {()=> this.goNextScreen('information')}
                        >
                            <Text style={styles.linkText}>고객센터</Text>                                
                        </TouchableOpacity>
                    </View>
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
        backgroundColor:'#bbb',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom : 10
    },
    linkWrap : {
        flex:1,
        flexDirection :'row',
        paddingVertical:10,
        marginBottom:20
    },
    linkText : {
        color:'#fff',fontSize:15
    },
    infoText :  {
        color:'#555',fontSize:13,textAlign: 'center',alignItems: 'center'
    },
    paddingh5 : {
        paddingHorizontal : 5
    }

  

});
