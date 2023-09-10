
import React, {Component} from 'react';
import {StyleSheet, Image, Text, View, Dimensions,TouchableHighlight,Platform,StatusBar} from 'react-native';
import { Button,CheckBox } from 'react-native-elements';

const {width: SCREEN_WIDTH} = Dimensions.get("window");

export default class SetupAnalystScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {            
            isFresh : false,
            items : [ 
                {
                index : 1 , bannerurl : 'https://gscdn.hackers.co.kr/champ/files/banner/imglib_files/banner/imglib/middle100_champ_sub_640x400.jpg', title : '해커스 신토익 Reading' , teacher : '홍길동' , theme : '11강',point : 100,ischecked :false
                },
                {
                    index : 2 , bannerurl : 'https://gscdn.hackers.co.kr/champ/files/banner/imglib_files/banner/imglib/tosopic_300_640x400.jpg', title : '해커스 신토익 Reading' , teacher : '노성남' , theme : '11강',point : 200,ischecked :false
                },
                {
                    index : 3 , bannerurl : 'https://gscdn.hackers.co.kr/champ/files/banner/imglib_files/banner/imglib/middle100_champ_sub_640x400.jpg', title : '해커스 신토익 Reading' , teacher : '홍길동' , theme : '11강',point : 333,ischecked :false
                },
                {
                    index : 4 , bannerurl : 'https://gscdn.hackers.co.kr/champ/files/banner/imglib_files/banner/imglib/tosopic_300_640x400.jpg', title : '해커스 신토익 Reading' , teacher : '노성남' , theme : '11강',point : 444,ischecked :false
                },
                {
                    index : 5 , bannerurl : 'https://gscdn.hackers.co.kr/champ/files/banner/imglib_files/banner/imglib/middle100_champ_sub_640x400.jpg', title : '해커스 신토익 Reading' , teacher : '홍길동' , theme : '11강',point : 555,ischecked :false
                },
                {
                    index : 6 , bannerurl : 'https://gscdn.hackers.co.kr/champ/files/banner/imglib_files/banner/imglib/tosopic_300_640x400.jpg', title : '해커스 신토익 Reading' , teacher : '노성남' , theme : '11강',point : 666,ischecked :false
                },
                {
                    index : 7 , bannerurl : 'https://gscdn.hackers.co.kr/champ/files/banner/imglib_files/banner/imglib/middle100_champ_sub_640x400.jpg', title : '해커스 신토익 Reading' , teacher : '홍길동' , theme : '11강',point : 777,ischecked :false
                },
                {
                    index : 8 , bannerurl : 'https://gscdn.hackers.co.kr/champ/files/banner/imglib_files/banner/imglib/tosopic_300_640x400.jpg', title : '해커스 신토익 Reading' , teacher : '노성남' , theme : '11강',point : 888,ischecked :false
                }
            ],
        }
    }

    UNSAFE_componentWillMount() {
    
    }    

    

    fn_checked = ( idx ) => {

        console.log("idx",idx);
        console.log('this.state.items[(idx-1)].checked',this.props.screenState.items[(idx-1)].ischecked)
        this.props.screenState.items[(idx-1)].ischecked = !this.props.screenState.items[(idx-1)].ischecked;

        this.setState({ isFresh : true });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.bodyWrapper}>
                    <View style={styles.commonerow}>
                        { this.props.screenState.items.map((data, index) => {   
                            
                                return (
                                    <View key={index} style={[styles.gridView,index%2 == 0 ? styles.gridViewLeft : styles.gridViewRight ]} >
                                        <View style={styles.HeaderTitle}>
                                            <View style={styles.HeaderTitleLeft}>
                                                <Text style={[styles.itemText]}>{data.theme}</Text>
                                            </View>
                                            <View style={styles.HeaderTitleRight}>
                                                <CheckBox 
                                                    containerStyle={{padding:0,margin:0}}   
                                                    iconType='font-awesome'
                                                    checkedIcon='check'
                                                    uncheckedIcon='check'
                                                    checkedColor='#173f82'
                                                    uncheckedColor='#ebebeb'
                                                    onPress= {()=> this.fn_checked(data.index)}
                                                    checked={this.props.screenState.items[(data.index-1)].ischecked ? true : false }
                                                />
                                            </View>
                                        </View>
                                        <TouchableHighlight 
                                            style={[styles.imagewrap,styles.textCenter]}  
                                            onPress= {()=> this.props.screenProps._go_munje(data.title)}>        
                                            <Image
                                                source={{uri:data.bannerurl}} 
                                                style={{width:'100%',height:70}}
                                                resizeMode='cover'
                                            />
                                        </TouchableHighlight>
                                        <View style={styles.imageTextTitle}>
                                            <Text style={[styles.itemText]}>2020-01-01 | {data.point}</Text>
                                        </View> 
                                        <View style={styles.imageTextTitle}>                                            
                                            <Text style={[styles.itemText]}>{data.title}</Text>
                                        </View>
                                                                               
                                    </View>
                                )
                            

                        })}                        
                    </View>
                   
                </View> 
                
            </View>    
        );
    }
}

const styles = StyleSheet.create({
    container: {      
        flex:1,
        backgroundColor : '#fff'
    },
    mainTitle: {
        fontSize: 15,        
        marginHorizontal: 10,
    },
    headerWrapper: {        
        flex : 1,
        backgroundColor: '#ebebeb',
        paddingVertical : 10
    },
    bodyWrapper: {                
        paddingVertical : 10,     
           
    },
    morerWrapper : {
        flex : 1,        
        padding : 10
    },
    commonerow: {
        flex: 1,        
        flexDirection :'row',
        flexWrap: 'wrap',
        marginBottom : 10,
        
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
        width: ( SCREEN_WIDTH / 2 )-10,    
        marginBottom : 10,
        
    }, 
    gridViewLeft : {
        paddingRight : 5
    },
    gridViewRight : {
        paddingLeft : 5
    },
    HeaderTitle : {
        flex:1,      
        paddingVertical:10,  
        flexDirection :'row',
        backgroundColor : '#ccc'
    },
    HeaderTitleLeft : {
        flex:1,
        justifyContent: 'center',
    },
    HeaderTitleRight : {
        flex:1,            
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    imageTextTitle: {                
        paddingVertical : 5,
        
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