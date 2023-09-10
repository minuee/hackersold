
import React, {Component} from 'react';
import {StyleSheet, Image, Text, View, Dimensions,TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
Icon.loadFont();

const {width: SCREEN_WIDTH} = Dimensions.get("window");

export default class TextBookScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            showItem : 3,
            isLoadmore : true,
            items : [
                {
                    index: 1,                    
                    title: '성남과 함께 하는 일본어',
                    theme: '교재 풀이',
                    imageuri : 'https://image.kyobobook.co.kr/images/book/xlarge/785/x9788965422785.jpg',
                    backgroundColor: '#20d2bb',
                    url : 'http://m.champ.hackers.com'
                },
                {
                    index: 2,
                    title: '해커스 10분의 기적',
                    theme: '교재 풀이',         
                    imageuri :  'https://gscdn.hackers.co.kr/hackers/files/bookmanager/9924ec4b55d9b4fbd13599a94a7281f0.jpg',
                    backgroundColor: '#20d2bb',
                    url : 'http://m.champ.hackers.com'
                },
                {
                    index: 3,
                    title: '해커스 반란을 꿈꾸다',
                    theme: '교재 풀이',
                    imageuri :  'https://gscdn.hackers.co.kr/hackers/files/bookmanager/8fcd4f90205167477a72eaeef7c64a79.jpg',
                    backgroundColor: '#20d2bb',
                    url : 'http://m.champ.hackers.com'
                },
                
            ]
        }
    }

    
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerWrapper}>
                    <Text style={styles.mainTitle}>
                        교재 풀이 추천
                    </Text>
                </View> 
                <View style={styles.bodyWrapper}>
                    <View style={styles.commonerow}>
                        { this.state.items.map((data, index) => {   
                            if ( index < this.state.showItem ) {
                                return (
                                    <View key={index} style={[styles.gridView]} >
                                        <TouchableHighlight 
                                            style={styles.imagewrap}  
                                            onPress= {()=> this.props.screenProps.goExplanationScreen(data.index,data.theme)}>    
                                            <Image
                                                source={{uri:data.imageuri}} 
                                                style={{height:'100%'}}
                                                resizeMode='contain'
                                            />
                                        </TouchableHighlight>
                                    
                                        <View style={styles.imageTextTitle}>
                                            <TouchableHighlight onPress= {()=> this.props.screenProps.goExplanationScreen(data.index,data.theme)}>
                                                <Text style={[styles.itemText]}>{data.title}</Text>
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                                )
                            }

                        })}                        
                    </View>
                    { this.state.isLoadmore && 
                    <View style={styles.morerWrapper}>                        
                        <View style={[styles.spreadView,{alignItems:'flex-end',paddingRight:5}]}>
                            <Icon name="plus" size={25} color="#3986ef" />
                        </View>
                        <View style={[styles.spreadView,{alignItems:'flex-start'}]}>
                            <TouchableHighlight onPress= {()=> this.props.screenProps.moveTopTab(1)}>
                                <Text style={{fontSize : 15,color:'#3986ef'}}>더보기</Text>
                            </TouchableHighlight>
                        </View>
                    </View> 
                    }
                </View> 
                
            </View>    
        );
    }
}

const styles = StyleSheet.create({
    container: {      
        flex:1,
        backgroundColor : '#fff',        
    },
    mainTitle: {
        fontSize: 15,        
        marginHorizontal: 10,
        color:'#3986ef'
    },
    headerWrapper: {        
        flex : 1,
        backgroundColor: '#fff',
        paddingVertical : 10
    },
    bodyWrapper: {     
        flex:5,        
        paddingVertical : 10,        
    },
    morerWrapper : {
        flex: 1,        
        flexDirection :'row',
        paddingVertical : 10,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    commonerow: {
        flex: 1, 
        flexDirection :'row',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    leftrow : {
        flex: 1,        
        backgroundColor: "#ebebeb",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',        
    },
    rightrow : {    
        flex: 3,        
        backgroundColor: "#fff",
        
    },
    rightHeaderrow : {
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },  
    rightBodyrow : {
        flex : 5,
        flexDirection : 'row',        
    },
    rightHeaderrowTitle : {                     
        width : '95%',
        borderRadius :  5,
        paddingVertical : 2,
        backgroundColor: "#bbbbbb",
        textAlign: 'center',
        alignItems: 'stretch',
        justifyContent: 'center',
    }, 
    gridView: {        
        width: ( SCREEN_WIDTH / 3 )- 20,    
        margin : 5
    }, 
    gridViewLeft : {
        paddingRight : 5
    },
    gridViewRight : {
        paddingLeft : 5
    },
    imagewrap : {
        flex:2,
        minHeight : 100,
       
    },
    imageTextTitle: {                
        flex:1,
        paddingVertical : 5,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',   
        
    }, 
    itemContainer: {        
        backgroundColor: "#ccc",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',        
    },    
    itemText: {
        paddingHorizontal : 5,
        fontSize: 13,
        color:'#555',
        fontWeight: '600',
    },
    textCenter : {        
        alignItems: 'center',
        justifyContent: 'center',
    },
    textWhite : {
        color : '#fff'
    },
    textGray : {
        color : '#ccc'
    },
    underline : {
        textDecorationLine: 'underline'
    },
    redborder : {
        borderColor: '#ff0000',
        borderWidth: 1,
    }

});