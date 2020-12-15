import React, { Component, useRef,  useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, Text, 
  TouchableOpacity,
  Alert, 
  FlatList, 
  Dimensions, 
  Button, 
  ScrollView, 
  Image, ImageBackground, 
  ActivityIndicator, } from 'react-native';
import { Table, TableWrapper,Col, Cell } from 'react-native-table-component';
import RBSheet from "react-native-raw-bottom-sheet";
import { SearchBar } from 'react-native-elements';
import Popover from 'react-native-popover-view';
import Modal from 'react-native-modal';
import HighlightText from '@sanar/react-native-highlight-text';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PopMap from '../components/PopMap';
import ModalMap from '../components/ModalMap';
import {convertStrTime} from '../components/functions'
import MyTabBar from '../components/MyTabBar';

import TimeMap from './TimeMap'

const TimeTableTab = createBottomTabNavigator();
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

const storeData = async (value) => {
  try {
    await AsyncStorage.setItem('@enrollData', value)
  } catch (e) {
    // saving error
  }
}
////////////////////////////////////////////////// Modal Button //////////////////////////////////////////////////
const BottomSwipeButton = (props) => {
  const modalizeRef = useRef();
 
  const openPopUp = () => {
    modalizeRef.current?.open();
  }
 
  return (
    <>
      {/* SearchButton */}
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

      {/* RowBottomModal */}
      <RBSheet
          ref = {modalizeRef}
          height = {SCREEN_HEIGHT-180-40*8}
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
  const [loading, setLoading] = useState(false);
  const [indexing, setIndexing] = useState(0);
  const indexAry=['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const indexCheck=[
    /[가-깋]/,
    /[나-닣]/,
    /[다-딯]/,
    /[라-맇]/,
    /[마-밓]/,
    /[바-빟]/,
    /[사-싷]/,
    /[아-잏]/,
    /[자-짛]/,
    /[차-칳]/,
    /[카-킿]/,
    /[타-팋]/,
    /[파-핗]/,
    /[하-힣]/,
  ]

  //fetch depart List
  useEffect(() => {
    fetch('http://3.218.74.114/graphql?query={ getSubjectArray {subject} }')
        .then((response)=>response.json())
        .then((responseJson)=>{
          setDepart(responseJson.data.getSubjectArray)
        }).catch((error)=>{
            console.error(error);
        })
  }, []);
  
  //fetch search list
  useEffect(() => {
    setLoading(false)
    setFilteredDataSource('');
    fetch(`http://3.218.74.114/graphql?query={ getLectures(subject: "${selectedValue}") { cid, univ, cname, prof, ltime, location, latitude, longitude } }`)
      .then((response) => response.json())
      .then((responseJson) => {
        setFilteredDataSource(responseJson.data.getLectures);
        setMasterDataSource(responseJson.data.getLectures);
        setLoading(true)
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
        <InfoButton id={item.cid} lecture={item}></InfoButton>
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
              <Text>강의명: {props.lecture.cname}</Text>
              <Text>장  소: {props.lecture.location}</Text>
              <PopMap lecture={props.lecture}></PopMap>
            </View>
        </Popover>
      </>
    );
  }

  return (
    <View style={{ flex: 1,  backgroundColor: '#A6A6A6'}}>
      <View style={modalStyles.container}>
          <SearchBar
            lightTheme='light'
            searchIcon={{ size: 24 }}
            onChangeText={(text) => searchFilterFunction(text)}
            onClear={(text) => searchFilterFunction('')}
            placeholder="과목 검색"
            value={search}
          />

        <View style={{height:30, flexDirection: 'row', paddingLeft:20, alignItems:'center', borderBottomWidth: 1}}>
          <Text style={{height:30, lineHeight:30}}>학과: </Text>
          <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
            <View style={modalStyles.pribtn}>
              <Text style={modalStyles.pribtnText}>{selectedValue!=''? selectedValue : '전체'}</Text>
            </View>
          </TouchableOpacity>

          {/* select depart Ary */}
          <Modal isVisible={isModalVisible}>
            <View style={[modalStyles.textbtn, {alignItems: 'center', marginTop:30}]}>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{flexDirection: 'row'}}>
                {
                  indexAry.map((key, i)=>(
                    <TouchableOpacity onPress={() => setIndexing(i)}>
                      <Text
                        style={[modalStyles.indextext, (key==indexAry[indexing])&&{color: 'red', fontSize: 35}]}
                        key={key}
                        >{key}</Text>
                    </TouchableOpacity>
                  ))
                }
              </ScrollView>
              
              <View style={{height: SCREEN_HEIGHT/4, width: SCREEN_WIDTH*0.8, marginTop: 20, alignItems:'center', justifyContent:'center', borderTopWidth:1, borderBottomWidth: 1, borderColor:'white'}}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {
                    depart.map((key, i) => {
                      const str = JSON.stringify(key.subject)
                      if(indexCheck[indexing].test(str.charAt(1))){
                        return(
                          <Text
                          onPress={() => setSelectedValue(key.subject)}
                          style={[modalStyles.textbtn, {textAlign: 'center'}]}
                          key={key.cid}
                          >{key.subject}</Text>
                        )
                      }
                    })
                  }
                </ScrollView>
              </View>

              <View style={{marginTop: 40}}>
                <Button title="확인" onPress={() => setModalVisible(!isModalVisible)} />
              </View>
            </View>
          </Modal>
        </View>

          {!loading ? (
            <View style={{flex:1, alignItems:'center', justifyContent: 'center'}}>
              <ActivityIndicator size="large" color="#404040" style={{marginTop:'30%'}} />
            </View>
          ) : undefined}

          <FlatList
            data={filteredDataSource}
            keyExtractor={(item, index) => item.cid}
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
  const color =['#E56C00', '#0000AA', '#00AAAA', '#A900AA', '#A90000', 
                '#A95300', '#FC0000', '#0000FC', '#007D00', '#6C0071', 
                '#23C52C', '#C52323', '#C523AE', '#005C9D', '#5353FC', 
                '#003E00', '#3E003E', '#C54B23', '#23C589', '#5723C5'];
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
        <Rect time={list.strTime} cname={list.cname} item = {list} removeEnrollArr = {props.removeEnrollArr} ></Rect>
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
              style={{width:'100%', height:'100%', justifyContent: 'center'}}
              imageStyle={{width:'40%', height:'30%', resizeMode: 'contain', left: '32%', top: '70%'}}>
              <Text style={[styles.btnText]}>{this.state.value}</Text>
            </ImageBackground>
          </View>
        </TouchableOpacity>

        <Modal isVisible={this.state.isModalVisible} style={{marginTop:'80%'}}>
          <ModalMap enrollAry = {this.props.enrollAry}></ModalMap>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <TouchableOpacity onPress={this.toggleModal} style={{marginTop:10, marginRight:5}}>
                <Image source={require('../images/X.png')}  style={{resizeMode: 'contain', width: 30, height: 30}} />
              </TouchableOpacity>
            </View>
        </Modal>
      </>
    )
  }
}

class TimeTable extends Component {
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
      message: "저장하시겠습니까?",
    }
  }

  //////////////////////////////////////////////////// time ////////////////////////////////////////////////////
  async componentDidMount() {
    this.interval = setInterval(this.tick, this.state.delay);
    try {
      const jsonValue = await AsyncStorage.getItem('@enrollData')
      if(jsonValue!=null){
        this.setState({enrollArr: JSON.parse(jsonValue)})
      }
    } catch(e) {
        // error reading value
    }
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

  toggleModal(isConfirm){
    if(!this.state.confirmVisible){
      this.setState({
        message: "저장하시겠습니까?",
        confirmVisible: !this.state.confirmVisible
      })
    }
    else{
      if(this.state.message == "저장하시겠습니까?" && isConfirm){
        storeData(JSON.stringify(this.state.enrollArr))
        this.setState({
          message: "저장되었습니다."
        })
      }
      else{
        this.setState({
          confirmVisible: !this.state.confirmVisible,
        })
      }
    }
  }

  render() {
    const state = this.state;
    this.props.navigation.setParam
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
                        backgroundColor: "#8C6C64a0"}}>{`${state.year}/${state.month}/${state.date}(${state.week[state.day]})`}</Text>
          <Text style={{color: "white",
                        textAlign: "center",
                        fontSize: 21,
                        backgroundColor: "#8C6C64a0"}}>{`${state.hours}시 ${state.min}분`}</Text>
        </View>
        <View style={{flex: 7, padding: 10}}>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              <TableWrapper style={{flexDirection: 'row'}}>
                <Cell data="" style={{width: 30, backgroundColor: 'white'}}/>
                <TableWrapper style={{flex: 1, flexDirection: 'row'}}>
                  {
                    state.tableHead.map((value, index) => (
                      <Cell
                        key={index}
                        data={<ElementButton value = {value} istoday={index==(state.day-1)} enrollAry={this.state.enrollArr}></ElementButton>}
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
        
        <View style={{flex: 1, flexDirection:'row', paddingBottom: 25}}>
          <View style={{flex: 1}}></View>

          <View style={{flex: 2, flexDirection:'column-reverse'}}>
            <BottomSwipeButton enrollArr = {state.enrollArr} addEnrollArr = {this.addEnrollArr}></BottomSwipeButton>
          </View>
          
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop:50}}>
            <TouchableOpacity onPress = {()=>this.toggleModal(this.state.confirmVisible)}>
              <View style={{width:100, height: 120, alignItems: 'center', justifyContent: 'center', borderRadius: 30,paddingRight:15}}>
                <ImageBackground 
                  source={require('../images/save.png')} 
                  style={{width: '100%', height:'100%', alignItems:'center'}}
                  imageStyle={{width: '100%', height:'90%', resizeMode: 'stretch'}}>
                </ImageBackground>
              </View>
            </TouchableOpacity>
              
            {/* MyModal */}
            <Modal 
              isVisible={this.state.confirmVisible}
              deviceWidth={SCREEN_WIDTH}
              deviceHeight={SCREEN_HEIGHT}
              style={{backgroundColor: 'white', margin: '10%', marginTop: '85%', marginBottom: '85%'}}>
              <View style={{flex: 1}}>
                <ImageBackground  source={require("../images/modalBack.png")} blurRadius={5} style={MyModalStyles.container}>
                  <View style={MyModalStyles.overlay}>
                    <View style={{height:'94%', justifyContent: 'center', alignItems: 'baseline'}}>
                      <Text style={[MyModalStyles.message, {paddingTop: 40}]}>{`${this.state.message}`}</Text>
                    </View>
                    <View style={{flexDirection: 'row', felx:1, justifyContent: 'space-around'}}>
                      {
                        (this.state.message=="저장하시겠습니까?")&&
                        <TouchableOpacity onPress={()=>this.toggleModal(false)} style={[MyModalStyles.btnPad,{borderEndWidth:1}]}>
                          <View>
                            <Text style={MyModalStyles.btntext}>취소</Text>
                          </View>
                        </TouchableOpacity>
                      }
                      <TouchableOpacity onPress={()=>this.toggleModal(true)} style={[MyModalStyles.btnPad]}>
                        <View>
                          <Text style={MyModalStyles.btntext}>확인</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            </Modal>
          </View>
        </View>
      </View>
    )
  }
}

