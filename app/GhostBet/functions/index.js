'use strict';
const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();


function getTokens_(){

  const state = 'GhostBet'
  let path = `/userProfile/`+ state + "/"        

  const getDeviceTokensPromise = admin.database()
    .ref(path).once('value');

  return Promise.all([getDeviceTokensPromise])

  .then(results => {
      
    getTokens(results, change)

    .then(tokens => {      

      resolve(tokens)
    })
  })

}

function getTokens(results, change){

  return new Promise(function(resolve){

    let tokens = []
  
    const allTokens = results[0]  
    const snapshot = change.after

    const data = snapshot.val()  
      
    allTokens.forEach(element => {

      let dataVal = element.val()    
      let token = dataVal.token  

              
      tokens.push(token)    
                                         
    });

    resolve(tokens)

  })      
}




exports.notifyBetAviso = functions.database.ref('/betAviso/')
    .onWrite((change, context) => {            
      

    let notificationIcon = 'https://firebasestorage.googleapis.com/v0/b/ghostbot-27831.appspot.com/o/logo.png?alt=media&token=8668af78-f6c2-4a87-97a1-cc91933cb2bb'
    let notificationSound = "ding"

    
    return new Promise(function(resolve){
  
      const snapshot = change.after
          
      getTokens_().
      then((tokens) => {

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
  
          console.log(promises.length + ' Notificações de bet ASIÁTICAS enviadas')
          resolve()
        });
        
      })   
      .catch(error => {       
        console.log(error)
      }); 


      })
                          
      

});



exports.notifyBetAvisoTsv = functions.database.ref('/betAvisoTsv/')
    .onWrite((change, context) => {            
      

    let notificationIcon = 'https://firebasestorage.googleapis.com/v0/b/ghostbot-27831.appspot.com/o/logo.png?alt=media&token=8668af78-f6c2-4a87-97a1-cc91933cb2bb'
    let notificationSound = "ding"

    
    return new Promise(function(resolve){
  
      const snapshot = change.after
      getTokens_().
      then((tokens) => {

        const payload = {
          notification: {
              title: "Notificação Bet",
              body: "Uma nova oportunidade FIFA!",
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
  
          console.log(promises.length + ' Notificações de bet FIFA enviadas')
          resolve()
        });
        
      })   
      .catch(error => {       
        console.log(error)
      }); 


      })
                          
      

});


exports.notifyBetOportunities = functions.database.ref('/betOportunities/')
    .onWrite((change, context) => {            
      

    let notificationIcon = 'https://firebasestorage.googleapis.com/v0/b/ghostbot-27831.appspot.com/o/logo.png?alt=media&token=8668af78-f6c2-4a87-97a1-cc91933cb2bb'
    let notificationSound = "ding"

    
    return new Promise(function(resolve){
  
      const snapshot = change.after
      getTokens_().
      then((tokens) => {

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
  

      })
                          
      
});


exports.notifyNotifications = functions.database.ref('/notifications/')

    .onWrite((change, context) => {            
      

      let self = this
      let notificationIcon = 'https://firebasestorage.googleapis.com/v0/b/ghostbot-27831.appspot.com/o/logo.png?alt=media&token=8668af78-f6c2-4a87-97a1-cc91933cb2bb'
      let notificationSound = "ding"
  
      return new Promise(function(resolve, reject){
    
        const snapshot = change.after
        let data = snapshot.val()                                  
  
        getTokens_().
          then((tokens) => {

            data.tokens = tokens

            
            const payload = {

              notification: {
                  title: data.title,
                  body: data.msg,
                  icon: notificationIcon,          
                  sound : notificationSound          
              },
              data: {
                type: "1",
                key: dataRcvd.key
              }
            }           
            
              var promises = [];              
              
              tokens.forEach(function(tokenn) {       
                  promises.push(self.admin.messaging().sendToDevice(tokenn, payload))
              })
      
              Promise.all(promises).then(() => {
                console.log(promises.length + ' Notificações enviadas')
                resolve()
              });  

            })

          }).catch(error => { 

            reject(console.log(error))
        });                           
                            
});