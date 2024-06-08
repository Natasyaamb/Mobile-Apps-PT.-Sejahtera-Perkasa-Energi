import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBp5RbdOowAzNy8du0_eDwVaE9wgC_0Wag",
  authDomain: "pti-project-2.firebaseapp.com",
  projectId: "pti-project-2",
  storageBucket: "pti-project-2.appspot.com",
  messagingSenderId: "630895776045",
  appId: "1:630895776045:web:2ca4b7ab89675f471e03a4",
  measurementId: "G-XWFQPV9ZM2"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

export { auth };