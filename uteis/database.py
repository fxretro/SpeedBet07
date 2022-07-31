
import moment
import pyrebase
import configparser


config = configparser.ConfigParser()
config.read('config.ini')
file_firebase_auth = config['default']['file_firebase_auth']
uid = config['default']['uid']


config_firebase = {
  "apiKey": "AIzaSyB81K_ipu20aWEI_LQtVWnOXJmM6UaIVtw",
  "authDomain": "ghostbot-27831.firebaseapp.com",
  "databaseURL": "https://ghostbot-27831-default-rtdb.firebaseio.com",
  "projectId": "ghostbot-27831",
  "storageBucket": "ghostbot-27831.appspot.com",
  "messagingSenderId": "868283060392",
  "appId": "1:868283060392:web:83fa6cccfbc966565eb29d",
  "serviceAccount": file_firebase_auth
}


firebase = pyrebase.initialize_app(config_firebase)
db = firebase.database()



###########################################################
# Monitoring Master
###########################################################


def add_url_master(msg, match, url, bet_type):
  key = db.generate_key()
  db.child("betAviso/"+key).update({'match': match, 'msg': msg, 'link': url, 'datetime': moment.now().format('DD/MM/YYYY HH:mm:ss'), 'status': 'Criado', 'uid': uid, 'bet_type': bet_type})
  return key


def add_url_client(msg, url):
  key = db.generate_key()
  db.child("betAviso/"+key).update({'msg': msg, 'link': url, 'datetime': moment.now().format('DD/MM/YYYY HH:mm:ss'), 'status': 'Criado', 'uid': uid})
  return key



def update_url_master(key, status):  
  db.child("betAviso/"+key).update({'datetimeChanged': moment.now().format('DD/MM/YYYY HH:mm:ss'), 'status': status})


def get_urls():

    all_users = db.child("betAviso").get()
    urlProduct = []
        
    for user in all_users.each():

         product = user.val()           
         urlProduct.append(product)         

    return urlProduct
      

###########################################################
# Monitoring Bets
###########################################################

def add_match(match, url, bet_type):
  
  key = db.generate_key()
  db.child("betClientMatch/"+key).update({'match': match,  'link': url, 'datetime': moment.now().format('DD/MM/YYYY hh:mm:ss'), 'uid': uid, 'bet_type': bet_type})
  return key


def get_urls_match():

  urlProduct = []  

  try:

    all_users = db.child("betClientMatch").get()      
        
    for user in all_users.each():

         product = user.val()           
         urlProduct.append(product)         

    return urlProduct
  
  except:
    return urlProduct



###########################################################
# Scapper
###########################################################

def add_scrapping(data):
  key = db.generate_key()
  db.child("betScrapping/"+key).update(data)
  return key

###########################################################
# Proxies
###########################################################


def add_proxy(url, port):  
  db.child("proxies").push({'url': url, 'port': port})


def get_proxies():

  proxies = []

  all_proxies = db.child("proxies").get()  

  for px in all_proxies.each():
    proxy = px.val()     
    proxies.append(proxy['url']+":"+proxy['port'])    

  return proxies


###########################################################
# Configurations
###########################################################


def get_configurations(uid):

  all = db.child("configs").get()
  allArray = []

  for user in all.each():        

        if user.key() == uid:
          allArray.append(user.val())        

  return allArray