import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainStack from './Main'
import SignUp from './SignUp'

export const Stack = createStackNavigator();

function SignInPage({navigation}) {
    return (
        <>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>SignIn Screen</Text>
                <Button
                    title="Sign In"
                    onPress={() => navigation.navigate('Main')}
                />
                <Button
                    title="Sign Up"
                    onPress={() => navigation.navigate('SignUp')}
                />
            </View>
        </>
    );
  }

  
export default function SignInStack() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                    backgroundColor: 'black',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                    fontWeight: 'bold',
                    },
                    headerTitle: 'WALKNU',
                    headerBackTitle: 'back'
                }}>
                <Stack.Screen name="SignIn" component={SignInPage} />
                <Stack.Screen name="Main" component={MainStack} />
                <Stack.Screen name="SignUp" component= {SignUp} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}