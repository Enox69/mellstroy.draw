// Твой конфиг
const firebaseConfig = {
  apiKey: "AIzaSyCrb47l-FnrTs9WYWQAOOzAnucd-hEZqNU",
  authDomain: "melldrawing.firebaseapp.com",
  databaseURL: "https://melldrawing-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "melldrawing",
  storageBucket: "melldrawing.firebasestorage.app",
  messagingSenderId: "63500315101",
  appId: "1:63500315101:web:bd2ce440664068beca2e34",
  measurementId: "G-0606V79HD2"
};

try {
    const app = window.firebase.initializeApp(firebaseConfig);
    const db = window.firebase.getDatabase(app);
    window.db = db;
    console.log('Firebase initialized successfully');
} catch (error) {
    console.log('Firebase init error:', error.message);
    window.db = null;
}