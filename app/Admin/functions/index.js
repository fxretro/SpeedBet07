'use strict';
const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

exports.notifyBets = functions.database.ref('/betAviso/')
    .onWrite((change, context) => {            
      

    let notificationIcon = 'https://firebasestorage.googleapis.com/v0/b/motok-a98db.appspot.com/o/imagens%2Fdefault-user.png?alt=media&token=508e99dd-7450-41f5-b948-a070e5fddf21'
    let notificationSound = "ding"

    
    return new Promise(function(resolve){
  
      const snapshot = change.after
      let token = snapshot.val().token
          
      let tokens = []                        
      tokens.push(token)
                          
      const payload = {
        notification: {
            title: "Notificação Bet",
            body: "Uma bet asiática foi ",
            icon: notificationIcon,
            sound : notificationSound     
        },
        data: {
          type: "1",
          key: snapshot.key,
        }
      }               
     
      var promises = [];
      tokens.forEach(function(tokenn) {        
        promises.push(admin.messaging().sendToDevice(tokenn, payload))
  
      })
  
      Promise.all(promises).then(() => {

        console.log(promises.length + ' Notificações de bet enviadas')
        resolve()
      });
      
    })   
    .catch(error => {       
      console.log(error)
    }); 

});