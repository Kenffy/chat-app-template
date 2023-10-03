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
  Timestamp,
  startAfter,
  //startAt,
  //onSnapshot,
  query,
  orderBy,
  limit,
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
      description: "Hello from my country 😀",
      isAdmin: false,
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
      const urls = await uploadImages([data.profile], location);
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
    return dataFromSnapshot(snapshot);
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

    const users = snapshot.docs.map((doc) => dataFromSnapshot(doc));
    return users;
  } catch (error) {
    console.log(error);
  }
};

export const getUserAsync = async (id) => {
  try {
    const userDoc = doc(db, "users", id);
    const snapshot = await getDoc(userDoc);
    return dataFromSnapshot(snapshot);
  } catch (error) {
    console.log(error);
  }
};

// Conversations
export const createConversationAsync = async (userId, friendId) => {
  try {
    const conv = {
      members: [userId, friendId],
      last: { message: "", createdAt: null },
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "conversations"), conv);
    const convId = docRef.id;
    let result;
    if (convId) {
      const userDoc = doc(db, "users", friendId);
      const res_user = await getDoc(userDoc);
      let user_data = dataFromSnapshot(res_user);
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

export const deleteConversationAsync = async (conversationId) => {
  try {
    await deleteMessagesByConversationId(conversationId);
    const convDoc = doc(db, "conversations", conversationId);
    const res = await deleteDoc(convDoc);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getUserConversationsAsync = async (userId) => {
  try {
    const snapshots = await getDocs(
      query(
        collection(db, "conversations"),
        where("members", "array-contains", userId)
      )
    );

    let conversations = [];

    for (const d of snapshots.docs) {
      let conv = dataFromSnapshot(d);
      if (conv) {
        const friendId = conv.members.find((u) => u !== userId);
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
      const urls = await uploadImages(data.images, location);
      if (urls.length > 0) {
        message.images = arrayUnion(...urls);
      }
    } else {
      message.images = arrayUnion();
    }
    if (data.document) {
      const location = `/documents/messages/${message.conversationId}/`;
      const urls = await uploadImages([data.doc], location);
      if (urls.length > 0) {
        message.document = urls[0];
      }
    }
    if (data.audio) {
      const location = `/audios/messages/${message.conversationId}/`;
      const urls = await uploadImages([data.audio], location);
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
      const msg = dataFromSnapshot(msg_res);
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

export const deleteMessageAsync = async (messageId) => {
  try {
    const messageDoc = doc(db, "messages", messageId);
    const res = await deleteDoc(messageDoc);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteConversationMessagesAsync = async (conversationId) => {
  await deleteMessagesByConversationId(conversationId);
};

export const getMessageByConversationId = async (conversationId) => {
  try {
    const snapshots = await getDocs(
      query(
        collection(db, "messages"),
        where("conversationId", "==", conversationId),
        orderBy("createdAt", "asc")
      )
    );
    let messages = [];
    for (const d of snapshots.docs) {
      const msg = dataFromSnapshot(d);
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

export const getConversationQueryByUser = (userId) => {
  return query(
    collection(db, "conversations"),
    where("members", "array-contains", userId)
  );
};

const deleteMessagesByConversationId = async (conversationId) => {
  try {
    const snapshots = await getDocs(
      query(
        collection(db, "messages"),
        where("conversationId", "==", conversationId)
      )
    );
    for (const d of snapshots.docs) {
      await deleteDoc(d.ref);
    }

    const convDoc = doc(db, "conversations", conversationId);
    await updateDoc(convDoc, {
      last: { message: null, createdAt: serverTimestamp() },
    });
  } catch (error) {
    console.log(error);
  }
};

const uploadImages = async (images, location) => {
  let imagesUrls = [];
  for (const image of images) {
    const storageRef = ref(storage, `${location}${image.filename}`);
    const uploadTask = await uploadBytes(storageRef, image.file);
    const downloadURL = await getDownloadURL(uploadTask.ref);
    imagesUrls.push({ filename: image.filename, url: downloadURL });
  }
  return imagesUrls;
};

export const dataFromSnapshot = (snapshot) => {
  if (!snapshot.exists) return undefined;
  const data = snapshot.data();
  return { ...data, id: snapshot.id };
};
