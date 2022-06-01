import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlbdCW3syD_iKZvlCBzpI0zLnbjG98i4g",
  authDomain: "proxy-gg-talent-dashboard.firebaseapp.com",
  databaseURL: "https://proxy-gg-talent-dashboard-default-rtdb.firebaseio.com",
  projectId: "proxy-gg-talent-dashboard",
  storageBucket: "proxy-gg-talent-dashboard.appspot.com",
  messagingSenderId: "259307695265",
  appId: "1:259307695265:web:7cb049c7f3cd2d0a52d4e0"
};

// Initialize Firebase
export const firebaseApp = console.log('[firebase/app] Initializing') ?? initializeApp(firebaseConfig);
