import * as React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, ImageBackground, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainStack from './Main'
import SignUp from './SignUp'
import Login from './Login'

export const Stack = createStackNavigator();

function SignInPage({navigation}) {
    
    return (
        <>
            <View style={styles.container}>
                <Text style={styles.logo}>WALKNU</Text>
                <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>로그인</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.signupText}>회원가입</Text>
                </TouchableOpacity>
            </View>
        </>
    );
  }

  
export default function SignInStack() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                headerMode= 'none'>
                <Stack.Screen name="Home" component={SignInPage} />
                <Stack.Screen name="Login" component= {Login} />
                <Stack.Screen name="Main" component={MainStack} />
                <Stack.Screen name="SignUp" component= {SignUp} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F0EDE4',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo:{
      fontWeight:"bold",
      fontSize:50,
      color:"#8C6C64",
      marginBottom:40
    },
    inputView:{
      width:"80%",
      backgroundColor:"#465881",
      borderRadius:25,
      height:50,
      marginBottom:20,
      justifyContent:"center",
      padding:20
    },
    inputText:{
      height:50,
      color:"white"
    },
    forgot:{
      color:"white",
      fontSize:11
    },
    loginBtn:{
      width:"80%",
      backgroundColor:"#8C6C64",
      borderRadius:25,
      height:50,
      alignItems:"center",
      justifyContent:"center",
      marginTop:40,
      marginBottom:10
    },
    loginText:{
      color:"white"
    },
    signuptext:{
      color:"black"
    }
  });