import React, { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/components/HomeScreen';
import LoginScreen from './src/components/LoginScreen';
import AdminScreen from './src/components/AdminScreen';

const Stack = createStackNavigator();


const firebaseConfig = {
  apiKey: "AIzaSyAbBSX367JxSA0v1fPYocE9-jf7IYOPH74",
  databaseURL: "https://gimnasio-120a3-default-rtdb.firebaseio.com",
  projectId: "gimnasio-120a3",
  storageBucket: "gimnasio-120a3.appspot.com",
  appId: "1:232780247572:android:178e3fa6ce281443a92d01"
};

const app = initializeApp(firebaseConfig);


function App(): JSX.Element {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Index" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="HomeAdmin" component={AdminScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;