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
  for (const prop in data) {
    if (data.hasOwnProperty(prop)) {
      if (data[prop] instanceof Timestamp) {
        data[prop] = data[prop].toDate();
      }
    }
  }
  return { ...data, id: snapshot.id };
};

export const performDataTimetamp = (data) => {
  for (const prop in data) {
    if (data.hasOwnProperty(prop)) {
      if (data[prop] instanceof Timestamp) {
        data[prop] = data[prop].toDate();
      }
    }
  }
  return data;
};

// users
export const createUserAsync = async (creds) => {
  try {
    const user = {
      username: creds.username,
      email: creds.email,
      description: "Hello from my country 😀",
      isAdmin: false,
      profile: "",
      conversations: arrayUnion(),
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
    if (data.cover) {
      const location = `/images/users/${creds.uid}/cover/`;
      const urls = await uploadImages([data.cover], location);
      if (urls.length > 0) {
        updatedUser.cover = urls[0];
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

export const getSubscriberByUserIdAsync = async (id) => {
  try {
    const userDoc = doc(db, "users", id);
    const snapshot = await getDoc(userDoc);
    const subscriberIds = snapshot.data().subscribers;
    const subscribers = await Promise.all(
      Object.values(subscriberIds).map(async (subId) => {
        return await getUserAsync(subId);
      })
    );
    return subscribers;
  } catch (error) {
    console.log(error);
  }
};

export const getSubscriptionByUserIdAsync = async (id) => {
  try {
    const userDoc = doc(db, "users", id);
    const snapshot = await getDoc(userDoc);
    const subscriptionIds = snapshot.data().subscriptions;
    const subscriptions = await Promise.all(
      Object.values(subscriptionIds).map(async (subId) => {
        return await getUserAsync(subId);
      })
    );
    return subscriptions;
  } catch (error) {
    console.log(error);
  }
};

export const updateUserCoverImageAsync = async (user, data) => {
  try {
    const creds = auth.currentUser;
    const userDoc = doc(db, "users", user.uid);
    if (data.type === "Profile") {
      const location = `/images/users/${user.uid}/profile/`;
      const urls = await uploadImages([data], location);
      if (urls.length > 0) {
        await updateDoc(userDoc, { profile: urls[0] });
        await updateProfile(creds, {
          photoURL: urls[0].url,
        });
      }
    } else if (data.type === "Cover") {
      const location = `/images/users/${user.uid}/cover/`;
      const urls = await uploadImages([data], location);
      if (urls.length > 0) {
        await updateDoc(userDoc, { cover: urls[0] });
      }
    }
    const snapshot = await getDoc(userDoc);
    return dataFromSnapshot(snapshot);
  } catch (error) {
    console.log(error);
  }
};

export const subscribeAsync = async (id) => {
  const creds = auth.currentUser;
  const userDoc = doc(db, "users", creds.uid);
  const friendDoc = doc(db, "users", id);
  const userSnapshot = await getDoc(userDoc);
  const friendSnapshot = await getDoc(friendDoc);
  const user = dataFromSnapshot(userSnapshot);
  const friend = dataFromSnapshot(friendSnapshot);
  if (user && friend) {
    let f_subscribers = friend.subscribers;
    let u_subscriptions = user.subscriptions;

    if (f_subscribers.includes(user.id)) {
      f_subscribers = [...f_subscribers.filter((u) => u !== user.id)];
      u_subscriptions = [...u_subscriptions.filter((u) => u !== id)];
    } else {
      f_subscribers.push(user.id);
      u_subscriptions.push(friend.id);
    }
    await updateDoc(userDoc, { subscriptions: u_subscriptions });
    await updateDoc(friendDoc, { subscribers: f_subscribers });
    return { ...friend, subscribers: f_subscribers };
  }
};
// posts

export const createPostAsync = async (postData, data) => {
  const user = auth.currentUser;
  if (data.images.length > 0) {
    const location = `/images/posts/${user.uid}/`;
    const urls = await uploadImages(data.images, location);
    if (urls.length > 0) {
      postData.images = arrayUnion(...urls);
    }
  } else {
    postData.images = arrayUnion();
  }
  const post = {
    ...postData,
    userId: user.uid,
    likes: arrayUnion(),
    shares: arrayUnion(),
    tags: arrayUnion(...postData.tags),
    comments: arrayUnion(),
    createdAt: serverTimestamp(),
    views: 0,
  };
  const docRef = await addDoc(collection(db, "posts"), post);
  const postId = docRef.id;
  let result;
  if (postId) {
    const userDoc = doc(db, "users", user.uid);
    const res_user = await getDoc(userDoc);
    let user_data = res_user.data();
    const user_posts = [...user_data.posts, postId];
    await updateDoc(userDoc, { posts: user_posts });
    const res_post = await getDoc(docRef);
    if (res_post) {
      result = {
        ...res_post.data(),
        id: postId,
        username: user_data.username,
        profile: user_data.profile,
        cover: user_data.cover,
      };
    }
  }
  return result;
};

export const updatePostAsync = async (updatedPost, data) => {
  if (data.images.length > 0) {
    const location = `/images/posts/${updatedPost.userId}/`;
    const urls = await uploadImages(data.images, location);
    if (urls.length > 0) {
      updatedPost.images.push(...urls);
    }
  }
  const postDoc = doc(db, "posts", updatedPost.id);
  await updateDoc(postDoc, updatedPost);
  const snapshot = await getDoc(postDoc);
  const post = dataFromSnapshot(snapshot);
  if (post) {
    const res = await getDoc(doc(db, "users", updatedPost.userId));
    const usr = res.data();
    return {
      ...post,
      username: usr.username,
      profile: usr.profile,
      cover: usr.cover,
    };
  }
};

export const likePostAsync = async (id, updatedPost) => {
  const postDoc = doc(db, "posts", id);
  await updateDoc(postDoc, updatedPost);
  const snapshot = await getDoc(postDoc);
  const post = dataFromSnapshot(snapshot);
  if (post) {
    const res = await getDoc(doc(db, "users", post.userId));
    const usr = res.data();
    return {
      ...post,
      username: usr.username,
      profile: usr.profile,
      cover: usr.cover,
    };
  }
};

export const deletePostAsync = async (postId, userId) => {
  await deleteDoc(doc(db, "posts", postId));
  const userDoc = doc(db, "users", userId);
  const snapshot = await getDoc(userDoc);
  const user = snapshot.data();
  if (user) {
    const updatedUser = { posts: user.posts.filter((i) => i !== postId) };
    await updateDoc(userDoc, updatedUser);
    return "Post deleted successfully.";
  }
};

export const getAllPostsAsync = async (filter) => {
  try {
    let sort = { prop: "createdAt", value: "desc" };

    if (filter.sort === "Date ASC") {
      sort = { prop: "createdAt", value: "asc" };
    } else if (filter.sort === "Date DESC") {
      sort = { prop: "createdAt", value: "desc" };
    } else if (filter.sort === "Categories") {
      sort = { prop: "category", value: "desc" };
    }

    const pageSize = filter?.limit || 10;
    const lastDocSnapshot = filter?.lastVisible || null;

    let snapshot;
    let countDocs;
    if (filter?.category === "All" || filter?.category === "Others") {
      countDocs = await getDocs(
        query(collection(db, "posts"), where("status", "==", "Public"))
      );

      if (lastDocSnapshot) {
        snapshot = await getDocs(
          query(
            collection(db, "posts"),
            where("status", "==", "Public"),
            orderBy(sort?.prop, sort?.value),
            startAfter(lastDocSnapshot),
            limit(pageSize)
          )
        );
      } else {
        snapshot = await getDocs(
          query(
            collection(db, "posts"),
            where("status", "==", "Public"),
            orderBy(sort?.prop, sort?.value),
            limit(pageSize)
          )
        );
      }
    } else {
      if (filter.sort === "Categories") {
        countDocs = await getDocs(
          query(
            collection(db, "posts"),
            where("status", "==", "Public"),
            orderBy(sort?.prop, sort?.value)
          )
        );

        if (lastDocSnapshot) {
          snapshot = await getDocs(
            query(
              collection(db, "posts"),
              where("status", "==", "Public"),
              orderBy(sort?.prop, sort?.value),
              startAfter(lastDocSnapshot),
              limit(pageSize)
            )
          );
        } else {
          snapshot = await getDocs(
            query(
              collection(db, "posts"),
              where("status", "==", "Public"),
              orderBy(sort?.prop, sort?.value),
              limit(pageSize)
            )
          );
        }
      } else {
        countDocs = await getDocs(
          query(
            collection(db, "posts"),
            where("status", "==", "Public"),
            where("category", "==", filter?.category),
            orderBy(sort?.prop, sort?.value)
          )
        );

        if (lastDocSnapshot) {
          snapshot = await getDocs(
            query(
              collection(db, "posts"),
              where("status", "==", "Public"),
              where("category", "==", filter?.category),
              orderBy(sort?.prop, sort?.value),
              startAfter(lastDocSnapshot),
              limit(pageSize)
            )
          );
        } else {
          snapshot = await getDocs(
            query(
              collection(db, "posts"),
              where("status", "==", "Public"),
              where("category", "==", filter?.category),
              orderBy(sort?.prop, sort?.value),
              limit(pageSize)
            )
          );
        }
      }
    }
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];
    let posts = [];

    for (const d of snapshot.docs) {
      const post = dataFromSnapshot(d);
      if (post) {
        const res = await getDoc(doc(db, "users", post.userId));
        const usr = res.data();
        posts.push({
          ...post,
          username: usr.username,
          profile: usr.profile,
          cover: usr.cover,
        });
      }
    }
    return { posts, size: countDocs.docs.length || 0, lastVisible };
  } catch (error) {
    console.log(error);
  }
};

export const getOtherUserPostsAsync = async (userId, postId) => {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "posts"),
        limit(4),
        where("userId", "==", userId),
        where("status", "==", "Public")
      )
    );
    let posts = [];

    const res = await getDoc(doc(db, "users", userId));
    const usr = res.data();
    for (const d of snapshot.docs) {
      const post = dataFromSnapshot(d);
      if (post) {
        posts.push({
          ...post,
          username: usr.username,
          profile: usr.profile,
          cover: usr.cover,
        });
      }
    }
    return posts.filter((p) => p.id !== postId);
  } catch (error) {}
};

