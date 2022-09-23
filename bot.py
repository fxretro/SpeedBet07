from telethon.sync import TelegramClient, events, types
from uteis.widget import *
from uteis.helper import *

import configparser
import asyncio
import uteis.database as Db

###########################################################
# Variáveis 
###########################################################

config = configparser.ConfigParser()
config.read('config.ini')

uid = config['default']['uid']
timerr = config['default']['timerr']
timer_check = config['default']['timer_check']


###########################################################
# Telegram 
###########################################################


async def telegram_bot():
   
   config = get_configs(uid)

   async with TelegramClient('name', config.get("api_id"), config.get("api_hash")) as client:   

      def my_event_handler(event, bet_type):
            msg = event.message               
            check_status(msg.message, bet_type)

              
      @client.on(events.NewMessage(pattern='(?i).*GHOST BET - FUTEBOL VIRTUAL'))
      async def handler(event):
         my_event_handler(event, 11)         

   

      await client.run_until_disconnected()


###########################################################
# Browser Bot - Verifica tipo de bet
###########################################################


def notifications(event):

    for attr in event.message.sticker.attributes:
            if isinstance(attr, types.DocumentAttributeSticker):
                id=attr.stickerset.id

                tokens = Db.get_tokens()             
                
                if str(id) == '3827034221168295937':                    
                    Db.add_notification(1, "Notificação importante", "Atenção! Entrada no FIFA Virtual em alguns instantes", tokens)


###########################################################
# Browser Bot - Verifica tipo de bet
###########################################################


def check_status(msg, bet_type):

    configs = get_configs(uid)

    if configs.get('stopped') == 0:
        parse_robo(configs, msg, bet_type) 
    else:
        log('Robo em modo stop efetuado pelo administrador', colour='red')



def parse_robo(configs, msg, bet_type):

    message = msg
    msg = message.split("\n")            

    championship = msg[1]
    match1 = msg[2]
    bet  = msg[3]

    url = "https://www.bet365.com/#/AVR/B146/R^1/"
    matches = [championship, match1, bet]

    parse_robo_continue(configs, matches, url, bet_type, message)



def parse_robo_continue(configs, text, url, bet_type, message):

    log('Inicializando Bet Esporte virtual')

    key = Db.add_url_master_tsv(message, text, url, bet_type, uid, configs.get("bet"), configs.get("bet_fifa"))  
    bot_futebol_virtual_ambos(config, configs, text, url, key)        



###########################################################
# Async exec
###########################################################


async def main():

    log('Inicializando sistema modo telegram')    
    await telegram_bot()


###########################################################
# Start script
###########################################################


asyncio.run(main())
    

    
