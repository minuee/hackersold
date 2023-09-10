import React, { Component } from 'react';
import { StyleSheet, View, Text,TouchableOpacity  } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { Flag } from 'react-native-svg-flagkit'

import TextToSpeech from './TextToSpeech';

export default class GridHomeScreen extends Component {
    constructor() {
        super();
    }

    moveDetail = (slanguage,sname,vcode) => {
        this.props.navigation.navigate('TextToSpeech' ,
            {
                slanguage : slanguage,
                voicecode : vcode,
                sname : sname
            }
            );
    }


    render() {
        const items = [
            { name: '한국어', code: '#1abc9c',flag :"KR" ,langcode :"ko-KR",voicecode :"ko-KR" },
            { name: '영어(미국식)', code: '#2ecc71',flag :"US",langcode :"en-US",voicecode :"en-US" },
            { name: '영어(영국식)', code: '#3498db',flag :"GB" ,langcode :"en-GB",voicecode :"en-GB" },
            { name: '일본어', code: '#9b59b6',flag :"JP" ,langcode :"ja-JP",voicecode :"ja-JP"},
            { name: '중국어(북경어)', code: '#34495e' ,flag :"CN",langcode :"zh-CN",voicecode :"zh"},
            { name: '중국어(광동어)', code: '#16a085' ,flag :"HK",langcode :"zh-HK",voicecode :"zh"},
            { name: '프랑스어', code: '#27ae60' ,flag :"FR",langcode :"fr-FR",voicecode :"fr-FR"},
            { name: '독일어', code: '#2980b9' ,flag :"DE",langcode :"de-DE",voicecode :"de-DE"},
            { name: '스페인어', code: '#e74c3c',flag : 'ES' ,langcode :"es-ES",voicecode :"es-ES"},
            { name: '외계어', code: '#bdc3c7' ,flag :"CY",langcode :"ko-KR",voicecode :"ko-KR"},
            /*{ name: 'SUN FLOWER', code: '#f1c40f' }, { name: 'CARROT', code: '#e67e22' },
            { name: 'ALIZARIN', code: '#e74c3c' }, { name: 'CLOUDS', code: '#ecf0f1' },
            { name: 'CONCRETE', code: '#95a5a6' }, { name: 'ORANGE', code: '#f39c12' },
            { name: 'PUMPKIN', code: '#d35400' }, { name: 'POMEGRANATE', code: '#c0392b' },
            { name: 'SILVER', code: '#bdc3c7' }, { name: 'ASBESTOS', code: '#7f8c8d' },*/
        ];

        return (
            <FlatGrid
                itemDimension={130}
                items={items}
                style={styles.gridView}
                // staticDimension={300}
                // fixed
                // spacing={20}
                renderItem={({ item, index }) => (
                    <TouchableOpacity key={item.flag}  onPress= {()=> this.moveDetail(item.langcode,item.name,item.voicecode)}>
                        <View style={[styles.itemContainer, { backgroundColor: item.code }]} >
                            <View style={styles.itemFlag}>
                                <Flag id={item.flag} width={30} height={20} />
                            </View>
                            <Text style={styles.itemName}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        );
    }
}

const styles = StyleSheet.create({
    gridView: {
        marginTop: 20,
        flex: 1,
    },
    itemContainer: {
        justifyContent: 'flex-end',
        borderRadius: 5,
        padding: 10,
        height: 100,
    },
    itemFlag: {
        position: "absolute",
        top:10,
        right:10
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
});
