import firebase from "firebase/app";
import "firebase/storage";
import "firebase/database";

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "XXXXXXXXX",
    authDomain: "fema-damage-report.firebaseapp.com",
    databaseURL: "https://fema-damage-report.firebaseio.com",
    projectId: "fema-damage-report",
    storageBucket: "fema-damage-report.appspot.com",
    messagingSenderId: "XXXXXXXX",
    appId: "1:XXXXXXX:web:285a5822bc401a3f472a00",
    measurementId: "G-98S1PXREQ8"
  };

// Initialize Firebase

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const database = firebase.database();

export { firebase, database, storage as default };