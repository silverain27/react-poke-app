// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjWn9WziZ5u1k1NOTxHxbV2rl7gtcOYH8",
  authDomain: "react-poke-app-22777.firebaseapp.com",
  projectId: "react-poke-app-22777",
  storageBucket: "react-poke-app-22777.appspot.com",
  messagingSenderId: "295274136245",
  appId: "1:295274136245:web:c091512c837b62865ef4fc",
  measurementId: "G-BK5TVMQSX0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app 