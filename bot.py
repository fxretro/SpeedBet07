from telethon.sync import TelegramClient, events
from uteis.widget import *
from uteis.helper import *

import configparser
import asyncio
import uteis.database as Db
import random


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
    # Robo MEGABOLT Escanteioover
    ###########################################################

      @client.on(events.NewMessage(pattern='(?i).*MEGABOLT PRIMEIRO'))
      async def handler(event):
         my_event_handler(event, 1)  

      @client.on(events.NewMessage(pattern='(?i).*MEGABOLT SEGUNDO'))
      async def handler(event):
         my_event_handler(event, 1)          

      @client.on(events.NewMessage(pattern='(?i).*Alerta Estratégia: ESCANTEIOS'))
      async def handler(event):
         my_event_handler(event, 1)   

      @client.on(events.NewMessage(pattern='(?i).*SAIU CARTÃO VERMELHO'))
      async def handler(event):
         my_event_handler(event, 2)            
      
      @client.on(events.NewMessage(pattern='(?i).*GOL PRIMEIRO'))
      async def handler(event):
         my_event_handler(event, 2)

      @client.on(events.NewMessage(pattern='(?i).*GOL SEGUNDO'))
      async def handler(event):
         my_event_handler(event, 2)
    


    ###########################################################
    # Robo KabumTips TIROSECOVIRTUAL
    ###########################################################

      @client.on(events.NewMessage(pattern='(?i).*FUTEBOL VIRTUAL'))
      async def handler(event):
         my_event_handler(event, 11)         


    ###########################################################
    # Robo Bruno Jogador
    ###########################################################
    
      @client.on(events.NewMessage(pattern='(?i).*Mais de '))
      async def handler(event):
         my_event_handler(event, 22)


      await client.run_until_disconnected()




###########################################################
# Browser Bot - Verifica tipo de bet
###########################################################


def check_status(msg, bet_type):

    configs = get_configs(uid)

    if configs.get('stopped') == 0:
        parse_msg(configs, msg, bet_type)
    else:
        log('Robo em modo stop efetuado pelo administrador', colour='red')



def parse_msg(configs, msg, bet_type):   

    if bet_type == 1:
        log('Recebido Bet tipo escanteio asiático no MegaBolt')
        parse_robot_check(configs, msg, bet_type)

    elif bet_type == 2:
        log('Recebido Bet tipo Cartão vermelho no MegaBolt')
        parse_robot_check(configs, msg, bet_type)

    elif bet_type == 11:
        log('Recebido Bet tipo futebol virtual Kabum Tiro Seco')
        parse_robot_tiroseco_check(configs, msg, bet_type) 

    else:
        log('Esse robo ainda não foi configurado', colour='red')





###########################################################
# Parse MegaBolt
###########################################################


def parse_robot_check(configs, msg, bet_type):
    
     if configs.get('robo_megabolt') == 1:
        parse_robot_megabolt(configs, msg, bet_type)
     else:
        log('Robo em Megabolt em modo stop efetuado pelo administrador', colour='red')
    
            
def parse_robot_megabolt(configs, msg, bet_type):

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
    
    parse_robot_megabolt_continue(configs, text, url, bet_type, message)



def parse_robot_megabolt_continue(configs, text, url, bet_type, message):

    log('Inicializando MegaBolt. Tipo: ' + str(bet_type))

    if bet_type == 1:      
        key = Db.add_url_master(message, text, url, bet_type, uid, configs.get("bet"))  

        if configs.get('only_save') == 0:
            bot_escanteio_asiatico(config, configs, url, key)

    else:
        key = Db.add_oportunity(message, text, url, uid)
        log('Adicionada a oportunidade '+ key)


    



###########################################################
# Parse Tiro Seco Virtual
###########################################################


def parse_robot_tiroseco_check(configs, msg, bet_type):
    
     if configs.get('robo_tirosecovirtual') == 1:
        parse_robot_kabum_tirosecovirtual(configs, msg, bet_type)
     else:
        log('Robo Kabum Tiro Seco em modo stop efetuado pelo administrador', colour='red')


def parse_robot_kabum_tirosecovirtual(configs, msg, bet_type):

    message = msg
    msg = message.split("\n")            

    championship = msg[2]

    match1 = msg[6]
    match2 = msg[7]
    match3 = msg[8]
    match4 = msg[9]

    url = msg[len(msg)-1]
    matches = [championship, match1, match2, match3, match4]

    parse_robot_tirosecovirtual_continue(configs, matches, url, bet_type, message)



def parse_robot_tirosecovirtual_continue(configs, text, url, bet_type, message):

    log('Inicializando Bet TiroSecoVirtual - Esporte virtual')

    key = Db.add_url_master_tsv(message, text, url, bet_type, uid, configs.get("bet"), configs.get("bet_fifa"))  
    
    if configs.get('only_save') == 0:
        bot_futebol_virtual_ambos(config, configs, text, url, key)        




###########################################################
# Modo cliente - Executa direto do banco de dados
###########################################################


def refresh_bets():

    log('Inicializando verificação')

    bets = Db.get_urls()            
    my_matches = Db.get_urls_match()      
    today = datetime.datetime.now() 
    

    try:        

        for bet in bets:

            uid_match = bet.get("uid")            

            if uid_match is not uid:

                datetime_match = bet.get("datetime")

                match = bet.get("link")            
                msg = bet.get("msg")    
                bet_type = bet.get("bet_type")
                
                now = datetime.datetime.strptime(datetime_match, '%d/%m/%Y %H:%M:%S')            
                now = now + datetime.timedelta(seconds=int(timer_check))            
                        
                if now > today:

                    if not match in my_matches:     

                        my_matches.append(match)                 
                        check_status(msg, bet_type)
                        Db.add_match(datetime_match, match, bet_type, uid)
                
        log('Verificação finalizada. Aguardando...')


    except exception as e:
        log('Não foi possível verificar. Aguardando...', colour='red')
        pass


###########################################################
# Modo cliente - Executa direto do banco de dados
###########################################################


def main_sync():

    log('Inicializando sistema modo database')               
    # setInterval(refresh_bets, int(timerr))
    


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
#main_sync()    
    

    
