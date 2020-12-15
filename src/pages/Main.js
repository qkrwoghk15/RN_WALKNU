import * as React from 'react';
import {
  NativeModules,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ImageBackground,
  Image,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Navigate from './Navigate';
import TimeTableStack from './TimeTable';
import Cite from '../components/Cite'

import {Stack} from './SignIn'

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={{flex:1}}></View>
      <View style={styles.box}>
        <ImageBackground source={require('../images/logo.png')} style={imgStyles.image}>
          <Text style={styles.title}> WALKNU </Text>
        </ImageBackground>        
      </View>

      <View style={styles.buttonbox}>
        <View style={imgStyles.container}>
          <TouchableOpacity onPress={() => navigation.navigate('Navigate')} style={{width: '60%', height: '60%'}}>
            <View>
              <ImageBackground source={require('../images/map.png')} style={[imgStyles.image, {width: '120%'}]}>
                <Text style={[imgStyles.text, {width: '120%'}]}>길찾기</Text>
              </ImageBackground>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={imgStyles.container}>
          <TouchableOpacity onPress={() => navigation.navigate('TimeTable')} style={{width: '60%', height: '60%'}}>
            <View>
              <ImageBackground source={require('../images/table.png')} style={imgStyles.image}>
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
  render() {
    return (
        <Stack.Navigator
          headerMode= 'screen'
          screenOptions={{
            headerStyle: {
                backgroundColor: '#404040',
                borderBottomColor: '#404040',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitle: ' ',
            headerBackTitle: ' ',
        }}>
          <Stack.Screen name="Main" component={HomeScreen}/>
          <Stack.Screen name="Navigate" component={Navigate} />
          <Stack.Screen name="TimeTable" component={TimeTableStack} />
        </Stack.Navigator>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#404040',
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
    color: '#fff',
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
  text: {
    width: '140%',
    padding: 3,
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000a0"
  }
});