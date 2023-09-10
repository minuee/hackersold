import React, {Component} from 'react';
import {StyleSheet, Text, View,TouchableOpacity,Dimensions,Image,Animated,ScrollView, Platform} from 'react-native';
import Toast from 'react-native-tiny-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableHighlight } from 'react-native-gesture-handler';
Icon.loadFont();

const {width: SCREEN_WIDTH} = Dimensions.get("window");

export default class PremiumTest extends React.Component {

    constructor(prop) {
        super(prop);
        this.state  = {  
            showItem : 1,  
            items : [
                { 
                    index : 1 ,    
                    remainTime : 60*75,    
                    remainPercentage : 10,           
                    imageuri : 'https://image.kyobobook.co.kr/images/book/xlarge/785/x9788965422785.jpg',
                    parts : [
                        { part : 'PART1', idx : 1 ,bgColor : '#3986ef'},
                        { part : 'PART2', idx : 2 ,bgColor : '#3986ef'},
                        { part : 'PART3', idx : 3 ,bgColor : null},
                        { part : 'PART4', idx : 4 ,bgColor : null}
                    ]
                },
                { 
                    index : 2 ,    
                    remainTime : 60*75,              
                    remainPercentage : 50,            
                    imageuri :  'https://gscdn.hackers.co.kr/hackers/files/bookmanager/9924ec4b55d9b4fbd13599a94a7281f0.jpg',
                    parts : [
                        { part : 'PART1', idx : 1 ,bgColor : '#3986ef'},
                        { part : 'PART2', idx : 2 ,bgColor : '#3986ef'},
                        { part : 'PART3', idx : 3 ,bgColor : '#3986ef'},
                        { part : 'PART4', idx : 4 ,bgColor : '#3986ef'},
                        { part : 'PART5', idx : 5 ,bgColor : null},
                        { part : 'PART6', idx : 6 ,bgColor : null}
                    ]
                },
                { 
                    index : 3 ,    
                    remainTime : 60*75, 
                    remainPercentage : 70,
                    imageuri :  'https://gscdn.hackers.co.kr/hackers/files/bookmanager/8fcd4f90205167477a72eaeef7c64a79.jpg',
                    parts : [
                        { part : 'PART1', idx : 1 ,bgColor : '#3986ef'},
                        { part : 'PART2', idx : 2 ,bgColor : '#3986ef'},
                        { part : 'PART3', idx : 3 ,bgColor : '#3986ef'},
                        { part : 'PART4', idx : 4 ,bgColor : '#3986ef'},
                        { part : 'PART5', idx : 5 ,bgColor : '#3986ef'},
                        { part : 'PART6', idx : 6 ,bgColor : null}
                    ]
                },
                         
            ]

        }
    }
    moveDetail = (indexno) => {
        const alerttoast = Toast.show('선택한 번호는  : ' + indexno);
            setTimeout(() => {
                Toast.hide(alerttoast)
            }, 2000)     
    }

    btnSpread = ( sitems) => {        
        this.setState({
            showItem : sitems === 1 ? 3 : 1
        })
    
    }

    render() {

  

        return (
            <View style={styles.container}>                               
                <View style={styles.bodyWrapper}>
                    <View >
                    { this.state.items.map((data, tindex) => {   
                        let parts =  data.parts;
                            if ( tindex < this.state.showItem ) {
                                return (
                                    <View  style={styles.commonerow} key={tindex}>
                                        <View style={styles.leftrow}>
                                            <Image source={{uri:data.imageuri}} style={{width:'100%',height:'100%'}} resizeMode='contain' />
                                        </View>
                                        <View style={styles.rightrow}>
                                            <View style={styles.rightHeaderrow}>
                                                <View style={styles.rightHeaderrowTitle}>
                                                    <Text style={[styles.itemText,{color:'#555'}]}>남은 풀이시간 : 00:44:27</Text>
                                                </View>
                                                <View style={styles.rightHeaderrowTitle}>
                                                    <View style={styles.progressBar}>
                                                        <Animated.View style={[styles.absoluteFill,{backgroundColor: "#3986ef", width: data.remainPercentage+'%'}]}/>
                                                    </View>
                                                </View>
                                            </View>   
                                            <ScrollView 
                                            horizontal
                                            scrollEnabled
                                            nestedScrollEnabled
                                            style={styles.rightBodyrow}>
                                                {                                    
                                                    parts.map((item, index) => {
                                                        return (
                                                            <View style={[styles.gridView,item.bgColor !== null && {backgroundColor : item.bgColor}]} key={index} >
                                                                <TouchableOpacity  
                                                                    onPress= {()=> this.moveDetail(item.idx)} 
                                                                    style={[styles.itemContainer]}
                                                                >
                                                                    <Text style={[styles.itemText,styles.textWhite]}>{item.part}</Text>
                                                                </TouchableOpacity> 
                                                            </View> 
                                                        )
                                                    })
                                                }
                                            </ScrollView>      
                                        </View>
                                    </View>
                                )
                            }
                        })
                    }
                    </View>
                    <View style={styles.spreadWrap}>
                        <View style={[styles.spreadView,{alignItems:'flex-end',paddingRight:5}]}>
                            <TouchableHighlight
                                 onPress= {()=> this.btnSpread(this.state.showItem)}>
                            {this.state.showItem === 1 ?
                                <Icon name="chevron-circle-down" size={25} color="#3986ef" />
                                :
                                <Icon name="chevron-circle-up" size={25} color="#3986ef" />
                            }
                            </TouchableHighlight>
                        </View>
                        <View style={[styles.spreadView,{alignItems:'flex-start'}]}>
                            <TouchableHighlight
                                 onPress= {()=> this.btnSpread(this.state.showItem)}>
                                {this.state.showItem === 1 ?
                                <Text style={{fontSize : 15,color:'#3986ef'}}>펼치기</Text> 
                                :
                                <Text style={{fontSize : 15,color:'#3986ef'}}>접기</Text>
                                 }
                                
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    mainTitle: {
        fontSize: 15,        
        marginHorizontal: 10,
    },
    headerWrapper: {        
        flex : 1,
        backgroundColor: '#fff',
        paddingVertical : 10
    },
    bodyWrapper: {                
        paddingVertical : 10,        
    },
    commonerow: {
        flex: 1,        
        flexDirection :'row',
        marginBottom : 10
    },
    spreadWrap : {
        flex: 1,        
        flexDirection :'row',
        paddingVertical : 10,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    spreadView : {
        flex:1
    },
    leftrow : {
        flex: 1,
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
        flex : 1,
        flexDirection : 'row',        
    },
    rightHeaderrowTitle : {                     
        width : '95%',
        borderRadius :  5,
        paddingVertical : 2,
        paddingRight : 5,
        textAlign: 'center',
        alignItems: 'stretch',
        justifyContent: 'center',
    }, 
    gridView: {        
        flex: 1,        
        width : 60,
        height : 60 ,
        borderRadius : 30,
        marginHorizontal: 5,
        marginTop:5,
        backgroundColor: "#ccc",
    }, 
    imagewrap : {
        height : SCREEN_WIDTH / 4,
        padding:10        
    },
    imageTextTitle: {                
        paddingVertical : 10
    }, 
    itemContainer: {
        flex : 1,
        
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',        
    },    
    itemText: {
        paddingHorizontal : 5,
        fontSize: 12,
        fontWeight: '600',        
    },
    
    textWhite : {
        color : '#fff'
    },
    textGray : {
        color : '#ccc'
    },
    
    progressBar: {
        height: 3,
        width: '100%',
        backgroundColor: '#ccc',
        
        
    },
    absoluteFill : {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    }

});

