// Import the functions you need from the SDKs you need
const { initializeApp } =require ("firebase/app");
const { getStorage,getDownloadURL ,ref,uploadBytes  } =require ("firebase/storage");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD33iS6P721d94Q3aLu8FUNyWm9HFZ5EGU",
    authDomain: "mall-project-fc08e.firebaseapp.com",
    projectId: "mall-project-fc08e",
    storageBucket: "mall-project-fc08e.appspot.com",
    messagingSenderId: "11000831937",
    appId: "1:11000831937:web:279e69aa215a5ec1e15940"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
module.exports= {ref,storage,uploadBytes,getDownloadURL}
