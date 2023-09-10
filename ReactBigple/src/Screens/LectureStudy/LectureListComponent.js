import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    Text,
    Dimensions,
    Image,
} from 'react-native';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

// TODO: 컴포넌트에 데이터를 전달하여 재활용할 수 있도록 가공

var data;

class SampleComponent extends Component {
    constructor(props) {
        super(props);

        data = props.data;
    }

    render() {
        return(
            <View style={ styles.container }>
                <View style={ styles.areaTitle }>
                    <Text style={ styles.areaTitleText }>
                        {data.title}
                    </Text>
                </View>
                <View style={ styles.areaContent }>
                    {
                        data.items.map((item) => {
                            return(
                                <View style={ styles.contentItem }>
                                    <View style={ styles.itemAreaThumbnail }>
                                        <Image
                                            style={ styles.itemThumbnail }
                                            source={{ uri: item.thumbnail }} />
                                    </View>
                                    <View style={ styles.itemAreaContent }>
                                        <View style={ styles.itemAreaContentTop }>
                                            <Text style={ styles.itemContentTitle }>
                                                {item.title}
                                            </Text>
                                        </View>

                                        <View style={ styles.itemAreaContentBottom }>
                                            <View style={ styles.infoBottomCategory }>
                                                <Text style={ styles.infoBottomCategoryText }>{item.category}</Text>
                                            </View>
                                            <Text style={ styles.infoBottomNumber }>{item.chapter}</Text>
                                            <Text style={ styles.infoBottomAuthor }>  |  {item.teacher}</Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })
                    }
                </View>
            </View>
        );
    }
}

export default SampleComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
    },
    areaTitle: {
        marginBottom: 10,
    },
    areaTitleText: {
        color: '#3881E1',
        fontSize: 20,
        fontWeight: 'bold',
    },
    areaContent: {

    },
    contentItem: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 10,
    },
    itemAreaThumbnail: {
        flex: 1,
    },
    itemThumbnail: {
        flex: 1,
        height: SCREEN_HEIGHT / 8,
    },
    itemAreaContent: {
        flex: 1,
        marginLeft: 10,
    },
    itemAreaContentTop: {
        flex: 20,
    },
    itemContentTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    itemAreaContentBottom: {
        flex: 1,
        flexDirection: 'row',
    },
    infoBottomCategory: {
        color: '#FFFFFF',
        backgroundColor: '#357FE1',
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
    },
    infoBottomCategoryText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 10
    },
    infoBottomNumber: {
        color: '#357FE1',
    },
    infoBottomAuthor: {
        color: '#6A6A6A',
    },
});