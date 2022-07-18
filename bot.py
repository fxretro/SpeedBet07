from telethon.sync import TelegramClient, events
from telethon.tl.types import MessageEntityTextUrl

import database as Db
import asyncio
from widget import *
from PIL import ImageColor

api_id =  7948726 
api_hash = '0e6ac8c3f24c20a7f9bb7b5d6150bf68'
delay = 3
bet = 5
color = ImageColor.getcolor('#0000ff', "RGB")

print(color)

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

    #Db.add_url(msg.message, url) 
    text = 'cryptocurrency'

    print('Abrindo firefox')
    click_selected_text(delay, color, text, url)


async def test():
   browser_bot('msg', 'https://9gag.com/')




asyncio.run(test())
    