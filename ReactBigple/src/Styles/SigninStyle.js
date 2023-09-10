import {StyleSheet, Dimensions} from 'react-native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
// TODO: auto scale text 다른 방식 연구 필요.
// fontSize: screenWidth*0.03

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        height: '100%',
    },
    pageTitle: {
        marginTop: 30,
        marginBottom: 30,
        fontWeight: 'bold',
        fontSize: 24,
    },
    textSkyBlue: {
        color: '#357be5',
    },
    // 로그인 폼
    signinForm: {
        width: '90%',
    },
    textInput: {
        height: 40,
        backgroundColor: '#f6f7f6',
        marginBottom: 15,
        padding: 10,
        borderRadius: 10,
    },
    signinOptions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rememberMe: {
        flex: 1,
        borderWidth: 0,
        padding: 0,
        margin: 0,
        backgroundColor: '#fff',
    },
    signinLink: {
        // flex: 1,
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
    },
    loginButton: {
        width: '100%',
        height: 50,
        marginTop: 20,
    },
    loginButtonTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    // 통합 회원이란
    signinDesc: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f3f4f3',
        marginTop: 30,
        padding: 20,
    },
    descTitle: {
        fontSize: 18,
        color: '#565756',
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 5,
    },
    descText: {
        fontSize: 15,
    },
    familySite: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 10,
        padding: 10,
    },
    item: {
        marginBottom: 5,
    },
    scalableText_W3: {
        fontSize: screenWidth * 0.03,
    },
    btnPrimary: {
        backgroundColor: '#33a7fe',
        color: '#fff',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnSecondary: {
        backgroundColor: '#d8d9d8',
        color: '#fff',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    width100p: {
        width: '100%',
    },
    width90p: {
        width: '90%',
    },
    width80p: {
        width: '80%',
    },
    width70p: {
        width: '70%',
    },
    width60p: {
        width: '60%',
    },
    width65p: {
        width: '65%',
    },
    width50p: {
        width: '50%',
    },
    width45p: {
        width: '45%',
    },
});

export const signupStyles = StyleSheet.create({
    wrapper: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 50,
    },
    container: {
        width: '90%',
        alignItems: 'center',
    },
    agree0: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        paddingRight: 0,
        marginBottom: 20,
    },
    agree0Text: {
        width: '85%',
        lineHeight: 24,
        fontWeight: 'bold',
    },
    agreeCheckboxContainerStyle: {
        backgroundColor: '#fff',
        margin: 0,
        padding: 0,
        paddingLeft: 3,
    },
    agree1: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginTop: 10,
        // marginBottom: 10,
    },
    agree1Text: {
        // backgroundColor: 'blue',
    },
    iconTextButton: {
        fontSize: 15,
        paddingLeft: 5,
        paddingRight: 5,
    },
    termsScrollView: {
        // width: '90%',
        height: '10%',
        marginBottom: 10,
    },
    termsText: {
        fontSize: 11,
        color: '#666',
    },
    termsDivider: {
        width: '100%',
        height: 1,
        backgroundColor: '#d6d7d6',
        marginTop: 10,
        marginBottom: 10,
    },
    descText: {
        marginTop: 20,
        marginBottom: 20,
        color: '#666',
    },
    txtStringUnderline: {
        textDecorationLine: 'underline', 
        fontWeight: 'bold', 
        color: '#656665',
    },
    descTableSection: {
        flexDirection: 'column',
        width: '100%',
    },
    descTableWrapper: {
        width: '100%',
    },
    descTable: {
        // width: 500,
    },
    descTableRow: {
        flexDirection: 'row',
        width: '100%',
        borderBottomWidth: 1,
        borderColor: '#d7d8d7',
    },
    descTableRowStart: {
        borderTopWidth: 1,
        borderColor: '#d7d8d7',
    },
    descTableCol1: {
        width: 120,
        padding: 7,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f3',
        borderRightWidth: 1,
        borderColor: '#d7d8d7',
    },
    descTableCol2: {
        padding: 7,
        width: 480,
    },
    descTableTitle: {
        fontWeight: 'bold',
    },
    ageButtonSection: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom: 30,
    },
    signupAgeButton: {
        height: 60,
    },
});

export const formStyles = StyleSheet.create({
    inputAndButtonSection: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
    },
    inputSection: {
        flexDirection: 'column',
        width: '100%',
        marginBottom: 10,
    },
    textInput: {
        backgroundColor: '#f3f4f3',
        height: 40,
        padding: 5,
        borderRadius: 5,
        // margin: 0,
    },
    errorMsg: {
        color: 'red',
        marginTop: 5,
        marginBottom: 10,
    },
    buttonGroupContainer: {
        height: 40,
        marginLeft: 10,
        marginRight: 0,
    },
});
export default styles;
