//import liraries
import React, { Component } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, FlatList, TextInput, Dimensions, Animated, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import Button from '../../Utils/SCLib/Button';
import TagItem from '../../Utils/SCLib/TagItem';
import utilities from '../../Utils/SCLib/utilities';
import PropTypes from 'prop-types';
import Toast from 'react-native-tiny-toast';
import { a } from '../../Utils/HtmlConvert/HTMLRenderers';
const { height } = Dimensions.get('window');
const INIT_HEIGHT = height * 0.6;
// create a component
class SelectCoupon extends Component {
    static defaultProps = {
        cancelButtonText: 'Cancel',
        selectButtonText: 'Okay',
        searchPlaceHolderText: "Enter a keyword",
        listEmptyTitle: '사용가능한 쿠폰이 없습니다.',
        colorTheme: '#16a45f',
        buttonTextStyle: {},
        buttonStyle: {},
        showSearchBox: true
    }
    state = {
        show: false,
        preSelectedItem: [],
        selectedItem: [],
        data: [],
        keyword: '',
        nowselectedIdx : 0
    }
    animatedHeight = new Animated.Value(INIT_HEIGHT);

    componentDidMount() {
        this.init();
    };

    UNSAFE_componentWillReceiveProps(newProps) {
        this.init(newProps);
    }

    init = async(newProps) => {
        let preSelectedItem = [];
        let { data } = newProps || this.props;
        /*
        console.log('alreadyUsed', alreadyUsed)
        let newData = []
        await data.forEach(function(element,index,array){    
            let isIndexOf = alreadyUsed.findIndex(
                info => info.couponIdx === element.couponIdx
            ); 
            if ( isIndexOf != -1 ) {

            }else{
                newData.push({...element})
            }
        }) 
        console.log('newData', newData)

        */
        await data.map(item => {
            //console.log('item', item)
            //console.log('this.props.selectedIdx', this.props.selectedIdx);
            let selectedIdx = this.props.selectedIdx.length > 0 ? this.props.selectedIdx[0].couponIdx : 0 
            if ( item.checked ||  parseInt(selectedIdx) === parseInt(item.couponIdx) ) {
                preSelectedItem.push(item);
            }
        })
        //console.log('preSelectedItem', preSelectedItem)
        this.setState({ data, preSelectedItem });
        this.setState({
            nowselectedIdx : this.props.selectedIdx.length > 0 ? this.props.selectedIdx[0].couponIdx : 0 
        })
    }

    get dataRender() {
        let { data, keyword } = this.state;
        let listMappingKeyword = [];
        data.map(item => {
            if (utilities.changeAlias(item.couponName).includes(utilities.changeAlias(keyword))) {
                listMappingKeyword.push(item);
            }
        });
        return listMappingKeyword;
    }

    get defaultFont() {
        let { defaultFontName } = this.props;
        return defaultFontName ? { fontFamily: defaultFontName } : {};
    }

    cancelSelection() {
        let { data, preSelectedItem } = this.state;
        console.log('cancelSelection data', data)
        data.map(item => {
            item.checked = false;
            for (let _selectedItem of preSelectedItem) {
                /*
                if (item.couponIdx === _selectedItem.couponIdx) {
                    item.checked = true;
                    break;
                }
                */
            }
        });
        //this.setState({ data, show: false, keyword: '', selectedItem: preSelectedItem });
        this.setState({ data, show: false, keyword: '',  preSelectedItem : [], nowselectedIdx : 0});
    }

