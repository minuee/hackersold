import React, {Component} from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Text,
    PixelRatio,
    Dimensions,
    Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import {CustomTextB, CustomText, CustomTextR} from "../../../Style/CustomText";
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../../Constants/index';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

export default class FreeLectureFilterModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            filterList: this.props.screenState.filterList,
            selectedFilterIndex: this.props.screenState.selectedFilterIndex,
            heightScrollView: 0,
        }
    }

    onLayoutScrollView = (event) => {
        const layout = event.nativeEvent.layout;
        this.setState({
            heightScrollView: layout.height
        });
    }

    render() {
        return (
            <View style={styles.modalWrapper}>
                <View style={styles.modalContent}>
                    <ScrollView
                        style={styles.modalScroll}
                        onLayout={(event) => this.onLayoutScrollView(event)}
                        indicatorStyle='black'>
                        {
                            this.state.filterList.map((item, index) => {
                                return (
                                    <View style={styles.modalItem}>
                                        <TouchableOpacity
                                            style={styles.modalItemWrapper}
                                            onPress={() => {
                                                this.setState({ selectedFilterIndex: item.index })
                                                this.props.screenState.setFilterItemSelected(item.index)
                                            }}
                                        >
                                            <View style={styles.modalItemIconSelectedWrapperLeft}>
                                            </View>

                                            <View style={styles.modalItemIconSelectedWrapperCenter}>
                                                {
                                                    this.state.selectedFilterIndex == item.index
                                                        ?
                                                            <CustomTextB
                                                                style={styles.modalItemTextSelected}
                                                                numberOfLines={1}>
                                                                {item.title}
                                                            </CustomTextB>
                                                        :
                                                            <CustomTextR
                                                                style={styles.modalItemText}
                                                                numberOfLines={1}>
                                                                {item.title}
                                                            </CustomTextR>
                                                }
                                            </View>
                                            <View style={styles.modalItemIconSelectedWrapperRight}>
                                                {
                                                    this.state.selectedFilterIndex == item.index
                                                    &&
                                                    <Image
                                                        style={styles.modalItemIconSelected}
                                                        source={require('../../../../assets/icons/btn_check_list.png')}
                                                    />
                                                }
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })
                        }
                        <LinearGradient
                            pointerEvents={'none'}
                            colors={["rgba(255,255,255,0.00)", "rgba(255,255,255,0.80)", "rgba(255,255,255,0.99)"]}
                            locations={[0.70, 0.99, 1]}
                            style={{position: "absolute", bottom: 0, height: this.state.heightScrollView, width: "100%", }}
                        />
                    </ScrollView>
                    <View style={styles.cancelButton}>
                        <TouchableOpacity
                            style={styles.cancelButtonWrapper}
                            onPress={() => this.props.screenState.toggleFilterModal()}
                        >
                            <CustomTextR styles={styles.cancelButtonText}>취소</CustomTextR>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modalWrapper: {
        flex: 1,
        //backgroundColor: '#00000055',
    },
    modalContent: {
        flex: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: DEFAULT_COLOR.base_color_fff,
    },
    modalScroll: {

    },
    modalItem: {
        height: 65,
        //alignItems: 'center',
        justifyContent: 'center',
    },
    modalItemWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalItemText: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(16),
        lineHeight: 16 * 1.42,
    },
    modalItemTextSelected: {
        textAlign: 'center',
        color: DEFAULT_COLOR.lecture_base,
        fontSize: PixelRatio.roundToNearestPixel(16),
        lineHeight: 16 * 1.42,
    },
    modalItemIconSelectedWrapperCenter: {
        flex: 5,
        alignItems: 'center',
        alignSelf: 'center',
    },
    modalItemIconSelectedWrapperLeft: {
        flex: 1,
        alignItems: 'center',
        alignSelf: 'center',
    },
    modalItemIconSelectedWrapperRight: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignSelf: 'center',
    },
    modalItemIconSelected: {
        width: 15,
        height: 15,
    },
    cancelButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonWrapper: {
        width: SCREEN_WIDTH - 34,
        height: 50,
        backgroundColor: DEFAULT_COLOR.input_bg_color,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 17,
        paddingRight: 17,
        marginBottom: 17,
    },
    cancelButtonText: {
        color: DEFAULT_COLOR.base_color_888,
        fontSize: PixelRatio.roundToNearestPixel(16),
        lineHeight: 16 * 1.42,
    },
});
