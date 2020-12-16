import * as React from 'react';
import {
  NativeModules,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ImageBackground,
  Image,
  Button,
  Alert,
  Modal
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Navigate from './Navigate';
import TimeTableStack from './TimeTable';
import Cite from '../components/Cite'

import {Stack} from './Home'

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={{flex:1}}></View>
      <View style={styles.box}>
        <ImageBackground source={require('../images/logo2.png')} style={imgStyles.image}>
        </ImageBackground>        
      </View>

      <View style={styles.buttonbox}>
        <View style={imgStyles.container}>
          <TouchableOpacity onPress={() => navigation.navigate('Navigate')} style={{width: '60%', height: '60%'}}>
            <View>
              <ImageBackground source={require('../images/map.png')} style={imgStyles.image} imageStyle={{width: '110%', height:'110%', resizeMode: 'contain'}}>
                <Text style={imgStyles.searchtext}>건물검색</Text>
              </ImageBackground>
              
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={imgStyles.container}>
          <TouchableOpacity onPress={() => navigation.navigate('TimeTable')} style={{width: '60%', height: '60%'}}>
            <View>
              <ImageBackground source={require('../images/table.png')} style={imgStyles.image} imageStyle={{width: '100%', resizeMode: 'contain'}}>
                <Text style={imgStyles.text}>시간표</Text>
              </ImageBackground>
            </View>
          </TouchableOpacity>
        </View>        
      </View>

      <View style={{flex:1}}></View>

      <View style={styles.citebox}>
          <Cite style={styles.citebtn}></Cite>
      </View>
    </View>
  );
}

export default class MainStack extends React.Component {
  constructor(){
    super();
    this.state={
      show:false
    }
  }
  render() {
    return (
        <Stack.Navigator
          headerMode= 'screen'
          screenOptions={{
            headerStyle: {
                backgroundColor: '#8C6C64',
                shadowRadius: 0,
                shadowOffset:{
                  height:0,
                }
            },
            headerTintColor: '#8C6C64',

            headerTitleStyle: {
              color: '#F0EDE4',
              fontWeight: 'bold',
            },
            headerTitle: ' ',
            headerRight: () => (
              <View>
                <TouchableOpacity onPress = {()=>{this.setState({show:true})}}>
                  <View style={{width:40, height: 30, paddingRight:15}}>
                    <ImageBackground 
                      source={require('../images/profile.png')} 
                      style={{width: '100%', height:'100%', alignItems:'center'}}
                      imageStyle={{width: '100%', height:'90%', resizeMode: 'stretch'}}>
                    </ImageBackground>
                  </View>
                </TouchableOpacity>
                <Modal transparent={true} visible={this.state.show}>
                  <View style={{backgroundColor:"#000000aa", flex:1}}>
                    <View style={{backgroundColor: "#ffffff", margin:50, padding:40, borderRadius:10, flex:1}}>
                      <Image source={require('../images/user.png')} style={imgStyles.userImage}></Image>
                      <Text style={styles.idfont}>Geralt</Text>
                      <TouchableOpacity onPress = {()=>{this.setState({show:false})}} style={[styles.btnPad]}>
                        <View>
                          <Text style={styles.btntext}>확인</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>
            ),
        }}>
          <Stack.Screen name="Main" component={HomeScreen}/>
          <Stack.Screen name="Navigate" component={Navigate} options={({route}) => ({headerBackTitle: 'Main', headerTintColor: '#F0EDE4'})}/>
          <Stack.Screen name="TimeTable" component={TimeTableStack} options={({route}) => ({headerBackTitle: 'Main', headerTintColor: '#F0EDE4'})}/>
        </Stack.Navigator>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F0EDE4',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  box: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    height:100,
    marginTop: 120,
    color: 'black',
    textAlign: 'auto',
    fontSize: 70,
    fontFamily: "Cochin",
    fontWeight: "bold",
  },
  buttonbox: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    padding: 0,
  },
  citebox: {
    flex:1,
    paddingRight: 10,
    paddingBottom: 30,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  logo:{
    height:100,
    marginTop: 180,
    fontWeight:"bold",
    fontSize:50,
    color:"#8C6C64",
    marginBottom:40
  },
  idfont:{
    fontWeight:"bold",
    fontSize:40,
    color:"#8C6C64",
    alignSelf: 'center'
  },
  headerButton:{
    backgroundColor: 'black'
  },
  btnPad:{
    backgroundColor: '#8C6C64',
    borderRadius:10,
    borderWidth: 1,
    width: "100%",
    height: "10%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  btntext:{
    fontSize: 20,
    fontWeight: '300',
    color: 'white',
  }
});

const imgStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
    
  },
  userImage: {
    width: '100%',
    height: '50%',
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
    
  },
  searchtext: {
    width: '150%',
    padding: 3,
    color: "white",
    fontSize: 42,
    textAlign: "center",
    backgroundColor: "#000000a0"
  },
  text: {
    width: '140%',
    padding: 3,
    color: "white",
    fontSize: 42,
    textAlign: "center",
    backgroundColor: "#000000a0"
  }
});