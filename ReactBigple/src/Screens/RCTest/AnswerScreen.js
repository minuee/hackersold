import React from 'react';
import {StyleSheet,View,Text, ScrollView,Alert} from 'react-native';
import {NavigationActions,StackActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import { Button } from 'react-native-elements';
import Toast from 'react-native-tiny-toast';
import CommonStyle from '../../Styles/CommonStyle'

const resetAction = StackActions.reset({
    index: 0,
    key : null,
    params : {
        index :1,
        name : 'hong'
    },
    actions: [NavigationActions.navigate({routeName : 'SampleScreen'})],
});

export default class AnswerScreen extends React.Component {

    constructor(props) {       
        super(props);
    
        this.state  = {
           
        }
    }

    _addNextConversation = () => {
        console.log('tempSave');
        this.setState({ isSaveTemp : true  });
        Alert.alert(
            "추가 진행",
            "유료상품을 회원만 집중학습을 무제한으로 진행하실 수 있습니다.\n 지금 바로 상품을 확인해 보시겠습니까.",
            [
                {text: '보러가기', onPress: () => null},
                {text: '나중에 하기', onPress: () => null}
                
            ],
            { cancelable: true }
        )
    }

    _returnToppage = async() => {           
        this.props.screenProps.screenState.returnTopPage(this.props.screenState.isSaveTemp);
        //this.props.screenProps.navigation.dispatch(resetAction);
    }

    render() {   
        
      
        
        return (
            <View style={styles.container}>                
                <ScrollView > 
                    <View style={styles.mainContainer}>
                        <View style={styles.circleContainer}>
                            <View style={styles.circleHeader}>
                                <Text style={[CommonStyle.font40,CommonStyle.textWhite]}>
                                    60%
                                </Text>
                            </View>
                            <View style={styles.circleMiddle}>

                            </View>
                            <View style={styles.circleFooter}>
                                <Text style={[CommonStyle.font20,CommonStyle.textWhite]}>
                                    정답{"\n"}
                                    6/10
                                </Text>
                            </View>
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={[CommonStyle.font20]}>
                                세부 취약 유형(준동사구, PART 4)
                            </Text>

                            <Text style={[CommonStyle.font15,CommonStyle.mt15,{lineHeight : 23}]}>
                                - 현재분사 vs. 과거분사 {"\n"}
                                - to 부정사의 역활{"\n"}
                                - 동명사 vs. 명사{"\n"}
                                - to 부정사를 취하는 동사{"\n"}
                                - 분사의 역활
                            </Text>
                        </View>

                        
                    </View>
                </ScrollView>
                <View style={styles.footerContainer}>
                    <View style={[{flex:1,width:'98%'},styles.ButtonWrap]}>
                        <View style={{flex:1,height:40,paddingHorizontal : 5}}>
                            <Button                                
                                title="풀이 계속하기"                                                            
                                onPress= {()=> this._addNextConversation()}
                            />    
                        </View>
                        <View style={{flex:1,height:40,paddingHorizontal : 5}}>
                            <Button                                
                                title="풀이이력 보기"                                                            
                                onPress= {()=> this.props.screenState.mypageHistory()}
                            />    
                        </View>
                    </View>
                    <View style={{flex:1,width:'98%',height:35,paddingHorizontal:5}}>
                        <Button                                
                                title="나가기"                            
                                type='outline'
                                onPress= {()=> this._returnToppage()}
                            />    
                    </View>
                </View>
            </View>
        )        
    }
   
}

const styles = StyleSheet.create({
    container: {
        flex: 1,        
    },
    mainContainer : {   
        flex : 1,
        width : '100%',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',    

    },
    circleContainer : {       
        flex :1, 
        width : 150,
        height : 150,
        borderRadius : 75,
        backgroundColor : '#ccc',        
        marginVertical : 20,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',        
        
    },
    circleHeader : {
        flex : 4,        
        alignItems: 'center',
        justifyContent: 'flex-end',
        textAlign: 'center',   

    },
    circleMiddle : {
        flex : 0.1,        
        width : '50%',
        marginTop : 10,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',   
        backgroundColor : '#fff',
        

    },
    circleFooter : {
        flex : 4,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    textContainer : {   
        flex : 1,
        width : '96%',
        marginTop:20,
        paddingHorizontal : '2%',
        justifyContent: 'center',
        

    },
    footerContainer : {   
        
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',        
        paddingVertical : 10,
        
        height : 100,        
        backgroundColor : '#ccc'

    },
        ButtonWrap : {  
        flex : 1,      
        flexDirection : 'row',
        marginBottom : 10
    },
    

});
