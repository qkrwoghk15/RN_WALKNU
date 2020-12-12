import React, { Component, useRef,  useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, FlatList, Dimensions, Button, ScrollView} from 'react-native';
import { Table, TableWrapper,Col, Cell, Row } from 'react-native-table-component';
import RBSheet from "react-native-raw-bottom-sheet";
import { SearchBar } from 'react-native-elements';
import Popover, { PopoverMode, PopoverPlacement } from 'react-native-popover-view';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';

import PopMap from '../components/PopMap';
import {convertStrTime} from '../components/functions'

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
var createReactClass = require('create-react-class');
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

      <RBSheet
          ref = {modalizeRef}
          height = {780}
          animationType = "slide"
          closeOnDragDown = {true}
          closeOnPressMask = {true}
          dragFromTopOnly = {true}
          customStyles={{
            wrapper: {
              backgroundColor: "transparent"
            },
            draggableIcon: {
              backgroundColor: "#000"
            }
          }}
        >
          <SearchList modalVisible={modalizeRef}></SearchList>
      </RBSheet>
    </>
  );
}
////////////////////////////////////////////////// Modal Button //////////////////////////////////////////////////

////////////////////////////////////////////////// Modal Screen //////////////////////////////////////////////////
const SearchList = (props) =>{
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [selectedValue, setSelectedValue] = useState("컴퓨터");
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetch(`http://3.218.74.114/graphql?query={ getLectures(str: "${selectedValue}") { cid, univ, cname, prof, ltime } }`)
      .then((response) => response.json())
      .then((responseJson) => {
        setFilteredDataSource(responseJson.data.getLectures);
        setMasterDataSource(responseJson.data.getLectures);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.cid
          ? item.cid.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  const ItemView = ({ item }) => {
    return (
      // Flat List Item
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={modalStyles.itemStyle} onPress={() => getItem(item)}>
          {item.cid}
          {'\n'}
          {item.cname.toUpperCase()}
          {'\n'}
          {item.prof}
        </Text>
        <InfoButton id={item.cid} cname = {item.cname} univ={item.univ}></InfoButton>
      </View>
    );
  };

  const getItem = (item) =>
    // Function for click on an item
    Alert.alert(
        `${item.cname}\n`,
        `${item.ltime}\n수강하시겠습니까?`,
        [
          { text: "OK", onPress: () => {
            convertStrTime(item)
            //EnrollList.upd(item)
            props.modalVisible.current?.close();
          }},
          {
            text: "Cancel",
            style: "cancel"
          },
        ],
        { cancelable: false }
      );

  function InfoButton(props) {
    const touchable = useRef();
    const [showPopover, setShowPopover] = useState(false);
   
    return (
      <>
        <TouchableOpacity ref={touchable} onPress={() => setShowPopover(true)} style={{flex: 1, marginRight: 20}}>
          <View style={modalStyles.btn}>
            <Text style={modalStyles.btnText}>info</Text>
          </View>
        </TouchableOpacity>
        <Popover 
          from={touchable} 
          isVisible={showPopover}
          placement = 'auto'
          onRequestClose={() => setShowPopover(false)}
          >
            <View style={modalStyles.popov}>
              <Text>강의명: {props.cname}</Text>
              <Text>장소: {props.univ}</Text>
              <PopMap lat={1/10000} long ={1/10000}></PopMap>
            </View>
        </Popover>
      </>
    );
  }

  return (
    <View style={{ flex: 1,  backgroundColor: '#A6A6A6'}}>
      <View style={modalStyles.container}>
          <SearchBar
            round
            searchIcon={{ size: 24 }}
            onChangeText={(text) => searchFilterFunction(text)}
            onClear={(text) => searchFilterFunction('')}
            placeholder="과목 검색..."
            value={search}
          />

        <View style={{height:30, flexDirection: 'row', paddingLeft:20, alignItems:'center', borderBottomWidth: 1}}>
          <Text style={{height:30, lineHeight:30}}>학과: </Text>
          <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
            <View style={modalStyles.pribtn}>
              <Text style={modalStyles.pribtnText}>{selectedValue}</Text>
            </View>
          </TouchableOpacity>

          <Modal isVisible={isModalVisible}>
            <View style={{alignItems: 'center'}}>
                <Text onPress={()=>setSelectedValue('컴퓨터')} style={modalStyles.textbtn}>컴퓨터</Text>
                <Text onPress={()=>setSelectedValue('전자')} style={modalStyles.textbtn}>전자</Text>
                <Text onPress={()=>setSelectedValue('전기')} style={modalStyles.textbtn}>전기</Text>
                <Button title="Hide modal" onPress={() => setModalVisible(!isModalVisible)} />
            </View>
          </Modal>
        </View>
          
          <FlatList
            data={filteredDataSource}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}
          />
        </View>
    </View>
  );
};

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A6A6A6',
  },
  itemStyle: {
    flex: 9,
    padding: 10,
  },
  btn: { width: 50, height: 18, backgroundColor: '#78B7BB',  borderRadius: 20 },
  btnText: { textAlign: 'center', color: '#fff' },

  pribtn: { width: 60, height: 25, backgroundColor: 'black',  borderRadius: 20 },
  pribtnText: { textAlign: 'center', color: '#fff', lineHeight: 25 },

  popov: { width: SCREEN_WIDTH*4/5, height: SCREEN_HEIGHT/3 , padding: 5},
  textbtn: {fontSize: 30, margin:10, color: 'white'}
});
////////////////////////////////////////////////// Modal Screen //////////////////////////////////////////////////
const Rect=(props) =>{
  const color =["red","orange","gray","black","blue"];
  const no=parseInt(Math.random()*5); //random(0.0~0.99)
  return(
    <TouchableOpacity 
      activeOpacity = {1,1}
      onPress={() => Alert.alert(props.cname)}
      style={{
        position: 'absolute',
        justifyContent: 'center',
        backgroundColor: color[no],
        left: 35 + (SCREEN_WIDTH-55)/5*parseInt(props.time.substring(0,1)),
        top: 0 + (40)*parseInt(props.time.substring(1,3)),
        width: (SCREEN_WIDTH-55)/5,
        height: 40*(parseInt(props.time.substring(3,5))-parseInt(props.time.substring(1,3))+1)}}>
      <View>
        <Text style={styles.subText}>{props.cname}</Text>
      </View>
    </TouchableOpacity>
  )
}

