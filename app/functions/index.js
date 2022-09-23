'use strict';
const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();


exports.apiAddUser = functions.https.onRequest((req, res) => {  

  return new Promise( (resolve, reject) => {                   

    admin
      .auth()
      .createUser({
        email: data.email,          
        password: data.password,
        displayName: data.name          
      })

      .then((userRecord) => {

        console.log('Usuário criado com sucesso: ', userRecord.uid);            
        resolve(userRecord.uid)          

      })
      .catch((error) => {

        console.log('Erro ao criar usuário: ', error);
        reject(error)
      });


  })
});

exports.apiRemoveUser = functions.https.onRequest((req, res) => {  

  return new Promise( (resolve, reject) => {

    admin.auth().deleteUser(uid)

    .then(function() {
        console.log("Successfully deleted user " + uid);
        resolve()
    })
    
    .catch(function(error) {
      console.log("Error deleting user:" + uid + ' .Erro: '  + error);
      reject()
  });

  })
});



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
            body: "Uma novo escanteio asiático!",
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



exports.notifyBets = functions.database.ref('/betAvisoTsv/')
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
            body: "Uma nova oportunidade fifa!",
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


exports.notifyBets = functions.database.ref('/betOportunities/')
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
            body: "Uma nova oportunidade futebol!",
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