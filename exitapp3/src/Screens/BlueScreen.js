import React from "react";
import { View, Text } from "react-native";
import MyHeader from "../Component/MyHeader";

const BlueScreen = props => {
    return (
        <View>
            <MyHeader navigation={props.navigation} title="Home" />
            <Text>This is BlueScreen</Text>
        </View>
    );
};

export default BlueScreen;