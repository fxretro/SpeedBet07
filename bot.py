from telethon.sync import TelegramClient, events
from uteis.widget import *
from uteis.helper import *

import configparser
import asyncio
import uteis.database as Db
import threading
import argparse

###########################################################
# Variáveis 
###########################################################

config = configparser.ConfigParser()
config.read('config.ini')

uid = config['default']['uid']
timerr = config['default']['timerr']
timer_check = config['default']['timer_check']


parser = argparse.ArgumentParser("simple_example")
parser.add_argument("mode", help="Use telegram and save info in database.", type=str)

args = parser.parse_args()


###########################################################
# Telegram 
###########################################################


async def telegram_bot():
   
   config = get_configs()

   async with TelegramClient('name', config.get("api_id"), config.get("api_hash")) as client:   

      def my_event_handler(event):
            msg = event.message           
            check_status(msg.message, 1)

      def my_event_handler_red_card(event):
            msg = event.message           
            check_status(msg.message, 2)
                                                           

      @client.on(events.NewMessage(pattern='(?i).*MEGABOLT PRIMEIRO'))
      async def handler(event):
         my_event_handler(event)          

      @client.on(events.NewMessage(pattern='(?i).*Alerta Estratégia: ESCANTEIOS'))
      async def handler(event):
         my_event_handler(event)   

      @client.on(events.NewMessage(pattern='(?i).*SAIU CARTÃO VERMELHO'))
      async def handler(event):
         my_event_handler_red_card(event)              


      await client.run_until_disconnected()


###########################################################
# Browser Bot - Verifica tipo de bet
###########################################################


def check_status(msg, bet_type):

    configs = get_configs()

    if configs.get('stopped') == 0:
        parse_msg(configs, msg, bet_type)
    else:
        log('Robo em modo stop efetuado pelo administrador', colour='red')



def parse_msg(configs, msg, bet_type):   

    message = msg
    msg = message.split("\n")        
    match = msg[1]    
    match = match[7:]

    text = match.replace("º", "")    
    text = text.replace("(", "")
    text = text.replace(")", "")        
    text = ''.join(i for i in text if not i.isdigit())    
    text = text.split()    
    text = " ".join(str(x) for x in text) 
    
    url = "https://www.bet365.com/#/AX/K^" + text       
    
    bet_check(configs, text, url, bet_type, message)



###########################################################
# Browser Bot - Verifica o tipo de bet
###########################################################


def bet_check(configs, text, url, bet_type, message):

    log('Inicializando bet tipo ' + str(bet_type))

    if bet_type == 1:      
        key = Db.add_url_master(message, text, url, bet_type)  
        bot_escanteio_asiatico(configs, key, text, url)
    else:
        log('Estratégia cartão vermelho em desenvolvimento', colour='red')


###########################################################
# sync exec
###########################################################


def refresh_bets():

    log('Inicializando verificação')

    bets = Db.get_urls()            
    my_matches = Db.get_urls_match()      
    today = datetime.datetime.now() 

    try:        

        for bet in bets:

            datetime_match = bet.get("datetime")
            match = bet.get("link")            
            bet_type = bet.get("bet_type")
            
            now = datetime.datetime.strptime(datetime_match, '%d/%m/%Y %H:%M:%S')            
            now = now + datetime.timedelta(seconds=int(timer_check))            
                    
            if now > today:

                if not match in my_matches:     

                    my_matches.append(match)                 
                    check_status(match, match, bet_type)
                    Db.add_match(datetime_match, match, bet_type)
                
        log('Verificação finalizada. Aguardando...')

    except exception as e:
        log('Não foi possível verificar. Aguardando...', colour='red')
        pass



def setInterval(func,time):

    e = threading.Event()
    while not e.wait(time):
        func()


def main_sync():

    log('Inicializando sistema modo database')           
    setInterval(refresh_bets, int(timerr))





###########################################################
# Async exec
###########################################################


async def main():

    log('Inicializando sistema modo telegram')    
    await telegram_bot()


###########################################################
# Start script
###########################################################


if args.mode == 'telegram':
    asyncio.run(main())

else:
    main_sync()    

    
