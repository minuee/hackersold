import React, {Component} from 'react';
import {StyleSheet, Text, View,Dimensions, ImageBackground} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

import CommonStyle from '../../Styles/CommonStyle'
const {width: SCREEN_WIDTH} = Dimensions.get("window");

console.log("SCREEN_WIDTH", SCREEN_WIDTH);
export default class ResultScreen extends Component {

   
    render() {
        return (
            <View style={styles.container}>
                <ImageBackground  
                    style= { styles.backgroundImage } 
                    source={require('../../../assets/images/focus_bg_free.png')} 
                    imageStyle={{
                        resizeMode: "cover",
                        alignSelf: "flex-end"
                      }}
                    >
                            
                    
                    <View style={styles.BodyContainer}>
                        <View style={styles.textContainer}>
                            <Text style={[CommonStyle.font20,{fontWeight : 'bold',color:'#aaa'}]}>
                                취약 유형
                            </Text>
                        </View>
                        <View style={styles.graphContainer}>
                            <View style={styles.graphWrap}>
                                <View style={styles.circleContainer}>
                                    <View style={styles.circleHeader}>
                                        <Text style={[CommonStyle.textWhite,{fontSize:SCREEN_WIDTH/12}]}>
                                            60%
                                        </Text>
                                    </View>
                                    <View style={styles.circleMiddle}>

                                    </View>
                                    <View style={styles.circleFooter}>
                                        <Text style={[CommonStyle.textWhite,{fontSize:SCREEN_WIDTH/24}]}>오답률</Text>
                                    </View>
                                </View>
                                <View style={[styles.textContainer,CommonStyle.textCenter]}>
                                    <Text style={styles.title}>
                                        준동사구{"\n"}(PART5)
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.graphWrap}>
                                <View style={styles.circleContainer}>
                                    <View style={styles.circleHeader}>
                                        <Text style={[CommonStyle.textWhite,{fontSize:SCREEN_WIDTH/12}]}>
                                            60%
                                        </Text>
                                    </View>
                                    <View style={styles.circleMiddle}>

                                    </View>
                                    <View style={styles.circleFooter}>
                                        <Text style={[CommonStyle.textWhite,{fontSize:SCREEN_WIDTH/24}]}>오답률</Text>
                                    </View>
                                </View>
                                <View style={[styles.textContainer,CommonStyle.textCenter]}>
                                    <Text style={styles.title}>
                                        어휘{"\n"}(PART6)
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.graphWrap}>
                                <View style={styles.circleContainer}>
                                    <View style={styles.circleHeader}>
                                        <Text style={[CommonStyle.textWhite,{fontSize:SCREEN_WIDTH/12}]}>
                                            60%
                                        </Text>
                                    </View>
                                    <View style={styles.circleMiddle}>

                                    </View>
                                    <View style={styles.circleFooter}>
                                        <Text style={[CommonStyle.textWhite,{fontSize:SCREEN_WIDTH/24}]}>오답률</Text>
                                    </View>
                                </View>
                                <View style={[styles.textContainer,CommonStyle.textCenter]}>
                                    <Text style={styles.title}>
                                        주제/목적찾기{"\n"}(PART5)
                                    </Text>
                                </View>
                            </View>
                        </View>                        
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    backgroundImage:{        
        flex:1,
        overflow : 'hidden',
        width: '100%',
        
    },
   
    BodyContainer : {
        flex:1,
        width:'100%',
        padding : 20,        
    },
    textContainer : {
        flex:1,
        width:'100%',
        
    },
    graphContainer : {
        flex:1,
        width:'98%',        
        flexDirection : 'row',
        marginBottom : 10
    },
    graphWrap : {
        flex:1,        
        paddingHorizontal : 5,
        marginVertical : 5
    },
    circleContainer : {       
        flex :1, 
        width : ( SCREEN_WIDTH / 3 ) - 30 ,
        height : ( SCREEN_WIDTH / 3 ) - 30,
        borderRadius : (( SCREEN_WIDTH / 3 ) - 30)/2,
        backgroundColor : '#ccc',        
        marginVertical : 20,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',        
        
    },
    circleHeader : {
        flex : 3,        
        alignItems: 'center',
        justifyContent: 'flex-end',
        textAlign: 'center',   

    },
    circleMiddle : {
        flex : 0.1,        
        width : '60%',        
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',   
        backgroundColor : '#fff',
        

    },
    circleFooter : {
        flex : 2,
        paddingTop : 5,
        alignItems: 'center',
        justifyContent: 'flex-start',
        textAlign: 'center',
    },
    title: {
        fontSize: 14,
        textAlign: 'center',
        color: '#555'
    }

});
