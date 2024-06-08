import { Image, StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions, Animated, PanResponder, Button, ScrollView} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const LihatGaji = () => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const [namalengkap, setNamaLengkap] = useState('');

  const handlePelunasan = () => {
    navigation.navigate("Pelunasan");
  };

  const handleDp = () => {
    navigation.navigate("Dp");
  };

  useEffect(() => {
      const userId = firebase.auth().currentUser.uid;
      firebase.firestore().collection("mastersupir").doc(userId).get()
          .then((doc) => {
              if (doc.exists) {
                  console.log("Data:", doc.data());
                  setNamaLengkap(doc.data().namalengkap);
              } else {
                  console.log("No such document!");
              }
          })
          .catch((error) => {
              console.log("Error getting document:", error);
          });
  }, []);

  const handleLogout = () =>{
    firebase.auth().signOut();
    navigation.navigate("Login");
  };

  const navigation = useNavigation();

  const handleHome = () =>{
    navigation.navigate("Homepage");
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={require("../assets/bg_atas.png")} style={{ width: '100%', height: screenHeight - 80 }}>
      <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', height: 40 }}>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: "space-between", paddingHorizontal: 28 }}>
          <Text style={styles.haiText} >HI, {namalengkap}!</Text>
          
          <TouchableOpacity onPress={handleLogout}>
              <View style={{ alignItems: 'center' }}>
                  <Icon name="logout" size={22} color="white" onPress={handleLogout} />
                  <Text style={{ color: 'white', fontSize: 12 }}>KELUAR</Text>
              </View>
          </TouchableOpacity>
      </View>
      <View style={styles.backgroundContainer}>
        <View style={styles.kerjaContainer} >
            <Text style={styles.titleHomepage}>LIHAT GAJI</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.text}>Silahkan pilih menu berikut!</Text>
          <View style={{ height: 40 }} />
          <TouchableOpacity onPress={handleDp}>
            <View style={{ borderRadius: 20, flexDirection:'row', backgroundColor: "#F0F0F0", elevation: 20, width: screenWidth * 0.6, height: screenHeight * 0.08, alignItems: 'center', justifyContent: 'center' }}>
              <Image source={require('../assets/dp.png')} resizeMode='contain' style={styles.userImage}/>
              <Text style={styles.textInput}>LIHAT DP</Text>
            </View>
          </TouchableOpacity>
          <View style={{ height: 20 }} />
          <TouchableOpacity onPress={handlePelunasan}>
            <View style={{ borderRadius: 20, flexDirection:'row', backgroundColor: "#F0F0F0", elevation: 20, width: screenWidth * 0.6, height: screenHeight * 0.08, alignItems: 'center', justifyContent: 'center' }}>
              <Image source={require('../assets/dp.png')} resizeMode='contain' style={styles.userImage}/>
              <Text style={styles.textInput}>LIHAT PELUNASAN</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      </ImageBackground>
      <ImageBackground source={require("../assets/footer.png")} resizeMode='stretch' 
            style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: 80,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <TouchableOpacity onPress={handleHome}>
                    <View style={{ alignItems: 'center' }}>
                        <Icon name="home" size={52} color="white" onPress={handleHome} />
                    </View>
                </TouchableOpacity>
        </ImageBackground>
    </View>
  )
}

export default LihatGaji

const styles = StyleSheet.create({
  container: {
      backgroundColor:"#F5F5F5",
      flex: 1,
  },
  text: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginTop: 20
  },
  textUnduh: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginLeft: 20,
    // marginTop: 20,
    fontWeight: 'bold'
  },
  textUnduh2: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginTop: 10
  },
  topImageContainer: {
      height: 20,
  },
  topImage: {
      width: "100%",
      height: 500,
      marginTop: 0,
      marginLeft: 0,
  },
  buttomImageContainer: {
      position: 'absolute',
      bottom: 1,
      width: '100%',
      height: 100,
  },
  buttomImage: {
      width: "100%", // Atur lebar gambar
      resizeMode: 'contain',
  },
  nameContainer: {
      backgroundColor: "red",
      flexDirection: "row",
      borderRadius: 20,
      marginHorizontal: 20,
      elevation: 15,
      paddingVertical: 10,
      alignItems: "center",
      marginTop: 40,
  },
  userImage: {
      marginLeft: 25,
      marginRight: 12,
      marginTop: 20,
      marginBottom: 20,
      width: 20,
      height: 20,
  },
  textInput: {
      flex: 1,
      fontSize: 16,
  },
  passwordContainer: {
      backgroundColor: "#F0F0F0",
      flexDirection: "row",
      borderRadius: 20,
      marginHorizontal: 20,
      elevation: 10,
      paddingVertical: 10,
      alignItems: "center",
      marginTop: 20,
  },
  passwordImage: {
      marginLeft: 56,
      marginRight: 10,
      marginTop: 20,
      marginBottom: 20,
      width: 20,
      height: 20,
  },
  logoutButtonContainer: {
      width:100,
      flexDirection: "row",
      borderRadius: 10,
      marginHorizontal: 150,
      marginVertical: 20,
      alignItems: "center",
      justifyContent: "center",
      marginTop: -590,
      marginLeft: 290,
  },
  logoutImageContainer:{
      alignItems: "center",
  },
  logoutTextContainer:{
      alignItems: "center",
  },
  logoutButton: {
      alignItems: "center",
      fontSize: 10,
      color: "#ffffff",
  },
  logoutImage: {

  },
  buttomHomeContainer:{
      alignItems: "center",
  },
  backgroundContainer:{
      marginHorizontal: 28,
      marginTop: 20,
      height: 500,
      backgroundColor: "#f0f0f0",
      borderWidth: 3,
      borderColor: '#bae8c6',
      borderRadius: 30,
      padding: 10
  },
  kerjaContainer:{
      marginHorizontal: 18,
      marginTop: 10,
      backgroundColor: "#159947",
      flexDirection: "row",
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
  },
  titleHomepage:{
      color: "#ffffff",
      paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 17,
  },
  haiText:{
      fontSize: 20,
      color: "#ffffff",
  },
  contentContainer: {
      height: '100%',
      flexDirection: 'column',
      alignItems: 'center',
  },
  bellContainer: {
      marginTop: 100,
  },
  unduhContainer: {
      marginTop: 20,
  },

})
