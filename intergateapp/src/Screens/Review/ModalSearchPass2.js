import React, { Component } from 'react';
import {    
    ScrollView,
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    PixelRatio
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import TreeSelect from '../../Utils/TreeSelect';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

class ModalSearchPass extends Component {
    constructor(props) {
        super(props);

        this.state = {  
            selectedcurrentNode : null,
            selectedRoute : [],     
            route : '',       
            filterData: [
                {
                    id :"Depth01001",
                    name:"JLPT",
                    sortNo:1,
                    parentId:1,
                    children: [
                        {
                            id:"Depth02001",
                            name:"JLPT N1",
                            sortNo:1,
                            parentId:'Depth01001',
                            children: [
                                {
                                    id:"Depth02001001",
                                    name:"180점",
                                    sortNo:1,
                                    parentId:"Depth02001"
                                },
                                {
                                    id:"Depth02001002",
                                    name:"160점",
                                    sortNo:2,
                                    parentId:"Depth02001"
                                },
                                {
                                    id:"Depth02001003",
                                    name:"130점",
                                    sortNo:3,
                                    parentId:"Depth02001"
                                },
                                {
                                    id:"Depth02001004",
                                    name:"1000점",
                                    sortNo:1,
                                    parentId:"Depth02001"
                                }
                            ]
                        },
                        {
                            id:"Depth02002",
                            name:"JLPT N2",
                            sortNo:2,
                            parentId:'Depth01001',
                            children: [
                                {
                                    id:"Depth02002001",
                                    name:"180점",
                                    sortNo:1,
                                    parentId:"Depth02002"
                                },
                                {
                                    id:"Depth02002002",
                                    name:"150점",
                                    sortNo:2,
                                    parentId:"Depth02002"
                                },
                                {
                                    id:"Depth02002003",
                                    name:"120점",
                                    sortNo:3,
                                    parentId:"Depth02002"
                                },
                                {
                                    id:"Depth02002004",
                                    name:"90점",
                                    sortNo:1,
                                    parentId:"Depth02002"
                                }
                            ]
                        },
                        {
                            id:"Depth02003",
                            name:"JLPT N3",
                            sortNo:3,
                            parentId:'Depth01001',
                            children: [
                                {
                                    id:"Depth02003001",
                                    name:"180점",
                                    sortNo:1,
                                    parentId:"Depth02003"
                                },
                                {
                                    id:"Depth02003002",
                                    name:"150점",
                                    sortNo:2,
                                    parentId:"Depth02003"
                                },
                                {
                                    id:"Depth02003003",
                                    name:"120점",
                                    sortNo:3,
                                    parentId:"Depth02003"
                                },
                                {
                                    id:"Depth02003004",
                                    name:"95점",
                                    sortNo:1,
                                    parentId:"Depth02003"
                                }
                            ]
                        }
                    ]
                },
                {
                    id :"Depth01002",
                    name:"JPT",
                    sortNo:1,
                    parentId:1,
                    children: [
                        {
                            id:"Depth01002001",
                            name:"JPT 990",
                            sortNo:1,
                            parentId:'Depth01002',                            
                        },
                        {
                            id:"Depth01002002",
                            name:"JPT 890",
                            sortNo:2,
                            parentId:'Depth01002',                            
                        },
                        {
                            id:"Depth01002003",
                            name:"JPT 790",
                            sortNo:3,
                            parentId:'Depth01002',                            
                        },
                        {
                            id:"Depth01002004",
                            name:"JPT 590",
                            sortNo:1,
                            parentId:'Depth01002',                            
                        },
                        {
                            id:"Depth01002005",
                            name:"JPT 500",
                            sortNo:5,
                            parentId:'Depth01002',                            
                        },
                    ]
                }
              ]
        }
    }

    _onClick = ({ item, routes, currentNode }) => {
        //console.log('onclick : ',item.name, currentNode);
        //console.log('routes : ',routes);
        this.setState({
            route : item.name,
            selectedcurrentNode : null,
        });
      };
    
    _onClickLeaf = ({ item, routes, currentNode }) => {
        console.log(item.name, currentNode);
        //console.log('routes : ',routes);

        this.setState({
            selectedcurrentNode : currentNode,
            selectedRoute : routes
        });
    };

    render() {
        
        return(
            <View style={ styles.container }>
                <View style={styles.searchDisplayWrap}>
                    <View style={styles.searchDisplayLeft}>
                        <Text style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),color: DEFAULT_COLOR.lecture_base}}>
                            {this.state.route} 
                        </Text>
                    </View>
                    { this.state.selectedcurrentNode &&
                        <TouchableOpacity 
                            onPress={()=>this.props.screenState.selectCategory(this.state.selectedRoute)}
                            style={styles.searchDisplayRightt}>
                            <Text style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),color: DEFAULT_COLOR.lecture_base}}>
                                적용
                            </Text>
                        </TouchableOpacity>
                    }
                </View>
                
                <ScrollView style={{marginBottom:50}}>
                    <TreeSelect
                        data={this.state.filterData}
                        // isOpen
                        // openIds={['A01']}
                        //defaultSelectedId={['B062']}
                        isShowTreeId={false}
                        selectType="single"
                        //selectType="multiple"
                        leafCanBeSelected
                        itemStyle={{
                            // backgroudColor: '#8bb0ee',
                            paddingLeft:10,
                            borderBottomWidth:1,borderBottomColor:'#ccc',
                            fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),
                            color: DEFAULT_COLOR.base_color_222
                        }}
                        selectedItemStyle={{
                            paddingLeft:10,
                            backgroudColor: DEFAULT_COLOR.lecture_base,
                            fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),
                            color: DEFAULT_COLOR.base_color_fff
                        }}
                        onClick={this._onClick}
                        onClickLeaf={this._onClickLeaf}
                        treeNodeStyle={{
                            // openIcon: <Icon size={18} color="#171e99" style={{ marginRight: 10 }} name="ios-arrow-down" />,
                            // closeIcon: <Icon size={18} color="#171e99" style={{ marginRight: 10 }} name="ios-arrow-forward" />
                            openIcon: <Icon name="down" size={18} color="#222"  />,
                            closeIcon: <Icon name="right" size={18} color="#222"  />
                        }}
                    />
                </ScrollView>
            </View>

        );
    }
}

export default ModalSearchPass;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        justifyContent:'flex-start'
    },
    wrapItem:{
        borderBottomWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.3)',
        padding: 10
      },
    titleSubject: {
        color: 'rgba(0,0,0,0.5)'
    },
    searchDisplayWrap:{
        flexDirection:'row',
        padding: 10,
        borderColor: '#CCC',
        borderWidth: 1
    },
    searchDisplayLeft :{
        flex:5,
        justifyContent:'center'

    },
    searchDisplayRight : {
        flex:1,
        justifyContent:'center'

    }
});