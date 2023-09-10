
import React, {Component} from 'react';
import {StyleSheet, Image, Text, View, Dimensions,TouchableHighlight} from 'react-native';
import { CheckBox } from 'react-native-elements';

const {width: SCREEN_WIDTH} = Dimensions.get("window");

export default class SetupPremiumScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {            
            isFresh : false,           
        }
    }

    UNSAFE_componentWillMount() {
    
    }    

    componentDidMount() {
      
    }

    fn_checked = ( idx ) => {

        console.log("idx",idx);
        console.log('this.state.setupItems[(idx-1)].checked',this.props.screenState.setupItems[(idx-1)].ischecked)
        this.props.screenState.setupItems[(idx-1)].ischecked = !this.props.screenState.setupItems[(idx-1)].ischecked;

        this.setState({ isFresh : true });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.bodyWrapper}>
                    <View style={[styles.commonerow,{alignItems:'center',justifyContent :'center',paddingVertical:10}]}>
                        <Text style={styles.HeaderTitle}>
                            학습할 취약 유형을 선택해 주세요{"\n"}
                            (최대 3개까지 선택할 수 있습니다)
                        </Text>
                    </View>
                    <View style={styles.commonerow}>
                        { this.props.screenState.setupItems.map((data, index) => {   
                            
                                return (
                                    <View key={index} style={[styles.gridView]} >                                        
                                        <View style={styles.gridLeft}>
                                            <Text style={[styles.itemText]}>{data.title}</Text>
                                        </View>
                                        <View style={styles.gridRight}>
                                            <CheckBox 
                                                containerStyle={{padding:0,margin:0}}   
                                                iconType='font-awesome'
                                                checkedIcon='check'
                                                uncheckedIcon='check'
                                                checkedColor='#173f82'
                                                uncheckedColor='#ffffff'
                                                onPress= {()=> this.fn_checked(data.index)}
                                                checked={this.props.screenState.setupItems[(data.index-1)].ischecked ? true : false }
                                            />
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
 
    commonerow: {
        flex: 1,
        marginBottom : 10,
    },

    HeaderTitle : {
        color :'#555'
    },
    gridView: {        
        flex:1,        
        width : SCREEN_WIDTH - 30,
        padding : 10,
        marginBottom : 10,
        flexDirection :'row',
        flexWrap: 'wrap',
        backgroundColor : '#ccc',
        //borderWidth :1,
        //borderColor : '#aaa'
    },   
    
    gridLeft : {
        flex:5,
        justifyContent: 'center',
    },
    gridRight : {
        flex:1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    itemText: {
        paddingHorizontal : 5,
        fontSize: 14,
        color:'#555',
        fontWeight: '600',
    },
    
});