import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import LoginScreen from "./screen/LoginScreen";
import Homepage from "./screen/Homepage";
import LihatGaji from "./screen/LihatGaji";
import SuratJalan from "./screen/SuratJalan";
import Pelunasan from "./screen/Pelunasan";
import Dp from "./screen/Dp";

const firebaseConfig = {
  apiKey: "AIzaSyBThnvHQZq85kt7Z74QbuFwCX_W2o5jF4U",
  authDomain: "sistem-operasional-app.firebaseapp.com",
  databaseURL: "https://sistem-operasional-app-default-rtdb.firebaseio.com",
  projectId: "sistem-operasional-app",
  storageBucket: "sistem-operasional-app.appspot.com",
  messagingSenderId: "200008673115",
  appId: "1:200008673115:web:197dfc80e978369d0ddc7e",
  measurementId: "G-QJ48EKCFZN",
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
  const firestore = firebase.firestore();
  
  const Stack = createNativeStackNavigator();

  const App = () => {
    return (
        <Stack.Navigator
          initialRouteName="Login" // Mengatur halaman login sebagai halaman awal
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Homepage" component={Homepage} />
          <Stack.Screen name="LihatGaji" component={LihatGaji} />
          <Stack.Screen name="SuratJalan" component={SuratJalan} />
          <Stack.Screen name="Pelunasan" component={Pelunasan} />
          <Stack.Screen name="Dp" component={Dp} />
        </Stack.Navigator>
    );
  };
  
  export default App;
  
  const styles = StyleSheet.create({});