    onItemSelected = async(item, isSelectSingle) => {
        await  this.setState({nowselectedIdx : 0})
        let selectedItem = [];
        let { data } = this.state;
        item.checked = !item.checked;
        for (let index in data) {
            if (data[index].couponIdx === item.couponIdx) {
                data[index] = item;
            } else if (isSelectSingle) {
                data[index].checked = false;
            }
        }
        data.map(item => {
            if (item.checked) selectedItem.push(item);
        })
        this.setState({ data, selectedItem });
    }
    keyExtractor = (item, idx) => idx.toString();
    renderItem = ({ item, idx }) => {
        let { colorTheme, isSelectSingle, alreadyUsed,focusProductIdx } = this.props;        
        let selectedIdx = this.state.nowselectedIdx;
       
        console.log('alreadyUsed', alreadyUsed)
        console.log('focusProductIdx', focusProductIdx)
        if ( alreadyUsed.length > 0  ) {
            let isIndexOf = alreadyUsed.findIndex(
                info => info.couponIdx === item.couponIdx && info.productIdx !== focusProductIdx 
            );  
            console.log('isIndexOf' , isIndexOf)
            if (isIndexOf != -1  ) {
                return (
                    <TouchableOpacity
                        key={idx}
                        onPress={() => this.onItemSelected(item, isSelectSingle)}
                        activeOpacity={0.7}
                        style={styles.itemWrapper}>
                        <Text style={[styles.itemText, this.defaultFont]}>
                            [사용중]{item.couponName} {item.couponIdx} 
                        </Text>
                    </TouchableOpacity>
                );
            }else{
                return (
                    <TouchableOpacity
                        key={idx}
                        onPress={() => this.onItemSelected(item, isSelectSingle)}
                        activeOpacity={0.7}
                        style={styles.itemWrapper}>
                        <Text style={[styles.itemText, this.defaultFont]}>
                            {item.couponName} {item.couponIdx}
                        </Text>
                        <Icon style={styles.itemIcon}
                            name={item.checked || parseInt(selectedIdx) === parseInt(item.couponIdx) ? 'check-circle-outline' : 'radiobox-blank'}
                            color={item.checked ||  parseInt(selectedIdx) === parseInt(item.couponIdx)? colorTheme : '#777777'} size={20} />
                    </TouchableOpacity>
                );
            }

        }else {
            return (
                <TouchableOpacity
                    key={idx}
                    onPress={() => this.onItemSelected(item, isSelectSingle)}
                    activeOpacity={0.7}
                    style={styles.itemWrapper}>
                    <Text style={[styles.itemText, this.defaultFont]}>
                        {item.couponName} {item.couponIdx}
                    </Text>
                    <Icon style={styles.itemIcon}
                        name={item.checked || parseInt(selectedIdx) === parseInt(item.couponIdx) ? 'check-circle-outline' : 'radiobox-blank'}
                        color={item.checked ||  parseInt(selectedIdx) === parseInt(item.couponIdx)? colorTheme : '#777777'} size={20} />
                </TouchableOpacity>
            );

        }
        
    }
    renderEmpty = () => {
        let { listEmptyTitle } = this.props;
        return (
            <Text style={[styles.empty, this.defaultFont]}>
                {listEmptyTitle}
            </Text>
        );
    }
    closeModal = () => this.setState({ show: false });
    showModal = () => this.setState({ show: true });

