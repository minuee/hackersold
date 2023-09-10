import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity
} from 'react-native';
import { NavigationEvents,StackActions, NavigationActions,SwitchActions } from 'react-navigation';


export default class UserDetailScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading : false,
            UserIdx: this.props.navigation.state.params.UserIdx,
            UserName: this.props.navigation.state.params.UserName,
            UserInfo : []
        };


    }

    static navigationOptions = ({navigation, screenProps}) => {
        const params =  navigation.state.params || {};
        return {
            headerTitle: params.newtitle,
            headerStyle: { backgroundColor: '#cccccc',height: 30,},
            headerTitleStyle: {fontSize: 14, paddingHorizontal : 5 }
        }
    };

    _setNavigationParams(){
        let newtitle = this.state.UserName ? this.state.UserName + "님의 Profile" : null;
        this.props.navigation.setParams({
            newtitle
        });
    }

    UNSAFE_componentWillMount() {
        this._setNavigationParams();

        fetch('https://reactserver.hackers.com:3001/getData?useridx=' + this.state.UserIdx)
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    UserInfo: responseJson[0],
                    isLoading : true
                });
            })
            .catch(error => {
                console.error(error);
            });
    }
    UNSAFE_componentWillUnmount(nextProps) {
        console.log('UNSAFE_componentWillMount');
    }

    _refreshscreen = async () => {
        console.log('detail didfocus okay');
        //this.props.navigation.dispatch(SwitchActions.jumpTo('HomeScreen'));
        /*
        this.props.navigation.dispatch(StackActions.pop(
            {n : 2}
        ));
        
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.pop({ routeName: 'HomeScreen' })],
        });
        this.props.navigation.dispatch(resetAction);
        */
        
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

    _didblur = async() => {
        console.log('detail didblur okay2');
        //this.props.navigation.replace('HomeScreen');
    }

    render() {
        return (
            this.state.isLoading ?
            <ScrollView style={styles.container}>
                <NavigationEvents onWillBlur={() => this._didblur()} onDidFocus={() => this._refreshscreen()}  />
                <View style={styles.header}></View>
                <Image style={styles.avatar} source={{uri: this.state.UserInfo.face ? this.state.UserInfo.face.replace("http","https") : 'https://reactserver.hackers.com/assets/images/react/avatar6.png'}}/>
                <View style={styles.body}>
                    <View style={styles.bodyContent}>
                        <Text style={styles.name}>{this.state.UserInfo.Username}</Text>
                        <Text style={styles.info}>{this.state.UserInfo.Group_Name} / {this.state.UserInfo.ChargeName}</Text>
                        <Text style={styles.description}>등록일자 : {this.state.UserInfo.createdDtm}</Text>

                        <TouchableOpacity style={styles.buttonContainer}>
                            <Text>수정</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonContainer}>
                            <Text>탈퇴</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            :
            null

        );
    }
}
const styles = StyleSheet.create({
    header:{
        backgroundColor: "#c375f4",
        height:200,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom:10,
        alignSelf:'center',
        position: 'absolute',
        marginTop:130
    },
    name:{
        fontSize:22,
        color:"#FFFFFF",
        fontWeight:'600',
    },
    body:{
        marginTop:40,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding:30,
    },
    name:{
        fontSize:28,
        color: "#696969",
        fontWeight: "600"
    },
    info:{
        fontSize:16,
        color: "#c375f4",
        marginTop:10
    },
    description:{
        fontSize:16,
        color: "#696969",
        marginTop:10,
        textAlign: 'center'
    },
    buttonContainer: {
        marginTop:10,
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width:250,
        borderRadius:30,
        backgroundColor: "#c375f4",
    },
});
