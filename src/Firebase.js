import config from '../firebase-app.json';
import firebase from 'firebase/app';

require("firebase/auth");
require("firebase/database");

firebase.initializeApp(config);

const messaging = firebase.messaging();
messaging.usePublicVapidKey('BC4ELNU9i6_oy7YkQzYdcKhRLAzeex7zZ2IsKvGJ9u_sYYwVkDMC9xcpXOuw4R-WCzeyrm6ThdMKNoQIj4w1KQw');

messaging.requestPermission()
  .then(function() {
    console.log('Notification permission granted.');
    // TODO(developer): Retrieve an Instance ID token for use with FCM.
    // ...
  })
  .catch(function(err) {
    console.log('Unable to get permission to notify.', err);
  });

messaging.onMessage(function(payload) {
  console.log("Message received. ", payload);
  // ...
});

