
import firebase from "firebase";
  
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCQ6EBAMv11qmF9ovbetOZbMeQWQydJnqo",
    authDomain: "xiaohongpu-8cafe.firebaseapp.com",
    projectId: "xiaohongpu-8cafe",
    storageBucket: "xiaohongpu-8cafe.appspot.com",
    messagingSenderId: "825272032341",
    appId: "1:825272032341:web:e490725a8c89f7c52b08dc"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage }