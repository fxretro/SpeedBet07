from telethon.sync import TelegramClient, events
from telethon.tl.types import MessageEntityTextUrl
from pyfiglet import  figlet_format
from PIL import ImageColor
from uteis.widget import *

import platform
import subprocess
import datetime
import six
import asyncio
import uteis.database as Db
import uteis.scrapper as scrapping



try:
    from termcolor import colored
except ImportError:
    colored = None
    

###########################################################
# Variáveis 
###########################################################


configs = Db.get_configurations()[0]

api_id =  configs.get('api_id') 
api_hash = configs.get('api_hash') 
delay = configs.get('delay') 
delay_start = configs.get('delay_start') 
delay_end = configs.get('delay_end') 
bet = configs.get('bet') 
move_down_bet = configs.get('move_down_bet') 
move_right_bet = configs.get('move_right_bet') 

color = ImageColor.getcolor('#FF8800', "RGB")



###########################################################
# Auxiliares 
###########################################################


def log(text, colour = 'green', font='slant', figlet=False):
    
    if colored:
        if not figlet:
            six.print_(colored('['+ datetime.datetime.now().strftime("%d.%b %Y %H:%M:%S") + '] - ' + text, colour))
        else:
            six.print_(colored(figlet_format(
                ['+ datetime.datetime.now().strftime("%d.%b %Y %H:%M:%S") + '] + text, font=font), colour))
    else:
        six.print_(['+ datetime.datetime.now().strftime("%d.%b %Y %H:%M:%S") + '] + text)


###########################################################
# Telegram 
###########################################################

async def telegram_bot():

   async with TelegramClient('name', api_id, api_hash) as client:   

      def my_event_handler(event):

            msg = event.message
            
            for url_entity, inner_text in msg.get_entities_text(MessageEntityTextUrl):
                url = url_entity.url

            browser_bot(msg.message, url)
                          
                          

      @client.on(events.NewMessage(pattern='(?i).*Oportunidade! '))
      async def handler(event):

         my_event_handler(event)         
         #await event.reply('Hey!')

      await client.run_until_disconnected()


###########################################################
# Browser Bot - No Headless
###########################################################

def browser_bot(msg, url):   

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
        
    key = Db.add_url(message, msg_team_name[0], url)     
    bot_escanteio_asiatico(key, text, url)

    
def bot_escanteio_asiatico(key, text, url):

   log('Iniciando escanteio asiático ' + text)
   start_browser(url)
   time.sleep(delay_start)

   log('Clicando em ' + text)   
   search_text("TEAMS")   
   click_selected_text(color, text)
   
   log('Procurando Odds Asiaticas')
   time.sleep(delay)   
   click_selected_text(color, 'Odds Asiaticas')
   

   log('Procurando Escanteios Asia')
   time.sleep(delay)       
   click_selected_text(color, 'Escanteios Asiaticos')


   log('Movendo mouse')
   time.sleep(delay)          
   x, y = get_position_mouse()
   yy = y + move_down_bet
   xx = x + move_right_bet    
   scroll_down_mouse(xx, yy)
   time.sleep(delay)        
   
   log('Clicando na aposta')
   time.sleep(delay)       
   click_mouse(xx, yy)
   

   log('Informando valor da aposta R$' + bet) 
   click_selected_text(color, 'Valor de Aposta')
   write_text(bet)    
   
   x, y = get_position_mouse()
   click_mouse(x, y)
   click_mouse(x + move_right_bet, y)

   time.sleep(1)
   Db.update_url(key)

   time.sleep(delay_end)
   close_browser_tab()

   log('Finalizado com sucesso')





    
###########################################################
# Scrapper Bot 
###########################################################

def scrapper_bot():   

    print('scrapper_bot')

    while True:

        log('Coletando informações...')

        time.sleep(10)
        rc = subprocess.Popen("scripts/refresh_scrapping.sh")
        rc.wait()

        log('Scrappe realizado com sucesso. Organizando informações...')

        time.sleep(10)
        result = scrapping.scraping_live_now("file:///tmp/bet/bet.html")

        print(result)
        
        log('Aguardando próxima sessão....')
        time.sleep(60)
        



###########################################################
# Tests
###########################################################

async def atest():
   #browser_bot('Oportunidade! 🚨📊 \n\nESCANTEIO 1° TEMPOO OLHAR O NUMERO DE ESCANTEIO E ENTRAR +1 ESCANTEIO ASIATICO, QUANDO A LINHA DESCER ENTRAR +0,5 ASIATICO \n\n⚽️ Dorados (H) x Princesa do Solimoes U19 (A) (ao vivo)', 'https://www.bet365.com/#/AX/K^Dorados')
   scrapper_bot()


def test():
   #browser_bot('Oportunidade! 🚨📊 \n\nESCANTEIO 1° TEMPOO OLHAR O NUMERO DE ESCANTEIO E ENTRAR +1 ESCANTEIO ASIATICO, QUANDO A LINHA DESCER ENTRAR +0,5 ASIATICO \n\n⚽️ Dorados (H) x Princesa do Solimoes U19 (A) (ao vivo)', 'https://www.bet365.com/#/AX/K^Dorados')
   scrapper_bot()
   #Db.add_configurations()


###########################################################
# To the Moon!
###########################################################


#asyncio.run(test())
asyncio.run(telegram_bot())

#test()


    
