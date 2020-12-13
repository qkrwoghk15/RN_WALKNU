import React, { Component, useRef,  useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, FlatList, Dimensions, Button, ScrollView, Image, ImageBackground} from 'react-native';
import { Table, TableWrapper,Col, Cell, Row } from 'react-native-table-component';
import RBSheet from "react-native-raw-bottom-sheet";
import { SearchBar } from 'react-native-elements';
import Popover, { PopoverMode, PopoverPlacement } from 'react-native-popover-view';
import Modal from 'react-native-modal';
import HighlightText from '@sanar/react-native-highlight-text';

import PopMap from '../components/PopMap';
import ModalMap from '../components/ModalMap';
import {convertStrTime} from '../components/functions'

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
// const SCREEN_WIDTH = Dimensions.get("window").width;
// const SCREEN_HEIGHT = Platform.OS === "ios"
//     ? Dimensions.get("window").height
//     : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");
////////////////////////////////////////////////// Modal Button //////////////////////////////////////////////////
const BottomSwipeButton = (props) => {
  const modalizeRef = useRef();
 
  const openPopUp = () => {
    modalizeRef.current?.open();
  }
 
  return (
    <>
      <TouchableOpacity onPress={openPopUp} style={{alignItems: 'center'}}>
        <View style={[styles.modalBtn, {padding: 0, flexDirection: 'row', flexWrap: 'nowrap'}]}>
          <Image
            source={require('../images/search.png')}
            style={{width: 40, height: 40, marginRight:2}}
            resizeMode="contain">
          </Image>
         <Text style={styles.modalBtnText}>과목 검색</Text>
        </View>
      </TouchableOpacity>

      <RBSheet
          ref = {modalizeRef}
          height = {SCREEN_HEIGHT-180-40*5}
          animationType = "slide"
          openDuration= {300}
          closeDuration= {200}

          keyboardAvoidingViewEnabled= {Platform.OS === "ios"}
          customStyles={{
            wrapper: {
              backgroundColor: "transparent",
            },
            draggableIcon: {
              backgroundColor: "#000",
            }
          }}
        >
          <SearchList modalVisible={modalizeRef} enrollArr = {props.enrollArr} addEnrollArr = {props.addEnrollArr}></SearchList>
      </RBSheet>
    </>
  );
}
////////////////////////////////////////////////// Modal Button //////////////////////////////////////////////////

