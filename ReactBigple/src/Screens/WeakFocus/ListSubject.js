
import React, {Component} from 'react';
import {StyleSheet, Image, Text, View, Dimensions,TouchableHighlight} from 'react-native';
import { Button } from 'react-native-elements';

const {width: SCREEN_WIDTH} = Dimensions.get("window");

export default class WeakScreen extends Component {

    constructor(props) {
        super(props);
        //console.log('weak SCREEN_WIDTH',SCREEN_WIDTH);
        this.state = {
            showItem : 2,
            isLoadmore : false,
            items : [ 
                {
                index : 1 , bannerurl : 'https://gscdn.hackers.co.kr/champ/files/banner/imglib_files/banner/imglib/middle100_champ_sub_640x400.jpg', title : '해커스 신토익 Reading' , teacher : '홍길동' , theme : '11강'
                },
                {
                    index : 2 , bannerurl : 'https://gscdn.hackers.co.kr/champ/files/banner/imglib_files/banner/imglib/tosopic_300_640x400.jpg', title : '해커스 신토익 Reading' , teacher : '노성남' , theme : '11강'
                },
                {
                    index : 3 , bannerurl : 'https://gscdn.hackers.co.kr/champ/files/banner/imglib_files/banner/imglib/middle100_champ_sub_640x400.jpg', title : '해커스 신토익 Reading' , teacher : '홍길동' , theme : '11강'
                },
                {
                    index : 4 , bannerurl : 'https://gscdn.hackers.co.kr/champ/files/banner/imglib_files/banner/imglib/tosopic_300_640x400.jpg', title : '해커스 신토익 Reading' , teacher : '노성남' , theme : '11강'
                },
                {
                    index : 5 , bannerurl : 'https://gscdn.hackers.co.kr/champ/files/banner/imglib_files/banner/imglib/middle100_champ_sub_640x400.jpg', title : '해커스 신토익 Reading' , teacher : '홍길동' , theme : '11강'
                },
                {
                    index : 6 , bannerurl : 'https://gscdn.hackers.co.kr/champ/files/banner/imglib_files/banner/imglib/tosopic_300_640x400.jpg', title : '해커스 신토익 Reading' , teacher : '노성남' , theme : '11강'
                }
            ],
        }
    }

    UNSAFE_componentWillMount() {
    
    }    

    componentDidMount() {
        //console.log('componentDidMount'); 
        this.state.items.length > 2 ? this.setState({ isLoadmore: true }) :  this.setState({ isLoadmore: false });
    }

    

    btnMore = () => {
        let reShowItem = this.state.showItem +2;
        this.setState({showItem: reShowItem });
        if (reShowItem >= this.state.items.length ) {
            this.setState({ isLoadmore: false });
        }
    }

    

    
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerWrapper}>
                    <Text style={styles.mainTitle}>
                       {this.props.screenProps.title}
                    </Text>
                </View> 
                <View style={styles.bodyWrapper}>
                    <View style={styles.commonerow}>
                        { this.state.items.map((data, index) => {   
                            if ( index < this.state.showItem ) {
                                return (
                                    <View key={index} style={[styles.gridView,index%2 == 0 ? styles.gridViewLeft : styles.gridViewRight ]} >
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
                                            <TouchableHighlight onPress= {()=> this.props.screenProps._go_munje(data.title)}>
                                                <Text style={[styles.itemText]}>{data.title}</Text>
                                            </TouchableHighlight>
                                        </View>
                                        <View style={styles.imageTextTitle}>
                                            <TouchableHighlight onPress= {()=> this.props.screenProps._go_munje(data.title)}>
                                                <Text style={[styles.itemText]}>해설 : {data.theme} | {data.teacher}</Text>
                                            </TouchableHighlight>
                                        </View>                                        
                                    </View>
                                )
                            }

                        })}                        
                    </View>
                    { this.state.isLoadmore && 
                    <View style={styles.morerWrapper}>
                        <Button
                            title='더보기'
                            type='outline'
                            onPress= {()=> this.btnMore()}
                        />
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