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
import threading
import moment

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

master = config['default']['master']


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
        Db.update_url(key, text)
    
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

   log('Inicializando bot')
   config = get_configs()

   async with TelegramClient('name', config.get("api_id"), config.get("api_hash")) as client:   

      def my_event_handler(event):

            msg = event.message
            
            for url_entity, inner_text in msg.get_entities_text(MessageEntityTextUrl):
                url = url_entity.url

            check_status(msg.message, url)
                          
                          

      @client.on(events.NewMessage(pattern='(?i).*Oportunidade! '))
      async def handler(event):
         my_event_handler(event)                  

      await client.run_until_disconnected()


###########################################################
# Browser Bot - No Headless
###########################################################


def check_status(msg, url):

    configs = get_configs()

    if configs.get('stopped') == 0:
        browser_bot(configs, msg, url)
    else:
        log('Robo em modo stop efetuado pelo administrador')


def browser_bot(configs, msg, url):   

    message = msg
    msg = message.split("\n\n")    
    msg_team = msg[2]
    msg_team_name = msg_team[2:].split(" x ")
    text = msg_team_name[0]
   
    text = text.replace("(A)", "")    
    text = text.replace("(H)", "")
    text = text.replace("(ao vivo)", "")
    text = text[1:]
    text = text.strip()

    key = ""
        
    if configs.get("master") == 1:
        key = Db.add_url_master(message, msg_team_name[0], url, text)     
    else:
        key = Db.add_url(message, msg_team_name[0], url, text)     
    

    bot_escanteio_asiatico(configs, key, text, url)

    
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
   
   if configs.get("master") == 1:
        Db.update_url_master(key, "Finalizado")
   else:
        Db.update_url(key, "Finalizado")
   

   time.sleep(configs.get("delay_end"))
   close_browser_tab()

   log('Finalizado com sucesso', key=key)



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
        now = now + datetime.timedelta(minutes=5)
                
        if today < now:

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

#main_sync()



###########################################################
# Async exec
###########################################################


async def main():

    log('Inicializando sistema')    
    await telegram_bot()


asyncio.run(main())

    
