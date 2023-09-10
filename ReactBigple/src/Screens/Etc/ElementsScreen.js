import React from 'react';
import { 
    Platform,StyleSheet,View,BackHandler,ToastAndroid,StatusBar,
    SafeAreaView,ScrollView,Image,Text
 } from 'react-native';

import { Avatar,Badge, Button,ButtonGroup,Card,CheckBox,Divider,Header,ListItem,Overlay,withBadge,Rating, AirbnbRating,SearchBar,Slider,Tooltip } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

export default class ElementsScreen extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {     
            sliderval : 0.5,   
            isVisible : true,
            isChecked1 : true,
            isChecked2 : true,
            selectedIndex: 1,
            search: '',
            avatar_url : 'https://reactserver.hackers.com/assets/images/react/avatar6.png'
        };

        this._updateIndex = this._updateIndex.bind(this);
    }


    UNSAFE_componentWillMount() {
        
    }

    UNSAFE_componentWillUnmount() {

    }

    componentDidMount() {      

    }
        
        
    _onPressEvent = () => {    
        console.log("pressed");
    }

    _updateIndex (selectedIndex) {
        this.setState({selectedIndex})
    }
    ratingCompleted(rating) {
        console.log("Rating is: " + rating)
    }

    updateSearch = search => {
        this.setState({ search : search});
    };
    render() {

        const buttons = ['전범접', '노수다', '황야치']
        const { selectedIndex,search } = this.state;
        const users = [
            {
               name: '해커스',
               avatar: 'https://reactserver.hackers.com/assets/images/react/avatar6.png'
            }
           ]

        return (
            <View>
                <Header
                    placement="left"
                    leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: '해커스교육그룹', style: { color: '#fff' } }}
                    rightComponent={{ icon: 'home', color: '#fff' }}
                /> 
                <SafeAreaView>                
                    <ScrollView>                    
                        <View style={styles.Rootcontainer}>
                            <Avatar
                                size="medium"
                                rounded
                                source={{
                                    uri:
                                    'https://reactserver.hackers.com/assets/images/react/avatar6.png'
                                    //'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                                }}
                            />
                            <Avatar 
                                size="xlarge"
                                rounded title="Hac" 
                                onPress={() => { this._onPressEvent() } }
                            />
                            <Avatar
                                size="large"
                                source={{
                                    uri:
                                    'https://reactserver.hackers.com/assets/images/react/avatar6.png'
                                }}
                                showEditButton
                            />
                            <ListItem
                                leftAvatar={{
                                    title: 'Hac',
                                    source: { uri: this.state.avatar_url },
                                    showEditButton: true,
                                }}
                                title="모듈혁신모바일팀"
                                subtitle="アポたち"
                                chevron
                                style={{width:'90%',paddingHorizontal : '5%',color : '#ccc'}}
                            />
                        </View>
                        <View style={styles.commonViewWrap}>
                            <Avatar
                                rounded
                                source={{
                                uri: 'https://reactserver.hackers.com/assets/images/react/avatar6.png',
                                }}
                                size="large"
                            />

                            <Badge
                                status="success"
                                containerStyle={{ position: 'absolute', top: 5, right: '40%' }}
                            />
                        </View>
                        <View style={[styles.commonViewWrap,{flexDirection:'row'}]}>
                            <Button
                                title="Solid Button"
                                style={styles.paddingFive}
                            />
                            <Button
                                icon={
                                    <Icon
                                    name="arrow-right"
                                    size={15}
                                    color="white"
                                    />
                                }
                                title="Icon"
                                style={styles.paddingFive}
                            />
                            <Button
                                title="Loading button"
                                loading={true}
                                style={styles.paddingFive}
                            />
                        </View>
                        <View style={styles.commonViewWrap}>
                            <ButtonGroup
                                onPress={this._updateIndex}
                                selectedIndex={selectedIndex}
                                buttons={buttons}
                                containerStyle={{height: 50}}
                            />
                        </View>
                        
                        <View style={[styles.commonViewWrap,{flexDirection:'row'}]}>
                            <CheckBox
                                title='Click Here'
                                checked={this.state.isChecked1}
                                onPress={() => this.setState({isChecked1: !this.state.isChecked1})}
                            />
                            <CheckBox
                                center
                                title='Click Here'
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checked={this.state.isChecked2}
                                checkedColor="#ff0000"
                                onPress={() => this.setState({isChecked2: !this.state.isChecked2})}
                            />
                        </View>
                        <View style={styles.commonViewWrap}>
                            <Rating                            
                                ratingColor='#3498db'
                                ratingBackgroundColor='#c8c7c8'
                                ratingCount={5}
                                imageSize={30}
                                onFinishRating={this.ratingCompleted}
                                style={{ paddingVertical: 10 }}
                            />
                        </View>
                        <View style={styles.commonViewWrap}>
                            <Tooltip popover={<Text>Info here</Text>}>
                                <Text>Press me</Text>
                            </Tooltip>
                        </View>
                        <View style={[styles.commonViewWrap,{width:'100%'}]}>
                            <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center',width:'90%',paddingHorizontal : '5%' }}>
                                <SearchBar
                                    placeholder="Type Here..."
                                    onChangeText={this.updateSearch}
                                    value={search}
                                    
                                />
                            </View>
                        </View>
                        <View style={[styles.commonViewWrap,{width:'100%'}]}>
                            <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center',width:'90%',paddingHorizontal : '5%' }}>
                                <Slider
                                    value={this.state.sliderval}
                                    onValueChange={value => this.setState({ sliderval : value })}
                                />
                                <Text>Value: {this.state.sliderval.toFixed(2)}</Text>
                            </View>
                        </View>                        
                       
                        <View style={styles.commonViewWrap}>
                            <Card title="CARD WITH DIVIDER">
                                {
                                    users.map((u, i) => {
                                    return (
                                        <View key={i} style={{flexDirection:'row'}}>
                                            <Image
                                                style={{flex:1,width:30, height:30}}
                                                resizeMode="cover"
                                                source={{ uri: u.avatar }}
                                            />
                                            <Text style={styles.name}>
                                                {u.name}
                                            </Text>
                                        </View>
                                    );
                                    })
                                }
                            </Card>
                        </View>
                    </ScrollView>                
                </SafeAreaView>
            </View>
    
        )
    }
}

const styles = StyleSheet.create({
    Rootcontainer: {
        flex: 1,
        height:'100%',
        justifyContent: 'center',
        alignItems: 'center',
        color : '#000000',
        marginBottom : 50
    },
    commonViewWrap: {
        width:'100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical : 10
    },
    name: {
        flex:4,
        fontSize: 15,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft : 5
    },
    image: {
    
    },
    paddingFive : {
        padding : 5
    }
});
