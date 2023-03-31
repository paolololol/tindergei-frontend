import { initializeApp } from "firebase/app";
import { getToken, getMessaging } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
const firebaseConfig = {
    apiKey: "AIzaSyC6o4YuwnHbSTh1xrYsnug8ZoRcpXQ605k",
    authDomain: "keycloak-366209.firebaseapp.com",
    projectId: "keycloak-366209",
    storageBucket: "keycloak-366209.appspot.com",
    messagingSenderId: "1095245031715",
    appId: "1:1095245031715:web:fedceaab7e9f0ad375c496"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
export const getFbToken = () => getToken(messaging, {vapidKey: 'BFrAjokzuraoh2COHKH1dA_4wCQNHHaliVOyTiRiHNbbdQ9RSsAUfcQ1KP9r9WFlEiRBJkCK04P8Y5erOa-_K_U'})
