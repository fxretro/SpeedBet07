
import moment
import pyrebase

###########################################################
# Configurações do banco de dados principal 
###########################################################

config_big_firebase = {
  "apiKey": "AIzaSyB81K_ipu20aWEI_LQtVWnOXJmM6UaIVtw",
  "authDomain": "ghostbot-27831.firebaseapp.com",
  "databaseURL": "https://ghostbot-27831-default-rtdb.firebaseio.com/",
  "projectId": "ghostbot-27831",
  "storageBucket": "ghostbot-27831.appspot.com",
  "messagingSenderId": "868283060392",
  "appId": "1:868283060392:web:83fa6cccfbc966565eb29d",
  "serviceAccount": {
    "type": "service_account",
    "project_id": "ghostbot-27831",
    "private_key_id": "d4dcd3ce37a2503dcaa9ab649eb288973c7b6691",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDROEHS/DARu/fW\nFTscEx16Z6VEXn26D71fjvGMKRVTg7LFkSQ29TnPGG5GxQZCkRtEfDO1uw3YbrEv\njLhG6sFXLzSXi+mZy0SHKlErTCBl9aLPZDLJTg4eijLOdzXiLzqftZPgkPIDirpu\ndbx9xudAC7mO6B/QLmiMEka8Uq+0QSyWb7RI9FHaWFY1NLe/jFke4Qr+Wdmjhrqu\niEy+kkSDgZ8Hz8OeE0AxIX3Jn5wKRcQQ7/eP2CueK9LcZ0RU97OjEk7s+Dn8rQOZ\n9Od8CVSpD+z2rHF88zc+laler9dhNjTv6S3/0ys+wgoM+rpMC6zUNWHCjjJlYsmu\n/BzlNMsJAgMBAAECggEAMKIFGwgoHFc3OvpgbRw8Y/Gnxwa37wItoQLXPx9lp64b\nZjVg162VLICfUbAGzn5wejDszDeY9lB0u3rYcxOqsZt1fCy3tlo7qbe6engNp+W7\nXL4L2CNewNabDMdFLTiRRgKtRywqNYyP3ZFcqVgM9SREk+V9T6UaBEVTT/9gfGOm\nDXeVyxWS2ThQJsfpqxcWcBs/V7jCpnhFamHd6LUxGh6xkse1O0BG3SBAXNn9g6ok\na12NGKM3SflDQzjgagjSN89atvR/xCNQ11Pz9pN+yr6fcH6vp4+QTl/M8dUrFbpU\nbkw2mdQqRnjIG4yn/uJxCCQVOzkFISkDPhiaIkoEiQKBgQD6fbh3G4SS80zCNmu6\nvY+cl/4KMEP0m4pkRhJJ+vKa29GcIABFEZsz7jsD6SXffINSP9r3qZC1gFe7m78i\nbGQbMmxOjRI36K1JBo9mS1gPlNu9lqBBkVbwXETys8OLmbn3yccZq0aM/kd7VVx2\n9vxOA9OP8jfaitK9EYuS92FzWwKBgQDV0i0vfMOzw7x5FvLswfuioLzD7DspK22A\nRh/mSaNUTLYZiIHkEMMpgt+HERF5pNrPSq4Uu+SVuP37A0jKLHIvEKsRTvBqMC3B\nuUKylirPi0pdKl8y8OZ0SnfHWAqP9PfZp9po7GpnBYK/lEhD4LK+yqZb5DIsh1gm\nk35y9YT8awKBgQDsOhX1lajwIKy51zK/eDdwWVKFb0EW9HyN1hs3U4bpjfZeQzud\n512zmq5jIMPLwJPjxD6PI4VJ9dBHKDkXkJrTnzjO13Ff8nlBDgO8V7+jaiHU6LEX\nRKZ1pL6NGASIqZ/c05iFV6YAH2lwIW9C7efA9xDUhnwwCI13Ko2zOsLXUwKBgDHb\n6rFyFGhsshxCX68ZpMXNWXcONNVqzQPmVjXq4e0cXjIiBLfbuMaLP/hM4JhO+r7v\nmRw4nBrVolPP9j8+kfmrl1hX4fPA/Ep6GrVuEtmGj3aeFMjaJ8LiQn/3Za8f3lOg\nsmtZBY60WEK4HwnE8alPs+8ljRWZEdMc/ZVs7u+1AoGAVDTk6JdHC2XKhPBaaW6M\n/noaEnqMSkJwsBRu0kUsANS9TiWXZhvSNjMlD8qybqV6FkPwfV8Gwk75+S/T9PB0\n5WwZIpaxz3Fr83hJgziizEy5602nN4EcFLmI4Wx1O2hpMB+Eo7eEur/qF1bJbNtf\n4AVlNxcDPc3mro1sCrsyY60=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-eul49@ghostbot-27831.iam.gserviceaccount.com",
    "client_id": "116680575620543224246",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-eul49%40ghostbot-27831.iam.gserviceaccount.com"
  }
}

