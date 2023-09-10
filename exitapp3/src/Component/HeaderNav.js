import React, {Component} from 'react';
import { withNavigation } from 'react-navigation';
import { DrawerActions} from 'react-navigation-drawer';
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {
    Text
} from 'react-native';

class HeaderNav extends Component{

    constructor(props){
        super(props);

    }
    render() {
        return (
            <TouchableOpacity
                style={{
                    width: 44,
                    height: 44,
                    marginLeft: 20,
                    marginTop : 20
                }}
                >
                {/*<Icon name='menu' size={20} color='black'/>*/}
                <Text onPress={()=>{
                    this.props.navigation.openDrawer();
                }}>BBB</Text>

            </TouchableOpacity>
        )
    };
}

export default withNavigation(HeaderNav);
