import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { Calendar } from 'react-native-toggle-calendar';
import moment from 'moment';

import CalendarDayComponent from './CalendarDayComponent';
import CalendarHeaderComponent from './CalendarHeaderComponent';
import CalendarFooterComponent from './CalendarFooterComponent';

let selectedCalendarDate = moment();
const minimumDate = moment().add(-1, 'day'); // one day before for midnight check-in usecase
const currentDate = moment();
const startDay =  parseInt(moment().format('DD'));
//console.log(";startDay",startDay);
class CalendarScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedCalendarDateString: selectedCalendarDate.format('YYYY-MM-DD'),
            selectedCalendarMonthString: selectedCalendarDate.format('YYYY-MM-DD'),
            calendarHeaderData: {},
            calendarMarkedDates: {
                '2019-09-01': {
                    fullySoldOut: false,
                    partiallySoldOut: false,
                    fullyBlocked: false,
                    partiallyBlocked: true,
                    inventory: 14,
                    highDemand: false,
                    selected: false
                },
                '2019-10-01': {
                    fullySoldOut: false,
                    partiallySoldOut: false,
                    fullyBlocked: false,
                    partiallyBlocked: true,
                    inventory: 14,
                    highDemand: false,
                    selected: false
                },
                '2019-11-22': {
                    fullySoldOut: false,
                    partiallySoldOut: false,
                    fullyBlocked: false,
                    partiallyBlocked: true,
                    inventory: 14,
                    highDemand: false,
                    selected: false
                }
            },
            horizontal: true,
            ratesInventoryDataArray: [],
            saveButtonClicked: false,
            calendarLoading: true
        };

        this.onPressArrowLeft = this.onPressArrowLeft.bind(this);
        this.onPressArrowRight = this.onPressArrowRight.bind(this);
        this.onPressListView = this.onPressListView.bind(this);
        this.onPressGridView = this.onPressGridView.bind(this);
        this.onDayPress = this.onDayPress.bind(this);
    }

    UNSAFE_componentWillMount() {
        this.setState({calendarLoading: false});

    }

    updateSelectedCalendarMonth(selectedCalendarMonthString) {
        console.log("selectedCalendarMonthString",selectedCalendarMonthString);
        this.setState({
            selectedCalendarMonthString,
            calendarLoading: true
        });
    }

    onDayPress = async (date) => {
        console.log("datedatedate",date);
        selectedCalendarDate = moment(date.dateString);
        const selectedCalendarDateString = selectedCalendarDate.format(
            'YYYY-MM-DD'
        );

        this.setState({
            selectedCalendarDateString,
            selectedCalendarMonthString: selectedCalendarDateString,
            loading : true
        });

        await fetch('https://reactserver.hackers.com:3001/getvacation?rows=50&sdate=' + date.dateString)
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                        ratesInventoryDataArray: responseJson,
                    loading: false
                });
            })
            .catch(error => {
                console.error(error);
                this.setState({
                    ratesInventoryDataArray: [],
                    loading: false
                });
            });

        /*this.fetchDemandData(selectedCalendarDateString);
        this.fetchMultiDaysInventoryData(selectedCalendarDateString);
        this.fetchRatesAndInventoryData(selectedCalendarDateString);*/
    }

    onPressArrowLeft(currentMonth, addMonthCallback) {
        const monthStartDate = moment(currentMonth.getTime()).startOf('month');

        // don't go back for past months
        //if (monthStartDate > currentDate) {
            addMonthCallback(-1);
            const selectedCalendarMonthString = moment(currentMonth.getTime())
                .add(-1, 'month')
                .format('YYYY-MM-DD');
            //console.log("selectedCalendarMonthString",selectedCalendarMonthString);
            this.updateSelectedCalendarMonth(selectedCalendarMonthString);

        //}
        this.setState({calendarLoading: false});
    }

    onPressArrowRight(currentMonth, addMonthCallback) {
        addMonthCallback(1);
        const selectedCalendarMonthString = moment(currentMonth.getTime())
            .add(1, 'month')
            .format('YYYY-MM-DD');
        this.updateSelectedCalendarMonth(selectedCalendarMonthString);
        this.setState({calendarLoading: false});
    }

    onPressListView() {
        this.setState({ horizontal: true });
    }

    onPressGridView() {
        this.setState({ horizontal: false });
    }

    render() {
        return (
            <>
                <StatusBar barStyle="dark-content" />
                <ScrollView>
                    <Calendar
                        current={this.state.selectedCalendarMonthString}
                        minDate={minimumDate.format('YYYY-MM-DD')}
                        dayComponent={CalendarDayComponent}
                        calendarHeaderComponent={CalendarHeaderComponent}
                        //headerData={this.state.calendarHeaderData}
                        style={styles.calendar}
                        onPressArrowLeft={this.onPressArrowLeft}
                        onPressArrowRight={this.onPressArrowRight}
                        onPressListView={this.onPressListView}
                        onPressGridView={this.onPressGridView}
                        markedDates={this.state.calendarMarkedDates}
                        horizontal={this.state.horizontal}
                        onDayPress={this.onDayPress}
                        showPastDatesInHorizontal={1}
                        horizontalEndReachedThreshold={50}
                        horizontalStartReachedThreshold={0}
                        loading={this.state.calendarLoading}
                    />
                    <CalendarFooterComponent calendarDateString={selectedCalendarDate.format('DD MMM, YYYY')} />
                    {
                        this.state.loading ?
                        <ActivityIndicator size="large" />
                         : this.state.ratesInventoryDataArray.length > 0 &&
                        <FlatList
                            style={{ width: '100%',padding : 5 }}
                            keyExtractor={(item, index) => index.toString()}
                            data={this.state.ratesInventoryDataArray}
                            renderItem={({ item, index }) => (
                                <View style={styles.itemContainer} key={index}>
                                    <Text style={styles.text} >
                                        {index+1}
                                        {'_'}
                                        {item.User_Name}
                                        {''}
                                        {item.ChargeName}
                                        {' '}
                                        {'('}
                                        {item.Group_Name}
                                        {') - '}
                                        {item.strType}
                                    </Text>
                                </View>
                            )}
                        />

                    }
                </ScrollView>
            </>
        );
    }
};


const styles = StyleSheet.create({
    gridView: {
        marginTop: 20,
        flex: 1,
    },
    imgBackground: {
        height: '100%'
    },
    itemContainer: {
        justifyContent: 'flex-end',
        borderRadius: 5,
        padding : 10,
        height: 40,
        borderBottomColor: '#ebebeb',
        borderBottomWidth: 1
    },
    itemFlag: {
        position: "absolute",
        top:10,
        right:10
    },
    itemText: {
        position: "absolute",
        bottom:5,
        left:5
    },
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    itemCode: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
    },
    item: {
        padding: 10,
        backgroundColor: '#cccccc',
    },
    separator: {
        height: 0.5,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    text: {
        fontSize: 15,
        color: 'black',
    },
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    loadMoreBtn: {
        padding: 10,
        backgroundColor: '#c375f4',
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
    },
});

export default CalendarScreen;
