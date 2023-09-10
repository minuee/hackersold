import React, {Component} from 'react';
import {StyleSheet, Text, View,TouchableOpacity,Dimensions} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import Toast from 'react-native-tiny-toast';

const {width: SCREEN_WIDTH} = Dimensions.get("window");

export default class LcScreen extends Component {

    constructor(prop) {
        super(prop);
        this.state  = {
            speechRate: 0.5,
            speechPitch: 1
        }
    }
    moveDetail = (indexno) => {
        const alerttoast = Toast.show('선택한 번호는  : ' + indexno);
            setTimeout(() => {
                Toast.hide(alerttoast)
            }, 2000)     
    }

    render() {

        const items = [
            { part : 'PART5', idx : 1},
            { part : 'PART6', idx : 2},
            { part : 'PART9', idx : 3}           
        ];

        

        return (
            <View style={styles.container}>                
                <View style={styles.headerWrapper}>
                    <Text style={styles.mainTitle}>
                        OO에서 제공하는 레벨 테스트 모의고사를 풀고 맞춤형 취약 문제를 추천 받으세요! 
                    </Text>
                </View>
                <View style={styles.bodyWrapper}>
                    <View style={styles.commonerow}>
                        <View style={styles.leftrow}>
                            <Text style={[styles.itemText,styles.underline]}>RC{"\n"}</Text>
                            <Text style={[styles.itemText,styles.textCenter]}>해커스 프리미엄 토익 모의고사(vol.1)</Text>
                        </View>
                        <View style={styles.rightrow}>
                            <View style={styles.rightHeaderrow}>
                                <View style={styles.rightHeaderrowTitle}>
                                    <Text style={[styles.itemText,styles.textWhite]}>머시이기저시기 vol.1</Text>
                                </View>
                            </View>                                
                            <FlatGrid
                                itemDimension={(SCREEN_WIDTH / 4) - 25}
                                items={items}
                                style={styles.gridView}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity key={index}  onPress= {()=> this.moveDetail(item.idx)} style={styles.itemContainer}>
                                        <Text style={[styles.itemText,styles.textWhite]}>{item.part}</Text>
                                    </TouchableOpacity>
                                )}
                            />                                
                        </View>
                    </View>
                    <View style={styles.commonerow}>
                        <View style={styles.leftrow}>
                            <Text style={[styles.itemText,styles.underline]}>RC{"\n"}</Text>
                            <Text style={[styles.itemText,styles.textCenter]}>해커스 프리미엄 토익 모의고사(vol.2)</Text>
                        </View>
                        <View style={styles.rightrow}>
                            <View style={styles.rightHeaderrow}>
                                <View style={styles.rightHeaderrowTitle}>
                                    <Text style={[styles.itemText,styles.textWhite]}>머시이기저시기 vol.2</Text>
                                </View>
                            </View>   
                            <View style={styles.rightBodyrow}>
                                {                                    
                                    items.map((item, index) => {
                                        return (
                                            <View style={styles.gridView} key={index} >
                                                <TouchableOpacity  onPress= {()=> this.moveDetail(item.idx)} style={[styles.itemContainer,{margin:5}]}>
                                                    <Text style={[styles.itemText,styles.textWhite]}>{item.part}</Text>
                                                </TouchableOpacity> 
                                            </View> 
                                        )
                                    })
                                }
                            </View>      
                        </View>

                    </View>
                    <View style={styles.commonerow}>
                        <View style={styles.leftrow}>
                            <Text style={[styles.itemText,styles.underline]}>RC{"\n"}</Text>
                            <Text style={[styles.itemText,styles.textCenter]}>해커스 프리미엄 토익 모의고사(vol.3)</Text>
                        </View>
                        <View style={styles.rightrow}>
                            <View style={styles.rightHeaderrow}>
                                <View style={styles.rightHeaderrowTitle}>
                                    <Text style={[styles.itemText,styles.textWhite]}>머시이기저시기 vol.3</Text>
                                </View>
                            </View>   
                            <View style={styles.rightBodyrow}>
                                {                                    
                                    items.map((item, index) => {
                                        return (
                                            <View style={styles.gridView} key={index} >
                                                <TouchableOpacity  onPress= {()=> this.moveDetail(item.idx)} style={[styles.itemContainer,{margin:5}]}>
                                                    <Text style={[styles.itemText,styles.textWhite]}>{item.part}</Text>
                                                </TouchableOpacity> 
                                            </View> 
                                        )
                                    })
                                }
                            </View>      
                        </View>

