/*
 * Firebase setup for multi-device sync.
 *
 * 1. Create a Firebase project on the free Spark plan.
 * 2. Create a Realtime Database.
 * 3. Copy your web app config from Firebase project settings.
 * 4. Replace the placeholder values below.
 * 5. Set enabled to true.
 */
window.DFCS_FIREBASE_CONFIG = {
    enabled: false,
    apiKey: "PASTE_FIREBASE_API_KEY",
    authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://PASTE_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "PASTE_PROJECT_ID",
    storageBucket: "PASTE_PROJECT_ID.appspot.com",
    messagingSenderId: "PASTE_MESSAGING_SENDER_ID",
    appId: "PASTE_FIREBASE_APP_ID",
};
