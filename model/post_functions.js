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

export async function deletePost(pid, publisher, uid) {
  const postRef = fb.doc(db, 'posts', pid)
  const postSnapshot = await fb.getDoc(postRef);
  if (postSnapshot.exists() && postSnapshot.data().publisher === uid) {
    await fb.deleteDoc(postRef);    
    console.log('Post deleted successfully.');
  } else {
    console.log('Post not deleted. Publisher does not match current user.');
  }
  return "done"
}

export async function editProfile(uid, gender, size, username, fullname, imageurl) {
  try {
    await fb.updateDoc(fb.doc(db, "usersById", uid), 
    {
      username: username,
      fullname: fullname, 
      gender: gender,
      size: size,
      imageurl: imageurl
    });    
    console.log(`user ${username} updated successfully.`);
  } catch (error) {
    console.error('Error updating user:', error);
  }
  return "done"
}

export async function addUser(username, fullName, email, phone, password) {
  try {
    const authUser = await admin.auth().createUser({ email, password });
    await fb.setDoc(fb.doc(db, "usersById", authUser.uid), 
    {
      uid: authUser.uid,
      email: email,
      username: username,
      fullname: fullName || '', // assign an empty string if fullName is undefined
      phone: phone || '', // assign an empty string if phone is undefined
      postCount: 0,
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

export async function makePost(imageUrl, description, store, price, type, uid) {
  const userRef = fb.doc(db, 'usersById', uid)
  const userDoc = await fb.getDoc(userRef)
  if(userDoc.exists()){
      const numPosts = userDoc.data().postCount + 1
      await fb.updateDoc(userRef, {postCount: numPosts})
  }
  else{
      console.log("error in make post")
  }
  try {
    const docRef = await fb.addDoc(fb.collection(db, "posts"), 
    {
      imageurl: imageUrl,
      description: description,
      store: store,
      price: price, 
      type: type, 
      publisher: uid,
      postid: ''
    });
    const docKey = docRef.id;
    await fb.updateDoc(docRef, {postid: docKey})
  } catch (error) {
    console.error('Error post:', error);
  }
  return "done"
}

export async function savePost(uid, pid) {
  try {
    const userRef = fb.doc(db, 'saves', uid)
    const userSnapshot = await fb.getDoc(userRef);
    if (userSnapshot.exists() && userSnapshot.data().hasOwnProperty([pid])) {
      await fb.deleteDoc(userRef);
      console.log("Post removed successfully!");
    } else {
      await fb.setDoc(fb.doc(db, "saves", uid), {[pid]: true});  
      console.log("Post saved successfully!");
    }
  } catch (error) {
    console.error("Error saving/removing post: ", error);
  }
  return "done"
}