###########################################################
# Configurações do banco de dados GhostBet
###########################################################

config_firebase = {
  "apiKey": "AIzaSyB81K_ipu20aWEI_LQtVWnOXJmM6UaIVtw",
  "authDomain": "ghostbot-27831.firebaseapp.com",
  "databaseURL": "https://ghostbet.firebaseio.com/",
  "projectId": "ghostbot-27831",
  "storageBucket": "ghostbot-27831.appspot.com",
  "messagingSenderId": "868283060392",
  "appId": "1:868283060392:web:83fa6cccfbc966565eb29d",
  "serviceAccount": {
    "type": "service_account",
    "project_id": "ghostbot-27831",
    "private_key_id": "d4dcd3ce37a2503dcaa9ab649eb288973c7b6691",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDROEHS/DARu/fW\nFTscEx16Z6VEXn26D71fjvGMKRVTg7LFkSQ29TnPGG5GxQZCkRtEfDO1uw3YbrEv\njLhG6sFXLzSXi+mZy0SHKlErTCBl9aLPZDLJTg4eijLOdzXiLzqftZPgkPIDirpu\ndbx9xudAC7mO6B/QLmiMEka8Uq+0QSyWb7RI9FHaWFY1NLe/jFke4Qr+Wdmjhrqu\niEy+kkSDgZ8Hz8OeE0AxIX3Jn5wKRcQQ7/eP2CueK9LcZ0RU97OjEk7s+Dn8rQOZ\n9Od8CVSpD+z2rHF88zc+laler9dhNjTv6S3/0ys+wgoM+rpMC6zUNWHCjjJlYsmu\n/BzlNMsJAgMBAAECggEAMKIFGwgoHFc3OvpgbRw8Y/Gnxwa37wItoQLXPx9lp64b\nZjVg162VLICfUbAGzn5wejDszDeY9lB0u3rYcxOqsZt1fCy3tlo7qbe6engNp+W7\nXL4L2CNewNabDMdFLTiRRgKtRywqNYyP3ZFcqVgM9SREk+V9T6UaBEVTT/9gfGOm\nDXeVyxWS2ThQJsfpqxcWcBs/V7jCpnhFamHd6LUxGh6xkse1O0BG3SBAXNn9g6ok\na12NGKM3SflDQzjgagjSN89atvR/xCNQ11Pz9pN+yr6fcH6vp4+QTl/M8dUrFbpU\nbkw2mdQqRnjIG4yn/uJxCCQVOzkFISkDPhiaIkoEiQKBgQD6fbh3G4SS80zCNmu6\nvY+cl/4KMEP0m4pkRhJJ+vKa29GcIABFEZsz7jsD6SXffINSP9r3qZC1gFe7m78i\nbGQbMmxOjRI36K1JBo9mS1gPlNu9lqBBkVbwXETys8OLmbn3yccZq0aM/kd7VVx2\n9vxOA9OP8jfaitK9EYuS92FzWwKBgQDV0i0vfMOzw7x5FvLswfuioLzD7DspK22A\nRh/mSaNUTLYZiIHkEMMpgt+HERF5pNrPSq4Uu+SVuP37A0jKLHIvEKsRTvBqMC3B\nuUKylirPi0pdKl8y8OZ0SnfHWAqP9PfZp9po7GpnBYK/lEhD4LK+yqZb5DIsh1gm\nk35y9YT8awKBgQDsOhX1lajwIKy51zK/eDdwWVKFb0EW9HyN1hs3U4bpjfZeQzud\n512zmq5jIMPLwJPjxD6PI4VJ9dBHKDkXkJrTnzjO13Ff8nlBDgO8V7+jaiHU6LEX\nRKZ1pL6NGASIqZ/c05iFV6YAH2lwIW9C7efA9xDUhnwwCI13Ko2zOsLXUwKBgDHb\n6rFyFGhsshxCX68ZpMXNWXcONNVqzQPmVjXq4e0cXjIiBLfbuMaLP/hM4JhO+r7v\nmRw4nBrVolPP9j8+kfmrl1hX4fPA/Ep6GrVuEtmGj3aeFMjaJ8LiQn/3Za8f3lOg\nsmtZBY60WEK4HwnE8alPs+8ljRWZEdMc/ZVs7u+1AoGAVDTk6JdHC2XKhPBaaW6M\n/noaEnqMSkJwsBRu0kUsANS9TiWXZhvSNjMlD8qybqV6FkPwfV8Gwk75+S/T9PB0\n5WwZIpaxz3Fr83hJgziizEy5602nN4EcFLmI4Wx1O2hpMB+Eo7eEur/qF1bJbNtf\n4AVlNxcDPc3mro1sCrsyY60=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-eul49@ghostbot-27831.iam.gserviceaccount.com",
    "client_id": "116680575620543224246",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-eul49%40ghostbot-27831.iam.gserviceaccount.com"
  }
}

