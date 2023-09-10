import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Button, FlatList, Image, Alert} from 'react-native';
// import {Image} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationEvents} from 'react-navigation';
import {FlatGrid} from 'react-native-super-grid';
import {ListItem} from 'react-native-elements';
import RNRestart from "react-native-restart";

// redux
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ActionCreator from '../../Ducks/Actions/MainActions';

// style
import MyPageStyles from '../../Styles/MyPageStyle';
import CommonStyles from '../../Styles/CommonStyle';

const IMAGES = [
    'https://previews.123rf.com/images/merggy/merggy1608/merggy160800014/63336261-%EA%B0%80%EC%9D%84-%EC%88%B2-%ED%92%8D%EA%B2%BD%EC%9D%98-%EB%B2%A1%ED%84%B0-%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8-%EB%A0%88%EC%9D%B4-%EC%85%98-%ED%8C%8C%EB%85%B8%EB%9D%BC%EB%A7%88-%EB%B0%B0%EB%84%88.jpg',
    'https://imagescdn.gettyimagesbank.com/500/18/643/438/0/911301878.jpg',
    'https://imagescdn.gettyimagesbank.com/500/18/184/055/0/969563254.jpg',
    'https://imagescdn.gettyimagesbank.com/500/18/184/613/0/968397520.jpg',
];

// 이용권구매/고객센터 메뉴
const MENU_LIST1 = [
    {id: 1, title: '이용권 구매', screen: ''},
    {id: 2, title: '공지사항', screen: ''},
    {id: 3, title: '자주묻는 질문', screen: ''},
    {id: 4, title: '수강생 혜택', screen: ''},
    {id: 5, title: '해커스 인강에 바란다', screen: ''},
];

// 해커스 추천 사이트 메뉴
const MENU_LIST2 = [
    {id: 1, title: '해커스인강', url: ''},
    {id: 2, title: '해커스토익', url: ''},
    {id: 3, title: '해커스어학원', url: ''},
    {id: 4, title: '해커스어톡', url: ''},
    {id: 5, title: '해커스공무원', url: ''},
    {id: 6, title: '해커스편입', url: ''},
    {id: 7, title: '해커스잡', url: ''},
    {id: 8, title: '해커스중국어', url: ''},
    {id: 9, title: '점프해커스', url: ''},
];

const APPICONS = [
    {id: 1, title: '해커스토익', imageRequire: require('../../../assets/images/appIconToeic.png'), url: ''},
    {id: 1, title: '해커스토익보카', imageRequire: require('../../../assets/images/appIconToVoca.png'), url: ''},
    {id: 1, title: '해커스톡', imageRequire: require('../../../assets/images/appIconTalk.png'), url: ''},
    {id: 1, title: '해커스공무원보카', imageRequire: require('../../../assets/images/appIconGoVoca.png'), url: ''},
    {id: 1, title: '해커스텝스', imageRequire: require('../../../assets/images/appIconTeps.png'), url: ''},
    {id: 1, title: '해커스편입', imageRequire: require('../../../assets/images/appIconUt.png'), url: ''},
];

// 리스트 아이템 no data box
const NoDataBox = props => {
    return (
        <View style={MyPageStyles.noDataBox}>
            <Text style={CommonStyles.textCenter}>{props.msg}</Text>
        </View>
    );
}
// 시험일정 리스트 아이템
const ExamScheduleItem = props => {
    const {item, index, pressHandler} = props;
    return (
        <TouchableOpacity
            style={[MyPageStyles.touchableOpacity, MyPageStyles.menuItem, index===0 ? MyPageStyles.menuItemTop : '', MyPageStyles.flexRow, MyPageStyles.flexSB]}
            onPress={() => pressHandler()}>
            <Text style={[MyPageStyles.menuItemTitle, CommonStyles.fontBold]}>{item.title}</Text>
            <Text style={[MyPageStyles.menuItemTitle, MyPageStyles.menuItemRight]}>{item.date}</Text>
        </TouchableOpacity>
    );
};

// 풀이이력 리스트 아이템
const SolveHistoryItem = props => {
    const {item, index, pressHandler} = props;
    return (
        <TouchableOpacity
            style={[MyPageStyles.touchableOpacity, MyPageStyles.menuItem, index===0 ? MyPageStyles.menuItemTop : '', MyPageStyles.flexRow, MyPageStyles.flexSB]}
            onPress={() => pressHandler()}>
            <Text style={[MyPageStyles.menuItemTitle, CommonStyles.fontBold]}>{item.title}</Text>
            <Text style={[MyPageStyles.menuItemTitle, MyPageStyles.menuItemRight]}>최근학습일: {item.date}</Text>
        </TouchableOpacity>
    );
};

// 이용권구매/고객센터 메뉴 리스트 아이템
const MenuListItem = props => {
    const {item, index} = props;
    return (
        <TouchableOpacity style={[MyPageStyles.touchableOpacity, MyPageStyles.menuItem, index===0 ? MyPageStyles.menuItemTop : '']}>
            <Text style={[MyPageStyles.menuItemTitle]}>{item.title}</Text>
        </TouchableOpacity>
    );
};

