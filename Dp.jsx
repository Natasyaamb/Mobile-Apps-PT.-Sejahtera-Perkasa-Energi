import { Image, StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions, Animated, PanResponder, Button, ScrollView, TextInput, Linking, LogBox, KeyboardAvoidingView, Alert} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { BlurView } from 'expo-blur';

const Dp = () => {
    const navigation = useNavigation();
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const [namalengkap, setNamaLengkap] = useState('');
  
    const [isProcessing, setIsProcessing] = useState(false);
    const [linkBuktiDp, setLinkBuktiDp] = useState('');
    const [linkBuktiJarak, setLinkBuktiJarak] = useState('');
  
    useEffect(() => {
      const userId = firebase.auth().currentUser.uid;
      const unsubscribe = firebase.firestore().collection("mastersupir").doc(userId)
        .onSnapshot((doc) => {
          if (doc.exists) {
            console.log("Data:", doc.data());
            setNamaLengkap(doc.data().namalengkap);
            if (doc.data().linkbuktidp) {
              setLinkBuktiDp(doc.data().linkbuktidp);
            }
            if (doc.data().linkbuktijarak) {
              setLinkBuktiJarak(doc.data().linkbuktijarak);
            }
            setIsProcessing(!doc.data().linkbuktidp || !doc.data().linkbuktijarak);
          } else {
            console.log("No such document!");
          }
        }, (error) => {
          console.log("Error getting document:", error);
        });
  
      return () => unsubscribe();
    }, []);
  
    const handleLogout = () => {
      firebase.auth().signOut();
      navigation.navigate("Login");
    };
  
    const handleHome = () => {
      navigation.navigate("Homepage");
    };
  
    const handleCetak = () => {
      Linking.openURL(linkBuktiDp);
    };
  
    const handleLihat = () => {
      Linking.openURL(linkBuktiJarak);
    };
  
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground source={require("../assets/bg_atas.png")} style={{ width: '100%', height: screenHeight - 80 }}>
          <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', height: 40 }} />
  
          <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: "space-between", paddingHorizontal: 28 }}>
            <Text style={styles.haiText}>HI, {namalengkap}!</Text>
  
            <TouchableOpacity onPress={handleLogout}>
              <View style={{ alignItems: 'center' }}>
                <Icon name="logout" size={22} color="white" onPress={handleLogout} />
                <Text style={{ color: 'white', fontSize: 12 }}>KELUAR</Text>
              </View>
            </TouchableOpacity>
          </View>
  
          <ScrollView>
            {isProcessing ? (
              <View style={styles.backgroundContainer}>
                <View style={styles.kerjaContainer}>
                  <Text style={styles.titleHomepage}>CEK GAJI</Text>
                </View>
                <View style={styles.contentContainer}>
                  <TouchableOpacity onPress={() => {}}>
                    <View style={styles.bellContainer} >
                      <Image source={require("../assets/belicon.png")} style={styles.belImage}/>
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.text}>Invoice DP Sedang Diproses</Text>
                  <Text>Silakan cek kembali nanti!</Text>
                </View>
              </View>  
            ) : (
              <View style={{ ...styles.backgroundContainer, height: 930 }}>
                <ScrollView>
                  <View style={styles.kerjaContainer} >
                    <Text style={styles.titleHomepage}>CEK GAJI</Text>
                  </View>
                  <View style={styles.contentContainer}>
                    <TouchableOpacity onPress={() => {}}>
                      <View style={styles.unduhContainer} >
                        <Image source={require("../assets/unduhicon.png")} style={{ width: 100 }} resizeMode='contain'/>
                      </View>
                    </TouchableOpacity>
                    <Text style={styles.textUnduh}>Gaji berhasil diproses!</Text>
                    <Text style={styles.textUnduh2}>Silahkan unduh invoice dibawah ini</Text>
                    <View style={{ width: '100%', height: 210, backgroundColor: '#dee3e1', marginTop: 30, borderRadius: 28, flexDirection: 'column', paddingHorizontal: 16 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                        <Image source={require('../assets/file.png')} style={{ width: 16 }} resizeMode='contain' />
                        <Text style={{ color: 'black', fontSize: 14, marginLeft: 16 }}>BUKTI INVOICE DP</Text>
                      </View>
                      <View style={{ width: '100%', height: 152, backgroundColor: '#dee3e1', borderRadius: 28, flexDirection: 'column', paddingHorizontal: 16 }}>
                      <BlurView intensity={100} style={{ ...StyleSheet.absoluteFill }}>
                        {linkBuktiDp ? (
                          <TouchableOpacity onPress={handleCetak}>
                            <Image source={{ uri: linkBuktiDp }} style={{ width: '100%', height: 152 }} resizeMode='contain' />
                          </TouchableOpacity>
                        ) : null}
                      </BlurView>
                      </View>
                    </View>
                    <TouchableOpacity onPress={handleCetak} style={{ width: '50%', alignItems: 'center' }}>
                      <View style={{ width: '100%', height: 40, backgroundColor: '#159947', marginTop: 14, borderRadius: 28, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 16 }}>CETAK</Text>
                      </View>
                    </TouchableOpacity>
  
                    <View style={{ width: '100%', height: 210, backgroundColor: '#dee3e1', marginTop: 30, borderRadius: 28, flexDirection: 'column', paddingHorizontal: 16 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                        <Image source={require('../assets/file.png')} style={{ width: 16 }} resizeMode='contain' />
                        <Text style={{ color: 'black', fontSize: 14, marginLeft: 16 }}>BUKTI JARAK PENGIRIMAN</Text>
                      </View>
                      <View style={{ width: '100%', height: 152, backgroundColor: '#dee3e1', borderRadius: 28, flexDirection: 'column', paddingHorizontal: 16 }}>
                        <BlurView intensity={100} style={{ ...StyleSheet.absoluteFill }}>
                          {linkBuktiJarak ? (
                            <TouchableOpacity onPress={handleLihat}>
                              <Image source={{ uri: linkBuktiJarak }} style={{ width: '100%', height: 152 }} resizeMode='contain' />
                            </TouchableOpacity>
                          ) : null}
                        </BlurView>
                      </View>
                    </View>
                    <TouchableOpacity onPress={handleLihat} style={{ width: '50%', alignItems: 'center' }}>
                      <View style={{ width: '100%', height: 40, backgroundColor: '#159947', marginTop: 14, borderRadius: 28, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 16 }}>CETAK</Text>
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
  
  export default Dp;
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor:"#F5F5F5",
      flex: 1,
    },
    haiText: {
      fontSize: 20,
      color: "#ffffff",
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
    backgroundContainer: {
      marginHorizontal: 28,
      marginTop: 20,
      height: 550,
      backgroundColor: "#f0f0f0",
      borderWidth: 3,
      borderColor: '#bae8c6',
      borderRadius: 30,
      padding: 10
    },
    kerjaContainer: {
      marginHorizontal: 18,
      marginTop: 10,
      backgroundColor: "#159947",
      flexDirection: "row",
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
    },
    titleHomepage: {
      color: "#ffffff",
      paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 17,
    },
    contentContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'black',
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 10,
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
    fileContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    fileName: {
      flex: 1,
      fontSize: 18,
      fontWeight: "bold",
    },
    imageContainer: {
      flex: 1,
      borderRadius: 10,
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: 200,
    },
    buttonContainer: {
      width: "100%",
      alignItems: "center",
    },
    button: {
      backgroundColor: "#159947",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 50,
    },
    buttonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
    belImage: {
      width: 100,
      height: 100,
    },
    unduhContainer: {
      marginTop: 20,
    },
    bellContainer: {
      marginTop: 100,
    },
    footer: {
      position: "absolute",
      bottom: 30,
      right: 20,
      backgroundColor: "#159947",
      borderRadius: 50,
      padding: 10,
    },
  });
