import { Image, StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions, Animated, PanResponder, Button, ScrollView, TextInput, Linking, LogBox, KeyboardAvoidingView, Alert} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { BlurView } from 'expo-blur';

import * as ImagePicker from 'expo-image-picker';

LogBox.ignoreAllLogs();

const Pelunasan = () => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const [namalengkap, setNamaLengkap] = useState('');

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isLunas, setIsLunas] = useState(false);
  const [linkBuktiTransfer, setLinkBuktiTransfer] = useState('');

  const [uploadProgress, setUploadProgress] = useState(null);

  const [blobFile, setBlobFile] = useState(null);

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
    const unsubscribe = firebase.firestore().collection("mastersupir").doc(userId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          console.log("Data:", doc.data());
          if (doc.data().pelunasanvalid === 'pending') {
            setIsPending(true);
            setIsLunas(false);
          }
          else if (doc.data().pelunasanvalid === 'lunas') {
            setIsLunas(true);
            setIsPending(false);
            setLinkBuktiTransfer(doc.data().linkbuktipelunasan);
          }
        } else {
          console.log("No such document!");
        }
      }, (error) => {
        console.log("Error getting document:", error);
      });
  
    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const getBlobFroUri = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  
    return blob;
  };
  
  const handleLogout = () =>{
    firebase.auth().signOut();
    navigation.navigate("Login");
  };

  const handleHome = () =>{
    navigation.navigate("Homepage");
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      setSelectedDocument(result);
    }
    else {
      setSelectedDocument(null);
    }
  };
  
  const openCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      setSelectedDocument(result);
    }
    else {
      setSelectedDocument(null);
    }
  };

  const handleSelectDocument = () => {
    // pick image from gallery or camera
    Alert.alert(
      "Pilih salah satu opsi",
      "Pilih gambar dari galeri atau buka kamera",
      [
        { text: "Batal", style: "cancel" },
        { text: "Pilih dari galeri", onPress: () => pickImage() },
        { text: "Buka Kamera", onPress: () => openCamera() }
      ]
    );
  };

  const handleCetak= () => {
    // open browser to download the file
    Linking.openURL(linkBuktiTransfer);
  };

  const handleKirim = async () => {
    if (!selectedDocument) {
      alert('Mohon lengkapi data yang diperlukan');
      return;
    }
    const userId = firebase.auth().currentUser.uid;
    firebase.firestore().collection("mastersupir").doc(userId).get()
      .then(async (doc) => {
        if (doc.exists) {
          const storage = getStorage();
          const metadata = {
            contentType: 'image/jpeg'
          };
          const blob = await getBlobFroUri(selectedDocument.assets[0].uri);
          const storageRef = ref(storage, `buktisurat/${userId}`);
          const uploadTask = uploadBytesResumable(storageRef, blob, metadata);
  
          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress); // Update the state with the current progress
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused');
                  break;
                case 'running':
                  console.log('Upload is running');
                  break;
              }
            },
            (error) => {
              console.log(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                firebase.firestore().collection("mastersupir").doc(userId).update({
                  pelunasanvalid: 'pending',
                  linkbuktisurat: downloadURL
                }).then(() => {
                  setUploadProgress(null); // Reset progress after successful upload
                });
              });
            }
          );
        }
      });
  };  

  const navigation = useNavigation();

  if (isPending) {
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
                      <Text style={{ color: 'white', fontSize: 14 }}>KELUAR</Text>
                  </View>
              </TouchableOpacity>
          </View>
          <View style={styles.backgroundContainer}>
            <ScrollView>
              <View style={styles.kerjaContainer} >
                  <Text style={styles.titleHomepage}>CEK GAJI</Text>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 100 }}>
                <Image source={require('../assets/ceklisicon.png')} style={{ width: 150, height: 150 }} />

              </View>
              <View style={styles.contentContainer}>
                <Text style={styles.text}>Data berhasil dikirim!</Text>
                <Text style={{  }}>Silakan tunggu sejenak.</Text>
              </View>
            </ScrollView>
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
  else if (isLunas) {
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
                      <Text style={{ color: 'white', fontSize: 14 }}>KELUAR</Text>
                  </View>
              </TouchableOpacity>
          </View>
          <ScrollView>
            <View style={{ ...styles.backgroundContainer, height: 610 }}>

              <View style={styles.kerjaContainer} >
                  <Text style={styles.titleHomepage}>CEK GAJI</Text>
              </View>
              <TouchableOpacity onPress={() => {}}>
                  <View style={styles.unduhContainer} >
                      <Image source={require("../assets/unduhicon.png")} style={{ width: 100}} resizeMode='contain'/>
                </View>
              </TouchableOpacity>
              <Text style={styles.textUnduh}>Gaji berhasil diproses!</Text>
              <Text style={styles.textUnduh2}>Silakan unduh invoice dibawah ini.</Text>
              <View style={{ width: '100%', height: 210, backgroundColor: '#dee3e1', marginTop: 30, borderRadius: 28, flexDirection: 'column', paddingHorizontal: 16}}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
                      <Image source={require('../assets/file.png')} style={{ width: 16 }} resizeMode='contain' />
                      <Text style={{ color: 'black', fontSize: 14, marginLeft: 16 }}>BUKTI INVOICE PELUNASAN</Text>
                  </View>
                  <View style={{ width: '100%', height: 152, backgroundColor: '#dee3e1', borderRadius: 28, flexDirection: 'column', paddingHorizontal: 16}}>
                    <BlurView intensity={100} style={{ ...StyleSheet.absoluteFill }}>
                      {linkBuktiTransfer ? (
                        <TouchableOpacity onPress={handleCetak}>
                          <Image source={{ uri: linkBuktiTransfer }} style={{ width: '100%', height: 152 }} resizeMode='contain' />
                        </TouchableOpacity>
                      ) : null}
                    </BlurView>
                  </View>
              </View>
              <View style={{ height: 20 }} />
              <View style={{ alignItems: 'center' }}>
                <TouchableOpacity onPress={handleCetak} style={{ width:'50%', alignItems: 'center' }}>
                    <View style={{ width: '100%', height: 40, backgroundColor: '#159947', marginTop: 6, borderRadius: 28, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{ color: 'white', fontSize: 16 }}>CETAK</Text>
                    </View>
                </TouchableOpacity>
              </View>
            </View>
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
        <View style={styles.backgroundContainer}>
          <View style={styles.kerjaContainer}>
            <Text style={styles.titleHomepage}>CEK GAJI</Text>
          </View>
          <View style={styles.contentContainer}>
            <View style={{ paddingLeft: 20, paddingRight: 20, width: '100%', marginTop: 20 }}>
              <View style={{ height: 20 }} />
              <View style={{ width: '100%' }}>
                <Text>Silakan Unggah Bukti Surat:</Text>
              </View>
              {selectedDocument ? (
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start'
                }}>
                  <View style={{
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                    height: screenHeight * 0.06,
                    borderRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    elevation: 10,
                    borderWidth: 1,
                    borderColor: '#159947',
                    backgroundColor: 'white',
                    padding: 10
                  }}>
                    <Image source={require('../assets/file.png')} resizeMode='contain' style={{ width: 20 }} />
                    <View style={{ width: 10 }} />
                    <Text>{selectedDocument.assets[0].name}</Text>
                    <View style={{ width: 10 }} />
                    <TouchableOpacity onPress={() => setSelectedDocument(null)} style={{ marginLeft: 'auto' }}>
                      <Icon name="close" size={20} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity onPress={handleSelectDocument}>
                  <View style={{
                    flexDirection: 'row',
                    width: '55%',
                    height: screenHeight * 0.06,
                    borderRadius: 30,
                    alignItems: 'center',
                    elevation: 10,
                    borderWidth: 1,
                    borderColor: '#159947',
                    backgroundColor: 'white',
                    padding: 10,
                    marginTop: 5
                  }}>
                    <Image source={require('../assets/upload.png')} resizeMode='contain' style={{ width: 30 }} />
                    <View style={{ width: 10 }} />
                    <Text>Pilih Surat</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
            <View style={{ height: 25 }} />
            {uploadProgress !== null ? (
              <View style={{ width: '100%', alignItems: 'center' }}>
                <Text>Mengunggah: {Math.round(uploadProgress)}%</Text>
                <View style={{
                  width: '80%',
                  height: 10,
                  backgroundColor: '#e0e0e0',
                  borderRadius: 5,
                  overflow: 'hidden',
                  marginTop: 10
                }}>
                  <View style={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    backgroundColor: '#159947'
                  }} />
                </View>
              </View>
            ) : (
              <TouchableOpacity onPress={handleKirim} style={{ width: '55%', alignItems: 'center' }}>
                <View style={{
                  width: '100%',
                  height: 40,
                  backgroundColor: '#159947',
                  marginTop: 14,
                  borderRadius: 28,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text style={{ color: 'white', fontSize: 16 }}>KIRIM</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ImageBackground>
      <KeyboardAvoidingView behavior={null} style={{ flex: 1 }}>
        <ImageBackground source={require("../assets/footer.png")} resizeMode='stretch' style={{
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
      </KeyboardAvoidingView>
    </View>
  );  
}

export default Pelunasan

const styles = StyleSheet.create({
  container: {
      backgroundColor:"#F5F5F5",
      flex: 1,
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
      height: 510,
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
      marginTop: 10,
      alignItems: 'center',

  },

})
