from telethon.sync import TelegramClient, events, types
from uteis.widget import *
from uteis.helper import *

import configparser
import asyncio
import uteis.database as Db
import re

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

              
    ###########################################################
    # Robo KabumTips TIROSECOVIRTUAL
    ###########################################################

      @client.on(events.NewMessage(pattern='(?i).*FUTEBOL VIRTUAL'))
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

                print('Recebido sticker ', id)   

                tokens = Db.get_tokens()             
                print(tokens)
                
                if str(id) == '3827034221168295937':                    
                    Db.add_notification(1, "Notificação importante", "Atenção! Entrada no FIFA Virtual em alguns instantes", tokens)

                if str(id) == '2426943245666746371':                    
                    Db.add_notification(1, "Notificação importante", "Parabéns! Batemos  a meta no FIFA Virtual", tokens)

                if str(id) == '5596820596936671235':                    
                    Db.add_notification(1, "Boa noite!", "Encerramos no FIFA Virtual por hoje", tokens)



###########################################################
# Browser Bot - Verifica tipo de bet
###########################################################


def check_status(msg, bet_type):

    configs = get_configs(uid)

    if configs.get('stopped') == 0:
        parse_robot_tiroseco_check(configs, msg, bet_type) 
    else:
        log('Robo em modo stop efetuado pelo administrador', colour='red')



def parse_robot_tiroseco_check(configs, msg, bet_type):     
    
     if configs.get('robo_tirosecovirtual') == 1:
        parse_robot_kabum_tirosecovirtual(configs, msg, bet_type)
     else:
        log('Robo Kabum Tiro Seco em modo stop efetuado pelo administrador', colour='red')



def parse_robot_kabum_tirosecovirtual(configs, msg, bet_type):

    message = msg
    msg = message.split("\n")            

    championship = msg[2][:-1]

    match1 = msg[6]
    match2 = msg[7]
    match3 = msg[8]
    match4 = msg[9]

    url = re.search("(?P<url>https?://[^\s]+)", message).group("url")
    matches = [championship, match1, match2, match3, match4]

    parse_robot_tirosecovirtual_continue(configs, matches, url, bet_type, message)



def parse_robot_tirosecovirtual_continue(configs, text, url, bet_type, message):

    log('Inicializando Bet TiroSecoVirtual - Esporte virtual')

    key = Db.add_url_master_tsv(message, text, url, bet_type, uid, configs.get("bet"), configs.get("bet_fifa"))  
    
    if configs.get('only_save') == 0:
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
    

    