                    </View>                    
                </View>
                {/*
                <View style={styles.headerWrapper}>
                    <Text style={styles.mainTitle}>
                        취약 유형 집중 공략
                    </Text>
                </View> 
                <View style={styles.bodyWrapper}>
                    <View style={styles.commonerow}>
                        <View style={styles.gridView} >
                            <View style={[styles.imagewrap,styles.redborder,styles.textCenter]} >
                                <Text style={[styles.itemText]}>image area</Text>
                            </View>
                            <View style={styles.imageTextTitle}>
                                <Text style={[styles.itemText]}>해커스 신토익Reading</Text>
                            </View>
                            <View style={styles.imageTextTitle}>
                                <Text style={[styles.itemText]}>해설 : 11강 | 홍길동</Text>
                            </View>
                        </View>
                        <View style={styles.gridView} >
                            <View style={[styles.imagewrap,styles.redborder,styles.textCenter]} >
                                <Text style={[styles.itemText]}>image area</Text>
                            </View>
                            <View style={styles.imageTextTitle}>
                                <Text style={[styles.itemText]}>해커스 신토익 Listening</Text>
                            </View>
                            <View style={styles.imageTextTitle}>
                                <Text style={[styles.itemText]}>해설 : 11강 | 홍길동</Text>
                            </View>
                        </View>
                    </View>
                </View>      
                <View style={styles.headerWrapper}>
                    <Text style={styles.mainTitle}>
                        한 단계 Level-up! 집중공략
                    </Text>
                </View> 
                <View style={styles.bodyWrapper}>
                    <View style={styles.commonerow}>
                        <View style={styles.gridView} >
                            <View style={[styles.imagewrap,styles.redborder,styles.textCenter]} >
                                <Text style={[styles.itemText]}>image area</Text>
                            </View>
                            <View style={styles.imageTextTitle}>
                                <Text style={[styles.itemText]}>해커스 신토익Reading</Text>
                            </View>
                            <View style={styles.imageTextTitle}>
                                <Text style={[styles.itemText]}>해설 : 11강 | 홍길동</Text>
                            </View>
                        </View>
                        <View style={styles.gridView} >
                            <View style={[styles.imagewrap,styles.redborder,styles.textCenter]} >
                                <Text style={[styles.itemText]}>image area</Text>
                            </View>
                            <View style={styles.imageTextTitle}>
                                <Text style={[styles.itemText]}>해커스 신토익 Listening</Text>
                            </View>
                            <View style={styles.imageTextTitle}>
                                <Text style={[styles.itemText]}>해설 : 11강 | 홍길동</Text>
                            </View>
                        </View>
                    </View>
                </View> 
                <View style={styles.headerWrapper}>
                    <Text style={styles.mainTitle}>
                        문제풀이 추천
                    </Text>
                </View> 
                <View style={styles.bodyWrapper}>
                    <View style={styles.commonerow}>
                        <View style={styles.gridView} >
                            <View style={[styles.imagewrap,styles.redborder,styles.textCenter]} >
                                <Text style={[styles.itemText]}>image area</Text>
                            </View>
                            <View style={styles.imageTextTitle}>
                                <Text style={[styles.itemText]}>해커스 신토익Reading</Text>
                            </View>
                           
                        </View>
                        <View style={styles.gridView} >
                            <View style={[styles.imagewrap,styles.redborder,styles.textCenter]} >
                                <Text style={[styles.itemText]}>image area</Text>
                            </View>
                            <View style={styles.imageTextTitle}>
                                <Text style={[styles.itemText]}>해커스 신토익 Listening</Text>
                            </View>
                            
                        </View>
                        <View style={styles.gridView} >
                            <View style={[styles.imagewrap,styles.redborder,styles.textCenter]} >
                                <Text style={[styles.itemText]}>image area</Text>
                            </View>
                            <View style={styles.imageTextTitle}>
                                <Text style={[styles.itemText]}>해커스 신토익 Listening</Text>
                            </View>
                            
                        </View>
                    </View>
                </View>     
                */}       
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
    firstrow: {
        flex: 1,        
        flexDirection :'row',        
    },
    secondrow: {
        flex: 1,
        backgroundColor: "#4b3f72",
        flexDirection :'row'
    },
    thirdrow: {
        flex: 1,        
        backgroundColor: "#119da4",
        flexDirection :'row'
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
        flex: 1,
    }, 
    imagewrap : {
        height : SCREEN_WIDTH / 4,
        padding:10        
    },
    imageTextTitle: {                
        paddingVertical : 10
    }, 
    itemContainer: {
        height : SCREEN_WIDTH / 5,
        backgroundColor: "#ccc",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',        
    },    
    itemText: {
        paddingHorizontal : 5,
        fontSize: 13,
        fontWeight: '600',        
    },
    textCenter : {
        textAlign: 'center',
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

