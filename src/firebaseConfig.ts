// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
//import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCOaKa_94NJ6VaC-n21jm32LFKvxFNC24U",
  authDomain: "tagesmutter-hamm-mitte.firebaseapp.com",
  projectId: "tagesmutter-hamm-mitte",
  storageBucket: "tagesmutter-hamm-mitte.appspot.com",
  messagingSenderId: "109517787812",
  appId: "1:109517787812:web:cf577d65485b77843e8c31",
  measurementId: "G-C5RL7ZN99P"
};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const storage = getStorage(app);
