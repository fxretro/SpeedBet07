
from uteis.widget import *
from bot import *

import datetime
import uteis.database as Db
import threading


###########################################################
# sync exec
###########################################################


def refresh_bets():

    log('Inicializando verificação')

    bets = Db.get_urls()            
    my_matches = Db.get_urls_match()      
    today = datetime.datetime.now()      
    
    for bet in bets:

        datetime_match = bet.get("datetime")
        match = bet.get("link")
        msg = bet.get("msg")

        now = datetime.datetime.strptime(datetime_match, '%d/%m/%Y %H:%M:%S')
        now = now + datetime.timedelta(minutes=1)

        print('Verificando Bet ', today, now)
                
        if now > today:

            if not match in my_matches:     

                my_matches.append(match)                 
                check_status(msg, match)
                Db.add_match(datetime_match, match)
            
    log('Verificação finalizada. Aguardando...')



def setInterval(func,time):

    e = threading.Event()
    while not e.wait(time):
        func()


def main_sync():

    log('Inicializando sistema')        
    setInterval(refresh_bets, 30)    

main_sync()