const EnrollList=()=>{
  const [enrollArr, addEnrollArr] = useState([])

  const lists = enrollArr.map(function(list, index){ 
    if(list.strTime.length==5)
      return (
        <Rect time={list.strTime} cname={list.cname}></Rect>
      )
    else 
      return (
        <>
          <Rect time={list.strTime.substring(0,5)} cname={list.cname}></Rect>
          <Rect time={list.strTime.substring(5,list.strTime.length)} cname={list.cname}></Rect>
        </>
      )
  }.bind(this))

  return (
    <>{lists}</>
  );
}

class ElementButton extends Component{
  constructor(props){
    super();
    this.state ={
      isModalVisible: false,
      value: props.value,
    }
  }

  toggleModal = (visible) => {
    this.setState({isModalVisible: !visible});
  }

  render(){
    return(
      <>
        <TouchableOpacity onPress={() => this.toggleModal(this.state.isModalVisible)}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>{this.state.value}</Text>
          </View>
        </TouchableOpacity>

        <Modal isVisible={this.state.isModalVisible}>
          <View style={{alignItems: 'center'}}>
              <Text>요일</Text>
              <Button title="Hide modal" onPress={this.toggleModal} />
          </View>
        </Modal>
      </>
    )
  }
}

export default class TimeTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: 8,
      heightAry: [],
      tableTime: [],
      tableHead: [<ElementButton value='월'/>, <ElementButton value='화'/>, <ElementButton value='수'/>, <ElementButton value='목'/>, <ElementButton value='금'/>],
    }
  }

  render() {
    const state = this.state;

    for(let i=0; i<27; i+=1){
        this.state.tableTime.push((state.time<10? `0${state.time}` : `${state.time}`) + (!(i%2)? ":00" : ":30"))
        if(i%2) state.time += 1
        state.heightAry.push(40)
    }

    const tableData = [];
    for (let i = 0; i < 5; i += 1) {
      const colData = [];
      for (let j = 0; j < 27; j += 1) {
        colData.push(``);
      }
      tableData.push(colData);
    }

    return (
      <View style={styles.container}>
        <View style={{flex: 7, padding: 10, paddingTop: 30}}>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              <TableWrapper style={{flexDirection: 'row'}}>
                <Cell data="" style={{width: 35, backgroundColor: '#A6A6A6'}}/>
                <TableWrapper style={{flex: 1}}>
                  <Row data={state.tableHead} flex={1} style={styles.header} textStyle={styles.text}/>
                </TableWrapper>
              </TableWrapper>
            </Table>

            <ScrollView bounces={false}>
              <Table style={{flexDirection: 'row'}} borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <TableWrapper style={{width: 35}}>
                    <Col data={state.tableTime} style={[styles.head]} heightArr={state.heightAry} textStyle={styles.timeText}></Col>
                </TableWrapper>
                {
                  tableData.map((colData, index) => (
                    <Col
                      key={index}
                      data={colData}
                      heightArr={state.heightAry}
                      style={[styles.row]}
                      textStyle={styles.text}
                    />
                  ))
                }
              </Table>
              <EnrollList {...this.props}></EnrollList>
            </ScrollView>
        </View>

        <View style={{flex: 1, flexDirection:'column-reverse', paddingBottom: 50}}>
          <BottomSwipeButton></BottomSwipeButton>
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
    backgroundColor: '#404040',
  },
  head: { flex: 1, backgroundColor: '#A6A6A6', alignItems: 'stretch'},
  title: { flex: 1, backgroundColor: '#737373' },
  timeText: { flex: 1, textAlign:'right', fontSize: 8, flexWrap: 'nowrap'},
  text: { textAlign: 'center'},

  btn: { height: 58, backgroundColor: '#A6A6A6', borderRadius: 2 , justifyContent: 'center'},
  btnText: { textAlign: 'center', fontSize: 25, fontWeight: '600', fontFamily: "Cochin" },
  row: {backgroundColor: '#A6A6A6' },

  modalBtn: {
    width: 150,
    height: 50,
    backgroundColor: '#737373',//f4511e
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
  subText: {
    fontSize: 10,
    color: 'white',
    flexWrap: 'nowrap',
    textAlign: 'center',
    textAlignVertical: 'center',
  }
});