export const getPostsByUserIdAsync = async (userId, authId, filter) => {
  try {
    let sort = { prop: "createdAt", value: "desc" };

    if (filter.sort === "Date ASC") {
      sort = { prop: "createdAt", value: "asc" };
    } else if (filter.sort === "Date DESC") {
      sort = { prop: "createdAt", value: "desc" };
    } else if (filter.sort === "Categories") {
      sort = { prop: "category", value: "desc" };
    }

    const pageSize = filter?.limit || 10;
    const lastDocSnapshot = filter?.lastVisible || null;

    let q;
    let countDocs;
    const res = await getDoc(doc(db, "users", userId));
    const usr = res.data();
    if (userId === authId) {
      if (filter?.category === "All" || filter?.category === "Others") {
        countDocs = await getDocs(
          query(
            collection(db, "posts"),
            where("userId", "==", userId),
            where("status", "==", filter?.status),
            orderBy(sort?.prop, sort?.value)
          )
        );

        if (lastDocSnapshot) {
          q = query(
            collection(db, "posts"),
            where("userId", "==", userId),
            where("status", "==", filter?.status),
            orderBy(sort?.prop, sort?.value),
            startAfter(lastDocSnapshot),
            limit(pageSize)
          );
        } else {
          q = query(
            collection(db, "posts"),
            where("userId", "==", userId),
            where("status", "==", filter?.status),
            orderBy(sort?.prop, sort?.value),
            limit(pageSize)
          );
        }
      } else {
        if (filter.sort === "Categories") {
          countDocs = await getDocs(
            query(
              collection(db, "posts"),
              where("userId", "==", userId),
              where("status", "==", filter?.status),
              orderBy(sort?.prop, sort?.value)
            )
          );

          if (lastDocSnapshot) {
            q = query(
              collection(db, "posts"),
              where("userId", "==", userId),
              where("status", "==", filter?.status),
              orderBy(sort?.prop, sort?.value),
              startAfter(lastDocSnapshot),
              limit(pageSize)
            );
          } else {
            q = query(
              collection(db, "posts"),
              where("userId", "==", userId),
              where("status", "==", filter?.status),
              orderBy(sort?.prop, sort?.value),
              limit(pageSize)
            );
          }
        } else {
          countDocs = await getDocs(
            query(
              collection(db, "posts"),
              where("userId", "==", userId),
              where("status", "==", filter?.status),
              where("category", "==", filter?.category),
              orderBy(sort?.prop, sort?.value)
            )
          );

          if (lastDocSnapshot) {
            q = query(
              collection(db, "posts"),
              where("userId", "==", userId),
              where("status", "==", filter?.status),
              where("category", "==", filter?.category),
              orderBy(sort?.prop, sort?.value),
              startAfter(lastDocSnapshot),
              limit(pageSize)
            );
          } else {
            q = query(
              collection(db, "posts"),
              where("userId", "==", userId),
              where("status", "==", filter?.status),
              where("category", "==", filter?.category),
              orderBy(sort?.prop, sort?.value),
              limit(pageSize)
            );
          }
        }
      }
    } else {
      if (filter?.category === "All" || filter?.category === "Others") {
        if (usr?.subscribers.includes(authId)) {
          countDocs = await getDocs(
            query(
              collection(db, "posts"),
              where("userId", "==", userId),
              where("status", "!=", "Private")
            )
          );

          if (lastDocSnapshot) {
            q = query(
              collection(db, "posts"),
              where("userId", "==", userId),
              where("status", "!=", "Private"),
              orderBy("status", "desc"),
              orderBy(sort?.prop, sort?.value),
              startAfter(lastDocSnapshot),
              limit(pageSize)
            );
          } else {
            q = query(
              collection(db, "posts"),
              where("userId", "==", userId),
              where("status", "!=", "Private"),
              orderBy("status", "desc"),
              orderBy(sort?.prop, sort?.value),
              limit(pageSize)
            );
          }
        } else {
          countDocs = await getDocs(
            query(
              collection(db, "posts"),
              where("userId", "==", userId),
              where("status", "==", "Public"),
              orderBy(sort?.prop, sort?.value)
            )
          );

          if (lastDocSnapshot) {
            q = query(
              collection(db, "posts"),
              where("userId", "==", userId),
              where("status", "==", "Public"),
              orderBy(sort?.prop, sort?.value),
              startAfter(lastDocSnapshot),
              limit(pageSize)
            );
          } else {
            q = query(
              collection(db, "posts"),
              where("userId", "==", userId),
              where("status", "==", "Public"),
              orderBy(sort?.prop, sort?.value)
            );
          }
        }
      } else {
        if (usr?.subscribers.includes(authId)) {
          countDocs = await getDocs(
            query(
              collection(db, "posts"),
              where("userId", "==", userId),
              where("category", "==", filter?.category),
              where("status", "!=", "Private")
            )
          );

          if (lastDocSnapshot) {
            q = query(
              collection(db, "posts"),
              where("userId", "==", userId),
              where("status", "!=", "Private"),
              where("category", "==", filter?.category),
              orderBy("status", "desc"),
              orderBy(sort?.prop, sort?.value),
              startAfter(lastDocSnapshot),
              limit(pageSize)
            );
          } else {
            q = query(
              collection(db, "posts"),
              where("userId", "==", userId),
              where("status", "!=", "Private"),
              where("category", "==", filter?.category),
              orderBy("status", "desc"),
              orderBy(sort?.prop, sort?.value),
              limit(pageSize)
            );
          }
        } else {
          countDocs = await getDocs(
            query(
              collection(db, "posts"),
              where("userId", "==", userId),
              where("status", "==", "Public"),
              where("category", "==", filter?.category),
              orderBy(sort?.prop, sort?.value)
            )
          );

          if (lastDocSnapshot) {
            q = query(
              collection(db, "posts"),
              where("userId", "==", userId),
              where("status", "==", "Public"),
              where("category", "==", filter?.category),
              orderBy(sort?.prop, sort?.value),
              startAfter(lastDocSnapshot),
              limit(pageSize)
            );
          } else {
            q = query(
              collection(db, "posts"),
              where("userId", "==", userId),
              where("status", "==", "Public"),
              where("category", "==", filter?.category),
              orderBy(sort?.prop, sort?.value)
            );
          }
        }
      }
    }

    const snapshot = await getDocs(q);
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];
    let posts = [];

    for (const d of snapshot.docs) {
      const post = dataFromSnapshot(d);
      if (post) {
        posts.push({
          ...post,
          username: usr.username,
          profile: usr.profile,
          cover: usr.cover,
        });
      }
    }
    return { posts, size: countDocs.docs.length || 0, lastVisible };
  } catch (error) {
    console.log(error);
  }
};

