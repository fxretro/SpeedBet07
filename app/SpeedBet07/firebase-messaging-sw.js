importScripts('https://www.gstatic.com/firebasejs/7.16.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.16.0/firebase-messaging.js');

firebase.initializeApp({    
  'messagingSenderId': "698426579872",
  'projectId': "ghostbot-27831",
  'appId': "1:868283060392:web:83fa6cccfbc966565eb29d",
  'apiKey': "AIzaSyB81K_ipu20aWEI_LQtVWnOXJmM6UaIVtw"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('Received background message ', payload);
  // here you can override some options describing what's in the message; 
  // however, the actual content will come from the Webtask
  const notificationOptions = {
    icon: '/assets/imgs/logo.png'
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});
