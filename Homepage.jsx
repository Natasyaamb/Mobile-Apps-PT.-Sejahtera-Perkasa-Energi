import { Image, StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions, Animated, PanResponder} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width * 0.7;

const circleSize = 60;
const barPadding = 5;
const barWidth = screenWidth - 2 * barPadding; // Subtract the padding on both sides
const toValue = barWidth - circleSize; // Subtract the circle size

const CustomSwitch = () => {
        
    const [switchValue, setSwitchValue] = useState(false);
    const [translateValue] = useState(new Animated.Value(0));
    const [isSuratJalanExist, setIsSuratJalanExist] = useState(false);
    const [renderCount, setRenderCount] = useState(0);

    const forceRender = () => setRenderCount(renderCount + 1);

    useEffect(() => {
        const db = getFirestore();
        const docRef = doc(db, "mastersupir", firebase.auth().currentUser.uid);

        const unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setSwitchValue(data.status);
            } else {
                console.log("No such document!");
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        Animated.spring(translateValue, {
            toValue: switchValue ? screenWidth - 70 : 0,
            tension: 10,
            friction: 7,
            useNativeDriver: true,
        }).start();
    }, [switchValue]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const doc = await firebase.firestore().collection("mastersupir").doc(firebase.auth().currentUser.uid).get();
                if (doc.exists) {
                    setSwitchValue(doc.data().status);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.log("Error getting document:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const userId = firebase.auth().currentUser.uid;
        const unsubscribe = firebase.firestore().collection("mastersupir").doc(userId)
            .onSnapshot((doc) => {
                if (doc.exists) {   
                    if (doc.data().suratjalan != 'null') {
                        setIsSuratJalanExist(true);
                    }
                    else { 
                        setIsSuratJalanExist(false);
                        forceRender();                        
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
  
    const handleSwitch = () => {
        const newValue = !switchValue;
        setSwitchValue(newValue);
        if (newValue) {
            // set value to the firestore
            firebase.firestore().collection("mastersupir").doc(firebase.auth().currentUser.uid).update({
                status: true
              })
              .then(() => {
                console.log("Document successfully updated!");
              })
              .catch((error) => {
                console.error("Error updating document: ", error);
              });
        }
        else {
            // set value to the firestore
            firebase.firestore().collection("mastersupir").doc(firebase.auth().currentUser.uid).update({
                status: false
            })
        }
        Animated.spring(translateValue, {
            toValue: newValue ?  toValue : 0,
            useNativeDriver: true,
        }).start();
    };

    return(
        <View>
            <View style={{ marginBottom: 6, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12 }}>TIDAK TERSEDIA</Text>
                <Text style={{ fontSize: 12 }}>TERSEDIA</Text>
            </View>
            <LinearGradient start={{ x:0, y:0 }} end={{ x:1, y:0 }} colors={switchValue ? ['#7fe974', '#95f78d', '#a5f0a0'] : ['white', 'white']} style={{ width: screenWidth, height: 70, borderRadius: 35, padding: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Animated.View style={{ transform: [{ translateX: translateValue }], width: 60, height: 60, backgroundColor: switchValue ? '#30a566' : '#C04538E0', borderRadius: 30 }} />
                {isSuratJalanExist ?
                    <TouchableOpacity disabled style={{ position: 'absolute', width: '100%', height: '100%' }} />
                :
                    <TouchableOpacity style={{ position: 'absolute', width: '100%', height: '100%' }} onPress={handleSwitch} />
            
                }
                {!switchValue && 
                    <View style={{flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name="chevron-right" size={20} color="#C04538E0" />
                        <Icon name="chevron-right" size={20} color="#C04538E0" />
                        <Icon name="chevron-right" size={20} color="#C04538E0" />
                    </View>
                }
                {switchValue && 
                    <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', left: 10, top: '40%'}}>
                        <Icon name="chevron-left" size={20} color="white" />
                        <Icon name="chevron-left" size={20} color="white" />
                        <Icon name="chevron-left" size={20} color="white" />
                    </View>
                }
            </LinearGradient>
        </View>    
    )
    
    
    if (isSuratJalanExist) {
        return(
            <View>
                <View style={{ marginBottom: 6, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12 }}>Tidak Tersedia</Text>
                    <Text style={{ fontSize: 12 }}>Tersedia</Text>
                </View>
                <LinearGradient start={{ x:0, y:0 }} end={{ x:1, y:0 }} colors={switchValue ? ['#7fe974', '#95f78d', '#a5f0a0'] : ['white', 'white']} style={{ width: screenWidth, height: 70, borderRadius: 35, padding: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Animated.View style={{ transform: [{ translateX: translateValue }], width: 60, height: 60, backgroundColor: switchValue ? '#30a566' : '#C04538E0', borderRadius: 30 }} />
                    <TouchableOpacity disabled style={{ position: 'absolute', width: '100%', height: '100%' }} />
                    {!switchValue && 
                        <View style={{flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name="chevron-right" size={20} color="#C04538E0" />
                            <Icon name="chevron-right" size={20} color="#C04538E0" />
                            <Icon name="chevron-right" size={20} color="#C04538E0" />
                        </View>
                    }
                    {switchValue && 
                        <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', left: 10, top: '40%'}}>
                            <Icon name="chevron-left" size={20} color="white" />
                            <Icon name="chevron-left" size={20} color="white" />
                            <Icon name="chevron-left" size={20} color="white" />
                        </View>
                    }
                </LinearGradient>
            </View>    
        )
    }
    else {
        return (
            <View>
                <View style={{ marginBottom: 6, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12 }}>Tidak Tersedia</Text>
                    <Text style={{ fontSize: 12 }}>Tersedia</Text>
                </View>
                <LinearGradient start={{ x:0, y:0 }} end={{ x:1, y:0 }} colors={switchValue ? ['#7fe974', '#95f78d', '#a5f0a0'] : ['white', 'white']} style={{ width: screenWidth, height: 70, borderRadius: 35, padding: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Animated.View style={{ transform: [{ translateX: translateValue }], width: 60, height: 60, backgroundColor: switchValue ? '#30a566' : '#C04538E0', borderRadius: 30 }} />
                    <TouchableOpacity style={{ position: 'absolute', width: '100%', height: '100%' }} onPress={handleSwitch} />
                    {!switchValue && 
                        <View style={{flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name="chevron-right" size={20} color="#C04538E0" />
                            <Icon name="chevron-right" size={20} color="#C04538E0" />
                            <Icon name="chevron-right" size={20} color="#C04538E0" />
                        </View>
                    }
                    {switchValue && 
                        <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', left: 10, top: '40%'}}>
                            <Icon name="chevron-left" size={20} color="white" />
                            <Icon name="chevron-left" size={20} color="white" />
                            <Icon name="chevron-left" size={20} color="white" />
                        </View>
                    }
                </LinearGradient>
            </View>
        )
        
    }
  
};

const Homepage = () => {
    const navigation = useNavigation();
    const [namalengkap, setNamaLengkap] = useState('');

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
    
    const handleHome = () =>{
        navigation.navigate("Homepage");
    };
    const handleLogout = () =>{
        firebase.auth().signOut();
        navigation.navigate("Login");
    };
    const handleSuratJalan = () =>{
        navigation.navigate("SuratJalan");
    };
    const handleLihatGaji = () =>{
        navigation.navigate("LihatGaji");
    };
    return (
        <View style={{ height: '100%' }}>
            <ImageBackground source={require("../assets/bg_atas.png")} style={{ width: '100%', height: 600 }}>
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
                            <Text style={styles.titleHomepage}>MARI BEKERJA</Text>
                    </View>
                    <TouchableOpacity onPress={handleSuratJalan}>
                        <View style={styles.nameContainer} >
                            <Image source={require("../assets/logo_suratjalan.png")} style={styles.userImage}/>
                            <Text style={styles.textInput}>SURAT JALAN</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLihatGaji}>
                        <View style={styles.passwordContainer} >
                            <Image source={require("../assets/logo_gaji.png")} style={styles.passwordImage}/>
                            <Text style={styles.textInput}>LIHAT GAJI</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ position: 'absolute', bottom: 0 }}>
                            <CustomSwitch />
                        </View>
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

export default Homepage

const styles = StyleSheet.create({
    container: {
        backgroundColor:"#F5F5F5",
        flex: 1,
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
        paddingVertical: 5,
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
        paddingVertical: 5,
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
        padding: 10,
    },
    kerjaContainer:{
        marginHorizontal: 18,
        marginTop: 15,
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

})