###########################################################
# Configurações do banco de dados SpeedBet07
###########################################################

config_firebase_speed = {
  "apiKey": "AIzaSyB81K_ipu20aWEI_LQtVWnOXJmM6UaIVtw",
  "authDomain": "ghostbot-27831.firebaseapp.com",
  "databaseURL": "https://speedbet07.firebaseio.com/",
  "projectId": "ghostbot-27831",
  "storageBucket": "ghostbot-27831.appspot.com",
  "messagingSenderId": "868283060392",
  "appId": "1:868283060392:web:83fa6cccfbc966565eb29d",
  "serviceAccount": {
    "type": "service_account",
    "project_id": "ghostbot-27831",
    "private_key_id": "d4dcd3ce37a2503dcaa9ab649eb288973c7b6691",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDROEHS/DARu/fW\nFTscEx16Z6VEXn26D71fjvGMKRVTg7LFkSQ29TnPGG5GxQZCkRtEfDO1uw3YbrEv\njLhG6sFXLzSXi+mZy0SHKlErTCBl9aLPZDLJTg4eijLOdzXiLzqftZPgkPIDirpu\ndbx9xudAC7mO6B/QLmiMEka8Uq+0QSyWb7RI9FHaWFY1NLe/jFke4Qr+Wdmjhrqu\niEy+kkSDgZ8Hz8OeE0AxIX3Jn5wKRcQQ7/eP2CueK9LcZ0RU97OjEk7s+Dn8rQOZ\n9Od8CVSpD+z2rHF88zc+laler9dhNjTv6S3/0ys+wgoM+rpMC6zUNWHCjjJlYsmu\n/BzlNMsJAgMBAAECggEAMKIFGwgoHFc3OvpgbRw8Y/Gnxwa37wItoQLXPx9lp64b\nZjVg162VLICfUbAGzn5wejDszDeY9lB0u3rYcxOqsZt1fCy3tlo7qbe6engNp+W7\nXL4L2CNewNabDMdFLTiRRgKtRywqNYyP3ZFcqVgM9SREk+V9T6UaBEVTT/9gfGOm\nDXeVyxWS2ThQJsfpqxcWcBs/V7jCpnhFamHd6LUxGh6xkse1O0BG3SBAXNn9g6ok\na12NGKM3SflDQzjgagjSN89atvR/xCNQ11Pz9pN+yr6fcH6vp4+QTl/M8dUrFbpU\nbkw2mdQqRnjIG4yn/uJxCCQVOzkFISkDPhiaIkoEiQKBgQD6fbh3G4SS80zCNmu6\nvY+cl/4KMEP0m4pkRhJJ+vKa29GcIABFEZsz7jsD6SXffINSP9r3qZC1gFe7m78i\nbGQbMmxOjRI36K1JBo9mS1gPlNu9lqBBkVbwXETys8OLmbn3yccZq0aM/kd7VVx2\n9vxOA9OP8jfaitK9EYuS92FzWwKBgQDV0i0vfMOzw7x5FvLswfuioLzD7DspK22A\nRh/mSaNUTLYZiIHkEMMpgt+HERF5pNrPSq4Uu+SVuP37A0jKLHIvEKsRTvBqMC3B\nuUKylirPi0pdKl8y8OZ0SnfHWAqP9PfZp9po7GpnBYK/lEhD4LK+yqZb5DIsh1gm\nk35y9YT8awKBgQDsOhX1lajwIKy51zK/eDdwWVKFb0EW9HyN1hs3U4bpjfZeQzud\n512zmq5jIMPLwJPjxD6PI4VJ9dBHKDkXkJrTnzjO13Ff8nlBDgO8V7+jaiHU6LEX\nRKZ1pL6NGASIqZ/c05iFV6YAH2lwIW9C7efA9xDUhnwwCI13Ko2zOsLXUwKBgDHb\n6rFyFGhsshxCX68ZpMXNWXcONNVqzQPmVjXq4e0cXjIiBLfbuMaLP/hM4JhO+r7v\nmRw4nBrVolPP9j8+kfmrl1hX4fPA/Ep6GrVuEtmGj3aeFMjaJ8LiQn/3Za8f3lOg\nsmtZBY60WEK4HwnE8alPs+8ljRWZEdMc/ZVs7u+1AoGAVDTk6JdHC2XKhPBaaW6M\n/noaEnqMSkJwsBRu0kUsANS9TiWXZhvSNjMlD8qybqV6FkPwfV8Gwk75+S/T9PB0\n5WwZIpaxz3Fr83hJgziizEy5602nN4EcFLmI4Wx1O2hpMB+Eo7eEur/qF1bJbNtf\n4AVlNxcDPc3mro1sCrsyY60=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-eul49@ghostbot-27831.iam.gserviceaccount.com",
    "client_id": "116680575620543224246",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-eul49%40ghostbot-27831.iam.gserviceaccount.com"
  }
}

