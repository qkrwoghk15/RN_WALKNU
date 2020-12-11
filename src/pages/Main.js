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
                backgroundColor: 'black',
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
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    flex: 1,
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
    flex: 1,
    flexDirection: 'row'
  },
  button: {
    width: 120,
    height: 120,
    backgroundColor: 'black',
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
    color: '#fff',
    fontWeight: 'bold',
  },
});