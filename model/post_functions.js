import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, setDoc } from 'firebase/firestore';
import { FieldValue } from 'firebase/firestore';
import "firebase/auth"
import admin from 'firebase-admin';
import serviceAccount from './service_account.json' assert { type: "json" };
import * as fb from 'firebase/firestore'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBrcpckvsh7oBhIn0q1rt2sPlDY7kKwtEM",
  authDomain: "chicit-a5e00.firebaseapp.com",
  databaseURL: "https://chicit-a5e00-default-rtdb.firebaseio.com",
  projectId: "chicit-a5e00",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//const usersCollection = fb.collection(db, 'users');

const usersCollection = collection(db, 'users');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://chicit-a5e00-default-rtdb.firebaseio.com'
});


export async function addUser(username, fullName, email, phone, password) {
  try {
    const authUser = await admin.auth().createUser({ email, password });
    await fb.setDoc(fb.doc(db, "usersById", authUser.uid), 
    {
      uid: authUser.uid,
      email: email,
      username: username,
      fullName: fullName || '', // assign an empty string if fullName is undefined
      phone: phone || '', // assign an empty string if phone is undefined
    });    
    console.log(`New user ${username} created successfully.`);
  } catch (error) {
    console.error('Error creating new user:', error);
  }
  return "done"
}



export async function checkIfEmailExists(email) {
  try {
    const q = query(usersCollection, where('email', '==', email));
    const ans = await getDocs(q);
    if (ans.docs.length === 0 ) {
      // do something
    }
  } catch (error) {
    console.error('Error checking if email exists:', error);
  }
}


