import { initializeApp } from 'firebase/app';
import * as fb from 'firebase/firestore';
import 'firebase/auth';
import 'firebase/firestore';
import { FieldValue } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBrcpckvsh7oBhIn0q1rt2sPlDY7kKwtEM",
    authDomain: "chicit-a5e00.firebaseapp.com",
    databaseURL: "https://chicit-a5e00-default-rtdb.firebaseio.com",
    projectId: "chicit-a5e00",
};

const app = initializeApp(firebaseConfig);
const db = fb.getFirestore(app);

// Use fb instead of db
const usersCollection = fb.collection(db, 'users');

async function addUser(userId, username, fullName, email, phone, password) {
  try {
    const user = await fb.auth().createUser({
      email,
      password
    });

    await fb.setDoc(usersCollection.doc(userId), {
      userId,
      username,
      fullName,
      email,
      phone,
      createdAt: fb.firestore.FieldValue.serverTimestamp()
    });

    return user.uid;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}
