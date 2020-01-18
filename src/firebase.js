import firebase from "firebase";

const config = {
    apiKey: "AIzaSyAz4UZcjFTcLN6aMv_lkiLe-Di4AE5Sxtc",
    authDomain: "board-451e3.firebaseapp.com",
    databaseURL: "https://board-451e3.firebaseio.com",
    projectId: "board-451e3",
    storageBucket: "board-451e3.appspot.com",
    messagingSenderId: "930905737189",
    appId: "1:930905737189:web:fac4b63c1d1a0b2217510c",
    measurementId: "G-JR2BLLTQHQ"
};

// Initialize Firebase
firebase.initializeApp(config);
// const firestore = firebase.firestore();
// const settings = { timestampsInSnapshots:true };
// firestore.settings(settings);

export default firebase;


