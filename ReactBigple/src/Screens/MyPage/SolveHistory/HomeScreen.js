import React, {Component} from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import RouteScreen from './RouteScreen';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const Eduitems = [
    {name: '토익', nav: 'ToeicScreen'},
    {name: '일본어', nav: 'JapanScreen'},
    {name: '중국어', nav: 'ChinaScreen'},
];
export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            nowFocus: 'ToeicScreen',
            focusTab: this.props.screenState.focusTab,
        };
    }

    moveNext = snav => {
        this.setState({nowFocus: snav});
        this.setState({focusTab: this.props.screenState.focusTab});
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({loading: true});
        this.refresh_end();
    }

    shouldComponentUpdate(nextProps, nextState) {
        //console.log('this.props.screenState.focusTab',this.state.focusTab);
        return true;
    }

    refresh_end = () => {
        setTimeout(() => {
            this.setState({
                loading: false,
            });
        }, 500);
    };

    render() {
        return this.state.loading ? (
            <View
                style={[
                    styles.MainContainer,
                    {height: '100%', textAlign: 'center', alignItems: 'center', justifyContent: 'center'},
                ]}>
                <ActivityIndicator size="large" />
            </View>
        ) : (
            <View style={styles.MainContainer}>
                <View style={styles.HeaderContainer}>
                    <ScrollView horizontal={true}>
                        {Eduitems.map((item, index) => {
                            return (
                                <View
                                    key={index}
                                    style={[
                                        styles.itemContainer,
                                        this.state.nowFocus === item.nav
                                            ? styles.nowfocus
                                            : styles.notfocus,
                                    ]}>
                                    {this.state.nowFocus === item.nav ? (
                                        <TouchableOpacity>
                                            <Text>{item.name}</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            style={styles.itemView}
                                            onPress={() =>
                                                this.moveNext(item.nav)
                                            }>
                                            <Text
                                                style={
                                                    this.state.nowFocus ===
                                                    item.nav
                                                        ? styles.fontColorWhite
                                                        : styles.fontColorGray
                                                }>
                                                {item.name}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
                <View>
                    <RouteScreen
                        screenProps={this.props.screenProps}
                        screenState={this.state}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    MainContainer: {
        // flex: 1,
    },
    HeaderContainer: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    itemContainer: {
        flex: 1,
        width: SCREEN_WIDTH / Eduitems.length,
        height: 50,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemView: {
        width: '100%',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nowfocus: {
        backgroundColor: '#ccc',
    },
    notfocus: {
        backgroundColor: '#fff',
    },
    fontColorWhite: {
        color: '#fff',
    },
    fontColorGray: {
        color: '#ccc',
    },
});
