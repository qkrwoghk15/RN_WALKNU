import React from 'react';
import { Alert, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default class Login extends React.Component {
  state={
    email:"",
    password:""
  }

  validate_field=()=>{
      const { email, password } = this.state
      if(email == ""){
          alert("아이디를 입력하세요")
          return false
      } else if(password == ""){
          alert("비밀번호를 입력하세요")
          return false
      }
      return true
  }

  making_api_call=()=>{
      if(this.validate_field() && this.compare_field()){
        this.props.navigation.navigate('Main')
      }
  }
  
  compare_field=()=>{
      const { email, password } = this.state
      if(email != "ㅂ" || password != "q"){
            alert("아이디와 비밀번호가 일치하지 않습니다")
            return false
      }
      return true
  }

  render(){
    return (
      <View style={styles.container}>
        <View style={styles.inputView} >
          <TextInput  
            style={styles.inputText}
            placeholder="Email..." 
            placeholderTextColor="#ffffff"
            onChangeText={text => this.setState({email:text})}/>
        </View>
        <View style={styles.inputView} >
          <TextInput  
            secureTextEntry
            style={styles.inputText}
            placeholder="Password..." 
            placeholderTextColor="#ffffff"
            onChangeText={text => this.setState({password:text})}/>
        </View>
        <TouchableOpacity 
            style={styles.loginBtn} 
            onPress={() => this.making_api_call()}>
          <Text style={styles.loginText}>로그인</Text>
        </TouchableOpacity>

  
      </View>
    );
  }
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
    color:"#fb5b5a",
    marginBottom:40
  },
  inputView:{
    width:"80%",
    backgroundColor:"#d6b7ae",
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
  }
});