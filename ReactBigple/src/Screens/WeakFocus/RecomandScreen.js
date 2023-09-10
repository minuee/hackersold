import React, {Component} from 'react';
import {StyleSheet, Text, View,Dimensions, ScrollView,ActivityIndicator} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

import CommonStyle from '../../Styles/CommonStyle'

import ListRecomand from './ListRecomand';

const {width: SCREEN_WIDTH} = Dimensions.get("window");
console.log("SCREEN_WIDTH", SCREEN_WIDTH);


export default class ResultScreen extends Component {

   
    constructor(props) {
        super(props);                
        
        this.state = {
            loading : false,      
            secondSelectTab : true,         
        }        
       
    }

    UNSAFE_componentWillMount() {        
        
        this.setState({ 
            loading: true, 
        });
       
    }    

    componentDidMount() {
        setTimeout(
            () => {
                this.setState({ loading: false});
            },500)
    }

    changeTabs = (newvalue) => {
        if ( this.state.secondSelectTab !== newvalue ) {
            console.log('ddddd', this.state.secondSelectTab)
            this.setState({ 
                secondSelectTab:newvalue,
                loading: true, 
             });
            this.forceUpdate();
            setTimeout(
                () => {
                    this.setState({ loading: false});
                },500)
        }
    }

    render() {
    
        return (
            this.state.loading ?
            <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            :
            <View style={styles.container}>
                
                <View style={styles.headerTitle}>           
                    <View style={[styles.heaerTabs,this.state.secondSelectTab  && styles.seletetab]}>
                        <Text 
                            style={[CommonStyle.font16,CommonStyle.textCenter]}
                            onPress= {()=> this.changeTabs(true)}
                            >
                            취약 유형
                        </Text>
                    </View>
                    <View style={[styles.heaerTabs,!this.state.secondSelectTab && styles.seletetab]}>
                        <Text 
                            style={[CommonStyle.font16,CommonStyle.textCenter]}
                            onPress= {()=> this.changeTabs(false)}
                        >
                            도전 유형
                        </Text>
                    </View>
                </View>
                <ScrollView>
                { this.state.secondSelectTab ?
                    <ListRecomand screenState={this.state} screenProps={this.props.screenProps} />
                    :
                    <ListRecomand screenState={this.state} screenProps={this.props.screenProps} />
                }
                </ScrollView>
            </View>
        );
       
    }
}

const styles = StyleSheet.create({

    IndicatorContainer : {
        flex: 1,
        height:200,
        marginTop:10,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    container: {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        marginBottom : 100,
    },

    headerTitle: {
        height:40,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center', 
        flexDirection : 'row'
    },
    heaerTabs :  {
        flex:1,
        paddingVertical:9,
        backgroundColor: '#ccc',
        borderBottomColor : '#ccc',
        borderBottomWidth : 1
    },
    seletetab : {
        backgroundColor: '#fff',
        color : '#bbb',
        
    },
    title: {
        fontSize: 14,
        textAlign: 'center',
        color: '#555'
    }
    
});