////////////////////////////////////////////////// Modal Screen //////////////////////////////////////////////////
const SearchList = (props) => {
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [depart, setDepart] = useState([]);

  useEffect(() => {
    fetch('http://3.218.74.114/graphql?query={ getSubjectArray {subject} }')
        .then((response)=>response.json())
        .then((responseJson)=>{
          responseJson.data.getSubjectArray.map((value, index) => {
            const str = JSON.stringify(value.subject)
            setDepart(depart.concat((str.substr(1,str.length-3))));
          })
        }).catch((error)=>{
            console.error(error);
        })
  }, []);

  useEffect(() => {
    setFilteredDataSource('');
    fetch(`http://3.218.74.114/graphql?query={ getLectures(subject: "${selectedValue}") { cid, univ, cname, prof, ltime, location } }`)
      .then((response) => response.json())
      .then((responseJson) => {
        setFilteredDataSource(responseJson.data.getLectures);
        setMasterDataSource(responseJson.data.getLectures);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedValue]);

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        const itemData = (item.cid ? JSON.stringify(item.cid).toUpperCase() : '') + 
                        (item.cname ?JSON.stringify(item.cname) : '') +
                        (item.prof ? JSON.stringify(item.prof) : '')
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
          <HighlightText
            highlightStyle={{ backgroundColor: 'yellow' }}
            searchWords={[search]}
            textToHighlight={`${item.cid}\n${item.cname.toUpperCase()}\n${item.prof}`}
          />
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
            props.addEnrollArr(item)
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
              <Text style={modalStyles.pribtnText}>{selectedValue!=''? selectedValue : '전체'}</Text>
            </View>
          </TouchableOpacity>

          <Modal isVisible={isModalVisible}>
            <View style={[modalStyles.textbtn, {alignItems: 'center', marginTop:60}]}>
              <View style={{height: SCREEN_HEIGHT/4, widht: SCREEN_WIDTH/2, marginTop: 60, alignItems:'center', justifyContent:'center'}}>
                <ScrollView>
                  {
                    depart.map((key, index) => (
                      <Text
                        onPress={() => setSelectedValue(key)}
                        style={[modalStyles.textbtn,{textAlign: 'center'}]}
                      >{key}</Text>
                    ))
                  }
                </ScrollView>
              </View>

              <View style={{marginTop: 100}}>
                <Button title="확인" onPress={() => setModalVisible(!isModalVisible)} />
              </View>
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

////////////////////////////////////////////////// Modal Screen //////////////////////////////////////////////////
const removeItem = (item, removeEnrollArr) =>
    // Function for click on an item
    Alert.alert(
        `${item.cname}\n`,
        `삭제하시겠습니까?`,
        [
          { text: "OK", onPress: () => {
            removeEnrollArr(item)
          }},
          {
            text: "Cancel",
            style: "cancel"
          },
        ],
        { cancelable: false }
      );

const Rect=(props) =>{
  const color =['#262626', '#A6A198', '#A69472', '#73654D', '#D9D1C7'
                ,'#665849', '#59524D', '#D8D1C7', '#BEB1A0', '#F5F7F9'
                ,'#739FD9', '#77ABD9', '#ADC5D9', '#3B758C', '#025159'];
  if(props.item.colorNo==null)props.item.colorNo = parseInt(Math.random()*15);
  return(
    <TouchableOpacity 
      activeOpacity = {1,1}
      onPress={() => removeItem(props, props.removeEnrollArr)}
      style={{
        position: 'absolute',
        justifyContent: 'center',
        backgroundColor: color[props.item.colorNo],
        left: 30 + (SCREEN_WIDTH-50)/5*parseInt(props.time.substring(0,1)),
        top: 0 + (40)*parseInt(props.time.substring(1,3)),
        width: (SCREEN_WIDTH-50)/5,
        height: 40*(parseInt(props.time.substring(3,5))-parseInt(props.time.substring(1,3))+1)}}>
      <View>
        <Text style={[styles.subText, {fontWeight: 'bold'}]}>{props.cname}</Text>
        <Text style={styles.subText}>{props.item.location}</Text>
      </View>
    </TouchableOpacity>
  )
}

const EnrollList=(props)=>{
  const lists = props.enrollArr.map(function(list, index){ 
    if(list.strTime.length==5)
      return (
        <Rect time={list.strTime} cname={list.cname} item = {list} removeEnrollArr = {props.removeEnrollArr}></Rect>
      )
    else 
      return (
        <>
          <Rect time={list.strTime.substring(0,5)} cname={list.cname} item = {list} removeEnrollArr = {props.removeEnrollArr}></Rect>
          <Rect time={list.strTime.substring(5,list.strTime.length)} cname={list.cname} item = {list} removeEnrollArr = {props.removeEnrollArr}></Rect>
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
      isToday: props.istoday,
    }
  }

  toggleModal = (visible) => {
    this.setState({isModalVisible: !visible});
  }

  render(){
    return(
      <>
        <TouchableOpacity onPress={() => this.toggleModal(this.state.isModalVisible)}>
          <View style={[styles.btn]}>
            <ImageBackground 
              source={this.state.isToday&&require('../images/today.png')}
              style={{width:'100%', height:'100%', resizeMode: 'concate', justifyContent: 'center'}}>
              <Text style={[styles.btnText, this.state.isToday&&{color: 'white'}]}>{this.state.value}</Text>
            </ImageBackground>
          </View>
        </TouchableOpacity>

        <Modal isVisible={this.state.isModalVisible} style={{marginTop:'80%'}}>
          <ModalMap lat={1/10000} long ={1/10000}></ModalMap>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Button title="확인" onPress={this.toggleModal} />
          </View>
        </Modal>
      </>
    )
  }
}

export default class TimeTable extends Component {
  constructor(props) {
    super(props);

    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
        hours = (hours<10? '0'+hours : hours)
    var min = new Date().getMinutes(); //Current Minutes
        min = (min<10? '0'+min : min)
    var sec = new Date().getSeconds(); //Current Seconds
        sec = (sec<10? '0'+sec : sec)
    var day = new Date().getDay();

    this.state = {
      delay: 1000,
      week: ['일', '월', '화', '수', '목', '금', '토'],
      year: year,
      month: month,
      date: date,
      day: day,
      hours: hours,
      min: min,
      sec: sec,
      
      confirmVisible: false,

      tableHead: ['월', '화', '수', '목', '금'],
      enrollArr: [],
    }
  }

  //////////////////////////////////////////////////// time ////////////////////////////////////////////////////
  componentDidMount() {
    this.interval = setInterval(this.tick, this.state.delay);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  tick = () => {
    const m = parseInt(this.state.min),
          h = parseInt(this.state.hours);
    if((this.state.sec++)==59){
      this.setState({
        sec: 0,
        min: ((m+1) < 10) ? `0${m+1}` : `${m+1}`
      })
      if(m==60){
        this.setState({
          min: '00',
          hours: ((h+1) < 10) ? `0${h+1}` : `${h+1}`
        });
      }
    }
  }
  //////////////////////////////////////////////////// time ////////////////////////////////////////////////////
  addEnrollArr = (item) => {
    this.setState({
      enrollArr: this.state.enrollArr.concat(item)
    })
  }

  removeEnrollArr = (item) => {
    this.setState({
      enrollArr: this.state.enrollArr.filter(sub => sub.cname !== item.cname)
    })
  }

  toggleModal = (isVisible) => {
    this.setState({confirmVisible: !isVisible})
  }

  render() {
    const state = this.state;
    var temp = 8;
    const TimeArr = [],
        heightArr=[];
    for(let i=0; i<27; i+=1){
        TimeArr.push((temp<10? `0${temp}` : `${temp}`) + (!(i%2)? ":00" : ":30"))
        if(i%2) temp += 1
        heightArr.push(40)
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
        <View style={{flex: 1, padding: 10}}>
          <Text style={{color: "white",
                        fontSize: 42,
                        fontWeight: "bold",
                        textAlign: "center",
                        backgroundColor: "#000000a0"}}>{`${state.year}/${state.month}/${state.date}(${state.week[state.day]})`}</Text>
          <Text style={{color: "white",
                        textAlign: "center",
                        fontSize: 21,
                        backgroundColor: "#000000a0"}}>{`${state.hours}시 ${state.min}분`}</Text>
        </View>
        <View style={{flex: 7, padding: 10}}>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              <TableWrapper style={{flexDirection: 'row'}}>
                <Cell data="" style={{width: 30, backgroundColor: '#A6A6A6'}}/>
                <TableWrapper style={{flex: 1, flexDirection: 'row'}}>
                  {
                    state.tableHead.map((value, index) => (
                      <Cell
                        key={index}
                        data={<ElementButton value = {value} istoday={index==(state.day-1)}></ElementButton>}
                        flex={1}
                        style={[styles.header]}
                        textStyle={[styles.text]}
                      />
                    ))
                  }
                </TableWrapper>
              </TableWrapper>
            </Table>

            <ScrollView bounces={false}>
              <Table style={{flexDirection: 'row'}} borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <TableWrapper style={{width: 30}}>
                    <Col data={TimeArr} style={[styles.head]} heightArr={heightArr} textStyle={styles.timeText}></Col>
                </TableWrapper>
                {
                  tableData.map((colData, index) => (
                    <Col
                      key={index}
                      data={colData}
                      heightArr={heightArr}
                      style={[styles.row]}
                      textStyle={styles.text}
                    />
                  ))
                }
              </Table>
            <EnrollList enrollArr = {state.enrollArr} removeEnrollArr = {this.removeEnrollArr}></EnrollList>
          </ScrollView>
        </View>
        
        <View style={{flex: 1, flexDirection:'row', paddingBottom: 50}}>
          <View style={{flex: 1}}></View>

          <View style={{flex: 2, flexDirection:'column-reverse'}}>
            <BottomSwipeButton enrollArr = {state.enrollArr} addEnrollArr = {this.addEnrollArr}></BottomSwipeButton>
          </View>
          
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop:50}}>
            <TouchableOpacity onPress = {()=>this.toggleModal(this.state.confirmVisible)}>
              <View style={{width: 60, alignItems: 'center', justifyContent: 'center', backgroundColor: '#464646', borderRadius: 30,}}>
                <ImageBackground 
                  source={require('../images/next.png')} 
                  style={{width: '100%', height:'100%', resizeMode: 'concate', alignItems:'center'}}>
                  <Text style={{fontSize: 15, color: 'white', padding: 5}}></Text>
                </ImageBackground>
              </View>
            </TouchableOpacity>

            <Modal 
              isVisible={this.state.confirmVisible}
              deviceWidth={SCREEN_WIDTH}
              deviceHeight={SCREEN_HEIGHT}
              style={{backgroundColor: 'white',marginTop: '80%', marginBottom: '80%'}}>
              <View style={{alignItems: 'center'}}>
                <Button title="확인" onPress={this.toggleModal} />
              </View>
            </Modal>
          </View>
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
    width: 170,
    height: 50,
    backgroundColor: '#737373',//f4511e
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40 
  },
  modalBtnText: {
    fontSize: 25,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 12,
    color: 'white',
    flexWrap: 'nowrap',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
    justifyContent: 'center',
  },
  textOnImage: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000a0"
  }
});

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

  pribtn: { width: 70, height: 25, backgroundColor: 'black',  borderRadius: 20 },
  pribtnText: { textAlign: 'center', color: '#fff', lineHeight: 25 },

  popov: { width: SCREEN_WIDTH*4/5, height: SCREEN_HEIGHT/3 , padding: 5},
  textbtn: {fontSize: 30, margin:10, color: 'white'}
});