import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, Image, PixelRatio} from 'react-native';
import CommonUtil from '../../Utils/CommonUtil';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import {CustomTextR, CustomTextM, CustomTextB, TextRobotoB} from '../../Style/CustomText';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const FilterButtons = props => {
  // props
  // filterSource: 필터 데이터 소스 (array)
  // filterType: 필터 종류 (상품유형, 과목, 유형, 난이도, 선생님, 연도)
  // selectedSource: state에 저장된 선택된 필터 소스 (array)
  // onSelectHandle: 필터 선택 처리 함수
  return (
    <View style={[styles.flexDirRow, styles.filterBtnSection]}>
      {props.filterSource.map((item, key) => {
        let isSelected = false;
        if (Array.isArray(props.selectedSource)) {
          isSelected = (props.selectedSource.indexOf(item.Code) > -1);
        }
        const selected = {FilterType: props.filterType, Code: item.Code};
        return (
          <View style={[styles.flexDirRow, styles.filterBtnContainer]} key={item.Code}>
            <TouchableOpacity
              style={[styles.roundedBtnSmall, isSelected && styles.selectedBtn]}
              key={key}
              onPress={() => props.onSelectHandle(selected)}>
              <CustomTextR style={[styles.btnText, isSelected && styles.selectedBtnText]}>{item.Name}</CustomTextR>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

class MyClassFilterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProductPattern: (props.fromScreen === 'ApplyClassList' ? props.myClassApplyClassFilter.selectedProductPattern : props.myClassProductFilter.selectedProductPattern) || [],
      selectedLevel03: (props.fromScreen === 'ApplyClassList' ? props.myClassApplyClassFilter.selectedLevel03 : props.myClassProductFilter.selectedLevel03) || [],
      selectedLevel04: (props.fromScreen === 'ApplyClassList' ? props.myClassApplyClassFilter.selectedLevel04 : props.myClassProductFilter.selectedLevel04) || [],
      selectedDifficulty: (props.fromScreen === 'ApplyClassList' ? props.myClassApplyClassFilter.selectedDifficulty : props.myClassProductFilter.selectedDifficulty) || [],
      selectedTeacher: (props.fromScreen === 'ApplyClassList' ? props.myClassApplyClassFilter.selectedTeacher : props.myClassProductFilter.selectedTeacher) || [],
      selectedYear: (props.fromScreen === 'ApplyClassList' ? props.myClassApplyClassFilter.selectedYear : props.myClassProductFilter.selectedYear) || [],
      filterTable: CommonUtil.getClassFilter(props.screenState.classList),
      // filterTable: CommonUtil.getClassFilter(this.props.navigation.state.params.classList),
    };
    this.toggleSelect = this.toggleSelect.bind(this);
  }

  toggleSelect = selected => {
    let arrSelected = [];
    let idx = null;
    switch (selected.FilterType) {
      case 'productPattern':
        arrSelected = [];
        idx = this.state.selectedProductPattern !== undefined ? this.state.selectedProductPattern.indexOf(selected.Code) : -1;
        if (idx > -1) {
          arrSelected = [...this.state.selectedProductPattern];
          arrSelected.splice(idx, 1);
        } else {
          arrSelected = this.state.selectedProductPattern !== undefined ? [...this.state.selectedProductPattern, selected.Code] : [selected.Code];
        }
        this.setState({
          selectedProductPattern: arrSelected,
        });
        break;
      case 'level03':
        arrSelected = [];
        idx = this.state.selectedLevel03 !== undefined ? this.state.selectedLevel03.indexOf(selected.Code) : -1;
        if (idx > -1) {
          arrSelected = [...this.state.selectedLevel03];
          arrSelected.splice(idx, 1);
        } else {
          arrSelected = this.state.selectedLevel03 !== undefined ? [...this.state.selectedLevel03, selected.Code] : [selected.Code];
        }
        this.setState({
          selectedLevel03: arrSelected,
        });
        break;
      case 'level04':
        arrSelected = [];
        idx = this.state.selectedLevel04 !== undefined ? this.state.selectedLevel04.indexOf(selected.Code) : -1;
        if (idx > -1) {
          arrSelected = [...this.state.selectedLevel04];
          arrSelected.splice(idx, 1);
        } else {
          arrSelected = this.state.selectedLevel04 !== undefined ? [...this.state.selectedLevel04, selected.Code] : [selected.Code];
        }
        this.setState({
          selectedLevel04: arrSelected,
        });
        break;
      case 'difficulty':
        arrSelected = [];
        idx = this.state.selectedDifficulty !== undefined ? this.state.selectedDifficulty.indexOf(selected.Code) : -1;
        if (idx > -1) {
          arrSelected = [...this.state.selectedDifficulty];
          arrSelected.splice(idx, 1);
        } else {
          arrSelected = this.state.selectedDifficulty !== undefined ? [...this.state.selectedDifficulty, selected.Code] : [selected.Code];
        }
        this.setState({
          selectedDifficulty: arrSelected,
        });
        break;
      case 'teacher':
        arrSelected = [];
        idx = this.state.selectedTeacher !== undefined ? this.state.selectedTeacher.indexOf(selected.Code) : -1;
        if (idx > -1) {
          arrSelected = [...this.state.selectedTeacher];
          arrSelected.splice(idx, 1);
        } else {
          arrSelected = this.state.selectedTeacher !== undefined ? [...this.state.selectedTeacher, selected.Code] : [selected.Code];
        }
        this.setState({
          selectedTeacher: arrSelected,
        });
        break;
      case 'year':
        arrSelected = [];
        idx = this.state.selectedYear !== undefined ? this.state.selectedYear.indexOf(selected.Code) : -1;
        if (idx > -1) {
          arrSelected = [...this.state.selectedYear];
          arrSelected.splice(idx, 1);
        } else {
          arrSelected = this.state.selectedYear !== undefined ? [...this.state.selectedYear, selected.Code] : [selected.Code];
        }
        this.setState({
          selectedYear: arrSelected,
        });
        break;
      default:
        break;
    }
  };

  applyFilter = async () => {
    this.props.fromScreen === 'ApplyClassList'
    ? await this.props.updateMyClassApplyClassFilter(this.state)
    : await this.props.updateMyClassProdcutFilter(this.state);
    this.props.screenState.closeModal();
    // this.props.navigation.goBack(null);
  };

  resetFilter = () => {
    this.setState({
      selectedProductPattern: [],
      selectedLevel03: [],
      selectedLevel04: [],
      selectedDifficulty: [],
      selectedTeacher: [],
      selectedYear: [],
    });
  }

  getSelectedCount = () => {
    return this.state.selectedProductPattern.length
      + this.state.selectedLevel03.length
      + this.state.selectedLevel04.length
      + this.state.selectedDifficulty.length
      + this.state.selectedTeacher.length
      + this.state.selectedYear.length;
  };

  render() {
    return (
      <View style={[styles.container]}>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: PixelRatio.roundToNearestPixel(15), borderBottomColor: '#e8e8e8', borderBottomWidth: 1, marginTop: -16}}>
          <CustomTextR style={{fontSize: PixelRatio.roundToNearestPixel(18), lineHeight: 18 * 1.71, color: '#222222', letterSpacing: -0.9}}>검색필터</CustomTextR>
          <TouchableOpacity onPress={() => this.props.screenState.closeModal()} style={{position: 'absolute', right: 17}}>
            <Image source={require('../../../assets/icons/btn_close_pop.png')} style={{width: 16, height: 16}} />
          </TouchableOpacity>
        </View>
        <ScrollView style={{paddingVertical: 30, paddingHorizontal: 20}}>
          <View style={styles.categoryContainer}>
            {/* 강좌타입 => 상품유형 분류 보류에 따라 사용 안함. */}
            {/* {(this.state.filterTable.productPattern.length > 0) && (
              <View style={styles.categorySection}>
                <View style={styles.categoryTitleSection}>
                  <CustomTextM style={styles.categoryTitle}>강좌타입</CustomTextM>
                </View>
                <FilterButtons
                  filterSource={this.state.filterTable.productPattern}
                  filterType="productPattern"
                  selectedSource={this.state.selectedProductPattern}
                  onSelectHandle={selected => this.toggleSelect(selected)}
                />
              </View>
            )} */}

            {/* 과목 */}
            {(this.state.filterTable.level03.length > 0) && (
              <View style={styles.categorySection}>
                <View style={styles.categoryTitleSection}>
                  <CustomTextM style={styles.categoryTitle}>과목</CustomTextM>
                </View>
                <FilterButtons
                  filterSource={this.state.filterTable.level03}
                  filterType="level03"
                  selectedSource={this.state.selectedLevel03}
                  onSelectHandle={selected => this.toggleSelect(selected)}
                />
              </View>
            )}

            {/* 유형 */}
            {(this.state.filterTable.level04.length > 0) && (
              <View style={styles.categorySection}>
                <View style={styles.categoryTitleSection}>
                  <CustomTextM style={styles.categoryTitle}>유형</CustomTextM>
                </View>
                <FilterButtons
                  filterSource={this.state.filterTable.level04}
                  filterType="level04"
                  selectedSource={this.state.selectedLevel04}
                  onSelectHandle={selected => this.toggleSelect(selected)}
                />
              </View>
            )}

            {/* 난이도 */}
            {(this.state.filterTable.difficulty.length > 0) && (
              <View style={styles.categorySection}>
                <View style={styles.categoryTitleSection}>
                  <CustomTextM style={styles.categoryTitle}>난이도</CustomTextM>
                </View>
                <FilterButtons
                  filterSource={this.state.filterTable.difficulty}
                  filterType="difficulty"
                  selectedSource={this.state.selectedDifficulty}
                  onSelectHandle={selected => this.toggleSelect(selected)}
                />
              </View>
            )}

            {/* 선생님 */}
            {(this.state.filterTable.teachers.length > 0) && (
              <View style={styles.categorySection}>
                <View style={styles.categoryTitleSection}>
                  <CustomTextM style={styles.categoryTitle}>선생님</CustomTextM>
                </View>
                <FilterButtons
                  filterSource={this.state.filterTable.teachers}
                  filterType="teacher"
                  selectedSource={this.state.selectedTeacher}
                  onSelectHandle={selected => this.toggleSelect(selected)}
                />
              </View>
            )}

            {/* 연도 */}
            {(this.state.filterTable.year.length > 0) && (
              <View style={styles.categorySection}>
                <View style={styles.categoryTitleSection}>
                  <CustomTextM style={styles.categoryTitle}>연도</CustomTextM>
                </View>
                <FilterButtons
                  filterSource={this.state.filterTable.year}
                  filterType="year"
                  selectedSource={this.state.selectedYear}
                  onSelectHandle={selected => this.toggleSelect(selected)}
                />
              </View>
            )}
          </View>
        </ScrollView>
        <View style={[styles.flexDirRow, styles.bottomAttachSection]}>
          <TouchableOpacity style={[styles.bottomBtn, styles.bottomLeftBtn]} onPress={() => this.resetFilter()}>
            <CustomTextM style={styles.bottomBtnText}>초기화</CustomTextM>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bottomBtn, styles.bottomRightBtn]}
            onPress={() => this.applyFilter()}>
            <CustomTextM style={styles.bottomBtnText}>적용</CustomTextM>
            <View style={{position: 'absolute', top: 20, left: (SCREEN_WIDTH * 0.25) + 20 , width: 20, height: 20, borderRadius: 20, backgroundColor: '#fff', alignItems:'center', justifyContent: 'center'}}>
              <TextRobotoB style={{color: '#28a5ce'}}>{this.getSelectedCount()}</TextRobotoB>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  font12: {fontSize: 12},
  font14: {fontSize: 14},
  font16: {fontSize: 16},
  flexDirRow: {flexDirection: 'row'},
  flexDirCol: {flexDirection: 'column'},
  spaceWidth5: {width: 5},
  roundedBtnSmall: {
    borderWidth: 1,
    borderColor: '#d8d8d8',
    borderRadius: PixelRatio.roundToNearestPixel(6),
    paddingVertical: PixelRatio.roundToNearestPixel(9),
    paddingHorizontal: PixelRatio.roundToNearestPixel(21),
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryContainer: {},
  categorySection: {
    // marginTop: 10,
    // marginBottom: 10,
  },
  categoryTitleSection: {
    // height: 25,
    // justifyContent: 'center',
    // borderBottomWidth: 1,
    // paddingLeft: 10,
    // paddingRight: 10,
  },
  categoryTitle: {
    color: '#222222',
    fontSize: PixelRatio.roundToNearestPixel(14),
    lineHeight: 14 * 1.42,
    fontWeight: '500',
    letterSpacing: -0.7,
    marginBottom: 10,
  },
  filterBtnSection: {
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  filterBtnContainer: {
    // marginBottom: 10,
    marginRight: 6,
    marginBottom: 10,
  },
  selectedBtn: {
    backgroundColor: '#28a5ce',
  },
  btnText: {
    color: '#888888',
    fontSize: PixelRatio.roundToNearestPixel(14),
    lineHeight: 14 * 1.42,
    letterSpacing: -0.7,
  },
  selectedBtnText: {
    color: '#fff',
  },
  bottomAttachSection: {},
  bottomBtn: {
    // height: SCREEN_HEIGHT * 0.07,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomLeftBtn: {
    flex: 1,
    backgroundColor: '#222222',
    paddingVertical: 19,
  },
  bottomRightBtn: {
    flex: 1,
    backgroundColor: '#28a5ce',
    paddingVertical: 19,
  },
  bottomBtnText: {
    color: '#fff',
    fontSize: PixelRatio.roundToNearestPixel(18),
    lineHeight: 14 * 1.71,
    fontWeight: 'bold',
    letterSpacing: -0.9,
  },
});

const mapStateToProps = state => {
  return {
    myClassProductFilter: state.GlabalStatus.myClassProductFilter,
    myClassApplyClassFilter: state.GlabalStatus.myClassApplyClassFilter,
  };
}


const mapDispatchToProps = dispatch => {
  return {
    updateMyClassProdcutFilter: object => {
      dispatch(ActionCreator.updateMyClassProdcutFilter(object));
    },
    updateMyClassApplyClassFilter: object => {
      dispatch(ActionCreator.updateMyClassApplyClassFilter(object));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(MyClassFilterScreen);