
import React, {Component} from 'react';
import {StyleSheet, Image, Linking,Text, View, Dimensions,TouchableHighlight,Platform,ScrollView} from 'react-native';
import HackersSlider from '../Utils/HackersSlider';
const {height: SCREEN_HEIGHT} = Dimensions.get("window");
export default class TopPopScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {            
            isFresh : false,
            items : [
                {
                    key: 's1',
                    text: '해커스 모바일 앱',
                    title: 'Hackers Mobile App',
                    imageuri : 'https://gscdn.hackers.co.kr/hackers/files/bookmanager/91f67334f0020841f14f65cd17e6693a.jpg',
                    backgroundColor: '#20d2bb',
                    url : 'http://m.champ.hackers.com'
                },
                {
                    key: 's2',
                    title: 'Hackers Trip',
                    text: '해커스 여행',                    
                    imageuri :  'https://gscdn.hackers.co.kr/hackers/files/bookmanager/fd7778cfa3faff9739f3df88e6bfcf64.jpg',
                    backgroundColor: '#20d2bb',
                    url : 'http://m.champ.hackers.com'
                },
                {
                    key: 's3',
                    title: 'Hackers Discount',
                    text: '해커스 할인혜택',                    
                    imageuri :  'https://gscdn.hackers.co.kr/hackers/files/bookmanager/5a66e50b32a2443117a79568abe7b311.jpg',
                    backgroundColor: '#20d2bb',
                    url : 'http://m.champ.hackers.com'
                },
                {
                    key: 's4',
                    title: 'Hackers Shopping',
                    text: ' 해커스 쇼핑',                    
                    imageuri : 'https://gscdn.hackers.co.kr/hackers/files/bookmanager/df2a7d17bb8a474f2c9c927c00e5b752.jpg',
                    backgroundColor: '#20d2bb',
                    url : 'http://m.champ.hackers.com'
                },
                {
                    key: 's5',
                    title: 'Hackers Train',
                    text: '해커스 기차여행',                    
                    imageuri : 'https://gscdn.hackers.co.kr/hackers/files/bookmanager/dd1e2fccae5166a1f349c48c83c40df4.jpg',
                    backgroundColor: '#20d2bb',
                    url : 'http://m.champ.hackers.com'
                },
            ]
        }
    }

    UNSAFE_componentWillMount() {
    
    }    

    _onDone = () => {
        console.log('3333333')   
     };
     


    _renderItem = ({ item }) => {
        return (
            <ScrollView
                contentContainerStyle={{       
                    
                    backgroundColor: item.backgroundColor,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    //borderColor : '#ff0000',
                    //borderWidth :3,
                    //padding: 100
                }}
                
            >
                <View>
                    <Text style={styles.title}>{item.title}</Text>
                </View>
                <TouchableHighlight
                    style={{flex:1,width:'100%',height :300}}
                    onPress= {()=> Linking.openURL(item.url)}
                    >
                    <Image                 
                        style={styles.image}                
                        source={{uri : item.imageuri}} 
                        onPress= {()=> this._onDone()}
                        
                
                    />
                </TouchableHighlight>
                <TouchableHighlight
                    style={{flex:1,width:'100%',height :300}}
                    onPress= {()=> Linking.openURL(item.url)}
                    >
                    <Image                 
                        style={styles.image}                
                        source={{uri : item.imageuri}} 
                        onPress= {()=> this._onDone()}
                
                    />
                </TouchableHighlight>
                <TouchableHighlight
                    style={{flex:1,width:'100%',height :300}}
                    onPress= {()=> Linking.openURL(item.url)}
                    >
                    <Image                 
                        style={styles.image}                
                        source={{uri : item.imageuri}} 
                        onPress= {()=> this._onDone()}
                
                    />
                </TouchableHighlight>
                
              
            </ScrollView>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <HackersSlider
                    slides={this.state.items}
                    renderItem={this._renderItem}                    
                    showPrevButton={true}
                    onSkip={this._onSkip}
                />
                
            </View>    
        );
    }
}

const styles = StyleSheet.create({
    container: {      
        flex: 1,
        
        //height : SCREEN_HEIGHT - 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        //borderColor : '#ff0000',
        //borderWidth : 1
    },

    image: {
        width: '96%',
        height: "100%",
        resizeMode:'contain',
        //tintColor: 'gray',
        //opacity : 0.5
    },
    text: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        paddingVertical: 30,
    },
    title: {
        fontSize: 25,
        color: 'white',
        textAlign: 'center',
        marginBottom: 16,
    },
    

});