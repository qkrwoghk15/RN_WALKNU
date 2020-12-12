import React, { Component, useRef,  useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, FlatList, Dimensions, Button, ScrollView} from 'react-native';
import { Table, TableWrapper,Col, Cols, Cell, Row, Rows } from 'react-native-table-component';
import RBSheet from "react-native-raw-bottom-sheet";
import { SearchBar } from 'react-native-elements';
import Popover, { PopoverMode, PopoverPlacement } from 'react-native-popover-view';
import Modal from 'react-native-modal';

import PopMap from '../components/PopMap';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
////////////////////////////////////////////////// Modal Screen //////////////////////////////////////////////////
const SearchList = () =>{
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => response.json())
      .then((responseJson) => {
        setFilteredDataSource(responseJson);
        setMasterDataSource(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  
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
              <Text>{props.content}</Text>
              <PopMap lat={props.id/10000} long ={props.id/10000}></PopMap>
            </View>
        </Popover>
      </>
    );
  }

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.title
          ? item.title.toUpperCase()
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

  const ItemView = ({ item }) => {
    return (
      // Flat List Item
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={modalStyles.itemStyle} onPress={() => getItem(item)}>
          {item.id}
          {'.'}
          {item.title.toUpperCase()}
        </Text>
        <InfoButton id={item.id} content={item.title}></InfoButton>
      </View>
    );
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

  const getItem = (item) => {
    // Function for click on an item
    Alert.alert('Id : ' + item.id + ' Title : ' + item.title + '를 선택하시겠습니까?');
  };

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
    backgroundColor: '#A6A6A6',
  },
  itemStyle: {
    flex: 9,
    padding: 10,
  },
  btn: { width: 50, height: 18, backgroundColor: '#78B7BB',  borderRadius: 20 },
  btnText: { textAlign: 'center', color: '#fff' },
  popov: { width: SCREEN_WIDTH*4/5, height: SCREEN_HEIGHT/3 , padding: 5}
});
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
          <SearchList></SearchList>
      </RBSheet>
    </>
  );
}
////////////////////////////////////////////////// Modal Button //////////////////////////////////////////////////
class ElementButton extends Component{
  constructor(props){
    super();
    this.state ={
      isModalVisible: false,
      value: props.value,
    }
  }

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  }

  render(){
    return(
      <>
        <TouchableOpacity onPress={() => this.toggleModal}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>{this.state.value}</Text>
          </View>
        </TouchableOpacity>

        <Modal isVisible={this.state.isModalVisible}>
          <View>
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
      tableTime: [['8:00'], ['8:30'], ['09:00'], ['09:30'], ['10:00'], ['10:30'], ['11:00'], ['11:30'], ['12:00'], ['12:30'], ['13:00']],
      tableHead: [<ElementButton value='월'/>, <ElementButton value='화'/>, <ElementButton value='수'/>, <ElementButton value='목'/>, <ElementButton value='금'/>],
    }
  }
  
  render() {
    const state = this.state;

    for(let i=0; i<28; i+=1){
        var time = 8, min = 00;
        this.state.tableTime.push(`${time<10? `0${time}` : `{time}`}:${min}`)
    }

    const tableData = [];
    for (let i = 0; i < 5; i += 1) {
      const colData = [];
      colData.push(state.tableHead[i]);
      for (let j = 0; j < 7; j += 1) {
        colData.push(`${i}${j}`);
      }
      tableData.push(colData);
    }

    return (
      <View style={styles.container}>
        <ScrollView vertical={true}>
          <View style={{flex: 9, padding: 10, paddingTop: 30, flexDirection: 'row', alignItems:'flex-start'}}>
            <Table style={{flexDirection: 'row'}} borderStyle={{borderWidth: 1}}>
              <TableWrapper style={{width: 40}}>
                <Cell data="" style={styles.singleHead}/>
                <TableWrapper style={{flexDirection: 'row'}}>
                  <Col data={state.tableTime} style={[styles.head]} heightArr={[60, 60, 60, 60, 60, 60, 60, 60]} textStyle={styles.timeText}></Col>
                </TableWrapper>
              </TableWrapper>

              <TableWrapper style={{flex:1, flexDirection: 'row', backgroundColor: '#404040'}}>
                {
                  tableData.map((colData, index) => (
                    <Col
                      key={index}
                      data={colData}
                      flex={1}
                      height={60}
                      style={[styles.row]}
                      textStyle={styles.text}
                    />
                  ))
                }
              </TableWrapper>
            </Table>
          </View>
        </ScrollView>

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
  singleHead: { width: 40, height: 60, backgroundColor: '#A6A6A6' },
  head: { backgroundColor: '#A6A6A6' },
  title: { backgroundColor: '#737373' },
  timeText: { marginRight: 6, textAlign:'center', fontSize: 8, flexWrap: 'nowrap' },
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
});
