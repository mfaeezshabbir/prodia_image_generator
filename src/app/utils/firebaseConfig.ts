// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_AXyJV6M4A-P9RcJIyxZwSMDjP5q3R2U",
  authDomain: "pearlgen.firebaseapp.com",
  projectId: "pearlgen",
  storageBucket: "pearlgen.appspot.com",
  messagingSenderId: "596719886609",
  appId: "1:596719886609:web:064280a49521bd600b2cb0",
  measurementId: "G-BPYDHSPWKP",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
