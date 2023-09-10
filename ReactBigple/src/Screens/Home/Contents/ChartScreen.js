
import React, { createRef } from "react";
import {StyleSheet, ImageBackground, Text, View, TouchableHighlight,Dimensions,ActivityIndicator} from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { Text as ChartText } from 'react-native-svg';
import { Rating }  from 'react-native-elements';

import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/Fontisto';
Icon2.loadFont();

import TimerCutDown from '../../../Components/TimerCutDown';

export default class CheckCapacityModal extends React.Component {

    constructor(props) {
        super(props);
        this.timerCutDown = createRef();
        this.state = {            
            loading : true,
            selectedSlice: {            
                label: '',
                value: 0
            },
            remainTime : 60*55,
            isResetTimer : true,
            isSelected : 0,
            item : [
                {
                    index: 1,                    
                    theme : '취약유형',
                    title: '취약유형결과',                    
                    icon : 'frowning',
                    fullScore : 450,
                    yourScore : 420,
                    result_idx : [ 1,2,3,4,5,6],
                    result_title : ['준동지구','어휘','프리미엄RC','프리미엄LC','독해','종합'],
                    result_value : [1,1,1,1,1,1],
                    result_bgColor : ['#3986ef','#3986ef','#555','#555','#ef696d','#ef696d']
                },
                {
                    index: 2,
                    theme : '열등유형',
                    title: '열등유형결과',
                    icon : 'sunglasses',
                    fullScore : 900,
                    yourScore : 420,
                    result_idx : [ 1,2],
                    result_title : ['LC','RC'],
                    result_value : [1,1],
                    result_bgColor : ['#3986ef','#ef696d']
                },
                {
                    index: 3,
                    theme : '잘난유형',
                    title: '잘난유형결과',
                    icon : 'confused',
                    fullScore : 990,
                    yourScore : 990,
                    result_idx : [ 1,2],
                    result_title : ['LC','RC'],
                    result_value : [1,1],
                    result_bgColor : ['#3986ef','#ef696d']
                },
                
            ],
            graphData : []
        }
    }


    UNSAFE_componentWillMount() {
        this.setState({        
            graphData :  this.state.item[0].result_idx
         });    
    }    

    componentDidMount() {        
        this.setState({loading : false});
    }


    goMoveTabs = ( tabsNo ) => {

        this.setState({
            isSelected :  tabsNo,
            graphData :  this.state.item[tabsNo].result_idx
         });
    }

    ratingCompleted(rating) {
        console.log("Rating is: " + parseFloat(rating));
      }


