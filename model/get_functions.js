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
    const userRef = fb.doc(db, 'usersById', uid)
    const userDoc = await fb.getDoc(userRef)
    if(userDoc.exists()){
      const { fullname, email, username, imageurl, uid, gender, size, phone} = userDoc.data()
      return { fullname, email, username, imageurl, uid, gender, size ,phone}
    }
    else{
      console.log("error")
    }
    return null
}

export async function getPostDetails(pid) {
  const postRef = fb.doc(db, 'posts', pid)
  const postDoc = await fb.getDoc(postRef)
  if(postDoc.exists()){
    const { imageurl, postid, publisher, type,items} = postDoc.data()
    return { imageurl, postid, publisher, type, items}
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
      return userDoc.data().postCount
  }
  else{
      console.log("error in countPosts")
  }
  return null
}

export async function getFollowersAndFollowingCount(uid) {
  const userRef = fb.doc(db, 'follows', uid);
  try {
    const userSnapshot = await fb.getDoc(userRef);
    if (userSnapshot.exists()) {
      const userDocData = userSnapshot.data();
      const followersCount = Object.keys(userDocData.followers || {}).length;
      const followingCount = Object.keys(userDocData.following || {}).length;
      return (`${followersCount},${followingCount}`).toString();
    } else {
      return "0,0";
    }
  } catch (error) {
    console.error("Error retrieving followers and following count: ", error);
    return "0,0";
  }
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



export async function checkFollows(uid, pid) {
  try {
    const userRef = fb.doc(db, 'follows', uid);
    const userSnapshot = await fb.getDoc(userRef);
    if (userSnapshot.exists()) {
      const userDocData = userSnapshot.data();
      const following = userDocData.following || {};      
      if (following.hasOwnProperty(pid)) {
        return "following";
      } else {
        return "follow";
      }
    } else {
      return "follow";
    }
  } catch (error) {
    console.error("Error checking follows: ", error);
  }
}

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
      const postSnapshot = await fb.getDoc(postRef)
      return postSnapshot.data();
    })
  );
  return posts;
}

export async function homePosts() {
  const userSnapshot = await fb.getDocs(fb.collection(db, 'posts'));
  const userListFromDB = userSnapshot.docs || [];
  const userList = userListFromDB.map(doc => {
    const {description, imageurl,  postid,  publisher, store, price, type} = doc.data();
    return {description, imageurl,  postid,  publisher, store, price, type};
  });
  return userList;
}

export async function homeUsers() {
  const userSnapshot = await fb.getDocs(fb.collection(db, 'usersById'));
  const userListFromDB = userSnapshot.docs || [];
  const userList = userListFromDB.map(doc => {
    const {phone,uid,email,username,imageurl,fullname} = doc.data();
    return {phone,uid,email,username,imageurl,fullname};
  });
  return userList;
}

export async function getFollowings(uid) {
  const userRef = fb.doc(db, 'follows', uid);
  try {
    const userSnapshot = await fb.getDoc(userRef);
    if (userSnapshot.exists()) {
      const userDocData = userSnapshot.data();
      const followingList = Object.keys(userDocData.following || {});
      if(followingList.length === 0) {
        return [uid];
      }
      console.log(followingList);
      return followingList;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error retrieving followings: ", error);
    return [];
  }
}

export async function getFollowers(uid) {
  const userRef = fb.doc(db, 'follows', uid);
  try {
    const userSnapshot = await fb.getDoc(userRef);
    if (userSnapshot.exists()) {
      const userDocData = userSnapshot.data();
      const followersList = Object.keys(userDocData.followers || {});
      return followersList;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error retrieving followers: ", error);
    return [];
  }
}

export async function getPostItems(pid) {
  try {
    const postRef = fb.doc(db, 'posts', pid)
    const postSnapshot = await fb.getDoc(postRef)
      if (!postSnapshot.exists) {
      throw new Error('Post not found');
    }
    // Retrieve and return the items
    const postData = postSnapshot.data();
    const items = postData.items;
    console.log('Items:', items);
    return items;
  } catch (error) {
    // Handle any errors
    console.error('Error retrieving post items:', error);
    throw error;
  }
}

