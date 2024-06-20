// Firebase Cloud Messaging Configuration File. 
// Read more at https://firebase.google.com/docs/cloud-messaging/js/client && https://firebase.google.com/docs/cloud-messaging/js/receive

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-messaging.js";

var firebaseConfig = {
  apiKey: "AIzaSyASq2wIuHOK-LTpc83SvwkP5_lbdiSiHWE",
  authDomain: "sehatra-com.firebaseapp.com",
  projectId: "sehatra-com",
  storageBucket: "sehatra-com.appspot.com",
  messagingSenderId: "980920542323",
  appId: "1:980920542323:web:c089833b879f527098b606",
  measurementId: "G-GMW0M3789N"
};

initializeApp(firebaseConfig);

const messaging = getMessaging();

let count = 0

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../static/interface_administration/assets/js/firebase-messaging-sw.js')
    .then(function (registration) {
      // console.log("Service Worker Registered", registration.scope);
      getToken(messaging, { vapidKey: `BEI9C7Cq-Shmxj9qyCDy6SbnbuQKBVOtC-3k4uo49cwcCjSK9DnOjy1aeAjUhOQ3HPxWJOlUtyNC61BYQESA4rY`, serviceWorkerRegistration: registration })
        .then((currentToken) => {
          if (currentToken) {
            fetch(`/administration/enregistrerToken/` + currentToken, {
              method: "GET",
            })
              .then(response => response.json())
              .then(data => {
                localStorage.setItem('token_fcm', currentToken);
                console.log(data.message)

              })
              .catch(error => {
                swal("Erreur", error, "error");
              });
            // console.log('current token for client: ', currentToken);
          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        })
        .catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
        });
    })
    .catch(function (err) {
      console.log("Service worker registration failed, error:", err);
    })
}



new Promise((resolve) => {
  onMessage(messaging, (payload) => {
    resolve(payload);
    //nombre de notifications
    count++;
    updatePageTitle(count);
    //notification
    notif({
      msg: payload.notification.title + " :" + payload.notification.body,
      type: "info"
    });
    //liste notification
    updateNotifications()
  });
});


