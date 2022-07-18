
import moment
import pyrebase


config = {
  "apiKey": "AIzaSyB81K_ipu20aWEI_LQtVWnOXJmM6UaIVtw",
  "authDomain": "ghostbot-27831.firebaseapp.com",
  "databaseURL": "https://ghostbot-27831-default-rtdb.firebaseio.com",
  "projectId": "ghostbot-27831",
  "storageBucket": "ghostbot-27831.appspot.com",
  "messagingSenderId": "868283060392",
  "appId": "1:868283060392:web:83fa6cccfbc966565eb29d",
  "serviceAccount": "/home/diego/Documentos/Projetos/Ghost/Ghost-Bot/sneaker-monitors/monitors/snkrs/ghostbot.json"
}


firebase = pyrebase.initialize_app(config)
db = firebase.database()



###########################################################
# Monitoramentos
###########################################################


def add_url(msg, url):
  db.child("betAviso").push({'msg': msg, 'link': url, 'datetime': moment.now().format('DD/MM/YYYY hh:mm:ss')})


def get_urls():

    all_users = db.child("betAviso").get()
    urlProduct = []

    i = 0
    for user in all_users.each():

         product = user.val()           
         urlProduct.insert(i , product)
         i= i+1

    return urlProduct
        


def get_urls_stream(stream_handler):

  return db.child("posts").stream(stream_handler)

###########################################################
# Proxies
###########################################################


def add_proxy(url, port):
  print(url, port)
  db.child("proxies").push({'url': url, 'port': port})


def get_proxies():

  proxies = []

  all_proxies = db.child("proxies").get()
  i = 0

  for px in all_proxies.each():

    proxy = px.val()     
    proxies.insert(i, proxy['url']+":"+proxy['port'])
    i= i+1

  return proxies