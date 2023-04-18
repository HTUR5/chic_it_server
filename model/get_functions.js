import { initializeApp } from 'firebase/app';
import * as fb from 'firebase/firestore'
import 'firebase/auth';
import 'firebase/firestore'
import { where } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyBrcpckvsh7oBhIn0q1rt2sPlDY7kKwtEM",
    authDomain: "chicit-a5e00.firebaseapp.com",
    databaseURL: "https://chicit-a5e00-default-rtdb.firebaseio.com",
    projectId: "chicit-a5e00",
  };

const fireBaseRef = initializeApp(firebaseConfig);
const db = fb.getFirestore(fireBaseRef);