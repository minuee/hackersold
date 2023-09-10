import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, View, Text, } from 'react-native';

import TitleComponent from './TitleComponent';
import ProblemComponent from './ProblemComponent';
import LectureListComponent from './LectureListComponent';

// TODO: 외부에서 파라미터를 받아서 문제 유형에 따라서 분기 처리
// TODO: 문제 풀이 및 정답 화면 분기 처리???????????????????????

const dataRelatedLecture = {
    title: '관련 이론 강의',
    styles: {},
    items: [
        {
            title: '해커스 신토익 READING',
            category: '이론',
            chapter: '11강',
            teacher: '이상길',
            thumbnail: 'https://mchamp.hackers.com/files/lecture/2019/07/4ef60f22731f257d0fd1ba1a53d9e546.jpg',
        },
        {
            title: '해커스 신토익 실전 1000제 3 READING',
            category: '해설',
            chapter: 'TEST1 101번',
            teacher: '주대명',
            thumbnail: 'https://mchamp.hackers.com/files/lecture/2019/11/4cddc48b421c85e725da4c2c4162aa0e.jpg',
        },
    ]
};

const dataOtherLecture = {
    title: '다른 해설 강의',
    styles: {},
    items: [
        {
            title: '해커스 신토익 READING',
            category: '이론',
            chapter: '11강',
            teacher: '이상길',
            thumbnail: 'https://mchamp.hackers.com/files/lecture/2019/07/4ef60f22731f257d0fd1ba1a53d9e546.jpg',
        },
        {
            title: '해커스 신토익 실전 1000제 3 READING',
            category: '해설',
            chapter: 'TEST1 101번',
            teacher: '주대명',
            thumbnail: 'https://mchamp.hackers.com/files/lecture/2019/11/4cddc48b421c85e725da4c2c4162aa0e.jpg',
        },
    ]
};

class MainScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ScrollView>
                <SafeAreaView>
                    <TitleComponent />
                    <ProblemComponent screenProps={this.props.screenProps} />
                    <LectureListComponent data={dataRelatedLecture} />
                    <LectureListComponent data={dataOtherLecture} />
                </SafeAreaView>
            </ScrollView>
        );
    }
};

export default MainScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
    
