'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp({credential: admin.credential.cert({
  "type": "service_account",
  "project_id": "ghostbot-27831",
  "private_key_id": "cac2c62006bef45bd5e4e3ec3065006553ad261e",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC1J8Q5kgsK15S3\nbCO+Nkg4/ZuA0pTzij6kmSw9epUdrnQiYk8ZF8u55FM7OSiXOUtNwidhJ5wvpEZN\nmP/q8t7t0o//P6FdXbfjCu6norMqKf6vcwT3KGeu683rrV1RV+TdGt8vSBLQ2QFK\nslAaxiajo+4ymI2bpyvOd5/yvmw89pGfE9t7XSwkdZkGph5qDWjvEQkiRp+APrq2\nMzB3m0qHlQu0LOymlK8XnpwpzXVJN+aSLG6blcbNDD/HVVRzMjGVbu+oreRQjVaM\n1rSsKgLnHXTJemuYvjj62yfx6nIVw5Lw3rx2K+lPbkEkmcmLmpGdpunN8OhR1KAK\n9FxdGyEbAgMBAAECggEAItaUdovfAsVFzOaHky+GQSuIicQ1sAZgmK/6YZJe9ffU\nTr6APq+kVsoRtZx+8WIr2Lbjctw2vbTGbmrjoI/3jl4Fok1e34FD+W5jSirQcOXl\nnGEuzcdf9TRVBCNxhFC2a00dKc8fCzoIdRCItjVwPd0rVGChLxN9qbW4tWqojyp5\n+H3bMbHqKTM2Ciz15ZRGfJMoZh5W9f8ic6q+beKVRC8wDv/8ZwbssX4zEjh8F3eT\nb1N8LOy6SWhguuS6cjQGgN6Yi64ty3YSqaCNL7iNZ4V250zamnfD6RK3u+xxvAkF\nWXjabY2gJtjCbPA0DAR9NrcUERXEzd8hU6oNpM5BLQKBgQD/hOVJEsKB7a7aWj49\nv77Ep5ButccWY0Zm/gYQ7mC4GIEnDqR9EZDFTpswrJ0ISMHiQEFSmq/AmZlnqR5K\ngF4AiQ91XpiiVBtnGZfBHq+nRmJd6bvgezYFr5sH5GbaZgjWC/NN60s0OLbXBCOn\nNATPIq6mZcXF9BO/lN4fqq+/HQKBgQC1fws0i/HLnUrt4/0yzjHWlaYuPMqBQX0d\n2KvTjALiUzNfHOeUEm8ihI33KjQ/i4CM8HQp0T+8uvnS13MQRFSjq4jLLPOKZ7Gz\nqIT665kbgxk52xE+tLcvH4bVpdGOZOpz4i8ASByaTuP+U/WfH5B0H5S6y+SIWVjb\nH5oA9ndTlwKBgDuTEKJo7VC9yfa+86QSALh5GQO2/iQKIXAB6ggojARgMjyY/WDr\np4VZPnWqyTIVRJ8rvA82YaPWLB4vIBDevQwC6MfEtnGiioEPRoKQVQP7NRQQWu2L\nzJymxM6iQhjJkWXWg3O3WGFkl7yqCmYBit2AiJfjQqlUrwYL/34CnddBAoGAAOT+\nZiTmbS16SA/emJiBkGAucH3mNZrgBfyiZCmFfh4Q28AluAobOB1VIcm4djO2z3sD\n54zbdo+pWYusSoE7tY7L3sx66sy2CH+lICN3HraXsjxNKnTzjizmmjj1/nCq4yVT\nO/ofAfevkfpR9JXQPXJGZmFI4A8oq/PM64JLdkMCgYBVKAa7xbvd1oiC/Cd2E5zC\njTafFNSNN4cUkAsmxN/3V4Bo/xf2lYXKLIX1g9IBVKhg1JmmoWY/zsyDQWQ2kkG2\npkjYkAs9XvJ/QGVHhP9DYc28ndIw43PvzZIpNsXw7lx3ssvZzSOSSmKpP2KdQ9Ji\nA2L6GTb3E82meKsFmyJv+w==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-eul49@ghostbot-27831.iam.gserviceaccount.com",
  "client_id": "116680575620543224246",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-eul49%40ghostbot-27831.iam.gserviceaccount.com"
})});


