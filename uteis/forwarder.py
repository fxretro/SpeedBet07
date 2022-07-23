from telethon.sync import TelegramClient, events


api_id =  7948726 
api_hash = '0e6ac8c3f24c20a7f9bb7b5d6150bf68'



###########################################################
# Telegram 
###########################################################

async def telegram_bot():

   async with TelegramClient('name', api_id, api_hash) as client:   

      def my_event_handler(event):

         msg = event.message
         print(msg.message)
                          

      @client.on(events.NewMessage(pattern='(?i).*Oportunidade! '))
      async def handler(event):

         my_event_handler(event)         
         #await event.reply('Hey!')

      await client.run_until_disconnected()
