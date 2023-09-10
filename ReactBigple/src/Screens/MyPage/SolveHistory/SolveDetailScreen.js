import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
    SafeAreaView,
    Modal,
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import {ListItem, Button} from 'react-native-elements';
const {width: SCREEN_WIDTH} = Dimensions.get('window');

import CommonStyle from '../../../Styles/CommonStyle';

class SolveDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            historyList: [
                {index: 1, ox: 'x', qNo: '101',  part: 'PART5', text: 'The interms will work ----------- the direction of the research'},
                {index: 2, ox: 'o', qNo: '102',  part: 'PART5', text: 'The historic house on Ambrose Road has changed --------- since it'},
                {index: 3, ox: 'x', qNo: '101',  part: 'PART5', text: 'The interms will work ----------- the direction of the research'},
                {index: 4, ox: 'o', qNo: '102',  part: 'PART5', text: 'The historic house on Ambrose Road has changed --------- since it'},
                {index: 5, ox: 'x', qNo: '101',  part: 'PART5', text: 'The interms will work ----------- the direction of the research'},
                {index: 6, ox: 'o', qNo: '102',  part: 'PART5', text: 'The historic house on Ambrose Road has changed --------- since it'},
                {index: 7, ox: 'x', qNo: '101',  part: 'PART5', text: 'The interms will work ----------- the direction of the research'},
                {index: 8, ox: 'o', qNo: '102',  part: 'PART5', text: 'The historic house on Ambrose Road has changed --------- since it'},
                {index: 9, ox: 'x', qNo: '101',  part: 'PART5', text: 'The interms will work ----------- the direction of the research'},
                {index: 10, ox: 'o', qNo: '102',  part: 'PART5', text: 'The historic house on Ambrose Road has changed --------- since it'},
                {index: 11, ox: 'x', qNo: '101',  part: 'PART5', text: 'The interms will work ----------- the direction of the research'},
                {index: 12, ox: 'o', qNo: '102',  part: 'PART5', text: 'The historic house on Ambrose Road has changed --------- since it'},
            ],
        };
        this.getResultIcon = this.getResultIcon.bind(this);
    }

    getResultIcon = (ox) => {
        return ox === 'o'
            ? require('../../../../assets/icons/result_o.png')
            : require('../../../../assets/icons/result_x.png');
    };

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    {this.state.historyList.map((item, index) => (
                        <ListItem
                            key={index}
                            leftAvatar={{
                                title: item.ox,
                                source: this.getResultIcon(item.ox),
                                overlayContainerStyle: {backgroundColor: '#fff'},
                            }}
                            title={item.qNo + ' ' + item.part}
                            titleStyle={styles.itemTitleText}
                            subtitle={<Text numberOfLines={1} style={styles.itemSubTitleText}>{item.text}</Text>}
                            style={styles.itemList}
                        />
                    ))}
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 20,
    },
    itemList: {
        borderWidth: 1,
        borderColor: '#efefef',
        marginBottom: 5,
        width: '94%',
    },
    itemTitleText: {
        fontSize: 12,
        color: '#555',
        marginBottom: 7,
    },
    itemSubTitleText: {
        fontSize: 12,
        color: '#555',
    },
});

export default SolveDetailScreen;