export default function TimeTableStack(){
  return(
    <TimeTableTab.Navigator tabBar={props=> <MyTabBar {...props} />}>
      <TimeTableTab.Screen name="시간표" component={TimeTable}/>
      <TimeTableTab.Screen name="지도" component={TimeMap}/>
   </TimeTableTab.Navigator>
  )
}
 
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 0,
    backgroundColor: '#F0EDE4',
  },
  head: { flex: 1, backgroundColor: 'white', alignItems: 'stretch'},
  title: { flex: 1, backgroundColor: '#737373' },
  timeText: { flex: 1, textAlign:'right', fontSize: 8, flexWrap: 'nowrap'},
  text: { textAlign: 'center'},

  btn: { height: 58, backgroundColor: 'white', borderRadius: 2 , justifyContent: 'center'},
  btnText: { textAlign: 'center', fontSize: 25, fontWeight: '600', fontFamily: "Cochin" },
  row: {backgroundColor: 'white' },

  modalBtn: {
    width: 170,
    height: 50,
    backgroundColor: '#8C6C64',//f4511e
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40 
  },
  modalBtnText: {
    fontSize: 25,
    textAlign: 'center',
    color: '#E8DDBD',
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
    backgroundColor: '#E1E8EE',
  },
  itemStyle: {
    flex: 9,
    padding: 10,
  },
  btn: { width: 50, height: 18, backgroundColor: '#78B7BB',  borderRadius: 20 },
  btnText: { textAlign: 'center', color: '#fff' },

  pribtn: { width: 100, height: 25, backgroundColor: '#8C6C64',  borderRadius: 20 },
  pribtnText: { textAlign: 'center', color: '#fff', lineHeight: 25 },

  popov: { width: SCREEN_WIDTH*4/5, height: SCREEN_HEIGHT/3 , padding: 5},
  textbtn: {fontSize: 25, margin:10, color: 'white'},

  indextext: {fontSize: 20, color: 'white', margin: 10, textAlign: 'auto'}
});

const MyModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay:{
    // backgroundColor:"#00000070",
    height:"100%",
    width:"100%",
    justifyContent:"center",
    alignItems:"center",
  },
  message:{
    color: 'black',
    fontSize: 28
  },
  btnPad:{
    width: '50%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btntext:{
    fontSize: 20,
    fontWeight: '300',
    color: '#0030B5',
  }
})