import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDs66pV3b8aYywNjfl4E-HGSEybXwgKE8I",
  authDomain: "chat-a3478.firebaseapp.com",
  projectId: "chat-a3478",
  storageBucket: "chat-a3478.appspot.com",
  messagingSenderId: "324541564163",
  appId: "1:324541564163:web:037b6ef439f309c0b89536"
};
export const app = initializeApp(firebaseConfig);
export  const auth =getAuth();
export const db=getFirestore();
export const storage =getStorage();
