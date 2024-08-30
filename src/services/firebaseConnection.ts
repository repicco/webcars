
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDCZdH1hBrM3mFeE4leqJcbWzIyKPNpdy0",
  authDomain: "webcarros-4483f.firebaseapp.com",
  projectId: "webcarros-4483f",
  storageBucket: "webcarros-4483f.appspot.com",
  messagingSenderId: "1024947527662",
  appId: "1:1024947527662:web:d5bb7fe9bb2ca7d598f8ff"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export {db, auth, storage}