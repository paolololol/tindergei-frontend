import { initializeApp } from "firebase/app";
import { getToken, getMessaging, onMessage } from "firebase/messaging";

let messaging: any;
try {
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
    messaging = getMessaging(app);
    onMessage(messaging, (payload: any) => {
        console.log('Message received. ', payload);
    })
} catch (error) {
    console.warn(error);
}
export const getFbToken = () => {
    if(messaging) {
        return getToken(messaging, {vapidKey: 'BFrAjokzuraoh2COHKH1dA_4wCQNHHaliVOyTiRiHNbbdQ9RSsAUfcQ1KP9r9WFlEiRBJkCK04P8Y5erOa-_K_U'})
    } else {
        return null;
    }
}
