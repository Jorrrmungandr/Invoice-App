import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC-gGCl3F2-3PaOSmsm_ac3U0J9hClTQIE",
    authDomain: "invoice-e5198.firebaseapp.com",
    projectId: "invoice-e5198",
    storageBucket: "invoice-e5198.appspot.com",
    messagingSenderId: "290168277608",
    appId: "1:290168277608:web:20c705f7d2f8f95c7bc9dd"
};

const app = firebase.initializeApp(firebaseConfig);

const db = app.firestore();
export default db;