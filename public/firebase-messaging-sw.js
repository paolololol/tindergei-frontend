importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");
const firebaseConfig = {
    apiKey: "AIzaSyC6o4YuwnHbSTh1xrYsnug8ZoRcpXQ605k",
    authDomain: "keycloak-366209.firebaseapp.com",
    projectId: "keycloak-366209",
    storageBucket: "keycloak-366209.appspot.com",
    messagingSenderId: "1095245031715",
    appId: "1:1095245031715:web:fedceaab7e9f0ad375c496"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.onBackgroundMessage(function (payload) {
    console.log("Received background message ", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "/logo192.png",
    };
    return self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
});