// 해커스 추천 사이트 리스트 아이템
const SiteListItem = props => {
    const {item, index} = props;
    return (
        <TouchableOpacity style={[MyPageStyles.touchableOpacity, MyPageStyles.menuItem, index%2 === 0 ? MyPageStyles.menuItemLeft: '', (index === 0 || index===1) ? MyPageStyles.menuItemTop: '']}>
            <Text style={[MyPageStyles.menuItemTitle]}>{item.title}</Text>
        </TouchableOpacity>
    );
};

// 해커스 추천 어플 리스트 아이템
const AppListItem = props => {
    const {item, index} = props;
    return (
        <TouchableOpacity style={[MyPageStyles.touchableOpacity, MyPageStyles.appIconItem]}>
            <Image
                style={MyPageStyles.appIconImage}
                source={item.imageRequire}
            />
            <Text
                style={MyPageStyles.appIconTitle}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.title}
            </Text>
        </TouchableOpacity>
    );
};

class MyPageScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            TopUserToken: null,
            userName: null,
            token2: null,
            size: 1,
            // number: store.getState().GlabalStatus.number,
            removeToken: async () => {
                try {
                    const resp = await AsyncStorage.removeItem('userToken');
                    return resp;
                } catch (error) {
                    this.setState({error});
                }
            },
        };
        this.goLoginScreen = this.goLoginScreen.bind(this);
    }

    UNSAFE_componentWillMount() {
        this.loginCheck();
    }

    loginCheck = async () => {
        console.log('loginCheck');
        try {
            const token = await AsyncStorage.getItem('userToken');
            this.setState({TopUserToken: token});
        } catch (e) {
            this.setState({TopUserToken: null});
        }

        try {
            const name = AsyncStorage.getItem('userName');
            this.setState({ userName : name });
        } catch (error) {
            this.setState({ userName :  null });
        }
    };

    goLoginScreen = () => {
        // 부모 네비게이션
        // const parent = this.props.navigation.dangerouslyGetParent();
        // parent.navigate('NavSignInScreen');

        this.props.navigation.navigate('MySignInScreen', {
            onGoBack: () => this.loginCheck(),
        });
    };

    goSignupScreen = () => {
        this.props.navigation.navigate('SignUpScreen01');
    };

    goExamSchedule = () => {
        this.props.navigation.navigate('ExamScheduleScreen');
    };

    goSolveHistory = () => {
        this.props.navigation.navigate('SolveHistoryScreen');
    };

    handlePressLogoutButton = () => {
        Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
            {text: '아니오', onPress: () => {}},
            {
                text: '로그아웃',
                onPress: () => {
                    this.removeToken();
                    // this.state.removeToken();
                    RNRestart.Restart();
                },
            },
        ]);
    };

    removeToken = async () => {
        try {
            AsyncStorage.removeItem('userName');
            const resp = await AsyncStorage.removeItem('userToken');
            return resp;
        } catch (error) {
            this.setState({error});
        }
    };

    render() {
        // pros로 넘겨받은 rootNavigation
        // const rootNavigation = this.props.screenProps.rootNavigation;
        // console.log('rootNavigation : ', rootNavigation);

        return (
            <ScrollView>
                <NavigationEvents onWillFocus={() => this.loginCheck()} />
                <View style={MyPageStyles.mainContainer}>
                    <View style={MyPageStyles.bannerContainer}>
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}>
                            {IMAGES.map((imgUrl, index) => {
                                return (
                                    <Image
                                        source={{uri: imgUrl}}
                                        style={MyPageStyles.banerImage}
                                        PlaceholderContent={<ActivityIndicator />}
                                        key={index}
                                    />
                                );
                            })}
                        </ScrollView>
                    </View>

                    {/* 비 로그인 유저 컨텐츠 */}
                    {!this.state.TopUserToken && (
                        <View
                            style={[
                                MyPageStyles.container,
                                MyPageStyles.flexRow,
                                MyPageStyles.flexSB,
                            ]}>
                            <TouchableOpacity
                                onPress={() => this.goLoginScreen()}
                                style={[
                                    MyPageStyles.touchableOpacity,
                                    MyPageStyles.menuItemLeft,
                                    MyPageStyles.loginMenuItem,
                                ]}>
                                <Text>로그인</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.goSignupScreen()}
                                style={[
                                    MyPageStyles.touchableOpacity,
                                    MyPageStyles.loginMenuItem,
                                ]}>
                                <Text>회원가입</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* 로그인 유저 컨텐츠 */}
                    {this.state.TopUserToken && (
                        <View>
                            {/* 나의 목표 점수 관리 */}
                            <View style={[MyPageStyles.container, CommonStyles.mt5, CommonStyles.mb5]}>
                                <View style={[MyPageStyles.flexRow, MyPageStyles.flexSB]}>
                                    <Text style={[MyPageStyles.txtSubTitle]}>나의 목표 점수 관리</Text>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('TargetScoreScreen')} style={[MyPageStyles.touchableOpacity]}>
                                        <Text style={[MyPageStyles.txtTouchable]}>목표 점수 추가 +</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={MyPageStyles.noDataBox}>
                                    <Text style={CommonStyles.textCenter}>목표 점수를 설정해 주세요.</Text>
                                </View>
                            </View>

                            {/* 시험 일정 */}
                            <View style={[MyPageStyles.container, CommonStyles.mt5, CommonStyles.mb5]}>
                                <Text style={[MyPageStyles.txtSubTitle]}>시험 일정</Text>
                                <View style={MyPageStyles.noDataBox}>
                                    <Text style={CommonStyles.textCenter}>목표 점수를 설정하면 시험일정이 표시됩니다.</Text>
                                </View>
                                <Text>ex)</Text>
                                <FlatList
                                    data={[{id: 1, title: 'TOEIC', date: '2020-01-05'}]}
                                    renderItem={({item, index}) => (
                                        <ExamScheduleItem
                                            index={index}
                                            item={item}
                                            pressHandler={this.goExamSchedule}
                                        />
                                    )}
                                    keyExtractor={item => item.id}
                                    ListEmptyComponent={<NoDataBox msg="목표 점수를 설정하면 시험일정이 표시됩니다." />}
                                />
                            </View>

                            {/* 풀이 이력 */}
                            <View style={[MyPageStyles.container, CommonStyles.mt5, CommonStyles.mb5]}>
                                <Text style={[MyPageStyles.txtSubTitle]}>풀이 이력</Text>
                                <View style={MyPageStyles.noDataBox}>
                                    <Text style={CommonStyles.textCenter}>최근 학습한 이력이 없습니다.</Text>
                                </View>
                                <Text>ex)</Text>
                                <FlatList
                                    data={[{id: 1, title: 'TOEIC', date: '2020-01-05'}]}
                                    renderItem={({item, index}) => (
                                        <SolveHistoryItem
                                            index={index}
                                            item={item}
                                            pressHandler={this.goSolveHistory}
                                        />
                                    )}
                                    keyExtractor={item => item.id}
                                    ListEmptyComponent={<NoDataBox msg="최근 학습한 이력이 없습니다." />}
                                />
                            </View>
                        </View>
                    )}

                    {/* 이용권 구매 | 고객센터 */}
                    <View style={[MyPageStyles.container, CommonStyles.mt5, CommonStyles.mb5]}>
                        <Text style={[MyPageStyles.txtSubTitle]}>이용권구매 | 고객센터</Text>
                        <FlatList
                            data={MENU_LIST1}
                            renderItem={({item, index}) => (
                                <MenuListItem index={index} item={item} />
                            )}
                            keyExtractor={item => item.id}
                        />
                    </View>

                    {/* 해커스 추천 사이트 */}
                    <View style={[MyPageStyles.container, CommonStyles.mt5, CommonStyles.mb5]}>
                        <Text style={[MyPageStyles.txtSubTitle]}>해커스 추천 사이트</Text>
                        <FlatGrid
                            itemDimension={170}
                            items={MENU_LIST2}
                            // style={{padding: 0, borderWidth: 1, margin: 0, backgroundColor: 'yellow'}}
                            // itemContainerStyle={{padding: 0, margin: 0, backgroundColor: 'green'}}
                            spacing={0}
                            renderItem={({item, index}) => (
                                <SiteListItem index={index} item={item} />
                            )}
                        />
                    </View>

                    {/* 해커스 추천 어플 */}
                    {/* <View style={[CommonStyles.mt5, CommonStyles.mb5]}> */}
                    <View>
                        {/* <Text style={[MyPageStyles.txtSubTitle]}>해커스 추천 어플</Text> */}
                        <Text>해커스 추천 어플</Text>
                        <FlatGrid
                            itemDimension={80}
                            items={APPICONS}
                            // style={{padding: 0, borderWidth: 1, margin: 0, backgroundColor: 'yellow'}}
                            itemContainerStyle={{paddingTop: 10, marginBottom: 20}}
                            spacing={10}
                            renderItem={({item, index}) => (
                                <AppListItem index={index} item={item} />
                            )}
                        />
                    </View>

                    <Button
                        onPress={() => this.props.addNumPress(this.state.size)}
                        title="redux store test"
                    />

                    <Text style={{width: '100%',height: 100,textAlign: 'center',fontSize: 18,}}>
                        Size: {this.state.size}
                    </Text>
                    <Text style={{width: '100%',height: 100,textAlign: 'center',fontSize: 18,}}>
                        Number: {this.props.number}
                    </Text>
                </View>

                {this.state.TopUserToken && (
                    <View>
                        <TouchableOpacity
                            style={[MyPageStyles.logoutButton]}
                            onPress={() => this.handlePressLogoutButton()}>
                            <Text>로그아웃</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        );
    }
}

function mapStateToProps(state) {
    console.log(state);
    return {
        number: state.GlabalStatus.number,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        addNumPress: num => {
            dispatch(ActionCreator.addNumber(num));
        },
    };
}

MyPageScreen.propTypes = {
    number: PropTypes.number,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MyPageScreen);
// export default MyPageScreen;
