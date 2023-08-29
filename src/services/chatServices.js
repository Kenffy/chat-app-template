import { auth, firestore as db, storage } from "../config/dbconfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  arrayUnion,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  orderBy,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";

// users
export const createUserAsync = async (creds) => {
  try {
    const user = {
      username: creds.username,
      email: creds.email,
      desc: "Hello from my country 😀",
      profile: "",
      createdAt: serverTimestamp(),
    };
    return await setDoc(doc(db, "users", creds.uid), user);
  } catch (error) {
    console.log(error);
  }
};

export const updateUserAsync = async (updatedUser, data) => {
  try {
    const creds = auth.currentUser;
    const userDoc = doc(db, "users", creds.uid);
    if (data.profile) {
      const location = `/images/users/${creds.uid}/profile/`;
      const urls = await uploadFiles([data.profile], location);
      if (urls.length > 0) {
        updatedUser.profile = urls[0];
        await updateProfile(creds, {
          photoURL: urls[0].url,
          displayName: updatedUser.username,
        });
      }
    }
    await updateDoc(userDoc, updatedUser);
    const snapshot = await getDoc(userDoc);
    return getSnapshotData(snapshot);
  } catch (error) {
    console.log(error);
  }
};

export const deleteUserAsync = async (id) => {
  try {
    const userDoc = doc(db, "users", id);
    const res = await deleteDoc(userDoc);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getUsersAsync = async (user) => {
  if (!user) return;

  try {
    const snapshot = await getDocs(
      query(collection(db, "users"), where("username", "!=", user.username))
    );

    const users = snapshot.docs.map((doc) => getSnapshotData(doc));
    return users;
  } catch (error) {
    console.log(error);
  }
};

export const getUserAsync = async (id) => {
  try {
    const userDoc = doc(db, "users", id);
    const snapshot = await getDoc(userDoc);
    return getSnapshotData(snapshot);
  } catch (error) {
    console.log(error);
  }
};

// Conversations
export const createConversationAsync = async (user, friendId) => {
  try {
    const conv = {
      members: [user.uid, friendId],
      last: { message: "", createdAt: null },
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "conversations"), conv);
    const convId = docRef.id;
    let result;
    if (convId) {
      const userDoc = doc(db, "users", friendId);
      const res_user = await getDoc(userDoc);
      let user_data = getSnapshotData(res_user);
      const res_conv = await getDoc(docRef);
      if (res_conv) {
        result = {
          ...res_conv.data(),
          id: convId,
          friend: {
            id: user_data.id,
            username: user_data.username,
            profile: user_data.profile,
          },
        };
      }
    }
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getUserConversationsAsync = async (user) => {
  try {
    const snapshots = await getDocs(
      query(
        collection(db, "conversations"),
        where("members", "array-contains", user.uid)
      )
    );

    let conversations = [];

    for (const covDoc of snapshots.docs) {
      let conv = getSnapshotData(covDoc);
      if (conv) {
        const friendId = conv.members.find((u) => u !== user.uid);
        const res = await getDoc(doc(db, "users", friendId));
        const usr = res.data();

        conversations.push({
          ...conv,
          friend: {
            id: friendId,
            username: usr.username,
            profile: usr.profile,
          },
        });
      }
    }
    return conversations;
  } catch (error) {
    console.log(error);
  }
};

export const createMessageAsync = async (message, data) => {
  try {
    if (data.images.length > 0) {
      const location = `/images/messages/${message.conversationId}/`;
      const urls = await uploadFiles(data.images, location);
      if (urls.length > 0) {
        message.images = arrayUnion(...urls);
      }
    } else {
      message.images = arrayUnion();
    }
    if (data.audio) {
      const location = `/audios/messages/${message.conversationId}/`;
      const urls = await uploadFiles([data.audio], location);
      if (urls.length > 0) {
        message.audio = urls[0];
      }
    }
    const newMessage = {
      ...message,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, "messages"), newMessage);
    const messageId = docRef.id;
    if (messageId) {
      const msg_res = await getDoc(docRef);
      const msg = getSnapshotData(msg_res);
      if (msg) {
        const convDoc = doc(db, "conversations", message.conversationId);
        await updateDoc(convDoc, {
          last: { message: msg.message, createdAt: msg.createdAt },
        });
      }
      return msg;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getMessageByConversationId = async (convId) => {
  try {
    const snapshots = await getDocs(
      query(
        collection(db, "messages"),
        where("conversationId", "==", convId),
        orderBy("createdAt", "asc")
      )
    );
    let messages = [];
    for (const d of snapshots.docs) {
      const msg = getSnapshotData(d);
      if (msg) {
        messages.push(msg);
      }
    }
    return messages;
  } catch (error) {
    console.log(error);
  }
};

export const getMsgQueryByConversationId = (convId) => {
  return query(
    collection(db, "messages"),
    where("conversationId", "==", convId),
    orderBy("createdAt", "asc")
  );
};

const uploadFiles = async (files, location) => {
  let filesUrls = [];
  for (const item of files) {
    const storageRef = ref(storage, `${location}${item.filename}`);
    const uploadTask = await uploadBytes(storageRef, item.file);
    const downloadURL = await getDownloadURL(uploadTask.ref);
    filesUrls.push({
      origin: item.origin,
      filename: item.filename,
      url: downloadURL,
    });
  }
  return filesUrls;
};

export const getSnapshotData = (snapshot) => {
  if (!snapshot.exists) return undefined;
  const data = snapshot.data();
  return { ...data, id: snapshot.id };
};
