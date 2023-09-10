import React, { Component } from 'react';
import {
    View,Text,TouchableOpacity,StyleSheet,FlatList,Platform,ActivityIndicator,RefreshControl
} from 'react-native';
import { NavigationEvents } from 'react-navigation';


export default class UserListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isdetailveiw : false,
            offset : 0,
            loading: false,
            serverData: [],
            fetching_from_server: false,
            refreshing : false,
            testnumber  : 1
        };
        console.log('dddd', this.props.navigation.isFocused());
        

    }

    
    componentDidCatch(error, info) {
        console.error(error, info);
    } 
    componentDidMount() {
        this.setState({
            serverData: [],
            loading: false,
        });
        this.loadMoreData();
    }
    UNSAFE_componentWillMount() {
        this.setState({
            serverData: [],
            loading: false,
        });
        /*
        fetch('https://todo.hackers.com:3001/getpost?rows=10&offset=' + this.state.offset)
            .then(response => response.json())
            .then(responseJson => {
                console.log("responseJson",responseJson);
                this.offset = this.offset + 1;
                this.setState({
                    serverData: [this.state.serverData, ...responseJson],
                    loading: false,
                });
            })
            .catch(error => {
                console.error(error);
            });
            */
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps');
    }

    shouldComponentUpdate(nextProps, nextState) {      
        console.log('shouldComponentUpdate : ' , this.state.serverData.length);  
        return true;
    }

    componentWillUpdate(nextProps, nextState) {
        console.log('componentWillUpdate');
    }

    componentDidUpdate() {
        console.log('componentWillReceiveProps', this.state.testnumber );
        
    }

    loadMoreData = () => {
        this.setState({
            testnumber: this.state.testnumber + 1
        });
        
        this.setState({
            fetching_from_server: true,
            isRefreshing : true
            } , () => {
            fetch('https://reactserver.hackers.com:3001/getpost?rows=10&offset=' + this.state.offset)
                .then(response => response.json())
                .then(responseJson => {

                    this.setState({
                        serverData: [...this.state.serverData, ...responseJson],
                        fetching_from_server: false,
                        offset : this.state.offset + 1,
                    });
                    setTimeout(() => {
                        this.refs.FlatList_Reference2.scrollToEnd({animated: true});
                        this.setState({isRefreshing: false});
                    },500)

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

    onRefresh() {
        console.log("refresh",this.state.refreshing);
        this.loadMoreData();
    }

    moveDetail = async (uidx,uname) => {
        console.log(uidx);
        this.setState({
            isdetailveiw : false
          })
        this.props.navigation.navigate('UserDetailScreen' , { UserIdx : uidx , UserName : uname});
    }

    _refreshscreen = async () => {
        console.log('list didfocus okay');
        //this.forceUpdate;
          if ( this.state.isdetailveiw ) {
            this.setState({              
                serverData: [],
                loading: false,   
            });
          }else{
            this.setState({
              isdetailveiw : true,
            })
          }
    }

    _didblur = () => {
    console.log('list didblur okay');
    //this.props.navigation.replace('HomeScreen');
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationEvents onDidFocus={() => this._refreshscreen()} onWillBlur={() => this._didblur()} />
                {this.state.loading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <FlatList
                        ref='FlatList_Reference2'
                        style={{ width: '100%',padding : 5 }}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.serverData}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity style={styles.item} onPress= {()=> this.moveDetail(item.userId,item.name)} >
                                <Text style={styles.text} >
                                    {index+1}
                                    {'_'}
                                    {item.userId}
                                    {'_'}
                                    {item.name}
                                    {'_'}
                                    {item.createdDtm}
                                </Text>
                            </TouchableOpacity>
                        )}
                        //ItemSeparatorComponent={() => <View style={styles.separator} />}
                        ListFooterComponent={this.renderFooter.bind(this)}
                        //Adding Load More button as footer component
                        refreshControl={
                            <RefreshControl
                                //refresh control used for the Pull to Refresh
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh.bind(this)}
                                tintColor="#ff0000"
                                title="Loading..."
                                titleColor="#00ff00"
                                colors={['#ffffff']}
                                progressBackgroundColor="#c375f4"
                            />
                        }
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
        backgroundColor: '#cccccc',
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
        backgroundColor: '#c375f4',
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
