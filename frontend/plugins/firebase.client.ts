import { defineNuxtPlugin } from "#app";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from "firebase/auth";

export default defineNuxtPlugin(() => {
  if (process.server) return; // 🚀 Prevent Firebase from running on the server

  const config = useRuntimeConfig();
  
  console.log("Initializing Firebase on client...");

  const firebaseConfig = {
    apiKey: config.public.FIREBASE_API_KEY,
    authDomain: config.public.FIREBASE_AUTH_DOMAIN,
    projectId: config.public.FIREBASE_PROJECT_ID,
    storageBucket: config.public.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.public.FIREBASE_MESSAGING_SENDER_ID,
    appId: config.public.FIREBASE_APP_ID,
    measurementId: config.public.FIREBASE_MEASUREMENT_ID,
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  return {
    provide: {
      auth,
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      signInWithPopup,
      GoogleAuthProvider: provider,
      signOut
    },
  };
});
