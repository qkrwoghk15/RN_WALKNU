import React, { Component, useRef,  useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, FlatList} from 'react-native';
import { Table, TableWrapper,Col, Cols, Cell, Row, Rows } from 'react-native-table-component';
import BottomSheet from "react-native-swipeable-bottom-sheet"
import RBSheet from "react-native-raw-bottom-sheet";
import { SearchBar } from 'react-native-elements';

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
      <Text style={searchstyles.itemStyle} onPress={() => getItem(item)}>
        {item.id}
        {'.'}
        {item.title.toUpperCase()}
      </Text>
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
    alert('Id : ' + item.id + ' Title : ' + item.title);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={searchstyles.container}>
        <SearchBar
          round
          searchIcon={{ size: 24 }}
          onChangeText={(text) => searchFilterFunction(text)}
          onClear={(text) => searchFilterFunction('')}
          placeholder="Type Here..."
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

const searchstyles = StyleSheet.create({
  container: {
    backgroundColor: '#A6A6A6',
  },
  itemStyle: {
    padding: 10,
  },
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
            animationType = "fade"
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

    const bgcolor = (num) =>{
      if (num == 60) return '#404040'
      else return 'white'
    }
 
    this.state = {
      tableTime: [['9:00-'], ['10:30-'], ['12:00-'], ['13:30-'], ['15:00-'], ['16:30-'], ['18:00-']],
      tableHead: [elementButton('Mon'), elementButton('Tue'), elementButton('Wed'), elementButton('Thu'), elementButton('Fri')],
    }
  }
 
  _alertIndex(value) {
    Alert.alert(`This is column ${value}`);
  }
  
  render() {
    const state = this.state;
    const tableData = [];
    for (let i = 0; i < 7; i += 1) {
      const rowData = [];
      for (let j = 0; j < 5; j += 1) {
        rowData.push(`${i}${j}`);
      }
      tableData.push(rowData);
    }

    return (
      <View style={styles.container}>
        <View style={{flex: 2, padding: 10, paddingTop: 30, flexDirection: 'row', alignItems:'flex-start'}}>
          <Table style={{flexDirection: 'row'}} borderStyle={{borderWidth: 1}}>
            <TableWrapper style={{width: 80}}>
              <Cell data="" style={styles.singleHead}/>
              <TableWrapper style={{flexDirection: 'row'}}>
                <Col data={['AM', 'PM']} style={styles.head} heightArr={[80, 200]} textStyle={styles.btnText} />
                <Col data={state.tableTime} style={[styles.head]} heightArr={[40, 40, 40, 40, 40, 40, 40, 40]} textStyle={styles.timeText}></Col>
              </TableWrapper>
            </TableWrapper>

            <TableWrapper style={{flex:1, backgroundColor: '#404040'}}>
              <Row data={state.tableHead} flex={1} height={60} style={styles.head} textStyle={styles.text} />
              {
                tableData.map((rowData, index) => (
                  <Row
                    key={index}
                    data={rowData}
                    flex={1}
                    height={40}
                    style={[styles.row, index%2 && {backgroundColor: '#A6A6A6'}]}
                    textStyle={styles.text}
                  />
                ))
              }
            </TableWrapper>
          </Table>
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
  singleHead: { width: 80, height: 60, backgroundColor: '#A6A6A6' },
  head: { backgroundColor: '#A6A6A6' },
  title: { backgroundColor: '#737373' },
  timeText: { marginRight: 6, textAlign:'right', fontSize: 10 },
  text: { textAlign: 'center'},
  btn: { height: 58, backgroundColor: '#737373', borderRadius: 2 },
  btnText: { textAlign: 'center', fontSize: 25, fontWeight: '600', fontFamily: "Cochin" },
  row: {backgroundColor: '#737373' },

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