export const getPostAsync = async (id) => {
  try {
    const postDoc = doc(db, "posts", id);

    const snapshot = await getDoc(postDoc);
    const post = dataFromSnapshot(snapshot);
    if (post) {
      await updateDoc(postDoc, { views: post.views + 1 });
      const res = await getDoc(doc(db, "users", post.userId));
      const usr = res.data();
      return {
        ...post,
        username: usr.username,
        profile: usr.profile,
        cover: usr.cover,
      };
    }
  } catch (error) {
    console.log(error);
  }
};

export const createCommentAsync = async (commentData) => {
  const comment = {
    ...commentData,
    likes: arrayUnion(),
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, "comments"), comment);
  const commentId = docRef.id;

  const postDoc = doc(db, "posts", comment.postId);
  const res_post = await getDoc(postDoc);
  let post_data = res_post.data();
  post_data.comments.push(commentId);
  await updateDoc(postDoc, post_data);
  const snapshot = await getDoc(docRef);
  const savedComment = dataFromSnapshot(snapshot);
  if (savedComment) {
    const res = await getDoc(doc(db, "users", savedComment.userId));
    const usr = res.data();
    return {
      ...savedComment,
      username: usr.username,
      profile: usr.profile,
      cover: usr.cover,
    };
  }
};

export const updateCommentAsync = async (id, updatedComment) => {
  const commentDoc = doc(db, "comments", id);
  await updateDoc(commentDoc, updatedComment);
  const snapshot = await getDoc(commentDoc);
  const comment = dataFromSnapshot(snapshot);
  if (comment) {
    const res = await getDoc(doc(db, "users", comment.userId));
    const usr = res.data();
    return {
      ...comment,
      username: usr.username,
      profile: usr.profile,
      cover: usr.cover,
    };
  }
};

