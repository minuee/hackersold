
import React, {Component} from 'react';
import {StyleSheet, ImageBackground, Text, View, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();


export default class CheckCapacityModal extends Component {

    constructor(props) {
        super(props);
        
        this.state = {            
            isFresh : false,
        }
    }

    UNSAFE_componentWillMount() {
    
    }    

    

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex:1, flexDirection:'row'}}>
                    <ImageBackground  
                        style= { styles.gridbackgroundImage } 
                        source={require('../../../../assets/images/grid01.png')} >
                        <View style={{flex:1,justifyContent:'center',borderColor:'#ebebeb', borderWidth :1}}>
                            <View style={{flex:4,alignItems:'flex-start',padding:10}}>
                                <Text style={{fontSize:15,color:'#000',fontWeight:'bold'}}>해커스{"\n"}진단테스트 </Text>
                                <Text style={{fontSize:35,color:'#ccc',fontWeight:'bold'}}>vol.1 </Text>
                            </View>
                            <View style={{flex:1,backgroundColor:'#000',paddingHorizontal:5, paddingVertical : 15,alignItems:'center', justifyContent:'center',opacity:0.7}}>
                                <Text style={{fontSize:15,color:'#fff'}}>시험응시</Text>
                            </View>
                        </View>
                    </ImageBackground>
                    <ImageBackground  
                        style= { styles.gridbackgroundImage } 
                        source={require('../../../../assets/images/grid01.png')} >
                        <View style={{flex:1, justifyContent:'center',borderColor:'#ebebeb', borderWidth :1,backgroundColor:'#000',opacity:0.3}}>
                            <View style={{flex:4,alignItems:'flex-start',padding:10}}>
                                <Text style={{fontSize:15,color:'#999',fontWeight:'bold'}}>해커스{"\n"}진단테스트 </Text>
                                <Text style={{fontSize:35,color:'#ccc',fontWeight:'bold'}}>vol.2 </Text>
                            </View>
                            <View style={{flex:1,width:'100%',paddingHorizontal:5, paddingVertical : 15,alignItems:'center', justifyContent:'center',}}>
                                <Icon name="lock" size={25} color="#fff" />
                            </View>
                        </View>
                    </ImageBackground>
                    <ImageBackground  
                        style= { styles.gridbackgroundImage } 
                        source={require('../../../../assets/images/grid01.png')} >
                        <View style={{flex:1,justifyContent:'center',borderColor:'#ebebeb', borderWidth :1,backgroundColor:'#000',opacity:0.3}}>
                            <View style={{flex:4,alignItems:'flex-start',padding:10}}>
                                <Text style={{fontSize:15,color:'#999',fontWeight:'bold'}}>해커스{"\n"}진단테스트 </Text>
                                <Text style={{fontSize:35,color:'#ccc',fontWeight:'bold'}}>vol.3 </Text>
                            </View>
                            <View style={{flex:1,width:'100%',paddingHorizontal:5, paddingVertical : 15,alignItems:'center', justifyContent:'center',}}>
                                <Icon name="lock" size={25} color="#fff" />
                            </View>
                        </View>
                    </ImageBackground>
                </View> 
                
            </View>    
        );
    }
}

const styles = StyleSheet.create({
    container: {     
        flex :1, 
        width : '100%'
    },
    gridbackgroundImage:{        
        flex:1,
        margin:2
    },

});