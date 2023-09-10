import React, { Component } from 'react';
import {View,Text,TouchableOpacity,StyleSheet,FlatList,Platform,ActivityIndicator} from 'react-native';
import MemberDetailScreen from "./MemberDetailScreen";
//import all the components we are going to use.


export default class MemberListScreen extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            serverData: [],
            fetching_from_server: false
        };
        this.offset = 1;

    }

    componentDidMount() {
        fetch('http://52.78.207.87:8080/getpost?rows=10&offset=' + this.offset)
            .then(response => response.json())
            .then(responseJson => {
                this.offset = this.offset + 1;
                this.setState({
                    serverData: [...this.state.serverData, ...responseJson],
                    loading: false,
                });
            })
            .catch(error => {
                console.error(error);
            });
    }

    loadMoreData = () => {
        this.setState({ fetching_from_server: true }, () => {
            fetch('http://52.78.207.87:8080/getpost?rows=10&offset=' + this.offset)
                .then(response => response.json())
                .then(responseJson => {
                    this.offset = this.offset + 1;
                    this.setState({
                        serverData: [...this.state.serverData, ...responseJson],
                        fetching_from_server: false,
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        });
    };


    renderFooter() {
        return (
            <View style={styles.footer}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={this.loadMoreData}
                    style={styles.loadMoreBtn}>
                    <Text style={styles.btnText}>Load More</Text>
                    {this.state.fetching_from_server ? (
                        <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
                    ) : null}
                </TouchableOpacity>
            </View>
        );
    }

    moveDetail = (uidx) => {
        console.log(uidx);
        this.props.navigation.navigate('MemberDetailScreen' , { UserIdx : uidx});
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.loading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <FlatList
                        style={{ width: '100%' }}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.serverData}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity style={styles.item} onPress= {()=> this.moveDetail(item.UserIdx)} >
                                <Text style={styles.text} >
                                    {index+1}
                                    {'_'}
                                    {item.UserIdx}
                                    {'_'}
                                    {item.UserName.toUpperCase()}
                                    {'_'}
                                    {item.RegDatetime}
                                </Text>
                            </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        ListFooterComponent={this.renderFooter.bind(this)}
                        //Adding Load More button as footer component
                    />
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        padding: 10,
        backgroundColor: 'skyblue',
    },
    separator: {
        height: 0.5,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    text: {
        fontSize: 15,
        color: 'black',
    },
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    loadMoreBtn: {
        padding: 10,
        backgroundColor: '#800000',
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
    },
});
