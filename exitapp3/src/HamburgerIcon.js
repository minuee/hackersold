import React, {Component} from 'react';
import { withNavigation } from 'react-navigation';
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/SimpleLineIcons';


class HamburgerIcon extends Component{
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
                <Icon
                    name='menu'
                    size={20}
                    color='black'
                    onPress={()=>{this.props.navigation.openDrawer();}}
                />
            </TouchableOpacity>
        )
    };
}

export default withNavigation(HamburgerIcon);
