// This a service worker file for receiving push notifitications.
// See `Access registration token section` @ https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token

// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');


const firebaseConfig = {
  apiKey: "AIzaSyASq2wIuHOK-LTpc83SvwkP5_lbdiSiHWE",
  authDomain: "sehatra-com.firebaseapp.com",
  projectId: "sehatra-com",
  storageBucket: "sehatra-com.appspot.com",
  messagingSenderId: "980920542323",
  appId: "1:980920542323:web:c089833b879f527098b606",
  measurementId: "G-GMW0M3789N"
};


firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();


let totalNotifications = 0;

self.addEventListener('push', (event) => {
    const payload = event.data.json();
    totalNotifications++;
    const channel = new BroadcastChannel('notification-total');
    channel.postMessage(totalNotifications);
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: '../../assets/images/brand/favicon.png',
        badge: '../../assets/images/brand/favicon.png',
        data: {
            click_action: payload.data.click_action,
        },
    });
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const clickAction = event.notification.data.click_action;
    if (clickAction) {
        clients.openWindow(clickAction);
    }
});

self.addEventListener('notificationclose', () => {
    totalNotifications--;
    if (totalNotifications < 0) {
        totalNotifications = 0;
    }
});
messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);
  const channel = new BroadcastChannel('notification-channel');
  channel.postMessage(payload);
});