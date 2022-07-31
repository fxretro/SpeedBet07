from logging import exception
from telethon.sync import TelegramClient, events
from telethon.tl.types import MessageEntityTextUrl
from pyfiglet import  figlet_format
from PIL import ImageColor
from uteis.widget import *

import configparser
import datetime
import six
import asyncio
import uteis.database as Db

try:
    from termcolor import colored
except ImportError:
    colored = None
    

###########################################################
# Variáveis 
###########################################################



config = configparser.ConfigParser()
config.read('config.ini')

color = ImageColor.getcolor('#FF8800', "RGB")
uid = config['default']['uid']
file_logo = config['default']['file_logo']


###########################################################
# Auxiliares 
###########################################################

def get_configs():

    try:
        configs = Db.get_configurations(uid)[0]
        return configs

    except exception as e:
        log("Sua aplicação ainda não foi configurada!")
        exit(1)
    

def show_configs(config):

    log('App Id: '+ str(config.get("api_id")))
    log('App Hash: ' + str(config.get("api_hash")))
    log('Delay: '+ str(config.get("delay")))
    log('Delay Start: ' + str(config.get("delay_start")))
    log('Delay End: ' + str(config.get("delay_end")))
    log('Bet Value: ' + str(config.get("bet")))
    log('Move down bet: ' + str(config.get("move_down_bet")))
    log('Move right bet: ' + str(config.get("move_right_bet")))
    


def log(text, colour = 'green', font='slant', figlet=False, key='0'):

    if key != '0':
        Db.update_url_master(key, text)
    
    if colored:
        if not figlet:
            six.print_(colored('['+ datetime.datetime.now().strftime("%d.%b %Y %H:%M:%S") + '] - ' + text, colour))
        else:
            six.print_(colored(figlet_format(
                '['+ datetime.datetime.now().strftime("%d.%b %Y %H:%M:%S") + ']' + text, font=font), colour))
    else:
        six.print_('['+ datetime.datetime.now().strftime("%d.%b %Y %H:%M:%S") + ']' + text)


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

    key = Db.add_url_master(message, text, url, bet_type)
    bet_check(configs, key, text, url, bet_type)



###########################################################
# Browser Bot - Verifica o tipo de bet
###########################################################


def bet_check(configs, key, text, url, bet_type):

    log('Inicializando bet tipo ' + str(bet_type))

    if bet_type == 1:        
        bot_escanteio_asiatico(configs, key, text, url)
    else:
        log('Estratégia cartão vermelho em desenvolvimento', colour='red')


###########################################################
# Browser Bot - Escanteios asiáticos
###########################################################

def bot_escanteio_asiatico(configs, key, text, url):
      
   show_configs(configs)

   log('Iniciando escanteio asiático ' + text, key=key)
   start_browser(url)
   time.sleep(configs.get("delay_start"))

   try:
       x, y = pyautogui.locateCenterOnScreen(file_logo)
       print(x, y)
       pyautogui.click(x, y)

   except:
       print('Não conseguimos clicar no verde')


   log('Clicando em ' + text, key=key)   
   search_text("Futebol")   
   click_selected_text(color, text)
   
   log('Procurando Odds Asiaticas', key=key)
   time.sleep(configs.get("delay"))
   click_selected_text(color, 'Odds Asiaticas')
   

   log('Procurando Escanteios Asia', key=key)
   time.sleep(configs.get("delay"))
   click_selected_text(color, 'Escanteios Asiaticos')

   log('Movendo mouse', key=key)
   time.sleep(configs.get("delay"))
   x, y = get_position_mouse()
   yy = y + configs.get("move_down_bet")
   xx = x + configs.get("move_right_bet")
   scroll_down_mouse(xx, yy)
   time.sleep(configs.get("delay")) 
   
   log('Clicando na aposta', key=key)
   time.sleep(configs.get("delay")) 
   click_mouse(xx, yy)
   

   log('Informando valor da aposta R$' + str(configs.get("bet")), key=key) 
   click_selected_text(color, 'Valor de Aposta')
   write_text(str(configs.get("bet")))    
   
   x, y = get_position_mouse()
   click_mouse(x, y)
   click_mouse(x + configs.get("move_right_bet") + 100, y)
   
   Db.update_url_master(key, "Finalizado")

   time.sleep(configs.get("delay_end"))
   close_browser_tab()

   log('Finalizado com sucesso', key=key)



###########################################################
# Async exec
###########################################################


async def main():

    log('Inicializando sistema')    
    await telegram_bot()


asyncio.run(main())

    
