from telethon.sync import TelegramClient, events
from telethon.tl.types import MessageEntityTextUrl

import database as Db
import asyncio
from widget import *
from PIL import ImageColor
import re

api_id =  7948726 
api_hash = '0e6ac8c3f24c20a7f9bb7b5d6150bf68'
delay = 0.5
delay_start = 5
bet = '5'
move_down_bet = 80
move_right_bet = 350

color = ImageColor.getcolor('#0000ff', "RGB")

async def telegram_bot():

   async with TelegramClient('name', api_id, api_hash) as client:   

      def my_event_handler(event):

         msg = event.message
         for url_entity, inner_text in msg.get_entities_text(MessageEntityTextUrl):
               url = url_entity.url

               browser_bot(msg, url)
                          


      @client.on(events.NewMessage(pattern='(?i).*Oportunidade! '))
      async def handler(event):

         my_event_handler(event)

         await event.reply('Hey!')

      await client.run_until_disconnected()



def browser_bot(msg, url):   

    
    message = msg.message
    msg = message.split("\n\n")    
    msg_team = msg[2]
    msg_team_name = msg_team[2:].split(" x ")
    text = msg_team_name[0]
   
    text = text.strip("(A)")    
    text = text.strip("(H)")
    text = text.strip("(ao vivo)")
     
    key = Db.add_url(message, msg_team_name[0], url)     
    bot_escanteio_asiatico(key, text, url)

    
def bot_escanteio_asiatico(key, text, url):

   print('Iniciando escanteio asiático', text)
   start_browser(url)
   time.sleep(delay_start)

   click_selected_text(color, text)

   time.sleep(delay)
   click_selected_text(color, 'Escanteios/Cart')

   time.sleep(delay)    
   click_selected_text(color, 'Escanteios Asia')

   time.sleep(delay)        
   x, y = get_position_mouse()
   yy = y + move_down_bet
   xx = x + move_right_bet    

   scroll_down_mouse(xx, yy)
   click_mouse(xx, yy)

   time.sleep(delay)        
   click_selected_text(color, 'Valor de Aposta')
   write_text(bet)    

   x, y = get_position_mouse()
   click_mouse(x, y)

   click_mouse(x + move_right_bet, y)


   time.sleep(1)
   Db.update_url(key)
   close_browser_tab()
   print('Finalizado')

    



async def test():
   browser_bot('msg', 'https://www.bet365.com/#/IP/B1')




#asyncio.run(test())
asyncio.run(telegram_bot())

    