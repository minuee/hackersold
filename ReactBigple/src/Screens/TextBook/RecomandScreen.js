
import React, {Component} from 'react';
import {StyleSheet, Image, Text, View, Dimensions,TouchableHighlight,Switch, Platform,Linking} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import { CheckBox } from 'react-native-elements';
const {width: SCREEN_WIDTH} = Dimensions.get("window");
import ToggleSwitch from '../../Utils/ToggleSwitch';

const UrlLink = "https://m.hackers.co.kr/?m=mobile&front=book&category=book_inform&tab=toeic";

export default class RecomandScreen extends Component {

    constructor(props) {
        super(props);
        //console.log('weak SCREEN_WIDTH',SCREEN_WIDTH);
        this.state = {
            showItem : 2,
            isLoadmore : false,      
            isTimer : false      
        }
    }

    UNSAFE_componentWillMount() {
    
    }    

    componentDidMount() {
      
    }

    
    toggleSwitch = (value) => {
        //onValueChange of the switch this function will be called
        this.setState({isTimer: value})
        //state changes according to switch
        //which will result in re-render the text
     }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerWrapper}>
                    <ToggleSwitch
                        label="타이머"
                        size="small"
                        onColor="#173f82"
                        offColor="#ccc"
                        isOn={this.state.isTimer}
                        onToggle={() => this.toggleSwitch(!this.state.isTimer)}
                        />

                    {/*
                    <View style={styles.mainTitleWrap}>
                        <Text style={styles.mainTitle}>타이머</Text>
                    </View>
                    <View 
                    style={styles.mainToggleSwitch} >
                        <Switch
                            style={{height:20, marginRight :10}}
                            trackColor="#173f82"
                            thumbColor="#173f82"
                            onValueChange = {() => this.toggleSwitch(!this.state.isTimer)}
                            value = {this.state.isTimer}/>
                    </View>
                    */}
                    
                </View> 
                <View style={styles.bodyWrapper}>                    
                        { this.props.screenState.items.map((data, index) => {   
                            return (
                                <View style={styles.commoneWrap} key={index}>
                                    <View style={styles.commonerow}>
                                        <View style={styles.leftrow}>                            
                                            <Image source={{uri:data.bannerurl}} style={{width:'100%',height:'100%'}} resizeMode='contain' />
                                        </View>
                                        <View style={styles.rightrow}>
                                            <View style={styles.rightHeaderrowBorder}>
                                                <Text style={[styles.itemText,{color:'#555'}]}>{data.theme}</Text>
                                            </View>
                                            <View style={styles.rightHeaderrow}>
                                                <Text style={[styles.itemText,{color:'#555'}]}>{data.title}</Text>
                                            </View>
                                            <View style={styles.rightHeaderrow}>
                                                <TouchableHighlight                                                   
                                                    onPress= {()=> Linking.openURL(UrlLink)}
                                                >
                                                <Text style={[styles.itemText,{color:'#173f82', textDecorationLine : 'underline'}]}>구매 {"&"} 무료혜택 확인</Text>
                                                </TouchableHighlight>
                                            </View>
                                            <View style={styles.rightHeaderrowFooter}>
                                                { data.isOpened ?
                                                <TouchableHighlight                                                   
                                                    onPress= {()=> this.props.screenState.onPressUpdateOpen(index,false)}
                                                >
                                                    <Icon name="up" size={20} color="#555" /> 
                                                </TouchableHighlight>
                                                :
                                                <TouchableHighlight                                                   
                                                    onPress= {()=> this.props.screenState.onPressUpdateOpen(index,true)}
                                                >
                                                    <Icon name="down" size={20} color="#555" /> 
                                                </TouchableHighlight>
                                                }
                                            </View>
                                        </View>                                    
                                    </View>    
                                    {
                                        data.isOpened &&
                                        <View style={{flex:1,marginBottom : 10}}>
                                            <View style={{padding : 10,justifyContent: 'center',}}>
                                                <Text>RC OMR 답안 입력</Text>
                                            </View>
                                            <View style={{flex:1,flexDirection : 'row',flexWrap: 'wrap',padding : 5,alignItems : 'flex-start',justifyContent: 'center',}}>
                                            {                                                
                                                Array(data.parts).fill(null).map((_data,_index) => {                                                                       
                                                return (            
                                                    <TouchableHighlight 
                                                        style={[styles.itemWrap,data.ingParts >= (_index+1) && styles.bgHighlight]} 
                                                        key={_index}
                                                        >
                                                        <Text>
                                                            {_index+1}
                                                        </Text>
                                                    </TouchableHighlight>
                                                    )
                                                })
                                            }   
                                            </View>
                                            <View style={{alignItems: 'center',justifyContent: 'center',}}>
                                                <TouchableHighlight
                                                    style={styles.buttonWrap}
                                                    onPress= {()=> this.props.screenState.nav_test(data.index,'문제 풀이',this.state.isTimer,data.ingParts)}
                                                >
                                                    <Text style={{color:'#fff',fontSize:20}}>문제풀이 시작</Text>
                                                </TouchableHighlight>
                                            </View>
                                        </View>
                                    }   
                                </View>                      
                            )
                        
                        })}                        
                    
                </View> 
                
            </View>    
        );
    }
}

const styles = StyleSheet.create({
    container: {      
        flex:1,
        backgroundColor : '#ebebeb'
    },
    headerWrapper: {
        flex : 1,
        backgroundColor: '#ebebeb',
        paddingTop : 5,        
        paddingRight : 5,
        alignItems: 'flex-end',
        justifyContent: 'center',  
    },
    mainTitleWrap: {
        flex : 5,
        top : Platform.OS === 'ios' ? 3 : 0,
        paddingRight : 5,
        alignItems : 'flex-end',
        justifyContent : 'flex-end'
         
    },
    mainTitle: {
        fontSize: 15,
        
    },
    mainToggleSwitch: {
        flex : 1,        
        fontSize: 15,                
        alignItems : 'center',
        justifyContent : 'center'
    },
    
    bodyWrapper: {                
        margin : 10,     
        
    },
    commoneWrap : {
        marginBottom : 10,
        backgroundColor : '#fff'
    },
    commonerow: {
        flex: 1,        
        flexDirection :'row',        
        
    },
   
    leftrow : {
        flex: 1,     
        backgroundColor: "#fff",
        textAlign: 'center',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',        
    },
    rightrow : {    
        flex: 3,        
        padding : 10,
        backgroundColor: "#fff",
        
    },
    rightHeaderrow : {
        flex: 1,        
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingLeft : 5,
        paddingTop :5
    }, 
    rightHeaderrowBorder : {
        flex: 0.5,        
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft : 5,
        borderRadius : 5,
        borderWidth : 1, 
        borderColor:'#ebebeb'
    }, 
    rightHeaderrowFooter : {
        flex: 0.5,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight : 5,
        
    },  
    textWhite : {
        color : '#fff'
    },
    textGray : {
        color : '#ccc'
    },
    buttonWrap : {
        width : SCREEN_WIDTH - 60, 
        height : 40, 
        borderRadius : 25, 
        backgroundColor : '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemWrap : {
        width : SCREEN_WIDTH / 5 - 20,
        height : 30,
        margin: 5,        
        borderRadius : 5,        
        borderWidth :1,
        borderColor :'#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bgHighlight : {
        backgroundColor : '#173f82',
        opacity : 0.7
    }
});