import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../config/dbconfig";
import { createUserAsync } from "./services";

export async function loginAsync(creds) {
  return await signInWithEmailAndPassword(auth, creds.email, creds.password);
}

export async function logoutAsync() {
  return await signOut(auth);
}

export async function registerAsync(creds) {
  try {
    const result = await createUserWithEmailAndPassword(
      auth,
      creds.email,
      creds.password
    );
    await sendEmailVerification(auth.currentUser);
    if (result.user) {
      await updateProfile(result.user, {
        displayName: creds.username,
      });
      await createUserAsync({ ...creds, uid: result.user.uid });
    }
  } catch (error) {
    throw error;
  }
}
