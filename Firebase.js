import firebase from "firebase"
import "firebase/storage"


const firebaseConfig = {
    apiKey: "AIzaSyAPZthmcI8W0mkDNiWIjBsjdgHVEYkH8PY",
    authDomain: "fbclonev2.firebaseapp.com",
    projectId: "fbclonev2",
    storageBucket: "fbclonev2.appspot.com",
    messagingSenderId: "77560681954",
    appId: "1:77560681954:web:1c03e5799adddcfd0215bb"
  };


const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
const db = app.firestore();
const storage = firebase.storage();

export { db, storage }