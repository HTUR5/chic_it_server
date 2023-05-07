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

// Get user details
export async function getUser(uid) {
    //console.log(uid)
    const userRef = fb.doc(db, 'usersById', uid)
    const userDoc = await fb.getDoc(userRef)
    if(userDoc.exists()){
      const { fullname, email, username, imageurl, uid, gender, size } = userDoc.data()
      //console.log(userDoc.data())
      return { fullname, email, username, imageurl, uid, gender, size }
    }
    else{
      console.log("error")
    }
    return null
}

export async function getPostDetails(pid) {
  //console.log(uid)
  const postRef = fb.doc(db, 'posts', pid)
  const postDoc = await fb.getDoc(postRef)
  if(postDoc.exists()){
    const {description, imageurl, postid, price, publisher, store, type} = postDoc.data()
    //console.log(userDoc.data())
    return {description, imageurl, postid, price, publisher, store, type}
  }
  else{
    console.log("error")
  }
  return null
}

//count groups from each category 
export async function countPost(uid) {
  const userRef = fb.doc(db, 'usersById', uid)
  const userDoc = await fb.getDoc(userRef)
  if(userDoc.exists()){
      //console.log(userDoc.data().postCount)
      return userDoc.data().postCount
  }
  else{
      console.log("error in countPosts")
  }
  return null
}

export async function check(uid, pid) {
  try {
    const userRef = fb.doc(db, 'saves', uid)
    const userSnapshot = await fb.getDoc(userRef);
    if (userSnapshot.exists() && userSnapshot.data().hasOwnProperty([pid])) {
      return "saved"
    } else {
      return "not saved"
    }
  } catch (error) {
    console.error("Error check: ", error);
  }
}

// Get a list of users to the block page 
export async function getMyPhoto(uid) {
    const userSnapshot = await fb.getDocs(fb.collection(db, 'posts'));
    const userListFromDB = userSnapshot.docs || [];
    const filteredUsers = userListFromDB.filter(doc => doc.data().publisher === uid);
    const userList = filteredUsers.map(doc => {
      const {description, imageurl,  postid,  publisher, store, price, type} = doc.data();
      return {description, imageurl,  postid,  publisher, store, price, type};
    });
    return userList;
}

export async function mySavedPosts(uid) {
  const savesRef = fb.doc(db, 'saves', uid)
  const savesSnapshot = await fb.getDoc(savesRef);
  if (!savesSnapshot.exists) {
    return [];
  }
  if (!savesSnapshot.exists || !savesSnapshot.data()) {
    return [];
  }
  const postIds = Object.keys(savesSnapshot.data()).filter((key) => savesSnapshot.get(key) === true);
  const posts = await Promise.all(
    postIds.map(async (postId) => {
      const postRef = fb.doc(db, 'posts', postId)
      console.log("reg")
      const postSnapshot = await fb.getDoc(postRef)
      return postSnapshot.data();
    })
  );
  return posts;
}

export async function homePosts() {
  const userSnapshot = await fb.getDocs(fb.collection(db, 'posts'));
  const userListFromDB = userSnapshot.docs || [];
  //const filteredUsers = userListFromDB.filter(doc => doc.data().publisher === uid);
  const userList = userListFromDB.map(doc => {
    const {description, imageurl,  postid,  publisher, store, price, type} = doc.data();
    return {description, imageurl,  postid,  publisher, store, price, type};
  });
  return userList;
}