###########################################################
# Variáveis
###########################################################


firebase = pyrebase.initialize_app(config_firebase)
firebase_big = pyrebase.initialize_app(config_big_firebase)
firebase_speed = pyrebase.initialize_app(config_firebase_speed)

db = firebase.database()
db_big = firebase_big.database()
db_speed = firebase_speed.database()


###########################################################
###########################################################
# GhostBet
###########################################################
###########################################################


###########################################################
# Uteis
###########################################################

def get_tokens():

  all = db.child("/userProfile/GhostBet/").get()
  allArray = []

  for user in all.each():        

        if user.val().get("token"):
          allArray.append(user.val().get("token"))        

  return allArray




###########################################################
# Monitoring Master - Tiro Seco Virtual
###########################################################


def add_url_master_tsv(msg, match, url, bet_type, uid, bet, bet_fifa):
  key = db.generate_key()
  db.child("betAvisoTsv/"+key).update({'match': match, 'msg': msg, 'link': url, 'datetime': moment.now().format('DD/MM/YYYY HH:mm:ss'), 'status': 'Criado', 'uid': uid, 'bet_type': bet_type, 'bet': bet, 'bet_fifa': bet_fifa })
  return key


def update_url_master_tsv(key, status):  
  db.child("betAvisoTsv/"+key).update({'datetimeChanged': moment.now().format('DD/MM/YYYY HH:mm:ss'), 'status': status})


