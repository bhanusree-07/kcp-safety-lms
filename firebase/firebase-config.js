// Firebase Imports

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Firebase Configuration

const firebaseConfig = {

    apiKey: "AIzaSyB8E4_5aeAitI7T4S0iqvSdrEWkUU029zc",

    authDomain: "kcp-safety-lms.firebaseapp.com",

    projectId: "kcp-safety-lms",

    storageBucket: "kcp-safety-lms.firebasestorage.app",

    messagingSenderId: "238126092746",

    appId: "1:238126092746:web:e564b1030522c31b753f33"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


// Export Auth

export { auth };