export const likeCommentAsync = async (id, updatedComment) => {
  const commentDoc = doc(db, "comments", id);
  await updateDoc(commentDoc, updatedComment);
  const snapshot = await getDoc(commentDoc);
  const comment = dataFromSnapshot(snapshot);
  if (comment) {
    const res = await getDoc(doc(db, "users", comment.userId));
    const usr = res.data();
    return {
      ...comment,
      username: usr.username,
      profile: usr.profile,
      cover: usr.cover,
    };
  }
};

export const deleteCommentAsync = async (id, postId) => {
  await deleteDoc(doc(db, "comments", id));
  const postDoc = doc(db, "posts", postId);
  const snapshot = await getDoc(postDoc);
  const post = snapshot.data();
  if (post) {
    const updatedPost = { comments: post.comments.filter((i) => i !== id) };
    await updateDoc(postDoc, updatedPost);
    return "Comment deleted successfully.";
  }
};

export const getAllCommentAsync = async (postId) => {
  try {
    const snapshot = await getDocs(
      query(collection(db, "comments"), where("postId", "==", postId))
    );
    let comments = [];

    for (const d of snapshot.docs) {
      const comment = dataFromSnapshot(d);
      if (comment) {
        const res = await getDoc(doc(db, "users", comment.userId));
        const usr = res.data();
        comments.push({
          ...comment,
          username: usr.username,
          profile: usr.profile,
          cover: usr.cover,
        });
      }
    }
    return comments;
  } catch (error) {
    console.log(error);
  }
};

