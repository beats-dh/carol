import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, runTransaction, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyDFTD9rCExWP2ANKkNNnOjqK1EhFG8mpUw',
    authDomain: 'carol-460e2.firebaseapp.com',
    databaseURL: 'https://carol-460e2-default-rtdb.firebaseio.com/',
    projectId: 'carol-460e2',
    storageBucket: 'carol-460e2.appspot.com',
    messagingSenderId: '540435324211',
    appId: '1:540435324211:web:468f0a630694e7aad03246',
    measurementId: 'G-72Q9NN9JDJ'
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth, ref, onValue, runTransaction, set };