    render() {
        let {
            style, modalStyle, title, onSelect, onRemoveItem, popupTitle, colorTheme,
            isSelectSingle, cancelButtonText, selectButtonText, searchPlaceHolderText,
            selectedTitleStyle, buttonTextStyle, buttonStyle, showSearchBox,selectedIdx
        } = this.props;
        let { show, selectedItem, preSelectedItem } = this.state;
        
        return (
            <TouchableOpacity
                onPress={this.showModal}
                activeOpacity={0.7}
                style={[styles.container, style]}>
                <Modal
                    onBackdropPress={this.closeModal}
                    style={{
                        justifyContent: 'flex-end',
                        margin: 0
                    }}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating
                    isVisible={show}>
                    <Animated.View style={[styles.modalContainer, modalStyle, { height: this.animatedHeight }]}>
                        <View>
                            <Text style={[styles.title, this.defaultFont, { color: colorTheme }]}>
                                {popupTitle || title}
                            </Text>
                        </View>
                        <View style={styles.line} />
                        {
                            showSearchBox
                                ? <TextInput
                                    underlineColorAndroid='transparent'
                                    returnKeyType='done'
                                    style={[styles.inputKeyword, this.defaultFont]}
                                    placeholder={searchPlaceHolderText}
                                    selectionColor={colorTheme}
                                    onChangeText={keyword => this.setState({ keyword })}
                                    onFocus={() => {
                                        Animated.spring(this.animatedHeight, {
                                            toValue: INIT_HEIGHT + (Platform.OS === 'ios' ? height * 0.2 : 0),
                                            friction: 7
                                        }).start();
                                    }}
                                    onBlur={() => {
                                        Animated.spring(this.animatedHeight, {
                                            toValue: INIT_HEIGHT,
                                            friction: 7
                                        }).start();
                                    }}
                                />
                                : null
                        }
                        <FlatList
                            style={styles.listOption}
                            data={this.dataRender || []}
                            keyExtractor={this.keyExtractor}
                            renderItem={this.renderItem}
                            ListEmptyComponent={this.renderEmpty}
                        />

                        <View style={styles.buttonWrapper}>
                            <Button
                                defaultFont={this.defaultFont}
                                onPress={() => {
                                    this.cancelSelection();
                                    this.props.cancelSelection()
                                }}
                                title={cancelButtonText}
                                textColor={colorTheme}
                                backgroundColor='#fff'
                                textStyle={buttonTextStyle}
                                style={[styles.button, buttonStyle, { marginRight: 5, marginLeft: 10, borderWidth: 1, borderColor: colorTheme }]} />
                            <Button
                                defaultFont={this.defaultFont}
                                onPress={() => {
                                    let selectedIds = [], selectedObjectItems = [];
                                    selectedItem.map(item => {
                                        selectedIds.push(item);
                                        selectedObjectItems.push(item);
                                    })
                                    onSelect && onSelect(selectedIds, selectedObjectItems);
                                    this.setState({ show: false, keyword: '', preSelectedItem: selectedItem });
                                    
                                }}
                                title={selectButtonText}
                                backgroundColor={colorTheme}
                                textStyle={buttonTextStyle}
                                style={[styles.button, buttonStyle, { marginLeft: 5, marginRight: 10 }]} />
                        </View>
                    </Animated.View>
                </Modal>
                {
                    preSelectedItem.length > 0
                        ? (
                            isSelectSingle
                                ? 
                                <View style={{flexDirection:'row',flexGrow:1}}>
                                    <Text style={[styles.selectedTitlte, this.defaultFont, selectedTitleStyle]}>{preSelectedItem[0].couponName}, {preSelectedItem[0].couponIdx}</Text>
                                </View>
                                
                                : <View style={styles.tagWrapper}>
                                    {
                                        preSelectedItem.map((tag, index) => {
                                            return (
                                                <TagItem
                                                    key={index}
                                                    onRemoveTag={() => {
                                                        let preSelectedItem = [];
                                                        let selectedIds = [], selectedObjectItems = [];
                                                        let { data } = this.state;
                                                        data.map(item => {
                                                            if (item.couponIdx === tag.couponIdx) {
                                                                item.checked = false;
                                                            }
                                                            if (item.checked ) {
                                                                preSelectedItem.push(item);
                                                                selectedIds.push(item.couponIdx);
                                                                selectedObjectItems.push(item);
                                                            };
                                                        })
                                                        this.setState({ data, preSelectedItem });
                                                        onRemoveItem && onRemoveItem(selectedIds, selectedObjectItems);
                                                    }}
                                                    tagName={tag.name}
                                                    tagSite={tag.site} />
                                            );
                                        })
                                    }
                                </View>
                        )
                        : <Text style={[styles.selectedTitlte, this.defaultFont, selectedTitleStyle]}>{title}</Text>
                }
            </TouchableOpacity>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        width: '100%', minHeight: 45, borderRadius: 2, paddingHorizontal: 16,
        flexDirection: 'row', alignItems: 'center', borderWidth: 1,
        borderColor: '#cacaca', paddingVertical: 4
    },
    modalContainer: {
        paddingTop: 16, backgroundColor: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8
    },
    title: {
        fontSize: 16, marginBottom: 16, width: '100%', textAlign: 'center'
    },
    line: {
        height: 1, width: '100%', backgroundColor: '#cacaca'
    },
    inputKeyword: {
        height: 40, borderRadius: 5, borderWidth: 1, borderColor: '#cacaca',
        paddingLeft: 8, marginHorizontal: 24, marginTop: 16
    },
    buttonWrapper: {
        marginVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
    },
    button: {
        height: 36, flex: 1
    },
    selectedTitlte: {
        fontSize: 14, color: 'gray'
    },
    tagWrapper: {
        flexDirection: 'row', flexWrap: 'wrap'
    },
    listOption: {
        paddingHorizontal: 24,
        paddingTop: 1, marginTop: 16
    },
    itemWrapper: {
        borderBottomWidth: 1, borderBottomColor: '#eaeaea',
        paddingVertical: 12, flexDirection: 'row', alignItems: 'center'
    },
    itemText: {
        fontSize: 16, color: '#333', flex: 1
    },
    itemIcon: {
        width: 30, textAlign: 'right'
    },
    empty: {
        fontSize: 16, color: 'gray', alignSelf: 'center', textAlign: 'center', paddingTop: 16
    }
});

SelectCoupon.propTypes = {
    data: PropTypes.array.isRequired,
    style: PropTypes.object,
    defaultFontName: PropTypes.string,
    selectedTitleStyle: PropTypes.object,
    buttonTextStyle: PropTypes.object,
    buttonStyle: PropTypes.object,
    title: PropTypes.string,
    onSelect: PropTypes.func,
    onRemoveItem: PropTypes.func,
    popupTitle: PropTypes.string,
    colorTheme: PropTypes.string,
    isSelectSingle: PropTypes.bool,
    showSearchBox: PropTypes.bool,
    cancelButtonText: PropTypes.string,
    selectButtonText: PropTypes.string
}

//make this component available to the app
export default SelectCoupon;