    render() {

        const { labelWidth, selectedSlice } = this.state;
        const { label, value } = selectedSlice;
        //const idx = [ 1,2,3,4,5,6];
        
        //const values = [1, 1, 1, 1, 1,1];
        //const colors = ['#3986ef', '#3986ef', '#555', '#555', '#ef696d', '#ef696d']
        const data = this.state.graphData.map((key, index) => {
            return {   
                key,
                label : this.state.item[this.state.isSelected].result_title[index],//keys[index], 
                value: this.state.item[this.state.isSelected].result_value[index],
                svg: { fill: this.state.item[this.state.isSelected].result_bgColor[index]},
                arc: { outerRadius: (100) + '%', 
                    padAngle : 0.03
                }, //padAngle: label === key ? 0.03 : 0.03 },
                onPress: () => {
                    this.setState({ selectedSlice: { label: this.state.item[this.state.isSelected].result_title[index], value: this.state.item[this.state.isSelected].result_value[index] } });
                    this.props.screenState.goBaseTestScreen(this.state.item[this.state.isSelected].result_idx[index],this.state.item[this.state.isSelected].theme);
                    }
            }
        })
        const deviceWidth = Dimensions.get('window').width;

        const Labels = ({ slices, height, width }) => {
            return slices.map((slice, tindex) => {
                const { labelCentroid, pieCentroid, data } = slice;
                return (
                        <ChartText                    
                            key={tindex}
                            x={pieCentroid[ 0 ]}
                            y={pieCentroid[ 1 ]}
                            fill={'white'}
                            textAnchor={'middle'}
                            alignmentBaseline={'middle'}
                            fontSize={13}
                            stroke={'white'}
                            strokeWidth={0.2}
                        >
                            {data.label}
                        </ChartText>
                )
            })
        }
        if ( this.state.loading ) {
            return (
                <View style={styles.container}><ActivityIndicator size="large" /></View>
            )
        }else {
      
            return (
                <View style={styles.container}>
                    <ImageBackground  
                        style= { styles.backgroundImage } 
                        source={require('../../../../assets/images/focus_bg_free.png')} >
                    <View style={styles.inChartWrapper}>
                    
                        <View style={{flex:1}}>
                            <View style={[styles.sliderContainerWrap,{marginBottom:30}]}>
                                <View style={styles.sliderContainerLeft}>
                                    <Text style={styles.sliderLabelleft} >{this.state.item[this.state.isSelected].title}</Text>
                                </View>
                                <View style={styles.sliderContainerRight}>
                                    <Text style={[styles.sliderLabelright,{color:'#ef696d',paddingRight:5}]} >
                                        - RC
                                    </Text>
                                    <Text style={[styles.sliderLabelright,{color:'#3986ef',paddingRight:5}]} >
                                        - LC
                                    </Text>
                                    <Text style={styles.sliderLabelright} >
                                        - 프리미엄
                                    </Text>
                                </View>
                                
                            </View>
                            <View style={[styles.sliderContainer,{marginBottom:10,padding:10,flexDirection:'row'}]}>
                                {this.state.isSelected > 0 &&
                                <View style={{position :'absolute', left : 10}}>
                                    <TouchableHighlight  onPress= {()=> this.goMoveTabs(this.state.isSelected - 1)}>
                                        <Icon name="chevron-left" size={20} color="#555" />
                                    </TouchableHighlight>
                                </View> 
                                }
                                <Icon2 name={this.state.item[this.state.isSelected].icon} size={20} color="#555" />
                                <Text style={[styles.sliderLabel,{fontSize : 18,color:'#555',marginLeft :5}]}>{this.state.item[this.state.isSelected].title}</Text>
                                {this.state.isSelected < 2 &&
                                <View style={{position :'absolute', right : 10}}>
                                    <TouchableHighlight  onPress= {()=> this.goMoveTabs(this.state.isSelected + 1)}>
                                        <Icon name="chevron-right" size={20} color="#555" />
                                    </TouchableHighlight>
                                </View>                   
                                }         
                                {/*
                                <TouchableHighlight 
                                    style={styles.button} 
                                    onPress= {()=> this.goBaseTestScreen(this.state.randomidx,'무료문제')}>
                                    <Text style={[styles.sliderLabel,{color:'white'}]}>지금 바로 무제한 풀기</Text>
                                </TouchableHighlight>
                                */}
                            </View>
                            
                            <PieChart                                
                                style={{ height: 300 }}
                                outerRadius={'100%'}
                                innerRadius={'65%'}
                                data={data}          
                            >
                                <Labels/>
                            </PieChart>
                            <View
                                style={styles.pointWrapper}
                            >
                                <View style={{textAlign: 'center',alignItems: 'center',justifyContent: 'center', }}>
                                    <Text style={{color : '#3986ef',fontSize : 18,fontWeight : 'bold',textAlign: 'center',alignItems: 'center',}}>
                                        {this.state.item[this.state.isSelected].fullScore}점
                                    </Text>    
                                </View>
                                <View style={{height : 1,widh:10,marginVertical:3,backgroundColor:'#ccc' }}>
                                    <Text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                                </View>
                                <View style={{height:20,textAlign: 'center',alignItems: 'center',justifyContent: 'center', }}>
                                    <Text style={{color : '#3986ef',fontSize : 15,fontWeight : 'bold',textAlign: 'center',alignItems: 'center',}}>
                                    {this.state.item[this.state.isSelected].yourScore}점
                                    </Text>    
                                </View>
                            </View>
                            <View style={styles.brainWrapper}>
                                <Rating 
                                    //type='heart'
                                    imageSize={25}
                                    ratingColor='#173f82'
                                    ratingBackgroundColor='#ebebeb'
                                    fractions={1}
                                    startingValue={(this.state.item[this.state.isSelected].yourScore/this.state.item[this.state.isSelected].fullScore)*5}
                                    onFinishRating={this.ratingCompleted}
                                    readonly
                                />
                                {/*<Image 
                                    source={require('../../../../assets/images/brain.png')} 
                                    style={{ width:80,height:80}} 
                                />
                                */}
                            </View>

                            <View style={[styles.sliderContainer,{marginTop:20}]}>
                                <Text style={[styles.sliderLabel,{fontWeight : 'bold',color:'#3986ef'}]}>매일 1회 무료 문제 풀이가 제공됩니다.</Text>                                        
                                { this.state.isResetTimer && 
                                <View style={{flexDirection :'row'}}>
                                    <View style={{alignItems:'flex-end',paddingRight:3}}>
                                        <Text style={[styles.sliderLabel,{color:'#555'}]}>다음 무료 문제풀이까지 </Text>
                                    </View>
                                    <View style={{alignItems :'flex-start'}}>
                                        <TimerCutDown
                                            ref={this.timerCutDown}
                                            textSize={14}
                                            textColor='#555'
                                            until={parseInt(this.state.remainTime)}
                                            afterEndOnChange={this.stopCutDownTimeOnChange}                        
                                        />
                                    </View>
                                </View>
                                }
                                <Text style={[styles.sliderLabel,{color:'#555'}]}>* 분석결과는 테스트 완료 후 확인 가능합니다.</Text>
                                <Text style={[styles.sliderLabel,{color:'#555'}]}>* 취약유형이 없는 경우 분석 결과는 노출되지 않습니다.</Text>
                            </View>
                        
                        </View>
                    </View>
                </ImageBackground>  
            </View>
            )
        }
    }

}

const styles = StyleSheet.create({
    container: {     
        flex :1, 
        minHeight :200
      
    },
    gridbackgroundImage:{        
        flex:1,
        margin:2
    },
    backgroundImage:{        
        flex:1,
        width: '100%',        
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.7
    },
    inChartWrapper : {        
        paddingBottom : 50,
        paddingVertical: 20,
        paddingHorizontal : 20        
    },

    sliderContainerWrap: {
        width: "100%",
        flexDirection:'row',
    },
    sliderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    sliderLabel: {
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sliderContainerLeft: {
        width: "35%",
    },
    sliderContainerRight: {
        width: "65%",
        flexDirection : 'row',        
        justifyContent: 'flex-end',
        
    },
    sliderLabelleft: {
        textAlign: "left",
        color:'#3986ef',
        fontSize : 16,
        fontWeight :'bold'
    },
    sliderLabelright: {
        textAlign: "right",
        color:'#555',
        fontSize : 16,
        fontWeight :'bold'
    },

    pointWrapper : {
        position: 'absolute',
        //left: 0,
        width:'100%',
        top:180,
        flex:1,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center', 
    },
    brainWrapper : {
        position: 'absolute',                                            
        width:'100%',
        top:250,
        flex:1,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center', 
    },
});