import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebaseConfig'; 
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const LoginScreen = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                console.log("User is logged in:", user);
                // User is signed in, navigate to Homepage replacement
                navigation.replace("Homepage");
            } else {
                console.log("User is not logged in");
            }
        });
        return unsubscribe;
    }, []);

    const handleLogin = () => {
        auth.signInWithEmailAndPassword(username + '@gmail.com', password)
        .then((userCredential) => {
            console.log("Login successful!");
            // Login sukses, navigasi ke Homepage
            // replace agar tidak bisa kembali ke halaman login
            navigation.replace("Homepage");
            
            
            // Ambil data dari Firestore setelah login sukses
            const userId = userCredential.user.uid;
            firebase.firestore().collection("mastersupir").doc(userId).get()
                .then((doc) => {
                    if (doc.exists) {
                        console.log("Data:", doc.data());
                        // Lakukan sesuatu dengan data Firestore yang didapatkan
                    } else {
                        console.log("at login No such document!");
                    }
                })
                .catch((error) => {
                    console.log("Error getting document:", error);
                });
        })
        .catch((error) => {
            console.log("Error:", error);
            Alert.alert("Username atau password salah!", 'Silahkan coba lagi');
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.topImageContainer}>
                <Image source={require("../assets/bg_atas.png")} style={styles.topImage} />
            </View>
            <View style={styles.logoImageContainer}>
                <Image source={require("../assets/logo.png")} style={styles.logoImage} />
            </View>
            <View style={styles.buttomImageContainer}>
                <Image source={require("../assets/bg_bawah.png")} style={styles.buttomImage} />
            </View>
            <View style={styles.nameContainer}>
                <Image source={require("../assets/user.png")} style={styles.userImage} />
                <TextInput 
                    style={styles.textInput} 
                    placeholder='Nama' 
                    value={username}
                    onChangeText={setUsername} />
            </View>
            <View style={styles.passwordContainer}>
                <Image source={require("../assets/password.png")} style={styles.passwordImage} />
                <TextInput 
                    style={styles.textInput} 
                    placeholder='Sandi' 
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry />
            </View>
            <TouchableOpacity onPress={handleLogin}>
                <View style={styles.loginButtonContainer}>
                    <Text style={styles.loginButton}>MASUK</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default LoginScreen;

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
        height: 570,
        marginTop: -175,
        marginLeft: 0,
    },
    buttomImageContainer: {
        height: 20,
    },
    buttomImage: {
        width: "100%",
        height: 570,
        marginTop: 380,
        marginRight: 5,
    },
    logoImageContainer: {
        height: 20,
    },
    logoImage: {
        width: 110,
        height: 110,
        marginTop: 185,
        alignSelf: 'center',
    },
    nameContainer: {
        backgroundColor: "#F0F0F0",
        flexDirection: "row",
        borderRadius: 20,
        marginHorizontal: 60,
        elevation: 10,
        marginVertical: 20,
        alignItems: "center",
        marginTop: 300,
    },
    userImage: {
        marginLeft: 18,
        marginRight: 10,
        marginTop: 9,
        marginBottom: 10,
        width: 20,
        height: 20,
    },
    textInput: {
        flex: 1,
    },
    passwordContainer: {
        backgroundColor: "#F0F0F0",
        flexDirection: "row",
        borderRadius: 20,
        marginHorizontal: 60,
        elevation: 10,
        marginVertical: 20,
        alignItems: "center",
        marginTop: 15,
    },
    passwordImage: {
        marginLeft: 18,
        marginRight: 10,
        marginTop: 9,
        marginBottom: 10,
        width: 20,
        height: 20,
    },
    loginButtonContainer: {
        backgroundColor: "#196850",
        flexDirection: "row",
        borderRadius: 10,
        marginHorizontal: 135,
        elevation: 10,
        marginVertical: 20,
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 20,
    },
    loginButton: {
        marginTop: 8,
        marginBottom: 9,
        color: "#ffffff",
        alignItems: 'center', 
        justifyContent: 'center',
    },
})
