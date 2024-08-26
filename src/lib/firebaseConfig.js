import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, runTransaction, set } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDeqO6stYE_T2DsF_R8wBybeQhp2TOwLNw",
    authDomain: "carol-7bc52.firebaseapp.com",
    databaseURL: "https://carol-7bc52-default-rtdb.firebaseio.com",
    projectId: "carol-7bc52",
    storageBucket: "carol-7bc52.appspot.com",
    messagingSenderId: "16401718726",
    appId: "1:16401718726:web:2378a4564c01d6c92b66c7",
    measurementId: "G-D0K5C62RWL"
};

// Verifica se o aplicativo Firebase já foi inicializado
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth, ref, onValue, runTransaction, set };
