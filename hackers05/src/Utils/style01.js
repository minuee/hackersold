import { StyleSheet} from 'react-native';

const style01 = StyleSheet.create({
    container: {
        flex: 1,
        width : "100%"
    },
    navTtitle : {
        fontSize: 20,
        paddingRight:20
    },
    rowViewContainer:
        {
            padding: 10,
            fontSize: 18,

        },
    action_style:{
        flex : 1,
        flexDirection:'row-reverse',
        width: '100%',
        fontSize: 22,
        padding: 10,
        backgroundColor: '#f7f7f7',
    },
    action_button_hidden: {
        display : "none"
    },
    close_button : {
        width: 30,
        alignSelf: 'flex-end',
        textAlign: 'center',
        color: '#fff',
        fontSize: 20,
        padding: 5,
        borderRadius: 15,
        borderWidth: 1,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
    },
    action_button: {
        width: 50,
        alignSelf: 'flex-end',
        textAlign: 'center',
        color: '#fff',
        fontSize: 20,
        padding: 5,
        borderRadius: 4,
        borderWidth: 1,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        marginRight:5
    },
    action_text_wrap : {
        width:"90%",
        padding: 5,

        textAlign:'left'
    },
    action_text : {
        fontSize: 15,
        color: '#ff0000',
        marginLeft:10,
    },
    header_style:{
        width: '100%',
        flexDirection:'row',
        color: '#fff',
        fontSize: 25,
        padding: 15,
        backgroundColor: '#42a4ff',
    },
    header_text : {
        fontSize: 15,
        color: '#ffffff',
        marginLeft:30,
        paddingTop :15
    },
    setting_container : {
        position :"absolute",
        top:"100%",
        left:0,
        zIndex : 10,
        width: '100%',
        height: '100%',
        color: '#fff',
        fontSize: 22,
        padding: 20,
        backgroundColor: '#9b9b9b',
        paddingVertical: 10
    },
    sliderContainerWrap: {
        width: "100%",
        flexDirection:'row',
    },
    sliderContainer: {
        width: "45%",
    },
    sliderContainer2: {
        width: "10%",
        alignItems:'flex-end'
    },
    sliderContainer100: {
        width: "100%",
        alignItems:'stretch',
        textAlign:"left",
        marginTop:20
    },
    infolable : {
        fontSize: 15,
        padding: 5,
    },
    infolable2 : {
        fontSize: 15,
    },
    sliderLabel: {
        textAlign: "center",
        marginRight: 20
    },
    footer_style:{
        width: '100%',
        height: 45,
        backgroundColor: '#62b7ff',
        justifyContent:'flex-end'
    },
    navigator_style:{
        width: '100%',
        height: 45,
    },
    textStyle:{
        textAlign: 'center',
        color: '#fff',
        fontSize: 20,
        padding: 7
    },
    myButton : {
        width:50
    },
    item: {
        padding: 10,
        borderColor: '#ebebeb',
        borderWidth: 1,
    },
    separator: {
        height: 0.5,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    text: {
        fontSize: 15,
        color: 'black',
    },
})

export default style01;
