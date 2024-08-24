import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_dHpWh9bZQDEvaeP951xNnqNNN3usgqw",
  authDomain: "bawarchicraters.firebaseapp.com",
  projectId: "bawarchicraters",
  storageBucket: "bawarchicraters.appspot.com",
  messagingSenderId: "441662654099",
  appId: "1:441662654099:web:22d2522df18b99a86faf66",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
