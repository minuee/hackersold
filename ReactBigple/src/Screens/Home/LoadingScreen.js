import React from 'react';
import { View,ActivityIndicator,StatusBar} from 'react-native';


export default class LoadingScreen extends React.Component {

    constructor(props) {
        super(props);
        console.log("boot props",this.props);
        this.state  = {
            loading : false,
            thisFocus : this.props.screenProps.nowFocus
        }
    }   

    UNSAFE_componentWillMount() {        
        this._bootstrapAsync();
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('shouldComponentUpdat dddde');
        return true;
    }

    UNSAFE_componentWillReceiveProps() {
        console.log('componentWillReceiveProps1');        
        this._bootstrapAsync();    
    }
    
    _bootstrapAsync = async () => {
        //console.log("check props",this.props.screenProps);        
        this.props.navigation.navigate(this.props.screenProps.nowFocus,this.props);
    };

    // Render any loading content that you like here
    render() {
        
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}
