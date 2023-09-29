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

export const getAllUsersAsync = async (filter) => {
  try {
    const user = auth.currentUser;
    const pageSize = filter?.limit || 20;

    let snapshot;
    let countDocs;
    const lastDocSnapshot = filter?.lastVisible || null;

    let sort = { prop: "username", value: "asc" };

    if (filter.sort === "Name ASC") {
      sort = { prop: "username", value: "asc" };
    } else if (filter.sort === "Name DESC") {
      sort = { prop: "username", value: "desc" };
    }

    if (user) {
      countDocs = await getDocs(
        query(
          collection(db, "users"),
          where("username", "!=", user.displayName)
        )
      );

      if (lastDocSnapshot) {
        snapshot = await getDocs(
          query(
            collection(db, "users"),
            filter?.filter.length > 0 && where("username", "", filter?.search),
            where("username", "!=", user.displayName),
            orderBy(sort?.prop, sort?.value),
            startAfter(lastDocSnapshot),
            limit(pageSize)
          )
        );
      } else {
        snapshot = await getDocs(
          query(
            collection(db, "users"),
            where("username", "!=", user.displayName),
            orderBy(sort?.prop, sort?.value),
            limit(pageSize)
          )
        );
      }
    } else {
      countDocs = await getDocs(query(collection(db, "users")));

      if (lastDocSnapshot) {
        snapshot = await getDocs(
          query(
            collection(db, "users"),
            orderBy(sort?.prop, sort?.value),
            startAfter(lastDocSnapshot),
            limit(pageSize)
          )
        );
      } else {
        snapshot = await getDocs(
          query(
            collection(db, "users"),
            orderBy(sort?.prop, sort?.value),
            limit(pageSize)
          )
        );
      }
    }

    const lastVisible = snapshot.docs[snapshot.docs.length - 1];
    const users = snapshot.docs.map((doc) => dataFromSnapshot(doc));
    return { users, size: countDocs.docs.length || 0, lastVisible };
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

export const getUserConversationsAsync = async (user) => {
  try {
    const snapshots = await getDocs(
      query(
        collection(db, "conversations"),
        where("members", "array-contains", user.uid)
      )
    );

    let conversations = [];

    for (const d of snapshots.docs) {
      let conv = dataFromSnapshot(d);
      if (conv) {
        const friendId = conv.members.find((u) => u !== user.uid);
        const res = await getDoc(doc(db, "users", friendId));
        const usr = res.data();
        // if (conv?.message) {
        //   conv.message = performDataTimetamp(conv.message);
        // }
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