def get_urls_tsv():

    all_users = db.child("betAvisoTsv").get()
    urlProduct = []
        
    for user in all_users.each():

         product = user.val()           
         urlProduct.append(product)         

    return urlProduct


def get_urls_tsv_key(key):

    all_users = db.child("betAvisoTsv").get()
    urlProduct = []
        
    for user in all_users.each():

         if user.key() == key:
          
          product = user.val()                   
          urlProduct.append(product)         

    return urlProduct



###########################################################
# Monitoring Bets - Tiro Seco Virtual
###########################################################


def add_match_tsv(match, url, bet_type, uid):
  
  key = db.generate_key()
  db.child("betClientMatchTsv/"+key).update({'match': match,  'link': url, 'datetime': moment.now().format('DD/MM/YYYY hh:mm:ss'), 'uid': uid, 'bet_type': bet_type})
  return key


def get_urls_match_tsv():

  urlProduct = []  

  try:

    all_users = db.child("betClientMatchTsv").get()      
        
    for user in all_users.each():

         product = user.val()           
         urlProduct.append(product)         

    return urlProduct
  
  except:
    return urlProduct



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

###########################################################
# Proxies
###########################################################


def add_notification(typee, title, msg, tokens):  
  db_big.child("notifications").push({'type': typee, 'title': title, 'msg': msg,  'datetime': moment.now().format('DD/MM/YYYY HH:mm:ss'), 'tokens': tokens})



###########################################################
###########################################################
# SpeedBet 07
###########################################################
###########################################################


###########################################################
# Scrape 
###########################################################


def get_bets():

  path = "betsDone/SpeedBet07/" + moment.now().format('YYYY') + '/' + moment.now().format('MM') + '/'
  all = db_speed.child(path).get()
  
  allArray = []

  for user in all.each(): 
          data = user.val()
          data['key'] = user.key()
          allArray.append(data)        

  return allArray


def update_bets(key, matches_new, matches_old):

  path = "betsDone/SpeedBet07/" + moment.now().format('YYYY') + '/' + moment.now().format('MM')+'/'+key  
  data  ={'datetimeChanged': moment.now().format('DD/MM/YYYY HH:mm:ss'), 'match': matches_new, 'matches_old': matches_old}
  db_speed.child(path).update(data)






def get_hampionship_game():

  #path = "championship_matches/" + moment.now().format('DDMMYYYY')
  path = "championship_matches/19092022/"

  all = db_speed.child(path).get()
  allArray = []

  for user in all.each(): 
          data = user.val()
          data['key'] = user.key()
          allArray.append(data)        
#
  return allArray


def add_championship_game(championship, matches):  

  path = "championship_matches/" + moment.now().format('DDMMYYYY')

  db_speed.child(path).push({
      'datetime': moment.now().format('DD/MM/YYYY HH:mm:ss'),
      'championship': championship, 
      'matches': matches
      })



def update_championship_game(key, match_tmp):

  #path = "championship_matches/" + moment.now().format('DDMMYYYY')+'/'+key
  path = "championship_matches/19092022"+'/'+key
  
  db_speed.child(path).update({'datetimeChanged': moment.now().format('DD/MM/YYYY HH:mm:ss'), 'match_results': match_tmp, 'status': 'Verificado'})