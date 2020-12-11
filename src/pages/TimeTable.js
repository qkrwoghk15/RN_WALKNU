import React, { Component, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert,  AppRegistry, StatusBar,} from 'react-native';
import { Table, TableWrapper,Col, Cols, Cell } from 'react-native-table-component';
import * as Animatable from 'react-native-animatable';
import styled from 'styled-components'
import BottomSheet from "react-native-swipeable-bottom-sheet"

import axios from 'axios';

import demoList from '../components/data.js'
import SearchList, { HighlightableText } from '../library'
import Touchable from '../library/utils/Touchable'

////////////////////////////////////////////////// Modal Screen //////////////////////////////////////////////////
const rowHeight = 40
class Search extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dataSource: demoList
    }
  }

  // custom render row
  renderRow (item, sectionID, rowID, highlightRowFunc, isSearching) {
    return (
      <Touchable onPress={() => {
        Alert.alert('Clicked!', `sectionID: ${sectionID}; item: ${item.searchStr}`,
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: true})
      }}>
        <View key={rowID} style={{flex: 1, marginLeft: 20, height: rowHeight, justifyContent: 'center'}}>
          {/*use `HighlightableText` to highlight the search result*/}
          <HighlightableText
            matcher={item.matcher}
            text={item.searchStr}
            textColor={'#000'}
            hightlightTextColor={'#0069c0'}
          />
        </View>
      </Touchable>
    )
  }

  // render empty view when datasource is empty
  renderEmpty () {
    return (
      <View style={searchstyles.emptyDataSource}>
        <Text style={{color: '#979797', fontSize: 18, paddingTop: 20}}> No Content </Text>
      </View>
    )
  }

  // render empty result view when search result is empty
  renderEmptyResult (searchStr) {
    return (
      <View style={searchstyles.emptySearchResult}>
        <Text style={{color: '#979797', fontSize: 18, paddingTop: 20}}> No Result For <Text
          style={{color: '#171a23', fontSize: 18}}>{searchStr}</Text></Text>
        <Text style={{color: '#979797', fontSize: 18, alignItems: 'center', paddingTop: 10}}>Please search again</Text>
      </View>
    )
  }

  render () {
    return (
      <View style={searchstyles.container}>
        <StatusBar backgroundColor='#F00' barStyle='light-content' />
        <SearchList
          data={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          renderEmptyResult={this.renderEmptyResult.bind(this)}
          renderBackButton={() => null}
          renderEmpty={this.renderEmpty.bind(this)}

          rowHeight={rowHeight}

          toolbarBackgroundColor={'#2196f3'}
          title='Search List Demo'
          cancelTitle='取消'
          onClickBack={() => {}}

          searchListBackgroundColor={'#2196f3'}

          searchBarToggleDuration={300}

          searchInputBackgroundColor={'#0069c0'}
          searchInputBackgroundColorActive={'#6ec6ff'}
          searchInputPlaceholderColor={'#FFF'}
          searchInputTextColor={'#FFF'}
          searchInputTextColorActive={'#000'}
          searchInputPlaceholder='Search'
          sectionIndexTextColor={'#6ec6ff'}
          searchBarBackgroundColor={'#2196f3'}
        />
      </View>
    )
  }
}

const searchstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  emptyDataSource: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: 50
  },
  emptySearchResult: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: 50
  }
})

////////////////////////////////////////////////// Modal Screen //////////////////////////////////////////////////

////////////////////////////////////////////////// Modal Button //////////////////////////////////////////////////
const BottomSwipeButton = () => {
  const modalizeRef = useRef();
 
  const openPopUp = () => {
    modalizeRef.current?.open();
  }
 
  return (
    <>
      <TouchableOpacity onPress={openPopUp} style={{alignItems: 'center'}}>
        <View style={styles.modalBtn}>
         <Text style={styles.modalBtnText}>과목 검색</Text>
        </View>
      </TouchableOpacity>

      <BottomSheet
            ref = {modalizeRef}
            height = {700}
            closeOnDragDown = {true}
            closeOnPressMask = {true}
            topBarStyle = {styles.topBarStyle}
            backDropStyle = {{elevation:5}}
            sheetStyle = {{borderRadius:10}}
        >
          <Search></Search>
      </BottomSheet>
    </>
  );
}
////////////////////////////////////////////////// Modal Button //////////////////////////////////////////////////

export default class Navigate extends Component {
  constructor(props) {
    super(props);
    const elementButton = (value) => (
      <TouchableOpacity onPress={() => this._alertIndex(value)}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>{value}</Text>
        </View>
      </TouchableOpacity>
    );
 
    this.state = {
      tableTitle: ['9:00-', '10:30-', '12:00-', '13:30-', '15:00-', '16:30-', '18:00-'],
      tableData: [
        [elementButton('Mon'), 'a', 'b', 'c', 'd','a', 'b', 'c'],
        [elementButton('Tue'), '1', '2', '3', '4','a', 'b', 'c'],
        [elementButton('Wed'), 'a', 'b', 'c', 'd','a', 'b', 'c'],
        [elementButton('Thu'), 'a', 'b', 'c', 'd','a', 'b', 'c'],
        [elementButton('Fri'), 'a', 'b', 'c', 'd','a', 'b', 'c']
      ]
    }
  }
 
  _alertIndex(value) {
    Alert.alert(`This is column ${value}`);
  }
 
  render() {
    const state = this.state;
    return (
      <View style={styles.container}>
        <View style={{flex: 2, padding: 10, paddingTop: 30, flexDirection: 'row', alignItems:'flex-start'}}>
          <Table style={{flexDirection: 'row'}} borderStyle={{borderWidth: 1}}>
            <TableWrapper style={{width: 80}}>
              <Cell data="" style={styles.singleHead}/>
              <TableWrapper style={{flexDirection: 'row'}}>
                <Col data={['AM', 'PM']} style={styles.head} heightArr={[160, 120]} textStyle={styles.text} />
                <Col data={state.tableTitle} style={styles.title} heightArr={[40, 40, 40, 40, 40, 40, 40, 40]} textStyle={styles.titleText}></Col>
              </TableWrapper>
            </TableWrapper>

            <TableWrapper style={{flex:1, backgroundColor:'white'}}>
              <Cols data={state.tableData} heightArr={[60, 40, 40, 40, 40, 40, 40, 40, 40]} textStyle={styles.text}/>
            </TableWrapper>
          </Table>
        </View>

        <View style={{flex: 1, flexDirection:'column-reverse', paddingBottom: 50}}>
          <BottomSwipeButton style={{}}></BottomSwipeButton>
        </View>
      </View>
    )
  }
}
 
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 0,
    backgroundColor: 'lightgray',
  },
  singleHead: { width: 80, height: 60, backgroundColor: '#c8e1ff' },
  head: { flex: 1, backgroundColor: '#c8e1ff' },
  title: { flex: 2, backgroundColor: '#f6f8fa' },
  titleText: { marginRight: 6, textAlign:'right' },
  text: { textAlign: 'center' },
  btn: { width: 29, height: 20, marginLeft: 15, backgroundColor: '#c8e1ff', borderRadius: 2 },
  btnText: { textAlign: 'center' },

  myModal: {
    flex: 1,
    backgroundColor: '#005252',
    //alignItems: 'flex-end',
  },
  modalBtn: {
    width: 150,
    height: 50,
    backgroundColor: '#f4511e',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40 
  },
  modalBtnText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  topBarStyle : {
    width : 50,
    height : 5,
    borderRadius : 2.5,
    backgroundColor : "#000000"
  }
});
