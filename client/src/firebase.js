import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTHD,
    projectId: process.env.REACT_APP_FIREBASE_PID,
    storageBucket: process.env.REACT_APP_FIREBASE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_SENDERID,
    appId: process.env.REACT_APP_FIREBASE_APPID,
  };

  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
 