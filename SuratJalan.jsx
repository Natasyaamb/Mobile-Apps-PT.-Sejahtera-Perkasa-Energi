import { Image, StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions, Animated, PanResponder, Button, ScrollView} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { BlurView } from 'expo-blur';

import * as WebBrowser from 'expo-web-browser';

const SuratJalan = () => {
  const navigation = useNavigation();
  const [namalengkap, setNamaLengkap] = useState('');
  const [isSuratJalanExist, setIsSuratJalanExist] = useState(false);
  const [suratJalanLink, setSuratJalanLink] = useState('');
  const [beritaAcaraLink, setBeritaAcaraLink] = useState('');
  const [namaFile, setNamaFile] = useState('');
  const [namaFile2, setNamaFile2] = useState('');
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // at first get the user data from firestore
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
  
  useEffect(() => {
      const userId = firebase.auth().currentUser.uid;
      firebase.firestore().collection("mastersupir").doc(userId).get()
          .then((doc) => {
              if (doc.exists) {
                  console.log("Data:", doc.data());
                  setSuratJalanLink(doc.data().suratjalan);

                  if (doc.data().suratjalan !== 'null') {
                      setIsSuratJalanExist(true);
                      const splitLink = doc.data().suratjalan.split("/");
                      const fileName = splitLink[splitLink.length - 1];
                      console.log("File Name:", fileName);
                      const splitFileName = fileName.split("?");
                      const realFileName = splitFileName[0];
                      console.log("Real File Name:", realFileName);
                      setNamaFile(realFileName);
                      

                  }
              } else {
                  console.log("No such document!");
              }
          })
          .catch((error) => {
              console.log("Error getting document:", error);
          });
  }, []);

  
  useEffect(() => {
    const userId = firebase.auth().currentUser.uid;
    firebase.firestore().collection("mastersupir").doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                console.log("Data:", doc.data());
                setBeritaAcaraLink(doc.data().beritaacara);

                if (doc.data().beritaacara !== 'null') {
                    const splitLink = doc.data().beritaacara.split("/");
                    const fileName = splitLink[splitLink.length - 1];
                    console.log("File Name:", fileName);
                    const splitFileName = fileName.split("?");
                    const realFileName = splitFileName[0];
                    console.log("Real File Name:", realFileName);
                    setNamaFile2(realFileName);

                }
            } else {
                console.log("No such document!");
            }
        })
        .catch((error) => {
            console.log("Error getting document:", error);
        });
}, []);
  
const handleUnduh = async (link, isLastUnduh) => {
    WebBrowser.openBrowserAsync(link);
    if (isLastUnduh) {
      firebase.firestore().collection("mastersupir").doc(firebase.auth().currentUser.uid).update({
        status: false
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
    }
  };

  const handleHome = () =>{
    navigation.navigate("Homepage");
  };

  const handleLogout = () =>{
      firebase.auth().signOut();
      navigation.navigate("Login");
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

            <ScrollView>

                {!isSuratJalanExist ? (

                <View style={styles.backgroundContainer}>
                    <View style={styles.kerjaContainer} >
                        <Text style={styles.titleHomepage}>SURAT JALAN DAN BAST</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <TouchableOpacity onPress={() => {}}>
                            <View style={styles.bellContainer} >
                                <Image source={require("../assets/belicon.png")} style={styles.belImage}/>
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.text}>Surat Jalan dan Berita Acara sedang diproses oleh Admin, silahkan cek kembali!</Text>
                    </View>
                </View>

                ) : (

                <View style={{ ...styles.backgroundContainer, height: 1000 }}>
                    <ScrollView>
                        <View style={styles.kerjaContainer} >
                            <Text style={styles.titleHomepage}>SURAT JALAN DAN BAST</Text>
                        </View>
                        <View style={styles.contentContainer}>
                            <TouchableOpacity onPress={() => {}}>
                                <View style={styles.unduhContainer} >
                                    <Image source={require("../assets/unduhicon.png")} style={{ width: 100}} resizeMode='contain'/>
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.textUnduh}>Surat Jalan dan Berita Acara berhasil dibuat!</Text>
                            <Text style={styles.textUnduh2}>Silahkan unduh surat dibawah ini</Text>
                            <View style={{ width: '100%', height: 240, backgroundColor: '#dee3e1', marginTop: 30, borderRadius: 28, flexDirection: 'column', paddingHorizontal: 16}}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
                                    <Image source={require('../assets/file.png')} style={{ width: 16 }} resizeMode='contain' />
                                    <Text style={styles.fileNameText}>{namaFile}</Text>
                                </View>
                                <View style={{ width: '100%', height: 152, backgroundColor: '#dee3e1', borderRadius: 28, flexDirection: 'column', paddingHorizontal: 16}}>
                                    <BlurView intensity={100} style={{ ...StyleSheet.absoluteFill }}>
                                        <Image source={require('../assets/suratjalan.jpg')} style={{ width: '100%', height: 152}} resizeMode='contain' />
                                    </BlurView>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => handleUnduh(suratJalanLink, false)} style={{ width:'55%', alignItems: 'center' }}>
                                <View style={{ width: '100%', height: 40, backgroundColor: '#159947', marginTop: 14, borderRadius: 28, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{ color: 'white', fontSize: 13 }}>UNDUH SURAT JALAN</Text>
                                </View>
                            </TouchableOpacity>

                            <View style={{ width: '100%', height: 225, backgroundColor: '#dee3e1', marginTop: 30, borderRadius: 28, flexDirection: 'column', paddingHorizontal: 16}}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
                                    <Image source={require('../assets/file.png')} style={{ width: 16 }} resizeMode='contain' />
                                    <Text style={styles.fileNameText}>{namaFile2}</Text>
                                </View>
                                <View style={{ width: '100%', height: 152, backgroundColor: '#dee3e1', borderRadius: 28, flexDirection: 'column', paddingHorizontal: 16}}>
                                    <BlurView intensity={100} style={{ ...StyleSheet.absoluteFill }}>
                                        <Image source={require('../assets/beritaacara.jpg')} style={{ width: '100%', height: 152}} resizeMode='contain' />
                                    </BlurView>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => handleUnduh(beritaAcaraLink, true)} style={{ width:'55%', alignItems: 'center' }}>
                                <View style={{ width: '100%', height: 40, backgroundColor: '#159947', marginTop: 14, borderRadius: 28, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{ color: 'white', fontSize: 13 }}>UNDUH BERITA ACARA</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
                )}
            </ScrollView>
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

export default SuratJalan

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
    marginTop: 20,
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
      backgroundColor: "#F0F0F0",
      flexDirection: "row",
      borderRadius: 20,
      marginHorizontal: 20,
      elevation: 10,
      paddingVertical: 10,
      alignItems: "center",
      marginTop: 40,
  },
  userImage: {
      marginLeft: 48,
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
      height: 530,
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
  fileNameText: {
    color: 'black',
    fontSize: 14,
    marginLeft: 16,
    marginTop: 9,
    marginBottom: 9,
    flex: 1,
    flexWrap: 'wrap', // Membiarkan teks membungkus jika terlalu panjang
    maxWidth: '80%', // Atur lebar maksimal untuk teks
  }
})