export const getCommentAsync = async (id) => {
  try {
    const commentDoc = doc(db, "comments", id);
    const snapshot = await getDoc(commentDoc);
    const comment = dataFromSnapshot(snapshot);
    if (comment) {
      const res = await getDoc(doc(db, "users", comment.userId));
      const usr = res.data();
      return {
        ...comment,
        username: usr.username,
        profile: usr.profile,
        cover: usr.cover,
      };
    }
  } catch (error) {
    console.log(error);
  }
};

// Conversations
export const createConversationAsync = async (friendId) => {
  try {
    const user = auth.currentUser;
    //const snapshot = await getDoc(query(collection(db, "conversations"), where("members", "in", [user.uid, friendId])));

    const conv = {
      members: [user.uid, friendId],
      message: "",
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

export const getUserConversationsAsync = async () => {
  try {
    const user = auth.currentUser;
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
        if (conv?.message) {
          conv.message = performDataTimetamp(conv.message);
        }
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

// export const getUserConversationByIdAsync = async(id)=>{
//     try {
//         const user = auth.currentUser;
//         const snapshots = await getDoc((collection(db, "conversations", id)));

//         let conversations = [];

//         for(const d of snapshots.docs){
//             const conv = dataFromSnapshot(d);
//             if(conv){
//                 const friendId = conv.members.find(u=>u !== user.uid);
//                 const res = await getDoc(doc(db, "users", friendId));
//                 const usr = res.data();
//                 conversations.push({
//                     ...conv,
//                     friend:{
//                         id: friendId,
//                         username: usr.username,
//                         profile: usr.profile,
//                     }
//                 });
//             }
//         }
//         return conversations;
//     } catch (error) {
//         console.log(error)
//     }
// }

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
    if (data.doc) {
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
        await updateDoc(convDoc, { message: msg });
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
