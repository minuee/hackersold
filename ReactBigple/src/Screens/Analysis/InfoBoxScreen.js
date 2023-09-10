import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
    Text,
    Animated,
    Platform,
    View,
    Dimensions,
    Image,
    Picker,
    PickerIOS
} from 'react-native';

import { Button } from 'react-native-elements';

import GraphBoxScreen from './GraphBoxScreen';
import LectureStudyMainScreen from '../LectureStudy/MainScreen';

import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

class InfoBoxScreen extends Component {
    constructor(props) {
        super(props);
        this.child = React.createRef();
        this.state = {
            isLoadedFinished: false
        }
    }

    render() {
        //const {navigate} = this.props.navigation;
        return (
            <View>
                {/* 상단 */}
                <View>
                    <View style={{ flexDirection: 'row', height: 150}}>
                        {/* 이미지 */}
                        <View style={{ flex: 1 }}>
                            <Image
                                style={{ flex: 1, resizeMode: 'stretch',  }}
                                source={{ uri: 'http://image.yes24.com/momo/TopCate2068/MidCate002/123440044.jpg' }} />
                        </View>

                        {/* 컨텐츠 */}
                        <View style={{ flex: 3, margin: 10 }}>
                            <View>
                                { Platform.OS == 'ios' ? null :
                                    <Picker
                                        selectedValue={ this.state.language }
                                        style={{ height: 20, marginRight: 60, marginLeft: -7, color:'#6C6C6C' }}
                                        itemStyle={{ fontSize: 17 }}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState({ language: itemValue })
                                        }
                                        mode='dialog'>
                                        <Picker.Item label="Serial Number 01-01-01" value="Serial Number 01-01-01" />
                                        <Picker.Item label="Serial Number 01-01-02" value="Serial Number 01-01-02" />
                                    </Picker>
                                }
                            </View>
                            <View style={{ marginRight: 50, marginBottom: 20 }}>
                                <Text style={{fontSize:16, color:'#6C6C6C'}}>해커스 신토익 실전 1000제 3 RC</Text>
                            </View>
                            <View style={{ marginRight: 40 }}>
                                <Button
                                    icon={
                                        <Icon
                                            name='gift'
                                            size={15}
                                            color='#8C8C8C'
                                        />
                                    }
                                    title='  구매 & 무료혜택 확인'
                                    type='outline'
                                    titleStyle={{ color: '#8C8C8C', fontSize:13 }}
                                    buttonStyle={{ backgroundColor: '#F8F8F8', borderColor: '#8C8C8C' }}
                                    header={
                                        <View></View>
                                    }
                                ></Button>
                            </View>
                            <View>
                                <View style={{ alignItems: 'flex-end', marginTop: -5, marginRight: 10, }}>
                                    <Icon name='angle-down' size={25} color='#8C8C8C' onPress={() => this.child.current._onPressArrow()}></Icon>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View>
                        <GraphBoxScreen ref={this.child} screenProps={this.props.screenProps} />
                    </View>
                </View>

                <View style={{ height: 10, backgroundColor: '#E2E2E2' }} />
                <View>
                    <View>
                        <Button
                            title='더보기'
                            type='outline'/>
                        <View style={{ height: 10, backgroundColor: '#E2E2E2' }} />
                        <Button
                            title='강의학습'
                            onPress={() => this.props.screenProps.navigation.navigate('LectureStudyScreen') }/>
                    </View>
                </View>
            </View>
        );
    }
}

export default InfoBoxScreen;