exports.notifyBetAviso = functions.database.ref('/betAviso/')
    .onWrite((change, context) => {            
      

    let notificationIcon = 'https://firebasestorage.googleapis.com/v0/b/ghostbot-27831.appspot.com/o/logo.png?alt=media&token=8668af78-f6c2-4a87-97a1-cc91933cb2bb'
    let notificationSound = "ding"

    
    return new Promise(function(resolve){
  
      const snapshot = change.after
      const data = snapshot.val()  
          
      const payload = {
        notification: {
            title: "Notificação Bet",
            body: "Uma novo escanteio asiático!",
            icon: notificationIcon,
            sound : notificationSound     
        },
        data: {
          type: "4"
        }
      }               
     
      var promises = [];
      data.tokens.forEach(function(tokenn) {        
        promises.push(admin.messaging().sendToDevice(tokenn, payload))
  
      })
  
      Promise.all(promises).then(() => {

        console.log(promises.length + ' Notificações de bet ASIÁTICAS enviadas')
        resolve()
      });               

    });
      

});



exports.notifyBetAvisoTsv = functions.database.ref('/betAvisoTsv/')
    .onWrite((change, context) => {            
      

    let notificationIcon = 'https://firebasestorage.googleapis.com/v0/b/ghostbot-27831.appspot.com/o/logo.png?alt=media&token=8668af78-f6c2-4a87-97a1-cc91933cb2bb'
    let notificationSound = "ding"

    
    return new Promise(function(resolve){
  
      const snapshot = change.after
      const data = snapshot.val()  

        const payload = {
          notification: {
              title: "Notificação Bet",
              body: "Uma nova oportunidade FIFA!",
              icon: notificationIcon,
              sound : notificationSound     
          },
          data: {
            type: "3"
          }
        }               
       
        var promises = [];

        data.tokens.forEach(function(tokenn) {        
          promises.push(admin.messaging().sendToDevice(tokenn, payload))
    
        })
    
        Promise.all(promises).then(() => {
  
          console.log(promises.length + ' Notificações de bet FIFA enviadas')
          resolve()
        });
        
    
      })
                          
      

});


exports.notifyBetOportunities = functions.database.ref('/betOportunities/')
    .onWrite((change, context) => {            
      

    let notificationIcon = 'https://firebasestorage.googleapis.com/v0/b/ghostbot-27831.appspot.com/o/logo.png?alt=media&token=8668af78-f6c2-4a87-97a1-cc91933cb2bb'
    let notificationSound = "ding"

    
    return new Promise(function(resolve){
  
      const snapshot = change.after
      const data = snapshot.val()  

      const payload = {
        notification: {
            title: "Notificação Bet",
            body: "Uma nova oportunidade futebol!",
            icon: notificationIcon,
            sound : notificationSound     
        },
        data: {
          type: "2"
        }
    }               
   
    var promises = [];
    data.tokens.forEach(function(tokenn) {        
      promises.push(admin.messaging().sendToDevice(tokenn, payload))

    })

    Promise.all(promises).then(() => {

      console.log(promises.length + ' Notificações de bet enviadas')
      resolve()
    });
  

      })
                          
      
});


exports.notifyNotifications = functions.database.ref('/notifications/{Key_}')

    .onWrite((change, context) => {                   
  
      return new Promise(function(resolve, reject){
    
        const snapshot = change.after
        let data = snapshot.val()    
          
        const payload = {

          notification: {
              title: data.title,
              body: data.msg,
              icon: 'https://firebasestorage.googleapis.com/v0/b/ghostbot-27831.appspot.com/o/logo.png?alt=media&token=8668af78-f6c2-4a87-97a1-cc91933cb2bb',          
              sound : "ding"          
          },
          data: {
            type: "1"
          }
        }           
        
          var promises = [];              
          
          snapshot.val().tokens.forEach(function(tokenn) {       
              promises.push(admin.messaging().sendToDevice(tokenn, payload))
          })

  
          Promise.all(promises).then(() => {
            console.log(promises.length + ' Notificações enviadas')
            resolve()
          })
          .catch((error) => {
            console.log('Erro ao executar função de notificação')
            console.log(error)
          });  

        })                    
                            
});