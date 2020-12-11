import * as React from 'react';
import {
  NativeModules,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Navigate from './Navigate';
import TimeTable from './TimeTable';
import Cite from '../components/Cite'

const { UIManager } = NativeModules;
const Stack = createStackNavigator();

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}> WALKNU </Text>
      </View>

      <View style={styles.buttonbox}>
        <TouchableOpacity onPress={() => navigation.navigate('Navigate')}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>길찾기</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('TimeTable')}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>시간표</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.citebox}>
        <Cite></Cite>
      </View>
    </View>
  );
}

export default class Main extends React.Component {
  render() {
    return (
      <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Main"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#0D0D0D',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}>
            <Stack.Screen name="Main" component={HomeScreen}/>
            <Stack.Screen name="Navigate" component={Navigate} />
            <Stack.Screen name="TimeTable" component={TimeTable} />
          </Stack.Navigator>
        </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#404040',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    flex: 2,
    justifyContent: 'center',
  },
  title: {
    height:100,
    marginTop: 100,
    color: '#fff',
    textAlign: 'auto',
    fontSize: 70,
    fontFamily: "Cochin",
    fontWeight: "bold",
  },
  buttonbox: {
    flex: 2,
    flexDirection: 'row'
  },
  button: {
    width: 120,
    height: 120,
    backgroundColor: '#737373',
    paddingHorizontal: 20,
    paddingVertical: 15,
    margin: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },
  buttonText: {
    fontSize: 25,
    textAlign: 'center',
    color: '#F2F2F2',
    fontWeight: 'bold',
  },
  citebox: {
    flex:1
  }
});