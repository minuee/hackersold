import React, {Component} from 'react';
import {
    StyleSheet, Text, View, Dimensions, TouchableOpacity, ActivityIndicator, Image, ScrollView, ImageBackground,
    PixelRatio, FlatList, Linking, SafeAreaView, StatusBar, Platform, BackHandler
} from 'react-native';
import { NavigationEvents } from 'react-navigation';

import FreeParallaxScrollView from '../../Utils/FreeParallaxScroll/FreeParallaxScrollView';

import {ScrollableTabView} from '@valdio/react-native-scrollable-tabview'
import ScrollableTabBar from '../../Utils/ScrollableTabBar';
import { CustomText, CustomTextB, CustomTextR } from '../../Style/CustomText';


import FreeDataMaterialList from './FreeDataMaterialList'; //학습자료
import FreeDataExamList from './FreeDataExamList'; //기출문제

import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/AntDesign';
Icon2.loadFont();

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

// TODO https://github.com/ptomasroos/react-native-scrollable-tab-view/issues/415

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import COMMON_STATES from "../../Constants/Common";
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

export function isIphoneX() {
    const dimen = Dimensions.get('window');
    return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        ((dimen.height === 812 || dimen.width === 812) || (dimen.height === 896 || dimen.width === 896))
    );
}
export default class FreeDataIntroScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            focusTab: 0,
            tabList: [
                {index: 1, title: '학습자료', isFocused: true},
                {index: 2, title: '기출문제', isFocused: false},
            ],
        }
    }

    /*
    static navigationOptions = ({ navigation }) => ({
        headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: DEFAULT_COLOR.lecture_base,
        },
        headerTitle: <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', }}>
            <CustomTextB
                style={[{ fontSize: DEFAULT_TEXT.head_medium, color: DEFAULT_COLOR.base_color_fff }]}
                numberOfLines={1}>
                무료 학습자료
            </CustomTextB>
        </View>,
        headerTitleStyle: {
            flexGrow: 1,
            textAlign: 'center',
            alignItems: 'center',
            fontSize: DEFAULT_TEXT.head_medium,
            color: DEFAULT_COLOR.base_color_fff,
        },
        headerLeft: <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Icon
                name={'angle-left'}
                size={40}
                color={DEFAULT_COLOR.base_color_fff}
                style={{paddingLeft:10}}
                onPress={ () => { navigation.goBack() }} />
        </View>,
        headerRight: <View></View>,
    });
    */

    UNSAFE_componentWillMount() {
        if ( Platform.OS === 'android') {
            this.androidStatusSetup(true);
        }
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);           
    }

    componentDidMount() {
        this.loadItem();
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
        if ( Platform.OS === 'android') {
            this.androidStatusSetup(false)
        }   
    } 

    handleBackButton = () => {
        if ( Platform.OS === 'android') {
            this.androidStatusSetup(false)
        }  
        this.props.navigation.goBack(null);                
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
        return true;
    }
    androidStatusSetup = async(bool) => {
        StatusBar.setTranslucent(bool);
    }


    loadItem = () => {
        this.setState({ loading: true });

        //TODO API 실제 적용 시 삭제 처리
        setTimeout(
            () => {
                this.setState({ loading: false });
            },1000);
    }

    loadMoreItem = async(code) => {
    }

    _historyBack(){
        this.props.navigation.goBack(null)
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large"/></View>
            )
        } else {
            return (
                <View style={styles.container}>
                    { 
                        Platform.OS === 'android' && <StatusBar barStyle={"dark-content"} backgroundColor={'transparent'} animated={true} hidden={false}/>
                    }
                    <NavigationEvents
                        onWillFocus={payload => {
                            if (Platform.OS === "android") {
                                console.log('fdfdfdfdfdfd');
                                StatusBar.setBackgroundColor("transparent");
                                this.androidStatusSetup(true)
                            }
                            
                            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);          
                        }}
                        onWillBlur={payload => {
                            if (Platform.OS === "android") {
                                this.androidStatusSetup(false)
                                StatusBar.setBackgroundColor("#ffffff");
                            }
                            
                            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
                        }}
                    />
                    <FreeParallaxScrollView
                        windowHeight={SCREEN_HEIGHT * 0.20}
                        backgroundSource={require('../../../assets/icons/img_learn_f.png')}
                        navBarHeight={Platform.OS === 'android' ? 65 :  isIphoneX() ? 85 : 75}
                        navBarColor={'#ff0000'}
                        navBarTitle=''
                        navBarView={false}
                        lectureName={'무료 학습자료'}
                        headerView={<View></View>}
                        textbookTitle='123'
                        markImage='../../../assets/icons/icon_mp_title.png'
                        leftIcon={{name: 'left', color: '#fff', size: 25, type: 'font-awesome'}}
                        centerTitle={'무료 학습자료'}
                        leftIconOnPress={()=>this._historyBack()}
                        rightIcon={null}
                        keyboardShouldPersistTaps="handled"
                        >

                        {/*
                        <ScrollableTabView
                            style={{width:SCREEN_WIDTH,height:'100%',backgroundColor: '#fff' }}
                            tabStyle={styles.tabStyle}
                            tabBarTextStyle={styles.tabBarTextStyle}
                            tabBarActiveTextColor={DEFAULT_COLOR.lecture_base}
                            tabBarInactiveTextColor={DEFAULT_COLOR.base_color_222}
                            tabBarUnderlineStyle={styles.underlineStyle}
                            renderTabBar={() => <ScrollableTabBar />}
                            tabBarPosition="top"
                            page={this.state.focusTab}>
                            <View style={{flex: 1}} tabLabel='학습자료' >
                                <FreeDataMaterialList navigation={this.props.navigation} />
                            </View>
                            <View style={{flex: 1}} tabLabel='기출문제'>
                                <FreeDataExamList navigation={this.props.navigation}/>
                            </View>
                        </ScrollableTabView>
                        */}

                        <View style={{
                            flexDirection: 'row',
                            height: 60,
                            borderBottomWidth: 1.5,
                            borderBottomColor: '#DDDDDD',
                            backgroundColor: DEFAULT_COLOR.base_color_fff,
                        }}>
                            {
                                this.state.tabList.map((item, index) => {
                                    return(
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => {
                                                var newTabList = [];
                                                this.state.tabList.map((newItem, newIndex) => {
                                                    newTabList.push({...newItem, isFocused: index == newIndex})
                                                });
                                                this.setState({tabList: newTabList});
                                            }}
                                            style={{
                                                width: SCREEN_WIDTH / this.state.tabList.length,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <View style={{
                                                height: 10,
                                                backgroundColor: DEFAULT_COLOR.lecture_base,
                                            }}/>
                                            <View style={{
                                                height: 48,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                {
                                                    item.isFocused
                                                        ?
                                                        <CustomTextB
                                                            style={{
                                                                color: DEFAULT_COLOR.lecture_base,
                                                                fontSize: PixelRatio.roundToNearestPixel(16),
                                                                lineHeight: 16 * 1.42,
                                                            }}>
                                                            {item.title}
                                                        </CustomTextB>
                                                        :
                                                        <CustomTextR
                                                            style={{
                                                                color: DEFAULT_COLOR.base_color_222,
                                                                fontSize: PixelRatio.roundToNearestPixel(16),
                                                                lineHeight: 16 * 1.42,
                                                            }}>
                                                            {item.title}
                                                        </CustomTextR>
                                                }
                                            </View>
                                            {
                                                item.isFocused
                                                &&
                                                <View style={{
                                                    width: (SCREEN_WIDTH / this.state.tabList.length) * ( 2 / 3 ),
                                                    height: 2,
                                                    backgroundColor: DEFAULT_COLOR.lecture_base,
                                                }}/>
                                            }
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>

                        {
                            this.state.tabList.map((item, index) => {
                                if(item.isFocused) {
                                    switch(index) {
                                        case 0:
                                            return(
                                                <View style={{flex: 1}} tabLabel='학습자료' >
                                                    <FreeDataMaterialList navigation={this.props.navigation} />
                                                </View>
                                            )
                                            break;

                                        case 1:
                                            return (
                                                <View style={{flex: 1}} tabLabel='기출문제'>
                                                    <FreeDataExamList navigation={this.props.navigation} />
                                                </View>
                                            )
                                            break;
                                    }
                                }
                            })
                        }

                    </FreeParallaxScrollView>

                    {/*
                    <ParallaxScrollView
                        backgroundColor="blue"
                        contentBackgroundColor="pink"
                        parallaxHeaderHeight={300}
                        // renderScrollComponent={() => <Animated.View />}
                        renderForeground={() => (
                            <ScrollableTabView
                                style={{width:SCREEN_WIDTH,height:'100%',backgroundColor: '#fff' }}
                                tabStyle={styles.tabStyle}
                                tabBarTextStyle={styles.tabBarTextStyle}
                                tabBarActiveTextColor={DEFAULT_COLOR.lecture_base}
                                tabBarInactiveTextColor={DEFAULT_COLOR.base_color_222}
                                tabBarUnderlineStyle={styles.underlineStyle}
                                renderTabBar={() => <ScrollableTabBar />}
                                tabBarPosition="top"
                                page={this.state.focusTab}>
                                <View style={{flex: 1}} tabLabel='학습자료' >
                                    <FreeDataMaterialList navigation={this.props.navigation} />
                                </View>
                                <View style={{flex: 1}} tabLabel='기출문제'>
                                    <FreeDataExamList />
                                </View>
                            </ScrollableTabView>
                        )}>
                    </ParallaxScrollView>
                    */}
                </View>
            );
        }
    }
}



const styles = StyleSheet.create({
    IndicatorContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: DEFAULT_COLOR.base_color_fff,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
        //backgroundColor: DEFAULT_COLOR.base_color_fff,
    },
    tabStyle : {
        padding: 0,
        margin: 0,
        alignItems: 'center',
        justifyContent : 'center'
    },
    tabBarTextStyle: {
        fontSize: DEFAULT_TEXT.head_small,
    },
    underlineStyle: {
        height: 1.5,
        backgroundColor: DEFAULT_COLOR.lecture_base,
    },
});
